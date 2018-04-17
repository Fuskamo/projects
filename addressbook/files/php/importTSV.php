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
$first = $_GET['fname'];
$last = $_GET['lname'];
$phone = $_GET['phone'];
$addr1 = $_GET['addr1'];
$addr2 = $_GET['addr2'];
$city = $_GET['city'];
$state = $_GET['state'];
$zip = $_GET['zip'];

$book_id = $_GET['book'];

//if a variable is an empty string, we need to store it in the database as a NULL value
if (empty($first)) { $first = NULL; }
if (empty($last)) {	$last = NULL; }
if (empty($phone)) { $phone = NULL; }
if (empty($addr1)) { $addr1 = NULL; }
if (empty($addr2)) { $addr2 = NULL; }
if (empty($city)) { $city = NULL; }
if (empty($state)) { $state = NULL; }
if (empty($zip)) { $zip = NULL; }


//SQL query to create a new contact
$new_contact = 'INSERT INTO contact (address_city, address_state, address_zip, address_line1, address_line2, contact_lname, contact_fname, contact_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
$update_reference = 'INSERT INTO contact_in_book (book_id, contact_id) VALUES (?, ?);';

try {
	$stmt = $pdo->prepare($new_contact);
	$stmt->execute([$city, $state, $zip, $addr1, $addr2, $last, $first, $phone]); 
	//get the primary key value of the newly created item
	$insert_id = $pdo->lastInsertId();
	$stmt = $pdo->prepare($update_reference);
	$stmt->execute([$book_id, $insert_id]);
} catch (PDOException $e) {
	//catch and print any errors, roll the database back, kill the connection
	echo '#Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}

echo 'Contact ' .$last.', '.$first.' was successfully added!';

//close the connections
$pdo = null;
$stmt = null;

?>
