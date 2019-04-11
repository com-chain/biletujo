'use strict';
var waitingDrtv = function() {
	return {
        restrict : "E",
        template : ' <div class="glassPane" ng-hide="ready"> </div> \n\
                     <div class="waitingMsg" ng-hide="ready "> \n\
                       <span ng-hide="waiting_tran" translate="GP_Wait"></span> \n\
                       <span ng-show="waiting_tran" ng-bind-html="trans_message"></span>\n\
                       <button type="button" ng-hide="waiting_tran"class="btn btn-primary bellowmargin" \n\
                                onclick="location.reload();" translate="TRA_Refresh">Refresh </button> \n\
                       <button type="button" ng-show="waiting_tran" class="btn btn-primary bellowmargin" \n\
                                ng-click="dismissWaiting()" translate="TRA_Refresh">Refresh </button> \n\
                       <div class="waiting_tran" ng-show="waiting_tran"> \n\
                          <svg class="wt_svg"  width="300" height="300"  \n\
                               viewPort="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg"> \n\
                             <circle id="c1" r="75" cx="150" cy="150"/>\n\
                             <circle id="c2" r="65" cx="150" cy="150"/>\n\
                             <circle id="c3" r="40" cx="150" cy="150"/>\n\
                         </svg>\n\
                      </div>\n\
                    </div>'
  };
};
module.exports = waitingDrtv;
