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


$select_pets = "SELECT o.owner_fname AS Adopter, p.pet_name, p.pet_breed, p.pet_gender, a.adoption_date
FROM adoption AS a
JOIN pet AS p ON a.pet_id = p.pet_id
JOIN owner AS o ON p.owner_id = o.owner_id;";

$pet_type = $_GET['q'];

$stmt = $pdo->prepare($select_pets);
$stmt->execute();
$results = $stmt->fetchAll();

echo '</br>';
echo '<table>
		<tr>
			<th>Adopter</th>
			<th>Pet Name</th>
			<th>Pet Breed</th>
			<th>Pet Gender</th>
			<th>Adoption Date</th>
		</tr>';

foreach ($results as $row) { //get data
	echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
}
echo '</table>';


?>

</head>
</html>