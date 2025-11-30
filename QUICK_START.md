# ⚡ QUICK START GUIDE

## 🚀 Chạy App Ngay (5 phút)

### Bước 1: Clone & Install (2 phút)
```bash
cd f:\dashboard
npm install  # Đã có rồi, skip
```

### Bước 2: Deploy Firebase Rules (1 phút)
```bash
firebase login
firebase deploy --only firestore:rules,storage:rules
```

### Bước 3: Tạo User Đầu Tiên (1 phút)
1. Vào: https://console.firebase.google.com/project/qlcv-87/authentication
2. Click "Add User"
3. Email: `admin@qlcv.com`
4. Password: `Admin@123`
5. Click "Add User"

### Bước 4: Test App (1 phút)
1. Mở Vercel URL (sẽ tự động deploy sau git push)
2. Login với email/password vừa tạo
3. Thấy Dashboard với empty states ✅

---

## 📊 Thêm Dữ Liệu Mẫu (10 phút)

### Vào Firestore Console
https://console.firebase.google.com/project/qlcv-87/firestore

### 1. Thêm Tasks (2 phút)

**Collection:** `tasks`
**Document ID:** Auto-ID

**Data:**
```json
{
  "title": "Báo cáo tổng kết quý 4",
  "source": "Lãnh đạo A",
  "field": "Báo cáo",
  "progress": 75,
  "deadline": "2025-12-31",
  "files": 0,
  "assignedTo": ["user1", "user2"],
  "createdBy": "admin-uid",
  "createdAt": <Firestore timestamp - click clock icon>
}
```

Thêm thêm 2-3 tasks nữa để test!

### 2. Thêm Products (3 phút)

**Collection:** `business` → **Subcollection:** `products`
**Path:** `business/products`
**Document ID:** Auto-ID

**Data:**
```json
{
  "name": "Tương Ớt Bông Ớt - Cay Nồng",
  "sku": "TOB-CAY-330",
  "price": 50000,
  "stock": 150,
  "imageUrl": "",
  "expiryDate": "2026-12-31",
  "status": "in-stock",
  "createdAt": <timestamp>
}
```

**Thêm 2 sản phẩm nữa:**
```json
{
  "name": "Tương Ớt Bông Ớt - Siêu Cay",
  "sku": "TOB-SIEUCAY-330",
  "price": 55000,
  "stock": 45,
  "status": "low-stock",
  // ...
}

{
  "name": "Tương Ớt Bông Ớt - Tỏi",
  "sku": "TOB-TOI-330",
  "price": 52000,
  "stock": 220,
  "status": "in-stock",
  // ...
}
```

### 3. Thêm Customers (2 phút)

**Path:** `business/customers`

```json
{
  "name": "Lê Minh Anh",
  "phone": "0987654321",
  "email": "minhanh@email.com",
  "address": "123 Đường ABC, Q1, HCM",
  "totalSpent": 12500000,
  "lastPurchase": <timestamp>,
  "tags": ["Đại lý", "Khách quen"],
  "notes": "Khách hàng VIP",
  "createdAt": <timestamp>
}
```

### 4. Thêm Revenue Records (3 phút)

**Path:** `business/revenue`

```json
{
  "date": <timestamp>,
  "productId": "TOB-CAY-330",
  "productName": "Tương Ớt Bông Ớt - Cay Nồng",
  "quantitySold": 150,
  "revenue": 7500000,
  "cost": 3000000,
  "profit": 4500000,
  "createdAt": <timestamp>
}
```

Thêm 5-10 records để có biểu đồ đẹp!

---

## 🎨 Test Features

### ✅ Dashboard
- Refresh trang → Thấy số liệu thật
- Stats cards cập nhật
- Task list hiển thị
- Empty states biến mất

### ✅ Tasks Module
- Vào `/tasks`
- Thấy danh sách tasks
- Click delete → Xác nhận → Biến mất realtime
- Toast notification hiện

### ✅ Business Module
- Products: Thấy 3 sản phẩm
- Search: Gõ "cay" → Filter
- Revenue: Thấy chart
- Customers: Thấy danh sách

### ✅ Upload File
- Click "Thêm sản phẩm" (placeholder)
- Trong tương lai sẽ có form upload

---

## 🔧 Troubleshooting

### Issue: "Permission Denied"
**Solution:** Deploy rules chưa?
```bash
firebase deploy --only firestore:rules,storage:rules
```

### Issue: "No data showing"
**Solution:** Check Firestore có data chưa?
- Vào Console
- Check collection path đúng chưa
- VD: `business/products` (không phải `products`)

### Issue: "Cannot read properties of undefined"
**Solution:**
- Check data structure trong Firestore
- All fields match TypeScript types?
- createdAt là Timestamp không phải string?

### Issue: "Login failed"
**Solution:**
- Check user tồn tại trong Authentication
- Password đúng chưa?
- Email verification tắt chưa?

---

## 📱 URLs Quan Trọng

### Local Dev
```
http://localhost:5173
```

### Production
```
Vercel: https://dashboard-xxx.vercel.app (auto-deploy)
```

### Firebase Console
```
Project: https://console.firebase.google.com/project/qlcv-87
Firestore: https://console.firebase.google.com/project/qlcv-87/firestore
Auth: https://console.firebase.google.com/project/qlcv-87/authentication
Storage: https://console.firebase.google.com/project/qlcv-87/storage
```

---

## 🎯 Next Steps

### Immediate (Hôm nay)
1. ✅ Deploy rules
2. ✅ Tạo user
3. ✅ Test login
4. ✅ Thêm sample data
5. ⏳ Explore app features

### Short-term (Tuần này)
1. Học cách add data vào Firestore
2. Test upload file (ready nhưng chưa có form)
3. Deploy lên domain riêng (nếu có)

### Long-term (Tháng này)
1. Implement form components
2. Update Teaching module
3. Add more features từ ROADMAP.md

---

## 💡 Pro Tips

### 1. Firestore Emulator (Dev)
```bash
firebase emulators:start
```
Test local mà không affect production data!

### 2. Backup Data
```bash
# Export
firebase firestore:export backup/

# Import
firebase firestore:import backup/
```

### 3. Hot Reload
```bash
npm run dev
```
Mỗi lần sửa code → Auto refresh!

### 4. Monitor Logs
```bash
# Firestore
firebase firestore:indexes

# Auth
firebase auth:export users.json
```

---

## 🆘 Need Help?

### Documentation
- [DEPLOY_SUMMARY.md](DEPLOY_SUMMARY.md) - Full deployment guide
- [ROADMAP.md](ROADMAP.md) - Future features
- [UPGRADE_SUMMARY.md](UPGRADE_SUMMARY.md) - What changed
- [README_SETUP.md](README_SETUP.md) - Setup details

### GitHub
```
Repository: https://github.com/thanhlv87/dashboard
Issues: https://github.com/thanhlv87/dashboard/issues
```

---

**⏱️ Total Time:** ~15 phút từ zero → working app!

**🎉 ENJOY YOUR NEW APP! 🎉**
