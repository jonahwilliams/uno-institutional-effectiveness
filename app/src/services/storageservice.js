myApp.factory('StorageService', function($window) {
    var service = {};
    var key = 'uno-inst';

    service.load = function() {
        return JSON.parse($window.localStorage[key] || '[]');
    };
    service.update = function(group) {
        var obj = this.load();
        obj.push(group);
        this.save(obj);
    };
    service.save = function(obj) {
        $window.localStorage[key] = JSON.stringify(obj);
    };

    return service;
});
