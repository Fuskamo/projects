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

$class_id = $_GET['class'];

$get_all_fields = 'SELECT *
FROM survey
LEFT JOIN stats USING(student_id)
LEFT JOIN student_on_team USING(student_id)
LEFT JOIN team USING(team_id)
LEFT JOIN survey_has_class USING(student_id)
LEFT JOIN class USING(class_id)
WHERE class_id = ?
ORDER BY avg_grades ASC;';


try {
	$stmt = $pdo->prepare($get_all_fields);
	$stmt->execute([$class_id]);
	$results = $stmt->fetchAll();
} catch (PDOException $e) {
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}
//https://stackoverflow.com/questions/5428262/php-pdo-get-the-columns-name-of-a-table
//https://stackoverflow.com/questions/29028167/how-to-display-json-data-in-php

//get data from my sql as JSON format
echo json_encode($results);

//close the connections
$pdo = null;
$stmt = null;

?>
