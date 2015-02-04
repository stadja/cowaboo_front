(function() {
    var app = angular.module('usageModule');
    
    app.controller('UsageSearchController', ['Bookmark', 'Tag', '$scope', '$sce',
    	function(Bookmark, Tag, $scope, $sce) {
            var bookmarks = new Bookmark();
            var tags = new Tag();
    		var controller = this;

            controller.bookmarks = [];
            controller.meta = false;

            controller.serviceList = {
                'diigo' : 'Diigo',
                'zotero': 'Zotero'
            };

            controller.filters = {
                tags    : [],
                services: []
            };

            savedController = sessionStorage.UsageSearchController;
            if (savedController) {
                angular.extend(controller, angular.fromJson(savedController));
            }
            $scope.$watchCollection(function() {
                return controller;
            }, function(newState) {
                sessionStorage.UsageSearchController = angular.toJson(newState);
            });

            controller.loading = false;

            controller._getFilters = function () {
                var filters = {};
                if (controller.filters.tags.length) {
                    filters.tags = controller.filters.tags.join(',');
                }
                var services = '';
                angular.forEach(controller.filters.services, function(value, key) {
                    if (value) {
                        if (services) {
                            services += ',';
                        }
                        services += value;
                    }
                });
                if (services) {
                    filters.services = services;
                }

                return filters;
            }

            controller.retrieveTags = function() {
                var filters = controller._getFilters();

                controller.loading = true;
                tags.getTags(filters, function(data, status, headers, config){
                    controller.tags = data;
                    controller.loading = false;
                }, function() {
                    controller.loading = false;
                });
            }

    		controller.search = function() {
    			if (controller.loading) {
    				return false;
    			}
    			controller.loading = true;
                var filters = controller._getFilters();
    			
				bookmarks.getBookmarks(filters, function(data, status, headers, config) {
                    controller.meta = data.meta;
					controller.bookmarks = data.merged;
    				controller.loading = false;
				}, function() {
                    controller.loading = false;
                }); 			
    		}

    		controller.addTagToFilter = function(tag) {
    			if (controller.loading) {
    				return false;
    			}
    			var i = controller.filters.tags.indexOf(tag);
    			if (i == -1) {
	    			controller.filters.tags.push(tag);
	    			controller.search();
	    		}
    		}

    		controller.removeTagToFilter = function(tag) {
    			if (controller.loading) {
    				return false;
    			}
    			var i = controller.filters.tags.indexOf(tag);
    			controller.filters.tags.splice(i,1);
    			controller.search();
    		}

    	}
    ]);
})()