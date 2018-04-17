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
$book_id = $_GET['book_id'];

//SQL query to delete a user from the database
$delete_book = 'DELETE FROM book WHERE book_id = ?;';

$delete_contacts = 'DELETE c FROM contact AS c
LEFT JOIN contact_in_book USING(contact_id)
LEFT JOIN book USING(book_id)
WHERE book_id IS NULL;';

//this is where the magic happens:
try {
	$stmt = $pdo->prepare($delete_book);
	$stmt->execute([$book_id]);
	$stmt = $pdo->prepare($delete_contacts);
	$stmt->execute([$book_id]);
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
