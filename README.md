# Kshatri-La Yu-Gi-Oh! Card Shop

A full-stack e-commerce platform dedicated to buying and selling Yu-Gi-Oh! OCG/TCG cards. Built with modern web technologies to provide a fast, responsive, and seamless experience for both customers and administrators.

---

## 🛡 Cấu Trúc Bảo Mật & Xác Thực (Security Architecture)

Dự án áp dụng mô hình bảo mật mạnh ở cả Frontend và Backend, chia quy trình quản lý truy cập (Access Control) thành nhiều lớp.

### 1. Quản lý Phiên Đăng Nhập (Session-Based Auth Code)
Hệ thống **không sử dụng JWT**, mà dùng cấu trúc bảo mật **Stateful Session** qua `express-session` & `cookie-parser`:
- Khi user gọi `/api/auth/login`, backend xác thực và lưu thông tin vào `req.session.user`.
- Server sinh ra một mã thông báo (Session ID) được ký bằng `secret-key` nội bộ và trả về frontend dưới dạng **HTTP-Only Cookie**.
- **Điểm mạnh Security:** Vì là HTTP-Only, JavaScipt trên trình duyệt hoàn toàn không thể đọc hay lấy cắp Session ID (chống tấn công **XSS**). Bất kì request nào từ Axios lên đều gửi tự động Cookie đi kèm qua cờ `withCredentials: true`.

### 2. Kiểm Soát Truy Cập Xuyên Vùng (CORS Protection)
- Backend giới hạn truy cập tại `cors()`: Chỉ cho phép Origin của Domain định cấu hình (ví dụ: `http://localhost:8081`) được phép gửi requests. Chặn hoàn toàn mọi nguồn Domain lạ cố tình POST data rác.

### 3. Middleware Chặn Định Tuyến (Frontend Guard)
- Trái tim của việc chống "đi lậu" trang nằm ở `src/router/index.js`. Vòng đời điều hướng `router.beforeEach` kết hợp `Pinia (authStore)` luôn dò hỏi:
  - Truy cập cần Auth? -> Chặn khách lạ (`meta.requiresAuth`).
  - Đi vào `/dashboard`? -> Kiểm tra `isAdmin` hoặc `isModer`. Nếu chỉ là Customer, đá văng ra `/login`.

---

## 🧠 Kiến Trúc Logic Hệ Thống (Application Logic)

### 1. Phân Quyền Vai Trò (Role-Based Access Control)
Hệ thống logic được chia làm 3 cấp nhân sự:
- **Admin**: Quyền lực tuyệt đối. Xem thống kê (Analytics), cài đặt Cấu hình Bank/QR hệ thống (Settings), quản lý thành viên (Users) và chuyên mục hàng (Categories).
- **Moderator (Moder)**: Chuyên viên vận hành. Chỉ thấy và làm việc với Kho hàng (Inventory), duyệt Đơn hàng (Orders), trả lời Chat khách, cập nhật bài viết (News).
- **Customer**: Luồng mua sắm, check giỏ hàng, thông tin cá nhân thuần túy.

### 2. Auto-Upgrade Database Migration
Đây là một tính năng cực kỳ logic để dự án không bao giờ "chết" vì thiếu hoặc lệch CSDL:
- Khi `server.js` khởi động, hệ thống chạy cơ chế **Self-Check**. Nó quét cấu trúc bảng MySQL hiện tại (lệnh `SHOW COLUMNS`). Nếu thấy thiếu những cột mới ra mắt (như `phone`), nó tự động chạy truy vấn `ALTER TABLE` để bù vào.
- Tự động Seed cấu hình mặc định (Bank Account, User details) nếu chưa có ai cài đặt. Đảm bảo Dev tải về chạy là không bị crash CSDL.

### 3. Dynamic QR Networking (Thanh toán cục bộ thông minh)
Trạm thanh toán QR sinh ra tự động cho khách:
- Để điện thoại của khách quét được link và thanh toán được (cùng mạng WiFi), Backend quét mảng LAN bằng module `os.networkInterfaces()` lấy về IP nội sinh thật của máy đang chạy Host (`192.168.x.x`), thay thế cho `localhost`.
- Trả IP động này về cho Vue.js dùng thư viện mã hóa ra mã hình ảnh QR. Điều này giúp tính năng test local trơn tru mà không cần Deploy Web lên Domain thật.

---

## 🛠 Tech Stack Khởi Hành

- **Frontend:** Vue 3 (Composition API), Vue Router 4, Pinia (Global Store), Tailwind CSS (System UI).
- **Backend:** Node.js, Express.js (RESTful Endpoints).
- **Database:** MySQL 8+ kết nối chuẩn Callback `mysql2`.
- **Packages phụ trợ:** Axios, Express-session, Cookie-parser.

---

## 📁 Cấu Trúc Khối Nền (Repository Structure)

```text
├── cardshop.sql           # File Snapshot CSDL / Seed Schema
├── README.md              # Documentation mổ xẻ
└── my-project/            # Thư mục gốc Application 
    ├── src/
    │   ├── admin/         # Cụm Vue Component độc quyền của Dashboard
    │   ├── backend/       # Node/Express API, chia Routes độc lập (Auth, Order, Admin)
    │   ├── components/    # Cụm Vue khối khách hàng, Modal Popup
    │   ├── router/        # Guard điều hướng, meta tags
    │   ├── store/         # State trung tâm Pinia
    │   ├── views/         # Tuyến tính Page Layout 
    │   ├── App.vue        # Entry node Frontend
    ├── package.json       # Control Center npm deps
    └── vue.config.js      # Build config
```

---

## ⚙️ Hướng dẫn Khởi chạy (Local Setup)

### 1. Lắp Ráp Database
1. Cài đặt **MySQL** (có thể qua XAMPP, WAMP, MySQL Server).
2. Tạo DB mới chuẩn UTF-8 và Import cấu trúc từ file `cardshop.sql`:
   ```bash
   mysql -u root -p < cardshop.sql
   ```
3. Chỉnh sửa mật khẩu DB (user/password) tại dòng `#1. KẾT NỐI DATABASE` bên trong file `/src/backend/server.js`.

### 2. Cài Đặt NPM Engine
Truy cập vào source:
```bash
cd my-project
npm install
```

### 3. Khởi Động Động Cơ Kép (Dual Run)

Mở 2 Terminal riêng biệt:
- **Terminal 1 (Backend):** 
```bash
cd my-project/src/backend
node server.js
```
*(Server trả kết nối port 8080)*

- **Terminal 2 (Frontend):** 
```bash
cd my-project
npm run serve
```
*(Vue Server chạy port 8081)*

---

## 📦 Kiến tạo Production (Deployment)

Biên dịch dự án ra cục diện HTML/CSS/JS thuần nhẹ nhất để Host trên Nginx/Apache:
```bash
cd my-project
npm run build
```
File xuất thành phẩm nằm tại folder `/dist`.
