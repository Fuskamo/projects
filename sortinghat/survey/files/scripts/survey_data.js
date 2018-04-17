/*
Sources Used:
https://codepen.io/trevanhetzel/pen/rOVrGK
https://stackoverflow.com/questions/12300767/html-input-range-step-as-an-array-of-values
https://learn.shayhowe.com/html-css/positioning-content/
*/


/*
GLOBAL VARIABLES:
	-info	|	keeps track of global variables in a single object to minimize the saturation of the global namespace
*/
var info = {"class_id":"", "class_name":"", "professor_id":"", "professor_name":"", "student_id":"", "display": '1' };

/*
Parameters: None.
Behavior:
	Moves the following elements from the login screen to the header of the page
		-Student Id
		-Class 
		-Professor
Output:	
	None; elements are moved
Error Handling:	
	None
*/
function writeHeader() {
	document.getElementById('display_id').appendChild(document.getElementById('stud_div'));
	document.getElementById('display_class').appendChild(document.getElementById('class_div'));
	document.getElementById('display_professor').appendChild(document.getElementById('prof_div'));
}

/*
Parameters: 
	None
Behavior:
	Generates and displayes the visual elements necessary for survey data entry
	The following variables are used to dynamically generate page content; add and remove values from these arrays as necessary
		-languages		|	contains the text displayed on the page for the programming languages 
		-proficiencies	|	contains the text displayed on the page for the various proficiencies
		-classes		|	contains the text displayed on the page for keeping track of previous courses taken
		-roles 			| 	contains the text displayed on the page for the different types of roles available
		-helptext		| 	contains the text to display when it is unclear how to fill in the survey for a particular section
		-form 			| 	contains a string of HTML elements to dynamically generate form data
Output:	
	None; writes the data generated below into the 'results' div by adding each section to the 'form' variable
Error Handling:	
	None
*/
function writeForm() {
	var languages = ["android", "java", "python", "c", "c++", "web design"];
	var proficiencies = ["problem solving", "analytic thinking", "innovation", "public speaking", "plan & organize", "big picture", "powerpoint", "team building", "good with details", "spoken english", "written english", "technical writing", "shy vs outgoing"];
	var classes = ["cis 313", "cis 314", "cis 315", "cis 399", "cis 415", "cis 425"];
	var helptext = ["Enter your legal name (registered with the University), the name you prefer to be called, and your University student ID number", "Enter the course number for all CIS courses you are enrolled in this term. The goal is to place students in a group with shared classes in common", "Please select the grade you received in the following classes. If you have not yet taken the course, please select the 'not taken' option", "Rate your programming skills on a scale from 0 (not familiar) to 5 (code ninja). This goal is to place students into a group with a shared language in common", "Rank your skills from 0 (weak) to 5 (stong). The goal is to form a well rounded team so that one students\' weaknesses are complimented by another students\' strengths", "Choose the roles that resonate deep within your soul. This does not guarantee that you will get the role you choose, but it allows for a better team selection process", "Enter any professional experience that you have. This can include work history, previous projects, internships, etc. In the learning outcomes section, specify what you hope to learn from this class"];
	var roles = ["manager", "system architect", "requirements analyst", "technical documentation", "user documentation", "quality control", "user interface", "programmer", "configuration control"];

	var form = "<form id='surveyform' name='surveyform' method='post'>";
	//student identifying information
	form += "<button type='button' id='s' class='btn btn-secondary btn-block header' onclick='toggleDisplay(\"help_student\")'>student information</button>";
	form += "<div class='bs-callout bs-callout-info help' style='display: none' id='help_student'>"+helptext[0]+"</div>";
	form += "<div class='row'>";
	form += "<div class='col-lg-4 col-md-12 col-sm-12'><input type='text' class='form-control' id='student_name' name='student_name' placeholder='Name' pattern='[A-Za-z\\s]+' maxlength='45' required /></div>";
	form += "<div class='col-lg-4 col-md-12 col-sm-12'><input type='text' class='form-control' id='student_nickname' name='student_nickname' placeholder='Nickname' pattern='([A-Za-z\\s]+)?' maxlength='25' /></div>";
	form += "<div class='col-lg-4 col-md-12 col-sm-12'><input type='text' class='form-control' id='student_id' name='student_id' placeholder='Student ID' pattern='[0-9]{6,12}' maxlength='12' required value='"+info.student_id+"' oninput='document.getElementById(\"student_info\").innerHTML=\" | \"+this.value' /></div>";
	form += "</div>";
	//courses enrolled this term
	form += "<button type='button' id='c' class='btn btn-secondary btn-block header' onclick='toggleDisplay(\"help_courses\")'>cis courses enrolled this term</button>";
	form += "<div class='bs-callout bs-callout-info help' style='display: none' id='help_courses'>"+helptext[1]+"</div>";
	form += "<div class='row'>";
	for(var e = 1; e <= 3; e++) {
		form += "<div class='col-lg-4 col-md-12 col-sm-12'><input type='text' class='form-control' id='c"+e+"' name='courses[]' pattern='([A-Za-z]+\\s[0-9]+)?' maxlength='8'  placeholder='Current Course "+e+"'/></div>";
	}
	form += "</div>";
	//grades in past classes (currently in a list)
	form += "<button type='button' class='btn btn-secondary btn-block header' onclick='toggleDisplay(\"help_grades\")'>grade history</button>";
	form += "<div class='bs-callout bs-callout-info help' style='display: none' id='help_grades'>"+helptext[2]+"</div>";
	form += "<div class='row'>";
	for(var c = 0; c < classes.length; c++) {
		form += "<div class='col-lg-2 col-md-4 col-sm-6'><label for='"+classes[c]+"'>"+classes[c]+"</label>"+getList()+"</div>";
	}
	form += "</div>";

	//language coding skill with slidebar
	form += "<button type='button' id='l' class='btn btn-secondary btn-block header' onclick='toggleDisplay(\"help_skills\")'>programming skills</button>";
	form += "<div class='bs-callout bs-callout-info help' style='display: none' id='help_skills'>"+helptext[3]+"</div>";
	form += "<div class='row'>";
	for(var p=0; p<languages.length; p++) {
		form += "<div class='col-lg-3 col-md-4 col-sm-6'><label for='"+languages[p]+"'>"+languages[p]+"</label> | <span class='output' id='outLang"+p+"'>0</span>";
		form += "<div class='slidebar'><input type='range' class='range' id='lang"+p+"' name='"+languages[p]+"' min='0' max='5' value='0' oninput='update(lang"+p+", outLang"+p+")'></div></div>";
	}
	form += "</div>";

	//skillset with slide bar
	form += "<button type='button' id='p' class='btn btn-secondary btn-block header' onclick='toggleDisplay(\"help_skillset\")'>skillset</button>";
	form += "<div class='bs-callout bs-callout-info help' style='display: none' id='help_skillset'>"+helptext[4]+"</div>";
	form += "<div class='row'>";
	for(var s=0; s<proficiencies.length; s++) {
		form += "<div class='col-lg-3 col-md-4 col-sm-6'><label for='"+proficiencies[s]+"'>"+proficiencies[s]+"</label> | <span class='output' id='outProf"+s+"'>0</span>";
		form += "<div class='slidebar'><input type='range' class='range' id='prof"+s+"' name='"+proficiencies[s]+"' min='0' max='5' value='0' oninput='update(prof"+s+", outProf"+s+")'></div></div>";
	}
	form += "</div>";

	//preferred roles with hidden checkboxes, corresponding buttons
	form += "<button type='button' id='r' class='btn btn-secondary btn-block header' onclick='toggleDisplay(\"help_roles\")'>preferred roles</button>";
	form += "<div class='bs-callout bs-callout-info help' style='display: none' id='help_roles'>"+helptext[5]+"</div>";
	form += "<div class='row'>";
	for(var r=0; r<roles.length; r++) {
		form += "<div class='col-lg-3 col-md-4 col-sm-6'><input type='checkbox' class='bs-callout bs-callout-info help' style='display: none'' id='role"+r+"' name='roles[]' value='"+roles[r]+"'>";
		form += "<button type='button' id='roleButton"+r+"' class='btn btn-outline-secondary btn-block margin' onclick='toggleSelected(\"role"+r+"\", this.id)'>"+roles[r]+"</button></div>";
	}
	form += "</div>";

	//misc information to be used at our discretion
	form += "<button type='button' id='m' class='btn btn-secondary btn-block header' onclick='toggleDisplay(\"help_misc\")'>misc information</button>";
	form += "<div class='bs-callout bs-callout-info help' style='display: none' id='help_misc'>"+helptext[6]+"</div>";
	form += "<div class='row'>";
	form += "<div class='col-lg-6 col-md-12'><label for='misc0'>professional experience</label></br><div class='textbox'><textarea name='prof_exp' id='misc0' rows='3' cols='60' pattern='[\\w]?'></textarea></div></div>";
	form += "<div class='col-lg-6 col-md-12'><label for='misc1'>learning outcomes</label></br><div class='textbox'><textarea id='misc1' name='exp_learn' rows='3' cols='60' pattern='[\\w]?'></textarea></div></div>";
	form += "</div>";

	//a few hidden fields to specify the class and professor information
	form += "<div style='display: none'><input type='text' id='professor_id' name='professor_id' value='"+info.professor_id+"' />";
	form += "<input type='text' id='class_id' name='class_id' value='"+info.class_id+"'/></div>";

	//the BIG submit button!
	form += "<button type='submit' id='send_survey' class='btn btn-success btn-lg btn-block header'>Send the Survey!</button>";
	form += "</form>";
	document.getElementById('results').innerHTML = form;
}

/*
Parameters: 
	None.
Behavior:
	Dynamically generates and displayes the visual elements necessary for the previous class grade history dropdown
	The following arrays are used and should be updated as text/value pairs; add and remove values from these arrays as necessary
		-grades 		| 	contains the text displayed in the dropdown menu to specify the grade for a previous course
		-gpa_pt 		| 	contains the value for each grade based on the index of the grades array when generating the drop down menu
Output:	
	Returns a select object with grades as menu options and gpa as associated values
Error Handling:	
	Uses the minimum value of the grades and gpa_pt array to ensure we don't get an index out of bounds error
*/
function getList() {
	var grades = ["Not Taken", "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "I/W/F"];
	var gpa_pt = ['0', '4.3', '4', '3.7', '3.3', '3', '2.7', '2.3', '2', '1.7', '1', '0'];
	var list = "<select class='form-control' name='grades[]' required>";
	list += "<option value='' selected disabled hidden>- Select Grade -</option>";
	var min = Math.min(grades.length, gpa_pt.length);
	for(g=0; g<min; g++) {
		list += "<option value='"+gpa_pt[g]+"'>"+grades[g]+"</option>";
	}
	list += "</select>";
	return list;
}

