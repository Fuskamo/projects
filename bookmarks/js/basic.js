function checkStr() {
   var str, strArray;
   str = document.getElementById('inputbox').value; 
   if (str==''){
   window.alert("Oops! No data!");
   str="0";
   } 
   strArray=str.split(/[, \t\n]+/);   // SPLIT STRING INTO AN ARRAY
   searchterm=document.getElementById('search').value;
   result=SeqSearch(strArray, searchterm);
   document.getElementById('outputDiv').innerHTML='The index is: ['+result+']'; 
 }
 
 function getMenu(){
 	var techs = ["common", "lbn", "indexing", "client", "guides", "fsa", "sharepoint", "owa", "pst", "sql"];
	techs.sort();
	return techs;
 }
 
 function writeMenu(){
	techs = getMenu();
	for (i=0; i<techs.length; i++) {
		//var thingy = techs[i].toString();
		document.getElementById('menu').innerHTML += "<li class='menulist' id="+techs[i]+" onclick=load("+i+");>"+techs[i]+"</li>";
	}
 }
 
 function load(category) {
	var catId = getMenu();
	select(category);
	var menu = catId[category];
	var results = [];
	var techs = getList();
	for (i=0; i<techs.length; i++) {
		temp = techlist(techs[i]);
		if (typeof temp === 'undefined') {
		console.log(techs[i]+" contains no data");
		continue;
		}
		if (temp.cat == menu) {
			results.push(techs[i]);			
		}
	}
	if (results.length == 0) {
		console.log("There are no results for the category "+menu);
	}
	writeTable(results);
	}
	
function select(cat) {
	var menu = getMenu();
	for (i=0; i<menu.length; i++) {
		document.getElementById(menu[i]).className = "menulist";
		}
	if (cat != 100) {
	document.getElementById(menu[cat]).className = "menuselected";
}}

function runOnce() {
	writeMenu();
	var menu = getMenu();
	load(menu.indexOf("common"));	
	}