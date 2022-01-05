<?php
require_once "connect.php";
$res = $conn->query("use $db;");
$res = $conn->query("SELECT * FROM goodstb");
while ($row = $res->fetch_assoc()) {
    // var_dump($row['hoverImg']);
    $e1 = $row['img'];
    $e2 = $row['hoverImg'];
    echo $e1."<br>".$e2."<br>";

}
?>