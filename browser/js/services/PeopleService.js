(function(){
  'use strict';

  angular.module('aoiHana')
    .service('peopleService', [ '$q', 'ipcService', PeopleService ]);

    function PeopleService($q, ipcService) {
        
        return {
            loadAllPeoples: function () {
                return $q.when(ipcService.loadAllPeoples());
            },
            
            addPeople: function (people) {
                return $q.when(ipcService.addPeople(people));
            },  
            
            editPeople: function (people) {
                return $q.when(ipcService.editPeople(people));
            },  
            
            removePeople: function (people) {
                return $q.when(ipcService.removePeople(people));
            }
        };
    }    

})();