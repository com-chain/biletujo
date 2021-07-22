'use strict';
var consultRightCtrl = function($scope, $sce, walletService, contactservice, consultService, globalService, $translate) {
    

    
    // Check the environment
    $scope.isApp = jsc3l.customization.isApp();
    
    // Create the modal popups
	$scope.deleteConsultModal = new Modal(document.getElementById('deleteConsultRight'));
    
    $scope.createRightModal = new Modal(document.getElementById('createConsultRight'));
    $scope.dislayQRModal = new Modal(document.getElementById('QR_consult_pop'));
    
    $scope.openRightModal = new Modal(document.getElementById('QR_scan_pop'));
    
    // Controler variables 
    $scope.merge_type = 0;
    $scope.NoCR = true;
    $scope.consult_rights = [];  
    $scope.contacts = [];
    
    $scope.acc_name= $translate.instant("TRAN_Address");
    
    $scope.showContactPop=false;
    $scope.start_date =  new Date();
    $scope.end_date =  new Date();
    $scope.end_date.setDate($scope.end_date.getDate() + 1);
    
    globalFuncs.showLoading($translate.instant("GP_Wait"));

    // Load the wallet and the rights in the scope
	$scope.$watch(function() {
		if (walletService.wallet == null) return null;
		return walletService.wallet.getAddressString();
	}, function() {
		if (walletService.wallet == null) return;
		$scope.wallet = walletService.wallet;
        $scope.currentAddress = $scope.wallet.getAddressString();
        contactservice.loadContacts($scope.wallet, walletService.password).then(function(contact_list){
            $scope.contacts = contact_list; 
            $scope.getAccName($scope.wallet.getAddressString());
            
            $scope.consult_rights = consultService.loadConsults($scope.currentAddress);
            $scope.loadRights();
            //$scope.$apply();
        });
        
        globalFuncs.notifyApproval(); // Refresh the Payment notification
	});
    
        
    // Helper function
    $scope.getAccName = function(address){
        var my_name = contactservice.getContactName($scope.contacts, address);
        if (my_name!=''){
            $scope.acc_name=my_name;
        }
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
    
    $scope.contactPop = function() { 
      $scope.showContactPop=true;
    }  
    
    $scope.pickCtc = function(address, name){
      $scope.dest = address;
      $scope.selectedName = name;
      $scope.showContactPop=false;
         
    }
    
    $scope.closeCttPop = function() { 
      $scope.showContactPop=false;
    }
    
       
    $scope.helloToAddress = function(text){
      var add_obj = globalFuncs.parseAddress(text); 
      if (add_obj.error){
           alert($translate.instant("EXC_unknow_address"));
      } else {
         $scope.dest = add_obj.address;
         $scope.selectedName = contactservice.getContactName($scope.contacts, add_obj.address);
         
      }
      $scope.$apply();
    }
    
    $scope.startScanAddress = function(){
            cordova.plugins.barcodeScanner.scan(
		    function (result) {
			    $scope.helloToAddress(result.text);
		    }, 
		    function (error) {
			    alert("Scanning failed: " + error);
		    }, {'SCAN_MODE': 'QR_CODE_MODE'}
	        );
    };
    
    
    
    $scope.fingetrprintUnlock = function(){
        globalFuncs.unlock(function(result){
          if (result) {
             $scope.trPass=walletService.password;
          }
        });
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
    
    
    var obj_content = {"address":$scope.currentAddress, 
              "server":jsc3l.customization.getCurrencyName(), 
              "destinary":$scope.dest,
              "begin":$scope.start_date.getFullYear()+ "/" + $scope.start_date.getMonth()+"/" + $scope.start_date.getDate(), 
              "end":$scope.end_date.getFullYear()+ "/" + $scope.end_date.getMonth()+"/" + $scope.end_date.getDate(), 
              "viewbalance": ($scope.balanceView == 1),
              "viewoldtran": ($scope.oldTran == 1)
    };

    var str_content = JSON.stringify(obj_content);
    var hash = jsc3l.ethUtil.sha3(str_content);
    var signature = jsc3l.ethUtil.ecsign(hash, $scope.wallet.privKey);
    var output = {"data":obj_content, "signature":{ "v":signature.v,
    "r":'0x' + signature.r.toString('hex'),
    "s":'0x' + signature.s.toString('hex')}};
    $scope.qr_content =  JSON.stringify(output);
    
    
    
    
    var full= $scope.qr_content;
    var chunk_length = Math.ceil(full.length/4);
        
    if (piece <0){
        var qrcode = new QRCode(document.getElementById("qrCR_print"), $scope.qr_content);
        document.getElementById("qrCR_print").style.display = "none";
        for (var i=0; i<4;i++) {
            var string = "FRAG_CR"+signature.s.toString('hex').substring(2,6)+i.toString()+full.substring(chunk_length*i,Math.min(chunk_length*(i+1),full.length));
            var qrcode = new QRCode(document.getElementById("qrCR_print" + i.toString()),string);
            document.getElementById("qrCR_print" + i.toString()).style.display = "none";
        } 
    } else if (piece == 0) {
        var qrcode = new QRCode(document.getElementById("qrcode_consultRight"), $scope.qr_content);
    } else {
        var i = piece -1;
       
        var string = "FRAG_CR"+signature.s.toString('hex').substring(2,6)+i.toString()+full.substring(chunk_length*i,Math.min(chunk_length*(i+1),full.length));
        var qrcode = new QRCode(document.getElementById("qrcode_consultRight"),string);
    } 
    
    return $scope.qr_content;
}
   
   
    $scope.callback = function(pdf_doc){
        var file_name = "CONSULT_"+ $scope.currentAddress+"_for_"+$scope.dest+'.pdf';
        pdf_doc.save(file_name);
    }
    
    
    $scope.createConsultRight = function() {
       if ($scope.start_date.getTime()>=$scope.end_date.getTime()) {
           document.getElementById('createStatus').innerHTML = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("CRI_wrongDates"))); 
       } else if ($scope.trPass==walletService.password){
           walletService.setUsed();
           $scope.createRightModal.close();
           $scope.trPass="";
           // processing
           $scope.generateSaveQRPiece(-1);
           $scope.generateSaveQRPiece(0);
           $scope.dislayQRModal.open();

           if (!$scope.isApp) {
               // export .dat file
               $scope.blobEnc = globalFuncs.getBlob("text/json;charset=UTF-8", $scope.qr_content);
               document.getElementById('dwonloadBtn').click();
                   
               // todo export pdf 
        
               setTimeout(function(){ 
                     globalFuncs.generateCrPDF(
                        $translate.instant("PDF_CR_Title"),
                        $translate.instant("PDF_CR_On"),
                        $translate.instant("PDF_CR_Assigned"),
                        globalFuncs.cleanName($translate.instant("PDF_CR_Validity")) + " " + $scope.start_date.getFullYear()+ "/" + $scope.start_date.getMonth()+"/" + $scope.start_date.getDate() +"-"+
                        $scope.end_date.getFullYear()+ "/" + $scope.end_date.getMonth()+"/" + $scope.end_date.getDate(), 
                        $scope.currentWalletAddress,
                        $scope.dest,
                        $scope.qr_content,                       
                        $scope.callback);
                 },100); 
           }
          
           
           
           
           
       } else {
           document.getElementById('createStatus').innerHTML = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("TRAN_WrongPass")));

       }
    };



$scope.showContent = function(content) {

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
           if (obj.data.destinary!=$scope.currentAddress){
               $scope.openStatus = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('OPEN_right_not_for_you'))); 
           } else if ((new Date(obj.data.end)).getTime()< (new Date()).getTime()){   
                $scope.openStatus = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('OPEN_too_old_right'))); 
           } else {    
               // OK we can close the popup
               $scope.openRightModal.close();  
               // add to the right
               consultService.addConsult(obj);
               //reload the grid
               $scope.consult_rights = consultService.loadConsults($scope.currentAddress); 
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
       var id = content.substring(11,15);
       if ( $scope.partial_id==""){
            $scope.partial_id = id;
       }
       if (id!=$scope.partial_id){
          $scope.openStatus = $sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('OPEN_Frag_Wrong_ID'))); 
         //error expecting fragement with same id  
       } else {
           var number = content.substring(15,16);
           if (!(number in $scope.partial_content)){
              var cont= content.substring(15);
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
                  
                    $scope.openStatus = $sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant('OPEN_Frag_Read'))); 
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
    $scope.consult_rights = consultService.loadConsults($scope.currentAddress); 
    $scope.loadRights();
}
    
  
	
};
module.exports = consultRightCtrl;


