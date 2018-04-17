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
$book_id = $_GET['bookID'];

//SQL query to return the name of an address book
$get_title = "SELECT book_name FROM book WHERE book_id = ?;";

//This is where the magic happens:
try {
	//prepare our statement
	$stmt = $pdo->prepare($get_title);
	//execute our statement, with these variables in place of ?'s'
	$stmt->execute([$book_id]);
	$results = $stmt->fetchAll();
} catch (PDOException $e) {
	//catch and print any errors, roll the database back, kill the connection
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}

//return the results (title of address book)
foreach ($results as $row) {
	echo $row[book_name];
}

//close the connections
$pdo = null;
$stmt = null;

?>