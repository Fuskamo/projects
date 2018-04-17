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
$email = $_GET['email'];
$fb = $_GET['fb'];
$addr1 = $_GET['addr1'];
$addr2 = $_GET['addr2'];
$city = $_GET['city'];
$state = $_GET['state'];
$zip = $_GET['zip'];

$contact_id = $_GET['contact_id'];
$book_id = $_GET['book'];

//if a variable is an empty string, we need to store it in the database as a NULL value
if (empty($first)) { $first = NULL; }
if (empty($last)) {	$last = NULL; }
if (empty($phone)) { $phone = NULL; }
if (empty($email)) { $email = NULL; }
if (empty($fb)) { $fb = NULL; }

if (empty($addr1)) { $addr1 = NULL; }
if (empty($addr2)) { $addr2 = NULL; }
if (empty($city)) { $city = NULL; }
if (empty($state)) { $state = NULL; }
if (empty($zip)) { $zip = NULL; }


//SQL query to create a new contact
$new_contact = 'INSERT INTO contact (contact_fname, contact_lname, contact_phone, contact_email, contact_facebook, address_line1, address_line2, address_city, address_state, address_zip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
$update_contact = 'UPDATE contact SET contact_fname=?, contact_lname=?, contact_phone=?, contact_email=?, contact_facebook=?, address_line1=?, address_line2=?, address_city=?, address_state=?, address_zip=? WHERE contact_id=?;';
$update_reference = 'INSERT INTO contact_in_book (book_id, contact_id) VALUES (?, ?);';

//If no contact_id then we create a new contact
if (empty($contact_id)) { 
	try {
		 //prepare our statement
		$stmt = $pdo->prepare($new_contact);
		//execute our statement, with these variables in place of ?'s'
		$stmt->execute([$first, $last, $phone, $email, $fb, $addr1, $addr2, $city, $state, $zip]); 
		//get the primary key value of the newly created item
		$insert_id = $pdo->lastInsertId();
		//run the second query
		$stmt = $pdo->prepare($update_reference);
		$stmt->execute([$book_id, $insert_id]);
	} catch (PDOException $e) {
		//catch and print any errors, roll the database back, kill the connection
		echo 'Error: ' . $e->getMessage();
		$pdo->rollback();
		die();
	}
}
//if we have a contact_id then we update instead of insert
else {
	try {
		 //prepare our statement
		$stmt = $pdo->prepare($update_contact);
		//execute our statement, with these variables in place of ?'s'
		$stmt->execute([$first, $last, $phone, $email, $fb, $addr1, $addr2, $city, $state, $zip, $contact_id]); 
	} catch (PDOException $e) {
		//catch and print any errors, roll the database back, kill the connection
		echo 'Error: ' . $e->getMessage();
		$pdo->rollback();
		die();
	}
 }


//close the connections
$pdo = null;
$stmt = null;

?>
