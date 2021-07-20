'use strict';
var contactService = function() {

 

    
    function loadContacts(wallet, pass, callback){
      // load local
      try{
          var contacts = JSON.parse(localStorage.getItem('ComChainContacts')); 
      } catch(e){}
      
      if (!contacts){
          contacts=[]; 
      }
      
      try{
          var infos = JSON.parse(localStorage.getItem('ComChainContactsInfo')); 
      } catch(e){}
      
      if (!infos){
          infos = {"hash":"","length":"0"};
      }
      
      //  get remote infos
      globalFuncs.getContactHash(wallet.getAddressString(), function(hash){
           // get the crypted data
           var str_hash = hexa_to_ascii(hash);
          // console.log("Contacts are locally stored with hash "+infos.hash+" and remotely with hash : "+ str_hash)
           if (infos.hash == str_hash && infos.length>0 && contacts.length==infos.length){
              callback(contacts);
           } else {
              globalFuncs.readFromIpfs(str_hash,function(crypted_list){
               if (crypted_list && crypted_list.data){
                   try{
                       // decrypte
                       var uncypher = wallet.decifer(crypted_list.data,pass);
                       // json parse
                       var ipfs_contacts = JSON.parse(decodeURIComponent(escape(window.atob( uncypher))));
                       console.log("Retrieved "+ipfs_contacts.length+" contacts with hash  : "+ str_hash)
                       storeContacts(ipfs_contacts, str_hash);
                       callback(ipfs_contacts);
                   } catch(e){
                    callback(contacts);
                   }
               } else {
                callback(contacts);
               }
           }) 
         }
      });
    }
    
    function storeContacts(contacts, hash){
      localStorage.setItem('ComChainContacts',JSON.stringify(contacts));
      var infos = {"hash":hash,"length":contacts.length};
      localStorage.setItem('ComChainContactsInfo',JSON.stringify(infos));
    }
    
    function filterContactForCurr(contacts, server_name){
      var result = [];
      for (var i in contacts){
        if (contacts[i].servername && contacts[i].servername.toUpperCase()== server_name.toUpperCase()){
          result.push(contacts[i]);
        }
      } 
      return result;
    }
    
   
     
    

    
    function hideContact(contacts, address){
        for (var i in contacts){
        if (contacts[i].address.toUpperCase()== address.toUpperCase()){
          contacts.splice(i, 1);
          break;
        }
      } 
      return contacts;
    }
    
    function filterContact(contacts, filter){
        if (filter.trim().length>0){
          var trimed_filter = filter.trim().toUpperCase();
          var new_contact=[];
          for (var i in contacts){
            if (contacts[i].name.toUpperCase().indexOf(trimed_filter)!==-1){
              new_contact.push(contacts[i]);
             
            }
          }
          contacts = new_contact;
        }
      return contacts;
   }
    
    

    
    // Build a blob with the contacts  
    function getContactsBlob(contacts){
      return globalFuncs.getBlob("text/json;charset=UTF-8",contacts );
    }
    
    // Ensure that a contact is present in the storage. If needed add it
    function ensureContact(contacts, address){
        return upsertContact(contacts, address, '', false); 
    }
    
    // Add a new contact /edit existing contact name
    function addEditContact(contacts, address, name){ 
         return upsertContact(contacts, address, name,true);
    }
    function upsertContact(contacts, address, name,replace_name){     
      var index =-1;
      for (var i in contacts){
        if (contacts[i].address.toUpperCase() == address.toUpperCase()){
          index=i;
        }
        
      } 
      if (index > -1) {
          if (replace_name){
            contacts[index].name = name;
          }
      } else {
          contacts.push( {name:name,address:address,servername:jsc3l.customization.getCurrencyName()});
      }
      
      contacts.sort(function(a,b){return a.name.localeCompare(b.name); });
      storeContacts(contacts);
      return contacts;
    }
    
    // Delete an existing contact
    function deleteContact(contacts, address){
      for (var i in contacts){
        if (contacts[i].address.toUpperCase()== address.toUpperCase()){
          contacts.splice(i, 1);
          storeContacts(contacts);
          break;
        }
      } 
      return contacts;
    }
    
    // Return the name of the contact
    function getContactName(contacts, address){
      if (contacts.length>0){
        for (var i in  contacts){
          if (contacts[i].address == address){
            return contacts[i].name;
            break;
          }
        }
      }
        
      return '';
    }
    
    function checkAddress(address){
        return address && address.length==42 && address.startsWith('0x');
    }
    
    // Check for contacts in an json string
    function checkForContact(contacts, jsonContacts){
      var new_file_content  = JSON.parse(jsonContacts);
      var count=0;
      var conflict=0;
      var error=true;
      if (new_file_content){
        for (var i in new_file_content){
          if (checkAddress(new_file_content[i].address)){
               ++count;
               for (var j in contacts){
                 if (contacts[j].address.toUpperCase() == new_file_content[i].address.toUpperCase()){
                   ++conflict;
                   break;
                 }
               }
           } 
        }
        error=false;
      }
                
      return {error:error, 
              new_file_content:new_file_content,
              count:count,
              conflict:conflict} ;  
    }
    
    // Merge 2 lists of contacts, if merge_type =0 resolve conflict by taking contacts2 values 
    function mergeContacts(contacts1, contacts2, merge_type){
      for (var i in contacts2){
         if (checkAddress(contacts2[i].address)){
            var ind =-1;
            for (var j in contacts1){
              if (contacts1[j].address.toUpperCase() == contacts2[i].address.toUpperCase()){
                if (merge_type==0){
                  contacts1[j].name = contacts2[i].name;
                  contacts1[j].servername = contacts2[i].servername;
                }
                ind=j;
              }
            }
            
            if (ind==-1){
                contacts1.push( {name:contacts2[i].name,address:contacts2[i].address,servername:contacts2[i].servername});
            }
         }   
      }
      
      contacts1.sort(function(a,b){return a.name.localeCompare(b.name); });
      storeContacts(contacts1);
      return contacts1;
    }
    
    function hexa_to_ascii(hex) {
        var str = '';
        for (var i = 0; i < hex.length; i += 2) {
            var v = parseInt(hex.substr(i, 2), 16);
            if (v) str += String.fromCharCode(v);
        }
        return str;
    }  

   function ascii_to_hexa(str){
	    var arr1 = [];
	    for (var n = 0, l = str.length; n < l; n ++) 
         {
		    var hex = Number(str.charCodeAt(n)).toString(16);
		    arr1.push(hex);
	     }
	    return arr1.join('');
    }
    
    function storeIpfsContact(contact_list, wallet, pass){
         var local_contacts=contact_list;
         if (local_contacts && local_contacts.length>0){
         // encrypt the list 
          var b64 = window.btoa(unescape(encodeURIComponent(JSON.stringify(local_contacts))));
          var crypted = wallet.cipher(pass, b64);
          // push the list to IPFS and get the hash
           globalFuncs.storeOnIpfs(crypted,function(hash){
               try{
                   var json_obj = JSON.parse(hash);
                    if (json_obj.hash){
                        
                       console.log("Storing "+local_contacts.length+" contacts with hash  : "+ json_obj.hash)
                       // Store locally 
                       storeContacts(local_contacts, json_obj.hash);
                       // push the hash to the blockchain
                       var hex_hash  = ascii_to_hexa(json_obj.hash);
                       globalFuncs.setContactHash(wallet,hex_hash,function(){});
                    }
               } catch (e){}
              
           });
         } 
    }
    
    
    
    
    ////////////////////////////////////////////////////////////////
    
    function loadLocalContacts(){
      
      try{
          var contacts = JSON.parse(localStorage.getItem('ComChainLocalContacts')); 
      } catch(e){}
      
      if (!contacts){
          contacts=[]; 
      }
      return contacts;
    }
    
    function storeLocalContacts(contacts){
      localStorage.setItem('ComChainLocalContacts',JSON.stringify(contacts));

    }
    
    function upsertLocalContact(contacts, address, name, server_name){     
      var index =-1;
      for (var i in contacts){
        if (contacts[i].address.toUpperCase() == address.toUpperCase()){
          index=i;
        }
        
      } 
      if (index > -1) {
            contacts[index].name = name;
      } else {
          contacts.push( {name:name, address:address, servername:server_name});
      }
      
      contacts.sort(function(a,b){return a.name.localeCompare(b.name); });
      storeLocalContacts(contacts);
      return contacts;
    }
    

    
    
    return {loadContacts:loadContacts,
            storeContacts:storeContacts,
            filterContactForCurr:filterContactForCurr,
            hideContact:hideContact,
            filterContact:filterContact,
            getContactsBlob:getContactsBlob,
            ensureContact:ensureContact,
            addEditContact:addEditContact,
            deleteContact:deleteContact,
            getContactName:getContactName,
            checkForContact:checkForContact,
            mergeContacts:mergeContacts,
            storeIpfsContact:storeIpfsContact,
            loadLocalContacts:loadLocalContacts,
            storeLocalContacts:storeLocalContacts,
            upsertLocalContact:upsertLocalContact
    }
   
};
module.exports = contactService;
