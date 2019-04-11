'use strict';
var blockiesDrtv = function() {
	return function(scope, element, attrs){
	   var watchVar = attrs.watchVar;
        scope.$watch(watchVar, function() {
            var address = attrs.blockieAddress;
            var img_id = attrs.img;
            
             var img_add =img_id==1 ? 'images/lem.png' : 'images/qrclick.png';
             if (globalFuncs.isMulti()){
               var the_arr = globalFuncs.getCssUrl().split('/');
                the_arr.pop();
                the_arr.pop();
                if (img_id==1){
                 img_add = the_arr.join('/')+"/images/lem.png";  
                } else {
                    img_add = the_arr.join('/')+"/images/qrclick.png";  
                }
             }
             element.css({'background-image': 'url(' + img_add +')' });
                
             if(ethFuncs.validateEtherAddress(address)){
                   element.css({'background-image': 'url(' + globalFuncs.getBlockie(address) +')' });
             }
           
        });
    };
};
module.exports = blockiesDrtv;
