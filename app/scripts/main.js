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
window.jsc3l = new Jsc3l(conf_locale)


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

