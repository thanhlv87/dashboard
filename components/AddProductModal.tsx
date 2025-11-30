import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';

const productSchema = z.object({
  name: z.string().min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự').max(200, 'Tên sản phẩm quá dài'),
  sku: z.string().min(2, 'Mã SKU phải có ít nhất 2 ký tự').max(50, 'Mã SKU quá dài'),
  price: z.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
  stock: z.number().int('Tồn kho phải là số nguyên').min(0, 'Tồn kho phải lớn hơn hoặc bằng 0'),
  expiryDate: z.string().optional(),
  imageUrl: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      stock: 0,
      price: 0,
    }
  });

  const stock = watch('stock');

  // Auto-determine status based on stock
  React.useEffect(() => {
    if (stock === 0) {
      // Will be set to out-of-stock on submit
    } else if (stock < 20) {
      // Will be set to low-stock on submit
    }
  }, [stock]);

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      // Auto-set status based on stock
      let status: 'in-stock' | 'low-stock' | 'out-of-stock' = 'in-stock';
      if (data.stock === 0) {
        status = 'out-of-stock';
      } else if (data.stock < 20) {
        status = 'low-stock';
      }

      const productData = {
        name: data.name,
        sku: data.sku,
        price: data.price,
        stock: data.stock,
        status,
        imageUrl: data.imageUrl || '',
        expiryDate: data.expiryDate ? Timestamp.fromDate(new Date(data.expiryDate)) : null,
        createdAt: Timestamp.now(),
      };

      await onSubmit(productData);
      toast.success('Thêm sản phẩm thành công!');
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
          <h2 className="text-white text-xl font-bold">Thêm Sản Phẩm Mới</h2>
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
          {/* Product Name */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Tên sản phẩm <span className="text-red-400">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="VD: Tương Ớt Bông Ớt - Cay Nồng"
              className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* SKU & Price Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SKU */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Mã SKU <span className="text-red-400">*</span>
              </label>
              <input
                {...register('sku')}
                type="text"
                placeholder="VD: TOB-CAY-330"
                className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.sku && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.sku.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Giá bán (VNĐ) <span className="text-red-400">*</span>
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="1000"
                placeholder="50000"
                className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.price && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          {/* Stock & Expiry Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stock */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Tồn kho <span className="text-red-400">*</span>
              </label>
              <input
                {...register('stock', { valueAsNumber: true })}
                type="number"
                placeholder="150"
                className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.stock && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.stock.message}
                </p>
              )}
              {/* Stock Status Hint */}
              {stock !== undefined && (
                <p className="text-text-muted text-xs mt-1">
                  Trạng thái: {stock === 0 ? '🔴 Hết hàng' : stock < 20 ? '🟡 Sắp hết' : '🟢 Còn hàng'}
                </p>
              )}
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Hạn sử dụng
              </label>
              <input
                {...register('expiryDate')}
                type="date"
                className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {errors.expiryDate && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.expiryDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Image URL (Optional) */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              URL Hình ảnh (tùy chọn)
            </label>
            <input
              {...register('imageUrl')}
              type="url"
              placeholder="https://example.com/product.jpg"
              className="w-full px-4 py-3 bg-surface-light border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            <p className="text-text-muted text-xs mt-1">
              💡 Tip: Sử dụng FileUpload component để upload ảnh lên Firebase Storage
            </p>
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
                  <span className="material-symbols-outlined text-xl">add</span>
                  Thêm Sản Phẩm
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
