'use strict';

var jsc3l_wallet = function() {};

jsc3l_wallet.scrypt = {
	n: 1024
};
jsc3l_wallet.kdf = "scrypt"; 


jsc3l_wallet.createWallet = function(callback) {
    var wallet = Wallet.generate(false); 
    jsc3l_message().ensureWalletMessageKey(wallet, '', function(complete_wall) {
       callback(complete_wall);                         
    }); 
}


jsc3l_wallet.encryptWallet = function(wallet, password) {
   return wallet.toV3(password, {
                                    kdf: jsc3l_wallet.kdf, n: jsc3l_wallet.scrypt.n,
                                    server_name: jsc3l_customization.getCurencyName(),
                                    message_key: wallet.message_key});
}

jsc3l_wallet.validateEnrollment = function(code_id, signature, callback) {
    ajaxReq.validateEnrollmentLetter(code_id, 
                                     jsc3l_customization.getCurencyName(), 
                                     signature,
                                     callback
                                     );
}


jsc3l_wallet.enrollAddress = function(wallet, code_id, token, callback) {
    ajaxReq.enrollAddress(code_id,
                          wallet.getAddressString(), 
                          jsc3l_customization.getCurencyName(),
                          token,
                          function(data){
                             callback(data.result=="OK");
                          });
}

jsc3l_wallet.requestUnlock = function(wallet, callback) {
    ajaxReq.requestUnlock(wallet.getAddressString(), 
                          jsc3l_customization.getUnlockUrl(), 
                          callback);
}


module.exports = jsc3l_wallet;


