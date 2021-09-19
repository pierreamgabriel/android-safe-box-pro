const processDb = require("nativescript-temporary-key-storage").processDb;
const Sqlite = require("nativescript-sqlcipher");
const dialog = require("ui/dialogs");
const Observable = require("data/observable").Observable;
const createViewModel = require("../../main-view-model").createViewModel;
const listViewModule = require("ui/list-view");
const frameModule = require("ui/frame");
const ads = require("../../admob").ads;


let rowId = "";
let name = "";    
let password = ""; 
let other = "";

function onNavigatingTo(args) {
	ads();
    let page = args.object; 
    let mainKey = {key:""};
    let requestKey = new processDb();
    requestKey.getKey(); 
    setTimeout(function() { 
        mainKey.key = requestKey.returnKey();
         if (mainKey.key === ""){
        Sqlite.deleteDatabase("logged");     
        let options = {title:"Session expired", message:"You need to log in again.", okButtonText:"OK"};    
        dialog.alert(options).then(function(){
        frameModule.topmost().navigate({moduleName:"components/login/login", clearHistory: true}); 
        });
    } else {
        new Sqlite("storage.db", mainKey).then(db =>{
     page.bindingContext = createViewModel(db);});
    }
    },0);  
}

function add() {
frameModule.topmost().navigate("components/password/add");    
}
function generateViewModel() {
 var viewModel = new Observable();
 viewModel.rowId2 = rowId;    
 viewModel.name2 = name;    
 viewModel.password2 = password; 
 viewModel.other2 = other;
    
    return viewModel;
}

function receiveData(args){
 rowId = args.object.rowId;
 name = args.object.name;    
 password = args.object.password; 
 other = args.object.other;     
frameModule.topmost().navigate("components/password/showdata")    
}

exports.backEvent = function(args) {
  args.cancel = true; 
  frameModule.topmost().navigate({moduleName:"components/main/main",clearHistory: true }); 
 
}

function goBack(){
frameModule.topmost().navigate("components/main/main");     
}

exports.onNavigatingTo = onNavigatingTo;
exports.add = add;
exports.generateViewModel = generateViewModel;
exports.receiveData = receiveData;
exports.goBack = goBack;


