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

$tableName = $_GET['q'];

switch ($tableName) {
    case adoption:
    	$qData = "SELECT * FROM adoption;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'adoption';";
    	//Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
        break;
    case atypical_treatment:
    	$qData = "SELECT * FROM atypical_treatment;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'atypical_treatment';";
    	//Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
		break;
    case exam:
    	$qData = "SELECT * FROM exam;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'exam';";
    	//Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
        break;
    case home_treatment:
    	$qData = "SELECT * FROM home_treatment;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'home_treatment';";
        //Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
		break;
    case incident:
    	$qData = "SELECT * FROM incident;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'incident';";
        //Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
        break;
    case microchip:
    	$qData = "SELECT * FROM microchip;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'microchip';";
        //Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
        break;
    case owner:
    	$qData = "SELECT owner_id, owner_fname, SUBSTR(owner_lname, 1,1) AS owner_lname, CONCAT(SUBSTR(owner_phone,1,3), '-', SUBSTR(owner_phone,4,3), '-XXXX') AS owner_phone, RIGHT(owner_address, 5) AS owner_address FROM owner;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'owner';";
        //Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
        break;
    case pet:
    	$qData = "SELECT * FROM pet;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'pet';";
        //Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
        break;
    case pet_incident:
    	$qData = "SELECT * FROM pet_incident;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'pet_incident';";
        //Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
        break;
    case practice:
    	$qData = "SELECT * FROM practice;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'practice';";
        //Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
        break;
    case req_treatment:
    	$qData = "SELECT * FROM req_treatment;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'req_treatment';";
        //Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
        break;
    case treatment:
    	$qData = "SELECT * FROM treatment;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'treatment';";
        //Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
        break;
    case type:
    	$qData = "SELECT * FROM type;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'type';";
        //Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
        break;
    case vet:
    	$qData = "SELECT * FROM vet;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'vet';";
        //Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
        break;
    case vet_treatment:
    	$qData = "SELECT * FROM vet_treatment;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'vet_treatment';";
        //Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
        break;
    case vet_visit:
    	$qData = "SELECT * FROM vet_visit;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'vet_visit';";
        //Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
        break;
    case weight:
    	$qData = "SELECT * FROM weight;";
    	$qHead = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'weight';";
        //Header Results
		$stmtHead = $pdo->prepare($qHead);
		$stmtHead->execute();
		$headResults = $stmtHead->fetchAll();
		//Data Results
		$stmtData = $pdo->prepare($qData);
		$stmtData->execute();
		$dataResults = $stmtData->fetchAll();
		//Print Results
		echo '</br><table><tr>';
		foreach ($headResults as $row) { //get headers
			foreach($row as $key => $value) {
				echo '<th>' . $value . '</th>'; 
			}
		}
		echo '</tr>';
		foreach ($dataResults as $row) { //get data
			echo '<tr><td>'.implode($row,'</td><td>')."</td></tr>\n"; 
		}
		echo '</table>';
        break;
    default:
        echo 'Error selecting a table name';
}

?>

</head>
</html>