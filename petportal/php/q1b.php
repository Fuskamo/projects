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


$select_pets = "SELECT pet_name, pet_breed, pet_color, pet_gender FROM pet JOIN type USING(type_id) WHERE type_id = ?;";

$pet_type = $_GET['q'];

$stmt = $pdo->prepare($select_pets);
$stmt->execute([$pet_type]);
$results = $stmt->fetchAll();

echo '</br>';
echo '<table>
		<tr>
			<th>Name</th>
			<th>Breed</th>
			<th>Color</th>
			<th>Gender</th>
		</tr>';

foreach ($results as $row) { //get data
	echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
}
echo '</table>';

?>

</head>
</html>