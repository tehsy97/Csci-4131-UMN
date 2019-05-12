// establish connection to MYSQL database

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "cse-curly.cse.umn.edu",
  user: "C4131S19G109",
  password: "11911",
  database: "C4131S19G109",
  port: 3306
});

connection.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log("Connected to MYSQL database!");
});


// export the connection
exports.get = function() {
  return connection;
}
