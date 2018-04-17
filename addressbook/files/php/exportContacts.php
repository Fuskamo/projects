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
$book_id = $_GET['book'];

//SQL query to retrieve the name of the book
$book_name = 'SELECT book_name FROM book WHERE book_id = ?;';

//SQL query to retrieve all contact information from a requested address book
$export_contacts = 'SELECT * FROM contact 
JOIN contact_in_book AS cib USING(contact_id)
JOIN book USING(book_id)
WHERE book_id = ?';

//This is where the magic happens:
try {
	//prepare our statement
	$stmt = $pdo->prepare($book_name);
	$stmt->execute([$book_id]);
	$results = $stmt->fetchAll();

	foreach ($results as $row) {
		$file = $row[book_name].".tsv";
		$path = "../export/".$row[book_name].".tsv";
	}

	$stmt = $pdo->prepare($export_contacts);
	$stmt->execute([$book_id]);
	$results = $stmt->fetchAll();
} catch (PDOException $e) {
	//catch and print any errors, roll the database back, kill the connection
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}

//dump the file to txt
if(!file_exists($path)) {
	if(!file_exists('../export')) {
		mkdir('../export', 0777, true);
	}
	touch($path);
	chmod($path, 0777);
}

$myfile = fopen($path, "w") or die("#Unable to open file!");
$headers = "CITY\tSTATE\tZIP\tDelivery\tSecond\tLastName\tFirstName\tPhone\n";
fwrite($myfile, $headers);
foreach ($results as $row) {
	$txt = $row[address_city] . "\t" . $row[address_state] . "\t" . $row[address_zip] . "\t" . $row[address_line1] . "\t" . $row[address_line2] . "\t" . $row[contact_lname] . "\t" . $row[contact_fname] . "\t" . $row[contact_phone] . "\n";
fwrite($myfile, $txt);
}
fclose($myfile);

echo $file;

//close the connections
$pdo = null;
$stmt = null;

?>