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
                     <label translate="GLB_Taxes" >Taxes :</label>
                  </div>
                   <div  class="col-md-6 col-xs-6">
                    <a class="btn btn-primary btn-block" ng-click="refresh()" translate="EXC_Refresh">Refresh </a>
                   </div>
                  <div class="col-md-12 ">
                  <br/>
                    <div ng-bind-html="validateStatus"></div>
                  </div>
                  
                  <div  class="col-md-12 " >
                        <span translate="GLB_tax_amount"> </span>

                  </div> 
                  <div  class="col-md-6 col-xs-6 text-primary">
                        {{taxes_amount}}<span translate="GLB_percent"> </span>

                  </div>
                  <div  class="col-md-6 col-xs-6">
                    <a class="btn btn-primary btn-block" ng-click="updateTax()" translate="GLB_update_tax">Update </a>
                  </div>
                  
                 <br/>
          
                  
                  
                   <div  class="col-md-12 " >
                        <span translate="GLB_tax_amount_leg"> </span>

                  </div> 
                  <div  class="col-md-6 col-xs-6 text-primary">
                        {{taxes_amount_leg}}<span translate="GLB_percent"> </span>

                  </div>
                  <div  class="col-md-6 col-xs-6">
                    <a class="btn btn-primary btn-block" ng-click="updateTaxLeg()" translate="GLB_update_tax">Update </a>
                  </div>  
                  
                 
                 <br/>
                 
                  <div  class="col-md-12 ">
                        <span translate="GLB_tax_account">  </span>
                  </div>
                  
                  
                  <div   class="col-md-6 col-xs-6">
                       <div class="identiconWrapper" style="max-width:100px;" >
                                    <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="{{tax_account}}"  
                                        watch-var="tax_account" ">
                                    </div>
                         </div>
                         <textarea cols="9" rows="5" class="adrtxt" disabled>{{tax_account}} </textarea>
                  </div>
                   <div  class="col-md-6 col-xs-6">
                    &nbsp;
                    <br/>
                    <a class="btn btn-primary btn-block" ng-click="updateTaxAcc()" translate="GLB_update_tax_acc">Refresh </a>
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
       
     <!-- Confrim Taxes -->
     <div class="modal fade" id="confTax" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <h4 align="center">
                           <p><label translate="GLB_Change_tax">Confirm Tax</label></p>
                           <p> <span translate="GLB_NewTaxAmount" ></span> <span class="text-primary"> 
                                   <input class="form-control" type="text" placeholder="0" ng-model="new_tax_amount"/>  
                                   <span translate="GLB_percent"> </span>
                               </span>  
                            </p>
                             
                          </h4>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="GLB_cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="confirmTax()" translate="GLB_confirm" ng-show="new_tax_amount >= 0" >Sauver</button>
                      </div>
                  </div>
              </div>
       </div> 
       
            <!-- Confrim Taxes -->
     <div class="modal fade" id="confTaxLeg" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <h4 align="center">
                           <p><label translate="GLB_Change_tax_leg">Confirm Tax</label></p>
                           <p> <span translate="GLB_NewTaxAmount" ></span> <span class="text-primary"> 
                                   <input class="form-control" type="text" placeholder="0" ng-model="new_tax_amount_leg"/>  
                                   <span translate="GLB_percent"> </span>
                               </span>  
                            </p>
                             
                          </h4>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="GLB_cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="confirmTaxLeg()" translate="GLB_confirm" ng-show="new_tax_amount_leg >= 0" >Sauver</button>
                      </div>
                  </div>
              </div>
       </div> 
       
     <!-- Confrim Taxes Account       -->
     <div class="modal fade" id="confTaxAccount" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <h4 align="center">
                           <p><label translate="GLB_Change_tax_Account">Confirm Tax_account</label></p>
                           <div class="identiconWrapper" style="max-width:100px;" >
                                    <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="{{new_tax_account}}"   
                                         ng-click="startScanToAddressTax()"  watch-var="new_tax_account" >
                                    </div>
                           </div>
                           
                           <textarea cols="9" rows="5" class="adrtxt" ng-model="new_tax_account" >{{new_tax_account}} </textarea>
                             
                          </h4>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="GLB_cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="confirmTaxAccount()" translate="GLB_confirm"  >Sauver</button>
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
