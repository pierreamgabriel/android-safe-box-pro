const processDb = require("nativescript-temporary-key-storage").processDb;
const Sqlite = require("nativescript-sqlcipher");
const dialog = require("ui/dialogs");
const Observable = require("data/observable").Observable;
const createViewModel = require("../../main-view-model").createViewModel;
const frameModule = require("ui/frame");
const info = require("../../ads.js").info;

let rowId = "";
let brand = "";    
let number = ""; 
let verification = "";
let expiration = "";
let password = "";
let other = "";

function onNavigatingTo(args) {
	
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
        frameModule.Frame.topmost().navigate({moduleName:"components/login/login", clearHistory: true}); 
        });
    } else {
        new Sqlite("storage.db", mainKey).then(db =>{
     page.bindingContext = createViewModel(db);});
    }
    },0);  
}

function add() {
frameModule.Frame.topmost().navigate("components/creditcard/add");    
}
function generateViewModel() {
 let viewModel = new Observable();
 viewModel.rowId2 = rowId;    
 viewModel.brand2 = brand;    
 viewModel.number2 = number; 
 viewModel.verification2 = verification;
 viewModel.expiration2 = expiration;
 viewModel.password2 = password;
 viewModel.other2 = other;	
	
 viewModel.src = info.src;	
 viewModel.link = info.link;	
    
    return viewModel;
}

function receiveData(args){
 rowId = args.object.rowId;
 brand = args.object.brand;    
 number = args.object.number; 
 verification = args.object.verification;   
 expiration = args.object.expiration;     
 password = args.object.password;
 other = args.object.other;	
    
frameModule.Frame.topmost().navigate("components/creditcard/showdata")    
}

exports.backEvent = function(args) {
  args.cancel = true; 
  frameModule.Frame.topmost().navigate({moduleName:"components/main/main",clearHistory: true }); 
 
}
function goBack(){
frameModule.Frame.topmost().navigate("components/main/main");     
}

exports.onNavigatingTo = onNavigatingTo;
exports.add = add;
exports.generateViewModel = generateViewModel;
exports.receiveData = receiveData;
exports.goBack = goBack;

function openlink() {
	utils.openUrl(info.link);
}

exports.openlink = openlink;

