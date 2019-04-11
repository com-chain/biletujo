'use strict';
var blockedAccountDrtv = function() {
	return {
        restrict : "E",
        template : '<section class="row" ng-show="is_locked" >\n\
                        <div class="col-md-12 totBal grp" translate="Acc_locked" >\n\
                        </div>\n\
                    </section>'
  };
};
module.exports = blockedAccountDrtv;
