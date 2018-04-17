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
$class = $_GET['class'];
$prof_id = $_GET['prof_id'];

//SQL statement to create a new address book
$lookup_class = 'SELECT class_id FROM class WHERE class_name = ? AND professor_id = ?;';
$create_class = 'INSERT INTO class (class_name, professor_id, class_active) VALUES (?, ?, "1");';

try {
	$stmt = $pdo->prepare($lookup_class);
	$stmt->execute([$class, $prof_id]);
	$results = $stmt->fetchAll();

	if(empty($results)) {
		$stmt = $pdo->prepare($create_class);
		$stmt->execute([$class, $prof_id]);
		$results = $stmt->fetchAll();
		echo 'Your new class <b>' . $class . '</b> was successfully created!';
	} else {
		echo 'The class <b>' . $class . '</b> already exists!';
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