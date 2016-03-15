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