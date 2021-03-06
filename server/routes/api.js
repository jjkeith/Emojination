var express = require('express')
  , router = express.Router()
  , passport = require('passport')

  , User = require('../models/User.js')
  , Story = require('../models/Story.js')
  , Prompt = require('../models/Prompt.js')

router.post('/register', function(req, res) {
  User.register(new User({ username: req.body.username, avatar: req.body.avatar }),
    req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      })
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!',
        user: account
      })
    })
  })
})

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(401).json({
        err: info
      })
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        })
      }
      res.status(200).json({
        status: 'Login successful!',
        user: user
      })
    })
  })(req, res, next)
})

router.get('/logout', function(req, res) {
  req.logout()
  res.status(200).json({
    status: 'Bye!'
  })
})

router.get('/stories', function(req, res) {
  console.log("inside of user stories");
  Story.find({}, 'body', function (err, result) {
    if (err) throw err;
    console.log(result)
    res.json(result)
  })
})

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    })
  }
  res.status(200).json({
    status: true,
    user: req.user
  })
})

router.patch('/:id', function(req, res) {
  User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, user) {
    if (err) throw err;
    res.json({success: true, message: "User updated!", user: user})
  })
})

router.delete('/:id', function(req, res) {
  User.findOneAndRemove({_id: req.params.id}, req.body, function(err, user) {
    if (err) throw err;
    res.json({success: true, message: "User deleted!", user: user})
  })
})

router.post('/stories', function(req, res) {
  Story.create(req.body, function(err, story){
    if(err) throw err
  	// story.author = req.body.username
  	// story.prompt = req.body.prompt
  	story.save(function(err, story){
      if(err) throw err;
      res.json(story)
      })
  })
})

router.get('/prompts', function(req, res) {
  Prompt.find({}, function(err, prompts) {
    if (err) throw err
      res.json(prompts)
  })
})


module.exports = router
