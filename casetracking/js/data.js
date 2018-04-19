function getList() {
	var list = ["C08551592", "C08652317", "C08640001", "C08600304", "C08677909"];
	return list;
}
function techlist(tech) {
	var C08551592 = {name:"Kim Johnson", priority:"normal", contact:"5/01/15", cat:"callback", notes:"Need to get a dtrace going"};
	var C08652317 = {name:"Andrew Kiehl", priority:"low", contact:"5/01/15",cat:"update", notes:"Awaiting update from customer"};
	var C08640001 = {name:"Steve Green", priority:"high", contact:"5/10/15", cat:"logs", notes:""};
	var C08600304 = {name:"Adam Brown", priority:"high", contact:"5/05/15", cat:"logs", notes:"EVSVR Logs"};
	var C08677909 = {name:"Rodney Nelson", priority:"normal", contact:"5/05/15", cat:"callback", notes:"1st Attempt"};
	
	// --------RETURN INFO--------//
	
	if (tech == "C08551592") {return C08551592;}
	if (tech == "C08652317") {return C08652317;}
	if (tech == "C08600304") {return C08600304;}
	if (tech == "C08640001") {return C08640001;}
	if (tech == "C08677909") {return C08677909;}
	


}
	
function getPriority() {
	var priorities = ["low", "normal", "high"];
	return priorities;
}