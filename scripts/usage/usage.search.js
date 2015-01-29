(function() {
    var app = angular.module('usageModule');

    app.controller('usageSearchController', ['Bookmark', 'Tag', '$scope', '$sce',
    	function(Bookmark, Tag, $scope, $sce) {
            var bookmarks = new Bookmark();
            var tags = new Tag();
    		var controller = this;

            controller.bookmarks = [];
            controller.filters = {
                tags: []
            };

            savedController = sessionStorage.usageSearchController;
            if (savedController) {
                angular.extend(controller, angular.fromJson(savedController));
            }
            $scope.$watchCollection(function() {
                return controller;
            }, function(newState) {
                sessionStorage.usageSearchController = angular.toJson(newState);
            });

            controller.loading = false;

            controller.retrieveTags = function() {
                controller.loading = true;
                tags.getTags({}, function(data, status, headers, config){
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
    			var filters = {};
    			if (controller.filters.tags.length) {
    				filters.tags = controller.filters.tags.join(',');
    			}
				bookmarks.getBookmarks(filters, function(data, status, headers, config) {
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