var emojination = angular.module('emojination', ['ui.router', 'ui.materialize', 'sc.twemoji'])
// adding these depencies crashes things: ['sc.twemoji'], ["ui.materialize"],

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
    .state('prompts', {
      url: '/prompts',
      templateUrl: 'templates/prompts.html'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      restricted: true,
      controller: 'usersController as usersCtrl'
    })
    .state('profile-edit', {
      url: '/profile/edit',
      templateUrl: 'templates/profile-edit.html',
      restricted: true
    })
    .state('prompts/random', {
      url: '/prompt/random',
      template: '<h3>This will be hecka cool when it works. Pseudo code is something like: <br><small>index = Math.floor(Math.random() * promptsArray.length)</small><br> and then render <br><small>promptsArray[index]</small>;</h3>',
      restricted: true
    })
    .state('prompts/:id/random', {
      url: '/prompts/:id#storytag',
      template: '<h3>Pseudo code for a random story is something like: <br><small>index = Math.floor(Math.random() * promptsArray.length)</small><br> and then render a random story in that array — But this will be tricky as it means that each story has to be dynmaically html tagged with its place in the array.</h3>',
      restricted: true
    })
      .state('prompt/new', {
      url: '/prompts/new',
      template: '<h3>Add a new prompt — the real challenge here is how to serve up the emojis</h3>',
      restricted: true
    })
    .state('story-rankings', {
      url: '/story-rankings',
      template: '<h3>Pseudo code is something like:<br> <small>Sort array of stories by ranking and return indices 0-9.</small><br>Then the stories would be served in a ol along with the prompt that generated it.</h3>',
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
