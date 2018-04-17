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


$select_pets = "SELECT p.pet_name, CONCAT(o.owner_fname, ' ', SUBSTR(o.owner_lname,1,1)) AS Owner, CONCAT(SUBSTR(o.owner_phone,1,3), '-', SUBSTR(o.owner_phone,4,3), '-XXXX') AS Telephone, m.micro_manu, m.micro_number
FROM microchip AS m
JOIN pet AS p ON m.micro_id = p.micro_id
LEFT JOIN owner AS o ON p.owner_id = o.owner_id
WHERE m.micro_number = ?;";

$pet_type = $_GET['q'];

$stmt = $pdo->prepare($select_pets);
$stmt->execute([$pet_type]);
$results = $stmt->fetchAll();

echo '</br>';
echo '<table>
		<tr>
			<th>Pet Name</th>
			<th>Owner</th>
			<th>Phone</th>
			<th>Manufacturer</th>
			<th>Microchip Number</th>
		</tr>';

foreach ($results as $row) { //get data
	echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
}
echo '</table>';

?>

</head>
</html>