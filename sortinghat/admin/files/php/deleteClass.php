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

$class_id = $_GET['class_id'];

$delete_link = 'DELETE FROM survey_has_class WHERE class_id = ?;';
$delete_class = 'DELETE FROM class WHERE class_id = ?;';

try {
	$stmt = $pdo->prepare($delete_link);
	$stmt->execute([$class_id]);

	$stmt = $pdo->prepare($delete_class);
	$stmt->execute([$class_id]);

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