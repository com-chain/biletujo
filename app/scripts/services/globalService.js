'use strict';
var globalService = function($http, $httpParamSerializerJQLike) {

    ajaxReq.http = $http;
    ajaxReq.postSerializer = $httpParamSerializerJQLike;
    if (localStorage.getItem('ComChainWallet') == null) {
  var tabs = {
     openFromStorage: {
      id: 0,
      name: "NAV_OpenStorage",
      url: "select",
      mew: true,
      readOnly: true,
      exchangeOffice:true,
      cssClass: "storage"
    },
    generateWallet: {
    id: 1,
      name: "NAV_AddWallet",
      url: "generate",
      mew: true,
      readOnly: false,
      exchangeOffice:false,
      cssClass: "newWall"
    },
    openWallet: {
      id: 2,
      name: "NAV_OpenWallet",
      url: "open",
      mew: true,
      readOnly: true,
      exchangeOffice:true,
      cssClass: "openWall"
    }, 
  
    help1: {
      id: 3,
      name: "NAV_Help",
      url: "aide",
      mew: true,
      readOnly:true,
      exchangeOffice:true,
      cssClass: "help"
    },                                                                                                                                                                                                                                                                                                                                                                                                                                                      
  };
    } else {
  var tabs = {
    viewWalletInfo: {
      id: 0,
      name: "NAV_ViewWallet",
      url: "recieve",
      mew: true,
      readOnly: true,
      exchangeOffice:false,
      cssClass: "recieve"
    },
    send: {
      id: 1,
      name: "NAV_Transaction",
      url: "send",
      mew: true,
      readOnly: false,
      exchangeOffice:false,
      cssClass: "send"
    },
    limites: {
      id: 2, 
      name: "NAV_Limites",
      url: "info",
      mew: true,
      readOnly: false,
      exchangeOffice:false,
      cssClass: "cmpt"
    },
    transactions: {
      id: 3,
      name: "NAV_Transactions",
      url: "transactions",
      mew: true,
      readOnly: false,
      exchangeOffice:false,
      cssClass: "trans"
    },
    
    roAutorizations: {
      id: 4, 
      name: "NAV_roAutor",
      url: "info",
      mew: false,
      readOnly: true,
      exchangeOffice:false,
      cssClass: "glob"
    },
    rotransactions: {
      id: 5,
      name: "NAV_Transactions",
      url: "transactions",
      mew: false,
      readOnly: true,
      exchangeOffice:false,
      cssClass: "trans"
    },
    
    
    
    contacts: {
      id: 6,
      name: "NAV_Contacts",
      url: "contacts",
      mew: true,
      readOnly: true,
      exchangeOffice:false,
      cssClass: "ctc"
    },
     billing: {
      id: 7,
      name: "NAV_Billing",
      url: "billing",
      mew: false,
      readOnly: false,
      exchangeOffice:true,
      cssClass: "bil"
    },
    
    exchange: {
      id: 8,
      name: "NAV_Exchange",
      url: "exchange",
      mew: false,
      readOnly: false,
      exchangeOffice:true,
      cssClass: "exc"
    },
    
    note: {
      id: 9,
      name: "NAV_Note",
      url: "note",
      mew: false,
      readOnly: false,
      exchangeOffice:true,
      cssClass: "not"
    },
    global: {
      id: 10,
      name: "NAV_Global",
      url: "global",
      mew: false,
      readOnly: false,
      exchangeOffice:true,
      cssClass: "glob"
    },
    close: {
      id: 11,
      name: "NAV_Close",
      url: "close",
      mew: true,
      readOnly: true,
      exchangeOffice:true,
      cssClass: "cls"
    },
    help2: {
      id: 12,
      name: "NAV_Help",
      url: "aide",
      mew: true,
      readOnly: true,
      exchangeOffice:true,
      cssClass: "help"
    },
  };
    };
    
  var listeners = [];
  
  var registerNavigate = function(callback){
      listeners.push(callback);
  }
  
  var navigateToPay = function(address){
    listeners.forEach(function(cb) {
          cb(address);
    });
    
    localStorage.setItem('ComChainPayRequest',address); 
  }
  
  var setCurrAddress = function(address_object){
    localStorage.setItem('ComChainPayRequest',JSON.stringify(address_object)); 
  }
  
  var clearCurrAddress = function(){
    
    localStorage.removeItem('ComChainPayRequest');
  }
  
  var getCurrAddress = function(){
    
    return localStorage.getItem('ComChainPayRequest');
  }
  
  var configureNoteTab = function(show){
       if (localStorage.getItem('ComChainWallet') != null) {
         tabs['note'].exchangeOffice=show;  
       }
  }
    
    
  var currentTab = 0;
  if(typeof chrome != 'undefined')
    currentTab = chrome.windows === undefined ? 0 : 3;
  return {
    tabs: tabs,
    currentTab: currentTab,
    registerNavigate:registerNavigate,
    navigateToPay:navigateToPay,
    setCurrAddress:setCurrAddress,
    getCurrAddress:getCurrAddress,
    clearCurrAddress:clearCurrAddress,
    configureNoteTab:configureNoteTab
  };
  
  
  

};
module.exports = globalService;


