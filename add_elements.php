<?php

 include('dbconnect.php');
$idtask = $_POST['idtask'];
$date_task = $_POST['taskbegindate'];
$start_course = $_POST['start_course'];
$end_course = $_POST['end_course'];

for($i = $start_course; $i <= $end_course; $i++) {
  $subtask = "element nr ".$i;
    $sql = "INSERT INTO subtasks (`subtask`, `date_subtask`, `Uwagi`, `idtask` ) VALUES ('".$subtask."','".$date_task."','".$i."','".$idtask."')" ;

   if(mysqli_query($conn, $sql)) {
    echo '.';

} else {
    echo 'error'. mysqli_error($conn);
}

}
mysqli_close($conn);
?>