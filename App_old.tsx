import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Teaching from './pages/Teaching';
import Tasks from './pages/Tasks';
import Business from './pages/Business';

const SidebarItem = ({ to, icon, label, exact = false, onClick }: { to: string, icon: string, label: string, exact?: boolean, onClick?: () => void }) => {
  return (
    <NavLink
      to={to}
      end={exact}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-surface-light text-white font-medium shadow-sm' 
            : 'text-text-muted hover:bg-surface-light hover:text-white'
        }`
      }
    >
      <span className={`material-symbols-outlined ${label === 'Dashboard' ? 'filled' : ''}`}>{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Đóng sidebar khi chuyển trang trên mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex min-h-screen w-full font-sans bg-background-dark text-white selection:bg-primary selection:text-surface">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-surface border-r border-surface-light flex flex-col z-30 transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-5 flex items-center gap-3 border-b border-surface-light/50">
          <div className="size-10 rounded-full bg-cover bg-center border border-surface-light" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAmZpUgGfd7Legdf17rJjnGGHoQPk4KMdf7WM6krYmuDy3WIPDA5b-xewr-_vdUNUFqhfhO2A6zkWFv7RyBzvxizlgooDZAaBWwHsUykyDNooqp71QonUkJaYocVf6z532gpDJ9etGBcgdjlddMP2iQLwF3btNYVXrkFB_eNJS4tz-eK7oGnhAz56u0bfRd-ht3NCpWE_YhkIWd5uknJ4ULymIn0WHyVkETYN3Af_Y7eHCmFzJBpawmpcMvQz4iIYTG-pm79Y5h38WJ")'}}></div>
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-white leading-tight">Giảng viên A</h2>
            <p className="text-xs text-text-muted">quanly@email.com</p>
          </div>
          <button 
            className="ml-auto lg:hidden text-text-muted"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto">
          <SidebarItem to="/" icon="dashboard" label="Dashboard" exact />
          
          <div className="my-2 border-t border-surface-light/30"></div>
          <p className="px-3 text-[10px] font-bold text-text-muted/70 uppercase tracking-wider mb-1 mt-2">Đào Tạo</p>
          <SidebarItem to="/teaching" icon="calendar_month" label="Lịch Giảng" />
          <SidebarItem to="/teaching/partners" icon="handshake" label="Đối Tác Thuê" />

          <div className="my-2 border-t border-surface-light/30"></div>
           <p className="px-3 text-[10px] font-bold text-text-muted/70 uppercase tracking-wider mb-1 mt-2">Cơ Quan</p>
          <SidebarItem to="/tasks" icon="business_center" label="Công Việc Cơ Quan" />
          
          <div className="my-2 border-t border-surface-light/30"></div>
           <p className="px-3 text-[10px] font-bold text-text-muted/70 uppercase tracking-wider mb-1 mt-2">Kinh Doanh (Bông Ớt)</p>
          <SidebarItem to="/business/revenue" icon="bar_chart" label="Báo Cáo" />
          <SidebarItem to="/business/products" icon="inventory_2" label="Sản Phẩm" />
          <SidebarItem to="/business/customers" icon="groups" label="Khách Hàng" />
          
           <div className="my-4 border-t border-surface-light/50"></div>
           <SidebarItem to="/settings" icon="settings" label="Cài Đặt" />
        </div>

        <div className="p-4 border-t border-surface-light/50 mt-auto flex flex-col gap-1">
          <button className="flex items-center gap-3 text-text-muted hover:text-white transition-colors w-full px-3 py-2 hover:bg-surface-light rounded-lg">
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span className="text-sm font-medium">Trợ giúp</span>
          </button>
          <button className="flex items-center gap-3 text-text-muted hover:text-white transition-colors w-full px-3 py-2 hover:bg-surface-light rounded-lg">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden relative">
         {/* Mobile Header Toggle */}
         <div className="lg:hidden flex items-center p-4 border-b border-surface-light bg-background-dark">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-white rounded-lg hover:bg-surface-light"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="ml-3 font-bold text-lg">Quản Lý Tổng Hợp</span>
         </div>
         
         <div className="flex-1 overflow-y-auto">
            {children}
         </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teaching/*" element={<Teaching />} />
          <Route path="/tasks/*" element={<Tasks />} />
          <Route path="/business/*" element={<Business />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;