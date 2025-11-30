import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { FileUpload } from './FileUpload';
import toast from 'react-hot-toast';

const mockUploadWithProgress = vi.fn();
const mockUseStorage = vi.fn(() => ({
    uploadWithProgress: mockUploadWithProgress,
    uploading: false,
    progress: 0,
}));

vi.mock('../hooks/useStorage', () => ({
    useStorage: () => mockUseStorage(),
}));
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('FileUpload', () => {
    const onUploadComplete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders and triggers file input', () => {
        render(<FileUpload path="test-path" onUploadComplete={onUploadComplete} />);
        const button = screen.getByText('Upload File');
        fireEvent.click(button);
    });

    it('handles successful file upload', async () => {
        mockUploadWithProgress.mockResolvedValue('http://mock-url.com/file.jpg');
        const { container } = render(<FileUpload path="test-path" onUploadComplete={onUploadComplete} />);
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

        await act(async () => {
            fireEvent.change(input, { target: { files: [file] } });
        });

        await waitFor(() => {
            expect(mockUploadWithProgress).toHaveBeenCalled();
            expect(onUploadComplete).toHaveBeenCalledWith('http://mock-url.com/file.jpg');
            expect(toast.success).toHaveBeenCalledWith('Upload thành công!');
        });
    });

    it('handles file upload error', async () => {
        mockUploadWithProgress.mockRejectedValue(new Error('Upload failed'));
        const { container } = render(<FileUpload path="test-path" onUploadComplete={onUploadComplete} />);
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

        await act(async () => {
            fireEvent.change(input, { target: { files: [file] } });
        });

        await waitFor(() => {
            expect(mockUploadWithProgress).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith('Upload thất bại: Upload failed');
        });
    });
});
