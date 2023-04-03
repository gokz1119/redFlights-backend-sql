const mysql = require("mysql");
const config = require("config");
const db = config.get("db");

const connection = mysql.createConnection(db);

connection.connect((err, con) => {
  if (err) {
    console.log("Unable to connect");
    throw err;
  }
  console.log("Connection established with mysql");
});
module.exports = connection;
