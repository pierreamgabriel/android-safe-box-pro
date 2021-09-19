const Observable = require("data/observable").Observable;
const Sqlite = require("nativescript-sqlcipher");
const dialog = require("ui/dialogs");
const frameModule = require("ui/frame");


function createViewModel(db) {
    let viewModel = new Observable();
    viewModel.siteName = "";
    viewModel.siteUser = "";
    viewModel.sitePass = "";
    viewModel.otherName = "";
    viewModel.otherPass = "";
    viewModel.otherInfo = "";
    viewModel.bankName = "";
    viewModel.bankAccount = "";
    viewModel.bankPass = "";
    viewModel.bankOther = "";
    viewModel.ccBrand = "";
    viewModel.ccNumber = "";
    viewModel.ccVerification = "";
    viewModel.ccEpiration = "";
    viewModel.ccPass = "";
	viewModel.ccOther = "";
    viewModel.docType = "";
    viewModel.docNumber = "";
    viewModel.docIssue = "";
    viewModel.docExpiration = "";
    viewModel.docOther = "";
    viewModel.note = "";
    
    viewModel.websiteResults = [];
    viewModel.otherPassResults = [];
    viewModel.bankResults = [];
    viewModel.ccResults = [];
    viewModel.docResults = [];
    viewModel.noteResults = [];
    
    
    viewModel.webSite = function(args) {
        if(viewModel.siteName.length === 0){
        dialog.alert({title:"", message:"The website field is required.", okButtonText:"OK"});    
        }else {
        db.execSQL("INSERT INTO website (site, username, password) VALUES (?, ?, ?)", [this.siteName, this.siteUser, this.sitePass]).then(id => {
            dialog.alert({title: "",message: "Data added successfully.",okButtonText: "Ok"}).then(function(){
        frameModule.topmost().navigate("components/website/website");    
        });
        }, error => {
            dialog.alert("There was an error adding your data. Please try again.");
        });
        }
    }
    
    viewModel.other = function() {
        if(viewModel.otherName.length === 0){
        dialog.alert({title:"", message:"The name field is required.", okButtonText:"OK"});    
        }else {
        db.execSQL("INSERT INTO other_passwords (name, password, other_info) VALUES (?, ?, ?)", [this.otherName, this.otherPass, this.otherInfo]).then(id => {
             dialog.alert({title: "",message: "Data added successfully.",okButtonText: "OK"}).then(function(){
        frameModule.topmost().navigate("components/password/password");    
        });         
        }, error => {
            dialog.alert("There was an error adding your data. Please try again.");
        });
        }
    }
    
    viewModel.bank = function() {
        if(viewModel.bankName.length === 0){
        dialog.alert({title:"", message:"The bank field is required.", okButtonText:"OK"});    
        }else {
        db.execSQL("INSERT INTO bank_account (bank_name, account_number, password, other_info) VALUES (?, ?, ?, ?)", [this.bankName, this.bankAccount, this.bankPass, this.bankOther]).then(id => {
             dialog.alert({title: "",message: "Data added successfully.",okButtonText: "OK"}).then(function(){
        frameModule.topmost().navigate("components/bank/bank");
        });         
        }, error => {
            dialog.alert("There was an error adding your data. Please try again.");
        });
        }
    }
    
    viewModel.creditCard = function() {
        if(viewModel.ccBrand.length === 0){
        dialog.alert({title:"", message:"The brand field is required.", okButtonText:"OK"});    
        }else {
        db.execSQL("INSERT INTO credit_card (brand, number, verification, expiration_date, password, other_info) VALUES (?, ?, ?, ?, ?, ?)", [this.ccBrand, this.ccNumber, this.ccVerification, this.ccEpiration, this.ccPass, this.ccOther]).then(id => {
             dialog.alert({title: "",message: "Data added successfully.",okButtonText: "OK"}).then(function(){
        frameModule.topmost().navigate("components/creditcard/creditcard");
        });         
        }, error => {
            dialog.alert("There was an error adding your data. Please try again.");
        });
        }
    }
    
    viewModel.documents = function() {
        if(viewModel.docType.length === 0){
        dialog.alert({title:"", message:"The type field is required.", okButtonText:"OK"});    
        }else {   
        db.execSQL("INSERT INTO documents (type, number, issue_date, expiration_date, other_info) VALUES (?, ?, ?, ?, ?)", [this.docType, this.docNumber, this.docIssue, this.docExpiration, this.docOther]).then(id => {
             dialog.alert({title: "",message: "Data added successfully.",okButtonText: "OK"}).then(function(){
        frameModule.topmost().navigate("components/document/document");
        });         
        }, error => {
            dialog.alert("There was an error adding your data. Please try again.");
        });
        }
    }
    
    viewModel.notes = function() {
		if(viewModel.note.length === 0){
        dialog.alert({title:"", message:"Please type something.", okButtonText:"OK"});    
        } else {
        db.execSQL("INSERT INTO notes (note) VALUES (?)", [this.note]).then(id => {
             dialog.alert({title: "",message: "Data added successfully.",okButtonText: "OK"}).then(function(){
        frameModule.topmost().navigate("components/notes/notes");
        });         
        }, error => {
            dialog.alert("There was an error adding your data. Please try again.");
        });
		}
    }



    viewModel.selectWebsite = function() {
        if (viewModel.websiteResults.length != 0){
            viewModel.websiteResults = [];
        }
        db.all("SELECT * FROM website").then(rows => {
            for(var row in rows) {
                viewModel.websiteResults.push({id: rows[row][0], site: rows[row][1], username: rows[row][2], password: rows[row][3]});
            }
        }, (e) => {
            console.log(e);
        });
    }
    
    viewModel.selectOtherPass = function() {
        if (viewModel.otherPassResults.length != 0){
            viewModel.otherPassResults = [];
        }
        db.all("SELECT * FROM other_passwords").then(rows => {
            for(var row in rows) {
                viewModel.otherPassResults.push({id: rows[row][0], name: rows[row][1], password: rows[row][2], other_info: rows[row][3]});
            }
        }, (error) => {
            console.log(e);
        });
    }
    
    viewModel.selectBank = function() {
        if (viewModel.bankResults.length != 0){
            viewModel.bankResults = [];
        }
        db.all("SELECT * FROM bank_account").then(rows => {
            for(var row in rows) {
                viewModel.bankResults.push({id: rows[row][0], bank_name: rows[row][1], account_number: rows[row][2], password: rows[row][3], other_info:rows[row][4] });
            }
        }, (error) => {
            console.log(e);
        });
    }
    
    viewModel.selectCc = function() {
        if (viewModel.ccResults.length != 0){
            viewModel.ccResults = [];
        }
        db.all("SELECT * FROM credit_card").then(rows => {
            for(var row in rows) {
                viewModel.ccResults.push({id: rows[row][0], brand: rows[row][1], number: rows[row][2], verification: rows[row][3], expiration: rows[row][4], password: rows[row][5], other_info:rows[row][6]});
            }
        }, (error) => {
            console.log(e);
        });
    }
    
    viewModel.selectDocs = function() {
        if (viewModel.docResults.length != 0){
            viewModel.docResults = [];
        }
        db.all("SELECT * FROM documents").then(rows => {
            for(var row in rows) {   
                viewModel.docResults.push({id: rows[row][0], type: rows[row][1], number: rows[row][2], issue: rows[row][3], expiration: rows[row][4], other: rows[row][5]});
            }
        }, (error) => {
            console.log(e);
        });
        
    }

    viewModel.selectNotes = function() {
        if (viewModel.noteResults.length != 0){
            viewModel.noteResults = [];
        }
        db.all("SELECT * FROM notes").then(rows => {
            for(var row in rows) {
                viewModel.noteResults.push({id: rows[row][0], note: rows[row][1]});
            }
        }, (error) => {
            console.log(e);
        });
    }


    return viewModel;
}

exports.createViewModel = createViewModel;

