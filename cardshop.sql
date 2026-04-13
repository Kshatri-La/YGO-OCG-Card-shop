CREATE DATABASE IF NOT EXISTS cardshop;
USE cardshop;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('admin', 'moder', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    card_code VARCHAR(50) NOT NULL UNIQUE,
    price DECIMAL(15, 2) NOT NULL DEFAULT 0,
    pack_name VARCHAR(255),
    series VARCHAR(100),
    rarity VARCHAR(50),
    image_url VARCHAR(500),
    stock_quantity INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    card_id INT NOT NULL,
    quantity INT DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    phone_number VARCHAR(15),
    status ENUM('pending', 'paid', 'shipped', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    card_id INT NOT NULL,
    price_at_purchase DECIMAL(15, 2) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES cards(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cms_news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    author_id INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS live_chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    sender_name VARCHAR(100),
    is_admin BOOLEAN DEFAULT FALSE,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO users (username, email, password, full_name, role)
VALUES 
('anhoaiadmin', 'admin@tcgshop.com', 'admin', 'CEO Master', 'admin');

INSERT INTO cards (name, card_code, price, pack_name, series, rarity, image_url, stock_quantity, description) 
VALUES 
(
    'Philias Diabel', 
    'ALIN-JP057', 
    180000, 
    'The Infinite Forbidden', 
    'Yu-Gi-Oh!', 
    'Rare', 
    'https://i.redd.it/mmyh95t9yeje1.jpeg', 
    15, 
    'Search 1 Level 8 or higher "Diabell" monster from Deck to hand.'
),
(
    'Lady Labrynth of the Silver Castle (Alt Art)', 
    'QCAC-JP011', 
    2500000, 
    'Quarter Century Art Collection', 
    'Yu-Gi-Oh!', 
    'Quarter Century Secret Rare', 
    'https://i.ebayimg.com/images/g/crsAAOSwewhnubjO/s-l1200.jpg', 
    2, 
    'Cannot be destroyed or targeted while you control a Set card.'
),
(
    'Lady Labrynth of the Silver Castle', 
    'DABL-EN030', 
    4500000, 
    'Darkwing Blast', 
    'Yu-Gi-Oh!', 
    'Starlight Rare', 
    'https://www.cardtrader.com/uploads/blueprints/image/250612/show_lady-labrynth-of-the-silver-castle-quarter-century-secret-rare-battles-of-legend-monstrous-revenge.jpg', 
    1, 
    'Special Summon from hand when a Labrynth or Normal Trap is activated.'
),
(
    'Legendary Full Art Card I', 
    'FA-JP001', 
    25000000, 
    'OCG Full Art Collection', 
    'Yu-Gi-Oh!', 
    'Quarter Century Secret Rare', 
    'https://cdn.essential-japan.com/wp-content/uploads/2025/12/yugioh-ocg-full-art-cards-reveal-3.jpg', 
    5, 
    'An essential piece of the ultimate collection.'
),
(
    'Legendary Full Art Card II', 
    'FA-JP002', 
    26500000, 
    'OCG Full Art Collection', 
    'Yu-Gi-Oh!', 
    'Quarter Century Secret Rare', 
    'https://cdn.essential-japan.com/wp-content/uploads/2025/12/yugioh-ocg-full-art-cards-reveal-4.jpg', 
    3, 
    'An essential piece of the ultimate collection.'
),
(
    'Legendary Full Art Card III', 
    'FA-JP003', 
    28000000, 
    'OCG Full Art Collection', 
    'Yu-Gi-Oh!', 
    'Quarter Century Secret Rare', 
    'https://cdn.essential-japan.com/wp-content/uploads/2025/12/yugioh-ocg-full-art-cards-reveal-5.jpg', 
    2, 
    'An essential piece of the ultimate collection.'
),
(
    'Legendary Full Art Card IV', 
    'FA-JP004', 
    30000000, 
    'OCG Full Art Collection', 
    'Yu-Gi-Oh!', 
    'Quarter Century Secret Rare', 
    'https://cdn.essential-japan.com/wp-content/uploads/2025/12/yugioh-ocg-full-art-cards-reveal-6.jpg', 
    4, 
    'An essential piece of the ultimate collection.'
),
(
    'Dark Magical Curtain Overframe ', 
    'LOCH-JP003', 
    21500000, 
    'Structure Deck', 
    'Yu-Gi-Oh!', 
    'Prismatic Secret Rare', 
    'https://i.ebayimg.com/images/g/oaEAAeSwZWRppUJ1/s-l1600.webp', 
    6, 
    'Prismatic Secret Rare new product.'
);