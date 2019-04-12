'use strict';
var contactesCtrl = function($scope, $sce, walletService, contactservice, globalService, $translate) {
    
    // Check the environment
    $scope.isApp =  globalFuncs.isApp();
    
    // Create the modal popups
	$scope.editNameModal = new Modal(document.getElementById('editName'));
	$scope.deleteConatctModal = new Modal(document.getElementById('deleteContact'));
	$scope.addNameModal = new Modal(document.getElementById('addName'));

    $scope.pickAlrtCurr = new Modal(document.getElementById('alrtCurr'));
    $scope.ctt_filter="";
    
    
    
    // Controler variables 
    $scope.merge_type=0;
    globalFuncs.showLoading($translate.instant("GP_Wait"));
    $scope.NoCtc=true;
    $scope.contacts=[];      

    // Load the wallet and the contacts in the scope
	$scope.$watch(function() {
		if (walletService.wallet == null) return null;
		return walletService.wallet.getAddressString();
	}, function() {
		if (walletService.wallet == null) return;
		$scope.wallet = walletService.wallet;
	});
    
    
    
    $scope.loadContacts= function(){
      // Load contacts stored in the local storage  
      $scope.contacts = contactservice.loadContacts();

      for (var id in $scope.contacts){
          try{
              $scope.contacts[id].logo = globalFuncs.getCurrencyLogoUrl( $scope.contacts[id].servername);
              $scope.contacts[id].has_logo = $scope.contacts[id].logo !='' && $scope.contacts[id].servername!=globalFuncs.getServerName();
          } catch(e){}
      }
      
      
       $scope.filtered_contacts=$scope.contacts.slice();
        $scope.NoCtc= $scope.filtered_contacts.length==0;
      globalFuncs.hideLoadingWaiting();  
    }
    
    $scope.filter_ctt = function(){
        $scope.filtered_contacts= contactservice.filterContact($scope.contacts.slice(),$scope.ctt_filter);
        $scope.NoCtc= $scope.filtered_contacts.length==0;
     
    }
    
    
    
    $scope.loadContacts();
    
    ///// Navigation to the send page
    $scope.navigateSend= function(address, different_currency){
        if (!different_currency){
            globalService.navigateToPay(address);
        } else {
            $scope.pickAlrtCurr.open();
        }
    }
    
    // Delete handling
    $scope.deleteCtc = function(address,name){
      $scope.currName=name;
      $scope.curraddress=address;
      $scope.deleteConatctModal.open();
    }
    
    $scope.deleteContact= function(){
      $scope.deleteConatctModal.close();
      globalFuncs.showLoading($translate.instant("GP_Wait"));
      contactservice.deleteContact($scope.curraddress);
      $scope.loadContacts();
      contactservice.storeIpfsContact($scope.wallet, walletService.password);
    }
    
    // Add handling    
    $scope.addNamePop = function(){
      $scope.currName='';
      $scope.curraddress='';
      $scope.addNameModal.open();
    }
    
    $scope.helloToAddress = function(text){
      var add_obj = globalFuncs.parseAddress(text);  
      if (add_obj.address){
          $scope.curraddress=add_obj.address;
      } else {
          $scope.curraddress='';
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
    
    $scope.saveNewName = function(){
        if ($scope.curraddress.length==$scope.wallet.getAddressString().length){
          $scope.addNameModal.close();
          globalFuncs.showLoading($translate.instant("GP_Wait"));
          $scope.contacts = contactservice.addEditContact( $scope.curraddress, $scope.currName);
          $scope.loadContacts();
          
          contactservice.storeIpfsContact($scope.wallet, walletService.password);
        }
    }
    
    // Edit handling
    $scope.editCtc = function(address,name){
      $scope.currName=name;
      $scope.curraddress=address;
      $scope.editNameModal.open();
    }
    
    $scope.saveName = function(){
      $scope.editNameModal.close();
      globalFuncs.showLoading($translate.instant("GP_Wait"));
      $scope.contacts = contactservice.addEditContact($scope.curraddress, $scope.currName);
      $scope.loadContacts();
      
      contactservice.storeIpfsContact($scope.wallet, walletService.password);
    }
    
	
};
module.exports = contactesCtrl;


