const mysql = require("mysql");

let connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "ragnarok",
  password: "ragnarok",
  database: "main",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to sql");
  }
});

module.exports = connection;
