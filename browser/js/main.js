module.exports = angular.module( 'aoiHana', [
    'ngMaterial',
    'ui.router'
    ])

.config( function( $logProvider ) {
    $logProvider.debugEnabled( true );
})

;

require('./services');
require('./controllers');
require('./directives');