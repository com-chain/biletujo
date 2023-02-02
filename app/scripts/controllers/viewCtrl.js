'use strict';
var viewCtrl = function($scope, globalService, $translate) {
	$scope.globalService = globalService;
    $scope.isApp = isApp();
};
module.exports = viewCtrl;
