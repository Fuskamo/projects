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
$email = $_GET['email'];
$name = $_GET['lname'];
$login = $_GET['login'];
$password = $_GET['pass'];

//SQL statement to create a new address book
$lookup_professor = 'SELECT professor_login, professor_password FROM professor WHERE professor_email = ?';
$create_professor = 'INSERT INTO professor (professor_login, professor_name, professor_password, professor_email) VALUES (?, ?, ?, ?);';

try {
	$stmt = $pdo->prepare($lookup_professor);
	$stmt->execute([$email]);
	$result = $stmt->fetch();
	if(empty($result)) {
		$stmt = $pdo->prepare($create_professor);
		$stmt->execute([$login, $name, $password, $email]);
		echo 'User account successfully created! Your login id is <b>'.$login.'</b> and your password is <b>'.$password.'</b>!';
	} else {
		echo 'User account already exists! Your login id is <b>'.$result[professor_login].'</b> and your password is <b>'.$result[professor_password].'</b>!';
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