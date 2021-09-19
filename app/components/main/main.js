const Sqlite = require("nativescript-sqlcipher");
const layout = require("ui/layouts/grid-layout");
const observableModule = require("data/observable");
const dialog = require("ui/dialogs");
const frameModule = require("ui/frame");
const fileSystemModule = require("tns-core-modules/file-system");
const application = require("application");
const permissions = require('nativescript-permissions');


exports.loaded = function() {  
	
if (!Sqlite.exists("registered") && !Sqlite.exists("logged")) {
    frameModule.topmost().navigate({moduleName:"components/register/register", clearHistory: true});  
    } else   
if (!Sqlite.exists("logged")) {
    frameModule.topmost().navigate({moduleName:"components/login/login", clearHistory: true});  
    } 
};

exports.goTo = function(id) {
id = id.object.id;
switch (id) {
    case "personalDoc":
frameModule.topmost().navigate("components/document/document")   
    break;
    case "note":
frameModule.topmost().navigate("components/notes/notes")   
    break;
    case "password":
frameModule.topmost().navigate("components/password/password")   
    break;
    case "webLogin":
frameModule.topmost().navigate("components/website/website")   
    break;
    case "creditCard":
frameModule.topmost().navigate("components/creditcard/creditcard")   
    break;
    case "bank":
frameModule.topmost().navigate("components/bank/bank")   
    break;
	case "help":
	frameModule.topmost().navigate("components/help/help")	
	break;	
	case "change":
	frameModule.topmost().navigate("components/change/change")	
    break;    
}    
}

exports.logout = function() {
    let options = {title:"", message:"Do you really want to log out?", okButtonText:"YES", cancelButtonText: "NO"};    
        dialog.confirm(options).then(function(result){
        if(result === true) {    
        Sqlite.deleteDatabase("logged");    
        frameModule.topmost().navigate({moduleName:"components/login/login", clearHistory: true}); 
        }
        });
}

function exportDB() {
	
	if (android.os.Build.VERSION.SDK_INT >= 30) {
     let options = {title:"Database backup", message:"Are you sure you want to proceed? If you continue, your previous backup inside the Documents/AndroidSafeBox folder will be overwritten.", okButtonText:"YES", cancelButtonText: "NO"};	
	dialog.confirm(options).then(function (answer){
    if (answer === true) {
    export_DB();
    }
}); 	
}
	
	else if (!permissions.hasPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
		permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, "")
  .then( () => {		
    let options = {title:"Database backup", message:"Are you sure you want to proceed? If you continue, your previous backup inside the Documents/AndroidSafeBox folder will be overwritten.", okButtonText:"YES", cancelButtonText: "NO"};	
	dialog.confirm(options).then(function (answer){
    if (answer === true) {
    export_DB();
    }
}); 
  })
  .catch( () => {
     alert('We need your permission to export your database.');
  });
	} else {
    let options = {title:"Database backup", message:"Are you sure you want to proceed? If you continue, your previous backup inside the Documents/AndroidSafeBox folder will be overwritten.", okButtonText:"YES", cancelButtonText: "NO"};	
	dialog.confirm(options).then(function (answer){
    if (answer === true) {
    export_DB();
    }
}); 
	}
	
    function export_DB() {
	
	var storage1 = new java.io.File("/storage/emulated/0");
	var storage2 = new java.io.File("/sdcard");	
	var SDKver = android.os.Build.VERSION.SDK_INT;
	var checkFile1 = fileSystemModule.File.exists("/storage/emulated/0/Documents/AndroidSafeBox/storage.db");
	var checkFile2 = fileSystemModule.File.exists("/sdcard/Documents/AndroidSafeBox/storage.db"); 	
			
		
		if ((SDKver >= 30 && checkFile1) || (SDKver >= 30 && checkFile2 )) {
			let options = {title: "Alert", message: "Before making a new backup, you must delete the storage.db file inside the Documents/AndroidSafeBox folder.", okButtonText:"OK"};
			dialog.confirm(options);
			
			}
	
		else if (storage1.exists()) {
	try {
        var javaFile = new java.io.File("/storage/emulated/0/Documents/AndroidSafeBox");
        if (!javaFile.exists()) {
            javaFile.mkdirs();
            javaFile.setReadable(true);
            javaFile.setWritable(true);
        } 
    }
    catch (err) {
        console.info("Error", err);
    }	
		
    var myInput = new java.io.FileInputStream(application.android.context.getDatabasePath("storage.db").getAbsolutePath());
    var myOutput = new java.io.FileOutputStream("/storage/emulated/0/Documents/AndroidSafeBox/storage.db");

    try {
        var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.class.getField("TYPE").get(null), 1024);
        var length;
        while ((length = myInput.read(buffer)) > 0) {
            myOutput.write(buffer, 0, length);
        }
    }
    catch (err) {
        alert("Something went wrong. Please try again, and if the problem persists, contact us at techstuff@virgopublishers.com.");
    } finally {
		let options = {title:"Success", message:"Your encrypted database was exported to Documents/AndroidSafeBox/storage.db on your phone.", okButtonText:"OK"};    
        dialog.alert(options);
	}

    myOutput.flush();
    myOutput.close();
    myInput.close();
			
		} else if (storage2.exists()) {
	try {
        var javaFile = new java.io.File("/sdcard/Documents/AndroidSafeBox");
        if (!javaFile.exists()) {
            javaFile.mkdirs();
            javaFile.setReadable(true);
            javaFile.setWritable(true);
        } 
    }
    catch (err) {
        console.info("Error", err);
    }	
		
    var myInput = new java.io.FileInputStream(application.android.context.getDatabasePath("storage.db").getAbsolutePath());
    var myOutput = new java.io.FileOutputStream("/sdcard/Documents/AndroidSafeBox/storage.db");

    try {
        var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.class.getField("TYPE").get(null), 1024);
        var length;
        while ((length = myInput.read(buffer)) > 0) {
            myOutput.write(buffer, 0, length);
        }
    }
    catch (err) {
        alert("Something went wrong. Please try again, and if the problem persists, contact us at techstuff@virgopublishers.com.");
    } finally {
		let options = {title:"Success", message:"Your encrypted database was exported to Documents/AndroidSafeBox/storage.db on your phone.", okButtonText:"OK"};    
        dialog.alert(options);
	}

    myOutput.flush();
    myOutput.close();
    myInput.close();		
			
	} else {
			
			alert("Sorry, we couldn't identify your device storage. Contact us at techstuff@virgopublishers.com.")
		}
	}
}
exports.exportDB = exportDB;

function importDB() {
	
	if (android.os.Build.VERSION.SDK_INT >= 30) {
     let options = {title:"Database import", message:"Are you sure you want to proceed? If you continue, your current database will be deleted.", okButtonText:"YES", cancelButtonText: "NO"};	
	dialog.confirm(options).then(function (answer){
    if (answer === true) {
    import_DB();
    }
}); 
}

	else if (!permissions.hasPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE)) {
		permissions.requestPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE, "")
  .then( () => {	
	let options = {title:"Database import", message:"Are you sure you want to proceed? If you continue, your current database will be deleted.", okButtonText:"YES", cancelButtonText: "NO"};	
	dialog.confirm(options).then(function (answer){
    if (answer === true) {
    import_DB();
    }
}); 
  })
  .catch( () => {
     alert('We need your permission to import your database.');
  });
	} else {
	let options = {title:"Database import", message:"Are you sure you want to proceed? If you continue, your current database will be deleted.", okButtonText:"YES", cancelButtonText: "NO"};	
	dialog.confirm(options).then(function (answer){
    if (answer === true) {
    import_DB();
    }
}); 
	}
	
	function import_DB() {
	
		if(fileSystemModule.File.exists("/storage/emulated/0/Documents/AndroidSafeBox/storage.db")) {
    var myInput = new java.io.FileInputStream("/storage/emulated/0/Documents/AndroidSafeBox/storage.db");
    var myOutput = new java.io.FileOutputStream(application.android.context.getDatabasePath("storage.db").getAbsolutePath());

    try {
        var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.class.getField("TYPE").get(null), 1024);
        var length;
        while ((length = myInput.read(buffer)) > 0) {
            myOutput.write(buffer, 0, length);
        }
    }
    catch (err) {
        console.info("Error");
    } finally {
		let options = {title:"Success", message:"Your database was successfully imported. You need to log in again.", okButtonText:"OK"};    
        dialog.alert(options).then ( () => {
		Sqlite.deleteDatabase("logged");    
        frameModule.topmost().navigate({moduleName:"components/login/login", clearHistory: true}); 	
		});
	}

    myOutput.flush();
    myOutput.close();
    myInput.close();
	} else if (fileSystemModule.File.exists("/sdcard/Documents/AndroidSafeBox/storage.db")) {
		var myInput = new java.io.FileInputStream("/sdcard/Documents/AndroidSafeBox/storage.db");
        var myOutput = new java.io.FileOutputStream(application.android.context.getDatabasePath("storage.db").getAbsolutePath());

    try {
        var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.class.getField("TYPE").get(null), 1024);
        var length;
        while ((length = myInput.read(buffer)) > 0) {
            myOutput.write(buffer, 0, length);
        }
    }
    catch (err) {
        console.info("Error");
    } finally {
		let options = {title:"Success", message:"Your database was successfully imported. You need to log in again.", okButtonText:"OK"};    
        dialog.alert(options).then ( () => {
		Sqlite.deleteDatabase("logged");    
        frameModule.topmost().navigate({moduleName:"components/login/login", clearHistory: true}); 	
		});
	}

    myOutput.flush();
    myOutput.close();
    myInput.close();	   
			   
	} else {
		alert("Something went wrong. Please make sure there is a folder named AndroidSafeBox inside the Documents folder in this device storage. Also, the AndroidSafeBox folder must contain a storage.db file.");
	}
	}
}
exports.importDB = importDB;
