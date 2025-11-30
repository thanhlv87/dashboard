import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProductsView = () => {
    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">Quản lý Sản phẩm Tương Ớt</h1>
                    <p className="text-text-muted text-base font-normal leading-normal">Xem, thêm, và quản lý tất cả sản phẩm của bạn tại một nơi.</p>
                </div>
                <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-wide hover:opacity-90 transition-opacity">
                    <span className="material-symbols-outlined">add</span>
                    <span className="truncate">Thêm Sản phẩm</span>
                </button>
            </div>

             <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-grow">
                     <label className="flex flex-col min-w-40 h-12 w-full">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                            <div className="text-text-muted flex bg-surface-light items-center justify-center pl-4 rounded-l-lg border border-surface-light border-r-0">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 bg-surface-light border border-surface-light h-full placeholder:text-text-muted px-4 text-base font-normal leading-normal" placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."/>
                        </div>
                    </label>
                </div>
                <div className="flex gap-3 items-center">
                    <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-surface-light px-4 border border-surface-light hover:bg-surface-light/80 transition-colors">
                        <p className="text-white text-sm font-medium leading-normal">Tình trạng tồn kho</p>
                        <span className="material-symbols-outlined text-text-muted">expand_more</span>
                    </button>
                     <button className="p-3.5 flex items-center justify-center h-12 rounded-lg bg-surface-light text-white border border-surface-light hover:bg-surface-light/80 transition-colors">
                        <span className="material-symbols-outlined">download</span>
                    </button>
                </div>
             </div>

             <div className="bg-surface rounded-xl border border-surface-light overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-muted">
                         <thead className="text-xs text-gray-400 uppercase bg-surface-light/30">
                            <tr>
                                <th className="p-4 w-4"><input type="checkbox" className="rounded bg-surface-light border-gray-600 text-primary focus:ring-primary/50" /></th>
                                <th className="px-6 py-3">Sản phẩm</th>
                                <th className="px-6 py-3">Mã SKU</th>
                                <th className="px-6 py-3">Giá bán</th>
                                <th className="px-6 py-3">Tồn kho</th>
                                <th className="px-6 py-3">Hạn sử dụng</th>
                                <th className="px-6 py-3">Trạng thái</th>
                                <th className="px-6 py-3 text-right">Hành động</th>
                            </tr>
                        </thead>
                         <tbody>
                            <tr className="border-b border-surface-light hover:bg-surface-light/30">
                                <td className="p-4"><input type="checkbox" className="rounded bg-surface-light border-gray-600 text-primary focus:ring-primary/50" /></td>
                                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 bg-cover bg-center" style={{backgroundImage: 'url(https://picsum.photos/id/1/50/50)'}}></div>
                                    Tương Ớt Chai 330ml
                                </td>
                                <td className="px-6 py-4">TOB-330ML</td>
                                <td className="px-6 py-4">50.000 VNĐ</td>
                                <td className="px-6 py-4">1.250</td>
                                <td className="px-6 py-4">12/12/2025</td>
                                <td className="px-6 py-4"><div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>Còn hàng</div></td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 hover:text-primary"><span className="material-symbols-outlined text-base">edit</span></button>
                                        <button className="p-2 hover:text-red-500"><span className="material-symbols-outlined text-base">delete</span></button>
                                    </div>
                                </td>
                            </tr>
                             <tr className="bg-yellow-500/10 border-b border-surface-light hover:bg-yellow-500/20">
                                <td className="p-4"><input type="checkbox" className="rounded bg-surface-light border-gray-600 text-primary focus:ring-primary/50" /></td>
                                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-lg bg-white/10 bg-cover bg-center" style={{backgroundImage: 'url(https://picsum.photos/id/2/50/50)'}}></div>
                                    Combo Gia Đình (3 chai)
                                </td>
                                <td className="px-6 py-4">TOB-COMBO3</td>
                                <td className="px-6 py-4">150.000 VNĐ</td>
                                <td className="px-6 py-4 text-yellow-400 font-bold">45</td>
                                <td className="px-6 py-4 text-yellow-400 font-bold">25/08/2024</td>
                                <td className="px-6 py-4"><div className="flex items-center gap-2 text-yellow-300"><div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>Sắp hết hàng</div></td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 hover:text-primary"><span className="material-symbols-outlined text-base">edit</span></button>
                                        <button className="p-2 hover:text-red-500"><span className="material-symbols-outlined text-base">delete</span></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
    )
}

const RevenueView = () => {
    const chartData = [
        { name: 'T1', uv: 4000 }, { name: 'T2', uv: 3000 }, { name: 'T3', uv: 2000 }, { name: 'T4', uv: 2780 },
        { name: 'T5', uv: 1890 }, { name: 'T6', uv: 2390 }, { name: 'T7', uv: 3490 }, { name: 'T8', uv: 4200 },
    ];

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-white">Doanh thu & Lợi nhuận: Tương Ớt Bông Ớt</h1>
                    <p className="text-base font-normal leading-normal text-text-muted">Phân tích hiệu suất kinh doanh theo thời gian.</p>
                </div>
                 <div className="flex items-center gap-2">
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/5">
                        <span className="material-symbols-outlined text-2xl">download</span>
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/5">
                        <span className="material-symbols-outlined text-2xl">print</span>
                    </button>
                    <button className="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold leading-normal tracking-[0.015em] text-[#111814]">
                        <span className="material-symbols-outlined text-xl">add</span>
                        <span className="truncate">Tạo báo cáo mới</span>
                    </button>
                </div>
            </div>

             <div className="flex flex-wrap items-center gap-3 mb-6">
                <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-surface-light px-4">
                    <p className="text-sm font-medium leading-normal text-white">Hôm nay</p>
                </button>
                <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 hover:bg-white/5">
                    <p className="text-sm font-medium leading-normal text-text-muted">Tuần này</p>
                </button>
                <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 hover:bg-white/5">
                    <p className="text-sm font-medium leading-normal text-text-muted">Tháng này</p>
                </button>
                 <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 hover:bg-white/5">
                    <p className="text-sm font-medium leading-normal text-text-muted">Tùy chỉnh</p>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <div className="flex flex-1 flex-col gap-2 rounded-xl bg-surface p-6 border border-border-color">
                    <p className="text-base font-medium leading-normal text-white">Tổng Doanh thu</p>
                    <p className="text-2xl font-bold leading-tight tracking-tight text-white">1,2 tỷ ₫</p>
                    <p className="text-base font-medium leading-normal text-[#0bda43]">+5.2%</p>
                </div>
                 <div className="flex flex-1 flex-col gap-2 rounded-xl bg-surface p-6 border border-border-color">
                    <p className="text-base font-medium leading-normal text-white">Giá vốn</p>
                    <p className="text-2xl font-bold leading-tight tracking-tight text-white">450 triệu ₫</p>
                    <p className="text-base font-medium leading-normal text-[#0bda43]">+2.1%</p>
                </div>
                 <div className="flex flex-1 flex-col gap-2 rounded-xl bg-surface p-6 border border-border-color">
                    <p className="text-base font-medium leading-normal text-white">Chi phí</p>
                    <p className="text-2xl font-bold leading-tight tracking-tight text-white">120 triệu ₫</p>
                    <p className="text-base font-medium leading-normal text-[#fa5538]">-1.5%</p>
                </div>
                 <div className="flex flex-1 flex-col gap-2 rounded-xl bg-surface p-6 border border-border-color">
                    <p className="text-base font-medium leading-normal text-white">Lợi nhuận</p>
                    <p className="text-2xl font-bold leading-tight tracking-tight text-white">630 triệu ₫</p>
                    <p className="text-base font-medium leading-normal text-[#0bda43]">+8.7%</p>
                </div>
            </div>

            <div className="rounded-xl border border-border-color bg-surface p-6 mb-6 h-[400px]">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Doanh thu & Lợi nhuận theo thời gian</h3>
                 </div>
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                         <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#13ec6d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#13ec6d" stopOpacity={0}/>
                        </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#9db9a8" tickLine={false} axisLine={false} />
                        <YAxis stroke="#9db9a8" tickLine={false} axisLine={false} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#28392f" />
                        <Tooltip contentStyle={{ backgroundColor: '#111814', borderColor: '#3b5445', color: '#fff' }} />
                        <Area type="monotone" dataKey="uv" stroke="#13ec6d" fillOpacity={1} fill="url(#colorUv)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

             <div className="rounded-xl border border-border-color bg-surface">
                 <div className="p-6">
                    <h3 className="text-lg font-bold text-white">Doanh thu chi tiết</h3>
                </div>
                <div className="relative w-full overflow-x-auto">
                    <table className="w-full text-left text-sm text-text-muted">
                        <thead className="border-b border-border-color text-xs uppercase text-gray-400">
                             <tr>
                                <th className="px-6 py-3" scope="col">Ngày</th>
                                <th className="px-6 py-3" scope="col">Mã sản phẩm</th>
                                <th className="px-6 py-3" scope="col">Tên sản phẩm</th>
                                <th className="px-6 py-3 text-right" scope="col">Số lượng bán</th>
                                <th className="px-6 py-3 text-right" scope="col">Doanh thu</th>
                                <th className="px-6 py-3 text-right" scope="col">Giá vốn</th>
                                <th className="px-6 py-3 text-right" scope="col">Lợi nhuận</th>
                            </tr>
                        </thead>
                         <tbody>
                            <tr className="border-b border-border-color">
                                <td className="px-6 py-4">01/08/2023</td>
                                <td className="px-6 py-4">SP001</td>
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-white">Tương ớt cay nồng</td>
                                <td className="px-6 py-4 text-right">150</td>
                                <td className="px-6 py-4 text-right">15.000.000 ₫</td>
                                <td className="px-6 py-4 text-right">5.250.000 ₫</td>
                                <td className="px-6 py-4 text-right font-medium text-primary">9.750.000 ₫</td>
                            </tr>
                             <tr className="border-b border-border-color">
                                <td className="px-6 py-4">01/08/2023</td>
                                <td className="px-6 py-4">SP002</td>
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-white">Tương ớt siêu cay</td>
                                <td className="px-6 py-4 text-right">80</td>
                                <td className="px-6 py-4 text-right">9.600.000 ₫</td>
                                <td className="px-6 py-4 text-right">3.840.000 ₫</td>
                                <td className="px-6 py-4 text-right font-medium text-primary">5.760.000 ₫</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

const CustomersView = () => {
    return (
        <div className="flex-1 p-8 overflow-y-auto">
             <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-col gap-2">
                    <p className="text-3xl font-bold leading-tight tracking-tight text-white">Khách hàng</p>
                    <p className="text-base font-normal leading-normal text-text-muted">Quản lý danh sách khách hàng của Tương Ớt Bông Ớt.</p>
                </div>
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 gap-2 bg-primary px-4 text-sm font-bold leading-normal tracking-[0.015em] text-[#111814] hover:opacity-90">
                    <span className="material-symbols-outlined text-base">add</span>
                    <span className="truncate">Thêm Khách Hàng</span>
                </button>
            </div>

             <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex-1">
                    <label className="flex flex-col h-12 w-full max-w-md">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                            <div className="flex items-center justify-center rounded-l-lg border-y border-l border-surface-light bg-surface-light pl-4 text-text-muted">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg border border-surface-light bg-surface-light px-4 text-base font-normal leading-normal text-white placeholder:text-text-muted focus:border-primary/50 focus:ring-primary/50" placeholder="Tìm kiếm theo tên, SĐT..." />
                        </div>
                    </label>
                </div>
                <div className="flex items-center gap-2">
                     <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-surface-light bg-surface-light text-white hover:bg-white/10">
                        <span className="material-symbols-outlined">download</span>
                    </button>
                    <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-surface-light bg-surface-light text-white hover:bg-white/10">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>
            </div>

             <div className="flex flex-wrap gap-3 mb-6">
                <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 px-3">
                    <p className="text-sm font-medium leading-normal text-white">Tất cả</p>
                </button>
                <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-light px-3 hover:bg-white/10">
                    <p className="text-sm font-medium leading-normal text-white">Khách quen</p>
                </button>
                 <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-light px-3 hover:bg-white/10">
                    <p className="text-sm font-medium leading-normal text-white">Khách sỉ</p>
                </button>
                 <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-light px-3 hover:bg-white/10">
                    <p className="text-sm font-medium leading-normal text-white">Đại lý</p>
                </button>
            </div>

            <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-surface-light/40">
                         <tr>
                            <th className="relative px-6 py-3.5"><input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary/50" /></th>
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white">Tên Khách Hàng</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Liên Hệ</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Tổng Chi Tiêu</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Lần Mua Cuối</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Tags</th>
                            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Hành động</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-background-dark">
                         <tr>
                            <td className="relative px-6 py-4"><input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary/50" /></td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 bg-cover bg-center rounded-full" style={{backgroundImage: 'url(https://picsum.photos/id/64/50/50)'}}></div>
                                    <div className="ml-4">
                                        <div className="font-medium text-white">Lê Minh Anh</div>
                                        <div className="text-gray-500">KH001</div>
                                    </div>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                                <div className="text-white">0987 654 321</div>
                                <div>minhanh.le@email.com</div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">12.500.000đ</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">15/07/2024</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className="inline-flex items-center rounded-full bg-blue-900/40 px-2 py-1 text-xs font-medium text-blue-300">Đại lý</span>
                                <span className="ml-1 inline-flex items-center rounded-full bg-green-900/40 px-2 py-1 text-xs font-medium text-green-300">Khách quen</span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="p-2 text-gray-400 hover:text-primary"><span className="material-symbols-outlined text-xl">edit</span></button>
                                    <button className="p-2 text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-xl">delete</span></button>
                                </div>
                            </td>
                        </tr>
                         <tr>
                            <td className="relative px-6 py-4"><input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary/50" /></td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 bg-cover bg-center rounded-full" style={{backgroundImage: 'url(https://picsum.photos/id/65/50/50)'}}></div>
                                    <div className="ml-4">
                                        <div className="font-medium text-white">Trần Gia Bảo</div>
                                        <div className="text-gray-500">KH002</div>
                                    </div>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                                <div className="text-white">0912 345 678</div>
                                <div>giabao.tran@email.com</div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">8.200.000đ</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">12/07/2024</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className="inline-flex items-center rounded-full bg-yellow-900/40 px-2 py-1 text-xs font-medium text-yellow-300">Khách sỉ</span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="p-2 text-gray-400 hover:text-primary"><span className="material-symbols-outlined text-xl">edit</span></button>
                                    <button className="p-2 text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-xl">delete</span></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    )
}

const Business = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductsView />} />
      <Route path="/products" element={<ProductsView />} />
      <Route path="/revenue" element={<RevenueView />} />
      <Route path="/customers" element={<CustomersView />} />
    </Routes>
  );
};

export default Business;