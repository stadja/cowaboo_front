(function() {
    var app = angular.module('modelModule', ['serviceDreamFactoryBeta', 'paramsModule', 'IndexDbService']);

    app.factory('Abstract', ['DreamFactory',
        function(DreamFactory) {
            function Abstract() {
                var data = {
                    records: [],
                    recordTemplateUrl: 'abstract',
                    apiDb: 'stadjadb',
                    apiFile: 'filestadja',
                    tableName: 'abstract',
                    related: null,
                    order: null,
                };
                this.setData(data);
            };

            Abstract.prototype = {
                setData: function(data) {
                    angular.extend(this, data);
                },
                _createRecordFromApi: function(apiRecord) {
                    return apiRecord;
                },
                postToWebService: function(service, args, callback, error) {
                    recordManager = this;
                    args.service = service+'?is_user_script=true';
                    args.is_user_script = 'true';
                    args.path = 'system/script/'+service
                    DreamFactory.call(
                        'system/script',
                        'post',
                        args,
                        function(response) {
                            if (callback) {
                                callback(response);
                            }
                        }, error
                    );
                },
                rest: function(method, service, args, callback, error) {
                    recordManager = this;
                    if (!args) {
                        args = {};
                    }
                    args.service = service;
                    DreamFactory.call(
                        recordManager.apiDb,
                        method,
                        args,
                        function(data, status, headers, config) {
                            if (callback) {
                                callback(data, status, headers, config);
                            }
                        }, error
                    );
                },
                getFile: function(fileContainer, filePath, callback, error) {
                    recordManager = this;
                    DreamFactory.call(
                        recordManager.apiFile,
                        'getFile',
                        fileContainer+'/'+filePath,
                        function(response) {
                            if (callback) {
                                callback(response);
                            }
                        }, error
                    );
                },
                createFile: function(fileContainer, filePath, content, callback, error) {
                    recordManager = this;
                    DreamFactory.call(
                        recordManager.apiFile,
                        'createFile',
                        {
                            path: fileContainer+'/'+filePath,
                            content: content
                        },
                        function(response) {
                            if (callback) {
                                callback(response);
                            }
                        }, error
                    );
                },
                replaceFile: function(fileContainer, filePath, content, callback, error) {
                    recordManager = this;
                    DreamFactory.call(
                        recordManager.apiFile,
                        'replaceFile',
                        {
                            path: fileContainer+'/'+filePath,
                            content: content
                        },
                        function(response) {
                            if (callback) {
                                callback(response);
                            }
                        }, error
                    );
                },
                updateRecord: function(record, callback) {
                    recordManager = this;
                    record.table_name = recordManager.tableName;
                    DreamFactory.call(
                        recordManager.apiDb,
                        'updateRecord',
                            record
                        , function(response) {
                            if (callback) {
                                callback(record);
                            }
                        }
                    );
                },
                loadRecords: function(limit, offset, callback) {
                    recordManager = this;
                    DreamFactory.call(
                        recordManager.apiDb,
                        'getRecordsByFilter',
                        {
                            table_name: recordManager.tableName,
                            limit: limit,
                            offset: offset,
                            related: recordManager.related,
                            include_count: 'true',
                            order: recordManager.order
                        }, function(response) {
                            response = response.obj;
                            records = [];
                            angular.forEach(response.record, function(record) {
                                newRecord = recordManager._createRecordFromApi(record);
                                if (newRecord)
                                    records.push(newRecord);
                            });
                            recordManager.setData({
                                count: response.meta.count,
                                records: records
                            });
                            return callback ? callback(recordManager.records, recordManager.count) : true;
                        }
                    );
                }
            };
            return Abstract;
        }
    ]);
})()
