<?php
post();
function get_url( $url, $type="GET", $params=array(), $timeout=30 ) {
	if ( $ch = curl_init() ) {
		curl_setopt( $ch, CURLOPT_URL, $url );
		curl_setopt( $ch, CURLOPT_HEADER, false );
		if ( $type == "POST" ) {
			curl_setopt( $ch, CURLOPT_POST, 1 );
			curl_setopt( $ch, CURLOPT_POSTFIELDS, urldecode( http_build_query( $params ) ) );
		}
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $ch, CURLOPT_CONNECTTIMEOUT, $timeout );
		curl_setopt( $ch, CURLOPT_USERAGENT, 'PHPBot' );
		$data = curl_exec( $ch );
		curl_close( $ch );
		return $data;
	} else {
		return "{}";
	}
}

function arr_in_str( $array ) {
	ksort( $array );
	$string = "";
	foreach( $array as $key=>$val ) {
		if ( is_array( $val ) ) {
			$string .= $key."=".arr_in_str( $val );
		} else {
			$string .= $key . "=" . $val;
		}
	}
	return $string;
}

add_action( 'save_post', 'action_function_name_85245', 10, 3 );
function action_function_name_85245( $post_ID, $post, $update ) {
	// Действие...
	//post();
}


function post(){
	$ok_access_token = "tkn1QAV0VQite91UkVSx6i96zvu2jhDJWQRiiBiA6nXcYh4ZaT0vEELthk3XQI4xOZSgs";//Наш вечный токен
	$ok_private_key = "910EBC6A3D21E70F7615753F";//Секретный ключ приложения
	$ok_public_key = "CFGHCIKGDIHBABABA";//Публичный ключ приложения
	$ok_session_key = "d80bde254a08896c7667c1ac3c21b7d6";//Секретный ключ сессии

	$media = array( "media" => array(
			array( "type"=> "text","text"=> "Текст поста" ),
			array( "type"=> "link","url"=> "https://yandex.ru" )//Таким образом можете удалятьб или добавлять разные блоки в пост
		)
	);

	$params = array(
		"application_key"=>$ok_public_key,
		"method"=>"mediatopic.post",
		"gid"=>"60918662496399",//ID нашей группы
		"type"=>"GROUP_THEME",
		"attachment"=>'{"media": [{"type": "link","url": "https://www.google.com"}]}',//Вместо https://www.google.com естественно надо подставить нашу ссылку
		"format"=>"json"
	);

	$sig = md5( arr_in_str( $params ) . $ok_session_key  ); //подписываем запрос секретным ключом
	$params["access_token"] = $ok_access_token; //Добавляем наш токен
	$params["sig"] = $sig; //Добавляем полученный хеш
	$result = json_decode( get_url( "https://api.ok.ru/fb.do", "POST", $params ), true ); //Отправляем пост
	//Если парсер не смог открыть нашу ссылку (иногда он это делает со второй попытки), то мы получим ошибку 5000, просто отправим запрос ещё разок, этого хватит
	if ( isset( $result['error_code'] ) && $result['error_code'] == 5000 ) {
		get_url( "https://api.ok.ru/fb.do", "POST", $params );
	}

	/*
	Если хотите чтобы пост был отправлен гарантировано, то есть смысл попробовать примерно такую конструкцию

	do {
		$result = json_decode( get_url( "https://api.ok.ru/fb.do", "POST", $params ), true ); //Отправляем пост
	} while ( isset( $result['error_code'] ) && $result['error_code'] == 5000 );

	Цикл будет повторяться пока сервер возвращает ошибку 5000 при успешной отправке или получении ошибки отличной от 5000 цикл сработает один раз.

	*/
?>