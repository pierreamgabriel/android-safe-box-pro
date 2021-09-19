const observableModule = require("data/observable");
const Sqlite = require("nativescript-sqlcipher");
const dialogsModule = require("ui/dialogs");
const frameModule = require("ui/frame");
const utils = require("tns-core-modules/utils/utils");
const application = require("application");
const CryptoJS = require("crypto-js");

let changeKey = new observableModule.fromObject({
    key: "",
    newKey: "",
	confirmKey: ""
});    

function changePass() {
	let salt = CryptoJS.SHA256(changeKey.key).toString();
	let derivedKey = CryptoJS.PBKDF2(changeKey.key, salt, {keySize: 256 / 32}).toString();
	let password = {key: derivedKey};
	let salt2 = CryptoJS.SHA256(changeKey.newKey).toString();
	let newDerivedKey = CryptoJS.PBKDF2(changeKey.newKey, salt2, {keySize: 256 / 32}).toString();
	
	if (changeKey.newKey.length < 10){
    dialogsModule.alert("Your password must contain at least 10 characters.")    
    } 
    else if (changeKey.newKey != changeKey.confirmKey){
    dialogsModule.alert("Passwords don't match.");    
    }
    else {
	
	new Sqlite("storage.db", password).then(db =>{           
      db.execSQL("PRAGMA rekey = '" + newDerivedKey + "';");
	  let options = {title:"", message:"Your password was succesfully changed.", okButtonText:"OK"};    
      dialogsModule.alert(options);	
	  changeKey.key = "";
      changeKey.newKey = "";
      changeKey.confirmKey = "";	
	  Sqlite.deleteDatabase("logged");    
      frameModule.topmost().navigate({moduleName:"components/login/login", clearHistory: true});	
      }, error => {
        alert("Your current password is incorrect. Please try again.");
    });
}
}

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = changeKey;
};

function goBack(){
changeKey.key = "";
changeKey.newKey = "";
changeKey.confirmKey = "";
frameModule.topmost().navigate({moduleName:"components/main/main", clearHistory: true});     
}
exports.goBack = goBack;
exports.changePass = changePass;

function dismissSoftInput(args) {
    utils.ad.dismissSoftInput();
}
exports.dismissSoftInput = dismissSoftInput;

if (application.android) {
    application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
}

function backEvent(args) {
	changeKey.key = "";
    changeKey.newKey = "";
    changeKey.confirmKey = "";
    var currentPage = frameModule.topmost().currentPage;
    if (currentPage && currentPage.exports && typeof currentPage.exports.backEvent === "function") {
         currentPage.exports.backEvent(args);
   }
}