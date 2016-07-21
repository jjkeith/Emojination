angular.module('emojination')
  .controller('mainController', mainController)
  .controller('loginController', loginController)
  .controller('logoutController', logoutController)
  .controller('registerController', registerController)

  // custom directive for the navbar
  .directive('navigationBar', navigationBar)

  mainController.$inject = ['$rootScope', '$state', 'AuthService', '$http']
  loginController.$inject = ['$state', 'AuthService']
  logoutController.$inject = ['$state', 'AuthService', '$http']
  registerController.$inject = ['$state', 'AuthService']


function mainController($rootScope, $state, AuthService, $http) {
  var vm = this
  vm.name = "Emojination"

  // includes the array of emojis
  vm.emojisArr = emojisArr

  // post a story to an API route // posting only an id
  vm.createStory = function() {
    var story = JSON.stringify(vm.storyForm.newStory)
    console.log("Posting new story:", vm.storyForm.newStory);
    console.log("Author:", vm.currentUser);
    console.log("Prompt:", vm.prompt);
    $http.post('/user/stories', {story : vm.storyForm.newStory, author : vm.currentUser, prompt : vm.prompt})
      .success(function(data){
        console.log(data);
        vm.storyForm = {}
      })
  }

  //returns a user's stories // doesn't work
  vm.userStories = function() {
    $http.get('/user/stories')
  }

  //returns a user's prompts // doesn't work
  vm.userPrompts = function() {
    $http.get('/user/prompts')
  }


  // post a prompt to an API route
  vm.createPrompt = function() {
    console.log("Creating new prompt");
    $http.post('/user/prompts', {prompt : vm.newPrompt})
      .success(function(data){
        console.log(data);
      })
  }
  //
  // vm.newPrompt = function(emoji) {
  //   vm.emoji = emoji
  //   prompt = []
  //   console.log("clicked: ", emoji)
  //   prompt.push(emoji)
  // }

  // Patches to the user object
  vm.editUser = function(id) {
    console.log(vm.editForm);
    $http.patch('/user/' + id, vm.editForm)
    .success(function (data) {
      console.log(data)
      $state.go('profile')
      $state.go('profile')
    })
  }


// Below are cotent-driving functions and arrays

  // Parses emojis for the pickers
  vm.emojis = emojisArr.map(function (el) {
    return twemoji.parse(el)
  })

  // actived by ng-click on editForm
  vm.avatarSelector = function(emoji) {
    vm.editForm.avatar = emoji
    console.log("clicked: ", emoji)
  }

  // array of hellos for hello() to access
  vm.hellos = ['Hallo, ', '여보세요, ', 'Hi, ', 'Hello, ', "'Sup, ", 'Hola, ', 'Aloha, ', 'Kíimak oolal, ', 'Bonjour, ', 'Nano toka, ', 'こんにちは, ', '你好, ', 'Kamusta, ', 'Hodi, ', 'Hallå, ', 'Halo, ', 'Ciao, ', 'Hei, ']

  // Randomly selects a hello from hellos
  vm.hello = vm.hellos[Math.floor(Math.random() * vm.hellos.length)];

  // array of salutations for salutation() to access
  vm.salutations = ['What would you like to do today?', 'Nice shirt. Ready for some stories?', "Yay! Let's make some stories!", "Yo, let's do this!", "Light the campfire, we are gonna tell some emoji stories!"]

  // Randomly selects a salutation from salutations
  vm.salutation = vm.salutations[Math.floor(Math.random() * vm.salutations.length)];

  // array of sups for sup() to access
  vm.sups = ['Look at you!', 'Ooh, you fancy!', "Noice profile, brah", "Sweet emoji'ing!", "Perky profile greeting!", "Exclamation point. Period."]

  // Randomly selects a sup from sups
  vm.sup = vm.sups[Math.floor(Math.random() * vm.sups.length)];

  // array of colors for color() to access
  vm.colors = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange']

  // randomly selects a color from colors
  vm.color = vm.colors[Math.floor(Math.random() * vm.colors.length)];

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
    vm.randomOhs = [randomOhPicker(), randomOhPicker(), randomOhPicker(), randomOhPicker(), randomOhPicker()]

// Checks to see if the user is logged in whenever the state is changed.
  $rootScope.$on('$stateChangeStart', function (event) {
    AuthService.getUserStatus()
      .then(function(data){
        vm.currentUser = data.data.user
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
function logoutController($state, AuthService, $http) {
  var vm = this
  vm.logout = function() {

    // call logout from service
    AuthService.logout()
      .then(function () {
        $state.go('landing')
      })
  }

  // deletes a user object
  vm.destroyUser = function(user) {
    // vm.logout();
    $http.delete('/user/' + user._id)
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
