'use strict';
var consultService = function() {

 
    function cretateConsultRight(wallet, for_addresss, start_date, end_date){
        return "";
    }
    
    
    function loadConsults(address){
      // load local
      try{
          var consults = JSON.parse(localStorage.getItem('ComChainConsultRights')); 
      } catch(e){}
      
      if (!consults){
          consults=[]; 
      }
      
      if (address) {
        // cleaning consults
        for (var i=consults.length-1;i>=0;i--){
            if (consults[i].data.destinary != address){
                consults.splice(i,1);
            }
        }
      }
      return consults;
    }
    
    
    function loadRightFor(address){
      var consult_list = loadConsults(address);
      
      
      var result = {};
      for (var consult of consult_list) {
        try {
          let { signature, data } = consult;
          if ((new Date(data.begin)).getTime() >= (new Date()).getTime()) {
            continue
          }

          let output = $scope.qr.checkSignedQR(consult, address)
          if (typeof output === 'string') {  // Then check failed
            continue
          }
          result[data.address] = {
            "begin": new Date(data.begin),
            "viewbalance": data.viewbalance,
            "viewoldtran": data.viewoldtran,
            "messageKey": data.message_key
          }
        } catch (e) {}
      }
      
      return result;
    }
    
    
   
    function storeConsults(consults){
      localStorage.setItem('ComChainConsultRights',JSON.stringify(consults));
    }
    
   
    // Add a new consults
    function addConsult(consult){ 
        var list = loadConsults();
        
        // look for duplicata
        var duplicate = false;
        for (var i=list.length-1;i>=0;i--){
            if (list[i].signature.r == consult.signature.r){
                duplicate = true;
            }
        }
        
        if(!duplicate){
            list.push(consult);
            storeConsults(list);
        }
        
    }
    
    
    // Delete an existing contact
    function deleteConsult(consult){
        var list = loadConsults();
        var index=-5;
        for (var i=list.length-1;i>=0;i--){
            if (list[i].signature.r == consult.signature.r){
                index = i;
                break;
            }
        }
        
        if (index >=0) {
            list.splice(index,1);
            storeConsults(list);
        }
    }
    
    
    
    return {cretateConsultRight:cretateConsultRight,
            loadConsults:loadConsults,
            storeConsults:storeConsults,
            addConsult:addConsult,
            deleteConsult:deleteConsult,
            loadRightFor:loadRightFor
    }
   
};
module.exports = consultService;
