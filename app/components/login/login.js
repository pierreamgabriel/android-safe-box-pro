const observableModule = require("data/observable");
const keyStorage = require("nativescript-temporary-key-storage").keyStorage;
const Sqlite = require("nativescript-sqlcipher");
const frameModule = require("ui/frame");
const utils = require("tns-core-modules/utils/utils");
const CryptoJS = require("crypto-js");
const application = require("application");


let openKey = new observableModule.fromObject({
    key: "",
});    

function openDB() {
    let salt = CryptoJS.SHA256(openKey.key).toString();
	let derivedKey = CryptoJS.PBKDF2(openKey.key, salt, {keySize: 256 / 32}).toString();
    let password = {key: derivedKey};
    
    keyStorage(derivedKey, 9000);
    
    new Sqlite("storage.db", password).then(db =>{
      db.execSQL('CREATE TABLE IF NOT EXISTS bank_account (id INTEGER PRIMARY KEY AUTOINCREMENT, bank_name TEXT, account_number TEXT, password TEXT, other_info TEXT)');
      db.execSQL('CREATE TABLE IF NOT EXISTS credit_card (id INTEGER PRIMARY KEY AUTOINCREMENT, brand TEXT, number TEXT, verification TEXT, expiration_date TEXT, password TEXT)');  
      db.execSQL('CREATE TABLE IF NOT EXISTS website (id INTEGER PRIMARY KEY AUTOINCREMENT, site TEXT, username TEXT, password TEXT)');    
      db.execSQL('CREATE TABLE IF NOT EXISTS other_passwords (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT, other_info TEXT)'); 
      db.execSQL('CREATE TABLE IF NOT EXISTS documents (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, number TEXT, issue_date TEXT, expiration_date TEXT, other_info TEXT)'); 
      db.execSQL('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, note TEXT)').then(id => {
      new Sqlite("logged");  
      openKey.key = "";      
      page.bindingContext = createViewModel(db);  
     }, error => {
            
        });
    }, error => {
        alert("There was an error opening the database. Please check your password and try again.");
    }).then(function() {
        if (Sqlite.exists("logged")) {
         frameModule.Frame.topmost().navigate({moduleName:"components/main/main", clearHistory: true});    
        }
    });
    }

function dismissSoftInput() {
    utils.ad.dismissSoftInput();
}
exports.dismissSoftInput = dismissSoftInput;

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = openKey;
};
exports.openDB = openDB;

if (application.android) {
    application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
}

function backEvent(args) {
	openKey.key = "";
    let currentPage = frameModule.Frame.topmost().currentPage;
    if (currentPage && currentPage.exports && typeof currentPage.exports.backEvent === "function") {
         currentPage.exports.backEvent(args);
   }
}


