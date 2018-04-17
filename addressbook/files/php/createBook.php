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
$book_name = $_GET['bookName'];

//SQL statement to create a new address book
$lookup_book = 'SELECT COALESCE(COUNT(*), 0) as count FROM book WHERE book_name = ?;';
$create_book = 'INSERT INTO book (book_name) VALUES (?);';


try {
	$stmt = $pdo->prepare($lookup_book);
	$stmt->execute([$book_name]);
	$results = $stmt->fetchAll();

	foreach($results as $row) {
		if($row[count] == 0) {
			$stmt = $pdo->prepare($create_book);
			$stmt->execute([$book_name]);
			$results = $stmt->fetchAll();
			echo 'Your new book <b>' . $book_name . '</b> was successfully created!';
		} else {
			echo 'A book by <b>' . $book_name . '</b> already exists!';
		}
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