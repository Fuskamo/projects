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


$select_pets = "SELECT t.type_animal, COUNT(p.pet_id) AS counts
FROM type AS t
JOIN pet AS p ON t.type_id = p.type_id
JOIN owner AS o ON o.owner_id = p.owner_id
WHERE o.owner_fname LIKE ?
OR o.owner_lname LIKE ?
GROUP BY type_animal
ORDER BY counts DESC;";

$pet_type = $_GET['q'];

$stmt = $pdo->prepare($select_pets);
$stmt->execute([$pet_type, $pet_type]);
$results = $stmt->fetchAll();

echo 'Q8A: Animals owned by that person:</br>';
echo '<table>
		<tr>
			<th>Animal Type</th>
			<th>Number</th>
		</tr>';

foreach ($results as $row) { //get data
	echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
}
echo '</table>';

?>

</head>
</html>