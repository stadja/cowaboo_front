(function() {
    var app = angular.module('tabsModule', ['ngRoute']);

    app.controller('tabsController', ['$scope', 
        function($scope) {
            var controller = this;
            $scope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
                controller.activeTab = nextRoute.$$route.pageTitle;
            });
            return controller;
        }
    ]);

    app.directive('tabs', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/tabs.html',
            scope: {
                active: '='
            },
            controllerAs: 'tabs',
            controller: 'tabsController'
        }
    });
})()