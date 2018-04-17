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
$pass = $_GET['password'];

//SQL query to look up the requested value in the database. searches first and last name columns
$select_info = 'SELECT professor_name, professor_id FROM professor WHERE professor_login = ? AND professor_password = ?';

try {
	$stmt = $pdo->prepare($select_info);
	$stmt->execute([$login, $pass]);
	$results = $stmt->fetchAll();
	if(empty($results)) {
		echo 'failed';
	}
	foreach($results as $row) {
		echo json_encode($results);
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