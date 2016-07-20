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


  function usersController ($http) {
    var vm = this

    // post a story to an API route
    vm.createStory = function() {
      console.log("Posting new story:", vm.newStory);
      $http.post('/stories', {story : vm.newStory})
        .success(function(data){
          console.log(data);
        })
    }

    // post a prompt to an API route
    vm.createPrompt = function() {
      console.log("Creating new prompt");
      $http.post('/user/prompts', {prompt : vm.newPrompt})
        .success(function(data){
          console.log(data);
        })
    }
    vm.userStories = function() {
      $http.get('/stories')
    }

    //   vm.userStories = mongoose.model('Story', storySchema);
    //   Story.findOne({ 'author': vm.currentUser }, 'body prompt', function (err, person) {
    //     if (err) throw err;
    //     console.log(story.prompt + ': ' + 'story.body' )
    //   })
    // }
  }

function mainController($rootScope, $state, AuthService, $http) {
  var vm = this
  vm.name = "Emojination"
  vm.emojisArr = emojisArr

  vm.emojis = emojisArr.map(function (el) {
    return twemoji.parse(el)
  })

  // actived by ng-click on editForm
  avatarSelector = function (emoji) {
    console.log("clicked: ", emoji)
    vm.editForm.avatar = emoji
  };

//
  vm.hellos = ['Hi, ']

  // , 'Hello, ', "'Sup, ", 'Hola, ', 'Aloha, ', 'Bonjour, ', 'こんにちは, ', '你好, ', 'Hodi, ', 'Hallå, ', 'Ciao, ', 'Hei, ', 'Wah gwaan, ', 'Halo, ', 'Kamusta, ', 'Heyo, ', 'Dude, ', '여보세요, ', 'Hallo, ', 'Nano toka, ', 'Kíimak oolal, ', 'Olá, ']

  // Randomly selects a hello from hellos
  vm.hello = vm.hellos[Math.floor(Math.random() * vm.hellos.length)];

  // array of salutations for salutation() to access
  vm.salutations = ['What would you like to do today?', 'Nice shirt. Ready for some stories?', "Yay! Let's make some stories!"]

  // Randomly selects a salutation from salutations
  vm.salutation = vm.salutations[Math.floor(Math.random() * vm.salutations.length)];

// Randomly selects from an array of emojis
  randomEmojiPicker = function() {
    return twemoji.parse(emojisArr[Math.floor(Math.random() * emojisArr.length)])
  }

// Creates an array of five random emojis to populate buttons on the home page
  vm.randomEmojis = [randomEmojiPicker(), randomEmojiPicker(), randomEmojiPicker(), randomEmojiPicker(), randomEmojiPicker()]

// Randomly selects from an array of o-shaped emoji
  randomOhPicker = function() {
    return twemoji.parse(circlesArr[Math.floor((Math.random() * circlesArr.length))])
  }

// Creates an array of two o-shaped emojis to populate the logo
  vm.randomOhs = [randomOhPicker(), randomOhPicker()]

// Checks to see if the user is logged in whenever the state is changed.
  $rootScope.$on('$stateChangeStart', function (event) {
    AuthService.getUserStatus()
      .then(function(data){
        vm.currentUser = data.data.user
      })
  })

  // Patches to the user object
  vm.editUser = function(id) {
    $http.patch('/user/' + id, vm.editForm)
    .success(function (data) {
      console.log(data)
      $state.go('profile')
    })
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
      .then(function () {
        console.log("Successful login...")
        $state.go('home')
        vm.disabled = false
        vm.loginForm = {}
      })
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

  // deletes a user object
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
      .then(function () {
        $state.go('home')
        vm.disabled = false
        vm.registerForm = {}
      })
      .catch(function () {
        vm.error = true
        vm.errorMessage = "Whoops! Username already exists or invalid password"
        vm.disabled = false
        vm.registerForm = {}
      })
  }

  // actived by ng-click on registraterForm
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
