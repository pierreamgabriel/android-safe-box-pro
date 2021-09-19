const generateViewModel = require("./creditcard").generateViewModel;
const processDb = require("nativescript-temporary-key-storage").processDb;
const Sqlite = require("nativescript-sqlcipher");
const dialog = require("ui/dialogs");
const frameModule = require("ui/frame");
const utils = require("tns-core-modules/utils/utils");
const ads = require("../../admob").ads;


function onNavigatingTo(args) {
	ads();
    let page = args.object;
    page.bindingContext = generateViewModel();   
}

function editData(args){  
let rowId = args.object.rowId;     
let brand = args.object.brand;    
let number = args.object.number; 
let verification = args.object.verification; 
let expiration = args.object.expiration;     
let password = args.object.password; 
let other = args.object.other;	
let mainKey = {key:""};
    let requestKey = new processDb();
    requestKey.getKey(); 
    setTimeout(function() { 
        mainKey.key = requestKey.returnKey();
         if (mainKey.key === ""){
        Sqlite.deleteDatabase("logged");     
        let options = {title:"Session expired", message:"You need to login again.", okButtonText:"OK"};    
        dialog.alert(options).then(function(){
        frameModule.topmost().navigate({moduleName:"components/login/login", clearHistory: true});   
        });
    } else {
       new Sqlite("storage.db", mainKey).then(db => {
    db.execSQL('UPDATE credit_card SET brand = "' + brand + '",number = "' + number + '",verification = "' + verification + '",expiration_date = "' + expiration + '",password = "' + password + '",other_info = "' + other + '" WHERE id = ' + rowId); 
     }).then(function() {
        let options = {title:"", message:"The information was successfully updated.",okButtonText: "OK" };        
        dialog.alert(options).then(function(){
        frameModule.topmost().navigate("components/creditcard/creditcard");        
                });  	   
    });
    }
    },0);    
}
function deleteData(args){   
let rowId = args.object.rowId;    
dialog.confirm("Are you sure you want to proceed? Once deleted, you can't recover this data.").then(function (answer){
    if (answer === true) {
    proceed(rowId);
    }
}); 
}
function proceed(args) { 
let rowId = args;   
let mainKey = {key:""};
    let requestKey = new processDb();
    requestKey.getKey(); 
    setTimeout(function() { 
        mainKey.key = requestKey.returnKey();
         if (mainKey.key === ""){
        Sqlite.deleteDatabase("logged");     
        let options = {title:"Session expired", message:"You need to login again.", okButtonText:"OK"};    
        dialog.alert(options).then(function(){
        frameModule.topmost().navigate({moduleName:"components/login/login", clearHistory: true});   
        });
    } else {
      new Sqlite("storage.db", mainKey).then(db => {
    db.execSQL("DELETE FROM credit_card WHERE id =" + rowId);  
     }).then(function() {
        let options = {title:"", message:"The information was successfully deleted.",okButtonText: "OK" };        
        dialog.alert(options).then(function(){
        frameModule.topmost().navigate("components/creditcard/creditcard");        
                }); 
    });
    }
    },0);    
}
function goBack(){
frameModule.topmost().navigate("components/creditcard/creditcard");     
}
exports.onNavigatingTo = onNavigatingTo;
exports.editData = editData;
exports.deleteData = deleteData;
exports.goBack = goBack;

function dismissSoftInput(args) {
    utils.ad.dismissSoftInput();
}
exports.dismissSoftInput = dismissSoftInput;