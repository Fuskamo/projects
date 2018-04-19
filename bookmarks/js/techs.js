function writeTable(active) {
	clearTable();
	var anchor = "<a href=http://www.symantec.com/docs/";
	var tableheader = "<table id='articles' class='sortable'><thead><tr><td>Tech Name</td><td>Article ID</td><td>Internal URL</td><td>External URL</td></tr></thead><tbody><tr>";
	for (i=0; i<active.length; i++) {
		data = techlist(active[i]);
		if (data.external == "True") {
			var extURL=anchor+active[i]+" target='_blank'>"+active[i]+"</a>";
		} 	else { extURL = "< Internal Only"; }
		if (i==0) { document.getElementById("list").innerHTML = tableheader; 
			var table = document.getElementById("articles");
			}
		var row = table.insertRow(-1);
		var cell1 = row.insertCell(0);
		cell1.innerHTML = data.name;
		var cell2= row.insertCell(1);
		cell2.innerHTML = active[i];
		var cell3 = row.insertCell(2);
		cell3.innerHTML = "InternalURL";
		var cell4 = row.insertCell(3);
		cell4.innerHTML = extURL;
	}
}

function clearTable() {
	document.getElementById("list").innerHTML = "";
}

	

function writeForm() {
	select(100);
	var tableheader = "<table id='newtech' class='sortable'><thead><tr><td>Tech ID</td></td><td>Tech Title</td><td>Internal Only?</td><td>Category</td><td></td></tr></thead><tr></tr>";
	var techid = "<input type='text' size='9' id='techid'>"
	var title = "<input type='text' id='techname'>";
	var internal = "<select id='ext'><option>Yes</option><option selected>No</option></select>";
	var options = dropDown();
	var addmore = "<button onclick='addLine()'>+</button>";
	var submit = "<button onclick='generate()'>Submit</button>";
	
	document.getElementById("list").innerHTML = tableheader; 
	
	var table = document.getElementById('newtech');
	var row = table.insertRow(-1);
	
	var cell1=row.insertCell(0);
	cell1.innerHTML=techid;
	var cell2=row.insertCell(1);
	cell2.innerHTML=title;
	var cell3=row.insertCell(2);
	cell3.innerHTML=internal;
	var cell4=row.insertCell(3);
	cell4.innerHTML=options;
	var cell5=row.insertCell(4);
	cell5.innerHTML=addmore;	
}

function dropDown() {
	var categories = getMenu();
	categories.push("New Category");
	var dd = "<select name='cat'>"
	for (i=0; i<categories.length; i++) {
		dd += "<option>"+categories[i]+"</option>";
	}
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

	
