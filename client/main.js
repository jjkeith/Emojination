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
    .state('one', {
      url: '/one',
      template: '<h1>This is page one!</h1>'
    })
    .state('two', {
      url: '/two',
      template: '<h1>This is page two!</h1>',
      restricted: true
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      restricted: true,
      controller: 'usersController as usersCtrl'
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
        // if a page is restricted and the user is not logged in, render 'login'
        // $location.path('/login')
        $state.go('login');
      }
    })
  })
})
