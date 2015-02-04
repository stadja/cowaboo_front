(function() {
    var app = angular.module('tabsModule', ['ngRoute']);

    app.controller('TabsController', ['$scope', '$route',
        function($scope, $route) {
            var controller = this;

            controller.activeTab = $route.current.pageTitle;
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
            controller: 'TabsController'
        }
    });
})()