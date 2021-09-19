const frameModule = require("ui/frame");
const ads = require("../../admob").ads;
const application = require("application");
const preloadAdMob = require("../../admob").preloadAdMob;
const showad = require("../../admob").showad;

function goBack(){
showad();	
frameModule.topmost().navigate("components/main/main");     
}
exports.goBack = goBack;

function onNavigatingTo(args) {
	ads();
	preloadAdMob();
}
exports.onNavigatingTo = onNavigatingTo;

if (application.android) {
    application.android.on(application.AndroidApplication.activityBackPressedEvent, callAds);
}

function callAds() {
	showad();
}