const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const con = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'safety',
    port: '3306'
  }
);

con.connect((err) => {
  console.log("db init success");
  
})


module.exports = con;