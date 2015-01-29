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
                    if (!args) {
                        args = {};
                    }
                    var param = '';
                    args.diigo_username = Params.diigoUsername;
                    args.diigo_access_key = Params.diigoAuth;
                    args.zotero_users_or_groups = "groups";
                    args.zotero_elementId = Params.zoteroElementId;
                    args.zotero_api_key = Params.zoteroKey;

                    angular.forEach(args, function(value, key) {
                        if (param) {
                            param += '&';
                        } 
                        param += key+'='+encodeURIComponent(value);
                        
                    });

                    this.rest('get', 'bookmarks?'+param, {}, callback, error); 
                };

                bookmark.saveBookmark = function(args, callback, error) {
                    if (!args) {
                        args = {};
                    }
                    var param = '';
                    args.diigo_username = Params.diigoUsername;
                    args.diigo_access_key = Params.diigoAuth;
                    args.zotero_users_or_groups = "groups";
                    args.zotero_elementId = Params.zoteroElementId;
                    args.zotero_api_key = Params.zoteroKey;

                    angular.forEach(args, function(value, key) {
                        if (param) {
                            param += '&';
                        } 
                        param += key+'='+encodeURIComponent(value);
                    });
                    this.rest('post', 'bookmarks?'+param, {}, callback, error); 
                };

                return bookmark;
            };

            return Listes;
        }
    ]);
})()
