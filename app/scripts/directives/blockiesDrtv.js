'use strict';
var blockiesDrtv = function() {
	return function(scope, element, attrs){
	   var watchVar = attrs.watchVar;
        scope.$watch(watchVar, function() {
             const address = attrs.blockieAddress;
             if(jsc3l.ethFuncs.validateEtherAddress(address)){
                 element.css({'background-image': 'url(' + globalFuncs.getBlockie(address) +')' });
             } else {
                 const img_add =attrs.img==1 ? 'images/lem.png' : 'images/qrclick.png';
                 var baseUrl
                 try {
                   baseUrl = jsc3l.customization.getCurrencyAssetBaseUrl()
                 } catch(e) {
                   return
                 }
                 element.css({'background-image': 'url(' + baseUrl +'/' + img_add +')' });
             }
        });
    };
};
module.exports = blockiesDrtv;
