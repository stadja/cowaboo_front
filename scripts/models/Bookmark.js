(function() {
    var app = angular.module('modelModule');

    app.factory('Bookmark',
        ['Abstract', 'DreamFactory', '$sce', 'Params', function(Abstract, DreamFactory, $sce, Params) {
            function Listes(filePath) {
                var bookmark = new Abstract();

                var data = {
                    apiDb: 'cowaboo',
                };
                
                bookmark.setData(data);

                bookmark.getBookmarks = function(args, callback, error) {
                    query = Params.generateQuery(args);
                    this.rest('get', 'bookmarks?'+query, {}, callback, error); 
                };

                bookmark.saveBookmark = function(args, callback, error) {
                    query = Params.generateQuery(args);
                    this.rest('post', 'bookmarks?'+query, {}, callback, error); 
                };

                return bookmark;
            };

            return Listes;
        }
    ]);
})()
