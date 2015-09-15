/* global myApp */
myApp.controller('DataCtrl',
  function($scope, $http, $filter, $anchorScroll, $location) {

    $scope.columns = {'test': 1};
    $scope.data = [{'test': 1}];
    $scope.$filter = $filter;
    $scope.alerts = [];
    $scope.selectedPoint = {'test': 1};
    $scope.params = {
        xcol : 'employees',
        ycol : 'grad6',
        customPeer: [],
        usePeers: false,
        peers : [],
        year: 2013,
        ordercol: 'grad6',
        sortCol: 'grad6',
        onCustom: false,
        lastId: 'Test'
    };
    $scope.status = {
        isopenx: false,
        isopeny: false,
        isopenpeer: false,
        isopenyear: false,
        isopensum: false
    };

    $http.get('datasets/column-defs.json').then(function(response){
        $scope.columns = response.data.cols;
    }, function(err){
        throw err;
    });

    $http.get('datasets/peer-groups.json').then(function(response){
        $scope.params.peers = response.data.peers;
    }, function(err){
        throw err;
    });

    $http.get('/api/v1/schools?year=2013&order=grad6').success(function(data){
        $scope.data = data;
        $scope.selectedPoint = $scope.data.filter(function(d){
            return d.instnm == 'University of Nebraska at Omaha';
        })[0];
    }).error(function(error){
        throw error;
    });


    $scope.loadYear = function(year){
        if ((year == 2013) || (year == 2012)){
            $scope.params.year = year;
            $http.get(
              '/api/v1/schools?year=' + String(year) + '&order=grad6')
            .success(function(data){
                $scope.data = data;
            }).error(function(error){
                throw error;
            });
        }

    };

    $scope.addAlert = function(contents) {
        $scope.alerts.push({type: 'success', msg: contents});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.onSelect = function($item, $model, $label) {
        $scope.selectedPoint = $item;
        $scope.$model = $model;
        $scope.$label = $label;
    };

    $scope.getDataCol = function(object){
        var data_object = {};
        for (var property in object) {
            if ($scope.columns.hasOwnProperty(property)) {
                data_object[property] = object[property];
            }
        }
        return data_object;
    };


    $scope.toggleDropdown = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopenx = !$scope.status.isopenx;
        $scope.status.isopeny = !$scope.status.isopeny;
        $scope.status.isopenpeer = !$scope.status.isopenpeer;
    };

    $scope.addToPeer = function () {
        $scope.closeAlert($scope.alerts.length - 1);
        $scope.addAlert('Added ' + $scope.selectedPoint.instnm + ' to custom');
        $scope.params.peers[3].d.push($scope.selectedPoint.instnm);
        $scope.loadPeer($scope.params.peers[3].d);
        $scope.params.usePeers = true;
    };

    $scope.selectedPeers = function (input) {
        var output = [];
        output = input.filter(function (d) {
            return $scope.params.customPeer.indexOf(d.instnm) > -1;
        });
        return output;
    };


    $scope.loadPeer = function (p) {
        $scope.params.customPeer = p;
        $scope.params.usePeers = true;

    };
    $scope.resetPeer = function () {
        $scope.closeAlert($scope.alerts.length - 1);
        $scope.addAlert('Custom group reset');
        $scope.params.peers[3].d = [];
        $scope.params.usePeers = false;

    };

    $scope.gotoHash = function(id) {
        $location.hash(id);
        $anchorScroll();
    };
    $scope.isCollapsed = true;

});
