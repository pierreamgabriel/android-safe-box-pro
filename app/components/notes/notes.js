const processDb = require("nativescript-temporary-key-storage").processDb;
const Sqlite = require("nativescript-sqlcipher");
const dialog = require("ui/dialogs");
const Observable = require("data/observable").Observable;
const createViewModel = require("../../main-view-model").createViewModel;
const frameModule = require("ui/frame");


let rowId = "";
let note = "";    

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
frameModule.Frame.topmost().navigate("components/notes/add");    
}
function generateViewModel() {
 let viewModel = new Observable();
 viewModel.rowId2 = rowId;    
 viewModel.note2 = note;    
    
    return viewModel;
}

function receiveData(args){
 rowId = args.object.rowId;
 note = args.object.note;    
    
frameModule.Frame.topmost().navigate("components/notes/showdata")    
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


