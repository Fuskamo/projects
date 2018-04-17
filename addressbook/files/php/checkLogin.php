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
$login = $_GET['auth'];

//SQL query to look up the requested value in the database. searches first and last name columns
$select_info = 'SELECT COALESCE(COUNT(login_name), 0) AS count FROM login WHERE login_name = ?';

try {
	$stmt = $pdo->prepare($select_info);
	$stmt->execute([$login]);
	$results = $stmt->fetchAll();
	foreach($results as $row) {
		echo $row[count];
	}
} catch (PDOException $e) {
	//catch and print any errors, roll the database back, kill the connection
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}

//close the connections
$pdo = null;
$stmt = null;

?>