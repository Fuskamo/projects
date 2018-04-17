//GLOBAL VARIABLES:
var selectedArray = new Array();

//used for obtaining the book_id
var url = document.URL;
var bookID = url.substring(url.lastIndexOf('=')+1);
var bookName = "";

//used to prevent losing unsaved data
var saved = true;

//FANCY FUNCTIONS:
//create new contact book
$("#books").on("click",function(){
	getAddressBooks("book_list");
});

//create new contact book
$("#new").on("click",function(){
	unhide("newBook");
	//window.open("book.html");
});

$(document).ready(function(){
    $(".dropdown-toggle").dropdown();
});

//https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload
window.addEventListener("beforeunload", function (e) {
  	if(saved) { 
  		return null;
  	} else {
  		var confirmationMessage = "Data is not saved!!!!?";
  		e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
	}
});

/*
Initializes the Google Maps API. 
Calls pageName().
Hides the cancel button.
Initializes the function to call when data is not saved.
Sets a listener that triggers when the page regains focus (page refresh kinda)
*/
function start() {
	versionCheck(); //checks the current version of php/mysql
	initialize(); 	//initializes the google map api
	pageName();		//sets the name of the page based on the address book loaded
	hide("cancel"); //hides the cancel button when not needed
	checkBookExists(); //ensures we have a valid book open
	window.onbeforeunload="cancelClick()"; //prevents the page from closing if an add/edit form is open
	window.onblur= function() { //when a window regains focus, it checks that the book has not been deleted
		window.onfocus= function () {
			checkBookExists();
		}
	};
}

function startIndex() {
	hide('runonce');
	window.onblur= function() {
		window.onfocus= function () {
			getAddressBooks('dropdown');
		}
	};
}

function createUser(username) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);
		}
	};
	xmlhttp.open("GET","files/php/createLogin.php?username="+username,true);
	xmlhttp.send();
}
/*
A quick check to see if the address book that is loaded still exists (hasn't been deleted)
If the book has been deleted or doesn't exist, the tab is closed
If the book is still active, the contacts are loaded
*/
function checkBookExists() {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = this.responseText;
			if(response == 0) {
				alert("Book has been deleted!");
				saved = true;
				window.close();
			} else {
				console.log("book is still active");
				contactsInBook();
			}
		}
	};
	xmlhttp.open("GET","files/php/checkBook.php?book_id="+bookID,true);
	xmlhttp.send();
}

/*
Invokes the getVersion.php page
Logs the MySQL and PHP versions to the console
*/
function versionCheck() {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);
		}
	};
	xmlhttp.open("GET","files/php/getVersion.php",true);
	xmlhttp.send();
}

/*
Invokes the contactsInBook.php module. 
The results of the call are then written to the page.
*/
function contactsInBook() {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("contact_area").innerHTML = this.responseText;
		}
	};
	xmlhttp.open("GET","files/php/contactsInBook.php?book="+bookID,true);
	xmlhttp.send();
}

/*
Calls writeAddForm, then hides all buttons execept "add" and finally unhides the "cancel" button.
*/
function addClick() {
	writeAddForm("input_area");
	saved = false;
	var hideme = ["delete", "edit", "import", "export", "searchform"];
	hideButtons(hideme);
	unhide("cancel");
	unhide("input_area");
}
/*
Reads the global variable 'selectedArray' to determine if and which contact has been selected. 
Forwards the parameter to editContact(selected_contact). 
Hides all buttons execpt "edit" and finally unhides the "cancel" button.
*/
function editClick(){
	if(selectedArray.length!=0){
		saved = false;
		unhide("cancel");
		var hideme = ["add", "delete", "import", "export", "searchform"];
		hideButtons(hideme);
		editContact(selectedArray);
	}else {
		swal("Edit Failed", "You did not select a contact to edit!", "warning");
	}
	console.log(selectedArray);
}
/*
Ensures a contact has been selected by reading the global variable 'selectedArray'. 
Prompts the user to confirm or cancel the deletion. 
If deletion is confirmed, deleteContact(selected_contact) is called.
*/
function delClick(){
	var contactID = "#"+selectedArray[0];
	var firstNameID = contactID+"-fname";
	var lastNameID = contactID+"-lname";

	var fname = $(firstNameID).text();
	var lname = $(lastNameID).text();
	
	var titleText = "Are you sure to delete "+ fname + " "+ lname + "?";
	if(selectedArray.length!=0){
		swal({
			title: titleText,
			text: "You won't be able to recover the contact",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
		.then((deleteConfirm)=>{
			if(deleteConfirm){
				deleteContact(selectedArray);
			}else{
				classSwitch(selectedArray[0]);
				selectedArray.shift();
			}
		});	
	}
	else{
		swal("Delete Failed", "You did not select a contact to delete!", "warning");
	}
}
/*
Prompts the user to confirm or cancel the deletion of an address book and all associated contacts. 
If deletion is confirmed, deleteBookConfirmed() is called.
*/
function deleteBook() {
	swal({
		title: "Are you sure to delete this book?",
		text: "All contacts will be lost!!",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	})
	.then((deleteConfirm)=>{
		if(deleteConfirm){
			deleteBookConfirmed();
		}
	});	
}
/*
Generates a database deletion request via deleteBook.php and passing the global variable bookID. 
If deletion is successful, the tab is closed to maintain database integrity. 
*/
function deleteBookConfirmed() {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = this.responseText;
			if(response.charAt(0) == "E") {
				alert("Failed to delete the book: "+response);
			} else {
				window.close();
			}
		}
	};
	xmlhttp.open("GET","files/php/deleteBook.php?book_id="+bookID,true); 
	xmlhttp.send();
}
/*
Retrieves the value of the search term. 
If the search term is not empty, a reset button will appear.
A call to lookupContact.php will be invoked, passing the search term and the global variable bookID as a parameter. 
The results are then written to the page
*/
function searchClick() {
	var search_term = document.getElementById('searchTerm').value;
	if(search_term) {
		unhide("searchReset");
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contact_area").innerHTML = this.responseText;
			}
		};
		xmlhttp.open("GET","files/php/lookupContact.php?lookup="+search_term+"&book="+bookID,true);
		xmlhttp.send();
	} else {
		swal("Search Failed", "You need to specify a search term..?", "warning");
	}
}
/*
Checks the global boolean value 'saved' to see if there is any unsaved data. 
If saved is false, the user is prompted to continue the action, knowing that the data will be lost. 
Upon confirmation, resetPage() is called.
*/
function cancelClick() {
	if(!saved) {
		swal({
			title: "Contact not Saved!",
			text: "Are you sure you want to cancel?",
			icon: "warning",
			buttons: true,
		})
		.then((cancelConfirm)=>{
			if(cancelConfirm){
				resetPage();
			}
		});	
	}
}
/*
Generates a call to exportContacts.php and passed the global variable bookID. 
The php call will open a download dialog where the user can choose where to save the TSV file. 
If the file failed to be exported to TSV, an error will be displayed instead.
*/
function exportClick() {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = this.responseText;
			if(response.charAt(0) == "#") {
				alert("Failed to export the file to TSV! Please don't fail us! =[");
			} else {
				window.location.href = 'files/export/'+this.responseText;
			}
		}
	};
	xmlhttp.open("GET","files/php/exportContacts.php?book="+bookID,true); 
	xmlhttp.send();
}

/*
Takes strings as input: city, state, zip, addr1, addr2, last, first,phone
Generates a call to importTSV.php and passes these variables along with the current bookID
*/
function importTSV(city, state, zip, addr1, addr2, last, first, phone) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = this.responseText;
			if(response.charAt(0) == "#") {
				alert("Failed to import the contact to the database!");
			} else {
				console.log("success! "+response);
			}
		}
	};
	xmlhttp.open("GET","files/php/importTSV.php?fname="+first+"&lname="+last+"&phone="+phone+"&addr1="+addr1+"&addr2="+addr2+"&city="+city+"&state="+state+"&zip="+zip+"&book="+bookID,true);
	xmlhttp.send();
}

/*
Reads the login information from the input form. 
Generates a call to checkLogin.php. 
If the user is authenticated, the lock screen is hidden and the other elements are displayed. 
A call is then made to getAddressBooks().
*/
function authenticate() {
	var username = document.getElementById('login_text').value;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = this.responseText;
			if(response == 0) {
				alert("Authentication Failed!");
			} else {
				console.log("success! user authenticated");
				hide("login_div");
				unhide("runonce");
				getAddressBooks('dropdown');
			}
		}
	};
	xmlhttp.open("GET","files/php/checkLogin.php?auth="+username,true);
	xmlhttp.send();
}
/*
Reads all the contact input fields from the current form. 
Since addContact and EditContact use the same form, this function checks if a contact_id is present and passes all contact information to createContact.php. 
Once a response is received from the server, a call to resetPage() is called.
*/
function createContact() {
	var contact_id = "";
	var fname = document.getElementById('fname').value;
	var lname = document.getElementById('lname').value;
	var phone = document.getElementById('phone').value;
	var email = document.getElementById('email').value;
	var fb = document.getElementById('fb').value;
	var addr1 = document.getElementById('addr1').value;
	var addr2 = document.getElementById('addr2').value;
	var city = document.getElementById('city').value;
	var state = document.getElementById('state').value;
	var zip = document.getElementById('zip').value;

	try {
		contact_id = document.getElementById('contact_id').value;
	} catch(err) {
		console.log("Creating a new contact");
	}
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			resetPage();
		}
	};
	xmlhttp.open("GET","files/php/createContact.php?contact_id="+contact_id+"&fname="+fname+"&lname="+lname+"&phone="+phone+"&email="+email+"&fb="+fb+"&addr1="+addr1+"&addr2="+addr2+"&city="+city+"&state="+state+"&zip="+zip+"&book="+bookID,true);
	xmlhttp.send();
}
/*
Generates a call to editContactForm.php and passes the parameter contact_id. 
The results from the call [a new form will values filled in for stored values] are displayed on the page
*/
function editContact(contact_id) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("input_area").innerHTML = this.responseText;
		}
	};
	xmlhttp.open("GET","files/php/editContactForm.php?contact_id="+contact_id,true);
	xmlhttp.send();
}
/*
Generates a call to deleteContact.php and passes the parameter contact_id. 
The results are displayed in a pop up window
*/
function deleteContact(contact_id) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var text = this.responseText;
			swal("Contact Deleted", text);
			hide(contact_id);
		}
	};
	xmlhttp.open("GET","files/php/deleteContact.php?contactID="+contact_id,true); // send request to php and receive what we have in php
	xmlhttp.send();
}

/*
Toggles a contact between the selected and unselected states
*/
function clearSelected() {
	if(selectedArray.length!=0){
		var selectedID = "#"+selectedArray[0];
		console.log("in contacts book, id " + $(selectedID).attr("class"));
		if($(selectedID).attr("class")==="inactive"){
			$(selectedID).removeClass("inactive").addClass("active");
		}
	}
}
/*
Displays the selected contact's address on the screen above the map
*/
function displayMapTitle(contactID){
	var addressID = "#"+contactID+"-address";
	var fnameID = "#"+contactID+"-fname";
	var lnameID = "#"+contactID+"-lname";
	var name = $(fnameID).text() +" "+$(lnameID).text(); 
	if(($(addressID).text())===""){
		$("#mapTitle").text("No address for "+name); 	
		$("#map").removeClass("show").addClass("hide");
	}else{
		var titleStr = name + "\'s Location:";
		$("#mapTitle").text(titleStr);
		$("#map").removeClass("hide").addClass("show");
		openAddr(contactID);
	}
}
/*
Toggles the visual elements to display the change of selecting and unselected a contact
*/
function classSwitch(id) {
	var selected = "#"+id;
	if($(selected).attr("class") === "inactive"){
		var preSelectedID = "#"+selectedArray[0]; //reset the previous selected display
		$(preSelectedID).removeClass("active").addClass("inactive"); //update the new selected term
		$(selected).removeClass("inactive").addClass("active"); //remove the pre-selected id, add the new id
		if(selectedArray.length!=0){
			selectedArray.shift();
		}
		selectedArray.push(id);
		displayMapTitle(selectedArray[0]);
	}	
	else{
		$(selected).removeClass("active").addClass("inactive");	
		if(selectedArray.includes(id)){
			selectedArray.shift();
		}
	}
}
/*
Conceals the selected element when called
*/
function hide(element) {
	var x = document.getElementById(element);
	x.style.display = "none";
}
/*
Reveals the selected element when called
*/
function unhide(element) {
	var x = document.getElementById(element);
	x.style.display = "inline-block";
}
/*
Conceals an array of elements by calling the hide() function on each array element when called
*/
function hideButtons(array){
	for(var i=0;i<array.length;i++){
		hide(array[i]);
	}
}
/*
Reveals an array of elements by calling the hide() function on each array element when called
*/
function unhideButtons(){
	var buttonIDs = ["add", "edit", "delete", "searchform", "import", "export"];
	for(var i=0;i<buttonIDs.length;i++){
		unhide(buttonIDs[i]);
	}
}
/*
Generates a call to getBookTitle.php to determine the name of the current book. 
The tab name and page title are updated accordingly.
*/
function pageName() {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var result = this.responseText;
			result = result.toUpperCase();
			document.getElementById('page_name').innerHTML = result + " | CONTACTS";
			document.title = "Address Book: " + result;
		}
	};
	xmlhttp.open("GET","files/php/getBookTitle.php?bookID="+bookID,true); 
	xmlhttp.send();
}
/*
Opens the facebook URL parameter in a new tab.
*/
function openFB(url){
	window.open(url, "_blank");
}
/*
Toggles the global variable saved to true. 
Calls unhideButtons(). Hides cancel and searchReset elements. 
Resets the search bar. 
Clears the input_area (default location of contacts being displayed). 
Calls contactsInBook().
*/
function resetPage() {
	saved = true;
	unhideButtons();
	hide("cancel");
	hide("searchReset");
	document.getElementById('searchform').reset();
	document.getElementById('input_area').innerHTML = "";
	contactsInBook();
}

/*
Reads the contact information from the form and verifies that the data entered is valid input. 
If it is invalid, the user is prompted to correct or save the information. 
If saved, continueValidation() is called.

Expressions loaded from templates at https://regexr.com/
https://stackoverflow.com/questions/15723663/using-regex-to-filter-year-of-fixed-length-0-or-4-digit
https://stackoverflow.com/questions/5205652/facebook-profile-url-regular-expression
*/
function validate() {
	var all_fields = ['fname', 'lname', 'phone', 'email', 'fb', 'addr1', 'addr2', 'city', 'state', 'zip'];
	var invalid = [];
	for(i=0; i<all_fields.length; i++) {
		document.getElementById(all_fields[i]).checkValidity();
		if(document.getElementById(all_fields[i]).validity.patternMismatch) {
			invalid.push(all_fields[i]);
		}
	}
	var text = "Invalid input:";
	if(invalid.length > 0) {
		for(j=0; j<invalid.length; j++) {
			text += " ["+invalid[j]+" | "+document.getElementById(invalid[j]).value+"]";
		}
		swal({
			title: text,
			text: "Do you want to submit the form anyway?",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
		.then((deleteConfirm)=>{
			if(deleteConfirm){
				console.log("User chose to store invalid information in the database");
				continueValidation();
			}else{
				return false;
			}
		});	
	} else {
		continueValidation();
	}
}
/*
Verifies that we have at least 1 name (first or last) and one other piece of information. 
If this validation fails, the user must add additional data fields
*/
function continueValidation() {
	var addr_valid = false;
	var all_fields = ['fname', 'lname', 'phone', 'email', 'fb', 'addr1', 'addr2', 'city', 'state', 'zip'];
	//see if any of our address fields have been filled out
	if(document.getElementById(all_fields[5]).value || document.getElementById(all_fields[6]).value || document.getElementById(all_fields[7]).value || document.getElementById(all_fields[8]).value || document.getElementById(all_fields[9]).value) {
		console.log("At least 1 address field has data");
		if(document.getElementById(all_fields[5]).value && document.getElementById(all_fields[7]).value && document.getElementById(all_fields[8]).value && document.getElementById(all_fields[9]).value) {
			console.log("All required address fields have valid data");
			addr_valid = true;
		}
		else {
			console.log("One of our required address fields is empty!");
			alert("If you know the addreses, fill in all required fields: Address Line 1, City, State, Zip");
			return false;
		} 
	}
	else {
		console.log("No address fields have data");
	}
	//we require either a first or last name, plus one more piece of info (phone, email, fb, address)
	if(document.getElementById(all_fields[0]).value || document.getElementById(all_fields[1]).value) {
		console.log("We have at least a first or last name value");
		if(addr_valid || document.getElementById(all_fields[2]).value || document.getElementById(all_fields[3]).value || document.getElementById(all_fields[4]).value) {
			console.log("We have an extra piece of information");
		} else {
			console.log("We are missing extra information");
			alert("You need either a first or last name AND one other piece of information (Phone, Email, Facebook, or Address)");
			return false;
		}
	}
	console.log("Validation Successful. You may proceed.");
	try {
		createContact();
	}
	catch(err) {
		console.log("Expected Error: "+err);
	}
	resetPage();
	saved = true;
	return true;
}
/*
Generates a call to getAddressBooks.php and populates the page with retrieved information
*/
function getAddressBooks(destination) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		document.getElementById(destination).innerHTML = this.responseText;
    	}
    };
    xmlhttp.open("GET","files/php/getAddressBooks.php",true); // send request to php and receive what we have in php
    xmlhttp.send();
}
/*
Reads the book name from the form
Generates a call to createBook.php and passes the book name to the database
When the server responds, getAddressBooks is called with final_destination parameter.
*/
function createBook(destination, final_destination) {
	hide("newBook");
	var book_name = document.getElementById('bookName').value;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById(destination).innerHTML = this.responseText;
			getAddressBooks(final_destination);
		}
	};
	xmlhttp.open("GET","files/php/createBook.php?bookName="+book_name,true);
	xmlhttp.send();
}
/*
Opens an instance of an address book via bookID
*/
function openBook(bookID){
	window.open("book.html?book_id="+bookID, "_blank");
}
/*
Reveals the selected element when called.
Clears the response from the server when creating a new book.
*/
function unhideBook(element) {
	var x = document.getElementById(element);
	x.style.display = "block";
	document.getElementById('results').innerHTML = "";
}
/*
Reads the book name information from the form and verifies that the data entered is valid input. 
If it is valid createBook is called and the form is reset. 
Finally, getAddressBooks is called so the new book can be opened
*/
function validateBook(results, dropdown) {
	console.log("running new book validation:");
	var new_book = document.getElementById('bookName');
	if(new_book.checkValidity() && new_book.value) {
		createBook(results, dropdown);
		document.getElementById("newbookform").reset();
		getAddressBooks('dropdown');
	} else {
		console.log("Not a valid book name");
	}
}
/*
Invokes the built-in file reader function and passes the text to getAsText
*/
function importFile(files){
	if(window.FileReader){
		getAsText(files[0]);
	}else{
		alert("un-readable");
	}
}
/*
Initializes the file reader
*/
function getAsText(fileToRead) {
	var reader = new FileReader();
	reader.readAsText(fileToRead); // Read file into memory as UTF-8 
	reader.onload = loadHandler; // Handle errors load
	reader.onerror = errorHandler;
}
/*
Processes the data as csv
*/
function loadHandler(event) {
	var csv = event.target.result;
	testTSV(csv, "\t");
   // processData(csv);
}

/*
Error handler for file reader. Outputs an error if detected
*/
function errorHandler(evt) {
      if(evt.target.error.name == "NotReadableError") {
          alert("Canno't read file !");
      }
}

/*
Splits a TSV file into individual elements before sending the data to the SQL server
https://gist.github.com/e7d/43ccb811d0b114bb9381
*/
function testTSV(data, separator) {
	var lines = data.split("\n");
	var headers = lines[0].split(separator);
	if(headers.length < 7) {
		alert("Invalid headers. Check your file and try again.")
	} else {
		for (var i = 1, len = lines.length; i < lines.length; i++) {
			var items = lines[i].split(separator);
			if(items.length > 1) {
				importTSV(items[0], items[1], items[2], items[3], items[4], items[5], items[6], items[7]);
			}
		}
		contactsInBook();
	}
}


/*
Function to sort table using header, code from 
https://www.w3schools.com/howto/howto_js_sort_table.asp
arrow codes:
https://stackoverflow.com/questions/17639562/add-sorting-arrows-to-th-like-table-sorter
value n to change the specific column: 
0 - sort by first name
1 - sort by last name
2 - sort by phone number
3 - sor by email
4 - sort by address
5 - sort by zip
6 - sort by facebook col
*/
var cols = ["first-col", "last-col","phone-col","email-col","addr-col","zip-col","face-col"]
function sortTable(n) {
	var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
	table = document.getElementById("contact-table");

	//function to change arrows
	var currentColID = "#"+cols[n];
	if($(currentColID).attr("class")==="headerSortDown"){
		$(currentColID).removeClass("headerSortDown").addClass("headerSortUp");
	}else{
		$(currentColID).removeClass("headerSortUp").addClass("headerSortDown");	  
	}
	switching = true;
	// Set the sorting direction to ascending:
	dir = "asc";
	/* Make a loop that will continue until
	no switching has been done: */
	while (switching) {
		// Start by saying: no switching is done:
		switching = false;
		rows = table.getElementsByTagName("TR");
		/* Loop through all table rows (except the
		first, which contains table headers): */
		for (i = 1; i < (rows.length - 1); i++) {
			// Start by saying there should be no switching:
			shouldSwitch = false;
			/* Get the two elements you want to compare,
			one from current row and one from the next: */
			x = rows[i].getElementsByTagName("TD")[n];
			y = rows[i + 1].getElementsByTagName("TD")[n];
			/* Check if the two rows should switch place,
			based on the direction, asc or desc: */
			if (dir == "asc") {
				if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
					// If so, mark as a switch and break the loop:
					shouldSwitch= true;
					break;
				}
			} else if (dir == "desc") {
				if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
					// If so, mark as a switch and break the loop:
					shouldSwitch= true;
					break;
				}
			}
		}
		if (shouldSwitch) {
			/* If a switch has been marked, make the switch
			and mark that a switch has been done: */
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
			// Each time a switch is done, increase this count by 1:
			switchcount ++;
		} else {
			/* If no switching has been done AND the direction is "asc",
			set the direction to "desc" and run the while loop again. */
			if (switchcount == 0 && dir == "asc") {
				dir = "desc";
				switching = true;
			}
		}
	}
}

if(selectedArray.length===0){
	$("#map").addClass("hide");
}else{
	$("#map").removeClass("hide").addClass("show");
}
