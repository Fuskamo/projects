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
$class_id = $_GET['class_id'];

$course_name = 'SELECT class_name FROM class WHERE class_id = ? LIMIT 1;';

//SQL query to retrieve the name of the book
$export_students = 'SELECT student_name, COALESCE(student_nickname, "") AS nick, team_num
FROM class
JOIN survey_has_class USING(class_id)
JOIN student_on_team USING(student_id)
JOIN survey USING(student_id)
JOIN team USING(team_id)
WHERE class_id = ?
ORDER BY team_num ASC;';


//This is where the magic happens:
try {
	//prepare our statement
	$stmt = $pdo->prepare($course_name);
	$stmt->execute([$class_id]);
	$result = $stmt->fetch();

	$file = $result[class_name].".txt";
	$path = "../export/".$result[class_name].".txt";

	$stmt = $pdo->prepare($export_students);
	$stmt->execute([$class_id]);
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
$headers = "COURSE | ".$result[class_name]."\n\nUNSORTED:\n";
fwrite($myfile, $headers);
$i = 0;
foreach ($results as $row) {
	if($row[team_num] > $i) {
		$i = $row[team_num];
		$txt = "\nTEAM ".$i.":\n";
		fwrite($myfile, $txt);
	}
	//if there is a nick name, replace the first name
	$txt = $row[student_name] . "\n";
	fwrite($myfile, $txt);
}
$curDateTime = "\n\nCreated on ".date("m/d/Y")." at ".date("h:ia");
fwrite($myfile, $curDateTime);

fclose($myfile);
echo $file;

//close the connections
$pdo = null;
$stmt = null;

?>