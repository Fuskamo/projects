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


$select_pets = "SELECT p.pet_name, w.weight_date, CONCAT(FORMAT(w.weight_amt, 2), ' ', 
	(CASE WHEN t.type_id = 1 THEN 'pounds' WHEN t.type_id = 2 THEN 'pounds' WHEN t.type_id = 5 THEN 'pounds' ELSE 'grams' END)) AS amt
FROM weight AS w
JOIN pet AS p USING(pet_id)
JOIN type AS t USING(type_id)
WHERE pet_name = ?
ORDER BY weight_date DESC;";

$pet_type = $_GET['q'];

$stmt = $pdo->prepare($select_pets);
$stmt->execute([$pet_type]);
$results = $stmt->fetchAll();

echo '</br>';
echo '<table>
		<tr>
			<th>Pet</th>
			<th>Weight Date</th>
			<th>Weight Amount</th>
		</tr>';

foreach ($results as $row) { //get data
	echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
}
echo '</table>';

?>

</head>
</html>