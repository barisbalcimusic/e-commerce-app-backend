-- CREATE DATABASE IF NOT EXISTS
CREATE DATABASE IF NOT EXISTS `e-commerce`;

USE `e-commerce`;

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    category VARCHAR(255),
    targetGroup VARCHAR(255),
    brand VARCHAR(255),
    price DECIMAL(10, 2),
    rating DECIMAL(3, 2),
    discountPercentage DECIMAL(5, 2),
    stock INT,
    soldCount INT 
);

-- SIZES
CREATE TABLE IF NOT EXISTS sizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    size VARCHAR(50),
    isAvailable BOOLEAN,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- COLORS
CREATE TABLE IF NOT EXISTS colors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    name VARCHAR(50),
    hexCode VARCHAR(7),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- IMAGES
CREATE TABLE IF NOT EXISTS images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    url VARCHAR(255),
    alt TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- MATERIALS
CREATE TABLE IF NOT EXISTS materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    name VARCHAR(255),
    percentage DECIMAL(5, 2),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- CARE INSTRUCTIONS
CREATE TABLE IF NOT EXISTS care_instructions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    instruction TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
