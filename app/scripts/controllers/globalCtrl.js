'use strict';
var globalCtrl = function($scope, $locale, $sce, walletService, $translate) {
    // Check the environment
    $scope.isApp =  jsc3l_customization.isApp();
    globalFuncs.hideLoadingWaiting();  
    $scope.trans_message = $translate.instant("GP_Wait_tran");
    $scope.validateStatus='';
	$scope.confTaxPop = new Modal(document.getElementById('confTax'));
	$scope.confTaxLegPop = new Modal(document.getElementById('confTaxLeg'));
	$scope.confTaxAccountPop = new Modal(document.getElementById('confTaxAccount'));
	$scope.confOwnerAccountPop = new Modal(document.getElementById('confOwnerAccount'));
   

    $scope.is_owner=false;
    
  
    
    $scope.$watch(function() {
		    if (walletService.wallet == null) return null;

		    return walletService.wallet.getAddressString();
	    }, function() {
		    if (walletService.wallet == null) return;
		    $scope.wallet = walletService.wallet;
            $scope.refresh();
    });
    
    $scope.refresh = function(){
        $scope.validateStatus='';
        jsc3l_bcRead.getIsOwner($scope.wallet.getAddressString(), function(status){
                $scope.is_owner = status==1;
                $scope.owner_account=$scope.wallet.getAddressString();
                $scope.load(); 
        }); 
    }
    
    $scope.load = function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        
        $scope.CUR_nanti=globalFuncs.currencies.CUR_nanti;
        
        jsc3l_bcRead.getTaxAmount($scope.wallet.getAddressString(), function(amount){
          jsc3l_bcRead.getLegTaxAmount($scope.wallet.getAddressString(), function(amountLeg){
            jsc3l_bcRead.getTaxAccount(function(acc){
                jsc3l_bcRead.getTotalAmount($scope.wallet.getAddressString(), function(tot){
                   $scope.taxes_amount = amount;
                   $scope.taxes_amount_leg = amountLeg;
                   $scope.total_amount = tot/100.0;

                   $scope.tax_account = '0x'+acc.substring(26, 67);
                   globalFuncs.hideLoadingWaiting();  
                 });
           });
        });
        });
    }
     
    
    $scope.updateTax = function(){
        $scope.new_tax_amount =  $scope.taxes_amount;
        $scope.confTaxPop.open();
    }
    
    $scope.confirmTax = function(){
         $scope.confTaxPop.close();
         jsc3l_bcTransaction.SetTaxAmount($scope.wallet, $scope.new_tax_amount, function(res){
            if (res.isError){
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("GLB_Tax_amount_not_updated")));
            } else {
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("GLB_Tax_amount_updated")));
                $scope.trans_message = $translate.instant("GLB_Tax_amount_updated");
                $scope.waitTransaction(res.data); 
            }
         });   
    }
    
    $scope.updateTaxLeg = function(){
        $scope.new_tax_amount_leg =  $scope.taxes_amount_leg;
        $scope.confTaxLegPop.open();
    }
    
    $scope.confirmTaxLeg = function(){
         $scope.confTaxLegPop.close();
         jsc3l_bcTransaction.SetTaxLegAmount($scope.wallet, $scope.new_tax_amount_leg, function(res){
            if (res.isError){
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("GLB_Tax_amount_not_updated")));
            } else {
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("GLB_Tax_amount_updated")));
                $scope.trans_message = $translate.instant("GLB_Tax_amount_updated");
                $scope.waitTransaction(res.data); 
            }
         });   
    }
    
    
    $scope.updateTaxAcc = function(){
        $scope.new_tax_account =  $scope.tax_account;
        $scope.confTaxAccountPop.open();
    }
    
    $scope.confirmTaxAccount = function(){
        jsc3l_bcTransaction.SetTaxAccount($scope.wallet, $scope.new_tax_account, function(res){
           if (res.isError){
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("GLB_Tax_account_not_updated")));
            } else {
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("GLB_Tax_account_updated")));
                $scope.trans_message = $translate.instant("GLB_Tax_account_updated");
                $scope.waitTransaction(res.data); 
            } 
        });
        $scope.confTaxAccountPop.close();
    }
    
    $scope.updateOwnAcc = function(){
        $scope.new_owner_account = $scope.owner_account;
        $scope.confOwnerAccountPop.open();
    }
    
     $scope.confirmOwnerAccount = function(){
        jsc3l_bcTransaction.SetOwnerAccount($scope.wallet, $scope.new_owner_account, function(res){
           if (res.isError){
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("GLB_Owner_account_not_updated")));
            } else {
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("GLB_Owner_account_updated")));
                
                $scope.trans_message = $translate.instant("GLB_Owner_account_updated");
                $scope.waitTransaction(res.data); 
            } 
        });
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
      
      $scope.interval_id = setInterval(function(){
          ajaxReq.getBlock(transaction_ash, function(block_json){
               // CHANGE BEHAVIOR: HIDE DIRECTLY THE WEELS
              //if (block_json.blockNumber && block_json.blockNumber.startsWith('0x')){
                 $scope.recievedTransaction();
             // }
          });
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


