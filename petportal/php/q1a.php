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


$select_pets = "SELECT type_id, type_animal FROM type;";

$stmt = $pdo->prepare($select_pets);
$stmt->execute();
$results = $stmt->fetchAll();

$out = "<select id='petType' onchange='q1b(this.value)'>";
$out.= "<option value='0'>Select Type</option>";

foreach($results as $row) {
    $out.='<option value="' .$row["type_id"]. '">';
    $out.=$row["type_animal"];
    $out.="</option>";
}
$out.="</select>";
echo $out;

?>

</head>
</html>