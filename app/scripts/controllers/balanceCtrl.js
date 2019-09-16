'use strict';
var balanceCtrl = function($scope, $locale, $sce, walletService,contactservice, $translate) {
    // Environment variables
    $scope.isApp =  globalFuncs.isApp();
    $scope.currentWalletAddress=globalFuncs.getWalletAddress();
    $scope.blobEnc = '';
    $scope.CUR='';
    $scope.CUR_nanti='';
    $scope.CUR_credit_mut='';
    $scope.has_nant=false;
    $scope.has_credit_mut=false;
    $scope.has_deleg=false;
    $scope.has_autor=false;
    $scope.acc_name= $translate.instant("TRAN_Address");
    
    // Popup 
	$scope.qrModal = new Modal(document.getElementById('QR_pop'));
    
	$scope.addDelegationModal = new Modal(document.getElementById('addDelegation'));
	$scope.editDelegationModal = new Modal(document.getElementById('editDelegation'));
    $scope.deleteDelegationModal = new Modal(document.getElementById('deleteDelegation'));
	$scope.delegationHelpPop = new Modal(document.getElementById('delegation_help_pop'), { keyboard: false, backdrop  : 'static'});
    
	$scope.addAllowanceModal = new Modal(document.getElementById('addAllowance'));
	$scope.editAllowanceModal = new Modal(document.getElementById('editAllowance'));
    $scope.deleteAllowanceModal = new Modal(document.getElementById('deleteAllowance'));
	$scope.allowanceHelpPop = new Modal(document.getElementById('allowance_help_pop'), { keyboard: false, backdrop  : 'static'});
    
	$scope.confPopModal = new Modal(document.getElementById('conf_pop'));
	$scope.optionPopModal = new Modal(document.getElementById('option_pop'));
    
    $scope.trans_message = $translate.instant("GP_Wait_tran");
    
    // Controler variables 
    $locale.NUMBER_FORMATS.GROUP_SEP = "'";
	$scope.showRaw = false;
    $scope.contacts = [];
    $scope.showContactPop=false;

	$scope.token = {
		balance: 0
	}
    
    $scope.token.balance = $translate.instant("TRAN_Wait");
    $scope.token.balanceEL = $translate.instant("TRAN_Wait");
    $scope.token.balanceCM = $translate.instant("TRAN_Wait");
    $scope.token.limitCMm = $translate.instant("TRAN_Wait");
    $scope.token.limitCMp = $translate.instant("TRAN_Wait");

    $scope.is_locked = false;
    
    
    globalFuncs.showLoading($translate.instant("GP_Wait"));
    
	$scope.$watch(function() {
		if (walletService.wallet == null) return null;
		return walletService.wallet.getAddressString();
	}, function() {
		if (walletService.wallet == null) return;
		$scope.wallet = walletService.wallet;
        $scope.contacts = contactservice.loadContactsForCurr(globalFuncs.getServerName());
        var my_name =  contactservice.getContactName($scope.contacts, $scope.wallet.getAddressString());
        if (my_name!=''){
            $scope.acc_name=my_name;
        }
        $scope.contacts = contactservice.hideContact($scope.contacts, $scope.wallet.getAddressString());
        globalFuncs.getAccInfo(globalFuncs.slockitAccStatus, $scope.wallet.getAddressString(), function(status){
           $scope.is_locked = status==0;
        });
        $scope.blobEnc = globalFuncs.getBlob("text/json;charset=UTF-8", $scope.wallet.toV3(walletService.password, {
				kdf: globalFuncs.kdf,
                n: globalFuncs.scrypt.n,
                server_name:globalFuncs.getServerName(),     
                server_address:globalFuncs.getServerAddress()                                                                                
			}));
        $scope.CUR=globalFuncs.currencies.CUR;
        $scope.CUR_nanti=globalFuncs.currencies.CUR_nanti;
        $scope.CUR_credit_mut=globalFuncs.currencies.CUR_credit_mut;
        $scope.has_nant=globalFuncs.hasNant();
        $scope.has_credit_mut=globalFuncs.hasCM();
        $scope.has_deleg=globalFuncs.hasDeleg();
        $scope.has_autor=globalFuncs.hasAutor();
        $scope.qr_content = localStorage.getItem('ComChainWallet');
        var qrcode = new QRCode(document.getElementById("qrcode_print_2"),localStorage.getItem('ComChainWallet'));
        setTimeout(function(){ document.getElementById("qrcode_print_2").getElementsByTagName('img')[0].style.display="inline";},100); 
        
       
     
        
	});
    
	$scope.setBalance = function() {

        globalFuncs.getAmmount(globalFuncs.slockitBalance, $scope.currentWalletAddress, function(value){$scope.token.balance = value;});
        globalFuncs.getAmmount(globalFuncs.slockitElBlance, $scope.currentWalletAddress, function(value){$scope.token.balanceEL = value;});
        globalFuncs.getAmmount(globalFuncs.slockitCmBlance, $scope.currentWalletAddress, function(value){$scope.token.balanceCM = value;});
        globalFuncs.getAmmount(globalFuncs.slockitCmLimitm, $scope.currentWalletAddress, function(value){$scope.token.limitCMm = value;});
        globalFuncs.getAmmount(globalFuncs.slockitCmLimitp, $scope.currentWalletAddress, function(value){$scope.token.limitCMp = value; globalFuncs.hideLoadingWaiting();});
	}
    
    $scope.setBalance();
    
    $scope.refresh=function(){
         $scope.refreshBal();
         $scope.refreshDel();
         $scope.refreshAllowance();
         
    }
    
    $scope.refreshBal=function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.setBalance();
    }

    $scope.dowloadAppFile = function(){
        var file_name = globalFuncs.cleanName($translate.instant("PDF_Priv_file")) +'_'+$scope.currentWalletAddress+'.dat';
        globalFuncs.dowloadAppFileWithName(file_name, JSON.parse(localStorage.getItem('ComChainWallet')));
    }
    
    $scope.callback = function(pdf_doc){
        var uri = pdf_doc.output('datauristring');
        window.open(uri, '_blank', 'location=no');  
    }

	$scope.printQRCode = function() {
         globalFuncs.generateSaveQR($scope.currentWalletAddress);

         setTimeout(function(){ 
             globalFuncs.generateSavePDF(
                $translate.instant("PDF_Private_title"),
                $translate.instant("PDF_Private_private"),
                $scope.currentWalletAddress,
                $scope.callback);
         },100); 
       
     
       $scope.qrModal.open();
	}
    
    
    
    $scope.handleDelegation = function(){

       $scope.deleg_index=0;
       $scope.deleg_number=4;
       $scope.deleg_offset=0;
       
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.loadDelegations($scope.deleg_number,$scope.deleg_index*$scope.deleg_number + $scope.deleg_offset);
        
       document.getElementById('delegation_tab').style.display="inline-block"; 
       setTimeout(function () {
        document.getElementById('delegation_tab').style.top="62px";
       }, 200);
       
    }
    
    $scope.nextDeleg = function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.deleg_index = $scope.deleg_index+1;
       $scope.loadDelegations($scope.deleg_number,$scope.deleg_index*$scope.deleg_number + $scope.deleg_offset);
    }
     $scope.prevDeleg = function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.deleg_index = $scope.deleg_index-1;
       $scope.loadDelegations($scope.deleg_number,$scope.deleg_index*$scope.deleg_number + $scope.deleg_offset);
    }
    
     $scope.refreshDel = function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.deleg_index = 0;
        document.getElementById('transDelStatus').innerHTML='';
        $scope.loadDelegations($scope.deleg_number,$scope.deleg_index*$scope.deleg_number + $scope.deleg_offset);
    }
    
    
      $scope.loadDelegations= function(count,offset){

         $scope.noDelegation = true;
         $scope.noMoreDelegation = true;
         if (offset>0){
              document.getElementById("prevDeleg").style.display = 'block';
              $scope.noDelegation = false;
          } else {
               document.getElementById("prevDeleg").style.display = 'none';
          
          }
          
          document.getElementById("nextDeleg").style.display = 'none';
        
          
          globalFuncs.getDelegationList($scope.wallet.getAddressString(),offset,offset+count-1 ,
                                     function(list){
                                         $scope.delegations = list;
                                         $scope.noDelegation = $scope.delegations.length==0 && offset==0;
                                         $scope.noMoreDelegation = !$scope.noDelegation && $scope.delegations.length<count;
                                         
                                         if (!$scope.noMoreDelegation && !$scope.noDelegation){
                                              document.getElementById("nextDeleg").style.display = 'block';
                                         }
                                         
                                       
                                         for(var ind =0;ind<$scope.delegations.length;ind++){
                                            $scope.delegations[ind].name =  contactservice.getContactName($scope.contacts, $scope.delegations[ind].address); 
                                         }
                                          // $scope.$apply();
                                         document.getElementById('transDelStatus').innerHTML='';
                                         document.getElementById('delStatus').innerHTML='';
                                         globalFuncs.hideLoadingWaiting();
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

    
    $scope.addDelegPop = function(){
        $scope.currDelLimit='';
        $scope.curraddress='';
        $scope.trPass=walletService.getPass();
        $scope.selectedName='';
        document.getElementById('delStatus').innerHTML='';
        $scope.addDelegationModal.open();
    }
    
    $scope.closeDelegation = function(){
        document.getElementById('delegation_tab').style.top="100%";
         setTimeout(function () {
              document.getElementById('delegation_tab').style.display="none"; 
         }, 700);
    }
    
    $scope.delegateHelp = function(){
        $scope.delegationHelpPop.open();
      
    }
    
   $scope.saveNewDeleg = function(){
         if ($scope.trPass.length==0){
            globalFuncs.unlock(function(result){
                if (result) {
                    $scope.trPass=walletService.password;
                }
                $scope.saveNewDelegOld();
            });
         } else {
             $scope.saveNewDelegOld();
         }
    }
    
    $scope.saveNewDelegOld = function(){
        if ($scope.trPass==walletService.password){
            walletService.setUsed();
          
            
            if ($scope.curraddress.length!=$scope.currentWalletAddress.length  || $scope.curraddress==$scope.currentWalletAddress)  {
                document.getElementById('delStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("DELEG_NotAcceptedAddress")));
            } else if (isNaN($scope.currDelLimit)  || $scope.currDelLimit<=0){
                 document.getElementById('delStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("DELEG_InvalidDelegationLimit")));
            } else {
              globalFuncs.setDelegation($scope.wallet, $scope.curraddress,$scope.currDelLimit,function(res){
                   if (res.isError){
                        globalFuncs.hideLoadingWaiting();
				        document.getElementById('delStatus').innerHTML= $sce.trustAsHtml(globalFuncs.getDangerText(res.error));
                    } else {
                       $scope.waitTransaction(res.data);
                       document.getElementById('transDelStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("Deleg_order_create_send")));
                       $scope.addDelegationModal.close();
                       $scope.confStatus = $translate.instant("Deleg_order_create_send");
                       
                       $scope.trans_message = $translate.instant("Deleg_order_create_send")+ " " +$translate.instant("GP_Wait_tran");
                       //$scope.confPopModal.open();
                 }
                   
              }); 
            }
        } else {
              document.getElementById('delStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("WIEW_WrongPass")));
        }
    }
    
    
    // contacts
    $scope.contactPop = function() {
      $scope.NoCtc= $scope.contacts.length==0;
      $scope.showContactPop=true;
    }
    
    $scope.closeCttPop = function() {
      $scope.showContactPop=false;  
    }
    
    $scope.pickCtc = function(address,name,type){
        if (type=='deleg'){
             $scope.curraddress=address;
             $scope.selectedName = name; 
        }
        $scope.closeCttPop();
    }
    
    $scope.getCttName = function(){
        $scope.selectedName = contactservice.getContactName($scope.contacts, $scope.curraddress); 
    }
    

    
    
    $scope.helloToAddress = function(text){
      var add_obj = globalFuncs.parseAddress(text);  
      if (add_obj.address){
          $scope.curraddress=add_obj.address;
          $scope.selectedName = contactservice.getContactName($scope.contacts, add_obj.address); 
      } else {
          
          $scope.curraddress='';
          $scope.selectedName ='';
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
		}, {'SCAN_MODE': 'QR_CODE_MODE'});
    }
    
    
    $scope.editDeleg = function(deleg){
        $scope.curraddress=deleg.address;
        $scope.selectedName = contactservice.getContactName($scope.contacts, deleg.address); 
        $scope.currDelLimit=deleg.amount;
        document.getElementById('del_lim_ed_p').value=deleg.amount;
        document.getElementById('delEditStatus').innerHTML='';
        $scope.trPass=walletService.getPass();
        $scope.editDelegationModal.open();
    }
    
    
   $scope.saveEditDeleg = function(){
         if ($scope.trPass.length==0){
            globalFuncs.unlock(function(result){
                if (result) {
                    $scope.trPass=walletService.password;
                }
                $scope.saveEditDelegOld();
            });
         } else {
             $scope.saveEditDelegOld();
         }
    }
    
    
    
    $scope.saveEditDelegOld = function(){
        if ($scope.trPass==walletService.password){
            walletService.setUsed();
          
            if (isNaN($scope.currDelLimit)  || $scope.currDelLimit<=0){
                 document.getElementById('delEditStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("DELEG_InvalidDelegationLimit")));
            } else {
              globalFuncs.setDelegation($scope.wallet, $scope.curraddress,$scope.currDelLimit,function(res){
                    if (res.isError){
                        globalFuncs.hideLoadingWaiting();
				        document.getElementById('delEditStatus').innerHTML= $sce.trustAsHtml(globalFuncs.getDangerText(res.error));
                    } else {
                       $scope.waitTransaction(res.data);
                       document.getElementById('transDelStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("Deleg_order_edit_send")));
                       $scope.editDelegationModal.close();
                       $scope.confStatus = $translate.instant("Deleg_order_edit_send");
                       $scope.confPopModal.open();
                    }
              }); 
            }
        } else {
              document.getElementById('delEditStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("WIEW_WrongPass")));
        }
    }
    
    $scope.deleteDeleg = function(deleg){
        $scope.curraddress=deleg.address;
        $scope.selectedName = contactservice.getContactName($scope.contacts, deleg.address); 
        $scope.currDelLimit=deleg.amount;
        document.getElementById('delDeleteStatus').innerHTML='';
        $scope.trPass=walletService.getPass();
        $scope.deleteDelegationModal.open();
    }
    
    $scope.saveDeleteDeleg = function(){
         if ($scope.trPass.length==0){
            globalFuncs.unlock(function(result){
                if (result) {
                    $scope.trPass=walletService.password;
                }
                $scope.saveDeleteDelegOld();
            });
         } else {
             $scope.saveDeleteDelegOld();
         }
    }
    
    
     $scope.saveDeleteDelegOld = function(){
        if ($scope.trPass==walletService.password){
              walletService.setUsed();
              globalFuncs.setDelegation($scope.wallet, $scope.curraddress,-1,function(res){
                    if (res.isError){
                        globalFuncs.hideLoadingWaiting();
				        document.getElementById('delDeleteStatus').innerHTML= $sce.trustAsHtml(globalFuncs.getDangerText(res.error));
                    } else {
                       $scope.waitTransaction(res.data);
                       document.getElementById('transDelStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("Deleg_order_delete_send")));
                       $scope.deleteDelegationModal.close();
                       $scope.confStatus = $translate.instant("Deleg_order_delete_send");
                       $scope.trans_message = $translate.instant("Deleg_order_delete_send")+ " " +$translate.instant("GP_Wait_tran");
                       //$scope.confPopModal.open();
                    }

              }); 
            
        } else {
              document.getElementById('delDeleteStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("WIEW_WrongPass")));
        }
    }
    
    
    
    ///////
    
     $scope.handleAllowance = function(){
       
       $scope.allow_index=0;
       $scope.allow_number=4;
       $scope.allow_offset=0;
       
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.loadAllowances($scope.allow_number,$scope.allow_index*$scope.allow_number + $scope.allow_offset);
        
       document.getElementById('allowance_tab').style.display="inline-block"; 
       setTimeout(function () {
        document.getElementById('allowance_tab').style.top="62px";
       }, 200);
       
    }
    
    $scope.nextAllow = function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.allow_index = $scope.allow_index+1;
       $scope.loadAllowances($scope.allow_number,$scope.allow_index*$scope.allow_number + $scope.allow_offset);
    }
    
    $scope.prevAllow = function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.allow_index = $scope.allow_index-1;
       $scope.loadAllowances($scope.allow_number,$scope.allow_index*$scope.allow_number + $scope.allow_offset);
    }
    
    $scope.refreshAllowance = function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.allow_index = 0;
        document.getElementById('transAllowStatus').innerHTML='';
        $scope.loadAllowances($scope.allow_number,$scope.allow_index*$scope.allow_number + $scope.allow_offset);
    }
    
      
    $scope.loadAllowances= function(count,offset){

         $scope.noAllowance = true;
         $scope.noMoreAllowance = true;
         if (offset>0){
              document.getElementById("prevAllow").style.display = 'block';
              $scope.noAllowance = false;
          } else {
               document.getElementById("prevAllow").style.display = 'none';
          
          }
          
          document.getElementById("nextAllow").style.display = 'none';
        
          
         globalFuncs.getAllowanceList($scope.wallet.getAddressString(),offset,offset+count-1 ,
                                     function(list){
                                         $scope.allowances = list;
                                         $scope.noAllowance = $scope.allowances.length==0 && offset==0;
                                         $scope.noMoreAllowance = !$scope.noAllowance && $scope.allowances.length<count;
                                         
                                         if (!$scope.noMoreAllowance && !$scope.noAllowance){
                                              document.getElementById("nextAllow").style.display = 'block';
                                         }
                                         
                                       
                                         for(var ind =0;ind<$scope.allowances.length;ind++){
                                            $scope.allowances[ind].name =  contactservice.getContactName($scope.contacts, $scope.allowances[ind].address); 
                                         }
                                          // $scope.$apply();
                                         document.getElementById('transAllowStatus').innerHTML='';
                                         document.getElementById('allowStatus').innerHTML='';
                                         globalFuncs.hideLoadingWaiting();
                                     });
        
    }
    
    
    
    
    $scope.closeAllowance = function(){
        document.getElementById('allowance_tab').style.top="100%";
         setTimeout(function () {
              document.getElementById('allowance_tab').style.display="none"; 
         }, 700);
    }
    
    $scope.allowanceHelp = function(){
        $scope.allowanceHelpPop.open();
      
    }
    
     $scope.addAllowPop = function(){
        $scope.currAllowAmount='';
        $scope.curraddress='';
        $scope.selectedName='';
        $scope.trPass=walletService.getPass();
        document.getElementById('allowStatus').innerHTML='';
        $scope.addAllowanceModal.open();
    }
    
    $scope.saveNewAllow = function(){
         if ($scope.trPass.length==0){
            globalFuncs.unlock(function(result){
                if (result) {
                    $scope.trPass=walletService.password;
                }
                $scope.saveNewAllowOld();
            });
         } else {
             $scope.saveNewAllowOld();
         }
    }
    
    
    
    
    $scope.saveNewAllowOld = function(){
      if ($scope.trPass==walletService.password){
           walletService.setUsed();
           
            if ($scope.curraddress.length!=$scope.currentWalletAddress.length  || $scope.curraddress==$scope.currentWalletAddress)  {
                document.getElementById('allowStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("ALLOW_NotAcceptedAddress")));
            }  else if (isNaN($scope.currAllowAmount)  || $scope.currAllowAmount<=0){
                 document.getElementById('allowStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("ALLOW_InvalidAmount")));
            } else {
              globalFuncs.setAllowance($scope.wallet, $scope.curraddress,$scope.currAllowAmount,function(res){
                    if (res.isError){
                        globalFuncs.hideLoadingWaiting();
				        document.getElementById('allowStatus').innerHTML= $sce.trustAsHtml(globalFuncs.getDangerText(res.error));
                    } else {
                       $scope.waitTransaction(res.data);
                       document.getElementById('transAllowStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("ALLOW_order_create_send")));
                       
                       $scope.addAllowanceModal.close();
                       $scope.confStatus = $translate.instant("ALLOW_order_create_send");
                       
                       $scope.trans_message = $translate.instant("ALLOW_order_create_send")+ " " +$translate.instant("GP_Wait_tran");
                       //$scope.confPopModal.open();
                    } 
              }); 
            }
        } else {
              document.getElementById('allowStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("WIEW_WrongPass")));
        }
    }
    
       
    $scope.editAllow = function(allowance){
        $scope.curraddress=allowance.address;
        $scope.selectedName = contactservice.getContactName($scope.contacts, allowance.address); 
        $scope.currAllowAmount=allowance.amount;
        document.getElementById('all_amount_p').value=allowance.amount;
        document.getElementById('allowEditStatus').innerHTML='';
        $scope.trPass=walletService.getPass();
        $scope.editAllowanceModal.open();
    }
    
    $scope.saveEditAllowance = function(){
         if ($scope.trPass.length==0){
            globalFuncs.unlock(function(result){
                if (result) {
                    $scope.trPass=walletService.password;
                }
                $scope.saveEditAllowanceOld();
            });
         } else {
             $scope.saveEditAllowanceOld();
         }
    } 
    
    
    $scope.saveEditAllowanceOld = function(){
        if ($scope.trPass==walletService.password){
            walletService.setUsed();
          
            if (isNaN($scope.currAllowAmount)  || $scope.currAllowAmount<=0){
                 document.getElementById('allowEditStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("ALLOW_InvalidAmount")));
            } else {
              globalFuncs.setAllowance($scope.wallet, $scope.curraddress,$scope.currAllowAmount,function(res){
                    if (res.isError){
                        globalFuncs.hideLoadingWaiting();
				        document.getElementById('allowEditStatus').innerHTML= $sce.trustAsHtml(globalFuncs.getDangerText(res.error));
                    } else {
                       $scope.waitTransaction(res.data);
                       document.getElementById('transAllowStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("ALLOW_order_edit_send")));
                       $scope.editAllowanceModal.close();
                       $scope.confStatus = $translate.instant("ALLOW_order_edit_send");
                       
                       $scope.trans_message = $translate.instant("ALLOW_order_edit_send")+ " " +$translate.instant("GP_Wait_tran");
                      // $scope.confPopModal.open();
                    } 
              }); 
            }
        } else {
              document.getElementById('allowEditStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("WIEW_WrongPass")));
        }
    }
    
    $scope.deleteAllow = function(allowance){
        $scope.curraddress=allowance.address;
        $scope.selectedName = contactservice.getContactName($scope.contacts, allowance.address); 
      
        document.getElementById('allowDeleteStatus').innerHTML='';
        $scope.trPass=walletService.getPass();
        $scope.deleteAllowanceModal.open();
    }
    
    $scope.saveDeleteAllowance = function(){
         if ($scope.trPass.length==0){
            globalFuncs.unlock(function(result){
                if (result) {
                    $scope.trPass=walletService.password;
                }
                $scope.saveDeleteAllowanceOld();
            });
         } else {
             $scope.saveDeleteAllowanceOld();
         }
    }
    
    
     $scope.saveDeleteAllowanceOld = function(){
        if ($scope.trPass==walletService.password){
            walletService.setUsed();
               globalFuncs.setAllowance($scope.wallet, $scope.curraddress,-1,function(res){
                   if (res.isError){
                        globalFuncs.hideLoadingWaiting();
				        document.getElementById('allowDeleteStatus').innerHTML= $sce.trustAsHtml(globalFuncs.getDangerText(res.error));
                    } else {
                       $scope.waitTransaction(res.data);
                       document.getElementById('transAllowStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("ALLOW_order_delete_send")));
                       $scope.deleteAllowanceModal.close();
                       $scope.confStatus = $translate.instant("ALLOW_order_delete_send");
                       $scope.trans_message = $translate.instant("ALLOW_order_delete_send")+ " " +$translate.instant("GP_Wait_tran");
                       
                       //$scope.confPopModal.open();
                    }  
              }); 
            
        } else {
              document.getElementById('allowDeleteStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("WIEW_WrongPass")));
        }
    }
    
    
 ////////////////////////////////////////////////////////////////
    $scope.openOptions = function(){
        $scope.trPass='';
        document.getElementById('optStatus').innerHTML='';
        $scope.delay = walletService.delay;
        $scope.optionPopModal.open();
    }
    
     $scope.saveOption = function(){
         if ($scope.trPass.length==0){
            globalFuncs.unlock(function(result){
                if (result) {
                    $scope.trPass=walletService.password;
                }
                $scope.saveOptionOld();
            });
         } else {
             $scope.saveOptionOld();
         }
    }
    
    
    $scope.saveOptionOld = function(){
       if ($scope.trPass==walletService.password){
          walletService.setUsed();
          walletService.setDelay($scope.delay);
          $scope.optionPopModal.close();
         } else {
              document.getElementById('optStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("WIEW_WrongPass")));
        }
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
    
    
    
    
};
module.exports = balanceCtrl;


