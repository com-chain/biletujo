'use strict';
var viewWalletCtrl = function($scope, walletService, contactservice, $translate) {
    
    $scope.currentAddress=globalFuncs.getWalletAddress();
    $scope.is_locked=false;
    
	$scope.prepareTagModal = new Modal(document.getElementById('pop_prepare_tag'));
	$scope.popCheckBN = new Modal(document.getElementById('pop_check_bill'));
    $scope.acc_name= $translate.instant("TRAN_Address");
    
    // Load the wallet in the scope
	$scope.$watch(function() {
		if (walletService.wallet == null) return null;
		return walletService.wallet.getAddressString();
	}, function() {
		if (walletService.wallet == null) return;
		$scope.wallet = walletService.wallet;
        $scope.currentAddressFromWallet=$scope.wallet.getAddressString();
        globalFuncs.getAccInfo(globalFuncs.slockitAccStatus, $scope.wallet.getAddressString(), function(status){
                    $scope.is_locked = status==0;
        });
        globalFuncs.notifyApproval();
        
        $scope.contacts = contactservice.loadContacts();
        var my_name =  contactservice.getContactName($scope.contacts, $scope.wallet.getAddressString());
        if (my_name!=''){
            $scope.acc_name=my_name;
        }
        $scope.hasBnCheck=globalFuncs.hasBnCheck();
	});
    
    $scope.callback = function(pdf_doc){
        var file_name = globalFuncs.cleanName($translate.instant("PDF_Pub_file")) +'_'+$scope.currentWalletAddress+'.pdf';
        pdf_doc.save(file_name);
    }
    
    $scope.tagCallback = function(pdf_doc){
        var file_name = globalFuncs.cleanName($translate.instant("PDF_Tag_file")) +'_'+$scope.currentWalletAddress+'.pdf';
        pdf_doc.save(file_name);
    }

    // Generate and save the wallet Address pdf
	$scope.printAdr = function() {
       
       setTimeout(function(){
             globalFuncs.generateSaveAdrPDF($scope.currentAddress, $scope.callback);
       },100); 
	}
    
    
    $scope.printPriceTag = function(){
        $scope.p_name_1=null;
        $scope.p_price_1=null;
        $scope.p_name_2=null;
        $scope.p_price_2=null;
        $scope.p_name_3=null;
        $scope.p_price_3=null;
        $scope.p_name_4=null;
        $scope.p_price_4=null;
        $scope.prepareTagModal.open();
    }
    
    $scope.getTagsPdf = function(){
        var data_object = [{"name":$scope.p_name_1,"price":$scope.p_price_1},
                                                               {"name":$scope.p_name_2,"price":$scope.p_price_2},
                                                               {"name":$scope.p_name_3,"price":$scope.p_price_3},
                                                               {"name":$scope.p_name_4,"price":$scope.p_price_4}];
        globalFuncs.generateTagQR($scope.currentAddress, data_object);
        setTimeout(function(){
            globalFuncs.generateTagsPDF($scope.currentAddress, data_object, $scope.tagCallback);
            $scope.prepareTagModal.close();
        },200); 
    }
    
    $scope.openCheckNote = function(){
        $scope.BN_Status='';
        $scope.bnaddress='';
        $scope.popCheckBN.open();
    }
    
    
     // Scan bank note
     
    $scope.helloToAddressBN = function(text){
      var add_obj = globalFuncs.parseAddress(text);  
      if (add_obj.address){
          $scope.bnaddress=add_obj.address;
      } else {
          $scope.bnaddress='';
      }
      $scope.$apply();
    }
    
    $scope.startScanToBN = function(){
        $scope.BN_Status='';
        cordova.plugins.barcodeScanner.scan(
		function (result) {
		 $scope.helloToAddressBN(result.text);
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		 }, {'SCAN_MODE': 'QR_CODE_MODE'}
	   );
        
    };
    
    
    $scope.do_check = function(){
        $scope.BN_Status=globalFuncs.getWarningText($translate.instant("BN_CheckingProgress"));
        globalFuncs.getAccInfo(globalFuncs.slockitAccStatus, $scope.bnaddress, function(status){
            if (status!=0){
              $scope.BN_Status=globalFuncs.getDangerText($translate.instant("BN_NotValid"));      
            } else {
                globalFuncs.getAmmount(globalFuncs.slockitBalance, $scope.bnaddress, function(value){
                    if (globalFuncs.isValidBNValue(value)){
                       $scope.BN_Status=globalFuncs.getSuccessText($translate.instant("BN_Valid")+value+globalFuncs.currencies.CUR);    
                    } else {
                       $scope.BN_Status=globalFuncs.getDangerText($translate.instant("BN_NotValid"));     
                    }
                
                });
                
            }
            
        });
    }
     
    
  
};

module.exports = viewWalletCtrl;
