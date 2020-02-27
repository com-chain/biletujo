'use strict';
var globalFuncs = function() {}
 
 globalFuncs.eLemTransfert = "0xa5f7c148";
 globalFuncs.lemanexTransfert = "0x60ca9c4c";
 globalFuncs.fondTransfert = "0x00d24387";
 
 globalFuncs.slockitBalance = "0x70a08231";    
 globalFuncs.slockitElBlance = "0xae261aba";
 globalFuncs.slockitCmBlance = "0xbbc72a17";
 
 globalFuncs.slockitCmLimitm = "0xcc885a65";
 globalFuncs.slockitCmLimitp = "0xae7143d6";
 
 globalFuncs.slockitAccType = "0xba99af70";   
 globalFuncs.slockitAccStatus = "0x61242bdd"; 
 
 globalFuncs.slockitIsOwner = "0x2f54bf6e"; 
 globalFuncs.slockitTaxAmount = "0x98a9cfac";
 globalFuncs.slockitTaxLegAmount = "0x48455399"; 
 globalFuncs.slockitTaxAccount = "0x4f2eabe0"; 
 
 
 globalFuncs.slockitSetTax = "0xf6f1897d"; 
 globalFuncs.slockitSetTaxLeg = "0xfafaf4c0"; 
 globalFuncs.slockitSetTaxAccount = "0xd0385b5e"; 
 globalFuncs.slockitSetOwnerAccount = "0xf2fde38b"; 
 
 globalFuncs.slockitSetAccountParam = "0x848b2592";
 globalFuncs.slockitPledge = "0x6c343eef";
 globalFuncs.slockitGetTotalAmount = "0x18160ddd";
 

 globalFuncs.delegationCount = "0x58fb5218";
 globalFuncs.getDelegation = "0xca40edf1";
 globalFuncs.delegation = "0x046d3307";
 globalFuncs.delegate = "0x75741c79";
 
 
 globalFuncs.allowanceCount = "0xaa7adb3d";
 globalFuncs.getAllowance = "0xb545b11f";
 globalFuncs.allowance = "0xdd62ed3e";
 globalFuncs.approve = "0xd4e12f2e";
 

 globalFuncs.myDelegationCount = "0x7737784d";
 globalFuncs.getMyDelegation = "0x49bce08d";
 globalFuncs.myDelegation = "0xf24111d2";
 
 globalFuncs.transfertFrom = "0x58258353";
 globalFuncs.transfertCMFrom = "0x2ef9ade2";
 
 globalFuncs.transfertOnBehalfNant = "0x1b6b1ee5";
 globalFuncs.transfertOnBehalfCM = "0x74c421fe";
 

 globalFuncs.myRequestCount = "0x418d0fd4";
 globalFuncs.myReqMap = "0x0becf93f";
 globalFuncs.myRequest = "0x09a15e43";

 globalFuncs.requestCount = "0xdebb9d28";
 globalFuncs.reqMap = "0x726d0a28";
 globalFuncs.request = "0x3537d3fa";
 
 globalFuncs.acceptedCount = "0x8d768f84";
 globalFuncs.acceptedMap = "0x59a1921a";
 globalFuncs.accepted = "0x958cde37";
 globalFuncs.dissAccepted = "0xccf93c7a";
 
 globalFuncs.rejectedCount = "0x20cde8fa";
 globalFuncs.rejectedMap = "0x9aa9366e";
 globalFuncs.rejected = "0xeac9dd4d";
 globalFuncs.dissRejected = "0x88759215";
 

 globalFuncs.payRequestNant = "0x132019f4";
 globalFuncs.payRequestCM = "0x1415707c";
 globalFuncs.cancelRequest = "0xaf98f757";
 
 
 globalFuncs.setAccountsContracts = "0x14ea14f5";
 globalFuncs.contactsOf = "0xd548bf2c";
 
 globalFuncs.setAccountsMemos = "0x166cf727";
 globalFuncs.memosOf = "0x39642b96";
 
 ///////////////////////////////////////////////////////////////////////////
 
 globalFuncs.confEndPointsOur = ["https://node-001.cchosting.org","https://node-002.cchosting.org","https://node-003.cchosting.org","https://node-004.cchosting.org","https://node-cc-001.cchosting.org/","https://api.monnaie-leman.org"];
 globalFuncs.confEndPointsOther = ["https://ipfs.io","https://ipfs.infura.io","https://ipfs.jes.xxx","https://siderus.io","https://hardbin.com","https://ipfs.infura.io","https://xmine128.tk"];
                               
 globalFuncs.configRepo = "/ipns/Qmcir6CzDtTZvywPt9N4uXbEjp3CJeVpW6CetMG6f93QNt/configs";
 globalFuncs.nodesRepo = "/ipns/Qmb2paHChFzvU9fnDtAvmpbEcwyKfpKjaHc67j4GCmWLZv";
 globalFuncs.custoRepo = "/ipns/Qmcir6CzDtTZvywPt9N4uXbEjp3CJeVpW6CetMG6f93QNt/resources/";

  
 globalFuncs.multicurr = true;
 
 globalFuncs.nonce = 0;
 
///////////////////////////////////////////////////////////////////////////
  globalFuncs.ipfsCat = "/ipfscat.php";
  globalFuncs.ipfsAdd = "/ipfsadd.php";
  globalFuncs.authChallenge = "/auth.php";
  globalFuncs.PING = globalFuncs.configRepo+'/ping.json';
  
  globalFuncs.getNumber = function(data, ratio){
        var short_data = '0x'+ data.slice(-12);
        var a = parseInt(short_data, 16);
        
        if (a>(34359738368*4096)){
            a=a-68719476736*4096
        }
        
        return a/ratio;
        
    }
    

    
    globalFuncs.encodeNumber=function(number){
         var valueHex;
         if (number<0){
            valueHex = ethFuncs.padLeft(new BigNumber(16).pow(64).plus(number).toString(16), 64);
         } else{
            valueHex = ethFuncs.padLeft(new BigNumber(number).toString(16), 64);
         }
         
         return valueHex;
    }
 
   
    globalFuncs.generateTx = function(contract, wallet, fuct_address, values, additional_post_data, callback){
        globalFuncs.nonce=globalFuncs.nonce+10;
        if (globalFuncs.nonce>10000){
            globalFuncs.nonce=10;
        }
        var  tx = {
		    gasLimit: 500000,
		    data: '',
		    to: contract,
		    unit: "ether",
		    value: 0,
		    nonce: globalFuncs.nonce,
		    gasPrice: null,
		    donate: false
       }
        
        var concatenated_variable='';
        for (var index = 0; index < values.length; ++index) {
            var valueHex = values[index];
            concatenated_variable=concatenated_variable+valueHex;
        }
        
        tx.data = fuct_address + concatenated_variable;
        tx.from =wallet.getAddressString();
        tx.key = wallet.getPrivateKeyString(); 
        uiFuncs.generateTx(tx, function(rawTx){
            if (!rawTx.isError){
             uiFuncs.sendTx(rawTx.signedTx, additional_post_data, function(res){
                 callback(res);    
             });
            } else { 
                callback(rawTx);
            }
		});
    }  
    
     globalFuncs.generateTxDelta = function(contract, wallet, fuct_address, values, additional_post_data, callback){
        globalFuncs.nonce=globalFuncs.nonce+10;
        if (globalFuncs.nonce>10000){
            globalFuncs.nonce=10;
        }
        
        var  tx = {
		    gasLimit: 500000,
		    data: '',
		    to: contract,
		    unit: "ether",
		    value: 0,
		    nonce: globalFuncs.nonce,
		    gasPrice: null,
		    donate: false
       }
        
        var concatenated_variable='';
        for (var index = 0; index < values.length; ++index) {
            var valueHex = values[index];
            concatenated_variable=concatenated_variable+valueHex;
        }
        
        tx.data = fuct_address + concatenated_variable;
        tx.from =wallet.getAddressString();
        tx.key = wallet.getPrivateKeyString(); 
        uiFuncs.generateTxDelta(tx, function(rawTx){
            if (!rawTx.isError){
             uiFuncs.sendTx(rawTx.signedTx, additional_post_data, function(res){
                 callback(res);    
             });
            } else { 
                callback(rawTx);
            }
		});
    }  
    
 

    
    
     
  
 globalFuncs.getAmountForElement = function(contract, function_address, caller_address, element_address, callback){
    var userInfo = ethFuncs.getDataObj(contract, 
                                       function_address, 
                                       [ethFuncs.getNakedAddress(caller_address),ethFuncs.getNakedAddress(element_address)]);
    ajaxReq.getEthCall(userInfo, function(data) {
                if (!data.error) {
			        callback(globalFuncs.getNumber(data.data, 100.).toString());    
		        }
	});        
}

globalFuncs.getElementInList = function(contract, map_function_address, amount_function_address, caller_address, index, list, ind_min, final_call_back){
    if (index>=ind_min){
        var userInfo = ethFuncs.getDataObj(contract, 
                                        map_function_address, 
                                        [ethFuncs.getNakedAddress(caller_address),  
                                         ethFuncs.padLeft(new BigNumber(index).toString(16), 64) ]);
     
        ajaxReq.getEthCall(userInfo, function(data) {
            if (!data.error) {
                globalFuncs.getAmountForElement(contract, amount_function_address, caller_address, data.data, function(amount){
                    var cleaned_add = '0x'+ data.data.substring(data.data.length-40);
                    var element = {address:cleaned_add, amount:amount};
                    list.unshift(element);
                    globalFuncs.getElementInList(contract, map_function_address, amount_function_address, caller_address, index-1, list, ind_min, final_call_back);
                    
                });
		    }
		});    
        
    } else {
       final_call_back(list); 
    }      
}

globalFuncs.getAmmount = function(address,walletAddress,callback){
        var userInfo = ethFuncs.getDataObj(globalFuncs.getContract1(),
                                           address, 
                                           [ethFuncs.getNakedAddress(walletAddress)]);
		ajaxReq.getEthCall(userInfo, function(data) {
            if (!data.error) {
			    callback(globalFuncs.getNumber(data.data, 100.).toString());
                   
		    }
		});        
  }
  
  globalFuncs.getAmmountAt = function(address,walletAddress,block_nb,callback){
        var userInfo = ethFuncs.getDataObj(globalFuncs.getContract1(),
                                           address, 
                                           [ethFuncs.getNakedAddress(walletAddress)]);
        var block_hex='0x'+new BigNumber(block_nb).toString(16);
		ajaxReq.getEthCallAt(userInfo,block_hex, function(data) {
            if (!data.error && data.data) {
			    callback(globalFuncs.getNumber(data.data, 100.).toString());
                   
		    } else {
                callback("");
		    }
		});        
  }
  
globalFuncs.getAccInfo = function(address,walletAddress,callback){
        var userInfo = ethFuncs.getDataObj(globalFuncs.getContract1(),
                                           address, 
                                           [ethFuncs.getNakedAddress(walletAddress)]);
		ajaxReq.getEthCall(userInfo, function(data) {
            if (!data.error) {
			    callback(globalFuncs.getNumber(data.data, 1.));
                   
		    }
		});        
  }
  
  
  
  
  globalFuncs.getGlobInfo = function(address, callback){
        var userInfo = ethFuncs.getDataObj(globalFuncs.getContract1(), address, []);
		ajaxReq.getEthCall(userInfo, function(data) {
            if (!data.error) {
			    callback(data.data);  
		    }
		});        
  }
  
  
  
  
  
globalFuncs.getInfo = function(contract, address, walletAddress,callback){
        var userInfo = ethFuncs.getDataObj(contract, 
                                           address, 
                                           [ethFuncs.getNakedAddress(walletAddress)]);
		ajaxReq.getEthCall(userInfo, function(data) {
            if (!data.error) {
			    callback(globalFuncs.getNumber(data.data, 1.));
                   
		    }
		});        
  }
    
    
    
    
 /* Action in Contract 1*/ 
 globalFuncs.SetAccountParam = function(wallet, account_address, acc_status, acc_type, limit_minus, limit_plus, callback){
     var accAdd = ethFuncs.padLeft(ethFuncs.getNakedAddress(account_address), 64);
     globalFuncs.generateTx(globalFuncs.getContract1(), 
                            wallet, 
                            globalFuncs.slockitSetAccountParam,
                            [accAdd,
                             globalFuncs.encodeNumber(acc_status),
                             globalFuncs.encodeNumber(acc_type),
                             globalFuncs.encodeNumber(parseInt(100*limit_plus,10)),
                             globalFuncs.encodeNumber(parseInt(100*limit_minus,10))], 
                            {},
                            callback);
 }
 
globalFuncs.PledgeAccount = function(wallet, account_address, amount, callback){
     var amount_cent = globalFuncs.encodeNumber(parseInt(100*amount,10));
     var accAdd = ethFuncs.padLeft(ethFuncs.getNakedAddress(account_address), 64);
     globalFuncs.generateTx(globalFuncs.getContract1(),
                            wallet, 
                            globalFuncs.slockitPledge, 
                            [accAdd, amount_cent],
                            {},
                            callback);       
 }
 
 globalFuncs.setAllowance = function (wallet, spender_address,amount,callback){
      var acc_add = ethFuncs.padLeft(ethFuncs.getNakedAddress(spender_address), 64);
      globalFuncs.generateTx(globalFuncs.getContract1(),
                             wallet, 
                             globalFuncs.approve, 
                             [acc_add, globalFuncs.encodeNumber(parseInt(100*amount,10))], 
                             {},
                             callback);
}
 
globalFuncs.setDelegation = function (wallet, spender_address,limit,callback){
    
      var acc_add = ethFuncs.padLeft(ethFuncs.getNakedAddress(spender_address), 64);
      globalFuncs.generateTx(globalFuncs.getContract1(),
                             wallet, 
                             globalFuncs.delegate, 
                             [acc_add, globalFuncs.encodeNumber(parseInt(100*limit,10))], 
                             {},
                             callback);
}

globalFuncs.SetTaxAmount = function(wallet, amount, callback){
     var amount_encoded = globalFuncs.encodeNumber(parseInt(amount,10));
     globalFuncs.generateTx(globalFuncs.getContract1(),
                            wallet, 
                            globalFuncs.slockitSetTax, 
                            [amount_encoded],
                            {},
                            callback);       
 }
 
 globalFuncs.SetTaxLegAmount = function(wallet, amount, callback){
     var amount_encoded = globalFuncs.encodeNumber(parseInt(amount,10));
     globalFuncs.generateTx(globalFuncs.getContract1(),
                            wallet, 
                            globalFuncs.slockitSetTaxLeg, 
                            [amount_encoded],
                            {},
                            callback);       
 }
 
 globalFuncs.SetTaxAccount = function(wallet, account_address, callback){
   
     var accAdd = ethFuncs.padLeft(ethFuncs.getNakedAddress(account_address), 64);
     globalFuncs.generateTx(globalFuncs.getContract1(),
                            wallet, 
                            globalFuncs.slockitSetTaxAccount, 
                            [accAdd],
                            {},
                            callback);       
 }
 
 globalFuncs.SetOwnerAccount = function(wallet, account_address, callback){
   
     var accAdd = ethFuncs.padLeft(ethFuncs.getNakedAddress(account_address), 64);
     globalFuncs.generateTx(globalFuncs.getContract1(),
                            wallet, 
                            globalFuncs.slockitSetOwnerAccount, 
                            [accAdd],
                            {},
                            callback);       
 }

 
/* Lists in Contract 2*/  
 
globalFuncs.getAllowanceList = function(walletAddress, ind_min, ind_max, callback){
    globalFuncs.getInfo(globalFuncs.getContract2(), globalFuncs.allowanceCount,walletAddress,function(count){
        var list = [];
        var index = Math.min(count-1,ind_max);
        globalFuncs.getElementInList(globalFuncs.getContract2(), 
                                     globalFuncs.getAllowance, 
                                     globalFuncs.allowance, 
                                     walletAddress, 
                                     index, 
                                     list, 
                                     ind_min, 
                                     callback);
    });
}


//--myAllowance not needed

globalFuncs.getRequestToApproveList = function(walletAddress, ind_min, ind_max, callback){
    globalFuncs.getInfo(globalFuncs.getContract2(), globalFuncs.requestCount,walletAddress,function(count){
        var list = [];
        var index = Math.min(count-1,ind_max);
        globalFuncs.getElementInList(globalFuncs.getContract2(),
                                     globalFuncs.reqMap, 
                                     globalFuncs.request, 
                                     walletAddress, 
                                     index, 
                                     list, 
                                     ind_min, 
                                     callback);
    });
}

globalFuncs.getPendingRequestList = function(walletAddress, ind_min, ind_max, callback){
    globalFuncs.getInfo(globalFuncs.getContract2(), globalFuncs.myRequestCount,walletAddress,function(count){
        var list = [];
        var index = Math.min(count-1,ind_max);
        globalFuncs.getElementInList(globalFuncs.getContract2(), 
                                     globalFuncs.myReqMap, 
                                     globalFuncs.myRequest, 
                                     walletAddress, 
                                     index, 
                                     list, 
                                     ind_min, 
                                     callback);
    });
}

globalFuncs.getDelegationList = function(walletAddress,ind_min,ind_max,callback){
    globalFuncs.getInfo(globalFuncs.getContract2(), globalFuncs.delegationCount,walletAddress,function(count){
        var list = [];
        var index = Math.min(count-1,ind_max);
        globalFuncs.getElementInList(globalFuncs.getContract2(), 
                                     globalFuncs.getDelegation, 
                                     globalFuncs.delegation, 
                                     walletAddress, 
                                     index, 
                                     list, 
                                     ind_min, 
                                     callback);
    });
}



globalFuncs.getMyDelegationList = function(walletAddress,callback){
    globalFuncs.getInfo(globalFuncs.getContract2(),globalFuncs.myDelegationCount,walletAddress,function(count){
        var list = [];
        var index = count-1;
        globalFuncs.getElementInList(globalFuncs.getContract2(), 
                                     globalFuncs.getMyDelegation, 
                                     globalFuncs.myDelegation, 
                                     walletAddress, 
                                     index, 
                                     list, 
                                     0, 
                                     callback);
    });
}


globalFuncs.getAcceptedRequestList = function(walletAddress, ind_min, ind_max, callback){
    globalFuncs.getInfo(globalFuncs.getContract2(),globalFuncs.acceptedCount,walletAddress,function(count){
        var list = [];
        var index = Math.min(count-1,ind_max);
        globalFuncs.getElementInList(globalFuncs.getContract2(),
                                     globalFuncs.acceptedMap, 
                                     globalFuncs.accepted, 
                                     walletAddress, 
                                     index, 
                                     list, 
                                     ind_min, 
                                     callback);
    });
}

globalFuncs.getRejectedRequestList = function(walletAddress, ind_min, ind_max, callback){
    globalFuncs.getInfo(globalFuncs.getContract2(), globalFuncs.rejectedCount,walletAddress,function(count){
        var list = [];
        var index = Math.min(count-1,ind_max);
        globalFuncs.getElementInList(globalFuncs.getContract2(),
                                     globalFuncs.rejectedMap, 
                                     globalFuncs.rejected, 
                                     walletAddress, 
                                     index, 
                                     list, 
                                     ind_min, 
                                     callback);
    });
}

 /*Action in contract 2*/
 
 
globalFuncs.TransfertNant = function (wallet, to_address, amount, additional_post_data, callback){
      var to_add = ethFuncs.padLeft(ethFuncs.getNakedAddress(to_address), 64);
      globalFuncs.generateTx(globalFuncs.getContract2(), 
                             wallet, 
                             globalFuncs.eLemTransfert, 
                             [to_add, globalFuncs.encodeNumber(amount)],
                             additional_post_data,
                             callback);
}

globalFuncs.TransfertCM = function (wallet, to_address,amount,incr, additional_post_data, callback){
      var to_add = ethFuncs.padLeft(ethFuncs.getNakedAddress(to_address), 64);
      
      if (incr==0){
                globalFuncs.generateTx(globalFuncs.getContract2(), 
                             wallet, 
                             globalFuncs.lemanexTransfert, 
                             [to_add, globalFuncs.encodeNumber(amount)], 
                             additional_post_data,        
                             callback);
      } else {
                globalFuncs.generateTxDelta(globalFuncs.getContract2(), 
                             wallet, 
                             globalFuncs.lemanexTransfert, 
                             [to_add, globalFuncs.encodeNumber(amount)],
                             additional_post_data,
                             callback);
      }

}

globalFuncs.TransfertOnBehalfNant = function (wallet, from_address, to_address, amount, additional_post_data, callback){
      additional_post_data["delegate"]=globalFuncs.getWalletAddress();
      var from_add = ethFuncs.padLeft(ethFuncs.getNakedAddress(from_address), 64);
      var to_Add = ethFuncs.padLeft(ethFuncs.getNakedAddress(to_address), 64);
      globalFuncs.generateTx(globalFuncs.getContract2(),
                             wallet, 
                             globalFuncs.transfertOnBehalfNant, 
                             [from_add, to_Add, globalFuncs.encodeNumber(amount)], 
                             additional_post_data, 
                             callback);
}

globalFuncs.TransfertOnBehalfCM = function (wallet, from_address, to_address, amount, additional_post_data, callback){
      additional_post_data["delegate"]=globalFuncs.getWalletAddress();
      var from_add = ethFuncs.padLeft(ethFuncs.getNakedAddress(from_address), 64);
      var to_Add = ethFuncs.padLeft(ethFuncs.getNakedAddress(to_address), 64);
      globalFuncs.generateTx(globalFuncs.getContract2(),
                             wallet, 
                             globalFuncs.transfertOnBehalfCM, 
                             [from_add, to_Add, globalFuncs.encodeNumber(amount)], 
                             additional_post_data, 
                             callback);
}


 
globalFuncs.askTransfertFrom = function (wallet,account_address, from_address,amount,callback){
      var from_add = ethFuncs.padLeft(ethFuncs.getNakedAddress(from_address), 64);
      var accAdd = ethFuncs.padLeft(ethFuncs.getNakedAddress(account_address), 64);
      globalFuncs.generateTx(globalFuncs.getContract2(),
                             wallet, 
                             globalFuncs.transfertFrom, 
                             [from_add, globalFuncs.encodeNumber(amount)], 
                             {},
                             callback);
}

globalFuncs.askTransfertCMFrom = function (wallet,account_address, from_address,amount,callback){
      var from_add = ethFuncs.padLeft(ethFuncs.getNakedAddress(from_address), 64);
      var accAdd = ethFuncs.padLeft(ethFuncs.getNakedAddress(account_address), 64);
      globalFuncs.generateTx(globalFuncs.getContract2(),
                             wallet, 
                             globalFuncs.transfertCMFrom, 
                             [from_add, globalFuncs.encodeNumber(amount)], 
                             {},
                             callback);
}



globalFuncs.PayRequestNant = function (wallet, to_address, amount, additional_data, callback){
      var to_Add = ethFuncs.padLeft(ethFuncs.getNakedAddress(to_address), 64);
      globalFuncs.generateTx(globalFuncs.getContract2(),
                             wallet, 
                             globalFuncs.payRequestNant, 
                             [to_Add, globalFuncs.encodeNumber(amount)], 
                             additional_data, 
                             callback);
}

globalFuncs.PayRequestCM = function (wallet, to_address, amount, additional_data, callback){
      var to_Add = ethFuncs.padLeft(ethFuncs.getNakedAddress(to_address), 64);
      globalFuncs.generateTx(globalFuncs.getContract2(),
                             wallet, 
                             globalFuncs.payRequestCM, 
                             [to_Add, globalFuncs.encodeNumber(amount)],
                             additional_data, 
                             callback);
}

globalFuncs.RejectRequest = function (wallet, to_address, callback){
      var to_Add = ethFuncs.padLeft(ethFuncs.getNakedAddress(to_address), 64);
      globalFuncs.generateTx(globalFuncs.getContract2(),
                             wallet, 
                             globalFuncs.cancelRequest, 
                             [to_Add],
                             {},
                             callback);
}
 
 



 globalFuncs.DissmissAcceptedInfo = function(wallet, account_address, callback){
     var accAdd = ethFuncs.padLeft(ethFuncs.getNakedAddress(account_address), 64);
     globalFuncs.generateTx(globalFuncs.getContract2(),
                            wallet, 
                            globalFuncs.dissAccepted, 
                            [accAdd], 
                            {},
                            callback);       
 }
 
  globalFuncs.DissmissRejectedInfo = function(wallet, account_address, callback){
     var accAdd = ethFuncs.padLeft(ethFuncs.getNakedAddress(account_address), 64);
     globalFuncs.generateTx(globalFuncs.getContract2(),
                            wallet, 
                            globalFuncs.dissRejected, 
                            [accAdd], 
                            {},
                            callback);       
 }
 
 
 
 /*** contract 3***/
 globalFuncs.setContactHash = function(wallet, contact_hash, callback){    
     var datas = []
     datas.push(ethFuncs.padLeft('20', 64))
     datas.push(ethFuncs.padLeft('2e', 64))
     var result = contact_hash
     for (var i=contact_hash.length ;i<128;++i){
         result = result+'0';
     }
     datas.push(result)
         
     globalFuncs.generateTx(globalFuncs.getContract3(),
                            wallet, 
                            globalFuncs.setAccountsContracts, 
                            datas, 
                            {},
                            callback);       
 }
 
 globalFuncs.setMemoHash = function(wallet, memo_hash, callback){     
     var datas = []
     datas.push(ethFuncs.padLeft('20', 64))
     datas.push(ethFuncs.padLeft('2e', 64))
     var result = memo_hash
     for (var i=memo_hash.length ;i<128;++i){
         result = result+'0';
     }
     datas.push(result)
         
     globalFuncs.generateTx(globalFuncs.getContract3(),
                            wallet, 
                            globalFuncs.setAccountsMemos, 
                            datas, 
                            {},
                            callback);       
 }
 
 globalFuncs.getContactHash = function(walletAddress,callback){
        var userInfo = ethFuncs.getDataObj(globalFuncs.getContract3(),  globalFuncs.contactsOf, [ethFuncs.getNakedAddress(walletAddress)]);
		ajaxReq.getEthCall(userInfo, function(data) {
            if (!data.error) {
                var length_str = data.data.substring(66,130);
                var length = 2*globalFuncs.getNumber(length_str,1);
                var hash = data.data.substring(130,130+length);
			    callback(hash);  
		    }
		});        
  }
  
  globalFuncs.getMemoHash = function(walletAddress,callback){
        var userInfo = ethFuncs.getDataObj(globalFuncs.getContract3(),  globalFuncs.memosOf, [ethFuncs.getNakedAddress(walletAddress)]);
		ajaxReq.getEthCall(userInfo, function(data) {
            if (!data.error) {
			    var length_str = data.data.substring(66,130);
                var length = 2*globalFuncs.getNumber(length_str,1);
                var hash = data.data.substring(130,130+length);
			    callback(hash);  
		    }
		});        
  }
  
 
  
  /********************************************************/
  globalFuncs.storeOnIpfs = function (crypted_data,callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', globalFuncs.getServerAddress()+ globalFuncs.ipfsAdd+'?data=' +encodeURIComponent(JSON.stringify(crypted_data)), true); //
    xhr.onreadystatechange = function (oEvent) {  
    if (xhr.readyState === 4) {  
        if (xhr.status === 200) { 
          try{
             var to_push = xhr.response;
             callback(to_push);
          } catch(e){
            callback(null);  
          }  
        } else {  
           callback(null);
        }  
        }  
    }; 

    xhr.send();
  }
  
  globalFuncs.readFromIpfs = function (hash,callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', globalFuncs.getServerAddress()+ globalFuncs.ipfsCat+'?addr=' +hash, true); //
    xhr.responseType = 'json';
    xhr.onreadystatechange = function (oEvent) {  
    if (xhr.readyState === 4) {  
        if (xhr.status === 200) { 
          try{
             var to_push = xhr.response;
             if(typeof to_push !='object'){
                to_push = JSON.parse(xhr.response);
             }  
             callback(to_push);
          } catch(e){
            callback(null);  
          }  
        } else {  
           callback(null);
        }  
        }  
    }; 

    xhr.send();
  }
  
   /*******************************************************/
  
  globalFuncs.getChallenge = function (addr,callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', globalFuncs.getServerAddress()+ globalFuncs.authChallenge+'?addr=' +encodeURIComponent(addr), true); //
    xhr.onreadystatechange = function (oEvent) {  
    if (xhr.readyState === 4) {  
        if (xhr.status === 200) { 
          try{
             var to_push = xhr.response;
             callback(to_push);
          } catch(e){
            callback(null);  
          }  
        } else {  
           callback(null);
        }  
        }  
    }; 

    xhr.send();
  }
  
  globalFuncs.sendChallengeResponse = function (addr,signature,callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', globalFuncs.getServerAddress()+ globalFuncs.authChallenge+'?addr=' +encodeURIComponent(addr)+'&sign='+encodeURIComponent(signature), true); //
    xhr.onreadystatechange = function (oEvent) {  
    if (xhr.readyState === 4) {  
        if (xhr.status === 200) { 
          try{
             var to_push = xhr.response;
             callback(to_push);
          } catch(e){
            callback(null);  
          }  
        } else {  
           callback(null);
        }  
        }  
    }; 

    xhr.send();
  }
  
  globalFuncs.sendLogOff = function (callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', globalFuncs.getServerAddress()+ globalFuncs.authChallenge+'?addr=' +encodeURIComponent('0x0'), true); //
    xhr.onreadystatechange = function (oEvent) {  
    if (xhr.readyState === 4) {  
        if (xhr.status === 200) { 
          try{
             var to_push = xhr.response;
             callback(to_push);
          } catch(e){
            callback(null);  
          }  
        } else {  
           callback(null);
        }  
        }  
    }; 

    xhr.send();
  }
  
  /*****************************************************************************/
  
  
globalFuncs.isApp = function(){
     return document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
}

globalFuncs.isMulti = function(){
     return globalFuncs.isApp() || globalFuncs.multicurr;
}

globalFuncs.getServerAddress = function(){
    try{
        return localStorage.getItem('ComChainAPI');
    } catch(e){
        return '';
    }
       
}

globalFuncs.getServerName = function(){
    if (globalFuncs.isMulti()){
         try{
              return  JSON.parse(localStorage.getItem('ComChainServerConf')).server.name;
        } catch(e){
            return '';
        }
    } else {
        return conf_locale.server.name;
    }
}


globalFuncs.getContract1 = function(){
    if (globalFuncs.isMulti()){
        try{
             return  JSON.parse(localStorage.getItem('ComChainServerConf')).server.contract_1;
        } catch(e){
            return '';
        }
    } else {
        return conf_locale.server.contract_1;
    }
}

globalFuncs.getContract2 = function(){
    if (globalFuncs.isMulti()){
        try{
            return  JSON.parse(localStorage.getItem('ComChainServerConf')).server.contract_2;
        } catch(e){
            return '';
        }
    } else {
        return conf_locale.server.contract_2;
    }
}

globalFuncs.getContract3 = function(){
    if (globalFuncs.isMulti()){
        try{
            return  JSON.parse(localStorage.getItem('ComChainServerConf')).server.contract_3;
        } catch(e){
            return '';
        }
    } else {
        return conf_locale.server.contract_3;
    }
}


globalFuncs.getCssUrl = function(){
    if (globalFuncs.isMulti()){
        try{
            return localStorage.getItem('ComChainRepo') + globalFuncs.custoRepo + globalFuncs.getServerName() + '/css/etherwallet-master.min.css';
        } catch(e){
            return '';
        }
    } else {
        return conf_locale.server.url_Css;
    }
}

globalFuncs.getCurrencyLogoUrl = function(currency_name){
   if (currency_name){
        try{
            return localStorage.getItem('ComChainRepo') + globalFuncs.custoRepo + currency_name + '/images/lem.png';
        } catch(e){
            return '';
        } 
   }
}

globalFuncs.getHelpUrl = function(){
    if (globalFuncs.isMulti()){
        try{
            return  JSON.parse(localStorage.getItem('ComChainServerConf')).server.url_help;
        } catch(e){
            return conf_locale.server.url_help;
        }
    } else {
        return conf_locale.server.url_help;
    }
}

globalFuncs.getCondUrl = function(){
    if (globalFuncs.isMulti()){
        try{
            return  JSON.parse(localStorage.getItem('ComChainServerConf')).server.url_cond;
        } catch(e){
            return conf_locale.server.url_cond;
        }
    } else {
        return conf_locale.server.url_cond;
    }
}

globalFuncs.getLang = function(){
    if (globalFuncs.isMulti()){
        try{
            return  JSON.parse(localStorage.getItem('ComChainServerConf')).server.lang;
        } catch(e){
            return conf_locale.server.lang; 
        }
    } else {
        return conf_locale.server.lang;
    }
}

globalFuncs.hasNant = function(){
    if (globalFuncs.isMulti()){
        try{
            return  JSON.parse(localStorage.getItem('ComChainServerConf')).server.nant.toString().toLowerCase()=='true';
        } catch(e){
            return false; 
        }
    } else {
        return conf_locale.server.nant.toString().toLowerCase()=='true';
    }
}

globalFuncs.hasCM = function(){
    if (globalFuncs.isMulti()){
        try{
            return  JSON.parse(localStorage.getItem('ComChainServerConf')).server.CM.toString().toLowerCase()=='true';
        } catch(e){
            return false; 
        }
    } else {
        return conf_locale.server.CM.toString().toLowerCase()=='true';
    }
}

globalFuncs.hasAutor = function(){
    if (globalFuncs.isMulti()){
        try{
            return  JSON.parse(localStorage.getItem('ComChainServerConf')).server.autor.toString().toLowerCase()=='true';
        } catch(e){
            return false; 
        }
    } else {
        return conf_locale.server.autor.toString().toLowerCase()=='true';
    }
}

globalFuncs.hasDeleg = function(){
    if (globalFuncs.isMulti()){
        try{
            return  JSON.parse(localStorage.getItem('ComChainServerConf')).server.deleg.toString().toLowerCase()=='true';
        } catch(e){
            return false; 
        }
    } else {
        return conf_locale.server.deleg.toString().toLowerCase()=='true';
    }
}

globalFuncs.hasPayRequest = function(){
     if (globalFuncs.isMulti()){
        try{
            return  JSON.parse(localStorage.getItem('ComChainServerConf')).server.payReq.toString().toLowerCase()=='true';
        } catch(e){
            return true; 
        }
    } else {
         try{
            return  conf_locale.server.payReq.toString().toLowerCase()=='true';
        } catch(e){
            return true; 
        }
    }
}

globalFuncs.passwordAutocomplete = function(){
    var number = 10000;
    var config = conf_locale.server;
    if (globalFuncs.isMulti()){
        try{
            config =  JSON.parse(localStorage.getItem('ComChainServerConf')).server;
        } catch(e){
            config = conf_locale.server;
        }
    } 
    
    if (config.passwordAutocomplete && config.passwordAutocomplete>2){
        number = config.passwordAutocomplete;
    }
    
    return number;
    
}





globalFuncs.getConfJSON = function(name,callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', localStorage.getItem('ComChainRepo')+ globalFuncs.configRepo+'/' +name+'.json', true); //
    xhr.responseType = 'json';
    xhr.onreadystatechange = function (oEvent) {  
    if (xhr.readyState === 4) {  
        if (xhr.status === 200) { 
          try{
             var to_push = xhr.response;
                    if(typeof to_push =='object')
                    {
                        to_push = JSON.stringify(xhr.response);
                    }  
              
            localStorage.setItem('ComChainServerConf',to_push); 
            callback(true);
          } catch(e){
            callback(false);  
          }  
         
        } else {  
           callback(false);
        }  
        }  
    }; 

    xhr.send();
};

globalFuncs.testApi = function(api_address,callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', api_address + '/api.php', true); 
    xhr.responseType = 'json';
    xhr.timeout = 5000;
    xhr.onreadystatechange = function (oEvent) {  
    if (xhr.readyState === 4) {  
        if (xhr.status === 200) { 
          try{
              var answer = xhr.response;
              if(typeof answer =='object'){
                        answer = JSON.stringify(xhr.response);
               }  
               callback(answer && answer!="null" && !answer.error);
          } catch(e){
            callback(false);  
          }  
         
        } else {  
           callback(false);
        }  
        }  
    }; 

    xhr.send();
};

globalFuncs.testDB = function(api_address,callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', api_address + '/dbcheck.php', true); 
    xhr.timeout = 5000;
    xhr.onreadystatechange = function (oEvent) {  
    if (xhr.readyState === 4) {  
        if (xhr.status === 200 ) { 
          try{
            callback(xhr.response==='pong');
          } catch(e){
            callback(false);  
          }  
         
        } else {  
           callback(false);
        }  
        }  
    }; 

    xhr.send();
};


globalFuncs.testNode = function(api_address,callback) {
    globalFuncs.testDB(api_address,function(result){
        if (result){
            globalFuncs.testApi(api_address,callback);
        } else {
            callback(false);
        }
    });
};



globalFuncs.loadWallet = function(wallet,callback){
    localStorage.removeItem("ComChainContacts");
    localStorage.removeItem("ComChainContactsInfo");
    localStorage.removeItem("ComChainMemos");
    if (!wallet.server || !wallet.server.name){
        var new_name = globalFuncs.getServerName();
        
        if (new_name==''){    /*Fall back to avoid alreay created Monnaie-Leman account to provide the server name*/   
           new_name = "Monnaie-Leman"; 
        }
        
        wallet.server={"name":new_name};
    }
    
    
    localStorage.setItem('ComChainWallet',JSON.stringify(wallet) ); 
    if (globalFuncs.isMulti()){
        var server_name = '';
        if (wallet.server && wallet.server.name){
            server_name = wallet.server.name;
        }
        if (server_name==''){
            callback(false);
        } else {
            globalFuncs.getConfJSON(server_name,function(success){
                if (success){
                    callback(success);
                } else {
                     globalFuncs.getConfJSON(server_name, callback);
                }
            });
            
        }
      
    } else {
        callback(true);
    }
}

globalFuncs.removeWallet = function(){
    localStorage.removeItem('ComChainWallet');
    localStorage.removeItem("ComChainContacts");
    localStorage.removeItem("ComChainContactsInfo");
    localStorage.removeItem("ComChainMemos");
    
    if (globalFuncs.isMulti()){
         localStorage.removeItem('ComChainServerConf'); 
    }
}



//////////////////////////////////////////////
/// Note checking 

globalFuncs.getNoteValues = function(){
    if (globalFuncs.isMulti()){
         try{
              return  JSON.parse(localStorage.getItem('ComChainServerConf')).server.notes;
        } catch(e){
            return '';
        }
    } else {
        return conf_locale.server.notes;
    }
}

globalFuncs.hasBn = function(){
    var notes = globalFuncs.getNoteValues();
    return notes && notes.length>0;
}

globalFuncs.hasBnCheck = function(){
    return globalFuncs.isApp() && globalFuncs.hasBn();
}

globalFuncs.isValidBNValue= function(value){
    var notes = globalFuncs.getNoteValues();
    if (notes && notes.length>0){
       for (var index in notes){
          if( Math.round(100*Number(value))== Math.round(100*Number(notes[index]))){
              return true;
          }
       } 
    }
    return false;
}



  ////////////////////////////////////////////////////////////////////////////
  ////   Custo on the fly 

    globalFuncs.updateCss = function(){
        // replace the CSS references into the DOM
        var oldlink = document.getElementsByTagName("link").item(0);
        var newlink = document.createElement("link");
        newlink.setAttribute("rel", "stylesheet");
        newlink.setAttribute("type", "text/css");
        newlink.setAttribute("href", globalFuncs.getCssUrl());
        document.getElementsByTagName("head").item(0).appendChild(newlink);
        globalFuncs.hideLoadingWaiting();

    }
    
    
    globalFuncs.currencies=conf_locale.server.currencies;


    globalFuncs.getCurrencies = function(){
        if (globalFuncs.isMulti()){
            try{
                  globalFuncs.currencies=JSON.parse(localStorage.getItem('ComChainServerConf')).server.currencies;
            } catch(e){
                
            }
        } else {
           globalFuncs.currencies=conf_locale.server.currencies;
        }
    }


    globalFuncs.configure=function(){
      if (globalFuncs.getServerAddress()!=''){
        globalFuncs.updateCss(); 
        globalFuncs.getCurrencies();
      }
    }
   
/// Address
   
globalFuncs.parseAddress = function(text){
    text=text.trim();
    
    var re = new RegExp('^0x[0123456789ABCDEFabcdef]{40}$');
    if (text.startsWith('0x')){
        if (re.test(text)){
            return {"address":text};
        } else {
            return {"error":true};
        }
        
    } else {
        try{
            var result = JSON.parse(text);
            if (result.address && result.address.startsWith('0x')){
                 if (re.test(result.address)){
                    return result;
                } else {
                    return {"error":true};
                }
            } else {
                return {"error":true};
            }
        }
        catch(e){
            return {"error":true};
        }
    }
}

    
/// Notifications

globalFuncs.notify = function(title, text){
    
    if (globalFuncs.isApp()){
                cordova.plugins.notification.local.schedule({
                    title: title,
                    message: text
                });
    } else {
        
      // Let's check if the browser supports notifications
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      }

      // Let's check whether notification permissions have already been granted
      else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(title,{body:text});
      }

      // Otherwise, we need to ask the user for permission
      else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
              var notification = new Notification(title,{body:text});
          }
        });
      }  
    }
    
}



globalFuncs.notifyApproval = function(){
   /* if (document.getElementsByClassName('trans')[0]){
            if (JSON.parse(localStorage.getItem('ComChainWallet'))){
                var addresss = JSON.parse(localStorage.getItem('ComChainWallet')).address;
                globalFuncs.getInfo(globalFuncs.getContract1(), globalFuncs.requestCount,addresss,function(count){
                    if (count>0){
                        document.getElementsByClassName('trans')[0].className = "trans alrt";
                    } else {
                        document.getElementsByClassName('trans')[0].className = "trans";
                    }
                });
                
            } else {
                document.getElementsByClassName('trans')[0].className = "trans"; 
            }
        }*/
}


globalFuncs.getTransCurrency = function(nant_val,cm_val,cm_minus_lim,amount){
    var nant =0;
    var cm=0;
    var res='no';
    
    if (parseFloat(cm_val)>=parseFloat(amount)){
       res='cm'; 
    } else if (parseFloat(nant_val)>=parseFloat(amount)){
       res='nant';  
    } else if(parseFloat(cm_val)-parseFloat(cm_minus_lim)>=parseFloat(amount)){
       res='cm';  
    } 
    return  res;
}


globalFuncs.getSplitting = function(nant_val,cm_val,cm_minus_lim,amount){
    var nant =0;
    var cm=0;
    
    var res=parseFloat(amount);
    if (parseFloat(cm_val)>0){
        if (parseFloat(cm_val)>=res){
            cm = res;
            res=0;
        } else {
            cm = parseFloat(cm_val);
            res=res-parseFloat(cm_val);
            cm_val=0;
        }
    }
    
    if (parseFloat(nant_val)>0){
        if (parseFloat(nant_val)>=res){
            nant=res;
            res=0;
        } else {
            nant=parseFloat(nant_val);
            res=res-parseFloat(nant_val);
            //nant_val=0;
        }
    }
    
    if (res>0 && parseFloat(cm_val)-parseFloat(cm_minus_lim)>=res){
        cm = cm + res;
        res = 0;
    }
    
    var possible = res==0;
    return  {'possible': possible,'nant':nant, 'cm':cm};
}



globalFuncs.getBlockie = function(address) {
	return blockies.create({
		seed: address.toLowerCase(),
		size: 8,
		scale: 16
	}).toDataURL();
}

globalFuncs.getBlob = function(mime, str) {
	var str = (typeof str === 'object') ? JSON.stringify(str) : str;
	if (str == null) return '';
	var blob = new Blob([str], {
		type: mime
	});
	return window.URL.createObjectURL(blob);
}
globalFuncs.getSuccessText = function(str) {
	return '<p class="text-center text-success"><strong> ' + str + '</strong></p>'
}

globalFuncs.getWarningText = function(str) {
	return '<p class="text-center text-warning"><strong> ' + str + '</strong></p>'
}

globalFuncs.getDangerText = function(str) {
	return '<p class="text-center text-danger"><strong> ' + str + '</strong></p>'
}
globalFuncs.errorMsgs = [
	"Please enter valid amount.",
	"Your password must be at least 9 characters. Please ensure it is a strong password. ",
	"Sorry! We don\'t recognize this type of wallet file. ",
	"This is not a valid wallet file. ",
	"This unit doesn\'t exists, please use the one of the following units ",
	"Invalid address. ",
	"Invalid password. ",
	"Invalid amount. ",
	"Invalid gas limit. ",
	"Invalid data value. ",
	"Invalid gas amount. ",
	"Invalid nonce. ",
	"Invalid signed transaction. ",
	"A wallet with this nickname already exists. ",
	"Wallet not found. ",
	"Whoops. It doesnt look like a proposal with this ID exists yet or there is an error reading this proposal. ",
	"A wallet with this address already exists in storage. Please check your wallets page. ",
	"You need to have at least .001 ETH in your account to cover the cost of gas. Please add some ETH and try again. ",
	"All gas would be used on this transaction. This means you have already voted on this proposal or the debate period has ended.",
	"Invalid symbol",
    "The server reject the creation of the wallet."];
globalFuncs.successMsgs = [
	"Valid address",
	"Wallet successfully decrypted",
	"Transaction submitted. TX ID: ",
	"Your wallet was successfully added: ",
	"You have successfully voted. Thank you for being an active participant in The DAO.",
	"File Selected: "];
globalFuncs.gethErrors = {
        "Invalid sender": "GETH_InvalidSender",
        "Nonce too low": "GETH_Nonce",
        "Gas price too low for acceptance": "GETH_Cheap",
        "Insufficient balance": "GETH_Balance",
        "Account does not exist or account balance too low": "GETH_NonExistentAccount",
        "Insufficient funds for gas * price + value": "GETH_InsufficientFunds",
        "Intrinsic gas too low": "GETH_IntrinsicGas",
        "Exceeds block gas limit": "GETH_GasLimit",
        "Negative value": "GETH_NegativeValue"};
globalFuncs.gethErrorMsgs = {};
globalFuncs.getGethMsg = function(str) {
	if (str in this.gethErrors) {
		var key = this.gethErrors[str];
		if (key in this.gethErrorMsgs) {
			return this.gethErrorMsgs[key];
		}
	}
	return str;
}
globalFuncs.scrypt = {
	n: 1024
};
globalFuncs.postDelay = 300;
globalFuncs.kdf = "scrypt";
globalFuncs.defaultTxGasLimit = 21000;
globalFuncs.digixClaimTxGasLimit = 150000;
globalFuncs.isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
globalFuncs.urlGet = function(name) {
	if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search)) return this.stripTags(decodeURIComponent(name[1]));
}
globalFuncs.stripTags = function(str) {
	var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	while (SCRIPT_REGEX.test(str)) {
		str = str.replace(SCRIPT_REGEX, "");
	}
	return str;
}

globalFuncs.isStrongPass = function(password) {
    
    var regularExpression = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_])[a-zA-Z\d\W_]{8,25}$/;
    return password.length >= 8 && regularExpression.test(password);
}
globalFuncs.hexToAscii = function(hex) {
	return hex.match(/.{1,2}/g).map(function(v) {
		return String.fromCharCode(parseInt(v, 16));
	}).join('');
}
globalFuncs.isAlphaNumeric = function(value){
    return !/[^a-zA-Z0-9]/.test(value);
}

globalFuncs.isIos = function (){
    return device.platform=="iOS";
}

globalFuncs.readCordovaDir = function(success){
        var directory = cordova.file.externalRootDirectory;
            var subdir = "";
            if (device.platform=="iOS"){
                directory = cordova.file.documentsDirectory;
                subdir='';
            }
            window.resolveLocalFileSystemURL(directory, function(dirEntry) {
                var directoryReader = dirEntry.createReader();
                // Get a list of all the entries in the directory
                directoryReader.readEntries(success,function(error) {
                    alert(error);
                    console.log("Failed to list directory contents: ", error);
                    });
            });
    }
 

globalFuncs.generateSaveQRPiece  = function(address, piece){
    
    var container = document.getElementById("qrcode_print_2");
    var child = container.lastElementChild;  
    while (child) { 
        container.removeChild(child); 
        child = container.lastElementChild; 
    }
        
        
    if (piece == 0) {
        var qrcode = new QRCode(document.getElementById("qrcode_print_2"),localStorage.getItem('ComChainWallet'));
    } else {
        var i = piece -1;
        var full=localStorage.getItem('ComChainWallet');
        var chunk_length = Math.ceil(full.length/4);
        var string = "FRAGMENT"+address.substring(2,6)+i.toString()+full.substring(chunk_length*i,Math.min(chunk_length*(i+1),full.length));
        var qrcode = new QRCode(document.getElementById("qrcode_print_2"),string);
    } 
}

globalFuncs.generateSaveQR = function(address){
       var qrcode = new QRCode(document.getElementById("qrcode_print"),localStorage.getItem('ComChainWallet'));
       
       document.getElementById("qrcode_print").style.display = "none";
       
        var full=localStorage.getItem('ComChainWallet');
        var chunk_length = Math.ceil(full.length/4);
        for (var i=0;i<4;i++){
            var string = "FRAGMENT"+address.substring(2,6)+i.toString()+full.substring(chunk_length*i,Math.min(chunk_length*(i+1),full.length));
            var qrcodef = new QRCode(document.getElementById("qrcode_print"+i.toString()),string);
            document.getElementById("qrcode_print"+i.toString()).style.display = "none";
           
        }
       
}

globalFuncs.dowloadAppFile = function(wallet, file_content){
    
    globalFuncs.dowloadAppFileWithName(globalFuncs.currencies.CUR+'_'+wallet.getAddressString()+'.dat',file_content);
 }
    
globalFuncs.dowloadAppFileWithName = function(name, file_content){
      var directory = cordova.file.externalRootDirectory;
       var subdir = "";
       if (device.platform=="iOS"){
           directory = cordova.file.documentsDirectory;
           subdir='';
       }
       
       var pathToFile = directory;
       window.resolveLocalFileSystemURL(directory, function (dir) {
           dir.getFile(subdir+name, {create:true}, function(fileEntry) {
            writeFile(fileEntry, file_content);
           });
       });
    }
    
    
    
    
    
    
 globalFuncs.dowloadAppFileWithNameWithoutMessage = function(name, file_content){
      var directory = cordova.file.externalRootDirectory;
       var subdir = "";
       if (device.platform=="iOS"){
           directory = cordova.file.documentsDirectory;
           subdir='';
       }
       
       var pathToFile = directory;
       window.resolveLocalFileSystemURL(directory, function (dir) {
           dir.getFile(subdir+name, {create:true}, function(fileEntry) {
            writeFileWithoutMessage(fileEntry, file_content);
           });
       });
    }
    
 globalFuncs.dowloadCsvFileWithName = function(name, file_content){
      var directory = cordova.file.externalRootDirectory;
       var subdir = "";
       if (device.platform=="iOS"){
           directory = cordova.file.documentsDirectory;
           subdir='';
       }
       
       var pathToFile = directory;
       window.resolveLocalFileSystemURL(directory, function (dir) {
           dir.getFile(subdir+name, {create:true}, function(fileEntry) {
            writeFileCSV(fileEntry, file_content);
           });
       });
    }
    
  
    function writeFile(fileEntry, file_content) {
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
            alert("Fichier enregistré :\n"+fileEntry.fullPath);
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
         //    alert("Failed file write: " + e.toString());
        };
        
        fileWriter.write(JSON.stringify(file_content));
    });
}

  function writeFileWithoutMessage(fileEntry, file_content) {
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
           
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
         //    alert("Failed file write: " + e.toString());
        };
        
        fileWriter.write(JSON.stringify(file_content));
    });
}

  function writeFileCSV(fileEntry, file_content) {
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
            alert("Fichier enregistré :\n"+fileEntry.fullPath);
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
         //    alert("Failed file write: " + e.toString());
        };
        
        fileWriter.write(file_content);
    });
}

globalFuncs.wrapImgData=function(img){
    if (img.substring(0, 4) == "url("){
        img=img.substring(4,img.length-5);
        if (img.substring(0, 1) == '"'){
            img=img.substring(1,img.length-2)
        }

    }
    return img;

}

globalFuncs.cleanName = function(name){
    return name.substring(0,name.length-1);
}




globalFuncs.generateSavePDF = function(title, key, address, callback){
            title = title.trim();
            key = key.trim();
            var newImg = new Image();
            newImg.callback=callback;
            newImg.setAttribute('crossOrigin', 'anonymous');
            newImg.onload = function() {
                var height = this.naturalHeight;
                var width = this.naturalWidth;
               
                var c = document.createElement('canvas');
                c.height = height;
                c.width = width;
                var ctx = c.getContext("2d");
                ctx.drawImage(newImg, 0, 0);
                var logoData = c.toDataURL('image/png');
          
                // var imgData = document.getElementById("qrcode_print").getElementsByTagName('img')[0].src;
                var imgAddData = globalFuncs.wrapImgData(document.getElementById("addressIdenticon").style.backgroundImage);
            
                var doc = new jsPDF();
                doc.setFontSize(32);
                
                var textWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
                doc.text(textOffset, 25, title);
                doc.setLineWidth(1.0);
                doc.line(textOffset, 27, textOffset+textWidth+3, 27);
                doc.addImage(imgAddData, 'PNG', 90, 32, 30, 30);
                doc.addImage(logoData, 'PNG', 50, 32, 30, 30);
                
                doc.setFontSize(15);
                var linesAdd = doc.splitTextToSize(address, 30, {});
                doc.text(130, 37, linesAdd);
               
                
                
                doc.setFontSize(22);
                var keytextWidth = doc.getStringUnitWidth(key) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                var keytextOffset = (doc.internal.pageSize.width - keytextWidth) / 2;
         
                doc.text(keytextOffset, 71, key);
                //doc.addImage(imgData, 'PNG', 15, 75, 180, 180);
                doc.setFontSize(12);
                var lines = doc.splitTextToSize(localStorage.getItem('ComChainWallet'), 180, {});
                doc.text(15, 80, lines);
                
                doc.addPage();
                
                doc.setFontSize(32);
                doc.text(textOffset, 25, title);
                doc.setLineWidth(1.0);
                doc.line(textOffset, 27, textOffset+textWidth+3, 27);
                
                doc.addImage(imgAddData, 'PNG', 90, 32, 30, 30);
                doc.addImage(logoData, 'PNG', 50, 32, 30, 30);
                doc.setFontSize(15);
                doc.text(130, 37, linesAdd);
              
                doc.setFontSize(22);
                
                doc.text(keytextOffset, 81, key);
                var imgData = document.getElementById("qrcode_print0").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 15, 95, 80, 80);
                doc.addImage(imgAddData, 'PNG', 50, 130, 10, 10);
                doc.text(53, 138, "1");
                
                imgData = document.getElementById("qrcode_print1").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 115, 95, 80, 80);
                doc.addImage(imgAddData, 'PNG', 150, 130, 10, 10);
                doc.text(153, 138, "2");
                                
                imgData = document.getElementById("qrcode_print2").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 15, 195, 80, 80);
                doc.addImage(imgAddData, 'PNG', 50, 230, 10, 10);
                doc.text(53, 238, "3");
                
                imgData = document.getElementById("qrcode_print3").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 115, 195, 80, 80);
                doc.addImage(imgAddData, 'PNG', 150, 230, 10, 10);
                doc.text(153, 238, "4");
                
                
                newImg.callback(doc);
            }

            if (globalFuncs.isMulti()){
               var the_arr = globalFuncs.getCssUrl().split('/');
                the_arr.pop();
                the_arr.pop();
                newImg.src = the_arr.join('/')+"/images/lem.png";  
            } else {
                newImg.src = "images/lem.png";  
            }
                
}

globalFuncs.generateCrPDF = function(title, on,assigned,validity,address,dest,content, callback){
            title = title.trim();
            on = on.trim();
            assigned = assigned.trim();
            validity = validity.trim();
            var newImg = new Image();
            newImg.callback=callback;
            newImg.setAttribute('crossOrigin', 'anonymous');
            newImg.onload = function() {
                var height = this.naturalHeight;
                var width = this.naturalWidth;
               
                var c = document.createElement('canvas');
                c.height = height;
                c.width = width;
                var ctx = c.getContext("2d");
                ctx.drawImage(newImg, 0, 0);
                var logoData = c.toDataURL('image/png');
          
                var imgAddData = globalFuncs.wrapImgData(document.getElementsByName("addressIdenticon")[0].style.backgroundImage);
                var imgDestData = globalFuncs.wrapImgData(document.getElementsByName("addressIdenticonDest")[0].style.backgroundImage);
            
                var doc = new jsPDF();
                doc.setFontSize(22);
                
                var textWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                var textOffset = 15+(80 - textWidth) / 2;
                doc.text(textOffset, 21, title);
                doc.setLineWidth(1.0);
                doc.line(textOffset, 22, textOffset+textWidth+2, 22);
                
     
                
                
                doc.addImage(logoData, 'PNG', 15, 32, 20, 20);
                doc.setFontSize(10);
                doc.text(45, 30, on);
                doc.addImage(imgAddData, 'PNG', 45, 32, 20, 20);
                doc.text(75, 30, assigned);
                doc.addImage(imgDestData, 'PNG', 75, 32, 20, 20);
                
                doc.setFontSize(15);
                var lines_val = doc.splitTextToSize(validity, 80, {});
                doc.text(15, 71, lines_val);

                var imgData = document.getElementById("qrCR_print0").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 115, 10, 80, 80);
                doc.addImage(imgAddData, 'PNG', 150, 45, 10, 10);
                doc.text(153, 53, "1");
                
                
                imgData = document.getElementById("qrCR_print1").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 15, 105, 80, 80);
                doc.addImage(imgAddData, 'PNG', 50, 140, 10, 10);
                doc.text(53, 148, "2");
                
                imgData = document.getElementById("qrCR_print2").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 115, 105, 80, 80);
                doc.addImage(imgAddData, 'PNG', 150, 140, 10, 10);
                doc.text(153, 148, "3");
                                
                imgData = document.getElementById("qrCR_print3").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 15, 200, 80, 80);
                doc.addImage(imgAddData, 'PNG', 50, 235, 10, 10);
                doc.text(53, 243, "4");
                
                imgData = document.getElementById("qrCR_print4").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 115, 200, 80, 80);
                doc.addImage(imgAddData, 'PNG', 150, 235, 10, 10);
                doc.text(153, 243, "5");
                
              
                
                
                newImg.callback(doc);
            }

            if (globalFuncs.isMulti()){
               var the_arr = globalFuncs.getCssUrl().split('/');
                the_arr.pop();
                the_arr.pop();
                newImg.src = the_arr.join('/')+"/images/lem.png";  
            } else {
                newImg.src = "images/lem.png";  
            }
                
}
    

    
globalFuncs.generateSaveAdrPDF = function(walletAddress, callback){
            var newImg = new Image();
            newImg.callback=callback;
            newImg.walletAddress=walletAddress;
            newImg.setAttribute('crossOrigin', 'anonymous');
            newImg.onload = function() {
                var height = this.naturalHeight;
                var width = this.naturalWidth;
               
                var c = document.createElement('canvas');
                c.height = height;
                c.width = width;
                var ctx = c.getContext("2d");
                ctx.drawImage(newImg, 0, 0);
                var iciData = c.toDataURL('image/png');
          
                var imgData = document.getElementById("qr_qdd").getElementsByTagName('img')[0].src;
            
                var imgAddData = globalFuncs.wrapImgData(document.getElementById("addressIdenticon").style.backgroundImage);
        
                var doc = new jsPDF('landscape');
           
                doc.addImage(iciData, 'PNG', 15, 12, 128, 186);
            
                doc.addImage(imgAddData, 'PNG', 173, 31, 30, 30);
            
                doc.setFontSize(24);
      
                var lines = doc.splitTextToSize(newImg.walletAddress, 65, {});
                doc.text(208, 40, lines);
            
                doc.addImage(imgData, 'PNG', 168, 75, 108, 108);
               
                newImg.callback(doc);
            }

            if (globalFuncs.isMulti()){
                var the_arr = globalFuncs.getCssUrl().split('/');
                the_arr.pop();
                the_arr.pop();
                newImg.src = the_arr.join('/')+"/images/ici.png";  
            } else {
                newImg.src = "images/ici.png";   
            }
}


globalFuncs.generateTagQR = function(walletAddress, tags){
    var qrcode_1 = new QRCode(document.getElementById("qrcode_p_1"),JSON.stringify({"address":walletAddress,"amount":tags[0].price}));
       
       document.getElementById("qrcode_p_1").style.display = "none";
       
        var qrcode_2 = new QRCode(document.getElementById("qrcode_p_2"),JSON.stringify({"address":walletAddress,"amount":tags[1].price}));
       
       document.getElementById("qrcode_p_2").style.display = "none";
       
        var qrcode_3 = new QRCode(document.getElementById("qrcode_p_3"),JSON.stringify({"address":walletAddress,"amount":tags[2].price}));
       
       document.getElementById("qrcode_p_3").style.display = "none";
               
       var qrcode_4 = new QRCode(document.getElementById("qrcode_p_4"),JSON.stringify({"address":walletAddress,"amount":tags[3].price}));
       
       document.getElementById("qrcode_p_4").style.display = "none";
}


globalFuncs.generateTagsPDF = function(walletAddress, tags, callback){
  
            var newImg = new Image();
            newImg.callback=callback;
            newImg.walletAddress=walletAddress;
            newImg.setAttribute('crossOrigin', 'anonymous');
            newImg.onload = function() {
                var height = this.naturalHeight;
                var width = this.naturalWidth;
               
                var c = document.createElement('canvas');
                c.height = height;
                c.width = width;
                var ctx = c.getContext("2d");
                ctx.drawImage(newImg, 0, 0);
                var logoData = c.toDataURL('image/png');
          
            
                var imgAddData = globalFuncs.wrapImgData(document.getElementById("addressIdenticon").style.backgroundImage);
        
                var doc = new jsPDF();
                doc.setFontSize(24);
                var x_step=105;
                var y_step=148;
                
                var i=0;
                var j=0;
                var qr_ids=["qrcode_p_1","qrcode_p_2","qrcode_p_3","qrcode_p_4"]
                for (var item in tags){
                    if (tags[item].price>0){
                        doc.addImage(logoData, 'PNG', 15 +i*x_step, 15+j*y_step, 30, 30);
                        doc.addImage(imgAddData, 'PNG', 60 +i*x_step, 15+j*y_step, 30, 30);
                        if (tags[item].name){
                            var textWidth = doc.getStringUnitWidth(tags[item].name+" ") * doc.internal.getFontSize() / doc.internal.scaleFactor;
                            doc.text(52.5-textWidth/2.+i*x_step, 60+j*y_step, tags[item].name+"");
                        }
                        
                        var imgData = document.getElementById(qr_ids[item]).getElementsByTagName('img')[0].src;
                        doc.addImage(imgData, 'PNG', 15 +i*x_step, 65+j*y_step, 75, 75);

                        doc.setFillColor(255,255,255);
                      
                        var text_p =   parseFloat(Math.round(tags[item].price * 100) / 100).toFixed(2) +" " +globalFuncs.currencies.CUR;
                        textWidth = doc.getStringUnitWidth(text_p) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                        doc.rect(50-textWidth/2+i*x_step, 99+j*y_step, textWidth+4, 10, 'F');
                        doc.text(52.5-textWidth/2.+i*x_step, 107+j*y_step,text_p);

                        doc.setFillColor(0);
                        
                        i+=1;
                        if (i==2){
                            i=0;
                            j+=1;
                        }
                    }
                }
               
              
                
                
                 

               
                newImg.callback(doc);
            }

            if (globalFuncs.isMulti()){
                var the_arr = globalFuncs.getCssUrl().split('/');
                the_arr.pop();
                the_arr.pop();
                newImg.src = the_arr.join('/')+"/images/lem.png";  
            } else {
                newImg.src = "images/lem.png";   
            }
}




globalFuncs.generateTransPDF = function(walletAddress, list, texts, start_date, end_date, callback){
 var newImg = new Image();
newImg.callback=callback;
newImg.walletAddress=walletAddress;
newImg.setAttribute('crossOrigin', 'anonymous');
newImg.onload = function() {  
    var height = this.naturalHeight;
    var width = this.naturalWidth;
   
    var c = document.createElement('canvas');
    c.height = height;
    c.width = width;
    var ctx = c.getContext("2d");
    ctx.drawImage(newImg, 0, 0);
    var logoData = c.toDataURL('image/png');
    
    var log_width = (20*width)/height;
    
    
    var imgAddData = globalFuncs.wrapImgData(document.getElementById("addressIdenticon").style.backgroundImage);
    
    
    var today = new Date();    
    var tran_on_page = 15;
    var tran_row_height=10;
    var margin_left=25;
    var margin_right=185;
    var col_2=42;
    var col_21=80;
    var col_25=113;
    var col_3=128;
    var col_35=143;
    var col_4=158;
    var col_5=170;
    var vertical_start=92;
    
    var num_tot_page = Math.floor(list.length/tran_on_page);
    if (list.length==0 || list.length%tran_on_page!=0){
        num_tot_page+=1;
    }
    
    var doc = new jsPDF();
    var tot_in=0;
    var tot_out=0;
    for  (var page = 0; page < num_tot_page; ++page){
        // header
        doc.addImage(logoData, 'PNG', doc.internal.pageSize.width - 25 - log_width, 10, log_width, 20);
        doc.setFontSize(13);
        
        doc.text(margin_left, 40, texts.date);
        doc.text(60, 40, today.toISOString().slice(0,10)+' '+today.toTimeString().slice(0,8));
        doc.text(margin_left, 50, texts.requestAddress);
        doc.text(73, 48, [walletAddress.substring(0,21),walletAddress.substring(21)]);
        doc.addImage(imgAddData, 'PNG', 60, 44, 10, 10);
        
        var name_lines = doc.splitTextToSize(texts.proper_name, 50, {});
        if (name_lines.length>2){
             name_lines=name_lines.slice(0,2);
             name_lines[1]=name_lines[1]+'...';
        }
        doc.text(140, 48, name_lines);
        
        
        doc.setFontSize(18)
        var title = texts.title;
        if (page>0){
            title = title+' '+texts.titleNext;
        }
        doc.text(margin_left, 65, title);
        
        doc.setFontSize(8);
        
         if (list.length>0){
            if ( list[0].data.balance!=''){
                doc.text(margin_left, 73, texts.initBal+start_date.toISOString().slice(0,10) +' '+start_date.toTimeString().slice(0,2)+':00 ');
                doc.text(73, 73, globalFuncs.currencies.CUR);
                
                var tra_date = list[0].data.time;
                var last_block = 0;
                var i=0;
                while ( i<list.length && list[i].data.time==tra_date ){
                   if (list[i].data.addr_from==walletAddress){
                        last_block += (list[i].data.recieved + list[i].data.tax)/100.; //////////////////////
                    } else {
                       last_block -= (list[i].data.recieved)/100.; 
                    } 
                    i++;
                }
                
                doc.text(83, 73, (parseFloat(list[0].data.balance) + last_block).toFixed(2));
                
            }
            
            if ( list[list.length-1].data.balance!=''){
                doc.text(margin_left, 77, texts.finalBal+end_date.toISOString().slice(0,10) +' '+end_date.toTimeString().slice(0,2)+':59');
                doc.text(73, 77, globalFuncs.currencies.CUR);
                doc.text(83, 77, parseFloat(list[list.length-1].data.balance).toFixed(2));
            }
        }
        
        doc.setFontSize(8);
        doc.setLineWidth(0.5);
        doc.line(margin_left, 82, margin_right, 82);
        doc.text(margin_left, 86, texts.dateCol);
        doc.text(col_2, 86, texts.textCol);
        doc.text(col_21, 86, texts.memoCol);
        doc.text(col_25, 86, texts.sendCol);
        doc.text(col_35, 86, texts.recievedCol);
        doc.text(col_5, 86, texts.balanceCol +' '+globalFuncs.currencies.CUR);
        doc.line(margin_left, 88, margin_right, 88);
        
        doc.setLineWidth(0.3);
        var row =0;
        for (var index = (page*tran_on_page); index < Math.min(list.length,(page+1)*tran_on_page); ++index){
            var tra=list[index].data;
            var date = new Date(tra.time*1000);
            doc.text(margin_left, vertical_start+tran_row_height*row, date.toISOString().slice(0,10));
            doc.text(margin_left, vertical_start-1+tran_row_height*(row+0.5), ' '+date.toTimeString().slice(0,8));
            
            
            var memo_lines = doc.splitTextToSize(tra.memo, col_25-col_21-3, {});
            if (memo_lines.length>2){
                memo_lines=memo_lines.slice(0,2);
                memo_lines[1]=memo_lines[1]+'...';
            }
            doc.text(col_21, vertical_start+tran_row_height*(row),memo_lines);
            
            if (tra.addr_from==walletAddress){

               if (tra.to_name && tra.to_name.length>0){
                  var name_to_lines = doc.splitTextToSize(tra.to_name, col_21 - col_2-3, {});
                  if (name_to_lines.length>1){
                        name_to_lines=name_to_lines.slice(0,1);
                        name_to_lines[0]=name_to_lines[0]+'...';
                  }
                  
                  doc.text(col_2, vertical_start+tran_row_height*(row), name_to_lines[0]);
                  doc.text(col_2, vertical_start-1+tran_row_height*(row+0.5), tra.addr_to.substring(0, 18)+"..."); 
                  
               } else {
                  var lines = doc.splitTextToSize(tra.addr_to, col_21 - col_2-3, {});
                  doc.text(col_2, vertical_start+tran_row_height*(row), lines); 
               }
        
               
               doc.text(col_25, vertical_start-1+(tran_row_height)*(row+0.5), globalFuncs.currencies.CUR);
               doc.text(col_3, vertical_start-1+(tran_row_height)*(row+0.5), ((tra.recieved+tra.tax)/100.).toFixed(2));
               
               tot_out+=(tra.recieved+tra.tax)/100.;
            } else {
              if (tra.from_name && tra.from_name.length>0){
                  var name_from_lines = doc.splitTextToSize(tra.from_name, col_21 - col_2-3, {});
                  if (name_from_lines.length>1){
                        name_from_lines=name_from_lines.slice(0,1);
                        name_from_lines[0]=name_from_lines[0]+'...';
                  }
                  doc.text(col_2, vertical_start+tran_row_height*(row), name_from_lines);
                  doc.text(col_2, vertical_start-1+tran_row_height*(row+0.5), tra.addr_from.substring(0, 18)+"..."); 
                  
               } else {
                  var lines = doc.splitTextToSize(tra.addr_from, col_21 - col_2-3, {});
                  doc.text(col_2, vertical_start+tran_row_height*(row), lines); 
               }
        
               
               
               
               
               doc.text(col_35, vertical_start-1+(tran_row_height)*(row+0.5), globalFuncs.currencies.CUR);
               doc.text(col_4, vertical_start-1+(tran_row_height)*(row+0.5), (parseFloat(tra.recieved)/100.).toFixed(2));
               tot_in+=(tra.recieved)/100.;
            }
            
            if (tra.balance!='' && (index == list.length-1 || list[index+1].data.time != tra.time)){
                doc.text(col_5, vertical_start-1+(tran_row_height)*(row+0.5), (parseFloat(tra.balance)).toFixed(2));
            }
            
            doc.line(margin_left, vertical_start+1+tran_row_height*(row+0.5), margin_right, vertical_start+1+tran_row_height*(row+0.5));
            
            row += 1;
        }
        
        
        
        doc.setFontSize(8);
        doc.text(80, 281, texts.disclaimer);
        doc.text(100, 285, ''+(page+1) + '/'+num_tot_page);
        
        if (page<num_tot_page-1){
               doc.addPage();
        }
    }
    
    
   doc.setLineWidth(0.5);
   doc.line(margin_left, vertical_start+1+tran_row_height*(row-0.5), margin_right, vertical_start+1+tran_row_height*(row-0.5));
   doc.text(110, vertical_start+tran_row_height*row, texts.totals);
   doc.text(col_3, vertical_start+tran_row_height*row, tot_out.toFixed(2));
   doc.text(col_4, vertical_start+tran_row_height*row, tot_in.toFixed(2));
   
    if (list && list.length>0 && list[list.length-1].data.balance!=''){
        var date_final = new Date(list[list.length-1].data.time*1000);
        doc.text(margin_left, vertical_start+tran_row_height*(row+0.5), texts.finalBal+date_final.toISOString().slice(0,10) +' '+date_final.toTimeString().slice(0,2)+':59');
        doc.text(73, vertical_start+tran_row_height*(row+0.5), globalFuncs.currencies.CUR);
        doc.text(83, vertical_start+tran_row_height*(row+0.5), parseFloat(list[list.length-1].data.balance).toFixed(2));
    }

   this.callback(doc);
};

 if (globalFuncs.isMulti()){
               var the_arr = globalFuncs.getCssUrl().split('/');
                the_arr.pop();
                the_arr.pop();
                newImg.src = the_arr.join('/')+"/images/etherwallet-logo.png";  
            } else {
                newImg.src = "images/etherwallet-logo.png";  
            }
    
}

/////////////////////////////////////////////////////////



 
globalFuncs.loadWallets= function(with_check){
    try{
        var wallets = JSON.parse(localStorage.getItem('ComChainWallets')); 
      } catch(e){}
      
      if (!wallets){
          wallets=[]; 
      }  
      
      if (with_check){
         try{
          var current = JSON.parse(localStorage.getItem('ComChainWallet'));
          if (current){
              var found=false;
              for (var id in wallets){
                  if (wallets[id].address.toUpperCase()==current.address.toUpperCase()){
                      found=true;
                     
                      
                      wallets[id]={address:current.address, file:current};
                  }
              }
              if (!found){
                  wallets.push({address:current.address, file:current});
                  
              }
              localStorage.setItem('ComChainWallets',JSON.stringify( wallets));
          }
         } catch(e){}
      }
      
      return wallets
    }
 
globalFuncs.getWalletAddress = function(){
    var address='';
     try{
          var current = JSON.parse(localStorage.getItem('ComChainWallet'));
          if (current){
              address='0x'+current.address;
          }
     } catch(e){}
     return address;
}

globalFuncs.hasConfig = function(){
    if (!globalFuncs.multicurr){
        return true;
    }
    else{
         try{
              var current = JSON.parse(localStorage.getItem('ComChainServerConf'));
              if (current){
                  return true;
              } else {
                  return false;
              }
         } catch(e){
              return false;
         }
    }
}

////////////////////////////////////////////////////

  globalFuncs.getNodes = function(callback){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', localStorage.getItem('ComChainRepo') + globalFuncs.nodesRepo+'?_=' + new Date().getTime(), true); 
        xhr.responseType = 'json';
        xhr.onreadystatechange = function (oEvent) {  
          if (xhr.readyState === 4) {  
            if (xhr.status === 200) { 
                try{
                    var to_push = xhr.response;
                    if(typeof to_push =='object')
                    {
                        to_push = JSON.stringify(xhr.response);
                    }
                    
                    localStorage.setItem('ComChainApiNodes',to_push); 
                    callback(true);
                } catch(e){
                    callback(false);  
                }  
         
            } else {  
                callback(false);
            }  
          }  
       }; 

    xhr.send();

  }




globalFuncs.selectApiNode = function(nodes,callback){
    if (nodes.length==0){
        localStorage.removeItem('ComChainApiNodes');
        callback(false);
    } else {
        //randomly select a node (poor man's load balancing)
        var id = Math.floor((Math.random() * nodes.length));
        var node = nodes[id];
        
        // check the node is up and running
        globalFuncs.testNode(node,function(success){
            if (success){
                // store the node 
                localStorage.setItem('ComChainAPI', node);
                callback(true);
            }else{
                nodes.splice(id,1);
                globalFuncs.selectApiNode(nodes,callback);      
            }
        });
    }
}


globalFuncs.getApiNodesList = function(callback){
     localStorage.setItem('ComChainAPI','');
     var nodes=null;
     try{
          nodes = JSON.parse(localStorage.getItem('ComChainApiNodes')); 
     } catch(e){}
     
     if (!nodes || !nodes.length || nodes.length==0){
          globalFuncs.getNodes(function(){
                                              globalFuncs.getApiNodesList(callback);
                                          }); //TODO better error handling (?)
     } else {
         callback(nodes);
     }
}

globalFuncs.checkRepo = function(repoList,callback){
    if (!repoList || repoList.length==0){
        callback(false);
    } else {
         var id = Math.floor((Math.random() * repoList.length));
         var repo = repoList[id];
         var xhr = new XMLHttpRequest();
         xhr.open('GET',repo + globalFuncs.PING, true); 
         xhr.responseType = 'json';
         xhr.timeout = 3000;
         xhr.onreadystatechange = function (oEvent) {  
           if (xhr.readyState === 4) {  
             if (xhr.status === 200) { 
                    localStorage.setItem('ComChainRepo', repo);
                    callback(true);
             } else {  
                 repoList.splice(id,1);
                 globalFuncs.checkRepo(repoList, callback); 
            }  
          }  
       }; 

    xhr.send();
    }
   
}

 globalFuncs.checkConnectivity = function(callback){
     var storedEndPoints=[];
     try{
          storedEndPoints = JSON.parse(localStorage.getItem('ComChainApiNodes')); 
     } catch(e){
        storedEndPoints=[];
     }
     
     globalFuncs.checkRepo(storedEndPoints,function (result_stored){
         if (result_stored){
             callback(true);
         } else {
             globalFuncs.checkRepo(globalFuncs.confEndPointsOur,function (result){
                 if (result){
                     callback(true);
                 } else {
                     globalFuncs.checkRepo(globalFuncs.confEndPointsOther,callback);
                 }
             });
         }
     });
 }

 
 /**************************************************************/
 
 globalFuncs.doHide=true;
 localStorage.removeItem('ComChainAPI');
 
 globalFuncs.showLoading = function(text){
     document.getElementById("gl_pane").style.display="block";
     document.getElementById("wt_msg_dv").style.display="inline-block";
     document.getElementById("wt_msg_txt").innerHTML = text;
     document.getElementById("wt_msg_bt_r").style.display="inline-block";
     document.getElementById("wt_msg_bt_h").style.display="none"; 
     globalFuncs.doHide=true;
 }
 
 globalFuncs.showWaiting = function(text){
     document.getElementById("gl_pane").style.display="block";
     document.getElementById("wt_msg_dv").style.display="inline-block";
     document.getElementById("wt_msg_txt").innerHTML = text;
     document.getElementById("wt_msg_bt_r").style.display="none";
     document.getElementById("wt_msg_bt_h").style.display="inline-block"; 
     globalFuncs.doHide=true;
 }
 
 globalFuncs.hideLoadingWaiting = function(apiCheck){
     if (apiCheck==undefined){
         apiCheck=false;
     }
     var show=false;
     if (!apiCheck){
         globalFuncs.doHide=false;
         if (globalFuncs.getServerAddress()!=null && globalFuncs.getServerAddress() !='' ){
             show=true;
         }
     } else {
       show  = !globalFuncs.doHide;
     }
     
     if (show){
         document.getElementById("gl_pane").style.display="none";
         document.getElementById("wt_msg_dv").style.display="none";  
     }
 }
 
 /***************************************************************/
  globalFuncs.useFingerprint = null;
  
  globalFuncs.canUseFingerprint = function(callback){
      if (globalFuncs.useFingerprint!=null){
          callback(globalFuncs.useFingerprint);
      } else {
          if (!Fingerprint){
                globalFuncs.useFingerprint = false;
                callback(globalFuncs.useFingerprint);
          } else {
              Fingerprint.isAvailable(
                function(res){
                    globalFuncs.useFingerprint = true;
                    callback(globalFuncs.useFingerprint);
                }, 
                function(mess){
                    globalFuncs.useFingerprint = false;
                    callback(globalFuncs.useFingerprint);
                });
          }
      }
  }
  
  globalFuncs.unlock = function(callback){
      globalFuncs.canUseFingerprint(function(result){
        if (!result) {
            callback(false);
        } else {
            Fingerprint.show({
                  clientId: "Biletujo",
                  clientSecret: "password" //Only necessary for Android
                }, 
                function(){callback(true)},  
                function(){callback(false)});
        }
      });
  }
  
  
 /***************************************************************/

module.exports = globalFuncs;
