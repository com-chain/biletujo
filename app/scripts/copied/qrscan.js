var resultDiv;

//function init() {
//	document.querySelector("#startScan").addEventListener("touchend", startScan, false);
//	resultDiv = document.querySelector("#results");
//};

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
};

function hello(string){
    var name=string
    document.getElementById('toField').value=name;
};

function startScan() {
	cordova.plugins.barcodeScanner.scan(
		function (result) {
			hello(result.text);
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}
	);
	document.getElementById('closeBtn').click();
};

