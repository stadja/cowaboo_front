(function() {
    var app = angular.module('usageModule');

    app.controller('UsageTagsController', ['Bookmark', 'Tag', '$scope', '$sce',
        function(Bookmark, Tag, $scope, $sce) {
            var controller = this;
            var tags = new Tag();

            controller.tag         = '';
            controller.tagPath     = [];
            controller.relatedTags = false;
            controller.relatedInfo = false;
            controller.suggestion  = false;
            controller.serviceList = {
                'diigo' : 'Diigo',
                'zotero': 'Zotero'
            };
            controller.tagServiceList = {
                'wikipedia' : 'Related articles from Wikimedia API',
                'diigo' : 'Related tags from all Diigo\'s communities',
            };
            controller.filters = {
                tagServices: [],
                services   : []
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
                controller.tagPath = [tag];
                controller.getRelatedInfo();
            }

            controller.addTagToInput = function(tag) {
                if (controller.loading) {
                    return false;
                }
                controller.tag = tag;
                controller.tagPath.push(tag);
                controller.getRelatedInfo();
            }

            controller.replaceCurrentTagPath = function(tagPath) {
                if (controller.loading) {
                    return false;
                }
                controller.tagPath = tagPath.split(' ');
                controller.getRelatedInfo();
            }

            controller.startAtTag = function(tag) {
                if (controller.loading) {
                    return false;
                }
                $tagIndex = controller.tagPath.indexOf(tag);
                if ($tagIndex == '-1') {
                    return controller.replaceTagInInput(tag);
                }
                controller.tagPath.splice($tagIndex, controller.tagPath.length - ($tagIndex));
                controller.addTagToInput(tag);
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
                
                if (filters.tagServices) {
                    var tagServices = '';
                    angular.forEach(controller.filters.tagServices, function(value, key) {
                        if (value) {
                            if (tagServices) {
                                tagServices += ',';
                            }
                            tagServices += value;
                        }
                    });
                    if (tagServices) {
                        filters.tag_services = tagServices;
                    }
                }

                if (filters.tag) {
                    filters.tag = controller.tagPath.join(' ');
                }

                return filters;
            }

            controller.retrieveTags = function() {
                controller.startQuery();
                
                var filters = controller._getFilters({'service': true});
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
                controller.relatedTags = false;
                controller.relatedInfo = false;
                controller.suggestion  = false;

                var filters = controller._getFilters({'tagServices': true, 'tag': true});
                tags.getRelatedInfo(filters, function(data, status, headers, config){
                    if (data.diigo) {
                        controller.relatedTags = data.diigo;
                    }

                    if (data.wikipedia) {
                        if (data.wikipedia.articles.length > 0) {
                            controller.relatedInfo = data.wikipedia.articles;
                        }  

                        if (data.wikipedia.suggestion) {
                            controller.suggestion = data.wikipedia.suggestion;
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