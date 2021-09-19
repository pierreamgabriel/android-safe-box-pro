var admob = require("nativescript-admob");


function ads() {
	
	setTimeout(() => { admob.createBanner({
    testing: false, 
    size: admob.AD_SIZE.SMART_BANNER, 
    androidBannerId: "ca-app-pub-6111006882674275/1988060126",
    margins: {
      bottom: 0
    },
    keywords: []
  })}, 1500); 
	
}

exports.ads = ads;

function preloadAdMob() {
	
	admob.preloadInterstitial({
    testing: false,
    androidInterstitialId: "ca-app-pub-6111006882674275/9252979071"
  });
}

exports.preloadAdMob = preloadAdMob;

function showad() {
	
	admob.showInterstitial();
}

exports.showad = showad;