
    /* AJAX Request to the backend*/
    'use strict';
    
    
  var isSuccess = function(status) {
        return 200 <= status && status < 300;
  }  
    
  var http = {};
  http.get = function(url){
      return new Promise(function(resolve, reject) {
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function()  {
            if (this.readyState == 4) {
                var json_obj = {};
                var error = true;
                try {
                    json_obj=JSON.parse(this.response);
                    error = false;
                } catch(err) {}
                
                var resp_obj = {
                    data: json_obj,
                    status: this.status,
                    headers: '',
                    config: '',
                    statusText: this.statusText
                };    
                    
                if (isSuccess(this.status) && !error) {
                    resolve(resp_obj);
                } else {
                    reject(resp_obj);
                }
            }
          };
          xhttp.open("GET", url, true);
          xhttp.send();
      
      }); 
  }
 
  
  
  http.post = function(url, data, config){
      return new Promise(function(resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                var json_obj = {};
                var error = true;
                try {
                    json_obj=JSON.parse(this.response);
                    error = false;
                } catch(err) {}
                
                var resp_obj = {
                    data: json_obj,
                    status: this.status,
                    headers: '',
                    config: '',
                    statusText: this.statusText
                };    
                    
                if (isSuccess(this.status) && !error) {
                    resolve(resp_obj);
                } else {
                    reject(resp_obj);
                }
            }
          };
        xhttp.open('POST', url, true);

    // set headers
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');


    // send request
    xhttp.send(data);


   }); 
  }
 
    
    
    
    
    
    
    
    
    
////////////////////////////// 
   var isScope= function(obj) {
                return obj && obj.$evalAsync && obj.$watch;
            }
          var isWindow = function(obj) {
                return obj && obj.window === obj;
            }
            var toJsonReplacer = function (key, value) {
                var val = value;
                if (typeof key === 'string' && key.charAt(0) === '$' && key.charAt(1) === '$') {
                    val = undefined;
                } else if (isWindow(value)) {
                    val = '$WINDOW';
                } else if (value && window.document === value) {
                    val = '$DOCUMENT';
                } else if (isScope(value)) {
                    val = '$SCOPE';
                }
                return val;
                
            }        
            
            var isNumber = function(arg) {
            return typeof arg === 'number';
        }
        
        var toJson = function(obj, pretty) {
                if (isUndefined(obj))
                    return undefined;
                if (!isNumber(pretty)) {
                    pretty = pretty ? 2 : null;
                }
                return JSON.stringify(obj, toJsonReplacer, pretty);
            }
            var isDate = function(value) {
                return toString.call(value) === '[object Date]';
            }
            
            var isObject = function(value) {
                return value !== null && typeof value === 'object';
            }
var serializeValue = function(v) {
                if (isObject(v)) {
                    return isDate(v) ? v.toISOString() : toJson(v);
                }
                return v;
}
                
var encodeUriQuery = function(val, pctEncodeSpaces) {
                return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%3B/gi, ';').replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
            }
            
var isArray = function(arg) {
                if (Array.isArray) {
                    return Array.isArray(arg);
                }
                return objectToString(arg) === '[object Array]';
            }

var isUndefined = function(value) {
                return typeof value === 'undefined';
            }

var forEachSorted = function(obj, iterator, context) {
                var keys = Object.keys(obj).sort();
                for (var i = 0; i < keys.length; i++) {
                    iterator.call(context, obj[keys[i]], keys[i]);
                }
                return keys;
            }    
    

var HttpParamSerializerProvider = function (params) {
    if (!params)
        return '';
    var parts = [];
    serialize(params, '', true);
    return parts.join('&');
    
    function serialize(toSerialize, prefix, topLevel) {
        if (toSerialize === null || isUndefined(toSerialize))
            return;
        if (isArray(toSerialize)) {
            forEach(toSerialize, function(value, index) {
                serialize(value, prefix + '[' + (isObject(value) ? index : '') + ']');
            });
        } else if (isObject(toSerialize) && !isDate(toSerialize)) {
            forEachSorted(toSerialize, function(value, key) {
                serialize(value, prefix + (topLevel ? '' : '[') + key + (topLevel ? '' : ']'));
            });
        } else {
            parts.push(encodeUriQuery(prefix) + '=' + encodeUriQuery(serializeValue(toSerialize)));
        }
    }
}



                       


////////////////////////////////////////////

    var ajaxReq = function() {}

    ajaxReq.http = http;
    ajaxReq.postSerializer = HttpParamSerializerProvider;
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
	        this.http.post(jsc3l_customization.getEndpointAddress()+this.SERVERURL, this.postSerializer(data), this.config).then(function(data) {
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
       
         this.http.post(jsc3l_customization.getEndpointAddress()+this.ENROLLURL, this.postSerializer(data), this.config).then(function(data) {
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
        this.http.get(jsc3l_customization.getEndpointAddress()+ajaxReq.TRANLIST+"?addr="+id+"&count="+count+"&offset="+offset).then(function(data){
             callback(data.data);
        });
    }
    
    ajaxReq.getTransCheck = function(hash, callback){
        this.http.get(jsc3l_customization.getEndpointAddress()+ajaxReq.TRANCHECK+"?hash="+hash).then(function(data){
             callback(data.data);
        });
    }
    
    
    
    
    ajaxReq.getExportTransList = function(id,date_start,date_end, callback){
        this.http.get(jsc3l_customization.getEndpointAddress()+ajaxReq.EXPORTTRAN+"?addr="+id+"&start="+date_start+"&end="+date_end).then(function(data){
             callback(data.data);
        });
    }
    
    ajaxReq.getExportTransListWithId = function(id,date_start,date_end, callback){
        this.http.get(jsc3l_customization.getEndpointAddress()+ajaxReq.EXPORTTRAN+"?addr="+id+"&start="+date_start+"&end="+date_end).then(function(data){
             callback(data.data,id);
        });
    }
    
    ajaxReq.getCodesFromAddresses = function(addresses,currency,caller,signature, callback){
        
        var data = {};
        data["server"]=currency;
        data["caller"]=caller;
        data["signature"]=signature;
        data["addresses"]=addresses;
        
        this.http.post(jsc3l_customization.getEndpointAddress()+ajaxReq.GETCODE, this.postSerializer(data), this.config).then(function(data) {
		    callback(data.data);
	    }); 
    }
    
    ajaxReq.getAddressesFromCode = function(code,currency,caller,signature, callback){
        
        var data = {};
        data["server"]=currency;
        data["caller"]=caller;
        data["signature"]=signature;
        data["code"]=code;
        
        this.http.post(jsc3l_customization.getEndpointAddress()+ajaxReq.GETADDRESS, this.postSerializer(data), this.config).then(function(data) {
		    callback(data.data);
	    });
        
    }
    
    
    ajaxReq.getMessageKey = function(address, with_private, callback) {
        var query_string = '?addr='+encodeURIComponent(address);
        if (with_private) {
           query_string = query_string + "&private=1" ;
        }
        
        this.http.get(jsc3l_customization.getEndpointAddress()+ajaxReq.keystore+query_string).then(function(data){
             callback(data.data);
        });
    }
    
    ajaxReq.publishMessageKey = function(data_str, sign, callback) {
        var data = {};
        data["data"]=data_str;
        data["sign"]=sign;
        this.http.post(jsc3l_customization.getEndpointAddress()+ajaxReq.keystore, this.postSerializer(data), this.config).then(function(data) {
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

        this.http.get(jsc3l_customization.getEndpointAddress()+ajaxReq.requestMessages+query_string).then(function(data){
             callback(data.data);
        });
        
    }
    
    ajaxReq.publishReqMessages = function(data_str, sign, callback) {
        var data = {};
        data["data"]=data_str;
        data["sign"]=sign;
        this.http.post(jsc3l_customization.getEndpointAddress()+ajaxReq.requestMessages, this.postSerializer(data), this.config).then(function(data) {
		    callback(data.data);
	    });
    }
    
    
    ajaxReq.currBlock = function(callback){
        this.http.get(jsc3l_customization.getEndpointAddress()+ajaxReq.SERVERURL).then(function(data){
             callback(data.data);
        });
    }
    
    ajaxReq.getBlock = function(hash, callback){
         this.http.get(jsc3l_customization.getEndpointAddress()+ajaxReq.SERVERURL+"?hash="+hash).then(function(data){
             if (data.data && typeof data.data !='object'){
                 data.data = JSON.parse(data.data).transaction 
             }
                
             callback(data.data);
        });

    }
    
   

    
    
    
    

    module.exports = ajaxReq;
