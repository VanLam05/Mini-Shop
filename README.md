# Mini Profile App - Backend API

Ứng dụng Mini Profile App với các chức năng: đăng nhập, quản lý session, cookie theme, và trang cá nhân.

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
- Giao diện thay đổi theo theme (light/dark)

### 2. Chọn theme `/set-theme/:theme`
- Lưu theme vào cookie (chỉ chấp nhận "light" hoặc "dark")
- Cookie sống trong 10 phút
- Khi quay lại `/`, giao diện sẽ thay đổi theo theme đã lưu

### 3. Đăng nhập `/login`
- Form nhập username
- Lưu username vào session
- Lưu loginTime (thời điểm đăng nhập) vào session

### 4. Trang cá nhân `/profile`
- Chỉ truy cập được khi đã đăng nhập
- Hiển thị:
  - Username
  - Thời điểm đăng nhập
  - Số lần đã truy cập trang /profile trong phiên hiện tại
- Mỗi lần F5 (refresh), bộ đếm tăng lên 1

### 5. Đăng xuất `/logout`
- Xóa session
- Chuyển hướng đến trang login
- Sau logout, truy cập `/profile` sẽ bị chuyển hướng về `/login`

## Cơ chế hoạt động

### Session
- Sử dụng `express-session` để quản lý session
- Session tồn tại trong 1 giờ
- Lưu trữ: username, loginTime, profileVisitCount

### Cookie
- Sử dụng `cookie-parser` để xử lý cookie
- Cookie theme tồn tại trong 10 phút

### Authentication
- Middleware `isAuthenticated` kiểm tra xem người dùng đã đăng nhập hay chưa
- Nếu chưa đăng nhập, sẽ chuyển hướng đến `/login`

## Cấu trúc Request/Response

### GET `/login`
Hiển thị form đăng nhập

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
Lưu cookie và hiển thị thông báo

### GET `/logout`
Xóa session và chuyển hướng đến `/login`

## Test ứng dụng

1. Mở trình duyệt và vào `http://localhost:3000`
2. Bạn sẽ thấy "Bạn chưa đăng nhập"
3. Nhấp vào "Đăng nhập" hoặc vào `/login`
4. Nhập username và submit
5. Bạn sẽ được chuyển đến `/profile`
6. Refresh trang và thấy bộ đếm tăng lên
7. Chọn theme (light/dark) từ trang chủ
8. Khi quay lại `/`, giao diện sẽ thay đổi theo theme
9. Nhấp "Đăng xuất" để logout
