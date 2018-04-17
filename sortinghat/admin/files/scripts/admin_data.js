
/*
Global Variables:
	helptext 	|	array of help messages displayed when particular buttons are pressed
	generalHelp |	text that is displayed when the general help button is pressed
	langBucket	|	the array of values to sort when using bucketsort
	skills 		|	the name of the langues as stored in the database, so we can look up the value for associated scores
	skill_print | 	the name to print for each associated key in the skills array
	teamArray	| 	the local 2d array that tracks which students are on which team
	bucketlist 	|	the bucket list that is used when assigning students to a preferred langauge
	team_size 	| 	the default team size, which can change when the appropriate button is pressed
	num_team 	| 	the number of total teams to create
	stats 		|	a JSON object which stores the statistics for the current class
	prof 		|	a JSON object which stores general information for the professor regarding the current class
	next 		|	an integer to keep track of the help state
*/
var helptext = ["Language: A language preference is determined if a student has a single highest ranked language.\nScores are assigned based on the normalized deviation from the class average.\nA score from 0-1 is a normal language correlation. \nA score from 1-2 is a strong language correlation. \nA score above 2 is an exceptional language correlation.\nLow individual scores would indicate a lack of programming preference.", "GPA: The GPA is calculated by averaging the grade point average score based on the grades entered from the survey.\nStudents are initially sorted via GPA in descending order to minimize a significant GPA difference between team members.\nThe GPA filter will highligh the top and bottom students, based on the standard deviation and class average.", "Flexibility: This measures how flexible a team is by looking at the number of preferred roles a student has selected.\nThe flexibility filter will highlight the top and bottom students in red or green based on the standard deviation from the class average for number of roles.", "Experienced: A team tagged as experienced indicates that the text field for previous experience contains a higher than average amount of text.\nThis may indicated a correlation to of more experience.\nThe experience filter will highlight the top and bottom in green or red based on the standard deviation and class average.", "Social: A team tagged as social indicates that the group has higher scores in the outgoing category, relative to other teams.\nThe social filter will highlight the top and bottom student survey scores for the outgoing vs shy option in green or red.", "Motivated: A team tagged as motivated indicates that the learning objective field on the survey contains a higher than average amount of text.\nThis may correlate to a higher motivation to learn.\nThe motivation filter will highlight the top and bottom students based on the amount of text entered comparable to the class average.", "Skilled: A team tagged as skilled has a higher than average score in the various skillset options.\nThis could indicate a higher level of confidence in skills.\nThe skills filter will highlight the top and bottom students compared to the class average."];
var generalHelp = ["<p>The top buttons from left to right include the Course Selection menu, the Enrollment button, User button, and Nightmode button.</p><p>The Course Selection button is used to change classes. Once a class has been chosen, all student surveys for the selected class will be loaded. If sorting has not been implemented, all students will appear on the left hand side under \'unsorted\'.</p><p>This will also unlock additional buttons on the right hand side. These options include Team Size, Sorting, and Filters which are explained next.</p>", "<p>The Enrollment button is used to toggle the enrollment state. If enrollment is activated, the survey page will accept new submission for this course. If the enrollment button is deactivated, the course will no longer be an option when filling out a survey.</p><p>The User button is displays the current user. If the button is clicked, the user will be prompted to log out. Pressing cancel will return the page, pressing confirm will log the user out.</p><p>The nightmode button is used to toggle between two different styles, which can be easier on the eyes late at night. When activated, the button will turn green and the elements on the page will be reconfigured with a dark theme.</p>", "<p>The Team Size buttons allow you to change the team size. When selected, all filters are cleared and the page is reconfigured with enough teams to accomodate all students. Selecting a larger team size may result in some students being moved to the unsorted list if the team they were on no longer exists.</p><p>The Sorting buttons allow a user to sort, reset and export the results. Using the sort button will assign all students from the unsorted list onto a team. This works best if the teams are initially empty.</p><p>The Reset button will move all students to the unsorted team. This is the ideal location for students to reside when performing a sort.</p><p>The Export button will create a text file in a new window to allow for a quick copy and paste operation into a third party program.</p>", "<p>The Filters will toggle the display of the student elements to ease the process of dividing students into teams. Stats for each class are obtained and used when applying filters. The score for each filter is displayed next to each student. For more information about what each filter does, hover over the filter button.</p><p>The Clear Filters button will reset all elements to their default state."];
var langBucket = ["skill_android", "skill_python", "skill_web", "skill_java", "skill_cplusplus", "skill_c", "none"];
var skills = ["skill_android", "skill_python", "skill_web", "skill_java", "skill_cplusplus", "skill_c"];
var skill_print = ["android", "python", "web", "java", "c++", "c"];	
var teamArray = [];
var bucketlist;
var team_size = 5;
var num_teams = 0;
var stats;
var prof; 
var next;

/*
Parameters:
	None
Behavior:
	Creates and writes all menu elements to the page which includes sorting options, filters, and delete buttons
Output:
	None; the visual elements are created 
Error Handling:
	None
*/
function writeMenu() {
	document.getElementById('display_professor').appendChild(document.getElementById('prof_div'));
	document.getElementById('prof_div').innerHTML = prof.professor_name + " | LOGOUT";
	document.getElementById('prof_div').setAttribute ("onClick", "javascript: logout();" );
	var menu = document.getElementById('sort');
	menu.innerHTML = "<button id='gen_help' class='btn btn-lg btn-outline-primary btn-block' data-toggle='modal' data-target='#help_modal' onclick='displayGeneralHelp()'>help</button>";
	menu.innerHTML += "<button id='del_class' class='btn btn-lg btn-outline-danger btn-block ' onclick='deleteClass()'>DELETE CLASS</button>";
	menu.innerHTML += "<div class='header'>team size</div>";
	menu.innerHTML += "<div class='row'>" + "<div class='col-lg-4 col-md-4 col-sm-4'>"+
						"<button id='size_4' class='btn btn-outline-info btn-block size-btn' onclick='changeTeamSize(4)'>4</button>"+
						"</div>"+
						"<div class='col-lg-4 col-md-4 col-sm-4 '>"+
						"<button id='size_5'  class='btn btn-outline-info btn-block size-btn' onclick='changeTeamSize(5)'>5</button>"+
						"</div>"+
						"<div class='col-lg-4 col-md-4 col-sm-4 '>"+
						"<button id='size_6'  class='btn btn-outline-info btn-block size-btn' onclick='changeTeamSize(6)'>6</button>"+
						"</div>"+
						"</div>";
	menu.innerHTML += "<div class='header'>sorting</div>";
	menu.innerHTML += "<button id='sort'  class='btn btn-lg btn-outline-success btn-block menu' onclick='sort()'>sort</button>";
	menu.innerHTML += "<button id='reset' class='btn btn-lg btn-outline-danger btn-block menu' onclick='resetTeams()'>reset</button>";
	menu.innerHTML += "<button id='reset' class='btn btn-lg btn-outline-warning btn-block menu' onclick='exportTeams()'>export</button>";
	menu = document.getElementById('filters');
	menu.innerHTML = "<div class='header'>filters</div>";
	menu.innerHTML += "<button id='f_clear' class='btn btn-lg btn-outline-danger btn-block filter' onclick='clearFilters()'>clear filters</button>";
	menu.innerHTML += "<button id='f_langs' class='btn btn-lg btn-outline-info btn-block filter' onclick='filterLanguage(this.id)' title='"+helptext[0]+"'>language</button>";
	menu.innerHTML += "<button id='f_gpa' class='btn btn-lg btn-outline-info btn-block filter' onclick='filterGrades(this.id)' title='"+helptext[1]+"'>gpa</button>";
	menu.innerHTML += "<button id='f_skills' class='btn btn-lg btn-outline-info btn-block filter' onclick='filterSkills(this.id)' title='"+helptext[6]+"'>skills</button>";
	menu.innerHTML += "<button id='f_flex' class='btn btn-lg btn-outline-info btn-block filter' onclick='filterFlexibility(this.id)' title='"+helptext[2]+"'>flexibility</button>";
	menu.innerHTML += "<button id='f_motiv' class='btn btn-lg btn-outline-info btn-block filter' onclick='filterMotivation(this.id)' title='"+helptext[5]+"'>motivation</button>";
	menu.innerHTML += "<button id='f_exp' class='btn btn-lg btn-outline-info btn-block filter' onclick='filterExperience(this.id)' title='"+helptext[3]+"'>experience</button>";
	menu.innerHTML += "<button id='f_social' class='btn btn-lg btn-outline-info btn-block filter' onclick='filterSocial(this.id)' title='"+helptext[4]+"'>social</button>";
}

/*
Parameters:
	dataArray	|	object array, contains a complete list of students as a JSON object
Behavior:
	Determines the total number of teams (number of students / team size)
	Creates a visual element for each student and each team
	Ensures the database contains team information for our total number of teams
	Initializes client side array for tracking teams and meta information (teamArray)
	Initially places each student onto their prior team:
		-If a student is already on a team, they are moved to their existing team (maintains state)
		-Else the student is moved to team0 (unsorted)
Output:
	None; the visual elements are created and students are sorted onto existing teams or moved to unsorted
Error Handling:
	None.
*/
function writeTeams(dataArray) {
	num_teams = Math.ceil(dataArray.length/team_size);
	var team0 = document.getElementById('student-list');
	var teams = document.getElementById('team-section');
	teams.innerHTML = "";
	//team0.innerHTML = "<div id='team0 teamdiv'><h1 class='header'>unsorted</h1><div id='0' class='teamcontent' style='height: 60vh' ondrop='drop(event, this)' ondragover='allowDrop(event)'></div><div id='footer0' class='footer'></div></div>";
	team0.innerHTML = "<div id='team0'><h1 class='header'>unsorted</h1><div id='0' class='teamcontent' ondrop='drop(event, this)' ondragover='allowDrop(event)'></div><div id='footer0' class='footer'></div></div>";
	teamArray = [ [] ]; //resets the teamArray and sets index of 0 to 'unsorted' students
	createTeam(0);
	for(var t=1; t<=num_teams; t++) {
		createTeam(t);
		teamArray.push([]); //create an empty array for each team
		teams.innerHTML += "<div id='team"+t+"' class='col-lg-4 col-md-6 col-sm-12 teamdiv'><h1 class='header'>team "+t+"</h1><div id='"+t+"' class='teamcontent' ondrop='drop(event, this)' ondragover='allowDrop(event)'></div><div id='footer"+t+"' class='footer'></div></div>";
	}
	//loop backwards through entire data result so we can use pop() instead of splice() which breaks the index loop
	for(var i = dataArray.length; i-- > 0; ) {
		var element = dataArray.pop();
		var new_name = element.student_name;
		//create the visual element for the student and moves the element to the current assigned team based on database values (maintains state)
		var newChild = "<div class='btn btn-sm btn-secondary btn-block text-left' id='"+element.student_id+"' draggable='true' ondrop='return false' ondragover='return false' ondragstart='drag(event)' onclick='studentInfo("+element.student_id+")' data-toggle='modal' data-target='#student-info-modal'>"+new_name+"<span id='"+element.student_id+"_info' style='float: right'></span></div>";
		var kv_lang = {skill_java: element.skill_java, skill_cplusplus: element.skill_cplusplus, skill_c: element.skill_c, skill_python: element.skill_python, skill_android: element.skill_android, skill_web: element.skill_web};
		element['languages'] = kv_lang;
		if(element.team_num == null) {
			document.getElementById('0').innerHTML += newChild;
			switchTeams(element.team_num, 0, element);
		} else if(element.team_num > num_teams) {
			document.getElementById('0').innerHTML += newChild;
			switchTeams(0, 0, element);
		}
		else {
			document.getElementById(element.team_num).innerHTML += newChild;
			switchTeams(element.team_num, element.team_num, element);
		}
	}
}

/*
Parameters:
	team_num	|	integer, specifies the team to create
Behavior:
	Creates a new team on the database if it does not already exist
Output:
	None
Error Handling:
	Any errors are logged to the console
*/
function createTeam(team_num) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if(this.responseText != 'success') {
				console.log(this.responseText);
			}
		}
	};
	xmlhttp.open("GET","files/php/createTeam.php?team_name=team"+team_num+"&team_num="+team_num,true);
	xmlhttp.send();
}

/*
Parameters:
	None
Behavior:
	Creates a 2d array for bucket list sorting
	Adds all students from unsorted list into their prefered language bucket by using the index of of their highest language
	This is to locate all students with a single language of highest preference (no ties)
		-Any ties for highest language will result in the student being moved to the 'none' category
Output:
	None; all students from the unsorted list will be moved from the local teamArray into the bucket list for processing
	Makes a call to addToBucket
Error Handling:
	None
Sources:
	//https://www.w3schools.com/js/js_array_sort.asp
*/
function createLangPref() {
	bucketlist = [ [], [], [], [], [], [], [] ]; //clear the bucket list
	for(var i = teamArray[0].length; i-- > 0; ) {
		var langArray = [ teamArray[0][i].skill_java, teamArray[0][i].skill_cplusplus, teamArray[0][i].skill_c, teamArray[0][i].skill_python, teamArray[0][i].skill_android, teamArray[0][i].skill_web ];
		langArray.sort(function(a, b){return b - a});
		if(langArray[0] == langArray[1]) {
			//duplicate max values
			addToBucket('none', i);
		} else {
			//one clear preference
			addToBucket(getKeyByValue(teamArray[0][i].languages, langArray[0]), i);
		}
	}
}

/*
Parameters:
	bucket 		|	string, the name of the language bucket by using the index of langBucket
Behavior:
	Moves all students from the unsorted list into the bucket list for processing based on their greatest language preference
Output:
	None; the bucket list will be populated
Error Handling:
	In the event that we don't know what language is associated with langBucket, we log an error to the console
*/
function addToBucket(bucket) {
	switch(bucket) {
		case langBucket[0]:
			bucketlist[0].push(teamArray[0].pop());
			break;
		case langBucket[1]:
			bucketlist[1].push(teamArray[0].pop());
			break;
		case langBucket[2]:
			bucketlist[2].push(teamArray[0].pop());
			break;
		case langBucket[3]:
			bucketlist[3].push(teamArray[0].pop());
			break;
		case langBucket[4]:
			bucketlist[4].push(teamArray[0].pop());
			break;
		case langBucket[5]:
			bucketlist[5].push(teamArray[0].pop());
			break;
		case langBucket[6]:
			bucketlist[6].push(teamArray[0].pop());
			break;
		default:
			//we were unable to determine which language this person has, so we will not move it
			console.log("something went wrong with bucket sort?");
			break;
	}
}

