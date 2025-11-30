
// Import các function cần thiết từ SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Cấu hình Firebase của bạn
// Bạn cần thay thế các giá trị này bằng thông tin từ Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất các instance để sử dụng trong app
export const db = getFirestore(app);
export const auth = getAuth(app);

/* 
HƯỚNG DẪN TÍCH HỢP DỮ LIỆU:
1. Tạo project tại console.firebase.google.com
2. Tạo Firestore Database.
3. Copy config vào biến firebaseConfig ở trên.

Ví dụ cách lấy dữ liệu trong components (Tasks.tsx, Teaching.tsx):

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
*/
