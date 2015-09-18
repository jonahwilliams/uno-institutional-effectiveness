myApp.factory('StorageService', function($window) {
    var service = {};
    var key = 'uno-inst';

    service.update = function(name, value) {
        var obj = this.get();
        obj[name] = value;
        this.set(obj);
    };
    service.set = function(value) {
        $window.localStorage[key] = JSON.stringify(value);
    };
    service.get = function() {
        return JSON.parse($window.localStorage[key]);
    };

    return service;
});
