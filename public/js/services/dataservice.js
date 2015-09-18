myApp.factory('DataService', function() {
    var service = {};

    service.getData = function(year) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET','/api/v1/schools?year=' + year);
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
    };

    return service;
});
