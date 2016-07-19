angular.module('emojination')
  .controller('mainController', mainController)
  .controller('loginController', loginController)
  .controller('logoutController', logoutController)
  .controller('registerController', registerController)
  .controller('usersController', usersController)
  // .controller('storiesController', storiesController)//not built yet
  // .controller('promptController', promptsController)//not built yet

  // custom directive for the navbar
  .directive('navigationBar', navigationBar)

  mainController.$inject = ['$rootScope', '$state', 'AuthService', '$sce', '$sanitize']
  loginController.$inject = ['$state', 'AuthService']
  logoutController.$inject = ['$state', 'AuthService']
  registerController.$inject = ['$state', 'AuthService']
  usersController.$inject = ['$http']


  function usersController ($http) {
    var vm = this

    vm.createStory = function() {
      // post the story to an API route
      console.log("Posting new story:", vm.newStory);
      $http.post('/user/stories', {story : vm.newStory})
        .success(function(data){
          console.log(data);
        })
    }
  }

function mainController($rootScope, $state, AuthService, $sce, $sanitize) {
  var vm = this
  vm.name = "Emojination"
  vm.hellos = ['Hi, ', 'Hello, ', 'SUP, ', 'Hola, ', 'Aloha, ', 'Bonjour, ', 'こんにちは, ', '你好, ', 'Hodi, ', 'Hallå, ', 'Ciao, ', 'Hei, ', 'Wah gwaan, ', 'Halo, ', 'Kamusta, ', 'Heyo, ', 'Dude, ', '여보세요, ', 'Hallo, ', 'Lol, no, ', 'Nano toka, ', 'Kíimak oolal, ', 'Olá, ', "This seems really stupid, but paves the way for random story and random prompt, which are features to be developd, "
  ]
  vm.greeting = vm.hellos[Math.floor((Math.random() * vm.hellos.length))];

  randomEmojiPicker = function () {
    twemoji.parse(emojisArr[Math.floor((Math.random() * emojisArr.length))])
  };
//would be much better to inject the function, but it crashes for some reason.
  vm.randomEmoji1 = twemoji.parse(emojisArr[Math.floor((Math.random() * emojisArr.length))])
  vm.randomEmoji2 = twemoji.parse(emojisArr[Math.floor((Math.random() * emojisArr.length))])
  vm.randomEmoji3 = twemoji.parse(emojisArr[Math.floor((Math.random() * emojisArr.length))])
  vm.randomEmoji4 = twemoji.parse(emojisArr[Math.floor((Math.random() * emojisArr.length))])
  vm.randomEmoji5 = twemoji.parse(emojisArr[Math.floor((Math.random() * emojisArr.length))])

  vm.randomOh1 = twemoji.parse(circlesArr[Math.floor((Math.random() * circlesArr.length))])
  vm.randomOh2 = twemoji.parse(circlesArr[Math.floor((Math.random() * circlesArr.length))])
  vm.randomOh3 = twemoji.parse(circlesArr[Math.floor((Math.random() * circlesArr.length))])
  vm.randomOh4 = twemoji.parse(circlesArr[Math.floor((Math.random() * circlesArr.length))])



  vm.salutations = ['What would you like to do today?', 'Nice shirt. Ready for some stories?', "Yay! Let's make some stories!"
  ]
  vm.profileGreeting = vm.salutations[Math.floor((Math.random() * vm.salutations.length))];

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
