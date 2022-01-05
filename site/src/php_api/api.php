<?php
require 'connect.php';

// Функция для 
function safingString($string,$conn){
	return $conn->escape_string(htmlspecialchars($string));
}

if(isset($_GET['type'])){
	$res = $conn->query("use $db;");
	if(!$res){
		print_r( mysqli_error($conn));
	}

	switch($_GET['type']){
		case 'getGoods':
			$arr=json_decode($_POST['filterType']);
			$arrayFilter = createAssoc($arr,$conn);
			if(count($arr)>0){
				getGoods(prepareFilter($arrayFilter),$conn,$db);
			}else{
				getGoods(FALSE,$conn,$db);
			}
			break;
		case 'getCategory': getCat($conn,$db); break;
		case 'addOrder': addOrder($conn); break;
		case 'logIn': logIn($conn); break;
		case 'regIn': regIn($conn); break;
		case 'token': correctToken($conn); break;
		case 'getAdress': getAdress($conn); break;
		case 'getUserData': getUserData($conn); break;
		case 'setImage': updateImg($conn);break;
		case 'updateData': updateData($conn); break;
		case 'delAdress': delAdress($conn); break;
		case 'editAdress': editAdress($conn); break;
		case 'getOrders': getOrders($conn); break;
	}

}else{
	getGoods(FALSE,$conn,$db,null,NULL);
}

// Получение адресов пользователя
function getAdress($conn){
	$login = safingString($_POST['login'],$conn);
	$smpt = $conn -> prepare("SELECT adresses.ID,`adress` FROM `adresses` inner join `users` on adresses.ID_user=users.ID WHERE `name`=?");
	$smpt->bind_param("s",...[$login]);
	$smpt->execute();
	$res = $smpt->get_result();
	if($res->num_rows>0){
		$arr=array();
		while ($row = $res->fetch_assoc()) {
			$arr[] = [$row['adress'],$row['ID']];
		}
		$arr2['adresses'] =$arr; 
		echo json_encode($arr2,JSON_UNESCAPED_UNICODE);
	}else{
		statusResponseToJson("ER",0,"",3,"NOT ADRESSES ".$login);
	}
}

// Проверка корректности токена
function correctToken($conn){
	$login = safingString($_POST['login'],$conn);
	$token = safingString($_POST['token'],$conn);
	if(isset($_SESSION[$login])){
		if($_SESSION[$login] == $token){
			statusResponseToJson("OK",$token,$login,0,"ER");
		}else{
			statusResponseToJson("ER",0,$login,1,"ER");
		}
	}else{
		statusResponseToJson("ER",0,$login,2,"ER");
	}
}

// Регистрация
function regIn($conn){
	$arr = json_decode($_POST['data']);
		$arr = createAssoc($arr,$conn);
		$smpt = $conn -> prepare("SELECT `password`,`name`,`email` FROM users WHERE `name`=? or `email`=?");
		$smpt->bind_param("ss",...[$arr['reg_login'],$arr['reg_email']]);
		$smpt->execute();
		$res = $smpt->get_result();
		if(!($res->num_rows>0)){
			// Проверяем логин пароли и почта
			if(!valid($arr['reg_login'],$arr['reg_pass'],$arr['reg_pass2'],$arr['reg_email'])){
				$smpt = $conn -> prepare("INSERT INTO `users` (`name`, `password`, `email`) VALUES ( ?, ?, ?)");
				$smpt->bind_param("sss",...[$arr['reg_login'],password_hash($arr['reg_pass'],PASSWORD_DEFAULT),$arr['reg_email']]);
				$smpt->execute();
				$smpt = $conn -> prepare("SELECT `password`,`name`,`email` FROM users WHERE `name`=? or `email`=?");
				$smpt->bind_param("ss",...[$arr['reg_login'],$arr['reg_email']]);
				$smpt->execute();
				$res = $smpt->get_result();
				if($res->num_rows>0){
					$arrAss = $res->fetch_assoc();
					// Создание токена
					$token =((string)random_int(1,100000000));
					$_SESSION[$arrAss['name']] = $token;
					statusResponseToJson("OK",$token,$arrAss['name'],1);
				}else{
					statusResponseToJson("ER",0,"",2,"Регистрация не удалась ".$arr['reg_login']." ".$arr['reg_email']);
				}
			}else{
				statusResponseToJson("ER",0,"",3,valid($arr['reg_login'],$arr['reg_pass'],$arr['reg_pass2'],$arr['reg_email']));
			}
		}else{
			statusResponseToJson("ER",0,"",4,"Пользователь с таким именем или почтой уже есть");
		}
}

// Вход 
function logIn($conn){
	$arr = json_decode( $_POST['data']);
	$arr = createAssoc($arr,$conn);
	$smpt = $conn -> prepare("SELECT `password`,`name`,`email` FROM users WHERE `name`=? or `email`=?");
	$smpt->bind_param("ss",...[$arr['log_email'],$arr['log_email']]);
	$smpt->execute();
	$res = $smpt->get_result();
	if($res->num_rows>0){
		$arrAss = $res->fetch_assoc();
		$token =((string)random_int(1,100000000));
		if(password_verify($arr['log_pass'],$arrAss['password'])){
			$_SESSION[$arrAss['name']] = $token;
			statusResponseToJson("OK",$token,$arrAss['name'],1);
		}else{
			statusResponseToJson("ER",0,"",2,"Неправильный пароль или логин");
		}
	}else{
		statusResponseToJson("ER",0,"",3,"Неправильный пароль или логин");
	}
}

// Добавление записей заказа
function addOrder($conn){
	$arr=json_decode( $_POST['orders']);
	$login = safingString($_POST['login'],$conn);
	$token = safingString($_POST['token'],$conn);
	$arrData = createAssoc(json_decode($_POST['data']),$conn);
	$adr = $arrData['city'];
	$num = $arrData['number'];
	$ID="";
	$adrID="";
	$numberTb = "";
	$smpt = $conn -> prepare("SELECT users.ID,adresses.ID as adrID,`adress`,`name`,`number` FROM users left join `adresses` on adresses.ID_user=users.ID WHERE `name`=?");
	$smpt->bind_param("s",...[$login]);
	$smpt->execute();
	$res = $smpt->get_result();
	if($res->num_rows>0){
		$isAdr=false;
		while ($row = $res->fetch_assoc()) {
			$ID = $row['ID'];
			$numberTb = $row['number'];
			if($row['adress'] == $adr){
				$isAdr = true;
				$adrID = $row['adrID'];
				break;
			}
		}
		if(!$isAdr) {
			$smpt = $conn -> prepare("INSERT INTO `adresses` (`ID_user`,`adress`) VALUES (?,?)");
			$smpt->bind_param("ss",...[$ID,$adr]);
			$smpt->execute();
			$adrID = $conn->insert_id;
		}
		if(isset($_SESSION[$login])){
			if($_SESSION[$login] == $token){
				$smpt = $conn -> prepare("UPDATE users SET number=?  WHERE name=?");
				$smpt->bind_param("ss",...[$num,$login]);
				$smpt->execute();
				$smpt = $conn->prepare("INSERT INTO `orders` (`ID_user`,`ID_adress`,`ID_detail`,`number`,`status`) VALUES (?,?,?,?,?)");
				$smpt->bind_param("iiisi",...[$ID,$adrID,0,$num,1]);
				if($smpt->execute()){
					$idOrder = $conn->insert_id;
					// Цикл для добавление
					$smpt = $conn->prepare("INSERT INTO `detailsorder` (`ID`, `ID_goods`, `count`) VALUES (?,?,?)");
					$correct = true;
					for($i=0;$i<count($arr);$i++){
						$dataID = safingString($arr[$i]->id,$conn);
						$c =$arr[$i]->count;
						$smpt->bind_param("iii",...[$idOrder,$dataID,$c]);
						if(!$smpt->execute()){
							$correct=false;
						}
					}
					if(!$correct){
						print_r( mysqli_error($conn));
						statusResponseToJson("ER",0,$login,1,"ER");
					}else{
						statusResponseToJson("OK",$token,$login,0,$idOrder);
					}
				}else{
					statusResponseToJson("ER",0,$login,2,"Query failed");
				}
			}else{
				statusResponseToJson("ER",0,$login,3,"Invalid token");
			}
		}else{
			statusResponseToJson("ER",0,$login,4,"User not auth");
		}
	}else{
		statusResponseToJson("ER",0,$login,5,"Not user found");
	}
}

// Обновление изображения
function updateImg($conn){
	$login = safingString($_POST['login'],$conn);
	$token = safingString($_POST['token'],$conn);
	
	$smpt = $conn -> prepare("SELECT * FROM `users` WHERE `name`=?");
	$smpt->bind_param("s",...[$login]);
	$smpt->execute();
	$name="";
	$predPath="";
	$res = $smpt->get_result();
	if($res->num_rows>0){
		$arr=array();
		$row = $res->fetch_assoc();
		$name = $row['ID'];
		$predPath = $row['image'];
	}else{
		statusResponseToJson("ER",0,"",3,"NOT USER ".$login);
		return;
	}
	if(isset($_SESSION[$login])){
		if($_SESSION[$login] == $token){
			if(!empty($_FILES[0]['tmp_name'])){ 
				//Получаем временный файл
				$tmp = $_FILES[0]['tmp_name'];

				$name=time();//$row[0];
				//Получаем имя присланного файла
				$name = $name.'.jpg';
				$pathQuery = "userImage/".$name;
				$path = "../../userImage/".$name;
				// Пишем куда в дальнейшем, надо будет сохранить файл, 
				// в данном случае в папку images, имя файла оставляем родное
				// Указываем максимальный вес загружаемого файла. Сейчас до 2Мб 
				if(($_FILES[0]['type'] == 'image/jpeg' || $_FILES[0]['type'] == 'image/png') && ($_FILES[0]['size'] != 0 and $_FILES[0]['size']<=2097152)){ 
					//Здесь идет процесс загрузки изображения 
					$size = getimagesize($tmp); 
					// с помощью этой функции мы можем получить размер пикселей изображения 
					// если размер изображения не более 500 пикселей по ширине и не более 1500 по  высоте 
					if ($size[0] <= 1280  && $size[1]<=1280) 
					{ 
						move_uploaded_file($tmp, $path);
						// $rez = $conn->query("UPDATE users SET image='$path'  WHERE login='$login'");
						$smpt = $conn -> prepare("UPDATE users SET image=?  WHERE name=?");
						$smpt->bind_param("ss",...[$pathQuery,$login]);
						if($smpt->execute()){
							if(!is_null($predPath) && $predPath!=''){
								unlink("../../".$predPath); 
							}
							statusResponseToJson("OK",0,$login,0,"OK",$pathQuery);
						}else{
							unlink($path); 
							statusResponseToJson("ER",0,$login,1,"Неизвестная ошибка");
						}
					} else {
						// удаление файла
						unlink($tmp); 
						statusResponseToJson("ER",0,$login,2,"Загружаемое изображение превышает допустимые нормы (ширина не более - 1280; высота не более 1280)");
					} 
				} else { 

					statusResponseToJson("ER",0,$login,4,"Размер файла не должен превышать 2 Мб или Вы пытались загрузить не картинку ");
				}
			}else{
				statusResponseToJson("ER",0,$login,5,"Size error");
			}
		}
	}
}

// Удаление адреса пользователя
function delAdress($conn){
	$id = safingString($_POST['idAdress'],$conn);
	$login = safingString($_POST['login'],$conn);
	$token = safingString($_POST['token'],$conn);
	if(isset($_SESSION[$login])){
		if($_SESSION[$login] == $token){
			$smpt = $conn -> prepare("DELETE FROM adresses WHERE `ID`=?");
			$smpt->bind_param("s",...[$id]);
			if($smpt->execute()){
				statusResponseToJson("OK",$token,$login,0,$id);
			}else{
				statusResponseToJson("ER",0,$login,1,"Неизвестная ошибка");
			}
		}else{
			statusResponseToJson("ER",0,$login,2,"Неизвестная ошибка");
		}
	}else{
		statusResponseToJson("ER",0,$login,3,"Неизвестная ошибка");
	}
}

// Редактировани адреса пользователя
function editAdress($conn){
	$id = safingString($_POST['idAdress'],$conn);
	$val = safingString($_POST['newAdress'],$conn);
	$login = safingString($_POST['login'],$conn);
	$token = safingString($_POST['token'],$conn);
	if(isset($_SESSION[$login])){
		if($_SESSION[$login] == $token){
			$smpt = $conn -> prepare("UPDATE `adresses` SET adress=?  WHERE `ID`=?");
			$smpt->bind_param("ss",...[$val,$id]);
			if($smpt->execute()){
				statusResponseToJson("OK",$token,$login,0,"OK");
			}else{
				statusResponseToJson("ER",0,$login,1,"Неизвестная ошибка");
			}
		}else{
			statusResponseToJson("ER",0,$login,2,"Неизвестная ошибка");
		}
	}else{
		statusResponseToJson("ER",0,$login,3,"Неизвестная ошибка");
	}
}

// Получение заказов
function getOrders($conn){
	$login = safingString($_POST['login'],$conn);
	$smpt = $conn -> prepare("SELECT orders.ID,status FROM `orders` LEFT JOIN `users` ON orders.ID_user=users.ID WHERE `name`=?");
	$smpt->bind_param("s",...[$login]);
	$smpt->execute();
	$res = $smpt->get_result();
	if($res->num_rows>0){
		$arr=array();
		while($row = $res->fetch_assoc()){
			$arr[]=$row;
		}
		echo json_encode($arr,JSON_UNESCAPED_UNICODE);
	}else{
		statusResponseToJson("ER",0,"",1,"NOT ORDERS ".$login);
	}
}

// Обновление данных пользователя
function updateData($conn){
	$login = safingString($_POST['login'],$conn);
	$token = safingString($_POST['token'],$conn);
	$arr = json_decode($_POST['data']);
	$arr = createAssoc($arr,$conn);
	if(isset($_SESSION[$login])){
		if($_SESSION[$login] == $token){
			if(!valid($arr['out_login'],"admin","admin",$arr['out_email'])){
				$smpt = $conn -> prepare("UPDATE users SET name=?,email=?,number=?  WHERE name=?");
				$smpt->bind_param("ssss",...[$arr['out_login'],$arr['out_email'],$arr['out_number'],$login]);
				if($smpt->execute()){
					$_SESSION[$login] = null;
					$_SESSION[$arr['out_login']] = $token;
					statusResponseToJson("OK",$token,$arr['out_login'],0,"OK");
				}else{
					statusResponseToJson("ER",0,$login,1,"Неизвестная ошибка");
				}
			}else{
				statusResponseToJson("ER",0,$login,2,valid($arr['out_login'],"admin","admin",$arr['out_email']));
			}
		}else{
			statusResponseToJson("ER",0,$login,3,"Неизвестная ошибка");
		}
	}else{
		statusResponseToJson("ER",0,$login,4,"Неизвестная ошибка");
	}
}

// Получение данных пользователя
function getUserData($conn){
	$login = safingString($_POST['login'],$conn);
	$smpt = $conn -> prepare("SELECT `image`,`email`,`name`,`number` FROM `users` WHERE `name`=?");
	$smpt->bind_param("s",...[$login]);
	$smpt->execute();
	$res = $smpt->get_result();
	if($res->num_rows>0){
	
		$arr=array();
		$row = $res->fetch_assoc();
		$arr=$row;
		// $arr2['adresses'] =$arr; 
		echo json_encode($arr,JSON_UNESCAPED_UNICODE);
	}else{
		statusResponseToJson("ER",0,"",3,"NOT ADRESSES ".$login);
	}
}

// Подготовка данных фильтров для запроса
function prepareFilter($arrayFilter){
	$queryFilter=" ";
	$formayString="";
	$queryValue=[];
	$bool = FALSE;
	foreach ($arrayFilter as $key => $value) {
		if($key == 'max'){
				if(!$bool){
					$bool =TRUE;
					$queryFilter.=" price < ? ";
					$formayString.="s";
					
				}else{
					$queryFilter.="and price < ? ";
					$formayString.="s";
				}
				$queryValue[] = $value;
		}
		if($key == 'min'){
				if(!$bool){
					$bool =TRUE;
					$queryFilter.=" price > ? ";
					$formayString.="s";
				}else{
					$queryFilter.="and price > ? ";
					$formayString.="s";
				}
				$queryValue[] = $value;
		}
		if($key == 'search'){
			if(!$bool){
				$bool =TRUE;
				$queryFilter.=" (title LIKE ? ) ";
				$formayString.="s";
			}else{
				$queryFilter.="and title LIKE ? ";
				$formayString.="s";
			}
			$queryValue[] = "%".$value."%";
		}
		if($key == 'sale'){
			if(!$bool){
				$bool =TRUE;
				$queryFilter.=" is_sale = ? ";
				$formayString.="s";
			}else{
				$queryFilter.="and is_sale = ? ";
				$formayString.="s";
			}
			$queryValue[] = $value;
		}
		if($key == 'category'){
			if(!$bool){
				$bool =TRUE;
				$queryFilter.=" name_category = ? ";
				$formayString.="s";
			}else{
				$queryFilter.="and name_category = ? ";
				$formayString.="s";
			}
			$queryValue[] = $value;
		}
	}
	return [$queryFilter,$queryValue,$formayString];
}

// Универсальная функция ответа(чаще всего используется для сообщения для ошибки)
function statusResponseToJson($value,$token,$login,$code="",$text="",$data=NULL){
	$object = (object) [
		'status' => $value,
		'code' => $code,
		'text' => $text,
		'token' => $token,
		'login' => $login,
		'data' => $data,
	];
	echo json_encode($object,JSON_UNESCAPED_UNICODE);
}

// Преобразователь массива полученого в js c помощью JQuery.serialazeArray() в ассоциативный
// Дополнительно происходит экранирование данных
function createAssoc($arr,$conn){
	$arrayAssoc = array();
	for ($i=0; $i < count($arr); $i++) { 
		$arrayAssoc[$arr[$i]->name]=safingString($arr[$i]->value,$conn);
	}
	return $arrayAssoc;
}

// Преобразование результата запроса в массив категорий и вывод JSON формате
function serialazeCat($res){
	$arr=array();
	while ($row = $res->fetch_assoc()) {
		$arr[] = new Category(
			$row['ID'],
			$row['name_category']
		);
	}
	$arr2['categorys'] =$arr; 
	echo json_encode($arr2,JSON_UNESCAPED_UNICODE);
}

// Преобразование результата запроса в массив товаров и вывод JSON формате
function serialaze($res){
	$arr=array();
	while ($row = $res->fetch_assoc()) {
		$arr[] = new Good(
			$row['ID'],
			$row['title'],
			$row['price'],
			$row['is_sale'],
			$row['img'],
			$row['hoverImg'],
			$row['category_ID']
		);
	}
	$arr2['goods'] =$arr; 
	echo json_encode($arr2,JSON_UNESCAPED_UNICODE);
}

// Получение категорий из БД
function getCat($conn1,$db){
	$res = $conn1->query("use $db;");
    if(!$res){
        print_r( mysqli_error($conn1));
    }
    $res = $conn1->query("SELECT * FROM categorytb");
    if(!$res){
        print_r( mysqli_error($conn1));
    }else{
		serialazeCat($res);
	}
}

// Получение товаров из БД
function getGoods($queryParams,$conn1,$db){
	$res = $conn1->query("use $db;");
	if(!$res){
		print_r( mysqli_error($conn1));
	}
	if(!$queryParams){
		$res = $conn1->query("SELECT * FROM goodstb");
		processingErr($res,$conn1);
	}else{

		$res = $conn1->prepare("SELECT goodstb.ID,title,price,is_sale,img,hoverImg,category_ID,name_category FROM goodstb INNER JOIN categorytb ON goodstb.category_ID=categorytb.ID where ".$queryParams[0]);
		if (!$res) {
			throw new Exception($conn1->error, $conn1->errno);
		}
		$res -> bind_param($queryParams[2],...$queryParams[1]);
		$res->execute();
		// Вызываем обработчик результата
		processingErr($res->get_result(),$conn1);
	}
}

// Обработчик ошибок для getGoods если все прошло без ошибок он передаст все товары на вывод
function processingErr($res,$conn1){
	if(!$res){
		print_r(mysqli_error($conn1));
		
	}else{
		serialaze($res);
	}
}

// 
function valid($login,$password,$password2,$mail){
    if ($login == "") return "пустой логин"; //не пусто ли поле логина 	
	if ($password == "") return "пустой первый пароль"; //не пусто ли поле пароля
	if ($password2 == "") return "пустой второй пароль"; //не пусто ли поле подтверждения пароля
	if ($mail == "") return "пустая почта"; //не пусто ли поле e-mail
	//if ($_POST['lic'] != "ok") return false; //приняты ли правила
	if (!preg_match('/^([a-z0-9])(\w|[.]|-|_)+([a-z0-9])@([a-z0-9])([a-z0-9.-]*)([a-z0-9])([.]{1})([a-z]{2,4})$/is', $mail)) return "Запрещенные символы"; //соответствует ли поле e-mail регулярному выражению
	if (!preg_match('/^([a-zA-Z0-9])(\w|-|_)+([a-z0-9])$/is', $login)) return "Логин содержит неверные символы"; // соответствует ли логин регулярному выражению
 	if ($password != $password2) return "Пароли не совпадают"; //равен ли пароль его подтверждению
   	return false;
}

class Good{
	function __construct($idS,$titleS,$priceS,$saleS,$imgS,$hoverImgS,$categoryS)
	{
		$this->id=$idS;
		$this->title=$titleS;
		$this->price=$priceS;
		$this->sale=$saleS;
		$this->img=$imgS;
		$this->hoverImg=$hoverImgS;
		$this->category=$categoryS;
	}
	public $id;
	public $title;
	public $price;
	public $sale;
	public $img;
	public $hoverImg;
	public $category;
}

class Category{
	function __construct($idS,$categoryS)
	{
		$this->id=$idS;
		$this->category=$categoryS;
	}
	public $id;
	public $category;
}
?>