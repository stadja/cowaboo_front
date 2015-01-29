if (typeof console == 'undefined') {
    console = {};
    console.log = function(message) {
        alert(message);
    };
    console.warn = function(message) {
        alert(message);
    };
    console.error = function(message) {
        alert(message);
    };
    console.trace = function() {
        alert('trace');
    };
}

function hideAddressBar() {
    if (!window.location.hash) {
        if (document.height < window.outerHeight) {
            document.body.style.height = (window.outerHeight + 50) + 'px';
        }

        setTimeout(function() {
            window.scrollTo(0, 1);
        }, 50);
    }
}

window.addEventListener("load", function() {
    if (!window.pageYOffset) {
        hideAddressBar();
    }
});
window.addEventListener("orientationchange", hideAddressBar);


(function() {
    var app = angular.module('cowaboo', ['usageModule', 'tabsModule', 'lastcallModule', 'paramsModule']);

    app.controller('AppController', [

        function() {
        }
    ]);

    app.directive('openIcon', [function () {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'templates/isOpen.html',
            link: function(scope, element, attrs) {
                attrs.$observe("open", function(value){
                   scope.isOpen = (value == "true");
               });
            }
        };
    }])

})();