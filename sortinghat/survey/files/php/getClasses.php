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

$prof_id = $_GET['prof_id'];

//SQL query to return a list of address books with a contact count
$select_classes = "SELECT class_id, class_name
FROM class
LEFT JOIN professor USING(professor_id)
WHERE professor_id = ? AND class_active = '1';";

//this is where the magic happens:
try {
	 //prepare and execute our statement
	$stmt = $pdo->prepare($select_classes);
	$stmt->execute([$prof_id]);
	$results = $stmt->fetchAll();
} catch (PDOException $e) {
	//catch and print any errors, roll the database back, kill the connection
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}	


echo '<button type="button" id="class_dropdown" class="btn btn-block btn-lg btn-outline-success dropdown-toggle" data-toggle="dropdown">Select Course<span class="caret"></span></button>';
echo '<ul class="dropdown-menu">';
foreach ($results as $row) { //get data	
	echo '<li id="class'.$row[class_id].'" class="btn btn-outline-danger btn-block" style="margin: 2px" onclick="setCourse('.$row[class_id].', \''.$row[class_name].'\')">'.$row[class_name].'</li>';
}
echo '</ul>';

//close the connections
$pdo = null;
$stmt = null;

?>
