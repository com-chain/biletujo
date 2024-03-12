    <!-- Storage-->
    <div class="tab-pane active" ng-if="globalService.currentTab==globalService.tabs.openFromStorage.id">
      
     
       
       <div ng-controller='storageCtrl'>
         <div class="row grp"> 
         
         
         
         <div class="col-md-12 " ng-hide="isApp">
             <div class="row "> 
               <div class="col-md-12">
                 <label translate="STR_WarningBrowser" >warning browser</label>
                 <p translate="STR_WarningQuestion" >warning browser</p>
                 <p><input type="radio" ng-model="private_cmp" value="0" ng-value="0" ng-click="changePrivate();"> {{"STR_No"| translate }} &nbsp;&nbsp; <input type="radio" ng-model="private_cmp" value="1" ng-value="1" ng-click="changePrivate();"> {{"STR_Yes"| translate }}</p> 
                 <p ng-hide="private_cmp" ng-bind-html="'STR_logout' | translate">  </p>
             
                 <a class="btn btn-primary btn-block btnAction" ng-hide="private_cmp"  ng-click="clearData()" translate="STR_Clear"></a>
        
                
               </div>
             </div>
          </div>
           <div class="col-md-12 ">
             <div class="row "> 
               <div class="col-md-2">
                 <label translate="STR_yourWallets" >Vos portefeuilles :</label>
               </div>
             </div>
             
            
             <div class="row "> 
               <div class="col-md-12 ">
                  <table width="100%">
                    <tr  ng-show="NoWallet" class="tr_trans">
                         <td >
                           <p translate="STR_NoWallet" >no wallet</p>
                         </td>
                    <tr>
	                <tr  ng-repeat="wal in wallets track by $index" class="tr_trans">
	                    <td  width="49px">
	                             <img ng-src="{{wal.logo}}"  ng-show="wal.has_logo" height="40px;" width="40px;"></img>
	                    </td>
	              
                        <td  width="62px"  >
                             <a ng-click="openWallet(wal.file.address)">
                                 <div class="identiconWrapper" style="max-width:60px;">
                                     <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="0x{{wal.file.address}}"  watch-var="wallets" ></div>
                                 </div>
                             </a>
                        </td>
                        <td  >
                            <a ng-click="openWallet(wal.file.address)" style="color:black;">
                                {{wal.name}}
                            </a>
                        </td>
                        <td  width="50px;" >
                             <a class="btn btn-info btn-block" ng-click="editWall(wal.file.address,wal.name)"  translate="CTC_edit"> edit </a>
                        </td>
                        <td  width="50px;" >
                             <a class="btn btn-info btn-block" ng-click="deleteWall(wal.file.address)"  translate="STR_forget"> forget </a>
                        </td>
	               </tr>
                 </table>
               </div>
             </div>
           
           </div>
         </div>
           <!-- delete Modal -->
         <div class="modal fade" id="deleteWallet" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                              <h4><label translate="STR_confirmDelete">delete wallet</label></h4>
                              
                               <div class="identiconWrapper" style="max-width:60px;">
                                 <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="0x{{currentAddress}}"  watch-var="currentAddress" ></div>
                             </div>
                             <br/><br/>
                             
                             <div translate="STR_warning">warning</div><br/>
                             
                               <div><label translate="STR_Backup">Do a backup</label></div>
                      
                               <a class="btn btn-info btn-block" href="{{blobEnc}}" download="{{currentServer}}_0x{{currentAddress}}.dat" 
                                  translate="VIEW_Save" ng-if="!isApp"> Télécharger la Sauvegarde </a>
                               <a class="btn btn-info btn-block" ng-click="dowloadAppFile()"  translate="VIEW_Save" 
                                  ng-if="isApp"> Télécharger la Sauvegarde </a>
                          </div>
                      </div>
                      
                      
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="CTC_deleteCancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="deleteWallet()" translate="STR_forgetConfirm">Forget</button>
                      </div>
                  </div>
              </div>
        </div>
        
          <div class="modal fade" id="editWall" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                              <h4><label translate="STR_editName">Change name</label></h4>
                               <div class="identiconWrapper" style="max-width:60px;">
                                 <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="0x{{curraddress }}"  watch-var="curraddress" ></div>
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
