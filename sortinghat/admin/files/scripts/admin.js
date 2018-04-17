
$(document).ready(function() {
    $(".dropdown-toggle").dropdown();
});

/*
Parameters:
	None
Behavior:
	Validates user login
	Reads the login information from the input form
	Generates a call to checkLogin.php to check if login was successful
		Success:
			The login form is hidden and other elements are displayed
			A call is then made to startAdmin()
		Failure: 
			An alert is displayed which indicates invalid login information
Output:
	None; the appropriate visual elements hidden and displayed to create a seamless interface
Error Handling:
	Invalid credentials will result in being prompted for credentials again
*/
function authenticate() {
	var username = document.getElementById('login_text').value;
	var password = document.getElementById('password').value;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if(this.responseText == 'failed') {
				alert("Authentication Failed!");
			} else {
				prof = JSON.parse(this.responseText);
				prof = prof[0];
				hide('login_div');
				unhide('mainpage');
				startAdmin();
			}
		}
	};
	xmlhttp.open("GET","files/php/checkLogin.php?auth="+username+"&password="+password,true);
	xmlhttp.send();
}

/*
Parameters:
	None
Behavior:
	Executes writeMenu() and getClasses() when the admin page is loaded
Output:
	None; the visual elements are created and displayed
Error Handling:
	None
*/
function startAdmin() {
	writeMenu();
	getClasses();
}

/*
Parameters:
	class_id 	|	the id of the current class
Behavior:
	Makes a call to getData.php to generate a list of students in the current class specified by the student_id
Output:
	None; the visual elements are created and displayed
Error Handling:
	On Success:
		Makes a call to writeTeams() to generate visual elements and display the loaded data
		Makes a call to toggleClassSize() to update the visual element based on current selected team size (default 5)
	On Error:
		An error is logged to the console and no further action is taken
*/
function getData(class_id) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			dataArray = JSON.parse(this.responseText);
			if(dataArray.length < 0) {
				console.log("no survey information for this course");
			} else {
				writeTeams(dataArray);
				toggleClassSize();
			}
			
		}
	};
	xmlhttp.open("GET","files/php/getData.php?class="+class_id,true);
	xmlhttp.send();
}

/*
Parameters:
	class_id	|	int, the id of the selected class
	class_name 	| 	string, the name of the selected class
Behavior:
	Unhides the team organization buttons (search, filter, delete)
	Makes a call to getStats() to populate the global stats JSON object
Output:
	None; the visual elements are created and displayed
Error Handling:
	On Success:
		Stats for the selected class are loaded into the stats variable
		A call to getData is called to populate student information
		The enrollment button is loaded onto the screen
	On Failure:
		An error is logged to the console an no further actions are taken
*/
function getStats(class_id, class_name) {
	unhide('side-container');
	document.getElementById('display_class').innerHTML = class_name;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			stats = JSON.parse(this.responseText);
			stats = stats[0];
			getData(class_id);
			writeMenu();
			$("#night-mode-btn").removeAttr("disabled");
			if(!stats || stats.class_active == 1) {
				document.getElementById('enrollment').innerHTML = "<h1 id='enroll' class='btn btn-success btn-block header' onclick='enroll()'>enrollment activated</h1>";
			} else {
				document.getElementById('enrollment').innerHTML = "<h1 id='enroll' class='btn btn-danger btn-block header' onclick='enroll()'>enrollment deactivated</h1>";
			}
		}
	};
	xmlhttp.open("GET","files/php/getStats.php?class="+class_id,true);
	xmlhttp.send();
}

/*
Parameters:
	new_size	|	int, the new team size
Behavior:
	Ensures the new size is different from the old size
	Reconfigures the page to accomodate the new size (divs are deleted or created as necessary to allow for 1 div per team)
Output:
	None; the visual elements are created and displayed
Error Handling:
	None
*/
function changeTeamSize(new_size) {
	if(new_size != team_size) {
		team_size = new_size;
		getData(stats.class_id, stats.class_name);	
		clearFilters();
	}
}

/*
Parameters:
	x 		|	double, the value we need to normalize based on the course sample
	mean 	| 	double, the mean calculated based on the sample of students in the current course
	std 	|	double, the standard deviation calculated based on the sample of students in the current course
Behavior:
	Normalizes the provided parameter based on the mean and standard deviation of the course
Output:
	norm 	|	double, the normalized value 
Error Handling:
	Ensures we do not divide by 0 and returns 0 instead
*/
function normalize(x, mean, std) {
	if(std == 0) { 
		return 0;
	}
	return (x-mean)/std;
}

/*
Parameters:
	None
Behavior:
	Populates the page with help text to be displayed when necessary
Output:
	None; the help text is loaded onto the page
Error Handling:
	None
*/
function displayGeneralHelp() {
	unhide('results');
	next = 0;
	document.getElementById("help_header").innerHTML = "general help";
	getNext();
}

/*
Parameters:
	None
Behavior:
	Populates the page with help text to be displayed when necessary
Output:
	None; the help text is loaded onto the page
Error Handling:
	None
*/
function getNext() {
	var index = next%generalHelp.length;
	document.getElementById('help_content').innerHTML = generalHelp[index];
	document.getElementById('help_counter').innerHTML = index+1+"/"+generalHelp.length;
	next++;
}

/*
Parameters:
	index 	|	the index of the help text from helpHeaders and helptext
Behavior:
	Populates the page with help text to be displayed when necessary
Output:
	None; the help text is loaded onto the page
Error Handling:
	None
*/
function displayHelp(index) {
	hide('results');
	var helpHeaders = ["language", "gpa", "flexible", "experienced", "social", "motivated", "skilled"];
	document.getElementById("help_header").innerHTML = helpHeaders[index];
	document.getElementById("help_content").innerHTML = helptext[index];
}

/*
Parameters:
	team 	|	int, the team number to calculate
Behavior:
	Calculates statistics for the selected team
	Displays the results in the team footer
Output:
	None; the information is loaded onto the page
Error Handling:
	None
*/
function calculateMeta(team) {
	var update = document.getElementById("footer"+team);
	var size = teamArray[team].length;
	if(size < 1 || team == 0) {  //we don't need to calculate for team 0 or teams smaller than 1 person
		update.innerHTML = "";
		return; 
	}
	//initialize variables
	var gpa=0; var flex=0; var learn=0; var exp=0; var out=0; var skill=0;
	var resArray = new Array(size);
	//sum the normalization of each language for each team member and store it in resArray
	for(var i=0; i<skills.length; i++) {
		var sum = 0;
		for(var j=0; j<size; j++) {
			var element = teamArray[team][j];
			sum += normalize(element.languages[skills[i]], element.avg_lang, element.dev_lang);
		}
		resArray[i] = sum;
	}
	//get max of our normalization, and determine which language it is
	var max = resArray.reduce(function(a,b) { return Math.max(a,b) });
	if(max === NaN) {
		max = max[0];
	}
	var lang = skill_print[resArray.indexOf(max)];
	max = (max / size).toFixed(2);

	//calculate the average grade for the team, and determine if this is a flexible or experienced team
	for(var c=0; c<size; c++) {
		var element = teamArray[team][c];
		gpa += element.avg_grades;
		flex += element.num_roles;
		learn += element.len_learn;
		exp += element.len_exp;
		out += element.outgoing_shy;
		skill += element.avg_skill;
	}
	//get the average based on team size
	gpa = (gpa / size).toFixed(2);
	flex = (flex / size).toFixed(2);
	learn = (learn / size).toFixed(2);
	exp = (exp / size).toFixed(2);
	out = (out / size).toFixed(2);
	skill = (skill / size).toFixed(2);
	
	if(getTeamSize(team) == 0) {
		update.innerHTML = "";
	} else {
		update.innerHTML = "<div class='btn btn-sm btn-primary button sides top' data-toggle='modal' data-target='#help_modal' onclick='displayHelp(0)'>"+lang+" | "+max+"</div>";
		update.innerHTML += "<div class='btn btn-sm btn-success button sides top' data-toggle='modal' data-target='#help_modal' onclick='displayHelp(1)'>gpa | "+gpa+"</div>";
		if(stats) {
			if(flex > stats.total_flex_avg+stats.total_flex_dev*.5) {
				update.innerHTML += "<div class='btn btn-sm btn-danger button sides top' data-toggle='modal' data-target='#help_modal' onclick='displayHelp(2)'>flexible</div>";
			}
			if(exp > stats.total_exp_avg+stats.total_exp_dev*.5) {
				update.innerHTML += "<div class='btn btn-sm btn-primary button sides top' data-toggle='modal' data-target='#help_modal' onclick='displayHelp(3)'>experienced</div>";
			}
			if(out > stats.total_skill_avg+stats.total_skill_dev*.5) {
				update.innerHTML += "<div class='btn btn-sm btn-info button sides top' data-toggle='modal' data-target='#help_modal' onclick='displayHelp(4)'>social</div>";
			}
			if(learn > stats.total_learn_avg+stats.total_learn_dev*.5) {
				update.innerHTML += "<div class='btn btn-sm btn-warning button sides top' data-toggle='modal' data-target='#help_modal' onclick='displayHelp(5)'>motivated</div>";
			}
			if(skill > stats.total_skill_avg+stats.total_skill_dev*.5) {
				update.innerHTML += "<div class='btn btn-sm btn-warning button sides top' data-toggle='modal' data-target='#help_modal' onclick='displayHelp(5)'>skilled</div>";
			}
		}
	}

}


/*
Parameters:
	student_id	|	integer, identifies the student 
Behavior:
	Displays the student information in a pop up window
Output:
	None; the student information is displayed on the page
Exceptions:
	None
*/

function studentInfo(student_id) {

	var team = document.getElementById(student_id).parentNode.id;
	var index = getIndex(team, student_id);
	let student = teamArray[team][index];
	console.log(student);
	$("#student-name").text("Information of "+student.student_name+" | "+student.student_id);
	let gpa = "GPA: "+student.avg_grades;
	let androidScore = "Android: "+ student.languages.skill_android;
	let cScore = "C: "+ student.languages.skill_c;
	let cplusplusScore = "C++: "+ student.languages.skill_cplusplus;
	let javaScore = "Java: "+student.languages.skill_java;
	let pyScore = "Python: "+ student.languages.skill_python;
	let webScore = "Web: "+ student.languages.skill_web;
	let experience = "Professional Experience: "+student.prof_exp;
	let learning = "Learning Outcomes: "+student.exp_learn;
	
	//create delete button here
    $("#del-btn").attr("onclick","deleteStudent("+student_id+")");
	
	$("#student-scores").html("<div class='skill-score' id='gpa'>"+gpa+"</div>"+"<div class='skill-score' id='android'>"+androidScore+"</div>"+ "<div class='skill-score' id='c'>"+cScore+"</div>"+"<div class='skill-score' id='cpp'>"+cplusplusScore+"</div>"+"<div class='skill-score' id='java'>"+javaScore+"</div>"+"<div class='skill-score' id='python'>"+pyScore+"</div>"+"<div class='skill-score' id='web'>"+webScore+"</div>"+"<div class='skill-score' id='exp'>"+experience+"</div><div class='skill-score' id='lrn'>"+learning+"</div>");
}

/*
Parameters: 
	ev			|	object, the object that is being dropped into place
	new_team	|	int, the id of the new parent element
Behavior:
	This function executes when an object is dropped onto the garbage can image
	The default drag/drop behavior is prevented
	The old team is identified via the 'ev' parent node id
	The visual element is moved to the garbage can div and hidden to prevent further modifications
	The student is removed from the local teamArray after a successful call to deleteStudent.php removes the user from the database
Output:	
	None; the student visual element, local teamArray, and database will reflect the new changes
Error Handling:	
	None
Sources: 
	https://stackoverflow.com/questions/28203585/prevent-drop-inside-a-child-element-when-drag-dropping-with-js?rq=1
*/
function deleteStudent(studentId){
	var old_team = document.getElementById(studentId).parentNode.id; 
	if(confirm("Are you sure to delete this student? This cannot be undone!")){
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				if(this.responseText == 'success') {
					alert("Delete Successfully!");
					hide(studentId);
					$(".close").click();
					teamArray[old_team].splice(getIndex(old_team, studentId), 1); //remove from local array
				}
			}
		};
		calculateMeta(old_team);
		xmlhttp.open("GET","files/php/deleteStudent.php?student_id="+studentId,true);
		xmlhttp.send();		
	}
}

/*
Parameters: 
	ev			|	object, the object that is being dropped into place
	new_team	|	int, the id of the new parent element
Behavior:
	This function executes when an object is dropped onto the garbage can image
	The default drag/drop behavior is prevented
	The old team is identified via the 'ev' parent node id
	The visual element is moved to the garbage can div and hidden to prevent further modifications
	The student is removed from the local teamArray after a successful call to deleteStudent.php removes the user from the database
Output:	
	None; the student visual element, local teamArray, and database will reflect the new changes
Error Handling:	
	None
Sources: 
	https://stackoverflow.com/questions/28203585/prevent-drop-inside-a-child-element-when-drag-dropping-with-js?rq=1
*/
function deleteClass(){
	if(confirm("Are you sure to delete this class? All survey information will be lost! THIS CANNOT BE UNDONE! We recommend disabling enrollment instead.")){
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				if(this.responseText == 'success') {
					alert("Deleted Successfully! Open a new class to continue working");
					$(".close").click();
				}
				document.getElementById("team0").innerHTML = "";
				document.getElementById("team-section").innerHTML = "";
				document.getElementById("sort").innerHTML = "";
				document.getElementById("filters").innerHTML = "";
				getClasses();
			}
		};
		xmlhttp.open("GET","files/php/deleteClass.php?class_id="+stats.class_id,true);
		xmlhttp.send();		
	}
}

/*
Parameters:
	old_team	|	integer, specifies the current team the student is on
	new_team	|	integer, specifies the team to move the student to
	element 	|	object, the student object to be moved
Behavior:
	Updates the database to reflect the new team
	Updates the local array (teamArray) to keep track of client side changes (prevents a database refresh)
	Updates the visual element to reflect the team change (moves the student to new team on the page)
Output:
	None.
Exceptions:
	If the database fails to update, the team member is "visually" moved back to the original team and an error is logged in the console
*/
function switchTeams(old_team, new_team, element) {
	if(new_team == null) { new_team = 0; }
	element.team_name = 'team'+new_team;
	element.team_num = new_team;
	document.getElementById(new_team).appendChild(document.getElementById(element.student_id));
	teamArray[new_team].push(element);
	//recalculate the team stats for the two teams that were modified
	if(old_team != null && old_team < teamArray.length) { calculateMeta(old_team); }
	calculateMeta(new_team);
	//update the database
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if(this.responseText != 'success') {
				console.log(this.responseText+" | student moved to unsorted");
				element.team_name = 'team0';
				element.team_num = 0;
				teamArray[0].push(element);
				document.getElementById('team0').appendChild(document.getElementById(element.student_id)); 
			}
		} 
	};
	xmlhttp.open("GET","files/php/switchTeams.php?old_team=team"+old_team+"&new_team=team"+new_team+"&student_id="+element.student_id,true);
	xmlhttp.send();
}

/*
Parameters:
	None
Behavior:
	Toggles the enrollment status of a team
	Changes the visual element of the button to reflect the status (red = inactive, green = active)
	Updates the database to reflect the changes (inactive classes will not accept any new surveys)
Output:
	None; the visual element is updated
Exceptions:
	If the database fails to update, the team member is "visually" moved back to the original team and an error is logged in the console
*/
function enroll() {
	var enroll = document.getElementById("enroll");
	if(stats.class_active == 0) {
		stats.class_active = 1;
		document.getElementById(stats.class_name).className = "btn btn-outline-success btn-block";
		enroll.innerHTML = "enrollment activated";
		enroll.className = "btn btn-success btn-block header";
	} else {
		stats.class_active = 0;
		document.getElementById(stats.class_name).className = "btn btn-outline-danger btn-block";
		enroll.innerHTML = "enrollment deactivated";
		enroll.className = "btn btn-danger btn-block header";
	}
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);
		}
	};
	xmlhttp.open("GET","files/php/changeEnrollment.php?active="+stats.class_active+"&class_id="+stats.class_id+"&professor_id="+prof.professor_id,true);
	xmlhttp.send();
}

/*
Parameters:
	None
Behavior:
	Moves all unsorted students onto a team based on language preference
	A language preference is: the maximum score (ties are not allowed) given to a language
	If there is no language preference, they student is moved to none, and used to fill teams
	Students in none are only sorted if the language being considered has a higher than average score for the student
Output:
	None; the visual elements are moved to reflect the changes, the local array is updated to keep track of the changes, and the database is updated
Exceptions:
	None; students who do not form a team of at least 4 or do not have a good fit on another team are moved back to unsorted
*/
function sort() {
	if(teamArray[0].length == 0) { return; }
	if(stats.size > 0) {
		//ensure each student in the unsorted list has a language preference
		createLangPref();
		//current team number we are filling (0=unsorted, 1=team1...)
		var cur_team_num = 1; 
		//for(var i = bucketlist.length; i-- > 0; ) {
		for(var i = 0; i < bucketlist.length; i++) {
			for(var j = bucketlist[i].length; j-- > 0; ) {
				//see if the team is full
				var team_available = true; 
				while(team_available) {
					//the current team is full, so we want to increment and fill the next team
					if(getTeamSize(cur_team_num) >= team_size) {
						cur_team_num++;
					} else {
						//we have a good fit, add the person to the team in the database
						switchTeams(0, cur_team_num, bucketlist[i].pop());  
						team_available = false;
					}
				}
				//NO PREFERRED PREFERENCE REMAINING; FILL REMAINING SLOTS WITH PEOPLE FROM NONE
				if(j == 0 && getTeamSize(cur_team_num) < team_size) {
					var fill_team = true;
					var none = langBucket.indexOf('none'); 	//array index of none
					var len = bucketlist[none].length-1;
					//we want to try to fill the team with members from none
					while(fill_team) {
						//this team is now full, no need to keep filling
						if(getTeamSize(cur_team_num) >= team_size) {
							cur_team_num++;
							fill_team = false;
						//we are out of people in the bucketlist 'none'
						} else if(len <= 0) {
							fill_team = false;
						} else {
							var element = bucketlist[none][len];
							//SEE IF THE ELEMENT MATCHES OUR CRITERIA (we need a strong language correlation)
							if(element[langBucket[i]] > element.avg_lang) {
								bucketlist[none].splice(len, 1);
								switchTeams(0, cur_team_num, element);  //add the person to the team in the database
							}
						}
						len--;
					}
				}
			}
			//customer requested we move everyone back to unsorted if the team size is less than 4
			if(getTeamSize(cur_team_num) < team_size && getTeamSize(cur_team_num) < 4) {
				for(var x = bucketlist[i].length; x-- > 0; ) {
					var move = teamArray[cur_team_num].pop();
					switchTeams(cur_team_num, 0, move);
					bucketlist[6].push(teamArray[0].pop());
				}
			}
		}
		//make sure the bucketlist is empty by pushing all remaining element back to the unsorted list (we don't want to lose track of anyone)
		for(var p = bucketlist.length; p-- > 0; ) {
			for(var q = bucketlist[p].length; q-- > 0; ) {
				console.log("unable to find a team for "+bucketlist[p][q].student_id);
				//add the person to the unsorted team in the database
				switchTeams(0, 0, bucketlist[p].pop());  
			}
		}
		//if our final team has a team size less than 4, dump everyone to unsorted as per customer request
		if(teamArray[cur_team_num].length < 4) {
			var counter = teamArray[cur_team_num].length;
			for(var z = 0; z < counter; z++ ) {
				switchTeams(cur_team_num, 0, teamArray[cur_team_num].pop());
			}
		}
	}
}

/*
Parameters:
	None
Behavior:
	Moves all students to the unsorted team
Output:
	None; the visual elements are updated to reflect the changes, the local array is updated to keep track of the changes, and the database is updated
Exceptions:
	None
*/
function resetTeams() {
	for(var i = teamArray.length; i-- > 1; ) {
		for(var j = teamArray[i].length; j-- > 0; ) {
			switchTeams(i, 0, teamArray[i].pop()); //moves everyone to team0 or unsorted
		}
	}
}

/*
Parameters:
	None
Behavior:
	Initiates an export of current teams to a text file
Output:
	None; a new tab opens with the text representation of teams
Exceptions:
	An alert is displayed if the file fails to export
*/
function exportTeams() {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = this.responseText;
			if(response.charAt(0) == "#") {
				alert("Failed to export the file to TSV! Please don't fail us! =[");
			} else {
				window.open('files/export/'+this.responseText);
			}
		}
	};
	xmlhttp.open("GET","files/php/exportTeams.php?class_id="+stats.class_id,true); 
	xmlhttp.send();
}

/*
Parameters:
	None
Behavior:
	Validates the entry field when creating a new class
	On Success:
		-submits the data by calling createClass()
		-resets the form
	On Failure:
		-an error message is displayed
		-the data is not submitted
Output:
	None;
Exceptions:
	None
*/
function validateClass() {
	var new_class = document.getElementById('className');
	if(new_class.checkValidity() && new_class.value) {
		createClass(new_class.value);
		document.getElementById("new-class-form").reset();
	} else {
		document.getElementById("c_results").innerHTML = "Not a valid course name. Only alphanumeric characters, spaces, dashes and underscores are accepted.";
	}
}
/*
Parameters:
	None
Behavior:
	Validates the data fields when creating a new user account
	On Success:
		-submits the data by calling createUser()
		-resets the form
	On Failure:
		-an error message is displayed
		-the data is not submitted
Output:
	None
Exceptions:
	None
*/
function validateNewLogin() {
	var passed = [];
	var fields = ["login_id", "login_name", "login_email", "login_pass"];
	for(var i = 0; i<fields.length; i++) {
		var field = document.getElementById(fields[i]);
		if(field.checkValidity() && field.value) {
			passed.push(field.value);
		}
	}
	if(passed.length == fields.length) {
		createUser(passed);
		document.getElementById("new-login-form").reset();
	} else {
		document.getElementById("login_results").innerHTML = "Invalid information. Username and Last Name must be between 1-20 alphanumeric characters. Password must be at least 6 characters. Email must be in a valid email format.";
	}
}

/*
Parameters:
	values 		|	array, list of values to use when submitting the request for a new user
Behavior:
	Makes a call to createUser.php to submit the user data 
Output:
	None; success or failure is displayed on the page
Exceptions:
	None
*/
function createUser(values) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById('login_results').innerHTML = this.responseText;
		}
	};
	xmlhttp.open("GET","files/php/createUser.php?login="+values[0]+"&lname="+values[1]+"&email="+values[2]+"&pass="+values[3],true);
	xmlhttp.send();
}

/*
Parameters:
	new_class 		|	string, the name of the new class to be created
Behavior:
	Makes a call to createClass.php to submit the class data 
	Makes a call to getClasses() to refresh the class list dropdown
Output:
	None
Exceptions:
	None
*/
function createClass(new_class) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById('c_results').innerHTML = this.responseText;
			getClasses();
		}
	};
	xmlhttp.open("GET","files/php/createClass.php?class="+new_class+"&prof_id="+prof.professor_id,true);
	xmlhttp.send();
}

/*
Parameters:
	None
Behavior:
	Creates a dropdown list of classes by calling getClasses.php
Output:
	None; the dropdown list is displayed on the screen
Exceptions:
	None
*/
function getClasses() {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		document.getElementById('dropdown').innerHTML = this.responseText;
    	}
    };
    xmlhttp.open("GET","files/php/getClasses.php?prof_id="+prof.professor_id,true); // send request to php and receive what we have in php
    xmlhttp.send();
}

/*
Parameters:
	selected	|	string, the id of the currently selected filter
Behavior:
	Changes the style of the filter buttons to make the page more dynamic
	Sets all buttons to the unselected state, then changes the selected filter to the selected state
Output:
	None; the visual elements are updated on the page
Exceptions:
	None
*/
function clearFilterClass(selected) {
	var filters = ["f_langs", "f_gpa", "f_skills", "f_flex", "f_motiv", "f_social", "f_exp"];
	for(var i = 0; i<filters.length; i++) {
		if(selected == filters[i]) {
			document.getElementById(filters[i]).className = "btn btn-lg btn-info btn-block filter";	
		} else {
			document.getElementById(filters[i]).className = "btn btn-lg btn-outline-info btn-block filter";	
		}
	}
}

/*
Parameters:
	None
Behavior:
	Changes the style of the student buttons to make the page more dynamic
	Sets all buttons to the unselected state by clearing any applied filters
Output:
	None; the visual elements are updated on the page
Exceptions:
	None
*/
function clearFilters() {
	clearFilterClass("none");
	for(var i = 0; i< num_teams+1; i++) {
		var parent = document.getElementById(i).getElementsByTagName('div');
		if(parent.length > 0) {
			for(var j=0; j<parent.length; j++) {
				var index = getIndex(i, parent[j].id);
				document.getElementById(teamArray[i][index].student_id+"_info").innerHTML = "";
				parent[j].className = "studentdiv btn btn-sm btn-block btn-secondary text-left";
			}
		}
	}
}

/*
Parameters:
	id 		|	string, the id of the button that was pressed
Behavior:
	Changes the style of the student buttons to make the page more dynamic:
	Sets all buttons to the unselected state by clearing any applied filters
	Highlights all students with a GPA higher than 1 standard deviation above the mean in green
	Highlights all students with a GPA lower than 1 standard deviation below the mean in red
	Displays the students GPA score next to their name
Output:
	None; the visual elements are updated on the page
Exceptions:
	None
*/
function filterGrades(id) {
	clearFilterClass(id);
	for(var i = 0; i< num_teams+1; i++) {
		var parent = document.getElementById(i).getElementsByTagName('div');
		if(parent.length > 0) {
			for(var j=0; j<parent.length; j++) {
				parent[j].className = "studentdiv btn btn-sm btn-block btn-outline-secondary text-left";
				var index = getIndex(i, parent[j].id);
				if(teamArray[i][index].avg_grades > stats.total_gpa_avg+stats.total_gpa_dev) {
					parent[j].className = "studentdiv btn btn-sm btn-block btn-success text-left";
				}
				if(teamArray[i][index].avg_grades < stats.total_gpa_avg-stats.total_gpa_dev) {
					parent[j].className = "studentdiv btn btn-sm btn-block btn-danger text-left";
				}
				let newId = "#"+teamArray[i][index].student_id+"_info";
				$(newId).text(teamArray[i][index].avg_grades.toFixed(2));
			}
		}
	}
}

/*
Parameters:
	id 		|	string, the id of the button that was pressed
Behavior:
	Changes the style of the student buttons to make the page more dynamic:
	Sets all buttons to the unselected state by clearing any applied filters
	Highlights all students highest scored language
	Displays the student language by the student name
Output:
	None; the visual elements are updated on the page
Exceptions:
	None
*/
function filterLanguage(id) {
	clearFilterClass(id);
	for(var i = 0; i< num_teams+1; i++) {
		var parent = document.getElementById(i).getElementsByTagName('div');
		if(parent.length > 0) {
			for(var j=0; j<parent.length; j++) {
				parent[j].className = "studentdiv btn btn-sm btn-block btn-outline-secondary text-left";
				var index = getIndex(i, parent[j].id);
				var element = teamArray[i][index];
				document.getElementById(element.student_id+"_info").innerHTML = "";
				var langArray = [ element.skill_java, element.skill_cplusplus, element.skill_c, element.skill_python, element.skill_android, element.skill_web ];
				langArray.sort(function(a, b){return b - a});
				if(langArray[0] != langArray[1]) {
					var set_lang = getKeyByValue(element.languages, langArray[0]);

					switch(set_lang) {
						case skills[0]:
							document.getElementById(element.student_id).className = "studentdiv btn btn-sm btn-block btn-primary text-left";
							document.getElementById(element.student_id+"_info").innerHTML = skill_print[0] + " | " +element[set_lang];
							break;
						case skills[1]:
							document.getElementById(element.student_id).className = "studentdiv btn btn-sm btn-block btn-success text-left";
							document.getElementById(element.student_id+"_info").innerHTML = skill_print[1] + " | " +element[set_lang];
							break;
						case skills[2]:
							document.getElementById(element.student_id).className = "studentdiv btn btn-sm btn-block btn-danger text-left";
							document.getElementById(element.student_id+"_info").innerHTML = skill_print[2] + " | " +element[set_lang];
							break;
						case skills[3]:
							document.getElementById(element.student_id).className = "studentdiv btn btn-sm btn-block btn-warning text-left";
							document.getElementById(element.student_id+"_info").innerHTML = skill_print[3] + " | " +element[set_lang];
							break;
						case skills[4]:
							document.getElementById(element.student_id).className = "studentdiv btn btn-sm btn-block btn-info text-left";
							document.getElementById(element.student_id+"_info").innerHTML = skill_print[4] + " | " +element[set_lang];
							break;
						case skills[5]:
							document.getElementById(element.student_id).className = "studentdiv btn btn-sm btn-block btn-secondary text-left";
							document.getElementById(element.student_id+"_info").innerHTML = skill_print[5] + " | " +element[set_lang];
							break; 
					}
				}
			}
		}
	}
}

/*
Parameters:
	id 		|	string, the id of the button that was pressed
Behavior:
	Changes the style of the student buttons to make the page more dynamic:
	Sets all buttons to the unselected state by clearing any applied filters
	Highlights all students with a skill higher than 1 standard deviation above the mean in green
	Highlights all students with a skill lower than 1 standard deviation below the mean in red
	Displays the students skill score next to the students name
	The skills are calculated by getting the average of all skillset options on the survey page
Output:
	None; the visual elements are updated on the page
Exceptions:
	None
*/
function filterFlexibility(id) {
	clearFilterClass(id);
	for(var i = 0; i< num_teams+1; i++) {
		var parent = document.getElementById(i).getElementsByTagName('div');
		if(parent.length > 0) {
			for(var j=0; j<parent.length; j++) {
				parent[j].className = "studentdiv btn btn-sm btn-block btn-outline-secondary text-left";
				var index = getIndex(i, parent[j].id);
				if(teamArray[i][index].num_roles > stats.total_flex_avg+stats.total_flex_dev*.4) {
					parent[j].className = "studentdiv btn btn-sm btn-block btn-success text-left";
				}
				if(teamArray[i][index].num_roles < stats.total_flex_avg-stats.total_flex_dev*.4) {
					parent[j].className = "studentdiv btn btn-sm btn-block btn-danger text-left";
				}
				document.getElementById(teamArray[i][index].student_id+"_info").innerHTML = teamArray[i][index].num_roles;
			}
		}
	}
}

/*
Parameters:
	id 		|	string, the id of the button that was pressed
Behavior:
	Changes the style of the student buttons to make the page more dynamic:
	Sets all buttons to the unselected state by clearing any applied filters
	Highlights all students with a motivation score higher than 1 standard deviation above the mean in green
	Highlights all students with a motivation score lower than 1 standard deviation below the mean in red
	Displays the motivation score next to the students name
	A motivation score is calculated by counting the length of the learning objective field
Output:
	None; the visual elements are updated on the page
Exceptions:
	None
*/
function filterMotivation(id) {
	clearFilterClass(id);
	for(var i = 0; i< num_teams+1; i++) {
		var parent = document.getElementById(i).getElementsByTagName('div');
		if(parent.length > 0) {
			for(var j=0; j<parent.length; j++) {
				parent[j].className = "studentdiv btn btn-sm btn-block btn-outline-secondary text-left";
				var index = getIndex(i, parent[j].id);
				if(teamArray[i][index].len_learn > stats.total_learn_avg+stats.total_learn_dev) {
					parent[j].className = "studentdiv btn btn-sm btn-block btn-success text-left";
				}
				if(teamArray[i][index].len_learn < stats.total_learn_avg-stats.total_learn_dev) {
					parent[j].className = "studentdiv btn btn-sm btn-block btn-danger text-left";
				}
				document.getElementById(teamArray[i][index].student_id+"_info").innerHTML = teamArray[i][index].len_learn;
			}
		}
	}
}

/*
Parameters:
	id 		|	string, the id of the button that was pressed
Behavior:
	Changes the style of the student buttons to make the page more dynamic:
	Sets all buttons to the unselected state by clearing any applied filters
	Highlights all students with a skill higher than 1 standard deviation above the mean in green
	Highlights all students with a skill lower than 1 standard deviation below the mean in red
	Displays the students skill score next to the students name
	The skills are calculated by getting the average of all skillset options on the survey page
Output:
	None; the visual elements are updated on the page
Exceptions:
	None
*/
function filterSkills(id) {
	clearFilterClass(id);
	for(var i = 0; i< num_teams+1; i++) {
		var parent = document.getElementById(i).getElementsByTagName('div');
		if(parent.length > 0) {
			for(var j=0; j<parent.length; j++) {
				parent[j].className = "studentdiv btn btn-sm btn-block btn-outline-secondary text-left";
				var index = getIndex(i, parent[j].id);
				if(teamArray[i][index].avg_skill > stats.total_skill_avg+stats.total_skill_dev*.4) {
					parent[j].className = "studentdiv btn btn-sm btn-block btn-success text-left";
				}
				if(teamArray[i][index].avg_skill < stats.total_skill_avg-stats.total_skill_dev*.4) {
					parent[j].className = "studentdiv btn btn-sm btn-block btn-danger text-left";
				}
				document.getElementById(teamArray[i][index].student_id+"_info").innerHTML = teamArray[i][index].avg_skill.toFixed(2);
			}
		}
	}
}

/*
Parameters:
	id 		|	string, the id of the button that was pressed
Behavior:
	Changes the style of the student buttons to make the page more dynamic:
	Sets all buttons to the unselected state by clearing any applied filters
	Highlights all students with an experience score higher than 1 standard deviation above the mean in green
	Highlights all students with an experience score lower than 1 standard deviation below the mean in red
	Displays the experience score next to the students name
	A motivation score is calculated by counting the length of the experience field
Output:
	None; the visual elements are updated on the page
Exceptions:
	None
*/
function filterExperience(id) {
	clearFilterClass(id);
	for(var i = 0; i< num_teams+1; i++) {
		var parent = document.getElementById(i).getElementsByTagName('div');
		if(parent.length > 0) {
			for(var j=0; j<parent.length; j++) {
				parent[j].className = "studentdiv btn btn-sm btn-block btn-outline-secondary text-left";
				var index = getIndex(i, parent[j].id);
				if(teamArray[i][index].len_exp > stats.total_exp_avg+stats.total_exp_dev*1.5) {
					parent[j].className = "studentdiv btn btn-sm btn-block btn-success text-left";
				}
				if(teamArray[i][index].len_exp < stats.total_exp_avg-stats.total_exp_dev) {
					parent[j].className = "studentdiv btn btn-sm btn-block btn-danger text-left";
				}
				document.getElementById(teamArray[i][index].student_id+"_info").innerHTML = teamArray[i][index].len_exp;
			}
		}
	}
}

/*
Parameters:
	id 		|	string, the id of the button that was pressed
Behavior:
	Changes the style of the student buttons to make the page more dynamic:
	Sets all buttons to the unselected state by clearing any applied filters
	Highlights all students with a social score higher than 1 standard deviation above the mean in green
	Highlights all students with a social score lower than 1 standard deviation below the mean in red
	Displays the students social score next to the students name
	A social score is calculated by comparing the shy vs outgoing field against the class average
Output:
	None; the visual elements are updated on the page
Exceptions:
	None
*/
function filterSocial(id) {
	clearFilterClass(id);
	for(var i = 0; i< num_teams+1; i++) {
		var parent = document.getElementById(i).getElementsByTagName('div');
		if(parent.length > 0) {
			for(var j=0; j<parent.length; j++) {
				parent[j].className = "studentdiv btn btn-sm btn-block btn-outline-secondary text-left";
				var index = getIndex(i, parent[j].id);
				if(teamArray[i][index].outgoing_shy > stats.total_skill_avg+stats.total_skill_dev) {
					parent[j].className = "studentdiv btn btn-sm btn-block btn-success text-left";
				}
				if(teamArray[i][index].outgoing_shy < stats.total_skill_avg-stats.total_skill_dev) {
					parent[j].className = "studentdiv btn btn-sm btn-block btn-danger text-left";
				}
				document.getElementById(teamArray[i][index].student_id+"_info").innerHTML = teamArray[i][index].outgoing_shy;
			}
		}
	}
}