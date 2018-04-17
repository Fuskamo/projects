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
$select_classes = "SELECT c.class_id, c.class_name, c.class_active, COALESCE(COUNT(s.student_id), 0) AS cnt, c.class_name AS className
FROM class AS c
LEFT JOIN survey_has_class AS s USING(class_id)
WHERE c.professor_id = ?
GROUP BY c.class_id, c.class_name, c.class_active
ORDER BY class_active DESC, cnt DESC;";

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


echo '<button class="btn btn-lg btn-outline-secondary btn-block dropdown-toggle header" type="button" data-toggle="dropdown"><span id="display_class">Select Course<span class="caret"></span></span></button>';
echo '<ul class="dropdown-menu">';
echo '<li id="new_course" class="btn btn-outline-primary btn-block" style="margin-top: 5px" data-toggle="modal" data-target="#myModal">new course</li>';
foreach ($results as $row) { //get data	
	if($row[class_active] == 0) {
		echo '<li id="'.$row[class_name].'" class="btn btn-outline-danger btn-block" style="margin-top: 3px" onclick="getStats('.$row[class_id].', this.id)">'.$row[className].'</li>';	
	} else {
		echo '<li id="'.$row[class_name].'" class="btn btn-outline-success btn-block" style="margin-top: 3px" onclick="getStats('.$row[class_id].', this.id)">'.$row[className].'</li>';
	}
	
}
echo '</ul>';

//close the connections
$pdo = null;
$stmt = null;

?>
