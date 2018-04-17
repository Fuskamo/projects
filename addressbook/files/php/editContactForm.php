<?php

//error handling from PHP manual | http://php.net/manual/en/pdo.connections.php

include('connectionData.txt'); //txt file with connection parameters

//attempt to connect to the database or die() trying
try {
	$dsn = "mysql:host=$server;dbname=$dbname;port=$port";
	$opt = [
	    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
	    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	    PDO::ATTR_EMULATE_PREPARES   => false,
	];
	$pdo = new PDO($dsn, $user, $pass, $opt);
} catch(PDOException $e) {
	echo 'DB Connection Failed: ' . $e->getMessage();
	die();
}

$contact_id = $_GET['contact_id'];

//SQL query to return a list of address books with a contact count

$get_info = 'SELECT c.contact_id AS contact, COALESCE(c.contact_fname, "") AS first, COALESCE(c.contact_lname, "") AS last, COALESCE(c.contact_phone, "") AS phone, COALESCE(c.contact_email, "") AS email, COALESCE(c.contact_facebook, "") AS fb, COALESCE(c.address_line1, "") AS addr1, COALESCE(c.address_line2, "") AS addr2, COALESCE(c.address_city, "") AS city, COALESCE(c.address_state, "") AS state, COALESCE(c.address_zip, "") AS zip
FROM contact AS c
WHERE c.contact_id = ?;';

//this is where the magic happens:
try {
	 //prepare and execute our statement
	$stmt = $pdo->prepare($get_info);
	$stmt->execute([$contact_id]);
	$results = $stmt->fetchAll();
} catch (PDOException $e) {
	//catch and print any errors, roll the database back, kill the connection
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}

//process and return the results (address book as a drop down menu)
foreach ($results as $row) {
	echo '<form name="editform" id="editform" onsubmit="return false">';
	echo '<label for="fname">First Name</label><input type="text" id="fname" placeholder="First Name" pattern="^([a-zA-Z]{1,25})?" maxlength="25" title="Only letters are allowed" value="'.$row[first].'"/></br>';
	echo '<label for="lname">Last Name</label><input type="text" id="lname" placeholder="Last Name" pattern="^([a-zA-Z-]{1,25})?" maxlength="25" title="Only letters and dashes are allowed" value="'.$row[last].'"/></br>';
	echo '<label for="phone">Phone</label><input type="tel" id="phone" placeholder="Phone" maxlength="14" title="Only enter 10 digits (no brackets or dashes)" value="'.$row[phone].'"/></br>';
	echo '<label for="email">Email</label><input type="email" id="email" placeholder="Email: user@domain.com" maxlength="45" value="'.$row[email].'"/></br>';
	echo '<label for="fb">Facebook</label><input type="url" id="fb" placeholder="facebook link" pattern="((https:\/\/www.facebook.com\/)+[\\w.-]+)?" maxlength="45" title="Please copy the entire facebook.com link" value="'.$row[fb].'"/></br>';
	echo '<label for="addr1">Address Line 1</label><input type="text" id="addr1" placeholder="Address Line 1" pattern="(\\d+\\s([neswNESW\\s.]+)?\\w+\\s[A-z.]+)?" maxlength="45" title="Please input a valid address. Eg: 123 E Main St. or 987 8th Avenue" value="'.$row[addr1].'"/></br>';
	echo '<label for="addr2">Address Line 2</label><input type="text" id="addr2" placeholder="Address Line 2" maxlength="25" title="Please input a valid apartment or suite number" value="'.$row[addr2].'"/></br>';
	echo '<label for="city">City</label><input type="text" id="city" placeholder="City" pattern="[a-zA-Z\\s]{1,44}" maxlength="44" title="Please input a valid city" value="'.$row[city].'"/></br>';
	echo '<label for="state">State</label><input type="text" id="state" placeholder="State" pattern="[A-Z]*" maxlength="25" title="Use 2 digit state codes instead of state names" value="'.$row[state].'"/></br>';
	echo '<label for="zip">Zip</label><input type="text" id="zip" placeholder="Zip" pattern="^\\d{5}(?:[-]\\d{4})?$" maxlength="14" title="Please input a valid zip code: 12345 or 12345-6789" value="'.$row[zip].'"/></br>';
	echo '<input type="text" id="contact_id" style="display: none" value="'.$row[contact].'" />';
	echo '<button class="btn btn-danger formReset" type="button" onclick="reset(this)">Clear Form</button>';
	echo '<button type="submit" class="btn btn-success formSubmit" onclick="validate()">Submit</button>';
}

//close the connections
$pdo = null;
$stmt = null;

?>