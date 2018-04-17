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

//SQL query to retrieve all contacts from a requested address book

$select_contact = 'SELECT version() AS db';

//This is where the magic happens:
try {
	//prepare our statement
	$stmt = $pdo->prepare($select_contact);
	//execute our statement, with these variables in place of ?'s'
	$stmt->execute();
	//retrieve the results
	$results = $stmt->fetchAll();
} catch (PDOException $e) {
	//catch and print any errors, roll the database back, kill the connection
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}

$version;
foreach($results as $row) {
	$version = $row[db];
}

echo 'MySQL Version: '.$version.' ';
echo 'PHP Version: '.PHP_VERSION;

//close the connections
$pdo = null;
$stmt = null;

?>