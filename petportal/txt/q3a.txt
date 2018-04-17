<!DOCTYPE html>
<html>
<head>

<?php
include('connectionData.txt');

$dsn = "mysql:host=$server;dbname=$dbname;port=$port";
$opt = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
$pdo = new PDO($dsn, $user, $pass, $opt);


$select_pets = "SELECT t.treatment_desc, j.treatment_type, i.Date
FROM (SELECT p.pet_id, t.treatment_id, t.treatment_type
	FROM req_treatment AS r 
	JOIN treatment AS t ON r.treatment_id = t.treatment_id
	JOIN type ON r.type_id = type.type_id
	JOIN pet AS p ON type.type_id = p.type_id
    UNION
    SELECT p.pet_id, t.treatment_id, t.treatment_type
    FROM atypical_treatment AS a
    JOIN pet AS p ON a.pet_id = p.pet_id
    JOIN treatment AS t ON a.treatment_id = t.treatment_id) AS j
JOIN (SELECT p.pet_id, t.treatment_id, t.treatment_type, ht.treatment_date AS Date
	FROM home_treatment AS ht
	JOIN treatment AS t ON ht.treatment_id = t.treatment_id
	JOIN pet AS p ON ht.pet_id = p.pet_id
	UNION
	SELECT p.pet_id, t.treatment_id, t.treatment_type, vv.visit_date AS Date
	FROM vet_treatment AS vt
	JOIN treatment AS t ON vt.treatment_id = t.treatment_id
	JOIN vet_visit AS vv ON vt.visit_id = vv.visit_id
	JOIN pet AS p ON vv.pet_id = p.pet_id) AS i
ON i.treatment_id = j.treatment_id
AND i.pet_id = j.pet_id
JOIN treatment AS t ON j.treatment_id = t.treatment_id
JOIN pet AS p ON j.pet_id = p.pet_id
WHERE p.pet_name = ?;";

$pet_type = $_GET['q'];

$stmt = $pdo->prepare($select_pets);
$stmt->execute([$pet_type]);
$results = $stmt->fetchAll();

echo 'Q3A: Required treatments already received:</br>';
echo '<table>
		<tr>
			<th>Treatment</th>
			<th>Treatment Type</th>
			<th>Date Applied</th>
		</tr>';

foreach ($results as $row) { //get data
	echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
}
echo '</table>';

?>

</head>
</html>