const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình Multer để lưu file ảnh thẻ bài
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

module.exports = (db) => {
    
    // API THÊM THẺ BÀI (Chỉ Admin/Moder)
    router.post('/cards', upload.single('image'), (req, res) => {
        const { 
            name, card_code, price, pack_name, series, rarity, 
            image_url, stock_quantity, description 
        } = req.body;

        // Ưu tiên file upload, nếu không có thì dùng image_url truyền tay
        let finalImageUrl = image_url;
        if (req.file) {
            // Lưu đường dẫn ảo phục vụ Frontend
            finalImageUrl = `/uploads/${req.file.filename}`;
        }

        const sql = `
            INSERT INTO cards 
            (name, card_code, price, pack_name, series, rarity, image_url, stock_quantity, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            name, card_code, price || 0, pack_name, series, rarity, 
            finalImageUrl, stock_quantity || 1, description
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                // Duplicate card_code check
                if(err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: "Mã Card này đã tồn tại trong hệ thống." });
                }
                return res.status(500).json({ error: "Lỗi Server MySQL: " + err.message });
            }
            res.json({ message: "Thêm thẻ bài thành công", id: result.insertId });
        });
    });

    // API CẬP NHẬT THẺ BÀI (Chỉ Admin/Moder)
    router.put('/cards/:id', upload.single('image'), (req, res) => {
        const id = req.params.id;
        const { 
            name, card_code, price, pack_name, series, rarity, 
            image_url, stock_quantity, description 
        } = req.body;

        let finalImageUrl = image_url;
        if (req.file) {
            finalImageUrl = `/uploads/${req.file.filename}`;
        }

        const sql = `
            UPDATE cards SET 
            name = ?, card_code = ?, price = ?, pack_name = ?, series = ?, 
            rarity = ?, image_url = ?, stock_quantity = ?, description = ?
            WHERE id = ?
        `;
        const values = [
            name, card_code, price || 0, pack_name, series, rarity, 
            finalImageUrl, stock_quantity || 0, description, id
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                if(err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: "Mã Card này đã tồn tại trong hệ thống." });
                }
                return res.status(500).json({ error: "Lỗi Server MySQL: " + err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Không tìm thấy thẻ bài với ID này." });
            }
            res.json({ message: "Cập nhật thẻ bài thành công" });
        });
    });

    // API XÓA THẺ BÀI (Chỉ Admin/Moder)
    router.delete('/cards/:id', (req, res) => {
        const id = req.params.id;
        const sql = `DELETE FROM cards WHERE id = ?`;
        db.query(sql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Lỗi Server MySQL: " + err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Không tìm thấy thẻ bài với ID này." });
            }
            res.json({ message: "Xóa thẻ bài thành công" });
        });
    });

    // API LẤY CẤU HÌNH HỆ THỐNG
    router.get('/settings', (req, res) => {
        db.query("SELECT * FROM system_settings", (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi Server MySQL" });
            
            const config = {};
            results.forEach(row => {
                config[row.setting_key] = row.setting_value;
            });
            res.json(config);
        });
    });

    // API CẬP NHẬT CẤU HÌNH
    router.put('/settings', (req, res) => {
        const settings = req.body; 
        const promises = Object.keys(settings).map(key => {
            return new Promise((resolve, reject) => {
                const sql = "INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?";
                db.query(sql, [key, settings[key], settings[key]], (err) => {
                    if (err) reject(err); else resolve();
                });
            });
        });

        Promise.all(promises)
            .then(() => res.json({ message: "Cập nhật cấu hình thành công" }))
            .catch(err => res.status(500).json({ error: "Lỗi cập nhật CSDL" }));
    });

    // API LẤY DANH SÁCH NGƯỜI DÙNG
    router.get('/users', (req, res) => {
        const search = req.query.search || '';
        let sql = "SELECT id, username, email, full_name, phone, role, created_at FROM users";
        let params = [];
        
        if (search) {
            sql += " WHERE username LIKE ? OR email LIKE ? OR full_name LIKE ?";
            params = [`%${search}%`, `%${search}%`, `%${search}%`];
        }
        
        db.query(sql, params, (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi Server MySQL" });
            res.json(results);
        });
    });

    // API CẬP NHẬT PHÂN QUYỀN (ROLE) NHÂN SỰ
    router.put('/users/:id/role', (req, res) => {
        const userId = req.params.id;
        const { role } = req.body;
        
        if (!['admin', 'moder', 'customer'].includes(role)) {
            return res.status(400).json({ error: "Quyền không hợp lệ." });
        }

        db.query("UPDATE users SET role = ? WHERE id = ?", [role, userId], (err) => {
            if (err) return res.status(500).json({ error: "Lỗi cập nhật phân quyền." });
            res.json({ message: "Cập nhật phân quyền thành công!" });
        });
    });

    // API LẤY LOG BẢO MẬT
    router.get('/security-logs', (req, res) => {
        const sql = "SELECT * FROM security_logs ORDER BY created_at DESC LIMIT 100";
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi Server MySQL: " + err.message });
            res.json(results);
        });
    });

    return router;
};
