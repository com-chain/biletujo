'use strict';
var jsc3l_message = function() {
    
/// Code adapted from https://github.com/LimelabsTech/eth-ecies    

var ec = new ethUtil.EC("secp256k1");


var AES256CbcEncrypt = function (iv, key, plaintext) {
  var cipher = ethUtil.crypto.createCipheriv("aes-256-cbc", key, iv);
  var firstChunk = cipher.update(plaintext);
  var secondChunk = cipher.final();
  
  return Buffer.concat([firstChunk, secondChunk]);
}

var AES256CbcDecrypt = function(iv, key, ciphertext) {
  var cipher = ethUtil.crypto.createDecipheriv("aes-256-cbc", key, iv);
  var firstChunk = cipher.update(ciphertext);
  var secondChunk = cipher.final();
  
  return Buffer.concat([firstChunk, secondChunk]);
}


var BufferEqual = function(b1, b2) {
  if (b1.length !== b2.length) {
    return false;
  }
  
  var res = 0;
  for (var i = 0; i < b1.length; i++) {
    res |= b1[i] ^ b2[i];
  }
  
  return res === 0;
}


var Encrypt = function(publicKey, plaintext) {
  /*DEBUG*/
  var private_key = ethUtil.crypto.randomBytes(32);
  var public_key = ethUtil.privateToPublic(private_key);
      
    
  /*DEBUG*/ 
     
     
  var pubKeyTo =  Buffer.from(publicKey);
  var ephemPrivKey = ec.keyFromPrivate(ethUtil.crypto.randomBytes(32));
  var ephemPubKey = ephemPrivKey.getPublic();
  var ephemPubKeyEncoded = Buffer.from(ephemPubKey.encode());
  
  // Every EC public key begins with the 0x04 prefix before giving
  // the location of the two point on the curve
  var concatenated = Buffer.concat([Buffer.from([0x04]), pubKeyTo]);
  var keys = ec.keyFromPublic(concatenated);
  var pub = keys.getPublic();
  var px = ephemPrivKey.derive(pub);
  var hash = ethUtil.crypto.createHash("sha512").update(Buffer.from(px.toArray())).digest();
  var iv = ethUtil.crypto.randomBytes(16);
  var encryptionKey = hash.slice(0, 32);
  var macKey = hash.slice(32);
  var ciphertext = AES256CbcEncrypt(iv, encryptionKey, plaintext);
  var dataToMac = Buffer.concat([iv, ephemPubKeyEncoded, ciphertext]);
  var mac = ethUtil.crypto.createHmac("sha256", macKey).update(dataToMac).digest();
  
  var serializedCiphertext = Buffer.concat([
    iv, // 16 bytes
    ephemPubKeyEncoded, // 65 bytes
    mac, // 32 bytes
    ciphertext,
  ])
  
  return serializedCiphertext.toString('hex');
}


var Decrypt = function(privKey, encrypted) {
  var encryptedBuff =  Buffer.from(encrypted,"hex");
  var privKeyBuff =  Buffer.from(privKey);
    
  // Read iv, ephemPubKey, mac, ciphertext from encrypted message
  
  var iv = encryptedBuff.slice(0, 16)
  var ephemPubKeyEncoded = encryptedBuff.slice(16, 81);
  var mac = encryptedBuff.slice(81, 113);
  var ciphertext = encryptedBuff.slice(113);
  var ephemPubKey = ec.keyFromPublic(ephemPubKeyEncoded).getPublic();

  var px = ec.keyFromPrivate(privKeyBuff).derive(ephemPubKey);
  var hash = ethUtil.crypto.createHash("sha512").update(Buffer.from(px.toArray())).digest();
  var encryptionKey = hash.slice(0, 32);
  var macKey = hash.slice(32);
  var dataToMac = Buffer.concat([iv, ephemPubKeyEncoded, ciphertext]);
  var computedMac = ethUtil.crypto.createHmac("sha256", macKey).update(dataToMac).digest();
  
  // Verify mac
  if (!BufferEqual(computedMac, mac)) {
    throw new Error("MAC mismatch");
  }
  
  var plaintext = AES256CbcDecrypt(iv, encryptionKey, ciphertext);
  
  return plaintext.toString();
}    
    
    
//////////////////////////////////////////////////////////////    
    
    
// NOT EXPOSED 
    function newMessageKey(wallet) {
        var new_key = Wallet.generate(false); 
        var m_pub = new_key.getPublicKeyString();
        var m_priv = new_key.getPrivateKeyString();
        return {"pub": m_pub, "priv": Encrypt(wallet.getPublicKey(), m_priv)};
    }

    function publishMessageKey(wallet, callback) {
        var data_obj = {"address": wallet.getAddressString(),
        "public_message_key": wallet.message_key.pub,
        "private_message_key": wallet.message_key.priv
        }
        
        var data_str = JSON.stringify(data_obj);
        var msg=ethUtil.toBuffer(data_str);
	    var msgHash = ethUtil.hashPersonalMessage(msg);
	    var signature = ethUtil.ecsign(msgHash, wallet.getPrivateKey());
        var sign = ethUtil.bufferToHex(Buffer.concat([ signature.r, signature.s, ethUtil.toBuffer(signature.v) ]))
            
        ajaxReq.publishMessageKey(data_str, sign, function(data) {callback(data);} ); 
    }
    
//////////////////////////////////////////////////////////////    
    function getMessageKey(address, with_private, callback) {
       ajaxReq.getMessageKey(address, with_private, callback); 
    } 
    
    function ensureWalletMessageKey(wallet, message, callback) {
       getMessageKey(wallet.getAddressString(), true, function(remote_key) {
           if (remote_key.public_message_key !== undefined) {
              if (message!=''){
                    if (wallet.message_key === undefined || wallet.message_key.pub === undefined || wallet.message_key.pub != remote_key.public_message_key) {
                         alert(message);
                    } 
                    
                    // Remote but no matching local 
              }
              
              remote_key = {"pub": remote_key.public_message_key, "priv": remote_key.private_message_key}
              
               
           } else {
              
                if (wallet.message_key === undefined || wallet.message_key.pub === undefined || wallet.message_key.priv === undefined) {
                     if (message!=''){
                         alert(message);
                     } 
                     wallet.message_key = newMessageKey(wallet);
                }  
              
              // No remote: publish the local key
              remote_key = wallet.message_key;
              publishMessageKey(wallet, function(data){}) ;      
          }
          
          wallet.message_key = remote_key;
          callback(wallet); 
       });
    }
    
    function messageKeysFromWallet(wallet) {
        return messageKeysFromCrypted(wallet, wallet.message_key.priv);
    }
    
    function messageKeysFromCrypted(wallet, ciphered) {
        var priv =  Decrypt(wallet.getPrivateKey(), ciphered);
        if (priv.toLowerCase().substring(0,2)=='0x') {
            priv = priv.substr(2);
        }
        return {"clear_priv": priv};
    }
    
    function cipherMessage(public_key, message) {
         var msg_buff = Buffer.from(message);
         if (public_key.toLowerCase().substring(0,2)=='0x') {
            public_key = public_key.substr(2);
        }
        
         var key = Buffer.from(public_key,'hex')
         return Encrypt(key, msg_buff);
    }
    
    function decipherMessage (private_key, ciphered) {
        if (private_key.toLowerCase().substring(0,2)=='0x') {
            private_key = priv.substr(2);
        }
        var key = Buffer.from(private_key,'hex')
        return Decrypt(key, ciphered);
    }
    
    
    function publishReqMessages(wallet, add_to, message, callback) {
        getMessageKey(wallet.getAddressString(),false,function(from_key){
            var from_msg_key = from_key.public_message_key;
            getMessageKey(add_to,false,function(to_key){ 
                var to_msg_key = to_key.public_message_key;
                
                var message_from = '';
                if (from_msg_key!==undefined) {  
                   message_from = cipherMessage(from_msg_key, message);
                }
                
                var message_to = '';
                if (to_msg_key!==undefined) {  
                   message_to = cipherMessage(to_msg_key, message);
                }
                
                var data_obj = {"add_req": wallet.getAddressString(),
                    "add_cli": add_to,
                    "ref_req": message_from,
                    "ref_cli": message_to
                }
                
                var data_str = JSON.stringify(data_obj);
                var msg=ethUtil.toBuffer(data_str);
                var msgHash = ethUtil.hashPersonalMessage(msg);
                var signature = ethUtil.ecsign(msgHash, wallet.getPrivateKey());
                var sign = ethUtil.bufferToHex(Buffer.concat([ signature.r, signature.s, ethUtil.toBuffer(signature.v) ]))
                ajaxReq.publishReqMessages(data_str, sign, function(data) {callback(data);} ); 
            });
        });   
    }
    
    function getReqMessage(wallet, other_add, my_message_key, ISentThisMessage, callback) {
        var add_from = ISentThisMessage ? wallet.getAddressString() : other_add;
        var add_to = !ISentThisMessage ? wallet.getAddressString() : other_add;
        ajaxReq.getReqMessages(add_from, add_to, function(data){
            var message ='';
            if (data!== undefined){
                var crypted = '';
                if (ISentThisMessage && data.ref_from !== undefined ){
                    crypted = data.ref_from;
                } else if (!ISentThisMessage && data.ref_to !== undefined ){
                    crypted = data.ref_to;
                }
                
                if (crypted!="") {
                    try {
                         message = decipherMessage(my_message_key, crypted);
                    } catch (e) {
                        message ='';
                    }
                }
            }
            callback(message);
        });
    } 
    
    
    
    return {
            getMessageKey:getMessageKey,
            ensureWalletMessageKey:ensureWalletMessageKey,
            messageKeysFromWallet:messageKeysFromWallet,
            messageKeysFromCrypted:messageKeysFromCrypted,
            cipherMessage:cipherMessage,
            decipherMessage:decipherMessage, 
            publishReqMessages:publishReqMessages,
            getReqMessage:getReqMessage,
    }
   
};
module.exports = jsc3l_message;
