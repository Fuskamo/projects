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

$team_name = $_GET['team_name'];
$team_num = $_GET['team_num'];

$create_new_team = "INSERT INTO team (team_name)
SELECT * FROM (SELECT ? AS result) AS tmp
WHERE NOT EXISTS (SELECT * FROM team WHERE team_name = ?) LIMIT 1;";

$update_team = "UPDATE team SET team_num = ? WHERE team_name = ?";


try {
	$stmt = $pdo->prepare($create_new_team);
	$stmt->execute([$team_name, $team_name]);

	$stmt = $pdo->prepare($update_team);
	$stmt->execute([$team_num, $team_name]);

	echo 'success';
} catch (PDOException $e) {
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}


//close the connections
$pdo = null;
$stmt = null;

?>
