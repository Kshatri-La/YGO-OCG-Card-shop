const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // API ĐĂNG NHẬP
    router.post('/login', (req, res) => {
        const { username, password } = req.body;

        const sql = "SELECT * FROM users WHERE username = ?";
        db.query(sql, [username], (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi Server MySQL" });
            
            if (results.length === 0) {
                return res.status(401).json({ error: "Tài khoản không tồn tại!" });
            }

            const user = results[0];

            if (password !== user.password) {
                return res.status(401).json({ error: "Sai mật khẩu!" });
            }

            // Lưu thông tin người dùng vào session
            req.session.user = {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                role: user.role,
                email: user.email,
                phone: user.phone
            };

            res.json({
                message: "Đăng nhập thành công",
                user: req.session.user
            });
        });
    });

    // API LẤY THÔNG TIN SESSION HIỆN TẠI
    router.get('/me', (req, res) => {
        if (req.session && req.session.user) {
            res.json({ user: req.session.user });
        } else {
            res.status(401).json({ error: "Chưa đăng nhập" });
        }
    });

    // API ĐĂNG XUẤT
    router.post('/logout', (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ error: "Lỗi khi đăng xuất" });
            }
            res.clearCookie('connect.sid'); // Xoá cookie session của express-session mặc định
            res.json({ message: "Đăng xuất thành công" });
        });
    });

    // API QUÊN MẬT KHẨU (Reset giả lập)
    router.post('/reset-password', (req, res) => {
        const { username, newPassword } = req.body;
        // Check username exists
        const sql = "SELECT * FROM users WHERE username = ?";
        db.query(sql, [username], (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi Server MySQL" });
            if (results.length === 0) return res.status(404).json({ error: "Tên đăng nhập không tồn tại!" });
            
            // Cập nhật pass (sau này sẽ dùng hash)
            const updateSql = "UPDATE users SET password = ? WHERE username = ?";
            db.query(updateSql, [newPassword, username], (err, result) => {
                if (err) return res.status(500).json({ error: "Không thể đổi mật khẩu" });
                res.json({ message: "Mật khẩu đã được thiết lập lại thành công!" });
            });
        });
    });

    // API ĐỔI MẬT KHẨU (Từ Profile)
    router.post('/change-password', (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ error: "Chưa đăng nhập!" });
        }

        const { currentPassword, newPassword } = req.body;
        const userId = req.session.user.id;

        const sql = "SELECT * FROM users WHERE id = ?";
        db.query(sql, [userId], (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi Server MySQL" });
            if (results.length === 0) return res.status(404).json({ error: "Tài khoản không tồn tại!" });

            const user = results[0];
            if (user.password !== currentPassword) {
                return res.status(400).json({ error: "Mật khẩu hiện tại không đúng!" });
            }

            const updateSql = "UPDATE users SET password = ? WHERE id = ?";
            db.query(updateSql, [newPassword, userId], (err, result) => {
                if (err) return res.status(500).json({ error: "Không thể lưu mật khẩu mới" });
                res.json({ message: "Đổi mật khẩu bảo mật thành công!" });
            });
        });
    });

    // API CẬP NHẬT THÔNG TIN HỒ SƠ
    router.put('/profile', (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ error: "Chưa đăng nhập!" });
        }

        const { full_name, email, phone } = req.body;
        const userId = req.session.user.id;

        // Check coi email trùng nhau ko nếu đổi mail, tạm thời cứ update thẳng
        const updateSql = "UPDATE users SET full_name = ?, email = ?, phone = ? WHERE id = ?";
        db.query(updateSql, [full_name, email, phone, userId], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Email này đã được sử dụng!"});
                return res.status(500).json({ error: "Lỗi cập nhật CSDL" });
            }
            
            // Cập nhật session
            req.session.user.full_name = full_name;
            req.session.user.email = email;
            req.session.user.phone = phone;

            res.json({ 
                message: "Cập nhật hồ sơ thành công!", 
                user: req.session.user 
            });
        });
    });

    // API ĐĂNG KÝ
    router.post('/register', (req, res) => {
        const { username, password, email, full_name } = req.body;
        
        // Kiểm tra user tồn tại
        db.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi Server MySQL" });
            if (results.length > 0) {
                return res.status(400).json({ error: "Tên đăng nhập hoặc Email đã tồn tại!" });
            }

            // Giai đoạn đầu: lưu plaintext password (sau này bcrypt)
            const insertSql = "INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, 'customer')";
            db.query(insertSql, [username, email, password, full_name], (err, result) => {
                if (err) return res.status(500).json({ error: "Không thể tạo tài khoản" });
                res.json({ message: "Đăng ký thành công! Chào mừng Khách hàng." });
            });
        });
    });

    return router;
};
