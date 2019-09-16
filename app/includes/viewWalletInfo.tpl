
   <!-- Ouverture d'un portefeuille -->
    <section class="tab-pane active" ng-if="globalService.currentTab==globalService.tabs.openWallet.id" ng-controller='decryptWalletCtrl'>
     <div class="row grp" >
       <div class="col-md-12 ">
         <div class="row "> 
           <div class="col-md-12 " ng-hide="showFragements">
              <label translate="OPEN_Choose_bak" >Selectionner une sauvegarde:</label>
           </div>
         </div>
         <div class="row " ng-hide="showFragements"> 
           <div class="col-md-12 ">
              <input style="display:none;" type="file" on-read-file="showContent($fileContent)" id="fselector"/>
              <a class="file-input btn btn-block btn-default btn-file marg-v-sm btn-primary" ng-click="openFileDialog()" translate="OPEN_Choose_file" >Choisir un fichier... </a>
              <a class="file-input btn btn-block btn-default btn-file marg-v-sm btn-primary" ng-click="startScanPaperWallet()" translate="OPEN_Scan_back" ng-if="isApp" >Scan d'une sauvegarde papier... </a>
              <div id="fuploadStatus" ng-bind-html="fileStatus"></div>
           </div>
         </div>
         <div class="row " ng-show="showFragements">
           <div class="col-md-12 ">
             <label translate="OPEN_partial_scan_title" >Scan Partiel:</label> <label  >{{partial_prog}}/4</label>
             
              <div ng-bind-html="fileStatusFrag"></div>
              <a class="file-input btn btn-block btn-default btn-file marg-v-sm btn-primary" ng-click="startScanPaperWallet()" translate="OPEN_Scan_next_partial">Scan d'une sauvegarde papier... </a>
               <a class="file-input btn btn-block btn-file marg-v-sm btn-primary" ng-click="cancelFragment()" translate="OPEN_cancel_partial" >cancel</a>
           </div>
         </div> 
         
         
         
         
         <div class="row " > 
           <div class="col-md-12 ">
              <label id="uploadbtntxt-wallet" ng-show="showFDecrypt" translate="OPEN_Access"> Acc&eacute;der &agrave; votre portefeuille:</label>
            </div>
         </div>
         <div class="row " > 
           <div class="col-md-12 ">    
              <a class="btn btn-primary btn-block btnAction" ng-show="showFDecrypt" ng-click="openFile();" translate="OPEN_Open">Ouvrir le portefeuille</a>
              <div ng-bind-html="decryptStatus"></div>
           </div>
         </div>
       </div>
     </div>
     
       <div class="modal fade" id="pickWalletFile" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content"> 
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <h4 align="center">
                          
                           <label translate="FILE_pickWallet">Wallet File</label>
                           <div style="height:350px;overflow-y:scroll;"> 
                           <table width="95%">
                             <tr  ng-repeat="entry in dir_entries track by $index" class="tr_trans">
	                          <td  ng-click="pickWallFile(entry.name,$index)"  > 
	                               <div ng-hide="entry.hasAddress"> <div hide="entry.hasAddress" class="file_img"></div> &nbsp;{{entry.name}}</div>
	                              <div class="identiconWrapper" style="max-width:60px;" ng-show="entry.hasAddress">
                                    <div id="addressIdenticon" title="Address Indenticon" img="1" blockie-address="{{entry.address}}"  watch-var="dir_entries" ></div>
                                  </div>
                             
                                  <textarea cols="15" rows="3" class="adrtxtSml" readonly="readonly" ng-show="entry.hasAddress" ng-model="entry.address" > </textarea>
	                            </td>
	                         </tr>
                            </table>
                            </div>
                             <label translate="FILE_selectedFile" ng_hide="SelectedFileIndex==-1">Wallet File</label>
                           <p> {{SelectedFileName}}</p>
                           
                          </h4>
                          <h6 align="center">
                            <label translate="FILE_NoFile" ng_show="len==0">No File</label>  
                          </h6>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="CTC_editNameCancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="openWallFile()" translate="FILE_open" ng_hide="SelectedFileIndex==-1">open</button>
                      </div>
                  </div>
              </div>
        </div>
     
     
     
    
     
  </section>
    <!-- / Ouverture d'un portefeuille -->
    
    

    <!-- view wallet info -->
  
    <div class="tab-pane active" ng-if="globalService.currentTab==globalService.tabs.viewWalletInfo.id">
  
        <div>
            <wallet-decrypt-drtv></wallet-decrypt-drtv>
        </div>
        
        <div  ng-show="wallet!=null" ng-controller='viewWalletCtrl' >
  
            <blocked-account-drtv> </blocked-account-drtv>
     
            <section class="row" >
              <div class="col-md-12 ">
                  <div class="row grp"> 
                   <div class="col-md-12 ">
                      <label  >{{acc_name}}</label>
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
        
            <section class="row" >
              <div class="col-md-12 ">
                <div class="row grp"> 
                   <div class="col-md-12 ">
                      <label translate="VIEW_QR" >QR Code de votre portefeuille :</label>
                   </div>
                   <div class="col-md-12 qr_wrap ">
                   
                     <div id="qr_qdd" qr-code="{{currentAddress}}" watch-var="wallet" width="100%" style=" max-width: 250px; margin-right:auto; margin-left:auto;" ></div>
                    
                     
                   </div>
                   <div class="col-md-12 ">
                     &nbsp;
                   </div>
                   <div class="col-md-6 col-xs-6" ng-if="!isApp" >
                        <a class="btn btn-info btn-block" ng-click="printAdr()"  translate="VIEW_print_adr" > Imprimer votre adressse </a>
                   </div>
                    <div class="col-md-6 col-xs-6"  >
                        <a class="btn btn-info btn-block" ng-click="printPriceTag()"  translate="VIEW_print_price" > Imprimer votre adressse </a>
                   </div>
                   <div class="col-md-12 col-xs-12" ng-if="hasBnCheck">
                        <a class="btn btn-info btn-block" ng-click="openCheckNote()"  translate="VIEW_Check_note" > Check banknote </a>
                   </div>
              </div>
            </section> 
           
           
            <div class="modal fade" id="pop_check_bill" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <div align="center">
                              <h4><label translate="BN_Check_Title" ></label></h4>                     
                               <div > 
                                  <div class="identiconWrapper" style="max-width:100px;">
                                 <div id="addressIdenticon" title="Address Indenticon" ng-click="startScanToBN()" blockie-address="{{bnaddress}}"  watch-var="bnaddress" ></div>
                             </div>
                             <textarea cols="9" rows="5" class="adrtxt" placeholder="{{'ID_placeholder' | translate}}" ng-model="bnaddress"> </textarea>
                                   
                               </div>  
                          </div>
                                 
                         <div ng-bind-html="BN_Status"></div>
 
                      </div>
                      <div class="modal-footer text-center">
                           <button type="button" class="btn btn-default" data-dismiss="modal"  translate="BN_Close">Close</button>
                          <button type="button" class="btn btn-primary" ng-click="do_check()" translate="BN_Check">Verify</button>
                          
                      </div>
                  </div>
              </div>
        </div> 
            
           <div class="modal fade" id="pop_prepare_tag" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-body">
                          <div align="center">
                              <h4><label translate="TAG_Tag_generatio_title" ></label></h4>            
                                      
                               <div>
                                  <span translate="TAG_Description" ></span>  
                                  <input class="form-control" type="text" placeholder="{{'TAG_prod_name' | translate}}" ng-model="p_name_1" />
                                  <span translate="TAG_amount" ></span> 
                                  <input class="form-control" type="text" placeholder="0.00" ng-model="p_price_1" />
                               </div>  <br/>
                                         
                               <div >
                                  <span translate="TAG_Description" ></span>  
                                  <input class="form-control" type="text" placeholder="{{'TAG_prod_name' | translate}}" ng-model="p_name_2" />
                                  <span translate="TAG_amount" ></span>  
                                  <input class="form-control" type="text" placeholder="0.00" ng-model="p_price_2" />
                               </div>  <br/>
                               
                               <div>
                                  <span translate="TAG_Description" ></span>  
                                  <input class="form-control" type="text" placeholder="{{'TAG_prod_name' | translate}}" ng-model="p_name_3" />
                                  <span translate="TAG_amount" ></span> 
                                  <input class="form-control" type="text" placeholder="0.00" ng-model="p_price_3" />
                               </div>  <br/>
                                         
                               <div >
                                  <span translate="TAG_Description" ></span>   
                                  <input class="form-control" type="text" placeholder="{{'TAG_prod_name' | translate}}" ng-model="p_name_4" />
                                  <span translate="TAG_amount" ></span>  
                                  <input class="form-control" type="text" placeholder="0.00" ng-model="p_price_4" />
                               </div>  <br/>
                          </div>
                      </div>
                      <div class="modal-footer text-center">
                           <button type="button" class="btn btn-default" data-dismiss="modal"  translate="TAG_Cancel">Annuler</button>
                          <button type="button" class="btn btn-primary" ng-click="getTagsPdf()" translate="TAG_Get">Get</button>
                          
                      </div>
                      
                     <div id="qrcode_p_1"></div>
                     <div id="qrcode_p_2"></div>
                     <div id="qrcode_p_3"></div>
                     <div id="qrcode_p_4"></div>   
                  </div>
              </div>
        </div>
            
            
            
        </div>
    </div>
    <!-- /view wallet info -->
    
  
