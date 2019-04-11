'use strict';
var walletDecryptDrtv = function() {
	return {
        restrict : "E",
        template : '<div ng-controller=\'decryptWalletCtrl\' > <div ng-hide=\'hideWalletSelector\'>\n\
                      <section class="row"  >\n \
                       <div class=" col-md-12">\n \
                        <div class="row grp"> \n \
                         <div class="col-md-12 ">\n \
                          <div class="row "> \n \
                           <div class="col-md-12 " align="center">\n \
                            <div class="identiconWrapper" style="max-width:60px;">\n \
                             <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="0x{{currWallet.address}}"  watch-var="wal" ></div>\n \
                            </div>\n \
                           </div>\n \
                           <div class="col-md-12 " align="center">\n \
                             {{currWallet.name}}\n\
                           </div>\n \
                          </div>\n \
                          <div class="row " ng-hide="hasServerAddress">\n\
                            <div class="col-md-12 ">\n \
                             <label translate="DCRY_Missing_server"> The wallet is missing a server link </label>\n \
                            </div>\n \
                          </div>\n \
                           <div class="row" ng-if="isApp" ng-hide="hasServerAddress"> \n \
                            <div class="col-md-12 "> \n \
                             <a class="btn btn-primary btn-block btnAction" ng-click="startScanToken()" translate="GEN_Scan">QR</a>\n \
                            </div>\n \
                           </div>\n \
                           <div class="row" ng-if="isApp" ng-hide="hasServerAddress"> \n \
                            <div class="col-md-12 "> \n \
                             &nbsp;\n \
                            </div>\n \
                           </div>\n \
                           <div class="row" ng-hide="hasServerAddress"> \n \
                            <div class="col-md-12 "> \n \
                             <input class="form-control" type="text" value={{token}} id="enr_tk2"/><br/>\n \
                            </div>\n \
                           </div>\n \
                           <div class="row" ng-hide="hasServerAddress"> \n \
                            <div class="col-md-12 "> \n \
                             <a class="btn btn-primary btn-block btnAction"  ng-click="validateToken()" translate="GEN_Token_validation">Token</a>\n \
                            </div>\n \
                             <div class="col-md-12 "> \n \
                             <p ng-bind-html="message_creation"></p> \n \
                            </div>\n \
                           </div>\n \
                          <div class="row "  ng-show="hasServerAddress"> \n \
                           <div class="col-md-12 ">\n \
                             <label translate="DCRY_Enter_psw"> Entrez votre mot de passe: </label>\n \
                           </div>\n \
                          </div>\n \
                          <div class="row " ng-show="hasServerAddress"> \n \
                           <div class="col-md-12 ">\n \
                             <input class="form-control" type="password" placeholder="{{ \'DCRY_Placeholder_psw\' | translate }}" id="passwdField" ng-model="$parent.$parent.filePassword" ng-change="onFilePassChange()" onkeypress=" if(event.keyCode == 13){document.getElementById(\'openBtn\').click();}" />\n \
                           </div>\n \
                          </div>\n \
                          <div class="row " ng-show="hasServerAddress" > \n \
                           <div class="col-md-12 ">\n \
                             &nbsp;\n \
                           </div>\n \
                          </div>\n \
                          <div class="row " ng-show="hasServerAddress"> \n \
                           <div class="col-md-12 ">\n \
                             <a class="btn btn-primary btn-block btnAction" id="openBtn" ng-click="decryptWallet()" translate="DCRY_OK"> OK </a>\n \
                             <div ng-bind-html="decryptStatus"></div>\n \
                           </div>\n \
                          </div>\n \
                         </div>\n \
                        </div>\n \
                        <div class="row grp"> \n \
                         <div class="col-md-12 ">\n \
                          <div class="row "> \n \
                           <div class="col-md-12 ">\n \
                            <label translate="DCRY_Close_title" > Fermer le portefeuille pour en changer:</label>\n \
                           </div>\n \
                          </div>\n \
                          <div class="row "> \n \
                           <div class="col-md-12 ">\n \
                             &nbsp;\n \
                           </div>\n \
                          </div>\n \
                          <div class="row "> \n \
                           <div class="col-md-12 ">\n \
                             <a class="btn btn-primary btn-block btnAction"  id="forgetWalletBtn" ng-click="confirmForgetWallet()" translate="DCRY_Close_btn"> Changer de portefeuille </a>\n \
                           </div>\n \
                          </div>\n \
                         </div>\n \
                        </div>\n \
                       </div>\n \
                         <div class="modal fade" id="setApiNode" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">\n \
                              <div class="modal-dialog" role="document">\n \
                                  <div class="modal-content"> \n \
                                      <div class="modal-header">\n \
                                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n \
                                      </div>\n \
                                      <div class="modal-body">\n \
                                          <h4 align="center">\n \
                                           <label >Force the use of a specific API node:</label>\n \
                                           <input type="text" ng-model="api"/><br/>\n \
                                          </h4>\n \
                                      </div>\n \
                                      <div class="modal-footer text-center">\n \
                                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="CTC_editNameCancel">Annuler </button>\n \
                                          <button type="button" class="btn btn-primary" ng-click="setAPINode()" >Use API Node</button>\n \
                                      </div>\n \
                                  </div>\n \
                              </div>\n \
                        </div>\n \
                      </section>\n\
                   </div>'
  };
};
module.exports = walletDecryptDrtv;

