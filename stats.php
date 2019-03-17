<?php
include('dbconnect.php');

$max_data_query ="select t.idtask, t.task, DATEDIFF(NOW(), MAX(enddate_subtask)) as period_of_days from ".$db_name.".tasks as t left join ".$db_name.".subtasks as s on t.idtask=s.idtask where t.category=4 AND enddate IS NULL group by t.idtask";

$table = mysqli_query($conn, $max_data_query) or die ("error" . mysqli_error($conn));
$export_data = array();
while($row = mysqli_fetch_assoc($table)) {
    $export_data[] = $row;
}




header('Content-Type: application/json');
$json_data = json_encode($export_data);
echo $json_data;

?>