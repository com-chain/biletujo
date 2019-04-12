    <!-- Transactions-->
    <div class="tab-pane active" ng-if="globalService.currentTab==globalService.tabs.contacts.id">
       @@if (site === 'mew' ) {
        <div>
            <wallet-decrypt-drtv></wallet-decrypt-drtv>
        </div>
        
        <div ng-show="wallet!=null" ng-controller='contactsCtrl'>
     }
     @@if (site === 'readOnly' ) {  
        <div ng-controller='contactsCtrl'>
     }
     
         <div class="row grp"> 
           <div class="col-md-12 ">
             <div class="row "> 
               <div class="col-md-5 col-xs-5">
                 <label translate="CTC_yourContacts" >Vos contacts :</label>
                 <input type="text" ng-model="ctt_filter"  placeholder="{{'CT_Filter' | translate}}" ng-change="filter_ctt()" style="width: 80px; margin-bottom: 5px;" />
               </div>
                <div class="col-md-7 col-xs-7">
                  <button type="button" id="ajouter" class="btn btn-primary bellowmargin"  ng-click="addNamePop()" translate="CTC_add">Add </button>
                
               </div>
             </div>
            
            
             <div class="row "> 
               <div class="col-md-12 ">
                  <table width="100%" >
                    <tr  ng-show="NoCtc" class="tr_trans">
                         <td >
                           <p translate="CTC_noContacts" >no contacts</p>
                         </td>
                    <tr>
	                <tr  ng-repeat="ct in filtered_contacts track by $index" class="tr_trans">
	                  
                         <td  width="100px" ng-click="navigateSend(ct.address, ct.has_logo)" >
                             <div class="identiconWrapper" style="max-width:60px;">
                                 <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="{{ct.address }}"  watch-var="filtered_contacts" ></div>
                             </div>
                         </td>
                         
                         
                        <td  ng-show="ct.has_logo">
                            {{ct.name}}
                        </td>
                        
                         <td   ng-hide="ct.has_logo" colspan="2">
                            {{ct.name}}
                        </td>
                        
                        <td ng-show="ct.has_logo" width="39px;">
                            <img ng-src="{{ct.logo}}"   height="30px;"></img>
                        </td>
                       
                        <td width="50px;">
                              <a class="btn btn-primary btn-block"  ng-click="editCtc(ct.address,ct.name)"  translate="CTC_edit" >edit</a>
                        </td>
                        <td width="50px;">
                             <a class="btn btn-info btn-block" ng-click="deleteCtc(ct.address,ct.name)"  translate="CTC_delete"> delete </a>
                        </td>
                        
	               </tr>
                 </table>
               </div>
             </div>
           
           </div>
         </div>
         
         <!------ Modal popups ------------>
         <!-- delete Contact -->
         <div class="modal fade" id="deleteContact" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                              <h4><label translate="CTC_confirmDelete">delete name</label></h4>
                              <div class="identiconWrapper" style="max-width:60px;">
                                 <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="{{curraddress }}"  watch-var="curraddress" ></div>
                              </div><br/>
                              {{currName}} 
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="CTC_deleteCancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="deleteContact()" translate="CTC_deleteConfirm">Delete</button>
                      </div>
                  </div>
              </div>
         </div>
         
         <!-- Not the same Curr -->
         <div class="modal fade" id="alrtCurr" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                           <h4><label translate="CTC_NotSameCurrTitle">Choose address</label></h4>
                           <div><label translate="CTC_NotSameCurrTxt">Choose address</label></div>
                           
                             
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="CTC_addNameCancel">Annuler </button>
                      </div>
                  </div>
              </div>
         </div>
         
        
         <!-- add Contact -->
         <div class="modal fade" id="addName" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                           <h4><label translate="CTC_Add_ctc">Choose address</label></h4>
                           <div><label translate="CTC_chooseAddress">Choose address</label></div>
                            <div class="identiconWrapper" style="max-width:100px;">
                                 <div id="addressIdenticon" title="Address Indenticon" ng-click="startScanToAddress()" blockie-address="{{curraddress }}"  watch-var="curraddress" ></div>
                             </div>
                             <textarea cols="9" rows="5" class="adrtxt" placeholder="{{'ID_placeholder' | translate}}" ng-model="curraddress"> </textarea>
                             <div><label translate="CTC_chooseName">Choose name</label></div>
                             <input class="form-control" type="text" ng-model="currName" />
                             
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="CTC_addNameCancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="saveNewName()" translate="CTC_addNameSave">Sauver</button>
                      </div>
                  </div>
              </div>
         </div>
       
         <!-- edit Contact -->
         <div class="modal fade" id="editName" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                             <h4><label translate="CTC_editName">Change name</label></h4>
                             <div class="identiconWrapper" style="max-width:60px;">
                                 <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="{{curraddress }}"  watch-var="curraddress" ></div>
                             </div>
                             <input class="form-control" type="text" ng-model="currName" />
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="CTC_editNameCancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="saveName()" translate="CTC_editNameSave">Sauver</button>
                      </div>
                  </div>
              </div>
         </div>
         
       </div>
   </div>
