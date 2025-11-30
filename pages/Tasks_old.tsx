import React from 'react';

const TaskItem = ({ title, source, field, progress, deadline, files, collaborators, statusColor }: any) => {
  return (
    <div className="bg-surface border-t border-t-border-color first:border-t-0 p-4 hover:bg-surface-light/30 transition-colors">
        <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
                 <p className="text-white text-sm font-medium leading-normal mb-2">{title}</p>
            </div>
            <div className="w-full md:w-32 flex justify-start md:justify-center">
                <div className={`inline-flex items-center justify-center rounded-full py-1 px-3 ${statusColor} bg-opacity-20 text-xs font-medium`}>
                    {source}
                </div>
            </div>
             <div className="w-full md:w-32 flex justify-start md:justify-center">
                 <div className="inline-flex items-center justify-center rounded-full py-1 px-3 bg-surface-light text-text-muted text-xs font-medium">
                    {field}
                 </div>
            </div>
            <div className="w-full md:w-48">
                 <div className="flex items-center gap-3">
                    <div className="w-full overflow-hidden rounded-full bg-surface-light h-1.5">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-white text-sm font-medium leading-normal">{progress}%</p>
                </div>
            </div>
            <div className="w-full md:w-32 flex -space-x-2">
                 {[...Array(collaborators)].map((_, i) => (
                    <div key={i} className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 border-2 border-[#111814]" style={{backgroundImage: `url(https://picsum.photos/50/50?random=${i})`}}></div>
                 ))}
            </div>
             <div className="w-full md:w-32 text-text-muted text-sm font-normal">
                {deadline}
            </div>
             <div className="w-full md:w-20 text-text-muted text-sm font-normal flex items-center gap-1">
                 <span className="material-symbols-outlined text-base">attachment</span> {files}
            </div>
             <div className="w-full md:w-24 flex justify-end gap-2">
                 <button className="text-text-muted hover:text-white"><span className="material-symbols-outlined text-xl">edit</span></button>
                <button className="text-text-muted hover:text-red-400"><span className="material-symbols-outlined text-xl">delete</span></button>
            </div>
        </div>
    </div>
  );
};

const Tasks = () => {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between gap-3 mb-6">
            <div className="flex min-w-72 flex-col gap-2">
                <h1 className="text-white text-3xl font-bold leading-tight tracking-[-0.033em]">Công Việc Cơ Quan</h1>
                <p className="text-text-muted text-base font-normal leading-normal">Danh sách các nhiệm vụ và dự án tại cơ quan</p>
            </div>
            <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-[#111814]">
                <span className="material-symbols-outlined">add</span>
                Thêm Công Việc
            </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-2 scrollbar-hide">
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-surface-light pl-3 pr-3 text-white">
                <span className="material-symbols-outlined text-base">filter_list</span>
                <p className="text-sm font-medium leading-normal">Tất cả</p>
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

        {/* Task List Table Header */}
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
            
            <TaskItem 
                title="Báo cáo tổng kết dự án quý 2"
                source="Lãnh đạo A"
                statusColor="text-blue-300 bg-blue-500"
                field="Báo cáo"
                progress={75}
                collaborators={2}
                deadline="30/07/2024"
                files={3}
            />
             <TaskItem 
                title="Chuẩn bị tài liệu cho cuộc họp HĐQT"
                source="Lãnh đạo B"
                statusColor="text-green-300 bg-green-500"
                field="Hành chính"
                progress={20}
                collaborators={1}
                deadline="15/08/2024"
                files={1}
            />
             <TaskItem 
                title="Phân tích dữ liệu khách hàng tháng 7"
                source="Lãnh đạo C"
                statusColor="text-pink-300 bg-pink-500"
                field="Nghiên cứu"
                progress={100}
                collaborators={1}
                deadline="25/07/2024"
                files={5}
            />
             <TaskItem 
                title="Thiết kế giao diện cho ứng dụng mới"
                source="Lãnh đạo A"
                statusColor="text-blue-300 bg-blue-500"
                field="Phát triển"
                progress={50}
                collaborators={3}
                deadline="10/09/2024"
                files={2}
            />
        </div>
    </div>
  );
};

export default Tasks;