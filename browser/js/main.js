module.exports = angular.module( 'aoiHana', [
    'ngMaterial',
    'ui.router'
    ])

.config( function( $logProvider ) {
    $logProvider.debugEnabled( true );
})

// 还是webfont方式方便，何必这样用
// .config(function($mdIconProvider) {
//   $mdIconProvider
//     .defaultIconSet('../image/mdi.svg') // https://materialdesignicons.com
// });

;

require('./services');
require('./controllers');
require('./directives');