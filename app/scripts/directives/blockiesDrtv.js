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
                 const base_url = jsc3l.customization.getCurrencyAssetBaseUrl();
                 // Protect against early load (when the customization is not ready) by falling back on the local CSS
                 if (!base_url.startsWith('undefined')) {
                    element.css({'background-image': 'url(' + base_url +'/' + img_add +')' });
                 }
             }
        });
    };
};
module.exports = blockiesDrtv;
