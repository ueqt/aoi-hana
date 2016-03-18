module.exports = angular.module( 'aoiHana', [
    'ngMaterial',
    'ngMessages',
    'ui.router'
    ])

.config( function( $logProvider ) {
    $logProvider.debugEnabled( true );
})

// 加载lodash
.constant('_', window._)
.run(function ($rootScope) {
    $rootScope._ = window._;
})

// 还是webfont方式方便，何必这样用
// .config(function($mdIconProvider) {
//   $mdIconProvider
//     .defaultIconSet('../image/mdi.svg') // https://materialdesignicons.com
// });

;

require('./services');
require('./controllers');
require('./components');