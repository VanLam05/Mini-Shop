# Mini Profile App - Backend API

Ứng dụng Mini Profile App với các chức năng: đăng nhập, quản lý session, cookie theme, và trang cá nhân. Hỗ trợ đầy đủ theme (light/dark) đồng bộ trên tất cả các trang.

## Yêu cầu

- Node.js (phiên bản 12+)
- npm

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy ứng dụng:
```bash
npm start
```

Hoặc sử dụng nodemon để phát triển:
```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`

## Các tính năng

### 1. Trang chủ `/`
- Hiển thị trạng thái đăng nhập
- Nếu chưa đăng nhập: "Bạn chưa đăng nhập"
- Nếu đã đăng nhập: "Xin chào, [username]"
- Hiển thị theme hiện tại (từ cookie)
- **Menu động theo trạng thái:**
  - Chưa đăng nhập: Hiện "Đăng nhập" + "Chọn Theme"
  - Đã đăng nhập: Hiện "Trang cá nhân" + "Chọn Theme" + "Đăng xuất"
- Giao diện thay đổi theo theme (light/dark)

### 2. Chọn theme `/set-theme/:theme`
- Lưu theme vào cookie (chỉ chấp nhận "light" hoặc "dark")
- Cookie sống trong 10 phút
- **Tự động redirect về trang chủ** với theme đã được cập nhật
- Tất cả các trang đều **đồng bộ theme** ngay lập tức

### 3. Đăng nhập `/login`
- Form nhập username
- Lưu username vào session
- Lưu loginTime (thời điểm đăng nhập) vào session
- **Nếu đã đăng nhập, tự động redirect về `/profile`**

### 4. Trang cá nhân `/profile`
- Chỉ truy cập được khi đã đăng nhập
- Hiển thị:
  - Username
  - Thời điểm đăng nhập
  - Số lần đã truy cập trang /profile trong phiên hiện tại
- Mỗi lần F5 (refresh), bộ đếm tăng lên 1
- **Giao diện đồng bộ theme** với các trang khác

### 5. Đăng xuất `/logout`
- Xóa session
- **Chuyển hướng về trang chủ** (không phải trang login)
- Sau logout, truy cập `/profile` sẽ bị chuyển hướng về `/login`

## Cơ chế hoạt động

### Session
- Sử dụng `express-session` để quản lý session
- Session tồn tại trong 1 giờ
- Lưu trữ: username, loginTime, profileVisitCount

### Cookie
- Sử dụng `cookie-parser` để xử lý cookie
- Cookie theme tồn tại trong 10 phút
- **Cookie được áp dụng trên tất cả các trang** (light/dark)

### Authentication
- Middleware `isAuthenticated` kiểm tra xem người dùng đã đăng nhập hay chưa
- Nếu chưa đăng nhập, sẽ chuyển hướng đến `/login`

### Theme Styling
- Tất cả các trang sử dụng hàm `getCommonStyles(theme)` để gen CSS chung
- Đảm bảo tính nhất quán và đồng bộ theme trên toàn ứng dụng

## Cấu trúc Request/Response

### GET `/`
Trang chủ - menu động theo trạng thái đăng nhập

### GET `/login`
Hiển thị form đăng nhập (nếu chưa đăng nhập)

### POST `/login`
```
Body: 
- username (required): tên đăng nhập
```
Lưu session và chuyển hướng đến `/profile`

### GET `/profile`
Hiển thị trang cá nhân (yêu cầu đã đăng nhập)

### GET `/set-theme/:theme`
- theme: "light" hoặc "dark"
Lưu cookie và redirect về `/` với theme đã được cập nhật

### GET `/logout`
Xóa session và chuyển hướng về `/`

## Tính năng Chi tiết

### Theme Đồng Bộ
- Khi đổi theme, tất cả các trang sẽ luôn sử dụng cùng theme
- Cookie theme được gửi kèm mỗi request
- Transitions mượt mà khi chuyển đổi theme

### Menu Động
- Menu tự động thay đổi dựa vào trạng thái session
- Ẩn/hiện nút phù hợp với trạng thái người dùng
- UX tốt hơn và tránh nút không dùng được

### Bảo mật
- Session chỉ lưu trữ thông tin người dùng (không lưu trên cookie)
- Authentication middleware bảo vệ trang `/profile`
- Theme cookie là công khai (không sensitive)

## Test ứng dụng

### Quy trình test toàn bộ

1. **Test chưa đăng nhập:**
   - Vào `http://localhost:3000`
   - Thấy "Bạn chưa đăng nhập"
   - Chỉ thấy nút "Đăng nhập" + "Chọn Theme"

2. **Test đổi theme (chưa đăng nhập):**
   - Ấn "Chế độ tối"
   - Trang chủ tự động thay đổi theme tối
   - Quay lại trang chủ, theme vẫn tối

3. **Test đăng nhập:**
   - Ấn "Đăng nhập"
   - Nhập username (vd: "John")
   - Tự động chuyển đến `/profile`

4. **Test trang cá nhân:**
   - Thấy Username, login time, số lần truy cập
   - Refresh (F5) trang - bộ đếm tăng lên 1
   - Refresh lại - bộ đếm tăng tiếp

5. **Test quay về trang chủ (đã đăng nhập):**
   - Ấn "Quay lại trang chủ" hoặc vào `/`
   - Thấy "Xin chào, John"
   - Thấy nút "Trang cá nhân" + "Chọn Theme" + "Đăng xuất"
   - **Không thấy nút "Đăng nhập"**

6. **Test đổi theme (đã đăng nhập):**
   - Ấn "Chế độ sáng"
   - Trang chủ đổi theme sáng
   - Ấn "Trang cá nhân" - theme vẫn sáng

7. **Test đăng xuất:**
   - Ấn "Đăng xuất"
   - Quay lại trang chủ
   - Thấy "Bạn chưa đăng nhập" lại
   - **Không thấy nút "Đăng xuất"**, chỉ có "Đăng nhập"

8. **Test truy cập /profile sau logout:**
   - Cố gắng vào `/profile` trong tab mới
   - Tự động chuyển hướng về `/login`

9. **Test truy cập /login khi đã đăng nhập:**
   - Đăng nhập
   - Vào `/login`
   - Tự động chuyển hướng về `/profile`

## Notes

- Session sống trong 1 giờ
- Cookie theme sống trong 10 phút
- Mỗi tab/browser có session riêng
- Cookie được chia sẻ giữa tất cả tab cùng domain
- Tất cả theme colors consistent trên toàn app
