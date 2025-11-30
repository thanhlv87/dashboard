import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useFirestore } from '../hooks/useFirestore';
import { Task, TeachingSchedule, Product } from '../lib/firebase/types';
import { orderBy, where, Timestamp } from 'firebase/firestore';

const UrgentTaskRow = ({ title, tag, date, status }: any) => (
  <div className="flex items-center justify-between py-4 border-b border-border-color last:border-0 hover:bg-surface-light/30 px-2 rounded transition-colors">
    <div className="flex flex-col gap-1 w-1/3">
      <span className="text-sm font-normal text-white truncate">{title}</span>
    </div>
    <div className="w-1/4">
       <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-surface-light text-white`}>
         {tag}
       </span>
    </div>
    <div className="w-1/6 text-sm text-[#fa5538] font-medium">{date}</div>
    <div className="w-1/6 text-right">
       <button className="text-sm font-bold text-white border border-border-color bg-transparent px-3 py-1.5 rounded-md hover:bg-surface-light transition-all w-full">
         {status}
       </button>
    </div>
  </div>
);

const ScheduleItem = ({ day, date, title, time }: any) => (
  <div className="flex items-center gap-3 p-2 hover:bg-surface-light/30 rounded-lg transition-colors">
    <div className="flex flex-col items-center justify-center bg-surface-light p-2 rounded-lg min-w-[50px] h-[54px]">
      <p className="text-white text-xs font-medium uppercase">{day}</p>
      <p className="text-white text-lg font-bold leading-none">{date}</p>
    </div>
    <div className="flex flex-col justify-center">
      <p className="text-white font-medium text-sm line-clamp-1">{title}</p>
      <p className="text-xs text-text-muted">{time}</p>
    </div>
  </div>
);

const StatCard = ({ icon, label, value, subValue, subColor }: any) => (
  <div className="flex flex-col gap-1 rounded-xl p-4 border border-border-color bg-surface">
    <div className="flex items-center gap-2 text-text-muted mb-2">
      <span className="material-symbols-outlined text-base">{icon}</span>
      <p className="text-xs font-medium leading-normal">{label}</p>
    </div>
    <p className="text-white tracking-tight text-2xl font-bold leading-tight">{value}</p>
    <p className={`${subColor} text-xs font-medium leading-normal`}>{subValue}</p>
  </div>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'inventory'>('schedule');

  // Fetch urgent tasks (progress < 100, deadline soon)
  const { data: tasks, loading: tasksLoading } = useFirestore<Task>(
    'tasks',
    [orderBy('deadline', 'asc')]
  );

  // Fetch upcoming teaching schedules
  const today = Timestamp.now();
  const { data: schedules, loading: schedulesLoading } = useFirestore<TeachingSchedule>(
    'teaching',
    [
      where('date', '>=', today),
      orderBy('date', 'asc')
    ]
  );

  // Fetch products for inventory
  const { data: products, loading: productsLoading } = useFirestore<Product>(
    'products',
    []
  );

  // Calculate stats
  const completedTasksThisWeek = tasks.filter(t => t.progress === 100).length;
  const totalTasksThisWeek = tasks.length;
  const upcomingSchedules = schedules.slice(0, 5);
  const lowStockProducts = products.filter(p => p.status === 'low-stock');

  return (
    <div className="flex flex-col h-full">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background-dark/95 backdrop-blur-md border-b border-surface-light px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="size-8 text-primary">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
                </svg>
               </div>
               <h1 className="text-xl font-bold text-white">Dashboard Tổng Hợp</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Tìm kiếm nhanh..."
                  className="bg-surface-light border-none text-white text-sm rounded-lg pl-10 pr-4 py-2.5 w-72 focus:ring-0 placeholder:text-text-muted"
                />
              </div>
              <button className="size-10 rounded-lg bg-surface-light flex items-center justify-center text-white hover:bg-surface-light/80 transition-colors">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <button className="size-10 rounded-lg bg-surface-light flex items-center justify-center text-white hover:bg-surface-light/80 transition-colors">
                <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
              </button>
              <div className="size-10 rounded-full bg-surface-light flex items-center justify-center text-white">
                <span className="material-symbols-outlined">person</span>
              </div>
            </div>
        </header>

        <div className="p-8 flex flex-col gap-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon="school"
                    label="Giảng Dạy"
                    value={schedulesLoading ? "..." : `${schedules.length} Lớp`}
                    subValue={schedulesLoading ? "Đang tải..." : `${upcomingSchedules.length} sắp tới`}
                    subColor="text-[#0bda43]"
                />
                <StatCard
                    icon="storefront"
                    label="Kinh Doanh"
                    value={productsLoading ? "..." : `${products.length} SP`}
                    subValue={productsLoading ? "Đang tải..." : `${lowStockProducts.length} sắp hết hàng`}
                    subColor={lowStockProducts.length > 0 ? "text-[#fa5538]" : "text-[#0bda43]"}
                />
                <StatCard
                    icon="work"
                    label="Công Việc"
                    value={tasksLoading ? "..." : `${completedTasksThisWeek}/${totalTasksThisWeek}`}
                    subValue="Hoàn thành"
                    subColor="text-text-muted"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Urgent Tasks */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex flex-col gap-4 rounded-xl border border-border-color p-6 bg-surface h-full">
                        <div className="flex items-center justify-between mb-2">
                             <h3 className="text-white text-lg font-bold">Công Việc Cần Xử Lý Gấp</h3>
                        </div>

                        {tasksLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <p className="text-text-muted">Đang tải...</p>
                          </div>
                        ) : tasks.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                            <span className="material-symbols-outlined text-4xl mb-2">task_alt</span>
                            <p>Chưa có công việc nào</p>
                            <p className="text-sm mt-1">Nhấn "Tạo Mới" để thêm công việc</p>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between text-xs font-medium text-text-muted pb-3 border-b border-border-color">
                                <span className="w-1/3 pl-2">Công Việc</span>
                                <span className="w-1/4">Lĩnh Vực</span>
                                <span className="w-1/6">Hạn Chót</span>
                                <span className="w-1/6 text-right pr-2">Tình trạng</span>
                            </div>
                            {tasks.slice(0, 6).map(task => (
                              <UrgentTaskRow
                                key={task.id}
                                title={task.title}
                                tag={task.field}
                                date={task.deadline}
                                status={task.progress === 100 ? 'Hoàn thành' : 'Đang làm'}
                              />
                            ))}
                          </div>
                        )}

                        <NavLink to="/tasks" className="mt-auto w-full py-3 rounded-lg bg-primary text-background-dark font-bold text-sm hover:bg-opacity-90 transition-colors text-center">
                            {tasks.length === 0 ? 'Tạo Mới' : 'Xem Tất Cả'}
                        </NavLink>
                    </div>
                </div>

                {/* Right Column: Schedule & Inventory Tabs */}
                <div className="lg:col-span-1">
                    <div className="flex flex-col gap-4 rounded-xl border-2 border-primary/80 p-5 bg-surface shadow-lg shadow-primary/5 h-full">
                        <div className="flex bg-surface-light/30 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('schedule')}
                                className={`flex-1 text-sm font-bold py-2 px-3 rounded-md transition-all ${activeTab === 'schedule' ? 'bg-surface-light text-white shadow-sm' : 'text-text-muted hover:text-white'}`}
                            >
                                Lịch Giảng Sắp Tới
                            </button>
                            <button
                                onClick={() => setActiveTab('inventory')}
                                className={`flex-1 text-sm font-bold py-2 px-3 rounded-md transition-all ${activeTab === 'inventory' ? 'bg-surface-light text-white shadow-sm' : 'text-text-muted hover:text-white'}`}
                            >
                                Tồn Kho
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-[300px] flex flex-col gap-1">
                            {activeTab === 'schedule' ? (
                                schedulesLoading ? (
                                  <p className="text-text-muted text-center py-4">Đang tải...</p>
                                ) : upcomingSchedules.length === 0 ? (
                                  <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                                    <span className="material-symbols-outlined text-3xl mb-2">event</span>
                                    <p className="text-sm">Chưa có lịch giảng</p>
                                  </div>
                                ) : (
                                  upcomingSchedules.map(schedule => {
                                    const date = schedule.date.toDate();
                                    return (
                                      <ScheduleItem
                                        key={schedule.id}
                                        day={date.toLocaleDateString('vi-VN', { month: 'short' }).toUpperCase()}
                                        date={date.getDate()}
                                        title={schedule.location}
                                        time={`${schedule.startTime} - ${schedule.endTime}`}
                                      />
                                    );
                                  })
                                )
                            ) : (
                                productsLoading ? (
                                  <p className="text-text-muted text-center py-4">Đang tải...</p>
                                ) : products.length === 0 ? (
                                  <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                                    <span className="material-symbols-outlined text-3xl mb-2">inventory</span>
                                    <p className="text-sm">Chưa có sản phẩm</p>
                                  </div>
                                ) : (
                                  <div className="flex flex-col gap-4 py-2">
                                    {products.slice(0, 3).map(product => (
                                      <div key={product.id} className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-white font-medium text-sm">{product.name}</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-lg font-bold text-white">{product.stock}</p>
                                                <p className="text-xs text-text-muted">chai</p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-surface-light rounded-full h-2">
                                            <div
                                              className={`h-2 rounded-full ${product.status === 'low-stock' ? 'bg-[#fa5538]' : 'bg-primary'}`}
                                              style={{ width: `${Math.min(product.stock / 10, 100)}%` }}
                                            ></div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )
                            )}
                        </div>

                        <NavLink
                          to={activeTab === 'schedule' ? '/teaching' : '/business/products'}
                          className="w-full py-2.5 rounded-lg border border-primary/20 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors text-center"
                        >
                            Xem thêm
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
