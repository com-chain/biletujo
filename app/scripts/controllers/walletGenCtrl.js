'use strict';
var walletGenCtrl = function($scope, $globalService, $translate, walletService, contactService) {
    // Environment variables
    $scope.isApp = globalFuncs.isApp();
    $scope.trans_message = $translate.instant("GP_Wait");
    $scope.CUR = globalFuncs.currencies.CUR;
    
    // Controler variables
    //  popup
    $scope.confirmCreateModal = new Modal(document.getElementById('confirmCreate'));
    
    //  UI switch
    $scope.showSecret = false;
	$scope.showWallet = false;
    $scope.isDone = true;
    $scope.showPass = true;
    
    //  UI message
    $scope.message_creation='';
    
    //  Data
    $scope.token = "";
	$scope.password = "";
	$scope.wallet = null;
	$scope.blobEnc = "";
    
    $scope.cond1=false;
    $scope.cond2=false;
    //////////////////////
    
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
    $scope.validateToken =function(){
        globalFuncs.showWaiting($scope.trans_message); // display the waiting overlay
        $scope.message_creation=''; // reset status message
        try {
            var enrollmentLetter = JSON.parse($scope.token); 
            if (enrollmentLetter.servername){
                if (globalFuncs.isMulti()){
                     globalFuncs.getConfJSON(enrollmentLetter.servername,function(success){
                         if (success){
                           ajaxReq.validateEnrollmentLetter(enrollmentLetter.id, 
                                                            globalFuncs.getServerName(), 
                                                            enrollmentLetter.signature,
                                                            function(data){
                                globalFuncs.hideLoadingWaiting(); // hide the waiting overlay
                                if (data.result=="OK"){
                                   $scope.enrollmentLetter = enrollmentLetter; 
                                   $scope.enrollmentToken = data.token;
                                   // Enable next step:
                                   $scope.showSecret = true;
                                   $scope.message_creation = '';
                                   // Adapt the UI to the selected server
                                   globalFuncs.configure();
                                   $globalService.configureNoteTab(globalFuncs.hasBn());
                                   $scope.CUR=globalFuncs.currencies.CUR;
                               }  else {
                                   $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_Token_validation_KO"));
                               } 
                           });
                        }  else {
                             globalFuncs.hideLoadingWaiting(); // hide the waiting overlay
                             $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_No_server"));
                        }
                        
                        $scope.$apply(); 
                   });
                } else {
                   ajaxReq.validateEnrollmentLetter(enrollmentLetter.id, 
                                                    globalFuncs.getServerName(), 
                                                    enrollmentLetter.signature,
                                                    function(data){
                        globalFuncs.hideLoadingWaiting();  // hide the waiting overlay
                        if (data.result=="OK"){
                           $scope.enrollmentLetter = enrollmentLetter; 
                           $scope.enrollmentToken = data.token;
                           // Enable next step:
                           $scope.showSecret = true;
                           $scope.message_creation = '';
                       } else {
                           $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_Token_validation_KO"));
                       } 
                    });
                } 
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
        var cond = globalFuncs.getCondUrl();
        window.open(cond.replace('LANG',$scope.gelLanguageCode()), "_system");
    }
    
    //  Create and enroll the wallet
	$scope.createWallet = function() {
		if (!$scope.isStrongPass()){
			alert($translate.instant('ERROR_2'));
		} else if($scope.isDone){ // protect against multiple click
            $scope.confirmCreateModal.close(); // close the popup
            globalFuncs.showWaiting($scope.trans_message); // display the waiting overlay
            $scope.isDone = false;
            
            // local wallet generation & encryption with the provided password
			$scope.wallet = Wallet.generate(false); 
			$scope.blobEnc = globalFuncs.getBlob("text/json;charset=UTF-8", $scope.wallet.toV3($scope.password, {
				kdf: globalFuncs.kdf,
                n: globalFuncs.scrypt.n,
                server_name: globalFuncs.getServerName()                                                                            
			}));
            
            //Send (public) address to API (enroll the wallet)
            try {
                 ajaxReq.enrollAddress($scope.enrollmentLetter.id,
                                       $scope.wallet.getAddressString(), 
                                       globalFuncs.getServerName(),
                                       $scope.enrollmentToken,
                                       function(data){
                       if (data.result=="OK"){
                           globalFuncs.loadWallet($scope.wallet.toV3($scope.password, {
                                        kdf: globalFuncs.kdf, n: globalFuncs.scrypt.n,
                                        server_name: globalFuncs.getServerName() }),function(success){
                                            globalFuncs.loadWallets(true);
                                            
                                            // Enable next step 
                                            $scope.showWallet = true;
                                            $scope.showSecret = false; 
                                            $scope.message_creation=""; 
                                            
                                            $scope.$apply();
                                            // Add itself as a contact to the newly created wallet
                                            contactService.ensureContact($scope.wallet.getChecksumAddressString());
                                            contactService.storeIpfsContact($scope.wallet,$scope.password);
                                        });   
                        } 
                        else {
                            $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_Enrollment_KO"));
                        }
                 });
             } catch (e) {
                $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_Enrollment_Error"));  
             }
      
            $scope.isDone = true;
            globalFuncs.hideLoadingWaiting();  // hide the waiting overlay
		}
	}
    
    // Save the (encrypted) wallet as a json file
    $scope.dowloadAppFile = function(){
        globalFuncs.dowloadAppFile($scope.wallet, $scope.wallet.toV3($scope.password, {
		        kdf: globalFuncs.kdf,
                n: globalFuncs.scrypt.n,
                server_name: globalFuncs.getServerName()
        }));
    }
    
    // Save the (encrypted) wallet as a pdf with QR
	$scope.printQRCode = function() {
      globalFuncs.generateSaveQR();
      // Wait for the QR generation
      setTimeout(function(){
         globalFuncs.generateSavePDF($translate.instant("PDF_Private_title"), 
                                     $translate.instant("PDF_Private_private"),
                                     function(img){
                 var file_name = globalFuncs.cleanName($translate.instant("PDF_Priv_file")) +'_'+$scope.currentWalletAddress+'.pdf';
                 img.save(file_name);
          });
       },100); 
	}  
};

module.exports = walletGenCtrl;
