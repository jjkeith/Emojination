var emojination = angular.module('emojination', ['ui.router', 'ui.materialize', 'sc.twemoji', 'ngSanitize'])


emojination.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/')

  $stateProvider
    .state('landing', {
      url: '/',
      templateUrl: 'templates/landing.html',
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
    .state('prompt-new', {
      url: '/prompts/new',
      templateUrl: 'templates/prompt-new.html',
      restricted: true
    })
    // Fix the ID thing
    .state('prompts-show', {
      url: '/prompts/:id',
      templateUrl: 'templates/prompts-show.html',
      restricted: true
    })
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      restricted: true
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      restricted: true
    })
    .state('profile-edit', {
      url: '/profile/edit',
      templateUrl: 'templates/profile-edit.html',
      restricted: true
    })
    .state('prompt-random', {
      url: '/prompts/random',
      template: '<h3>This will be hecka cool when it works. Pseudo code is something like: <br><small>index = Math.floor(Math.random() * promptsArray.length)</small><br> and then render <br><small>promptsArray[index]</small>;</h3>',
      restricted: true
    })
    // .state('story-rankings', {
    //   url: '/stories/rankings',
    //   template: '<h3>Pseudo code is something like:<br> <small>Sort array of stories by ranking and return indices 0-9.</small><br>Then the stories would be served in a ol along with the prompt that generated it.</h3>',
    //   restricted: true
    // })
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
        // if a page is restricted and the user is not logged in, render 'landing'
        $state.go('landing');
      }
    })
  })
})
