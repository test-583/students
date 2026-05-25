// db.js - This file connects our backend to the MySQL database
require('dotenv').config();
const mysql = require('mysql2');

// Create a connection pool (handles multiple users at once)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: false }, // Required for Clever Cloud
  waitForConnections: true,
  connectionLimit: 10
});

// Export with promise support (lets us use async/await)
module.exports = pool.promise();
