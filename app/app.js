const application = require("application");
require("./bundle-config");
application.run({ moduleName: "app-root" });
application.setCssFileName("app.css");
const frame = require('ui/frame');
const Sqlite = require("nativescript-sqlcipher");


if (application.android) {
    application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
}
function backEvent(args) {
    var currentPage = frame.topmost().currentPage;
    if (currentPage && currentPage.exports && typeof currentPage.exports.backEvent === "function") {
         currentPage.exports.backEvent(args);
   }
}


    
