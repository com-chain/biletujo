    <!-- Transactions-->
    <div class="tab-pane active" ng-if="globalService.currentTab==globalService.tabs.roAutorizations.id">
      
        <div>
            <wallet-decrypt-drtv></wallet-decrypt-drtv>
        </div>
        
        <div ng-show="wallet!=null" ng-controller='consultRightCtrl'>

          <section class="row " >
          <div class="col-md-12 ">
              <div class="row grp"> 
               
               <div class="col-md-6 col-xs-6">
                 <label >{{acc_name}}</label>
               </div>
                <div class="col-md-6 col-xs-6">
                
                  <a class="btn btn-primary bellowmargin" ng-click="createRight()" translate="CRI_CreateBtn" >&nbsp; </a>

                </div>
                
                
               <div  class="col-md-6 col-xs-6">
                  <div class="identiconWrapper">
                    <div id="addressIdenticon" title="Address Indenticon" blockie-address="{{currentAddress}}" watch-var="currentAddress"></div>
                  </div>
               </div>
               <div  class="col-md-6 col-xs-6">
                  <textarea cols="9" rows="5" class="adrtxt" readonly="readonly">{{currentAddress}} </textarea>
               </div>
              </div>
          </div>
         </section>
        
         <section class="row grp" >
	      <div class="col-md-12 ">
	        <div class="row"> 
              <div class="col-md-7 col-xs-7">
                 <label translate="CRI_ConsultRight_List" >Vos Droit :</label>
              </div>
              <div class="col-md-5 col-xs-5">
                  <button type="button" id="ajouter" class="btn btn-primary bellowmargin"  ng-click="importRightPop()" translate="CTC_add">Add </button>
              </div>
            </div>
            <div class="row "> 
               <div class="col-md-12 ">
                  <table width="100%" >
                    <tr  ng-show="NoCR" class="tr_trans">
                         <td >
                           <p translate="CRI_NoCR" >no consutlt right</p>
                         </td>
                    <tr>
	                <tr  ng-repeat="cr in consult_rights track by $index" class="tr_trans">
	                  
	                   <td  width="100px">
                         
	                        <div class="identiconWrapper without_text_tr" ng-class="{'with_text_tr': cr.name!=''}" >
                                 <div id="addressIdenticon" title="Address Indenticon"  img="1" blockie-address="{{cr.data.address }}"  watch-var="consult_rights"></div>
                             </div>
                             <div style="color:black; max-height:21px; overflow:hidden; text-align:center;">{{cr.name }}</div>
                
                         </td>
	                  
                        <td class="tdPlus500" >
                            <textarea cols="9" rows="5" class="adrtxtSml" readonly="readonly">{{cr.data.address }} </textarea>  
                        </td>
              
                        
                         <td ng-class="{'paid': !cr.valid}">
	                        <span translate="CRI_ValidityStart" ></span> {{cr.data.begin | date : 'yyyy-MM-dd' }}
	                        <span translate="CRI_ValidityEnd" ></span> {{cr.data.end | date : 'yyyy-MM-dd' }}
                         </td>
                         
                        
                        
                        <td width="50px;">
                             <a class="btn btn-info btn-block" ng-click="deleteCR(cr)"  translate="CRI_delete"> delete </a>
                        </td>  
	               </tr>
                 </table>
               </div>
             </div>
           
           </div>
         </section>
         
         <!------ Modal popups ------------>
         <!-- delete Consult Right -->
         <div class="modal fade" id="deleteConsultRight" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                              <h4><label translate="CRI_confirmDelete">delete name</label></h4>
                               <div>
                                 <div class="identiconWrapper">
                                     <div id="addressIdenticon" title="Address Indenticon"  blockie-address="{{del_address}}" watch-var="del_address" style="opacity:0.9;"></div>
                                 </div>
                                 <textarea  cols="9" rows="5" class="adrtxt" placeholder="{{'ID_placeholder' | translate}}" ng-model="del_address"> </textarea>
                               </div> 
                               
                               <br/>
                               
                               <div><label translate="CRI_ValidityRange"> validity</label></div>
                               <div >   
                                  <label translate="CRI_ValidityStart">From </label> 
                                  <input type="date" ng-model="del_start_date" /> 
                                  <label translate="CRI_ValidityEnd">To</label>  
                                  <input type="date" ng-model="del_end_date" />
                               </div> 
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="CRI_cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="deleteConsultRight()" translate="CRI_deleteConfirm">Delete</button>
                      </div>
                  </div>
              </div>
         </div>
         
         <!-- Create a Consultation right -->
         <div class="modal fade" id="createConsultRight" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                               <h4><label translate="CRI_Create_title">Create Consult Right</label></h4>
                               <div><label translate="CRI_TargetAddress"> address</label></div>
                               <div>
                                    <button style="width:100px;" type="button" class="btn btn-primary bellowmargin"  ng-click="contactPop()" translate="CTC_pick">ContactPop </button>
                                     
                                    <div class="pop_pane"  ng-show="showContactPop" >
                                        <div class="ctt_pop" ng-show="showContactPop">
                                            <div class="CTC_Close" ng-click="closeCttPop()" translate="TRA_Close"></div>
                                            <div class="ctt_tool">
                                                <input type="text" ng-model="ctt_filter"  placeholder="{{'CT_Filter' | translate}}" ng-change="filter_ctt()"  />
                                            </div>
                                            
                                            <div class="ctt_pop_scroll">
                                                <div class="ctt_cent">
                                                    <div ng-show="NoCtc" translate="CTC_noContacts"></div>
                                                    <div  ng-repeat="ct in contacts" class="ctt_elm">
                                                        <div>
                                                            <div  ng-click="pickCtc(ct.address,ct.name)">
                                                                <div class="identiconWrapper" style="max-width:60px;" >
                                                                    <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="{{ct.address }}"  watch-var="filtered_contacts" ></div>
                                                                </div>
                                                                <div class="ctt_txt">
                                                                {{ct.name}}&nbsp;
                                                                </div>
                                                            </div> 
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>      
                                    </div>
                               </div>
                               <div>
                                 <div class="identiconWrapper">
                                     <div id="addressIdenticon" title="Address Indenticon" ng-click="startScanAddress()" blockie-address="{{dest}}" watch-var="dest" style="opacity:0.9;"></div>
                                 </div>
                                 <textarea id="toField"  cols="9" rows="5" class="adrtxt" placeholder="{{'ID_placeholder' | translate}}" ng-model="dest"> </textarea>
                               </div> 
                               <div ng-bind-html="selectedName" style="overflow:hidden;text-align:center;max-height:21px;max-width:210px;"></div>
              
                               <br/>
                               <div><label translate="CRI_ValidityRange"> validity</label></div>
                               <div >   
                                  <label translate="CRI_ValidityStart">From </label> 
                                  <input type="date" ng-model="start_date" /> 
                                  <label translate="CRI_ValidityEnd">To</label>  
                                  <input type="date" ng-model="end_date" />
                               </div> 
                               
                               <br/>
                               <div><label translate="CRI_DisplayBalance"> Balance</label></div>
                               <div>
                                    <input type="radio" ng-model="balanceView" value="0">
                                    <span translate="OPT_no"></span>
                                    &nbsp; &nbsp; 
                                    <input type="radio" ng-model="balanceView" value="1">
                                    <span translate="OPT_yes"></span>
                               </div>        
                               
                               <br/>
                               <div><label translate="CRI_olderTran"> Older Tran</label></div>
                               <div>
                                    <input type="radio" ng-model="oldTran" value="0">
                                    <span translate="OPT_no"></span>
                                    &nbsp; &nbsp; 
                                    <input type="radio" ng-model="oldTran" value="1">
                                    <span translate="OPT_yes"></span>
                               </div>        
                               
                            
                               
                               <br/>
                               <div><label translate="DELEG_Enter_pass">Entrez votre mot de passe</label></div>

                               <div class="input-group">
                                    <input  class="form-control" type="password" Id="passFieldBal4" ng-change="passwordCheck('passFieldBal4')" placeholder="{{ 'DCRY_Placeholder_psw' | translate }}" ng-model="trPass"/>
                                    <span ng-show="fingerprint" class="input-group-addon finger" ng-click="fingetrprintUnlock()"></span>
                               </div>
                               <div id="createStatus" ></div>
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="CRI_cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="createConsultRight()" translate="CRI_create">Create</button>
                      </div>
                  </div>
              </div>
        </div>
         
       <!-- Consult Right QR -->
       <div class="modal fade" id="QR_consult_pop" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel" data-backdrop="static" data-keyboard="false">
              <div class="modal-dialog" role="document">
                  <div class="modal-content"> 
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                          <h4><label translate="CRI_QRTitle">Consultation Right:</label></h4>
                          <div>
                                <button type="button" class="btn btn-primary" translate="QR_Full" ng-click="qrRight(0)" >Full </button>
                          </div>
                          <div> &nbsp;</div>
                          <div>
                                <button type="button" class="btn btn-primary" translate="QR_1" ng-click="qrRight(1)" >1 </button>
                                <button type="button" class="btn btn-primary" translate="QR_2" ng-click="qrRight(2)" >2 </button>
                                <button type="button" class="btn btn-primary" translate="QR_3" ng-click="qrRight(3)" >3 </button>
                                <button type="button" class="btn btn-primary" translate="QR_4" ng-click="qrRight(4)" >4 </button>
                          </div> 
                          <div> &nbsp;</div>
                          <div id="qrcode_consultRight" ></div><br/>
                          <div><input  class="form-control" type="text" readonly="readonly" value="{{qr_content}}" style="max-width: 256px;" /></div>
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-primary" data-dismiss="modal" translate="CRI_close">CLose </button>
                      </div>
                  </div>
              </div>
        </div> 
        
        
        
       <!-- Scan Right QR --> 
       <div class="modal fade" id="QR_scan_pop" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel" data-backdrop="static" data-keyboard="false">
              <div class="modal-dialog" role="document">
                  <div class="modal-content"> 
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                          <h4><label translate="CRI_Import">Import Consultation Right:</label></h4>
                          <div>
                            <button type="button" class="btn btn-primary" translate="CRI_open_file" ng-click="selectFile()" ng-show="partial_prog==0" >file</button>
                            <button type="button" class="btn btn-primary" translate="CRI_scan_qr" ng-click="scanQR()" >scan </button>
                          
                           
                          </div>
                           <div> &nbsp;</div>
                         <div ng-bind-html="openStatus"></div>
                          <div> &nbsp;</div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-primary" data-dismiss="modal" translate="CRI_cancel">Cancel </button>
                      </div>
                  </div>
              </div>
        </div> 
         
         
       </div>
   </div>
