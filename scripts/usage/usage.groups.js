(function() {
    var app = angular.module('usageModule');

    app.controller('UsageGroupsController', ['Bookmark', 'Tag', '$scope', '$sce',
        function(Bookmark, Tag, $scope, $sce) {
            var controller = this;
            var tags = new Tag();
            tags.loadStoredTags(function(tags) {
                controller.tags = tags;
            });
            
            controller.tag           = '';
            controller.relatedGroups = false;

            controller.serviceList = {
                'diigo' : 'Diigo',
                'zotero': 'Zotero'
            };
            controller.groupServiceList = {
                'zotero' : 'Zotero\'s community\'s groups',
            };
            controller.filters = {
                groupServices: ['zotero'],
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
                
                if (filters.group_services) {
                    var groupServices = '';
                    angular.forEach(controller.filters.groupServices, function(value, key) {
                        if (value) {
                            if (groupServices) {
                                groupServices += ',';
                            }
                            groupServices += value;
                        }
                    });
                    if (groupServices) {
                        filters.group_services = groupServices;
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

                var filters = controller._getFilters({'group_services': true, 'tag': true});
                tags.getRelatedGroups(filters, function(data, status, headers, config){
                    if (data.zotero) {
                        controller.relatedGroups = data.zotero;
                        if (!controller.relatedGroups.length) {
                            controller.relatedGroups = false;
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