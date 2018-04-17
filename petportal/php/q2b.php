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


$select_pets = "SELECT p.pet_name AS Pet, t.treatment_desc AS Treatment, t.treatment_type, ht.treatment_date AS Date
FROM home_treatment AS ht
JOIN treatment AS t ON ht.treatment_id = t.treatment_id
JOIN pet AS p ON ht.pet_id = p.pet_id
WHERE p.pet_name = ?
UNION
SELECT p.pet_name, t.treatment_desc AS Treatment, t.treatment_type, vv.visit_date AS Date
FROM vet_treatment AS vt
JOIN treatment AS t ON vt.treatment_id = t.treatment_id
JOIN vet_visit AS vv ON vt.visit_id = vv.visit_id
JOIN pet AS p ON vv.pet_id = p.pet_id
WHERE p.pet_name = ?
ORDER BY Date DESC;";

$pet_type = $_GET['q'];

$stmt = $pdo->prepare($select_pets);
$stmt->execute([$pet_type, $pet_type]);
$results = $stmt->fetchAll();

echo '</br>';
echo '<table>
		<tr>
			<th>Pet Name</th>
			<th>Treatment</th>
			<th>Treatment Type</th>
			<th>Date</th>
		</tr>';

foreach ($results as $row) { //get data
	echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
}
echo '</table>';

?>

</head>
</html>