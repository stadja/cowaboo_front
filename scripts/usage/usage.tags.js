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

            controller.retrieveTags = function() {
                controller.startQuery();
                tags.getTags({}, function(data, status, headers, config){
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
                var tag = controller.tagPath.join(' ');
                tags.getRelatedInfo(tag, function(data, status, headers, config){
                    controller.relatedTags = data.related_tags;
                    if (data.related_info.articles.length > 0) {
                        controller.relatedInfo = data.related_info.articles;
                    }
                    if (data.related_info.suggestion) {
                        controller.suggestion = data.related_info.suggestion;
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