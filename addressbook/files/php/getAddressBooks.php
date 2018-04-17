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

//SQL query to return a list of address books with a contact count
$select_books = "SELECT b.book_id, CONCAT(b.book_name, ' [', COALESCE(COUNT(cib.book_id), 0), ']') AS bookName
FROM book AS b
LEFT JOIN contact_in_book AS cib ON cib.book_id = b.book_id
GROUP BY b.book_id
ORDER BY bookName;";

//this is where the magic happens:
try {
	 //prepare and execute our statement
	$stmt = $pdo->prepare($select_books);
	$stmt->execute();
	$results = $stmt->fetchAll();
} catch (PDOException $e) {
	//catch and print any errors, roll the database back, kill the connection
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}	


echo '<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Open Address Book<span class="caret"></span></button>';
echo '<ul class="dropdown-menu">';
foreach ($results as $row) { //get data	
	echo '<li><a href="book.html?book_id='.$row[book_id].'", target="_blank">'.$row[bookName].'</a></li>';
}
echo '</ul>';

//close the connections
$pdo = null;
$stmt = null;

?>
