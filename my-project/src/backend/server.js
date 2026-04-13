const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

// Cấu hình
app.use(cors({
    origin: 'http://localhost:8081', // Thay đổi cổng nếu frontend của bạn ở port khác
    credentials: true
})); // Cho phép Vue gọi API với Cookie
app.use(express.json());
app.use(cookieParser());

// Cấu hình Session
app.use(session({
    secret: 'YUGIOH_SESSION_SECRET_KEY',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set true nếu dùng HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 ngày
    }
}));

// 1. KẾT NỐI DATABASE
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'cardshop'
});

db.connect(err => {
    if (err) {
        console.error('❌ Lỗi kết nối MySQL :', err.message);
        return;
    }
    console.log('✅ Đã kết nối MySQL thành công!');

    // Tự động Upgrade Database cho cột Phone và System Settings
    db.query("SHOW COLUMNS FROM users LIKE 'phone'", (err, results) => {
        if (!err && results.length === 0) {
            db.query("ALTER TABLE users ADD COLUMN phone VARCHAR(15) AFTER email", (err) => {
                if (!err) console.log("DB Upgrade: Đã thêm cột phone vào users");
            });
        }
    });

    const initSettings = "INSERT IGNORE INTO system_settings (setting_key, setting_value, description) VALUES ('qr_bank_name', 'Techcombank', 'Tên Ngân hàng'), ('qr_account_name', 'YUGIOH KANJ', 'Chủ tài khoản'), ('qr_account_number', '1903123456789', 'Số tài khoản'), ('qr_phone', '0912345678', 'SĐT Chủ TK')";
    db.query(initSettings, (err) => {
        if (!err) console.log("DB Upgrade: Đã cập nhật setting QR mặc định (nếu chưa có)");
    });
});

// Import các Module Routes
const authRoutes = require('./routes/auth')(db);
app.use('/api/auth', authRoutes);

const adminRoutes = require('./routes/admin')(db);
app.use('/api/admin', adminRoutes);

const orderRoutes = require('./routes/orders')(db);
app.use('/api/orders', orderRoutes);

// Endpoint lấy LAN IP cho QR
app.get('/api/network-ip', (req, res) => {
    const os = require('os');
    const nets = os.networkInterfaces();
    let localIp = '127.0.0.1';
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Lấy IPv4 và không phải localhost (internal)
            if (net.family === 'IPv4' && !net.internal) {
                localIp = net.address;
                break;
            }
        }
    }
    // Port của Frontend. Vue CLI hay chạy ở 8080 hoặc 8081. 
    // Chúng ta trả về IP thôi, frontend tự lấy port hiện tại
    res.json({ ip: localIp });
});

// 2. API LẤY TẤT CẢ CARD (Cho trang Home)
app.get('/api/cards', (req, res) => {
    const sql = "SELECT * FROM cards";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 3. API LẤY CHI TIẾT 1 CARD (Cho trang Detail)
app.get('/api/cards/:id', (req, res) => {
    const sql = "SELECT * FROM cards WHERE id = ?";
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy card" });
        res.json(results[0]);
    });
});

// Chạy server 
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`🚀 Backend đang chạy tại: http://localhost:${PORT}`);
});