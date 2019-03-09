<?php
include('dbconnect.php');
$all_of_tasks = $_GET['all_of_tasks'];
$days = 0;
$first_query = '';
//[PL] ustalam liczbę dni animacji (od najstarszej daty kursu do dziś, warunek czy dla wszystkich kursów , czy też tylko dla nieukończonych)
if ($all_of_tasks == 'true') {
    $first_query = 'SELECT DATEDIFF(CURDATE(), min(`begindate`)) AS days FROM `tasks` WHERE `category` = 4';
} else if ($all_of_tasks == 'false') {
 $first_query = 'SELECT DATEDIFF(CURDATE(), min(`begindate`)) AS days FROM `tasks` WHERE `category` = 4 AND `enddate` IS NULL';
}
$days_ =  mysqli_query($conn, $first_query) or die ("error" . mysqli_error($conn));
$days_ = mysqli_fetch_assoc($days_);
$days = (int)$days_['days'];

$done_stages_query=" select tasks.idtask, tasks.task, count(subtasks.idsubtask) as all_stages from tasks, subtasks where tasks.idtask = subtasks.idtask and tasks.category = 4 group by tasks.idtask";
$main_table = mysqli_query($conn, $done_stages_query) or die ("error" . mysqli_error($conn));
$all_stages_table = array();
while($row = mysqli_fetch_assoc($main_table)) {

    $all_stages_table[$row['idtask']] = $row['all_stages'];
}

$var = array();
for($i = $days; $i >= 0; $i--)
{

 $average_data_query= "select t.idtask, t.task,  count(enddate_subtask)   as  done_stages
from taskmanagement.tasks as t left join taskmanagement.subtasks as s on
t.idtask=s.idtask
where t.category=4 AND s.enddate_subtask < DATE_SUB(NOW() , INTERVAL '".$i."' DAY)
group by t.idtask;";

$table = mysqli_query($conn, $average_data_query) or die ("error" . mysqli_error($conn));
$export_data = array();
while($row = mysqli_fetch_assoc($table)) {


    $row['all_stages'] = $all_stages_table[$row['idtask']];

    $export_data[] = $row;
}

$var['days'] = $days; // how many days is animation
$var[] = $export_data;

}



header('Content-Type: application/json');
$json_data = json_encode($var);
echo $json_data;

?>

