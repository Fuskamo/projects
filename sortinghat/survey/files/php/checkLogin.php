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
$student_id = $_GET['student_id'];
$professor_id = $_GET['professor_id'];
$class_id = $_GET['class_id'];

//SQL query to look up the requested value in the database. searches first and last name columns
$select_info = 'SELECT class_name, professor_name, COALESCE(student_id, NULL) AS student_id
FROM class
JOIN professor USING(professor_id)
LEFT JOIN survey_in_class
WHERE class_id = ? and professor_id = ?;';

try {
	$stmt = $pdo->prepare($select_info);
	$stmt->execute([$class_id, $professor_id]);
	$results = $stmt->fetchAll();
	if(empty($results)) {
		echo 'failed';
	}
	else {
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