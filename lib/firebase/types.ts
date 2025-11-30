import { Timestamp } from 'firebase/firestore';

// ========================================
// USER TYPES
// ========================================
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
}

// ========================================
// TASK TYPES (Công việc cơ quan)
// ========================================
export interface Task {
  id: string;
  title: string;
  source: string;           // Nguồn giao việc (Lãnh đạo A, B, C...)
  field: string;            // Mảng công việc (Báo cáo, Hành chính...)
  progress: number;         // 0-100
  deadline: string;         // ISO date string
  files: number;            // Số lượng file đính kèm
  assignedTo: string[];     // Array of user IDs
  createdBy: string;        // User ID
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Timestamp;
}

// ========================================
// TEACHING TYPES (Lịch giảng)
// ========================================
export interface TeachingSchedule {
  id: string;
  date: Timestamp;
  startTime: string;        // "08:00"
  endTime: string;          // "11:30"
  location: string;
  partner: string;          // Đối tác thuê
  company: string;          // Công ty trực tiếp giảng
  studentType: string;      // Đối tượng học viên
  studentCount: number;     // Số lượng học viên
  fee: number;              // Kinh phí giảng
  paymentDate?: Timestamp;  // Ngày thanh toán
  status: 'preparing' | 'confirmed' | 'completed' | 'postponed';
  notes?: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface Partner {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address?: string;
  totalClasses: number;     // Tổng số buổi đã thuê
  notes?: string;
  createdAt: Timestamp;
}

// ========================================
// BUSINESS TYPES (Kinh doanh Tương Ớt)
// ========================================
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  imageUrl?: string;
  expiryDate?: Timestamp;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalSpent: number;
  lastPurchase?: Timestamp;
  tags: string[];           // ['Đại lý', 'Khách quen', 'Khách sỉ']
  notes?: string;
  createdAt: Timestamp;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  completedAt?: Timestamp;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface RevenueRecord {
  id: string;
  date: Timestamp;
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
  cost: number;
  profit: number;
  createdAt: Timestamp;
}

// ========================================
// NOTIFICATION TYPES
// ========================================
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: Timestamp;
}

// ========================================
// SETTINGS TYPES
// ========================================
export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    taskReminders: boolean;
    teachingReminders: boolean;
  };
  language: 'vi' | 'en';
}
