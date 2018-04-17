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


$select_pets = "SELECT table_name FROM information_schema.tables where table_schema='petportal';";

$stmt = $pdo->prepare($select_pets);
$stmt->execute();
$results = $stmt->fetchAll();


echo "Q0A: Select a table to view the contents: ";
$out = "<select id='tableContents' onchange='q0b(this.value)'>";
$out.= "<option value='0'>Select Type</option>";

foreach($results as $row) {
    $out.='<option value="' .$row["table_name"]. '">';
    $out.=$row["table_name"];
    $out.="</option>";
}
$out.="</select>";
echo $out;

?>

</head>
</html>