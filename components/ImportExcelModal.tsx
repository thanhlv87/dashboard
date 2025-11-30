import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';
import { TeachingSchedule } from '../lib/firebase/types';
import { useAuth } from '../contexts/AuthContext';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (schedules: Omit<TeachingSchedule, 'id'>[]) => Promise<void>;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({ isOpen, onClose, onImport }) => {
  const { currentUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  // Helper to find value with fuzzy key matching
  const getValue = (row: any, keys: string[]): any => {
    const rowKeys = Object.keys(row);
    for (const key of keys) {
      // Exact match
      if (row[key] !== undefined) return row[key];

      // Case-insensitive and trimmed match
      const foundKey = rowKeys.find(k =>
        k.trim().toLowerCase() === key.toLowerCase()
      );
      if (foundKey && row[foundKey] !== undefined) return row[foundKey];
    }
    return undefined;
  };

  // Download template Excel file
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Ngày giảng (dd/mm/yyyy)': '15/03/2024',
        'Giờ bắt đầu (HH:mm)': '08:00',
        'Giờ kết thúc (HH:mm)': '11:30',
        'Địa điểm': 'Phòng A101',
        'Đối tác thuê': 'VNEdu',
        'Công ty': 'Công ty ABC',
        'Loại học viên': 'Cán bộ',
        'Số học viên': 25,
        'Học phí (VNĐ)': 5000000,
        'Ngày thanh toán (dd/mm/yyyy)': '20/03/2024',
        'Trạng thái': 'Đã giảng',
        'Ghi chú': 'Buổi đào tạo An toàn lao động',
      },
      {
        'Ngày giảng (dd/mm/yyyy)': '20/03/2024',
        'Giờ bắt đầu (HH:mm)': '13:00',
        'Giờ kết thúc (HH:mm)': '16:30',
        'Địa điểm': 'Hội trường B',
        'Đối tác thuê': 'AT Green',
        'Công ty': 'Công ty XYZ',
        'Loại học viên': 'Công nhân',
        'Số học viên': 40,
        'Học phí (VNĐ)': 8000000,
        'Ngày thanh toán (dd/mm/yyyy)': '',
        'Trạng thái': 'Chưa giảng',
        'Ghi chú': '',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lịch giảng');

    // Set column widths
    ws['!cols'] = [
      { wch: 22 }, // Ngày giảng
      { wch: 18 }, // Giờ bắt đầu
      { wch: 18 }, // Giờ kết thúc
      { wch: 20 }, // Địa điểm
      { wch: 20 }, // Đối tác
      { wch: 20 }, // Công ty
      { wch: 15 }, // Loại học viên
      { wch: 12 }, // Số học viên
      { wch: 15 }, // Học phí
      { wch: 22 }, // Ngày thanh toán
      { wch: 15 }, // Trạng thái
      { wch: 30 }, // Ghi chú
    ];

    XLSX.writeFile(wb, 'Mau_Lich_Giang.xlsx');
    toast.success('Đã tải file mẫu!');
  };

  // Parse date from various formats
  const parseDate = (dateValue: any): Date | null => {
    if (!dateValue) return null;

    // If already a Date object (from cellDates: true)
    if (dateValue instanceof Date) {
      // Check if valid date
      if (isNaN(dateValue.getTime())) return null;
      // Adjust for timezone offset if needed, but usually xlsx handles local time reasonably well
      // or returns UTC. For simplicity, we assume it's correct date.
      return dateValue;
    }

    // If string
    if (typeof dateValue === 'string') {
      const dateStr = dateValue.trim();
      if (dateStr === '') return null;

      // Try dd/mm/yyyy
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) return date;
      }

      // Try standard parsing
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) return date;
    }

    // If number (Excel serial date, though cellDates: true should avoid this)
    if (typeof dateValue === 'number') {
      // Excel serial date to JS Date
      // (serial - 25569) * 86400 * 1000
      const date = new Date((dateValue - 25569) * 86400 * 1000);
      if (!isNaN(date.getTime())) return date;
    }

    return null;
  };

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      toast.error('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
      return;
    }

    setFile(selectedFile);

    // Read and preview file
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { cellDates: true, defval: '' });

        setPreviewData(jsonData.slice(0, 5)); // Show first 5 rows
        toast.success(`Đã tải ${jsonData.length} dòng dữ liệu`);
      } catch (error) {
        toast.error('Lỗi đọc file Excel');
        console.error(error);
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  // Import data
  const handleImport = async () => {
    if (!file) {
      toast.error('Vui lòng chọn file Excel');
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const data = evt.target?.result;
          const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { cellDates: true, defval: '' });

          // Convert Excel data to TeachingSchedule format
          const schedules: Omit<TeachingSchedule, 'id'>[] = [];
          const errors: string[] = [];

          jsonData.forEach((row, index) => {
            try {
              const dateStr = getValue(row, ['Ngày giảng (dd/mm/yyyy)', 'Ngày giảng', 'Date']);
              let date = parseDate(dateStr);

              // If date is invalid, default to today and add a note
              let dateNote = '';
              if (!date) {
                date = new Date();
                dateNote = ` (Ngày gốc lỗi: ${dateStr || 'Trống'})`;
              }

              const paymentDateStr = getValue(row, ['Ngày thanh toán (dd/mm/yyyy)', 'Ngày thanh toán', 'Payment Date']);
              const paymentDate = paymentDateStr ? parseDate(paymentDateStr) : null;

              const partnerName = getValue(row, ['Đối tác thuê', 'Đối tác', 'Partner']) || '';
              const notes = getValue(row, ['Ghi chú', 'Notes']) || '';

              const schedule: Omit<TeachingSchedule, 'id'> = {
                date: Timestamp.fromDate(date),
                startTime: getValue(row, ['Giờ bắt đầu (HH:mm)', 'Giờ bắt đầu', 'Start Time']) || '',
                endTime: getValue(row, ['Giờ kết thúc (HH:mm)', 'Giờ kết thúc', 'End Time']) || '',
                location: getValue(row, ['Địa điểm', 'Location']) || '',
                partner: partnerName.trim(), // Ensure trimmed for matching
                company: getValue(row, ['Công ty', 'Company']) || '',
                studentType: getValue(row, ['Loại học viên', 'Student Type']) || 'Khác',
                studentCount: parseInt(getValue(row, ['Số học viên', 'Student Count'])) || 0,
                fee: parseFloat(getValue(row, ['Học phí (VNĐ)', 'Học phí', 'Fee'])) || 0,
                paymentDate: paymentDate ? Timestamp.fromDate(paymentDate) : undefined,
                status: (getValue(row, ['Trạng thái', 'Status']) as any) || 'Chưa giảng',
                notes: (notes + dateNote).trim(),
                createdBy: currentUser?.uid || '',
                createdAt: Timestamp.now(),
              };

              // Validate status
              const validStatuses = ['Đã giảng', 'Chưa giảng', 'Đang xếp', 'Hủy'];
              if (!validStatuses.includes(schedule.status)) {
                schedule.status = 'Chưa giảng';
              }

              schedules.push(schedule);
            } catch (err) {
              console.error(`Error parsing row ${index}:`, err);
              // Don't fail the whole import, just log
            }
          });

          if (errors.length > 0) {
            toast.error(`Có ${errors.length} dòng lỗi. Kiểm tra console.`);
            console.error('Import errors:', errors);
          }

          if (schedules.length > 0) {
            await onImport(schedules);
            toast.success(`Đã import thành công ${schedules.length} lịch giảng!`);
            setFile(null);
            setPreviewData([]);
            onClose();
          } else {
            toast.error('Không có dữ liệu hợp lệ để import');
          }
        } catch (error: any) {
          toast.error('Lỗi import dữ liệu: ' + error.message);
          console.error(error);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsBinaryString(file);
    } catch (error: any) {
      toast.error('Lỗi đọc file: ' + error.message);
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl border border-border-color w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-color sticky top-0 bg-surface z-10">
          <h2 className="text-white text-xl font-bold">Import Dữ Liệu Từ Excel</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Download Template */}
          <div className="bg-surface-light border border-border-color rounded-lg p-4">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">description</span>
              <div className="flex-1">
                <h3 className="text-white font-medium mb-2">Bước 1: Tải file mẫu</h3>
                <p className="text-text-muted text-sm mb-3">
                  Tải file Excel mẫu, điền dữ liệu theo cột đã có, sau đó upload lại.
                </p>
                <button
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2 bg-primary hover:bg-opacity-90 text-background-dark rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Tải file mẫu Excel
                </button>
              </div>
            </div>
          </div>

          {/* Upload File */}
          <div className="bg-surface-light border border-border-color rounded-lg p-4">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
              <div className="flex-1">
                <h3 className="text-white font-medium mb-2">Bước 2: Chọn file Excel</h3>
                <p className="text-text-muted text-sm mb-3">
                  Chọn file Excel (.xlsx hoặc .xls) đã điền dữ liệu
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-background-dark hover:file:bg-opacity-90 file:cursor-pointer"
                />
                {file && (
                  <p className="text-primary text-sm mt-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    {file.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Preview */}
          {previewData.length > 0 && (
            <div className="bg-surface-light border border-border-color rounded-lg p-4">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined">visibility</span>
                Xem trước dữ liệu (5 dòng đầu)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-color">
                      <th className="text-left text-text-muted p-2">Ngày</th>
                      <th className="text-left text-text-muted p-2">Giờ</th>
                      <th className="text-left text-text-muted p-2">Đối tác</th>
                      <th className="text-left text-text-muted p-2">Công ty</th>
                      <th className="text-right text-text-muted p-2">Học phí</th>
                      <th className="text-left text-text-muted p-2">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr key={i} className="border-b border-border-color/50">
                        <td className="text-white p-2">{getValue(row, ['Ngày giảng (dd/mm/yyyy)', 'Ngày giảng', 'Date'])}</td>
                        <td className="text-white p-2">
                          {getValue(row, ['Giờ bắt đầu (HH:mm)', 'Giờ bắt đầu'])} - {getValue(row, ['Giờ kết thúc (HH:mm)', 'Giờ kết thúc'])}
                        </td>
                        <td className="text-white p-2">{getValue(row, ['Đối tác thuê', 'Đối tác', 'Partner'])}</td>
                        <td className="text-white p-2">{getValue(row, ['Công ty', 'Company'])}</td>
                        <td className="text-white p-2 text-right">
                          {parseInt(getValue(row, ['Học phí (VNĐ)', 'Học phí', 'Fee']) || '0').toLocaleString('vi-VN')} ₫
                        </td>
                        <td className="text-white p-2">{getValue(row, ['Trạng thái', 'Status'])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Important Notes */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h3 className="text-yellow-400 font-medium mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">info</span>
              Lưu ý quan trọng
            </h3>
            <ul className="text-yellow-200 text-sm space-y-1 list-disc list-inside">
              <li>Định dạng ngày: dd/mm/yyyy (ví dụ: 15/03/2024)</li>
              <li>Định dạng giờ: HH:mm (ví dụ: 08:00, 13:30)</li>
              <li>Trạng thái hợp lệ: Đã giảng, Chưa giảng, Đang xếp, Hủy</li>
              <li>Loại học viên: Cán bộ, Công nhân, Quản lý, Chuyên viên, Khác</li>
              <li>Đối tác mới sẽ được tự động tạo nếu chưa tồn tại</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-6 border-t border-border-color">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-surface-light hover:bg-surface text-white rounded-lg font-medium transition-colors"
            disabled={isUploading}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!file || isUploading}
            className="flex-1 px-4 py-3 bg-primary hover:bg-opacity-90 text-background-dark rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <span className="material-symbols-outlined text-xl animate-spin">refresh</span>
                Đang import...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl">cloud_upload</span>
                Import dữ liệu
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
