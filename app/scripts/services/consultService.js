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
       
                // extract the signature
                var v = consult.signature.v;
                var r = consult.signature.r; 
                var s = consult.signature.s; 

                // get the hash
                var str_content = JSON.stringify(consult.data);
                var hash = ethUtil.sha3(str_content);
                
                // check the signature
                var public_sign_key = ethUtil.ecrecover(hash, v, r, s);
                var rec_address = ethUtil.bufferToHex(ethUtil.publicToAddress(public_sign_key));
                
                if (rec_address == consult.data.address && 
                    consult.data.destinary == address && 
                    (new Date(consult.data.end)).getTime() > (new Date()).getTime()  &&
                    (new Date(consult.data.begin)).getTime() < (new Date()).getTime()) {   
                
                       result[consult.data.address] = {"begin":new Date(consult.data.begin), 
                                                       "viewbalance":consult.data.viewbalance, 
                                                       "viewoldtran": consult.data.viewoldtran,
                                                       "messageKey": consult.data.message_key};
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
