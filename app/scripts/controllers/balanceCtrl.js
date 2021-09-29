'use strict';
var balanceCtrl = function($scope, $locale, $sce, walletService,contactservice, consultService, $translate) {
    // Environment variables
    $scope.isApp =  jsc3l.customization.isApp();
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
    $scope.fingerprint=false;
    $scope.CR_frag_number = 5;
    
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
    
    $scope.createRightModal = new Modal(document.getElementById('createConsultRight'));
    $scope.dislayQRModal = new Modal(document.getElementById('QR_consult_pop'));
    $scope.openRightModal = new Modal(document.getElementById('QR_scan_pop'));
    $scope.deleteConsultModal = new Modal(document.getElementById('deleteConsultRight'));
    $scope.consultHelpPop = new Modal(document.getElementById('consult_help_pop'), { keyboard: false, backdrop  : 'static'});
    
    
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
    
    $scope.NoCR = true;
    $scope.consult_rights = [];  
    $scope.start_date =  new Date();
    $scope.end_date =  new Date();
    $scope.end_date.setDate($scope.end_date.getDate() + 1);
    
    
    $scope.token.balance = $translate.instant("TRAN_Wait");
    $scope.token.balanceEL = $translate.instant("TRAN_Wait");
    $scope.token.balanceCM = $translate.instant("TRAN_Wait");
    $scope.token.limitCMm = $translate.instant("TRAN_Wait");
    $scope.token.limitCMp = $translate.instant("TRAN_Wait");

    $scope.is_locked = false;
    
    
    if (document.getElementById("bal_opt")){
        document.getElementById("bal_opt").title=$translate.instant("BAL_Tooltip_opt").replace("\n","");
    }
    if(document.getElementById("bal_down_w")){
        document.getElementById("bal_down_w").title=$translate.instant("BAL_Tooltip_sav").replace("\n","");
    }
    if (document.getElementById("bal_down_app")){
    document.getElementById("bal_down_app").title=$translate.instant("BAL_Tooltip_sav").replace("\n","");
    }
    if (document.getElementById("bal_qr")){
    document.getElementById("bal_qr").title=$translate.instant("BAL_Tooltip_sav_qr").replace("\n","");
    }
    
    
    globalFuncs.showLoading($translate.instant("GP_Wait"));
    
	$scope.$watch(function() {
		if (walletService.wallet == null) return null;
		return walletService.wallet.getAddressString();
	}, async function() {
		if (walletService.wallet == null) return;
		$scope.wallet = walletService.wallet;
        $scope.wallet.message_key = JSON.parse(localStorage.getItem('ComChainWallet')).message_key;
        contactservice.loadContacts($scope.wallet, walletService.password).then(function(contact_list){
            var filtered_list = contactservice.filterContactForCurr(contact_list, jsc3l.customization.getCurrencyName());
            
            var my_name =  contactservice.getContactName(filtered_list, $scope.wallet.getAddressString());
            if (my_name!=''){
                $scope.acc_name=my_name;
            }
            
            $scope.contacts = contactservice.hideContact(filtered_list, $scope.wallet.getAddressString());
            
        });
        
       
        const status =  await jsc3l.bcRead.getAccountStatus($scope.wallet.getAddressString());
        $scope.is_locked = status==0;

        
        
                
        $scope.blobEnc = globalFuncs.getBlob("text/json;charset=UTF-8", localStorage.getItem('ComChainWallet'));
        $scope.CUR=globalFuncs.currencies.CUR;
        $scope.CUR_nanti=globalFuncs.currencies.CUR_nanti;
        $scope.CUR_credit_mut=globalFuncs.currencies.CUR_credit_mut;
        $scope.has_nant=jsc3l.customization.hasNant();
        $scope.has_credit_mut=jsc3l.customization.hasCM();
        $scope.has_deleg=jsc3l.customization.hasDeleg();
        $scope.has_autor=jsc3l.customization.hasAutor();
        $scope.qr_content = localStorage.getItem('ComChainWallet');
        var qrcode = new QRCode(document.getElementById("qrcode_print_2"),$scope.qr_content);
        setTimeout(function(){ document.getElementById("qrcode_print_2").getElementsByTagName('img')[0].style.display="inline";},100); 
        
        globalFuncs.canUseFingerprint(function(result){
             $scope.fingerprint = result;
        });
     
        
	});
    
	$scope.setBalance = async function() {
        $scope.token.balance = await jsc3l.bcRead.getGlobalBalance($scope.currentWalletAddress);
        $scope.token.balanceEL = await jsc3l.bcRead.getNantBalance($scope.currentWalletAddress);
        $scope.token.balanceCM = await jsc3l.bcRead.getCmBalance($scope.currentWalletAddress);
        $scope.token.limitCMm = await jsc3l.bcRead.getCmLimitBelow($scope.currentWalletAddress);
        $scope.token.limitCMp = await jsc3l.bcRead.getCmLimitAbove($scope.currentWalletAddress); 
        $scope.$apply();  
        globalFuncs.hideLoadingWaiting();
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
        var file_name = globalFuncs.cleanName($translate.instant("PDF_Priv_file")) +'_'+$scope.currentWalletAddress+'.pdf';
        pdf_doc.save(file_name);
    }

	$scope.printQRCode = function() {
        if (!$scope.isApp) {
         globalFuncs.generateSaveQR($scope.currentWalletAddress);

         setTimeout(function(){ 
             globalFuncs.generateSavePDF(
                $translate.instant("PDF_Private_title"),
                $translate.instant("PDF_Private_private"),
                $scope.currentWalletAddress,
                $scope.callback);
         },100); 
       
       }
       $scope.qrModal.open();
	}
    
   $scope.qrBackup = function(piece) {
       globalFuncs.generateSaveQRPiece($scope.currentWalletAddress,piece);
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
    
    
      $scope.loadDelegations = async function(count,offset){

        $scope.noDelegation = true;
        $scope.noMoreDelegation = true;
        if (offset>0){
            document.getElementById("prevDeleg").style.display = 'block';
            $scope.noDelegation = false;
        } else {
             document.getElementById("prevDeleg").style.display = 'none';

        }

        document.getElementById("nextDeleg").style.display = 'none';


        const list = await jsc3l.bcRead.getDelegationList($scope.wallet.getAddressString(),offset,offset+count-1);
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
    
    
   $scope.fingetrprintUnlock = function(){
        globalFuncs.unlock(function(result){
                if (result) {
                    $scope.trPass=walletService.password;
         }
        });
   }  
    
    $scope.saveNewDeleg = async function(){
        if ($scope.trPass==walletService.password){
            walletService.setUsed();
          
            
            if ($scope.curraddress.length!=$scope.currentWalletAddress.length  || $scope.curraddress==$scope.currentWalletAddress)  {
                document.getElementById('delStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("DELEG_NotAcceptedAddress")));
            } else if (isNaN($scope.currDelLimit)  || $scope.currDelLimit<=0){
                 document.getElementById('delStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("DELEG_InvalidDelegationLimit")));
            } else {
               const res = await jsc3l.bcTransaction.setDelegation($scope.wallet, $scope.curraddress,$scope.currDelLimit);
               if (res.isError){
                    globalFuncs.hideLoadingWaiting();
			        document.getElementById('delStatus').innerHTML= $sce.trustAsHtml(globalFuncs.getDangerText(res.error));
                } else {
                   $scope.waitTransaction(res.data);
                   document.getElementById('transDelStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("Deleg_order_create_send")));
                   $scope.addDelegationModal.close();
                   $scope.confStatus = $translate.instant("Deleg_order_create_send");
                   
                   $scope.trans_message = $translate.instant("Deleg_order_create_send")+ " " +$translate.instant("GP_Wait_tran");
                }
            }
        } else {
              document.getElementById('delStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("WIEW_WrongPass")));
        }
    }
    
    
    // contacts
    $scope.contactPop = function() {
      $scope.NoCtc= $scope.contacts.length==0;
      $scope.dest = "";
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
        $scope.dest = address;
        $scope.selectedName = name;
        $scope.closeCttPop();
    }
    
    $scope.getCttName = function(){
        $scope.selectedName = contactservice.getContactName($scope.contacts, $scope.curraddress); 
    }
    

    
    
    $scope.helloToAddress = function(text){
      var add_obj = globalFuncs.parseAddress(text);  
      if (add_obj.address){
          $scope.curraddress=add_obj.address;
          $scope.dest=add_obj.address;
          $scope.selectedName = contactservice.getContactName($scope.contacts, add_obj.address); 
      } else {
          
          $scope.curraddress='';
          $scope.dest='';
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
    
    

    
    $scope.saveEditDeleg = async function(){
        if ($scope.trPass==walletService.password){
            walletService.setUsed();
          
            if (isNaN($scope.currDelLimit)  || $scope.currDelLimit<=0){
                 document.getElementById('delEditStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("DELEG_InvalidDelegationLimit")));
            } else {
                const res = await jsc3l.bcTransaction.setDelegation($scope.wallet, $scope.curraddress,$scope.currDelLimit);
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
    
    
     $scope.saveDeleteDeleg = async function(){
        if ($scope.trPass==walletService.password){
            walletService.setUsed();
            const res = await jsc3l.bcTransaction.setDelegation($scope.wallet, $scope.curraddress,-1);
            if (res.isError){
                globalFuncs.hideLoadingWaiting();
                document.getElementById('delDeleteStatus').innerHTML= $sce.trustAsHtml(globalFuncs.getDangerText(res.error));
            } else {
               $scope.waitTransaction(res.data);
               document.getElementById('transDelStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("Deleg_order_delete_send")));
               $scope.deleteDelegationModal.close();
               $scope.confStatus = $translate.instant("Deleg_order_delete_send");
               $scope.trans_message = $translate.instant("Deleg_order_delete_send")+ " " +$translate.instant("GP_Wait_tran");
              
            }
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
    
      
    $scope.loadAllowances= async function(count,offset){

         $scope.noAllowance = true;
         $scope.noMoreAllowance = true;
         if (offset>0){
              document.getElementById("prevAllow").style.display = 'block';
              $scope.noAllowance = false;
          } else {
               document.getElementById("prevAllow").style.display = 'none';
          
          }
          
          document.getElementById("nextAllow").style.display = 'none';
        
          
         const list = await jsc3l.bcRead.getAllowanceList($scope.wallet.getAddressString(),offset,offset+count-1);
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
    
    
    $scope.saveNewAllow = async function(){
      if ($scope.trPass==walletService.password){
           walletService.setUsed();
           
            if ($scope.curraddress.length!=$scope.currentWalletAddress.length  || $scope.curraddress==$scope.currentWalletAddress)  {
                document.getElementById('allowStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("ALLOW_NotAcceptedAddress")));
            }  else if (isNaN($scope.currAllowAmount)  || $scope.currAllowAmount<=0){
                 document.getElementById('allowStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("ALLOW_InvalidAmount")));
            } else {
                const res = await jsc3l.bcTransaction.setAllowance($scope.wallet, $scope.curraddress,$scope.currAllowAmount);
                if (res.isError){
                    globalFuncs.hideLoadingWaiting();
		            document.getElementById('allowStatus').innerHTML= $sce.trustAsHtml(globalFuncs.getDangerText(res.error));
                } else {
                   $scope.waitTransaction(res.data);
                   document.getElementById('transAllowStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("ALLOW_order_create_send")));
                   
                   $scope.addAllowanceModal.close();
                   $scope.confStatus = $translate.instant("ALLOW_order_create_send");
                   
                   $scope.trans_message = $translate.instant("ALLOW_order_create_send")+ " " +$translate.instant("GP_Wait_tran");
                } 
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
    

    
    $scope.saveEditAllowance = async function(){
        if ($scope.trPass==walletService.password){
            walletService.setUsed();
          
            if (isNaN($scope.currAllowAmount)  || $scope.currAllowAmount<=0){
                 document.getElementById('allowEditStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("ALLOW_InvalidAmount")));
            } else {
                const res = await jsc3l.bcTransaction.setAllowance($scope.wallet, $scope.curraddress,$scope.currAllowAmount);
                if (res.isError){
                    globalFuncs.hideLoadingWaiting();
		            document.getElementById('allowEditStatus').innerHTML= $sce.trustAsHtml(globalFuncs.getDangerText(res.error));
                } else {
                   $scope.waitTransaction(res.data);
                   document.getElementById('transAllowStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("ALLOW_order_edit_send")));
                   $scope.editAllowanceModal.close();
                   $scope.confStatus = $translate.instant("ALLOW_order_edit_send");
                   
                   $scope.trans_message = $translate.instant("ALLOW_order_edit_send")+ " " +$translate.instant("GP_Wait_tran");
                } 
          
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
    

     $scope.saveDeleteAllowance = async function(){
        if ($scope.trPass==walletService.password){
           walletService.setUsed();
           const res = await jsc3l.bcTransaction.setAllowance($scope.wallet, $scope.curraddress,-1);
           if (res.isError){
                globalFuncs.hideLoadingWaiting();
		        document.getElementById('allowDeleteStatus').innerHTML= $sce.trustAsHtml(globalFuncs.getDangerText(res.error));
            } else {
               $scope.waitTransaction(res.data);
               document.getElementById('transAllowStatus').innerHTML=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("ALLOW_order_delete_send")));
               $scope.deleteAllowanceModal.close();
               $scope.confStatus = $translate.instant("ALLOW_order_delete_send");
               $scope.trans_message = $translate.instant("ALLOW_order_delete_send")+ " " +$translate.instant("GP_Wait_tran");
            }  
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
      
      $scope.interval_id = setInterval(async function(){

          const block_json = await jsc3l.ajaxReq.getBlock(transaction_ash)
              // CHANGE BEHAVIOR: HIDE DIRECTLY THE WEELS
              // if (block_json.blockNumber && block_json.blockNumber.startsWith('0x')){
                 $scope.recievedTransaction();
              //}
      },5000);  
  }  
  
  
  /////////////////////////////////////////
  
  $scope.handleConsultRight = function() {
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.consult_rights = consultService.loadConsults($scope.wallet.getAddressString());
       $scope.loadRights();
       document.getElementById('consultRightTab_tab').style.display="inline-block"; 
       setTimeout(function () {
        document.getElementById('consultRightTab_tab').style.top="62px";
       }, 200);
  }
  
  $scope.closeCRI = function() {
    document.getElementById('consultRightTab_tab').style.top="100%";
         setTimeout(function () {
              document.getElementById('consultRightTab_tab').style.display="none"; 
         }, 700);  
  }
  

  $scope.loadRights= function(){
      for (var id in $scope.consult_rights){
          try{
              $scope.consult_rights[id].name = contactservice.getContactName($scope.contacts, $scope.consult_rights[id].data.address); 
              $scope.consult_rights[id].valid = ((new Date($scope.consult_rights[id].data.end)).getTime() >= (new Date()).getTime());
              
          } catch(e){}
      }
      
      $scope.NoCR= $scope.consult_rights.length==0;
      globalFuncs.hideLoadingWaiting();  
  }
  
   $scope.createRight= function() {
        $scope.dest = "";
        $scope.selectedName = "";
        $scope.trPass = walletService.getPass();
        document.getElementById('createStatus').innerHTML = "";
        $scope.createRightModal.open();
        $scope.balanceView = 0;
        $scope.oldTran = 0;
    }
    
     $scope.qrRight = function(piece) {
       $scope.generateSaveQRPiece(piece);
   }
   
   
   
   $scope.generateSaveQRPiece  = function(piece) {
    
    var container = document.getElementById("qrcode_consultRight");
    var child = container.lastElementChild;  
    while (child) { 
        container.removeChild(child); 
        child = container.lastElementChild; 
    }
    
    var mess_keys = jsc3l.message.messageKeysFromWallet($scope.wallet);
    
    var obj_content = {"address":$scope.wallet.getAddressString(), 
              "server":jsc3l.customization.getCurrencyName(), 
              "destinary":$scope.dest,
              "begin":$scope.start_date.getFullYear()+ "/" + ($scope.start_date.getMonth()+1)+"/" + $scope.start_date.getDate(), 
              "end":$scope.end_date.getFullYear()+ "/" + ($scope.end_date.getMonth()+1)+"/" + $scope.end_date.getDate(), 
              "viewbalance": ($scope.balanceView == 1),
              "viewoldtran": ($scope.oldTran == 1)
    };
    
   
    if ($scope.dest_keys.public_key !== undefined) {
        var crypted_m_key = jsc3l.message.cipherMessage($scope.dest_keys.public_key, mess_keys.clear_priv);
        obj_content.message_key = crypted_m_key;
    }
    
    
    var str_content = JSON.stringify(obj_content);
    var hash = jsc3l.ethUtil.sha3(str_content);
    var signature = jsc3l.ethUtil.ecsign(hash, $scope.wallet.privKey);
    var output = {"data":obj_content, "signature":{ "v":signature.v,
    "r":'0x' + signature.r.toString('hex'),
    "s":'0x' + signature.s.toString('hex')}};
    $scope.qr_cr_content =  JSON.stringify(output);
    
    
    
    
    var full= $scope.qr_cr_content;
    var chunk_length = Math.ceil(full.length/$scope.CR_frag_number);
        
    if (piece <0){
        var qrcode = new QRCode(document.getElementById("qrCR_print"), $scope.qr_cr_content);
        document.getElementById("qrCR_print").style.display = "none";
        for (var i=0; i<$scope.CR_frag_number;i++) {
            var string = "FRAG_CR"+signature.s.toString('hex').substring(2,6)+i.toString()+full.substring(chunk_length*i,Math.min(chunk_length*(i+1),full.length));
            var qrcode = new QRCode(document.getElementById("qrCR_print" + i.toString()),string); 
            document.getElementById("qrCR_print" + i.toString()).style.display = "none";
        } 
    } else if (piece == 0) {
        var qrcode = new QRCode(document.getElementById("qrcode_consultRight"), $scope.qr_cr_content);
    } else {
        var i = piece -1;
       
        var string = "FRAG_CR"+signature.s.toString('hex').substring(2,6)+i.toString()+full.substring(chunk_length*i,Math.min(chunk_length*(i+1),full.length));
        var qrcode = new QRCode(document.getElementById("qrcode_consultRight"),string);
    }  
 
}
   
   
    $scope.callback_consult = function(pdf_doc){
        var file_name = "CONSULT_"+ $scope.wallet.getAddressString()+"_for_"+$scope.dest+'.pdf';
        pdf_doc.save(file_name);
    }
    
    
    $scope.createConsultRight = async function() {
       if ($scope.start_date.getTime()>=$scope.end_date.getTime()) {
           document.getElementById('createStatus').innerHTML = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("CRI_wrongDates"))); 
       } else if ($scope.trPass==walletService.password){
           walletService.setUsed();       
           $scope.createRightModal.close();
           $scope.trPass="";
           $scope.dest_keys = await jsc3l.message.getMessageKey($scope.dest, false); 

           // processing
           $scope.generateSaveQRPiece(-1);
           $scope.generateSaveQRPiece(0);
           $scope.dislayQRModal.open();

           if (!$scope.isApp) {
               // export .dat file
               $scope.blobCrEnc = globalFuncs.getBlob("text/json;charset=UTF-8", $scope.qr_cr_content);
               document.getElementById('dwonloadBtn').click();
                   
               // export pdf 
               setTimeout(function(){ 
                     globalFuncs.generateCrPDF(
                        $translate.instant("PDF_CR_Title"),
                        $translate.instant("PDF_CR_On"),
                        $translate.instant("PDF_CR_Assigned"),
                        globalFuncs.cleanName($translate.instant("PDF_CR_Validity")) + " " + $scope.start_date.getFullYear()+ "/" + $scope.start_date.getMonth()+"/" + $scope.start_date.getDate() +"-"+
                        $scope.end_date.getFullYear()+ "/" + $scope.end_date.getMonth()+"/" + $scope.end_date.getDate(), 
                        $scope.currentWalletAddress,
                        $scope.dest,
                        $scope.qr_cr_content,                       
                        $scope.callback_consult);
                 },100); 
           }
       } else {
           document.getElementById('createStatus').innerHTML = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("TRAN_WrongPass")));

       }
    };

    

$scope.showContent = function(content) {
    $scope.openStatus = "";
    try {
        // decode the Json
        var obj = JSON.parse(content);
        // extract the signature
        var v = obj.signature.v;
        var r = obj.signature.r; 
        var s = obj.signature.s; 

        // get the hash
        var str_content = JSON.stringify(obj.data);
        var hash = jsc3l.ethUtil.sha3(str_content);
        
        // check the signature
        var public_sign_key = jsc3l.ethUtil.ecrecover(hash, v, r, s);
        var rec_address = jsc3l.ethUtil.bufferToHex(jsc3l.ethUtil.publicToAddress(public_sign_key));
        if (rec_address != obj.data.address) {
            $scope.openStatus = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('OPEN_not_right_sign')));    
        } else {
           // check the validity 
           if (obj.data.destinary!=$scope.wallet.getAddressString()){
               $scope.openStatus = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('OPEN_right_not_for_you'))); 
           } else if (obj.data.server!=jsc3l.customization.getCurrencyName()){
               $scope.openStatus = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('OPEN_right_not_right_server'))); 
           } else if ((new Date(obj.data.end)).getTime()< (new Date()).getTime()){   
                $scope.openStatus = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('OPEN_too_old_right'))); 
           } else {    
               // OK we can close the popup
               $scope.openRightModal.close();  
               // add to the right
               consultService.addConsult(obj);
               //reload the grid
               $scope.consult_rights = consultService.loadConsults($scope.wallet.getAddressString()); 
               $scope.loadRights();
           }
        }
        
    
    } catch (e) {
         $scope.openStatus = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('OPEN_not_right_format'))); 
    }
    
  
    
    
}  
    
    
$scope.importRightPop = function() {
    $scope.cancelFragment();
    $scope.openRightModal.open();
}

$scope.selectFile = function() {
	    document.getElementById('fileSelector').click();
};



$scope.fileContent = function($fileContent) {
    if (document.getElementById('fileSelector').files[0]){
        $scope.openStatus = $sce.trustAsHtml(globalFuncs.getSuccessText(document.getElementById('fileSelector').files[0].name));    
    }
    
	try {
        $fileContent = $fileContent.replace(/(\n|\r|\ )/gm, "");
        $scope.checkForFragment($fileContent);
        
	} catch (e) {
		$scope.openStatus = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('CRI_ERROR_FILE')));
	}
};


$scope.scanQR = function() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
	        $scope.helloPaperWallet(result.text);
        }, 
        function (error) {
	        alert("Scanning failed: " + error);
        }, {'SCAN_MODE': 'QR_CODE_MODE'}
    );
}


$scope.helloPaperWallet = function(text){
   $scope.checkForFragment(text);
   $scope.$apply();
}
    

    
    
 $scope.checkForFragment = function(content){
   if (content.startsWith('FRAG_CR')){
       $scope.showFragements = true;
       var id = content.substring(7,11);
       if ( $scope.partial_id==""){
            $scope.partial_id = id;
       }
       if (id!=$scope.partial_id){
          $scope.openStatus = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('OPEN_Frag_Wrong_ID'))); 
         //error expecting fragement with same id  
       } else {
           var number = content.substring(11,12);
           if (!(number in $scope.partial_content)){
              var cont= content.substring(12);
              $scope.partial_content[number]=cont;
              
              $scope.partial_prog+=1;
              
              if ($scope.partial_prog==$scope.CR_frag_number){
                  //end of input
                  var full="";
                  for (var i=0;i<$scope.CR_frag_number;i++){
                      full+=$scope.partial_content[i.toString()];
                  }
                  $scope.partial_content={};
                  $scope.partial_id="";
                  $scope.partial_prog=0;
                  $scope.showFragements = false;
                  $scope.fileStatusFrag="";
                  $scope.showContent(full);
                  
              } else {
                  // ok need more input
                    $scope.openStatus = $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant('OPEN_Frag_Read'))); 
                    scanQR();
              }
           }else {
               // error fragment already know
                $scope.openStatus = $sce.trustAsHtml(globalFuncs.getWarningText($translate.instant('OPEN_Frag_Already_Know'))); 
           }
       }
   } else if ( $scope.partial_id!="") {
          $scope.openStatus = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('OPEN_Frag_Not_Frag'))); 
   } else {
        $scope.showContent(content);
   }
}


$scope.cancelFragment = function(){
    $scope.partial_content={};
    $scope.partial_id=""; 
    $scope.partial_prog=0;
    $scope.openStatus="";
}

$scope.deleteCR = function(r){
    var index=-1;
    for (var i=$scope.consult_rights.length-1;i>=0;i--){
        if ($scope.consult_rights[i].signature.r == r){
            index = i;
        }
    }
        
    var right_obj = $scope.consult_rights[index];    
    
    
    
    $scope.del_address = right_obj.data.address;
    $scope.del_start_date = new Date(right_obj.data.begin);
    $scope.del_end_date = new Date(right_obj.data.end);
    $scope.del_obj = right_obj;
    $scope.deleteConsultModal.open();
}

$scope.deleteConsultRight = function() {
    $scope.deleteConsultModal.close();
    consultService.deleteConsult($scope.del_obj);
    $scope.consult_rights = consultService.loadConsults($scope.wallet.getAddressString()); 
    $scope.loadRights();
}
    
  
    
    
    
};
module.exports = balanceCtrl;


