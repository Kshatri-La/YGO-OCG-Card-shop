const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // API Lấy danh sách những người đã nhắn tin với shop (cho Admin)
    router.get('/conversations', (req, res) => {
        if (!req.session || !req.session.user || !['admin', 'moder'].includes(req.session.user.role)) {
            return res.status(403).json({ error: "Không có quyền truy cập" });
        }

        const sql = `
            SELECT DISTINCT
                CASE WHEN sender_username = 'admin' THEN receiver_username ELSE sender_username END as username
            FROM chat_messages
        `;
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi Server MySQL" });
            const users = results.map(r => r.username).filter(u => u !== 'admin');
            res.json(users);
        });
    });

    // API Lấy lịch sử chat với một user cụ thể
    router.get('/messages/:username', (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ error: "Chưa đăng nhập" });
        }

        const targetUser = req.params.username;
        const currentUser = req.session.user.username;
        const isAdmin = ['admin', 'moder'].includes(req.session.user.role);

        // Khách chỉ được xem chat của mình
        if (!isAdmin && currentUser !== targetUser) {
            return res.status(403).json({ error: "Bạn không thể xem chat của người khác" });
        }

        const sql = `
            SELECT * FROM chat_messages 
            WHERE (sender_username = ? AND receiver_username = 'admin')
               OR (sender_username = 'admin' AND receiver_username = ?)
            ORDER BY timestamp ASC
        `;

        db.query(sql, [targetUser, targetUser], (err, results) => {
            if (err) {
                require('../logger').logError("Lỗi MySQL (Fetch Messages)", err);
                return res.status(500).json({ error: "Lỗi Server MySQL" });
            }
            // require('../logger').logError(`[DEBUG] Fetched messages for ${targetUser}`, JSON.stringify(results));
            res.json(results);
        });
    });

    // API Gửi tin nhắn
    router.post('/send', (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ error: "Chưa đăng nhập" });
        }

        const { targetUser, text } = req.body;
        const isAdmin = ['admin', 'moder'].includes(req.session.user.role);
        
        // Cố định tên Shop là 'admin' để đồng bộ với UI
        const sender = isAdmin ? 'admin' : req.session.user.username;

        let receiver = 'admin';
        // Nếu admin gửi tin nhắn, receiver là targetUser
        if (isAdmin && targetUser) {
            receiver = targetUser;
        }

        const sql = `
            INSERT INTO chat_messages (sender_username, receiver_username, text) 
            VALUES (?, ?, ?)
        `;

        db.query(sql, [sender, receiver, text], (err, result) => {
            if (err) {
                require('../logger').logError("Lỗi MySQL (Chat Send)", err);
                return res.status(500).json({ error: "Không thể gửi tin nhắn" });
            }
            res.json({ message: "Đã gửi", id: result.insertId });
        });
    });

    // API Xóa cuộc trò chuyện
    router.delete('/conversations/:username', (req, res) => {
        if (!req.session || !req.session.user || !['admin', 'moder'].includes(req.session.user.role)) {
            return res.status(403).json({ error: "Không có quyền" });
        }

        const targetUser = req.params.username;
        const sql = `
            DELETE FROM chat_messages 
            WHERE (sender_username = ? AND receiver_username = 'admin')
               OR (sender_username = 'admin' AND receiver_username = ?)
        `;

        db.query(sql, [targetUser, targetUser], (err, result) => {
            if (err) {
                require('../logger').logError("Lỗi MySQL (Xóa Chat)", err);
                return res.status(500).json({ error: "Lỗi Server MySQL" });
            }
            res.json({ message: "Đã xóa toàn bộ lịch sử trò chuyện" });
        });
    });

    return router;
};
