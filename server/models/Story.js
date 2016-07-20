// story model
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var passportLocalMongoose = require('passport-local-mongoose')

var storySchema = new Schema({
   body: String,
   author: { type: Schema.Types.ObjectId, ref: 'User' },
   prompt: { type: Schema.Types.ObjectId, ref: 'Prompt' }
})


storySchema.plugin(passportLocalMongoose)


module.exports = mongoose.model('Story', storySchema)
