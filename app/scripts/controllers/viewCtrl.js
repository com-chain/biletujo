'use strict';
var viewCtrl = function($scope, globalService, $translate) {
	$scope.globalService = globalService;
    $scope.isApp = jsc3l_customization.isApp();
};
module.exports = viewCtrl;
