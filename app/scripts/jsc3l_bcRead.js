'use strict';
////
// Pre-requisit:
// BigNumber
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

////////////////////////////////////////////////////////////////////////////////

module.exports = jsc3l_bcRead;

