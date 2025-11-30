import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Timestamp, orderBy } from 'firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';
import { Partner } from '../lib/firebase/types';

const scheduleSchema = z.object({
  date: z.string().min(1, 'Vui lòng chọn ngày giảng'),
  startTime: z.string().min(1, 'Vui lòng nhập giờ bắt đầu'),
  endTime: z.string().min(1, 'Vui lòng nhập giờ kết thúc'),
  location: z.string().min(3, 'Địa điểm phải có ít nhất 3 ký tự'),
  partner: z.string().min(2, 'Tên đối tác phải có ít nhất 2 ký tự'),
  company: z.string().min(2, 'Tên công ty phải có ít nhất 2 ký tự'),
  studentType: z.string().min(1, 'Vui lòng chọn loại học viên'),
  studentCount: z.number().int('Số lượng phải là số nguyên').min(1, 'Phải có ít nhất 1 học viên'),
  fee: z.number().min(0, 'Học phí phải lớn hơn hoặc bằng 0'),
  paymentDate: z.string().optional(),
  status: z.string().min(1, 'Vui lòng chọn trạng thái'),
  notes: z.string().optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { currentUser } = useAuth();
  const { data: partners, loading: partnersLoading, add: addPartner } = useFirestore<Partner>('partners', [orderBy('name', 'asc')]);

  const [isAddingNewPartner, setIsAddingNewPartner] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerContact, setNewPartnerContact] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      status: 'Chưa giảng',
      studentCount: 0,
      fee: 0,
    },
  });

  const studentTypes = ['Cán bộ', 'Công nhân', 'Quản lý', 'Chuyên viên', 'Khác'];
  const statuses = ['Chưa giảng', 'Đã giảng', 'Đang xếp', 'Hủy'];

  const handleAddNewPartner = async () => {
    if (!newPartnerName.trim()) {
      toast.error('Vui lòng nhập tên đối tác');
      return;
    }

    try {
      const partnerData = {
        name: newPartnerName.trim(),
        contactPerson: newPartnerContact.trim(),
        totalClasses: 0,
        createdAt: Timestamp.now(),
      };

      await addPartner(partnerData);
      toast.success(`Đã thêm đối tác "${newPartnerName}"`);

      // Set the new partner as selected
      setValue('partner', newPartnerName.trim());

      // Reset form
      setNewPartnerName('');
      setNewPartnerContact('');
      setIsAddingNewPartner(false);
    } catch (error: any) {
      toast.error('Lỗi khi thêm đối tác: ' + error.message);
    }
  };

  const onSubmitForm = async (data: ScheduleFormData) => {
    try {
      const scheduleData = {
        date: Timestamp.fromDate(new Date(data.date)),
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        partner: data.partner,
        company: data.company,
        studentType: data.studentType,
        studentCount: data.studentCount,
        fee: data.fee,
        paymentDate: data.paymentDate ? Timestamp.fromDate(new Date(data.paymentDate)) : null,
        status: data.status,
        notes: data.notes || '',
        createdBy: currentUser?.uid || '',
        createdAt: Timestamp.now(),
      };

      await onSubmit(scheduleData);
      toast.success('Thêm lịch giảng thành công!');
      reset();
      onClose();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-surface rounded-xl border border-border-color w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border-color sticky top-0 bg-surface z-10">
          <h2 className="text-white text-lg sm:text-xl font-bold">Thêm Lịch Giảng Mới</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors -mr-2 sm:mr-0"
            type="button"
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Date & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Ngày giảng <span className="text-red-400">*</span>
              </label>
              <input
                {...register('date')}
                type="date"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-light border border-border-color rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.date && (
                <p className="text-red-400 text-xs sm:text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Giờ bắt đầu <span className="text-red-400">*</span>
              </label>
              <input
                {...register('startTime')}
                type="time"
                placeholder="08:00"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-light border border-border-color rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.startTime && (
                <p className="text-red-400 text-xs sm:text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.startTime.message}
                </p>
              )}
            </div>

            {/* End Time */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Giờ kết thúc <span className="text-red-400">*</span>
              </label>
              <input
                {...register('endTime')}
                type="time"
                placeholder="11:30"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-light border border-border-color rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.endTime && (
                <p className="text-red-400 text-xs sm:text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
              Địa điểm <span className="text-red-400">*</span>
            </label>
            <input
              {...register('location')}
              type="text"
              placeholder="VD: Phòng A101, Tầng 5"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-light border border-border-color rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            {errors.location && (
              <p className="text-red-400 text-xs sm:text-sm mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Partner & Company Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Partner */}
            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <label className="block text-white text-xs sm:text-sm font-medium">
                  Đối tác thuê <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingNewPartner(!isAddingNewPartner)}
                  className="text-primary text-xs sm:text-sm font-medium hover:underline flex items-center gap-0.5 sm:gap-1"
                >
                  <span className="material-symbols-outlined text-base sm:text-sm">
                    {isAddingNewPartner ? 'close' : 'add'}
                  </span>
                  <span className="hidden sm:inline">{isAddingNewPartner ? 'Đóng' : 'Thêm mới'}</span>
                </button>
              </div>

              {!isAddingNewPartner ? (
                <>
                  <select
                    {...register('partner')}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-light border border-border-color rounded-lg text-white text-sm focus:outline-none focus:border-primary transition-colors"
                    disabled={partnersLoading}
                  >
                    <option value="">-- Chọn đối tác --</option>
                    {partners.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                  {partnersLoading && (
                    <p className="text-text-muted text-xs sm:text-sm mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                      Đang tải danh sách đối tác...
                    </p>
                  )}
                  {errors.partner && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.partner.message}
                    </p>
                  )}
                </>
              ) : (
                <div className="space-y-2.5 sm:space-y-3 p-3 sm:p-4 bg-surface-light border border-border-color rounded-lg">
                  <input
                    type="text"
                    placeholder="Tên đối tác *"
                    value={newPartnerName}
                    onChange={(e) => setNewPartnerName(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Người liên hệ (không bắt buộc)"
                    value={newPartnerContact}
                    onChange={(e) => setNewPartnerContact(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewPartner}
                    className="w-full px-3 py-2 bg-primary hover:bg-opacity-90 text-background-dark rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">check</span>
                    Lưu đối tác mới
                  </button>
                </div>
              )}
            </div>

            {/* Company */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Công ty <span className="text-red-400">*</span>
              </label>
              <input
                {...register('company')}
                type="text"
                placeholder="VD: Công ty ABC"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-light border border-border-color rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.company && (
                <p className="text-red-400 text-xs sm:text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.company.message}
                </p>
              )}
            </div>
          </div>

          {/* Student Type & Count Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Type */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Loại học viên <span className="text-red-400">*</span>
              </label>
              <select
                {...register('studentType')}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-light border border-border-color rounded-lg text-white text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">-- Chọn loại học viên --</option>
                {studentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.studentType && (
                <p className="text-red-400 text-xs sm:text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.studentType.message}
                </p>
              )}
            </div>

            {/* Student Count */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Số lượng học viên <span className="text-red-400">*</span>
              </label>
              <input
                {...register('studentCount', { valueAsNumber: true })}
                type="number"
                placeholder="25"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-light border border-border-color rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.studentCount && (
                <p className="text-red-400 text-xs sm:text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.studentCount.message}
                </p>
              )}
            </div>
          </div>

          {/* Fee, Payment Date, Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fee */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Học phí (VNĐ) <span className="text-red-400">*</span>
              </label>
              <input
                {...register('fee', { valueAsNumber: true })}
                type="number"
                step="100000"
                placeholder="5000000"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-light border border-border-color rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.fee && (
                <p className="text-red-400 text-xs sm:text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.fee.message}
                </p>
              )}
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Ngày thanh toán
              </label>
              <input
                {...register('paymentDate')}
                type="date"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-light border border-border-color rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Trạng thái <span className="text-red-400">*</span>
              </label>
              <select
                {...register('status')}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-light border border-border-color rounded-lg text-white text-sm focus:outline-none focus:border-primary transition-colors"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {errors.status && (
                <p className="text-red-400 text-xs sm:text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
              Ghi chú
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Ghi chú về buổi giảng..."
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-light border border-border-color rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border-color">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-light hover:bg-surface text-white rounded-lg font-medium text-sm sm:text-base transition-colors"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-primary hover:bg-opacity-90 text-background-dark rounded-lg font-bold text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-lg sm:text-xl animate-spin">refresh</span>
                  <span className="hidden sm:inline">Đang lưu...</span>
                  <span className="sm:hidden">Lưu...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg sm:text-xl">event</span>
                  <span className="hidden sm:inline">Thêm Lịch Giảng</span>
                  <span className="sm:hidden">Thêm</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
