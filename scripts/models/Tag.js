(function() {
    var app = angular.module('modelModule');

    app.factory('Tag',
        ['Abstract', 'DreamFactory', '$sce', 'Params', function(Abstract, DreamFactory, $sce, Params) {
            function Listes(filePath) {
                var tag = new Abstract();

                var data = {
                    apiDb: 'cowaboo',
                };
                
                tag.setData(data);

                tag.getTags = function(args, callback, error) {
                    if (!args) {
                        args = {};
                    }
                    var param = '';
                    args.diigo_username = Params.diigoUsername;
                    args.zotero_users_or_groups = "groups";
                    args.zotero_elementId = Params.zoteroElementId;
                    args.zotero_api_key = Params.zoteroKey;

                    angular.forEach(args, function(value, key) {
                        if (param) {
                            param += '&';
                        } 
                        param += key+'='+encodeURIComponent(value);
                        
                    });

                    this.rest('get', 'tags?'+param, {}, callback, error); 
                };

                tag.getRelatedInfo = function(filters, callback, error) {
                    var args = filters;
                    if (!args) {
                        args = {};
                    }

                    var param = '';
                    angular.forEach(args, function(value, key) {
                        if (param) {
                            param += '&';
                        } 
                        param += key+'='+encodeURIComponent(value);
                        
                    });

                    this.rest('get', 'tags/related?'+param, {}, callback, error); 
                };
                
                return tag;
            };

            return Listes;
        }
    ]);
})()
