<?php
include('dbconnect.php');
$idtask = $_POST["idtask"];

$how_many_days_query = " SELECT `begindate`, `deadline`,DATEDIFF(`deadline`, `begindate`) AS duration, DATEDIFF(CURDATE(), `begindate`) AS days_pass,  DATEDIFF(`deadline`,CURDATE()) AS days_left FROM `tasks` WHERE `idtask` = '".$idtask."'";

$how_many_days= mysqli_query($conn, $how_many_days_query) or die ("error" . mysqli_error($conn));

$data_to_export = mysqli_fetch_assoc($how_many_days);

$last_7_and_30_days_query = " SELECT COUNT(*) as done FROM `subtasks` WHERE `idtask`='".$idtask."' AND `enddate_subtask` BETWEEN DATE_SUB(NOW() , INTERVAL 7 DAY) AND NOW()
UNION ALL
SELECT COUNT(*) as done FROM `subtasks` WHERE `idtask`='".$idtask."' AND `enddate_subtask` BETWEEN DATE_SUB(NOW() , INTERVAL 30 DAY) AND NOW()";

$last_7_and_30_days = mysqli_query($conn, $last_7_and_30_days_query) or die ("error" . mysqli_error($conn));
$days= array();
while($row = mysqli_fetch_assoc($last_7_and_30_days)) {
   $days[] = $row;
}
$stages_query = "select count(idsubtask) as all_stages, count(enddate_subtask) as done_stages,  SUM(ISNULL(`enddate_subtask`)) as left_stages from subtasks where `idtask`= '".$idtask."'";
$stages = mysqli_query($conn, $stages_query) or die ("error" . mysqli_error($conn));
$stages = mysqli_fetch_assoc($stages);

$data_to_export['done_for_7_days'] = $days[0]['done'];
$data_to_export['done_for_30_days'] = $days[1]['done'];
$data_to_export += $stages;


header('Content-Type: application/json');
$json = json_encode($data_to_export);
echo $json;

?>

