'use strict';
var tabsCtrl = function($scope, $attrs, globalService, contactservice, $translate, $compile, authenticationService) {
   

   
	$scope.tabNames = globalService.tabs;
    //$scope.ready = true;
    //$scope.ng_ok=false;
    globalFuncs.showLoading($translate.instant("GLB_Loading_api_node")); 
    $scope.ng_ok=true;
    
    // Check Connectivity to the config server

    
    $scope.loaded = false;
    let connect_ok = await jsc3l.connection.ensureComChainRepo();
    if (!connect_ok){
        globalFuncs.hideLoadingWaiting (true);
        $scope.ng_ok=false;
        document.getElementById("global_error").innerHTML='<br/><br/><br/>'+$translate.instant("GLB_Connection_error") +
             '<br/><br/><button type="button" class="btn btn-primary bellowmargin" onclick="location.reload();" >'+$translate.instant("TRA_Refresh")+' </button>';

        $scope.$apply();
    } else{
        let success = await jsc3l.connection.acquireEndPoint();
        if (!$scope.loaded) {
           if (success){
                   $scope.ng_ok=true;
                    jsc3l.customization.configureCurrency();
                    globalFuncs.getCurrencies();
                    
    /*                          if (jsc3l.customization.hasBn()){
                        globalService.configureNoteTab(true);
                    }
    */

                    var currCode = globalService.getCurrCode();
                    if (currCode!=undefined && currCode!=""){
                        $scope.tabClick(1);
                    }
                    
                   globalFuncs.hideLoadingWaiting (true);
                   $scope.loaded=true;
                   
            }else{
                  
                   $scope.ng_ok=false;
                   globalFuncs.hideLoadingWaiting (true);
                   document.getElementById("global_error").innerHTML='<br/><br/><br/>'+$translate.instant("GLB_No_valid_nodes_reload_them") +
             '<br/><br/><button type="button" class="btn btn-primary bellowmargin" onclick="location.reload();" >'+$translate.instant("GLB_Relaoad_nodes")+' </button>';

            }
              $scope.$apply();
        }
    }


    
   
    $scope.isIos=false;
    
    $scope.onDeviceReady = function() {
        $scope.isIos = globalFuncs.isIos();
        
        if (jsc3l.customization.isApp()){
            globalFuncs.dowloadAppFileWithNameWithoutMessage('tmp.txt', {});
        }
    }
    
    document.addEventListener("deviceready", $scope.onDeviceReady, false);
   
   
    
    $scope.other_wallets=[];
    $scope.switchPopModal = new Modal(document.getElementById('switchPop'));
    
    $scope.openLockPopup = function(){
	
        var current = JSON.parse(localStorage.getItem('ComChainWallet')); 
        $scope.contacts = contactservice.loadLocalContacts();
        $scope.other_wallets = globalFuncs.loadWallets(false);  
        $scope.NoWallet = $scope.other_wallets.length==0;
        if (!$scope.NoWallet){
             for (var id in $scope.other_wallets){
               $scope.other_wallets[id].name=contactservice.getContactName($scope.contacts, '0x'+$scope.other_wallets[id].address);
               $scope.other_wallets[id].logo = jsc3l.customization.getCurrencyLogoUrl( $scope.other_wallets[id].file.server.name);
               $scope.other_wallets[id].has_logo = $scope.other_wallets[id].logo !='';
            }
            $scope.other_wallets.sort(function(a,b){return a.name.localeCompare(b.name); });
        }  
        
       var id_curr=-1;
       for (var id in $scope.other_wallets){
         if ($scope.other_wallets[id].address==current.address){
                      id_curr=id;
                      break;
          }
       }
       
       if (id_curr>=0){
            $scope.other_wallets.splice(id_curr, 1);
       }

       if($scope.other_wallets.length==0){
           /* No other Account available: log off and lock account*/
           authenticationService.logOff();
           $scope.lockWallet();   
       } else {
          /* Other Accounts available: open the popup*/
          $scope.switchPopModal.open();
       }
    }
    
    $scope.switchToWallet = function(address){
      for (var id in $scope.other_wallets){
           if ($scope.other_wallets[id].address==address){
               var selected_wallet=$scope.other_wallets[id];
               $scope.switchPopModal.close();
               globalFuncs.showLoading($translate.instant("GP_Wait"));
               /* The user has choosen to switch to anoter account: log off and load the new account */
               authenticationService.logOff();
              
               globalFuncs.removeWallet(); 
               setTimeout(function() {
               globalFuncs.loadWallet(selected_wallet.file, function(success){ 
                   location.reload();
               });},100);
               break;
              
                      
          }
       }            
    }
    
    $scope.lockWallet= function(){
        
        globalFuncs.removeWallet();
        location.reload();
    }
    

    
    var uls=document.getElementById('lg_mn');
    var lang = jsc3l.customization.getLang();
    uls.innerHTML='';
    var inner='';
    
    for (var indx=0; indx<lang.length;indx++){
       
        inner=inner+" <li><a ng-class=\"{true:'active'}[curLang=='"+lang[indx].name+"']\" ng-click=\"changeLanguage('"+lang[indx].code+"','"+lang[indx].name+"')\">"+lang[indx].name+"</a></li> ";
        if (indx==0){
            inner = inner +"<li role=\"separator\" class=\"divider\"></li>";
            $scope.curLang = lang[indx].name;
        }
    }
    
    
    var compiled = $compile(inner);
    angular.element(uls).append(compiled($scope));
    

    
    
    
    
	
	var hval = window.location.hash;
	$scope.setArrowVisibility = function() {
		setTimeout(function() {
			$scope.showLeftArrow = false;
			$scope.showRightArrow = !(document.querySelectorAll(".nav-inner")[0].clientWidth <= document.querySelectorAll(".nav-scroll")[0].clientWidth);
			$scope.$apply();
		}, 200);
	}
	$scope.setArrowVisibility();
	$scope.setTab = function(hval) {
		if (hval != "") {
			hval = hval.replace("#", '');
			for (var key in $scope.tabNames) {
				if ($scope.tabNames[key].url == hval) {
					$scope.activeTab = globalService.currentTab = $scope.tabNames[key].id;
					break;
				}
				$scope.activeTab = globalService.currentTab;
			}
		} else {
			$scope.activeTab = globalService.currentTab;
		}
	}
	$scope.setTab(hval);
    
    
   globalService.registerNavigate( function (address) {
       $scope.tabClick(0);
   });
    
    
	$scope.tabClick = function(id) {
		for (var key in $scope.tabNames) {
			if ($scope.tabNames[key].id == id) {
                if ($scope.tabNames[key].url=='close'){
                    $scope.openLockPopup();
                } else if ($scope.tabNames[key].url=='aide'){
                    window.open( jsc3l.customization.getHelpUrl().replace('LANG',$scope.gelLanguageCode()), "_system");
                } else{
                    if ($scope.activeTab!=id){ 
                        globalFuncs.showLoading($translate.instant("GP_Wait"));
                    }
                    location.hash = $scope.tabNames[key].url;
                    $scope.activeTab = globalService.currentTab = id;
                }
            }
		}
	}
    
    
    
    
	$scope.setLanguageVal = function (id, varName, pos) {
		$translate(id).then(function(paragraph) {
			globalFuncs[varName][pos] = paragraph;
		}, function(translationId) {
			globalFuncs[varName][pos] = translationId;
		});
	}
	$scope.setErrorMsgLanguage = function() {
		for (var i = 0; i < globalFuncs.errorMsgs.length; i++) $scope.setLanguageVal('ERROR_' + (i + 1), 'errorMsgs', i);
		for (var i = 0; i < globalFuncs.successMsgs.length; i++) $scope.setLanguageVal('SUCCESS_' + (i + 1), 'successMsgs', i);
	}
	$scope.setGethErrMsgLanguage = function() {
		globalFuncs.gethErrorMsgs = {};
		for (var s in globalFuncs.gethErrors) {
			var key = globalFuncs.gethErrors[s];
			if (key.indexOf("GETH_") === 0) {
				$scope.setLanguageVal(key,'gethErrorMsgs',key);
			}
		}
	}
	$scope.changeLanguage = function(key, value) {
		$translate.use(key);
		$scope.setErrorMsgLanguage();
		$scope.setGethErrMsgLanguage();
		$scope.curLang = value;
		$scope.setArrowVisibility();
		$scope.dropdown = false;
		localStorage.setItem("language", JSON.stringify({
			key: key,
			value: value
		}));
	};
	$scope.setLanguageFromStorage = function() {
		var lang = localStorage.getItem('language');
		if (lang == null) return;
		lang = JSON.parse(lang);
		var key = globalFuncs.stripTags(lang.key);
		var value = globalFuncs.stripTags(lang.value);
		$scope.changeLanguage(key, value);
	}
    
    $scope.gelLanguageCode = function(){
        var lang = localStorage.getItem('language');
        if (lang == null) return 'fr';
        lang = JSON.parse(lang);
        return lang.key;
    }
    
	$scope.setLanguageFromStorage();
	$scope.setHash = function(hash) {
		location.hash = hash;
		$scope.setTab(hash);
		$scope.$apply();
	}
	$scope.scrollHoverIn = function(isLeft, val) {
		clearInterval($scope.sHoverTimer);
		$scope.sHoverTimer = setInterval(function() {
			if (isLeft) $scope.scrollLeft(val);
			else $scope.scrollRight(val);
		}, 20);
	}
	$scope.scrollHoverOut = function() {
		clearInterval($scope.sHoverTimer);
	}
    $scope.setOnScrollArrows = function(){
        var ele = document.querySelectorAll(".nav-scroll")[0];
  		$scope.showLeftArrow = ele.scrollLeft > 0;
		$scope.showRightArrow = document.querySelectorAll(".nav-inner")[0].clientWidth > (ele.clientWidth + ele.scrollLeft);
        $scope.$apply();
    }
	$scope.scrollLeft = function(val) {
		var ele = document.querySelectorAll(".nav-scroll")[0];
		ele.scrollLeft -= val;
	}
	$scope.scrollRight = function(val) {
		var ele = document.querySelectorAll(".nav-scroll")[0];
		ele.scrollLeft += val;
	}
    
    
    $scope.tabClick($attrs.model);
    
    angular.element(document.querySelectorAll(".nav-scroll")[0]).bind('scroll',$scope.setOnScrollArrows);
    
    
    
    
	globalFuncs.changeHash = $scope.setHash;
   
    setInterval(globalFuncs.notifyApproval(), 30000);
    
 
       
  
   
    document.title=globalFuncs.currencies.CUR_global;
    
    $scope.dismissWaiting=function(){
      globalFuncs.hideLoadingWaiting();
   }
   

   
   // https://v2.cchosting.org/index.html?address=0x9e898bc7c13ba309a412904f07aff65a13e15d32&amount=0.01&shopId=1&txId=TEST_5fc0e4a1afa18&serverName=Lemanopolis
   // https://v2.cchosting.org/index.html?code=<code>
 
   $scope.checkURL = function(){
       var curr_url = window.location.href;
       $scope.doCheckURL (curr_url);
   }
       
  $scope.doCheckURL = function(curr_url){
       if (curr_url.indexOf('?')>=0){
            var hash_part='';
            var query =  curr_url.substring(curr_url.indexOf('?')+1); 
            if  (curr_url.indexOf('#')>=0){
                hash_part = query.substring(query.indexOf('#')); 
                query = query.substr(0,query.indexOf('#')); 
            }
            
            if (query.startsWith('code=')) {
                try {
                    var code = JSON.parse(decodeURI(query.substring(5)));
                    globalService.setCurrCode(code);
                    globalFuncs.removeWallet();
                    var new_url = curr_url.substr(0, curr_url.indexOf('?'))+hash_part; 
                    window.history.replaceState({}, document.title, new_url);
                    location.reload();
                    
                } catch(e) {
                    
                }
            } else {
                var result = {};
                query.split("&").forEach(function(part) {
                    var item = part.split("=");
                    result[item[0]] = decodeURIComponent(item[1]);
                });
                
                if (result["address"] && result["address"].length==42){
                    var data={}
                    data["address"]=result["address"];
                    if (result["amount"] && result["amount"]>0.){
                        data["amount"]=result["amount"];
                    }
                    if (result["shopId"] && result["shopId"].length>0){
                        data["shopId"]=result["shopId"];
                    }
                    if (result["txId"] && result["txId"].length>0){
                        data["txId"]=result["txId"];
                    } 
                    if (result["serverName"] && result["serverName"].length>0){
                        data["serverName"]=result["serverName"];
                    }
                    
                    globalService.setCurrAddress(data);
                }
            }
            
            // remove the parameters
            var new_url = curr_url.substr(0, curr_url.indexOf('?'))+hash_part; 
            window.history.replaceState({}, document.title, new_url);

            
       } 
   }
   
   $scope.checkURL();

   
};
module.exports = tabsCtrl;
