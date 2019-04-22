<!-- Action on another Account-->
<div class="tab-pane active" ng-if="globalService.currentTab==globalService.tabs.note.id">
  <div>
    <wallet-decrypt-drtv></wallet-decrypt-drtv>
  </div>
        
  <div ng-show="wallet!=null" ng-controller='noteCtrl'>
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
                             <label translate="NOT_Title" >Total positions changes</label>
                           
                         </div>
                     </div>  
                 </div> 
              </div>  
         </div> 
      </section>
    </div>
</div> 
