'use strict';
var transactionsCtrl = function($scope, $locale, $sce, walletService,contactservice,memoService, $translate, $filter) {
    // Check the environment
    $scope.isApp =  globalFuncs.isApp();
    $scope.currentWalletAddress=globalFuncs.getWalletAddress();
    
    // Create the modal popups
	$scope.addContact = new Modal(document.getElementById('addContact'));
  	$scope.transDetails = new Modal(document.getElementById('transDetails'));
    $scope.pendingApprovalHelpModal = new Modal(document.getElementById('approval_help_pop'));
    $scope.pendingRequestHelpModal = new Modal(document.getElementById('pending_help_pop'));
    $scope.sendTransactionModal = new Modal(document.getElementById('acceptRequestPay'));
    $scope.rejectTransactionModal = new Modal(document.getElementById('reject_Request'));
    $scope.conf_requestModal = new Modal(document.getElementById('conf_request'));
    $scope.conf_dissModal = new Modal(document.getElementById('conf_diss'));
    $scope.exportTraModal = new Modal(document.getElementById('exportTraPop'));
    $scope.verifyModal = new Modal(document.getElementById('transVerify'));
    
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
    $scope.is_locked = false;
    $scope.CUR='';
    
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
        globalFuncs.getAccInfo(globalFuncs.slockitAccStatus, $scope.wallet.getAddressString(), function(status){
           $scope.is_locked = status==0;
        });
        $scope.CUR=globalFuncs.currencies.CUR;
	});
    
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
        
        
          ajaxReq.getTransList($scope.currentWalletAddress,count,offset,function(result){
              $scope.contacts = contactservice.loadContacts();
              $scope.transactions= null;
              $scope.transactions= {};
              $scope.tot_in=0;
              $scope.tot_out=0;
              
              for (var ind = 0; ind < result.length; ++ind) {
                  $scope.transactions[ind]={'id': (ind), 'data':JSON.parse(result[ind])};
                  $scope.transactions[ind].data.to_name = contactservice.getContactName($scope.contacts, $scope.transactions[ind].data.addr_to);
                  $scope.transactions[ind].data.from_name = contactservice.getContactName($scope.contacts, $scope.transactions[ind].data.addr_from);
                  $scope.transactions[ind].data.memo = memoService.getMemo($scope.memos,$scope.transactions[ind].data.hash);
                  $scope.transactions[ind].data.currency='';
                  if ($scope.transactions[ind].data.type=='Transfer' || $scope.transactions[ind].data.type=='Pledge'){
                      $scope.transactions[ind].data.currency=globalFuncs.currencies.CUR_nanti;
                  } else if ($scope.transactions[ind].data.type=='TransferCredit'){
                      $scope.transactions[ind].data.currency=globalFuncs.currencies.CUR_credit_mut;
                  }
                  
                  if ($scope.transactions[ind].data.addr_to==$scope.currentWalletAddress){
                      $scope.tot_in +=  Number($scope.transactions[ind].data.recieved);
                  }
                  if ($scope.transactions[ind].data.addr_from==$scope.currentWalletAddress){
                      $scope.tot_out+= Number($scope.transactions[ind].data.sent);
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
    
    $scope.loadPendingTransactions = function(){
        globalFuncs.notifyApproval();
        globalFuncs.getPendingRequestList($scope.currentWalletAddress,0,1, function(list){
            $scope.pendingRequest=list;
            if ( $scope.pendingRequest.length>0){
                 $scope.request_tab=2;
            }
            globalFuncs.getRejectedRequestList($scope.currentWalletAddress,0,1, function(list){
              $scope.rejectedRequest=list;
              if ( $scope.rejectedRequest.length>0){
                 $scope.request_tab=1;
              }
              globalFuncs.getAcceptedRequestList($scope.currentWalletAddress,0,1, function(list){
                 $scope.acceptedRequest=list;
                 if ( $scope.acceptedRequest.length>0){
                     $scope.request_tab=0;
                 }
              });
           });
        });
        
        globalFuncs.getRequestToApproveList($scope.currentWalletAddress,0,1, function(list){
            $scope.pendingApproval=list;
        });
    }
    
    $scope.contacts = contactservice.loadContacts();
    $scope.index=0;
    $scope.loadTransactions($scope.tra_number,$scope.index*$scope.tra_number + $scope.tra_offset);
    $scope.loadPendingTransactions();
    
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
        $scope.loadPendingTransactions();
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
          $scope.current_trans_memo =  memoService.getMemo($scope.memos, $scope.selectedTrans.hash);
          $scope.current_tran_hash_info='{"transactionHash":"'+$scope.selectedTrans.hash+'","block":"'+$scope.selectedTrans.BLOCK+'"}';
          $scope.transDetails.open();
        }
    }
    
    $scope.closeDetails = function(){
        $scope.current_trans_memo = document.getElementById('current_trans_memo').value;
        $scope.memos = memoService.setMemo($scope.memos, $scope.selectedTrans.hash,$scope.current_trans_memo);
         if(!$scope.isApp){
             $scope.blobMemo = memoService.getMemoBlob($scope.memos)
         }
         $scope.transDetails.close(); 
         globalFuncs.showLoading($translate.instant("GP_Wait"));
         $scope.loadTransactions($scope.tra_number,$scope.index*$scope.tra_number + $scope.tra_offset);
         memoService.storeIpfsMemos($scope.wallet,walletService.password);
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
        $scope.contacts = contactservice.addEditContact($scope.curraddress,$scope.currName);
        
        
        $scope.loadTransactions($scope.tra_number,$scope.index*$scope.tra_number + $scope.tra_offset);
        contactService.storeIpfsContact($scope.wallet, walletService.password);

        
    }
    
    
    $scope.exportMemos = function(){
        $scope.exportTraModal.open(); 
    }
    
    $scope.start_date =  new Date();
    $scope.end_date =  new Date();
    $scope.start_time =  0;
    $scope.end_time = 24;
    
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
        
        
        $scope.start_date=new Date($scope.start_date.getFullYear(), $scope.start_date.getMonth(),  $scope.start_date.getDate(),  $scope.start_time, 0, 0, 0);
        $scope.end_date=new Date($scope.end_date.getFullYear(), $scope.end_date.getMonth(),  $scope.end_date.getDate(), $scope.end_time-1, 59, 59, 0);
        
        
       if ($scope.end_date.getTime()<$scope.start_date.getTime()){
            var swap = $scope.start_date;
            $scope.start_date=$scope.end_date;
            $scope.end_date=swap;
       }
        
        var d_start = $scope.start_date.getTime()/1000;
        var d_end = $scope.end_date.getTime()/1000;
        
       
        
        ajaxReq.getExportTransList($scope.currentWalletAddress,d_start,d_end, function(result){
            var trans=[];
            for (var ind = 0; ind < result.length; ++ind) {
                  trans[ind]={'id': (ind), 'data':JSON.parse(result[ind])};
                  trans[ind].data.to_name = contactservice.getContactName($scope.contacts, trans[ind].data.addr_to);
                  trans[ind].data.from_name = contactservice.getContactName($scope.contacts, trans[ind].data.addr_from);
                  trans[ind].data.memo = memoService.getMemo($scope.memos,trans[ind].data.hash);
                  trans[ind].data.currency='';
                  if (trans[ind].data.type=='Transfer' || trans[ind].data.type=='Pledge' ){
                      trans[ind].data.currency=globalFuncs.currencies.CUR_nanti;
                  } else if (trans[ind].data.type=='TransferCredit'){
                      trans[ind].data.currency=globalFuncs.currencies.CUR_credit_mut;
                  } 
            }
            
            globalFuncs.generateTransPDF($scope.currentWalletAddress,
                                         trans, 
                                         { "date":$translate.instant("PDF_T_date").replace(/[\n\r]+/g, ''),
                                           "requestAddress":$translate.instant("PDF_T_Address").replace(/[\n\r]+/g, ''),
                                           "title":$translate.instant("PDF_T_title").replace(/[\n\r]+/g, ''),
                                           "titleNext":$translate.instant("PDF_T_title_ext").replace(/[\n\r]+/g, ''),
                                           "dateCol":$translate.instant("PDF_T_col_date").replace(/[\n\r]+/g, ''),
                                           "textCol":$translate.instant("PDF_T_col_text").replace(/[\n\r]+/g, ''),
                                           "sendCol":$translate.instant("PDF_T_col_send").replace(/[\n\r]+/g, ''),
                                           "recievedCol":$translate.instant("PDF_T_col_recieve").replace(/[\n\r]+/g, ''),
                                           "totals":$translate.instant("PDF_T_total").replace(/[\n\r]+/g, '')
                                         }, 
                                         function(doc){
                                                 var uri = doc.output('datauristring');
                                                 window.open(uri, '_blank', 'location=no');
                                         });
            
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
               if ($scope.currentWalletAddress==tra.addr_to){
                   cvs=cvs+tra.recieved/100.+',,'; 
               } else {
                   cvs=cvs+','+tra.sent/100.+',';
               } 
               cvs=cvs+'"'+tra.tax/100.+'",';
               cvs=cvs+'"'+tra.currency.replace(/[\n\r]+/g, '')+'",';
               cvs=cvs+'"'+tra.memo.replace('"', '""')+'",';
               if ('delegate' in tra){
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
  
    

    
    
    ////////////////////////////////////////////////////////////////
      $scope.handlePendingRequest= function(){
       
       $scope.req_index=0;
       $scope.req_number=4;
       $scope.req_offset=0;
       
       $scope.app_index=0;
       $scope.app_number=4;
       $scope.app_offset=0;
       
       $scope.rej_index=0;
       $scope.rej_number=4;
       $scope.rej_offset=0;
       
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.loadPendingRequests($scope.req_number,$scope.req_index*$scope.req_number + $scope.req_offset);
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.loadApprovedRequests($scope.app_number,$scope.app_index*$scope.app_number + $scope.app_offset);
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.loadRejectedRequests($scope.rej_number,$scope.rej_index*$scope.rej_number + $scope.rej_offset);
        
       document.getElementById('pending_tab').style.display="inline-block"; 
       setTimeout(function () {
        document.getElementById('pending_tab').style.top="62px";
       }, 200);
       
    }
    
    $scope.nextPending = function(){
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.req_index = $scope.req_index+1;
       $scope.loadPendingRequests($scope.req_number,$scope.req_index*$scope.req_number + $scope.req_offset);
    }
    
    $scope.prevPending = function(){
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.req_index = $scope.req_index-1;
       $scope.loadPendingRequests($scope.req_number,$scope.req_index*$scope.req_number + $scope.req_offset);
    }
    
    $scope.nextRejected = function(){
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.rej_index = $scope.rej_index+1;
       $scope.loadRejectedRequests($scope.rej_number,$scope.rej_index*$scope.rej_number + $scope.rej_offset);
    }
    
    $scope.prevRejected = function(){
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.rej_index = $scope.rej_index-1;
       $scope.loadRejectedRequests($scope.rej_number,$scope.rej_index*$scope.rej_number + $scope.rej_offset);
    }
    
    $scope.nextAccepted = function(){
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.app_index = $scope.app_index+1;
       $scope.loadApprovedRequests($scope.app_number,$scope.app_index*$scope.app_number + $scope.app_offset);
    }
    
    $scope.prevAccepted = function(){
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.app_index = $scope.app_index-1;
       $scope.loadApprovedRequests($scope.app_number,$scope.app_index*$scope.app_number + $scope.app_offset);
    }
    
    $scope.refreshPending = function(){
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.req_index = 0;
       $scope.app_index = 0;
       $scope.rej_index = 0;
       $scope.loadPendingRequests($scope.req_number,$scope.req_index*$scope.req_number + $scope.req_offset);
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.loadApprovedRequests($scope.app_number,$scope.app_index*$scope.app_number + $scope.app_offset);
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.loadRejectedRequests($scope.rej_number,$scope.rej_index*$scope.rej_number + $scope.rej_offset);
       
       setTimeout(function(){  
           if ( $scope.pendingRequest.length>0){
              $scope.request_tab=2;
           }
           if ( $scope.rejectedRequest.length>0){
              $scope.request_tab=1;
           }
           if ( $scope.acceptedRequest.length>0){
              $scope.request_tab=0;
           }
       }, 200);
      
    }
    
      
    $scope.loadPendingRequests= function(count,offset){

         $scope.noMorePending = true;
         if (offset>0){
              document.getElementById("prevPending").style.display = 'block';
       
          } else {
               document.getElementById("prevPending").style.display = 'none';
          
          }
          
          document.getElementById("nextPending").style.display = 'none';
        
          
         globalFuncs.getPendingRequestList($scope.wallet.getAddressString(),offset,offset+count-1 ,
                                     function(list){
                                         $scope.pendingRequest = list;
                                         $scope.noMorePending = $scope.pendingRequest.length<count;
                                         
                                         if (!$scope.noMorePending){
                                              document.getElementById("nextPending").style.display = 'block';
                                         }
                                         
                                       
                                         for(var ind =0;ind<$scope.pendingRequest.length;ind++){
                                            $scope.pendingRequest[ind].name =  contactservice.getContactName($scope.contacts, $scope.pendingRequest[ind].address); 
                                         }
                                          // $scope.$apply();
                                         $scope.transPendingStatus='';
                                         globalFuncs.hideLoadingWaiting();  
                                     });
        
    }
    
    
      $scope.loadRejectedRequests= function(count,offset){

         $scope.noMoreRejected = true;
         if (offset>0){
              document.getElementById("prevRejected").style.display = 'block';
       
          } else {
               document.getElementById("prevRejected").style.display = 'none';
          
          }
          
          document.getElementById("nextRejected").style.display = 'none';
        
          
         globalFuncs.getRejectedRequestList($scope.wallet.getAddressString(),offset,offset+count-1 ,
                                     function(list){
                                         $scope.rejectedRequest = list;
                                         $scope.noMoreRejected = $scope.rejectedRequest.length<count;
                                         
                                         if (!$scope.noMoreRejected){
                                              document.getElementById("nextRejected").style.display = 'block';
                                         }
                                         
                                       
                                         for(var ind =0;ind<$scope.rejectedRequest.length;ind++){
                                            $scope.rejectedRequest[ind].name =  contactservice.getContactName($scope.contacts, $scope.rejectedRequest[ind].address); 
                                         }
                                          // $scope.$apply();
                                         $scope.transPendingStatus='';
                                         globalFuncs.hideLoadingWaiting();  
                                     });
        
    }
    
     $scope.loadApprovedRequests= function(count,offset){

         $scope.noMoreAccepted = true;
         if (offset>0){
              document.getElementById("prevAccepted").style.display = 'block';
       
          } else {
               document.getElementById("prevAccepted").style.display = 'none';
          
          }
          
          document.getElementById("nextAccepted").style.display = 'none';
        
          
         globalFuncs.getAcceptedRequestList($scope.wallet.getAddressString(),offset,offset+count-1 ,
                                     function(list){
                                         $scope.acceptedRequest = list;
                                         $scope.noMoreAccepted = $scope.acceptedRequest.length<count;
                                         
                                         if (!$scope.noMoreAccepted){
                                              document.getElementById("nextAccepted").style.display = 'block';
                                         }
                                         
                                       
                                         for(var ind =0;ind<$scope.acceptedRequest.length;ind++){
                                            $scope.acceptedRequest[ind].name =  contactservice.getContactName($scope.contacts, $scope.acceptedRequest[ind].address); 
                                         }
                                          // $scope.$apply();
                                         $scope.transPendingStatus='';
                                         globalFuncs.hideLoadingWaiting();  
                                     });
        
    }
    
    
    $scope.dissmissRejected =function(address){
        globalFuncs.DissmissRejectedInfo($scope.wallet,address, function(res){
             if (res.isError){
                    $scope.transPendingStatus=$sce.trustAsHtml(globalFuncs.getDangerText(res.error));
             } else {
                $scope.transPendingStatus=$sce.trustAsHtml($translate.instant("TRA_Accepted_dissmissed"));
               // $scope.conf_dissModal.open();
                
                $scope.trans_message = $translate.instant("TRA_Accepted_dissmissed") + " "+ $translate.instant("GP_Wait_tran");
                $scope.waitTransaction(res.data);
            }
        });
    }
    
    $scope.dissmissAccepted =function(address){
        globalFuncs.DissmissAcceptedInfo($scope.wallet,address, function(res){
              if (res.isError){
                    $scope.transPendingStatus=$sce.trustAsHtml(globalFuncs.getDangerText(res.error));
             } else {
                $scope.transPendingStatus=$sce.trustAsHtml($translate.instant("TRA_Accepted_dissmissed"));
                $scope.trans_message = $translate.instant("TRA_Accepted_dissmissed") + " "+ $translate.instant("GP_Wait_tran");
                //$scope.conf_dissModal.open();
                $scope.waitTransaction(res.data);
            }
        });
    }
    
    
    
    
    $scope.closePending = function(){
       
        document.getElementById('pending_tab').style.top="100%";
         setTimeout(function () {
              document.getElementById('pending_tab').style.display="none"; 
              $scope.loadPendingTransactions();
         }, 700);
    }
    
    $scope.pendingHelp = function(){
        $scope.pendingRequestHelpModal.open();
      
    }
    ////////////////////////////////////////////////////////////////
      $scope.handlePendingApproval = function(){
       $scope.transApprovalStatus='';
       $scope.app_index=0;
       $scope.app_number=4;
       $scope.app_offset=0;
       
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       $scope.loadPendingApprovals($scope.app_number,$scope.app_index*$scope.app_number + $scope.app_offset);
        
       document.getElementById('approval_tab').style.display="inline-block"; 
       setTimeout(function () {
        document.getElementById('approval_tab').style.top="62px";
       }, 200);
       
    }
    
    $scope.nextApproval = function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.app_index = $scope.app_index+1;
       $scope.loadPendingApprovals($scope.app_number,$scope.app_index*$scope.app_number + $scope.app_offset);
    }
    
    $scope.prevApproval = function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.app_index = $scope.app_index-1;
       $scope.loadPendingApprovals($scope.app_number,$scope.app_index*$scope.app_number + $scope.app_offset);
    }
    
    $scope.refreshApproval = function(){
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.app_index = 0;
       
        $scope.loadPendingApprovals($scope.app_number,$scope.app_index*$scope.app_number + $scope.app_offset);
    }
    
      
    $scope.loadPendingApprovals= function(count,offset){

         $scope.noMoreApproval = true;
         if (offset>0){
              document.getElementById("prevApproval").style.display = 'block';
       
          } else {
               document.getElementById("prevApproval").style.display = 'none';
          
          }
          
          document.getElementById("nextApproval").style.display = 'none';
        
          
         globalFuncs.getRequestToApproveList($scope.wallet.getAddressString(),offset,offset+count-1 ,
                                     function(list){
                                         $scope.pendingApproval = list;
                                         $scope.noMoreApproval = $scope.pendingApproval.length<count;
                                         
                                         if (!$scope.noMoreApproval){
                                              document.getElementById("nextApproval").style.display = 'block';
                                         }
                                         
                                       
                                         for(var ind =0;ind<$scope.pendingApproval.length;ind++){
                                            $scope.pendingApproval[ind].name =  contactservice.getContactName($scope.contacts, $scope.pendingApproval[ind].address); 
                                         }
                                          // $scope.$apply();
                                         $scope.transApprovalStatus='';
                                         globalFuncs.hideLoadingWaiting();  
                                     });
        
    }
    
    
    
    
    $scope.closeApproval = function(){
       
        document.getElementById('approval_tab').style.top="100%";
         setTimeout(function () {
              document.getElementById('approval_tab').style.display="none"; 
              $scope.loadPendingTransactions();
         }, 700);
    }
    
    $scope.approvalHelp = function(){
        $scope.pendingApprovalHelpModal.open();
      
    }
    
    $scope.payRequest = function(request){
       globalFuncs.showLoading($translate.instant("GP_Wait"));
       globalFuncs.getAmmount(
           globalFuncs.slockitElBlance,
           $scope.wallet.getAddressString(), 
           function(balanceEL){
               globalFuncs.getAmmount(
                   globalFuncs.slockitCmLimitm,
                   $scope.wallet.getAddressString(), 
                   function(limitCMm){
                     globalFuncs.getAmmount(
                       globalFuncs.slockitCmBlance,
                       $scope.wallet.getAddressString(), 
                       function(balanceCM){
                           $scope.trPass=walletService.getPass();
                           $scope.tr_err_message='';
                           $scope.trStatus='';
                           globalFuncs.hideLoadingWaiting();  
                           $scope.transaction_amount =  request.amount;
                           $scope.transaction_to = request.address;
                           $scope.selectedName = request.name;
                           $scope.typeTrans='no';
                           var cur_tran_type = globalFuncs.getTransCurrency(balanceEL, balanceCM, limitCMm, request.amount);
                           if (cur_tran_type=='cm'){
                                $scope.typeTrans=globalFuncs.currencies.CUR_credit_mut;
                           } else if (cur_tran_type=='nant'){
                                $scope.typeTrans=globalFuncs.currencies.CUR_nanti;
                           } else {
                                $scope.tr_err_message=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant('TRAN_NotPossible'))); 
                           }
                           
                           $scope.sendTransactionModal.open();
                       });
            });
        });   
       
            
    }
    
    $scope.sendTx = function(){
         if ($scope.trPass.length==0){
            globalFuncs.unlock(function(result){
                if (result) {
                    $scope.trPass=walletService.password;
                }
                $scope.sendTxOld();
            });
         } else {
             $scope.sendTxOld();
         }
    }
    
    $scope.sendTxOld = function(){
      if ($scope.trPass==walletService.password){
        walletService.setUsed();
        $scope.sendTransactionModal.close();
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        if ($scope.typeTrans==globalFuncs.currencies.CUR_credit_mut){
            globalFuncs.PayRequestCM($scope.wallet, $scope.transaction_to ,  Math.round($scope.transaction_amount*100),  function(res){
                   globalFuncs.hideLoadingWaiting();  
                   if (res.isError){
                       $scope.tr_err_message=$sce.trustAsHtml(globalFuncs.getDangerText(res.error));
                       $scope.sendTransactionModal.open();
                   } else {
                       $scope.tr_err_message=$translate.instant("TRAN_Done");
                       $scope.transApprovalStatus=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("TRA_Request_Payed")));
                       $scope.trans_message = $translate.instant("TRA_Request_Payed") + " "+ $translate.instant("GP_Wait_tran");
                       $scope.waitTransaction(res.data);
                       $scope.openConf();
                   }
            });
        } else if ($scope.typeTrans==globalFuncs.currencies.CUR_nanti){
            globalFuncs.PayRequestNant($scope.wallet, $scope.transaction_to ,  Math.round($scope.transaction_amount*100),  function(res){
                   globalFuncs.hideLoadingWaiting();  
                   if (res.isError){
                       $scope.tr_err_message=$sce.trustAsHtml(globalFuncs.getDangerText(res.error));
                       $scope.sendTransactionModal.open();
                   } else {
                       $scope.tr_err_message=$translate.instant("TRAN_Done");
                       $scope.transApprovalStatus=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("TRA_Request_Payed")));
                       $scope.trans_message = $translate.instant("TRA_Request_Payed") + " "+ $translate.instant("GP_Wait_tran");
                       $scope.waitTransaction(res.data);
                       $scope.openConf();
                   }
            });
        } 
      } else {
          $scope.trStatus=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("TRAN_WrongPass")));
      }
    }
    

    
    
    $scope.rejectRequest = function(request){
         $scope.trPass=walletService.getPass();
         $scope.trRejectStatus='';
         $scope.err_reject_message='';
         $scope.typeTrans='no';
         $scope.transaction_amount = request.amount;
         $scope.transaction_to = request.address;
         $scope.selectedName = request.name;
         $scope.rejectTransactionModal.open();
    }
    
    $scope.rejectTx = function(){
         if ($scope.trPass.length==0){
            globalFuncs.unlock(function(result){
                if (result) {
                    $scope.trPass=walletService.password;
                }
                $scope.rejectTxOld();
            });
         } else {
             $scope.rejectTxOld();
         }
    }
    
    $scope.rejectTxOld = function(){
       if ($scope.trPass==walletService.password){
            walletService.setUsed();
            $scope.rejectTransactionModal.close();
            globalFuncs.showLoading($translate.instant("GP_Wait"));
            globalFuncs.RejectRequest($scope.wallet, $scope.transaction_to , function(res){
                 globalFuncs.hideLoadingWaiting();  
                 if (res.isError){
                    $scope.err_reject_message=$sce.trustAsHtml(globalFuncs.getDangerText(res.error));
                    $scope.rejectTransactionModal.open();
                 } else {
                    $scope.waitTransaction(res.data);
                    $scope.err_reject_message=$translate.instant("TRAN_Done");
                    $scope.transApprovalStatus=$sce.trustAsHtml(globalFuncs.getSuccessText($translate.instant("TRA_Request_Rejected")));
                   
                    $scope.trans_message = $translate.instant("TRA_Request_Rejected") + " "+ $translate.instant("GP_Wait_tran");
                    $scope.typeTrans='no';
                    //$scope.openConf();
                 }
            });
       } else {
          $scope.trRejectStatus=$sce.trustAsHtml(globalFuncs.getDangerText($translate.instant("TRAN_WrongPass")));
      }
    }
   
    $scope.openConf = function(){
         $scope.conf_requestModal.open(); 
    }
    
  $scope.refresh = function(){
       $scope.refreshApproval();
       $scope.refreshPending();
  }
    
  $scope.interval_id=null;
  
   
  
  
  $scope.recievedTransaction = function(){
        clearInterval($scope.interval_id);
        $scope.refresh();
        $scope.$apply();
  }
  
  $scope.waitTransaction = function(transaction_ash){
      if ($scope.interval_id){
          clearInterval($scope.interval_id);
          $scope.interval_id=null;
      }
      
      globalFuncs.showWaiting($scope.trans_message);
      
      $scope.interval_id = setInterval(function(){
          ajaxReq.getBlock(transaction_ash, function(block_json){
              if (block_json.blockNumber && block_json.blockNumber.startsWith('0x')){
                 $scope.recievedTransaction();
              }
          });
      },5000);  
  }     
    
  
  //////////////////////////// notification
  
  $scope.$on("$destroy", function() {
      if ($scope.check_interval_id){
          clearInterval($scope.check_interval_id);
      }
  });
  
  
  $scope.check_interval_id=null;
  $scope.last_trans_id=null;
  
  $scope.watch_click = function(){
      $scope.watching = !$scope.watching;
      if (!$scope.watching ){
          if ($scope.check_interval_id){
            clearInterval($scope.check_interval_id);
          }
      } else {
         ajaxReq.getTransList($scope.currentWalletAddress,1,0,function(result){
            if (result.length==1){
                $scope.last_trans_id=JSON.parse(result[0]).hash;
            }
         });
         
         $scope.check_interval_id = setInterval(function(){
            ajaxReq.getTransList($scope.currentWalletAddress,1,0,function(result){
                if (result.length==1){
                    var new_tra=JSON.parse(result[0]);
                    if ($scope.last_trans_id!=new_tra.hash){
                         $scope.last_trans_id=new_tra.hash;
                         
                         var title = $translate.instant("TRA_new_tra").replace("\n","");
                         var message = '';
                         if (new_tra.FROM==$scope.currentWalletAddress){
                             message = message + $translate.instant("TRA_Paid").replace("\n","");
                             message = message +' '+ (new_tra.sent/100.) +' '+$scope.CUR;
                         } else {
                             message = message + $translate.instant("TRA_Got").replace("\n","");
                             message = message +' '+ (new_tra.recieved/100.) +' '+$scope.CUR;
                         }
                         
                         globalFuncs.notify(title,message);
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
              $scope.contacts = contactservice.loadContacts();
             
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
  
	
};
module.exports = transactionsCtrl;


