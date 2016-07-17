var
  port = process.env.PORT || 3000
  , express = require('express')
  , storylogger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , expressSession = require('express-session')
  , mongoose = require('mongoose')
  , hash = require('bcrypt-nodejs')
  , path = require('path')
  , passport = require('passport')
  , passportConfig = require('./config/passport.js')
  , logger = require('morgan')
  , sass = require('node-sass')
  , favicon = require('serve-favicon')

// mongoose
mongoose.connect(process.env.DB_URL, function(err){
	if (err) throw err;
	console.log('connected to mongodb (emojination)');
})

// SASS
sass.render({
  file: 'style/style.scss',
}, function(err, result) {
  if (err){
      console.log("sass error");
  }
});


// user schema/model
var User = require('./models/User.js')

// create instance of express
var app = express()

// require routes
var routes = require('./routes/api.js')

// define middleware
app.use(express.static(path.join(__dirname, '../client')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon('favicon.ico'));

// routes
app.use('/user/', routes)

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})

// error hndlers
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res) {
  res.status(err.status || 500)
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }))
})

app.listen(port, function() {
  console.log("Listening for requests on port:", port)
})
