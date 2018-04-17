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
$search_term = $_GET['lookup'];
$book = $_GET['book'];

//SQL query to look up the requested value in the database. searches first and last search_term columns
$select_info = 'SELECT 
	b.contact_id,
	COALESCE(b.contact_fname, "") AS fname, 
    COALESCE(b.contact_lname, "") AS lname, 
    COALESCE(b.contact_phone, "") AS phone, 
    COALESCE(b.contact_email, "") AS email, 
    COALESCE(b.contact_facebook, "") AS facebook, 
    COALESCE(CONCAT(b.address_line1, " ", CASE WHEN b.address_line2 IS NULL THEN " " ELSE CONCAT(b.address_line2, " ") END, " ", b.address_city, " ", b.address_state, " ", b.address_zip)) AS addr
FROM (SELECT * 
	FROM contact 
    JOIN contact_in_book USING(contact_id) 
    JOIN book USING(book_id) 
    WHERE book_id = ?) AS b
WHERE b.contact_fname LIKE CONCAT("%",?,"%") OR b.contact_lname LIKE CONCAT("%",?,"%");';

try {
	//prepare our statement
	$stmt = $pdo->prepare($select_info);
	//execute our statement, with these variables in place of ?'s'
	$stmt->execute([$book, $search_term, $search_term]);
	$results = $stmt->fetchAll();
} catch (PDOException $e) {
	//catch and print any errors, roll the database back, kill the connection
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}

echo '<table class="table table-responsive" style="width: 100%">';
echo 	'<thead>';
echo 		'<tr>';
echo 			'<th scope="col">First</th>';
echo 			'<th scope="col">Last</th>';
echo 			'<th scope="col">Phone</th>';
echo 			'<th scope="col">Email</th>';
echo 			'<th scope="col">Address</th>';
echo 			'<th scope="col">Facebook</th>';
echo 		'</tr>';
echo 	'</thead>';

echo '<tbody>';

//process and return the data
foreach ($results as $row) { 
	echo '<tr class="inactive" style="vertical-align: middle" id="'.$row[contact_id].'" onclick="classSwitch('.$row[contact_id].')">';
	echo '<td class="inactive" style="vertical-align: middle" id="'.$row[contact_id].'-fname">'.$row[fname].'</td>';
	echo '<td class="inactive" style="vertical-align: middle" id="'.$row[contact_id].'-lname">'.$row[lname].'</td>';
	echo '<td class="inactive" style="vertical-align: middle" >'.$row[phone].'</td>';
	echo '<td class="inactive" style="vertical-align: middle" >';
	if(!empty($row[email])) {
		echo '<img src="files/images/mail.png" style="vertical-align: middle; cursor: pointer" alt="Send an email" width="40" height="40" onclick="window.location.href = \'mailto:' .$row[email]. '\'"/> ';	
	}
	echo $row[email].'</td>';
	echo '<td class="inactive" style="vertical-align: middle" >';
	if(!empty($row[addr])) {
		echo '<img src="files/images/maps.png" style="vertical-align: middle; cursor: pointer"  alt="View on Map" width="40" height="40" onclick="openAddr('.$row[contact_id].')" /> ';
	}
	echo $row[addr].'</td>';
	echo '<td class="inactive" style="vertical-align: middle" >';
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