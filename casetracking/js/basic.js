 tab = 0;
 list = 0;
 menu = getMenu();
 counts = [2];
 finished = "true";
 
 function getMenu(){
 	var cats = ["backlog", "closing", "update", "logs", "callback", "research", "rca"];
	return cats;
 }
 
 function writeMenu(){
	for (i=0; i<menu.length; i++) {
		document.getElementById('menu').innerHTML += "<li class='menulist' id="+menu[i]+" onclick=load("+i+");>"+menu[i]+" ["+counts[i]+"]</li>";
	}
 }
 
 function activeList() {
	var catId = getMenu(); //load menu options
	select(tab); //change menu list class
	var menu = catId[tab]; //gets selected menu category name
	var results = [];
	var caselist = getList(); //returns list of all cases
	if (menu == "backlog") {
		for (i=0; i<caselist.length; i++) {
			temp = techlist(caselist[i]);
			if (typeof temp === 'undefined') {
				console.log(caselist[i]+" contains no data");
			} else {
			results.push(caselist[i]);			
			}
		}
	} else {
	for (i=0; i<caselist.length; i++) {
		temp = techlist(caselist[i]);
		if (typeof temp === 'undefined') {
		console.log(caselist[i]+" contains no data");
		continue;
		}
		if (temp.cat == menu) {
			results.push(caselist[i]);
		}
	}}
	var sort = sortResults(results);
	return results;
 }
 
 function load(input) {
	tab = input;
	list = activeList();
	editButton();
	table = writeTable(list);
	}
	
function select(cat) {
	//changes the menu list class
	var menu = getMenu();
	for (i=0; i<menu.length; i++) {
		document.getElementById(menu[i]).className = "menulist";
		}
	if (cat != 100) {
	document.getElementById(menu[cat]).className = "menuselected";
}}

function editButton(){
	document.getElementById("topicons").innerHTML = "<li class=edit id=editme onclick=editMode("+tab+");>Edit Mode</li>";
	document.getElementById("topicons").innerHTML += "<li class=edit id=addme onclick=addRow();>Add Row</li>";
	document.getElementById("topicons").innerHTML += "<li class=edit id=saveme onclick=dropDB();>Save</li>";
}

function addRow() {
	menu = getMenu();
	var table = document.getElementById("articles");
	var rows = document.getElementsByTagName("tr");
	console.log("table len"+rows.length);
	var row = table.insertRow(-1);
	var cell1 = row.insertCell(0);
	cell1.innerHTML = "<input size=8 type=text value=caseid>";
	var cell2= row.insertCell(1);
	cell2.innerHTML = "<input size=20 type=text value=customer>";
	//document.getElementById("customer".value = "Enter Customer";
	var cell3 = row.insertCell(2);
	var dd = "<select name='cat'>";
	for (j=1; j<menu.length; j++) {
		if (menu[j] == "update") {
			dd+= "<option selected>"+menu[j]+"</option>";
			} else {
				dd += "<option>"+menu[j]+"</option>";
		}}
	dd += "</select>";	
	cell3.innerHTML = dd;		
	var cell4 = row.insertCell(3);
	var p = getPriority();
	var pp = "<select name='prio'>";
	for (k=0; k<p.length; k++) {
		if (p[k] == "normal") {
			pp+= "<option selected>"+p[k]+"</option>";
		} else {
			pp += "<option>"+p[k]+"</option>";
	}}
	cell4.innerHTML = pp;
	var cell5 = row.insertCell(4);
	cell5.innerHTML = "";		
	var cell6 = row.insertCell(5);
	cell6.innerHTML = "<input type=text size=40>"
	//document.getElementById("notes"+[i]).value = data.notes;
	//var cell7 = row.insertCell(6);
	//cell7.innerHTML = "<input type=button value=x onclick=removeRow("+remC(active[i])+");>";
}

function runOnce() {
	writeMenu();
	initDatabase();
	var test = queryObjectColumns("callback");
	
	//getCounts();
	//console.log(counts);
	//load(menu.indexOf("backlog"));	//loads the backlog tab
}
	
function sortResults(input) {
	//console.log("sort this: "+input);
}

function getCounts() {
	for (var y=1; y<menu.length; y++) {
		var x = countQuery(menu[y], function (nextp) {
			counts.push(nextp);
			console.log(counts);
			});
		}
		console.log(counts);
	console.log("complete");
	}


function save() {
	console.log("saving");
}