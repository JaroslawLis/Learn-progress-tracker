<?php
$db_host = 'localhost'; // Server Name
$db_user = 'root'; // Username
$db_pass = ''; // Password
$db_name = 'taskmanagement'; // Database Name

$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
  mysqli_query($conn, "SET CHARSET utf8");
    mysqli_query($conn, "SET NAMES 'utf8' COLLATE 'utf8_polish_ci'");    
if (!$conn) {
	die ('Failed to connect to MySQL: ' . mysqli_connect_error());	
};
function validiationDataToMslq($data) {

  return ($data == '' ? 'NULL' :  "'".$data."'");
};


?>