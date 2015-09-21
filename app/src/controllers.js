/* global myApp */
myApp.controller('DataCtrl',
  function($scope, $http, $filter, $anchorScroll,
    $location, DataService, $modal, StorageService) {


    $scope.$filter = $filter;
    $scope.alerts = [];
    $scope.data;
    $scope.columns;
    $scope.custom = [];


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


    Promise.all([
        DataService.get(2013),
        DataService.columns(),
        DataService.peers()
    ])
    .then(function(data) {
            $scope.data = JSON.parse(data[0]);
            $scope.columns = JSON.parse(data[1]).cols;
            $scope.params.peers = JSON.parse(data[2]).peers;
            $scope.selectedPoint = $scope.data[0];
            $scope.$apply();
        });


    $scope.loadYear = function(year) {
        $scope.params.year = year;
        DataService
            .get(year)
            .then(function(data) {
                $scope.data = JSON.parse(data);
                $scope.selectedPoint = $scope.data[0];
                $scope.$apply();
            });
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
        $scope.custom.push($scope.selectedPoint.instnm);


    };

    $scope.selectedPeers = function (input) {
        var output = [];
        output = input.filter(function (d) {
            return $scope.params.customPeer.indexOf(d.instnm) > -1;
        });
        return output;
    };

    $scope.showCustom = function() {
        $scope.params.customPeer = $scope.custom;
        $scope.params.usePeers = true;
    };


    $scope.loadPeer = function (p) {
        $scope.params.customPeer = p;
        $scope.params.usePeers = true;

    };
    $scope.resetPeer = function () {
        $scope.closeAlert($scope.alerts.length - 1);
        $scope.addAlert('Custom group reset');
        $scope.custom = [];

    };

    $scope.gotoHash = function(id) {
        $location.hash(id);
        $anchorScroll();
    };
    $scope.isCollapsed = true;
    $scope.animationsEnabled = true;

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: './templates/myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.custom;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        });
    };

    $scope.open2 = function (size) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: './templates/loadSavedPeerModal.html',
            controller: 'ModalLoadCtrl',
            size: size,
            resolve: {
                items: function () {
                    return StorageService.load();
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.custom = selectedItem;
        });
    };

});

myApp.controller('ModalInstanceCtrl', function(
      $scope, $modalInstance, items, StorageService) {

    $scope.items = items;
    $scope.name = 'custom';


    $scope.save = function() {
        StorageService.update({name: $scope.name, data: $scope.items});
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

myApp.controller('ModalLoadCtrl', function(
      $scope, $modalInstance, items) {

    $scope.items = items;


    $scope.set = function(d) {
        $modalInstance.close(d);
        $modalInstance.dismiss('cancel');
    };


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
