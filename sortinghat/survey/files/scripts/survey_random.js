/*
Global Variables:
	names 	|	array, an array of names to use for random name generation
*/
var names = ['Abbott', 'Acevedo', 'Acosta', 'Adams', 'Adkins', 'Aguilar', 'Aguirre', 'Albert', 'Alexander', 'Alford', 'Allen', 'Allison', 'Alston', 'Alvarado', 'Alvarez', 'Anderson', 'Andrews', 'Anthony', 'Armstrong', 'Arnold', 'Ashley', 'Atkins', 'Atkinson', 'Austin', 'Avery', 'Avila', 'Ayala', 'Ayers', 'Bailey', 'Baird', 'Baker', 'Baldwin', 'Ball', 'Ballard', 'Banks', 'Barber', 'Barker', 'Barlow', 'Barnes', 'Barnett', 'Barr', 'Barrera', 'Barrett', 'Barron', 'Barry', 'Bartlett', 'Barton', 'Bass', 'Bates', 'Battle', 'Bauer', 'Baxter', 'Beach', 'Bean', 'Beard', 'Beasley', 'Beck', 'Becker', 'Bell', 'Bender', 'Benjamin', 'Bennett', 'Benson', 'Bentley', 'Benton', 'Berg', 'Berger', 'Bernard', 'Berry', 'Best', 'Bird', 'Bishop', 'Black', 'Blackburn', 'Blackwell', 'Blair', 'Blake', 'Blanchard', 'Blankenship', 'Blevins', 'Bolton', 'Bond', 'Bonner', 'Booker', 'Boone', 'Booth', 'Bowen', 'Bowers', 'Bowman', 'Boyd', 'Boyer', 'Boyle', 'Bradford', 'Bradley', 'Bradshaw', 'Brady', 'Branch', 'Bray', 'Brennan', 'Brewer', 'Bridges', 'Briggs',  'Bright', 'Britt', 'Brock', 'Brooks', 'Brown', 'Browning', 'Bruce', 'Bryan', 'Bryant', 'Buchanan', 'Buck', 'Buckley', 'Buckner', 'Bullock', 'Burch', 'Burgess', 'Burke', 'Burks', 'Burnett', 'Burns', 'Burris', 'Burt', 'Burton', 'Bush', 'Butler', 'Byers', 'Byrd', 'Cabrera', 'Cain', 'Calderon', 'Caldwell', 'Calhoun', 'Callahan', 'Camacho', 'Cameron', 'Campbell', 'Campos', 'Cannon', 'Cantrell', 'Cantu', 'Cardenas', 'Carey', 'Carlson',  'Carney', 'Carpenter', 'Carr',  'Carrillo', 'Carroll', 'Carson', 'Carter',  'Carver',  'Case',  'Casey',  'Cash',  'Castaneda',  'Castillo',  'Castro',  'Cervantes',  'Chambers',  'Chan',  'Chandler',  'Chaney',  'Chang',  'Chapman',  'Charles',  'Chase',  'Chavez',  'Chen',  'Cherry',  'Christensen',  'Christian',  'Church',  'Clark',  'Clarke',  'Clay',  'Clayton',  'Clements',  'Clemons',  'Cleveland',  'Cline',  'Cobb',  'Cochran',  'Coffey',  'Cohen',  'Cole',  'Coleman',  'Collier',  'Collins',  'Colon',  'Combs',  'Compton',  'Conley',  'Conner',  'Conrad',  'Contreras',  'Conway',  'Cook',  'Cooke',  'Cooley',  'Cooper',  'Copeland',  'Cortez',  'Cote',  'Cotton',  'Cox',  'Craft',  'Craig',  'Crane',  'Crawford',  'Crosby',  'Cross',  'Cruz',  'Cummings',  'Cunningham',  'Curry',  'Curtis',  'Dale',  'Dalton',  'Daniel',  'Daniels',  'Daugherty',  'Davenport',  'David',  'Davidson',  'Davis',  'Dawson',  'Day',  'Dean',  'Decker',  'Dejesus',  'Delacruz',  'Delaney',  'Deleon',  'Delgado',  'Dennis',  'Diaz',  'Dickerson',  'Dickson',  'Dillard',  'Dillon',  'Dixon',  'Dodson',  'Dominguez',  'Donaldson',  'Donovan',  'Dorsey',  'Dotson',  'Douglas',  'Downs',  'Doyle',  'Drake',  'Dudley',  'Duffy',  'Duke',  'Duncan',  'Dunlap',  'Dunn',  'Duran',  'Durham',  'Dyer',  'Eaton',  'Edwards',  'Elliott',  'Ellis',  'Ellison',  'Emerson',  'England',  'English',  'Erickson',  'Espinoza',  'Estes',  'Estrada',  'Evans',  'Everett',  'Ewing',  'Farley',  'Farmer',  'Farrell',  'Faulkner', 'Ferguson',  'Fernandez',  'Ferrell',  'Fields',  'Figueroa',  'Finch',  'Finley',  'Fischer',  'Fisher',  'Fitzgerald',  'Fitzpatrick',  'Fleming',  'Fletcher',  'Flores',  'Flowers',  'Floyd',  'Flynn',  'Foley',  'Forbes',  'Ford',  'Foreman',  'Foster',  'Fowler',  'Fox',  'Francis',  'Franco',  'Frank',  'Franklin',  'Franks',  'Frazier',  'Frederick',  'Freeman',  'French',  'Frost',  'Fry',  'Frye',  'Fuentes',  'Fuller',  'Fulton',  'Gaines',  'Gallagher',  'Gallegos',  'Galloway',  'Gamble',  'Garcia',  'Gardner', 'Garner', 'Garrett', 'Garrison', 'Garza', 'Gates', 'Gay', 'Gentry', 'George', 'Gibbs', 'Gibson', 'Gilbert', 'Giles', 'Gill', 'Gillespie', 'Gilliam', 'Gilmore', 'Glass', 'Glenn', 'Glover', 'Goff', 'Golden', 'Gomez', 'Gonzales', 'Gonzalez', 'Good', 'Goodman', 'Goodwin', 'Gordon', 'Gould', 'Graham', 'Grant', 'Graves', 'Gray', 'Green', 'Greene', 'Greer', 'Gregory', 'Griffin', 'Griffith', 'Grimes', 'Gross', 'Guerra', 'Guerrero', 'Guthrie', 'Gutierrez', 'Guy', 'Guzman', 'Hahn', 'Hale', 'Haley', 'Hall', 'Hamilton', 'Hammond', 'Hampton', 'Hancock', 'Haney', 'Hansen', 'Hanson', 'Hardin', 'Harding', 'Hardy', 'Harmon', 'Harper', 'Harrell', 'Harrington', 'Harris', 'Harrison', 'Hart', 'Hartman', 'Harvey', 'Hatfield', 'Hawkins', 'Hayden', 'Hayes', 'Haynes', 'Hays', 'Head', 'Heath', 'Hebert', 'Henderson', 'Hendricks', 'Hendrix', 'Henry', 'Hensley', 'Henson', 'Herman', 'Hernandez', 'Herrera', 'Herring', 'Hess', 'Hester', 'Hewitt', 'Hickman', 'Hicks', 'Higgins', 'Hill', 'Hines', 'Hinton', 'Hobbs', 'Hodge', 'Hodges', 'Hoffman', 'Hogan', 'Holcomb', 'Holden', 'Holder', 'Holland', 'Holloway', 'Holman', 'Holmes', 'Holt', 'Hood', 'Hooper', 'Hoover', 'Hopkins', 'Hopper', 'Horn', 'Horne', 'Horton', 'House', 'Houston', 'Howard', 'Howe', 'Howell', 'Hubbard', 'Huber', 'Hudson', 'Huff', 'Huffman', 'Hughes', 'Hull', 'Humphrey', 'Hunt', 'Hunter', 'Hurley', 'Hurst', 'Hutchinson', 'Hyde', 'Ingram', 'Irwin', 'Jackson', 'Jacobs', 'Jacobson', 'James', 'Jarvis', 'Jefferson', 'Jenkins', 'Jennings', 'Jensen', 'Jimenez', 'Johns', 'Johnson', 'Johnston', 'Jones', 'Jordan', 'Joseph', 'Joyce', 'Joyner', 'Juarez', 'Justice', 'Kane', 'Kaufman', 'Keith', 'Keller', 'Kelley', 'Kelly', 'Kemp', 'Kennedy', 'Kent', 'Kerr', 'Key', 'Kidd', 'Kim', 'King', 'Kinney', 'Kirby', 'Kirk', 'Kirkland', 'Klein', 'Kline', 'Knapp', 'Knight', 'Knowles', 'Knox', 'Koch', 'Kramer', 'Lamb', 'Lambert', 'Lancaster', 'Landry', 'Lane', 'Lang', 'Langley', 'Lara', 'Larsen', 'Larson', 'Lawrence', 'Lawson', 'Le', 'Leach', 'Leblanc', 'Lee', 'Leon', 'Leonard', 'Lester', 'Levine', 'Levy', 'Lewis', 'Lindsay', 'Lindsey', 'Little', 'Livingston', 'Lloyd', 'Logan', 'Long', 'Lopez', 'Lott', 'Love', 'Lowe', 'Lowery', 'Lucas', 'Luna', 'Lynch', 'Lynn', 'Lyons', 'Macdonald', 'Macias', 'Mack', 'Madden', 'Maddox', 'Maldonado', 'Malone', 'Mann', 'Manning', 'Marks', 'Marquez', 'Marsh', 'Marshall', 'Martin', 'Martinez', 'Mason', 'Massey', 'Mathews', 'Mathis', 'Matthews', 'Maxwell', 'May', 'Mayer', 'Maynard', 'Mayo', 'Mays', 'Mcbride', 'Mccall', 'Mccarthy', 'Mccarty', 'Mcclain', 'Mcclure', 'Mcconnell', 'Mccormick', 'Mccoy', 'Mccray', 'Mccullough', 'Mcdaniel', 'Mcdonald', 'Mcdowell', 'Mcfadden', 'Mcfarland', 'Mcgee', 'Mcgowan', 'Mcguire', 'Mcintosh', 'Mcintyre', 'Mckay', 'Mckee', 'Mckenzie', 'Mckinney', 'Mcknight', 'Mclaughlin', 'Mclean', 'Mcleod', 'Mcmahon', 'Mcmillan', 'Mcneil', 'Mcpherson', 'Meadows', 'Medina', 'Mejia', 'Melendez', 'Melton', 'Mendez', 'Mendoza', 'Mercado', 'Mercer', 'Merrill', 'Merritt', 'Meyer', 'Meyers', 'Michael', 'Middleton', 'Miles', 'Miller', 'Mills', 'Miranda', 'Mitchell', 'Molina', 'Monroe', 'Montgomery', 'Montoya', 'Moody', 'Moon', 'Mooney', 'Moore', 'Morales', 'Moran', 'Moreno', 'Morgan', 'Morin', 'Morris', 'Morrison', 'Morrow', 'Morse', 'Morton', 'Moses', 'Mosley', 'Moss', 'Mueller', 'Mullen', 'Mullins', 'Munoz', 'Murphy', 'Murray', 'Myers', 'Nash', 'Navarro', 'Neal', 'Nelson', 'Newman', 'Newton', 'Nguyen', 'Nichols', 'Nicholson', 'Nielsen', 'Nieves', 'Nixon', 'Noble', 'Noel', 'Nolan', 'Norman', 'Norris', 'Norton', 'Nunez', 'Obrien', 'Ochoa', 'Oconnor', 'Odom', 'Odonnell', 'Oliver', 'Olsen', 'Olson', 'Oneal', 'Oneil', 'Oneill', 'Orr', 'Ortega', 'Ortiz', 'Osborn', 'Osborne', 'Owen', 'Owens', 'Pace', 'Pacheco', 'Padilla', 'Page', 'Palmer', 'Park', 'Parker', 'Parks', 'Parrish', 'Parsons', 'Pate', 'Patel', 'Patrick', 'Patterson', 'Patton', 'Paul', 'Payne', 'Pearson', 'Peck', 'Pena', 'Pennington', 'Perez', 'Perkins', 'Perry', 'Peters', 'Petersen', 'Peterson', 'Petty', 'Phelps', 'Phillips', 'Pickett', 'Pierce', 'Pittman', 'Pitts', 'Pollard', 'Poole', 'Pope', 'Porter', 'Potter', 'Potts', 'Powell', 'Powers', 'Pratt', 'Preston', 'Price', 'Prince', 'Pruitt', 'Puckett', 'Pugh', 'Quinn', 'Ramirez', 'Ramos', 'Ramsey', 'Randall', 'Randolph', 'Rasmussen', 'Ratliff', 'Ray', 'Raymond', 'Reed', 'Reese', 'Reeves', 'Reid', 'Reilly', 'Reyes', 'Reynolds', 'Rhodes', 'Rice', 'Rich', 'Richard', 'Richards', 'Richardson', 'Richmond', 'Riddle', 'Riggs', 'Riley', 'Rios', 'Rivas', 'Rivera', 'Rivers', 'Roach', 'Robbins', 'Roberson', 'Roberts', 'Robertson', 'Robinson', 'Robles', 'Rocha', 'Rodgers', 'Rodriguez', 'Rodriquez', 'Rogers', 'Rojas', 'Rollins', 'Roman', 'Romero', 'Rosa', 'Rosales', 'Rosario', 'Rose', 'Ross', 'Roth', 'Rowe', 'Rowland', 'Roy', 'Ruiz', 'Rush', 'Russell', 'Russo', 'Rutledge', 'Ryan', 'Salas', 'Salazar', 'Salinas', 'Sampson', 'Sanchez', 'Sanders', 'Sandoval', 'Sanford', 'Santana', 'Santiago', 'Santos', 'Sargent', 'Saunders', 'Savage', 'Sawyer', 'Schmidt', 'Schneider', 'Schroeder', 'Schultz', 'Schwartz', 'Scott', 'Sears', 'Sellers', 'Serrano', 'Sexton', 'Shaffer', 'Shannon', 'Sharp', 'Sharpe', 'Shaw', 'Shelton', 'Shepard', 'Shepherd', 'Sheppard', 'Sherman', 'Shields', 'Short', 'Silva', 'Simmons', 'Simon', 'Simpson', 'Sims', 'Singleton', 'Skinner', 'Slater', 'Sloan', 'Small', 'Smith', 'Snider', 'Snow', 'Snyder', 'Solis', 'Solomon', 'Sosa', 'Soto', 'Sparks', 'Spears', 'Spence', 'Spencer', 'Stafford', 'Stanley', 'Stanton', 'Stark', 'Steele', 'Stein', 'Stephens', 'Stephenson', 'Stevens', 'Stevenson', 'Stewart', 'Stokes', 'Stone', 'Stout', 'Strickland', 'Strong', 'Stuart', 'Suarez', 'Sullivan', 'Summers', 'Sutton', 'Swanson', 'Sweeney', 'Sweet', 'Sykes', 'Talley', 'Tanner', 'Tate', 'Taylor', 'Terrell', 'Terry', 'Thomas', 'Thompson', 'Thornton', 'Tillman', 'Todd', 'Torres', 'Townsend', 'Tran', 'Travis', 'Trevino', 'Trujillo', 'Tucker', 'Turner', 'Tyler', 'Tyson', 'Underwood', 'Valdez', 'Valencia', 'Valentine', 'Valenzuela', 'Vance', 'Vang', 'Vargas', 'Vasquez', 'Vaughan', 'Vaughn', 'Vazquez', 'Vega', 'Velasquez', 'Velazquez', 'Velez', 'Villarreal', 'Vincent', 'Vinson', 'Wade', 'Wagner', 'Walker', 'Wall', 'Wallace', 'Waller', 'Walls', 'Walsh', 'Walter', 'Walters', 'Walton', 'Ward', 'Ware', 'Warner', 'Warren', 'Washington', 'Waters', 'Watkins', 'Watson', 'Watts', 'Weaver', 'Webb', 'Weber', 'Webster', 'Weeks', 'Weiss', 'Welch', 'Wells', 'West', 'Wheeler', 'Whitaker', 'White', 'Whitehead', 'Whitfield', 'Whitley', 'Whitney', 'Wiggins', 'Wilcox', 'Wilder', 'Wiley', 'Wilkerson', 'Wilkins', 'Wilkinson', 'William', 'Williams', 'Williamson', 'Willis', 'Wilson', 'Winters', 'Wise', 'Witt', 'Wolf', 'Wolfe', 'Wong', 'Wood', 'Woodard', 'Woods', 'Woodward', 'Wooten', 'Workman', 'Wright', 'Wyatt', 'Wynn', 'Yang', 'Yates', 'York', 'Young', 'Zamora', 'Zimmerman'];

/*
Parameters:
	length 		|	integer, specifies the length of the field to generate
Behavior:
	Randomizes name data based on the length of the names array
Output:	
	None; the data is loaded into the form for submission
Error Handling:	
	Data cannot be invalid when randomly generated
*/
function randomName(length) {
	var text = names[(Math.floor(Math.random() * names.length))];
	if(length > 1) {
		text += " "+ names[(Math.floor(Math.random() * names.length))];
	}
	return text;
}

/*
Parameters:
	length 		|	integer, specifies the length of the field to generate
Behavior:
	Randomizes a string for use in the experience and learning fields
Output:	
	None; the data is loaded into the form for submission
Error Handling:	
	Data cannot be invalid when randomly generated
*/
function randomString(length) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz";
	for(var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

/*
Parameters:
	length 		|	integer, specifies the length of the field to generate
Behavior:
	Randomizes name id based on the possible values
	The number cannot start with a 0 to prevent numbers of incorrect length
Output:	
	None; the data is loaded into the form for submission
Error Handling:	
	Data cannot be invalid when randomly generated
*/
function randomId(length) {
	var possible = "0123456789";
	var first = "123456789";
	var text = first.charAt(Math.floor(Math.random() * first.length));
	for(var i = 0; i < length-1; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

/*
Parameters:
	length 		|	integer, specifies the length of the field to generate
Behavior:
	Randomly chooses a number betweeen 0 and 5 for use with skillset sliders
Output:	
	None; the data is loaded into the form for submission
Error Handling:	
	Data cannot be invalid when randomly generated
*/
function randomNumber(length) {
	var text = "";
	var possible = "012345";
	for(var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

/*
Parameters:
	length 		|	integer, specifies the length of the field to generate
Behavior:
	Randomizes grade data by using the returned index value
Output:	
	None; the data is loaded into the form for submission
Error Handling:	
	Data cannot be invalid when randomly generated
*/
function randomGrade(length) {
	var text = "";
	var possible = "123456789";
	for(var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

/*
Parameters:
	length 		|	integer, specifies the length of the field to generate
Behavior:
	Randomizes the preferred roles by using the returned index
Output:	
	None; the data is loaded into the form for submission
Error Handling:	
	Data cannot be invalid when randomly generated
*/
function randomRole(length) {
	var text = "";
	var possible = "012345678";
	for(var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

/*
Parameters:
	length 		|	integer, specifies the length of the field to generate
Behavior:
	Randomizes class data based on the length of the classes array
Output:	
	None; the data is loaded into the form for submission
Error Handling:	
	Data cannot be invalid when randomly generated
*/
function randomClass() {
	var possible = ["CIS 413", "CIS 425", "CIS 472", "CIS 452", "CIS 451", "CIS 471", "CIS 473", "CIS 435"];
	return possible[(Math.floor(Math.random() * possible.length))];
}

/*
Parameters:
	None
Behavior:
	Utilizes the other randomize functions to create random data for every entry field
Output:	
	None; the data is loaded into the form for submission
Error Handling:	
	Data cannot be invalid when randomly generated
*/
function generateRandomData() {
	document.getElementById('student_name').value = randomName(2);
	document.getElementById('student_nickname').value = randomName(1);
	document.getElementById('c1').value = randomClass();
	var rand_grades = document.getElementsByTagName("select");
	//assigns a value for each previous course
	for (var i=0, max=rand_grades.length; i < max; i++) {
		rand_grades[i].selectedIndex = randomGrade(1);	
	}
	//sets a value for each range slider
	var rand_skill = document.getElementsByClassName("range");
	for (var i=0, max=rand_skill.length; i < max; i++) {
		rand_skill[i].value = randomNumber(1);	
	}
	//clicks a random preferred role button 16 times
	for (var i=0; i<16; i++) {
		document.getElementById('roleButton'+randomRole(1)).click();
	}
	//assigns a string value from 00-99 characters for experience and learning objectives
	document.getElementById('misc0').value = randomString(randomGrade(2));
	document.getElementById('misc1').value = randomString(randomGrade(2));
}

/*
Parameters:
	number 	|	integer, specifies the number of random surveys to generate
Behavior:
	Recursively calls itself after decrementing 'number'
	Prevents the default confirmation text from appearing after a survey has been submitted
	Each call generates random survey data before clicking the submit button
Output:	
	None
Error Handling:	
	Assigns 'number' a value of 40 if a larger number is entered
	Prevents 'number' from going below 0
*/
function randomize(number) {
	if(number > 40) {
		console.log("sorry, 40 is the max");
		number = 40;
	}
	info.display = '0';
	console.log(info);
	generateRandomData();
	document.getElementById('student_id').value = randomId(9);
	document.getElementById('send_survey').click();
	number--;
	if(number > 0) {
		randomize(number);
		console.log("Survey created");
	} else {
		info.display = '1';
	}
}