'use strict';
var exchangeCtrl = function($scope, $locale, $sce, walletService, $translate) {
    // Check the environment
    $scope.isApp =  jsc3l.customization.isApp();
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
    
    
    $scope.setBalance = async function() {
        $scope.balance = await jsc3l.bcRead.getGlobalBalance($scope.selected_account);
        $scope.balanceEL = await jsc3l.bcRead.getNantBalance($scope.selected_account);
        $scope.balanceCM = await jsc3l.bcRead.getCmBalance($scope.selected_account);
        $scope.acc_type_obj.setType(await jsc3l.bcRead.getAccountType($scope.selected_account));
        const account_status = await jsc3l.bcRead.getAccountStatus($scope.selected_account);
        if (account_status==1){
            $scope.lock_status = $translate.instant("EXC_Unlocked");
            $scope.lock_button = $translate.instant("EXC_Lock");
            $scope.is_lock = false;
        } else {
            $scope.lock_status = $translate.instant("EXC_Locked");
            $scope.lock_button = $translate.instant("EXC_Unlock");
            $scope.is_lock = true;
        }
        $scope.limitCMm = await jsc3l.bcRead.getCmLimitBelow($scope.selected_account);
        $scope.limitCMp = await jsc3l.bcRead.getCmLimitAbove($scope.selected_account);
        const keys = await jsc3l.message.getMessageKey($scope.selected_account, false);
        globalFuncs.hideLoadingWaiting();
        $scope.to_message_key = keys.public_message_key;
        if ( $scope.to_message_key === undefined) {
            $scope.to_message_key = "";
        }  
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
	    }, async function() {
		    if (walletService.wallet == null) return;
		    $scope.wallet = walletService.wallet;
            const type = await jsc3l.bcRead.getAccountType($scope.wallet.getAddressString());
            const status = await jsc3l.bcRead.getAccountStatus($scope.wallet.getAddressString());
            $scope.is_admin = type==2 && status==1;
      
            
            $scope.CUR=globalFuncs.currencies.CUR;
            $scope.CUR_nanti=globalFuncs.currencies.CUR_nanti;
            $scope.CUR_credit_mut=globalFuncs.currencies.CUR_credit_mut;
            
            $scope.has_nant=jsc3l.customization.hasNant();
            $scope.has_credit_mut=jsc3l.customization.hasCM();
            
            const curr_astatus = await jsc3l.bcRead.getContractStatus();
            $scope.is_curr_locked = curr_astatus==0;
         
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
    
    $scope.confirmUpdate = async function(){
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
        
        const data = await jsc3l.bcTransaction.SetAccountParam($scope.wallet, 
                                    $scope.selected_account, 
                                    status, 
                                    $scope.pop_acc_type,  
                                    $scope.pop_limitCMm,  
                                    $scope.pop_limitCMp); 
        if (data.isError){
            $scope.acc_message = $sce.trustAsHtml(globalFuncs.getDangerText(data.error));
            $scope.pop_message = $scope.acc_message;
        } else {
            $scope.acc_message = $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("EXC_Account_updated")));
            $scope.trans_message = $translate.instant("EXC_Account_updated");
            $scope.updatePop.close();
            $scope.waitTransaction(data.data); 
        }
        
    }
    
   
   $scope.creditAccount = function(){
       if ($scope.credit_amount>0){
           
        $scope.message_to = "";
        $scope.confCreditPop.open();
       }
   }
      
   $scope.confirmCreditAccount = async function(){
     var data = jsc3l.message.getTxMemoCipheredData(
       null, $scope.to_message_key,
       null, $scope.message_to);

        const rawTx = await jsc3l.bcTransaction.PledgeAccount($scope.wallet, $scope.selected_account, $scope.credit_amount, data);

        if (rawTx.isError){
            $scope.acc_message = $sce.trustAsHtml(globalFuncs.getDangerText(rawTx.error));
        } else {
            $scope.acc_message = $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("EXC_Account_credited_with")+$scope.credit_amount+globalFuncs.currencies.CUR));
            $scope.trans_message = $translate.instant("EXC_Account_credited_with")+$scope.credit_amount+globalFuncs.currencies.CUR;
            $scope.waitTransaction(rawTx.data); 
        }
        
        $scope.balance = await jsc3l.bcRead.getGlobalBalance($scope.selected_account);
        $scope.balanceEL = await jsc3l.bcRead.getCmBalance($scope.selected_account);
        $scope.credit_amount=null;
        $scope.confCreditPop.close();

              
        
     
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
              //}
      },5000);  
  }  

};
module.exports = exchangeCtrl;


