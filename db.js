const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// test connection
db.getConnection((err, connection) => {

  if (err) {
    console.error("❌ DB connection failed:", err);
  } else {
    console.log("✅ Connected to Hostinger MySQL 🚀");

    connection.release();
  }

});

module.exports = db;