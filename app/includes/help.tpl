<div class="tab-pane active"  ng-controller='helpCtrl'  >

 
    <div ng-if="globalService.currentTab==globalService.tabs.help1.id||globalService.currentTab==globalService.tabs.help2.id">
     <div class="row grp" > 
      <div class="col-md-12 ">
       <div class="row "> 
        <div class="col-md-12 "> 
         <div ng-bind-html="'HELP_Creator' | translate"></div>
          <a type="button" class="btn btn-info btn-block "   ng-click="openCC()"  >Com'Chain&nbsp;&#8631; </a>
          <div ng-bind-html="'HELP_Creator_2' | translate"></div>
          <a type="button" class="btn btn-info btn-block  "   ng-click="openML()"  >Monnaie Léman&nbsp;&#8631; </a>
          <br/>
          <br/>
        </div>
        
        
        <div class="col-md-12 " ng-if="has_CGU"> 
        <div ng-bind-html="'HELP_CGU' | translate"></div>
          <a type="button" class="btn btn-info btn-block "   ng-click="openCGU()" translate="HELP_CGU_2" ></a>
        <br/>
        <br/>
       </div>
       
        
        
       <div class="col-md-12 "> 
        <div ng-bind-html="'HELP_PC' | translate"></div>
          <a type="button" class="btn btn-info btn-block "   ng-click="openPC()" translate="HELP_PC_2" ></a>
        <br/>
       </div>
        </div>
      </div>
     </div>
     </div>



    <!-- Ecran initial: creation du porte-feuille -->
    <div ng-if="globalService.currentTab==globalService.tabs.help1.id">
     <div class="row grp" > 
      <div class="col-md-12 ">
       <div class="row "> 
        <div class="col-md-12 "> 
         <div ng-bind-html="'HELP_1' | translate"></div>
             <a type="button" class="btn btn-info btn-block "   ng-click="openHelp()" translate="HELP_3" > </a>
             <br/>
        </div>
       </div>
      </div>
     </div>
    </div>
   <div ng-if="globalService.currentTab==globalService.tabs.help2.id">
     <div class="row grp" > 
      <div class="col-md-12 ">
       <div class="row "> 
        <div class="col-md-12 "> 
         <div ng-bind-html="'HELP_2' | translate"></div>
             <a type="button" class="btn btn-info btn-block "   ng-click="openHelp()" translate="HELP_3" > </a>
             <br/>
        </div>
       </div>
      </div>
     </div>
    </div>
</div>



