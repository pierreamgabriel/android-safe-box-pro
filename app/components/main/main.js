const Sqlite = require("nativescript-sqlcipher");
const dialog = require("ui/dialogs");
const frameModule = require("ui/frame");
const permissions = require("nativescript-permissions");
const storage = require("../../modules/storage.android");

exports.loaded = function () {
    if (!Sqlite.exists("registered") && !Sqlite.exists("logged")) {
        frameModule.Frame.topmost().navigate({
            moduleName: "components/register/register",
            clearHistory: true,
        });
    } else if (!Sqlite.exists("logged")) {
        frameModule.Frame.topmost().navigate({
            moduleName: "components/login/login",
            clearHistory: true,
        });
    }
};

exports.goTo = function (id) {
    id = id.object.id;
    switch (id) {
        case "personalDoc":
            frameModule.Frame.topmost().navigate(
                "components/document/document"
            );
            break;
        case "note":
            frameModule.Frame.topmost().navigate("components/notes/notes");
            break;
        case "password":
            frameModule.Frame.topmost().navigate(
                "components/password/password"
            );
            break;
        case "webLogin":
            frameModule.Frame.topmost().navigate("components/website/website");
            break;
        case "creditCard":
            frameModule.Frame.topmost().navigate(
                "components/creditcard/creditcard"
            );
            break;
        case "bank":
            frameModule.Frame.topmost().navigate("components/bank/bank");
            break;
        case "help":
            frameModule.Frame.topmost().navigate("components/help/help");
            break;
        case "change":
            frameModule.Frame.topmost().navigate("components/change/change");
            break;
    }
};

exports.logout = function () {
    let options = {
        title: "",
        message: "Do you really want to log out?",
        okButtonText: "YES",
        cancelButtonText: "NO",
    };
    dialog.confirm(options).then(function (result) {
        if (result === true) {
            Sqlite.deleteDatabase("logged");
            frameModule.Frame.topmost().navigate({
                moduleName: "components/login/login",
                clearHistory: true,
            });
        }
    });
};

function exportDB() {
    const showDialog = () => {
        let options = {
            title: "Database backup",
            message:
                "Are you sure you want to proceed? If you continue, your previous backup inside the Documents/AndroidSafeBox folder will be overwritten.",
            okButtonText: "YES",
            cancelButtonText: "NO",
        };
        dialog.confirm(options).then(function (answer) {
            if (answer === true) {
                export_DB();
            }
        });
    };

    if (android.os.Build.VERSION.SDK_INT >= 30) {
        showDialog();
    } else if (
        !permissions.hasPermission(
            android.Manifest.permission.WRITE_EXTERNAL_STORAGE
        )
    ) {
        permissions
            .requestPermission(
                android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
                ""
            )
            .then(() => {
                showDialog();
            })
            .catch(() => {
                alert("We need your permission to export your database.");
            });
    } else {
        showDialog();
    }

    function export_DB() {
        let check = storage.check("/Documents/AndroidSafeBox", "storage.db");
        let permission = storage.permission(
            "/Documents/AndroidSafeBox",
            "storage.db"
        );

        if (check) {
            if (!permission) {
                let options = {
                    title: "Alert",
                    message:
                        "Before making a new backup, you must delete the storage.db file inside the Documents/AndroidSafeBox folder.",
                    okButtonText: "OK",
                };
                dialog.confirm(options);
            } else {
                if (storage.save("/Documents/AndroidSafeBox", "storage.db")) {
                    let options = {
                        title: "Success",
                        message:
                            "Your encrypted database was exported to Documents/AndroidSafeBox/storage.db on your phone.",
                        okButtonText: "OK",
                    };
                    dialog.alert(options);
                } else {
                    alert(
                        "Something went wrong. Please try again, and if the problem persists, contact us at techstuff@virgopublishers.com."
                    );
                }
            }
        } else {
            if (storage.save("/Documents/AndroidSafeBox", "storage.db")) {
                let options = {
                    title: "Success",
                    message:
                        "Your encrypted database was exported to Documents/AndroidSafeBox/storage.db on your phone.",
                    okButtonText: "OK",
                };
                dialog.alert(options);
            } else {
                alert(
                    "Something went wrong. Please try again, and if the problem persists, contact us at techstuff@virgopublishers.com."
                );
            }
        }
    }
}
exports.exportDB = exportDB;

function importDB() {
    const showDialog = () => {
        let options = {
            title: "Database import",
            message:
                "Are you sure you want to proceed? If you continue, your current database will be deleted.",
            okButtonText: "YES",
            cancelButtonText: "NO",
        };
        dialog.confirm(options).then(function (answer) {
            if (answer === true) {
                import_DB();
            }
        });
    };
    if (android.os.Build.VERSION.SDK_INT >= 30) {
        showDialog();
    } else if (
        !permissions.hasPermission(
            android.Manifest.permission.READ_EXTERNAL_STORAGE
        )
    ) {
        permissions
            .requestPermission(
                android.Manifest.permission.READ_EXTERNAL_STORAGE,
                ""
            )
            .then(() => {
                showDialog();
            })
            .catch(() => {
                alert("We need your permission to import your database.");
            });
    } else {
        showDialog();
    }

    function import_DB() {
        let check = storage.check("/Documents/AndroidSafeBox", "storage.db");
        let permission = storage.permission(
            "/Documents/AndroidSafeBox",
            "storage.db"
        );

        if (check) {
            if (!permission) {
                let options = {
                    title: "Alert",
                    message:
                        "Sorry, we can't import your backup on Android 11+.",
                    okButtonText: "OK",
                };
                dialog.confirm(options);
            } else {
                if (storage.import("/Documents/AndroidSafeBox", "storage.db")) {
                    let options = {
                        title: "Success",
                        message:
                            "Your database was successfully imported. You need to log in again.",
                        okButtonText: "OK",
                    };
                    dialog.alert(options).then(() => {
                        Sqlite.deleteDatabase("logged");
                        frameModule.Frame.topmost().navigate({
                            moduleName: "components/login/login",
                            clearHistory: true,
                        });
                    });
                } else {
                    alert(
                        "Something went wrong. Please make sure there is a folder named AndroidSafeBox inside the Documents folder in this device storage. Also, the AndroidSafeBox folder must contain a storage.db file."
                    );
                }
            }
        } else {
            alert(
                "Something went wrong. Please make sure there is a folder named AndroidSafeBox inside the Documents folder in this device storage. Also, the AndroidSafeBox folder must contain a storage.db file."
            );
        }
    }
}
exports.importDB = importDB;
