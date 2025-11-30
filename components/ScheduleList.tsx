import React, { useState } from 'react';
import { TeachingSchedule } from '../lib/firebase/types';
import { Timestamp } from 'firebase/firestore';

interface ScheduleListProps {
    schedules: TeachingSchedule[];
    onEdit: (schedule: TeachingSchedule) => void;
    onDelete: (id: string) => void;
    onDuplicate: (schedule: TeachingSchedule) => void;
    onBulkDelete: (ids: string[]) => void;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({
    schedules,
    onEdit,
    onDelete,
    onDuplicate,
    onBulkDelete,
}) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    // Handle select all
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(schedules.map(s => s.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    // Handle individual selection
    const handleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    // Format date helper
    const formatDate = (timestamp: Timestamp) => {
        return timestamp.toDate().toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Format currency helper
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN') + ' ₫';
    };

    return (
        <div className="flex flex-col h-full">
            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined">check_circle</span>
                        <span className="font-medium">Đã chọn {selectedIds.size} lịch giảng</span>
                    </div>
                    {isBulkDeleting ? (
                        <div className="flex items-center gap-2">
                            <span className="text-white text-sm font-medium">Bạn có chắc chắn?</span>
                            <button
                                onClick={() => {
                                    onBulkDelete(Array.from(selectedIds));
                                    setSelectedIds(new Set());
                                    setIsBulkDeleting(false);
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors text-sm font-medium"
                            >
                                <span className="material-symbols-outlined text-lg">check</span>
                                Xóa
                            </button>
                            <button
                                onClick={() => setIsBulkDeleting(false)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-surface-light hover:bg-surface text-white rounded-md transition-colors text-sm font-medium"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                                Hủy
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsBulkDeleting(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md transition-colors text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-lg">delete</span>
                            Xóa {selectedIds.size} mục
                        </button>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="flex-1 bg-surface border border-border-color rounded-xl overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-surface-light sticky top-0 z-10">
                            <tr>
                                <th className="p-4 border-b border-border-color w-10">
                                    <input
                                        type="checkbox"
                                        checked={schedules.length > 0 && selectedIds.size === schedules.length}
                                        onChange={handleSelectAll}
                                        className="rounded border-border-color bg-surface text-primary focus:ring-primary"
                                    />
                                </th>
                                <th className="p-4 border-b border-border-color text-text-muted font-medium text-sm whitespace-nowrap">Ngày</th>
                                <th className="p-4 border-b border-border-color text-text-muted font-medium text-sm whitespace-nowrap">Thời gian</th>
                                <th className="p-4 border-b border-border-color text-text-muted font-medium text-sm whitespace-nowrap">Công ty / Đối tác</th>
                                <th className="p-4 border-b border-border-color text-text-muted font-medium text-sm whitespace-nowrap">Nội dung</th>
                                <th className="p-4 border-b border-border-color text-text-muted font-medium text-sm whitespace-nowrap text-right">Học phí</th>
                                <th className="p-4 border-b border-border-color text-text-muted font-medium text-sm whitespace-nowrap">Trạng thái</th>
                                <th className="p-4 border-b border-border-color text-text-muted font-medium text-sm whitespace-nowrap text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-color">
                            {schedules.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-text-muted">
                                        Chưa có dữ liệu lịch giảng
                                    </td>
                                </tr>
                            ) : (
                                schedules.map((schedule) => (
                                    <tr
                                        key={schedule.id}
                                        className={`hover:bg-surface-light/50 transition-colors ${selectedIds.has(schedule.id) ? 'bg-primary/5' : ''}`}
                                    >
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(schedule.id)}
                                                onChange={() => handleSelect(schedule.id)}
                                                className="rounded border-border-color bg-surface text-primary focus:ring-primary"
                                            />
                                        </td>
                                        <td className="p-4 text-white whitespace-nowrap">
                                            {formatDate(schedule.date)}
                                        </td>
                                        <td className="p-4 text-white whitespace-nowrap">
                                            {schedule.startTime} - {schedule.endTime}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">{schedule.company}</span>
                                                <span className="text-text-muted text-xs">{schedule.partner}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-white text-sm">{schedule.studentType}</span>
                                                <span className="text-text-muted text-xs">{schedule.studentCount} học viên</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right text-primary font-medium whitespace-nowrap">
                                            {formatCurrency(schedule.fee)}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <span className={`text-xs px-2 py-1 rounded-full ${schedule.status === 'Đã giảng' ? 'bg-green-500/20 text-green-400' :
                                                schedule.status === 'Chưa giảng' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    schedule.status === 'Đang xếp' ? 'bg-purple-500/20 text-purple-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {schedule.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => onEdit(schedule)}
                                                    className="p-1.5 text-text-muted hover:text-white hover:bg-surface-light rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => onDuplicate(schedule)}
                                                    className="p-1.5 text-text-muted hover:text-primary hover:bg-surface-light rounded-lg transition-colors"
                                                    title="Nhân bản"
                                                >
                                                    <span className="material-symbols-outlined text-xl">content_copy</span>
                                                </button>
                                                {deletingId === schedule.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => {
                                                                onDelete(schedule.id);
                                                                setDeletingId(null);
                                                            }}
                                                            className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                            title="Xác nhận xóa"
                                                        >
                                                            <span className="material-symbols-outlined text-xl">check</span>
                                                        </button>
                                                        <button
                                                            onClick={() => setDeletingId(null)}
                                                            className="p-1.5 bg-surface-light text-text-muted rounded-lg hover:bg-surface hover:text-white transition-colors"
                                                            title="Hủy"
                                                        >
                                                            <span className="material-symbols-outlined text-xl">close</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeletingId(schedule.id)}
                                                        className="p-1.5 text-text-muted hover:text-red-500 hover:bg-surface-light rounded-lg transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
