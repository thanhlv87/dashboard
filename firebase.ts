
// Import các function cần thiết từ SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyC3FFRYoSBxBeDv1juk9ICOGDs1HN--zUk",
  authDomain: "qlcv-87.firebaseapp.com",
  projectId: "qlcv-87",
  storageBucket: "qlcv-87.firebasestorage.app",
  messagingSenderId: "974458215862",
  appId: "1:974458215862:web:eaf0c360ac1a63958af517",
  measurementId: "G-7N1KYR25JB"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất các instance để sử dụng trong app
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

/*
HƯỚNG DẪN SỬ DỤNG:

=== FIRESTORE DATABASE ===
Ví dụ lấy dữ liệu:
  import { collection, getDocs } from "firebase/firestore";
  import { db } from "../firebase";

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      setTasks(data);
    };
    fetchData();
  }, []);

=== FIREBASE STORAGE ===
Ví dụ upload file:
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { storage } from "../firebase";

  const handleFileUpload = async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

Cấu trúc thư mục đề xuất:
  - /users/{userId}/avatar.jpg          (Avatar người dùng)
  - /products/{productId}/*.jpg         (Hình ảnh sản phẩm)
  - /tasks/{taskId}/files/*             (File đính kèm công việc)
  - /teaching/{scheduleId}/documents/*  (Tài liệu giảng dạy)
  - /business/invoices/*                (Hóa đơn)
*/
