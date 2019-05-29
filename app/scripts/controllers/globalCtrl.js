'use strict';
var globalCtrl = function($scope, $locale, $sce, walletService, $translate) {
    // Check the environment
    $scope.isApp =  globalFuncs.isApp();
    globalFuncs.hideLoadingWaiting();  
    $scope.trans_message = $translate.instant("GP_Wait_tran");
    $scope.validateStatus='';
    
	$scope.confRateEPop = new Modal(document.getElementById('confRateE'));
	$scope.confRateAPop = new Modal(document.getElementById('confRateA'));
	$scope.confRateFPop = new Modal(document.getElementById('confRateF'));
	$scope.confMeltPop = new Modal(document.getElementById('confMelt'));
    
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
        globalFuncs.getAccInfo(globalFuncs.slockitIsOwner, $scope.wallet.getAddressString(), function(status){
                $scope.is_owner = status==1;
                $scope.owner_account=$scope.wallet.getAddressString();
                $scope.load(); 
        }); 
    }
    
    $scope.load = function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        
        $scope.CUR_nanti=globalFuncs.currencies.CUR_nanti;
        // TO DO replace by the 3 rate
        globalFuncs.getAccInfo(globalFuncs.slockitTaxAmount, $scope.wallet.getAddressString(), function(amount){
          globalFuncs.getAccInfo(globalFuncs.slockitTaxLegAmount, $scope.wallet.getAddressString(), function(amountLeg){
           globalFuncs.getGlobInfo(globalFuncs.slockitTaxAccount, function(acc){
                globalFuncs.getAccInfo(globalFuncs.slockitGetTotalAmount, $scope.wallet.getAddressString(), function(tot){

                   $scope.total_amount = tot/100.0;
                   $scope.transfert_employe = 50;
                   $scope.transfert_asso = 25;
                   $scope.fonte = 0;

                   globalFuncs.hideLoadingWaiting();  
                 });
           });
        });
        });
    }
     
    
    $scope.updateRateE = function(){
        $scope.new_rate_E_amount =  $scope.transfert_employe;
        $scope.confRateEPop.open();
    }
    
    $scope.confirmRateE = function(){
         $scope.confRateEPop.close();
         /*globalFuncs.SetTaxAmount($scope.wallet, $scope.new_tax_amount, function(res){
            if (res.isError){
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("GLB_Tax_amount_not_updated")));
            } else {
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("GLB_Tax_amount_updated")));
                $scope.trans_message = $translate.instant("GLB_Tax_amount_updated");
                $scope.waitTransaction(res.data); 
            }
         }); */  
    }
    
    $scope.updateRateA = function(){
        $scope.new_rate_A_amount =  $scope.transfert_asso;
        $scope.confRateAPop.open();
    }
    
    $scope.confirmRateA = function(){
         $scope.confRateAPop.close();
         /*globalFuncs.SetTaxAmount($scope.wallet, $scope.new_tax_amount, function(res){
            if (res.isError){
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("GLB_Tax_amount_not_updated")));
            } else {
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("GLB_Tax_amount_updated")));
                $scope.trans_message = $translate.instant("GLB_Tax_amount_updated");
                $scope.waitTransaction(res.data); 
            }
         }); */  
    }
    
    $scope.updateRateF = function(){
        $scope.new_rate_F_amount =  $scope.fonte;
        $scope.confRateFPop.open();
    }
    
    $scope.confirmRateF = function(){
         $scope.confRateFPop.close();
         /*globalFuncs.SetTaxAmount($scope.wallet, $scope.new_tax_amount, function(res){
            if (res.isError){
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("GLB_Tax_amount_not_updated")));
            } else {
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("GLB_Tax_amount_updated")));
                $scope.trans_message = $translate.instant("GLB_Tax_amount_updated");
                $scope.waitTransaction(res.data); 
            }
         }); */  
    }
    
  
    
    
     $scope.updateRateE = function(){
        $scope.new_rate_E_amount =  $scope.transfert_employe;
        $scope.confRateEPop.open();
    }
    
    $scope.confirmRateE = function(){
         $scope.confRateEPop.close();
         /*globalFuncs.SetTaxAmount($scope.wallet, $scope.new_tax_amount, function(res){
            if (res.isError){
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("GLB_Tax_amount_not_updated")));
            } else {
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("GLB_Tax_amount_updated")));
                $scope.trans_message = $translate.instant("GLB_Tax_amount_updated");
                $scope.waitTransaction(res.data); 
            }
         }); */  
    }
    
    $scope.melt = function(){
        $scope.confMeltPop.open();
    }
    
    $scope.doMelt = function(){
        $scope.confMeltPop.close();
        /*globalFuncs.SetTaxAmount($scope.wallet, $scope.new_tax_amount, function(res){
            if (res.isError){
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("GLB_Tax_amount_not_updated")));
            } else {
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("GLB_Tax_amount_updated")));
                $scope.trans_message = $translate.instant("GLB_Tax_amount_updated");
                $scope.waitTransaction(res.data); 
            }
         }); */  
    }
    
    
    
    $scope.updateOwnAcc = function(){
        $scope.new_owner_account = $scope.owner_account;
        $scope.confOwnerAccountPop.open();
    }
    
     $scope.confirmOwnerAccount = function(){
        globalFuncs.SetOwnerAccount($scope.wallet, $scope.new_owner_account, function(res){
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
              if (block_json.blockNumber && block_json.blockNumber.startsWith('0x')){
                 $scope.recievedTransaction();
              }
          });
      },5000);  
  }  
  
  
  
    $scope.helloToAddressOwn = function(text){
      $scope.new_owner_account=text;
      $scope.$apply();
    }
    
    
  
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


