'use strict';
////
// Pre-requisit:
// BigNumber (npm install bignumber.js@2.4.0)
// 
// ajaxReq (getEthCall & getEthCallAt)
////

var jsc3l_bcRead = function() {};
                     
// Function to read amount of coin  
var balance_function = {"getGlobalBalance":"0x70a08231",
                        "getNantBalance":"0xae261aba", 
                        "getCmBalance":"0xbbc72a17",
                        "getCmLimitBelow":"0xcc885a65",
                        "getCmLimitAbove":"0xae7143d6"};                      
                      
for (var key in balance_function) {
    const address = balance_function[key]
    jsc3l_bcRead[key] = function(walletAddress, callback){getAmmount(address, walletAddress, callback);};
}

// Function to read Account infos 
var account_function = {"getAccountStatus":"0x61242bdd",
                        "getAccountType":"0xba99af70", 
                        "getIsOwner":"0x2f54bf6e",
                        "getTaxAmount":"0x98a9cfac",
                        "getLegTaxAmount":"0x48455399",
                        "getTotalAmount":"0x18160ddd"};                      
                      
for (var key in account_function) {
    const address = account_function[key]
    jsc3l_bcRead[key] = function(walletAddress, callback){getAccInfo(address, walletAddress, callback);};
}

// Get Global status of the contract 
jsc3l_bcRead.getContractStatus = function(callback) {
    var contractStatusAddress = "0x8b3c7c69"; 
    getGlobInfo(contractStatusAddress, callback);
}

// Get Global infos: Tax destinary Account
jsc3l_bcRead.getTaxAccount = function(callback) {
    var taxAccountAddress = "0x4f2eabe0"; 
    getGlobInfo(taxAccountAddress, callback);
}

// Get Historical infos infos: Global balance
jsc3l_bcRead.getHistoricalGlobalBalance = function(walletAddress, block_nb, callback) {
    var globalBalance = "0x70a08231"; 
    getAmmountAt(globalBalance, walletAddress, block_nb, callback);
}


// Handle lists
var List_function = {"getAllowanceList":{"count":"0xaa7adb3d", "map":"0xb545b11f","amount":"0xdd62ed3e"},

                     "getRequestToApproveList":{"count":"0xdebb9d28", "map":"0x726d0a28","amount":"0x3537d3fa"},
                     "getPendingRequestList":{"count":"0x418d0fd4", "map":"0x0becf93f","amount":"0x09a15e43"},
            
                     "getDelegationList":{"count":"0x58fb5218", "map":"0xca40edf1","amount":"0x046d3307"},
                     "getMyDelegationList":{"count":"0x7737784d", "map":"0x49bce08d","amount":"0xf24111d2"},
                     
                     "getAcceptedRequestList":{"count":"0x8d768f84", "map":"0x59a1921a","amount":"0x958cde37"},
                     "getRejectedRequestList":{"count":"0x20cde8fa", "map":"0x9aa9366e","amount":"0xeac9dd4d"}
                    };            

                    
for (var key in List_function) {
    const config_list = List_function[key]
    jsc3l_bcRead[key] = function(walletAddress, ind_min, ind_max, callback){
        getInfo(jsc3l_customization.getContract2(), config_list.count, walletAddress, function(count){
            var list = [];
            var index = Math.min(count-1,ind_max);
            getElementInList(jsc3l_customization.getContract2(), 
                                         config_list.map, 
                                         config_list.amount, 
                                         walletAddress, 
                                         index, 
                                         list, 
                                         ind_min, 
                                         callback);
        });
    };
}                    
                    

////////////////////////////////////////////////////////////////////////////////
// Generic read function

var getNumber = function(data, ratio){
        var short_data = '0x'+ data.slice(-12);
        var a = parseInt(short_data, 16);
        
        if (a>(34359738368*4096)){
            a=a-68719476736*4096
        }
        
        return a/ratio;   
    }
    
var encodeNumber=function(number){
         var valueHex;
         if (number<0){
            valueHex = padLeft(new BigNumber(16).pow(64).plus(number).toString(16), 64);
         } else{
            valueHex = padLeft(new BigNumber(number).toString(16), 64);
         }
         
         return valueHex;
    }
    
var padLeft = function(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var getDataObj = function(to, func, arrVals) {
	var val="";
    for(var i=0;i<arrVals.length;i++) val+=padLeft(arrVals[i],64);
    return {to: to, data: func+val};
}

var getNakedAddress = function(address) {
	return address.toLowerCase().replace('0x', '');
}

var getAmmount = function(address, walletAddress, callback){
    var userInfo = getDataObj(jsc3l_customization.getContract1(), address, [getNakedAddress(walletAddress)]);
    ajaxReq.getEthCall(userInfo, function(data) {
        if (!data.error) {
	        callback(getNumber(data.data, 100.).toString());   
        }
    });        
}

var getAccInfo = function(address, walletAddress, callback){
    getInfo(jsc3l_customization.getContract1(), address, walletAddress, callback);
}

var getGlobInfo = function(address, callback){
    var userInfo = getDataObj(jsc3l_customization.getContract1(), address, []);
	ajaxReq.getEthCall(userInfo, function(data) {
        if (!data.error) {
		    callback(data.data);  
	    }
	});        
}
 

var getAmmountAt = function(address, walletAddress, block_nb, callback){
    var userInfo = getDataObj(jsc3l_customization.getContract1(), address, [getNakedAddress(walletAddress)]);
    var block_hex='0x'+new BigNumber(block_nb).toString(16);
    ajaxReq.getEthCallAt(userInfo, block_hex, function(data) {
        if (!data.error && data.data) {
	        callback(getNumber(data.data, 100.).toString());
        } else {
            callback("");
        }
    });        
}


var getInfo = function(contract, address, walletAddress, callback){
    var userInfo = getDataObj(contract, address, [getNakedAddress(walletAddress)]);
	ajaxReq.getEthCall(userInfo, function(data) {
        if (!data.error) {
		    callback(getNumber(data.data, 1.));
               
	    }
	});        
}
    

var getAmountForElement = function(contract, function_address, caller_address, element_address, callback){
    var userInfo = getDataObj(contract, function_address, [getNakedAddress(caller_address), getNakedAddress(element_address)]);
    ajaxReq.getEthCall(userInfo, function(data) {
        if (!data.error) {
	        callback(getNumber(data.data, 100.).toString());    
        }
	});        
}

var getElementInList = function(contract, map_function_address, amount_function_address, caller_address, index, list, ind_min, final_call_back){
    if (index>=ind_min){
        var userInfo = getDataObj(contract, map_function_address, [getNakedAddress(caller_address), padLeft(new BigNumber(index).toString(16), 64) ]);
        ajaxReq.getEthCall(userInfo, function(data) {
            if (!data.error) {
                getAmountForElement(contract, amount_function_address, caller_address, data.data, function(amount){
                    var cleaned_add = '0x'+ data.data.substring(data.data.length-40);
                    var element = {address:cleaned_add, amount:amount};
                    list.unshift(element);
                    getElementInList(contract, map_function_address, amount_function_address, caller_address, index-1, list, ind_min, final_call_back);
                    
                });
		    }
		});    
        
    } else {
       final_call_back(list); 
    }      
}

////////////////////////////////////////////////////////////////////////////////

jsc3l_bcRead.getGlobInfo  = function(address, callback){
    getGlobInfo(address, callback);
}

module.exports = jsc3l_bcRead;

