(function() {
    var app = angular.module('lastcallModule', []);

    app.directive('lastcall', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            controllerAs: 'lastCall',
            controller: function($scope, $element, $attrs, $location) {
                var controller = this;
                $rootScope.$on('dreamfactory-rest-success', function(event, args) {
                    var lastCall = {
                        url: args.config.url+"&app_name=cowaboo",
                        method: args.config.method,
                        data: JSON.stringify(args.data, undefined, 5),
                        error: false,
                        success: true
                    };
                    angular.extend(controller, lastCall);
                });

                $rootScope.$on('dreamfactory-rest-error', function(event, args) {
                    var lastCall = {
                        url: args.config.url+"&app_name=cowaboo",
                        method: args.config.method,
                        data: JSON.stringify(args.data, undefined, 5),
                        code: args.data.error[0].code,
                        error: args.data.error[0].message,
                        success: false
                    };
                    angular.extend(controller, lastCall);
                });
                
                savedController = sessionStorage.lastcallController;
                if (savedController) {
                    angular.extend(controller, angular.fromJson(savedController));
                }
                $scope.$watchCollection(function() {
                    return controller;
                }, function(newState) {
                    sessionStorage.lastcallController = angular.toJson(newState);
                });


                return controller;
            },
            templateUrl: 'templates/lastcall.html'
        };
    }])

})()