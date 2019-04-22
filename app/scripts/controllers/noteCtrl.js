'use strict';
var noteCtrl = function($scope, $locale, $sce, walletService, $translate) {
    // Check the environment
    $scope.isApp =  globalFuncs.isApp();
    $scope.currentWalletAddress=globalFuncs.getWalletAddress();
    $scope.CUR='';
    $scope.CUR_nanti='';
    $scope.CUR_credit_mut='';
    $scope.has_nant=false;
    
    
    $scope.$watch(function() {
		    if (walletService.wallet == null) return null;

		    return walletService.wallet.getAddressString();
	    }, function() {
		    if (walletService.wallet == null) return;
		    $scope.wallet = walletService.wallet;
            globalFuncs.getAccInfo(globalFuncs.slockitAccType, $scope.wallet.getAddressString(), function(type){
              
               globalFuncs.getAccInfo(globalFuncs.slockitAccStatus, $scope.wallet.getAddressString(), function(status){
                    $scope.is_admin = type==2 && status==1;
               });
            });
            
            $scope.CUR=globalFuncs.currencies.CUR;
            $scope.CUR_nanti=globalFuncs.currencies.CUR_nanti;
            $scope.CUR_credit_mut=globalFuncs.currencies.CUR_credit_mut;
            
            $scope.has_nant=globalFuncs.hasNant();
            
            globalFuncs.hideLoadingWaiting();  
        });
    
  
   
}
module.exports = noteCtrl;
