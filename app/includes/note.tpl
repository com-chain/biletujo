<!-- Action on another Account-->
<div class="tab-pane active" ng-if="globalService.currentTab==globalService.tabs.note.id">
  <div>
    <wallet-decrypt-drtv></wallet-decrypt-drtv>
  </div>
        
  <div ng-show="wallet!=null" ng-controller='noteCtrl'>
     <section class="row" ng-hide="is_admin" >
          <div class="col-md-12 ">
              <div class="row grp"> 
                 <div class="col-md-12 ">
                     <label translate="EXC_Wrong_Acc_Type" >Not Admin</label>
                  </div>
              </div>
          </div>
      </section>  
      <section class="row" ng-show="is_admin">
          <div class="col-md-12 ">
              <div class="row grp"> 
              
                   <div class="col-md-12 ">
                     <div class="row "> 
                         <div class="col-md-12 ">
                             <label translate="NOT_Title" >Adjust Bank note amount</label>
                           
                         </div>
                     </div>  
                 </div> 
                 
                 <div class="col-md-12 " ng_hide="processing">
                     <div class="row "> 
                         <div class="col-md-12 ">
                              <input style="display:none;" type="file" on-read-file="openListFile($fileContent)" id="ntflstselector"/>
                              
                              <button type="button" class="btn btn-info" ng-click="openGetList()"  translate="NOT_Btn_getList" > Get List </button>     
                          </div>
                          <div class="col-md-12 ">
                            &nbsp;
                          </div>
                     </div>  
                 </div>  
                 <div class="col-md-12 ">
                     <div class="row "> 
                         <div class="col-md-12 ">
                              <label translate="NOT_amount" >Charge with:</label>
                              
                              <select ng-options="opt for opt in value_options" data-ng-model="target_amount_option" ng-readonly="processing"></select> {{CUR}}
                          </div>
                          <div class="col-md-12 ">
                            &nbsp;
                          </div>
                     </div>  
                 </div>       
                <div class="col-md-12 " ng_hide="processing || processed">
                     <div class="row "> 
                         <div class="col-md-12 ">
                              <button type="button" class="btn btn-info" ng-click="run()"  translate="NOT_Btn_charge"  >Charge </button>     
                         </div>
                          <div class="col-md-12 ">
                            &nbsp;
                          </div>
                     </div>  
                 </div> 
                 <div class="col-md-12 " ng_show="processing">
                     <div class="row "> 
                         <div class="col-md-12">
                              <label translate="NOT_progress" >Progress:</label>{{done}}/{{total}} {{curr_operation}}
                         </div>
                     </div>  
                 </div>
                 <div class="col-md-12 " ng_show="processed">
                     <div class="row "> 
                         <div class="col-md-12">
                              <label translate="NOT_completed" >completed</label>
                         </div>
                     </div>  
                 </div> 
                 <div class="col-md-12 ">
                    <div class="row "> 
                      <div class="col-md-12 ">
                        <table width="100%">
   
                            <tr ng-show="showNone" class="tr_trans">
                               <td colspan="3">
                                  <p translate="NOT_NoAdd" >Nones</p>
                               </td>
	                        </tr>
	                        <tr  ng-repeat="curr_address in info_list track by $index" class="tr_trans">
                             <td >
                                {{curr_address.address}}
                             </td>
                             <td>
                                {{curr_address.amount | number : 2}} {{CUR}}
                             </td>
                             <td>
                                {{curr_address.status | translate}}
                             </td>
	                        </tr>
                       </table>
                   </div>
                 </div>  
               </div>  
            </div>  
         </div> 
      </section>
      
      
      
      
        <!-- Popup confirm run -->
      <div class="modal fade" id="pop_conf_run" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                           <h4><label translate="NOT_ConfirmTitle">Confirm run</label></h4>
                            <label translate="NOT_confirm_text">Charging with</label>
                            {{target_amount | number : 2}}{{CUR}}
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="NOT_Cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="doRun()" translate="NOT_btn_conf_run">Remove</button>
                      </div>
                  </div>
              </div>
         </div>
      
    </div>
</div> 
