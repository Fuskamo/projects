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

//retrieve variables from $_GET
$book_id = $_GET['book'];

//SQL query to retrieve all contacts from a requested address book
#CONCAT("(", SUBSTR(COALESCE(c.contact_phone,1,3), ""), ") ", SUBSTR(COALESCE(c.contact_phone,4,3), ""), "-", SUBSTR(c.contact_phone,7,4))
$select_contact = 'SELECT c.contact_id, 
	COALESCE(c.contact_fname, "") AS fname, 
	COALESCE(c.contact_lname, "") AS lname, 
	COALESCE(c.contact_phone, "") AS phone, 
	COALESCE(c.contact_email, "") AS email, 
	COALESCE(c.contact_facebook, "") AS facebook,
	COALESCE(CONCAT(c.address_line1, " ", CASE WHEN c.address_line2 IS NULL THEN " " ELSE COALESCE(c.address_line2, " ") END)) AS addr1, 
	COALESCE(CONCAT(c.address_city, " ", c.address_state, " ", c.address_zip), "") AS addr2,
	COALESCE(c.address_zip, "") AS zip
FROM contact AS c
JOIN contact_in_book AS cib ON c.contact_id = cib.contact_id
JOIN book AS b ON cib.book_id = b.book_id
WHERE b.book_id = ?
ORDER BY lname, fname, phone, facebook, contact_id ASC;';

//This is where the magic happens:
try {
	//prepare our statement
	$stmt = $pdo->prepare($select_contact);
	//execute our statement, with these variables in place of ?'s'
	$stmt->execute([$book_id]);
	//retrieve the results
	$results = $stmt->fetchAll();
} catch (PDOException $e) {
	//catch and print any errors, roll the database back, kill the connection
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}
 
echo '<table id="contact-table" class="table table-responsive" style="width: 100%">';
echo 	'<thead>';
echo 		'<tr>';
echo 			'<th scope="col" onclick="sortTable(0)" class="headerSortDown" id="first-col">First Name</th>';
echo 			'<th scope="col" onclick="sortTable(1)" class="headerSortUp" id="last-col">Last Name</th>';
echo 			'<th scope="col" onclick="sortTable(2)" class="headerSortUp" id="phone-col">Phone</th>';
echo 			'<th scope="col" onclick="sortTable(3)" class="headerSortUp" id="email-col" ">Email</th>';
echo 			'<th scope="col" onclick="sortTable(4)" class="headerSortUp" id="addr-col">Address</th>';
echo 			'<th scope="col" onclick="sortTable(5)" class="headerSortUp" id="zip-col">Zip</th>';
echo 			'<th scope="col" onclick="sortTable(6)" class="headerSortUp" id="face-col">Facebook</th>';
echo 		'</tr>';
echo 	'</thead>';

echo '<tbody>';

//process and return the data
foreach ($results as $row) { 
	echo '<tr class="inactive" style="vertical-align: middle" id="'.$row[contact_id].'" onclick="classSwitch('.$row[contact_id].')">';
	echo '<td class="inactive" style="vertical-align: middle" id="'.$row[contact_id].'-fname">'.$row[fname].'</td>';
	echo '<td class="inactive" style="vertical-align: middle" id="'.$row[contact_id].'-lname">'.$row[lname].'</td>';
	echo '<td class="inactive" style="vertical-align: middle" id="'.$row[contact_id].'-phone">'.$row[phone].'</td>';
	echo '<td class="inactive" style="vertical-align: middle" id="'.$row[contact_id].'-email">';
	if(!empty($row[email])) {
		echo '<img src="files/images/mail.png" style="vertical-align: middle; cursor: pointer" alt="Send an email" width="40" height="40" onclick="window.location.href = \'mailto:' .$row[email]. '\'"/> ';	
	}
	echo $row[email].'</td>';
	echo '<td class="inactive" style="vertical-align: middle" id="'.$row[contact_id].'-address">';
	if(!empty($row[addr1])) {
		echo '<div><img src="files/images/maps.png" style="vertical-align: middle; cursor: pointer"  alt="View on Map" width="40" height="40" onclick="openAddr('.$row[contact_id].')" id="'.$row[contact_id].'-map"/> ';
	}
	echo '<div style="float: right; width: 80%">'.$row[addr1].'</br>'.$row[addr2].'</div></div></td>';
	echo '<td class="inactive" style="vertical-align: middle" id="'.$row[contact_id].'-zip">'.$row[zip].'</td>';
	echo '<td class="inactive" style="vertical-align: middle" id="'.$row[contact_id].'-facebook">';
	if(!empty($row[facebook])) {
		echo '<img src="files/images/facebook.png" style="vertical-align: middle; cursor: pointer"  alt="View FaceBook Profile" width="34" height="34" onclick="openFB(\''.$row[facebook].'\')"  />';
	} 
	echo '</td>';
	echo '</tr>';
}

echo '	</tbody>';
echo '</table>';


//close the connections
$pdo = null;
$stmt = null;

?>