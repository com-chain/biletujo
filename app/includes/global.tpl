<!-- Action on another Account-->
<div class="tab-pane active" ng-if="globalService.currentTab==globalService.tabs.global.id">
  <div>
    <wallet-decrypt-drtv></wallet-decrypt-drtv>
  </div>
       
  <div ng-show="wallet!=null" ng-controller='globalCtrl'>
     <section class="row" ng-hide="is_owner" >
          <div class="col-md-12 ">
              <div class="row grp"> 
                 <div class="col-md-12 ">
                     <label translate="GLB_Not_owner" >Not Owner</label>
                  </div>
              </div>
          </div>
      </section>  
      <section class="row" ng-show="is_owner">
          <div class="col-md-12 ">
             <div class="row grp"> 
                 <div class="col-md-12 ">
                     <label translate="GLB_tot_p" >Total Amount :</label>
                  </div>
                  
                   <div  class="col-md-12 " >
                        {{total_amount}}&nbsp;{{CUR_nanti}} </span>

                  </div> 
              </div>
          
          
              <div class="row grp"> 
                 <div class="col-md-6 col-xs-6">
                     <label >Fonte :</label>
                  </div>
                   <div  class="col-md-6 col-xs-6">
                    <a class="btn btn-primary btn-block" ng-click="melt()" >Fondre de {{fonte}} %</a>
                   </div>
                  <div class="col-md-12 ">
                  <br/>
                    <div ng-bind-html="validateStatus"></div>
                  </div>
                  
                  <div  class="col-md-12 " >
                        <span > Lors d\'un transfert depuis un partenaire vers un employ&eacute:</span>

                  </div> 
                  <div  class="col-md-6 col-xs-6 text-primary">
                         Taux transf&eacute;r&eacute; :{{transfert_employe}} % </span>

                  </div>
                  <div   class="col-md-6 col-xs-6">
                    <a class="btn btn-primary btn-block" ng-click="updateRateE()">Modifier le taux </a>
                  </div>
                  
                    <div  class="col-md-12 " >
                        <span > Lors d\'un transfert depuis un partenaire vers une association;</span>

                  </div> 
                  
              
                  <div  class="col-md-6 col-xs-6 text-primary">
                         taux transf&eacute;r&eacute; :{{transfert_asso}} % </span>

                  </div>
                  <div  class="col-md-6 col-xs-6">
                    <a class="btn btn-primary btn-block" ng-click="updateRateA()" >Modifier le taux </a>
                  </div>
                  
                 <br/>
          
                 <div  class="col-md-12 " >
                        <span > Taux de fonte (mensuel):</span>

                  </div> 
                    <div  class="col-md-6 col-xs-6 text-primary">
                         {{fonte}} % </span>

                  </div>
                  <div   class="col-md-6 col-xs-6">
                    <a class="btn btn-primary btn-block" ng-click="updateRateF()">Modifier le taux </a>
                  </div>
                
                                      
              </div>
              
              <div class="row grp"> 
                 <div class="col-md-12 ">
                     <label translate="GLB_Ownership" >Ownership :</label>
                  </div>
                  
                  <div  class="col-md-6 col-xs-6">
                        <div class="identiconWrapper" style="max-width:100px;" >
                                    <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="{{owner_account}}"  
                                        watch-var="owner_account" ">
                                    </div>
                         </div>
                         <textarea cols="9" rows="5" class="adrtxt" disabled>{{owner_account}} </textarea>

                  </div>
                       <div  class="col-md-6 col-xs-6">
                    <a class="btn btn-primary btn-block" ng-click="updateOwnAcc()" translate="GLB_update_Own_acc">Refresh </a>
                  </div>
              </div>
              
          </div>
      </section> 
       
     <!-- Confrim Rate E -->
     <div class="modal fade" id="confRateE" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <h4 align="center">
                           <p><label >Modifier le taux transf&eacute;r&eacute; transfert depuis un partenaire vers un employ&eacute; </label></p>
                           <p> <span  >Nouveaux Taux</span> <span class="text-primary"> 
                                   <input class="form-control" type="text" placeholder="0" ng-model="new_rate_E_amount"/>  
                                   % </span>
                            </p>
                             
                          </h4>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="GLB_cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="confirmRateE()" translate="GLB_confirm" ng-show="new_rate_E_amount >= 0" >Sauver</button>
                      </div>
                  </div>
              </div>
       </div> 
       
       <!-- Confrim Rate A -->
     <div class="modal fade" id="confRateA" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <h4 align="center">
                           <p><label >Modifier le taux transf&eacute;r&eacute; transfert depuis un partenaire vers une association </label></p>
                           <p> <span  >Nouveaux Taux</span> <span class="text-primary"> 
                                   <input class="form-control" type="text" placeholder="0" ng-model="new_rate_A_amount"/>  
                                   % </span>
                            </p>
                             
                          </h4>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="GLB_cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="confirmRateA()" translate="GLB_confirm" ng-show="new_rate_A_amount >= 0" >Sauver</button>
                      </div>
                  </div>
              </div>
       </div> 
       
     <!-- Confrim Rate F -->
     <div class="modal fade" id="confRateF" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <h4 align="center">
                           <p><label >Modifier le taux de fonte </label></p>
                           <p> <span  >Nouveaux Taux</span> <span class="text-primary"> 
                                   <input class="form-control" type="text" placeholder="0" ng-model="new_rate_F_amount"/>  
                                   % </span>
                            </p>
                             
                          </h4>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="GLB_cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="confirmRateF()" translate="GLB_confirm" ng-show="new_rate_F_amount >= 0" >Sauver</button>
                      </div>
                  </div>
              </div>
       </div> 
       
       <!-- Confrim Melting -->
     <div class="modal fade" id="confMelt" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <h4 align="center">
                           <p><label >Appliquer la fonte </label></p>
                           <p> <span >Avec un taux de {{fonte}}%</span> </p>
                             
                          </h4>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="GLB_cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="doMelt()"  >Fondre!</button>
                      </div>
                  </div>
              </div>
       </div> 
       
      
     
       
        <!-- Confrim Owner Account       -->
     <div class="modal fade" id="confOwnerAccount" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <h4 align="center">
                           <p><label translate="GLB_Change_owner_Account">Confirm owner_account</label></p>
                           <div class="identiconWrapper" style="max-width:100px;" >
                                    <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="{{new_owner_account}}"  
                                        ng-click="startScanToAddressOwn()" watch-var="new_owner_account" >
                                    </div>
                           </div>
                           
                           <textarea cols="9" rows="5" class="adrtxt" ng-model="new_owner_account" >{{new_owner_account}} </textarea>
                             
                          </h4>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="GLB_cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="confirmOwnerAccount()" translate="GLB_confirm"  >Sauver</button>
                      </div>
                  </div>
              </div>
       </div> 
    </div>
</div> 
