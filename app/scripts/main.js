'use strict';
var IS_CX = false;
if (typeof chrome != 'undefined') IS_CX = chrome.windows === undefined ? false : true;
var angular = require('angular');
var angularTranslate = require('angular-translate');
var angularTranslateErrorLog = require('angular-translate-handler-log');
var angularSanitize = require('angular-sanitize');
var globalFuncs = require('./globalFuncs');
window.globalFuncs = globalFuncs;
var Jsc3l = require('@com-chain/jsc3l-browser').default


window.jsc3l = new Jsc3l(conf_locale, [
  // First Contract
  {
    setAccountParam: '848b2592:accAddress accStatus accType limitPlus limitMinus',
    pledgeAccount: '6c343eef:accAddress amount *',
    setAllowance: 'd4e12f2e:spenderAddress amount',
    setDelegation: '75741c79:spenderAddress limit',
    setTaxAmount: 'f6f1897d:amount',
    setTaxLegAmount: 'fafaf4c0:amount',
    setTaxAccount: 'd0385b5e:accAddress',
    setOwnerAccount: 'f2fde38b:accAddress',
    setContractStatus: '88b8084f:status',
    setPopo: '88b8084e:amount',
  },
  // Second Contract
  {
    transferNant: 'a5f7c148:toAddress amount *',
    transferCM: '60ca9c4c:toAddress amount *',
    transferOnBehalfNant: '1b6b1ee5:fromAddress toAddress amount D',
    transferOnBehalfCM: '74c421fe:fromAddress toAddress amount D',
    askTransferFrom: '58258353:fromAddress amount',
    askTransferCMFrom: '2ef9ade2:fromAddress amount',
    payRequestNant: '132019f4:toAddress amount *',
    payRequestCM: '1415707c:toAddress amount *',
    rejectRequest: 'af98f757:toAddress',
    dismissAcceptedInfo: 'ccf93c7a:accAddress',
    dismissRejectedInfo: '88759215:accAddress',
  },
  // Third Contract
  {
    setContactHash: "0x14ea14f5:posInt sizeInt hashHex",
    setMemoHash: "166cf727:posInt sizeInt hashHex",
  },
])


var m_is_app=false;
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    m_is_app = device.platform!="browser";
}



window.isApp = function () {
   return m_is_app;
   //return document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
}

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

var walletDecryptDrtv = require('./directives/walletDecryptDrtv');
var blockiesDrtv = require('./directives/blockiesDrtv');
var QRCodeDrtv = require('./directives/QRCodeDrtv');
var fileReaderDrtv = require('./directives/fileReaderDrtv');
var blockedAccountDrtv = require('./directives/blockedAccountDrtv');
var blockedCurrencyDrtv = require('./directives/blockedCurrencyDrtv');
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


app.directive('blockieAddress', blockiesDrtv);
app.directive('qrCode', QRCodeDrtv);
app.directive('onReadFile', fileReaderDrtv);
app.directive('walletDecryptDrtv', walletDecryptDrtv);
app.directive('blockedAccountDrtv', blockedAccountDrtv);
app.directive('blockedCurrencyDrtv', blockedCurrencyDrtv);
app.directive('waitingDrtv', waitingDrtv);

app.controller('tabsCtrl', ['$scope','$attrs','globalService','contactService', '$translate','$compile', 'authenticationService',tabsCtrl]);
app.controller('viewCtrl', ['$scope', 'globalService', '$translate', viewCtrl]);
app.controller('walletGenCtrl', ['$scope', 'globalService','$translate', 'walletService','contactService', walletGenCtrl]);
app.controller('decryptWalletCtrl', ['$scope', '$sce', '$translate', 'walletService', 'contactService', 'memoService', 'authenticationService','globalService', decryptWalletCtrl]);
app.controller('viewWalletCtrl', ['$scope', 'walletService','contactService', '$translate', viewWalletCtrl]);
app.controller('sendCtrl', ['$scope','$locale', '$sce', 'walletService','contactService','globalService', '$translate', sendCtrl]);
app.controller('balanceCtrl', ['$scope','$locale', '$sce', 'walletService','contactService','consultService', '$translate', balanceCtrl]);
app.controller('billingCtrl', ['$scope','$locale', '$sce', 'walletService', '$translate', billingCtrl]);
app.controller('noteCtrl', ['$scope','$locale', '$sce', 'walletService', '$translate', noteCtrl]);
app.controller('exchangeCtrl', ['$scope','$locale', '$sce', 'walletService', '$translate', exchangeCtrl]);
app.controller('globalCtrl', ['$scope','$locale', '$sce', 'walletService', '$translate', globalCtrl]);
app.controller('contactsCtrl', ['$scope', '$sce', 'walletService','contactService','globalService', '$translate', contactsCtrl]);
app.controller('storageCtrl', ['$scope', '$sce', 'walletService','contactService', '$translate', storageCtrl]);

app.controller('readonlytransactionsCtrl', ['$scope','$locale', '$sce', 'walletService','contactService', 'consultService','memoService', '$translate','$filter', readonlytransactionsCtrl]);

