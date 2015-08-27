(function() {
    var app = angular.module('usageModule');

    app.controller('UsageUsersController', ['Bookmark', 'Tag', '$scope', '$sce',
        function(Bookmark, Tag, $scope, $sce) {
            var controller = this;
            var tags = new Tag();
            tags.loadStoredTags(function(tags) {
                controller.tags = tags;
            });

            controller.tag           = '';
            controller.relatedUsers = false;

            controller.serviceList = {
                'diigo' : 'Diigo',
                'zotero': 'Zotero'
            };
            controller.userServiceList = {
                'zotero' : 'Zotero\'s community\'s users',
            };
            controller.filters = {
                userServices: ['zotero'],
                services: ['diigo', 'zotero']
            };

            savedController = sessionStorage.usageTabController;
            if (savedController) {
                angular.extend(controller, angular.fromJson(savedController));
            }
            $scope.$watchCollection(function() {
                return controller;
            }, function(newState) {
                sessionStorage.usageTabController = angular.toJson(newState);
            });

            controller.sce         = $sce;
            controller.loading    = 0;
            
            controller.startQuery = function() {
                if (!controller.loading) {
                    controller.loading = 0;
                }
                controller.loading++;
            }

            controller.endQuery = function() {
                controller.loading--;
            }

            controller.replaceTagInInput = function(tag) {
                if (controller.loading) {
                    return false;
                }
                controller.tag = tag;
                controller.getRelatedInfo();
            }

            controller._getFilters = function (filters) {
                if (filters.services) {
                    var services = '';
                    angular.forEach(controller.filters.services, function(value, key) {
                        if (value) {
                            if (services) {
                                services += ',';
                            }
                            services += value;
                        }
                        if (services) {
                            filters.services = services;
                        }
                    });
                }
                
                if (filters.user_services) {
                    var userServices = '';
                    angular.forEach(controller.filters.userServices, function(value, key) {
                        if (value) {
                            if (userServices) {
                                userServices += ',';
                            }
                            userServices += value;
                        }
                    });
                    if (userServices) {
                        filters.user_services = userServices;
                    }
                }

                if (filters.tag) {
                    filters.tag = controller.tag;
                }

                return filters;
            }

            controller.retrieveTags = function() {
                controller.startQuery();
                
                var filters = controller._getFilters({'services': true});
                tags.getTags(filters, function(data, status, headers, config){
                    controller.tags = data;
                    controller.endQuery();
                }, function() {
                    controller.endQuery();
                });
            }

            controller.getRelatedInfo = function() {
                if (controller.loading) {
                    return false;
                }
                controller.startQuery();

                var filters = controller._getFilters({'user_services': true, 'tag': true});
                tags.getRelatedUsers(filters, function(data, status, headers, config){
                    if (data.zotero) {
                        controller.relatedUsers = data.zotero;
                        if (!controller.relatedUsers.length) {
                            controller.relatedUsers = false;
                        }
                    }
                    
                    controller.endQuery();
                }, function() {
                    controller.endQuery();
                });

            }

            return controller;
        }
    ]);
})()