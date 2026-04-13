const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'cardshop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/api/cards', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cards');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/cards/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cards WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/cards', upload.single('image'), async (req, res) => {
  const { name, card_code, price, pack_name, series, rarity, stock_quantity, description } = req.body;
  let finalImageUrl = req.body.image_url || '';
  if (req.file) {
    finalImageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO cards (name, card_code, price, pack_name, series, rarity, image_url, stock_quantity, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, card_code, price, pack_name, series || 'Yu-Gi-Oh!', rarity, finalImageUrl, stock_quantity || 1, description]
    );
    res.status(201).json({ id: result.insertId, message: 'Card added successfully' });
  } catch (error) {
    console.error('Error adding card:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Yu-Gi-Oh! API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
