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
    password: '',
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

    // Tạo bảng Chat Messages
    const createChatTable = `
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sender_username VARCHAR(100) NOT NULL,
            receiver_username VARCHAR(100) NOT NULL,
            text TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.query(createChatTable, (err) => {
        if (!err) console.log("DB Upgrade: Đã đảm bảo bảng chat_messages tồn tại");
    });

    // Tạo bảng Security Logs
    const createSecurityLogsTable = `
        CREATE TABLE IF NOT EXISTS security_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            event VARCHAR(255) NOT NULL,
            username VARCHAR(100),
            ip_address VARCHAR(50),
            severity VARCHAR(20) DEFAULT 'low',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.query(createSecurityLogsTable, (err) => {
        if (!err) console.log("DB Upgrade: Đã đảm bảo bảng security_logs tồn tại");
    });

    // Tạo bảng Categories
    const createCategoriesTable = `
        CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            parent_id INT DEFAULT NULL,
            FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
        )
    `;
    db.query(createCategoriesTable, (err) => {
        if (!err) {
            console.log("DB Upgrade: Đã đảm bảo bảng categories tồn tại");

            // Đảm bảo cột parent_id tồn tại (Upgrade từ phiên bản cũ)
            db.query("SHOW COLUMNS FROM categories LIKE 'parent_id'", (err, results) => {
                if (!err && results.length === 0) {
                    db.query("ALTER TABLE categories ADD COLUMN parent_id INT DEFAULT NULL", (err) => {
                        if (!err) {
                            console.log("DB Upgrade: Đã thêm cột parent_id vào categories");
                            // Khóa ngoại
                            db.query("ALTER TABLE categories ADD CONSTRAINT fk_cat_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE");
                        } else {
                            require('./logger').logError("Lỗi thêm parent_id", err);
                        }
                    });
                }
            });

            // Thêm cột category_id vào cards nếu chưa có
            db.query("SHOW COLUMNS FROM cards LIKE 'category_id'", (err, results) => {
                if (!err && results.length === 0) {
                    db.query("ALTER TABLE cards ADD COLUMN category_id INT DEFAULT NULL", (err) => {
                        if (!err) {
                            console.log("DB Upgrade: Đã thêm cột category_id vào cards");
                            // Thêm foreign key
                            db.query("ALTER TABLE cards ADD CONSTRAINT fk_card_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL");
                        }
                    });
                }
            });

            // Tự động tạo một số danh mục mặc định nếu bảng trống
            db.query("SELECT COUNT(*) as count FROM categories", (err, results) => {
                if (!err && results[0].count === 0) {
                    const defaultCats = [
                        ['Card (Thẻ Bài Lẻ)', null],
                        ['Box (Hộp Bài)', null],
                        ['Phụ Kiện', null],
                        ['Khác', null]
                    ];
                    db.query("INSERT INTO categories (name, parent_id) VALUES ?", [defaultCats], (err) => {
                        if (!err) console.log("DB Upgrade: Đã tạo các danh mục mặc định.");
                        else require('./logger').logError("Lỗi Seeding Categories", err);
                    });
                } else if (err) {
                    require('./logger').logError("Lỗi đếm Categories", err);
                }
            });
        } else {
            require('./logger').logError("Lỗi tạo bảng Categories", err);
        }
    });

    const userProducts = [
        { name: 'Bọc thẻ bài Yugioh Size sleeve nhám 62x89', code: 'IMP-1001', type: 3, url: 'https://shopee.vn/B%E1%BB%99-60-B%E1%BB%8Dc-th%E1%BA%BB-b%C3%A0i-Yugioh-Size-sleeve-nh%C3%A1m-cho-Yugioh-Vanguard-nhi%E1%BB%81u-m%C3%A0u-s%E1%BA%AFc-62x89-i.1478482097.42454048974' },
        { name: '50 cái bọc bài nhám Sleeve Size Double 66X92 Henwei', code: 'IMP-1002', type: 3, url: 'https://shopee.vn/50-c%C3%A1i-b%E1%BB%8Dc-b%C3%A0i-nh%C3%A1m-Sleeve-Size-Double-66X92-Henwei-nguy%C3%AAn-seal-cho-th%E1%BA%BB-b%C3%A0i-Yugioh-Vanguard-i.1478482097.40454312736' },
        { name: 'Deck Box Nhựa Đựng Thẻ Bài (80-100)', code: 'IMP-1003', type: 3, url: 'https://shopee.vn/Deck-Box-Nh%E1%BB%B1a-%C4%90%E1%BB%B1ng-Th%E1%BA%BB-B%C3%A0i-(80-100-)-%E2%80%93-H%E1%BB%99p-%C4%90%E1%BB%B1ng-Th%E1%BA%BB-Yu-Gi-Oh!-Magic-Pok%C3%A9mon-i.1478482097.57000954158' },
        { name: 'Deck box da Hộp đựng thẻ bài da PU 100 TOPO', code: 'IMP-1004', type: 3, url: "https://shopee.vn/-Deck-box-da-H%E1%BB%99p-%C4%91%E1%BB%B1ng-th%E1%BA%BB-b%C3%A0i-da-PU-100-ch%C3%ADnh-h%C3%A3ng-TOPO'S-nhi%E1%BB%81u-m%C3%A0u-cho-th%E1%BA%BB-Yugioh-Pokemon-vanguard.-i.242727131.19374633840" },
        { name: 'eBay Yugioh Card 19078147173', code: 'IMP-1005', type: 1, url: 'https://www.ebay.com/p/19078147173?iid=318112196143' },
        { name: 'eBay Yugioh Card 336384493537', code: 'IMP-1006', type: 1, url: 'https://www.ebay.com/itm/336384493537' },
        { name: 'eBay Yugioh Card 24078145344', code: 'IMP-1007', type: 1, url: 'https://www.ebay.com/p/24078145344?iid=197244854611' },
        { name: 'eBay Yugioh Card 168323654459', code: 'IMP-1008', type: 1, url: 'https://www.ebay.com/p/4078151397?iid=168323654459' }
    ];

    userProducts.forEach(p => {
        db.query("INSERT IGNORE INTO cards (name, card_code, price, image_url, category_id, description, stock_quantity) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [p.name, p.code, 50000, '', p.type, 'Link gốc: ' + p.url, 10], (err) => {
                if (err) console.error("Lỗi thêm sản phẩm:", err.message);
            });
    });

    // Tạo bảng Tags
    const createTagsTable = `
        CREATE TABLE IF NOT EXISTS tags (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            color VARCHAR(50) DEFAULT 'bg-red-900'
        )
    `;
    db.query(createTagsTable, (err) => {
        if (!err) console.log("DB Upgrade: Đã đảm bảo bảng tags tồn tại");
    });
});

// Import các Module Routes
const authRoutes = require('./routes/auth')(db);
app.use('/api/auth', authRoutes);

const adminRoutes = require('./routes/admin')(db);
app.use('/api/admin', adminRoutes);

const orderRoutes = require('./routes/orders')(db);
app.use('/api/orders', orderRoutes);

const chatRoutes = require('./routes/chat')(db);
app.use('/api/chat', chatRoutes);

const categoryRoutes = require('./routes/category')(db);
app.use('/api/categories', categoryRoutes);

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
