import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../contexts/AuthContext';
import { Task } from '../lib/firebase/types';
import { orderBy } from 'firebase/firestore';
import { AddTaskModal } from '../components/AddTaskModal';
import toast from 'react-hot-toast';

const TaskItem = ({ task, onEdit, onDelete }: { task: Task, onEdit: (task: Task) => void, onDelete: (id: string) => void }) => {
  return (
    <div className="bg-surface border-t border-t-border-color first:border-t-0 p-4 hover:bg-surface-light/30 transition-colors">
        <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
                 <p className="text-white text-sm font-medium leading-normal mb-2">{task.title}</p>
            </div>
            <div className="w-full md:w-32 flex justify-start md:justify-center">
                <div className="inline-flex items-center justify-center rounded-full py-1 px-3 bg-blue-500/20 text-blue-300 text-xs font-medium">
                    {task.source}
                </div>
            </div>
             <div className="w-full md:w-32 flex justify-start md:justify-center">
                 <div className="inline-flex items-center justify-center rounded-full py-1 px-3 bg-surface-light text-text-muted text-xs font-medium">
                    {task.field}
                 </div>
            </div>
            <div className="w-full md:w-48">
                 <div className="flex items-center gap-3">
                    <div className="w-full overflow-hidden rounded-full bg-surface-light h-1.5">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${task.progress}%` }}></div>
                    </div>
                    <p className="text-white text-sm font-medium leading-normal">{task.progress}%</p>
                </div>
            </div>
            <div className="w-full md:w-32 flex -space-x-2">
                 {task.assignedTo.slice(0, 3).map((userId, i) => (
                    <div key={userId} className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 border-2 border-[#111814] bg-surface-light flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm text-primary">person</span>
                    </div>
                 ))}
                 {task.assignedTo.length > 3 && (
                   <div className="bg-surface-light rounded-full size-8 border-2 border-[#111814] flex items-center justify-center text-xs text-white">
                     +{task.assignedTo.length - 3}
                   </div>
                 )}
            </div>
             <div className="w-full md:w-32 text-text-muted text-sm font-normal">
                {task.deadline}
            </div>
             <div className="w-full md:w-20 text-text-muted text-sm font-normal flex items-center gap-1">
                 <span className="material-symbols-outlined text-base">attachment</span> {task.files}
            </div>
             <div className="w-full md:w-24 flex justify-end gap-2">
                 <button onClick={() => onEdit(task)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined text-xl">edit</span></button>
                <button onClick={() => onDelete(task.id)} className="text-text-muted hover:text-red-400"><span className="material-symbols-outlined text-xl">delete</span></button>
            </div>
        </div>
    </div>
  );
};

const Tasks = () => {
  const { currentUser } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch tasks from Firestore
  const { data: tasks, loading, error, add, remove } = useFirestore<Task>(
    'tasks',
    [orderBy('deadline', 'asc')]
  );

  const handleAddTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      await add(taskData);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa công việc này?')) {
      try {
        await remove(id);
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between gap-3 mb-6">
            <div className="flex min-w-72 flex-col gap-2">
                <h1 className="text-white text-3xl font-bold leading-tight tracking-[-0.033em]">Công Việc Cơ Quan</h1>
                <p className="text-text-muted text-base font-normal leading-normal">
                  Quản lý và theo dõi các nhiệm vụ được giao
                </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-[#111814] hover:bg-opacity-90"
            >
                <span className="material-symbols-outlined">add</span>
                Thêm Công Việc
            </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-2 scrollbar-hide">
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-surface-light pl-3 pr-3 text-white">
                <span className="material-symbols-outlined text-base">filter_list</span>
                <p className="text-sm font-medium leading-normal">Tất cả ({tasks.length})</p>
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-surface-light pl-3 pr-3 text-white">
                <p className="text-sm font-medium leading-normal">Nguồn giao việc</p>
                <span className="material-symbols-outlined text-base">arrow_drop_down</span>
            </button>
             <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-surface-light pl-3 pr-3 text-white">
                <p className="text-sm font-medium leading-normal">Mảng công việc</p>
                <span className="material-symbols-outlined text-base">arrow_drop_down</span>
            </button>
             <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-surface-light pl-3 pr-3 text-white">
                <p className="text-sm font-medium leading-normal">Trạng thái</p>
                <span className="material-symbols-outlined text-base">arrow_drop_down</span>
            </button>
        </div>

        {/* Task List */}
        <div className="w-full bg-surface border border-border-color rounded-xl overflow-hidden">
             <div className="bg-[#1c2720] border-b border-border-color p-4 hidden md:flex gap-4">
                <div className="flex-1 text-white text-sm font-medium">Nội dung công việc</div>
                <div className="w-32 text-center text-white text-sm font-medium">Nguồn giao</div>
                <div className="w-32 text-center text-white text-sm font-medium">Mảng</div>
                <div className="w-48 text-white text-sm font-medium">Tiến độ</div>
                <div className="w-32 text-white text-sm font-medium">Người phối hợp</div>
                <div className="w-32 text-white text-sm font-medium">Deadline</div>
                <div className="w-20 text-white text-sm font-medium">Tệp</div>
                <div className="w-24 text-white text-sm font-medium text-right">Hành động</div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-text-muted">
                <span className="material-symbols-outlined text-4xl mb-2 animate-spin">refresh</span>
                <p>Đang tải...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center text-red-400">
                <span className="material-symbols-outlined text-4xl mb-2">error</span>
                <p>Lỗi: {error.message}</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="p-12 text-center text-text-muted">
                <span className="material-symbols-outlined text-5xl mb-4">task_alt</span>
                <p className="text-lg mb-2">Chưa có công việc nào</p>
                <p className="text-sm mb-4">Nhấn "Thêm Công Việc" để bắt đầu</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background-dark rounded-lg font-medium hover:bg-opacity-90"
                >
                  <span className="material-symbols-outlined">add</span>
                  Tạo công việc đầu tiên
                </button>
              </div>
            ) : (
              tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={(task) => {/* TODO: Open edit modal */}}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
        </div>

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTask}
        />
    </div>
  );
};

export default Tasks;
