<?php
 print_r($_POST);
 include('dbconnect.php');
 $idtask = $_POST["idtask"];
 $initial_element = $_POST["initial_element"];
 $final_element = $_POST["final_element"];
 $finish_date = $_POST["finish_date"];

for ($i = $initial_element; $i <= $final_element; $i++) {
$sql = "UPDATE subtasks SET enddate_subtask='".$finish_date."' WHERE idtask='".$idtask."' AND Uwagi='".$i."'";
// echo $sql;
  if(mysqli_query($conn, $sql)) {
    echo '.';

} else {
    echo 'error'. mysqli_error($conn);
}

}
 ?>