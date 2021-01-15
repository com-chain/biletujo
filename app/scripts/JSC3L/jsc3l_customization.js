'use strict';

///
//
// Pre-requisite: the variable conf_locale should store an object with at least the following infos:
// conf_locale.server.lang
// conf_locale.server.notes
// conf_locale.server.url_Css
///


var jsc3l_customization = function() {}

///
// [High level] Get the configuration for a given currency, store it in the locale storage 'ComChainServerConf'
///
jsc3l_customization.getConfJSON = function(name, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', localStorage.getItem('ComChainRepo')+ jsc3l_config.configRepo+'/' +name+'.json'+'?_=' + new Date().getTime(), true); //
    xhr.responseType = 'json';
    xhr.onreadystatechange = function (oEvent) {  
      if (xhr.readyState === 4) {  
        if (xhr.status === 200) { 
          try{
             var to_push = xhr.response;
                    if(typeof to_push =='object')
                    {
                        to_push = JSON.stringify(xhr.response);
                    }  
              
            localStorage.setItem('ComChainServerConf',to_push); 
            callback(true);
          } catch(e){
            callback(false);  
          }  
        } else {  
           callback(false);
        }  
      }  
    }; 
    xhr.send();
}

///
// [High level] Get the individual configuration
///

 
jsc3l_customization.isApp = function(){
     return document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
}

jsc3l_customization.getEndpointAddress = function(){
    try{
        return localStorage.getItem('ComChainAPI');
    } catch(e){
        return '';
    }
}

jsc3l_customization.getCurencyName = function(){
    return getServerConfig('name');  
}

jsc3l_customization.getContract1 = function(){
    return getServerConfig('contract_1');  
}

jsc3l_customization.getContract2 = function(){
    return getServerConfig('contract_2');  
}

jsc3l_customization.getContract3 = function(){
    return getServerConfig('contract_3');  
}

jsc3l_customization.getHelpUrl = function(){
    return getServerConfig('url_help');  
}

jsc3l_customization.getCondUrl = function(){
    return getServerConfig('url_cond');  
}

jsc3l_customization.getUnlockUrl = function(){
    return getServerConfig('url_unlock');  
}


jsc3l_customization.getHowToUrl = function(){
    return getServerConfig('url_howto');  
}

jsc3l_customization.getWalletAddress = function(){
    return getServerConfig('address');  
}

jsc3l_customization.getCreationMessage = function(){
    return getServerConfig('creat_message');  
}

jsc3l_customization.getLang = function(){
    var lang = getServerConfig('lang');  
    if (lang==undefined || lang=="") {
        lang = conf_locale.server.lang;
    }
    return lang;
}

jsc3l_customization.getNoteValues = function(){
    var notes = getServerConfig('notes');  
    if (notes==undefined || notes=="") {
        notes = conf_locale.server.notes;
    }
    return notes;
}

jsc3l_customization.hasBn = function(){
    var notes = jsc3l_customization.getNoteValues();
    return notes!=undefined && notes.length>0;
}

jsc3l_customization.hasBnCheck = function(){
    return jsc3l_customization.isApp() && jsc3l_customization.hasBn();
}


jsc3l_customization.getCssUrl = function(){  
    try{
        return localStorage.getItem('ComChainRepo') + jsc3l_config.custoRepo + jsc3l_customization.getCurencyName() + '/css/etherwallet-master.min.css';
    } catch(e){
        return conf_locale.server.url_Css;
    }  
}

jsc3l_customization.getCurrencyLogoUrl = function(currency_name){
   if (currency_name){
        try{
            return localStorage.getItem('ComChainRepo') + jsc3l_config.custoRepo + currency_name + '/images/lem.png';
        } catch(e){
            return '';
        } 
   }
}


jsc3l_customization.hasNant = function(){
    return getServerConfigSwitch('nant', false); 
}

jsc3l_customization.hasCM = function(){
    return getServerConfigSwitch('CM', false); 
}

jsc3l_customization.hasAutor = function(){
    return getServerConfigSwitch('autor', false); 
}

jsc3l_customization.hasDeleg = function(){
    return getServerConfigSwitch('deleg', false); 
}

jsc3l_customization.hasPayRequest = function(){
    return getServerConfigSwitch('payReq', false); 
}

jsc3l_customization.passwordAutocomplete = function(){
    var number = 10000;
    try{
        var config =  JSON.parse(localStorage.getItem('ComChainServerConf')).server;
        if (config['passwordAutocomplete'] && config['passwordAutocomplete']>0){
            number = config['passwordAutocomplete'];
        }
    } catch(e){
        
    } 
    return number;
}

////////////////////////////////////////////////////////////////////////////////
 jsc3l_customization.updateCss = function(){
        // replace the CSS references into the DOM
        var oldlink = document.getElementsByTagName("link").item(0);
        var newlink = document.createElement("link");
        newlink.setAttribute("rel", "stylesheet");
        newlink.setAttribute("type", "text/css");
        newlink.setAttribute("href", jsc3l_customization.getCssUrl());
        document.getElementsByTagName("head").item(0).appendChild(newlink);
    }
    
    
jsc3l_customization.getCurrencies = function(){
    return getServerConfig('currencies');   
}
    
   
jsc3l_customization.configureCurrency=function(){
      if (jsc3l_customization.getEndpointAddress()!=''){
        jsc3l_customization.updateCss(); 
      }
    }
   




////////////////////////////////////////////////////////////////////////////////

var getServerConfig = function(config_name) {
    try{
        return  JSON.parse(localStorage.getItem('ComChainServerConf')).server[config_name];
    } catch(e){
        return '';
    }
}

var getServerConfigSwitch = function(config_name, default_value) {
    try{
        return  JSON.parse(localStorage.getItem('ComChainServerConf')).server[config_name].toString().toLowerCase()=='true';
    } catch(e){
        return default_value; 
    }
}


////////////////////////////////////////////////////////////////////////////////

module.exports = jsc3l_customization;

