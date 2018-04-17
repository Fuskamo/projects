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

$addr = $_GET['contact_id'];

//SQL query to return an address for Google Maps API
$select_addr = 'SELECT CONCAT(address_line1, " ", COALESCE(address_line2, ""), " ", address_city, ", ", address_state, " ", address_zip) AS addr
FROM contact
WHERE contact_id = ?;';

//this is where the magic happens:
try {
	 //prepare and execute our statement
	$stmt = $pdo->prepare($select_addr);
	$stmt->execute([$addr]);
	$results = $stmt->fetchAll();
} catch (PDOException $e) {
	//catch and print any errors, roll the database back, kill the connection
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}

//process and return the results (address book as a drop down menu)
foreach ($results as $row) {
	echo $row[addr];
}

//close the connections
$pdo = null;
$stmt = null;

?>