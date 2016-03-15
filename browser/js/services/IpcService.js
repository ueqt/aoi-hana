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