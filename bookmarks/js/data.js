function getList() {
	var list = ["TECH170752", "TECH38537", "TECH54592", "TECH217362", "TECH209744", "TECH200691", "TECH69486", "TECH172279"];
	list.sort();
	return list;
}
function techlist(tech) {
	var TECH170752 = {name:"SymHelp", external:"True", cat:"common"};
	var TECH38537 = {name:"Compatibility Guide", external:"True", cat:"common"};
	var TECH54592 = {name:"Downloading Software", external:"True", cat:"common"};
	var TECH217362 = {name:"Late Breaking News: 11.0.1", external:"True", cat:"lbn"};
	var TECH209744 = {name:"Late Breaking News: 11.0.0", external:"True", cat:"lbn"};
	var TECH200691 = {name:"Late Breaking News: 10.0.4", external:"True", cat:"lbn"};
	var TECH172279 = {name:"Backup Best Practices", external:"False", cat:"common"};
	
	
	
	
	// --------RETURN INFO--------//
	
	if (tech == "TECH170752") {return TECH170752;}
	if (tech == "TECH38537") {return TECH38537;}
	if (tech == "TECH54592") {return TECH54592;}
	if (tech == "TECH217362") {return TECH217362;}
	if (tech == "TECH209744") {return TECH209744;}
	if (tech == "TECH200691") {return TECH200691;}
	if (tech == "TECH172279") {return TECH172279;}

	
	
	
	
	
}
	
