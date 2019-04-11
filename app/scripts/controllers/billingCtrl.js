'use strict';
var billingCtrl = function($scope, $locale, $sce, walletService, $translate) {
    // Check the environment
    $scope.isApp =  globalFuncs.isApp();
    $scope.currentWalletAddress=globalFuncs.getWalletAddress();
    $scope.CUR='';
    $scope.CUR_nanti='';
    $scope.CUR_credit_mut='';
    $scope.has_nant=false;
    $scope.has_credit_mut=false;
    $scope.start_date = new Date();
    $scope.end_date = new Date();
    
    // Popups
	$scope.add_address_popup = new Modal(document.getElementById('pop_addAdd'));
	$scope.del_address_popup = new Modal(document.getElementById('pop_delAdd'));
    $scope.del_alladdress_popup = new Modal(document.getElementById('pop_delAllAdd'));
    
	$scope.progress_popup = new Modal(document.getElementById('pop_progress'));
	$scope.import_popup = new Modal(document.getElementById('pop_import_list'));
	$scope.select_file_popup = new Modal(document.getElementById('pop_pick_file'));
	$scope.getAddressFromCode_popup = new Modal(document.getElementById('pop_getAdd'));
    
   
    // Controler variables 
    globalFuncs.hideLoadingWaiting(); 
    $scope.trans_message = $translate.instant("GP_Wait_tran");
    $scope.is_admin=false;
    
    try{
          $scope.addree_list = JSON.parse(localStorage.getItem('ComChainBillingList')); 
    } catch(e){}
      
    if (!$scope.addree_list){
          $scope.addree_list=[]; 
    }
    
    $scope.prepareBlob = function(){
        // If in the browser prepare the export of the contacts
        if (! $scope.isApp){
            $scope.blobAddList = globalFuncs.getBlob("text/json;charset=UTF-8", $scope.addree_list);
        }
    }
   
    $scope.prepareBlob();
    
    $scope.$watch(function() {
		    if (walletService.wallet == null) return null;

		    return walletService.wallet.getAddressString();
	    }, function() {
		    if (walletService.wallet == null) return;
		    $scope.wallet = walletService.wallet;
            globalFuncs.getAccInfo(globalFuncs.slockitAccType, $scope.wallet.getAddressString(), function(type){
              
               globalFuncs.getAccInfo(globalFuncs.slockitAccStatus, $scope.wallet.getAddressString(), function(status){
                    $scope.is_admin = type==2 && status==1;
               });
            });
            
            $scope.CUR=globalFuncs.currencies.CUR;
            $scope.CUR_nanti=globalFuncs.currencies.CUR_nanti;
            $scope.CUR_credit_mut=globalFuncs.currencies.CUR_credit_mut;
            
            $scope.has_nant=globalFuncs.hasNant();
            $scope.has_credit_mut=globalFuncs.hasCM();
        });
    
    ///////////////////////////////////
    
    $scope.codeChanged = function(){
        $scope.showCodeSearch = 32==$scope.input_code.trim().length;
    }
    
    $scope.openGetAdd = function(){
        $scope.input_code='';
        $scope.addressCode_list=[];
        $scope.showCodeSearch = false;
        $scope.searchStatus="";
        $scope.no_acc = false;
        $scope.getAddressFromCode_popup.open();
    }
    
    $scope.searchAddfromCode= function(){
        $scope.showCodeSearch = false;
        $scope.searchStatus=$translate.instant("BIL_SearchingCode");
        $scope.getAddresses($scope.input_code, function(addre_list){
            var loc_addressCode_list=[];
            for (var index=0; index<addre_list.length;index++){
                loc_addressCode_list.push({"add":addre_list[index],"stat":$translate.instant("EXC_Locked")});
            }
 
            $scope.getAccStatus(loc_addressCode_list,0,function(list){
                $scope.addressCode_list=list;
                $scope.no_acc = addre_list.length ==0;
                $scope.searchStatus="";
            });

        });
    }
    
    $scope.getAccStatus = function(address_list,index,callback){
        if (index>=address_list.length){
            callback(address_list);
        } else {
             globalFuncs.getAccInfo(globalFuncs.slockitAccStatus, address_list[index].add, function(status){
                    if ( status==1){
                         address_list[index].stat = $translate.instant("EXC_Unlocked");
                    }
                    $scope.getAccStatus(address_list,index+1, callback);
               });
            
        }
    }
    
    ///////////////////////////////////
    $scope.addAddress = function(){
        $scope.curr_new_address='';
        $scope.addStatus = '';
        $scope.add_address_popup.open();
    }
    
    $scope.saveNewAddress = function(){
        if ($scope.addree_list.indexOf( $scope.curr_new_address) < 0){
           
            $scope.addree_list.push($scope.curr_new_address);
     
            localStorage.setItem('ComChainBillingList',JSON.stringify($scope.addree_list));
            $scope.prepareBlob();
      

        } else {
            $scope.addStatus = $translate.instant("BIL_AlreadyInList");
        }
        
        $scope.add_address_popup.close();
     
        $scope.$apply();    
    }
    
    $scope.helloToAddress = function(text){
      var add_obj = globalFuncs.parseAddress(text); 
      if (add_obj.address){
           $scope.curr_new_address=add_obj.address;
      } else {
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
		}, {'SCAN_MODE': 'QR_CODE_MODE'}
	    );
    }
    
    /////////////////////////////////////
    $scope.confirmDelete = function(address){
        
        $scope.curr_new_address=address;
        $scope.del_address_popup.open();
    }
    
    $scope.deleteAddress = function(){
        var index = $scope.addree_list.indexOf( $scope.curr_new_address)
         if ( index>= 0){
            $scope.addree_list.splice(index, 1);  
            localStorage.setItem('ComChainBillingList',JSON.stringify($scope.addree_list));
            $scope.prepareBlob();
        }
        
        $scope.del_address_popup.close();
     
        $scope.$apply();    
    }
    
    //////////////////////////////////////////
    $scope.exportAddList = function(){
        globalFuncs.dowloadAppFileWithName('Address_List.dat', $scope.addree_list);
    }
    
    //////////////////////////////////////////
    $scope.openImportList = function(){
       document.getElementById("flstselector").value = "";
       $scope.current_file='';
       $scope.file_number=-1;
       
       $scope.import_popup.open(); 
    }
    
    $scope.cancelPickListFile = function(){
        $scope.import_popup.open(); 
    }
    
    $scope.selectListFile = function(){
         if (!$scope.isApp){
		    document.getElementById('flstselector').click();
        } else {
            globalFuncs.readCordovaDir($scope.success); 
       } 
    }
    
   $scope.success = function(entries) {
        $scope.dir_entries=[];
        if (entries){
            for (var entry_id in entries){
                
                if (entries[entry_id].isFile ){
                    $scope.dir_entries.push(entries[entry_id]);
                }  
            }
        }
        $scope.SelectedFileIndex=-1;
        $scope.SelectedFileName='';
        $scope.$apply();
        $scope.select_file_popup.open();
    }
    
    $scope.pickListFile = function(name,index){
        $scope.SelectedFileIndex=index;
        $scope.SelectedFileName=name;   
    }
    
    $scope.openPickedListFile = function(){
          if ( $scope.SelectedFileIndex>=0){
            var file_entry = $scope.dir_entries[ $scope.SelectedFileIndex];
            file_entry.file(function(file){
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                   if(this.result) {
                       $scope.import_popup.open();
                       $scope.openListFile(this.result); 
                       $scope.$apply(); 
                   } 
                 };
                reader.onerror = function(evt) {};
                reader.readAsText(file);
            },function(){});   
        }
    }
    
    $scope.openListFile = function($fileContent) {
      if (document.getElementById('flstselector').files[0] || $scope.SelectedFileIndex>=0){
        try {
            $scope.new_list = $fileContent.match(/0x[a-f0-9]{40}/mgi);
          
            if ($scope.SelectedFileIndex>=0){
                $scope.current_file = $sce.trustAsHtml(globalFuncs.getSuccessText( $scope.SelectedFileName));
            } else {
                $scope.current_file = $sce.trustAsHtml(globalFuncs.getSuccessText(document.getElementById('flstselector').files[0].name));
            }
            
            $scope.file_number = 0;
            if ( $scope.new_list){
             $scope.file_number = $scope.new_list.length;   
            }
          
        } catch (e) {
          alert($translate.instant("BIL_NoValidAddress"));    
        }
	  }
	}
    
 
    $scope.importList = function(){
        $scope.addree_list = $scope.new_list;
        localStorage.setItem('ComChainBillingList',JSON.stringify($scope.addree_list));
        $scope.prepareBlob();
        
        $scope.import_popup.close(); 
        $scope.$apply();  
        
    }
    
    
    $scope.clearAddresses = function(){
      $scope.del_alladdress_popup.open();
    }
    
    $scope.deleteAllAddress = function(){
         $scope.addree_list=[]; 
         localStorage.setItem('ComChainBillingList',JSON.stringify($scope.addree_list));
         $scope.del_alladdress_popup.close(); 
         $scope.$apply();  
    }
    
    
    
    //////////////////////////////////////////
    $scope.account_type={};
    $scope.codes={};
    
    $scope.addAccountToTypeDict = function(address,callback){
        if (!(address in $scope.account_type)){
            globalFuncs.getAccInfo(globalFuncs.slockitAccType, address, function(type){
                // peron=0 / legal=1/ admin=2
                $scope.account_type[address] = type;
                callback();
            });
        } else {
            callback();
        }
    }
    
    $scope.addAccountListType = function(list, index, callback){
        if (index >= list.length){
            callback();
        } else {
            $scope.addAccountToTypeDict(list[index],function(){$scope.addAccountListType(list, index+1, callback);});
        }
    }
    
   $scope.getAccType = function(address, callback){
        if (!(address in $scope.account_type)){
            setTimeout($scope.getAccType(address, callback), 5000); 
        } else {
            callback($scope.account_type[address]);
        }  
    }
    
    $scope.getCodes = function(addresses,callback){
        var caller = $scope.wallet.getAddressString();
        var add= addresses.join(',');
        
        var message_hash = ethUtil.hashPersonalMessage(new Buffer(add));
        var signature = ethUtil.ecsign(message_hash, $scope.wallet.getPrivateKey());
        var sign = ethUtil.bufferToHex(Buffer.concat([signature.r, signature.s, ethUtil.toBuffer(signature.v)]));
        
         ajaxReq.getCodesFromAddresses(add, globalFuncs.getServerName(),caller, sign, function(data){
            for(var add_index=0; add_index<addresses.length; ++add_index){
                var address = addresses[add_index];
                if (address in data){
                    $scope.codes[address]=data[address];
                } else {
                    $scope.codes[address]='';
                }
            }
            $scope.code_completed = true;
            callback();
         });      
    }
    
     $scope.getAddresses = function(code, callback){
        var caller = $scope.wallet.getAddressString();
        var message_hash = ethUtil.hashPersonalMessage(new Buffer(code));
        var signature = ethUtil.ecsign(message_hash, $scope.wallet.getPrivateKey());
        var sign = ethUtil.bufferToHex(Buffer.concat([signature.r, signature.s, ethUtil.toBuffer(signature.v)]));
        
         ajaxReq.getAddressesFromCode(code, globalFuncs.getServerName(), caller, sign, function(data){
            var add_list = [];
            for (var ind = 0; ind < data.length; ++ind) {
                if (data[ind].startsWith('0x')){
                  add_list.push(data[ind]);  
                }
            }
            callback(add_list);
         });      
    }
    
    
    $scope.getAccCode = function(address, callback){
         if (!($scope.code_completed)){
            setTimeout($scope.getAccCode(address, callback), 5000); 
        } else {
            callback($scope.codes[address]);
        }  
    }
    
    $scope.exportPositions = function(){
        $scope.exportTotal = $scope.addree_list.length;
        $scope.exportCurrent = 0;
        $scope.progress_popup.open();
        $scope.code_completed=false;
        $scope.getCodes($scope.addree_list,$scope.initializeExport);

    }
    
    $scope.addTrans = function(address, trans_list, current_result, index, callback){
        if (index >=trans_list.length){
            $scope.getAccCode(address, function(code){
                current_result.Code=code;
                callback(current_result);
            });
        } else {
            var tran = JSON.parse(trans_list[index]);
            if (tran.addr_to == address){
                // in
                if (tran.type=='Pledge'){
                    current_result.InPlNb += 1;
                    current_result.InPlTot += tran.recieved/100.0; 
                    $scope.addTrans(address, trans_list, current_result, index+1, callback);
                } else {
                    $scope.getAccType(tran.addr_from, function(type){
                        if (tran.type=='TransferCredit'){
                            if (type==0){
                                current_result.InPerCmNb += 1;
                                current_result.InPerCmTot += tran.recieved/100.0; 
                            }
                            else {
                                current_result.InProCmNb += 1;
                                current_result.InProCmTot += tran.recieved/100.0; 
                            }
                        } else if (tran.type=='Transfer'){
                            if (type==0){
                                current_result.InPerNaNb += 1;
                                current_result.InPerNaTot += tran.recieved/100.0; 
                            }
                            else {
                                current_result.InProNaNb += 1;
                                current_result.InProNaTot += tran.recieved/100.0; 
                            }
                       }
                       $scope.addTrans(address, trans_list, current_result, index+1, callback);
                    });
                }
             } else if (tran.addr_from == address){
                 // out
                 $scope.getAccType(tran.addr_to, function(type){
                      if (tran.type=='TransferCredit'){
                            if (type==0){
                                current_result.OutPerCmNb += 1;
                                current_result.OutPerCmTot += tran.sent/100.0; 
                            }
                            else {
                                current_result.OutProCmNb += 1;
                                current_result.OutProCmTot += tran.sent/100.0; 
                            }
                        } else if (tran.type=='Transfer'){
                            if (type==0){
                                current_result.OutPerNaNb += 1;
                                current_result.OutPerNaTot += tran.sent/100.0; 
                            }
                            else {
                                current_result.OutProNaNb += 1;
                                current_result.OutProNaTot += tran.sent/100.0; 
                            }
                       }
                       $scope.addTrans(address, trans_list, current_result, index+1, callback);
                     
                 });
              }             
       }
    }
    
    
    
    
    $scope.initializeExport = function(){
        $scope.ExportData=[];
        
        $scope.start_date=new Date($scope.start_date.getFullYear(), $scope.start_date.getMonth(),  $scope.start_date.getDate(), 0, 0, 0, 0);
        $scope.end_date=new Date($scope.end_date.getFullYear(), $scope.end_date.getMonth(),  $scope.end_date.getDate(),23, 59, 59, 0);
        
        
        if ($scope.end_date.getTime()<$scope.start_date.getTime()){
                var swap = $scope.start_date;
                $scope.start_date=$scope.end_date;
                $scope.end_date=swap;
        }
        
        var d_start = $scope.start_date.getTime()/1000;
        var d_end = $scope.end_date.getTime()/1000;
        
        for(var add_index=0; add_index<$scope.addree_list.length; ++add_index){
            var add = $scope.addree_list[add_index];
            ajaxReq.getExportTransListWithId(add,d_start,d_end, function(result,caller_add){
             
            // get the account types:

             
            var add_list = [];
            for (var ind = 0; ind < result.length; ++ind) {
                   var tran = JSON.parse(result[ind]);
                   if (tran.addr_to.startsWith('0x') && !add_list.includes(tran.addr_to)){
                       add_list.push(tran.addr_to);
                   }
                   if (tran.addr_from.startsWith('0x') && !add_list.includes(tran.addr_from)){
                       add_list.push(tran.addr_from);
                   }
            }
            
            
            $scope.addAccountListType(add_list, 0, function(){
                var current_result = {"Address":caller_add, "Code":'', 
                           "InPlNb":0, "InPlTot":0,
                           "InPerNaNb":0, "InPerNaTot": 0,
                           "InProNaNb":0, "InProNaTot": 0,
                           "InPerCmNb":0, "InPerCmTot":0,
                           "InProCmNb":0, "InProCmTot":0,
                           "OutPerNaNb":0, "OutPerNaTot":0,
                           "OutProNaNb":0, "OutProNaTot":0,
                           "OutPerCmNb":0, "OutPerCmTot":0,
                           "OutProCmNb":0, "OutProCmTot":0}
                                       
               $scope.addTrans(caller_add, result, current_result, 0, function(final_res){
                   $scope.ExportData.push(final_res);
               });
            });
         });
        }
        
        $scope.interval = setInterval($scope.progressReport, 300);
    }
    
    $scope.progressReport = function(){
        $scope.exportCurrent = $scope.ExportData.length;
        if ($scope.exportCurrent == $scope.exportTotal){
            clearInterval($scope.interval);
            $scope.exportReport();
        }
    }
    

    
    $scope.cancelExport = function(){
        clearInterval($scope.interval);
        $scope.progress_popup.close();
    }
    
    $scope.exportReport = function(){
          var cvs='"'+$translate.instant("CVS_COL_address").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_Code").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_InPlNb").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_InPlTot").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_InPerNaNb").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_InPerNaTot").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_InProNaNb").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_InProNaTot").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_InPerCmNb").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_InPerCmTot").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_InProCmNb").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_InProCmTot").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_OutPerNaNb").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_OutPerNaTot").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_OutProNaNb").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_OutProNaTot").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_OutPerCmNb").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_OutPerCmTot").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_OutProCmNb").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_OutProCmTot").replace(/[\n\r]+/g, '')+'"\n';
                       
           for (var index = 0; index < $scope.ExportData.length; ++index){
               var data=$scope.ExportData[index];
               
               cvs=cvs + data.Address + ','+ data.Code + ',';
               cvs=cvs + data.InPlNb + ',' + data.InPlTot + ',';
               cvs=cvs + data.InPerNaNb + ',' + data.InPerNaTot + ',';
               cvs=cvs + data.InProNaNb + ',' + data.InProNaTot + ',';
               cvs=cvs + data.InPerCmNb + ',' + data.InPerCmTot + ',';
               cvs=cvs + data.InProCmNb + ',' + data.InProCmTot + ',';
               cvs=cvs + data.OutPerNaNb + ',' + data.OutPerNaTot + ',';
               cvs=cvs + data.OutProNaNb + ',' + data.OutProNaTot + ',';
               cvs=cvs + data.OutPerCmNb + ',' + data.OutPerCmTot + ',';
               cvs=cvs + data.OutProCmNb + ',' + data.OutProCmTot + '\n';
           }
             
           
           var name= "Transactions_"+$scope.start_date.getFullYear()+'-'+($scope.start_date.getMonth()+1)+'-'+ ($scope.start_date.getDate())+"_"+$scope.end_date.getFullYear()+'-'+($scope.end_date.getMonth()+1)+'-'+ ($scope.end_date.getDate())+".csv";
           
            var charCode, byteArray = [];
               // LE BOM
               byteArray.push(255, 254);
               for (var i = 0; i < cvs.length; ++i) {

                 charCode = cvs.charCodeAt(i);

                 // LE Bytes
                 byteArray.push(charCode & 0xff);
                 byteArray.push(charCode / 256 >>> 0);
              }
              var blob = new Blob([new Uint8Array(byteArray)], {type:'text/plain;charset=UTF-16LE;'});
           
           
           
           if ($scope.isApp){
               globalFuncs.dowloadCsvFileWithName(name, blob);
           } else {
               var encodedUri = URL.createObjectURL(blob);
               var link = document.createElement("a");
               link.setAttribute("href", encodedUri);
               link.setAttribute("download", name);
               document.body.appendChild(link); // Required for FF
               link.click();
           }
           
           $scope.progress_popup.close();
    }
   
}
module.exports = billingCtrl;
