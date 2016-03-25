const electronRequire = require;
const electron = electronRequire( 'electron' );
const ipcRenderer = electron.ipcRenderer;

angular.module('aoiHana')
    .run(['$state', function($state) {
  
    ipcRenderer.on('people', function (event, arg) {
        if(arg == 'show') {
            $state.go('people'); 
        } else if(arg == 'relation') {
            $state.go('relationchart');
        } else if(arg == 'history') {
            $state.go('historychart');
        }
    });
    
}]);
