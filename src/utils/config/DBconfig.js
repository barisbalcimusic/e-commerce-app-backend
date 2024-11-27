import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// CREATE A CONNECTION POOL
export const pool = mysql.createPool({
  host: process.env.HOST || "localhost",
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: true,
});

// TEST DATABASE CONNECTION
const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the database successfully!");
    connection.release();
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};

// INITIALIZE THE DATABASE
const initializeDatabase = async () => {
  try {
    const initQuery = fs.readFileSync("src/utils/config/init.sql", "utf-8");
    await pool.query(initQuery);
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Database initialization failed:", error.message);
  }
};

// SEED DATABASE
const seedDatabase = async () => {
  try {
    const jsonData = JSON.parse(fs.readFileSync("products.json", "utf-8"));
    for (const product of jsonData) {
      // INSERT PRODUCTS
      const productQuery =
        "INSERT INTO products (id, name, description, category, targetGroup, brand, price, rating, discountPercentage, stock, soldCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      await pool.query(productQuery, [
        product.id,
        product.name,
        product.description,
        product.category,
        product.targetGroup,
        product.brand,
        product.price,
        product.rating,
        product.discountPercentage,
        product.stock,
        product.soldCount,
      ]);

      // INSERT SIZES
      for (const size of product.sizes) {
        const isAvailable = product.availableSizes.includes(size);
        const sizeQuery =
          "INSERT INTO sizes (product_id, size, isAvailable) VALUES (?, ?, ?)";
        await pool.query(sizeQuery, [product.id, size, isAvailable]);
      }

      //INSERT COLORS
      for (const color of product.colors) {
        const colorQuery =
          "INSERT INTO colors (product_id, name, hexCode) VALUES (?, ?, ?)";
        await pool.query(colorQuery, [product.id, color.name, color.hexCode]);
      }

      // INSERT IMAGES
      for (const image of product.images) {
        const imageQuery =
          "INSERT INTO images (product_id, url, alt) VALUES (?, ?, ?)";
        await pool.query(imageQuery, [product.id, image.url, image.alt]);
      }

      // INSERT MATERIALS
      for (const material of product.materials) {
        const materialQuery = `INSERT INTO materials (product_id, name, percentage) VALUES (?, ?, ?)`;
        await pool.query(materialQuery, [
          product.id,
          material.name,
          material.percentage,
        ]);
      }

      // INSERT CARE INSTRUCTIONS
      for (const instruction of product.careInstructions) {
        const careQuery = `INSERT INTO care_instructions (product_id, instruction) VALUES (?, ?)`;
        await pool.query(careQuery, [product.id, instruction]);
      }
    }

    console.log("Database seeding successfull");
  } catch (error) {
    console.error("Database seeding failed: ", error.message);
  }
};

const queryFunctions = async () => {
  await initializeDatabase();
  await seedDatabase();
  await pool.end();
};

// queryFunctions();
testDatabaseConnection();
