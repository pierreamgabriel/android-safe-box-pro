let info = {
    src: "",
    link: ""
};

exports.info = info;

function createads() {
	let locale = java.util.Locale.getDefault().getLanguage(); 
	let URL;
	
	if (locale === "pt_br" || locale === "pt") {
	
	URL = "https://github.com/virgopublishers/banners/raw/main/android-safe-pt.js";
		
	} else {
		
	URL = "https://github.com/virgopublishers/banners/raw/main/android-safe.js";
		
	}
	
	fetch(URL)
    .then(res => res.json())
    .then((data) => {
    
     info.src = data[data[0].target].src.toString();
	 info.link = data[data[0].target].link.toString();	
		
                });

}

exports.createads = createads;