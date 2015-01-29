(function() {
    var app = angular.module('modelModule');

    app.factory('Tag',
        ['Abstract', 'DreamFactory', '$sce', function(Abstract, DreamFactory, $sce) {
            function Listes(filePath) {
                var tag = new Abstract();

                var data = {
                    apiDb: 'cowaboo',
                };
                
                tag.setData(data);

                tag.getTags = function(args, callback) {
                    if (!args) {
                        args = {};
                    }
                    var param = '';
                    args.diigo_username = "cowaboo";
                    args.zotero_users_or_groups = "groups";
                    args.zotero_elementId = "303941";

                    angular.forEach(args, function(value, key) {
                        if (param) {
                            param += '&';
                        } 
                        param += key+'='+encodeURIComponent(value);
                        
                    });

                    this.rest('get', 'tags?'+param, {}, callback); 
                };

               /* tag.saveTag = function(args, callback) {
                    if (!args) {
                        args = {};
                    }
                    var param = '';
                    args.zotero_users_or_groups = "groups";
                    args.zotero_elementId = "303941";

                    angular.forEach(args, function(value, key) {
                        if (param) {
                            param += '&';
                        } 
                        param += key+'='+encodeURIComponent(value);
                    });
                    this.rest('post', 'tags?'+param, {}, callback); 
                };*/

                return tag;
            };

            return Listes;
        }
    ]);
})()
