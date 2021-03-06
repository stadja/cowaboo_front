// http://wemadeyoulook.at/en/blog/implementing-basic-http-authentication-http-requests-angular/
(function() {

    var app = angular.module('serviceDreamFactoryBeta', []);

    app.service('DreamFactory', ['$http', '$rootScope', function DreamFactory($http, $rootScope) {

        var dreamfactory = this;
        
        var dsp_url = "http://stadja.net:81/rest";
        var dsp_url_docs = "http://stadja.net:81/rest/api_docs";
        //replace this app_name with yours
        var app_name = "courses";

        var storageId = app_name;
        var tokenStorageId = storageId+".tokenId";
        var duration = 36000;

        $http.defaults.headers.common['X-DreamFactory-Application-Name'] = app_name;
        $http.defaults.headers.common['Content-Type'] = 'application/json';

        if (sessionStorage.getItem(tokenStorageId)) {
            $http.defaults.headers.common['X-DreamFactory-Session-Token'] = sessionStorage.getItem(tokenStorageId);
        }

        dreamfactory.init = function(callback, login, pwd) {

        };

        dreamfactory.call = function(apiName, apiAction, args, success, error) {
            var functionCalled = eval('dreamfactory.'+apiAction);
            functionCalled(apiName, apiAction, args, success, error);
        };

        dreamfactory.rest = function(method, apiName, apiAction, args, success, error) {
            var httpCall = eval('$http.'+method);
            var service = args.service;
            httpCall(dsp_url+'/'+apiName+'/'+service, args)
            .success(function(data, status, headers, config) {
                $rootScope.$emit('dreamfactory-rest-success', {
                    data: data,
                    status: status,
                    headers: headers,
                    config: config
                });
                success(data, status, headers, config);
            }).error(function(data, status, headers, config) {
                $rootScope.$emit('dreamfactory-rest-error', {
                    data: data,
                    status: status,
                    headers: headers,
                    config: config
                });
                if (error) {
                    error(data, status, headers, config);
                }
            });
        };

        dreamfactory.post = function(apiName, apiAction, args, success, error) {
            dreamfactory.rest('post', apiName, apiAction, args, success, error);
        };

        dreamfactory.put = function(apiName, apiAction, args, success, error) {
            dreamfactory.rest('put', apiName, apiAction, args, success, error);
        };

        dreamfactory.get = function(apiName, apiAction, args, success, error) {
            dreamfactory.rest('get', apiName, apiAction, args, success, error);
        };

        dreamfactory.getFile = function(apiName, apiAction, filePath, success, error) {
            $http.get(dsp_url+'/'+apiName+'/'+filePath,
                {
                }
            ).success(function(data, status, headers, config) {
                success(data);
            }).error(function(data, status, headers, config) {
                error();
            });

        };

        dreamfactory.createFile = function(apiName, apiAction, args, success, error) {
            filePath = args.path;
            content = args.content;
            $http.post(dsp_url+'/'+apiName+'/'+filePath, content)
            .success(function(data, status, headers, config) {
                success(data);
            }).error(function(data, status, headers, config) {
                error();
            });

        };

        dreamfactory.replaceFile = function(apiName, apiAction, args, success, error) {
            filePath = args.path;
            content = args.content;
            $http.put(dsp_url+'/'+apiName+'/'+filePath, content)
            .success(function(data, status, headers, config) {
                success(data);
            }).error(function(data, status, headers, config) {
                error();
            });

        };

        dreamfactory.getRecordsByFilter = function (apiName, apiAction, args, callback) {
            var table_name = args.table_name;
            args.table_name = null;
            $http.get(dsp_url+'/'+apiName+'/'+table_name,
                {
                    params: args
                }
            ).success(function(data, status, headers, config) {
                var response = {
                    obj: data
                }
                callback(response);
            });
        };

        dreamfactory.updateRecord = function (apiName, apiAction, args, callback) {
            var table_name = args.table_name;
            args.table_name = null;
            $http.patch(dsp_url+'/'+apiName+'/'+table_name+'/'+args.id,
                args
            ).success(function(data, status, headers, config) {
                var response = {
                    obj: data
                }
                callback(response);
            });
        };

        dreamfactory.getSession = function(success, error) {
            $http.get(dsp_url+'/user/session').success(function(data, status, headers, config) {
                if (data.session_id) {
                    $http.defaults.headers.common['X-DreamFactory-Session-Token'] = data.session_id;
                    sessionStorage.setItem(tokenStorageId, data.session_id);
                    if (success) {
                        success(data, status, headers, config);
                    }
                } else if (error) {
                    error(data, status, headers, config);
                }
            }).error(function(data, status, headers, config) {
                console.log(data.error[0].message);
                if (error) {
                    error(data, status, headers, config);
                }
            });
        }

        dreamfactory.logout = function(callback) {
            $http.delete(dsp_url+'/user/session').success(function(data, status, headers, config) {
                sessionStorage.removeItem(tokenStorageId);
                if (callback) {
                    callback(data, status, headers, config);
                }
            }).error(function(data, status, headers, config) {
                console.log(data.error[0].message);
            });
        }

        dreamfactory.login = function(username, password, success, error) {
            $http.post(dsp_url+'/user/session',
                {
                    email: username,
                    password: password,
                    duration: duration
                }
            ).success(function(data, status, headers, config) {
                $http.defaults.headers.common['X-DreamFactory-Session-Token'] = data.session_id;
                sessionStorage.setItem(tokenStorageId, data.session_id);
                if (success) {
                    success(data, status, headers, config);
                }
            }).error(function(data, status, headers, config) {
                console.log(data.error[0].message);
                if (error) {
                    error(data, status, headers, config);
                }
            });
        }
    }]);
})()