'use strict';
var globalCtrl = function($scope, $locale, $sce, walletService, $translate) {
    // Check the environment
    $scope.isApp =  isApp();
    globalFuncs.hideLoadingWaiting();  
    $scope.trans_message = $translate.instant("GP_Wait_tran");
    $scope.validateStatus='';
	$scope.confTaxPop = new Modal(document.getElementById('confTax'));
	$scope.confTaxLegPop = new Modal(document.getElementById('confTaxLeg'));
	$scope.confTaxAccountPop = new Modal(document.getElementById('confTaxAccount'));
	$scope.confOwnerAccountPop = new Modal(document.getElementById('confOwnerAccount'));
	$scope.confStatusPopup = new Modal(document.getElementById('confStatus'));
   

    $scope.is_owner=false;
    $scope.is_curr_locked=false;
    
  
    
    $scope.$watch(function() {
		    if (walletService.wallet == null) return null;

		    return walletService.wallet.getAddressString();
	    }, function() {
		    if (walletService.wallet == null) return;
		    $scope.wallet = walletService.wallet;
            $scope.refresh();
    });
    
    $scope.refresh = async function(){
        $scope.validateStatus='';
        const status = await jsc3l.bcRead.getIsOwner($scope.wallet.getAddressString());
        $scope.is_owner = status==1;
        $scope.owner_account=$scope.wallet.getAddressString();
        await $scope.load(); 
        $scope.$apply();
    }
    
    $scope.load = async function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));

        $scope.CUR_nanti=globalFuncs.currencies.CUR_nanti;

        $scope.taxes_amount = await jsc3l.bcRead.getTaxAmount($scope.wallet.getAddressString());
        $scope.taxes_amount_leg = await jsc3l.bcRead.getLegTaxAmount($scope.wallet.getAddressString());
        const acc = await jsc3l.bcRead.getTaxAccount();
        $scope.tax_account = '0x'+acc.substring(26, 67);
        const tot = await jsc3l.bcRead.getTotalAmount($scope.wallet.getAddressString());
        $scope.total_amount = tot/100.0;
        const curr_status = await jsc3l.bcRead.getContractStatus();
        $scope.is_curr_locked = curr_status==0;
        globalFuncs.hideLoadingWaiting();         
    }
     
    
    $scope.updateTax = function(){
        $scope.new_tax_amount =  $scope.taxes_amount;
        $scope.confTaxPop.open();
    }
    
    $scope.confirmTax = async function(){
        $scope.confTaxPop.close();
        const res = await jsc3l.bcTransaction.setTaxAmount($scope.wallet, $scope.new_tax_amount);
        if (res.isError){
            $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("GLB_Tax_amount_not_updated")));
        } else {
            $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("GLB_Tax_amount_updated")));
            $scope.trans_message = $translate.instant("GLB_Tax_amount_updated");
            $scope.waitTransaction(res.data); 
        } 
    }
    
    $scope.updateTaxLeg = function(){
        $scope.new_tax_amount_leg =  $scope.taxes_amount_leg;
        $scope.confTaxLegPop.open();
    }
    
    $scope.confirmTaxLeg = async function(){
        $scope.confTaxLegPop.close();
        const res = await jsc3l.bcTransaction.setTaxLegAmount($scope.wallet, $scope.new_tax_amount_leg);
        if (res.isError){
            $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("GLB_Tax_amount_not_updated")));
        } else {
            $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("GLB_Tax_amount_updated")));
            $scope.trans_message = $translate.instant("GLB_Tax_amount_updated");
            $scope.waitTransaction(res.data); 
        }
    }
    
    
    $scope.updateTaxAcc = function(){
        $scope.new_tax_account =  $scope.tax_account;
        $scope.confTaxAccountPop.open();
    }
    
    $scope.confirmTaxAccount = async function(){
        const res = await jsc3l.bcTransaction.setTaxAccount($scope.wallet, $scope.new_tax_account);
        if (res.isError){
            $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("GLB_Tax_account_not_updated")));
        } else {
            $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("GLB_Tax_account_updated")));
            $scope.trans_message = $translate.instant("GLB_Tax_account_updated");
            $scope.waitTransaction(res.data); 
        } 
        $scope.confTaxAccountPop.close();
    }
    
    $scope.lockUnlockTransfert = function() {
        $scope.confStatusPopup.open();
    }
    
    
    $scope.confirmStatus = async function() {
       const res = await jsc3l.bcTransaction.setContractStatus($scope.wallet, $scope.is_curr_locked);
       if (res.isError){
            $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("GLB_status_not_updated")));
       } else {
            $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("GLB_status_updated")));
            
            $scope.trans_message = $translate.instant("GLB_status_updated");
            $scope.waitTransaction(res.data); 
       } 
    }
    
    
    $scope.updateOwnAcc = function(){
        $scope.new_owner_account = $scope.owner_account;
        $scope.confOwnerAccountPop.open();
    }
    
     $scope.confirmOwnerAccount = async function(){
       const res = await jsc3l.bcTransaction.setOwnerAccount($scope.wallet, $scope.new_owner_account);
       if (res.isError){
            $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("GLB_Owner_account_not_updated")));
       } else {
            $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("GLB_Owner_account_updated")));
            
            $scope.trans_message = $translate.instant("GLB_Owner_account_updated");
            $scope.waitTransaction(res.data); 
       } 
       $scope.confOwnerAccountPop.close();
        
    }
    
  $scope.interval_id=null;
  
  $scope.recievedTransaction = function(){
        clearInterval($scope.interval_id);
        $scope.refresh();
        $scope.$apply();
  }
  
   $scope.waitTransaction = function(transaction_ash){
      if ($scope.interval_id){
          clearInterval($scope.interval_id);
          $scope.interval_id=null;
      }
      
      globalFuncs.showWaiting($scope.trans_message);
      
      $scope.interval_id = setInterval(async function(){
          const block_json = await jsc3l.ajaxReq.getBlock(transaction_ash)
               // CHANGE BEHAVIOR: HIDE DIRECTLY THE WEELS
              //if (block_json.blockNumber && block_json.blockNumber.startsWith('0x')){
                 $scope.recievedTransaction();
             // }
      },5000);  
  }  
  
  
  
    $scope.helloToAddressOwn = function(text){
      $scope.new_owner_account=text;
      $scope.$apply();
    }
    
    $scope.helloToAddressTax = function(text){
      $scope.new_tax_account=text;
      $scope.$apply();
    }
    
    $scope.startScanToAddressTax = function(){
        cordova.plugins.barcodeScanner.scan(
		function (result) {
			$scope.helloToAddressTax(result.text);
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}, {'SCAN_MODE': 'QR_CODE_MODE'}
	    );
    };
  
     $scope.startScanToAddressOwn = function(){
        cordova.plugins.barcodeScanner.scan(
		function (result) {
			$scope.helloToAddressOwn(result.text);
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}, {'SCAN_MODE': 'QR_CODE_MODE'}
	    );
    };
  
  
  
  
  
   
};
module.exports = globalCtrl;


