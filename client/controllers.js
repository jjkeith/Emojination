angular.module('emojination')
  .controller('mainController', mainController)
  .controller('loginController', loginController)
  .controller('logoutController', logoutController)
  .controller('registerController', registerController)
  .controller('usersController', usersController)

  // custom directive for the navbar
  .directive('navigationBar', navigationBar)

  mainController.$inject = ['$rootScope', '$state', 'AuthService', '$http']
  loginController.$inject = ['$state', 'AuthService']
  logoutController.$inject = ['$state', 'AuthService']
  registerController.$inject = ['$state', 'AuthService']
  usersController.$inject = ['$http']

// Global variables
promptsArray = []

  function usersController ($http) {
    var vm = this

    vm.createStory = function() {
      // post the story to an API route
      console.log("Posting new story:", vm.newStory);
      console.log("What's in the schema: ", Story.body);
      $http.post('/user/stories', {story : vm.newStory})
        .success(function(data){
          console.log(data);
        })
    }
    vm.createPrompt = function() {
      console.log("Creating new prompt");
      $http.post('/user/prompts', {prompt : vm.newPrompt})
        .success(function(data){
          console.log(data);
        })
    }

  }

function mainController($rootScope, $state, AuthService, $http) {
  var vm = this
  vm.name = "Emojination"

  vm.emojisArr = emojisArr

  vm.hellos = ['Hi, ', 'Hello, ', "'Sup, ", 'Hola, ', 'Aloha, ', 'Bonjour, ', 'こんにちは, ', '你好, ', 'Hodi, ', 'Hallå, ', 'Ciao, ', 'Hei, ', 'Wah gwaan, ', 'Halo, ', 'Kamusta, ', 'Heyo, ', 'Dude, ', '여보세요, ', 'Hallo, ', 'Nano toka, ', 'Kíimak oolal, ', 'Olá, '
  ]
  vm.greeting = vm.hellos[Math.floor(Math.random() * vm.hellos.length)];

  vm.salutations = ['What would you like to do today?', 'Nice shirt. Ready for some stories?', "Yay! Let's make some stories!"
  ]
  vm.homeGreeting = vm.salutations[Math.floor(Math.random() * vm.salutations.length)];

  randomEmojiPicker = function() {
    return twemoji.parse(emojisArr[Math.floor(Math.random() * emojisArr.length)])
  };

  vm.randomEmojis = [randomEmojiPicker(), randomEmojiPicker(), randomEmojiPicker(), randomEmojiPicker(), randomEmojiPicker()]

  randomOhPicker = function() {
    return twemoji.parse(circlesArr[Math.floor((Math.random() * circlesArr.length))])
  }

  vm.randomOhs = [randomOhPicker(), randomOhPicker()]

  $rootScope.$on('$stateChangeStart', function (event) {
    AuthService.getUserStatus()
      .then(function(data){
        vm.currentUser = data.data.user
        // when a user is logged in data.data.user is the user object.
        // when a user is not logged in, data.data == false;
      })
  })

  vm.editUser = function(id) {
    $http.patch('/user/' + id, vm.editForm)
    .success(function (data) {
      console.log(data)
      $state.go('profile')
    })
  }

  vm.avatarSelector = function (emoji) {
    vm.registerForm.avatar = emoji
    console.log("clicked: ", emoji)
  }
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
        $state.go('home')
        vm.disabled = false
        vm.loginForm = {}
      })
      // handle error
      .catch(function () {
        console.log("Login no bueno")
        vm.error = true
        vm.errorMessage = "Oh noes! Invalid username and/or password"
        vm.disabled = false
        vm.loginForm = {}
      })
  }
}


// Logout Controller
function logoutController($state, AuthService) {
  var vm = this
  vm.logout = function() {

    // call logout from service
    AuthService.logout()
      .then(function () {
        $state.go('landing')
      })
  }

  vm.destroyUser = function(id) {
    vm.logout();
    $http.delete('/user/' + id, vm.editForm)
    .success(function (data) {
      console.log(data)
      $state.go('landing')
    })
  }

}

// Register controller
function registerController($state, AuthService) {
  var vm = this
  vm.emojisArr = emojisArr

  vm.emojis = emojisArr.map(function (el) {
    return twemoji.parse(el)
  })

  vm.register = function () {

    // initial values
    vm.error = false
    vm.disabled = true

    // call register from service
    AuthService.register(vm.registerForm)
      // handle success
      .then(function () {
        $state.go('home')
        vm.disabled = false
        vm.registerForm = {}
      })
      // handle error
      .catch(function () {
        vm.error = true
        vm.errorMessage = "Whoops! Username already exists or invalid password"
        vm.disabled = false
        vm.registerForm = {}
      })
  }

  vm.avatarSelector = function (emoji) {
    vm.registerForm.avatar = emoji
    console.log("clicked: ", emoji)
  }
}

// Navigation directive
function navigationBar () {
  return {
    restrict: 'A',
    templateUrl: 'partials/nav.html'
  }
}
