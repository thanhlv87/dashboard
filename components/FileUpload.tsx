import React, { useRef, useState } from 'react';
import { useStorage } from '../hooks/useStorage';
import toast from 'react-hot-toast';

interface FileUploadProps {
  path: string;
  accept?: string;
  maxSize?: number; // in MB
  onUploadComplete: (url: string) => void;
  label?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  path,
  accept = 'image/*',
  maxSize = 10,
  onUploadComplete,
  label = 'Upload File',
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadWithProgress, uploading, progress } = useStorage();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File quá lớn! Tối đa ${maxSize}MB`);
      return;
    }

    // Show preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    try {
      const url = await uploadWithProgress(
        file,
        `${path}/${Date.now()}_${file.name}`,
        (progressInfo) => {
          // Progress callback - already handled by hook
          console.log(`Upload progress: ${progressInfo.progress}%`);
        }
      );

      toast.success('Upload thành công!');
      onUploadComplete(url);
      setPreview(null);
    } catch (error: any) {
      toast.error(`Upload thất bại: ${error.message}`);
      setPreview(null);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {preview && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border-color">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center">
                <span className="material-symbols-outlined text-4xl mb-2 animate-spin">refresh</span>
                <p className="text-sm">{Math.round(progress)}%</p>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-border-color hover:border-primary bg-surface hover:bg-surface-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <span className="material-symbols-outlined animate-spin">refresh</span>
            <span className="text-white text-sm">Đang upload... {Math.round(progress)}%</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-primary">cloud_upload</span>
            <span className="text-white text-sm">{label}</span>
          </>
        )}
      </button>

      {uploading && (
        <div className="w-full bg-surface-light rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

// Drag & Drop Version
interface DragDropUploadProps extends FileUploadProps {
  multiple?: boolean;
}

export const DragDropUpload: React.FC<DragDropUploadProps> = ({
  path,
  accept = 'image/*',
  maxSize = 10,
  onUploadComplete,
  multiple = false,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { uploadWithProgress, uploading, progress } = useStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0]; // For now, handle single file
    await uploadFile(file);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    await uploadFile(files[0]);
  };

  const uploadFile = async (file: unknown) => {
    if (!(file instanceof File)) {
      toast.error('File không hợp lệ');
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File quá lớn! Tối đa ${maxSize}MB`);
      return;
    }

    try {
      const url = await uploadWithProgress(
        file,
        `${path}/${Date.now()}_${file.name}`
      );

      toast.success('Upload thành công!');
      onUploadComplete(url);
    } catch (error: any) {
      toast.error(`Upload thất bại: ${error.message}`);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
          ${isDragging ? 'border-primary bg-primary/10' : 'border-border-color bg-surface'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-surface-light'}
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-5xl text-primary animate-spin">refresh</span>
            <p className="text-white font-medium">Đang upload...</p>
            <p className="text-text-muted text-sm">{Math.round(progress)}%</p>
            <div className="w-64 bg-surface-light rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-5xl text-primary">cloud_upload</span>
            <div>
              <p className="text-white font-medium mb-1">
                Kéo thả file vào đây hoặc click để chọn
              </p>
              <p className="text-text-muted text-sm">
                {accept.includes('image') ? 'PNG, JPG, GIF' : 'Tất cả file'} • Tối đa {maxSize}MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
