function writeTable(active) {
	clearTable();
	var tableheader = "<table id='articles' class='sortable'><thead><tr><td>Case Number</td><td>Customer Name</td><td>Status</td><td>Priority</td><td>Next Contact</td><td>Notes</td></tr></thead><tbody><tr>";
	document.getElementById("list").innerHTML = tableheader; 
	for (i=0; i<active.length; i++) {	
		data = techlist(active[i]);
		var table = document.getElementById("articles");
		var row = table.insertRow(-1);
		var cell1 = row.insertCell(0);
		cell1.innerHTML = remC(active[i]);
		var cell2= row.insertCell(1);
		cell2.innerHTML = data.name;
		var cell3 = row.insertCell(2);
		cell3.innerHTML = data.cat;
		var cell4 = row.insertCell(3);
		cell4.innerHTML = data.priority;
		var cell5 = row.insertCell(4);
		cell5.innerHTML = data.contact;		
		var cell6 = row.insertCell(5);
		cell6.innerHTML = data.notes;			
	}
	var rows = document.getElementsByTagName("tr");	
	if (rows.length > 2) {
		document.getElementById("articles").deleteRow(1);
	}
}

function clearTable() {
	document.getElementById("list").innerHTML = "";
}

function dropDown(input) {
	var categories = getMenu();
	var dd = "<select name='cat'>"
	for (i=1; i<categories.length; i++) {
		if (categories[i] == input) {
			dd+= "<option selected>"+categories[i]+"</option>";
		} else {
			dd += "<option>"+categories[i]+"</option>";
	}}
	dd += "</select>";
	return dd;
}

function generate(){
	console.log("Form Submitted");
}

function addLine() {
	counter =1;
	console.log(counter);
}
function remC(input) {
	var output = input.replace(/^C/, "");
	return output;
}

function editMode(input) {
	menu = getMenu();
	active = activeList(input);
	clearTable();
	var tableheader = "<table id='articles' class='sortable'><thead><tr><td>Case Number</td><td>Customer Name</td><td>Status</td><td>Priority</td><td>Next Contact</td><td>Notes</td><td></td></tr></thead><tbody><tr>";
	document.getElementById("list").innerHTML = tableheader; 
	for (i=0; i<active.length; i++) {
		var data = techlist(active[i]);
//		if (i==0) { document.getElementById("list").innerHTML = tableheader; 
		var table = document.getElementById("articles");
//			}
		var row = table.insertRow(-1);
		var cell1 = row.insertCell(0);
		cell1.innerHTML = "<input id="+remC(active[i])+" size=8 type=text value="+remC(active[i])+">";
		var cell2= row.insertCell(1);
		cell2.innerHTML = "<input id=customer"+[i]+" size=20 type=text>";
		document.getElementById("customer"+[i]).value = data.name;
		var cell3 = row.insertCell(2);
		var dd = "<select name='cat'>";
		for (j=1; j<menu.length; j++) {
			if (menu[j] == data.cat) {
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
			if (p[k] == data.priority) {
				pp+= "<option selected>"+p[k]+"</option>";
			} else {
				pp += "<option>"+p[k]+"</option>";
		}}
		cell4.innerHTML = pp;
		var cell5 = row.insertCell(4);
		cell5.innerHTML = data.contact;		
		var cell6 = row.insertCell(5);
		cell6.innerHTML = "<input type=text id=notes"+[i]+" size=40>"
		document.getElementById("notes"+[i]).value = data.notes;
		
		var cell7 = row.insertCell(6);
		cell7.innerHTML = "<input type=button value=x onclick=removeRow("+remC(active[i])+");>";
		
	} 
	//document.getElementById("articles").deleteRow(1);
}

function removeRow(input) {
	console.log(input);
//	document.getElementById("articles").deleteRow(input);
	
	var rows = document.getElementsByTagName("tr");
	for (var i = rows.length; i--;) {
		if(rows[i].innerHTML.indexOf(input) !== -1) {
			rows[i].parentNode.removeChild( rows[i] );
		}
	}
	if (rows.length < 2) {
		console.log("removing table");
		clearTable();
	}
}
	
