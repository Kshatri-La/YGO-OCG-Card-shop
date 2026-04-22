# BÁO CÁO TIỂU LUẬN: HỆ THỐNG QUẢN LÝ VÀ KINH DOANH THẺ BÀI YU-GI-OH! (CARD SHOP)

## 1. GIỚI THIỆU TỔNG QUAN
Dự án "YGO-OCG Card Shop" là một hệ thống ứng dụng Web (Web Application) hoàn chỉnh được thiết kế riêng cho mô hình kinh doanh thẻ bài Yu-Gi-Oh!. Hệ thống mang âm hưởng "Dark Theme - Ma Thuật", cung cấp trải nghiệm mua sắm mượt mà cho khách hàng và một hệ sinh thái quản lý toàn diện (Command Center) dành cho ban quản trị.

---

## 2. CHI TIẾT GIAO DIỆN VÀ CHỨC NĂNG NGƯỜI DÙNG (PUBLIC STOREFRONT)

### 2.1. Thanh Điều Hướng (Header) & Chân Trang (Footer)
- **Hiển thị:** Logo CardShop nổi bật, thanh tìm kiếm (nhập chữ để lọc thẻ bài), Menu các trang (Trang chủ, Khám phá).
- **Giỏ hàng trực quan:** Biểu tượng giỏ hàng tích hợp con số (Badge) nổi màu đỏ thông báo số lượng sản phẩm đang có trong giỏ.
- **Góc Tài khoản (Avatar Dropdown):** 
  - Nếu chưa đăng nhập: Hiển thị nút "Đăng Nhập / Đăng Ký".
  - Nếu đã đăng nhập: Hiển thị Avatar người dùng. Khi click vào sẽ trượt xuống Menu con gồm: *Hồ sơ cá nhân, Lịch sử mua hàng, Đăng xuất*.
  - **Đặc quyền:** Nếu hệ thống nhận diện tài khoản là Admin hoặc Moderator, Menu sẽ tự động xuất hiện thêm nút VIP: "Vào Command Center" để tiến vào khu vực quản trị.

### 2.2. Trang Chủ (HomeView) & Khám Phá (ProductsView)
- **Hero Banner:** Hình ảnh băng rôn lớn, phong cách thiết kế cao cấp để tạo ấn tượng thị giác (WoW effect) cho người truy cập.
- **Khu vực "Sản phẩm mới nhất":** Hiển thị 3 thẻ bài mới nhất vừa được Admin nhập kho, xếp theo dạng lưới (Grid).
- **Danh sách "Tất cả thẻ bài":**
  - Tích hợp tính năng **Phân trang (Pagination)**. Mỗi trang hiển thị 4 lá bài, giúp web tải cực nhanh và không rối mắt.
  - **Thẻ Sản Phẩm (Product Card):** Mỗi lá bài hiển thị gồm: Hình ảnh (có hiệu ứng bo góc, đổ bóng), Tên lá bài, Mã Code, Độ hiếm.
  - **Hiển thị Tồn Kho & Giá:** Hiển thị số lượng còn lại trong kho. Nếu tồn kho = 0, chữ số sẽ hiện màu đỏ cảnh báo. Giá tiền được format chuẩn VNĐ (VD: 1.000.000đ).
  - **Thao tác:** Nút "Thêm vào giỏ" (Sẽ bị làm mờ/vô hiệu hóa không cho bấm nếu thẻ bài đó đã Hết Hàng).

### 2.3. Chi Tiết Thẻ Bài (DetailView)
- **Hiển thị:** Hình ảnh độ phân giải cao của lá bài, đi kèm khung thông số chi tiết (Mã, Tên Pack, Series gốc, Số lượng kho).
- **Thao tác:** Khách hàng có thể tăng/giảm số lượng (bằng nút + / -) trước khi bấm "Thêm vào giỏ". Hệ thống chặn không cho phép bấm "+" vượt quá số tồn kho thực tế.
- **Nội dung:** Khung "Mô tả / Hiệu ứng" giải thích kỹ năng của lá bài.

### 2.4. Đặt Hàng Đặc Biệt (Floating Order Bubble)
- **Hiển thị:** Một nút bấm hình bong bóng (Icon chiếc hộp 📦) lơ lửng ở góc dưới cùng bên phải màn hình, có hiệu ứng chuyển động nảy nhẹ (bounce) và auto-tooltip "YÊU CẦU ĐẶT HÀNG!".
- **Thao tác:** Khi bấm vào, một **Modal Thỏa Thuận Giao Dịch** sẽ trượt ra, che mờ nền web.
- **Chức năng:** Khách hàng nhập Tên, Số điện thoại và dán Link URL của thẻ bài muốn nhờ Shop đặt mua hộ (từ eBay, Shopee, Amazon). Sau khi bấm gửi, hệ thống báo thành công và tự động đóng hộp thoại.

### 2.5. Luồng Thanh Toán (Cart & Checkout)
- **Trang Giỏ Hàng:** Liệt kê các bài đã chọn. Hiển thị tổng tiền. Có thể xóa sản phẩm hoặc chỉnh số lượng ngay trong giỏ.
- **Trang Thanh Toán (Checkout):** Khách điền thông tin người nhận (Tên, SĐT, Địa chỉ).
- **Cổng Thanh Toán QR Code (QrPayment):** Tích hợp công nghệ thanh toán QR tĩnh. Màn hình sinh ra một mã QR Code chứa sẵn thông tin Tài khoản Ngân hàng của Shop, cùng Số tiền chính xác của đơn hàng. Khách chỉ cần dùng App ngân hàng quét mã và bấm nút "Xác nhận đã chuyển khoản" để hoàn tất.

---

## 3. HỆ THỐNG XÁC THỰC TÀI KHOẢN (AUTHENTICATION)
- **Đăng ký:** Giao diện điền Tên đăng nhập, Họ tên, Mật khẩu. Trình duyệt tự kiểm tra tính hợp lệ và chặn tạo tài khoản trùng lặp.
- **Đăng nhập:** 
  - Khách hàng điền ID/Password. 
  - Hệ thống tự phân luồng: Đăng nhập xong, User thường sẽ bị đẩy ra Trang Chủ, còn Admin/Moderator sẽ được tự động dịch chuyển thẳng vào Dashboard Quản trị.
- **Khôi phục (Quên Mật Khẩu):** Nút "Quên mật khẩu" sẽ biến đổi giao diện đăng nhập thành form "Khôi phục Token", cho phép thiết lập lại mật khẩu mới thông qua Server.

---

## 4. CHI TIẾT TRANG QUẢN TRỊ (COMMAND CENTER DASHBOARD)
Giao diện quản trị được thiết kế với Sidebar (Thanh menu trái) và Main Workspace (Không gian làm việc chính). Mọi thao tác lưu/xóa/sửa đều được thông báo bằng **Hệ thống Toast Notification** (Thông báo nổi góc phải màn hình, tự động biến mất sau 4 giây) thay vì hộp thoại Alert mặc định xấu xí của trình duyệt.

### 4.1. Nhóm Chức Năng "Trung Tâm Xử Lý" (Dành cho Admin & Moderator)
- **Kho Lưu Trữ (Inventory Manager):**
  - **Hiển thị:** Bảng lưới danh sách toàn bộ thẻ bài trong CSDL (Ảnh, Tên, Mã Code, Số lượng kho, Đơn giá).
  - **Thao tác Thêm/Sửa:** Khi bấm "Thêm thẻ bài" hoặc "Sửa", một Form sẽ trượt ra cho phép nhập dữ liệu và **Tải ảnh từ máy tính (Local Upload)** lên máy chủ.
  - **Thao tác Xóa:** Bấm "Xóa" sẽ kích hoạt một **Custom Confirm Modal** (Hộp thoại xác nhận có biểu tượng cảnh báo nền đen/đỏ), bắt buộc Quản trị viên phải ấn "Đồng Ý" thì mới xóa thẻ bài, tránh bấm nhầm.
- **Quản lý Đơn hàng & Giao Dịch:** Hiển thị danh sách hóa đơn từ khách hàng. (Có đếm số lượng đơn mới hiển thị badge đỏ trên Menu).
- **Kênh Chat:** Công cụ trực tuyến hỗ trợ trả lời tin nhắn của Khách hàng.
- **Viết Trạch Báo (News):** Công cụ đăng tải tin tức, sự kiện giải đấu Yu-Gi-Oh!.

### 4.2. Nhóm Chức Năng "Quyền Lực Tối Cao" (Dành riêng cho Admin)
*(Moderator sẽ không hề nhìn thấy các nút này trên Menu)*
- **Cây Phân Nhóm (Category Manager):** 
  - Hiển thị bảng danh sách các Danh mục thẻ bài (VD: Bài lẻ, Phụ kiện, Mô hình). 
  - Hỗ trợ đầy đủ thao tác Thêm/Sửa/Xóa phân loại thẻ bài bằng Modal cao cấp.
- **Quản lý Nhân Sự:** Nơi thăng cấp, giáng chức, hoặc khóa tài khoản của khách hàng/nhân viên.
- **Báo Cáo Mật (Analytics):** Bảng thống kê (Dashboard) biểu đồ doanh thu, tổng lượt bán.
- **Cấu Hình Lõi:** Khu vực chỉnh sửa tham số hệ thống (Tên shop, Tài khoản ngân hàng nhận tiền QR, Banner).

---

## 5. SỰ KHÁC BIỆT RÕ RÀNG GIỮA CÁC VAI TRÒ (ROLES)
Dự án được phân cấp quyền hạn (RBAC) vô cùng chặt chẽ để đảm bảo an ninh:
1. **User (Khách mua hàng):** 
   - Chỉ được dạo web, tìm kiếm, thêm giỏ hàng, thanh toán và xem lịch sử đơn của mình.
   - Hoàn toàn bị cấm truy cập vào link `/dashboard`. Dù cố tình gõ link cũng sẽ bị hệ thống "đá" văng ra trang Login.
2. **Moderator (Điều hành viên / Nhân viên):** 
   - Được vào `/dashboard` nhưng chỉ loanh quanh ở khu vực "Trung Tâm Xử Lý" (Quản lý Kho, Đăng sản phẩm, Trực Chat, Xử lý đơn hàng).
   - Tuyệt đối không được phép tiếp cận doanh thu, không được đuổi việc nhân viên khác, không được sửa đổi danh mục phân loại.
3. **Admin (Tối cao / Chủ Shop):** 
   - Có toàn bộ quyền hạn của Moderator.
   - Thấy được thêm khu vực "Quyền Lực Tối Cao" để xem doanh thu cốt lõi, thay đổi hệ thống phân quyền nhân sự, và cài đặt lại toàn bộ cấu hình web.

---

## 6. CƠ CHẾ BẢO MẬT & VẬN HÀNH (SECURITY MECHANISMS)
Mặc dù là mô hình Card Shop, hệ thống được trang bị các tiêu chuẩn bảo mật khắt khe:

- **Bảo mật Định tuyến (Navigation Guards):** 
  Ở phía Frontend (Vue Router), mọi cú click chuyển trang đều bị một "Người gác cổng" kiểm tra. Nếu trang đó đánh dấu `requiresAuth` (Cần đăng nhập) hoặc `requiresAdmin` (Cần quyền Admin), hệ thống sẽ quét đối chiếu State của Pinia. Nếu sai quyền, lệnh chuyển trang lập tức bị hủy bỏ.
- **Bảo mật Phiên làm việc (Session/Token):** 
  Sau khi đăng nhập thành công, máy chủ sinh ra một Token/Session mã hóa. Token này được Frontend lưu trữ tĩnh. Mọi API gọi về Backend đều phải móc Token này vào Header để chứng minh nhân thân. Nếu cố tình dùng API sửa kho hàng mà thiếu Token Admin, máy chủ sẽ trả mã lỗi `403 Forbidden`.
- **Chống SQL Injection (Parameterized Query):**
  Mọi Form nhập liệu (Đăng ký, Thêm thẻ bài, Tìm kiếm) đều được Backend xử lý thông qua biến tham số `?` trong thư viện MySQL. Chuỗi nhập liệu được làm sạch tự động, do đó dù Hacker có nhập mã độc SQL vào ô Tên đăng nhập cũng không thể phá sập Database.
- **Cơ chế Upload An Toàn:** 
  Hệ thống xử lý file ảnh bằng luồng `multipart/form-data`, đi qua bộ lọc (Filter) chỉ chấp nhận định dạng ảnh (JPG, PNG). Các tệp thực thi (PHP, JS, EXE) sẽ bị từ chối ngay lập tức để chống mã độc xâm nhập máy chủ.
- **Giao tiếp UX An Toàn:** 
  Toàn bộ hộp thoại nguy hiểm như "Xóa Dữ Liệu" đều ép buộc người dùng phải qua 2 bước (Bấm nút Xóa -> Hiện Modal Xác Nhận -> Bấm Đồng ý lần nữa), giúp ngăn chặn rủi ro thất thoát dữ liệu do quản trị viên lỡ tay nhấp nhầm.
