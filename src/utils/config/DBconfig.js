import mysql from "mysql2/promise";
import { configDotenv } from "dotenv";

configDotenv();

const user = process.env.USER;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;

// CREATE A CONNECTION POOL
export const pool = mysql.createPool({
  host: "localhost",
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: true,
});
