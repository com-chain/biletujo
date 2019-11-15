    <!-- Transactions-->
    <div class="tab-pane active" ng-if="globalService.currentTab==globalService.tabs.rotransactions.id">
      
        <div>
            <wallet-decrypt-drtv></wallet-decrypt-drtv>
        </div>
       
       <div ng-show="wallet!=null" ng-controller='readonlytransactionsCtrl'>
       
  
  
  <!-- Missing header with autor selection-->
       <div style="display:none">
            <div id="addressIdenticon" blockie-address="{{currentWalletAddress}}" watch-var="currentWalletAddress"></div>
       </div>         
       

         <div class="row grp"> 
           <div class="col-md-12 ">
             <div class="row "> 
               <div class="col-md-4 col-xs-4">
                 <label translate="TRA_roTransactions" >Transaction :</label>
               </div>
                <div class="col-md-8 col-xs-8">
                  <button type="button" id="rafraichir" class="btn btn-primary bellowmargin"  ng-click="refreshTrans()" translate="TRA_Refresh">Refresh </button>
                   <button type="button" id="notify" class="btn bellowmargin"  ng-class="watching ? 'btn-default':'btn-primary'"  ng-click="watch_click()" translate="TRA_Watch">watch </button>
                  
                  <button type="button" id="exporter" class="btn btn-primary bellowmargin"  ng-click="exportMemos()" translate="CTC_export_mem" >Export </button>
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
	                <tr  ng-repeat="tran in transactions track by $index" class="tr_trans">
	                     <td ng-show="tran.data.addr_from==currentWalletAddress">
	                     <a ng-click="openDetails(tran.id)" style="color:black;">
                            <span translate="TRA_Paid" class="paid"></span> {{ tran.data.sent/100. | number : 2}} {{CUR}}
	                        <span translate="TRA_InDateOf"></span>   {{tran.data.time*1000 | date : 'yyyy-MM-dd HH:mm' }}
	                        <span translate="TRA_To"></span> 
	                      </a>
                         </td>
                         <td ng-show="tran.data.addr_to==currentWalletAddress">
                         <a ng-click="openDetails(tran.id)" style="color:black;">
	                        <span translate="TRA_Got" class="get"></span> {{ tran.data.recieved/100. | number : 2}} {{CUR}}
	                        <span translate="TRA_InDateOf"></span>   {{tran.data.time*1000 | date : 'yyyy-MM-dd HH:mm' }}
	                        <span translate="TRA_From"></span> 
	                      </a>  
                         </td>
                         <td ng-show="tran.data.addr_from==currentWalletAddress" width="100px">
                            <a ng-click="addCtc(tran.data.addr_to)"> 
                             <div class="identiconWrapper without_text_tr" ng-class="{'with_text_tr': tran.data.to_name!=''}">
                                 <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="{{tran.data.addr_to }}"  watch-var="transactions" ></div>
                             </div>
                             <div style="color:black; max-height:21px; overflow:hidden; text-align:center;">{{tran.data.to_name }}</div>
                             </a>
                         </td>
                         <td ng-show="tran.data.addr_to==currentWalletAddress" width="100px">
                          <a ng-click="addCtc(tran.data.addr_from)"> 
	                        <div class="identiconWrapper without_text_tr" ng-class="{'with_text_tr': tran.data.from_name!=''}" >
                                 <div id="addressIdenticon" title="Address Indenticon"  img="1" blockie-address="{{tran.data.addr_from }}"  watch-var="transactions"></div>
                             </div>
                             <div style="color:black; max-height:21px; overflow:hidden; text-align:center;">{{tran.data.from_name }}</div>
                          </a>
                         </td>
                          <td ng-show="tran.data.addr_from==currentWalletAddress" class="tdPlus500">
                            <textarea cols="9" rows="5" class="adrtxtSml" readonly="readonly">{{tran.data.addr_to }} </textarea>
                         </td>
                         <td ng-show="tran.data.addr_to==currentWalletAddress" class="tdPlus500">
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
                            <div  qr-code="{{current_tran_hash_info}}" watch-var="current_tran_hash_info" width="100%" style=" max-width: 200px; margin-right:auto; margin-left:auto;" ></div><br/>

                            <div><label translate="TRA_details_date">date</label> {{selectedTrans.time*1000 | date : 'yyyy-MM-dd HH:mm' }}</div>
                            
                            <div ng-show="selectedTrans.addr_from==currentWalletAddress"> 
                                <div><strong><span translate="TRA_Paid" class="paid"></span> &nbsp;{{selectedTrans.sent/100. | number : 2}}  {{selectedTrans.currency}}</strong></div>
                                <div><strong translate="TRA_To"></strong> {{selectedTrans.to_name }}</div>
                                <span> 
                                     <div ng-show="selectedTrans.addr_from==currentWalletAddress" class="identiconWrapper without_text_tr">
                                        <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="{{selectedTrans.addr_to }}"  watch-var="selectedTrans" ></div>
                                     </div>
                                 </span>
                                <textarea cols="9" rows="5" class="adrtxtSml" readonly="readonly" ng-show="selectedTrans.addr_from==currentWalletAddress" >{{selectedTrans.addr_to }} </textarea>
                                 
                            </div>
                            
                            <div ng-show="selectedTrans.addr_to==currentWalletAddress">
                                <div><strong><span translate="TRA_Got" class="get"></span> &nbsp;{{selectedTrans.recieved/100. | number : 2}}  {{selectedTrans.currency}}</strong></div>
                                <div><strong translate="TRA_From"></strong> {{selectedTrans.from_name }}</div>
                                <span> 
                                      <div  ng-show="selectedTrans.addr_to==currentWalletAddress" class="identiconWrapper without_text_tr"  >
                                        <div id="addressIdenticon" title="Address Indenticon"  img="1" blockie-address="{{selectedTrans.addr_from }}"  watch-var="selectedTrans"></div>
                                      </div>
                                </span>
                                <textarea cols="9" rows="5" class="adrtxtSml" readonly="readonly" ng-show="selectedTrans.addr_to==currentWalletAddress">{{selectedTrans.addr_from }} </textarea>
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
        
            
    
         
         

        </div>  
        
     </div>
 
   </div>
