/*
Parameters: 
	ev			|	object, the object that is being dropped into place
	new_team	|	int, the id of the new parent element
Behavior:
	This function executes when an object is dropped into an authorized location
	The default drag/drop behavior is prevented
	The old team is identified via the 'ev' parent node id
	Check to determine if the student was moved:
		True: 
			-the visual element is moved to the new team div
			-the local 'TeamArray' is updated via a call to switchTeams
		False:
			-text indicated the user wasnt moved is logged to the console 
Output:	
	None; the student visual element, local teamArray, and database will reflect the new changes
Error Handling:	
	Verifies the user was moved before performing unnecessary work
Sources: 
	https://stackoverflow.com/questions/28203585/prevent-drop-inside-a-child-element-when-drag-dropping-with-js?rq=1
*/
function drop(ev, new_team) {
	ev.preventDefault();
	var student_id = ev.dataTransfer.getData("text");
	var old_team = document.getElementById(student_id).parentNode.id; 
	if(old_team == new_team.id) {
		console.log("the student wasnt moved!?");
	} else {
		var element = teamArray[old_team][getIndex(old_team, student_id)];
		teamArray[old_team].splice(getIndex(old_team, student_id), 1);
		switchTeams(old_team, new_team.id, element); //update the database
	}
}

/*
Parameters: 
	ev			|	object, the object that is being dragged
Behavior:
	The default drag/drop behavior is prevented
Output:	
	None
Error Handling:	
	None
Sources: 
	https://www.w3schools.com/html/html5_draganddrop.asp
*/
function allowDrop(ev) {
    ev.preventDefault();
}

/*
Parameters: 
	ev			|	object, the object that is being dragged
Behavior:
	The data field is populated with the id of the object
Output:	
	None
Error Handling:	
	None
*/
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

/*
Parameters: 
	team		|	int, the team number the student currently belongs to
	student_id	|	string, the id of the student element on the page (also the student_id)
Behavior:
	The data field is populated with the id of the object
Output:	
	index 		| int, the index of the student in the local teamArray
Error Handling:	
	A weird bug exists that returns -1 when the id is located at index 0. So 0 is returned instead of -1
*/
function getIndex(team, student_id) {
	var index = teamArray[team].findIndex(function(item, i) {
		if(item['student_id'] == student_id) {
			return i; //if the index is found at element 0, console.log(i) = 0, but the function returns -1???
		}
	});
	if(index < 0) {
		index = 0;
	} 
	return index;
}

/*
Parameters: 
	object		|	object, the dictionary array to search
	value		|	int, the student_id to find in the array via key/value pairs
Behavior:
	Locates the name of the key for a specified value
	Used to return the language for a given value
Output:	
	key 		|	string, the key of the key/value pair
Error Handling:	
	None
Sources: 
	https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
*/
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

/*
Parameters: 
	team_num	|	int, the team number to count children of
Behavior:
	Counts the number of child elements in a div
	Used to return the language for a given value
Output:	
	count 		|	int, the number of students on a team
Error Handling:	
	The error when there are no children for an element is caught and logged and a value of 0 is returned instead
*/
function getTeamSize(team_num) {
	var count = 0;
	try { count = document.getElementById(team_num).childElementCount;
	} catch(e) { console.log(e); }
	return count;
}

/*
Parameters:
	element		|	string, specifies the id of the object to modify
Behavior:
	Changes an object from invisible to visible with no change to other content
Output:	
	None; the element becomes visible
Error Handling:
	NOne
*/
function setVis(element) {
	var x = document.getElementById(element);
	x.style.visibility = "visible";
}

/*
Parameters:
	element		|	string, specifies the id of the object to modify
Behavior:
	Changes an object from visible to invisible with no change to other content
Output:	
	None; the element becomes invisible
Error Handling:
	None.
*/
function setInvis(element) {
	var x = document.getElementById(element);
	x.style.visibility = "hidden";
}

/*
Parameters:
	element		|	string, specifies the id of the object to modify
Behavior:
	Changes an object from 'block' to 'none' which shifts other elements accordingly
Output:	
	None; the element becomes hidden
Error Handling:
	None
*/
function hide(element) {
	var x = document.getElementById(element);
	x.style.display = "none";
}

/*
Parameters:
	element		|	string, specifies the id of the object to modify
Behavior:
	Changes an object from 'none' to 'block' which shifts other elements accordingly
Output:	
	None; the element becomes visible
Error Handling:
	None
*/
function unhide(element) {
	var x = document.getElementById(element);
	x.style.display = "block";
}

/*
Parameters:
	element		|	string, specifies the id of the object to modify
Behavior:
	Toggles an object from visible to invisible with no change to other content
Output:	
	None; the object changes state
Error Handling:	
	An element without an explicit style will become hidden on the first execution of this function
*/
function toggleVisibility(element) {
	var div = document.getElementById(element);
    div.style.visibility = div.style.visibility == "hidden" ? "visible" : "hidden";
}

/*
Parameters:
	None
Behavior:
	A promt to logout is displayed
		On Confirm:
			Reloads the page to log the user out
		On Deny:
			No action is taken and the prompt is dismissed
Output:	
	None
Error Handling:
	None
*/
function logout() {
	var result = confirm("Are you sure you want to log out?");
	if(result) {
		location.reload();
	}
}

/*
Parameters:
	None
Behavior:
	Resets the style for the team size buttons
	Changes the style for the current team size to stand out from the others
Output:	
	None; visual elements are updated
Error Handling:
	None
*/
function toggleClassSize() {
	for(var i = 4; i<=6; i++) {
		if(team_size == i) {
			document.getElementById("size_"+i).className = "btn btn-info btn-block size-btn";		
		} else {
			document.getElementById("size_"+i).className = "btn btn-outline-info btn-block size-btn";	
		}
	}
}

function nightMode(){
	
	if(!$("body").hasClass("night")){
		$("body").addClass("night");
		$(".header").addClass("night");
		$("button").addClass("night");
		$("button").addClass("night-button");
		$(".size-btn").removeClass("night");
		$(".size-btn").addClass("night-text");
		$(".menu").addClass("night");
		$(".dropdown").addClass("night");
		$(".dropdown-menu").addClass("night");
		$(".modal-content").addClass("night");
		$("#night-mode-btn").removeClass("night");
		$("#night-mode-btn").removeClass("btn-outline-secondary");
		$("#enroll").removeClass("night");
		$("#night-mode-btn").addClass("btn-success");
		$("li").addClass("night");
	}
	else{
		$("body").removeClass("night");
		$(".header").removeClass("night");
		$("button").removeClass("night");
		$("button").removeClass("night-button");
		$(".size-btn").removeClass("night-text");
		$(".menu").removeClass("night");
		$(".dropdown").removeClass("night");
		$(".dropdown-menu").removeClass("night");
		$(".modal-content").removeClass("night");
		$("#night-mode-btn").removeClass("btn-success");
		$("#night-mode-btn").addClass("btn-outline-secondary");
		$("li").removeClass("night");
	}
}