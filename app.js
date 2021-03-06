const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session=require('express-session');
const fs=require('fs');

const indexRouter = require('./routes/index.js').Router;
const homeRouter=require('./routes/home.js');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views_x'));
app.set('view engine', 'xtpl');

let loggerfile=fs.createWriteStream('./logs/access.log',{flags:'a',encoding:'utf-8'});
app.use(logger(':date[clf] :remote-addr :method :url [:status] :response-time ms',{stream:loggerfile}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:'secs',
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*600
    }
}));

app.get('/',function (req,rep,next) {
    if(req.originalUrl==='/') {
        rep.redirect('/login');
    }
    else{
        next();
    }
});
app.use('/login', indexRouter);
app.use('/home',homeRouter);
//app.use('/users', usersRouter);

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

module.exports = app;
