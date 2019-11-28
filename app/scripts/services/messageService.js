'use strict';
var mesageService = function() {
    
/// COde adapted from https://github.com/LimelabsTech/eth-ecies    

const ec = new ethUtil.EC("secp256k1");


const AES256CbcEncrypt = function (iv, key, plaintext) {
  const cipher = ethUtil.crypto.createCipheriv("aes-256-cbc", key, iv);
  const firstChunk = cipher.update(plaintext);
  const secondChunk = cipher.final();
  
  return Buffer.concat([firstChunk, secondChunk]);
}

const AES256CbcDecrypt = function(iv, key, ciphertext) {
  const cipher = ethUtil.crypto.createDecipheriv("aes-256-cbc", key, iv);
  const firstChunk = cipher.update(ciphertext);
  const secondChunk = cipher.final();
  
  return Buffer.concat([firstChunk, secondChunk]);
}


const BufferEqual = (b1, b2) => {
  if (b1.length !== b2.length) {
    return false;
  }
  
  let res = 0;
  for (let i = 0; i < b1.length; i++) {
    res |= b1[i] ^ b2[i];
  }
  
  return res === 0;
}


const Encrypt = function(publicKey, plaintext) {
  const pubKeyTo =  Buffer.from(publicKey);
  const ephemPrivKey = ec.keyFromPrivate(ethUtil.crypto.randomBytes(32));
  const ephemPubKey = ephemPrivKey.getPublic();
  const ephemPubKeyEncoded = Buffer.from(ephemPubKey.encode());
  
  // Every EC public key begins with the 0x04 prefix before giving
  // the location of the two point on the curve
  const concatenated = Buffer.concat([Buffer.from([0x04]), pubKeyTo]);
  const keys = ec.keyFromPublic(concatenated);
  const pub = keys.getPublic();
  const px = ephemPrivKey.derive(pub);
  const hash = ethUtil.crypto.createHash("sha512").update(Buffer.from(px.toArray())).digest();
  const iv = ethUtil.crypto.randomBytes(16);
  const encryptionKey = hash.slice(0, 32);
  const macKey = hash.slice(32);
  const ciphertext = AES256CbcEncrypt(iv, encryptionKey, plaintext);
  const dataToMac = Buffer.concat([iv, ephemPubKeyEncoded, ciphertext]);
  const mac = ethUtil.crypto.createHmac("sha256", macKey).update(dataToMac).digest();
  
  const serializedCiphertext = Buffer.concat([
    iv, // 16 bytes
    ephemPubKeyEncoded, // 65 bytes
    mac, // 32 bytes
    ciphertext,
  ])
  
  return serializedCiphertext.toString('hex');
}


const Decrypt = function(privKey, encrypted) {
  const encryptedBuff =  Buffer.from(encrypted,"hex");
  const privKeyBuff =  Buffer.from(privKey);
    
  // Read iv, ephemPubKey, mac, ciphertext from encrypted message
  
  const iv = encryptedBuff.slice(0, 16)
  const ephemPubKeyEncoded = encryptedBuff.slice(16, 81);
  const mac = encryptedBuff.slice(81, 113);
  const ciphertext = encryptedBuff.slice(113);
  const ephemPubKey = ec.keyFromPublic(ephemPubKeyEncoded).getPublic();

  const px = ec.keyFromPrivate(privKeyBuff).derive(ephemPubKey);
  const hash = ethUtil.crypto.createHash("sha512").update(Buffer.from(px.toArray())).digest();
  const encryptionKey = hash.slice(0, 32);
  const macKey = hash.slice(32);
  const dataToMac = Buffer.concat([iv, ephemPubKeyEncoded, ciphertext]);
  const computedMac = ethUtil.crypto.createHmac("sha256", macKey).update(dataToMac).digest();
  
  // Verify mac
  if (!BufferEqual(computedMac, mac)) {
    throw new Error("MAC mismatch");
  }
  
  const plaintext = AES256CbcDecrypt(iv, encryptionKey, ciphertext);
  
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

    function publishMessageKey(wallet, pass, callback) {
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
    
    function ensureWalletMessageKey(wallet, pass, message, callback) {
       getMessageKey(wallet.getAddressString(), true, function(remote_key) {
           if (remote_key.pub !== undefined) {
              if (message!=''){
                    if (wallet.message_key === undefined || wallet.message_key.pub === undefined || wallet.message_key.pub != remote_key.pub) {
                         alert(message);
                    } 
                    
                    // Remote but no matching local 
              }
               
           } else {
              
                if (wallet.message_key === undefined || wallet.message_key.pub === undefined || wallet.message_key.priv === undefined) {
                     if (message!=''){
                         alert(message);
                     } 
                     wallet.message_key = newMessageKey(wallet);
                }  
              
              // No remote: publish the local key
              remote_key = wallet.message_key;
              publishMessageKey(wallet, pass, function(data){
              if (data!== undefined ) {
                  
              }
              })       
          }
          
          wallet.message_key = remote_key;
          callback(wallet); 
       });
    }
    
    function messageKeysFromWallet(wallet) {
        return messageKeysFromCrypted(wallet, wallet.message_key.priv);
    }
    
    function messageKeysFromCrypted(wallet, ciphered) {
        var priv = '0x' + Decrypt(wallet.getPrivateKey(), ciphered);
        var pub = ethUtil.privateToPublic(priv);
        return {"pub": pub, "clear_priv": priv};
    }
    
    function cipherMessage(public_key, message) {
         var msg_buff = Buffer.from(message);
         return Encrypt(public_key, msg_buff);
    }
    
    function decipherMessage (private_key, ciphered) {
        return Decrypt(private_key, ciphered);
    }
    
    return {
            getMessageKey:getMessageKey,
            ensureWalletMessageKey:ensureWalletMessageKey,
            messageKeysFromWallet:messageKeysFromWallet,
            messageKeysFromCrypted:messageKeysFromCrypted,
            cipherMessage:cipherMessage,
            decipherMessage:decipherMessage, 
    }
   
};
module.exports = mesageService;
