(function(){
  'use strict';

  angular.module('aoiHana')
    .service('mapService', [ MapService ]);

    function MapService() {
        
        return {
            getAllMaps: function () {
                return {
                    
                };
            }
        };
    }    

})();
