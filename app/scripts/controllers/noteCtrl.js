'use strict';
var noteCtrl = function($scope, $locale, $sce, walletService, $translate) {
    // Check the environment
    $scope.isApp =  globalFuncs.isApp();
    $scope.currentWalletAddress=globalFuncs.getWalletAddress();
    $scope.CUR='';
    
    $scope.showNone = true;
    $scope.processing = false;
    $scope.processed = false;
    $scope.target_amount = 0.00;
    $scope.total = 0;
    $scope.done = 0;
    $scope.info_list = [];
    $scope.value_options =[];
    $scope.target_amount_option = null;
     
    // Popups
	$scope.conf_popup = new Modal(document.getElementById('pop_conf_run'));
    
    
    
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
            
            $scope.value_options = globalFuncs.getNoteValues();
            $scope.value_options.unshift(0.00);
            $scope.target_amount_option = $scope.value_options[0];
            
            globalFuncs.hideLoadingWaiting();  
        });
    
  $scope.openGetList = function() {
        document.getElementById('ntflstselector').click();
  }
  
  
  $scope.openListFile = function($fileContent) {
      if (document.getElementById('ntflstselector').files[0]){
        try {
            var new_list = $fileContent.match(/0x[a-f0-9]{40}/mgi);
            $scope.showNone = new_list.length == 0;
            $scope.prepareList(new_list);
        } catch (e) {
          alert($translate.instant("NOT_NoValidAddress"));    
        }
	  }
  }
  
  $scope.preparInfo = function(address, length){
        globalFuncs.getAccInfo(globalFuncs.slockitAccStatus, address, function(status){
             globalFuncs.getAmmount(globalFuncs.slockitElBlance, address, function(value){
                var status_txt = "NOT_Locked";
                if (status == 1){
                    status_txt = "NOT_Unlocked";
                }
                var info = {"address":address, "amount":value, "st":status, "status":status_txt};
                $scope.local_list.push(info);
                
                if ($scope.local_list.length == length){
                     $scope.info_list = $scope.local_list;
                }
             });
          });
  }
  
  $scope.prepareList = function(address_list) {
      $scope.info_list = [];
      $scope.local_list = [];
      $scope.processed = false;
      for (var index in address_list){
        $scope.preparInfo(address_list[index], address_list.length);
       
      }
  }
  
  
  
  $scope.run = function() {
      $scope.target_amount = $scope.target_amount_option;
      $scope.conf_popup.open();
  }
  
  $scope.doRun = function(){
      $scope.conf_popup.close();
      $scope.processing = true;
      $scope.total = 0;
      $scope.done = 0;
      for (var index in $scope.info_list){
          var info = $scope.info_list[index];
          if (info.amount == $scope.target_amount){
              if (info.st == 1){ 
                 $scope.total+=1; // right amount but not locked
              } else {
                  // right amount and locked: nothing to do
              }
          } else {
              if (info.st == 1){ 
                 $scope.total+=2; // wrong amount but not locked
              } else {
                 $scope.total+=3; // wrong amount and locked
              }
          }
      }
      
      $scope.curr_index = 0;
      $scope.processInfo();
 
  }
  
  $scope.unlock = function(address){
      globalFuncs.SetAccountParam($scope.wallet, address, 1, 0, 0, 0, function(data){
                                         if (data.isError){
                                            alert($translate.instant("NOT_Processing_error") + data.error);
                                         } else {
                                            $scope.waitTransaction(data.data); 
                                         }
                                    });   
    }
  
  $scope.lock = function(address){
       globalFuncs.SetAccountParam($scope.wallet, address, 0, 0, 0, 0, function(data){
                                         if (data.isError){
                                            alert($translate.instant("NOT_Processing_error") + data.error);
                                         } else {
                                            $scope.waitTransaction(data.data); 
                                         }
                                    });
  }
  
  $scope.adjustAmount = function(address, amount){
       globalFuncs.PledgeAccount($scope.wallet, address, amount, function(data){
                                         if (data.isError){
                                             alert($translate.instant("NOT_Processing_error") + data.error);
                                         } else {
                                             $scope.waitTransaction(data.data);
                                         }
                                   });
  }
  
  // Processing coordinator
  $scope.processInfo = function(){
      if ($scope.curr_index == $scope.info_list.length){
           $scope.completed();
      } else {
          var address = $scope.info_list[$scope.curr_index].address;
          globalFuncs.getAccInfo(globalFuncs.slockitAccStatus, address, function(status){
             globalFuncs.getAmmount(globalFuncs.slockitElBlance, address, function(value){
                 $scope.info_list[$scope.curr_index].amount = value;
                 var status_txt = "NOT_Locked";
                 if (status == 1){
                    status_txt = "NOT_Unlocked";
                 }
                 $scope.info_list[$scope.curr_index].st = status;
                 $scope.info_list[$scope.curr_index].status = status_txt;
                 
                 if (value == $scope.target_amount){
                      if (status == 1){ 
                          // right amount but not locked
                          $scope.lock(address);
                      } else {
                          // right amount and locked
                          $scope.curr_index += 1;
                          $scope.processInfo();
                      }
                 } else {
                      if (status == 1){ 
                          // wrong amount but not locked
                          $scope.adjustAmount(address, value - $scope.target_amount);
                      } else {
                          // wrong amount and locked
                          $scope.unlock(address);
                      }
                 }
                 
             });
          });  
      }
  }

  // way out
  $scope.completed = function() {
     $scope.processing = false;
     $scope.processed = true;
  }
  
  
  $scope.interval_id=null;
  
  $scope.recievedTransaction = function(){
        clearInterval($scope.interval_id);
        $scope.done += 1;
        $scope.processInfo();
        $scope.refresh();
        $scope.$apply();
  }
  
  $scope.waitTransaction = function(transaction_ash){
      if ($scope.interval_id){
          clearInterval($scope.interval_id);
          $scope.interval_id=null;
      }
      
      $scope.interval_id = setInterval(function(){
          ajaxReq.getBlock(transaction_ash, function(block_json){
              if (block_json.blockNumber && block_json.blockNumber.startsWith('0x')){
                 $scope.recievedTransaction();
              }
          });
      },5000);  
  }  

  
  
   
}
module.exports = noteCtrl;
