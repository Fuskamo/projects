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


$select_pets = "SELECT p.pet_name, t.type_animal, p.pet_breed, p.pet_gender
FROM pet AS p
JOIN owner AS o ON p.owner_id = o.owner_id
JOIN type AS t ON p.type_id = t.type_id
WHERE o.owner_fname LIKE ?
OR o.owner_lname LIKE ?
ORDER BY pet_name;";

$pet_type = $_GET['q'];

$stmt = $pdo->prepare($select_pets);
$stmt->execute([$pet_type, $pet_type]);
$results = $stmt->fetchAll();

echo '</br>';
echo '<table>
		<tr>
			<th>Pet Name</th>
			<th>Animal Type</th>
			<th>Pet Breed</th>
			<th>Pet Gender</th>
		</tr>';

foreach ($results as $row) { //get data
	echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
}
echo '</table>';


?>

</head>
</html>