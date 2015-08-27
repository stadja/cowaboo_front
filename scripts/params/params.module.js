(function() {
    var app = angular.module('paramsModule', ['ngAnimate', 'IndexDbService']);

    app.controller('ParamsController', [ 'Params', '$rootScope', '$scope', 'IndexDb',
        function(Params, $rootScope, $scope, IndexDb) {
            var controller = this;
            controller.hideParams = true;

            controller.diigoPwd = '';
            $scope.$watch(function() {
                return controller.diigoPwd;
            }, function(newValue) {
                if (!newValue || !controller.diigoUsername) {
                    return controller.diigoAuth = '';
                }
                controller.diigoAuth = 'basic '+btoa(controller.diigoUsername+':'+newValue);
            });

            $scope.$watch(function() {
                return controller.diigoUsername;
            }, function(newValue) {
                if (!newValue || !controller.diigoPwd) {
                    return controller.diigoAuth = '';
                }
                controller.diigoAuth = 'basic '+btoa(newValue+':'+controller.diigoPwd);
            });

            controller.save = function() {
                controller.hideParams = true;
                
                IndexDb.save('params', {id: 'diigoUsername', value: controller.diigoUsername}, function(event) {
                    Params.diigoUsername = controller.diigoUsername;
                });
                IndexDb.save('params', {id: 'diigoAuth', value: controller.diigoAuth}, function(event) {
                    Params.diigoAuth = controller.diigoAuth;
                });
                IndexDb.save('params', {id: 'zoteroElementId', value: controller.zoteroElementId}, function(event) {
                    Params.zoteroElementId = controller.zoteroElementId;
                });
                IndexDb.save('params', {id: 'zoteroKey', value: controller.zoteroKey}, function(event) {
                    Params.zoteroKey = controller.zoteroKey;
                });

            };

            controller.init = function(dontsave) {
                IndexDb.load('params-init', ['diigoUsername', 'diigoAuth', 'zoteroElementId', 'zoteroKey'], function(values) {
                    for (var i in values) {
                        controller[values[i].id] = values[i].value;
                        Params[values[i].id] = values[i].value;
                    }
                });
                if (!dontsave) {
                    controller.save();
                }
            }

            $rootScope.$on('indexdb-open-success', function(){
                IndexDb.load('params', ['diigoUsername', 'diigoAuth', 'zoteroElementId', 'zoteroKey'], function(values) {
                    for (var i in values) {
                        controller[values[i].id] = values[i].value;
                        Params[values[i].id] = values[i].value;
                    }
                });
            });

            return controller;
        }
    ]);

    app.directive('params', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/params.html',
            controllerAs: 'params',
            controller: 'ParamsController'
        }
    });

    app.service('Params', [function () {
        var params = this;

        params.generateQuery = function(args) {
            if (!args) {
                args = {};
            }

            var query = '';

            if (!args.services) {
                args.diigo_username = params.diigoUsername;
                args.diigo_access_key = params.diigoAuth;
                args.zotero_users_or_groups = "groups";
                args.zotero_elementId = params.zoteroElementId;
                args.zotero_api_key = params.zoteroKey;
            } else {
                if (args.services.indexOf('diigo') != -1) {
                    args.diigo_username = params.diigoUsername;
                    args.diigo_access_key = params.diigoAuth;
                }
                if (args.services.indexOf('zotero') != -1) {
                    args.zotero_users_or_groups = "groups";
                    args.zotero_elementId = params.zoteroElementId;
                    args.zotero_api_key = params.zoteroKey;
                }
            }

            angular.forEach(args, function(value, key) {
                if (query) {
                    query += '&';
                } 
                query += key+'='+encodeURIComponent(value);
                
            });
            return query;
        }

        return params;
    }]);

})()