import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';

const customerSchema = z.object({
  name: z.string().min(2, 'Tên khách hàng phải có ít nhất 2 ký tự').max(100, 'Tên khách hàng quá dài'),
  phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số').max(15, 'Số điện thoại quá dài').regex(/^[0-9+()-\s]+$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự').max(300, 'Địa chỉ quá dài'),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  const handleFormSubmit = async (data: CustomerFormData) => {
    try {
      // Parse tags from comma-separated string
      const tagsArray = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      const customerData = {
        name: data.name,
        phone: data.phone,
        email: data.email || '',
        address: data.address,
        tags: tagsArray,
        notes: data.notes || '',
        totalSpent: 0,
        lastPurchase: null,
        createdAt: Timestamp.now(),
      };

      await onSubmit(customerData);
      toast.success('Thêm khách hàng thành công!');
      reset();
      onClose();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl border border-border-color w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-color sticky top-0 bg-surface z-10">
          <h2 className="text-white text-xl font-bold">Thêm Khách Hàng Mới</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
          {/* Customer Name */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Tên khách hàng <span className="text-red-400">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="VD: Lê Minh Anh"
              className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Phone & Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Số điện thoại <span className="text-red-400">*</span>
              </label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="0987654321"
                className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="minhanh@email.com"
                className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Địa chỉ <span className="text-red-400">*</span>
            </label>
            <textarea
              {...register('address')}
              rows={3}
              placeholder="VD: 123 Đường ABC, Q1, HCM"
              className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
            />
            {errors.address && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Phân loại (Tags)
            </label>
            <input
              {...register('tags')}
              type="text"
              placeholder="VD: Đại lý, Khách quen (ngăn cách bằng dấu phẩy)"
              className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            <p className="text-text-muted text-xs mt-1">
              💡 Tip: Nhập các tag cách nhau bằng dấu phẩy (VD: Đại lý, Khách quen, VIP)
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Ghi chú
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Ghi chú về khách hàng..."
              className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border-color">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="flex-1 px-4 py-3 bg-surface-light hover:bg-surface text-white rounded-lg font-medium transition-colors"
              disabled={isSubmitting}
            >
              Hủy
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
                  <span className="material-symbols-outlined text-xl">person_add</span>
                  Thêm Khách Hàng
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
