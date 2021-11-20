const processDb = require("nativescript-temporary-key-storage").processDb;
const Sqlite = require("nativescript-sqlcipher");
const createViewModel = require("../../main-view-model").createViewModel;
const textViewModule = require("ui/text-view");
const dialog = require("ui/dialogs");
const frameModule = require("ui/frame");


function onNavigatingTo(args) {
	
    let page = args.object; 
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
        new Sqlite("storage.db", mainKey).then(db =>{
     page.bindingContext = createViewModel(db);});
    }
    },0);    
}

function goBack(){
frameModule.topmost().navigate("components/notes/notes");     
}
exports.onNavigatingTo = onNavigatingTo;
exports.goBack = goBack;