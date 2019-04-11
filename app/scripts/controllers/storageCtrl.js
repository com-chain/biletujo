'use strict';
var storageCtrl = function($scope, $sce, walletService, contactservice, $translate) {
    
    $scope.deleteWalletModal = new Modal(document.getElementById('deleteWallet'));
    $scope.editWallModal = new Modal(document.getElementById('editWall'));

    $scope.isApp =  globalFuncs.isApp();
    globalFuncs.hideLoadingWaiting();
    $scope.private_cmp = JSON.parse(localStorage.getItem('ComChainPrivateComputer')); 
    if (! $scope.private_cmp){
         $scope.private_cmp=false;
    }
    
   
    $scope.contacts = [];
    $scope.wallets = []; 
    $scope.NoWallet = true;
    
    $scope.loadWallets = function(){
         $scope.contacts = contactservice.loadLocalContacts();
         $scope.wallets = globalFuncs.loadWallets(false);  
         $scope.NoWallet = $scope.wallets.length==0;
         if (!$scope.NoWallet){
             for (var id in $scope.wallets){
               $scope.wallets[id].name=contactservice.getContactName($scope.contacts, '0x'+$scope.wallets[id].address);
               $scope.wallets[id].logo = globalFuncs.getCurrencyLogoUrl( $scope.wallets[id].file.server.name);
               $scope.wallets[id].has_logo = $scope.wallets[id].logo !='';
               
            }
            $scope.wallets.sort(function(a,b){return a.name.localeCompare(b.name); });
         }
    }
    
    $scope.loadWallets();

   
     
    $scope.deleteWall  = function(address){
        $scope.currentAddress = address;
        for (var id in $scope.wallets){
           if ($scope.wallets[id].address==address){
              $scope.blobEnc= globalFuncs.getBlob("text/json;charset=UTF-8",$scope.wallets[id]);
           }
        }
        $scope.deleteWalletModal.open();
    }
    
    $scope.dowloadAppFile = function(){
       for (var id in $scope.wallets){
         if ($scope.wallets[id].address == $scope.currentAddress){
           globalFuncs.dowloadAppFileWithName('LEM_0x'+$scope.currentAddress+'.dat', $scope.wallets[id].file);
         }
       }
    }
    
    $scope.deleteWallet  = function(){
      for (var id in $scope.wallets){
         if ($scope.wallets[id].address==$scope.currentAddress){
             $scope.wallets.splice(id, 1);
             localStorage.setItem('ComChainWallets',JSON.stringify( $scope.wallets));  
             $scope.loadWallets();       
             $scope.NoWallet = $scope.wallets.length==0;
             break;
         }
      }
      $scope.currentAddress='';
      $scope.blobEnc='';
      $scope.deleteWalletModal.close();
    }
    
    $scope.changePrivate = function(){
        localStorage.setItem('ComChainPrivateComputer',JSON.stringify( $scope.private_cmp));
    }
    
    $scope.openWallet = function(address){
      
      for (var id in $scope.wallets){
           if ($scope.wallets[id].address==address){
                globalFuncs.showLoading($translate.instant("GP_Wait"));
                globalFuncs.loadWallet($scope.wallets[id].file,function(success){location.reload(); });
                     
          }
       }         
    }
    
    $scope.clearData = function(){
        var storage_keys = ["ComChainContacts","ComChainLocalContacts","ComChainWallets","ComChainWallet","ComChainMemos"];
        for (var key in storage_keys){
            localStorage.removeItem(storage_keys[key]);
        }
        location.reload();
    }
    
    $scope.editWall = function(address,name){
        $scope.currName=name;
        $scope.curraddress=address;
        $scope.editWallModal.open();
    }
    
     $scope.saveName = function(){
        $scope.editWallModal.close();
        globalFuncs.showLoading($translate.instant("GP_Wait"));
        $scope.contacts = contactservice.loadLocalContacts();
        var server_name ='';
        for (var id in $scope.wallets){
           if ($scope.wallets[id].address==$scope.curraddress && $scope.wallets[id].server && $scope.wallets[id].server.name){
              server_name = $scope.wallets[id].server.name;
           }
        }
        contactservice.upsertLocalContact($scope.contacts, '0x'+$scope.curraddress, $scope.currName, server_name);
        
        $scope.loadWallets(); 
        
        globalFuncs.hideLoadingWaiting();
              
        
    }
    
    
	
};
module.exports = storageCtrl;


