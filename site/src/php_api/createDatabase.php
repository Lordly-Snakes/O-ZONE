<?php
require 'connect.php';

$conn = new mysqli($host,$username,$password);

if ($conn->error) {
    echo "Подключение невозможно: ".mysqli_connect_error();
}
// создание бд и таблиц
if(isset($_GET['type']) && $_GET['type']=='createdb'){
    $queryArr[] = "create database $db";
    $queryArr[] = "use $db;";
    $queryArr[] = "
    CREATE TABLE `categorytb` (
    `ID` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name_category` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $queryArr[] = "
    CREATE TABLE `goodstb` (
    `ID` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `title` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Нет названия',
    `price` float NOT NULL DEFAULT 0,
    `is_sale` tinyint(1) NOT NULL,
    `img` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Нет изображения',
    `hoverImg` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Нет изображения',
    `category_ID` int(11) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $queryArr[] = "
    CREATE TABLE `orders` (
    `ID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `ID_user` int(11) NOT NULL,
    `ID_adress` int(11) NOT NULL,
    `ID_detail` int(11) NOT NULL)";
    $queryArr[] = "
    CREATE TABLE `detailsOrder` (
    `ID` int(11) NOT NULL,
    `ID_goods` int(11) NOT NULL,
    `count` int(100) NOT NULL)";
    $queryArr[] = "
    CREATE TABLE `users` (
    `ID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
    `second_name` varchar(500) COLLATE utf8mb4_unicode_ci,
    `password` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
    `number` varchar(20) COLLATE utf8mb4_unicode_ci,
    `email` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $queryArr[] = "
    CREATE TABLE `adresses` (
    `ID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `ID_user` int(11) NOT NULL,
    `adress` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $totalPercent =100;
    $onePercent = 100/count($queryArr);
    $progress=0;
    // echo"<pre>";
    for($i=0;$i<count($queryArr);$i++){
        $res = $conn->query($queryArr[$i]);
        if(!$res){
            print_r( mysqli_error($conn));
            break;
        }else{
            $progress +=$onePercent;
        }
    
    }
    echo "Complete ";
    echo " ".$progress;
}else if($_GET['type']=='addCategory'){
    $res = $conn->query("use $db;");
    if(!$res){
        print_r( mysqli_error($conn));
        
        
    }
    $data = $_POST['data'];
    for($i=0;$i<count($data);$i++){
        $data[$i] =htmlspecialchars( $data[$i]);
        $res = $conn->query("INSERT INTO `categorytb` (`name_category`) VALUES ('".$data[$i]."')");
        if(!$res){
            print_r( mysqli_error($conn));
            
        }else{
            echo "category ".$i." ".$data[$i]." added \n";
        }
    }
}
else if($_GET['type']=='addGoods'){
    $res = $conn->query("use $db;");
    if(!$res){
        print_r( mysqli_error($conn));
    }
    $data =json_decode( $_POST['data']);
    $arr = array();
    $res = $conn->query("SELECT * FROM categorytb");
    if(!$res){
        print_r( mysqli_error($conn));
    }else{
        while ($row = $res->fetch_assoc()) {
            $arr[$row['ID']] = $row['name_category'];
        }
        for ($i=0; $i < count($data); $i++) { 
            $good = $data[$i];
            $sale =0;
            if($good->sale && $good->sale !=""){
                $sale =1;
            }
            $key = array_search($good->category,$arr);
            $img = namingImg($good->img);
            $hoverImg = namingImg($good->hoverImg);
            $res = $conn->query("INSERT INTO `goodstb` 
            (`title`, `price`, `is_sale`, `img`, `hoverImg`, `category_ID`) 
            VALUES ('".$good->title."', '".$good->price."', '".$sale."', '".$img."','".$hoverImg."', '".$key."')");
            if(!$res){
                print_r( mysqli_error($conn));
                
            }else{
                echo "good ".$i." added \n";
            }
        }
    }
}
function namingImg($img){
    if($img !=""){
        $imgWarr = explode("/",$img);
        $imgN  = $imgWarr[count($imgWarr)-1];
        return "images/".$imgN;
    }
}
?>