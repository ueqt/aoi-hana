(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
  'use strict';
  
  angular.module('aoiHana')
        .filter('keyboardShortcut', function($window) {
            return function(str) {
            if (!str) return;
            var keys = str.split('-');
            var isOSX = /Mac OS X/.test($window.navigator.userAgent);
            var seperator = (!isOSX || keys.length > 2) ? '+' : '';
            var abbreviations = {
                M: isOSX ? '⌘' : 'Ctrl',
                A: isOSX ? 'Option' : 'Alt',
                S: 'Shift'
            };
            return keys.map(function(key, index) {
                var last = index == keys.length - 1;
                return last ? key : abbreviations[key];
            }).join(seperator);
            };
        })
       .controller('MainController', [    
           '$mdDialog', '$state',    
           MainController
       ]);

  function MainController($mdDialog, $state) {
    this.settings = {
      printLayout: true,
      showRuler: true,
      showSpellingSuggestions: true,
      presentationMode: 'edit'
    };
    this.sampleAction = function(name, ev) {
      $mdDialog.show($mdDialog.alert()
        .title(name)
        .textContent('You triggered the "' + name + '" action')
        .ok('Great')
        .targetEvent(ev)
      );
    };
    
    this.routeAction = function(name, ev) {
        $state.go(name);      
    };
  }

})();
},{}],2:[function(require,module,exports){
(function(){
  'use strict';
  
  angular.module('aoiHana')
       .controller('PeopleController', [
          'peopleService', '$mdSidenav', '$mdBottomSheet', '$log',
          PeopleController
       ]);

  function PeopleController( peopleService ) {
    var self = this;

    self.selected     = null;
    self.peoples        = [ ];
    self.selectPeople   = selectPeople;

    // Load all registered users

    peopleService
        .loadAllPeoples()
        .then(function(peoples) {
          self.peoples = [].concat(peoples);
          self.selected = peoples[0];
        });

     function selectPeople (people) {
       self.selected =  people;
     }

  }

})();
},{}],3:[function(require,module,exports){
require('./MainController');
require('./PeopleController');
},{"./MainController":1,"./PeopleController":2}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
require('./main');
require('./routes');
},{"./main":6,"./routes":7}],6:[function(require,module,exports){
module.exports = angular.module( 'aoiHana', [
    'ngMaterial',
    'ui.router'
    ])

.config( function( $logProvider ) {
    $logProvider.debugEnabled( true );
})

;

require('./services');
require('./controllers');
require('./directives');
},{"./controllers":3,"./directives":4,"./services":9}],7:[function(require,module,exports){
angular.module('aoiHana')
    .config(function($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/blank");
        //
        // Now set up the states
        $stateProvider
        .state('blank', {
            url: "/blank",
            templateUrl: "partials/blank.html"
        })
        .state('people', {
            url: "/people",
            templateUrl: "partials/people.html"        
    });
});
},{}],8:[function(require,module,exports){
(function(){
  'use strict';

  angular.module('aoiHana')
    .service('peopleService', [ '$q', PeopleService ]);

    function PeopleService($q) {
        var peoples = [
        {
            name: 'Lia Lugo',
            avatar: 'svg-1',
            content: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
        },
        {
            name: 'George Duke',
            avatar: 'svg-2',
            content: 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.'
        },
        {
            name: 'Gener Delosreyes',
            avatar: 'svg-3',
            content: "Raw denim pour-over readymade Etsy Pitchfork. Four dollar toast pickled locavore bitters McSweeney's blog. Try-hard art party Shoreditch selfies. Odd Future butcher VHS, disrupt pop-up Thundercats chillwave vinyl jean shorts taxidermy master cleanse letterpress Wes Anderson mustache Helvetica. Schlitz bicycle rights chillwave irony lumberhungry Kickstarter next level sriracha typewriter Intelligentsia, migas kogi heirloom tousled. Disrupt 3 wolf moon lomo four loko. Pug mlkshk fanny pack literally hoodie bespoke, put a bird on it Marfa messenger bag kogi VHS."
        },
        {
            name: 'Lawrence Ray',
            avatar: 'svg-4',
            content: 'Scratch the furniture spit up on light gray carpet instead of adjacent linoleum so eat a plant, kill a hand pelt around the house and up and down stairs chasing phantoms run in circles, or claw drapes. Always hungry pelt around the house and up and down stairs chasing phantoms.'
        },
        {
            name: 'Ernesto Urbina',
            avatar: 'svg-5',
            content: 'Webtwo ipsum dolor sit amet, eskobo chumby doostang bebo. Bubbli greplin stypi prezi mzinga heroku wakoopa, shopify airbnb dogster dopplr gooru jumo, reddit plickers edmodo stypi zillow etsy.'
        },
        {
            name: 'Gani Ferrer',
            avatar: 'svg-6',
            content: "Lebowski ipsum yeah? What do you think happens when you get rad? You turn in your library card? Get a new driver's license? Stop being awesome? Dolor sit amet, consectetur adipiscing elit praesent ac magna justo pellentesque ac lectus. You don't go out and make a living dressed like that in the middle of a weekday. Quis elit blandit fringilla a ut turpis praesent felis ligula, malesuada suscipit malesuada."
        }
        ];
        
        return {
            loadAllPeoples: function() {
                return $q.when(peoples);
            }  
        };
    }      

})();
},{}],9:[function(require,module,exports){
require('./PeopleService.js');
},{"./PeopleService.js":8}]},{},[5]);
