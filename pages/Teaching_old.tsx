
import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Cấu hình Google Calendar API (Thay thế bằng Key của bạn)
const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const API_KEY = 'YOUR_API_KEY';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly";

// Interface cho sự kiện Google
interface GoogleEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  htmlLink: string;
}

// --- Calendar View Components ---

const CalendarView = () => {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [gCalEvents, setGCalEvents] = useState<GoogleEvent[]>([]);
  const [gapiInited, setGapiInited] = useState(false);

  // Khởi tạo GAPI Client
  useEffect(() => {
    const gapi = (window as any).gapi;
    if(!gapi) return;

    gapi.load('client:auth2', () => {
        setGapiInited(true);
    });
  }, []);

  const handleSyncGoogleCalendar = async () => {
    if (!gapiInited) {
        alert("Google API chưa sẵn sàng. Vui lòng thử lại sau giây lát.");
        return;
    }

    setIsSyncing(true);
    const gapi = (window as any).gapi;

    try {
        // 1. Khởi tạo Client
        await gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
        });

        // 2. Đăng nhập
        const authInstance = gapi.auth2.getAuthInstance();
        if (!authInstance.isSignedIn.get()) {
            await authInstance.signIn();
        }

        // 3. Lấy danh sách sự kiện
        const response = await gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 100,
            'orderBy': 'startTime'
        });

        const events = response.result.items;
        setGCalEvents(events);
        setIsConnected(true);
        console.log('Events fetched:', events);

    } catch (error) {
        console.error("Lỗi đồng bộ Google Calendar:", error);
        // Fallback demo nếu không có API Key thực
        alert("Demo Mode: Không thể kết nối API thực (thiếu Key). Đang hiển thị dữ liệu mẫu.");
        setIsConnected(true);
        // Dữ liệu mẫu giả lập từ Google Calendar
        setGCalEvents([
            { id: '1', summary: 'Họp với đối tác', start: { dateTime: new Date(new Date().setDate(5)).toISOString() }, htmlLink: '#' },
            { id: '2', summary: 'Giảng dạy online', start: { dateTime: new Date(new Date().setDate(12)).toISOString() }, htmlLink: '#' },
            { id: '3', summary: 'Kiểm tra an toàn', start: { dateTime: new Date(new Date().setDate(25)).toISOString() }, htmlLink: '#' },
        ]);
    } finally {
        setIsSyncing(false);
    }
  };

  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const dates = Array.from({ length: 35 }, (_, i) => {
    const day = i - 2;
    return day > 0 && day <= 31 ? day : null;
  });

  // Dữ liệu sự kiện nội bộ của app
  const localEvents = [
    { day: 18, color: 'bg-orange-400', title: 'Thiết kế UI/UX' },
    { day: 20, color: 'bg-green-500', title: 'Seminar AI' },
  ];

  // Helper để kiểm tra xem một ngày có sự kiện Google không
  const getGoogleEventForDay = (day: number) => {
    if (!day) return null;
    const today = new Date();
    // Giả sử lịch đang hiển thị tháng hiện tại
    return gCalEvents.find(event => {
        const eventDate = new Date(event.start.dateTime || event.start.date || '');
        return eventDate.getDate() === day && eventDate.getMonth() === today.getMonth();
    });
  }

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 overflow-y-auto">
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex flex-col gap-1">
             <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Lịch Giảng</h1>
             {isConnected && <p className="text-primary text-sm font-medium flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Đã lấy {gCalEvents.length} sự kiện từ G-Calendar</p>}
        </div>
        
        <div className="flex gap-3">
             <button 
                onClick={handleSyncGoogleCalendar}
                disabled={isSyncing}
                className={`flex items-center justify-center gap-2 rounded-lg h-10 px-4 text-sm font-bold border transition-all ${isConnected ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-surface-light bg-surface text-white hover:bg-surface-light'}`}
            >
                {isSyncing ? (
                    <>
                        <span className="material-symbols-outlined animate-spin text-base">refresh</span>
                        Đang tải...
                    </>
                ) : isConnected ? (
                    <>
                         <span className="material-symbols-outlined text-base">cloud_download</span>
                         Cập nhật lại
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-base">calendar_add_on</span>
                        Lấy từ G-Calendar
                    </>
                )}
            </button>
            <button 
            onClick={() => navigate('/teaching/new')}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
            >
            <span className="truncate">Thêm Lịch Giảng Mới</span>
            </button>
        </div>
      </div>

      {/* Segmented Controls */}
      <div className="flex px-0 py-3 mb-4">
        <div className="flex h-10 w-full max-w-sm items-center justify-center rounded-lg bg-surface-light p-1">
          <button className="flex-1 h-full flex items-center justify-center rounded-md bg-background-light dark:bg-surface shadow-sm text-white text-sm font-medium">Tháng</button>
          <button className="flex-1 h-full flex items-center justify-center rounded-md text-text-muted hover:text-white text-sm font-medium">Tuần</button>
          <button className="flex-1 h-full flex items-center justify-center rounded-md text-text-muted hover:text-white text-sm font-medium">Ngày</button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Calendar */}
        <div className="flex-1 flex flex-col">
          {/* Calendar Picker Header */}
          <div className="flex items-center justify-center gap-6 mb-6">
             <button className="flex size-10 items-center justify-center rounded-full hover:bg-surface-light text-white"><span className="material-symbols-outlined">chevron_left</span></button>
             <p className="text-white text-base font-bold">Tháng {new Date().getMonth() + 1} {new Date().getFullYear()}</p>
             <button className="flex size-10 items-center justify-center rounded-full hover:bg-surface-light text-white"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>

          <div className="flex-1 border border-border-color rounded-xl bg-surface p-6">
             <div className="grid grid-cols-7 mb-4">
                {days.map(d => (
                  <div key={d} className="text-text-muted text-[13px] font-bold text-center h-12 flex items-center justify-center">{d}</div>
                ))}
             </div>
             <div className="grid grid-cols-7 gap-y-2">
                {dates.map((d, i) => {
                  const localEvent = localEvents.find(e => e.day === d);
                  const gEvent = d ? getGoogleEventForDay(d) : null;
                  
                  return (
                    <div key={i} className="flex justify-center h-12">
                      {d && (
                        <div className={`size-full max-w-[48px] max-h-[48px] rounded-full flex items-center justify-center text-sm font-medium relative hover:bg-surface-light/50 cursor-pointer transition-colors ${d === 5 ? 'bg-primary text-background-dark' : 'text-white'}`}>
                          {d}
                          {/* Dấu chấm cho sự kiện nội bộ */}
                          {localEvent && d !== 5 && (
                             <div className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 size-1 rounded-full ${localEvent.color}`}></div>
                          )}
                          {/* Dấu chấm cho sự kiện Google (Màu xanh dương) */}
                          {gEvent && d !== 5 && (
                             <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-blue-500 ring-2 ring-surface" title={gEvent.summary}></div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
             </div>
             
             {/* Legend */}
             <div className="mt-6 flex gap-4 justify-center text-xs text-text-muted">
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-blue-500"></span> Google Calendar</div>
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-primary"></span> Hôm nay</div>
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-orange-400"></span> Lịch App</div>
             </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-surface rounded-xl p-6 border border-border-color h-full">
            <h3 className="text-white text-lg font-bold leading-tight mb-4">Lọc theo trạng thái</h3>
            <div className="space-y-4 mb-6">
               <label className="flex items-center gap-3 cursor-pointer">
                 <input type="checkbox" className="form-checkbox rounded bg-surface-light border-border-color text-primary focus:ring-primary/50" defaultChecked />
                 <div className="flex items-center gap-2 text-sm text-gray-300">
                   <span className="size-2 rounded-full bg-blue-500"></span> Đã ký hợp đồng
                 </div>
               </label>
               <label className="flex items-center gap-3 cursor-pointer">
                 <input type="checkbox" className="form-checkbox rounded bg-surface-light border-border-color text-primary focus:ring-primary/50" />
                 <div className="flex items-center gap-2 text-sm text-gray-300">
                   <span className="size-2 rounded-full bg-orange-400"></span> Chuẩn bị
                 </div>
               </label>
               <label className="flex items-center gap-3 cursor-pointer">
                 <input type="checkbox" className="form-checkbox rounded bg-surface-light border-border-color text-primary focus:ring-primary/50" />
                 <div className="flex items-center gap-2 text-sm text-gray-300">
                   <span className="size-2 rounded-full bg-green-500"></span> Đã giảng
                 </div>
               </label>
            </div>

            <hr className="border-border-color my-6" />

            <h3 className="text-white text-lg font-bold leading-tight mb-4">Sự kiện hôm nay (3)</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-background-dark border border-transparent hover:border-primary/30 cursor-pointer transition-colors">
                <p className="font-bold text-gray-100">Lập trình ReactJS Nâng cao</p>
                <p className="text-sm text-text-muted mt-1">08:00 - 11:30</p>
                <p className="text-sm text-text-muted">Đại học FPT</p>
                <div className="flex items-center gap-2 mt-2">
                   <span className="size-2 rounded-full bg-blue-500"></span>
                   <span className="text-xs font-medium text-blue-500">Đã ký hợp đồng</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background-dark border border-transparent hover:border-primary/30 cursor-pointer transition-colors">
                <p className="font-bold text-gray-100">Thiết kế UI/UX cho Web</p>
                <p className="text-sm text-text-muted mt-1">13:30 - 17:00</p>
                <p className="text-sm text-text-muted">MindX</p>
                <div className="flex items-center gap-2 mt-2">
                   <span className="size-2 rounded-full bg-orange-400"></span>
                   <span className="text-xs font-medium text-orange-400">Chuẩn bị</span>
                </div>
              </div>
            </div>
            
            {/* Google Events List in Sidebar */}
            {gCalEvents.length > 0 && (
                <>
                    <hr className="border-border-color my-6" />
                    <h3 className="text-white text-lg font-bold leading-tight mb-4">Từ Google Calendar</h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {gCalEvents.slice(0, 5).map((e: GoogleEvent) => (
                            <a href={e.htmlLink} target="_blank" rel="noreferrer" key={e.id} className="block p-3 rounded-lg bg-surface-light/30 border border-transparent hover:border-blue-500/50 cursor-pointer transition-colors">
                                <p className="font-medium text-white text-sm truncate">{e.summary}</p>
                                <p className="text-xs text-text-muted mt-1">
                                    {new Date(e.start.dateTime || e.start.date || '').toLocaleDateString('vi-VN')}
                                </p>
                            </a>
                        ))}
                    </div>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Add Schedule Form Component ---

const AddScheduleView = () => {
    const navigate = useNavigate();
    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Thêm Lịch Giảng An Toàn Lao Động</h1>
                    <p className="text-text-muted text-base font-normal leading-normal mt-2">Điền các thông tin dưới đây để tạo một lịch giảng mới.</p>
                </div>
                
                <div className="flex flex-col gap-8">
                    {/* Basic Info */}
                    <div>
                        <h3 className="text-white text-lg font-bold leading-tight mb-4">Thông tin cơ bản</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <label className="flex flex-col w-full">
                                <p className="text-white text-base font-medium pb-2">Ngày giảng</p>
                                <div className="relative flex w-full items-stretch rounded-lg">
                                    <input className="flex w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-color bg-surface-light focus:border-primary h-14 placeholder:text-text-muted pl-4 pr-12 text-base font-normal" placeholder="Chọn ngày" type="date" />
                                    <div className="absolute right-0 top-0 h-full flex items-center justify-center pr-4 text-text-muted pointer-events-none">
                                        <span className="material-symbols-outlined">calendar_today</span>
                                    </div>
                                </div>
                            </label>
                            <label className="flex flex-col w-full">
                                <p className="text-white text-base font-medium pb-2">Địa điểm</p>
                                <div className="relative flex w-full items-stretch rounded-lg">
                                    <input className="flex w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-color bg-surface-light focus:border-primary h-14 placeholder:text-text-muted pl-4 pr-12 text-base font-normal" placeholder="Nhập địa điểm" type="text" />
                                    <div className="absolute right-0 top-0 h-full flex items-center justify-center pr-4 text-text-muted pointer-events-none">
                                        <span className="material-symbols-outlined">location_on</span>
                                    </div>
                                </div>
                            </label>
                            <label className="flex flex-col w-full">
                                <p className="text-white text-base font-medium pb-2">Thời gian bắt đầu</p>
                                <input className="flex w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-color bg-surface-light focus:border-primary h-14 placeholder:text-text-muted px-4 text-base font-normal" type="time" defaultValue="08:30"/>
                            </label>
                            <label className="flex flex-col w-full">
                                <p className="text-white text-base font-medium pb-2">Thời gian kết thúc</p>
                                <input className="flex w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-color bg-surface-light focus:border-primary h-14 placeholder:text-text-muted px-4 text-base font-normal" type="time" defaultValue="16:30"/>
                            </label>
                            <label className="flex flex-col w-full">
                                <p className="text-white text-base font-medium pb-2">Đối tác thuê</p>
                                <div className="relative flex w-full items-stretch rounded-lg">
                                    <input className="flex w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-color bg-surface-light focus:border-primary h-14 placeholder:text-text-muted pl-4 pr-12 text-base font-normal" placeholder="Tìm hoặc nhập tên đối tác" type="text"/>
                                    <div className="absolute right-0 top-0 h-full flex items-center justify-center pr-4 text-text-muted pointer-events-none">
                                        <span className="material-symbols-outlined">search</span>
                                    </div>
                                </div>
                            </label>
                            <label className="flex flex-col w-full">
                                <p className="text-white text-base font-medium pb-2">Công ty trực tiếp giảng</p>
                                <div className="relative flex w-full items-stretch rounded-lg">
                                    <input className="flex w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-color bg-surface-light focus:border-primary h-14 placeholder:text-text-muted pl-4 pr-12 text-base font-normal" placeholder="Tìm hoặc nhập tên công ty" type="text"/>
                                    <div className="absolute right-0 top-0 h-full flex items-center justify-center pr-4 text-text-muted pointer-events-none">
                                        <span className="material-symbols-outlined">business</span>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Student Info */}
                    <div>
                         <h3 className="text-white text-lg font-bold leading-tight mb-4">Thông tin học viên</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <label className="flex flex-col w-full">
                                <p className="text-white text-base font-medium pb-2">Đối tượng học viên</p>
                                <div className="relative flex w-full items-stretch rounded-lg">
                                    <input className="flex w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-color bg-surface-light focus:border-primary h-14 placeholder:text-text-muted pl-4 pr-12 text-base font-normal" placeholder="VD: Công nhân sản xuất" type="text"/>
                                    <div className="absolute right-0 top-0 h-full flex items-center justify-center pr-4 text-text-muted pointer-events-none">
                                        <span className="material-symbols-outlined">badge</span>
                                    </div>
                                </div>
                            </label>
                            <label className="flex flex-col w-full">
                                <p className="text-white text-base font-medium pb-2">Số lượng học viên</p>
                                <div className="relative flex w-full items-stretch rounded-lg">
                                    <input className="flex w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-color bg-surface-light focus:border-primary h-14 placeholder:text-text-muted pl-4 pr-12 text-base font-normal" placeholder="Nhập số lượng" type="number"/>
                                    <div className="absolute right-0 top-0 h-full flex items-center justify-center pr-4 text-text-muted pointer-events-none">
                                        <span className="material-symbols-outlined">groups</span>
                                    </div>
                                </div>
                            </label>
                         </div>
                    </div>

                    {/* Financial Info */}
                    <div>
                        <h3 className="text-white text-lg font-bold leading-tight mb-4">Thông tin tài chính</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <label className="flex flex-col w-full">
                                <p className="text-white text-base font-medium pb-2">Kinh phí giảng</p>
                                <div className="relative flex w-full items-stretch rounded-lg">
                                    <input className="flex w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-color bg-surface-light focus:border-primary h-14 placeholder:text-text-muted pl-4 pr-12 text-base font-normal" placeholder="Nhập số tiền" type="text"/>
                                    <div className="absolute right-0 top-0 h-full flex items-center justify-center pr-4 text-text-muted pointer-events-none">
                                        <span className="material-symbols-outlined">payments</span>
                                    </div>
                                </div>
                            </label>
                            <label className="flex flex-col w-full">
                                <p className="text-white text-base font-medium pb-2">Ngày thanh toán</p>
                                <div className="relative flex w-full items-stretch rounded-lg">
                                    <input className="flex w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-color bg-surface-light focus:border-primary h-14 placeholder:text-text-muted pl-4 pr-12 text-base font-normal" placeholder="Chọn ngày" type="date"/>
                                    <div className="absolute right-0 top-0 h-full flex items-center justify-center pr-4 text-text-muted pointer-events-none">
                                        <span className="material-symbols-outlined">event</span>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                     {/* Settings */}
                     <div>
                        <h3 className="text-white text-lg font-bold leading-tight mb-4">Thiết lập</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                             <label className="flex flex-col w-full">
                                <p className="text-white text-base font-medium pb-2">Trạng thái ban đầu</p>
                                <div className="relative w-full">
                                    <select className="appearance-none w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-color bg-surface-light focus:border-primary h-14 placeholder:text-text-muted px-4 text-base font-normal">
                                        <option>Chuẩn bị</option>
                                        <option>Đã xác nhận</option>
                                        <option>Tạm hoãn</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-muted">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                </div>
                            </label>
                            <div className="flex flex-col w-full">
                                <p className="text-white text-base font-medium pb-2">Nhắc lịch</p>
                                <div className="flex items-center gap-4 h-14">
                                     <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="reminder" className="form-radio bg-surface-light border-border-color text-primary focus:ring-primary/50" />
                                        <span className="text-white text-base">1 ngày</span>
                                     </label>
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="reminder" className="form-radio bg-surface-light border-border-color text-primary focus:ring-primary/50" defaultChecked />
                                        <span className="text-white text-base">2 ngày</span>
                                     </label>
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="reminder" className="form-radio bg-surface-light border-border-color text-primary focus:ring-primary/50" />
                                        <span className="text-white text-base">3 ngày</span>
                                     </label>
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="reminder" className="form-radio bg-surface-light border-border-color text-primary focus:ring-primary/50" />
                                        <span className="text-text-muted text-base">Không</span>
                                     </label>
                                </div>
                            </div>
                             <div className="flex items-center w-full md:col-span-2 gap-3 p-4 border border-border-color bg-surface-light/30 rounded-lg">
                                <div className="flex items-center h-5">
                                    <input id="google-calendar-sync" type="checkbox" className="form-checkbox h-5 w-5 rounded bg-surface border-border-color text-primary focus:ring-primary/50" />
                                </div>
                                <label htmlFor="google-calendar-sync" className="flex flex-col cursor-pointer">
                                    <span className="text-white font-medium flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">calendar_month</span>
                                        Tạo sự kiện trên Google Calendar
                                    </span>
                                    <span className="text-xs text-text-muted">Tự động thêm sự kiện này vào Google Calendar của bạn sau khi lưu</span>
                                </label>
                            </div>
                             <label className="flex flex-col w-full md:col-span-2">
                                <p className="text-white text-base font-medium pb-2">Ghi chú (Tùy chọn)</p>
                                <textarea className="w-full min-h-28 resize-y rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-color bg-surface-light focus:border-primary placeholder:text-text-muted p-4 text-base font-normal" placeholder="Thêm ghi chú hoặc thông tin bổ sung..."></textarea>
                            </label>
                        </div>
                     </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border-color">
                    <button onClick={() => navigate('/teaching')} className="px-6 py-3 rounded-lg text-base font-semibold text-white bg-transparent hover:bg-surface-light transition-colors">Hủy bỏ</button>
                    <button onClick={() => navigate('/teaching')} className="px-8 py-3 rounded-lg text-base font-semibold text-background-dark bg-primary hover:bg-opacity-90 transition-colors">Lưu Lịch Giảng</button>
                </div>
            </div>
        </div>
    )
}

// --- Partners Dashboard & List Component ---

const PartnersDashboard = () => {
    // Mock Data for Charts
    const partnerRevenueData = [
        { name: 'VNEdu', value: 30, color: '#00E396' },
        { name: 'AT green', value: 25, color: '#FF4560' },
        { name: 'AT mien Nam', value: 20, color: '#FEB019' },
        { name: 'AT VNB', value: 15, color: '#775DD0' },
        { name: 'ESC', value: 10, color: '#008FFB' },
    ];

    const partnerClassCountData = [
        { name: 'Partner A', value: 37, color: '#E0E0E0' },
        { name: 'Partner B', value: 31, color: '#00E396' },
        { name: 'Partner C', value: 11, color: '#FEB019' },
        { name: 'Partner D', value: 8, color: '#FF4560' },
        { name: 'Partner E', value: 7, color: '#008FFB' },
    ];

    const paymentStatusData = [
        { name: 'Đã thanh toán', value: 185700000, color: '#775DD0' },
        { name: 'Chưa thanh toán', value: 0, color: '#FEB019' }, // Example with 0 to show dominant color
    ];
    
    const teachingStatusData = [
        { name: 'Đã giảng', value: 37, color: '#00E396' }, // Reusing green for "Done"
        { name: 'Chưa giảng', value: 2, color: '#FF4560' },
        { name: 'Đang xếp', value: 9, color: '#D350F2' }, // Purple/Pink
        { name: 'Khác', value: 6, color: '#BDBDBD' },
    ];


    const DonutChart = ({ data, title, centerText }: { data: any[], title: string, centerText?: string }) => (
        <div className="bg-surface border border-border-color rounded-xl p-4 flex flex-col h-full relative">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium text-sm">{title}</h3>
                <div className="flex gap-1">
                   <button className="p-1 hover:bg-surface-light rounded text-text-muted"><span className="material-symbols-outlined text-sm">add</span></button>
                   <button className="p-1 hover:bg-surface-light rounded text-text-muted"><span className="material-symbols-outlined text-sm">open_in_full</span></button>
                </div>
            </div>
            <div className="flex-1 min-h-[200px] relative">
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
                {/* Center Text Overlay */}
                {centerText && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-6">
                        <span className="text-white text-xs font-bold text-center opacity-80 max-w-[80px]">{centerText}</span>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
             {/* Left Column: Summary Stats */}
             <div className="lg:col-span-1 bg-surface border border-border-color rounded-xl p-6 flex flex-col gap-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">Tổng cộng 2025</h3>
                    <div className="flex gap-2">
                        <button className="p-1 hover:bg-surface-light rounded text-text-muted"><span className="material-symbols-outlined text-sm">delete</span></button>
                         <button className="p-1 bg-primary text-background-dark rounded text-xs font-bold px-2">Edit</button>
                    </div>
                 </div>
                 
                 <div className="flex flex-col gap-4 text-center mt-4">
                    <div>
                        <p className="text-text-muted text-xs mb-1">Tổng chi phí 2025</p>
                        <p className="text-white text-xl font-bold">₫185.700.000</p>
                    </div>
                    <div>
                         <p className="text-text-muted text-xs mb-1">Tổng số lớp 2025</p>
                        <p className="text-white text-xl font-bold">117</p>
                    </div>
                    <div>
                         <p className="text-text-muted text-xs mb-1">Trung bình tháng</p>
                        <p className="text-white text-xl font-bold">₫15.475.000</p>
                    </div>
                 </div>
             </div>

             {/* Right Column: Charts Grid */}
             <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <DonutChart data={partnerRevenueData} title="Chi phí đối tác" />
                <DonutChart data={partnerClassCountData} title="Đếm lớp đối tác" />
                <DonutChart 
                    data={paymentStatusData} 
                    title="Thanh toán" 
                    centerText="185700000"
                />
                <DonutChart data={teachingStatusData} title="Đã giảng?" />
             </div>
        </div>
    );
};

const PartnersView = () => {
    return (
        <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
             <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-white">Đối tác & Đơn vị thuê giảng</h1>
                    <p className="text-base font-normal leading-normal text-text-muted">Quản lý danh sách đối tác và đơn vị thuê giảng cho module Giảng Dạy.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/5">
                        <span className="material-symbols-outlined text-2xl">search</span>
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/5">
                        <span className="material-symbols-outlined text-2xl">filter_list</span>
                    </button>
                    <button className="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold leading-normal tracking-[0.015em] text-[#111814]">
                        <span className="material-symbols-outlined">add</span>
                        <span className="truncate">Thêm đối tác</span>
                    </button>
                </div>
            </div>

            {/* Dashboard Section */}
            <PartnersDashboard />

            <div className="rounded-xl border border-border-color bg-surface overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left text-sm text-text-muted">
                        <thead className="border-b border-border-color text-xs uppercase text-gray-400 bg-surface-light/30">
                            <tr>
                                <th className="px-6 py-4" scope="col">Tên đơn vị</th>
                                <th className="px-6 py-4" scope="col">Người liên hệ</th>
                                <th className="px-6 py-4" scope="col">SĐT & Email</th>
                                <th className="px-6 py-4" scope="col">Lịch sử thuê giảng</th>
                                <th className="px-6 py-4" scope="col">Ghi chú</th>
                                <th className="px-6 py-4" scope="col"><span className="sr-only">Hành động</span></th>
                            </tr>
                        </thead>
                         <tbody>
                            <tr className="border-b border-border-color hover:bg-surface-light/30 transition-colors">
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-white">Công ty TNHH An Phát</td>
                                <td className="px-6 py-4">Nguyễn Văn An</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <p>090 123 4567</p>
                                        <p className="text-xs text-text-muted">an.nguyen@anphat.com</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20">5 buổi</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base text-yellow-500 filled">star</span>
                                        <span className="text-sm font-medium text-white">Đối tác ưu tiên</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="h-8 w-8 rounded-lg text-gray-400 hover:bg-surface-light hover:text-white">
                                        <span className="material-symbols-outlined text-xl">more_vert</span>
                                    </button>
                                </td>
                            </tr>
                            {/* More rows */}
                         </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const Teaching = () => {
  return (
    <Routes>
      <Route path="/" element={<CalendarView />} />
      <Route path="/new" element={<AddScheduleView />} />
      <Route path="/partners" element={<PartnersView />} />
    </Routes>
  );
};

export default Teaching;
