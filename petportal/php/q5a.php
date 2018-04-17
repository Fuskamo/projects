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

$select_pets = "SELECT p.pet_name, t.type_animal, COUNT(w.weight_amt) AS counts
FROM weight AS w
JOIN pet AS p ON w.pet_id = p.pet_id
JOIN type AS t ON p.type_id = t.type_id
GROUP BY pet_name, type_animal
ORDER BY counts DESC;";

$stmt = $pdo->prepare($select_pets);
$stmt->execute();
$results = $stmt->fetchAll();

echo 'Q5A: Weight records per pet:</br>';
echo '<table>
		<tr>
			<th>Pet Name</th>
			<th>Pet Type</th>
			<th>Records</th>
		</tr>';

foreach ($results as $row) { //get data
	echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
}
echo '</table>';

?>

</head>
</html>