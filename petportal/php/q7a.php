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


$select_pets = "SELECT COUNT(adoption.pet_id) AS count FROM adoption;";

$stmt = $pdo->prepare($select_pets);
$stmt->execute();
$results = $stmt->fetch();

echo 'Pet adoption counter: ' . $results['count'];

?>

</head>
</html>