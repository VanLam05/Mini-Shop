const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: 'mini-profile-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Route: Trang chủ /
app.get('/', (req, res) => {
  const theme = req.cookies.theme || 'light';
  
  let content = '<h1>Mini Profile App</h1>';
  
  if (req.session.username) {
    content += `<p>Xin chào, ${req.session.username}</p>`;
  } else {
    content += '<p>Bạn chưa đăng nhập</p>';
  }
  
  content += `<p>Theme hiện tại: <strong>${theme}</strong></p>`;
  content += `
    <hr>
    <h3>Chức năng:</h3>
    <ul>
      <li><a href="/login">Đăng nhập</a></li>
      <li><a href="/profile">Trang cá nhân</a></li>
      <li><a href="/set-theme/light">🌞 Chế độ sáng</a></li>
      <li><a href="/set-theme/dark">🌙 Chế độ tối</a></li>
      <li><a href="/logout">Đăng xuất</a></li>
    </ul>
  `;
  
  // Apply theme styling
  let style = theme === 'dark' 
    ? 'background-color: #1e1e1e; color: #ffffff;' 
    : 'background-color: #ffffff; color: #000000;';
  
  res.send(`
    <html>
    <head>
      <title>Mini Profile App</title>
      <style>
        body {
          ${style}
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        a {
          margin-right: 10px;
          padding: 5px 10px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 3px;
        }
        a:hover {
          background-color: #0056b3;
        }
        li {
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `);
});

// Route: Set theme /set-theme/:theme
app.get('/set-theme/:theme', (req, res) => {
  const theme = req.params.theme;
  
  // Chỉ chấp nhận light hoặc dark
  if (theme !== 'light' && theme !== 'dark') {
    return res.status(400).send('Theme không hợp lệ. Chỉ chấp nhận: light hoặc dark');
  }
  
  // Lưu cookie sống trong 10 phút (600000 ms)
  res.cookie('theme', theme, { 
    maxAge: 10 * 60 * 1000,
    httpOnly: false
  });
  
  res.send(`
    <p>Đã lưu theme: <strong>${theme}</strong></p>
    <p>Cookie sẽ tồn tại trong 10 phút</p>
    <a href="/">← Quay lại trang chủ</a>
  `);
});

// Route: Đăng nhập /login
app.get('/login', (req, res) => {
  res.send(`
    <html>
    <head>
      <title>Đăng nhập</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 300px;
          margin: 50px auto;
        }
        input[type="text"] {
          width: 100%;
          padding: 8px;
          margin: 10px 0;
          box-sizing: border-box;
        }
        button {
          width: 100%;
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <h1>Đăng nhập</h1>
      <form method="POST" action="/login">
        <input type="text" name="username" placeholder="Nhập username" required>
        <button type="submit">Đăng nhập</button>
      </form>
      <a href="/">← Quay lại trang chủ</a>
    </body>
    </html>
  `);
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  
  if (!username || username.trim() === '') {
    return res.status(400).send('Username không được để trống');
  }
  
  // Lưu username vào session
  req.session.username = username;
  
  // Lưu loginTime vào session
  req.session.loginTime = new Date().toLocaleString('vi-VN');
  
  // Khởi tạo bộ đếm truy cập /profile
  req.session.profileVisitCount = 0;
  
  res.redirect('/profile');
});

// Route: Trang cá nhân /profile
app.get('/profile', isAuthenticated, (req, res) => {
  // Tăng bộ đếm truy cập
  req.session.profileVisitCount = (req.session.profileVisitCount || 0) + 1;
  
  const visitCount = req.session.profileVisitCount;
  
  res.send(`
    <html>
    <head>
      <title>Trang cá nhân</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 400px;
          margin: 50px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .info-item {
          margin: 15px 0;
          padding: 10px;
          background-color: #f5f5f5;
          border-left: 4px solid #007bff;
        }
        .info-label {
          font-weight: bold;
          color: #333;
        }
        .info-value {
          color: #0056b3;
          font-size: 16px;
        }
        a {
          display: inline-block;
          margin: 10px 5px 10px 0;
          padding: 8px 15px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 3px;
        }
        a:hover {
          background-color: #0056b3;
        }
        a.logout {
          background-color: #dc3545;
        }
        a.logout:hover {
          background-color: #c82333;
        }
      </style>
    </head>
    <body>
      <h1>Trang cá nhân</h1>
      
      <div class="info-item">
        <div class="info-label">Username:</div>
        <div class="info-value">${req.session.username}</div>
      </div>
      
      <div class="info-item">
        <div class="info-label">Thời điểm đăng nhập:</div>
        <div class="info-value">${req.session.loginTime}</div>
      </div>
      
      <div class="info-item">
        <div class="info-label">Số lần đã truy cập trang này:</div>
        <div class="info-value">${visitCount} lần</div>
      </div>
      
      <hr>
      <div>
        <p><em>Mỗi lần F5 bộ đếm sẽ tăng lên 1</em></p>
      </div>
      
      <a href="/">← Quay lại trang chủ</a>
      <a href="/logout" class="logout">Đăng xuất</a>
    </body>
    </html>
  `);
});

// Route: Đăng xuất /logout
app.get('/logout', (req, res) => {
  // Xóa session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Lỗi khi đăng xuất');
    }
    res.redirect('/login');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
