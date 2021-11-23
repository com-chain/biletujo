'use strict';
var blockiesDrtv = function() {
	return function(scope, element, attrs){
	   var watchVar = attrs.watchVar;
        scope.$watch(watchVar, function() {
            var address = attrs.blockieAddress;
            var img_id = attrs.img;
            
             var img_add =img_id==1 ? 'images/lem.png' : 'images/qrclick.png';
             
             element.css({'background-image': 'url(${jsc3l.customization.getCurrencyAssetBaseUrl()}/' + img_add +')' });
                
             if(jsc3l.ethFuncs.validateEtherAddress(address)){
                   element.css({'background-image': 'url(' + globalFuncs.getBlockie(address) +')' });
             }
           
        });
    };
};
module.exports = blockiesDrtv;
