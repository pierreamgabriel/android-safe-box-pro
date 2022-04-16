const frameModule = require("ui/frame");
const utils = require("tns-core-modules/utils/utils");
const info = require("../../ads.js").info;

function goBack(){	
frameModule.Frame.topmost().navigate("components/main/main");     
}
exports.goBack = goBack;

function onNavigatingTo(args) { 
	
let page = args.object;
page.bindingContext = info;	
	
}

exports.onNavigatingTo = onNavigatingTo;

function openlink() {
	utils.openUrl(info.link);
}

exports.openlink = openlink;