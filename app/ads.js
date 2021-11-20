var info = {
    src: "",
    link: ""
};

exports.info = info;

function createads() {
	var locale = java.util.Locale.getDefault().getLanguage(); 
	
	if (locale === "pt_br" || locale === "pt") {
	
	var URL = "https://github.com/virgopublishers/banners/raw/main/android-safe-pt.js";
		
	} else {
		
	var URL = "https://github.com/virgopublishers/banners/raw/main/android-safe.js";
		
	}
	
	fetch(URL)
    .then(res => res.json())
    .then((data) => {
    
     info.src = data[data[0].target].src.toString();
	 info.link = data[data[0].target].link.toString();	
		
                });

}

exports.createads = createads;