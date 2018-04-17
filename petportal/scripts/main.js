menu = getMenu();

function getMenu(){
	return ["home", "pets by type", "treatment history", "req treatments", "treatments due", "weight history", "microchip lookup", "adoptions", "pet owners", "sources"];
}

function writeMenu(){
	for (i=0; i<menu.length; i++) {
		document.getElementById('menu').innerHTML += "<li class='menulist' id=q"+i+" onclick=load("+i+");>"+menu[i]+"</li>";
	}
	document.getElementById('menu').innerHTML += "<div id='sources' class='sources'></div>";
	document.getElementById('menu').innerHTML += "Page by David Jensen";
	load(0);
}

function load(input) {
	updateSelectedElement(input);
	clearFields();
	console.log("Executing Query "+input+": "+menu[input]);
	document.getElementById('formSection').innerHTML = getData(input);
	switch(input) {
		case 0: 
			q0a();
			break;
		case 1:
			q1a();
			break;
		case 2:
			q2a();
			break;
		case 3:
			break;
		case 4:
			break;
		case 5:
			q5a();
			break;
		case 6:
			q6a();
			break;
		case 7:
			q7a();
			q7b();
			break;
		case 8:
			break;
		case 9:
			printPHP();
			break;
	}	
}

function updateSelectedElement(cat) {
	for (i=0; i<menu.length; i++) {
		document.getElementById("q"+i).className = "menulist";
	}
	document.getElementById("q"+cat).className = "menuselected";
}

function clearFields() {
	document.getElementById('formSection').innerHTML = "";
	document.getElementById('results').innerHTML = "";
	document.getElementById('queries').innerHTML = "";
	document.getElementById('rightbar').innerHTML = "";
}

function editButton(){
	document.getElementById("topicons").innerHTML = "<li class=edit id=editme onclick=editMode("+tab+");>Edit Mode</li>";
	document.getElementById("topicons").innerHTML += "<li class=edit id=addme onclick=addRow();>Add Row</li>";
	document.getElementById("topicons").innerHTML += "<li class=edit id=saveme onclick=dropDB();>Save</li>";
}

function printPHP() {
	for (i=0; i<=8; i++) {
		document.getElementById('formSection').innerHTML += "[<a href='txt/q"+i+"a.txt'>q"+i+"a.php</a>] [<a href='txt/q"+i+"b.txt'>q"+i+"b.php</a>] ";
	}
	document.getElementById('formSection').innerHTML +="<hr>"
}
