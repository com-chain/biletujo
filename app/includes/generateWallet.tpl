<div class="tab-pane active"  ng-controller='viewCtrl' >
    <!-- Ecran initial: creation du porte-feuille -->
    <div ng-if="globalService.currentTab==globalService.tabs.generateWallet.id" ng-controller='walletGenCtrl'>
      <div class="row grp" ng-show="step1_2"> 
        <div class="col-md-12 " >    
          <div class="col-md-12 " ng-show="enter_token">
           <div class="row "> 
            <div class="col-md-12 "> 
             <label translate="GEN_Enter_Token" ></label>
            </div>
           </div>
           <div class="row" ng-if="isApp"> 
            <div class="col-md-12 "> 
             <label translate="GEN_USE_BROWSER" ></label>
            <!-- <a class="btn btn-primary btn-block btnAction" ng-click="startScanToken()" translate="GEN_Scan">QR</a>-->
            </div>
           </div>
           <div class="row" ng-if="isApp"> 
            <div class="col-md-12 "> 
             &nbsp;
            </div>
           </div>
           <div class="row" ng-hide="isApp"> 
            <div class="col-md-12 "> 
             <input class="form-control" type="text" ng-model="token" /><br/>
            </div>
           </div>
           <div class="row" ng-hide="isApp"> 
            <div class="col-md-12 "> 
             <a class="btn btn-primary btn-block btnAction"  ng-click="validateToken()" translate="GEN_Token_validation">Token</a>
            </div>
           </div>
       </div>
       
       <div ng-show="showSecret">
        <div class="row" > 
         <div class="col-md-12 "> 
          &nbsp;
         </div>
        </div>
        <div class="row" > 
         <div class="col-md-12 "> 
          <label translate="GEN_pswd"> Enter a strong password (at least 9 characters) </label>
         </div>
        </div>
        <div class="row" > 
         <div class="col-md-12 "> 
           <div class="input-group">
            <input type="{{showPass && 'password' || 'text'}}" class="form-control" placeholder="{{ 'GEN_Placeholder_psw' | translate }}" ng-model="password" ng-class="isStrongPass() ? 'valid' : 'invalid'"/>
            <span class="input-group-addon eye" ng-click="showPass=!showPass"></span>
          </div> 
         </div>
        </div>
        <div class="row" > 
         <div class="col-md-12 "> 
          <p translate="GEN_Warning_1">Attention! Si vous oubliez ce mot de passe, les Lemãs contenu dans ce portefeuille seront perdus.</p>
         </div>
        </div>
        <div class="row" > 
         <div class="col-md-12 "> 
          <a class="btn btn-primary btn-block btnAction" func="generateSingleWallet" ng-click="genNewWallet()" translate="GEN_Create_1">Cr&eacute;er mon portefeuille</a>
         </div>
        </div>
       </div>
       <div class="row" > 
        <div class="col-md-12 "> 
         <p ng-bind-html="message_creation"></p>
        </div>
       </div>
       <div class="row"> 
        <div class="col-md-12 "> 
         &nbsp;
        </div>
       </div>
       <div class="row" ng-show="showSecret" > 
        <div class="col-md-12 "> 
          <a class="btn btn-info btn-block btnAction" ng-click="cancelCreate()" translate="GEN_Cancel">Annuler</a>
        </div>
       </div>
      </div>
     </div>
   
     <!-- Bottom - Display Generated Wallet -->
     <div class="row grp" ng-show="showWallet"> 
      <div class="col-md-12 ">
       <div class="row "> 
        <div class="col-md-12 "> 
          <label translate="GEN_Result">  Votre portefeuille à été créé.</label>
        </div>
       </div>
       <div class="row "> 
        <div class="col-md-12 ">
          <label translate="TRAN_Address" >Votre adresse :</label>
        </div>
       </div>
       <div class="row "> 
        <div  class="col-md-6 col-xs-6">
         <div class="identiconWrapper">
          <div id="addressIdenticon" title="Address Indenticon" blockie-address="{{wallet.getAddressString()}}" watch-var="wallet"></div>
         </div>
        </div>
        <div  class="col-md-6 col-xs-6">
         <textarea cols="9" rows="5" class="adrtxt" disabled>{{wallet.getChecksumAddressString()}} </textarea>
        </div>
       </div>
       
      
       
       
       <div class="row "> 
        <div class="col-md-12 ">
         <label translate="GEN_Save_title" >Sauvegarde de votre portefeuille : </label>
        </div>
       </div>
       <div class="row "> 
        <div class="col-md-12 ">
          <a class="btn btn-info btn-block" ng-click="saveDat()" translate="VIEW_Save"  > backup </a>
          <a style="display:none;" id="btn_dat" href="{{blobEnc}}" download="{{CUR}}_{{wallet.getAddressString()}}.dat"> </a>
        </div>
       </div>
  
       <div class="row"> 
        <div class="col-md-12 "> 
         &nbsp;
        </div>
       </div>
       <div class="row "> 
        <div class="col-md-12 ">
         <a class="btn btn-info btn-block" ng-click="printQRCode()" translate="VIEW_print"  > Imprimer une sauvegarde de votre portefeuille </a>
        </div>
       </div>

       <div class="row "> 
        <div class="col-md-12 ">
	     <label translate="GEN_Warning_2">Attention! Si vous perdez votre clé privée, les Lemãs contenu dans ce portefeuille seront perdus.</label>
	    </div>
       </div>
       
       <div class="row " ng-show="has_howto"> 
        <div class="col-md-12 ">
	      <a class="btn btn-info btn-block" ng-click="saveHow()" translate="GEN_HowTo"  > backup </a>
          <a style="display:none;" id="btn_how" href="{{howtoUrl}}" download target="_blanck"> </a>
	    </div>
       </div>
       
      <div class="row"  ng-show="has_howto"> 
        <div class="col-md-12 "> 
         &nbsp;
        </div>
       </div>
       
      <div id="qrcode_print"></div>
      <div id="qrcode_print0"></div>
      <div id="qrcode_print1"></div>
      <div id="qrcode_print2"></div>
      <div id="qrcode_print3"></div>
      
       
       <div class="row "> 
        <div class="col-md-12 ">
         <a class="btn btn-info btn-block btnAction" ng-click="display_synchro()"  translate="GEN_OK">OK</a>
        </div>
       </div>
      </div>
     </div>
     
    <div class="row grp" ng-show="show_syncro"> 
     <div class="col-md-12 ">
      <div class="row "> 
        <div class="col-md-12 ">
         <label translate="GEN_Synchro" >Synchro de votre compte </label>
        </div>
       </div>
       <div class="row "> 
         <div class="col-md-12 ">
           <div translate="GEN_Syn_phone"> </div>
         </div>
          <div class="col-md-12 ">
           <span translate="GEN_Syn_computer1"> </span>{{wallet_address}}
           <span translate="GEN_Syn_computer2"> </span>
         </div>
       </div>
       <div class="row "> 
        <div class="col-md-12 ">
         <a class="btn btn-info btn-block btnAction" ng-click="reload_acc()"  translate="GEN_Access">OK</a>
        </div>
       </div>
      </div>
     </div>
     
     
     
         <!-- confirm Modal -->
         <div class="modal fade" id="confirmCreate" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <div class="modal-body">
                          <h4 align="center">
                              <label translate="GEN_ConfirmCreate">Change name</label>
                             <div><input type="checkbox" ng-model="cond1" /> <p style="display:inline;" translate="GEN_GenCondRead">Change name</p> <a ng-click="openGenCondition()" translate="GEN_GenCondLink" style="color:#0e97c0;"></a></div><br/>
                             <div> <input type="checkbox" ng-model="cond2" /> <p style="display:inline;" translate="GEN_LostPass">Change name</p></div>
                             
                          </h4>
                      </div>
                      <div class="modal-footer text-center">
                          <button type="button" class="btn btn-default" data-dismiss="modal" translate="GEN_Cancel">Annuler </button>
                          <button type="button" class="btn btn-primary" ng-click="createWallet()" ng_show="cond1 && cond2" translate="GEN_Create">Sauver</button>
                      </div>
                  </div>
              </div>
        </div>
     
    </div>
</div>
