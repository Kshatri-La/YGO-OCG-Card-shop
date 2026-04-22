const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // 1. API LẤY CÂY THƯ MỤC
    router.get('/', (req, res) => {
        db.query("SELECT * FROM categories", (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi Server MySQL" });
            
            // Xây dựng cây danh mục
            const categoryMap = {};
            const tree = [];
            
            results.forEach(cat => {
                categoryMap[cat.id] = { ...cat, children: [] };
            });

            results.forEach(cat => {
                if (cat.parent_id) {
                    if (categoryMap[cat.parent_id]) {
                        categoryMap[cat.parent_id].children.push(categoryMap[cat.id]);
                    }
                } else {
                    tree.push(categoryMap[cat.id]);
                }
            });

            res.json(tree);
        });
    });

    // 2. API THÊM THƯ MỤC
    router.post('/', (req, res) => {
        if (!req.session || !req.session.user || !['admin', 'moder'].includes(req.session.user.role)) {
            return res.status(403).json({ error: "Không có quyền" });
        }
        
        const { name, parent_id } = req.body;
        const parentIdValue = parent_id ? parent_id : null;

        db.query("INSERT INTO categories (name, parent_id) VALUES (?, ?)", [name, parentIdValue], (err, result) => {
            if (err) {
                require('../logger').logError("Lỗi MySQL (Thêm Nhóm)", err);
                console.error("Lỗi MySQL (Thêm Nhóm):", err);
                return res.status(500).json({ error: "Lỗi Server MySQL" });
            }
            res.json({ message: "Thêm danh mục thành công", id: result.insertId });
        });
    });

    // 3. LẤY SẢN PHẨM CHƯA PHÂN NHÓM
    router.get('/cards/unassigned', (req, res) => {
        db.query("SELECT id, name, image_url, card_code FROM cards WHERE category_id IS NULL", (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi Server MySQL" });
            res.json(results);
        });
    });

    // 4. LẤY SẢN PHẨM TRONG 1 NHÓM CỤ THỂ
    router.get('/:id/cards', (req, res) => {
        const categoryId = req.params.id;
        db.query("SELECT id, name, image_url, card_code FROM cards WHERE category_id = ?", [categoryId], (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi Server MySQL" });
            res.json(results);
        });
    });

    // 5. GÁN SẢN PHẨM VÀO NHÓM
    router.put('/cards/assign', (req, res) => {
        if (!req.session || !req.session.user || !['admin', 'moder'].includes(req.session.user.role)) {
            return res.status(403).json({ error: "Không có quyền" });
        }

        const { card_id, category_id } = req.body;
        
        const catIdValue = category_id ? category_id : null;

        db.query("UPDATE cards SET category_id = ? WHERE id = ?", [catIdValue, card_id], (err) => {
            if (err) {
                console.error("Lỗi MySQL (Gán thẻ):", err);
                return res.status(500).json({ error: "Lỗi Server MySQL" });
            }
            res.json({ message: "Gán danh mục thành công" });
        });
    });

    // ---------------- TAGS API ---------------- //
    router.get('/tags', (req, res) => {
        db.query("SELECT * FROM tags", (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi Server MySQL" });
            res.json(results);
        });
    });

    router.post('/tags', (req, res) => {
        if (!req.session || !req.session.user || !['admin', 'moder'].includes(req.session.user.role)) {
            return res.status(403).json({ error: "Không có quyền" });
        }
        
        const { name, color } = req.body;
        db.query("INSERT INTO tags (name, color) VALUES (?, ?)", [name, color], (err, result) => {
            if (err) return res.status(500).json({ error: "Lỗi Server MySQL (có thể trùng tên Tag)" });
            res.json({ message: "Thêm Tag thành công", id: result.insertId });
        });
    });

    router.delete('/tags/:id', (req, res) => {
        if (!req.session || !req.session.user || !['admin', 'moder'].includes(req.session.user.role)) {
            return res.status(403).json({ error: "Không có quyền" });
        }
        
        db.query("DELETE FROM tags WHERE id = ?", [req.params.id], (err) => {
            if (err) return res.status(500).json({ error: "Lỗi Server MySQL" });
            res.json({ message: "Xóa Tag thành công" });
        });
    });

    // 4. API XÓA THƯ MỤC
    router.delete('/:id', (req, res) => {
        if (!req.session || !req.session.user || !['admin', 'moder'].includes(req.session.user.role)) {
            return res.status(403).json({ error: "Không có quyền" });
        }

        const categoryId = req.params.id;
        
        db.query("DELETE FROM categories WHERE id = ?", [categoryId], (err, result) => {
            if (err) {
                require('../logger').logError("Lỗi MySQL (Xóa Nhóm)", err);
                return res.status(500).json({ error: "Lỗi Server MySQL" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Không tìm thấy danh mục" });
            }
            res.json({ message: "Đã xóa danh mục thành công" });
        });
    });

    return router;
};
