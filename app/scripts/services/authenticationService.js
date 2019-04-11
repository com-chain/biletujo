'use strict';
var authenticationService = function() {

    function toHex(str) {
           var hex = ''
           for(var i=0;i<str.length;i++) {
                  hex += ''+str.charCodeAt(i).toString(16)
           }
           return hex
    }

    function authenticate(addr){
           globalFuncs.getChallenge(addr.getAddressString(),function(ret){
               try{
                   var json_obj = JSON.parse(ret);
                   if (json_obj.Challenge){
                       var authChallenge  = json_obj.Challenge;
                   }else{
		               var authChallenge = "";
		           }
               } catch (e){
			        var authChallenge = "NA";
	           }
	           var address = addr.getAddressString();
	           var challenge = authChallenge
	           var msg=ethUtil.toBuffer(challenge);
	           var msgHash = ethUtil.hashPersonalMessage(msg);
	           var signature = ethUtil.ecsign(msgHash,addr.getPrivateKey());
               var sign = ethUtil.bufferToHex(Buffer.concat([ signature.r, signature.s, ethUtil.toBuffer(signature.v) ]))
	           console.log('Signature: ' + sign);
	           sendAuthResponse(address,sign);
           });
    }
    
    function sendAuthResponse(addr,signature){
           globalFuncs.sendChallengeResponse(addr,signature,function(ret){
               try{
                   var json_obj = JSON.parse(ret);
                    if (json_obj.Address){
                       var authAddress  = json_obj.Address;
                    }
               } catch (e){}
              
           });
    }
    
    function logOff(){
           globalFuncs.sendLogOff(function(ret){
               try{
                   var json_obj = JSON.parse(ret);
                    if (json_obj.Address){
                       var authAddress  = json_obj.Address;
                    }
               } catch (e){}
              
           });
    }
    
   


    
    return {authenticate:authenticate,
            logOff:logOff
            
    }
   
};
module.exports = authenticationService;
