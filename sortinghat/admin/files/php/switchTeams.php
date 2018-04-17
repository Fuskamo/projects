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

$old_team = $_GET['old_team'];
$new_team = $_GET['new_team'];
$student_id = $_GET['student_id'];

$switch_team = "UPDATE student_on_team AS sot
SET sot.team_id = (SELECT team_id FROM team WHERE team_name = ?)
WHERE sot.student_id = ?;";

$add_team = "INSERT INTO student_on_team (student_id, team_id) VALUES (?, (SELECT team_id FROM team WHERE team_name = ?))";

try {
	if($old_team == "teamnull") {
		$new_team = 'team0';
		$stmt = $pdo->prepare($add_team);
		$stmt->execute([$student_id, $new_team]);
		echo 'success';
	} else {
		$stmt = $pdo->prepare($switch_team);
		$stmt->execute([$new_team, $student_id]);
		echo 'success';
	}
} catch (PDOException $e) {
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}


//close the connections
$pdo = null;
$stmt = null;

?>
