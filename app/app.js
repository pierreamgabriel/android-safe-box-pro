const application = require("application");
require("./bundle-config");
application.run({ moduleName: "app-root" });
application.setCssFileName("app.css");
const frame = require('ui/frame');
const createads = require("./ads.js").createads;


if (application.android) {
    application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
}
function backEvent(args) {
    let currentPage = frame.Frame.topmost().currentPage;
    if (currentPage && currentPage.exports && typeof currentPage.exports.backEvent === "function") {
         currentPage.exports.backEvent(args);
   }
}

createads();
    
