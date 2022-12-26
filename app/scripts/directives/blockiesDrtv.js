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
                 element.css({'background-image': 'url(' + jsc3l.customization.getCurrencyAssetBaseUrl() +'/' + img_add +')' });
             }
        });
    };
};
module.exports = blockiesDrtv;
