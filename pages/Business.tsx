import React, { useState } from 'react';
import { Routes, Route, useNavigate, NavLink } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFirestore } from '../hooks/useFirestore';
import { Product, Customer, RevenueRecord } from '../lib/firebase/types';
import { orderBy } from 'firebase/firestore';
import { AddProductModal } from '../components/AddProductModal';
import { AddCustomerModal } from '../components/AddCustomerModal';
import toast from 'react-hot-toast';

// ========================================
// PRODUCTS VIEW
// ========================================
const ProductsView = () => {
    const { data: products, loading, remove, add } = useFirestore<Product>('products', [orderBy('createdAt', 'desc')]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
        try {
            await add(productData);
            setShowAddModal(false);
        } catch (err) {
            console.error('Error adding product:', err);
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">Quản lý Sản phẩm</h1>
                    <p className="text-text-muted text-base font-normal leading-normal">Quản lý kho tương ớt Bông Ớt</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-wide hover:opacity-90 transition-opacity"
                >
                    <span className="material-symbols-outlined">add</span>
                    <span className="truncate">Thêm Sản phẩm</span>
                </button>
            </div>

             <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-grow">
                     <div className="flex w-full items-stretch rounded-lg h-12">
                        <div className="text-text-muted flex bg-surface-light items-center justify-center pl-4 rounded-l-lg border border-surface-light border-r-0">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 bg-surface-light border border-surface-light h-full placeholder:text-text-muted px-4 text-base font-normal leading-normal"
                          placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
                        />
                    </div>
                </div>
                <div className="flex gap-3 items-center">
                    <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-surface-light px-4 border border-surface-light hover:bg-surface-light/80 transition-colors">
                        <p className="text-white text-sm font-medium leading-normal">Tình trạng</p>
                        <span className="material-symbols-outlined text-text-muted">expand_more</span>
                    </button>
                     <button className="p-3.5 flex items-center justify-center h-12 rounded-lg bg-surface-light text-white border border-surface-light hover:bg-surface-light/80 transition-colors">
                        <span className="material-symbols-outlined">download</span>
                    </button>
                </div>
             </div>

             <div className="bg-surface rounded-xl border border-surface-light overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center text-text-muted">
                    <span className="material-symbols-outlined text-4xl mb-2 animate-spin">refresh</span>
                    <p>Đang tải sản phẩm...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="p-12 text-center text-text-muted">
                    <span className="material-symbols-outlined text-5xl mb-4">inventory_2</span>
                    <p className="text-lg mb-2">
                      {searchQuery ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm nào'}
                    </p>
                    <p className="text-sm mb-4">
                      {searchQuery ? 'Thử từ khóa khác' : 'Thêm sản phẩm đầu tiên để bắt đầu'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-muted">
                         <thead className="text-xs text-gray-400 uppercase bg-surface-light/30">
                            <tr>
                                <th className="p-4 w-4"><input type="checkbox" className="rounded bg-surface-light border-gray-600 text-primary focus:ring-primary/50" /></th>
                                <th className="px-6 py-3">Sản phẩm</th>
                                <th className="px-6 py-3">Mã SKU</th>
                                <th className="px-6 py-3">Giá bán</th>
                                <th className="px-6 py-3">Tồn kho</th>
                                <th className="px-6 py-3">Hạn SD</th>
                                <th className="px-6 py-3">Trạng thái</th>
                                <th className="px-6 py-3 text-right">Hành động</th>
                            </tr>
                        </thead>
                         <tbody>
                            {filteredProducts.map(product => (
                              <tr key={product.id} className="border-b border-surface-light hover:bg-surface-light/30">
                                <td className="p-4"><input type="checkbox" className="rounded bg-surface-light border-gray-600 text-primary focus:ring-primary/50" /></td>
                                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                    {product.imageUrl ? (
                                      <div className="w-10 h-10 rounded-lg bg-white/10 bg-cover bg-center" style={{backgroundImage: `url(${product.imageUrl})`}}></div>
                                    ) : (
                                      <div className="w-10 h-10 rounded-lg bg-surface-light flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary">inventory_2</span>
                                      </div>
                                    )}
                                    {product.name}
                                </td>
                                <td className="px-6 py-4">{product.sku}</td>
                                <td className="px-6 py-4">{product.price.toLocaleString('vi-VN')} ₫</td>
                                <td className="px-6 py-4">{product.stock}</td>
                                <td className="px-6 py-4">
                                  {product.expiryDate ? product.expiryDate.toDate().toLocaleDateString('vi-VN') : '-'}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className={`h-2.5 w-2.5 rounded-full ${
                                      product.status === 'in-stock' ? 'bg-green-500' :
                                      product.status === 'low-stock' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}></div>
                                    {product.status === 'in-stock' ? 'Còn hàng' :
                                     product.status === 'low-stock' ? 'Sắp hết' : 'Hết hàng'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 hover:text-primary"><span className="material-symbols-outlined text-base">edit</span></button>
                                        <button onClick={() => remove(product.id)} className="p-2 hover:text-red-500"><span className="material-symbols-outlined text-base">delete</span></button>
                                    </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
             </div>

             {/* Add Product Modal */}
             <AddProductModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddProduct}
             />
        </div>
    );
};

// ========================================
// REVENUE VIEW
// ========================================
const RevenueView = () => {
    const { data: revenueRecords, loading } = useFirestore<RevenueRecord>('revenue', [orderBy('date', 'desc')]);

    // Calculate stats
    const totalRevenue = revenueRecords.reduce((sum, r) => sum + r.revenue, 0);
    const totalCost = revenueRecords.reduce((sum, r) => sum + r.cost, 0);
    const totalProfit = revenueRecords.reduce((sum, r) => sum + r.profit, 0);

    // Chart data (group by month)
    const chartData = revenueRecords.slice(0, 8).reverse().map(r => ({
      name: r.date.toDate().toLocaleDateString('vi-VN', { month: 'short' }),
      uv: r.revenue
    }));

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-white">Doanh thu & Lợi nhuận</h1>
                    <p className="text-base font-normal leading-normal text-text-muted">Phân tích kinh doanh tương ớt</p>
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
                        <span className="truncate">Tạo báo cáo</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <div className="flex flex-1 flex-col gap-2 rounded-xl bg-surface p-6 border border-border-color">
                    <p className="text-base font-medium leading-normal text-white">Tổng Doanh thu</p>
                    <p className="text-2xl font-bold leading-tight tracking-tight text-white">
                      {loading ? '...' : `${(totalRevenue / 1000000).toFixed(1)}M ₫`}
                    </p>
                    <p className="text-base font-medium leading-normal text-[#0bda43]">+5.2%</p>
                </div>
                 <div className="flex flex-1 flex-col gap-2 rounded-xl bg-surface p-6 border border-border-color">
                    <p className="text-base font-medium leading-normal text-white">Giá vốn</p>
                    <p className="text-2xl font-bold leading-tight tracking-tight text-white">
                      {loading ? '...' : `${(totalCost / 1000000).toFixed(1)}M ₫`}
                    </p>
                    <p className="text-base font-medium leading-normal text-text-muted">Cost</p>
                </div>
                 <div className="flex flex-1 flex-col gap-2 rounded-xl bg-surface p-6 border border-border-color">
                    <p className="text-base font-medium leading-normal text-white">Chi phí</p>
                    <p className="text-2xl font-bold leading-tight tracking-tight text-white">
                      {loading ? '...' : `${((totalRevenue - totalProfit - totalCost) / 1000000).toFixed(1)}M ₫`}
                    </p>
                    <p className="text-base font-medium leading-normal text-[#fa5538]">-1.5%</p>
                </div>
                 <div className="flex flex-1 flex-col gap-2 rounded-xl bg-surface p-6 border border-border-color">
                    <p className="text-base font-medium leading-normal text-white">Lợi nhuận</p>
                    <p className="text-2xl font-bold leading-tight tracking-tight text-white">
                      {loading ? '...' : `${(totalProfit / 1000000).toFixed(1)}M ₫`}
                    </p>
                    <p className="text-base font-medium leading-normal text-[#0bda43]">+8.7%</p>
                </div>
            </div>

            {chartData.length > 0 ? (
              <div className="rounded-xl border border-border-color bg-surface p-6 mb-6 h-[400px]">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Doanh thu theo thời gian</h3>
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
            ) : (
              <div className="rounded-xl border border-border-color bg-surface p-12 mb-6 text-center text-text-muted">
                <span className="material-symbols-outlined text-5xl mb-4">bar_chart</span>
                <p className="text-lg mb-2">Chưa có dữ liệu doanh thu</p>
                <p className="text-sm">Thêm bản ghi doanh thu để xem biểu đồ</p>
              </div>
            )}

             <div className="rounded-xl border border-border-color bg-surface">
                 <div className="p-6">
                    <h3 className="text-lg font-bold text-white">Chi tiết doanh thu</h3>
                </div>
                {loading ? (
                  <div className="p-12 text-center text-text-muted">
                    <span className="material-symbols-outlined text-4xl mb-2 animate-spin">refresh</span>
                    <p>Đang tải...</p>
                  </div>
                ) : revenueRecords.length === 0 ? (
                  <div className="p-12 text-center text-text-muted">
                    <span className="material-symbols-outlined text-5xl mb-4">receipt_long</span>
                    <p className="text-lg mb-2">Chưa có bản ghi doanh thu</p>
                    <p className="text-sm">Nhấn "Tạo báo cáo" để thêm</p>
                  </div>
                ) : (
                  <div className="relative w-full overflow-x-auto">
                    <table className="w-full text-left text-sm text-text-muted">
                        <thead className="border-b border-border-color text-xs uppercase text-gray-400">
                             <tr>
                                <th className="px-6 py-3" scope="col">Ngày</th>
                                <th className="px-6 py-3" scope="col">Mã SP</th>
                                <th className="px-6 py-3" scope="col">Tên sản phẩm</th>
                                <th className="px-6 py-3 text-right" scope="col">SL bán</th>
                                <th className="px-6 py-3 text-right" scope="col">Doanh thu</th>
                                <th className="px-6 py-3 text-right" scope="col">Giá vốn</th>
                                <th className="px-6 py-3 text-right" scope="col">Lợi nhuận</th>
                            </tr>
                        </thead>
                         <tbody>
                            {revenueRecords.slice(0, 10).map(record => (
                              <tr key={record.id} className="border-b border-border-color">
                                <td className="px-6 py-4">{record.date.toDate().toLocaleDateString('vi-VN')}</td>
                                <td className="px-6 py-4">{record.productId}</td>
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-white">{record.productName}</td>
                                <td className="px-6 py-4 text-right">{record.quantitySold}</td>
                                <td className="px-6 py-4 text-right">{record.revenue.toLocaleString('vi-VN')} ₫</td>
                                <td className="px-6 py-4 text-right">{record.cost.toLocaleString('vi-VN')} ₫</td>
                                <td className="px-6 py-4 text-right font-medium text-primary">{record.profit.toLocaleString('vi-VN')} ₫</td>
                              </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
            </div>

        </div>
    );
};

// ========================================
// CUSTOMERS VIEW
// ========================================
const CustomersView = () => {
    const { data: customers, loading, remove, add } = useFirestore<Customer>('customers', [orderBy('totalSpent', 'desc')]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const filteredCustomers = customers.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    );

    const handleAddCustomer = async (customerData: Omit<Customer, 'id'>) => {
        try {
            await add(customerData);
            setShowAddModal(false);
        } catch (err) {
            console.error('Error adding customer:', err);
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">
             <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-col gap-2">
                    <p className="text-3xl font-bold leading-tight tracking-tight text-white">Khách hàng</p>
                    <p className="text-base font-normal leading-normal text-text-muted">Quản lý danh sách khách hàng</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 gap-2 bg-primary px-4 text-sm font-bold leading-normal tracking-[0.015em] text-[#111814] hover:opacity-90"
                >
                    <span className="material-symbols-outlined text-base">add</span>
                    <span className="truncate">Thêm Khách Hàng</span>
                </button>
            </div>

             <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex-1">
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-12">
                        <div className="flex items-center justify-center rounded-l-lg border-y border-l border-surface-light bg-surface-light pl-4 text-text-muted">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg border border-surface-light bg-surface-light px-4 text-base font-normal leading-normal text-white placeholder:text-text-muted focus:border-primary/50 focus:ring-primary/50"
                          placeholder="Tìm kiếm theo tên, SĐT..."
                        />
                    </div>
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

            {loading ? (
              <div className="p-12 text-center text-text-muted">
                <span className="material-symbols-outlined text-4xl mb-2 animate-spin">refresh</span>
                <p>Đang tải...</p>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-12 text-center text-text-muted">
                <span className="material-symbols-outlined text-5xl mb-4">groups</span>
                <p className="text-lg mb-2">
                  {searchQuery ? 'Không tìm thấy khách hàng' : 'Chưa có khách hàng'}
                </p>
                <p className="text-sm mb-4">
                  {searchQuery ? 'Thử từ khóa khác' : 'Thêm khách hàng đầu tiên'}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-surface-light/40">
                         <tr>
                            <th className="relative px-6 py-3.5"><input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary/50" /></th>
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white">Khách Hàng</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Liên Hệ</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Tổng Chi Tiêu</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Lần Mua Cuối</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Tags</th>
                            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Hành động</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-background-dark">
                         {filteredCustomers.map((customer, index) => (
                          <tr key={customer.id}>
                            <td className="relative px-6 py-4"><input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary/50" /></td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 bg-surface-light rounded-full flex items-center justify-center">
                                      <span className="material-symbols-outlined text-primary">person</span>
                                    </div>
                                    <div className="ml-4">
                                        <div className="font-medium text-white">{customer.name}</div>
                                        <div className="text-gray-500">KH{String(index + 1).padStart(3, '0')}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                                <div className="text-white">{customer.phone}</div>
                                <div>{customer.email || '-'}</div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{customer.totalSpent.toLocaleString('vi-VN')}đ</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                              {customer.lastPurchase ? customer.lastPurchase.toDate().toLocaleDateString('vi-VN') : '-'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                {customer.tags.map(tag => (
                                  <span key={tag} className="inline-flex items-center rounded-full bg-blue-900/40 px-2 py-1 text-xs font-medium text-blue-300 mr-1">
                                    {tag}
                                  </span>
                                ))}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="p-2 text-gray-400 hover:text-primary"><span className="material-symbols-outlined text-xl">edit</span></button>
                                    <button onClick={() => remove(customer.id)} className="p-2 text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-xl">delete</span></button>
                                </div>
                            </td>
                          </tr>
                         ))}
                    </tbody>
                </table>
            </div>
            )}

            {/* Add Customer Modal */}
            <AddCustomerModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddCustomer}
            />

        </div>
    );
};

// ========================================
// MAIN BUSINESS COMPONENT
// ========================================
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
