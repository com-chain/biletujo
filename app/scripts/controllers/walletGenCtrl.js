'use strict';
var walletGenCtrl = function($scope,$translate, walletService, contactService) {

    $scope.showToken=true;
    $scope.showSecret=false;
	$scope.showWallet = false;
    globalFuncs.hideLoadingWaiting();
    $scope.message_creation='';
    
    $scope.isApp =  globalFuncs.isApp();
    
    $scope.trans_message = $translate.instant("GP_Wait");
    $scope.CUR=globalFuncs.currencies.CUR;
    
    
    
    $scope.token="";
    
	$scope.password = "";
	$scope.wallet = null;
	$scope.blobEnc = "";
    $scope.isDone = true;
    $scope.showPass = true;
    
    $scope.confirmCreateModal = new Modal(document.getElementById('confirmCreate'));
    $scope.cond1=false;
    $scope.cond2=false;
    
    
    $scope.gelLanguageCode = function(){
        var lang = localStorage.getItem('language');
        if (lang == null) return 'fr';
        lang = JSON.parse(lang);
        return lang.key;
    }
    
    
    $scope.helloToken = function(text){
       $scope.token=text;
       $scope.$apply();
    }
    
    $scope.startScanToken = function(){
        cordova.plugins.barcodeScanner.scan(
		function (result) {
			$scope.helloToken(result.text);
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}, {'SCAN_MODE': 'QR_CODE_MODE'}
	    );
    };
    
    $scope.cancelCreate=function(){
        globalFuncs.removeWallet();
        location.reload();
    }
    
    $scope.validateToken =function(){
        globalFuncs.showWaiting($scope.trans_message);
        $scope.message_creation='';
        var enr_txt=document.getElementById("enr_tk").value;
        try {
            var enrollmentLetter = JSON.parse(enr_txt);  
            // Validation du token par un appel à l'API
            
             if (enrollmentLetter.servername){
               if (globalFuncs.isMulti()){
                     globalFuncs.getConfJSON(enrollmentLetter.servername,function(success){
                         globalFuncs.hideLoadingWaiting();
                         if (success){
                           ajaxReq.validateEnrollmentLetter(enrollmentLetter.id, globalFuncs.getServerName(), enrollmentLetter.signature,function(data){
                            globalFuncs.hideLoadingWaiting();
                            if (data.result=="OK"){
                               $scope.enrollmentLetter=enrollmentLetter; 
                               $scope.enrollmentToken=data.token;
                               $scope.showToken=false;
                               $scope.showSecret=true;
                               $scope.message_creation='';
                               
                               globalFuncs.configure();
                               $scope.CUR=globalFuncs.currencies.CUR;
                           }  else {
                                  $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_Token_validation_KO"));
                           } 
                         });
                        }  else {
                             $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_No_server"));
                        }
                        
                        $scope.$apply();
                    
                });
               } else {
                   //TODO error message if servername do not match
                   ajaxReq.validateEnrollmentLetter(enrollmentLetter.id, globalFuncs.getServerName(), enrollmentLetter.signature,function(data){
                        globalFuncs.hideLoadingWaiting();
                        if (data.result=="OK"){
                           $scope.enrollmentLetter=enrollmentLetter; 
                           $scope.enrollmentToken=data.token;
                           $scope.showToken=false;
                           $scope.showSecret=true;
                           $scope.message_creation='';
                       } else {
                              $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_Token_validation_KO"));
                       } 
                    });
               } 
                 
              
             } else {
                  globalFuncs.hideLoadingWaiting();
                  $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_No_config"));
             }
        } catch (e) {
            globalFuncs.hideLoadingWaiting();
            $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_Token_validation_error"));
        }  
        
    }
    
    $scope.genNewWallet = function() {
        if (!$scope.isStrongPass()) {
			alert($translate.instant('ERROR_2'));
		} else {
            $scope.cond1=false;
            $scope.cond2=false;
            $scope.confirmCreateModal.open();
        }
    }
    
	$scope.createWallet = function() {
		if (!$scope.isStrongPass()) {
			alert($translate.instant('ERROR_2'));
		} else if($scope.isDone){
            $scope.confirmCreateModal.close();
            globalFuncs.showLoading($translate.instant("GP_Wait"));
            $scope.isDone = false;
			$scope.wallet = Wallet.generate(false);

			$scope.blobEnc = globalFuncs.getBlob("text/json;charset=UTF-8", $scope.wallet.toV3($scope.password, {
				kdf: globalFuncs.kdf,
                n: globalFuncs.scrypt.n,
                server_name: globalFuncs.getServerName()                                                                              
			}));
            
        
            //Send address to API get validation
             try {
                 ajaxReq.enrollAddress($scope.enrollmentLetter.id,$scope.wallet.getAddressString(), globalFuncs.getServerName() ,$scope.enrollmentToken,function(data){
                   if (data.result=="OK"){
                       globalFuncs.loadWallet($scope.wallet.toV3($scope.password, {
                                    kdf: globalFuncs.kdf, n: globalFuncs.scrypt.n,
                                    server_name: globalFuncs.getServerName() }),function(success){
                                        globalFuncs.loadWallets(true);
                                        contactService.ensureContact($scope.wallet.getChecksumAddressString());
                                        $scope.showWallet = true;
                                        $scope.showSecret = false; 
                                        $scope.message_creation=""; 
                                        
                                        $scope.$apply();
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
      
            $scope.isDone =  true;
            globalFuncs.hideLoadingWaiting();
		}
	}
  $scope.dowloadAppFile = function(){
        globalFuncs.dowloadAppFile($scope.wallet, $scope.wallet.toV3($scope.password, {
				kdf: globalFuncs.kdf,
                n: globalFuncs.scrypt.n,
                server_name: globalFuncs.getServerName()
		}));
    }
    
	$scope.printQRCode = function() {
      globalFuncs.generateSaveQR();
       setTimeout(function(){
             globalFuncs.generateSavePDF($translate.instant("PDF_Private_title"), $translate.instant("PDF_Private_private"),function(img){
                 var file_name = globalFuncs.cleanName($translate.instant("PDF_Priv_file")) +'_'+$scope.currentWalletAddress+'.pdf';
                 img.save(file_name);
             
             });
          
       },100); 
	}

    $scope.isStrongPass = function(){
        return globalFuncs.isStrongPass($scope.password);
    }
    
    $scope.openGenCondition = function(){
        var cond = globalFuncs.getCondUrl();
        window.open(cond.replace('LANG',$scope.gelLanguageCode()), "_system");
    }
};
module.exports = walletGenCtrl;
