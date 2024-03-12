    <!-- Transactions-->
    <div class="tab-pane active" ng-if="globalService.currentTab==globalService.tabs.rotransactions.id">
      
        <div>
            <wallet-decrypt-drtv></wallet-decrypt-drtv>
        </div>
       
       <div ng-show="wallet!=null" ng-controller='readonlytransactionsCtrl'>


        <section class="row " >
          <div class="col-md-12 ">
              <div class="row grp"> 
               
               <div class="col-md-6 col-xs-6">
                 <label translate="CRI_selected_wallet" >selected account</label>
               </div>
               <div class="col-md-6 col-xs-6">
                    <a class="btn btn-primary bellowmargin" ng-click="pickWallet()" translate="CRI_change" > </a>
                    <div class="pop_pane"  ng-show="showSelectorPop" >
                        <div class="ctt_pop" ng-show="showSelectorPop">
                            <div class="CTC_Close" ng-click="closeSelectPop()" translate="TRA_Close"></div>
                            <div class="ctt_tool">
                                <div class="ctt_pop_scroll">
                                    <div class="ctt_cent">
                                        <div  ng-repeat="ct in possible_wallets_add" class="ctt_elm">
                                            <div>
                                                <div  ng-click="pickSel(ct)">
                                                    <div class="identiconWrapper" style="max-width:60px;" >
                                                            <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="{{ct}}"  watch-var="possible_wallets" ></div>
                                                    </div>
                                                <div class="ctt_txt">{{ct}}</div>
                                            </div> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>      
                    </div>
               </div>
               <button type="button" class="btn btn-primary bellowmargin" ng-click="crHelpModal.open()" translate="CRI_help">?</button>   
              </div>    
               <div  class="col-md-6 col-xs-6">
                  <div class="identiconWrapper">
                    <div id="addressIdenticon" title="Address Indenticon" blockie-address="{{watched_address}}" watch-var="watched_address"></div>
                  </div>
               </div>
               <div  class="col-md-6 col-xs-6">
                  <textarea cols="9" rows="5" class="adrtxt" readonly="readonly">{{watched_address}} </textarea>
               </div>
              </div>
          </div>
         </section>
         
         
        <section class="row" ng-show="show_bal" >
	      <div class="col-md-12 ">
	       <div class="row grp"> 
            <div  class="col-md-12"> 
	             <label translate="ROTR_balances" >Votre balance :</label>
            </div> 
            <div  class="col-md-12" ng-show="has_nant">  
                <div class="balance-item">{{CUR_nanti}}:</div>
                <div class="balance-amount text-primary">{{balanceEL| number : 2}} {{CUR}}</div>
            </div> 
            <div  class="col-md-12" ng-show="has_credit_mut" >  
                    <div class="balance-item">{{CUR_credit_mut}}:</div>
                    <div class="balance-amount text-primary">{{balanceCM| number : 2}} {{CUR}}</div>
            </div> 
           </div>
          </div>
         </section>




       <div style="display:none">
            <div id="addressIdenticon" blockie-address="{{watched_address}}" watch-var="watched_address"></div>
       </div>         
       

         <div class="row grp"> 
           <div class="col-md-12 ">
             <div class="row "> 
               <div class="col-md-4 col-xs-4">
                 <label translate="TRA_roTransactions" >Transaction :</label>
               </div>
                <div class="col-md-8 col-xs-8">
                  <button type="button" id="rafraichir" class="btn btn-primary bellowmargin btn_refresh"  ng-click="refreshTrans()" translate="TRA_Refresh">Refresh </button>
                   <button type="button" id="notify" class="btn bellowmargin"  ng-class="watching ? 'btn-default btn_watching':'btn-primary btn_watch'"  ng-click="watch_click()" translate="TRA_Watch">watch </button>
                  
                  <button type="button" id="exporter" class="btn btn-primary bellowmargin btn_export"  ng-click="exportMemos()" translate="CTC_export_mem" >Export </button>
                  <button type="button" id="verifier" class="btn btn-primary bellowmargin"  ng-click="checkTran()" translate="TRA_check"  ng-if="isApp" >Export </button>
                  
                  
               </div>
             </div>
             <div class="row "> 
               <div class="col-md-12 ">
                  <table width="100%">
                    <tr ng-show="showNone" class="tr_trans">
                     <td colspan="3">
                        <p translate="TRA_NoTrans" >Aucunes</p>
                     </td>
	               </tr>
	                <tr  ng-repeat="tran in transactions track by $index" class="tr_trans" ng-class="{'pending': tran.data.status==1}">
	                     <td ng-show="tran.data.addr_from==watched_address">
	                     <a ng-click="openDetails(tran.id)" style="color:black;">
	                        <span ng-show="tran.data.status==1">*</span>
                            <span translate="TRA_Paid" class="paid"></span> {{ (tran.data.recieved + tran.data.tax)/100. | number : 2}} {{CUR}}
	                        <span translate="TRA_InDateOf"></span>   {{tran.data.time*1000 | date : 'yyyy-MM-dd HH:mm' }}
	                        <span translate="TRA_To"></span> 
	                      </a>
                         </td>
                         <td ng-show="tran.data.addr_to==watched_address">
                         <a ng-click="openDetails(tran.id)" style="color:black;">
	                        <span ng-show="tran.data.status==1">*</span>
	                        <span translate="TRA_Got" class="get"></span> {{ tran.data.recieved/100. | number : 2}} {{CUR}}
	                        <span translate="TRA_InDateOf"></span>   {{tran.data.time*1000 | date : 'yyyy-MM-dd HH:mm' }}
	                        <span translate="TRA_From"></span> 
	                      </a>  
                         </td>
                         <td ng-show="tran.data.addr_from==watched_address" width="100px">
                            <a ng-click="addCtc(tran.data.addr_to)"> 
                             <div class="identiconWrapper without_text_tr" ng-class="{'with_text_tr': tran.data.to_name!=''}">
                                 <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="{{tran.data.addr_to }}"  watch-var="transactions" ></div>
                             </div>
                             <div style="color:black; max-height:21px; overflow:hidden; text-align:center;">{{tran.data.to_name }}</div>
                             </a>
                         </td>
                         <td ng-show="tran.data.addr_to==watched_address" width="100px">
                          <a ng-click="addCtc(tran.data.addr_from)"> 
	                        <div class="identiconWrapper without_text_tr" ng-class="{'with_text_tr': tran.data.from_name!=''}" >
                                 <div id="addressIdenticon" title="Address Indenticon"  img="1" blockie-address="{{tran.data.addr_from }}"  watch-var="transactions"></div>
                             </div>
                             <div style="color:black; max-height:21px; overflow:hidden; text-align:center;">{{tran.data.from_name }}</div>
                          </a>
                         </td>
                          <td ng-show="tran.data.addr_from==watched_address" class="tdPlus500">
                            <textarea cols="9" rows="5" class="adrtxtSml" readonly="readonly">{{tran.data.addr_to }} </textarea>
                         </td>
                         <td ng-show="tran.data.addr_to==watched_address" class="tdPlus500">
	                        <textarea cols="9" rows="5" class="adrtxtSml" readonly="readonly">{{tran.data.addr_from }} </textarea>
                       </td>
                        <td >
                           <a ng-click="openDetails(tran.id)" style="color:black;">
	                          <div style="max-height:5em; max-width:200px;overflow:hidden;" >{{tran.data.memo }} </div> 
	                       </a>
                       </td>
	               </tr>
	               <tr ng-show="showNoMore" class="tr_trans">
                     <td colspan="3">
                        <p translate="TRA_NoMore" >Pas Plus</p>
                     </td>
	               </tr>
                 </table>
               </div>
             </div>
             <div class="row "> 
               <div class="col-md-col-md-6 col-xs-6 ">
                  <a class="btn btn-info btn-block" id="prevTransactions" ng-click="prevTransactions()"  translate="TRA_prev" > Ajouter </a>
               </div>
               <div class="col-md-col-md-6 col-xs-6 ">
                  <a class="btn btn-info btn-block" id="addTransactions" ng-click="addTransactions()"  translate="TRA_add" > Ajouter </a>
               </div>
             </div>
           </div>
         </div>
         
         <!-- add Modal -->
         <div class="modal fade" id="addContact" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                              <h4>
                                  <label translate="CTC_confirmAdd" ng-show="indctc==-1">Add name</label>
                                  <label translate="CTC_AlreadyAdded" ng-hide="indctc==-1">already added</label>
                              </h4>
                              <div class="identiconWrapper" style="max-width:60px;">
                                 <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="{{curraddress }}"  watch-var="curraddress" ></div>
                              </div>
                              <div translate="CTC_withName"  ng-show="indctc==-1">Add name</div>
                              <div translate="CTC_updateName" ng-hide="indctc==-1">update name</div>
                              <input class="form-control" type="text" ng-model="currName" />
                             
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="CTC_addCancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="saveContact()" translate="CTC_addConfirm" ng-show="indctc==-1">Add</button>
                          <button type="button" class="btn btn-primary" ng-click="saveContact()" translate="CTC_updateConfirm" ng-hide="indctc==-1">Update</button>
                      </div>
                  </div>
              </div>
        </div>
        
         <div class="modal fade" id="transDetails" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-body">
                          <div align="center">
                            <h4><label translate="TRA_details_title">Transaction details</label></h4>
                            <h4>
                                <span ng-show="current_tran_status==1" translate="TRA_Registered" class="pending"></span>
                                <span ng-show="current_tran_status==0" translate="TRA_Confirmed"></span>
                            </h4>
                            
                            <div  qr-code="{{current_tran_hash_info}}" watch-var="current_tran_hash_info" width="100%" style=" max-width: 200px; margin-right:auto; margin-left:auto;" ></div><br/>

                            <div><label translate="TRA_details_date">date</label> {{selectedTrans.time*1000 | date : 'yyyy-MM-dd HH:mm' }}</div>
                            
                            <div ng-show="selectedTrans.addr_from==watched_address"> 
                                
                            
                            <div ng-show="selectedTrans.delegate">
                              <div><strong translate="TRA_Delegated"></strong></div>
                              <div> {{selectedTrans.delegate_name }}</div>
                              <span> 
                                     <div  class="identiconWrapper without_text_tr">
                                        <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="{{selectedTrans.delegate }}"  watch-var="selectedTrans" ></div>
                                     </div>
                                 </span>
                                <textarea cols="9" rows="5" class="adrtxtSml" readonly="readonly"  >{{selectedTrans.delegate }} </textarea>
                                 
                            </div>
                            
                            
                            
                            
                            
                                <div><strong><span translate="TRA_Paid" class="paid"></span> &nbsp;{{(selectedTrans.recieved + selectedTrans.tax)/100. | number : 2}}  {{selectedTrans.currency}}</strong></div>
                                <div><strong translate="TRA_To"></strong> {{selectedTrans.to_name }}</div>
                                <span> 
                                     <div ng-show="selectedTrans.addr_from==watched_address" class="identiconWrapper without_text_tr">
                                        <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="{{selectedTrans.addr_to }}"  watch-var="selectedTrans" ></div>
                                     </div>
                                 </span>
                                <textarea cols="9" rows="5" class="adrtxtSml" readonly="readonly" ng-show="selectedTrans.addr_from==watched_address" >{{selectedTrans.addr_to }} </textarea>
                                 
                            </div>
                            
                            <div ng-show="selectedTrans.addr_to==watched_address">
                                <div><strong><span translate="TRA_Got" class="get"></span> &nbsp;{{selectedTrans.recieved/100. | number : 2}}  {{selectedTrans.currency}}</strong></div>
                                <div><strong translate="TRA_From"></strong> {{selectedTrans.from_name }}</div>
                                <span> 
                                      <div  ng-show="selectedTrans.addr_to==watched_address" class="identiconWrapper without_text_tr"  >
                                        <div id="addressIdenticon" title="Address Indenticon"  img="1" blockie-address="{{selectedTrans.addr_from }}"  watch-var="selectedTrans"></div>
                                      </div>
                                </span>
                                <textarea cols="9" rows="5" class="adrtxtSml" readonly="readonly" ng-show="selectedTrans.addr_to==watched_address">{{selectedTrans.addr_from }} </textarea>
                            </div>
                            <div><label translate="TRA_memo_title">Memo</label></div>
                            <textarea cols="21" rows="4" id="current_trans_memo" ng-model="current_trans_memo" ></textarea>
                            
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-primary" ng-click="closeDetails()" translate="TRA_Close">Fermer </button>
                         
                      </div>
                  </div>
              </div>
        </div>
        
           <div class="modal fade" id="transVerify" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-body">
                          <div align="center">
                            <h4><label ng-show="tr_found" translate="TRA_details_title">Transaction details</label></h4>
                            <div ng-hide="tr_found">
                              <label translate="TRA_not_found"> Not Found </label>
                            </div>
                            
                            <div ng-show="tr_found">
                               <br/>
                               <div style="width:44%;display:inline-block;vertical-align:top;">
                                     <div class="identiconWrapper" >
                                         <div id="addressIdenticon" title="Address Indenticon"  blockie-address="{{selectedTrans.addr_from}}" 
                                                  watch-var="selectedTrans.addr_from" style="opacity:0.9;"></div>
                                      </div>
                                      <textarea cols="9" rows="5" class="adrtxt" readonly="readonly" ng-model="selectedTrans.addr_from"> </textarea>
                                      <div ng-bind-html="from_name" style="overflow:hidden;text-align:center;max-height:21px"></div><br/>

                              </div>
                              <div style="width:20px;display:inline-block;vertical-align:top; padding-top:50px;"  > <strong  class="text-primary"  style="font-size: xx-large;font-weight: bolder;" >&rArr;</strong></div>
                              
                              <div style="width:44%;display:inline-block;vertical-align:top;">
                                    <div class="identiconWrapper" >
                                    <div id="addressIdenticon" title="Address Indenticon"  blockie-address="{{selectedTrans.addr_to}}" 
                                         watch-var="selectedTrans.addr_to" style="opacity:0.9;"></div>
                                    </div>
                                    <textarea cols="9" rows="5" class="adrtxt" readonly="readonly" ng-model="selectedTrans.addr_to" > </textarea>
                                    <div ng-bind-html="to_name" style="overflow:hidden;text-align:center;max-height:21px" ></div> 
                              </div>
                              
                              <div><label translate="TRA_details_amount"></label> </div>
                              <div><strong><span translate="TRA_Paid" class="paid"></span> &nbsp;{{(selectedTrans.recieved + selectedTrans.tax)/100. | number : 2}}  {{selectedTrans.currency}}</strong></div>
                              <div><strong><span translate="TRA_Got" class="get"></span>&nbsp;{{selectedTrans.recieved/100. | number : 2}}  {{selectedTrans.currency}}</strong></div>
                            
                              <div><label translate="TRA_details_date">date</label> {{selectedTrans.time*1000 | date : 'yyyy-MM-dd HH:mm' }}</div>
                
                            </div>
                            
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-primary" data-dismiss="modal" translate="TRA_Close">Fermer </button>
                         
                      </div>
                  </div>
              </div>
        </div>
        
          
        
         <!-- export Modal -->
         <div class="modal fade" id="exportTraPop" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                              <h4><label translate="TRA_Export_title">Import</label></h4>
                             
                              <div><label translate="TRA_Export_date"></label></div>
                              
                              <div >   
                                  <input type="date" ng-model="start_date" /> 
                                  <input type="number" step="1" ng-model="start_time" min="0" max="23" style="width:40px"/>H
                                  <label translate="TRA_Export_date_to"></label>  
                                  <input type="date" ng-model="end_date" />
                                  <input type="number" step="1" ng-model="end_time" min="1" max="24" style="width:40px"/>H
                              </div>
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="CTC_editNameCancel">Annuler </button>
                          <button type="button" class="btn btn-primary"  ng-click="ExportTra()" translate="TRA_Export">Sauver</button>
                      </div>
                  </div>
              </div>
        </div>
        
         <!-- Consultation Right Help -->
         <div class="modal fade" id="cr_help_pop" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel" data-backdrop="static" data-keyboard="false">
              <div class="modal-dialog" role="document">
                  <div class="modal-content"> 
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                           <h4><label translate="CRI_Help_title">Delegate:</label></h4>
                           <div align="left" translate="CRI_Help_text"></div>
                             
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-primary" data-dismiss="modal" translate="CRI_close">CLose </button>
                      </div>
                  </div>
              </div>
        </div>   
    
         
         

        </div>  
        
     </div>
 
   </div>
