<?php
 include('dbconnect.php');
// print_r($_GET);
$all_of_tasks = $_GET['all_of_tasks'];

 $average_data_query= "select t.idtask, t.task, count(s.idsubtask) as all_stages,
count(s.enddate_subtask) as  done_stages,
round(count(s.enddate_subtask)/count(s.idsubtask)*100,2) as progress
from taskmanagement.tasks as t left join taskmanagement.subtasks as s on
t.idtask=s.idtask
where t.category=4 AND enddate IS NULL
group by t.idtask;";

if ($all_of_tasks === 'true') {
    $average_data_query= "select t.idtask, t.task, count(s.idsubtask) as all_stages,
count(s.enddate_subtask) as  done_stages,
round(count(s.enddate_subtask)/count(s.idsubtask)*100,2) as progress
from taskmanagement.tasks as t left join taskmanagement.subtasks as s on
t.idtask=s.idtask
where t.category=4
group by t.idtask;";
};
//echo $average_data_query;
$table = mysqli_query($conn, $average_data_query) or die ("error" . mysqli_error($conn));
$export_data = array();
while($row = mysqli_fetch_assoc($table)) {
    $export_data[] = $row;
}

// print_r($export_data);
header('Content-Type: application/json');
$json_data = json_encode($export_data);
echo $json_data;

?>