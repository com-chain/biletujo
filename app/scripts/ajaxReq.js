
    /* AJAX Request to the backend*/
    'use strict';

    var http;
    var ajaxReq = function() {}

    ajaxReq.http = null;
    ajaxReq.postSerializer = null;
    ajaxReq.SERVERURL = "api.php";
    ajaxReq.ENROLLURL = "enroll.php";
    ajaxReq.TRANLIST = "trnslist.php";
    ajaxReq.TRANCHECK = "api.php";
    ajaxReq.EXPORTTRAN = "export.php";
    ajaxReq.GETCODE = "getuid.php";
    ajaxReq.GETADDRESS = "getadd.php";
    ajaxReq.keystore = "keys.php";
    ajaxReq.requestMessages = "requestMessages.php";
    ajaxReq.pendingPosts = [];
    ajaxReq.config = {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}};


    ajaxReq.getBalance = function(addr, callback) {
	    this.post({balance: addr}, callback);
    }
    ajaxReq.getTransactionData = function(addr, callback) {
	    this.post({txdata: addr}, callback);
    }
    ajaxReq.sendRawTx = function(rawTx, additional_data, callback) {
        var post_data ={rawtx: rawTx};
        if (additional_data && Object.keys(additional_data) && Object.keys(additional_data).length>0){
            for (var item in additional_data){
                post_data[item]=additional_data[item];
            }
        }
	    this.post(post_data, callback);
    }
    ajaxReq.getEstimatedGas = function(txobj, callback) {
	    this.post({estimatedGas: txobj}, callback);
    }
    ajaxReq.getEthCall = function(txobj, callback) {
	    this.post({ethCall: txobj}, callback);
    }
    
     ajaxReq.getEthCallAt = function(txobj, block_nb, callback) {
         this.post({ethCallAt: txobj, blockNb: block_nb}, callback);
    }
    ajaxReq.queuePost = function() {
        var data = this.pendingPosts[0].data;
        var callback = this.pendingPosts[0].callback;
      
        try{
	        this.http.post(globalFuncs.getServerAddress()+this.SERVERURL, this.postSerializer(data), this.config).then(function(data) {
		        callback(data.data);
                ajaxReq.pendingPosts.splice(0, 1);
                if(ajaxReq.pendingPosts.length>0)
                    ajaxReq.queuePost();
	        });
        } catch(err) {
            console.log(err);
            ajaxReq.pendingPosts.splice(0, 1);
                if(ajaxReq.pendingPosts.length>0)
                    ajaxReq.queuePost();
        }
    }
    ajaxReq.post = function(data, callback) {
	    this.pendingPosts.push({data: data,callback: callback});

        if(this.pendingPosts.length==1){
            this.queuePost();
        }
    }

    ajaxReq.enrollPost = function(data,callback){
       
         this.http.post(globalFuncs.getServerAddress()+this.ENROLLURL, this.postSerializer(data), this.config).then(function(data) {
		    callback(data.data);
	    });
    }
    
    ajaxReq.validateEnrollmentLetter = function(id, currency, signature, callback){
        var data = {};
        data["id"]=id;
        data["currency"]=currency;
        data["signature"]=signature;
        ajaxReq.enrollPost({data: JSON.stringify(data)},callback);
    }
    
    ajaxReq.enrollAddress = function(id, address, currency, token, callback){
        var data = {};
        data["id"]=id;
        data["adresse"]=address;
        data["token"]=token;
	data["currency"]=currency;
        ajaxReq.enrollPost({data: JSON.stringify(data)},callback);
    }
    
    ajaxReq.getTransList = function(id,count,offset, callback){
        this.http.get(globalFuncs.getServerAddress()+ajaxReq.TRANLIST+"?addr="+id+"&count="+count+"&offset="+offset).then(function(data){
             callback(data.data);
        });
    }
    
    ajaxReq.getTransCheck = function(hash, callback){
        this.http.get(globalFuncs.getServerAddress()+ajaxReq.TRANCHECK+"?hash="+hash).then(function(data){
             callback(data.data);
        });
    }
    
    
    
    
    ajaxReq.getExportTransList = function(id,date_start,date_end, callback){
        this.http.get(globalFuncs.getServerAddress()+ajaxReq.EXPORTTRAN+"?addr="+id+"&start="+date_start+"&end="+date_end).then(function(data){
             callback(data.data);
        });
    }
    
    ajaxReq.getExportTransListWithId = function(id,date_start,date_end, callback){
        this.http.get(globalFuncs.getServerAddress()+ajaxReq.EXPORTTRAN+"?addr="+id+"&start="+date_start+"&end="+date_end).then(function(data){
             callback(data.data,id);
        });
    }
    
    ajaxReq.getCodesFromAddresses = function(addresses,currency,caller,signature, callback){
        
        var data = {};
        data["server"]=currency;
        data["caller"]=caller;
        data["signature"]=signature;
        data["addresses"]=addresses;
        
        this.http.post(globalFuncs.getServerAddress()+ajaxReq.GETCODE, this.postSerializer(data), this.config).then(function(data) {
		    callback(data.data);
	    }); 
    }
    
    ajaxReq.getAddressesFromCode = function(code,currency,caller,signature, callback){
        
        var data = {};
        data["server"]=currency;
        data["caller"]=caller;
        data["signature"]=signature;
        data["code"]=code;
        
        this.http.post(globalFuncs.getServerAddress()+ajaxReq.GETADDRESS, this.postSerializer(data), this.config).then(function(data) {
		    callback(data.data);
	    });
        
    }
    
    
    ajaxReq.getMessageKey = function(address, with_private, callback) {
        var query_string = '?addr='+encodeURIComponent(address);
        if (with_private) {
           query_string = query_string + "&private=1" ;
        }
        
        this.http.get(globalFuncs.getServerAddress()+ajaxReq.keystore+query_string).then(function(data){
             callback(data.data);
        });
    }
    
    ajaxReq.publishMessageKey = function(data_str, sign, callback) {
        var data = {};
        data["data"]=data_str;
        data["sign"]=sign;
        this.http.post(globalFuncs.getServerAddress()+ajaxReq.keystore, this.postSerializer(data), this.config).then(function(data) {
		    callback(data.data);
	    });
    }
    
     ajaxReq.requestUnlock = function(address, url, callback) {
        var data = {};
        data["address"]=address;
        this.http.post(url, this.postSerializer(data), this.config).then(function(data) {
		    callback(data);
	    });
    }
    
    ajaxReq.getReqMessages = function(add_from, add_to, callback) {
        var query_string = '?add_req='+encodeURIComponent(add_from)+ '&add_cli='+encodeURIComponent(add_to);

        this.http.get(globalFuncs.getServerAddress()+ajaxReq.requestMessages+query_string).then(function(data){
             callback(data.data);
        });
        
    }
    
    ajaxReq.publishReqMessages = function(data_str, sign, callback) {
        var data = {};
        data["data"]=data_str;
        data["sign"]=sign;
        this.http.post(globalFuncs.getServerAddress()+ajaxReq.requestMessages, this.postSerializer(data), this.config).then(function(data) {
		    callback(data.data);
	    });
    }
    
    
    ajaxReq.currBlock = function(callback){
        this.http.get(globalFuncs.getServerAddress()+ajaxReq.SERVERURL).then(function(data){
             callback(data.data);
        });
    }
    
    ajaxReq.getBlock = function(hash, callback){
         this.http.get(globalFuncs.getServerAddress()+ajaxReq.SERVERURL+"?hash="+hash).then(function(data){
             if (data.data && typeof data.data !='object'){
                 data.data = JSON.parse(data.data).transaction 
             }
                
             callback(data.data);
        });

    }
    
   

    
    
    
    

    module.exports = ajaxReq;
