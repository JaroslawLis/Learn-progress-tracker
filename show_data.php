<?php
include('dbconnect.php');

$all_of_tasks = $_GET['all_of_tasks'];
$sql = "select * from tasks where category=4 AND enddate IS NULL";

if ($all_of_tasks == 'true') {
    $sql = "select * from tasks where category=4";
}

$sql_not_done = "select * from tasks where category=4 AND enddate IS NULL";
$result = mysqli_query($conn, $sql) or die ("error" . mysqli_error($conn));

$myTasks = array();
while($row = mysqli_fetch_assoc($result)) {
    if ($row['begindate'] == '0000-00-00' || $row['begindate'] == '')  {
        $row['begindate'] = '';
    } else {
    $date = new DateTime($row['begindate']);
    $row['begindate'] = $date->format('d-m-Y');
    }
    if ($row['deadline'] == '0000-00-00'  || $row['begindate'] == '') {
        $row['deadline'] = '';
    } else {
    $date = new DateTime($row['deadline']);
      $row['deadline'] = $date->format('d-m-Y');
    }
    $myTasks[] = $row;
}
mysqli_close($conn);
header('Content-Type: application/json');
$json = json_encode($myTasks);
echo $json;
?>