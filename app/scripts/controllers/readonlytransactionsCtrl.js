'use strict';
var readonlytransactionsCtrl = function($scope, $locale, $sce, walletService,contactservice,consultService, memoService, messageService, $translate, $filter) {
    // Check the environment
    $scope.isApp =  globalFuncs.isApp();
    $scope.currentWalletAddress=globalFuncs.getWalletAddress();
    $scope.fingerprint=false;
    
    // Create the modal popups
	$scope.addContact = new Modal(document.getElementById('addContact'));
  	$scope.transDetails = new Modal(document.getElementById('transDetails'));
    $scope.exportTraModal = new Modal(document.getElementById('exportTraPop'));
    $scope.verifyModal = new Modal(document.getElementById('transVerify'));
    $scope.crHelpModal = new Modal(document.getElementById('cr_help_pop'), { keyboard: false, backdrop  : 'static'});
    
    
    $scope.watching=false;

    
    // Controler variables 
    $locale.NUMBER_FORMATS.GROUP_SEP = "'";
    $scope.merge_type=0;
    $scope.content='';    
    globalFuncs.showLoading($translate.instant("GP_Wait"));
    $scope.showNone = true;
    $scope.showNoMore = false;
    $scope.contacts=[]; 
    $scope.memos=[]; 
    $scope.transactions= {};
    $scope.tra_number=4;
    $scope.requested_tra_number=4;
    $scope.tra_offset=0;
    
    $scope.tot_in=0;
    $scope.tot_out=0;
    
    $scope.request_tab=0;
    $scope.pendingRequest=[];
    $scope.acceptedRequest=[];
    $scope.rejectedRequest=[];
    $scope.pendingApproval=[];
    $scope.CUR='';
    $scope.CUR_nanti='';
    $scope.CUR_credit_mut='';
    

    $scope.balanceEL=0;
    $scope.balanceCM=0;
    $scope.has_nant=true;
    $scope.has_credit_mut=true;
    
    $scope.show_bal=true;
    $scope.lock_date = false;
    $scope.watched_address="";
    
    $scope.showSelectorPop=false;
    
    
    if (document.getElementById("rafraichir")){
        document.getElementById("rafraichir").title=$translate.instant("CTC_Tooltip_Rafraichir").replace("\n","");
    }
    if(document.getElementById("exporter")){
        document.getElementById("exporter").title=$translate.instant("CTC_Tooltip_Export").replace("\n","");
    }
    if (document.getElementById("verifier")){
    document.getElementById("verifier").title=$translate.instant("CTC_Tooltip_verify").replace("\n","");
    }
    if (document.getElementById("notify")){
    document.getElementById("notify").title=$translate.instant("CTC_Tooltip_notify").replace("\n","");
    }
    
    
    
    $scope.trans_message = $translate.instant("GP_Wait_tran");
    
    
	$scope.$watch(function() {
		if (walletService.wallet == null) return null;
		return walletService.wallet.getAddressString();
	}, function() {
		if (walletService.wallet == null) return;
		$scope.wallet = walletService.wallet;
        
        $scope.currentWalletAddress = globalFuncs.getWalletAddress();
        $scope.watched_address = $scope.currentWalletAddress;
        
        contactservice.loadContacts($scope.wallet, walletService.password, function(contact_list){
            $scope.contacts = contact_list;
        });
        
        
        // load the currencies
        $scope.CUR=globalFuncs.currencies.CUR;
        $scope.CUR_nanti=globalFuncs.currencies.CUR_nanti;
        $scope.CUR_credit_mut=globalFuncs.currencies.CUR_credit_mut;
        $scope.has_nant=globalFuncs.hasNant();
        $scope.has_credit_mut=globalFuncs.hasCM();
        
        $scope.possible_wallets = consultService.loadRightFor($scope.currentWalletAddress);
        
        var local_message_key = JSON.parse(localStorage.getItem('ComChainWallet')).message_key.priv;
        
        $scope.possible_wallets[$scope.currentWalletAddress]  = {"viewbalance":true, "viewoldtran": true, "messageKey":local_message_key};
     
       
        
        $scope.loadWatchedWallet();
        
       
	});
    
    
    $scope.loadWatchedWallet = function() {
        if ($scope.currentWalletAddress.toLowerCase() == $scope.watched_address.toLowerCase()) {
            $scope.show_bal=true;
            $scope.lock_date = false;
        }
        
        globalFuncs.getAmmount(globalFuncs.slockitElBlance, $scope.watched_address, function(value){$scope.balanceEL = value;});
        globalFuncs.getAmmount(globalFuncs.slockitCmBlance, $scope.watched_address, function(value){$scope.balanceCM = value;});
        
        $scope.current_message_key = messageService.messageKeysFromCrypted($scope.wallet, $scope.possible_wallets[$scope.watched_address].messageKey);
        
        $scope.index=0;
        $scope.loadTransactions($scope.tra_number,$scope.index*$scope.tra_number + $scope.tra_offset);
        
        
        var stored = JSON.parse(localStorage.getItem('ComChainWatchTransaction'));
   
        if ($scope.watching != stored) {
            $scope.watch_click();
        } 
    }
    
    
    $scope.getTransactionMessage = function(transaction_data) {
        var memo = memoService.getMemo($scope.memos,transaction_data.hash);
        try {
            var key = Buffer.from($scope.current_message_key.clear_priv.substring(2),'hex')
            if (memo=="") {
              if (transaction_data.addr_to == $scope.watched_address.toLowerCase() && transaction_data.message_to != '') {
                  memo = messageService.decipherMessage(key, transaction_data.message_to);
              }
              
              if (transaction_data.addr_from == $scope.watched_address.toLowerCase() && transaction_data.message_from != '') {
                  memo = messageService.decipherMessage(key, transaction_data.message_from);
              }
            }
        } catch (e) {}
        
        return memo;
    }
    
    $scope.loadTransactions= function(count,offset){
         $scope.memos = memoService.getMemos(false);
         if(!$scope.isApp){
             $scope.blobMemo = memoService.getMemoBlob($scope.memos)
         }
         $scope.showNone = true;
         $scope.showNoMore = true;
         if (offset>0){
              document.getElementById("prevTransactions").style.display = 'block';
              $scope.showNone = false;
          } else {
               document.getElementById("prevTransactions").style.display = 'none';
          
          }
          
          document.getElementById("addTransactions").style.display = 'none';
        
        
          ajaxReq.getTransList($scope.watched_address,count,offset,function(result){
              $scope.transactions= null;
              $scope.transactions= {};
              $scope.tot_in=0;
              $scope.tot_out=0;
              
              for (var ind = result.length-1; ind >=0 ; ind--) {
                  var data = JSON.parse(result[ind]);
                  var tr_date = new Date(data.time*1000);
                  if ($scope.lock_date && tr_date.getTime() <  $scope.lock_date_begin.getTime()) {
                          result.slice(ind,1);
                  } else {
                      $scope.transactions[ind]={'id': (ind), 'data':data};
                      $scope.transactions[ind].data.status = $scope.transactions[ind].data.status;
                      $scope.transactions[ind].data.to_name = contactservice.getContactName($scope.contacts, $scope.transactions[ind].data.addr_to);
                      $scope.transactions[ind].data.from_name = contactservice.getContactName($scope.contacts, $scope.transactions[ind].data.addr_from);
                      $scope.transactions[ind].data.memo = $scope.getTransactionMessage($scope.transactions[ind].data);
                      $scope.transactions[ind].data.currency='';
                      if ($scope.transactions[ind].data.type=='Transfer' || $scope.transactions[ind].data.type=='Pledge'){
                          $scope.transactions[ind].data.currency=globalFuncs.currencies.CUR_nanti;
                      } else if ($scope.transactions[ind].data.type=='TransferCredit'){
                          $scope.transactions[ind].data.currency=globalFuncs.currencies.CUR_credit_mut;
                      }
                      
                      if ($scope.transactions[ind].data.addr_to==$scope.watched_address.toLowerCase()){
                          $scope.tot_in +=  Number($scope.transactions[ind].data.recieved) - Number($scope.transactions[ind].data.tax);
                      }
                      if ($scope.transactions[ind].data.addr_from==$scope.watched_address.toLowerCase()){
                          $scope.tot_out+= Number($scope.transactions[ind].data.sent);
                      }
                  }
              }
              
              if (result.length==count){
                  document.getElementById("addTransactions").style.display = 'block';
                  $scope.showNoMore =false;
              } else {
                  $scope.showNoMore = ! $scope.showNone;
              }
              
              if (result.length>0){
                  $scope.showNone = false;
              }
              
              globalFuncs.hideLoadingWaiting();  
          })  
      
        

    }
    

    

    
    $scope.addTransactions = function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.index = $scope.index+1;
        $scope.loadTransactions($scope.tra_number,($scope.index)*$scope.tra_number + $scope.tra_offset);
    }
     $scope.prevTransactions = function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.index = $scope.index-1;
        $scope.loadTransactions($scope.tra_number,$scope.index*$scope.tra_number + $scope.tra_offset);
    }
    
    $scope.refreshTrans = function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.index = 0;
        if (!$scope.requested_tra_number){
            $scope.requested_tra_number=$scope.tra_number;
        }
        if ($scope.requested_tra_number<1){
            $scope.requested_tra_number=1;
        } else if ($scope.requested_tra_number>20){
            $scope.requested_tra_number=20;
        }
        $scope.tra_number = $scope.requested_tra_number;
        $scope.loadTransactions($scope.tra_number,$scope.index*$scope.tra_number + $scope.tra_offset);
    }
    
    
    $scope.openDetails = function(tid){
        
        $scope.selectedTrans=null;
        
        for (var transId in $scope.transactions){
            if (transId==tid){
                $scope.selectedTrans=$scope.transactions[transId].data;
                break;
            }
        }
        
        if ($scope.selectedTrans){
          $scope.current_trans_memo =   $scope.getTransactionMessage($scope.selectedTrans); 
          $scope.ref_trans_memo = $scope.current_trans_memo ;
          $scope.current_tran_hash_info='{"transactionHash":"'+$scope.selectedTrans.hash+'","block":"'+$scope.selectedTrans.block+'"}';
          $scope.transDetails.open();
        }
    }
    
    $scope.closeDetails = function(){
        $scope.current_trans_memo = document.getElementById('current_trans_memo').value;
        $scope.transDetails.close(); 
        if ($scope.current_trans_memo.trim() != $scope.ref_trans_memo.trim()) {
             $scope.memos = memoService.setMemo($scope.memos, $scope.selectedTrans.hash,$scope.current_trans_memo);
             if(!$scope.isApp){
                 $scope.blobMemo = memoService.getMemoBlob($scope.memos)
             }
             
             globalFuncs.showLoading($translate.instant("GP_Wait"));
             $scope.loadTransactions($scope.tra_number,$scope.index*$scope.tra_number + $scope.tra_offset);
             memoService.storeIpfsMemos($scope.wallet,walletService.password);
        }
    }
    
    
     $scope.addCtc = function(address){
        $scope.curraddress=address;
        $scope.currName=contactservice.getContactName($scope.contacts,$scope.curraddress);
        $scope.indctc=-1
        for (var i in $scope.contacts){
            if ($scope.contacts[i].address.toUpperCase() == address.toUpperCase()){
              $scope.indctc=i;
            }
        } 
        
        $scope.addContact.open();
    }
    
    $scope.saveContact = function(){
        $scope.addContact.close();
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        
        $scope.contacts = contactservice.addEditContact($scope.contacts, $scope.curraddress, $scope.currName);
        contactservice.storeIpfsContact($scope.contacts, $scope.wallet, walletService.password);
        
        $scope.loadTransactions($scope.tra_number,$scope.index*$scope.tra_number + $scope.tra_offset);

        
    }
    
    
    $scope.exportMemos = function(){
        $scope.exportTraModal.open(); 
    }
    
    $scope.start_date =  new Date();
    $scope.end_date =  new Date();
    $scope.start_time =  0;
    $scope.end_time = 24;
    
    $scope.addBalance = function(walletAddress,list,index){
        if (index>=list.length){
            globalFuncs.generateTransPDF(walletAddress,
                                         list, 
                                         { "proper_name":contactservice.getContactName($scope.contacts, walletAddress),
                                           "date":$translate.instant("PDF_T_date").replace(/[\n\r]+/g, ''),
                                           "requestAddress":$translate.instant("PDF_T_Address").replace(/[\n\r]+/g, ''),
                                           "title":$translate.instant("PDF_T_title").replace(/[\n\r]+/g, ''),
                                           "titleNext":$translate.instant("PDF_T_title_ext").replace(/[\n\r]+/g, ''),
                                           "initBal":$translate.instant("PDF_T_initial_b").replace(/[\n\r]+/g, ''),
                                           "finalBal":$translate.instant("PDF_T_final_b").replace(/[\n\r]+/g, ''),
                                           "dateCol":$translate.instant("PDF_T_col_date").replace(/[\n\r]+/g, ''),
                                           "textCol":$translate.instant("PDF_T_col_text").replace(/[\n\r]+/g, ''),
                                           "memoCol":$translate.instant("PDF_T_col_memo").replace(/[\n\r]+/g, ''),
                                           "sendCol":$translate.instant("PDF_T_col_send").replace(/[\n\r]+/g, ''),
                                           "recievedCol":$translate.instant("PDF_T_col_recieve").replace(/[\n\r]+/g, ''),
                                           "balanceCol":$translate.instant("PDF_T_col_balance").replace(/[\n\r]+/g, ''),
                                           "disclaimer":$translate.instant("PDF_T_diclaimer").replace(/[\n\r]+/g, ''),
                                           "totals":$translate.instant("PDF_T_total").replace(/[\n\r]+/g, '')
                                         }, 
                                         $scope.start_date,
                                         $scope.end_date,
                                         function(doc){
                                              var name= "Transactions_"+$scope.start_date.getFullYear()+'-'+($scope.start_date.getMonth()+1)+'-'+ ($scope.start_date.getDate())+"_"+$scope.end_date.getFullYear()+'-'+($scope.end_date.getMonth()+1)+'-'+ ($scope.end_date.getDate())+".pdf";
                                              doc.save(name);
                                         });
            
            
            
            
        } else {
            globalFuncs.getAmmountAt(globalFuncs.slockitBalance, walletAddress, list[index].data.block, function(value){
                list[index].data.balance = value;
                $scope.addBalance(walletAddress,list,index+1);
            });
        }
    }
    
    $scope.ExportTra=function(){
        $scope.start_time=Math.round($scope.start_time);
        if ($scope.start_time <0){
            $scope.start_time=0;
        } else if  ($scope.start_time >23){
            $scope.start_time=23;
        }
        
        $scope.end_time=Math.round($scope.end_time);
         if ($scope.end_time <1){
            $scope.end_time=1;
        } else if  ($scope.end_time >24){
            $scope.end_time=24;
        }
        
       if ($scope.end_date.getTime()<$scope.start_date.getTime()){
            var swap = $scope.start_date;
            $scope.start_date=$scope.end_date;
            $scope.end_date=swap;
       }
       
       $scope.start_date=new Date($scope.start_date.getFullYear(), $scope.start_date.getMonth(),  $scope.start_date.getDate(),  $scope.start_time, 0, 0, 0);
       
       $scope.end_date=new Date($scope.end_date.getFullYear(), $scope.end_date.getMonth(),  $scope.end_date.getDate(), $scope.end_time-1, 59, 59, 0);
        
       if ( $scope.lock_date &&  $scope.start_date.getTime() < $scope.lock_date_begin.getTime()) {
         $scope.start_date = $scope.lock_date_begin;           
       }
        
       
        
        var d_start = $scope.start_date.getTime()/1000;
        var d_end = $scope.end_date.getTime()/1000;
        
       
        
        ajaxReq.getExportTransList($scope.watched_address,d_start,d_end, function(result){
            var trans=[];
            for (var ind = 0; ind < result.length; ++ind) {
                  trans[ind]={'id': (ind), 'data':JSON.parse(result[ind])};
                  trans[ind].data.to_name = contactservice.getContactName($scope.contacts, trans[ind].data.addr_to);
                  trans[ind].data.from_name = contactservice.getContactName($scope.contacts, trans[ind].data.addr_from);
                  trans[ind].data.memo = $scope.getTransactionMessage(trans[ind].data);
                  trans[ind].data.currency='';
                  if (trans[ind].data.type=='Transfer' || trans[ind].data.type=='Pledge' ){
                      trans[ind].data.currency=globalFuncs.currencies.CUR_nanti;
                  } else if (trans[ind].data.type=='TransferCredit'){
                      trans[ind].data.currency=globalFuncs.currencies.CUR_credit_mut;
                  } 
            }
            
            if ($scope.show_bal){
                $scope.addBalance($scope.watched_address,trans,0);
            }
            
            var cvs='"'+$translate.instant("CVS_COL_id").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_date").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_hour").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_from").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_fromAdd").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_to").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_toAdd").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_amount").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_amount_send").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_tax").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_curr").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_memo").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_del").replace(/[\n\r]+/g, '')+'","'
                       +$translate.instant("CVS_COL_tr_id").replace(/[\n\r]+/g, '')+'"\n';
                       
           for (var index = 0; index < trans.length; ++index){
               var tra=trans[index].data;
               cvs=cvs+'"'+trans[index].id+'",';
               var date = new Date(tra.time*1000);
               var str_date = $filter('date')(date, 'yyyy-MM-dd');
               var str_heure = $filter('date')(date, 'HH:mm');
               cvs=cvs+'"'+str_date+'","'+str_heure+'",';
               
               var fromAdd = tra.addr_from;
               var from ='';
               if (tra.from_name!=''){
                  from = tra.from_name;
               }
               cvs=cvs+'"'+from+'","'+fromAdd+'",';
               var toAdd = tra.addr_to;
               var to = '';
               if (tra.to_name!=''){
                  to = tra.to_name;
               }
               cvs=cvs+'"'+to+'","'+toAdd+'",';
               if ($scope.watched_address.toLowerCase()==tra.addr_to){
                   cvs=cvs+(tra.recieved-tra.tax)/100.+',,'; 
               } else {
                   cvs=cvs+','+tra.sent/100.+',';
               } 
               cvs=cvs+'"'+tra.tax/100.+'",';
               cvs=cvs+'"'+tra.currency.replace(/[\n\r]+/g, '')+'",';
               cvs=cvs+'"'+tra.memo.replace('"', '""')+'",';
               if ('delegate' in tra && tra.delegate){
                    cvs=cvs+'"'+tra.delegate.replace('"', '""')+'",';
               } else {
                    cvs=cvs+'"",';
               }
               
               cvs=cvs+'"'+tra.hash+'"\n';
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
           
           $scope.exportTraModal.close();
            
        });
    }
  
    

  
  //////////////////////////// notification
  
  $scope.$on("$destroy", function() {
      if ($scope.check_interval_id){
          clearInterval($scope.check_interval_id);
      }
  });
  
  
  $scope.check_interval_id=null;
  $scope.last_trans_id=null;
  $scope.last_trans_status=-1;
  
  $scope.watch_click = function(){
     
      $scope.watching = !$scope.watching;
      localStorage.setItem('ComChainWatchTransaction',JSON.stringify($scope.watching));
      if (!$scope.watching ){
          if ($scope.check_interval_id){
            clearInterval($scope.check_interval_id);
          }
      } else {
         ajaxReq.getTransList($scope.watched_address,1,0,function(result){
            if (result.length==1){
                var res = JSON.parse(result[0]);
                $scope.last_trans_id=res.hash;
                $scope.last_trans_status=res.status;
            }
         });
         
         $scope.check_interval_id = setInterval(function(){
            ajaxReq.getTransList($scope.watched_address,1,0,function(result){
                if (result.length==1){
                    var new_tra=JSON.parse(result[0]);
                    if ($scope.last_trans_id!=new_tra.hash || $scope.last_trans_status!=new_tra.status){
                        
                         
                         var title = $translate.instant("TRA_new_tra").replace("\n","");
                         var message = '';
                         if (new_tra.FROM==$scope.watched_address.toLowerCase()){
                             message = message + $translate.instant("TRA_Paid").replace("\n","");
                             message = message +' '+ (new_tra.sent/100.) +' '+$scope.CUR;
                         } else {
                             message = message + $translate.instant("TRA_Got").replace("\n","");
                             message = message +' '+ ((new_tra.recieved-new_tra.tax)/100.) +' '+$scope.CUR;
                         }
                         
                         if ($scope.last_trans_id!=new_tra.hash)
                         globalFuncs.notify(title,message);
                         
                         $scope.last_trans_id=new_tra.hash;
                         $scope.last_trans_status=new_tra.status;
                         $scope.refreshTrans();
                    }
                   
                }
            });
            
         },15000);  
      }
      
  }
  
  /// check
  
   $scope.helloToTran = function(text){
      try{
          var tran_hash = JSON.parse(text) 
          if (!tran_hash || !tran_hash.transactionHash){
              throw "notValid";
          }
          
          ajaxReq.getTransCheck(tran_hash.transactionHash,function(result){
             
              if (result.error){
                  if (result.msg.length>0){
                    alert($translate.instant("TRA_NotValidCode").replace("\n", ""));
                    throw "notValid";
                  } else {
                     $scope.tr_found=false;  
                  }
              } else{
                  $scope.tr_found=true; 
                  
                  if(typeof result =='object') {
                      $scope.selectedTrans=result;
                  } else {
                      $scope.selectedTrans=JSON.parse(result);
                  } 
                  
                  $scope.from_name=contactservice.getContactName($scope.contacts, $scope.selectedTrans.addr_from);
                  $scope.to_name=contactservice.getContactName($scope.contacts, $scope.selectedTrans.addr_to);
                  $scope.selectedTrans.currency='';
                  if ($scope.selectedTrans.type=='Transfer' || $scope.selectedTrans.type=='Pledge'){
                      $scope.selectedTrans.currency=globalFuncs.currencies.CUR_nanti;
                  } else if ($scope.selectedTrans.type=='TransferCredit'){
                      $scope.selectedTrans.currency=globalFuncs.currencies.CUR_credit_mut;
                  }
              }
              
              $scope.verifyModal.open();
              
          });
          
          
      } catch(e){
          alert($translate.instant("TRA_NotValidCode").replace("\n",""));
      }
      
     
      $scope.$apply();
    }
   
    $scope.checkTran = function(){
      cordova.plugins.barcodeScanner.scan(
        function (result) {
			$scope.helloToTran(result.text);
	    }, 
		function (error) {
			alert("Scanning failed: " + error);
		}, {'SCAN_MODE': 'QR_CODE_MODE'});
    }
    
 
    //// wallet selection
    
    $scope.pickWallet = function() {
        $scope.possible_wallets_add = [];
        for (var add in $scope.possible_wallets) {
            $scope.possible_wallets_add.push(add);

        }
        $scope.showSelectorPop = true;
    }
    
    $scope.closeSelectPop = function() {
        $scope.showSelectorPop = false;
    }
    
    $scope.pickSel= function(address) {
        $scope.watched_address = address;
        var new_selection = $scope.possible_wallets[address];
        $scope.show_bal = new_selection.viewbalance;
        $scope.lock_date = !new_selection.viewoldtran;
        $scope.lock_date_begin = new_selection.begin;
        

        $scope.showSelectorPop = false;
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.loadWatchedWallet();
    }
  
	
};
module.exports = readonlytransactionsCtrl;


