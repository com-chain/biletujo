'use strict';
var decryptWalletCtrl = function($scope, $sce, $translate, walletService, contactService, memoService, authenticationService, globalService) {
    $scope.isApp =  jsc3l.customization.isApp();
    globalFuncs.hideLoadingWaiting();
    
    
    if (document.getElementById('pickWalletFile')){
        $scope.pickWalletFileModal = new Modal(document.getElementById('pickWalletFile'));
    }

  
	$scope.requireFPass =false;
    $scope.showFDecrypt  = false;
	$scope.hideWalletSelector = false;
    $scope.showFragements = false;
    $scope.pasted_content = '';
    
    
    $scope.hasServerAddress = true;
    
    $scope.message_creation='';
    
    $scope.getCurrWallet = function(){
      try{   
          var current = JSON.parse(localStorage.getItem('ComChainWallet'));  
          if (current) {
              try{  
                var other_wallets = JSON.parse(localStorage.getItem('ComChainWallets')); 
              } catch(e){}
              
              if (!other_wallets){
                  other_wallets=[]; 
              }  
              
              var id_curr=-1;
              for (var id in other_wallets){
                 if (other_wallets[id].file.address==current.address){
                              $scope.currWallet = other_wallets[id].file;
                              break;
                  }
               }
            }
        } catch(e){
        }
    }
    
    $scope.getCurrWallet();
    
    
    $scope.fileStatusFrag="";
    $scope.partial_content={};
    $scope.partial_id="";
    $scope.partial_prog=0;
    $scope.checkForFragment = function(content){
       if (content.startsWith('FRAGMENT')){
           $scope.showFragements = true;
           var id = content.substring(8,12);
           if ( $scope.partial_id==""){
                $scope.partial_id = id;
           }
           if (id!=$scope.partial_id){
              $scope.fileStatusFrag = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('OPEN_Frag_Wrong_ID'))); 
             //error expecting fragement with same id  
           } else {
               var number = content.substring(12,13);
               if (!(number in $scope.partial_content)){
                  var cont= content.substring(13);
                  $scope.partial_content[number]=cont;
                  
                  $scope.partial_prog+=1;
                  
                  if ($scope.partial_prog==4){
                      //end of input
                      var full="";
                      for (var i=0;i<4;i++){
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
                      
                        $scope.fileStatusFrag = $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant('OPEN_Frag_Read'))); 
                        $scope.startScanPaperWallet();
                  }
               }else {
                   // error fragment already know
                   
                    $scope.fileStatusFrag = $sce.trustAsHtml(globalFuncs.getWarningText($translate.instant('OPEN_Frag_Already_Know'))); 
               }
           }
       } else if ( $scope.partial_id!="") {
              $scope.fileStatusFrag = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('OPEN_Frag_Not_Frag'))); 
       } else {
            $scope.showContent(content);
       }
    }
    
    
    $scope.cancelFragment = function(){
        $scope.partial_content={};
        $scope.partial_id=""; 
        $scope.partial_prog=0;
        $scope.fileStatusFrag="";
        $scope.showFragements = false;
    }
  
	$scope.showContent = function($fileContent) {
        if (document.getElementById('fselector').files[0]){
            $scope.fileStatus = $sce.trustAsHtml(globalFuncs.getSuccessText(document.getElementById('fselector').files[0].name)); 
            
        } else if ($scope.SelectedFileName){
             $scope.fileStatus = $sce.trustAsHtml(globalFuncs.getSuccessText($scope.SelectedFileName));
        } else {
            $scope.fileStatus =  $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant('OPEN_Paper_selected'))); 
        }
		try {
            $fileContent = $fileContent.replace(/(\n|\r|\ )/gm, "");
           
            
            var current = JSON.parse($fileContent);
            if (typeof current === 'undefined' || typeof current.address === 'undefined' || 
                (typeof current.Crypto === 'undefined' && current.crypto === 'undefined') ||  typeof current.id === 'undefined'||  
                typeof current.version === 'undefined'){
                throw 'Missformed file';
            }
			$scope.fileContent = $fileContent;
            $scope.showFDecrypt = true;
            
		} catch (e) {
			$scope.fileStatus = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('ERROR_4')));
		}
	};
    
    $scope.openFile = function(){              
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.fileContent = $scope.fileContent.replace(/(\n|\r|\ )/gm, "");
       globalFuncs.loadWallet(JSON.parse($scope.fileContent),function(success){
           if (success){

               globalFuncs.loadWallets(true);
               try{
                    var current = JSON.parse($scope.fileContent);
               } catch(e){}
               location.reload();
           } else { 
             globalFuncs.hideLoadingWaiting();
           }
       });
       
    }
    
    $scope.setAPINode = async function(){
        const success = await jsc3l.connection.testNode($scope.api);
        if (success){
            // store the node 
            localStorage.setItem('ComChainAPI', $scope.api);
            alert('API node set to ' + $scope.api);
            $scope.setApiNodeModal.close();
        }else{
            alert('Provided API node not valid / available');
        }
    }
    
    $scope.pickWallFile = function(name,index){
        $scope.SelectedFileIndex=index;
        $scope.SelectedFileName=name;
        
    }
    
    $scope.openWallFile =function(){
        if ( $scope.SelectedFileIndex>=0){
            var file_entry = $scope.dir_entries[ $scope.SelectedFileIndex];
            file_entry.file(function(file){
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                   if(this.result) {
                       $scope.pickWalletFileModal.close();
                       $scope.showContent(this.result);        
                       $scope.$apply();      
                   } 
                 };
                reader.onerror = function(evt) {};
                reader.readAsText(file);
            },function(){});   
        }
    }
    
    $scope.openPastedWallFile = function() {
         $scope.pickWalletFileModal.close();
         $scope.showContent($scope.pasted_content);        
         $scope.$apply(); 
    }
    
    $scope.success = function(entries) {
        var address_regex = /0x[a-z0-9]{40}/i;
        $scope.dir_entries=[];
        if (entries){
            for (var entry_id in entries){
                
                if (entries[entry_id].isFile && entries[entry_id].name.endsWith('.dat') ){
                     entries[entry_id].hasAddress= address_regex.test(entries[entry_id].name);
                     if (entries[entry_id].hasAddress){
                        entries[entry_id].address=address_regex.exec(entries[entry_id].name)[0];
                     }
                    
                    $scope.dir_entries.push(entries[entry_id]);
                }  
            }
        }
        $scope.len= $scope.dir_entries.length;
        $scope.SelectedFileIndex=-1;
        $scope.SelectedFileName='';
        $scope.$apply();
        $scope.pickWalletFileModal.open();
    }
    

    
    
    
	$scope.openFileDialog = function($fileContent) {
        if (!$scope.isApp){
		    document.getElementById('fselector').click();
        } else {
           globalFuncs.readCordovaDir($scope.success);  
        }
	};
    
	$scope.onFilePassChange = function() {
		$scope.showFDecrypt = $scope.filePassword.length > 7;
	};
	

    $scope.confirmForgetWallet = function(){
        /* clear the local storage and reload the page */
        $scope.password = "";
	    $scope.wallet = null;
	    $scope.showWallet = false;
	    $scope.blob = $scope.blobEnc = "";
        $scope.isDone = true;
        $scope.showPass = true;
        globalFuncs.removeWallet();
        location.reload();
    }
    
	$scope.decryptWallet = async function() {
        if (document.getElementById('passwdField').value=="SetApiNode"){
            document.getElementById('passwdField').value='';
             if (document.getElementById('setApiNode')){
                $scope.setApiNodeModal = new Modal(document.getElementById('setApiNode'));
            }

            $scope.api= jsc3l.customization.getEndpointAddress();
            $scope.setApiNodeModal.open();
            return;
        }
        
	    $scope.wallet=null;
        $scope.decryptStatus="";
		$scope.showFDecrypt = true;
		try {
            // toujours dans le cas d'un file dans le storage local
			$scope.fileContent = localStorage.getItem('ComChainWallet');
		    $scope.wallet = Wallet.getWalletFromPrivKeyFile($scope.fileContent, document.getElementById('passwdField').value);
            var parsed =  JSON.parse($scope.fileContent);
            if (parsed.message_key !== undefined) {
                 $scope.wallet.message_key = parsed.message_key;
            }
            
            walletService.password = $scope.filePassword;
            walletService.wallet = $scope.wallet;
            
            
            $scope.wallet = await jsc3l.message.ensureWalletMessageKey($scope.wallet, $translate.instant('WALL_missing_message_key'));
            walletService.wallet = $scope.wallet;
            
            localStorage.setItem('ComChainWallet',JSON.stringify(jsc3l.wallet.encryptWallet($scope.wallet, $scope.filePassword)));

            globalFuncs.loadWallets(true);
            
            walletService.setUsed();
            walletService.next_ok=true;
            
            $scope.hideWalletSelector = true;
            
		} catch (e) {
            $scope.decryptStatus = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('ERROR_7')));
		}
        if($scope.wallet!=null) $scope.decryptStatus = $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant('SUCCESS_2')));
        
        
        /****Load the contacts & memos *****/
        memoService.loadIpfsMemos($scope.wallet, walletService.password);
	
	    /**** Authenticate *****/
	    authenticationService.authenticate($scope.wallet);
        
        /***if a payment is in the local storage: navigate to the corresponding page ****/
        var currAddress = globalService.getCurrAddress();
        if (currAddress!=null){
           globalService.navigateToPay(currAddress);
        }
	};
    
    $scope.loadWallet = function() {
        if ($scope.filePassword ){
            $scope.decryptStatus="";
		    $scope.showFDecrypt = true;
		    try {
                // toujours dans le cas d'un file dans le storage local
			    $scope.fileContent = localStorage.getItem('ComChainWallet');
		        $scope.wallet = Wallet.getWalletFromPrivKeyFile($scope.fileContent, $scope.filePassword);
                walletService.password = $scope.filePassword;
			
                walletService.wallet = $scope.wallet;
                $scope.hideWalletSelector = true;
		    } catch (e) {
                $scope.decryptStatus = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('ERROR_7')));
		    }
            if($scope.wallet!=null) $scope.decryptStatus = $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant('SUCCESS_2')));

        }
	};
    
    
    $scope.helloPaperWallet = function(text){
       $scope.checkForFragment(text);
       $scope.$apply();
    }
    
    $scope.startScanPaperWallet = function(){
        cordova.plugins.barcodeScanner.scan(
		function (result) {
			$scope.helloPaperWallet(result.text);
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}, {'SCAN_MODE': 'QR_CODE_MODE'}
	    );
    };
    
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
    
      $scope.validateToken =function(){
        var enr_txt=document.getElementById("enr_tk2").value;
        try {
            enr_txt = enr_txt.replace(/(\n|\r|\ )/gm, "");
            var enrollmentLetter = JSON.parse(enr_txt);  
            if (enrollmentLetter.servername){
                jsc3l.customization.getConfJSON(enrollmentLetter.servername,function(success){
                    if (success){
                         location.reload();  
                    } else {
                         $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_No_server"));
                         $scope.$apply();      
                    }
                })
            } else {
                $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_No_config"));
            }
           
        } catch (e) {
            $scope.message_creation=globalFuncs.getDangerText($translate.instant("GEN_Token_validation_error"));
        }  
        
    }
    
    
    $scope.loadWallet();


};
module.exports = decryptWalletCtrl;
