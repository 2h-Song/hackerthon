const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  port: "3306",
  password: "패스워드",
  database: "safety",
});

connection.connect();

module.exports = connection;
