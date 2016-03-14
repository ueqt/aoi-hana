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