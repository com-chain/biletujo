'use strict';
var walletService = function() {
 
    function loadDelay(){
      var del=0;
      try{
           del = localStorage.getItem('ComChainDelay'); 
      } catch(e){}
      if (!del){
        del=0; 
      }
      return del;
    }
    
	return {
        wallet: null,
        password:'',
        delay:loadDelay(),
        next_ok:false,
        last_usage:new Date(),
        setDelay:function(_delay){
            this.delay=_delay;
            localStorage.setItem('ComChainDelay', this.delay);
        },
        setUsed:function(){
                            this.last_usage=new Date();
                          },
        getPass:function getPass(){
          
                            if( (this.next_ok && (Date.now()-this.last_usage.getTime())<60000) 
                                || (Date.now()-this.last_usage.getTime())/1000<this.delay){
                                this.next_ok=false;
                                return this.password;
                            } else {
                                return '';
                            }
                        }
        
    }
};
module.exports = walletService;
