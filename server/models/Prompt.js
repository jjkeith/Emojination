// prompt model
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var passportLocalMongoose = require('passport-local-mongoose')

var promptSchema = new Schema({
   body: String,
   author: { type: Schema.Types.ObjectId, ref: 'User' }
})


promptSchema.plugin(passportLocalMongoose)


module.exports = mongoose.model('Prompt', promptSchema)
