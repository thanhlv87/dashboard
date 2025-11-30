import { useState } from 'react';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  UploadTaskSnapshot
} from 'firebase/storage';
import { storage } from '../firebase';

export interface UploadProgress {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
}

export interface StorageHookResult {
  uploading: boolean;
  progress: number;
  error: Error | null;
  uploadFile: (file: File, path: string) => Promise<string>;
  deleteFile: (path: string) => Promise<void>;
  uploadWithProgress: (
    file: File,
    path: string,
    onProgress?: (progress: UploadProgress) => void
  ) => Promise<string>;
}

/**
 * Hook để làm việc với Firebase Storage
 * @returns Upload/delete functions và upload state
 */
export function useStorage(): StorageHookResult {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Upload file đơn giản (không theo dõi progress)
   */
  const uploadFile = async (file: File, path: string): Promise<string> => {
    setUploading(true);
    setError(null);

    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      setUploading(false);
      return url;
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err as Error);
      setUploading(false);
      throw err;
    }
  };

  /**
   * Upload file với theo dõi progress
   */
  const uploadWithProgress = async (
    file: File,
    path: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> => {
    setUploading(true);
    setError(null);
    setProgress(0);

    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(prog);

          if (onProgress) {
            onProgress({
              progress: prog,
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes
            });
          }
        },
        (err) => {
          console.error('Error uploading file:', err);
          setError(err as Error);
          setUploading(false);
          setProgress(0);
          reject(err);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setUploading(false);
            setProgress(100);
            resolve(url);
          } catch (err) {
            setError(err as Error);
            setUploading(false);
            reject(err);
          }
        }
      );
    });
  };

  /**
   * Xóa file từ Storage
   */
  const deleteFile = async (path: string): Promise<void> => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (err) {
      console.error('Error deleting file:', err);
      throw err;
    }
  };

  return {
    uploading,
    progress,
    error,
    uploadFile,
    deleteFile,
    uploadWithProgress
  };
}
