myApp.factory('DataService', function() {
    var service = {};

    function url(url) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);
            req.onload = function() {
                if (req.status == 200) {
                    resolve(req.response);
                } else {
                    reject(Error(req.statusText));
                }
            };
            req.onerror = function() {
                reject(Error('Network Error'));
            };
            req.send();
        });
    }
    service.get = function(year) {
        return url('/api/v1/schools/?year=' + year);
    };

    service.columns = function() {
        return url('datasets/column-defs.json');
    };

    service.peers = function() {
        return url('datasets/peer-groups.json');
    };

    return service;
});
