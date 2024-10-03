CREATE TABLE IF NOT EXISTS baro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(255),
    price DECIMAL(10, 2),
    discountPercentage DECIMAL(5, 2),
    rating DECIMAL(3, 2),
    stock INT,
    brand VARCHAR(255),
    category VARCHAR(255),
    thumbnail VARCHAR(255),
    soldAmount INT
);

