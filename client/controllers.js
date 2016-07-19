angular.module('emojination')
  .controller('mainController', mainController)
  .controller('loginController', loginController)
  .controller('logoutController', logoutController)
  .controller('registerController', registerController)
  .controller('usersController', usersController)
  .controller('storiesController', usersController)//not built yet
  .controller('topicsController', usersController)//not built yet

  // custom directive for the navbar
  .directive('navigationBar', navigationBar)

  mainController.$inject = ['$rootScope', '$state', 'AuthService']
  loginController.$inject = ['$state', 'AuthService']
  logoutController.$inject = ['$state', 'AuthService']
  registerController.$inject = ['$state', 'AuthService']
  usersController.$inject = ['$http']


  function usersController ($http) {
    var vm = this

    vm.createStory = function() {
      // post the story to an API route
      console.log("Posting new story:", vm.newStory);
      $http.post('/user/stories', {tweet: vm.newStory})
        .success(function(data){
          console.log(data);
        })
    }
  }

function mainController($rootScope, $state, AuthService) {
  var vm = this
  vm.name = "Emojination"

  $rootScope.$on('$stateChangeStart', function (event) {
    // console.log("Changing states")
    AuthService.getUserStatus()
      .then(function(data){
        vm.currentUser = data.data.user
        // when a user is logged in data.data.user is the user object.
        // when a user is not logged in, data.data == false;
      })
  })
}

// Login controller
function loginController($state, AuthService) {
  var vm = this
  vm.login = function () {

    // initial values
    vm.error = false
    vm.disabled = true

    // call login from service
    AuthService.login(vm.loginForm.username, vm.loginForm.password)
      // handle success
      .then(function () {
        console.log("Successful login...")
        $state.go('profile')
        vm.disabled = false
        vm.loginForm = {}
      })
      // handle error
      .catch(function () {
        console.log("Login no bueno")
        vm.error = true
        vm.errorMessage = "Invalid username and/or password"
        vm.disabled = false
        vm.loginForm = {}
      })
  }
}


// Logout Controller
function logoutController($state, AuthService) {
  var vm = this
  vm.logout = function () {

    // call logout from service
    AuthService.logout()
      .then(function () {
        $state.go('home')
      })
  }
}

// Register controller
function registerController($state, AuthService) {
  var vm = this
  vm.register = function () {

    // initial values
    vm.error = false
    vm.disabled = true

    // call register from service
    AuthService.register(vm.registerForm.username, vm.registerForm.password)
      // handle success
      .then(function () {
        $state.go('profile')
        vm.disabled = false
        vm.registerForm = {}
      })
      // handle error
      .catch(function () {
        vm.error = true
        vm.errorMessage = "Username already exists or invalid password"
        vm.disabled = false
        vm.registerForm = {}
      })
  }
}

// Navigation directive
function navigationBar () {
  return {
    restrict: 'A',
    templateUrl: 'partials/nav.html'
  }
}
