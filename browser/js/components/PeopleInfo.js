(function(){
  'use strict';
  
  angular.module('aoiHana')
       .component('peopleInfo', {
      templateUrl: '../view/partials/peopleInfo.html',
      controller: PeopleInfoController,
      bindings: {
          people: '='
      }         
    });
    
  function PeopleInfoController() {    

  }  

})();