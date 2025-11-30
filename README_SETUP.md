# 🚀 Hướng Dẫn Cài Đặt & Deploy - Quản Lý Tổng Hợp

## 📋 Mục Lục
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Cài Đặt Local](#cài-đặt-local)
- [Cấu Hình Firebase](#cấu-hình-firebase)
- [Deploy Lên Production](#deploy-lên-production)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Troubleshooting](#troubleshooting)

---

## ✅ Yêu Cầu Hệ Thống

- **Node.js:** >= 18.0.0
- **npm:** >= 9.0.0
- **Git:** Để clone repository
- **Tài khoản Firebase:** [console.firebase.google.com](https://console.firebase.google.com)

---

## 💻 Cài Đặt Local

### 1. Clone hoặc mở dự án
```bash
cd f:\dashboard
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình biến môi trường
File `.env.local` đã được tạo. Cập nhật các giá trị cần thiết:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

### 4. Chạy development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

---

## 🔥 Cấu Hình Firebase

### Bước 1: Truy cập Firebase Console
Mở: [https://console.firebase.google.com/project/qlcv-87](https://console.firebase.google.com/project/qlcv-87)

### Bước 2: Kích hoạt các dịch vụ

#### 📊 **Firestore Database**
1. Vào **Firestore Database** > Click **Create Database**
2. Chọn location: `asia-southeast1` (Singapore)
3. Chọn **Production mode**
4. Deploy rules:

```bash
# Cách 1: Copy thủ công
# Mở file firestore.rules và copy toàn bộ nội dung
# Paste vào Firebase Console > Firestore Database > Rules

# Cách 2: Dùng Firebase CLI (khuyến nghị)
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

#### 💾 **Firebase Storage**
1. Vào **Storage** > Click **Get Started**
2. Chọn location: `asia-southeast1`
3. Deploy rules:

```bash
# Cách 1: Copy thủ công từ file storage.rules
# Paste vào Firebase Console > Storage > Rules

# Cách 2: Dùng Firebase CLI
firebase deploy --only storage:rules
```

#### 🔐 **Authentication**
1. Vào **Authentication** > Click **Get Started**
2. Enable các phương thức:
   - ✅ Email/Password
   - ✅ Google Sign-In (optional)

### Bước 3: Tạo cấu trúc Firestore Collections

Tạo các collections sau (có thể tạo tự động khi app chạy hoặc tạo thủ công):

```
/users
  /{userId}
    - email: string
    - displayName: string
    - photoURL: string
    - createdAt: timestamp

/tasks
  /{taskId}
    - title: string
    - source: string
    - field: string
    - progress: number
    - deadline: string
    - createdBy: string (userId)
    - createdAt: timestamp

/teaching
  /{scheduleId}
    - date: timestamp
    - location: string
    - partner: string
    - status: string
    - createdBy: string
    - createdAt: timestamp

/teaching/partners
  /{partnerId}
    - name: string
    - contact: string
    - phone: string
    - email: string

/business/products
  /{productId}
    - name: string
    - sku: string
    - price: number
    - stock: number
    - imageUrl: string

/business/customers
  /{customerId}
    - name: string
    - phone: string
    - email: string
    - totalSpent: number
```

---

## 🌐 Deploy Lên Production

### Option 1: Firebase Hosting (Khuyến nghị)

#### 1. Cài đặt Firebase CLI
```bash
npm install -g firebase-tools
```

#### 2. Login vào Firebase
```bash
firebase login
```

#### 3. Khởi tạo Firebase Hosting
```bash
firebase init hosting
```

Chọn các options:
- **Project:** qlcv-87
- **Public directory:** `dist`
- **Configure as SPA:** Yes
- **Automatic builds:** No

#### 4. Build production
```bash
npm run build
```

#### 5. Deploy
```bash
firebase deploy --only hosting
```

URL: `https://qlcv-87.web.app` hoặc `https://qlcv-87.firebaseapp.com`

### Option 2: Vercel

```bash
npm install -g vercel
vercel login
vercel
```

### Option 3: Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## 📁 Cấu Trúc Dự Án

```
f:\dashboard\
├── pages/                    # Các trang chính
│   ├── Dashboard.tsx        # Trang tổng quan
│   ├── Teaching.tsx         # Quản lý giảng dạy
│   ├── Tasks.tsx            # Công việc cơ quan
│   └── Business.tsx         # Quản lý kinh doanh
├── App.tsx                   # Component chính + routing
├── firebase.ts               # Firebase configuration
├── index.tsx                 # Entry point
├── index.html                # HTML template
├── firestore.rules           # Firestore security rules
├── storage.rules             # Storage security rules
├── .env.local                # Environment variables (local)
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
└── README_SETUP.md          # File này
```

---

## 🔧 Các Lệnh Thường Dùng

```bash
# Development
npm run dev                    # Chạy dev server

# Production
npm run build                  # Build cho production
npm run preview                # Preview production build

# Firebase
firebase login                 # Đăng nhập Firebase
firebase deploy                # Deploy all
firebase deploy --only hosting # Deploy chỉ hosting
firebase deploy --only firestore:rules # Deploy Firestore rules
firebase deploy --only storage:rules   # Deploy Storage rules

# Logs
firebase functions:log         # Xem logs (nếu dùng Functions)
```

---

## 🎨 Tùy Chỉnh Theme

File `index.html` (dòng 25-44) chứa Tailwind config:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        "primary": "#13ec6d",           // Màu chính (xanh lá)
        "background-dark": "#102218",   // Nền tối
        "surface": "#111814",           // Surface color
        "surface-light": "#28392f",     // Surface sáng hơn
        "text-muted": "#9db9a8",        // Text mờ
        "border-color": "#3b5445"       // Màu border
      }
    }
  }
}
```

---

## 🐛 Troubleshooting

### Lỗi: "Firebase configuration not found"
- Kiểm tra file `firebase.ts` đã có đầy đủ config
- Đảm bảo đã import đúng: `import { db, auth, storage } from './firebase'`

### Lỗi: "Permission denied" khi truy cập Firestore/Storage
- Kiểm tra rules đã deploy chưa
- Đảm bảo user đã đăng nhập (nếu rules yêu cầu auth)

### Build bị lỗi
```bash
# Xóa cache và rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Port 5173 đã được sử dụng
```bash
# Thay đổi port trong vite.config.ts
export default defineConfig({
  server: { port: 3000 }
})
```

---

## 📚 Tài Liệu Tham Khảo

- **Firebase Docs:** [firebase.google.com/docs](https://firebase.google.com/docs)
- **Vite Docs:** [vitejs.dev](https://vitejs.dev)
- **React Router:** [reactrouter.com](https://reactrouter.com)
- **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com)
- **Recharts:** [recharts.org](https://recharts.org)

---

## 🔐 Bảo Mật

**⚠️ QUAN TRỌNG:**
- **KHÔNG** commit file `.env.local` lên Git
- **KHÔNG** chia sẻ API keys công khai
- Sử dụng Firebase Security Rules nghiêm ngặt
- Enable App Check cho production
- Giới hạn API quotas trong Firebase Console

---

## 📧 Liên Hệ & Hỗ Trợ

- **Project ID:** qlcv-87
- **Console:** [console.firebase.google.com/project/qlcv-87](https://console.firebase.google.com/project/qlcv-87)
- **Email:** quanly@email.com

---

## 🎯 Roadmap

### Tính năng sắp tới:
- [ ] Authentication với Firebase Auth
- [ ] Real-time updates với Firestore listeners
- [ ] Upload file/ảnh lên Storage
- [ ] Push notifications
- [ ] Offline mode với PWA
- [ ] Export dữ liệu ra Excel/PDF
- [ ] Dark/Light mode toggle
- [ ] Multi-language support

---

**Version:** 1.0.0
**Last Updated:** 2025-11-30
