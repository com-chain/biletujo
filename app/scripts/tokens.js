'use strict';
var Token = function(contractAddress, userAddress, symbol, decimal) {
	this.contractAddress = contractAddress;
	this.userAddress = userAddress
	this.symbol = symbol;;
	this.decimal = decimal;
	this.setBalance();
    this.balance = "loading";
}
Token.balanceHex = "0x70a08231";
Token.transferHex = "0xa9059cbb";

Token.prototype.getContractAddress = function() {
	return this.contractAddress;
}
Token.prototype.getUserAddress = function() {
	return this.userAddress;
}
Token.prototype.getSymbol = function() {
	return this.symbol;
}
Token.prototype.getDecimal = function() {
	return this.decimal;
}
Token.prototype.getBalance = function() {
	return this.balance;
}
Token.prototype.getBalanceBN = function() {
	return this.balanceBN;
}
Token.prototype.setBalance = function() {
	var balanceCall = jsc3l.ethFuncs.getDataObj(this.contractAddress, Token.balanceHex, [jsc3l.ethFuncs.getNakedAddress(this.userAddress)]);
	var parentObj = this;
    jsc3l.ajaxReq.getEthCall(balanceCall).then(function(data) {
		if (!data.error) {
			parentObj.balance = new BigNumber(data.data).div(new BigNumber(10).pow(parentObj.getDecimal())).toString();
			parentObj.balanceBN = new BigNumber(data.data).toString();
		}
    });
}
Token.prototype.getData = function(toAdd, value) {
	try {
		if (!jsc3l.ethFuncs.validateEtherAddress(toAdd)) throw 'ERROR_6';
		else if (!globalFuncs.isNumeric(value) || parseFloat(value) < 0) throw 'ERROR_8';
		var value = jsc3l.ethFuncs.padLeft(new BigNumber(value).times(new BigNumber(10).pow(this.getDecimal())).toString(16), 64);
		var toAdd = jsc3l.ethFuncs.padLeft(jsc3l.ethFuncs.getNakedAddress(toAdd), 64);
		var data = Token.transferHex + toAdd + value;
		return {
			isError: false,
			data: data
		};
	} catch (e) {
		return {
			isError: true,
			error: e
		};
	}
}
module.exports = Token;
