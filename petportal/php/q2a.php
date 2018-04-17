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


$select_pets = "SELECT temp.Pet, count(temp.Treatment) AS Records
FROM (SELECT p.pet_name AS Pet, t.treatment_desc AS Treatment, ht.treatment_date AS Date
FROM home_treatment AS ht
JOIN treatment AS t ON ht.treatment_id = t.treatment_id
JOIN pet AS p ON ht.pet_id = p.pet_id
UNION ALL
SELECT p.pet_name, t.treatment_desc AS Treatment, vv.visit_date AS Date
FROM vet_treatment AS vt
JOIN treatment AS t ON vt.treatment_id = t.treatment_id
JOIN vet_visit AS vv ON vt.visit_id = vv.visit_id
JOIN pet AS p ON vv.pet_id = p.pet_id) as temp
GROUP BY temp.Pet
ORDER BY Records DESC;";

$stmt = $pdo->prepare($select_pets);
$stmt->execute();
$results = $stmt->fetchAll();

echo 'Q2A: Record Count:</br>';
echo '<table>
		<tr>
			<th>Pet Name</th>
			<th>Record Count</th>
		</tr>';

foreach ($results as $row) { //get data
	echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
}
echo '</table>';

?>

</head>
</html>