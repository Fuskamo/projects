version = exchangeVersions();
tracking = [];

function splash() {
	tracking = [];
	document.getElementById('content').innerHTML = "<h3>This wizard will guide you on your merry way!!</h3>";
	document.getElementById('buttons').innerHTML = "<button onclick=pageOne();>Begin</button>";
}

 function exchangeVersions(){
 	var exVersion = ["Exchange 2013", "Exchange 2010", "Exchange 2010/2007 Mixed", "Exchange 2007", "Exchange 2007/2003 Mixed", "Exchange 2003"];
	return exVersion;
 }
 
 function pageOne() {
	document.getElementById('content').innerHTML = "<h3>Choose your Exchange Version!</h3>";
	document.getElementById('buttons').innerHTML = "<button onclick=startOver();>Start Over</button>";
	document.getElementById('buttons').innerHTML += "<button onclick=pageOne();>Begin</button>";
	for (e=0; e<version.length; e++) {
		document.getElementById('content').innerHTML += "<li onclick=exch("+e+")>"+version[e]+"</li>";
	}
}

 
function runOnce() {
	splash();
}