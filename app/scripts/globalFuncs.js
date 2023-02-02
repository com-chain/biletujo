'use strict';
var globalFuncs = function() {}
 /*
 globalFuncs.eLemTransfert = "0xa5f7c148";
 globalFuncs.lemanexTransfert = "0x60ca9c4c";
 globalFuncs.fondTransfert = "0x00d24387";
 
 globalFuncs.slockitSetTax = "0xf6f1897d"; 
 globalFuncs.slockitSetTaxLeg = "0xfafaf4c0"; 
 globalFuncs.slockitSetTaxAccount = "0xd0385b5e"; 
 globalFuncs.slockitSetOwnerAccount = "0xf2fde38b"; 
 
 globalFuncs.slockitSetAccountParam = "0x848b2592";
 globalFuncs.slockitPledge = "0x6c343eef";

 globalFuncs.delegate = "0x75741c79";
 
 globalFuncs.approve = "0xd4e12f2e";
 
 globalFuncs.transfertFrom = "0x58258353";
 globalFuncs.transfertCMFrom = "0x2ef9ade2";
 
 globalFuncs.transfertOnBehalfNant = "0x1b6b1ee5";
 globalFuncs.transfertOnBehalfCM = "0x74c421fe";
 
 globalFuncs.dissAccepted = "0xccf93c7a";

 globalFuncs.dissRejected = "0x88759215";
 

 globalFuncs.payRequestNant = "0x132019f4";
 globalFuncs.payRequestCM = "0x1415707c";
 globalFuncs.cancelRequest = "0xaf98f757";*/
 
 
// globalFuncs.setAccountsContracts = "0x14ea14f5";
 globalFuncs.contactsOf = "0xd548bf2c";
 
 //globalFuncs.setAccountsMemos = "0x166cf727";
 globalFuncs.memosOf = "0x39642b96";
 
 ///////////////////////////////////////////////////////////////////////////
 

 globalFuncs.multicurr = true;
 
 globalFuncs.nonce = 0;
 
///////////////////////////////////////////////////////////////////////////
  globalFuncs.ipfsCat = "/ipfscat.php";
  globalFuncs.ipfsAdd = "/ipfsadd.php";
  globalFuncs.authChallenge = "/auth.php";
  
  globalFuncs.getNumber = function(data, ratio){
        var short_data = '0x'+ data.slice(-12);
        var a = parseInt(short_data, 16);
        
        if (a>(34359738368*4096)){
            a=a-68719476736*4096
        }
        
        return a/ratio;
        
    }
    

    
    globalFuncs.encodeNumber=function(number){
         var valueHex;
         if (number<0){
            valueHex = jsc3l.ethFuncs.padLeft(new BigNumber(16).pow(64).plus(number).toString(16), 64);
         } else{
            valueHex = jsc3l.ethFuncs.padLeft(new BigNumber(number).toString(16), 64);
         }
         
         return valueHex;
    }
    
 /*** contract 3***/
 globalFuncs.setContactHash = function(wallet, contact_hash, callback){  
     jsc3l.bcTransaction.setContactHash(wallet, 32,46,contact_hash).then((res)=>callback(res));
 }
 
 globalFuncs.setMemoHash = function(wallet, memo_hash, callback){     
     jsc3l.bcTransaction.setMemoHash(wallet, 32,46,memo_hash).then((res)=>callback(res));     
 }
 
 globalFuncs.getContactHash = async function(walletAddress,callback){
        var userInfo = jsc3l.ethFuncs.getDataObj(jsc3l.customization.getContract3(),  globalFuncs.contactsOf, [jsc3l.ethFuncs.getNakedAddress(walletAddress)]);
        const data = await jsc3l.ajaxReq.getEthCall(userInfo)
                var length_str = data.substring(66,130);
                var length = 2*globalFuncs.getNumber(length_str,1);
                var hash = data.substring(130,130+length);
			    return hash;
  }
  
  globalFuncs.getMemoHash = async function(walletAddress,callback){
        var userInfo = jsc3l.ethFuncs.getDataObj(jsc3l.customization.getContract3(),  globalFuncs.memosOf, [jsc3l.ethFuncs.getNakedAddress(walletAddress)]);
	    const data = await jsc3l.ajaxReq.getEthCall(userInfo)
			    var length_str = data.substring(66,130);
                var length = 2*globalFuncs.getNumber(length_str,1);
                var hash = data.substring(130,130+length);
			    return hash;
  }
  
 
  
  /********************************************************/
  globalFuncs.storeOnIpfs = function (crypted_data,callback){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', jsc3l.connection.endpoint+ globalFuncs.ipfsAdd, true); //
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function (oEvent) {  
    if (xhr.readyState === 4) {  
        if (xhr.status === 200) { 
          try{
             var to_push = xhr.response;
             callback(to_push);
          } catch(e){
            callback(null);  
          }  
        } else {  
           callback(null);
        }  
        }  
    }; 

    var  urlEncodedDataPairs  = 'data='+encodeURIComponent(JSON.stringify(crypted_data));
    xhr.send(urlEncodedDataPairs);
  }
  
  globalFuncs.readFromIpfs = async function (hash) {
    return new Promise(function (resolve, reject) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', jsc3l.connection.endpoint+ globalFuncs.ipfsCat+'?addr=' +hash, true); //
    xhr.responseType = 'json';
    xhr.onreadystatechange = function (oEvent) {  
    if (xhr.readyState === 4) {  
        if (xhr.status === 200) { 
          try{
             var to_push = xhr.response;
             if(typeof to_push !='object'){
                to_push = JSON.parse(xhr.response);
             }  
             resolve(to_push);
          } catch(e){
            resolve(null);  
          }  
        } else {  
           resolve(null);
        }  
        }  
    }; 

    xhr.send();
    });
  }
  
   /*******************************************************/
  
  globalFuncs.getChallenge = function (addr,callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', jsc3l.connection.endpoint+ globalFuncs.authChallenge+'?addr=' +encodeURIComponent(addr), true); //
    xhr.onreadystatechange = function (oEvent) {  
    if (xhr.readyState === 4) {  
        if (xhr.status === 200) { 
          try{
             var to_push = xhr.response;
             callback(to_push);
          } catch(e){
            callback(null);  
          }  
        } else {  
           callback(null);
        }  
        }  
    }; 

    xhr.send();
  }
  
  globalFuncs.sendChallengeResponse = function (addr,signature,callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', jsc3l.connection.endpoint+ globalFuncs.authChallenge+'?addr=' +encodeURIComponent(addr)+'&sign='+encodeURIComponent(signature), true); //
    xhr.onreadystatechange = function (oEvent) {  
    if (xhr.readyState === 4) {  
        if (xhr.status === 200) { 
          try{
             var to_push = xhr.response;
             callback(to_push);
          } catch(e){
            callback(null);  
          }  
        } else {  
           callback(null);
        }  
        }  
    }; 

    xhr.send();
  }
  
  globalFuncs.sendLogOff = function (callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', jsc3l.connection.endpoint+ globalFuncs.authChallenge+'?addr=' +encodeURIComponent('0x0'), true); //
    xhr.onreadystatechange = function (oEvent) {  
    if (xhr.readyState === 4) {  
        if (xhr.status === 200) { 
          try{
             var to_push = xhr.response;
             callback(to_push);
          } catch(e){
            callback(null);  
          }  
        } else {  
           callback(null);
        }  
        }  
    }; 

    xhr.send();
  }
  
  /*****************************************************************************/
  
  


globalFuncs.loadWallet = async function(wallet){
    localStorage.removeItem("ComChainContacts");
    localStorage.removeItem("ComChainContactsInfo");
    localStorage.removeItem("ComChainMemos");
    if (!wallet.server || !wallet.server.name){
        var new_name = jsc3l.customization.getCurrencyName();
        
        if (new_name==''){    /*Fall back to avoid alreay created Monnaie-Leman account to provide the server name*/   
           new_name = "Monnaie-Leman"; 
        }
        
        wallet.server={"name":new_name};
    }
    
    
    localStorage.setItem('ComChainWallet',JSON.stringify(wallet) ); 
    var server_name = '';
    if (wallet.server && wallet.server.name){
        server_name = wallet.server.name;
    }
    if (server_name==''){
        return false;
    } else {
        var result = await jsc3l.connection.getConfJSON(server_name);
            if (result) {
                return result;
            } else {
                var result = await jsc3l.connection.getConfJSON(server_name);
                return result;
            }
        
    }
}

globalFuncs.removeWallet = function(){
    localStorage.removeItem('ComChainWallet');
    localStorage.removeItem("ComChainContacts");
    localStorage.removeItem("ComChainContactsInfo");
    localStorage.removeItem("ComChainMemos");
    localStorage.removeItem('ComChainServerConf'); 
}



//////////////////////////////////////////////
/// Note checking 

globalFuncs.isValidBNValue= function(value){
    var notes = jsc3l.customization.getNoteValues();
    if (notes && notes.length>0){
       for (var index in notes){
          if( Math.round(100*Number(value))== Math.round(100*Number(notes[index]))){
              return true;
          }
       } 
    }
    return false;
}



  ////////////////////////////////////////////////////////////////////////////
  ////   Custo on the fly 

    globalFuncs.updateCss = function (preventLoadingRemoval) {
      // replace the CSS references into the DOM

      if (!jsc3l.connection.endpoint) return

      var oldlink = document.getElementsByTagName("link").item(0);
      var newlink = document.createElement("link");
      newlink.setAttribute("rel", "stylesheet");
      newlink.setAttribute("type", "text/css");
      newlink.setAttribute("href", jsc3l.customization.getCssUrl());
      document.getElementsByTagName("head").item(0).appendChild(newlink);


      if (!preventLoadingRemoval) {
        globalFuncs.hideLoadingWaiting();
      }
    }
    
    
    globalFuncs.currencies=conf_locale.server.currencies;
    globalFuncs.getCurrencies = function(){
        globalFuncs.currencies=jsc3l.customization.getCurrencies();    
    }


   
/// Address
   
globalFuncs.parseAddress = function(text){
    text=text.trim();
    
    var re = new RegExp('^0x[0123456789ABCDEFabcdef]{40}$');
    if (text.startsWith('0x')){
        if (re.test(text)){
            return {"address":text};
        } else {
            return {"error":true};
        }
        
    } else {
        try{
            var result = JSON.parse(text);
            if (result.address && result.address.startsWith('0x')){
                 if (re.test(result.address)){
                    return result;
                } else {
                    return {"error":true};
                }
            } else {
                return {"error":true};
            }
        }
        catch(e){
            return {"error":true};
        }
    }
}

    
/// Notifications

globalFuncs.notify = function(title, text){
    
    if (isApp()){
                cordova.plugins.notification.local.schedule({
                    title: title,
                    message: text
                });
    } else {
        
      // Let's check if the browser supports notifications
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      }

      // Let's check whether notification permissions have already been granted
      else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(title,{body:text});
      }

      // Otherwise, we need to ask the user for permission
      else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
              var notification = new Notification(title,{body:text});
          }
        });
      }  
    }
    
}



globalFuncs.notifyApproval = function(){
   /* if (document.getElementsByClassName('trans')[0]){
            if (JSON.parse(localStorage.getItem('ComChainWallet'))){
                var addresss = JSON.parse(localStorage.getItem('ComChainWallet')).address;
                globalFuncs.getInfo(jsc3l.customization.getContract1(), globalFuncs.requestCount,addresss,function(count){
                    if (count>0){
                        document.getElementsByClassName('trans')[0].className = "trans alrt";
                    } else {
                        document.getElementsByClassName('trans')[0].className = "trans";
                    }
                });
                
            } else {
                document.getElementsByClassName('trans')[0].className = "trans"; 
            }
        }*/
}


globalFuncs.getTransCurrency = function(nant_val,cm_val,cm_minus_lim,amount){
    var nant =0;
    var cm=0;
    var res='no';
    
    if (parseFloat(cm_val)>=parseFloat(amount)){
       res='cm'; 
    } else if (parseFloat(nant_val)>=parseFloat(amount)){
       res='nant';  
    } else if(parseFloat(cm_val)-parseFloat(cm_minus_lim)>=parseFloat(amount)){
       res='cm';  
    } 
    return  res;
}





globalFuncs.getBlockie = function(address) {
	return blockies.create({
		seed: address.toLowerCase(),
		size: 8,
		scale: 16
	}).toDataURL();
}

globalFuncs.getBlob = function(mime, str) {
	var str = (typeof str === 'object') ? JSON.stringify(str) : str;
	if (str == null) return '';
	var blob = new Blob([str], {
		type: mime
	});
	return window.URL.createObjectURL(blob);
}
globalFuncs.getSuccessText = function(str) {
	return '<p class="text-center text-success"><strong> ' + str + '</strong></p>'
}

globalFuncs.getWarningText = function(str) {
	return '<p class="text-center text-warning"><strong> ' + str + '</strong></p>'
}

globalFuncs.getDangerText = function(str) {
	return '<p class="text-center text-danger"><strong> ' + str + '</strong></p>'
}
globalFuncs.errorMsgs = [
	"Please enter valid amount.",
	"Your password must be at least 9 characters. Please ensure it is a strong password. ",
	"Sorry! We don\'t recognize this type of wallet file. ",
	"This is not a valid wallet file. ",
	"This unit doesn\'t exists, please use the one of the following units ",
	"Invalid address. ",
	"Invalid password. ",
	"Invalid amount. ",
	"Invalid gas limit. ",
	"Invalid data value. ",
	"Invalid gas amount. ",
	"Invalid nonce. ",
	"Invalid signed transaction. ",
	"A wallet with this nickname already exists. ",
	"Wallet not found. ",
	"Whoops. It doesnt look like a proposal with this ID exists yet or there is an error reading this proposal. ",
	"A wallet with this address already exists in storage. Please check your wallets page. ",
	"You need to have at least .001 ETH in your account to cover the cost of gas. Please add some ETH and try again. ",
	"All gas would be used on this transaction. This means you have already voted on this proposal or the debate period has ended.",
	"Invalid symbol",
    "The server reject the creation of the wallet."];
globalFuncs.successMsgs = [
	"Valid address",
	"Wallet successfully decrypted",
	"Transaction submitted. TX ID: ",
	"Your wallet was successfully added: ",
	"You have successfully voted. Thank you for being an active participant in The DAO.",
	"File Selected: "];
globalFuncs.gethErrors = {
        "Invalid sender": "GETH_InvalidSender",
        "Nonce too low": "GETH_Nonce",
        "Gas price too low for acceptance": "GETH_Cheap",
        "Insufficient balance": "GETH_Balance",
        "Account does not exist or account balance too low": "GETH_NonExistentAccount",
        "Insufficient funds for gas * price + value": "GETH_InsufficientFunds",
        "Intrinsic gas too low": "GETH_IntrinsicGas",
        "Exceeds block gas limit": "GETH_GasLimit",
        "Negative value": "GETH_NegativeValue"};
globalFuncs.gethErrorMsgs = {};
globalFuncs.getGethMsg = function(str) {
	if (str in this.gethErrors) {
		var key = this.gethErrors[str];
		if (key in this.gethErrorMsgs) {
			return this.gethErrorMsgs[key];
		}
	}
	return str;
}

globalFuncs.postDelay = 300;
globalFuncs.defaultTxGasLimit = 21000;
globalFuncs.digixClaimTxGasLimit = 150000;
globalFuncs.isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
globalFuncs.urlGet = function(name) {
	if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search)) return this.stripTags(decodeURIComponent(name[1]));
}
globalFuncs.stripTags = function(str) {
	var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	while (SCRIPT_REGEX.test(str)) {
		str = str.replace(SCRIPT_REGEX, "");
	}
	return str;
}

globalFuncs.isStrongPass = function(password) {
    
    var regularExpression = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_])[a-zA-Z\d\W_]{8,200}$/;
    return password.length >= 8 && regularExpression.test(password);
}
globalFuncs.hexToAscii = function(hex) {
	return hex.match(/.{1,2}/g).map(function(v) {
		return String.fromCharCode(parseInt(v, 16));
	}).join('');
}
globalFuncs.isAlphaNumeric = function(value){
    return !/[^a-zA-Z0-9]/.test(value);
}

globalFuncs.isIos = function (){
    return device.platform=="iOS";
}

globalFuncs.readCordovaDir = function(success){
        var directory = cordova.file.externalRootDirectory;
            var subdir = "";
            if (device.platform=="iOS"){
                directory = cordova.file.documentsDirectory;
                subdir='';
            }
            window.resolveLocalFileSystemURL(directory, function(dirEntry) {
                var directoryReader = dirEntry.createReader();
                // Get a list of all the entries in the directory
                directoryReader.readEntries(success,function(error) {
                    alert(error);
                    console.log("Failed to list directory contents: ", error);
                    });
            });
    }
 

globalFuncs.generateSaveQRPiece  = function(address, piece){
    
    var container = document.getElementById("qrcode_print_2");
    var child = container.lastElementChild;  
    while (child) { 
        container.removeChild(child); 
        child = container.lastElementChild; 
    }
        
        
    if (piece == 0) {
        var qrcode = new QRCode(document.getElementById("qrcode_print_2"),localStorage.getItem('ComChainWallet'));
    } else {
        var i = piece -1;
        var full=localStorage.getItem('ComChainWallet');
        var chunk_length = Math.ceil(full.length/4);
        var string = "FRAGMENT"+address.substring(2,6)+i.toString()+full.substring(chunk_length*i,Math.min(chunk_length*(i+1),full.length));
        var qrcode = new QRCode(document.getElementById("qrcode_print_2"),string);
    } 
}

globalFuncs.generateSaveQR = function(address){
       var qrcode = new QRCode(document.getElementById("qrcode_print"),localStorage.getItem('ComChainWallet'));
       
       document.getElementById("qrcode_print").style.display = "none";
       
        var full=localStorage.getItem('ComChainWallet');
        var chunk_length = Math.ceil(full.length/4);
        for (var i=0;i<4;i++){
            var string = "FRAGMENT"+address.substring(2,6)+i.toString()+full.substring(chunk_length*i,Math.min(chunk_length*(i+1),full.length));
            var qrcodef = new QRCode(document.getElementById("qrcode_print"+i.toString()),string);
            document.getElementById("qrcode_print"+i.toString()).style.display = "none";
           
        }
       
}

globalFuncs.dowloadAppFile = function(wallet, file_content){
    
    globalFuncs.dowloadAppFileWithName(globalFuncs.currencies.CUR+'_'+wallet.getAddressString()+'.dat',file_content);
 }
    
globalFuncs.dowloadAppFileWithName = function(name, file_content){
      var directory = cordova.file.externalRootDirectory;
       var subdir = "";
       if (device.platform=="iOS"){
           directory = cordova.file.documentsDirectory;
           subdir='';
       }
       
       var pathToFile = directory;
       window.resolveLocalFileSystemURL(directory, function (dir) {
           dir.getFile(subdir+name, {create:true}, function(fileEntry) {
            writeFile(fileEntry, file_content);
           });
       });
    }
    
    
    
    
    
    
 globalFuncs.dowloadAppFileWithNameWithoutMessage = function(name, file_content){
      var directory = cordova.file.externalRootDirectory;
       var subdir = "";
       if (device.platform=="iOS"){
           directory = cordova.file.documentsDirectory;
           subdir='';
       }
       
       var pathToFile = directory;
       window.resolveLocalFileSystemURL(directory, function (dir) {
           dir.getFile(subdir+name, {create:true}, function(fileEntry) {
            writeFileWithoutMessage(fileEntry, file_content);
           });
       });
    }
    
 globalFuncs.dowloadCsvFileWithName = function(name, file_content){
      var directory = cordova.file.externalRootDirectory;
       var subdir = "";
       if (device.platform=="iOS"){
           directory = cordova.file.documentsDirectory;
           subdir='';
       }
       
       var pathToFile = directory;
       window.resolveLocalFileSystemURL(directory, function (dir) {
           dir.getFile(subdir+name, {create:true}, function(fileEntry) {
            writeFileCSV(fileEntry, file_content);
           });
       });
    }
    
  
    function writeFile(fileEntry, file_content) {
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
            alert("Fichier enregistré :\n"+fileEntry.fullPath);
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
         //    alert("Failed file write: " + e.toString());
        };
        
        fileWriter.write(JSON.stringify(file_content));
    });
}

  function writeFileWithoutMessage(fileEntry, file_content) {
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
           
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
         //    alert("Failed file write: " + e.toString());
        };
        
        fileWriter.write(JSON.stringify(file_content));
    });
}

  function writeFileCSV(fileEntry, file_content) {
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
            alert("Fichier enregistré :\n"+fileEntry.fullPath);
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
         //    alert("Failed file write: " + e.toString());
        };
        
        fileWriter.write(file_content);
    });
}

globalFuncs.wrapImgData=function(img){
    if (img.substring(0, 4) == "url("){
        img=img.substring(4,img.length-5);
        if (img.substring(0, 1) == '"'){
            img=img.substring(1,img.length-2)
        }

    }
    return img;

}

globalFuncs.cleanName = function(name){
    return name.substring(0,name.length-1);
}




globalFuncs.generateSavePDF = function(title, key, address, callback){
            title = title.trim();
            key = key.trim();
            var newImg = new Image();
            newImg.callback=callback;
            newImg.setAttribute('crossOrigin', 'anonymous');
            newImg.onload = function() {
                var height = this.naturalHeight;
                var width = this.naturalWidth;
               
                var c = document.createElement('canvas');
                c.height = height;
                c.width = width;
                var ctx = c.getContext("2d");
                ctx.drawImage(newImg, 0, 0);
                var logoData = c.toDataURL('image/png');
          
                // var imgData = document.getElementById("qrcode_print").getElementsByTagName('img')[0].src;
                var imgAddData = globalFuncs.wrapImgData(document.getElementById("addressIdenticon").style.backgroundImage);
            
                var doc = new jsPDF();
                doc.setFontSize(32);
                var textWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
                
                doc.setFontSize(22);
                var keytextWidth = doc.getStringUnitWidth(key) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                var keytextOffset = (doc.internal.pageSize.width - keytextWidth) / 2;
                
                
                doc.setFontSize(32);
                doc.text(textOffset, 25, title);
                doc.setLineWidth(1.0);
                doc.line(textOffset, 27, textOffset+textWidth+3, 27);
                doc.addImage(imgAddData, 'PNG', 90, 32, 30, 30);
                doc.addImage(logoData, 'PNG', 50, 32, 30, 30);
                
                doc.setFontSize(15);
                var linesAdd = doc.splitTextToSize(address, 30, {});
                doc.text(130, 37, linesAdd);
               
                doc.setFontSize(22);
                doc.text(keytextOffset, 81, key);
  
                
                var imgData = document.getElementById("qrcode_print0").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 15, 95, 80, 80);
                doc.addImage(imgAddData, 'PNG', 50, 130, 10, 10);
                doc.text(53, 138, "1");
                
                imgData = document.getElementById("qrcode_print1").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 115, 95, 80, 80);
                doc.addImage(imgAddData, 'PNG', 150, 130, 10, 10);
                doc.text(153, 138, "2");
                                
                imgData = document.getElementById("qrcode_print2").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 15, 195, 80, 80);
                doc.addImage(imgAddData, 'PNG', 50, 230, 10, 10);
                doc.text(53, 238, "3");
                
                imgData = document.getElementById("qrcode_print3").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 115, 195, 80, 80);
                doc.addImage(imgAddData, 'PNG', 150, 230, 10, 10);
                doc.text(153, 238, "4");
                
                doc.addPage();
                
                doc.setFontSize(32);
                doc.text(textOffset, 25, title);
                doc.setLineWidth(1.0);
                doc.line(textOffset, 27, textOffset+textWidth+3, 27);
                
                doc.addImage(imgAddData, 'PNG', 90, 32, 30, 30);
                doc.addImage(logoData, 'PNG', 50, 32, 30, 30);
                doc.setFontSize(15);
                doc.text(130, 37, linesAdd);
              
                doc.setFontSize(22);
                
                doc.text(keytextOffset, 81, key);
                
                doc.setFontSize(12);
                var lines = doc.splitTextToSize(localStorage.getItem('ComChainWallet'), 180, {});
                doc.text(15, 90, lines);
                
                newImg.callback(doc);
            }

            
           newImg.src = jsc3l.customization.getCurrencyLogoUrl()
            
                
}

globalFuncs.generateCrPDF = function(title, on,assigned,validity,address,dest,content, callback){
            title = title.trim();
            on = on.trim();
            assigned = assigned.trim();
            validity = validity.trim();
            var newImg = new Image();
            newImg.callback=callback;
            newImg.setAttribute('crossOrigin', 'anonymous');
            newImg.onload = function() {
                var height = this.naturalHeight;
                var width = this.naturalWidth;
               
                var c = document.createElement('canvas');
                c.height = height;
                c.width = width;
                var ctx = c.getContext("2d");
                ctx.drawImage(newImg, 0, 0);
                var logoData = c.toDataURL('image/png');
          
                var imgAddData = globalFuncs.wrapImgData(document.getElementsByName("addressIdenticon")[0].style.backgroundImage);
                var imgDestData = globalFuncs.wrapImgData(document.getElementsByName("addressIdenticonDest")[0].style.backgroundImage);
            
                var doc = new jsPDF();
                doc.setFontSize(22);
                
                var textWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                var textOffset = 15+(80 - textWidth) / 2;
                doc.text(textOffset, 21, title);
                doc.setLineWidth(1.0);
                doc.line(textOffset, 22, textOffset+textWidth+2, 22);
                
     
                
                
                doc.addImage(logoData, 'PNG', 15, 32, 20, 20);
                doc.setFontSize(10);
                doc.text(45, 30, on);
                doc.addImage(imgAddData, 'PNG', 45, 32, 20, 20);
                doc.text(75, 30, assigned);
                doc.addImage(imgDestData, 'PNG', 75, 32, 20, 20);
                
                doc.setFontSize(15);
                var lines_val = doc.splitTextToSize(validity, 80, {});
                doc.text(15, 71, lines_val);

                var imgData = document.getElementById("qrCR_print0").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 115, 10, 80, 80);
                doc.addImage(imgAddData, 'PNG', 150, 45, 10, 10);
                doc.text(153, 53, "1");
                
                
                imgData = document.getElementById("qrCR_print1").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 15, 105, 80, 80);
                doc.addImage(imgAddData, 'PNG', 50, 140, 10, 10);
                doc.text(53, 148, "2");
                
                imgData = document.getElementById("qrCR_print2").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 115, 105, 80, 80);
                doc.addImage(imgAddData, 'PNG', 150, 140, 10, 10);
                doc.text(153, 148, "3");
                                
                imgData = document.getElementById("qrCR_print3").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 15, 200, 80, 80);
                doc.addImage(imgAddData, 'PNG', 50, 235, 10, 10);
                doc.text(53, 243, "4");
                
                imgData = document.getElementById("qrCR_print4").getElementsByTagName('img')[0].src;
                doc.addImage(imgData, 'PNG', 115, 200, 80, 80);
                doc.addImage(imgAddData, 'PNG', 150, 235, 10, 10);
                doc.text(153, 243, "5");
                
              
                
                
                newImg.callback(doc);
            }

            
            newImg.src = jsc3l.customization.getCurrencyLogoUrl()
           
                
}
    

    
globalFuncs.generateSaveAdrPDF = function(walletAddress, callback){
            var newImg = new Image();
            newImg.callback=callback;
            newImg.walletAddress=walletAddress;
            newImg.setAttribute('crossOrigin', 'anonymous');
            newImg.onload = function() {
                var height = this.naturalHeight;
                var width = this.naturalWidth;
               
                var c = document.createElement('canvas');
                c.height = height;
                c.width = width;
                var ctx = c.getContext("2d");
                ctx.drawImage(newImg, 0, 0);
                var iciData = c.toDataURL('image/png');
          
                var imgData = document.getElementById("qr_qdd").getElementsByTagName('img')[0].src;
            
                var imgAddData = globalFuncs.wrapImgData(document.getElementById("addressIdenticon").style.backgroundImage);
        
                var doc = new jsPDF('landscape');
           
                doc.addImage(iciData, 'PNG', 15, 12, 128, 186);
            
                doc.addImage(imgAddData, 'PNG', 173, 31, 30, 30);
            
                doc.setFontSize(24);
      
                var lines = doc.splitTextToSize(newImg.walletAddress, 65, {});
                doc.text(208, 40, lines);
            
                doc.addImage(imgData, 'PNG', 168, 75, 108, 108);
               
                newImg.callback(doc);
            }

            
            newImg.src = `${jsc3l.customization.getCurrencyAssetBaseUrl()}/images/ici.png`;
           
}


globalFuncs.generateTagQR = function(walletAddress, tags){
    var qrcode_1 = new QRCode(document.getElementById("qrcode_p_1"),JSON.stringify({"address":walletAddress,"amount":tags[0].price}));
       
       document.getElementById("qrcode_p_1").style.display = "none";
       
        var qrcode_2 = new QRCode(document.getElementById("qrcode_p_2"),JSON.stringify({"address":walletAddress,"amount":tags[1].price}));
       
       document.getElementById("qrcode_p_2").style.display = "none";
       
        var qrcode_3 = new QRCode(document.getElementById("qrcode_p_3"),JSON.stringify({"address":walletAddress,"amount":tags[2].price}));
       
       document.getElementById("qrcode_p_3").style.display = "none";
               
       var qrcode_4 = new QRCode(document.getElementById("qrcode_p_4"),JSON.stringify({"address":walletAddress,"amount":tags[3].price}));
       
       document.getElementById("qrcode_p_4").style.display = "none";
}


globalFuncs.generateTagsPDF = function(walletAddress, tags, callback){
  
            var newImg = new Image();
            newImg.callback=callback;
            newImg.walletAddress=walletAddress;
            newImg.setAttribute('crossOrigin', 'anonymous');
            newImg.onload = function() {
                var height = this.naturalHeight;
                var width = this.naturalWidth;
               
                var c = document.createElement('canvas');
                c.height = height;
                c.width = width;
                var ctx = c.getContext("2d");
                ctx.drawImage(newImg, 0, 0);
                var logoData = c.toDataURL('image/png');
          
            
                var imgAddData = globalFuncs.wrapImgData(document.getElementById("addressIdenticon").style.backgroundImage);
        
                var doc = new jsPDF();
                doc.setFontSize(24);
                var x_step=105;
                var y_step=148;
                
                var i=0;
                var j=0;
                var qr_ids=["qrcode_p_1","qrcode_p_2","qrcode_p_3","qrcode_p_4"]
                for (var item in tags){
                    if (tags[item].price>0){
                        doc.addImage(logoData, 'PNG', 15 +i*x_step, 15+j*y_step, 30, 30);
                        doc.addImage(imgAddData, 'PNG', 60 +i*x_step, 15+j*y_step, 30, 30);
                        if (tags[item].name){
                            var textWidth = doc.getStringUnitWidth(tags[item].name+" ") * doc.internal.getFontSize() / doc.internal.scaleFactor;
                            doc.text(52.5-textWidth/2.+i*x_step, 60+j*y_step, tags[item].name+"");
                        }
                        
                        var imgData = document.getElementById(qr_ids[item]).getElementsByTagName('img')[0].src;
                        doc.addImage(imgData, 'PNG', 15 +i*x_step, 65+j*y_step, 75, 75);

                        doc.setFillColor(255,255,255);
                      
                        var text_p =   parseFloat(Math.round(tags[item].price * 100) / 100).toFixed(2) +" " +globalFuncs.currencies.CUR;
                        textWidth = doc.getStringUnitWidth(text_p) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                        doc.rect(50-textWidth/2+i*x_step, 99+j*y_step, textWidth+4, 10, 'F');
                        doc.text(52.5-textWidth/2.+i*x_step, 107+j*y_step,text_p);

                        doc.setFillColor(0);
                        
                        i+=1;
                        if (i==2){
                            i=0;
                            j+=1;
                        }
                    }
                }
               
              
                
                
                 

               
                newImg.callback(doc);
            }

            
            newImg.src = jsc3l.customization.getCurrencyLogoUrl()
            
}


globalFuncs.formatDate = function(date) {
    var day = "00"+date.getDate().toString();
    var month = "00"+(date.getMonth()+1).toString();
    return day.substring(day.length-2) + "." + month.substring(month.length-2)+ "." + date.getFullYear().toString();
}

globalFuncs.generateTransPDF = function(walletAddress, list, texts, start_date, end_date, callback){
 var newImg = new Image();
newImg.callback=callback;
newImg.walletAddress=walletAddress;
newImg.setAttribute('crossOrigin', 'anonymous');
newImg.onload = function() {  
    var height = this.naturalHeight;
    var width = this.naturalWidth;
   
    var c = document.createElement('canvas');
    c.height = height;
    c.width = width;
    var ctx = c.getContext("2d");
    ctx.drawImage(newImg, 0, 0);
    var logoData = c.toDataURL('image/png');
    
    var log_width = (20*width)/height;
    
    
    var imgAddData = globalFuncs.wrapImgData(document.getElementById("addressIdenticon").style.backgroundImage);
    
    
    var today = new Date();    
    var tran_on_page = 15;
    var tran_row_height=10;
    var margin_left=25;
    var margin_right=185;
    var col_2=42;
    var col_21=80;
    var col_25=113;
    var col_3=128;
    var col_35=143;
    var col_4=158;
    var col_5=170;
    var vertical_start=92;
    
    var num_tot_page = Math.floor(list.length/tran_on_page);
    if (list.length==0 || list.length%tran_on_page!=0){
        num_tot_page+=1;
    }
    
    var doc = new jsPDF();
    var tot_in=0;
    var tot_out=0;
    for  (var page = 0; page < num_tot_page; ++page){
        // header
        doc.addImage(logoData, 'PNG', doc.internal.pageSize.width - 25 - log_width, 10, log_width, 20);
        doc.setFontSize(13);
        
        doc.text(margin_left, 40, texts.date);
        doc.text(60, 40, globalFuncs.formatDate(today)+' '+today.toTimeString().slice(0,8));
        doc.text(margin_left, 50, texts.requestAddress);
        doc.text(73, 48, [walletAddress.substring(0,21),walletAddress.substring(21)]);
        doc.addImage(imgAddData, 'PNG', 60, 44, 10, 10);
        
        var name_lines = doc.splitTextToSize(texts.proper_name, 50, {});
        if (name_lines.length>2){
             name_lines=name_lines.slice(0,2);
             name_lines[1]=name_lines[1]+'...';
        }
        doc.text(140, 48, name_lines);
        
        
        doc.setFontSize(18)
        var title = texts.title + globalFuncs.formatDate(start_date) + texts.to + globalFuncs.formatDate(end_date);
        if (page>0){
            title = title+' '+texts.titleNext;
        }
        doc.text(margin_left, 65, title);
        
        doc.setFontSize(8);
        
         if (list.length>0){
            if ( list[0].data.balance!=''){
                doc.text(margin_left, 73, texts.initBal+globalFuncs.formatDate(start_date) +' '+start_date.toTimeString().slice(0,2)+':00 ');
                doc.text(73, 73, globalFuncs.currencies.CUR);
                
                var tra_date = list[0].data.time;
                var last_block = 0;
                var i=0;
                while ( i<list.length && list[i].data.time==tra_date ){
                   if (list[i].data.addr_from==walletAddress){
                        last_block += (list[i].data.recieved + list[i].data.tax)/100.; //////////////////////
                    } else {
                       last_block -= (list[i].data.recieved)/100.; 
                    } 
                    i++;
                }
                
                doc.text(83, 73, (parseFloat(list[0].data.balance) + last_block).toFixed(2));
                
            }
            
            if ( list[list.length-1].data.balance!=''){
                doc.text(margin_left, 77, texts.finalBal+globalFuncs.formatDate(end_date) +' '+end_date.toTimeString().slice(0,2)+':59');
                doc.text(73, 77, globalFuncs.currencies.CUR);
                doc.text(83, 77, parseFloat(list[list.length-1].data.balance).toFixed(2));
            }
        }
        
        doc.setFontSize(8);
        doc.setLineWidth(0.5);
        doc.line(margin_left, 82, margin_right, 82);
        doc.text(margin_left, 86, texts.dateCol);
        doc.text(col_2, 86, texts.textCol);
        doc.text(col_21, 86, texts.memoCol);
        doc.text(col_25, 86, texts.sendCol);
        doc.text(col_35, 86, texts.recievedCol);
        doc.text(col_5, 86, texts.balanceCol +' '+globalFuncs.currencies.CUR);
        doc.line(margin_left, 88, margin_right, 88);
        
        doc.setLineWidth(0.3);
        var row =0;
        for (var index = (page*tran_on_page); index < Math.min(list.length,(page+1)*tran_on_page); ++index){
            var tra=list[index].data;
            var date = new Date(tra.time*1000);
            doc.text(margin_left, vertical_start+tran_row_height*row, globalFuncs.formatDate(date));
            doc.text(margin_left, vertical_start-1+tran_row_height*(row+0.5), ' '+date.toTimeString().slice(0,8));
            
            
            var memo_lines = doc.splitTextToSize(tra.memo, col_25-col_21-3, {});
            if (memo_lines.length>2){
                memo_lines=memo_lines.slice(0,2);
                memo_lines[1]=memo_lines[1]+'...';
            }
            doc.text(col_21, vertical_start+tran_row_height*(row),memo_lines);
            
            if (tra.addr_from==walletAddress){

               if (tra.to_name && tra.to_name.length>0){
                  var name_to_lines = doc.splitTextToSize(tra.to_name, col_21 - col_2-3, {});
                  if (name_to_lines.length>1){
                        name_to_lines=name_to_lines.slice(0,1);
                        name_to_lines[0]=name_to_lines[0]+'...';
                  }
                  
                  doc.text(col_2, vertical_start+tran_row_height*(row), name_to_lines[0]);
                  doc.text(col_2, vertical_start-1+tran_row_height*(row+0.5), tra.addr_to.substring(0, 18)+"..."); 
                  
               } else {
                  var lines = doc.splitTextToSize(tra.addr_to, col_21 - col_2-3, {});
                  doc.text(col_2, vertical_start+tran_row_height*(row), lines); 
               }
        
               
               doc.text(col_25, vertical_start-1+(tran_row_height)*(row+0.5), globalFuncs.currencies.CUR);
               doc.text(col_3, vertical_start-1+(tran_row_height)*(row+0.5), ((tra.recieved+tra.tax)/100.).toFixed(2));
               
               tot_out+=(tra.recieved+tra.tax)/100.;
            } else {
              if (tra.from_name && tra.from_name.length>0){
                  var name_from_lines = doc.splitTextToSize(tra.from_name, col_21 - col_2-3, {});
                  if (name_from_lines.length>1){
                        name_from_lines=name_from_lines.slice(0,1);
                        name_from_lines[0]=name_from_lines[0]+'...';
                  }
                  doc.text(col_2, vertical_start+tran_row_height*(row), name_from_lines);
                  doc.text(col_2, vertical_start-1+tran_row_height*(row+0.5), tra.addr_from.substring(0, 18)+"..."); 
                  
               } else {
                  var lines = doc.splitTextToSize(tra.addr_from, col_21 - col_2-3, {});
                  doc.text(col_2, vertical_start+tran_row_height*(row), lines); 
               }
        
               
               
               
               
               doc.text(col_35, vertical_start-1+(tran_row_height)*(row+0.5), globalFuncs.currencies.CUR);
               doc.text(col_4, vertical_start-1+(tran_row_height)*(row+0.5), (parseFloat(tra.recieved)/100.).toFixed(2));
               tot_in+=(tra.recieved)/100.;
            }
            
            if (tra.balance!='' && (index == list.length-1 || list[index+1].data.time != tra.time)){
                doc.text(col_5, vertical_start-1+(tran_row_height)*(row+0.5), (parseFloat(tra.balance)).toFixed(2));
            }
            
            doc.line(margin_left, vertical_start+1+tran_row_height*(row+0.5), margin_right, vertical_start+1+tran_row_height*(row+0.5));
            
            row += 1;
        }
        
        
        
        doc.setFontSize(8);
        doc.text(80, 281, texts.disclaimer);
        doc.text(100, 285, ''+(page+1) + '/'+num_tot_page);
        
        if (page<num_tot_page-1){
               doc.addPage();
        }
    }
    
    
   doc.setLineWidth(0.5);
   doc.line(margin_left, vertical_start+1+tran_row_height*(row-0.5), margin_right, vertical_start+1+tran_row_height*(row-0.5));
   doc.text(110, vertical_start+tran_row_height*row, texts.totals);
   doc.text(col_3, vertical_start+tran_row_height*row, tot_out.toFixed(2));
   doc.text(col_4, vertical_start+tran_row_height*row, tot_in.toFixed(2));
   
    if (list && list.length>0 && list[list.length-1].data.balance!=''){
        var date_final = new Date(list[list.length-1].data.time*1000);
        doc.text(margin_left, vertical_start+tran_row_height*(row+0.5), texts.finalBal+globalFuncs.formatDate(date_final) +' '+date_final.toTimeString().slice(0,2)+':59');
        doc.text(73, vertical_start+tran_row_height*(row+0.5), globalFuncs.currencies.CUR);
        doc.text(83, vertical_start+tran_row_height*(row+0.5), parseFloat(list[list.length-1].data.balance).toFixed(2));
    }

   this.callback(doc);
};


    newImg.src = `${jsc3l.customization.getCurrencyAssetBaseUrl()}/images/etherwallet-logo.png`;

    
}

/////////////////////////////////////////////////////////



 
globalFuncs.loadWallets= function(with_check){
    try{
        var wallets = JSON.parse(localStorage.getItem('ComChainWallets')); 
      } catch(e){}
      
      if (!wallets){
          wallets=[]; 
      }  
      
      if (with_check){
         try{
          var current = JSON.parse(localStorage.getItem('ComChainWallet'));
          if (current){
              var found=false;
              for (var id in wallets){
                  if (wallets[id].address.toUpperCase()==current.address.toUpperCase()){
                      found=true;
                     
                      
                      wallets[id]={address:current.address, file:current};
                  }
              }
              if (!found){
                  wallets.push({address:current.address, file:current});
                  
              }
              localStorage.setItem('ComChainWallets',JSON.stringify( wallets));
          }
         } catch(e){}
      }
      
      return wallets
    }
 
globalFuncs.getWalletAddress = function(){
    var address='';
     try{
          var current = JSON.parse(localStorage.getItem('ComChainWallet'));
          if (current){
              address='0x'+current.address;
          }
     } catch(e){}
     return address;
}

globalFuncs.hasConfig = function(){
    if (!globalFuncs.multicurr){
        return true;
    }
    else{
         try{
              var current = JSON.parse(localStorage.getItem('ComChainServerConf'));
              if (current){
                  return true;
              } else {
                  return false;
              }
         } catch(e){
              return false;
         }
    }
}


 
 /**************************************************************/
 
 globalFuncs.doHide=true;
 localStorage.removeItem('ComChainAPI');
 
 globalFuncs.showLoading = function(text){
     document.getElementById("gl_pane").style.display="block";
     document.getElementById("wt_msg_dv").style.display="inline-block";
     document.getElementById("wt_msg_txt").innerHTML = text;
     document.getElementById("wt_msg_bt_r").style.display="inline-block";
     document.getElementById("wt_msg_bt_h").style.display="none"; 
     globalFuncs.doHide=true;
 }
 
 globalFuncs.showWaiting = function(text){
     document.getElementById("gl_pane").style.display="block";
     document.getElementById("wt_msg_dv").style.display="inline-block";
     document.getElementById("wt_msg_txt").innerHTML = text;
     document.getElementById("wt_msg_bt_r").style.display="none";
     document.getElementById("wt_msg_bt_h").style.display="inline-block"; 
     globalFuncs.doHide=true;
 }
 
 globalFuncs.hideLoadingWaiting = function(apiCheck){
     if (apiCheck==undefined){
         apiCheck=false;
     }
     var show=false;
     if (!apiCheck){
         globalFuncs.doHide=false;
         if (jsc3l.connection.endpoint) {
             show=true;
         }
     } else {
       show  = !globalFuncs.doHide;
     }
     
     if (show){
         document.getElementById("gl_pane").style.display="none";
         document.getElementById("wt_msg_dv").style.display="none";  
     }
 }
 
 /***************************************************************/
  globalFuncs.useFingerprint = null;
  
  globalFuncs.canUseFingerprint = function(callback){
      if (globalFuncs.useFingerprint!=null){
          callback(globalFuncs.useFingerprint);
      } else {
          try {
              if (!Fingerprint){
                    globalFuncs.useFingerprint = false;
                    callback(globalFuncs.useFingerprint);
              } else {
                  Fingerprint.isAvailable(
                    function(res){
                        globalFuncs.useFingerprint = true;
                        callback(globalFuncs.useFingerprint);
                    }, 
                    function(mess){
                        globalFuncs.useFingerprint = false;
                        callback(globalFuncs.useFingerprint);
                    });
              }
           } catch (error) {
                globalFuncs.useFingerprint = false;
                callback(globalFuncs.useFingerprint);
          }
      }
  }
  
  globalFuncs.unlock = function(callback){
      globalFuncs.canUseFingerprint(function(result){
        if (!result) {
            callback(false);
        } else {
            Fingerprint.show({
                  clientId: "Biletujo",
                  clientSecret: "password" //Only necessary for Android
                }, 
                function(){callback(true)},  
                function(){callback(false)});
        }
      });
  }
  
  
 /***************************************************************/

module.exports = globalFuncs;
