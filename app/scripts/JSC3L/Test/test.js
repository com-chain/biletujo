
var BigNumber = require('bignumber.js'); //npm install bignumber.js@2.4.0
window.BigNumber = BigNumber;

var ethUtil = require('ethereumjs-util'); 
ethUtil.crypto = require('crypto'); 
ethUtil.Tx = require('ethereumjs-tx');   ///npm install ethereumjs-tx@1.1.2
ethUtil.scrypt = require('scryptsy');
ethUtil.uuid = require('uuid');
ethUtil.sha3 = require('sha3');
ethUtil.EC = require('elliptic').ec;
window.ethUtil = ethUtil;

var blockies = require('../blockies');
window.blockies = blockies;

var Wallet = require('../myetherwallet');
window.Wallet = Wallet;
var uiFuncs = require('../uiFuncs');
window.uiFuncs = uiFuncs;
var etherUnits = require('../etherUnits');
window.etherUnits = etherUnits;
var ajaxReq = require('../ajaxReq');
window.ajaxReq = ajaxReq;
var ethFuncs = require('../ethFuncs');
window.ethFuncs = ethFuncs;
var jsc3l_config = require('../jsc3l_config');
window.jsc3l_config = jsc3l_config;
var jsc3l_connection = require('../jsc3l_connection');
window.jsc3l_connection = jsc3l_connection;
var jsc3l_customization = require('../jsc3l_customization');
window.jsc3l_customization = jsc3l_customization;
var jsc3l_bcRead = require('../jsc3l_bcRead');
window.jsc3l_bcRead = jsc3l_bcRead;
var jsc3l_message = require('../jsc3l_message');
window.jsc3l_message = jsc3l_message;
var jsc3l_wallet = require('../jsc3l_wallet');
window.jsc3l_wallet = jsc3l_wallet;
var jsc3l_bcTransaction = require('../jsc3l_bcTransaction');
window.jsc3l_bcTransaction = jsc3l_bcTransaction;


