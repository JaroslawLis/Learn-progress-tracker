<?php
    
//     
//    $ctime = mktime(0, 0, 0, date("m")  , date("d"), date("Y"));
//   
//
//$start = strtotime('-30 days', $ctime);
//    $end = strtotime('-0 days', $ctime);
//     
//    $intervals = [1,1] ; // co ile dni przeskakiwać array(2, 5)
//    $intervals_elems = count($intervals);
//    $cstep = 0;
//     
//    $tmp = $start;
//    echo "start: ".date('Y m d',$start) . "</br>\n";
//    do {
//     
//        $tmp = strtotime('+'.$intervals[$cstep%$intervals_elems].' days', $tmp);
//        $cstep++;
//        echo "$cstep: ".date('Y m d', $tmp)."\n";
//     
//    } while ($tmp < $end);
//     
//    echo "koniec: ".date('Y m d', $end)."\n";
   


//$d = array();
//for($i = 0; $i < 30; $i++)
//    array_unshift($d,strtotime('-'. $i .' days'));
//print_r($d);
//
//
// $average_data_query= "select tasks.idtask, tasks.task, count(subtasks.idsubtask) as
// all_stages, count(subtasks.enddate_subtask) as done_stages
// from tasks, subtasks
// where tasks.idtask = subtasks.idtask and tasks.category = 4 
// group by tasks.idtask;";

 include('dbconnect.php');
$var = array();
for($i = 29; $i > 0; $i--) 
{

 $average_data_query= "select t.idtask, t.task,  count(enddate_subtask)   as  done_stages 
from taskmanagement.tasks as t left join taskmanagement.subtasks as s on
t.idtask=s.idtask
where t.category=4 AND s.enddate_subtask < DATE_SUB(NOW() , INTERVAL '".$i."' DAY) 
group by t.idtask;";

$table = mysqli_query($conn, $average_data_query) or die ("error" . mysqli_error($conn));
$export_data = array();
while($row = mysqli_fetch_assoc($table)) {
    $export_data[] = $row;
}
$var[] = $export_data;
    
}
// print_r($export_data);
header('Content-Type: application/json');
$json_data = json_encode($var);
echo $json_data;

?>