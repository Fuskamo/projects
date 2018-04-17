/*
Parameters: 
	None
Behavior:
	This function executes when the page is loaded
	Populates the help text for the professor/course form into the 'help_text' div
Output:	
	None; makes a call to getProfessor() to generate a list of available professors
Error Handling:	
	None
*/
function loadLogin() {
	document.getElementById('help_text').innerHTML = "Please enter your student id number and select the appropriate professor from the list. Once a professor has been selected, you can then choose your class. Note that if a professor does not have any classes open for survey enrollment, you will not see the class or the professor on this list. If that is the case, contact your professor and request that they open enrollment for their course.";
	getProfessor();
}

/*
Parameters: 
	None
Behavior:
	When the submit button for the login form has been pushed

Output:	
	None
Error Handling:	
	Checks to ensure that the student_id typed into the student_id field is a valid number and that a valid course and professor have been selected
		-Success: 
			Adds the student_id to the survey meta data JSON object (info)
			Hides the professor/course form
			Displays the survey form
			Calls writeHeader() and writeForm()
		-Failure: 
			The page remains unchanged and the help info for the form is displayed
*/
function startSurvey() {
	var temp = document.getElementById('student_id');
	temp.checkValidity();
	//ensure data entered is valid
	if(document.getElementById('student_id').validity.patternMismatch || temp.value == "" || info.professor_name == "" || info.class_id == "") {
		document.getElementById('course_help').click();
	} else {
		info.student_id = temp.value;
		toggleDisplay('login_div');
		toggleDisplay('mainpage');
		writeHeader();
		writeForm();
	}
}

/*
Parameters:
	id		|	integer, the current student id number entered into the student_id field so far
Behavior:
	Call to setVis to change the visibility of the class element when data has been provided
	Performs a check to determine if all required fields have been filled out (class, professor and student id)
		-Success: Displays the submit button
		-Failure: The submit button is set invisible (used when deleting student id value)
Output:	None.
Error Handling:	
	None.
*/
function inputStudentId(id) {
	document.getElementById('student_info').innerHTML = " | "+id;
	info.student_id = id;
	if(info.professor_id && info.student_id > 10000000 && info.class_id) {
		setVis('login');
	} else {
		setInvis('login');
	}
}

/*
Parameters:
	None
Behavior:
	Validates the survey information to ensure there are no pattern mismatches
		-Success: Returns true
		-Failure: Returns false
Output:	
	boolean: success state
Error Handling:	
	None
*/
function validateSurvey() {
	var validation = document.getElementsByTagName('input');
	for(var i = 0; i < validation.length; i++) {
		if(validation[i].validity.patternMismatch) {
			console.log("ERROR: PATTERN MISMATCH");
			return false;
		} else {
			return true;
		}
	}
}

/*
Parameters:
	element		|	object, the range slider object
	output 		|	object, specifies the span object to update the 'element' value to
Behavior:
	Updates the page to reflect the new value of a skill when the slider is changed
	Uses the 'element' value to change the 'output' displayed text
Output:
	None; the page is updated
Error Handling:	
	None
*/
function update(element, output) {
	output.innerHTML = element.value;
}

/*
Parameters:
	element		|	string, specifies the id of the object to modify
Behavior:
	Toggles an object visibility state with no change to other content
Output:	
	None
Error Handling:	
	None

function toggleVisibility(element) {
	var div = document.getElementById(element);
    div.style.visibility = div.style.visibility == "hidden" ? "visible" : "hidden";
}

/*
Parameters:
	element		|	string, specifies the id of the object to modify
Behavior:
	Manually sets an object visibility state to visible
Output:	
	None
Error Handling:	
	None
*/
function setVis(element) {
	document.getElementById(element).style.visibility = "visible";
}

/*
Parameters:
	element		|	string, specifies the id of the object to modify
Behavior:
	Manually sets an object visibility state to hidden
Output:	
	None
Error Handling:	
	None
*/
function setInvis(element) {
	document.getElementById(element).style.visibility = "hidden";
}

/*
Parameters:
	element		|	string, specifies the id of the object to modify
Behavior:
	Toggles an object display state
	May shift other elements as the visibility state of the element is changed
Output:	
	None
Error Handling:	
	None
*/

function toggleDisplay(element) {
	var div = document.getElementById(element);
    div.style.display = div.style.display == "none" ? "block" : "none";
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
	checkbox	|	string, specifies the id of the checkbox to toggle
	element 	|	string, specifies the id of the button that changes color
Behavior:
	Toggles a hidden checkbox with the id of 'checkbox'
	Toggles the class of the button element to change colors accordingly
		-green = checked
		-grey = unchecked
Output:	
	None
Error Handling:	
	None
*/
function toggleSelected(checkbox, element) {
	document.getElementById(checkbox).checked=!document.getElementById(checkbox).checked;
	var testElement = document.getElementById(element);
	if(document.getElementById(checkbox).checked) {
		testElement.className = "btn btn-success btn-block margin";
	} else {
		testElement.className = "btn btn-outline-secondary btn-block margin";
	}
}

/*
Parameters: 
	None.
Behavior:
	Generates a database call to update the list of professors who have courses available for survey enrollment
	Displays the list of professors in a dropdown
Output:	None.
Exceptions:	None.
*/
function getProfessor() {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		document.getElementById('profdropdown').innerHTML = this.responseText;
    	}
    };
    xmlhttp.open("GET","files/php/getProfessors.php",true); // send request to php and receive what we have in php
    xmlhttp.send();
}

/*
Parameters:
    None
Behavior:
    Utilizes jQuery to assign a listener to the survey form submit button to handle form submission when the button is clicked
Output: 
    boolean: success state
Error Handling: 
    None
*/
$(document).on("submit", '#surveyform', (function(event) {
    event.preventDefault();
    var confirm = info.display;
    if(validateSurvey()) {
        $.ajax({
            type: "POST",
            url: "files/php/createSurvey.php",
            data: $(this).serialize(),
            success: function(data) {
                if(data == 'success'); {
                    if(confirm == '1') {
                        alert("Survey was successfully submitted! =]");
                    }
                }
            },
            error: function(xhr, text, error) {
                if(confirm == '1') {
                    alert('Error submitting the data | ' +error);
                }
            }
        });
    }
}))


/*
Parameters:
    prof_id     |   integer, the id number of the professor
    prof_name   |   string, the name of the professor
Behavior:
    Call to setVis to change the visibility of the professor element when data has been provided (prevents an empty element from being displayed)
    Performs a check to determine if the professor information was modified (class information is invalid if professor has changed)
        -Success: Clears the course information and calls setInvis on the submit button to prevent invalid information from being submitted
        -Failure: No changes are made, and a message is written to the console
    Adds the prof_name and prof_id to the survey meta data JSON object (info)
    Generates a database call to update the list of classes available for the selected professor
Output: None.
Exceptions: None.
*/
function getClasses(prof_id, prof_name) {
    document.getElementById('prof_info').innerHTML = " | "+prof_name;
    if(info.professor_id == prof_id || info.professor_id == "") {
        console.log("select a course by this professor");
    } else {
        //professor changed, update class lists
        setCourse("", "");
        setInvis('login');
    }
    info.professor_id = prof_id;
    info.professor_name = prof_name;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('classdropdown').innerHTML = this.responseText;
        }
    };
    xmlhttp.open("GET","files/php/getClasses.php?prof_id="+prof_id,true); // send request to php and receive what we have in php
    xmlhttp.send();
}

/*
Parameters:
    class_id    |   integer, the id number of the course
    class_name  |   string, the name of the course
Behavior:
    Call to setVis to change the visibility of the class element when data has been provided (prevents an empty element from being displayed)
    Adds the class_name and class_id to the survey meta data JSON object (info)
    Performs a check to determine if all required fields have been filled out (class, professor and student id)
        -Success: Displays the submit button
        -Failure: The submit button remains hidden
Output: None.
Exceptions: None.
*/
function setCourse(class_id, class_name) {
    if(class_name) {
        document.getElementById('class_info').innerHTML = " | "+class_name;
    } else {
        document.getElementById('class_info').innerHTML = class_name;
    }
    info.class_name = class_name;
    info.class_id = class_id;
    if(info.professor_id && info.student_id > 10000000 && info.class_id) {
        setVis('login');
    } else {
        setInvis('login');
    }
}