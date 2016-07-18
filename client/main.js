var emojination = angular.module('emojination', ['ui.router'])
// removed ['sc.twemoji'] as a dependency, but I need that, right?

emojination.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/')

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      restricted: true
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginController as loginCtrl'
    })
    .state('logout', {
      url: '/logout',
      controller: 'logoutController'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'registerController as registerCtrl'
    })
    .state('browse', {
      url: '/browse',
      template: '<h3>Let us browse the topics. i.e. template not yet created — to say nothing of the rest of the back end stuff needed.</h3>'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      restricted: true,
      controller: 'usersController as usersCtrl'
    })
    .state('edit-profile', {
      url: '/edit-profile',
      template: '<h3>Someday, once a template is created and the backend works, users will edit their profiles here.</h3>',
      restricted: true
    })
    .state('random-prompt', {
      url: '/ask-philippe',
      template: '<h3>This will be hecka cool when it works. Pseudo code is something like: <br><small>index = Math.floor(Math.random() * promptsArray.length)</small><br> and then render <br><small>promptsArray[index]</small>;</h3>',
      restricted: true
    })
    .state('random-story', {
      url: '/ask-philippe',
      template: '<h3>Pseudo code is something like: <br><small>index = Math.floor(Math.random() * storiesArray.length)</small><br> and then render storiesArray[index]; — But I got a funny feeling that this is not going to work</h3>',
      restricted: true
    })
    .state('new-prompt', {
      url: '/ask-philippe',
      template: '<h3>Add a new prompt — the real challenge here is how to serve up the emojis</h3>',
      restricted: true
    })
    .state('story-rankings', {
      url: '/ask-philippe',
      template: '<h3>Pseudo code is something like:<br> <small>Sort array of stories by ranking and return indices 0-9.</small></h3>',
      restricted: true // probably don't want this to be restricted, but rather linked from the main page, but gonna need to add the restriction that only logged in users can upvote.
    })
})


// Checks is user is logged in when state changes.
// If not, it will redirect to the login state
emojination.run(function ($rootScope, $location, $state, AuthService) {
  $rootScope.$on("$stateChangeError", console.log.bind(console));//this line is a logging tool; it will log things based on the type of error.
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    AuthService.getUserStatus()
    .then(function(){
      // console.log(toState)
      if (toState.restricted && !AuthService.isLoggedIn()){
        // if a page is restricted and the user is not logged in, render 'home'
        $state.go('home');
      }
    })
  })
})
