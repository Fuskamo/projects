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

$student_id = $_GET['student_id'];

$delete_team = 'DELETE FROM student_on_team WHERE student_id = ?;';
$delete_class = 'DELETE FROM survey_has_class WHERE student_id = ?;';
$delete_student = 'DELETE FROM survey WHERE student_id = ?;';

try {
	$stmt = $pdo->prepare($delete_team);
	$stmt->execute([$student_id]);

	$stmt = $pdo->prepare($delete_class);
	$stmt->execute([$student_id]);

	$stmt = $pdo->prepare($delete_student);
	$stmt->execute([$student_id]);
	echo 'success';
} catch (PDOException $e) {
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}

//close the connections
$pdo = null;
$stmt = null;

?>