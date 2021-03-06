// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT

// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require("body-parser");

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require("express-session");

// native js function for hashing messages with the SHA-256 algorithm
var crypto = require("crypto");

// include the mysql module
var mysql = require("mysql");

//var db = require("./db.js");

var xml2js = require("xml2js");

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

// use express-session
// in mremory session is sufficient for this assignment
app.use(
  session({
    secret: "csci4131secretkey",
    saveUninitialized: true,
    resave: false
  })
);

// server listens on port 9007 for incoming connections
app.listen(9007, () => console.log("Listening on port 9007!"));

var parser = new xml2js.Parser();
fs.readFile(__dirname + "/dbconfig.xml", function (err, data) {
  parser.parseString(data, function (err, res) {
    connection = mysql.createConnection({
      host: res.dbconfig.host[0],
      user: res.dbconfig.user[0],
      password: res.dbconfig.password[0],
      database: res.dbconfig.database[0],
      port: res.dbconfig.port[0]
    });
    connection.connect(function(err) {
      if (err) {
        throw err;
      }
      console.log("Connected to MYSQL database!");
    });
  });
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/client/welcome.html");
});

// // GET method route for the events page.
// It serves schedule.html present in client folder
app.get("/schedule", function (req, res) {
  //Add Details
  if (!req.session.value) {
    res.redirect("/login");
  }
  res.sendFile(__dirname + "/client/schedule.html");
});

// GET method route for the addEvents page.
// It serves addSchedule.html present in client folder
app.get("/addSchedule", function (req, res) {
  //Add Details
  if (!req.session.value) {
    res.redirect("/login");
  }
  res.sendFile(__dirname + "/client/addSchedule.html");
});

//GET method for stock page
app.get("/stock", function (req, res) {
  //Add details
  if (!req.session.value) {
    res.redirect("/login");
  }
  res.sendFile(__dirname + "/client/stock.html");
});

// GET method route for the login page.
// It serves login.html present in client folder
app.get("/login", function (req, res, next) {
  //Add Details
  res.sendFile(__dirname + "/client/login.html");
});

app.get("/admin", function (req, res) {
  if (!req.session.value) {
    res.redirect("/login");
  }
  console.log("load admin");
  res.sendFile(__dirname + "/client/admin.html");
});

// GET method to return the list of events
// The function queries the table events for the list of places and sends the response back to client
app.get("/getListOfEvents", function (req, res) {
  //Add Details
  if (!req.session.value) {
    res.redirect("/login");
  }
  connection.query("SELECT * FROM tbl_events", function (err, rows, fields) {
    if (err) {
      throw err;
    }
    if (rows.length == 0) {
      console.log("No entries in books table");
    } else {
      console.log(rows);
      res.statusCode = 200;
      res.setHeader("Content-type", "application/json");
      res.send(rows);
    }
  });
});

// GET method to return the list of users
// The function queries the table accounts for the list of users and sends the response back to client
app.get("/getListOfUsers", function (req, res) {
  if (!req.session.value) {
    res.redirect("/login");
  }
  console.log("Hola");
  connection.query("SELECT * FROM tbl_accounts", function (err, rows, fields) {
    if (err) {
      throw err;
    }
    if (rows.length == 0) {
      console.log("No entries in books table");
    } else {
      console.log(rows);
      res.statusCode = 200;
      res.setHeader("Content-type", "application/json");
      res.send(rows);
    }
  });
});

// POST method to insert details of a new event to tbl_events table
app.post("/postEvent", function (req, res) {
  //Add Details
  if (!req.session.value) {
    res.redirect("/login");
  }

  var rowToBeInserted = {
    event_name: req.body.eventName,
    event_location: req.body.location,
    event_day: req.body.date,
    event_start_time: req.body.stime,
    event_end_time: req.body.etime
  };

  connection.query("INSERT tbl_events SET ?", rowToBeInserted, function (
    err,
    result
  ) {
    if (err) {
      throw err;
    }
    console.log("value inserted");
  });

  res.redirect("/schedule");
});

app.delete('/deleteUser', function (req, res) {
  if (!req.session.value) {
    res.redirect("/login");
  }

  if (req.session.username === req.body.login) {
    console.log("User is logged in");
    res.status(500).send("cannot delete a user that is logged in");
  } else {
    var login = req.body.login;
    console.log(login);
    var sql = "DELETE FROM tbl_accounts WHERE acc_login= ?";
    connection.query(sql, login, function (err, rows, fields) {
      if (err) {
        throw err;
      }
      console.log("Delete user");
      res.status(200).send("OK");
    });
  }
});

app.post('/editUser', function (req, res) {
  if (!req.session.value) {
    res.redirect("/login");
  }

  var userID = req.body.userID;
  var username = req.body.uname;
  var login = req.body.login;
  var password = crypto.createHash("sha256").update(req.body.psw).digest("base64");
  console.log("userid:");
  console.log(userID);
  console.log(username);
  console.log(login);
  console.log(password);
  var sqlCheck = "SELECT * FROM tbl_accounts WHERE acc_login= ? AND NOT acc_id=?"
  connection.query(sqlCheck, [login, userID], function (err, rows, fields) {
    if (err) {
      throw err;
    }

    if (rows.length > 0) {
      console.log("can't change cause it's same");
      res.status(500).send("login is used");
    } else {
      console.log("update user");

      var sqlUpdatedisplayUser = "SELECT acc_id FROM tbl_accounts WHERE acc_login= ?"
      connection.query(sqlUpdatedisplayUser, req.session.username, function (err, result) {
        console.log('result:');
        console.log(result);

        if(password === crypto.createHash("sha256").update('').digest("base64")){
          var rowToBeInserted = {
            acc_login: login,
            acc_name: username
          };

        }else{

          var rowToBeInserted = {
            acc_login: login,
            acc_name: username,
            acc_password: password
          };

        }

        var sql = "UPDATE tbl_accounts SET ? WHERE acc_id= ?"
        connection.query(sql, [rowToBeInserted, userID], function (err, result) {
          if (err) {
            throw err;
          }
        });
        if(result[0].acc_id == userID){
          req.session.username = login;
        }
        res.status(200).send("OK");
      });
    }
  });
});


app.post("/addUser", function (req, res) {
  if (!req.session.value) {
    res.redirect("/login");
  }
  var username = req.body.uname;
  var password = crypto.createHash("sha256").update(req.body.psw).digest("base64");
  var login = req.body.login;

  var sql = "SELECT acc_password FROM tbl_accounts WHERE acc_login= ?";
  connection.query(sql, login, function (err, rows, fields) {
    if (err) {
      throw err;
    }
    if (rows.length > 0) {
      console.log("already exist");
      res.status(500).send("User already in database");
    } else {
      if (login.length != 0 && username != 0 && password.length != 0) {
        console.log("insert new user");
        var rowToBeInserted = {
          acc_login: login,
          acc_name: username,
          acc_password: password
        };

        connection.query("INSERT tbl_accounts SET ?", rowToBeInserted, function (err, result) {
          if (err) {
            throw err;
          }
          console.log("value inserted");
          res.status(200).send("OK");
        });
      } else {
        console.log("new user info is empty");
        res.status(401).send("empty");
      }

    }
  });
});

// POST method to validate user login
// upon successful login, user session is created
app.post("/sendLoginDetails", function (req, res) {
  //Add Details
  var username = req.body.uname;
  var password = crypto.createHash("sha256")
    .update(req.body.psw)
    .digest("base64");
  console.log(password);

  var sql = "SELECT * FROM tbl_accounts WHERE acc_login= ?";
  // acc_name: 'charlie', // replace with acc_name chosen by you OR retain the same value
  // acc_login: 'charlie', // replace with acc_login chosen by you OR retain the same vallue
  // acc_password: crypto.createHash('sha256').update("tango").digest('base64')

  connection.query(sql, username, function (err, rows, fields) {
    console.log(rows.length);
    //console.log(results[0].acc_password);
    if (err) {
      throw err;
    }
    if (rows.length != 0 && password === rows[0].acc_password) {
      console.log("right credentials");
      req.session.value = 1;
      req.session.username = username;
      console.log(req.session.username);
      res.redirect("/schedule");
    } else {
      console.log("Wrong credentials");
      res.sendStatus(401);
    }
  });
});

// log out of the application
// destroy user session
app.get("/logout", function (req, res) {
  //Add Details
  //use destory()
  if (!req.session.value) {
    res.send("Session Not Started, cannot logout");
  } else {
    console.log("Session complete!");
    req.session.destroy();
    res.redirect("/login");
  }
});

app.get("/displayUsername", function (req, res) {
  console.log("in display");
  if (req.session.username) {
    console.log("displayname");
    res.send(req.session.username);
  }
});

// middle ware to serve static files
app.use("/client", express.static(__dirname + "/client"));

// function to return the 404 message and error to client
app.get("*", function (req, res) {
  // add details
  res.sendFile(__dirname + "/client/404.html");
});
