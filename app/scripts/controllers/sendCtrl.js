'use strict';
var sendCtrl = function($scope, $locale, $sce, walletService, contactservice, globalService, $translate) {
    $locale.NUMBER_FORMATS.GROUP_SEP = "'";
    $scope.limitWithoutPass=0;
    
    // Popup
	$scope.sendTxModal = new Modal(document.getElementById('sendTransaction'));
	$scope.executedTransModal = new Modal(document.getElementById('executedTrans'));
    $scope.executingSplittedTrans = new Modal(document.getElementById('executingSplittedTrans'));
	$scope.chooseOrigineModal = new Modal(document.getElementById('chooseOrigine'));
	$scope.alrtNotSameCurrModal = new Modal(document.getElementById('alrtNotSameCurr'));
    
    $scope.pendingApprovalHelpModal = new Modal(document.getElementById('approval_help_pop'));
    $scope.pendingRequestHelpModal = new Modal(document.getElementById('pending_help_pop'));
    $scope.sendTransactionModal = new Modal(document.getElementById('acceptRequestPay'));
    $scope.rejectTransactionModal = new Modal(document.getElementById('reject_Request'));
    $scope.conf_requestModal = new Modal(document.getElementById('conf_request'));
    $scope.conf_dissModal = new Modal(document.getElementById('conf_diss'));

    
    

	$scope.showRaw = false;
    $scope.isApp =  isApp();
    $scope.display_curr_btn = false; 
    $scope.show_curr_sel = false;
    
    //globalFuncs.showLoading($translate.instant("GP_Wait"));
    globalFuncs.hideLoadingWaiting();  
    
    $scope.showContactPop=false;
    $scope.showContactPopOrigine=false;
    $scope.showDelegationPop=false;
    $scope.showMyBalance=true;
    $scope.showDelegLimit=false;
    $scope.display_deleg_limit='';
    $scope.delegation_limit = 0;
    
    $scope.elemanAmmount=0;
    $scope.lemanexAmmount=0;
    
    
    $scope.isShopTx =false;
    $scope.hasFrom = jsc3l.customization.hasPayRequest();
    $scope.shopTxInfo=null;
    $scope.reference = "";
    
    $scope.is_locked=false;
    $scope.is_curr_locked=false;
    
    $scope.contacts = [];
    $scope.lock_address_reading=false;
    $scope.mode = "fromMe";
    $scope.delegations=[];
    $scope.is_request_mode=false;
    
    $scope.myAddress='';
    $scope.CUR='';
    $scope.CUR_nanti='';
    $scope.CUR_credit_mut='';
    
    $scope.ctt_filter="";
    $scope.fingerprint=false;
 
	
	$scope.token = {
		balance: 0,
		total: 0,
		totRaised: 0
	}
    
    $scope.request_tab=0;
    $scope.pendingRequest=[];
    $scope.acceptedRequest=[];
    $scope.rejectedRequest=[];
    $scope.pendingApproval=[];
    $scope.is_locked = false;
    
  
    
    $scope.token.balance = $translate.instant("TRAN_Wait");
    $scope.trans_message = $translate.instant("GP_Wait_tran");
    
	$scope.tokenTx = {
		to: '',
		value: '',
		unit: "Lem"
	}
	$scope.$watch(function() {
		if (walletService.wallet == null) return null;
		return walletService.wallet.getAddressString();
	}, function() {
		if (walletService.wallet == null) return;
		$scope.wallet = walletService.wallet;

        contactservice.loadContacts($scope.wallet, walletService.password).then(function(contact_list) {
            $scope.contacts = contactservice.filterContactForCurr(contact_list, jsc3l.customization.getCurrencyName());
            $scope.contacts_without_me = contactservice.hideContact($scope.contacts, $scope.wallet.getAddressString());
            $scope.filtered_contacts=$scope.contacts_without_me.slice();

        });


        $scope.setOrigineAddress($scope.wallet.getAddressString());
        $scope.lockDestinationAddress(false);
        jsc3l.bcRead.getAccountStatus($scope.wallet.getAddressString()).then(function(status) {
                    $scope.is_locked = status==0;
        });

        $scope.setBalance(true);
        $scope.CUR=globalFuncs.currencies.CUR;
        $scope.CUR_nanti=globalFuncs.currencies.CUR_nanti;
        $scope.CUR_credit_mut=globalFuncs.currencies.CUR_credit_mut;
        
        globalFuncs.canUseFingerprint(function(result){
             $scope.fingerprint = result;
        });
        
        jsc3l.bcRead.getContractStatus().then(function(status) {
                    $scope.is_curr_locked = status==0;
        });
        
        ////////////////////////////////////////////
        // Check if an address is registered 
        var currAddress = globalService.getCurrAddress();
        if (currAddress!=null){
                globalService.clearCurrAddress();   
                $scope.helloToAddress(currAddress);
                 
        }
        
        $scope.loadPendingTransactions();
        globalFuncs.notifyApproval();
        
        
        var local_message_key = JSON.parse(localStorage.getItem('ComChainWallet')).message_key.priv;
        $scope.my_message_key = $scope.wallet.messageKeysFromCrypted(local_message_key);
	});
    
	$scope.setBalance = function(readyStatus) {
        var wallet_address = $scope.wallet.getAddressString();
      return Promise.all([
        jsc3l.bcRead.getGlobalBalance(wallet_address).then(function(value){$scope.token.balance = value;}),
        jsc3l.bcRead.getNantBalance(wallet_address).then(function(value){$scope.balanceEL = Math.round(value * 100);}),
        jsc3l.bcRead.getCmBalance(wallet_address).then(function(value){$scope.balanceCM =  Math.round(value * 100);}),

        jsc3l.bcRead.getAccountType(wallet_address).then(function(value){
                 $scope.display_curr_btn = jsc3l.customization.hasNant() && jsc3l.customization.hasCM()  && value!=0; // only available when 2 currency and not a personal account
        }),

        // only available when 2 currency and not a personal account

        
        jsc3l.bcRead.getCmLimitBelow(wallet_address).then(function(limit_b) {
            $scope.limitCMm = Math.round(limit_b * 100);
            if (readyStatus){   
               globalFuncs.hideLoadingWaiting();  
            }else {
               globalFuncs.showLoading($translate.instant("GP_Wait"));
            }}),
      ]).then(function() {
        $scope.$digest();
      });
	}
    
    
    $scope.refresh= function(){
         $scope.refreshSend();
         if ($scope.showDelegLimit){
            $scope.refreshDeleg();
         }
         
         $scope.loadPendingTransactions();
         $scope.refreshApproval();
         $scope.refreshPending();
    }
    
    $scope.refreshSend = function(){
         globalFuncs.showLoading($translate.instant("GP_Wait"));
         $scope.validateTxStatus ='';
         $scope.isShopTx =false;
         $scope.hasFrom = jsc3l.customization.hasPayRequest();
         $scope.shopTxInfo=null;
         $scope.setBalance(true);
    }
    
    $scope.refreshDeleg = async function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.showDelegLimit=true;
        
        // TODO: why not paralell
        const val_el = await jsc3l.bcRead.getNantBalance($scope.origine_address);
        $scope.deleg_nant_bal = Math.round(val_el * 100);
        const val_cm = await jsc3l.bcRead.getCmBalance($scope.origine_address);
        $scope.deleg_cm_bal = Math.round(val_cm * 100);
        const limit_b = await jsc3l.bcRead.getCmLimitBelow($scope.origine_address);
        $scope.deleg_cm_lim = Math.round(limit_b * 100);
        var cm_available= $scope.deleg_cm_bal- $scope.deleg_cm_lim;
        $scope.display_deleg_limit = Math.min( Math.round($scope.delegation_limit* 100), Math.max(cm_available, $scope.deleg_nant_bal))/100.;
        globalFuncs.hideLoadingWaiting();  
    }
    
    
   $scope.refreshFrom = async function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        const val_el = await jsc3l.bcRead.getNantBalance($scope.curr_from_add);
        $scope.from_nant_bal = Math.round(val_el * 100);
        const val_cm = await jsc3l.bcRead.getCmBalance($scope.curr_from_add);
        $scope.from_cm_bal = Math.round(val_cm * 100);
        const limit_b = await jsc3l.bcRead.getCmLimitBelow($scope.curr_from_add);
        $scope.from_cm_lim = Math.round(limit_b * 100);
        globalFuncs.hideLoadingWaiting();  
    }
    
    
    
    $scope.setName = function(){
        $scope.selectedName = contactservice.getContactName($scope.contacts, $scope.tokenTx.to); 
    }
    
	$scope.generateTokenTx = function() {
        $scope.reference = "";
        $scope.setName();
        
        if ($scope.tokenTx.to.trim().startsWith("{") && !$scope.tokenTx.to.trim().endsWith("}")){
            $scope.showRaw = false;
            return;
        }
        
        if ($scope.tokenTx.to.trim().startsWith("{") && $scope.tokenTx.to.trim().endsWith("}")) {
            $scope.helloToAddress($scope.tokenTx.to.trim());
            return;
        }
        
        if ($scope.tokenTx.to=='' ||$scope.tokenTx.value=='' ){
            $scope.showRaw = false;
            return;
        }
        
        try {
            document.getElementById('trStatus').innerHTML='';
                
            if ("string"==typeof  $scope.tokenTx.value){
                $scope.tokenTx.value = $scope.tokenTx.value.replace(",", ".");
            }
            
            if (!$scope.is_request_mode && $scope.tokenTx.to.toUpperCase() == $scope.wallet.getAddressString().toUpperCase()) throw 'ERROR_6';
            
            if (!jsc3l.ethFuncs.validateEtherAddress($scope.tokenTx.to)) throw 'ERROR_6';
		    else if (!globalFuncs.isNumeric($scope.tokenTx.value) || parseFloat($scope.tokenTx.value) <= 0) throw 'ERROR_8';
		
            if ($scope.tokenTx.value % 1 >0){
                $scope.tokenTx.value = Math.round($scope.tokenTx.value * 100)/100.;
            }
            $scope.validateTxStatus='';
            
            if ($scope.mode == "fromDeleg" && $scope.tokenTx.value>$scope.display_deleg_limit){
                $scope.validateTxStatus = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('DELEG_AmountBiggerThanDeleg')));
			    $scope.showRaw = false;
            } else {
                
                $scope.showRaw = !$scope.is_locked;
            }
            
        } catch (e) {
			$scope.showRaw = false;
			$scope.validateTxStatus = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant(e)));
		} 
	}
    
    $scope.generateeTx = async function(){
        var data={};
        if ($scope.isShopTx){
            data = $scope.shopTxInfo;
        }
      data = Object.assign(data, jsc3l.memo.getTxMemoCipheredData(
        $scope.from_message_key, $scope.to_message_key,
        $scope.message_from, $scope.message_to
      ))

        // TODO: access to ajaxReq to remove ?
        const blk_number = await jsc3l.ajaxReq.currBlock()
                 const res = await jsc3l.bcTransaction.transferNant($scope.wallet, $scope.tokenTx.to, $scope.elemanAmmount/100, data);
                    if (res.isError){
                        globalFuncs.hideLoadingWaiting();  
                        
                        document.getElementById('err_message').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant(res.error)));
                        $scope.sendTxModal.open();       
                    } else {

                        if ($scope.lemanexAmmount>0){
                             $scope.executingSplittedTrans.open();
                             $scope.splitedSecondPart(blk_number,0, res.data);
                             
                        } else {
                            $scope.waitTransaction(res.data);
                            document.getElementById('err_message').innerHTML = $translate.instant("TRAN_Done");
                            $scope.openConf();
                        }
                      
                    }
     }
     
     
    $scope.splitted_second_ready = function(hash_first){
        $scope.executingSplittedTrans.close();
        $scope.generatelTx(hash_first);  
    }
  
    // Wait at least 5 sec (and the next block) before to send the second part of the splitted transaction
     $scope.splitedSecondPart = function(curr_block, attempt, hash_first) {
         setTimeout(async function(){
             const new_block = await jsc3l.ajaxReq.currBlock()
                 if (new_block != curr_block || attempt > 3) {
                     $scope.splitted_second_ready(hash_first);
                 } else {
                    $scope.splitedSecondPart(curr_block, attempt+1, hash_first); 
                 }
          },5000);  
          
     }
    
    
    $scope.generatelTx = async function(parent_hash){
        var data={};
        if ($scope.isShopTx){
            data = $scope.shopTxInfo;
        }
      data = Object.assign(data, jsc3l.memo.getTxMemoCipheredData(
        $scope.from_message_key, $scope.to_message_key,
        $scope.message_from, $scope.message_to
      ))

        if (parent_hash!==undefined){
            data['parent_hash']=parent_hash;
        }
        
        const res = await jsc3l.bcTransaction.transferCM($scope.wallet, $scope.tokenTx.to, $scope.lemanexAmmount/100, data);
                    if (res.isError){
                        globalFuncs.hideLoadingWaiting();  
                        document.getElementById('err_message').innerHTML = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant(res.error)));
                        $scope.sendTxModal.open(); 
                    } else {
                        $scope.waitTransaction(res.data);
                        document.getElementById('err_message').innerHTML = $translate.instant("TRAN_Done");
                        $scope.openConf();
                    }
    }
    
    
   
    
    $scope.generateTxx = function() {
        if ($scope.elemanAmmount>0){
             $scope.generateeTx();
        } else if ($scope.lemanexAmmount>0){
             $scope.generatelTx(undefined);
        } 
	}
    
    $scope.confirmPop = async function() {
       $scope.trPass=walletService.getPass();
       if ($scope.mode == "fromMe"){
           $scope.setBalance(true);
           $scope.typeTrans="no"
           document.getElementById('err_message').innerHTML ='';
           var value_cent = Math.round($scope.tokenTx.value * 100);
           $scope.splitted = jsc3l.bcTransaction.getSplitting($scope.balanceEL, $scope.balanceCM, $scope.limitCMm, value_cent);
           if ($scope.splitted['possible']){
                if ($scope.splitted['cm']>0){
                    if ($scope.splitted['nant']>0){
                         $scope.typeTrans=globalFuncs.currencies.CUR_nanti+"/"+globalFuncs.currencies.CUR_credit_mut;
                         document.getElementById('err_message').innerHTML=$sce.trustAsHtml(globalFuncs.getWarningText($translate.instant('TRAN_SplitedTrans')));
                    } else {
                        $scope.typeTrans=globalFuncs.currencies.CUR_credit_mut;
                    }
                }  else  if ($scope.splitted['nant']>0){
                    $scope.typeTrans=globalFuncs.currencies.CUR_nanti;
                }
                
                $scope.val_nant = $scope.splitted['nant']/100.0;
                $scope.max_val_nant = Math.min(value_cent, $scope.balanceEL)/100.0;
                $scope.val_cm = $scope.splitted['cm']/100.0;
                $scope.max_val_cm = Math.min(value_cent, $scope.balanceCM - $scope.limitCMm )/100.0;
           } else {
              document.getElementById('err_message').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('TRAN_NotPossible')));
           }
           
           
       } else if ($scope.mode == "fromDeleg"){
            document.getElementById('err_message').innerHTML='';
            $scope.typeTrans="";
               
       } else if ($scope.mode == "toMe"){
            document.getElementById('err_message').innerHTML='';
            $scope.typeTrans="toMe"
       }
       
       $scope.message_to = $scope.reference;
       $scope.message_from = $scope.reference;
       if ($scope.isShopTx) {
           $scope.message_to = $scope.shopTxInfo.txId + " " + $scope.reference;
           $scope.message_from = $scope.message_to;
       }
       $scope.cp_mess = false;
       $scope.to_message_key = "";
       jsc3l.ajaxReq.getMessageKey($scope.tokenTx.to, false).then(function(keys_to) {
         $scope.to_message_key = keys_to.public_message_key;
         if ( $scope.to_message_key === undefined) {
           $scope.to_message_key = "";
         } 
         if ( $scope.to_message_key .length>0) {
           $scope.cp_mess = $scope.reference.length==0 && !$scope.isShopTx;
         }
         $scope.$apply();
       });     
       
       $scope.from_message_key = "";
       jsc3l.ajaxReq.getMessageKey($scope.origine_address, false).then(function(keys_from) {
         $scope.from_message_key = keys_from.public_message_key; 
         if ($scope.from_message_key===undefined) {  
           $scope.from_message_key = "";
         }
         $scope.$apply();
       });
       
       if ($scope.mode == "toMe"){
         $scope.wallet.getReqMessage($scope.origine_address, $scope.my_message_key, true).then(function(message) {
           $scope.message_to=message;
           $scope.$apply();
         });
       }
       
       $scope.show_curr_sel = false;
                           
       $scope.sendTxModal.open();
    }
    
    $scope.recompute_split_nant = function() {
        var value_cent = Math.round($scope.tokenTx.value * 100);
        if ($scope.val_nant < 0) {
            $scope.val_nant = 0;
        } 
        
        if ($scope.val_nant > $scope.max_val_nant) {
            $scope.val_nant =  $scope.max_val_nant;
        }
        
        $scope.val_cm = (value_cent - Math.round($scope.val_nant * 100))/100.0;
            
        if ($scope.val_nant>0 && $scope.val_cm>0) {
            document.getElementById('err_message').innerHTML=$sce.trustAsHtml(globalFuncs.getWarningText($translate.instant('TRAN_SplitedTrans')));
            $scope.typeTrans=globalFuncs.currencies.CUR_nanti+"/"+globalFuncs.currencies.CUR_credit_mut;
        } else {
            document.getElementById('err_message').innerHTML="";
            if ($scope.val_nant>0) {
                $scope.typeTrans=globalFuncs.currencies.CUR_nanti;
            } else {
                $scope.typeTrans=globalFuncs.currencies.CUR_credit_mut;
            }
        }
        
        $scope.splitted['nant'] = Math.round($scope.val_nant * 100);
        $scope.splitted['cm'] = Math.round($scope.val_cm * 100);
    }
    
    $scope.recompute_split_cm = function() {
        var value_cent = Math.round($scope.tokenTx.value * 100);
        if ($scope.val_cm < 0) {
            $scope.val_cm = 0;
        } 
        
        if ($scope.val_cm > $scope.max_val_cm) {
            $scope.val_cm =  $scope.max_val_cm;
        }
        
        $scope.val_nant = (value_cent - Math.round($scope.val_cm * 100))/100.0;
        
        if ($scope.val_nant>0 && $scope.val_cm>0) {
            document.getElementById('err_message').innerHTML=$sce.trustAsHtml(globalFuncs.getWarningText($translate.instant('TRAN_SplitedTrans')));
            $scope.typeTrans=globalFuncs.currencies.CUR_nanti+"/"+globalFuncs.currencies.CUR_credit_mut;
        } else {
            document.getElementById('err_message').innerHTML="";
            if ($scope.val_nant>0) {
                $scope.typeTrans=globalFuncs.currencies.CUR_nanti;
            } else {
                $scope.typeTrans=globalFuncs.currencies.CUR_credit_mut;
            }
        }
        
        $scope.splitted['nant'] = Math.round($scope.val_nant * 100);
        $scope.splitted['cm'] = Math.round($scope.val_cm * 100);
    }
    
    
    $scope.showCurrSel = function(){
        $scope.show_curr_sel = !$scope.show_curr_sel;
    }
    
  
    $scope.cancelTx = function(){
        $scope.refreshSend();
    }
    
    
    $scope.delegationSendCallBack = function(res){
         if (res.isError){
            globalFuncs.hideLoadingWaiting();  
			document.getElementById('err_message').innerHTML = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant(res.error)));
            $scope.sendTxModal.open();
         } else {
            document.getElementById('err_message').innerHTML = $translate.instant("TRAN_Done");
            $scope.waitTransaction(res.data);
            $scope.openConf();
         }
    }
    
    
    
   $scope.fingetrprintUnlock = function(){
        globalFuncs.unlock(function(result){
          if (result) {
             $scope.trPass=walletService.password;
          }
        });
   } 

   $scope.passwordCheck = function(control){
        var number = jsc3l.customization.passwordAutocomplete();
        var curr_length = $scope.trPass.length;
        if (curr_length>=number && walletService.password.startsWith($scope.trPass)){
            // autocomplete (bypass angular for timinig reason with the set selection range)
            document.getElementById(control).value = walletService.password;
            // select
            document.getElementById(control).setSelectionRange(curr_length, walletService.password.length);
            
        }
    }
    

	$scope.sendTx = async function() {
        if ($scope.tokenTx.value<$scope.limitWithoutPass || $scope.trPass==walletService.password){
           document.getElementById('trStatus').innerHTML='';
           walletService.setUsed();
           $scope.sendTxModal.close();
           globalFuncs.showLoading($translate.instant("GP_Wait"));
           try {
                if ($scope.mode == "fromMe"){
                   $scope.setBalance(false);
                   // Compute the splitting 
                   var value_cent = Math.round($scope.tokenTx.value * 100);
                   
                   if (!$scope.isShopTx){
                   
                       
                       if ($scope.splitted['possible']){
                           $scope.elemanAmmount=$scope.splitted['nant'];
                           $scope.lemanexAmmount=$scope.splitted['cm'];
                       } else {
                           throw 'TRAN_NotPossible';
                       }
                   } else {
                       var cur_tran_type = globalFuncs.getTransCurrency($scope.balanceEL, $scope.balanceCM, $scope.limitCMm, value_cent);
                       if (cur_tran_type=='nant'){
                           $scope.elemanAmmount=value_cent;
                           $scope.lemanexAmmount=0;
                       } else if (cur_tran_type=='cm'){
                           $scope.elemanAmmount=0;
                           $scope.lemanexAmmount=value_cent;
                       } else if ($scope.balanceEL + $scope.balanceCM - $scope.limitCMm >= value_cent){
                           throw 'TRAN_NotPossibleWithoutSplit';
                       } else {
                           throw 'TRAN_NotPossible';
                       }
                   }
                   
			       $scope.generateTxx();
                    
               } else if ($scope.mode == "fromDeleg"){
                 $scope.refreshDeleg().then(async function() {

                      globalFuncs.showLoading($translate.instant("GP_Wait"));
                      $scope.elemanAmmount=0;
                      $scope.lemanexAmmount=0;
                      var value_cent = Math.round($scope.tokenTx.value * 100);
                      var cur_tran_type = globalFuncs.getTransCurrency($scope.deleg_nant_bal, $scope.deleg_cm_bal, $scope.deleg_cm_lim, value_cent);
                    
                      var data={};
                      if ($scope.isShopTx){
                            data = $scope.shopTxInfo;
                      }
                   data = Object.assign(data, jsc3l.memo.getTxMemoCipheredData(
                     $scope.from_message_key, $scope.to_message_key,
                     $scope.message_from, $scope.message_to
                   ))

                      if (cur_tran_type=='nant'){
                            $scope.elemanAmmount=value_cent;
                            const res = await jsc3l.bcTransaction.transferOnBehalfNant($scope.wallet,
                                                                $scope.origine_address, 
                                                                $scope.tokenTx.to, 
                                                                $scope.tokenTx.value,  
                                                                data);
                           $scope.delegationSendCallBack(res);
                      } else if (cur_tran_type=='cm'){
                             $scope.lemanexAmmount=value_cent;
                             const res = await jsc3l.bcTransaction.transferOnBehalfCM($scope.wallet,
                                                                $scope.origine_address, 
                                                                $scope.tokenTx.to, 
                                                                $scope.tokenTx.value,   
                                                                data);
                           $scope.delegationSendCallBack(res);
                      } else {
                           throw 'TRAN_NotPossible';
                      }
                   });
               
               } else if ($scope.mode == "toMe"){
                   $scope.refreshFrom().then(async function(){
                       
                      
                      $scope.wallet.publishReqMessages($scope.curr_from_add, $scope.message_to);

                       
                      $scope.elemanAmmount=0;
                      $scope.lemanexAmmount=0;
                      var value_cent = Math.round($scope.tokenTx.value * 100);
                      var cur_tran_type = globalFuncs.getTransCurrency($scope.from_nant_bal, $scope.from_cm_bal, $scope.from_cm_lim, value_cent);
                      if (cur_tran_type=='cm'){
                             $scope.lemanexAmmount=value_cent;
                             const res = await jsc3l.bcTransaction.askTransferCMFrom($scope.wallet, 
                                                          $scope.curr_from_add, 
                                                          $scope.tokenTx.value);
                             $scope.delegationSendCallBack(res);
                      } else {
                          
                              $scope.elemanAmmount=value_cent;
                              const res = await jsc3l.bcTransaction.askTransferFrom($scope.wallet, 
                                                          $scope.curr_from_add, 
                                                          $scope.tokenTx.value);
                              $scope.delegationSendCallBack(res);
                      } 
                   });
                
               }  
		   } catch (e) {
		        globalFuncs.hideLoadingWaiting();  
			    document.getElementById('err_message').innerHTML = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant(e)));
                $scope.sendTxModal.open();	
		   } 
        } else {
            
           document.getElementById('trStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("TRAN_WrongPass")));
        }
	}
    
    $scope.openConf = function(){
        $scope.executedTransModal.open();
    }
    
     $scope.closeConf = function() {
        $scope.executedTransModal.close();
        $scope.token.to='';
        $scope.token.value='';
        $scope.tokenTx.to='';
        $scope.tokenTx.value='';
        $scope.selectedName='';
        $scope.showRaw = false;
        $scope.lock_address_reading=false;
        $scope.mode = "fromMe";
        $scope.is_request_mode=false;
        $scope.reference = "";
        $scope.selectOrigineMy();
    
       
     }
     
    // contacts
    $scope.contactPop = function() {

        
        
        
      $scope.filter_ctt();
      $scope.showContactPop=true;
    }
    
    $scope.filter_ctt = function(){
        $scope.filtered_contacts= contactservice.filterContact($scope.contacts_without_me.slice(),$scope.ctt_filter);
        $scope.NoCtc= $scope.filtered_contacts.length==0;
     
    }
    
    
    $scope.closeCttPop = function() {
      $scope.showContactPop=false; 
      $scope.ctt_filter="";
    }
    
    $scope.pickCtc = function(address,name){
        $scope.isShopTx =false;
        $scope.hasFrom = jsc3l.customization.hasPayRequest();
        $scope.shopTxInfo=null;
        $scope.tokenTx.to= address; 
        $scope.generateTokenTx();
        $scope.closeCttPop();
    }
    
    
    // Cancel shop Transaction
    $scope.cancelShopTx = function(){  
        $scope.isShopTx =false;
        $scope.hasFrom = jsc3l.customization.hasPayRequest();
        $scope.shopTxInfo=null;
    }
    
    // origine
    
    $scope.originePop = async function(){
        $scope.myAddress=$scope.wallet.getAddressString();
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.delegations = await jsc3l.bcRead.getMyDelegationList($scope.myAddress, 0, 1000);
        $scope.hasDelegations= $scope.delegations.length>0;
        for(var ind =0;ind<$scope.delegations.length;ind++){
           $scope.delegations[ind].name =  contactservice.getContactName($scope.contacts, $scope.delegations[ind].address); 
        }
        globalFuncs.hideLoadingWaiting();  
        $scope.chooseOrigineModal.open();
        $scope.$apply();
  
        
    }
    
    
    $scope.setOrigineAddress = function(address){
        $scope.origine_address = address;
        $scope.from_name=contactservice.getContactName($scope.contacts, address); 
        $scope.showMyBalance=address==$scope.wallet.getAddressString();
        $scope.showDelegLimit=$scope.mode == "fromDeleg";
    }
    
    
    
    $scope.lockDestinationAddress = function(do_lock){
        $scope.lock_address_reading=do_lock;
        document.getElementById('toField').readOnly = do_lock;
        
        if (do_lock){
            $scope.tokenTx.to = $scope.wallet.getAddressString();
            document.getElementById('ctc_pop_btn').style.display ='none';
        } else {
           $scope.tokenTx.to = '';
           
           document.getElementById('ctc_pop_btn').style.display ='block';
        }
        
        $scope.setName();
    }
    
     // contacts
    $scope.contactPopOrigine = function() {
      $scope.filter_ctt();
      $scope.showContactPopOrigine=true;
    }
    
    $scope.closeCttPopO = function() {
        $scope.showContactPopOrigine=false; 
        $scope.ctt_filter="";
    }
    
    $scope.pickCtcO = function(address,name){
        $scope.curr_from_add= address; 
        $scope.setNameFrom();
        $scope.closeCttPopO();
    }
    
    $scope.delegPop = function() {
      $scope.showDelegationPop=true;
    }
    
    $scope.closeDelPop = function() {
      $scope.showDelegationPop=false; 
    }
    
    $scope.pickDeleg = function(address,name,limit){
        $scope.curent_deleg_add = address; 
        $scope.curent_deleg_limit = limit; 
        $scope.curent_deleg_name = name;
        $scope.closeDelPop();
    }
    
    
    
    // closing origin: my address
    $scope.selectOrigineMy= function(){
        $scope.mode = "fromMe";
        $scope.setOrigineAddress($scope.wallet.getAddressString());
        if ( !$scope.isShopTx){
            $scope.lockDestinationAddress(false);
            $scope.is_request_mode=false;
            $scope.tokenTx.value=''; 
        }

        $scope.generateTokenTx();
        $scope.chooseOrigineModal.close();
    }
    
   
    
    
    
    // closing origin: delegation mode
    $scope.selectOrigineDeleg= function(){
        
        if ($scope.curent_deleg_add.length!=$scope.wallet.getAddressString().length  || $scope.curent_deleg_add==$scope.wallet.getAddressString())  {
           // todo error_message in the popup
        } else {
            $scope.mode = "fromDeleg";
            $scope.setOrigineAddress($scope.curent_deleg_add);
            $scope.delegation_limit = $scope.curent_deleg_limit;
            if ( !$scope.isShopTx){
                $scope.lockDestinationAddress(false);
                $scope.is_request_mode=false;
                $scope.tokenTx.value='';
            }
            
            $scope.refreshDeleg();
            $scope.generateTokenTx();
            $scope.chooseOrigineModal.close();
        }
    }
    
    // closing origin: ask payement from
    $scope.selectOrigineFrom= function(){
        
        if ($scope.curr_from_add.length!=$scope.wallet.getAddressString().length  || $scope.curr_from_add==$scope.wallet.getAddressString())  {
           // todo error_message in the popup
        } else {
            $scope.mode = "toMe";
            $scope.setOrigineAddress($scope.curr_from_add);
            
            $scope.lockDestinationAddress(true);
     
            $scope.is_request_mode=true;
            $scope.tokenTx.value='';
            $scope.chooseOrigineModal.close();
        }
    }
    
    
     $scope.setNameFrom = function(){
        $scope.curr_from_name = contactservice.getContactName($scope.contacts, $scope.curr_from_add); 
    }
    
    
    $scope.isOnlineShopQR= function(adr_obj){
        if (("address" in adr_obj) && ("amount" in adr_obj) && ("shopId" in adr_obj) && ("txId" in adr_obj) && ("serverName" in adr_obj) ){
            if (adr_obj.address && adr_obj.amount && adr_obj.shopId && adr_obj.txId && adr_obj.serverName){
                return true;
            }
        }
        return false;
    }
    
    // Scan address
     
    $scope.helloToAddress = function(text){
      var add_obj = globalFuncs.parseAddress(text); 
      $scope.reference = "";
      if (add_obj.error){
           $scope.tokenTx.to='';
           $scope.setName();
           alert($translate.instant("EXC_unknow_address"));
      } else {
      
          if ( add_obj.serverName &&  add_obj.serverName!=jsc3l.customization.getCurrencyName()){
              $scope.alrtNotSameCurrModal.open();
              return;
          }
          
          
          var is_shop =  $scope.isOnlineShopQR(add_obj);
          if (is_shop && $scope.mode == "toMe"){
              $scope.selectOrigineMy(); 
          }
          
          if (add_obj.address){
              $scope.tokenTx.to=add_obj.address;
              $scope.setName();
          } else {
              $scope.tokenTx.to='';
          } 
          
          if (add_obj.amount){
              $scope.tokenTx.value=add_obj.amount;
              $scope.generateTokenTx();
          } 
          
          if (is_shop){
            $scope.isShopTx =true;
            $scope.hasFrom = false;
            $scope.shopTxInfo=add_obj;
          } else {
            $scope.cancelShopTx();
          }
          
          if (add_obj.ref!== undefined && add_obj.ref.length>0) {
             $scope.reference =  add_obj.ref;
          } 
          
        
            
         
      }
      $scope.$apply();
    }
    
    $scope.startScanToAddress = function(){
        if (!$scope.lock_address_reading){
            cordova.plugins.barcodeScanner.scan(
		    function (result) {
			    $scope.helloToAddress(result.text);
		    }, 
		    function (error) {
			    alert("Scanning failed: " + error);
		    }, {'SCAN_MODE': 'QR_CODE_MODE'}
	        );
        }
    };
    
    
     // Scan address
     
    $scope.helloToAddressOrigine = function(text){
      var add_obj = globalFuncs.parseAddress(text);  
      if (add_obj.error){
          $scope.curr_from_add='';
           alert($translate.instant("EXC_unknow_address"));
      } else {
          if (add_obj.address){
              $scope.curr_from_add=add_obj.address;
          } else {
              $scope.curr_from_add='';
          }
      }
      
      $scope.setNameFrom();
      $scope.$apply();
    }
    
    $scope.startScanToAddressOrigine = function(){
        cordova.plugins.barcodeScanner.scan(
		function (result) {
		 $scope.helloToAddressOrigine(result.text);
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		 }, {'SCAN_MODE': 'QR_CODE_MODE'}
	   );
        
    };
  

    
  //////////////////////////////////////////// 
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
  
  
  
 ///////////////////////////////////////////////
 ///////////////////////////////////////////////
    $scope.loadPendingTransactions = function(){
        globalFuncs.notifyApproval();
        $scope.pendingApproval = [];
        jsc3l.bcRead.getPendingRequestList($scope.wallet.getAddressString(),0,1).then(async function(list) {
                $scope.pendingRequest=list;
            if ( $scope.pendingRequest.length>0){
                 $scope.request_tab=2;
            }
            
            $scope.rejectedRequest = await jsc3l.bcRead.getRejectedRequestList($scope.wallet.getAddressString(),0,1);
            if ( $scope.rejectedRequest.length>0){
                $scope.request_tab=1;
            }
            $scope.acceptedRequest = await jsc3l.bcRead.getAcceptedRequestList($scope.wallet.getAddressString(),0,1);
            if ( $scope.acceptedRequest.length>0){
                 $scope.request_tab=0;
            }

            jsc3l.bcRead.getRequestToApproveList($scope.wallet.getAddressString(),0,1).then(function(list) {
              Promise.all(list.map((elt) => $scope.addMessagePending(elt))).then(() => $scope.$apply())
            });
        });
    }
    
    $scope.addMessagePending = async function(item){
      try {
        let message = await $scope.wallet.getReqMessage(item.address, $scope.my_message_key, false)
        item['message'] = message;
      } catch (e) {
        console.log('`getReqMessage()` in `addMessagePending()` failed. Ignoring.')
      }
        $scope.pendingApproval.unshift(item);
    }
    
    
    $scope.handlePendingRequest= function(){
       
       $scope.req_index=0;
       $scope.req_number=4;
       $scope.req_offset=0;
       
       $scope.app_index=0;
       $scope.app_number=4;
       $scope.app_offset=0;
       
       $scope.rej_index=0;
       $scope.rej_number=4;
       $scope.rej_offset=0;
       
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.loadPendingRequests($scope.req_number,$scope.req_index*$scope.req_number + $scope.req_offset);
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.loadApprovedRequests($scope.app_number,$scope.app_index*$scope.app_number + $scope.app_offset);
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.loadRejectedRequests($scope.rej_number,$scope.rej_index*$scope.rej_number + $scope.rej_offset);
        
       document.getElementById('pending_tab').style.display="inline-block"; 
       setTimeout(function () {
        document.getElementById('pending_tab').style.top="62px";
       }, 200);
       
    }
    
    $scope.nextPending = function(){
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.req_index = $scope.req_index+1;
       $scope.loadPendingRequests($scope.req_number,$scope.req_index*$scope.req_number + $scope.req_offset);
    }
    
    $scope.prevPending = function(){
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.req_index = $scope.req_index-1;
       $scope.loadPendingRequests($scope.req_number,$scope.req_index*$scope.req_number + $scope.req_offset);
    }
    
    $scope.nextRejected = function(){
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.rej_index = $scope.rej_index+1;
       $scope.loadRejectedRequests($scope.rej_number,$scope.rej_index*$scope.rej_number + $scope.rej_offset);
    }
    
    $scope.prevRejected = function(){
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.rej_index = $scope.rej_index-1;
       $scope.loadRejectedRequests($scope.rej_number,$scope.rej_index*$scope.rej_number + $scope.rej_offset);
    }
    
    $scope.nextAccepted = function(){
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.app_index = $scope.app_index+1;
       $scope.loadApprovedRequests($scope.app_number,$scope.app_index*$scope.app_number + $scope.app_offset);
    }
    
    $scope.prevAccepted = function(){
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.app_index = $scope.app_index-1;
       $scope.loadApprovedRequests($scope.app_number,$scope.app_index*$scope.app_number + $scope.app_offset);
    }
    
    $scope.refreshPending = function(){
       $scope.req_index = 0;
       $scope.app_index = 0;
       $scope.rej_index = 0;
       if (typeof $scope.req_number !== "undefined") {
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.loadPendingRequests($scope.req_number,$scope.req_index*$scope.req_number + $scope.req_offset);
       }
       if (typeof $scope.app_number !== "undefined") {
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.loadApprovedRequests($scope.app_number,$scope.app_index*$scope.app_number + $scope.app_offset);
       }
       if (typeof $scope.rej_number !== "undefined") {
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.loadRejectedRequests($scope.rej_number,$scope.rej_index*$scope.rej_number + $scope.rej_offset);
       }
       
       setTimeout(function(){  
           if ( $scope.pendingRequest.length>0){
              $scope.request_tab=2;
           }
           if ( $scope.rejectedRequest.length>0){
              $scope.request_tab=1;
           }
           if ( $scope.acceptedRequest.length>0){
              $scope.request_tab=0;
           }
       }, 200);
      
    }
    

    
      
    $scope.loadPendingRequests= function(count,offset){

         $scope.noMorePending = true;
         if (offset>0){
              document.getElementById("prevPending").style.display = 'block';
       
         } else {
               document.getElementById("prevPending").style.display = 'none';
          
         }
          
         document.getElementById("nextPending").style.display = 'none';
        
          
      jsc3l.bcRead.getPendingRequestList($scope.wallet.getAddressString(),offset,offset+count-1 ).then(
                                  function(list) {
                                      $scope.pendingRequest = list;
         $scope.noMorePending = $scope.pendingRequest.length<count;
         
         if (!$scope.noMorePending){
              document.getElementById("nextPending").style.display = 'block';
         }
         
       
         for(var ind =0;ind<$scope.pendingRequest.length;ind++){
            $scope.pendingRequest[ind].name =  contactservice.getContactName($scope.contacts, $scope.pendingRequest[ind].address); 
         }
         $scope.$apply();
         $scope.transPendingStatus='';
         globalFuncs.hideLoadingWaiting();  
                                     });
    }
    
    
      $scope.loadRejectedRequests= function(count,offset){

        $scope.noMoreRejected = true;
        if (offset>0){
           document.getElementById("prevRejected").style.display = 'block';

        } else {
           document.getElementById("prevRejected").style.display = 'none';

        }
          
         document.getElementById("nextRejected").style.display = 'none';
        
          
         jsc3l.bcRead.getRejectedRequestList($scope.wallet.getAddressString(),offset,offset+count-1).then(
                                     function(list) {
                                         $scope.rejectedRequest = list;
         $scope.noMoreRejected = $scope.rejectedRequest.length<count;
         
         if (!$scope.noMoreRejected){
              document.getElementById("nextRejected").style.display = 'block';
         }
         
       
         for(var ind =0;ind<$scope.rejectedRequest.length;ind++){
            $scope.rejectedRequest[ind].name =  contactservice.getContactName($scope.contacts, $scope.rejectedRequest[ind].address); 
         }
         $scope.$apply();
         $scope.transPendingStatus='';
         globalFuncs.hideLoadingWaiting();  
                                     });
                      
    }
    
     $scope.loadApprovedRequests= function(count,offset){

         $scope.noMoreAccepted = true;
         if (offset>0){
               document.getElementById("prevAccepted").style.display = 'block';
         } else {
               document.getElementById("prevAccepted").style.display = 'none';
         }
          
         document.getElementById("nextAccepted").style.display = 'none';
        
          
       jsc3l.bcRead.getAcceptedRequestList($scope.wallet.getAddressString(),offset,offset+count-1 ).then(
                                    function(list) {
                                        $scope.acceptedRequest = list;
                                    
         $scope.noMoreAccepted = $scope.acceptedRequest.length<count;
         
         if (!$scope.noMoreAccepted){
              document.getElementById("nextAccepted").style.display = 'block';
         }
         
       
         for(var ind =0;ind<$scope.acceptedRequest.length;ind++){
            $scope.acceptedRequest[ind].name =  contactservice.getContactName($scope.contacts, $scope.acceptedRequest[ind].address); 
         }
         $scope.$apply();
         $scope.transPendingStatus='';
         globalFuncs.hideLoadingWaiting();  
         });
                             
        
    }
    
    
    $scope.dissmissRejected = function(address){
        jsc3l.bcTransaction.dismissRejectedInfo($scope.wallet,address).then(function(res) {
        if (res.isError){
                $scope.transPendingStatus=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant(res.error)));
        } else {
            $scope.transPendingStatus=$sce.trustAsHtml($translate.instant("TRA_Accepted_dissmissed"));
           // $scope.conf_dissModal.open();
            
            $scope.trans_message = $translate.instant("TRA_Accepted_dissmissed") + " "+ $translate.instant("GP_Wait_tran");
            $scope.waitTransaction(res.data);
        }
        });
    }
    
    $scope.dissmissAccepted = function(address){
        jsc3l.bcTransaction.dismissAcceptedInfo($scope.wallet,address).then(function(res) {
         if (res.isError){
                $scope.transPendingStatus=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant(res.error)));
         } else {
            $scope.transPendingStatus=$sce.trustAsHtml($translate.instant("TRA_Accepted_dissmissed"));
            $scope.trans_message = $translate.instant("TRA_Accepted_dissmissed") + " "+ $translate.instant("GP_Wait_tran");
            //$scope.conf_dissModal.open();
            $scope.waitTransaction(res.data);
         }
         });
    }
    
    
    
    
    $scope.closePending = function(){
       
        document.getElementById('pending_tab').style.top="100%";
         setTimeout(function () {
              document.getElementById('pending_tab').style.display="none"; 
              $scope.loadPendingTransactions();
         }, 700);
    }
    
    $scope.pendingHelp = function(){
        $scope.pendingRequestHelpModal.open();
      
    }
    
    ////////////////////////////////////////////////////////////////
      $scope.handlePendingApproval = function(){
       $scope.transApprovalStatus='';
       $scope.app_index=0;
       $scope.app_number=4;
       $scope.app_offset=0;
       
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.loadPendingApprovals($scope.app_number,$scope.app_index*$scope.app_number + $scope.app_offset);
        
       document.getElementById('approval_tab').style.display="inline-block"; 
       setTimeout(function () {
        document.getElementById('approval_tab').style.top="62px";
       }, 200);
       
    }
    
    $scope.nextApproval = function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.app_index = $scope.app_index+1;
       $scope.loadPendingApprovals($scope.app_number,$scope.app_index*$scope.app_number + $scope.app_offset);
    }
    
    $scope.prevApproval = function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.app_index = $scope.app_index-1;
       $scope.loadPendingApprovals($scope.app_number,$scope.app_index*$scope.app_number + $scope.app_offset);
    }
    
    $scope.refreshApproval = function(){
        $scope.app_index = 0;

        if (typeof $scope.app_number !== "undefined") {
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.loadPendingApprovals($scope.app_number,$scope.app_index*$scope.app_number + $scope.app_offset);
        }
    }
    
      
    $scope.loadPendingApprovals= function(count,offset){

         $scope.noMoreApproval = true;
         if (offset>0){
               document.getElementById("prevApproval").style.display = 'block';
         } else {
               document.getElementById("prevApproval").style.display = 'none';
         }
          
         document.getElementById("nextApproval").style.display = 'none';
        
          
         jsc3l.bcRead.getRequestToApproveList($scope.wallet.getAddressString(),offset,offset+count-1).then(
                                     function(list) {
                                     
         $scope.pendingApproval = [];
         $scope.noMoreApproval = list.length<count;
         
         if (!$scope.noMoreApproval){
              document.getElementById("nextApproval").style.display = 'block';
         }

         Promise.all(list.map((item) => {
            item.name =  contactservice.getContactName($scope.contacts,item.address);
            return $scope.addMessagePending(item)
         })).then(() => {
         $scope.transApprovalStatus='';
         globalFuncs.hideLoadingWaiting();  
         $scope.$apply()
         });
                                     });
                              
    }
    
    
    
    
    $scope.closeApproval = function(){
       
        document.getElementById('approval_tab').style.top="100%";
         setTimeout(function () {
              document.getElementById('approval_tab').style.display="none"; 
              $scope.loadPendingTransactions();
         }, 700);
    }
    
    $scope.approvalHelp = function(){
        $scope.pendingApprovalHelpModal.open();
      
    }
    
    $scope.payRequest = async function(request){
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       // TODO: why not parallel ?
       const balanceEL = await jsc3l.bcRead.getNantBalance($scope.wallet.getAddressString());
       const limitCMm = await jsc3l.bcRead.getCmLimitBelow($scope.wallet.getAddressString());
       const balanceCM = await jsc3l.bcRead.getCmBalance($scope.wallet.getAddressString());
       $scope.trPass=walletService.getPass();
       document.getElementById('tr_err_message').innerHTML='';
       document.getElementById('trStatus_pay').innerHTML='';
       globalFuncs.hideLoadingWaiting();  
       $scope.transaction_amount =  request.amount;
       $scope.transaction_to = request.address;
       $scope.selectedName = request.name;
       $scope.typeTrans='no';
       var cur_tran_type = globalFuncs.getTransCurrency(balanceEL, balanceCM, limitCMm, request.amount);
       if (cur_tran_type=='cm'){
            $scope.typeTrans=globalFuncs.currencies.CUR_credit_mut;
       } else if (cur_tran_type=='nant'){
            $scope.typeTrans=globalFuncs.currencies.CUR_nanti;
       } else {
            document.getElementById('tr_err_message').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('TRAN_NotPossible'))); 
       }
       

       $scope.message_to = request.message===undefined?"":request.message;
       $scope.to_lock = $scope.message_to.length>0;
       $scope.message_from = request.message===undefined?"":request.message;
       $scope.cp_mess = false;
       $scope.to_message_key = "";
       $scope.from_message_key = "";
       Promise.all([
       jsc3l.ajaxReq.getMessageKey($scope.transaction_to, false).then(function(keys_to) {
         $scope.to_message_key = keys_to.public_message_key;
         if ( $scope.to_message_key === undefined) {
            $scope.to_message_key = "";
         }
         if ($scope.to_message_key.length>0 && request.message=="") {
              $scope.cp_mess = true;
         }  
       }),
      
       jsc3l.ajaxReq.getMessageKey($scope.wallet.getAddressString(), false).then(function(keys_from) {
       $scope.from_message_key = keys_from.public_message_key;
       if ($scope.from_message_key===undefined) {
          $scope.from_message_key = "";
       }
       })]).then(() => {
         $scope.sendTransactionModal.open();
         $scope.$apply();
       });
    }
    
  $scope.messageChanged = function() {
      if ($scope.cp_mess){
          $scope.message_from = $scope.message_to;
      }
  }
  
  $scope.sendReqTx = async function(){
    var data = jsc3l.memo.getTxMemoCipheredData(
      $scope.from_message_key, $scope.to_message_key,
      $scope.message_from, $scope.message_to
    )

      if ($scope.trPass==walletService.password){
        document.getElementById('trStatus_pay').innerHTML='';
        walletService.setUsed();
        $scope.sendTransactionModal.close();
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        if ($scope.typeTrans==globalFuncs.currencies.CUR_credit_mut){
           const res = await jsc3l.bcTransaction.payRequestCM($scope.wallet, $scope.transaction_to, $scope.transaction_amount, data);
           globalFuncs.hideLoadingWaiting();  
           if (res.isError){
               document.getElementById('tr_err_message').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant(res.error)));
               $scope.sendTransactionModal.open();
           } else {
               document.getElementById('tr_err_message').innerHTML=$translate.instant("TRAN_Done");
               $scope.transApprovalStatus=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("TRA_Request_Payed")));
               $scope.trans_message = $translate.instant("TRA_Request_Payed") + " "+ $translate.instant("GP_Wait_tran");
               $scope.waitTransaction(res.data);
               $scope.openReqConf();
           }
        } else if ($scope.typeTrans==globalFuncs.currencies.CUR_nanti){
           const res = await jsc3l.bcTransaction.payRequestNant($scope.wallet, $scope.transaction_to, $scope.transaction_amount, data);
           globalFuncs.hideLoadingWaiting();  
           if (res.isError){
               document.getElementById('tr_err_message').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant(res.error)));
               $scope.sendTransactionModal.open();
           } else {
               document.getElementById('tr_err_message').innerHTML=$translate.instant("TRAN_Done");
               $scope.transApprovalStatus=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("TRA_Request_Payed")));
               $scope.trans_message = $translate.instant("TRA_Request_Payed") + " "+ $translate.instant("GP_Wait_tran");
               $scope.waitTransaction(res.data);
               $scope.openReqConf();
           }
        } 
      } else {
          document.getElementById('trStatus_pay').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("TRAN_WrongPass")));
      }
    }
    

    
    
    $scope.rejectRequest = function(request){
         $scope.trPass=walletService.getPass();
         $scope.trRejectStatus='';
         $scope.err_reject_message='';
         $scope.typeTrans='no';
         $scope.transaction_amount = request.amount;
         $scope.transaction_to = request.address;
         $scope.selectedName = request.name;
         $scope.rejectTransactionModal.open();
    }
    

    $scope.rejectTx = async function(){
       if ($scope.trPass==walletService.password){
            walletService.setUsed();
            $scope.rejectTransactionModal.close();
            globalFuncs.showLoading($translate.instant("GP_Wait"));
            const res = await jsc3l.bcTransaction.rejectRequest($scope.wallet, $scope.transaction_to);
            globalFuncs.hideLoadingWaiting();  
            if (res.isError){
                $scope.err_reject_message=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant(res.error)));
                $scope.rejectTransactionModal.open();
                $scope.$apply;
            } else {
                $scope.waitTransaction(res.data);
                $scope.err_reject_message=$translate.instant("TRAN_Done");
                $scope.transApprovalStatus=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("TRA_Request_Rejected")));

                $scope.trans_message = $translate.instant("TRA_Request_Rejected") + " "+ $translate.instant("GP_Wait_tran");
                $scope.typeTrans='no';
                
            }
       } else {
          $scope.trRejectStatus=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("TRAN_WrongPass")));
      }
    }
   
    $scope.openReqConf = function(){
         $scope.conf_requestModal.open(); 
    }
    

};
module.exports = sendCtrl;


