const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // API TẠO ĐƠN HÀNG (CHECKOUT)
    router.post('/', (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ error: "Chưa đăng nhập!" });
        }

        const userId = req.session.user.id;
        const { total_price, shipping_address, phone_number, items, payment_method } = req.body;
        // items là mảng các card trong giỏ: [{card_id, quantity, price}, ...]

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Giỏ hàng rỗng." });
        }

        const initialStatus = payment_method === 'QR' ? 'pending' : 'pending';

        const sqlOrder = "INSERT INTO orders (user_id, total_price, shipping_address, phone_number, status) VALUES (?, ?, ?, ?, ?)";
        db.query(sqlOrder, [userId, total_price, shipping_address, phone_number, initialStatus], (err, orderResult) => {
            if (err) return res.status(500).json({ error: "Lỗi tạo đơn hàng CSDL." });

            const orderId = orderResult.insertId;

            // Chèn order_items
            const orderItemsData = items.map(p => [orderId, p.id, p.price, p.quantity]);
            const sqlOrderItems = "INSERT INTO order_items (order_id, card_id, price_at_purchase, quantity) VALUES ?";
            
            db.query(sqlOrderItems, [orderItemsData], (err) => {
                if (err) console.error("Lỗi insert order_items:", err);

                // Dọn giỏ hàng của user
                db.query("DELETE FROM cart WHERE user_id = ?", [userId], () => {
                    res.json({ message: "Đã tạo đơn hàng thành công", order_id: orderId });
                });
            });
        });
    });

    // API CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (Dành cho Admin hoặc luồng QR Confirm)
    router.put('/:id/status', (req, res) => {
        const orderId = req.params.id;
        const { status } = req.body;
        
        db.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId], (err, result) => {
            if (err) return res.status(500).json({ error: "Lỗi cập nhật trạng thái đơn." });
            res.json({ message: "Đã cập nhật trạng thái đơn." });
        });
    });

    // API LẤY CHI TIẾT 1 LỊCH SỬ ĐƠN CỦA USER
    router.get('/my-orders', (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ error: "Chưa đăng nhập!" });
        }
        const userId = req.session.user.id;
        db.query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId], (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi CSDL" });
            res.json(results);
        });
    });

    // API LẤY TẤT CẢ ĐƠN HÀNG (Cho mục đích Admin)
    router.get('/', (req, res) => {
        db.query("SELECT orders.*, users.username FROM orders JOIN users ON orders.user_id = users.id ORDER BY created_at DESC", (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi CSDL" });
            res.json(results);
        });
    });

    // API LẤY CHI TIẾT 1 ĐƠN HÀNG (Cho mục đích hiển thị ở QR Payment)
    router.get('/:id', (req, res) => {
        const orderId = req.params.id;
        db.query("SELECT * FROM orders WHERE id = ?", [orderId], (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi CSDL" });
            if (results.length === 0) return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
            res.json(results[0]);
        });
    });

    return router;
};
