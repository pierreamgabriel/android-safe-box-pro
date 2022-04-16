const frameModule = require("ui/frame");
const dialog = require("ui/dialogs");

exports.agree = function() {
    frameModule.Frame.topmost().navigate("components/register/register");
};

exports.disagree = function() {
	let options = {title:"", message:"Do you want to exit the app?", okButtonText:"YES", cancelButtonText: "NO"};    
        dialog.confirm(options).then(function(result){
        if(result === true) {    
        android.os.Process.killProcess(android.os.Process.myPid()); 
        }
        });
};