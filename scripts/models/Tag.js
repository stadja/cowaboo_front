(function() {
    var app = angular.module('modelModule');

    app.factory('Tag',
        ['Abstract', 'DreamFactory', '$sce', 'Params', 'IndexDb', '$rootScope',
        function(Abstract, DreamFactory, $sce, Params, IndexDb, $rootScope) {
            function Listes(filePath) {
                var tag = new Abstract();

                var data = {
                    apiDb: 'cowaboo',
                };
                
                tag.setData(data);
                
                tag.loadStoredTags = function(success) {
                    try{
                        IndexDb.loadAll('tags', function(tags) {
                            success(tags);
                        }); 
                    }catch(e){
                        $rootScope.$on('indexdb-open-success', function(){
                            IndexDb.loadAll('tags', function(tags) {
                                success(tags);
                            }); 
                        });
                    }
                };
                

                tag.getTags = function(args, callback, error) {
                    query = Params.generateQuery(args);
                    this.rest('get', 'tags?'+query, {}, function(data, status, headers, config) {
                        for (tag in data) {
                            IndexDb.save('tags', data[tag]);
                        }

                        if(callback) {
                            callback(data, status, headers, config);
                        }
                    }, error); 
                };

                tag.getRelatedInfo = function(args, callback, error) {
                    query = Params.generateQuery(args);
                    this.rest('get', 'tags/infos?'+query, {}, callback, error); 
                };

                tag.getRelatedGroups = function(args, callback, error) {
                    query = Params.generateQuery(args);
                    this.rest('get', 'tags/groups?'+query, {}, callback, error); 
                };

                tag.getRelatedUsers = function(args, callback, error) {
                    query = Params.generateQuery(args);
                    this.rest('get', 'tags/users?'+query, {}, callback, error); 
                };
                
                return tag;
            };

            return Listes;
        }
    ]);
})()
