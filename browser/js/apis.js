const electronRequire = require;
const electron = electronRequire( 'electron' );
const ipcRenderer = electron.ipcRenderer;

angular.module('aoiHana')
    .run(['$state', function($state) {
  
    ipcRenderer.on('people', function (arg) {
        $state.go('people');
    });
    
}]);
