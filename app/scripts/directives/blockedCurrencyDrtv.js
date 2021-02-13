'use strict';
var blockedCurrencyDrtv = function() {
	return {
        restrict : "E",
        template : '<section class="row" ng-show="is_curr_locked" >\n\
                        <div class="col-md-12 totBal grp" translate="CURR_locked" >\n\
                        </div>\n\
                    </section>'
  };
};
module.exports = blockedCurrencyDrtv;
