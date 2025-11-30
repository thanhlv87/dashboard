import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Timestamp, orderBy } from 'firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';
import { Partner, TeachingSchedule } from '../lib/firebase/types';

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

interface EditScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: TeachingSchedule | null;
  onUpdate: (id: string, data: Partial<TeachingSchedule>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onUpdate,
  onDelete,
}) => {
  const { currentUser } = useAuth();
  const { data: partners, loading: partnersLoading, add: addPartner } = useFirestore<Partner>('partners', [orderBy('name', 'asc')]);

  const [isAddingNewPartner, setIsAddingNewPartner] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerContact, setNewPartnerContact] = useState('');
  const [newPartnerPhone, setNewPartnerPhone] = useState('');
  const [newPartnerEmail, setNewPartnerEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
  });

  const handleAddNewPartner = async () => {
    if (!newPartnerName.trim()) {
      toast.error('Vui lòng nhập tên đối tác');
      return;
    }
    if (!newPartnerContact.trim()) {
      toast.error('Vui lòng nhập người liên hệ');
      return;
    }
    if (!newPartnerPhone.trim()) {
      toast.error('Vui lòng nhập số điện thoại');
      return;
    }
    if (!newPartnerEmail.trim()) {
      toast.error('Vui lòng nhập email');
      return;
    }

    try {
      const partnerData = {
        name: newPartnerName.trim(),
        contactPerson: newPartnerContact.trim(),
        phone: newPartnerPhone.trim(),
        email: newPartnerEmail.trim(),
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
      setNewPartnerPhone('');
      setNewPartnerEmail('');
      setIsAddingNewPartner(false);
    } catch (error: any) {
      toast.error('Lỗi khi thêm đối tác: ' + error.message);
    }
  };

  // Load schedule data when modal opens
  useEffect(() => {
    if (schedule) {
      const scheduleDate = schedule.date.toDate();
      const paymentDate = schedule.paymentDate?.toDate();

      reset({
        date: scheduleDate.toISOString().split('T')[0],
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        location: schedule.location,
        partner: schedule.partner,
        company: schedule.company,
        studentType: schedule.studentType,
        studentCount: schedule.studentCount,
        fee: schedule.fee,
        paymentDate: paymentDate ? paymentDate.toISOString().split('T')[0] : '',
        status: schedule.status,
        notes: schedule.notes || '',
      });
    }
  }, [schedule, reset]);

  const studentTypes = ['Cán bộ', 'Công nhân', 'Quản lý', 'Chuyên viên', 'Khác'];
  const statuses = ['Chưa giảng', 'Đã giảng', 'Đang xếp', 'Hủy'];

  const onSubmitForm = async (data: ScheduleFormData) => {
    if (!schedule) return;

    try {
      const updatedData = {
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
        updatedAt: Timestamp.now(),
      };

      await onUpdate(schedule.id, updatedData);
      toast.success('Cập nhật lịch giảng thành công!');
      onClose();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!schedule) return;

    if (confirm('Bạn có chắc chắn muốn xóa lịch giảng này?')) {
      try {
        await onDelete(schedule.id);
        toast.success('Đã xóa lịch giảng!');
        onClose();
      } catch (error: any) {
        toast.error('Lỗi: ' + error.message);
      }
    }
  };

  if (!isOpen || !schedule) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl border border-border-color w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-color sticky top-0 bg-surface z-10">
          <h2 className="text-white text-xl font-bold">Chi Tiết & Chỉnh Sửa Lịch Giảng</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-5">
          {/* Date & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Ngày giảng <span className="text-red-400">*</span>
              </label>
              <input
                {...register('date')}
                type="date"
                className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.date && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Giờ bắt đầu <span className="text-red-400">*</span>
              </label>
              <input
                {...register('startTime')}
                type="time"
                placeholder="08:00"
                className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.startTime && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.startTime.message}
                </p>
              )}
            </div>

            {/* End Time */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Giờ kết thúc <span className="text-red-400">*</span>
              </label>
              <input
                {...register('endTime')}
                type="time"
                placeholder="11:30"
                className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.endTime && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Địa điểm <span className="text-red-400">*</span>
            </label>
            <input
              {...register('location')}
              type="text"
              placeholder="VD: Phòng A101, Tầng 5"
              className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            {errors.location && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Partner & Company Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Partner */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-white text-sm font-medium">
                  Đối tác thuê <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingNewPartner(!isAddingNewPartner)}
                  className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">
                    {isAddingNewPartner ? 'close' : 'add'}
                  </span>
                  {isAddingNewPartner ? 'Đóng' : 'Thêm mới'}
                </button>
              </div>

              {!isAddingNewPartner ? (
                <>
                  <select
                    {...register('partner')}
                    className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                    disabled={partnersLoading}
                  >
                    <option value="">-- Chọn đối tác --</option>
                    {partners.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                  {partnersLoading && (
                    <p className="text-text-muted text-sm mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                      Đang tải danh sách đối tác...
                    </p>
                  )}
                  {errors.partner && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.partner.message}
                    </p>
                  )}
                </>
              ) : (
                <div className="space-y-3 p-4 bg-surface-light border border-border-color rounded-lg">
                  <input
                    type="text"
                    placeholder="Tên đối tác *"
                    value={newPartnerName}
                    onChange={(e) => setNewPartnerName(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Người liên hệ *"
                    value={newPartnerContact}
                    onChange={(e) => setNewPartnerContact(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại *"
                    value={newPartnerPhone}
                    onChange={(e) => setNewPartnerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={newPartnerEmail}
                    onChange={(e) => setNewPartnerEmail(e.target.value)}
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
              <label className="block text-white text-sm font-medium mb-2">
                Công ty <span className="text-red-400">*</span>
              </label>
              <input
                {...register('company')}
                type="text"
                placeholder="VD: Công ty ABC"
                className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.company && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
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
              <label className="block text-white text-sm font-medium mb-2">
                Loại học viên <span className="text-red-400">*</span>
              </label>
              <select
                {...register('studentType')}
                className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">-- Chọn loại học viên --</option>
                {studentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.studentType && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.studentType.message}
                </p>
              )}
            </div>

            {/* Student Count */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Số lượng học viên <span className="text-red-400">*</span>
              </label>
              <input
                {...register('studentCount', { valueAsNumber: true })}
                type="number"
                placeholder="25"
                className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.studentCount && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
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
              <label className="block text-white text-sm font-medium mb-2">
                Học phí (VNĐ) <span className="text-red-400">*</span>
              </label>
              <input
                {...register('fee', { valueAsNumber: true })}
                type="number"
                step="100000"
                placeholder="5000000"
                className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.fee && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.fee.message}
                </p>
              )}
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Ngày thanh toán
              </label>
              <input
                {...register('paymentDate')}
                type="date"
                className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Trạng thái <span className="text-red-400">*</span>
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {errors.status && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Ghi chú
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Ghi chú về buổi giảng..."
              className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border-color">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors flex items-center gap-2"
              disabled={isSubmitting}
            >
              <span className="material-symbols-outlined text-xl">delete</span>
              Xóa
            </button>
            <div className="flex-1 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-surface-light hover:bg-surface text-white rounded-lg font-medium transition-colors"
                disabled={isSubmitting}
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-primary hover:bg-opacity-90 text-background-dark rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-xl animate-spin">refresh</span>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">save</span>
                    Lưu Thay Đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
