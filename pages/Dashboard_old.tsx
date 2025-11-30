import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const UrgentTaskRow = ({ title, tag, date, status, type }: any) => (
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
              <div className="size-10 rounded-full bg-cover bg-center border border-surface-light" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD68TTe31HOAB6-dH0HNPdMJFBp3RA6J_pS-p_VcJIAFIcEuS8R8z_zDMM35dRi0IOzYaiU7m4Kjnl6UTbyIGXlY2n14aJwVeyJsgXoYm8wciDaCXfK1P5mYt-soyqg76nLp4I-_PDPGG2SVMs-0TaU7IN2QAkCH9YiihzJzJEn-241AYCY_4AJh0mWWyM93zVcJE-wsCmH7wEE_a6GmwsGs9xAhrpFalUVEDLHb1FZ5Xw8gFdI279pLKBps6LzcoL9jt9gmTqv1GKd")'}}></div>
            </div>
        </header>

        <div className="p-8 flex flex-col gap-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    icon="school" 
                    label="Giảng Dạy" 
                    value="15 Lớp" 
                    subValue="+2 so với tháng trước" 
                    subColor="text-[#0bda43]"
                />
                <StatCard 
                    icon="storefront" 
                    label="Kinh Doanh" 
                    value="25.6M đ" 
                    subValue="+15.2% so với tháng trước" 
                    subColor="text-[#0bda43]"
                />
                <StatCard 
                    icon="work" 
                    label="Công Việc" 
                    value="5/12 Hoàn thành" 
                    subValue="Trong tuần này" 
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
                        
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between text-xs font-medium text-text-muted pb-3 border-b border-border-color">
                                <span className="w-1/3 pl-2">Công Việc</span>
                                <span className="w-1/4">Lĩnh Vực</span>
                                <span className="w-1/6">Hạn Chót</span>
                                <span className="w-1/6 text-right pr-2">Tình trạng</span>
                            </div>
                            <UrgentTaskRow title="Chuẩn bị báo cáo quý" tag="Công việc cơ quan" date="25/12/2023" status="Bắt đầu" />
                            <UrgentTaskRow title="Soạn giáo án bài 5 An toàn lao động" tag="Giảng dạy" date="26/12/2023" status="Bắt đầu" />
                            <UrgentTaskRow title="Liên hệ nhà cung cấp chai lọ" tag="Kinh doanh tương ớt" date="27/12/2023" status="Hoàn thành" />
                            <UrgentTaskRow title="Họp kế hoạch Marketing Quý 1" tag="Kinh doanh tương ớt" date="30/12/2023" status="Bắt đầu" />
                            <UrgentTaskRow title="Kiểm tra thiết bị PCCC định kỳ" tag="Giảng dạy" date="03/01/2024" status="Bắt đầu" />
                             <UrgentTaskRow title="Gửi báo giá khóa học mới" tag="Giảng dạy" date="05/01/2024" status="Bắt đầu" />
                        </div>
                        <button className="mt-auto w-full py-3 rounded-lg bg-primary text-background-dark font-bold text-sm hover:bg-opacity-90 transition-colors">
                            Tạo Mới
                        </button>
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
                                Tồn Kho Hiện Tại
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-[300px] flex flex-col gap-1">
                            {activeTab === 'schedule' ? (
                                <>
                                    <ScheduleItem day="THG 12" date="28" title="An toàn điện - Công ty ABC" time="08:00 - 11:30" />
                                    <ScheduleItem day="THG 12" date="29" title="An toàn PCCC - Tòa nhà XYZ" time="14:00 - 16:00" />
                                    <ScheduleItem day="THG 01" date="02" title="Sơ cứu cơ bản - Xưởng may B" time="09:00 - 11:30" />
                                    <ScheduleItem day="THG 01" date="05" title="Huấn luyện ATVSLĐ - Nhà máy X" time="09:00 - 12:00" />
                                    <ScheduleItem day="THG 01" date="08" title="An toàn hóa chất - KCN VSIP" time="08:30 - 16:30" />
                                </>
                            ) : (
                                <div className="flex flex-col gap-4 py-2">
                                     <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-white font-medium text-sm">Tương ớt Bông Ớt - Cay</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-lg font-bold text-white">150</p>
                                                <p className="text-xs text-text-muted">chai</p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-surface-light rounded-full h-2">
                                            <div className="bg-[#fa5538] h-2 rounded-full" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-white font-medium text-sm">Tương ớt Bông Ớt - Siêu Cay</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-lg font-bold text-white">100</p>
                                                <p className="text-xs text-text-muted">chai</p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-surface-light rounded-full h-2">
                                            <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-white font-medium text-sm">Tương ớt Bông Ớt - Tỏi</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-lg font-bold text-white">220</p>
                                                <p className="text-xs text-text-muted">chai</p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-surface-light rounded-full h-2">
                                            <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className="w-full py-2.5 rounded-lg border border-primary/20 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors">
                            Xem thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;