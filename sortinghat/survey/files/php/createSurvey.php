<?php

//error handling from PHP manual | http://php.net/manual/en/pdo.connections.php

include('connectionData.txt'); //txt file with connection parameters

//attempt to connect to the database or die() trying
try {
	$dsn = "mysql:host=$server;dbname=$dbname;port=$port";
	$opt = [
	    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
	    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	    PDO::ATTR_EMULATE_PREPARES   => false,
	];
	$pdo = new PDO($dsn, $user, $pass, $opt);
} catch(PDOException $e) {
	echo 'DB Connection Failed: ' . $e->getMessage();
	die();
}

//retrieve variables from $_POST
$student_id = $_POST['student_id'];
$student_name = $_POST['student_name'];
$student_nickname = $_POST['student_nickname'];

//Programming Skills
$skill_java = $_POST['java'];
$skill_cplusplus = $_POST['c++'];
$skill_c = $_POST['c'];
$skill_python = $_POST['python'];
$skill_android = $_POST['android'];
$skill_web = $_POST['web_design'];

//Proficiencies
$prob_solve = $_POST['problem_solving'];
$analytic_think = $_POST['analytic_thinking'];
$innovative = $_POST['innovation'];
$pub_speak = $_POST['public_speaking'];
$plan_org = $_POST['plan_&_organize'];
$big_pic = $_POST['big_picture'];
$powerpoint = $_POST['powerpoint'];
$team_build = $_POST['team_building'];
$details = $_POST['good_with_details'];
$spoken_eng = $_POST['spoken_english'];
$written_eng = $_POST['written_english'];
$tech_writing = $_POST['technical_writing'];
$outgoing_shy = $_POST['shy_vs_outgoing'];

//Misc
$prof_exp = $_POST['prof_exp'];
$exp_learn = $_POST['exp_learn'];

//Arrays of values
$roles = $_POST['roles'];
$grades = $_POST['grades'];
$courses = $_POST['courses'];

$course_num = $_POST['course_num'];

//class and professor values
$class_id = $_POST['class_id'];
$professor_id = $_POST['professor_id'];


#echo "<pre>"; print_r($_POST) ;  echo "</pre>";

//SQL query to create a new contact
$check_survey = "SELECT student_id FROM survey WHERE student_id = ?;";

$create_new_course = "INSERT INTO course (course_name)
SELECT * FROM (SELECT ?) AS tmp
WHERE NOT EXISTS (SELECT * FROM course WHERE course_name = ?) LIMIT 1;";

$create_new_role = "INSERT INTO role (role_name)
SELECT * FROM (SELECT ?) AS tmp
WHERE NOT EXISTS (SELECT * FROM role WHERE role_name = ?) LIMIT 1;";

$new_survey = "INSERT INTO survey (student_id, student_name, student_nickname, skill_java, skill_cplusplus, skill_c, skill_python, skill_android, skill_web, prob_solve, analytic_think, innovative, pub_speak, plan_org, big_pic, powerpoint, team_build, details, spoken_eng, written_eng, tech_writing, outgoing_shy, prof_exp, exp_learn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$update_survey = "UPDATE survey SET student_name = ?, student_nickname = ?, skill_java = ?, skill_cplusplus = ?, skill_c = ?, skill_python = ?, skill_android = ?, skill_web = ?, prob_solve = ?, analytic_think = ?, innovative = ?, pub_speak = ?, plan_org = ?, big_pic = ?, powerpoint = ?, team_build = ?, details = ?, spoken_eng = ?, written_eng = ?, tech_writing = ?, outgoing_shy = ?, prof_exp = ?, exp_learn = ? WHERE student_id = ?;";

$create_roles = "INSERT INTO preferred_role (student_id, role_id) VALUES (?, (SELECT role_id FROM role WHERE role_name = ?))";
$delete_roles = "DELETE FROM preferred_role WHERE student_id = ?";

$create_course = "INSERT INTO enrolled_courses (student_id, course_id) VALUES (?, (SELECT course_id FROM course WHERE course_name = ?))";
$delete_course = "DELETE FROM enrolled_courses WHERE student_id = ?";

$create_stats = "INSERT INTO stats (student_id, avg_grades, avg_skill, avg_lang, dev_lang, dev_skill, num_roles, len_exp, len_learn, outgoing) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
$update_stats = "UPDATE stats SET avg_grades = ?, avg_skill = ?, avg_lang = ?, dev_lang = ?, dev_skill = ?, num_roles =?, len_exp = ?, len_learn = ?, outgoing = ? WHERE student_id = ?;";

$add_to_class = "INSERT INTO survey_has_class (student_id, class_id) VALUES (?, ?);";
$update_class = "UPDATE survey_has_class SET class_id = ? WHERE student_id = ?;";

//Create some global variables
$response = "";
$student_gpa = 0;

$update = false;
try {
	//https://stackoverflow.com/questions/8207488/get-all-variables-sent-with-post
	//https://stackoverflow.com/questions/3164505/mysql-insert-record-if-not-exists-in-table
	//Check if survey exists
	$stmt = $pdo->prepare($check_survey);
	$stmt->execute([$student_id]);
	$results = $stmt->fetchAll();

	//student_id does not exist in the database, create the survey result
	if(empty($results)) {
		$stmt = $pdo->prepare($new_survey);
		$stmt->execute([$student_id, $student_name, $student_nickname, $skill_java, $skill_cplusplus, $skill_c, $skill_python, $skill_android, $skill_web, $prob_solve, $analytic_think, $innovative, $pub_speak, $plan_org, $big_pic, $powerpoint, $team_build, $details, $spoken_eng, $written_eng, $tech_writing, $outgoing_shy, $prof_exp, $exp_learn]); 
		$response .= 'student survey added, ';
	} else {
		$update = true;
		//student_id ALREADY exists in the database, UPDATE the survey result
		$stmt = $pdo->prepare($update_survey);
		$stmt->execute([$student_name, $student_nickname, $skill_java, $skill_cplusplus, $skill_c, $skill_python, $skill_android, $skill_web, $prob_solve, $analytic_think, $innovative, $pub_speak, $plan_org, $big_pic, $powerpoint, $team_build, $details, $spoken_eng, $written_eng, $tech_writing, $outgoing_shy, $prof_exp, $exp_learn, $student_id]); 
		$response .= 'student survey UPDATED, ';
	}

	//Add the survey to the appropriate class
	if($update) {
		$stmt = $pdo->prepare($update_class);
		$stmt->execute([$class_id, $student_id]);
	} else {
		$stmt = $pdo->prepare($add_to_class);
		$stmt->execute([$student_id, $class_id]);	
	}
	

	//STATS INFO:
	$grades = array_filter($grades);
	$avg_grade = round(array_sum($grades)/count($grades), 2);
	$response .= 'student_gpa is '.$avg_grade.', ';

	$prog_array = array($skill_web, $skill_android, $skill_python, $skill_c, $skill_java, $skill_cplusplus);
	$avg_lang = round(array_sum($prog_array) / count($prog_array), 2);
	$dev_lang = round(sd($prog_array), 2);
	$response .= " language avg is ".$avg_lang." and language std dev is ".$dev_lang.", ";

	$skill_array = array($analytic_think, $innovative, $pub_speak, $plan_org, $big_pic, $powerpoint, $team_build, $details, $spoken_eng, $written_eng, $tech_writing);
	$avg_skill = round(array_sum($skill_array) / count($skill_array), 2);
	$dev_skill = round(sd($skill_array), 2);
	$response .= " skill avg is ".$avg_skill." and skill std dev is ".$dev_skill.", ";

	$len_learn = strlen($exp_learn);
	$len_exp = strlen($prof_exp);

	$outgoing = 0;
	if($outgoing_shy > $avg_skill) {
		$outgoing = 1;
		$response .= " this person is outgoing ";
	}

	$num_roles = count($roles);

	//Insert the generated stats into the correct table
	if($update) {
		$stmt = $pdo->prepare($update_stats);
		$stmt->execute([$avg_grade, $avg_skill, $avg_lang, $dev_lang, $dev_skill, $num_roles, $len_exp, $len_learn, $outgoing, $student_id]);
	} else {
		$stmt = $pdo->prepare($create_stats);
		$stmt->execute([$student_id, $avg_grade, $avg_skill, $avg_lang, $dev_lang, $dev_skill, $num_roles, $len_exp, $len_learn, $outgoing]);
	}
	$response .= 'student stats added, ';

	//Create and link any preferred roles
	if(empty($roles)) {
		$response .= "no roles selected, ";
	} else {
		$roles = array_filter($roles);
		$i = count($roles);	
		for($j = 0; $j < $i; $j++) {
			//create the role if it doesn't exist (dynamic instead of static)
			$stmt = $pdo->prepare($create_new_role);
	  		$stmt->execute([$roles[$j], $roles[$j]]);
	  		//add the user to the role
	  		if($update) {
				$stmt = $pdo->prepare($delete_roles);
	  			$stmt->execute([$student_id]);
	  		} 
	  			$stmt = $pdo->prepare($create_roles);
	  			$stmt->execute([$student_id, $roles[$j]]);
		}
		$response .= $i." roles were added, ";
	}

	//Create any currently enrolled courses
	if(empty($courses)) {
		$response .= "no other courses are being taken this term, ";
	} else {
		$i = count($courses);
		for($j = 0; $j < $i; $j++) {
			//create the role if it doesn't exist (dynamic instead of static)
			if(empty($courses[$j])) {
			} else {
				$stmt = $pdo->prepare($create_new_course);
		  		$stmt->execute([$courses[$j], $courses[$j]]);
		  		//add the user to the role
		  		if($update) {
		  			$stmt = $pdo->prepare($delete_course);
		  			$stmt->execute([$student_id]);
		  		}
		  			$stmt = $pdo->prepare($create_course);
		  			$stmt->execute([$student_id, $courses[$j]]);
		  	}
		}
		$response .= $i." concurrent enrolled courses were added, ";
	}
	$response .= " all records successfully created!";
	echo 'success';
} catch (PDOException $e) {
	//catch and print any errors, roll the database back, kill the connection
	echo 'Error: ' . $e->getMessage();
	$pdo->rollback();
	die();
}

#echo $response;
//DO WE NEED A CHECK FOR EXISTING USERS???????

//close the connections
$pdo = null;
$stmt = null;



// Function to calculate square of value - mean
function sd_square($x, $mean) { 
	return pow($x - $mean,2); 
}

// Function to calculate standard deviation (uses sd_square)    
function sd($array) {
    // square root of sum of squares devided by N-1
    return sqrt(array_sum(array_map("sd_square", $array, array_fill(0,count($array), (array_sum($array) / count($array)) ) ) ) / (count($array)-1) );
}


?>
