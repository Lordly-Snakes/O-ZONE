<?php
require 'connect.php';
$conn = new mysqli($host,$username,$password);

if ($conn->error) {
    echo "Подключение невозможно: ".mysqli_connect_error();
}

$res = $conn->query("use $db;");
if(!$res){
    print_r( mysqli_error($conn));
}else{
    $res = $conn->query("
    CREATE TABLE `orders` (
    `ID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `ID_user` int(11) NOT NULL,
    `ID_adress` int(11) NOT NULL,
    `ID_goods` int(11) NOT NULL,
    `count` int(100) NOT NULL)");    
    $res = $conn->query("
    CREATE TABLE `users` (
    `ID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
    `second_name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
    `password` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
    `number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
}
if(!$res){
    print_r(mysqli_error($conn));
}
?>