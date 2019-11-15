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
        var index=-1;
        for (var i=list.length-1;i>=0;i--){
            if (list[i].signature.r == consult.signature.r){
                index = i;
            }
        }
        
        if (index >=0) {
            list.splice(i,1);
        }
        storeConsults(list);
    }
    
    
    
    return {cretateConsultRight:cretateConsultRight,
            loadConsults:loadConsults,
            storeConsults:storeConsults,
            addConsult:addConsult,
            deleteConsult:deleteConsult
    }
   
};
module.exports = consultService;
