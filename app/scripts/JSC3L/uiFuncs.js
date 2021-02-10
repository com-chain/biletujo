'use strict';
var uiFuncs = function() {}

var isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

uiFuncs.isTxDataValid = function(txData) {
	if (txData.to != "0xCONTRACT" && !ethFuncs.validateEtherAddress(txData.to)) throw 'ERROR_6';
	else if (!isNumeric(txData.value) || parseFloat(txData.value) < 0) throw 'ERROR_8';
	else if (!isNumeric(txData.gasLimit) || parseFloat(txData.gasLimit) <= 0) throw 'ERROR_9';
	else if (!ethFuncs.validateHexString(txData.data)) throw 'ERROR_10';
	if (txData.to == "0xCONTRACT") txData.to = '';
}

uiFuncs.generateTx = function(txData, callback) {
	try {
		uiFuncs.isTxDataValid(txData);
		ajaxReq.getTransactionData(txData.from, function(data) {
			if (data.error) throw data.msg;
			data = data.data;
			var rawTx = {
				nonce: ethFuncs.sanitizeHex(data.nonce),
				gasPrice: ethFuncs.sanitizeHex(ethFuncs.addTinyMoreToGas(data.gasprice)),
				gasLimit: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(txData.gasLimit)),
				to: ethFuncs.sanitizeHex(txData.to),
				value: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(etherUnits.toWei(txData.value, txData.unit))),
				data: ethFuncs.sanitizeHex(txData.data)
			}
			var eTx = new ethUtil.Tx(rawTx);
            
            
			eTx.sign(new Buffer(txData.key, 'hex'));
			rawTx.rawTx = JSON.stringify(rawTx);
			rawTx.signedTx = '0x' + eTx.serialize().toString('hex');
			rawTx.isError = false;
			if (callback !== undefined) callback(rawTx);
		});
	} catch (e) {
		if (callback !== undefined) callback({
			isError: true,
			error: e
		});
	}
}


uiFuncs.sendTx = function(signedTx, additional_data, callback) {
	ajaxReq.sendRawTx(signedTx, additional_data, function(data) {
		var resp = {};
		if (data.error) {
			resp = {
				isError: true,
				error: data.msg
			};
		} else {
			resp = {
				isError: false,
				data: data.data
			};
		}
		if (callback !== undefined) callback(resp);
	});
}

module.exports = uiFuncs;
