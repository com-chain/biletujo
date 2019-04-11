<!-- Action on another Account-->
<div class="tab-pane active" ng-if="globalService.currentTab==globalService.tabs.exchange.id">
  <div>
    <wallet-decrypt-drtv></wallet-decrypt-drtv>
  </div>
        
  <div ng-show="wallet!=null" ng-controller='exchangeCtrl'>
     <!-- <section class="row" >
          <div class="col-md-12 ">
              <div class="row grp"> 
                 <div class="col-md-col-md-3 col-xs-3 ">
                 <a class="btn btn-primary btn-block"  href="{{qr_address}}"  translate="EXC_GestionQR"></a>
                 </div>
                 <div class="col-md-col-md-9 col-xs-9 ">
                 
                 </div>
  
         
              </div>
          </div>
     </section> --> 
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
                     <label translate="EXC_Account" >Account :</label>
                  </div>
                  
                  <div  class="col-md-12">
                    <div class="identiconWrapper">
                        <div id="addressIdenticon" title="Address Indenticon"  blockie-address="{{selected_account}}"  ng-click="startScanToAddress()" watch-var="selected_account" style="opacity:0.9;"></div>
                  </div>
                  <textarea cols="45" rows="1" class="adrtxt" id="toField" placeholder="{{'ID_placeholder' | translate}}" ng-model="selected_account" ng-change="checkSelectedAccount()"> </textarea>
                  <div ng-bind-html="acc_message" style="text-align:center;font-size:large;"></div>
               </div>
                   
              </div>
          </div>
      </section>  
         
      <section class="row" ng-show="valid_acc" >
          <div class="col-md-12 ">
          
            <div class="row grp"> 
              <div  class="col-md-col-md-9 col-xs-9 "> 
	             <label translate="EXC_balances" >Account balances :</label>
              </div> 
              <div class="col-md-col-md-3 col-xs-3 "> 
                     <!--<a class="btn btn-primary btn-block" ng-click="refresh()" translate="EXC_Refresh">Refresh </a>-->
              </div>
   
              <div  class="col-md-12" ng_show="has_nant">
                <div class="balance-item">{{CUR_nanti}}</div>
                <div class="balance-amount text-primary">{{balanceEL| number : 2}} {{CUR}}</div>
              </div> 
    
    
              <div  class="col-md-12" ng_show="has_credit_mut">  
                    <div class="balance-item">{{CUR_credit_mut}}</div>
                    <div class="balance-amount text-primary">{{balanceCM| number : 2}} {{CUR}}</div>
              </div>
    
             </div> 
           
              <div class="row grp"> 
              <div> 
                 <div class="col-md-12 ">
                     <label translate="EXC_AccStat" >Lock/Unlock Account:</label>  
                 </div>
                 <div class="col-md-12 ">
                    <span class="balance-item"></span><span translate="EXC_LockStatus"></span> {{lock_status}} 
                 </div>
                
              </div> 
               
              <div> 
                 <div class="col-md-12 ">
                     <label translate="EXC_AccType" >Account Type:</label>  
                 </div>
                 <div class="col-md-12 ">
                    <span class="balance-item"></span> 
                    {{acc_type_obj.tp_name}}
                 </div> 
               
              </div> 
            
               
     
   
              <div   ng-hide="acc_type_obj.is_admin || !has_credit_mut">    
                 <div class="col-md-12">             
	                  <label translate="LIM_limites" >Vos limites de </label>&nbsp;<label> {{CUR_credit_mut}}</label><label >:</label>
                 </div> 
                 <div  class="col-md-12 ">  
                        <span class="balance-item">{{ 'LIM_credit' | translate }}</span>
                        <span class="text-primary">{{limitCMp}} {{CUR}}</span> 
                 </div> 
                 <div  class="col-md-12  ">  
                        <span class="balance-item">{{ 'LIM_debit' | translate }}</span>
                        <span class="text-primary">{{limitCMm}} {{CUR}}</span>
                 </div>
              
           </div> 

   
    <div  class="col-md-col-md-9 col-xs-9 "> 
    </div>
    <div class="col-md-col-md-3 col-xs-3 ">
                 <a class="btn btn-primary btn-block" ng-click="updateAccount()"  translate="EXC_Update"></a>
              </div>
     </div>
    
            <div class="row grp"  ng-hide="acc_type_obj.is_admin || !has_nant"> 
                <div class="col-md-12 ">
                   <label translate="EXC_Credit_1" >Credit</label><label  >&nbsp; {{CUR_nanti}} </label>   <label translate="EXC_Credit_2" >on account Account :</label>  
               </div>
            
               <div class="col-md-col-md-9 col-xs-9 ">
                  <span class="balance-item"  translate="EXC_Credit_prefix" ></span>  <span class="text-primary"> <input type="number" step="0.01" placeholder="0.00" ng-model="credit_amount" ng-pattern="/^[0-9]+(\.[0-9]{1,2})?$/" style="max-width:200px;display: inline-block;"/></span>
                   <span  class="text-primary" >{{CUR}}</span>
               </div> 
               
               <div class="col-md-col-md-3 col-xs-3 ">
                  <a class="btn btn-primary btn-block" ng-click="creditAccount()"  translate="EXC_CreditAccount"></a> 
               </div>
           </div>
   
            
          </div> 
      </section> 
      
        <!-- Update -->
         <div class="modal fade" id="update" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body" align="center">
                          <h4 align="center">
                           <p><label translate="EXC_Update">Update</label></p>
                           </h4>
                           <p><label translate="EXC_LockUnlock">Lock status</label></p> 
                              <md-radio-group >
                                  <input type="radio" ng-model="pop_is_lock" name="cb_stat" ng-value="true" id="cb_lock"/> {{ 'EXC_Locked' | translate }} &nbsp;&nbsp;&nbsp;
                                  <input type="radio" ng-model="pop_is_lock" name="cb_stat" ng-value="false" id="cb_unlock"/> {{ 'EXC_Unlocked' | translate }} 
                              </md-radio-group>
                           </p>
                           <p><label translate="EXC_AccType">Account type</label></p> 
                              <md-radio-group>
                                 <input type="radio" ng-model="pop_acc_type" ng-change="typeChanged()" name="cb_type" value="0" id="cb_pers" ng-hide="acc_type_obj.is_admin"/> <span ng-hide="acc_type_obj.is_admin" > {{ 'EXC_Account_Type_physical' | translate }} </span> &nbsp;&nbsp;&nbsp;
                                 <input type="radio" ng-model="pop_acc_type" ng-change="typeChanged()" name="cb_type" value="1"  id="cb_legal" ng-hide="acc_type_obj.is_admin"/> <span ng-hide="acc_type_obj.is_admin" > {{ 'EXC_Account_Type_legal' | translate }} </span> &nbsp;&nbsp;&nbsp;
                                 <input type="radio" ng-model="pop_acc_type"  ng-change="typeChanged()" name="cb_type" value="2"  id="cb_admin" ng-show="acc_type_obj.can_admin" />  <span ng-show="acc_type_obj.can_admin"> {{ 'EXC_Account_Type_admin' | translate }} </span>
                              </md-radio-group>
                           </p> 
                           
 
                           <p ng-hide="acc_type_obj.is_admin || !has_credit_mut">
                               <label translate="LIM_limites" >Vos limites de </label>&nbsp;<label > {{CUR_credit_mut}}</label><label>:</label>    
                           </p>                       
                           <p ng-hide="acc_type_obj.is_admin || !has_credit_mut"">
                            <span class="balance-item">{{ 'LIM_credit' | translate }}</span>   
                    <span class="text-primary"> <input type="text" id="limitP" min="0" ng-model="pop_limitCMp" ng-pattern="/^[0-9]+(\.[0-9]{1,2})?$/" value="{{pop_limitCMp}}"/> {{CUR}}</span>    
                          </p> 
                            
                           <p ng-hide="acc_type_obj.is_admin || !has_credit_mut"">
      
                    <span class="balance-item">{{ 'LIM_debit' | translate }}</span>
                    <span class="text-primary"><input type="text" id="limitM" max="0" ng-model="pop_limitCMm"  ng-pattern="/^[0-9]+(\.[0-9]{1,2})?$/" value="{{pop_limitCMm}}"/>  {{CUR}}</span>
                           
                           </p>
    
                      
                        <div ng-bind-html="pop_message" style="text-align:center;font-size:large;"></div> 
                      </div> 
                      
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="EXC_cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="confirmUpdate()" translate="EXC_confirm">Sauver</button>
                      </div>
                  </div>
              </div>
        </div> 
     
    
  
         <!-- Confrim Credit -->
         <div class="modal fade" id="confCredit" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <h4 align="center">
                           <p><label translate="EXC_ConfirmCreditAccountTitle">Confirm Credit Account</label></p>
                           <p> <span translate="EXC_CreditAmount" ></span> <span class="text-primary"> {{credit_amount}} {{CUR}}</span>   </p>
                             
                          </h4>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="EXC_cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="confirmCreditAccount()" translate="EXC_confirm" ng-show="credit_amount>0">Sauver</button>
                      </div>
                  </div>
              </div>
        </div> 
     
    </div>
</div> 
