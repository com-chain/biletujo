'use strict';
var Token = function(contractAddress, userAddress, symbol, decimal) {
	this.contractAddress = contractAddress;
	this.userAddress = userAddress
	this.symbol = symbol;;
	this.decimal = decimal;
    this.balance = "loading";
	this.setBalance();
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
Token.prototype.setBalance = async function() {
	var balanceCall = jsc3l.ethFuncs.getDataObj(this.contractAddress, Token.balanceHex, [jsc3l.ethFuncs.getNakedAddress(this.userAddress)]);
	var parentObj = this;
    let data
    try {
      data = await jsc3l.ajaxReq.getEthCall(balanceCall)
    } catch(err) {
      console.log("Ignored Exception", err)
      return;
    }
			parentObj.balance = new BigNumber(data).div(new BigNumber(10).pow(parentObj.getDecimal())).toString();
			parentObj.balanceBN = new BigNumber(data).toString();
}
module.exports = Token;
