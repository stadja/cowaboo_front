(function() {
    var app = angular.module('paramsModule', ['ngAnimate']);

    app.initConfig = {
        diigoUsername   : 'cowaboo',
        diigoAuth       : 'basic Y293YWJvbzpQYXNzd29yZCA0IGNvd2Fib28=',
        zoteroElementId : '303941',
        zoteroKey       : '3k89ouyqI6vYIkTsgPJTK4ek'
    };

    app.controller('paramsController', [ 'Params', '$scope',
        function(Params, $scope) {
            var controller = this;
            controller.hideParams = false;

            controller.diigoPwd = '';
            $scope.$watch(function() {
                return controller.diigoPwd;
            }, function(newValue) {
                if (!newValue || !controller.diigoUsername) {
                    return controller.diigoAuth = app.initConfig.diigoAuth;
                }
                controller.diigoAuth = 'basic '+btoa(controller.diigoUsername+':'+newValue);
            });

            $scope.$watch(function() {
                return controller.diigoUsername;
            }, function(newValue) {
                if (!newValue || !controller.diigoPwd) {
                    return controller.diigoAuth = app.initConfig.diigoAuth;
                }
                controller.diigoAuth = 'basic '+btoa(newValue+':'+controller.diigoPwd);
            });

            controller.save = function() {
                controller.hideParams = true;
                
                var savedParams = {
                    diigoUsername   : controller.diigoUsername,
                    diigoAuth       : controller.diigoAuth,
                    zoteroElementId : controller.zoteroElementId,
                    zoteroKey       : controller.zoteroKey
                };

                sessionStorage.savedParams = angular.toJson(savedParams);
                angular.extend(Params, savedParams);

            };

            controller.init = function() {
                angular.extend(controller, app.initConfig);
                angular.extend(Params, app.initConfig);
            }

            controller.init();

            if (sessionStorage.savedParams) {
                var savedParams = angular.fromJson(sessionStorage.savedParams);
                angular.extend(controller, savedParams);
                angular.extend(Params, savedParams);
            }

            return controller;
        }
    ]);

    app.directive('params', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/params.html',
            controllerAs: 'params',
            controller: 'paramsController'
        }
    });

    app.service('Params', [function () {
        var params = this;
        return params;
    }]);

})()