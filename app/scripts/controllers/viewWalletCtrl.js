'use strict';
var viewWalletCtrl = function($scope, walletService, contactservice, $translate) {
    // Environment variables
    $scope.isApp = jsc3l_customization.isApp();
    
    // Controler variables
    //  Data
    $scope.currentAddress = globalFuncs.getWalletAddress();
    $scope.acc_name= $translate.instant("TRAN_Address");
    $scope.is_locked=false;
    $scope.is_curr_locked=false;
    
    $scope.qr_reference="";
    
    // Popup
    $scope.popSetupQR = new Modal(document.getElementById('pop_setupQR'));
	$scope.prepareTagModal = new Modal(document.getElementById('pop_prepare_tag'));
	$scope.popCheckBN = new Modal(document.getElementById('pop_check_bill'));

    // Helper function
    $scope.getAccName = function(address){
        var my_name = contactservice.getContactName($scope.contacts, address);
        if (my_name!=''){
            $scope.acc_name=my_name;
        }
    }
    
    // Load the wallet in the scope
	$scope.$watch(function() {
		if (walletService.wallet == null) return null;
		return walletService.wallet.getAddressString();
	}, function() {
		if (walletService.wallet == null) return;
		$scope.wallet = walletService.wallet;
        
        contactservice.loadContacts($scope.wallet, walletService.password, function(contact_list){
            $scope.contacts = contact_list;
            
        });
        
        jsc3l_bcRead.getAccountStatus($scope.wallet.getAddressString(), function(status){
                    $scope.is_locked = status==0;
        });
        
        $scope.currentAddress = $scope.wallet.getAddressString();
        $scope.current_QR_content = $scope.currentAddress;
        $scope.getAccName($scope.wallet.getAddressString());
        $scope.hasBnCheck=jsc3l_customization.hasBnCheck(); 
        
        jsc3l_bcRead.getContractStatus(function(status){
                    $scope.is_curr_locked = status==0;
        });
        
        globalFuncs.notifyApproval(); // Refresh the Payment notification
	});
    
    
    $scope.configureQR = function() {
        $scope.popSetupQR.open();
    }
    
    $scope.do_setupQR = function() {
        var obj = {"address":$scope.currentAddress};
        if ($scope.qr_price!= undefined && $scope.qr_price >0) {
            obj["amount"] = $scope.qr_price;
        }
        if ($scope.qr_reference!="" ) {
            obj["ref"] = $scope.qr_reference;
        }
        var content = JSON.stringify(obj);
        $scope.current_QR_content = content;
        $scope.popSetupQR.close();
    }
    
    
    // User interaction:
    //  Generate the wallet Address pdf
	$scope.printAdr = function() {
       setTimeout(function(){
             globalFuncs.generateSaveAdrPDF($scope.currentAddress, $scope.callback);
       },100); 
	}
    
    //  Save the wallet Address pdf
    $scope.callback = function(pdf_doc){
        var file_name = globalFuncs.cleanName($translate.instant("PDF_Pub_file")) +'_'+$scope.currentAddress+'.pdf';
        pdf_doc.save(file_name);
        
    }
    
    //  Open the tag popup
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
    
    // Generate the tag pdf
    $scope.getTagsPdf = function(){
        var data_object = [{"name":$scope.p_name_1,"price":$scope.p_price_1},
                           {"name":$scope.p_name_2,"price":$scope.p_price_2},
                           {"name":$scope.p_name_3,"price":$scope.p_price_3},
                           {"name":$scope.p_name_4,"price":$scope.p_price_4}];
        globalFuncs.generateTagQR($scope.currentAddress, data_object);
        // Wait for the QR generation
        setTimeout(function(){
            globalFuncs.generateTagsPDF($scope.currentAddress, data_object, $scope.tagCallback);
            $scope.prepareTagModal.close();
        },200); 
    }
    
    // Save the tag pdf
    $scope.tagCallback = function(pdf_doc){
        var file_name = globalFuncs.cleanName($translate.instant("PDF_Tag_file")) +'_'+$scope.currentAddress+'.pdf';
        pdf_doc.save(file_name);
    }
    

    // App only: check bank note
    //  Open the BN popup
    $scope.openCheckNote = function(){
        $scope.BN_Status='';
        $scope.bnaddress='';
        $scope.popCheckBN.open();
    }
    
    
    // Initiate bank note scanning
    $scope.startScanToBN = function(){
        $scope.BN_Status='';
        cordova.plugins.barcodeScanner.scan(
		function (result) {
		         $scope.helloToAddressBN(result.text);
		        }, 
		        function (error) {
			        alert("Scanning failed: " + error);
		        }, 
                {'SCAN_MODE': 'QR_CODE_MODE'}
	   );
        
    };
    
    // React to scanning
    $scope.helloToAddressBN = function(text){
      var add_obj = globalFuncs.parseAddress(text);  
      if (add_obj.address){
          $scope.bnaddress=add_obj.address;
      } else {
          $scope.bnaddress='';
      }
      $scope.$apply();
    }
    
    // Perform the check
    $scope.do_check = function(){
        $scope.BN_Status=globalFuncs.getWarningText($translate.instant("BN_CheckingProgress"));
        jsc3l_bcRead.getAccountStatus($scope.bnaddress, function(status){
            if (status!=0){
              $scope.BN_Status=globalFuncs.getDangerText($translate.instant("BN_NotValid"));      
            } else {
                jsc3l_bcRead.getGlobalBalance($scope.bnaddress, function(value){
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
