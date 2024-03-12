'use strict';
var helpCtrl = function($scope, $sce, $translate) {
    
    // Check the environment
    $scope.isApp = isApp();
    $scope.has_CGU = jsc3l.customization.getCondUrl()!="";
   
    
    globalFuncs.hideLoadingWaiting();
    
    $scope.gelLanguageCode = function(){
        var lang = localStorage.getItem('language');
        if (lang == null) return 'fr';
        lang = JSON.parse(lang);
        return lang.key;
    }
    
    $scope.openCC = function () {window.open("https://com-chain.org/");}
    $scope.openML = function () {window.open("https://monnaie-leman.org/");}
    
    $scope.openCGU = function () {window.open( jsc3l.customization.getCondUrl().replace('LANG',$scope.gelLanguageCode()), "_system");}
    $scope.openPC = function () { window.open("https://com-chain.org/PC.html");}
    
    $scope.openHelp = function () {
        let help = jsc3l.customization.getHelpUrl().replace('LANG',$scope.gelLanguageCode());
        if (help=='') {
            help = "https://com-chain.org/help.html";
        }
        window.open(help, "_system");
    } 
    
    

    
    
    
    
    
    
  
    
	
};
module.exports = helpCtrl;


