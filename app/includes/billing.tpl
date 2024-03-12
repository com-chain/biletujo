<!-- Action on another Account-->
<div class="tab-pane active" ng-if="globalService.currentTab==globalService.tabs.billing.id">
  <div>
    <wallet-decrypt-drtv></wallet-decrypt-drtv>
  </div>
        
  <div ng-show="wallet!=null" ng-controller='billingCtrl'>
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
                     <label translate="BIL_Title" >Total positions changes</label>
                   
                 </div>
                 </div>  
             </div>  
             <div class="col-md-12 ">
             <div class="row "> 
                 <div class="col-md-12 ">
                      <button type="button" class="btn btn-info" ng-click="openGetAdd()"  translate="BIL_Btn_getAdd" > Get Address </button>     
                 </div>
                 </div>  
             </div>  
              <div class="col-md-12 ">
             <div class="row "> 
                  <div class="col-md-12 ">
                     &nbsp;
                 </div>
              </div>  
             </div>  
           <div class="col-md-12 ">
             <div class="row "> 
                  <div class="col-md-12 ">
                     <label translate="BIL_Between" >Between</label>
                 </div>
              </div>  
             </div>  
           <div class="col-md-12 ">
             <div class="row "> 

                 <div  class="col-md-12">
                     <input type="date" ng-model="start_date" /> 
                     <label translate="BIL_and"> and </label>  
                     <input type="date" ng-model="end_date" />
                                
                 </div>
             </div>  
             </div>  
           <div class="col-md-12 ">
             <div class="row "> 

                 <div  class="col-md-12">
                      <a class="btn btn-info " ng-click="exportPositions()"  translate="BIL_Btn_Export" > Export position changes </a>           
                 </div>
            </div>  
             </div>  
                 <div class="col-md-12 ">
             <div class="row "> 

                 <div  class="col-md-12">
                    &nbsp;          
                 </div>
            </div>  
             </div>  
           <div class="col-md-12 ">
             <div class="row "> 

                       
                 <div class="col-md-4 col-xs-4">
                    <label translate="BIL_Account_list" >For the Account list:</label>
                 </div>
                 <div class="col-md-8 col-xs-8"> 
                   <a type="button" id="exporter" title="Exporter" class="btn btn-primary bellowmargin" href="{{blobAddList}}" download="Address_List.dat"  translate="BIL_ExpList" ng-if="!isApp">Export </a>
                   <button type="button" class="btn btn-primary bellowmargin"  ng-click="exportAddList()" translate="BIL_ExpList" ng-if="isApp">Export </button>
              
                    
                    
                    <button type="button" class="btn btn-primary bellowmargin"  ng-click="openImportList()" translate="BIL_ImpList" >Import </button>
                    <button type="button" class="btn btn-primary bellowmargin"  ng-click="addAddress()" translate="BIL_AddAdd" >Add </button> 
                    <button type="button" class="btn btn-primary bellowmargin"  ng-click="clearAddresses()" translate="BIL_DelAdd" >Del </button>
                 </div>
                 </div>  
             </div>  
           <div class="col-md-12 ">
             <div class="row "> 
  
                  <div class="col-md-12 ">
                    <table width="100%">
                        <tr ng-show="showNone" class="tr_trans">
                         <td colspan="3">
                            <p translate="BIL_NoAdd" >Nones</p>
                         </td>
	                   </tr>
	                <tr  ng-repeat="curr_address in addree_list track by $index" class="tr_trans">
                         <td width="100px">
                             <div class="identiconWrapper without_text_tr">
                                 <div id="addressIdenticon" title="Address Indenticon" img="1" 
                                      blockie-address="{{curr_address }}"  watch-var="curr_address" ></div>
                             </div>
                         </td>
                         <td >
                            <textarea cols="23" rows="2"  readonly="readonly">{{curr_address}} </textarea>
                         </td>
                         
                        <td >
                            <button type="button" class="btn btn-primary bellowmargin"  ng-click="confirmDelete(curr_address)" translate="BIL_DelAdd" >Del </button>
                       </td>
	               </tr>
                 </table>
               </div>
                </div>  
             </div>  

               
              </div>
          </div>
      </section>  
         
      <!-- Popups -->
      
      <!-- Popup Address List -->
      <div class="modal fade" id="pop_getAdd" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <div class="modal-body">
                      <div align="center">
                           <h4><label translate="BIL_GetAdd_title">Get Address from Code</label></h4>
                           <label translate="BIL_code_input">Code to search</label><br/>
                           <textarea cols="23" rows="2" placeholder="{{'BIL_Code_placeholder' | translate}}" ng-model="input_code" ng-change="codeChanged()"> </textarea>
                           <br/>
                           <button type="button" class="btn btn-primary" ng-show="showCodeSearch" ng-click="searchAddfromCode()" translate="BIL_SearchAdd">Search</button><br/> 
                           <div  ng-bind-html="searchStatus"></div> <br/>
                           
                           
                    <table width="100%">
                    <tr  class="tr_trans" ng-show="no_acc">
                         <td width="100px">
                            <label translate="BIL_NoAdd">No Account</label>
                        </td>
                    </tr>
	                <tr  ng-repeat="curr_address in addressCode_list track by $index" class="tr_trans">
                         <td width="100px">
                             <div class="identiconWrapper without_text_tr">
                                 <div id="addressIdenticon" title="Address Indenticon" img="1" 
                                      blockie-address="{{curr_address.add }}"  watch-var="address_list" ></div>
                             </div>
                         </td>
                         <td >
                            <textarea cols="23" rows="2"  readonly="readonly">{{curr_address.add}} </textarea>
                         </td>
                         <td >
                            {{curr_address.stat}} 
                         </td>
                         
                       
	               </tr>
                 </table>
               
                           
                           
                           
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-primary" data-dismiss="modal" translate="BIL_Close">Anula</button>
                      </div>
                  </div>  
               </div>
           </div>
      </div>
      
      
      <!-- Popup fun progress -->
      <div class="modal fade" id="pop_progress" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <div class="modal-body">
                      <div align="center">
                           <h4><label translate="BIL_Progress_title">Progress</label></h4>
                           <div>{{exportCurrent}}/{{exportTotal}}</div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-primary" ng-click="cancelExport()" translate="BIL_Cancel">Anula</button>
                      </div>
                  </div>  
               </div>
           </div>
      </div>
     
      <!-- Popup Import list -->
        <div class="modal fade" id="pop_import_list" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                              <h4><label translate="BIL_Import_file_title">Import</label></h4>
                              <input style="display:none;" type="file" on-read-file="openListFile($fileContent)" id="flstselector"/>
                              <div>
                                <button type="button" class="btn btn-primary"  ng-click="selectListFile()" translate="BIL_SelectFile">Import </button>
                              </div>
                              <div ng-hide="file_number==-1" ng-bind-html="current_file"> </div>
                              
                              <div ng-hide="file_number==-1"  >{{file_number}} <span translate="BIL_AddressToImport">Address </span></div> 
                             
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="BIL_Cancel">Annuler </button>
                          <button type="button" ng-hide="file_number<1" class="btn btn-primary" ng-click="importList()" translate="BIL_ImportSave">Sauver</button>
                      </div>
                  </div>
              </div>
        </div>
         
       <!-- select file -->
       <div class="modal fade" id="pop_pick_file" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
            <div class="modal-dialog" role="document">
                 <div class="modal-content">
                      <div class="modal-body">
                           <div align="center">
                               <h4><label translate="BIL_SelectFile">List File</label></h4>
                               <div style="height:350px;overflow-y:scroll;"> 
                                   <table width="95%">
                                       <tr  ng-repeat="entry in dir_entries track by $index" class="tr_trans">
	                                     <td  ng-click="pickListFile(entry.name,$index)"  ><div hide="entry.hasAddress" class="file_small_img"></div>  &nbsp;{{entry.name}} </td>
	                                   </tr>
                                    </table>
                                </div>
                                <label translate="BIL_selectedFile" ng_hide="SelectedFileIndex==-1">List File</label>
                                <div> {{SelectedFileName}}</div>    
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" ng-click="cancelPickListFile()" translate="BIL_Cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="openPickedListFile()" translate="FILE_open" ng_hide="SelectedFileIndex==-1">open</button>
                      </div>
                  </div>
              </div>
        </div>
      
      <!-- Popup Add Address -->
         <div class="modal fade" id="pop_addAdd" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                           <h4><label translate="BIL_AddAddress_title">Add Account</label></h4>
                           <div><label translate="BIL_chooseAddress">Choose address</label></div>
                            <div class="identiconWrapper" style="max-width:100px;">
                                 <div id="addressIdenticon" title="Address Indenticon" ng-click="startScanToAddress()" blockie-address="{{curr_new_address}}"  watch-var="curr_new_address" ></div>
                             </div>
                             <textarea cols="9" rows="5" class="adrtxt" placeholder="{{'ID_placeholder' | translate}}" ng-model="curr_new_address"> </textarea>
                          </div>
                      </div><br/>
                      <div  ng-bind-html="addStatus"></div> 
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="BIL_Cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="saveNewAddress()" translate="BIL_Save">Sauver</button>
                      </div>
                  </div>
              </div>
         </div>
      
      <!-- Popup confirm delete -->
      <div class="modal fade" id="pop_delAdd" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                           <h4><label translate="BIL_DelAddress_title">remove Account</label></h4>
                            <div class="identiconWrapper" style="max-width:100px;">
                                 <div id="addressIdenticon" title="Address Indenticon" blockie-address="{{curr_new_address}}"  watch-var="curr_new_address" ></div>
                             </div>
                             <textarea cols="9" rows="5" class="adrtxt" placeholder="{{'ID_placeholder' | translate}}" ng-model="curr_new_address" readonly="readonly"> </textarea>
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="BIL_Cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="deleteAddress()" translate="BIL_RemoveAdd">Remove</button>
                      </div>
                  </div>
              </div>
         </div>
  
        <div class="modal fade" id="pop_delAllAdd" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                           <h4><label translate="BIL_DelAllAddress_title">EmptyList</label></h4>
                            
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="BIL_Cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="deleteAllAddress()" translate="BIL_RemoveAdd">Remove</button>
                      </div>
                  </div>
              </div>
         </div>
       
     
    </div>
</div> 
