(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const electronRequire = require;
const electron = electronRequire( 'electron' );
const ipcRenderer = electron.ipcRenderer;

angular.module('aoiHana')
    .run(['$state', function($state) {
  
    ipcRenderer.on('people', function (arg) {
        $state.go('people');
    });
    
}]);

},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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

    peopleService
        .loadAllPeoples()
        .then(function(peoples) {
          self.peoples = [].concat(peoples);
          self.selected = peoples[0];
        });

     self.selectPeople = function (people) {
       self.selected =  people;
     }
     
     self.addPeople = function () {
        peopleService
            .addPeople()
            .then(function(peoples) {
            self.peoples = [].concat(peoples);
            self.selected = peoples[0];
            });                  
     }
     
     self.removePeople = function () {
         peopleService
            .removePeople()
            .then(function(peoples) {
            self.peoples = [].concat(peoples);
            self.selected = peoples[0];
            });           
     }

  }

})();
},{}],4:[function(require,module,exports){
require('./MainController');
require('./PeopleController');
},{"./MainController":2,"./PeopleController":3}],5:[function(require,module,exports){

},{}],6:[function(require,module,exports){
require('./main');
require('./routes');
require('./apis');
},{"./apis":1,"./main":7,"./routes":8}],7:[function(require,module,exports){
module.exports = angular.module( 'aoiHana', [
    'ngMaterial',
    'ui.router'
    ])

.config( function( $logProvider ) {
    $logProvider.debugEnabled( true );
})

// 还是webfont方式方便，何必这样用
// .config(function($mdIconProvider) {
//   $mdIconProvider
//     .defaultIconSet('../image/mdi.svg') // https://materialdesignicons.com
// });

;

require('./services');
require('./controllers');
require('./directives');
},{"./controllers":4,"./directives":5,"./services":11}],8:[function(require,module,exports){
angular.module('aoiHana')
    .config(function($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/people");
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
},{}],9:[function(require,module,exports){
(function(){
  'use strict';

  const electronRequire = require;
  const electron = electronRequire( 'electron' );
  const ipcRenderer = electron.ipcRenderer;

  angular.module('aoiHana')
    .service('ipcService', [ IpcService ]);

    function IpcService() {

        return {
            loadAllPeoples: function() {
                return ipcRenderer.sendSync('loadAllPeoples', {});
            }, 
            addPeople: function() {
                return ipcRenderer.sendSync('addPeople', {});
            }, 
            removePeople: function() {
                return ipcRenderer.sendSync('removePeople', {});
            }
        };
    }      

})();
},{}],10:[function(require,module,exports){
(function(){
  'use strict';

  angular.module('aoiHana')
    .service('peopleService', [ '$q', 'ipcService', PeopleService ]);

    function PeopleService($q, ipcService) {
        
        return {
            loadAllPeoples: function () {
                return $q.when(ipcService.loadAllPeoples());
            },
            
            addPeople: function () {
                return $q.when(ipcService.addPeople());
            },  
            
            removePeople: function () {
                return $q.when(ipcService.removePeople());
            }
        };
    }    

})();
},{}],11:[function(require,module,exports){
require('./IpcService');
require('./PeopleService');
},{"./IpcService":9,"./PeopleService":10}]},{},[6]);
