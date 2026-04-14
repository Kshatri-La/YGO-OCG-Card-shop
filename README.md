# 🃏 Yu-Gi-Oh! OCG Card Shop E-Commerce System

## 🌟 Giới Thiệu
Hệ thống thương mại điện tử chuyên nghiệp được thiết kế cho cộng đồng Yu-Gi-Oh! OCG. Đây là một nền tảng quản trị toàn diện, mang lại trải nghiệm mua sắm mượt mà cho người dùng và công cụ vận hành mạnh mẽ cho nhà quản lý.

## 🛡️ Bảo Mật & Toàn Vẹn Hệ Thống
* **Bảo Vệ Phiên Đăng Nhập:** Sử dụng `express-session` và `cookie-parser` với cờ `httpOnly: true` để ngăn chặn tấn công XSS.
* **Ngăn Chặn SQL Injection:** Sử dụng Parameterized Queries thông qua thư viện `mysql2`, đảm bảo dữ liệu đầu vào luôn được xử lý an toàn.
* **Chính Sách CORS:** Chỉ chấp nhận yêu cầu từ các Origin được chỉ định (mặc định port 8081) để bảo vệ API.
* **Navigation Guards:** Kiểm soát quyền truy cập dựa trên vai trò (Admin/Moder/Customer) ngay tại cấp độ Router.

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)
### Frontend
* **Framework:** Vue 3 (Composition API)
* **State Management:** Pinia (auth, cart, app stores)
* **Routing:** Vue Router
* **Styling:** TailwindCSS

### Backend
* **Runtime:** Node.js & Express.js
* **Database:** MySQL
* **Tiện ích:** Tự động lấy LAN IP để phục vụ thanh toán QR.

## 🎯 Tính Năng Cốt Lõi
1. **Phân Quyền (RBAC):** Hệ thống chia làm 3 cấp độ: Customer, Moderator và Admin với các quyền hạn riêng biệt từ xem hàng đến quản trị hệ thống.
2. **Thanh Toán QR LAN:** Tự động tạo mã QR dựa trên IP mạng nội bộ của máy chủ, giúp việc thanh toán tại quầy trở nên nhanh chóng.
3. **Quản Lý Đơn Hàng:** Luồng xử lý từ giỏ hàng đến thanh toán và lưu trữ lịch sử chi tiết.
4. **Live Chat & CMS:** Tích hợp sẵn hệ thống hỗ trợ trực tuyến và quản lý tin tức meta game.

## 🗄️ Cấu Trúc Database
Dữ liệu được tổ chức chặt chẽ trong database `cardshop` bao gồm các bảng:
* `users`: Quản lý định danh và vai trò.
* `cards`: Thông tin chi tiết, mã thẻ, giá và tồn kho.
* `orders` & `order_items`: Lưu vết giao dịch và chi tiết sản phẩm đã mua.
* `system_settings`: Lưu trữ cấu hình ngân hàng và mã QR.
