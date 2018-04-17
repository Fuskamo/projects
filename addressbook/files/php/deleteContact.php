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
$contact = $_GET['contactID'];

//SQL query to grab the contacts name from the database; used for confirmation purposes
$contact_name = "SELECT CONCAT(contact.contact_fname, ' ', contact.contact_lname) as Name FROM contact WHERE contact_id = ?;";
//SQL query to delete a user from the database
$delete_contact = "DELETE FROM contact WHERE contact_id = ?;";

//this is where the magic happens:
try {
	 //prepare our statement
	$stmt = $pdo->prepare($contact_name);
	//execute our statement, with these variables in place of ?'s'
	$stmt->execute([$contact]);
	$name = $stmt->fetchAll();
	//repeat the process for the second query
	$stmt = $pdo->prepare($delete_contact);
	$stmt->execute([$contact]);
	$results = $stmt->fetchAll();
} catch (PDOException $e) {
	//catch and print any errors, roll the database back, kill the connection
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}

//process and return the results (contact name returned for confirmation)
foreach ($name as $row) {
	echo 'Contact ' . $row[Name] . ' was successfully deleted!';
}

//close the connections
$pdo = null;
$stmt = null;

?>
