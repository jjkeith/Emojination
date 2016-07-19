// user model
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var passportLocalMongoose = require('passport-local-mongoose')


var userSchema = new Schema({
  username: String,
  password: String,
  avatar: String,
  bio: String
})

userSchema.plugin(passportLocalMongoose)


module.exports = mongoose.model('User', userSchema)
