angular.module('aoiHana')
    .config(function($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/people");
        //
        // Now set up the states
        $stateProvider
        .state('blank', {
            url: "/blank",
            templateUrl: "partials/blank.html"
        })
        .state('people', {
            url: "/people",
            templateUrl: "partials/people.html"        
    });
});