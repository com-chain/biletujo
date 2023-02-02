'use strict';
var memoService = function() {
    
     function getMemos(memos, force){
      if (force || !memos || memos.length==0){
         try{
           // Load memos stored in the local storage 
           memos = JSON.parse(localStorage.getItem('ComChainMemos')); 
         } catch(e){
           memos=[]; 
         }
      }
      if (!memos){
        memos=[]; 
      }
      
      return memos;
     }
      
    function getMemoBlob(memos){
      return globalFuncs.getBlob("text/json;charset=UTF-8", memos );
    }
       
    function getMemo(memos, transHash){
       memos = getMemos(memos, false);
       var curr_memo='';
       for (var memId in memos){
           if (memos[memId].transaction==transHash){
               curr_memo = memos[memId].memo;
               break;
           }
       }
       return curr_memo;
    }
    
    function setMemo(memos,transHash,memo){
        memos = getMemos(memos, false);
        var found=-1;
        for (var memId in memos){
           if (memos[memId].transaction==transHash){
               found=memId;
               break;
           }
       }
       
       if (found>=0){
         memos.splice(found, 1);
       }
       
       if (memo.trim()!=''){
             memos.unshift( {transaction:transHash,memo:memo});
       }
       
       if (memos.length>100){
           memos.pop();
       }
        
       localStorage.setItem('ComChainMemos',JSON.stringify( memos));
       return memos;
    }
    
   
    
    
    function mergeMemos(memos1, memos2, merge_type){
      for (var i in memos2){
            var ind =-1;
            for (var j in memos1){
              if (memos1[j].transaction.toUpperCase() == memos2[i].transaction.toUpperCase()){
                if (merge_type==0){
                  memos1[j].memo = memos2[i].memo;
                }
                ind=j;
              }
            }
            
            if (ind==-1){
              memos1.push( {transaction:memos2[i].transaction,memo:memos2[i].memo});
            }
         }  
         
      if (memos1.length>100){
           memos1.length=100;
       }
      
    
      localStorage.setItem('ComChainMemos',JSON.stringify( memos1));
    }
    
    
    function hexa_to_ascii(hex) {
        var str = '';
        for (var i = 0; i < hex.length; i += 2) {
            var v = parseInt(hex.substr(i, 2), 16);
            if (v) str += String.fromCharCode(v);
        }
        return str;
    }  
    
     async function loadIpfsMemos(wallet,pass){
       // get the hash storing the crypted data
       var hash = await globalFuncs.getMemoHash(wallet.getAddressString());
           // get the crypted data
           var str_hash = hexa_to_ascii(hash);
           var crypted_list = await globalFuncs.readFromIpfs(str_hash);
               if (crypted_list && crypted_list.data){
                   try{
                       // decrypte
                       var uncypher = wallet.decifer(crypted_list.data,pass);
                       // json parse
                       var ipfs_memos = JSON.parse(decodeURIComponent(escape(window.atob( uncypher))));
                       
                       localStorage.setItem('ComChainMemos',JSON.stringify( ipfs_memos));
                     /*  // merge & store
                       var local_memos=getMemos(null, true);
                       mergeMemos(local_memos, ipfs_memos, 0);
                       storeIpfsMemos(wallet,pass);*/
                   } catch(e){}
               }
              
    }
    
    
   function ascii_to_hexa(str){
	    var arr1 = [];
	    for (var n = 0, l = str.length; n < l; n ++) 
         {
		    var hex = Number(str.charCodeAt(n)).toString(16);
		    arr1.push(hex);
	     }
	    return arr1.join('');
    }
    
    function storeIpfsMemos(wallet,pass){
         var local_memos=getMemos(null, true);
         if (local_memos && local_memos.length>0){
         // encrypt the list 
          var b64 = window.btoa(unescape(encodeURIComponent(JSON.stringify(local_memos))));
          var kdfparams = JSON.parse(
             localStorage.getItem('ComChainWallet').toLowerCase()
           ).crypto.kdfparams
          var crypted = wallet.cipher(pass, b64, kdfparams);
          // push the list to IPFS and get the hash
           globalFuncs.storeOnIpfs(crypted,function(hash){
               try{
                   var json_obj = JSON.parse(hash);
                    if (json_obj.hash){
                       // push the hash to the blockchain
                       var hex_hash  = ascii_to_hexa(json_obj.hash);
                       globalFuncs.setMemoHash(wallet,hex_hash,function(){});
                    }
               } catch (e){}
              
           });
         } 
    }
    
    
  
    
    
   
    
    return {getMemos:getMemos,
            getMemoBlob:getMemoBlob,
            getMemo:getMemo,
            setMemo:setMemo,
            loadIpfsMemos:loadIpfsMemos,
            storeIpfsMemos:storeIpfsMemos
    }
   
};
module.exports = memoService;
