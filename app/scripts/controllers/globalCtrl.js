'use strict';
var globalCtrl = function($scope, $locale, $sce, walletService, $translate) {
    // Check the environment
    $scope.isApp =  jsc3l_customization.isApp();
    globalFuncs.hideLoadingWaiting();  
    $scope.trans_message = $translate.instant("GP_Wait_tran");
    $scope.validateStatus='';
	$scope.confRateEPop = new Modal(document.getElementById('confRateE'));
	$scope.confRateAPop = new Modal(document.getElementById('confRateA'));
	$scope.confRateFPop = new Modal(document.getElementById('confRateF'));
	$scope.confMeltPop = new Modal(document.getElementById('confMelt'));
	$scope.confOwnerAccountPop = new Modal(document.getElementById('confOwnerAccount'));
	$scope.confStatusPopup = new Modal(document.getElementById('confStatus'));
   

    $scope.is_owner=false;
    $scope.is_curr_locked=false;
    
    
    


  /****************** Coeur Specific ********************/
  
 $scope.AddCoeurGetRateA = "0x2d7811fa"; 
 $scope.AddCoeurGetRateE = "0x9a0d87b6"; 
 $scope.AddCoeurGetRateF = "0xb9d22929"; 
 
 $scope.AddCoeurSetRateA = "0xad2b5716"; 
 $scope.AddCoeurSetRateE = "0x49ca1ed2"; 
 $scope.AddCoeurSetRateF = "0x735f79fc"; 
 
 $scope.AddCoeurMelt = "0x5220f510"; 
 
 $scope.CoeurSetRateA = function(wallet, rate, callback){
     var rate_encoded = globalFuncs.encodeNumber(parseInt(rate,10));
     jsc3l_bcTransaction.generateTx(jsc3l_customization.getContract1(),
                            wallet, 
                            $scope.AddCoeurSetRateA, 
                            [rate_encoded],
                            {},
                            callback);       
 }
 
  $scope.CoeurSetRateE = function(wallet, rate, callback){
     var rate_encoded = globalFuncs.encodeNumber(parseInt(rate,10));
     jsc3l_bcTransaction.generateTx(jsc3l_customization.getContract1(),
                            wallet, 
                            $scope.AddCoeurSetRateE, 
                            [rate_encoded],
                            {},
                            callback);       
 }
 
 $scope.CoeurSetRateF = function(wallet, rate, callback){
     var rate_encoded = globalFuncs.encodeNumber(parseInt(rate,10));
     jsc3l_bcTransaction.generateTx(jsc3l_customization.getContract1(),
                            wallet, 
                            $scope.AddCoeurSetRateF, 
                            [rate_encoded],
                            {},
                            callback);       
 }
 
  $scope.CoeurMelt = function(wallet, callback){
     jsc3l_bcTransaction.generateTx(jsc3l_customization.getContract1(),
                            wallet, 
                            $scope.AddCoeurMelt, 
                            [],
                            {},
                            callback);       
 }
 
  
  
  /****************** /Coeur Specific ********************/

    
    
    
    
    
    
  
    
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
        
         jsc3l_bcRead.getGlobInfo($scope.AddCoeurGetRateE, function(rateE){
          jsc3l_bcRead.getGlobInfo($scope.AddCoeurGetRateA, function(rateA){
           jsc3l_bcRead.getGlobInfo($scope.AddCoeurGetRateF, function(rateF){
            jsc3l_bcRead.getTotalAmount($scope.wallet.getAddressString(), function(tot){
               $scope.total_amount = tot/100.0;
               $scope.transfert_employe = globalFuncs.getNumber(rateE, 1.);
               $scope.transfert_asso = globalFuncs.getNumber(rateA, 1.);
               $scope.fonte = globalFuncs.getNumber(rateF, 1.);

               globalFuncs.hideLoadingWaiting();  
            });
           });
         });
        });
    }
     
    
    
    $scope.lockUnlockTransfert = function() {
        $scope.confStatusPopup.open();
    }
    
    
    $scope.confirmStatus = function() {
        jsc3l_bcTransaction.SetContractStatus($scope.wallet, $scope.is_curr_locked,function(res){
           if (res.isError){
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("GLB_status_not_updated")));
            } else {
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("GLB_status_updated")));
                
                $scope.trans_message = $translate.instant("GLB_status_updated");
                $scope.waitTransaction(res.data); 
            } 
        });
        $scope.confStatusPopup.close();
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
    
    
    
    $scope.updateRateE = function(){
        $scope.new_rate_E_amount =  $scope.transfert_employe;
        $scope.confRateEPop.open();
    }
    
    $scope.confirmRateE = function(){
         $scope.confRateEPop.close();
         globalFuncs.CoeurSetRateE($scope.wallet, $scope.new_rate_E_amount, function(res){
            if (res.isError){
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText("Echeque de la mise &agrave; jour du taux"));
            } else {
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText("Taux mis &agrave; jour."));
                $scope.trans_message = "Taux mis &agrave; jour.";
                $scope.waitTransaction(res.data); 
            }
         }); 
    }
    
    $scope.updateRateA = function(){
        $scope.new_rate_A_amount =  $scope.transfert_asso;
        $scope.confRateAPop.open();
    }
    
    $scope.confirmRateA = function(){
         $scope.confRateAPop.close();
         globalFuncs.CoeurSetRateA($scope.wallet, $scope.new_rate_A_amount, function(res){
             if (res.isError){
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText("Echeque de la mise &agrave; jour du taux"));
            } else {
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText("Taux mis &agrave; jour."));
                $scope.trans_message = "Taux mis &agrave; jour.";
                $scope.waitTransaction(res.data); 
            }
         }); 
    }
    
    $scope.updateRateF = function(){
        $scope.new_rate_F_amount =  $scope.fonte;
        $scope.confRateFPop.open();
    }
    
    $scope.confirmRateF = function(){
         $scope.confRateFPop.close();
         globalFuncs.CoeurSetRateF($scope.wallet, $scope.new_rate_F_amount, function(res){
            if (res.isError){
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText("Echeque de la mise &agrave; jour du taux"));
            } else {
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText("Taux mis &agrave; jour."));
                $scope.trans_message = "Taux mis &agrave; jour.";
                $scope.waitTransaction(res.data); 
            }
         }); 
    }
    
  
    $scope.melt = function(){
        $scope.confMeltPop.open();
    }
    
    $scope.doMelt = function(){
        $scope.confMeltPop.close();
        globalFuncs.CoeurMelt($scope.wallet, function(res){
            if (res.isError){
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getDangerText("La Fonte a &eacute;chou&eacute;"));
            } else {
                $scope.validateStatus= $sce.trustAsHtml(globalFuncs.getSuccessText("La fonte est d&eacute;clanch&eacute;e"));
                $scope.trans_message = "La fonte est d&eacute;clanch&eacute;e";
                $scope.waitTransaction(res.data); 
            }
         }); 
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


