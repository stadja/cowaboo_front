(function() {
    var app = angular.module('usageModule', ['ngRoute', 'modelModule']);
    app.config(['$routeProvider',

        function($routeProvider) {
            $routeProvider.
            when('/usage/search', {
                controller: 'usageSearchController',
                controllerAs: 'app',
                templateUrl: 'templates/usage.search.html',
                pageTitle: 'search'
            }).
            when('/usage/save', {
                controller: 'usageSaveController',
                controllerAs: 'app',
                templateUrl: 'templates/usage.save.html',
                pageTitle: 'save'
            }).
            otherwise({
                redirectTo: '/usage/search'
            });
        }
    ]);
})()