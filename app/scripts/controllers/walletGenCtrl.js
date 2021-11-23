'use strict';
var walletGenCtrl = function($scope, $globalService, $translate, walletService, contactService) {
    // Environment variables
    $scope.isApp = isApp();
    $scope.trans_message = $translate.instant("GP_Wait");
    $scope.CUR = globalFuncs.currencies.CUR;
    
    // Controler variables
    //  popup
    $scope.confirmCreateModal = new Modal(document.getElementById('confirmCreate'));
    
    //  UI switch
    $scope.step1_2 = true;
    $scope.enter_token = true;
    $scope.showSecret = false;
	$scope.showWallet = false;
    $scope.show_syncro = false;
    $scope.isDone = true;
    $scope.showPass = true;
    $scope.wallet_address = "https://wallet.cchosting.org";
    
    $scope.downloaded_dat=false;
    $scope.downloaded_pdf=false;
    $scope.downloaded_howto=false;
    $scope.howtoUrl ='';
    $scope.has_howto=false;
    
    //  UI message
    $scope.message_creation='';
    
    //  Data
    $scope.token = "";
	$scope.password = "";
	$scope.wallet = null;
	$scope.blobEnc = "";
    
    $scope.cond1=false;
    $scope.cond2=false;
    
    $scope.unlock_url = jsc3l.customization.getUnlockUrl();
    //////////////////////
    
    // Look for code
    
     var currCode = $globalService.getCurrCode();
     if (currCode!=undefined && currCode!=""){
         $scope.token=currCode;
         $globalService.clearCurrCode();
     }
    
    ///////////////////////
    
    // Show the page
    globalFuncs.hideLoadingWaiting();
    
    
    // Helper functions
    $scope.gelLanguageCode = function(){
        var lang = localStorage.getItem('language');
        if (lang == null) return 'fr';
        lang = JSON.parse(lang);
        return lang.key;
    }
    
    $scope.isStrongPass = function(){
        return globalFuncs.isStrongPass($scope.password);
    }
    
    // User interaction:
    //  Scan autorization token
    $scope.helloToken = function(text){
        $scope.token = text;
        $scope.$apply();
    }
    
    $scope.startScanToken = function(){
        cordova.plugins.barcodeScanner.scan(
		    function (result) {
			    $scope.helloToken(result.text);
		    }, 
		    function (error) {
			    alert("Scanning failed: " + error);
		    }, 
            {'SCAN_MODE': 'QR_CODE_MODE'}
	    );
    };
    
    //  Validate autorization token
    $scope.validateToken = async function(){
        globalFuncs.showWaiting($scope.trans_message); // display the waiting overlay
        $scope.message_creation=''; // reset status message
        try {
            var enrollmentLetter = JSON.parse($scope.token); 
            if (enrollmentLetter.servername){
                     const success = await jsc3l.customization.getConfJSON(enrollmentLetter.servername);
                     if (success){
                       const data = await jsc3l.wallet.validateEnrollment(enrollmentLetter.id, enrollmentLetter.signature).then(function(data) {
                        globalFuncs.hideLoadingWaiting(); // hide the waiting overlay
                        if (data.result=="OK"){
                           $scope.enrollmentLetter = enrollmentLetter; 
                           $scope.enrollmentToken = data.token;
                           // Enable next step:
                           $scope.showSecret = true;
                           $scope.enter_token = false;
                           $scope.message_creation = '';
                           // Adapt the UI to the selected server
                           jsc3l.customization.configureCurrency();
                           globalFuncs.getCurrencies();
                           $globalService.configureNoteTab(jsc3l.customization.hasBn());
                           $scope.CUR=globalFuncs.currencies.CUR;
                           
                           
                           $scope.unlock_url = jsc3l.customization.getUnlockUrl();
                           if ($scope.unlock_url==undefined){
                               $scope.unlock_url="";
                           }
                           $scope.has_unlock  = false; //$scope.unlock_url.length;
                       }  else {
                           $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_Token_validation_KO"));
                       }
                       });
                    }  else {
                         globalFuncs.hideLoadingWaiting(); // hide the waiting overlay
                         $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_No_server"));
                    }
                    
                    $scope.$apply(); 
           
             } else {
                  globalFuncs.hideLoadingWaiting();  // hide the waiting overlay
                  $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_No_config"));
             }
        } catch (e) {
            globalFuncs.hideLoadingWaiting();
            $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_Token_validation_error"));
        }  
        
    }
    
    //  Cancel creation
    $scope.cancelCreate = function(){
        globalFuncs.removeWallet(); // remove the server config and (possibly) the wallet
        location.reload();
    }
    
    //  Open the creation confirmation popup
    $scope.genNewWallet = function() {
        if (!$scope.isStrongPass()) {
			alert($translate.instant('ERROR_2'));
		} else {
            $scope.cond1 = false;
            $scope.cond2 = false;
            $scope.confirmCreateModal.open();
        }
    }
    
    //  Open, in a new window, the General Usage Condition
    $scope.openGenCondition = function(){
        var cond = jsc3l.customization.getCondUrl();
        window.open(cond.replace('LANG',$scope.gelLanguageCode()), "_system");
    }
    
    //  Create and enroll the wallet
	$scope.createWallet = async function() {
		if (!$scope.isStrongPass()){
			alert($translate.instant('ERROR_2'));
		} else if($scope.isDone){ // protect against multiple click
            $scope.confirmCreateModal.close(); // close the popup
            globalFuncs.showWaiting($scope.trans_message); // display the waiting overlay
            $scope.isDone = false;
            
            // local wallet generation & encryption with the provided password
			$scope.wallet = await jsc3l.wallet.createWallet();
                try {
                    //Send (public) address to API (enroll the wallet)
                    const success = await jsc3l.wallet.enrollAddress($scope.wallet, $scope.enrollmentLetter.id, $scope.enrollmentToken);
                        if (success) {
                            
                            if ($scope.unlock_url != undefined && $scope.unlock_url!="") {
                                  jsc3l.ajaxReq.requestUnlock($scope.wallet.getAddressString()).then($scope.unlock_url);
                            }
                            
                            await globalFuncs.loadWallet(jsc3l.wallet.encryptWallet($scope.wallet, $scope.password));
                                                globalFuncs.loadWallets(true);
                                                
                                                // Enable next step 
                                                $scope.showWallet = true;
                                                $scope.showSecret = false; 
                                                $scope.step1_2 = false;
                                                $scope.message_creation=""; 
                                                
                                                $scope.downloaded_dat=false;
                                                $scope.downloaded_pdf=false;
                                                $scope.downloaded_howto=false;
                                                
                                                $scope.howtoUrl = jsc3l.customization.getHowToUrl();
                                                
                                                $scope.has_howto=$scope.howtoUrl!='';
                                                
                                                $scope.blobEnc = globalFuncs.getBlob("text/json;charset=UTF-8", localStorage.getItem('ComChainWallet'));
                                                
                                                $scope.$apply();
                                                // Add itself as a contact to the newly created wallet
                                                
                                                var contacts = [];
                                                contacts = contactService.ensureContact(contacts, $scope.wallet.getChecksumAddressString());
                                                contactService.storeIpfsContact(contacts, $scope.wallet,$scope.password);
                                                
                                                $scope.isDone = true;
                                                globalFuncs.hideLoadingWaiting();  // hide the waiting overlay 
                        } else {
                            $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_Enrollment_KO"));
                            $scope.isDone = true;
                            globalFuncs.hideLoadingWaiting();  // hide the waiting overlay 
                             
                        }
                      
                } catch (e) {
                    $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_Enrollment_Error"));  
                    $scope.isDone = true;
                    globalFuncs.hideLoadingWaiting();  // hide the waiting overlay 
                }
          
               
	    }
    }
    
    // Save the (encrypted) wallet as a json file
    $scope.dowloadAppFile = function(){
        globalFuncs.dowloadAppFile($scope.wallet, localStorage.getItem('ComChainWallet'));
    }
    
    // Save the (encrypted) wallet as a pdf with QR
	$scope.printQRCode = function() {
      globalFuncs.generateSaveQR($scope.wallet.getAddressString());
      // Wait for the QR generation
      setTimeout(function(){
         globalFuncs.generateSavePDF($translate.instant("PDF_Private_title"), 
                                     $translate.instant("PDF_Private_private"),
                                     $scope.wallet.getAddressString(),
                                     function(pdf_doc){
                var file_name = globalFuncs.cleanName($translate.instant("PDF_Priv_file")) +'_'+$scope.wallet.getAddressString()+'.pdf';
                pdf_doc.save(file_name); 
                $scope.downloaded_pdf= true;
          });
       },100); 
	} 
    
    $scope.saveDat = function(){
        $scope.downloaded_dat = true;
        document.getElementById("btn_dat").click();
    }
    
    $scope.saveHow = function () {
        $scope.downloaded_howto = true;
        document.getElementById("btn_how").click();
    }
   
    $scope.display_synchro = function(){
        if (!$scope.downloaded_pdf || !$scope.downloaded_dat || ($scope.has_howto && !$scope.downloaded_howto)) {
            alert($translate.instant("GEN_Save_alrt")); 
        } else {
            var wallet = jsc3l.customization.getWalletAddress();
            if (wallet!='') {
                $scope.wallet_address = wallet;
            }
	        $scope.showWallet = false;
            $scope.show_syncro = true;
        }
        
        
    } 
    
    $scope.reload_acc = function() {
        var message = jsc3l.customization.getCreationMessage();
        if (message != undefined && message!="") {
            alert(message);
        }
        
        location.reload(); 
    }
    


};





module.exports = walletGenCtrl;
