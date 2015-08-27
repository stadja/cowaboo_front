(function() {
    var app = angular.module('usageModule', ['ngRoute', 'modelModule']);
    app.config(['$routeProvider',

        function($routeProvider) {
            $routeProvider.
            when('/usage/search', {
                controller: 'UsageSearchController',
                controllerAs: 'app',
                templateUrl: 'templates/usage.search.html',
                pageTitle: 'search'
            }).
            when('/usage/save', {
                controller: 'UsageSaveController',
                controllerAs: 'app',
                templateUrl: 'templates/usage.save.html',
                pageTitle: 'save'
            }).
            when('/usage/tags', {
                controller: 'UsageTagsController',
                controllerAs: 'app',
                templateUrl: 'templates/usage.tags.html',
                pageTitle: 'tags'
            }).
            when('/usage/groups', {
                controller: 'UsageGroupsController',
                controllerAs: 'app',
                templateUrl: 'templates/usage.groups.html',
                pageTitle: 'groups'
            }).
            when('/usage/users', {
                controller: 'UsageUsersController',
                controllerAs: 'app',
                templateUrl: 'templates/usage.users.html',
                pageTitle: 'users'
            }).
            otherwise({
                redirectTo: '/usage/search'
            });
        }
    ]);
})()