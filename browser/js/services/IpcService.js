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
            addPeople: function(people) {
                return ipcRenderer.sendSync('addPeople', { people: people });
            }, 
            editPeople: function(people) {
                return ipcRenderer.sendSync('editPeople', { people: people });
            },             
            removePeople: function(people) {
                return ipcRenderer.sendSync('removePeople', { people: people });
            }
        };
    }      

})();