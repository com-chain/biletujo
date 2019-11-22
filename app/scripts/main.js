'use strict';
var IS_CX = false;
if (typeof chrome != 'undefined') IS_CX = chrome.windows === undefined ? false : true;
require("babel-polyfill");
var angular = require('angular');
var angularTranslate = require('angular-translate');
var angularTranslateErrorLog = require('angular-translate-handler-log');
var angularSanitize = require('angular-sanitize');
var BigNumber = require('bignumber.js');
window.BigNumber = BigNumber;
var marked = require('./customMarked');
window.marked = marked;
var ethUtil = require('ethereumjs-util');
ethUtil.crypto = require('crypto');
ethUtil.Tx = require('ethereumjs-tx');
ethUtil.scrypt = require('scryptsy');
ethUtil.uuid = require('uuid');
ethUtil.EC = require('elliptic').ec;
window.ethUtil = ethUtil;
var Wallet = require('./myetherwallet');
window.Wallet = Wallet;
var Token = require('./tokens');
window.Token = Token;
var globalFuncs = require('./globalFuncs');
window.globalFuncs = globalFuncs;
var uiFuncs = require('./uiFuncs');
window.uiFuncs = uiFuncs;
var etherUnits = require('./etherUnits');
window.etherUnits = etherUnits;
var ajaxReq = require('./ajaxReq');
window.ajaxReq = ajaxReq;
var ethFuncs = require('./ethFuncs');
window.ethFuncs = ethFuncs;
var translate = require('./translations/translate.js');


require('./angular-local-storage');


var tabsCtrl = require('./controllers/tabsCtrl');
var viewCtrl = require('./controllers/viewCtrl');
var walletGenCtrl = require('./controllers/walletGenCtrl');
var decryptWalletCtrl = require('./controllers/decryptWalletCtrl');
var viewWalletCtrl = require('./controllers/viewWalletCtrl');
var sendCtrl = require('./controllers/sendCtrl');
var balanceCtrl = require('./controllers/balanceCtrl');
var readonlytransactionsCtrl = require('./controllers/readonlytransactionsCtrl');
var contactsCtrl = require('./controllers/contactsCtrl');
var storageCtrl = require('./controllers/storageCtrl');
var exchangeCtrl = require('./controllers/exchangeCtrl');
var billingCtrl = require('./controllers/billingCtrl');
var noteCtrl = require('./controllers/noteCtrl');
var globalCtrl = require('./controllers/globalCtrl');
var consultRightCtrl = require('./controllers/consultRightCtrl');




var globalService = require('./services/globalService');
var walletService = require('./services/walletService');
var contactService = require('./services/contactService');
var memoService = require('./services/memoService');
var consultService = require('./services/consultService');
var authenticationService = require('./services/authenticationService');
var messageService = require('./services/messageService');

var walletDecryptDrtv = require('./directives/walletDecryptDrtv');
var blockiesDrtv = require('./directives/blockiesDrtv');
var QRCodeDrtv = require('./directives/QRCodeDrtv');
var fileReaderDrtv = require('./directives/fileReaderDrtv');
var blockedAccountDrtv = require('./directives/blockedAccountDrtv');
var waitingDrtv = require('./directives/waitingDrtv');

var app = angular.module('mewApp', ['pascalprecht.translate', 'ngSanitize']);
app.config(['$compileProvider', function($compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|https|):/);
}]);
app.config(['$translateProvider', function($translateProvider) {
    $translateProvider.useMissingTranslationHandlerLog();
	new translate($translateProvider);
}]);
app.factory('globalService', ['$http', '$httpParamSerializerJQLike', globalService]);
app.factory('walletService', walletService);
app.factory('contactService', contactService);
app.factory('memoService', memoService);
app.factory('consultService', consultService);
app.factory('authenticationService', authenticationService);
app.factory('messageService', messageService);


app.directive('blockieAddress', blockiesDrtv);
app.directive('qrCode', QRCodeDrtv);
app.directive('onReadFile', fileReaderDrtv);
app.directive('walletDecryptDrtv', walletDecryptDrtv);
app.directive('blockedAccountDrtv', blockedAccountDrtv);
app.directive('waitingDrtv', waitingDrtv);

app.controller('tabsCtrl', ['$scope','$attrs','globalService','contactService', '$translate','$compile', 'authenticationService',tabsCtrl]);
app.controller('viewCtrl', ['$scope', 'globalService', '$translate', viewCtrl]);
app.controller('walletGenCtrl', ['$scope', 'globalService','$translate', 'walletService','contactService', walletGenCtrl]);
app.controller('decryptWalletCtrl', ['$scope', '$sce', '$translate', 'walletService', 'contactService', 'memoService', 'authenticationService','globalService', decryptWalletCtrl]);
app.controller('viewWalletCtrl', ['$scope', 'walletService','contactService', '$translate', viewWalletCtrl]);
app.controller('sendCtrl', ['$scope','$locale', '$sce', 'walletService','contactService','messageService','globalService', '$translate', sendCtrl]);
app.controller('balanceCtrl', ['$scope','$locale', '$sce', 'walletService','contactService','consultService', '$translate', balanceCtrl]);
app.controller('billingCtrl', ['$scope','$locale', '$sce', 'walletService', '$translate', billingCtrl]);
app.controller('noteCtrl', ['$scope','$locale', '$sce', 'walletService', '$translate', noteCtrl]);
app.controller('exchangeCtrl', ['$scope','$locale', '$sce', 'walletService', '$translate', exchangeCtrl]);
app.controller('globalCtrl', ['$scope','$locale', '$sce', 'walletService', '$translate', globalCtrl]);
app.controller('contactsCtrl', ['$scope', '$sce', 'walletService','contactService','globalService', '$translate', contactsCtrl]);
app.controller('storageCtrl', ['$scope', '$sce', 'walletService','contactService', '$translate', storageCtrl]);

app.controller('readonlytransactionsCtrl', ['$scope','$locale', '$sce', 'walletService','contactService', 'consultService','memoService', '$translate','$filter', readonlytransactionsCtrl]);

