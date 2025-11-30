import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFirestore } from '../hooks/useFirestore';
import { TeachingSchedule, Partner } from '../lib/firebase/types';
import { orderBy, where } from 'firebase/firestore';
import { AddScheduleModal } from '../components/AddScheduleModal';
import { EditScheduleModal } from '../components/EditScheduleModal';
import toast from 'react-hot-toast';

// ========================================
// CALENDAR VIEW
// ========================================
const CalendarView = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<TeachingSchedule | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Calendar navigation state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Fetch schedules from Firestore
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: schedules, loading, add, update, remove } = useFirestore<TeachingSchedule>(
    'teaching',
    [orderBy('date', 'asc')]
  );

  const handleAddSchedule = async (scheduleData: Omit<TeachingSchedule, 'id'>) => {
    try {
      await add(scheduleData);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding schedule:', err);
    }
  };

  const handleScheduleClick = (schedule: TeachingSchedule) => {
    setSelectedSchedule(schedule);
    setShowEditModal(true);
  };

  const handleUpdateSchedule = async (id: string, data: Partial<TeachingSchedule>) => {
    try {
      await update(id, data);
    } catch (err) {
      console.error('Error updating schedule:', err);
      throw err;
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await remove(id);
    } catch (err) {
      console.error('Error deleting schedule:', err);
      throw err;
    }
  };

  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Navigate to previous month
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null); // Reset selected day when changing month
  };

  // Navigate to next month
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null); // Reset selected day when changing month
  };

  // Generate calendar dates for current month
  const currentDate = new Date();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const dates = Array.from({ length: 35 }, (_, i) => {
    const day = i - firstDay + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  // Helper to get schedules for a specific day
  const getSchedulesForDay = (day: number) => {
    if (!day) return [];
    return schedules.filter(schedule => {
      const scheduleDate = schedule.date.toDate();
      return scheduleDate.getDate() === day &&
             scheduleDate.getMonth() === currentMonth &&
             scheduleDate.getFullYear() === currentYear;
    });
  };

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 overflow-y-auto">
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Lịch Giảng</h1>
          <p className="text-text-muted text-sm">
            {schedules.length} lịch giảng trong hệ thống
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined">add</span>
          Thêm Lịch Giảng Mới
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Calendar */}
        <div className="flex-1 flex flex-col">
          {/* Calendar Header */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              onClick={handlePrevMonth}
              className="flex size-10 items-center justify-center rounded-full hover:bg-surface-light text-white transition-colors"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <p className="text-white text-base font-bold min-w-[150px] text-center">
              Tháng {currentMonth + 1} năm {currentYear}
            </p>
            <button
              onClick={handleNextMonth}
              className="flex size-10 items-center justify-center rounded-full hover:bg-surface-light text-white transition-colors"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 border border-border-color rounded-xl bg-surface p-6">
            <div className="grid grid-cols-7 mb-4">
              {days.map(d => (
                <div key={d} className="text-text-muted text-[13px] font-bold text-center h-12 flex items-center justify-center">
                  {d}
                </div>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin">refresh</span>
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-y-2">
                {dates.map((d, i) => {
                  const daySchedules = d ? getSchedulesForDay(d) : [];
                  const isToday = d === currentDate.getDate() &&
                                 currentMonth === currentDate.getMonth() &&
                                 currentYear === currentDate.getFullYear();
                  const isSelected = d === selectedDay;

                  return (
                    <div key={i} className="flex justify-center h-12">
                      {d && (
                        <div
                          onClick={() => setSelectedDay(d)}
                          className={`size-full max-w-[48px] max-h-[48px] rounded-full flex items-center justify-center text-sm font-medium relative hover:bg-surface-light/50 cursor-pointer transition-colors ${
                            isToday ? 'bg-primary text-background-dark' :
                            isSelected ? 'bg-surface-light text-white ring-2 ring-primary' :
                            'text-white'
                          }`}
                        >
                          {d}
                          {/* Event indicators */}
                          {daySchedules.length > 0 && !isToday && (
                            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                              {daySchedules.slice(0, 3).map((_, idx) => (
                                <div key={idx} className="size-1 rounded-full bg-green-500"></div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Day Schedules */}
          {selectedDay && (
            <div className="mt-6">
              <h3 className="text-white text-lg font-bold mb-4">
                Lịch ngày {selectedDay}/{currentMonth + 1}/{currentYear}
              </h3>
              <div className="bg-surface border border-border-color rounded-xl p-4">
                {getSchedulesForDay(selectedDay).length === 0 ? (
                  <div className="text-center py-8 text-text-muted">
                    <span className="material-symbols-outlined text-4xl mb-2">event_available</span>
                    <p className="text-sm">Không có lịch giảng</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getSchedulesForDay(selectedDay).map(schedule => (
                      <div
                        key={schedule.id}
                        onClick={() => handleScheduleClick(schedule)}
                        className="p-4 bg-surface-light rounded-lg hover:bg-surface-light/70 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="material-symbols-outlined text-primary">schedule</span>
                              <p className="text-white font-medium">{schedule.startTime} - {schedule.endTime}</p>
                            </div>
                            <p className="text-white text-lg font-bold mb-1">{schedule.company}</p>
                            <div className="flex items-center gap-2 text-text-muted text-sm mb-2">
                              <span className="material-symbols-outlined text-sm">location_on</span>
                              {schedule.location}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                                <span className="material-symbols-outlined text-xs">business</span> {schedule.partner}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                                <span className="material-symbols-outlined text-xs">group</span> {schedule.studentCount} học viên
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                schedule.status === 'Đã giảng' ? 'bg-green-500/20 text-green-400' :
                                schedule.status === 'Chưa giảng' ? 'bg-yellow-500/20 text-yellow-400' :
                                schedule.status === 'Đang xếp' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {schedule.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-primary text-lg font-bold">
                              {schedule.fee.toLocaleString('vi-VN')} ₫
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Schedules Sidebar */}
        <div className="w-full lg:w-80 flex flex-col">
          <h3 className="text-white text-lg font-bold mb-4">Lịch sắp tới</h3>
          <div className="flex-1 bg-surface border border-border-color rounded-xl p-4 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <span className="material-symbols-outlined text-2xl text-primary animate-spin">refresh</span>
              </div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-8 text-text-muted">
                <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                <p className="text-sm">Chưa có lịch giảng nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {schedules.slice(0, 10).map(schedule => (
                  <div
                    key={schedule.id}
                    onClick={() => handleScheduleClick(schedule)}
                    className="p-3 bg-surface-light rounded-lg hover:bg-surface-light/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex flex-col items-center justify-center shrink-0">
                        <p className="text-primary text-xs font-bold">{schedule.date.toDate().toLocaleDateString('vi-VN', { month: 'short' })}</p>
                        <p className="text-white text-lg font-bold">{schedule.date.toDate().getDate()}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{schedule.company}</p>
                        <p className="text-text-muted text-xs">{schedule.startTime} - {schedule.endTime}</p>
                        <p className="text-text-muted text-xs truncate">{schedule.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            schedule.status === 'Đã giảng' ? 'bg-green-500/20 text-green-400' :
                            schedule.status === 'Chưa giảng' ? 'bg-yellow-500/20 text-yellow-400' :
                            schedule.status === 'Đang xếp' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {schedule.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Schedule Modal */}
      <AddScheduleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddSchedule}
      />

      {/* Edit Schedule Modal */}
      <EditScheduleModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedSchedule(null);
        }}
        schedule={selectedSchedule}
        onUpdate={handleUpdateSchedule}
        onDelete={handleDeleteSchedule}
      />
    </div>
  );
};

// ========================================
// PARTNERS DASHBOARD
// ========================================
const PartnersDashboard = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch data from Firestore
  const { data: schedules } = useFirestore<TeachingSchedule>('teaching', [orderBy('date', 'desc')]);
  const { data: partners } = useFirestore<Partner>('partners', [orderBy('totalClasses', 'desc')]);

  // Calculate statistics from real data
  const totalRevenue = schedules.reduce((sum, s) => sum + s.fee, 0);
  const paidRevenue = schedules.filter(s => s.paymentDate).reduce((sum, s) => sum + s.fee, 0);
  const unpaidRevenue = totalRevenue - paidRevenue;

  const statusCounts = schedules.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Partner revenue data
  const partnerRevenueData = partners.slice(0, 5).map((p, i) => {
    const colors = ['#00E396', '#FF4560', '#FEB019', '#775DD0', '#008FFB'];
    const partnerSchedules = schedules.filter(s => s.partner === p.name);
    const revenue = partnerSchedules.reduce((sum, s) => sum + s.fee, 0);
    return { name: p.name, value: revenue, color: colors[i] };
  });

  // Partner class count data - Calculate from actual schedules
  const partnerClassCountData = partners.slice(0, 5).map((p, i) => {
    const colors = ['#E0E0E0', '#00E396', '#FEB019', '#FF4560', '#008FFB'];
    const partnerSchedules = schedules.filter(s => s.partner === p.name);
    const classCount = partnerSchedules.length; // Count actual schedules
    return { name: p.name, value: classCount, color: colors[i] };
  });

  // Payment status data
  const paymentStatusData = [
    { name: 'Đã thanh toán', value: paidRevenue, color: '#775DD0' },
    { name: 'Chưa thanh toán', value: unpaidRevenue, color: '#FEB019' },
  ];

  // Teaching status data
  const teachingStatusData = Object.entries(statusCounts).map(([status, count], i) => {
    const colors = ['#00E396', '#FF4560', '#D350F2', '#BDBDBD'];
    return { name: status, value: count as number, color: colors[i] || '#BDBDBD' };
  });

  const DonutChart = ({ data, title }: { data: any[], title: string }) => (
    <div className="bg-surface border border-border-color rounded-xl p-4 flex flex-col h-full">
      <h3 className="text-white font-medium text-sm mb-4">{title}</h3>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#111814', borderColor: '#3b5445', color: '#fff', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ fontSize: '10px', top: '-10px' }}
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <h1 className="text-white text-3xl font-bold mb-6">Thống kê Đối tác</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {/* Summary Stats */}
        <div className="lg:col-span-1 bg-surface border border-border-color rounded-xl p-6 flex flex-col gap-6">
          <h3 className="text-white font-bold text-lg">Tổng cộng {new Date().getFullYear()}</h3>

          <div className="flex flex-col gap-4 text-center mt-4">
            <div>
              <p className="text-text-muted text-xs mb-1">Tổng doanh thu</p>
              <p className="text-white text-xl font-bold">₫{totalRevenue.toLocaleString('vi-VN')}</p>
            </div>

            <div>
              <p className="text-text-muted text-xs mb-1">Số lớp giảng</p>
              <p className="text-white text-2xl font-bold">{schedules.length}</p>
            </div>

            <div>
              <p className="text-text-muted text-xs mb-1">Đối tác</p>
              <p className="text-white text-2xl font-bold">{partners.length}</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <DonutChart data={partnerRevenueData} title="Doanh thu theo đối tác" />
          <DonutChart data={partnerClassCountData} title="Số lớp theo đối tác" />
          <DonutChart data={paymentStatusData} title="Tình trạng thanh toán" />
          <DonutChart data={teachingStatusData} title="Tình trạng giảng dạy" />
        </div>
      </div>

      {/* Empty state or Partner list */}
      {partners.length === 0 ? (
        <div className="bg-surface border border-border-color rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-text-muted mb-4">group</span>
          <p className="text-lg text-white mb-2">Chưa có đối tác nào</p>
          <p className="text-sm text-text-muted">Thêm lịch giảng để tự động tạo đối tác</p>
        </div>
      ) : null}
    </div>
  );
};

// ========================================
// MAIN TEACHING COMPONENT
// ========================================
const Teaching = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full bg-background-dark">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-border-color flex flex-col p-4">
        <div className="mb-6">
          <h2 className="text-white text-xl font-bold px-3">Đào tạo</h2>
        </div>

        <nav className="flex flex-col gap-1">
          <NavLink
            to="/teaching"
            end
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive ? 'bg-surface-light text-primary' : 'text-text-muted hover:bg-surface-light hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xl">calendar_month</span>
            <span className="text-sm font-medium">Lịch giảng</span>
          </NavLink>

          <NavLink
            to="/teaching/partners"
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive ? 'bg-surface-light text-primary' : 'text-text-muted hover:bg-surface-light hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xl">group</span>
            <span className="text-sm font-medium">Đối tác</span>
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<CalendarView />} />
        <Route path="/partners" element={<PartnersDashboard />} />
      </Routes>
    </div>
  );
};

export default Teaching;
