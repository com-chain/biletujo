'use strict';
////
// Pre-requisit:
// BigNumber (npm install bignumber.js@2.4.0)
// 
// uiFuncs (generateTx & sendTx)
////

var jsc3l_bcTransaction = function() {};

/* Action in Contract 1*/ 
jsc3l_bcTransaction.SetAccountParam = function(wallet, account_address, acc_status, acc_type, limit_minus, limit_plus, callback){
     var accAdd = padLeft(getNakedAddress(account_address), 64);
     generateTx(jsc3l_customization.getContract1(), 
                wallet, 
                "0x848b2592",
                [accAdd,
                 encodeNumber(acc_status),
                 encodeNumber(acc_type),
                 encodeNumber(parseInt(100*limit_plus,10)),
                 encodeNumber(parseInt(100*limit_minus,10))], 
                {},
                callback);
 }
 
jsc3l_bcTransaction.PledgeAccount = function(wallet, account_address, amount, callback){
     var amount_cent = encodeNumber(parseInt(100*amount,10));
     var accAdd = padLeft(getNakedAddress(account_address), 64);
     generateTx(jsc3l_customization.getContract1(),
                wallet, 
                "0x6c343eef", 
                [accAdd, amount_cent],
                {},
                callback);       
 }
 
jsc3l_bcTransaction.setAllowance = function(wallet, spender_address, amount, callback){
      var acc_add = padLeft(getNakedAddress(spender_address), 64);
      generateTx(jsc3l_customization.getContract1(),
                 wallet, 
                 "0xd4e12f2e", 
                 [acc_add, encodeNumber(parseInt(100*amount,10))], 
                 {},
                 callback);
}
 
jsc3l_bcTransaction.setDelegation = function (wallet, spender_address, limit,callback){
      var acc_add = padLeft(getNakedAddress(spender_address), 64);
      generateTx(jsc3l_customization.getContract1(),
                 wallet, 
                 "0x75741c79", 
                 [acc_add, encodeNumber(parseInt(100*limit,10))], 
                 {},
                 callback);
}

jsc3l_bcTransaction.SetTaxAmount = function(wallet, amount, callback){
     generateTx(jsc3l_customization.getContract1(),
                 wallet, 
                 "0xf6f1897d", 
                 [encodeNumber(parseInt(amount,10))],
                 {},
                 callback);       
}
 
jsc3l_bcTransaction.SetTaxLegAmount = function(wallet, amount, callback){
     generateTx(jsc3l_customization.getContract1(),
                 wallet, 
                 "0xfafaf4c0", 
                 [encodeNumber(parseInt(amount,10))],
                 {},
                 callback);       
}
 
jsc3l_bcTransaction.SetTaxAccount = function(wallet, account_address, callback){
     var accAdd = padLeft(getNakedAddress(account_address), 64);
     generateTx(jsc3l_customization.getContract1(),
                            wallet, 
                            "0xd0385b5e", 
                            [accAdd],
                            {},
                            callback);       
}
 
jsc3l_bcTransaction.SetOwnerAccount = function(wallet, account_address, callback){
     var accAdd = padLeft(getNakedAddress(account_address), 64);
     generateTx(jsc3l_customization.getContract1(),
                            wallet, 
                            "0xf2fde38b", 
                            [accAdd],
                            {},
                            callback);       
 }

/*Action in contract 2*/
jsc3l_bcTransaction.TransfertNant = function (wallet, to_address, amount, additional_post_data, callback){
      var to_add = padLeft(getNakedAddress(to_address), 64);
      generateTx(jsc3l_customization.getContract2(), 
                             wallet, 
                             "0xa5f7c148", 
                             [to_add, encodeNumber(parseInt(100*amount,10))],
                             additional_post_data,
                             callback);
}

jsc3l_bcTransaction.TransfertCM = function (wallet, to_address,amount,incr, additional_post_data, callback){
      var to_add = padLeft(getNakedAddress(to_address), 64);
      
      if (incr==0){
                generateTx(jsc3l_customization.getContract2(), 
                             wallet, 
                             "0x60ca9c4c", 
                             [to_add, encodeNumber(parseInt(100*amount,10))], 
                             additional_post_data,        
                             callback);
      } else {
                generateTxDelta(jsc3l_customization.getContract2(), 
                             wallet, 
                             "0x60ca9c4c", 
                             [to_add, encodeNumber(parseInt(100*amount,10))],
                             additional_post_data,
                             callback);
      }
}

jsc3l_bcTransaction.TransfertOnBehalfNant = function (wallet, from_address, to_address, amount, additional_post_data, callback){
      additional_post_data["delegate"] = wallet.getAddressString();
      var from_add = padLeft(getNakedAddress(from_address), 64);
      var to_Add = padLeft(getNakedAddress(to_address), 64);
      generateTx(jsc3l_customization.getContract2(),
                             wallet, 
                             "0x1b6b1ee5", 
                             [from_add, to_Add, encodeNumber(parseInt(100*amount,10))], 
                             additional_post_data, 
                             callback);
}

jsc3l_bcTransaction.TransfertOnBehalfCM = function (wallet, from_address, to_address, amount, additional_post_data, callback){
      additional_post_data["delegate"] = wallet.getAddressString();
      var from_add = padLeft(getNakedAddress(from_address), 64);
      var to_Add = padLeft(getNakedAddress(to_address), 64);
      generateTx(jsc3l_customization.getContract2(),
                             wallet, 
                             "0x74c421fe", 
                             [from_add, to_Add, encodeNumber(parseInt(100*amount,10))], 
                             additional_post_data, 
                             callback);
}

jsc3l_bcTransaction.askTransfertFrom = function (wallet,account_address, from_address,amount,callback){
      var from_add = padLeft(getNakedAddress(from_address), 64);
      var accAdd = padLeft(getNakedAddress(account_address), 64);
      generateTx(jsc3l_customization.getContract2(),
                             wallet, 
                             "0x58258353", 
                             [from_add, encodeNumber(parseInt(100*amount,10))], 
                             {},
                             callback);
}

jsc3l_bcTransaction.askTransfertCMFrom = function (wallet,account_address, from_address,amount,callback){
      var from_add = padLeft(getNakedAddress(from_address), 64);
      var accAdd = padLeft(getNakedAddress(account_address), 64);
      generateTx(jsc3l_customization.getContract2(),
                             wallet, 
                             "0x2ef9ade2", 
                             [from_add, encodeNumber(parseInt(100*amount,10))], 
                             {},
                             callback);
}

jsc3l_bcTransaction.PayRequestNant = function (wallet, to_address, amount, additional_data, callback){
      var to_Add = padLeft(getNakedAddress(to_address), 64);
      generateTx(jsc3l_customization.getContract2(),
                             wallet, 
                             "0x132019f4", 
                             [to_Add, encodeNumber(parseInt(100*amount,10))], 
                             additional_data, 
                             callback);
}

jsc3l_bcTransaction.PayRequestCM = function (wallet, to_address, amount, additional_data, callback){
      var to_Add = padLeft(getNakedAddress(to_address), 64);
      generateTx(jsc3l_customization.getContract2(),
                             wallet, 
                             "0x1415707c", 
                             [to_Add, encodeNumber(parseInt(100*amount,10))],
                             additional_data, 
                             callback);
}

jsc3l_bcTransaction.RejectRequest = function (wallet, to_address, callback){
      var to_Add = padLeft(getNakedAddress(to_address), 64);
      generateTx(jsc3l_customization.getContract2(),
                             wallet, 
                             "0xaf98f757", 
                             [to_Add],
                             {},
                             callback);
}
 
jsc3l_bcTransaction.DissmissAcceptedInfo = function(wallet, account_address, callback){
     var accAdd = padLeft(getNakedAddress(account_address), 64);
     generateTx(jsc3l_customization.getContract2(),
                            wallet, 
                            "0xccf93c7a", 
                            [accAdd], 
                            {},
                            callback);       
}
 
jsc3l_bcTransaction.DissmissRejectedInfo = function(wallet, account_address, callback){
     var accAdd = padLeft(getNakedAddress(account_address), 64);
     generateTx(jsc3l_customization.getContract2(),
                            wallet, 
                            "0x88759215", 
                            [accAdd], 
                            {},
                            callback);       
}
 

////////////////////////////////////////////////////////////////////////////////
//  CM VS Nant Handling

jsc3l_bcTransaction.getSplitting = function(nant_val, cm_val, cm_minus_lim, amount){
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


////////////////////////////////////////////////////////////////////////////////
var padLeft = function(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var getNakedAddress = function(address) {
	return address.toLowerCase().replace('0x', '');
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


var internalGenTx = function(contract, wallet, fuct_address, values, additional_post_data, callback, add_delta){
    var tx = {
        gasLimit: 500000,
        data: '',
        to: contract,
        unit: "ether",
        value: 0,
        nonce: 1,
        gasPrice: null,
        donate: false
    }
        
    var concatenated_variable='';
    for (var index = 0; index < values.length; ++index) {
        var valueHex = values[index];
        concatenated_variable = concatenated_variable + valueHex;
    }
    
    tx.data = fuct_address + concatenated_variable;
    tx.from = wallet.getAddressString();
    tx.key = wallet.getPrivateKeyString(); 
    
    if (add_delta) {
        uiFuncs.generateTxDelta(tx, function(rawTx){
            if (!rawTx.isError){
             uiFuncs.sendTx(rawTx.signedTx, additional_post_data, function(res){
                 callback(res);    
             });
            } else { 
                callback(rawTx);
            }
	    });    
    } else {
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
}  

var generateTx = function(contract, wallet, fuct_address, values, additional_post_data, callback){
    internalGenTx(contract, wallet, fuct_address, values, additional_post_data, callback, false);
}  

var generateTxDelta = function(contract, wallet, fuct_address, values, additional_post_data, callback){
    internalGenTx(contract, wallet, fuct_address, values, additional_post_data, callback, true);
}  

////////////////////////////////////////////////////////////////////////////////

module.exports = jsc3l_bcTransaction;

