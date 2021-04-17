var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
const adminRouter = require('./routes/admin')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
const uploadRouter = require('./routes/uploadRouter');
const favoriteRouter = require('./routes/favoriteRouter');
var commentRouter = require('./routes/commentRouter');
var urlRouter = require('./routes/urlRouter');
var cors = require('cors')
var app = express();

app.use(cors())
//db config
const db=require('./config/keys').MongoURI;


//connection
mongoose.connect(db, { useNewUrlParser:true})
.then(() => console.log('mongo db connected..'))
.catch(err => console.log(err));

//serve static assect if it is production
if ( process.env.NODE_ENV === "production"){
  app.use(express.static("client/build"));

  app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, "client","build", "index.html"));
  });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use('/admin', adminRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));


app.use(passport.initialize());


app.use('/', indexRouter);
app.use('/users', usersRouter);



app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/imageUpload',uploadRouter);
app.use('/favorites',favoriteRouter);
app.use('/comments',commentRouter);
app.use('/urls',urlRouter);

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
