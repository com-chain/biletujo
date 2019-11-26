'use strict';
var Wallet = function(priv) {
	this.privKey = priv.length == 32 ? priv : Buffer(priv, 'hex')
}
Wallet.generate = function(icapDirect) {
	if (icapDirect) {
		while (true) {
			var privKey = ethUtil.crypto.randomBytes(32)
			if (ethUtil.privateToAddress(privKey)[0] === 0) {
				return new Wallet(privKey)
			}
		}
	} else {
		return new Wallet(ethUtil.crypto.randomBytes(32))
	}
}
Wallet.prototype.getPrivateKey = function() {
	return this.privKey
}
Wallet.prototype.getPrivateKeyString = function() {
	return this.getPrivateKey().toString('hex')
}
Wallet.prototype.getPublicKey = function() {
	return ethUtil.privateToPublic(this.privKey)
}
Wallet.prototype.getPublicKeyString = function() {
	return '0x' + this.getPublicKey().toString('hex')
}
Wallet.prototype.getAddress = function() {
	return ethUtil.privateToAddress(this.privKey)
}
Wallet.prototype.getAddressString = function() {
	return '0x' + this.getAddress().toString('hex')
}
Wallet.prototype.getChecksumAddressString = function() {
	return ethUtil.toChecksumAddress(this.getAddressString())
}
Wallet.fromPrivateKey = function(priv) {
	return new Wallet(priv)
}
Wallet.prototype.toV3 = function(password, opts) {
	opts = opts || {}
	var salt = opts.salt || ethUtil.crypto.randomBytes(32)
	var iv = opts.iv || ethUtil.crypto.randomBytes(16)
	var derivedKey
	var kdf = opts.kdf || 'scrypt'
	var kdfparams = {
		dklen: opts.dklen || 32,
		salt: salt.toString('hex')
	}
	if (kdf === 'pbkdf2') {
		kdfparams.c = opts.c || 262144
		kdfparams.prf = 'hmac-sha256'
		derivedKey = ethUtil.crypto.pbkdf2Sync(new Buffer(password), salt, kdfparams.c, kdfparams.dklen, 'sha256')
	} else if (kdf === 'scrypt') {
		// FIXME: support progress reporting callback
		kdfparams.n = opts.n || 262144
		kdfparams.r = opts.r || 8
		kdfparams.p = opts.p || 1
		derivedKey = ethUtil.scrypt(new Buffer(password), salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
	} else {
		throw new Error('Unsupported kdf')
	}
	var cipher = ethUtil.crypto.createCipheriv(opts.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv)
	if (!cipher) {
		throw new Error('Unsupported cipher')
	}
	var ciphertext = Buffer.concat([cipher.update(this.privKey), cipher.final()])
	var mac = ethUtil.sha3(Buffer.concat([derivedKey.slice(16, 32), new Buffer(ciphertext, 'hex')]))
        
        
	var obj = {
		version: 3,
		id: ethUtil.uuid.v4({
			random: opts.uuid || ethUtil.crypto.randomBytes(16)
		}),
		address: this.getAddress().toString('hex'),
		Crypto: {
			ciphertext: ciphertext.toString('hex'),
			cipherparams: {
				iv: iv.toString('hex')
			},
			cipher: opts.cipher || 'aes-128-ctr',
			kdf: kdf,
			kdfparams: kdfparams,
			mac: mac.toString('hex')
		},
        // ComChain addition:
        server: {name:opts.server_name}
	};
    
    if (opts.message_key !=="undefined") {
        obj.message_key = opts.message_key;
    }
    
    return obj;
}


Wallet.prototype.cipher = function(password, data) {
    var crypto = JSON.parse(localStorage.getItem('ComChainWallet').toLowerCase()).crypto;
    var kdfparams = crypto.kdfparams;
    var iv = ethUtil.crypto.randomBytes(16);
	var derivedKey = ethUtil.scrypt(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);

	var cipher = ethUtil.crypto.createCipheriv( 'aes-128-ctr', derivedKey.slice(0, 16), iv);
	
	var ciphertext = Buffer.concat([cipher.update(data), cipher.final()]);
	var mac = ethUtil.sha3(Buffer.concat([derivedKey.slice(16, 32), new Buffer(ciphertext, 'hex')]));
	return {
		crypto: {
			ciphertext: ciphertext.toString('hex'),
			cipherparams: {
				iv:  iv.toString('hex')
			},
			cipher: 'aes-128-ctr',
			kdf: 'scrypt',
			kdfparams: kdfparams,
			mac: mac.toString('hex')
		},
	};
}

Wallet.prototype.decifer = function(input, password) {
	var json = (typeof input === 'object') ? input : JSON.parse(input.toLowerCase());

	var kdfparams = json.crypto.kdfparams;
	var derivedKey = ethUtil.scrypt(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
	
	var ciphertext = new Buffer(json.crypto.ciphertext, 'hex');
	var mac = ethUtil.sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext]));
	if (mac.toString('hex') !== json.crypto.mac) {
		throw new Error('Key derivation failed - possibly wrong passphrase');
	}
	var decipher = ethUtil.crypto.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), new Buffer(json.crypto.cipherparams.iv, 'hex'));
	var seed = Wallet.decipherBuffer(decipher, ciphertext, 'hex');
	return seed;
}







Wallet.prototype.toJSON = function() {
	return {
		address: this.getAddressString(),
		checksumAddress: this.getChecksumAddressString(),
		privKey: this.getPrivateKeyString(),
		pubKey: this.getPublicKeyString(),
        publisher:"MyEtherWallet",
        encrypted:false,
        version:2
	}
}
Wallet.fromMyEtherWallet = function(input, password) {
	var json = (typeof input === 'object') ? input : JSON.parse(input)
	var privKey
	if (!json.locked) {
		if (json.private.length !== 64) {
			throw new Error('Invalid private key length')
		}
		privKey = new Buffer(json.private, 'hex')
	} else {
		if (typeof password !== 'string') {
			throw new Error('Password required')
		}
		if (password.length < 7) {
			throw new Error('Password must be at least 7 characters')
		}
		var cipher = json.encrypted ? json.private.slice(0, 128) : json.private
		cipher = Wallet.decodeCryptojsSalt(cipher)
		var evp = Wallet.evp_kdf(new Buffer(password), cipher.salt, {
			keysize: 32,
			ivsize: 16
		})
		var decipher = ethUtil.crypto.createDecipheriv('aes-256-cbc', evp.key, evp.iv)
		privKey = Wallet.decipherBuffer(decipher, new Buffer(cipher.ciphertext))
		privKey = new Buffer((privKey.toString()), 'hex')
	}
	var wallet = new Wallet(privKey)
	if (wallet.getAddressString() !== json.address) {
		throw new Error('Invalid private key or address')
	}
	return wallet
}
Wallet.fromMyEtherWalletV2 = function (input){
    var json = (typeof input === 'object') ? input : JSON.parse(input);
    if (json.privKey.length !== 64) {
        throw new Error('Invalid private key length');
    };
    var privKey = new Buffer(json.privKey, 'hex');
    return new Wallet(privKey);
}
Wallet.fromEthSale = function(input, password) {
	var json = (typeof input === 'object') ? input : JSON.parse(input)
	var encseed = new Buffer(json.encseed, 'hex')
	var derivedKey = ethUtil.crypto.pbkdf2Sync(Buffer(password), Buffer(password), 2000, 32, 'sha256').slice(0, 16)
	var decipher = ethUtil.crypto.createDecipheriv('aes-128-cbc', derivedKey, encseed.slice(0, 16))
	var seed = Wallet.decipherBuffer(decipher, encseed.slice(16))
	var wallet = new Wallet(ethUtil.sha3(seed))
	if (wallet.getAddress().toString('hex') !== json.ethaddr) {
		throw new Error('Decoded key mismatch - possibly wrong passphrase')
	}
	return wallet
}
Wallet.fromMyEtherWalletKey = function(input, password) {
	var cipher = input.slice(0, 128)
	cipher = Wallet.decodeCryptojsSalt(cipher)
	var evp = Wallet.evp_kdf(new Buffer(password), cipher.salt, {
		keysize: 32,
		ivsize: 16
	})
	var decipher = ethUtil.crypto.createDecipheriv('aes-256-cbc', evp.key, evp.iv)
	var privKey = Wallet.decipherBuffer(decipher, new Buffer(cipher.ciphertext))
	privKey = new Buffer((privKey.toString()), 'hex')
	return new Wallet(privKey)
}
Wallet.fromV3 = function(input, password, nonStrict) {
	var json = (typeof input === 'object') ? input : JSON.parse(nonStrict ? input.toLowerCase() : input)
	if (json.version !== 3) {
		throw new Error('Not a V3 wallet')
	}
	var derivedKey
	var kdfparams
	if (json.crypto.kdf === 'scrypt') {
		kdfparams = json.crypto.kdfparams
		derivedKey = ethUtil.scrypt(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
	} else if (json.crypto.kdf === 'pbkdf2') {
		kdfparams = json.crypto.kdfparams
		if (kdfparams.prf !== 'hmac-sha256') {
			throw new Error('Unsupported parameters to PBKDF2')
		}
		derivedKey = ethUtil.crypto.pbkdf2Sync(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256')
	} else {
		throw new Error('Unsupported key derivation scheme')
	}
	var ciphertext = new Buffer(json.crypto.ciphertext, 'hex')
	var mac = ethUtil.sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
	if (mac.toString('hex') !== json.crypto.mac) {
		throw new Error('Key derivation failed - possibly wrong passphrase')
	}
	var decipher = ethUtil.crypto.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), new Buffer(json.crypto.cipherparams.iv, 'hex'))
	var seed = Wallet.decipherBuffer(decipher, ciphertext, 'hex')
	return new Wallet(seed)
}
Wallet.prototype.toV3String = function(password, opts) {
	return JSON.stringify(this.toV3(password, opts))
}
Wallet.prototype.getV3Filename = function (timestamp) {
  var ts = timestamp ? new Date(timestamp) : new Date()
  return [
    'UTC--',
    ts.toJSON().replace(/:/g, '-'),
    '--',
    this.getAddress().toString('hex')
  ].join('')
}
Wallet.decipherBuffer = function(decipher, data) {
	return Buffer.concat([decipher.update(data), decipher.final()])
}
Wallet.decodeCryptojsSalt = function(input) {
	var ciphertext = new Buffer(input, 'base64')
	if (ciphertext.slice(0, 8).toString() === 'Salted__') {
		return {
			salt: ciphertext.slice(8, 16),
			ciphertext: ciphertext.slice(16)
		}
	} else {
		return {
			ciphertext: ciphertext
		}
	}
}
Wallet.evp_kdf = function(data, salt, opts) {
	// A single EVP iteration, returns `D_i`, where block equlas to `D_(i-1)`

	function iter(block) {
		var hash = ethUtil.crypto.createHash(opts.digest || 'md5')
		hash.update(block)
		hash.update(data)
		hash.update(salt)
		block = hash.digest()
		for (var i = 1; i < (opts.count || 1); i++) {
			hash = ethUtil.crypto.createHash(opts.digest || 'md5')
			hash.update(block)
			block = hash.digest()
		}
		return block
	}
	var keysize = opts.keysize || 16
	var ivsize = opts.ivsize || 16
	var ret = []
	var i = 0
	while (Buffer.concat(ret).length < (keysize + ivsize)) {
		ret[i] = iter((i === 0) ? new Buffer(0) : ret[i - 1])
		i++
	}
	var tmp = Buffer.concat(ret)
	return {
		key: tmp.slice(0, keysize),
		iv: tmp.slice(keysize, keysize + ivsize)
	}
}
Wallet.walletRequirePass = function(ethjson) {
	var jsonArr;
	try {
		jsonArr = JSON.parse(ethjson);
	} catch (err) {
		throw globalFuncs.errorMsgs[3];
	}
	if (jsonArr.encseed != null) return true;
	else if (jsonArr.Crypto != null || jsonArr.crypto != null) return true
	else if (jsonArr.hash != null && jsonArr.locked) return true;
	else if (jsonArr.hash != null && !jsonArr.locked) return false;
    else if (jsonArr.publisher == "MyEtherWallet" && !jsonArr.encrypted) return false;
	else
	throw globalFuncs.errorMsgs[2];
}
Wallet.getWalletFromPrivKeyFile = function(strjson, password) {
	var jsonArr = JSON.parse(strjson);
	if (jsonArr.encseed != null) return Wallet.fromEthSale(strjson, password);
	else if (jsonArr.Crypto != null || jsonArr.crypto != null) return Wallet.fromV3(strjson, password, true);
	else if (jsonArr.hash != null) return Wallet.fromMyEtherWallet(strjson, password);
	else if (jsonArr.publisher == "MyEtherWallet") return Wallet.fromMyEtherWalletV2(strjson);
	else
	throw globalFuncs.errorMsgs[2];
}
module.exports = Wallet;
