(function() {
    var app = angular.module('usageModule');

    app.controller('UsageSaveController', ['Bookmark', 'Tag', '$scope',
    	function(Bookmark, Tag, $scope) {
    		var controller = this;
            var bookmarks = new Bookmark();
    		var tags = new Tag();

            controller.tags = [];

            controller.loading    = false;

            controller.newElement = {
                title       : '',
                url         : '',
                description : '',
                tags        : '',
                data        : ''
            }

            savedController = sessionStorage.UsageSaveController;
            if (savedController) {
                angular.extend(controller, angular.fromJson(savedController));
            }
            $scope.$watchCollection(function() {
                return controller;
            }, function(newState) {
                sessionStorage.UsageSaveController = angular.toJson(newState);
            });

            controller.addTagToInput = function(tag) {
                var tags = controller.newElement.tags;
                if (tags != '') {
                    tags += ',';
                }
                tags += tag;
                controller.newElement.tags = tags;
            }

            controller.retrieveTags = function() {
                controller.loading = true;
                tags.getTags({}, function(data, status, headers, config){
                    controller.tags = data;
                    controller.loading = false;
                }, function() {
                    controller.loading = false;
                });
            }

            controller.saveBookmark = function() {
                if (controller.loading) {
                    return false;
                }
                controller.loading = true;

                var bookmark = {
                    title: controller.newElement.title,
                    url: controller.newElement.url,
                    description: controller.newElement.description,
                    tags: controller.newElement.tags
                };
                bookmarks.saveBookmark(bookmark, function(data, status, headers, config) {
                    controller.loading = false;
                    controller.newElement.title = "";
                    controller.newElement.url = "";
                    controller.newElement.description = "";
                    controller.newElement.tags = "";
                    controller.newElement.data = JSON.stringify(data, undefined, 3); // indentation level = 2
                }, function() {
                    controller.loading = false;
                });         

            }
    	}
    ]);
})()