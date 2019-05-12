// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT

// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// native js function for hashing messages with the SHA-256 algorithm
var crypto = require('crypto');

// include the mysql module
var mysql = require("mysql");

//help in validating login id and password
var expressValidator = require('express-validator');

var hbs = require('express-handlebars');

var db = require('./db.js');

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

app.use(expressValidator());

var handlebars = hbs.create({
  extname: '.html'
})

app.engine('html', handlebars.engine);
app.set('view engine', 'html');

// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false}
));

// server listens on port 9007 for incoming connections
app.listen(9007, () => console.log('Listening on port 9007!'));

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/welcome.html');
});

// // GET method route for the events page.
// It serves schedule.html present in client folder
app.get('/schedule',function(req, res) {
  //Add Details
  if(!req.session.value){
    res.redirect('/login');
  }
  res.sendFile(__dirname + '/client/schedule.html');
});

// GET method route for the addEvents page.
// It serves addSchedule.html present in client folder
app.get('/addSchedule',function(req, res) {
  //Add Details
  if(!req.session.value){
    res.redirect('/login');
  }
  res.sendFile(__dirname + '/client/addSchedule.html');
});

//GET method for stock page
app.get('/stock', function (req, res) {
  //Add details
  if(!req.session.value){
    res.redirect('/login');
  }
  res.sendFile(__dirname + '/client/stock.html');
});

// GET method route for the login page.
// It serves login.html present in client folder
app.get('/login',function(req, res, next) {
  //Add Details
  res.sendFile(__dirname + '/client/login.html');
});

// GET method to return the list of events
// The function queries the table events for the list of places and sends the response back to client
app.get('/getListOfEvents', function(req, res) {
  //Add Details
  if(!req.session.value){
    res.redirect('/login');
  }
  console.log("Hola");
  db.get().query('SELECT * FROM tbl_events', function(err, rows, fields){
    if (err) {
      throw err;
    }
    if(rows.length == 0){
      console.log("No entries in books table");
    }else{
      console.log(rows);
      res.send(rows);
    }
  });
});

// POST method to insert details of a new event to tbl_events table
app.post('/postEvent', function(req, res) {
  //Add Details
  if(!req.session.value){
    res.redirect('/login');
  }

  var rowToBeInserted = {
    event_name: req.body.eventName,
    event_location: req.body.location,
    event_day: req.body.date,
    event_start_time: req.body.stime,
    event_end_time: req.body.etime
  };

  db.get().query('INSERT tbl_events SET ?', rowToBeInserted, function(err,result){
    if(err){
      throw err;
    }
    console.log("value inserted");
  })

  res.redirect('/schedule');
});

// POST method to validate user login
// upon successful login, user session is created
app.post('/sendLoginDetails', function(req, res) {
  //Add Details
  var username = req.body.uname;
  var password = crypto.createHash('sha256').update(req.body.psw).digest('base64');
  console.log(password)

  var sql = "SELECT * FROM tbl_accounts WHERE acc_login= ?";
  // acc_name: 'charlie', // replace with acc_name chosen by you OR retain the same value
  // acc_login: 'charlie', // replace with acc_login chosen by you OR retain the same vallue
  // acc_password: crypto.createHash('sha256').update("tango").digest('base64')

  db.get().query(sql, username, function(err, rows, fields){
    console.log(rows.length);
    //console.log(results[0].acc_password);
    if(err){
      throw err;
    }
    if(rows.length != 0 && password === rows[0].acc_password){
      console.log("right credentials");
      req.session.value = 1;
      console.log(req.session.value);
      res.redirect('/schedule');
    }else{
     console.log("Wrong credentials");
     res.sendStatus(401);
   }
  });
});

// log out of the application
// destroy user session
app.get('/logout', function(req, res) {
  //Add Details
  //use destory()
  if(!req.session.value){
    res.send('Session Not Started, cannot logout');
  }else{
    console.log("Session complete!");
    req.session.destroy();
    res.redirect('/login');
  }
});

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  // add details
  res.sendFile(__dirname + '/client/404.html');
});
