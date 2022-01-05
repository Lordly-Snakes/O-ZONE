<?php
session_start();
$host ="localhost";
$username ="root";//
$password="";//
$db_name="ozonedb3";//
$conn = new mysqli($host,$username,$password);

if ($conn->error) {
    echo "Подключение невозможно: ".mysqli_connect_error();
}
    // print_r($conn);
$db =$db_name;
?>