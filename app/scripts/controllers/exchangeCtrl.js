'use strict';
var exchangeCtrl = function($scope, $locale, $sce, walletService,messageService, $translate) {
    // Check the environment
    $scope.isApp =  jsc3l_customization.isApp();
    $scope.currentWalletAddress=globalFuncs.getWalletAddress();
    $scope.blobEnc = globalFuncs.getBlob("text/json;charset=UTF-8", localStorage.getItem('ComChainWallet'));
    
	$scope.confCreditPop = new Modal(document.getElementById('confCredit'));
	$scope.updatePop = new Modal(document.getElementById('update'));
   
    // Controler variables 
    $scope.qr_address = "/bureau/leman-admin";
    $scope.pop_message='';
    globalFuncs.hideLoadingWaiting(); 
    $scope.valid_acc = false;
    $scope.trans_message = $translate.instant("GP_Wait_tran");
    
    $scope.is_curr_locked=false;
    
    $scope.is_lock=1;
    $scope.lock_status = "";
    $scope.lock_button = "";
    $scope.balance = $translate.instant("TRAN_Wait");
    $scope.balanceEL = $translate.instant("TRAN_Wait");
    $scope.balanceCM = $translate.instant("TRAN_Wait");
    $scope.limitCMm = $translate.instant("TRAN_Wait");
    $scope.limitCMp = $translate.instant("TRAN_Wait");
    $scope.pop_acc_type=0;
    $scope.CUR='';
    $scope.CUR_nanti='';
    $scope.CUR_credit_mut='';
    $scope.has_nant=false;
    $scope.has_credit_mut=false;
    
    $scope.AccountType = function () {
        this.tp = 0;
        this.tp_name = "";
        this.can_admin = false;
        this.is_person = true;
        this.is_legal = false;
        this.is_admin = false;
    }
    
    $scope.acc_type_obj = new $scope.AccountType();
    $scope.acc_type=0;
    $scope.acc_type_obj.setType = function (type_val) {
       this.tp=type_val;
       $scope.acc_typ=type_val;
       this.is_admin = type_val==2;
       this.is_legal= type_val==1;
       this.is_person= type_val==0;
        if (type_val==0){
           this.tp_name = $translate.instant("EXC_Account_Type_physical");
        } else if (type_val==1){
           this.tp_name = $translate.instant("EXC_Account_Type_legal");
        } else if (type_val==2){
           this.tp_name = $translate.instant("EXC_Account_Type_admin");
        } 
    };
    
    
    $scope.setBalance = function() {
        jsc3l_bcRead.getGlobalBalance($scope.selected_account, function(value){$scope.balance = value;});
        jsc3l_bcRead.getNantBalance($scope.selected_account, function(value){$scope.balanceEL = value;});
        jsc3l_bcRead.getCmBalance($scope.selected_account, function(value){$scope.balanceCM = value;});
        jsc3l_bcRead.getAccountType($scope.selected_account, function(value){ $scope.acc_type_obj.setType(value);});
        jsc3l_bcRead.getAccountStatus($scope.selected_account, function(value){
                                                                                                         if (value==1){
                                                                                                            $scope.lock_status = $translate.instant("EXC_Unlocked");
                                                                                                            $scope.lock_button = $translate.instant("EXC_Lock");
                                                                                                            $scope.is_lock = false;
                                                                                                         } else {
                                                                                                            $scope.lock_status = $translate.instant("EXC_Locked");
                                                                                                            $scope.lock_button = $translate.instant("EXC_Unlock");
                                                                                                            $scope.is_lock = true;
                                                                                                         }
                                                                                                     });
        jsc3l_bcRead.getCmLimitBelow($scope.selected_account, function(value){$scope.limitCMm = value;});
        jsc3l_bcRead.getCmLimitAbove($scope.selected_account, function(value){$scope.limitCMp = value; globalFuncs.hideLoadingWaiting(); });
        messageService.getMessageKey($scope.selected_account, false, function(keys) {
                              $scope.to_message_key = keys.public_message_key;
                              if ( $scope.to_message_key === undefined) {
                                $scope.to_message_key = "";
                              }  
                           });
        
	}
    
    $scope.refresh = function() {
         globalFuncs.showLoading($translate.instant("GP_Wait"));
         $scope.acc_message ="";
         $scope.setBalance();
    }
    
    $scope.is_admin=false;
    
    $scope.$watch(function() {
		    if (walletService.wallet == null) return null;

		    return walletService.wallet.getAddressString();
	    }, function() {
		    if (walletService.wallet == null) return;
		    $scope.wallet = walletService.wallet;
            jsc3l_bcRead.getAccountType($scope.wallet.getAddressString(), function(type){
              
               jsc3l_bcRead.getAccountStatus($scope.wallet.getAddressString(), function(status){
                    $scope.is_admin = type==2 && status==1;
               });
            });
            
            $scope.CUR=globalFuncs.currencies.CUR;
            $scope.CUR_nanti=globalFuncs.currencies.CUR_nanti;
            $scope.CUR_credit_mut=globalFuncs.currencies.CUR_credit_mut;
            
            $scope.has_nant=jsc3l_customization.hasNant();
            $scope.has_credit_mut=jsc3l_customization.hasCM();
            
            jsc3l_bcRead.getContractStatus(function(status){
                    $scope.is_curr_locked = status==0;
            });
        });
    
      
    $scope.helloToAddress = function(text){
      var add_obj = globalFuncs.parseAddress(text); 
      if (add_obj.address){
           $scope.selected_account=add_obj.address;
           $scope.checkSelectedAccount();
      } else {
          alert($translate.instant("EXC_unknow_address"));
      }
     
      $scope.$apply();
    }
    
    $scope.startScanToAddress = function(){
        cordova.plugins.barcodeScanner.scan(
		function (result) {
			$scope.helloToAddress(result.text);
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}, {'SCAN_MODE': 'QR_CODE_MODE'}
	    );
    };
    
    $scope.checkSelectedAccount = function(){
        if ($scope.selected_account.length==42){
            globalFuncs.showLoading($translate.instant("GP_Wait"));
            $scope.acc_message ="";
           
            $scope.valid_acc = true;
           
            $scope.credit_amount=null;
            $scope.setBalance();
            
        } else{
             $scope.acc_message = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("EXC_unknow_address"))); 
             $scope.valid_acc = false;
        } 
    }
    
    
    
    
    $scope.updateAccount  = function(){
      $scope.pop_message="";
      
      $scope.pop_limitCMp=$scope.limitCMp;
      document.getElementById('limitP').value = $scope.limitCMp;
      
      $scope.pop_limitCMm=$scope.limitCMm;
      document.getElementById('limitM').value = $scope.limitCMm;
      
      $scope.pop_is_lock=$scope.is_lock;
      document.getElementById('cb_lock').checked=$scope.is_lock;
      document.getElementById('cb_unlock').checked=!$scope.is_lock;
      
      $scope.pop_acc_type=$scope.acc_type_obj.tp;
      document.getElementById('cb_pers').checked=$scope.acc_type_obj.is_person;  
      document.getElementById('cb_legal').checked=$scope.acc_type_obj.is_legal;  
      document.getElementById('cb_admin').checked=$scope.acc_type_obj.is_admin;

      $scope.acc_type_obj.can_admin = false;
      if ( ($scope.balanceEL==0 && $scope.balanceCM==0) ||  $scope.acc_type_obj.is_admin){
            $scope.acc_type_obj.can_admin = true;
      } 
      
      document.getElementById('limitM').readOnly = !$scope.acc_type_obj.is_legal;
     
      $scope.updatePop.open();
    }
    
    $scope.typeChanged = function(){
        var min_enabled = $scope.pop_acc_type==1;
        document.getElementById('limitM').readOnly = !min_enabled;
        if (!min_enabled){
            $scope.pop_limitCMm=0;
            document.getElementById('limitM').value = 0;
        }
        
    }
    
    $scope.confirmUpdate = function(){
       $scope.pop_message=''; 
       // check that the CM balance is compatible with the new type
       if ($scope.pop_acc_type==1 && $scope.balanceCM<0){
            $scope.pop_message=$sce.trustAsHtml(globalFuncs.getWarningText($translate.instant("EXC_New_type_not_compatible_with_bal"))); 
            return;
       } 
       
        $scope.pop_limitCMm = document.getElementById('limitM').value;
        $scope.pop_limitCMp = document.getElementById('limitP').value;
       
       // check that the CM limit is compatible with the balance 
       if (parseFloat($scope.pop_limitCMp)<parseFloat($scope.balanceCM) || parseFloat($scope.pop_limitCMm)>parseFloat($scope.balanceCM)){
           $scope.pop_message=$sce.trustAsHtml(globalFuncs.getWarningText($translate.instant("EXC_lim_not_compatible_with_bal"))); 
           return;
       }
        
       // prepare values:
        var status=1;
        if ($scope.pop_is_lock){
            status=0;
        }
        
        if ($scope.pop_acc_type==0){
             $scope.pop_limitCMm =0;
        }
        
        if ($scope.pop_acc_type==2 || !$scope.has_credit_mut){
             $scope.pop_limitCMp =0;
             $scope.pop_limitCMm =0;
        }
        
        jsc3l_bcTransaction.SetAccountParam($scope.wallet, 
                                    $scope.selected_account, 
                                    status, 
                                    $scope.pop_acc_type,  
                                    $scope.pop_limitCMm,  
                                    $scope.pop_limitCMp, 
                                    function(data){
                                         if (data.isError){
                                            $scope.acc_message = $sce.trustAsHtml(globalFuncs.getDangerText(data.error));
                                            $scope.pop_message = $scope.acc_message;
                                         } else {

                                            $scope.acc_message = $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("EXC_Account_updated")));
                                            $scope.trans_message = $translate.instant("EXC_Account_updated");
                                            $scope.updatePop.close();
                                            $scope.waitTransaction(data.data); 

                                           
                                         }
                                    });
        
    }
    
   
   $scope.creditAccount = function(){
       if ($scope.credit_amount>0){
           
        $scope.message_to = "";
        $scope.confCreditPop.open();
       }
   }
      
   $scope.confirmCreditAccount = function(){
       
        var data= {};

        if ($scope.to_message_key.length>0 && $scope.message_to.length>0) {
            data['memo_to']= messageService.cipherMessage($scope.to_message_key.substring(2), $scope.message_to);
        }
       
       jsc3l_bcTransaction.PledgeAccount($scope.wallet, $scope.selected_account, $scope.credit_amount, data, function(rawTx){
             if (rawTx.isError){
                 $scope.acc_message = $sce.trustAsHtml(globalFuncs.getDangerText(rawTx.error));
             } else {
                 $scope.acc_message = $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("EXC_Account_credited_with")+$scope.credit_amount+globalFuncs.currencies.CUR));
                 $scope.trans_message = $translate.instant("EXC_Account_credited_with")+$scope.credit_amount+globalFuncs.currencies.CUR;
                 $scope.waitTransaction(rawTx.data); 
             }
             jsc3l_bcRead.getGlobalBalance($scope.selected_account, function(value){
                  $scope.balance = value;
                  jsc3l_bcRead.getCmBalance($scope.selected_account, function(value){
                      $scope.balanceEL = value;
                      $scope.credit_amount=null;
                      $scope.confCreditPop.close();
                      
                  });
              });
        
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
              //}
          });
      },5000);  
  }  

};
module.exports = exchangeCtrl;


