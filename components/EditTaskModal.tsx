import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Task } from '../lib/firebase/types';

// Zod validation schema
const taskSchema = z.object({
  title: z.string().min(3, 'Tiêu đề phải có ít nhất 3 ký tự').max(200, 'Tiêu đề quá dài'),
  source: z.string().min(1, 'Vui lòng chọn nguồn giao việc'),
  field: z.string().min(1, 'Vui lòng chọn mảng công việc'),
  deadline: z.string().min(1, 'Vui lòng chọn deadline'),
  progress: z.number().min(0).max(100).optional().default(0),
  notes: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => Promise<void>;
  task: Task | null;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, onSubmit, task }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const sources = ['Lãnh đạo A', 'Lãnh đạo B', 'Lãnh đạo C', 'Tự phát sinh'];
  const fields = ['Báo cáo', 'Hành chính', 'Nghiên cứu', 'Phát triển', 'Đào tạo'];

  // Populate form with task data when modal opens
  useEffect(() => {
    if (task && isOpen) {
      reset({
        title: task.title,
        source: task.source,
        field: task.field,
        deadline: task.deadline,
        progress: task.progress ?? 0,
        notes: task.notes || '',
      });
    }
  }, [task, isOpen, reset]);

  const onSubmitForm = async (data: TaskFormData) => {
    try {
      await onSubmit({
        ...data,
        progress: data.progress ?? 0,
      });
      toast.success('Cập nhật công việc thành công!');
      reset();
      onClose();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border-color rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border-color p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Chỉnh Sửa Công Việc</h2>
            <p className="text-text-muted text-sm mt-1">Cập nhật thông tin công việc</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white p-2 hover:bg-surface-light rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Nội dung công việc <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="VD: Chuẩn bị báo cáo quý 4"
              className="w-full px-4 py-3 rounded-lg bg-surface-light border border-border-color text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">error</span>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Source & Field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Nguồn giao việc (Lãnh đạo) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('source')}
                  className="w-full px-4 py-3 rounded-lg bg-surface-light border border-border-color text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none"
                >
                  <option value="">Chọn nguồn...</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted pointer-events-none">
                  expand_more
                </span>
              </div>
              {errors.source && (
                <p className="text-red-400 text-sm mt-1">{errors.source.message}</p>
              )}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Mảng công việc <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('field')}
                  className="w-full px-4 py-3 rounded-lg bg-surface-light border border-border-color text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none"
                >
                  <option value="">Chọn mảng...</option>
                  {fields.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted pointer-events-none">
                  expand_more
                </span>
              </div>
              {errors.field && (
                <p className="text-red-400 text-sm mt-1">{errors.field.message}</p>
              )}
            </div>
          </div>

          {/* Deadline & Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Deadline <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  {...register('deadline')}
                  type="date"
                  className="w-full px-4 py-3 rounded-lg bg-surface-light border border-border-color text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted pointer-events-none">
                  calendar_today
                </span>
              </div>
              {errors.deadline && (
                <p className="text-red-400 text-sm mt-1">{errors.deadline.message}</p>
              )}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Tiến độ (%)
              </label>
              <input
                {...register('progress', { valueAsNumber: true })}
                type="number"
                min="0"
                max="100"
                placeholder="0"
                className="w-full px-4 py-3 rounded-lg bg-surface-light border border-border-color text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              {errors.progress && (
                <p className="text-red-400 text-sm mt-1">{errors.progress.message}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Ghi chú (tùy chọn)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Thêm ghi chú hoặc mô tả chi tiết..."
              className="w-full px-4 py-3 rounded-lg bg-surface-light border border-border-color text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border-color">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg bg-surface-light text-white font-medium hover:bg-surface-light/80 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-lg bg-primary text-background-dark font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Đang lưu...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">save</span>
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
