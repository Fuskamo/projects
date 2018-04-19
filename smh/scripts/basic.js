function convertName(input) {
	input = input.replace(/_/g, " ");
	return input;
}
function unConvertName(input) {
	try {
		var output = input.replace(" ", "_");
		return output; }
	catch(err) {
		console.log("no spaces in the name"); 
		return input;
}}
function writeMenu() {
	var menu = ["Heros", "Villians", "Environments", "Players", "Games"];
	for (i=0; i<menu.length; i++) {
		document.write("<li class=navicon id="+menu[i]+"bar"+" onclick=load"+menu[i]+"();>"+menu[i]+"</li>");
	}
}
function clearDiv() {
	document.getElementById("hero_data").innerHTML = "";
}
function clearStats() {
	document.getElementById("stats").innerHTML = "";
	delChildParent();
	document.getElementById("stats").innerHTML = "";
	document.getElementById("edition").innerHTML = "";
	document.getElementById("card_title").innerHTML = "&nbsp;";
	clearNem();
}
function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
	delChildParent();
}

function delChildParent() {
	var temp = document.getElementById("dropbox");
	try {
		temp.removeChild(temp.childNodes[0]);
		console.log("removed a kid");
	} catch(err) {
		console.log("No kids to kill");
	}}

function drop(ev) {
	ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
 	var nodeCopy = document.getElementById(data).cloneNode(true);
	nodeCopy.id = "new_"+data;
	ev.target.appendChild(nodeCopy);
	document.getElementById("new_"+data).className = "normal";
	if (document.getElementById("Herosbar").className == "navicon_clicked") {
		heroStats(data);
		hideNemesis();} 
	if (document.getElementById("Villiansbar").className == "navicon_clicked") {
		villianStats(data);
		}
	if (document.getElementById("Environmentsbar").className == "navicon_clicked") {
		envStats(data); 
		hideNemesis();} 
	if (document.getElementById("Playersbar").className == "navicon_clicked") {
		playerStats(data); }
	if (document.getElementById("Gamesbar").className == "navicon_clicked") {
		gameStats(data); }
	}

function clearClass() {
	document.getElementById("Herosbar").className = "navicon";
	document.getElementById("Villiansbar").className = "navicon";
	document.getElementById("Environmentsbar").className = "navicon";
	document.getElementById("Playersbar").className = "navicon";
	document.getElementById("Gamesbar").className = "navicon";
}

function statWidth() {
	var w = document.getElementById("hero_side").offsetWidth;
	var w1=w+8;
	var w2=w+16;
	var style = "left: "+w1+"px; width: calc(100% - "+w2+"px)";
	document.getElementById("stat_side").style.cssText = style;
}
function cardHeight() {
	var h = document.getElementById("navbar").offsetHeight + document.getElementById("banner").offsetHeight + 8;
	var height_offset = "top: "+h+"px"
	document.getElementById("hero_side").style.cssText = height_offset;
}

function writeCardColumns() {	
	for (i=7; i>=4; i--) {
		document.write("<li class=columns id=col"+i+" onclick=redoWindow("+i+");>"+i+"</li>");
	}
	document.getElementById("col6").className = "columns_selected";
}

function redoWindow(num) {
	document.getElementById("col4").className = "columns";
	document.getElementById("col5").className = "columns";
	document.getElementById("col6").className = "columns";
	document.getElementById("col7").className = "columns";
	document.getElementById("col"+num).className = "columns_selected";
	num = num*160 + 30;
	document.getElementById("hero_side").style.width = num;
	statWidth();
}
function initialize() {
	statWidth();
	loadHeros();
	cardHeight();
	hideNemesis();
}

function statTextWidth() {
	var w = document.getElementById("dropbox").offsetWidth
	if (document.getElementById("nemesis").style == "nemesis") {
		w= w + document.getElementById("nemesis").offsetWidth; 
	}
	w += 50;
	var update = "calc(100% - "+w+"px)";
	console.log(update);
	document.getElementById("stats").style.width = update;
}

function hideNemesis() {
	document.getElementById("nemesis").className = "hidden";
}

function loadNemesis(nemesis) {
	document.getElementById("nem_nums").innerHTML = "";
	var nem_list = nemesis.split(', ');
	if (nem_list.length > 1) {
		count = 1;
		for (i=0; i < nem_list.length; i++) {	
			var temp = unConvertName(nem_list[i]);
			var menu = "<li class='nem_id' id=nem"+count+ " onclick='changeNem(";
			var end = ");'>"+count+"</li>";
			document.getElementById("nem_nums").innerHTML += menu+temp+end;
			count++;
		}
	document.getElementById("nem1").className = "nem_id_selected";
	}
	document.getElementById("nemesis").className = "nemesis";
	var convert_nemesis = unConvertName(nem_list[0]);
	document.getElementById("nemesis").innerHTML= "<img class='normal' src='images/hero/"+convert_nemesis+".png' />";
	}

function changeNem(nem, id) {	
	console.log(nem);
	console.log(id);
	document.getElementById("nemesis").innerHTML= "<img class='normal' src='images/hero/"+nem+".png' />";
	
}

function clearNem() {
	var temp = document.getElementById('nem_nums').children;
	for (i=1; i <= temp.length; i++) {
		document.getElementById('nem'+i).className = "nem_id";
	}
}