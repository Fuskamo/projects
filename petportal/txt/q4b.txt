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


$select_pets = "SELECT t.treatment_desc AS Treatment, (CASE WHEN t.treatment_type LIKE '%flea%' THEN 'flea' WHEN t.treatment_type = 'vaccine' THEN 'vaccine' ELSE 'misc' END) AS Type, treat_done.Due
FROM (SELECT p.pet_id, t.treatment_id, MAX(DATE_ADD(ht.treatment_date, INTERVAL t.treatment_freq DAY)) AS Due
	FROM home_treatment AS ht
	JOIN pet AS p ON ht.pet_id = p.pet_id
	JOIN treatment AS t ON ht.treatment_id = t.treatment_id
	GROUP BY treatment_id, pet_id
    UNION 
    SELECT p.pet_id, t.treatment_id, MAX(DATE_ADD(vv.visit_date, INTERVAL t.treatment_freq DAY)) AS Due
    FROM vet_treatment AS vt
    JOIN vet_visit AS vv ON vt.visit_id = vv.visit_id
    JOIN pet AS p ON vv.pet_id = p.pet_id
    JOIN treatment AS t ON vt.treatment_id = t.treatment_id
    GROUP BY treatment_id, pet_id) AS treat_done
JOIN pet AS p ON p.pet_id = treat_done.pet_id
JOIN treatment AS t USING(treatment_id)
WHERE pet_name = ?
GROUP BY Type, Treatment, Due
HAVING Type = 'flea' OR Type = 'vaccine'
ORDER BY Due ASC";

$pet_type = $_GET['q'];

$stmt = $pdo->prepare($select_pets);
$stmt->execute([$pet_type]);
$results = $stmt->fetchAll();

echo '</br>';
echo '<table>
		<tr>
			<th>Treatment</th>
			<th>Treatment Type</th>
			<th>Treatment Due</th>
		</tr>';

foreach ($results as $row) { //get data
	echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
}
echo '</table>';

?>

</head>
</html>