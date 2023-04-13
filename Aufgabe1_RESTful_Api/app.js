var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const config = require('config');
const port = config.get('server.port');
const couchdbUser = config.get("couchdb.user");
const couchdbPassword = config.get("couchdb.password");

var nano = require('nano')(`http://${couchdbUser}:${couchdbPassword}@127.0.0.1:5984`)
//const nano = require('nano')("http://admin:password@127.0.0.1:5984");
var users = nano.use("users",function(err,data){
  if(err){
    users = nano.db.create("users");
  }
});

var http = require("http");
var express = require('express');

var app = express();
var server = http.createServer(app);

app.get("/", function(req,res){
  var name = req.query.name;
  res.render('index',{title: "Start Page", name : name})
});

app.get("/aboutus",function(req,res){
  res.render('aboutus',{title: "About Us"})
});

app.get("/imprint",function(req,res){
  res.render('imprint',{title: "Imprint"})
});

// app.js
var usersRouter = require("./routes/users");

// set controllers
app.use("/users",usersRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));

// set middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(port);
console.log(`Server listen to port ${port}`);

module.exports = {nano}