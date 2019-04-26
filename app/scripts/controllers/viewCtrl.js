'use strict';
var viewCtrl = function($scope, globalService, $translate) {
	$scope.globalService = globalService;
    $scope.isApp = globalFuncs.isApp();
};
module.exports = viewCtrl;
