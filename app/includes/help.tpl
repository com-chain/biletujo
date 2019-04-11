<div class="tab-pane active"  ng-controller='viewCtrl'  >
    <!-- Ecran initial: creation du porte-feuille -->
    <div ng-if="globalService.currentTab==globalService.tabs.help1.id">
     <div class="row grp" > 
      <div class="col-md-12 ">
       <div class="row "> 
        <div class="col-md-12 "> 
         <div ng-bind-html="'HELP_1' | translate"></div>
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
        </div>
       </div>
      </div>
     </div>
    </div>
</div>



