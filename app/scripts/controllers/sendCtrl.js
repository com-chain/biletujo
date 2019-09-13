'use strict';
var sendCtrl = function($scope, $locale, $sce, walletService, contactservice, globalService, $translate) {
    $locale.NUMBER_FORMATS.GROUP_SEP = "'";
    $scope.limitWithoutPass=0;
    
    // Popup
	$scope.sendTxModal = new Modal(document.getElementById('sendTransaction'));
	$scope.executedTransModal = new Modal(document.getElementById('executedTrans'));
	$scope.chooseOrigineModal = new Modal(document.getElementById('chooseOrigine'));
	$scope.alrtNotSameCurrModal = new Modal(document.getElementById('alrtNotSameCurr'));
    
    

	$scope.showRaw = false;
    $scope.isApp =  globalFuncs.isApp();
    
    globalFuncs.showLoading($translate.instant("GP_Wait"));
    
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
    $scope.hasFrom = globalFuncs.hasPayRequest();
    $scope.shopTxInfo=null;
    
    $scope.is_locked=false;
    
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
       
        $scope.blobEnc = globalFuncs.getBlob("text/json;charset=UTF-8", $scope.wallet.toV3(walletService.password, {
				kdf: globalFuncs.kdf,
                n: globalFuncs.scrypt.n,
                server_name: globalFuncs.getServerName(),     
                server_address:globalFuncs.getServerAddress()  
		}));
 
        $scope.contacts = contactservice.loadContactsForCurr(globalFuncs.getServerName()), $scope.wallet.getAddressString();
        $scope.contacts_without_me = contactservice.hideContact( contactservice.loadContactsForCurr(globalFuncs.getServerName()), $scope.wallet.getAddressString(), $scope.wallet.getAddressString());
        $scope.filtered_contacts=$scope.contacts_without_me.slice();
        $scope.setOrigineAddress($scope.wallet.getAddressString());
        $scope.lockDestinationAddress(false);
        globalFuncs.getAccInfo(globalFuncs.slockitAccStatus, $scope.wallet.getAddressString(), function(status){
                    $scope.is_locked = status==0;
        });
        $scope.setBalance(true);
        $scope.CUR=globalFuncs.currencies.CUR;
        $scope.CUR_nanti=globalFuncs.currencies.CUR_nanti;
        $scope.CUR_credit_mut=globalFuncs.currencies.CUR_credit_mut;
        
        globalFuncs.canUseFingerprint(function(result){
             $scope.fingerprint = result;
        });
        
        ////////////////////////////////////////////
        // Check if an address is registered 
        var currAddress = globalService.getCurrAddress();
        if (currAddress!=null){
                globalService.clearCurrAddress();   
                $scope.helloToAddress(currAddress);
                 
        }
    
        globalFuncs.notifyApproval();
	});
    
	$scope.setBalance = function(readyStatus) {
        var wallet_address = $scope.wallet.getAddressString();

        globalFuncs.getAmmount(globalFuncs.slockitBalance, wallet_address, function(value){$scope.token.balance = value;});
        globalFuncs.getAmmount(globalFuncs.slockitElBlance, wallet_address, function(value){$scope.balanceEL = Math.round(value * 100);});
        globalFuncs.getAmmount(globalFuncs.slockitCmBlance, wallet_address, function(value){$scope.balanceCM = Math.round(value * 100);});
        globalFuncs.getAmmount(globalFuncs.slockitCmLimitm,wallet_address, function(value){
            $scope.limitCMm = Math.round(value * 100);
            if (readyStatus){   
               globalFuncs.hideLoadingWaiting();  
            }else {
               globalFuncs.showLoading($translate.instant("GP_Wait"));
            }});

	}
    
    
    $scope.refresh= function(){
         $scope.refreshSend();
         if ($scope.showDelegLimit){
            $scope.refreshDeleg(function(){});
         }
    }
    
    $scope.refreshSend = function(){
         globalFuncs.showLoading($translate.instant("GP_Wait"));
         $scope.validateTxStatus ='';
         $scope.isShopTx =false;
         $scope.hasFrom = globalFuncs.hasPayRequest();
         $scope.shopTxInfo=null;
         $scope.setBalance(true);
    }
    
    $scope.refreshDeleg = function(callback){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.showDelegLimit=true;
        globalFuncs.getAmmount(globalFuncs.slockitElBlance, $scope.origine_address, function(value){
            $scope.deleg_nant_bal = Math.round(value * 100);
            globalFuncs.getAmmount(globalFuncs.slockitCmBlance, $scope.origine_address, function(value){
                $scope.deleg_cm_bal = Math.round(value * 100);
                globalFuncs.getAmmount(globalFuncs.slockitCmLimitm, $scope.origine_address, function(value){
                    $scope.deleg_cm_lim = Math.round(value * 100);
                    var cm_available= $scope.deleg_cm_bal- $scope.deleg_cm_lim;
                    $scope.display_deleg_limit = Math.min( Math.round($scope.delegation_limit* 100), Math.max(cm_available, $scope.deleg_nant_bal))/100.;
                    globalFuncs.hideLoadingWaiting();  
                    callback();
                });
            });
        });  
    }
    
    
   $scope.refreshFrom = function(callback){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        globalFuncs.getAmmount(globalFuncs.slockitElBlance, $scope.curr_from_add, function(value){
            $scope.from_nant_bal = Math.round(value * 100);
            globalFuncs.getAmmount(globalFuncs.slockitCmBlance, $scope.curr_from_add, function(value){
                $scope.from_cm_bal = Math.round(value * 100);
                globalFuncs.getAmmount(globalFuncs.slockitCmLimitm, $scope.curr_from_add, function(value){
                    $scope.from_cm_lim = Math.round(value * 100);
                    globalFuncs.hideLoadingWaiting();  
                    callback();
                });
            });
        });  
    }
    
    
    
    $scope.setName = function(){
        $scope.selectedName = contactservice.getContactName($scope.contacts, $scope.tokenTx.to); 
    }
    
	$scope.generateTokenTx = function() {
        $scope.setName();
        

        
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
            
            if (!ethFuncs.validateEtherAddress($scope.tokenTx.to)) throw 'ERROR_6';
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
    
    $scope.generateeTx = function(){
        var data={};
        if ($scope.isShopTx){
            data = $scope.shopTxInfo;
        }
    
        globalFuncs.TransfertNant($scope.wallet, $scope.tokenTx.to, $scope.elemanAmmount, data,  function(res){
                    if (res.isError){
                        globalFuncs.hideLoadingWaiting();  
				        $scope.err_message = $sce.trustAsHtml(globalFuncs.getDangerText(res.error));
                        $scope.sendTxModal.open();
                    } else {

                        if ($scope.lemanexAmmount>0){
                             $scope.generatelTx(1);
                        } else {
                            $scope.waitTransaction(res.data);
                            $scope.err_message = $translate.instant("TRAN_Done");
                            $scope.openConf();
                        }
                      
                    }
                 
		        });
     }
    
    
    $scope.generatelTx = function(incr){
        var data={};
        if ($scope.isShopTx){
            data = $scope.shopTxInfo;
        }
        
        globalFuncs.TransfertCM($scope.wallet, $scope.tokenTx.to, $scope.lemanexAmmount,incr, data, function(res){
                    if (res.isError){
                        globalFuncs.hideLoadingWaiting();  
				        $scope.err_message = $sce.trustAsHtml(globalFuncs.getDangerText(res.error));
                        $scope.sendTxModal.open();
                    } else {
                        $scope.waitTransaction(res.data);
                        $scope.err_message = $translate.instant("TRAN_Done");
                        $scope.openConf();
                    }
                 
		        });
    }
    
    
   
    
    $scope.generateTxx = function() {
        if ($scope.elemanAmmount>0){
             $scope.generateeTx();
        } else if ($scope.lemanexAmmount>0){
             $scope.generatelTx(0);
        } 
	}
    
    $scope.confirmPop= function() {
       $scope.trPass=walletService.getPass();
       if ($scope.mode == "fromMe"){
           $scope.setBalance(true);
           $scope.typeTrans="no"
           $scope.err_message='';
           var value_cent = Math.round($scope.tokenTx.value * 100);
           var splitted = globalFuncs.getSplitting($scope.balanceEL, $scope.balanceCM, $scope.limitCMm, value_cent);
           if (splitted['possible']){
                if (splitted['cm']>0){
                    if (splitted['nant']>0){
                         $scope.typeTrans=globalFuncs.currencies.CUR_nanti+"/"+globalFuncs.currencies.CUR_credit_mut;
                         $scope.err_message=$sce.trustAsHtml(globalFuncs.getWarningText($translate.instant('TRAN_SplitedTrans')));
                    } else {
                        $scope.typeTrans=globalFuncs.currencies.CUR_credit_mut;
                    }
                }  else  if (splitted['nant']>0){
                    $scope.typeTrans=globalFuncs.currencies.CUR_nanti;
                }
           } else {
              $scope.err_message=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('TRAN_NotPossible')));
           }
           
           
       } else if ($scope.mode == "fromDeleg"){
            $scope.err_message='';
            $scope.typeTrans="";
               
       } else if ($scope.mode == "toMe"){
            $scope.err_message='';
            $scope.typeTrans="toMe"
       }
       $scope.sendTxModal.open();
    }
    
  
    $scope.cancelTx = function(){
        $scope.refreshSend();
    }
    
    
    $scope.delegationSendCallBack = function(res){
         if (res.isError){
            globalFuncs.hideLoadingWaiting();  
			$scope.err_message = $sce.trustAsHtml(globalFuncs.getDangerText(res.error));
            $scope.sendTxModal.open();
         } else {
            $scope.err_message = $translate.instant("TRAN_Done");
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
        var number = globalFuncs.passwordAutocomplete();
        var curr_length = $scope.trPass.length;
        if (curr_length>=number && walletService.password.startsWith($scope.trPass)){
            // autocomplete (bypass angular for timinig reason with the set selection range)
            document.getElementById(control).value = walletService.password;
            // select
            document.getElementById(control).setSelectionRange(curr_length, walletService.password.length);
            
        }
    }
    

	$scope.sendTx = function() {
        if ($scope.tokenTx.value<$scope.limitWithoutPass || $scope.trPass==walletService.password){
           walletService.setUsed();
           $scope.sendTxModal.close();
           globalFuncs.showLoading($translate.instant("GP_Wait"));
           try {
                if ($scope.mode == "fromMe"){
                   $scope.setBalance(false);
                   // Compute the splitting 
                   var value_cent = Math.round($scope.tokenTx.value * 100);
                   var splitted = globalFuncs.getSplitting($scope.balanceEL, $scope.balanceCM, $scope.limitCMm, value_cent);
                   if (splitted['possible']){
                       $scope.elemanAmmount=splitted['nant'];
                       $scope.lemanexAmmount=splitted['cm'];
                   } else {
                       throw 'TRAN_NotPossible';
                   }
                   
			       $scope.generateTxx();
                    
               } else if ($scope.mode == "fromDeleg"){
                   $scope.refreshDeleg(function(){
                      $scope.elemanAmmount=0;
                      $scope.lemanexAmmount=0;
                      var value_cent = Math.round($scope.tokenTx.value * 100);
                      var cur_tran_type = globalFuncs.getTransCurrency($scope.deleg_nant_bal, $scope.deleg_cm_bal, $scope.deleg_cm_lim, value_cent);
                    
                      var data={};
                      if ($scope.isShopTx){
                            data = $scope.shopTxInfo;
                      }
                      
                      if (cur_tran_type=='nant'){
                            $scope.elemanAmmount=value_cent;
                            globalFuncs.TransfertOnBehalfNant($scope.wallet,
                                                                $scope.origine_address, 
                                                                $scope.tokenTx.to, 
                                                                parseInt(100*$scope.tokenTx.value,10),  
                                                                data,
                                                                $scope.delegationSendCallBack);
                      } else if (cur_tran_type=='cm'){
                             $scope.lemanexAmmount=value_cent;
                             globalFuncs.TransfertOnBehalfCM($scope.wallet,
                                                                $scope.origine_address, 
                                                                $scope.tokenTx.to, 
                                                                parseInt(100*$scope.tokenTx.value,10),   
                                                                data,
                                                                $scope.delegationSendCallBack);
                      } else {
                           throw 'TRAN_NotPossible';
                      }
                   });
               
               } else if ($scope.mode == "toMe"){
                   $scope.refreshFrom(function(){
                       
                      $scope.elemanAmmount=0;
                      $scope.lemanexAmmount=0;
                      var value_cent = Math.round($scope.tokenTx.value * 100);
                      var cur_tran_type = globalFuncs.getTransCurrency($scope.from_nant_bal, $scope.from_cm_bal, $scope.from_cm_lim, value_cent);
                      if (cur_tran_type=='cm'){
                             $scope.lemanexAmmount=value_cent;
                             globalFuncs.askTransfertCMFrom($scope.wallet, 
                                                          $scope.wallet.getAddressString(), 
                                                          $scope.curr_from_add, 
                                                          parseInt(100*$scope.tokenTx.value,10), 
                                                          $scope.delegationSendCallBack);
                      } else {
                          
                              $scope.elemanAmmount=value_cent;
                              globalFuncs.askTransfertFrom($scope.wallet, 
                                                          $scope.wallet.getAddressString(), 
                                                          $scope.curr_from_add, 
                                                          parseInt(100*$scope.tokenTx.value,10), 
                                                          $scope.delegationSendCallBack);
                      } 
                   });
                
               }  
		   } catch (e) {
		        globalFuncs.hideLoadingWaiting();  
			    $scope.err_message = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant(e)));
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
        $scope.hasFrom = globalFuncs.hasPayRequest();
        $scope.shopTxInfo=null;
        $scope.tokenTx.to= address; 
        $scope.generateTokenTx();
        $scope.closeCttPop();
    }
    
    
    // Cancel shop Transaction
    $scope.cancelShopTx = function(){  
        $scope.isShopTx =false;
        $scope.hasFrom = globalFuncs.hasPayRequest();
        $scope.shopTxInfo=null;
    }
    
    // origine
    
    $scope.originePop = function(){
        $scope.myAddress=$scope.wallet.getAddressString();
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        globalFuncs.getMyDelegationList($scope.myAddress,function(list){
            $scope.delegations=list;
            $scope.hasDelegations= $scope.delegations.length>0;
            for(var ind =0;ind<$scope.delegations.length;ind++){
               $scope.delegations[ind].name =  contactservice.getContactName($scope.contacts, $scope.delegations[ind].address); 
            }
            globalFuncs.hideLoadingWaiting();  
            $scope.chooseOrigineModal.open();
            
        });
        
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
            
            $scope.refreshDeleg(function(){});
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
      
      if (add_obj.error){
           $scope.tokenTx.to='';
           $scope.setName();
           alert($translate.instant("EXC_unknow_address"));
      } else {
      
          if ( add_obj.serverName &&  add_obj.serverName!=globalFuncs.getServerName()){
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
module.exports = sendCtrl;


