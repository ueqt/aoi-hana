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
    
  function PeopleInfoController($scope) {    
    $scope.checkEmptyString = function(str) {
      if(str == undefined) {
          return true;
      }  
      if(str.length == 0) {
          return true;
      }
      return false;
    };
  }  

})();