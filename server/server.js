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
  , dotenv = require('dotenv').load({silent: true})


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


// require models
var User = require('./models/User.js')
var User = require('./models/Story.js')
var User = require('./models/Prompt.js')

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
    secret: 'kittycatsarecute',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon('favicon.ico'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})


// routes
app.use('/user', routes)

app.listen(port, function() {
  console.log("Listening for requests on port:", port)
})
