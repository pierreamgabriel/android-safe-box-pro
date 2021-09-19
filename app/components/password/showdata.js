const generateViewModel = require("./password").generateViewModel;
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
let name = args.object.name;    
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
    db.execSQL('UPDATE other_passwords SET name = "' + name + '",password = "' + password + '",other_info = "' + other + '" WHERE id = ' + rowId); 
     }).then(function() {
        let options = {title:"", message:"The information was successfully updated.",okButtonText: "OK" };        
        dialog.alert(options).then(function(){
        frameModule.topmost().navigate("components/password/password");        
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
    db.execSQL("DELETE FROM other_passwords WHERE id =" + rowId);  
     }).then(function() {
        let options = {title:"", message:"The information was successfully deleted.",okButtonText: "OK" };        
        dialog.alert(options).then(function(){
        frameModule.topmost().navigate("components/password/password");        
                }); 
    });
    }
    },0);    
}
function goBack(){
frameModule.topmost().navigate("components/password/password");     
}
exports.onNavigatingTo = onNavigatingTo;
exports.editData = editData;
exports.deleteData = deleteData;
exports.goBack = goBack;

function dismissSoftInput(args) {
    utils.ad.dismissSoftInput();
}
exports.dismissSoftInput = dismissSoftInput;