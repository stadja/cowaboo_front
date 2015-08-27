// http://wemadeyoulook.at/en/blog/implementing-basic-http-authentication-http-requests-angular/
(function() {

    var app = angular.module('IndexDbService', []);

    app.service('IndexDb', ['$rootScope', function IndexDb($rootScope) {
        var indexDb = this;

        // In the following line, you should include the prefixes of implementations you want to test.
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        // DON'T use "var indexedDB = ..." if you're not in a function.
        // Moreover, you may need references to some window.IDB* objects:
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
        // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
        
        if (!window.indexedDB) {
            alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.")
        }

        // Let us open our database
        var request = window.indexedDB.open("CowabooDb", 18);

        request.onerror = function(event) {
            alert("Why didn't you allow my web app to use IndexedDB?!");
        };

        request.onsuccess = function(event) {
            indexDb.db = request.result;
            indexDb.db.onerror = function(event) {
                // Generic error handler for all errors targeted at this database's
                // requests!
                console.log("Database error: ");
                console.log(event);
            };
            $rootScope.$emit('indexdb-open-success', {})
        };

        request.onupgradeneeded = function(event) {
            var db = event.target.result;
            var objectStore;

            try{
                objectStore = db.createObjectStore("params", { keyPath: "id" });
            }catch(e){
                db.deleteObjectStore('params');
                objectStore = db.createObjectStore("params", { keyPath: "id" });
            }finally{
                objectStore.put({id: 'diigoUsername', value: 'cowaboo'});
                objectStore.put({id: 'diigoAuth', value: 'basic Y293YWJvbzpQYXNzd29yZCA0IGNvd2Fib28='});
                objectStore.put({id: 'zoteroElementId', value: '303941'});
                objectStore.put({id: 'zoteroKey', value: '3k89ouyqI6vYIkTsgPJTK4ek'});
            }

            try{
                objectStoreInit = db.createObjectStore("params-init", { keyPath: "id" });   
            }catch(e){
                db.deleteObjectStore("params-init");
                objectStoreInit = db.createObjectStore("params-init", { keyPath: "id" });   
            }finally{
                objectStoreInit.put({id: 'diigoUsername', value: 'cowaboo'});
                objectStoreInit.put({id: 'diigoAuth', value: 'basic Y293YWJvbzpQYXNzd29yZCA0IGNvd2Fib28='});
                objectStoreInit.put({id: 'zoteroElementId', value: '303941'});
                objectStoreInit.put({id: 'zoteroKey', value: '3k89ouyqI6vYIkTsgPJTK4ek'});
            }

            try{
                objectStoreInit = db.createObjectStore("tags", { keyPath: "title" });   
            }catch(e){
                db.deleteObjectStore("tags");
                objectStoreInit = db.createObjectStore("tags", { keyPath: "title" });   
            }finally{
            }
            
        };

        indexDb.save = function(store, object, success) {
            var transaction = indexDb.db.transaction([store], "readwrite");

            // Do something when all the data is added to the database.
            transaction.oncomplete = function(event) {
              /*alert("All done!");*/
            };

            var objectStore = transaction.objectStore(store);
            var request = objectStore.put(object);

            if (success) {
                request.onsuccess = function(event) {
                    success(event);
                };
            }
        };

        indexDb.load = function(store, ids, success) {
            var transaction = indexDb.db.transaction([store]);
            var objectStore = transaction.objectStore(store);

            var values = [];

            for(var i in ids) {
                objectStore.openCursor(IDBKeyRange.only(ids[i])).onsuccess = function(event) {
                  var cursor = event.target.result;
                  if (cursor) {
                    values.push(cursor.value);
                    cursor.continue();
                  }
                };
            }

            transaction.oncomplete = function(event) {
                if (success) {
                    success(values);
                }
            };

        };

        indexDb.loadAll = function(store, success) {
            var transaction = indexDb.db.transaction([store]);
            var objectStore = transaction.objectStore(store);

            var values = [];
            objectStore.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    values.push(cursor.value);
                    cursor.continue();
                }
            };

            transaction.oncomplete = function(event) {
                if (success) {
                    success(values);
                }
            };
        }

    }]);
})()