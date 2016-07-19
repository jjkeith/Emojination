// user model
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var passportLocalMongoose = require('passport-local-mongoose')

var storiesSchema = new Schema({
   body: String
})

var promptsSchema = new Schema({
   body: String
})

var User = new Schema({
  username: String,
  password: String,
  avatar: String,
  stories: [storiesSchema],
  prompts: [promptsSchema]
})

User.plugin(passportLocalMongoose)


module.exports = mongoose.model('users', User)
