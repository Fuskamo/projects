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

$get_stats = 'SELECT ROUND(AVG(avg_lang), 3) AS total_lang_avg, ROUND(STDDEV(avg_lang), 3) AS total_lang_dev, ROUND(AVG(avg_grades), 3) AS total_gpa_avg, ROUND(STDDEV(avg_grades), 3) AS total_gpa_dev, ROUND(AVG(num_roles), 3) AS total_flex_avg, ROUND(STDDEV(num_roles), 3) AS total_flex_dev, ROUND(AVG(len_learn), 3) AS total_learn_avg, ROUND(STDDEV(len_learn), 3) AS total_learn_dev, ROUND(AVG(len_exp), 3) AS total_exp_avg, ROUND(STDDEV(len_exp), 3) AS total_exp_dev, ROUND(AVG(avg_skill), 3) AS total_skill_avg, ROUND(AVG(dev_skill), 3) AS total_skill_dev, class_name, class_active, class_id, COUNT(student_id) AS size
FROM survey
JOIN stats USING(student_id)
LEFT JOIN survey_has_class USING(student_id)
LEFT JOIN class USING(class_id)

WHERE class_id = ?
GROUP BY class_name, class_active, class_id;';

$get_class = 'SELECT class_id, class_name, class_active, COALESCE(COUNT(student_id), 0) AS size
FROM class 
LEFT JOIN survey_has_class USING(class_id)
WHERE class_id = ?
GROUP BY class_id, class_name, class_active;';

try {
	$stmt = $pdo->prepare($get_stats);
	$stmt->execute([$class_id]);
	$results = $stmt->fetchAll();
	if(empty($results)) {
		$stmt = $pdo->prepare($get_class);
		$stmt->execute([$class_id]);
		$results = $stmt->fetchAll();
		echo json_encode($results);
	} else {
		echo json_encode($results);
	}
} catch (PDOException $e) {
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}
//https://stackoverflow.com/questions/5428262/php-pdo-get-the-columns-name-of-a-table
//https://stackoverflow.com/questions/29028167/how-to-display-json-data-in-php

//get data from my sql as JSON format


//close the connections
$pdo = null;
$stmt = null;

?>
