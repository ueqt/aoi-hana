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