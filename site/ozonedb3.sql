-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3307
-- Время создания: Май 12 2021 г., 23:27
-- Версия сервера: 10.4.12-MariaDB
-- Версия PHP: 7.4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `ozonedb3`
--

-- --------------------------------------------------------

--
-- Структура таблицы `adresses`
--

CREATE TABLE `adresses` (
  `ID` int(11) NOT NULL,
  `ID_user` int(11) NOT NULL,
  `adress` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `adresses`
--

INSERT INTO `adresses` (`ID`, `ID_user`, `adress`) VALUES
(2, 1, 'Санкт-Петербург');

-- --------------------------------------------------------

--
-- Структура таблицы `categorytb`
--

CREATE TABLE `categorytb` (
  `ID` int(11) NOT NULL,
  `name_category` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `categorytb`
--

INSERT INTO `categorytb` (`ID`, `name_category`) VALUES
(1, 'Игровая приставка'),
(2, 'Периферия для ПК'),
(3, 'Игры и софт');

-- --------------------------------------------------------

--
-- Структура таблицы `detailsorder`
--

CREATE TABLE `detailsorder` (
  `ID` int(11) NOT NULL,
  `ID_goods` int(11) NOT NULL,
  `count` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `detailsorder`
--

INSERT INTO `detailsorder` (`ID`, `ID_goods`, `count`) VALUES
(17, 3, 1),
(18, 3, 1),
(19, 3, 1),
(20, 3, 1),
(21, 1, 5),
(22, 1, 2),
(23, 1, 2),
(24, 2, 1),
(24, 6, 1),
(25, 2, 1),
(25, 6, 1),
(26, 2, 1),
(26, 6, 1),
(27, 2, 1),
(28, 2, 1),
(29, 2, 1),
(30, 2, 1),
(31, 2, 1),
(32, 2, 1),
(33, 2, 1),
(34, 2, 1),
(35, 2, 1),
(36, 2, 1),
(37, 2, 1),
(38, 2, 1),
(39, 2, 1),
(40, 2, 1),
(41, 2, 1),
(42, 2, 1),
(43, 2, 1),
(44, 2, 1),
(45, 2, 1),
(46, 2, 1),
(47, 2, 1),
(48, 2, 1),
(49, 2, 1),
(50, 1, 1),
(51, 2, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `goodstb`
--

CREATE TABLE `goodstb` (
  `ID` int(11) NOT NULL,
  `title` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Нет названия',
  `price` float NOT NULL DEFAULT 0,
  `is_sale` tinyint(1) NOT NULL,
  `img` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Нет изображения',
  `hoverImg` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Нет изображения',
  `category_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `goodstb`
--

INSERT INTO `goodstb` (`ID`, `title`, `price`, `is_sale`, `img`, `hoverImg`, `category_ID`) VALUES
(1, 'Игровая приставка Sony PlayStation 4 Pro', 33990, 0, 'images/1033180284.jpg', 'images/1033180283.jpg', 1),
(2, 'Игровая приставка Sony PlayStation 3 Super Slim', 16499, 1, 'images/1027495663.jpg', 'images/1028469540.jpg', 1),
(3, 'Игровая приставка Xbox One X', 39990, 0, 'images/1024358491.jpg', '', 1),
(4, 'Игровая приставка Xbox One S', 23411, 1, 'images/1024822131.jpg', 'images/1024822128.jpg', 1),
(5, 'Игровая приставка Nintendo Switch', 24751, 0, 'images/1021386685.jpg', 'images/1026072683.jpg', 1),
(6, 'Игровая приставка Sega Retro Genesis HD', 3624, 1, 'images/1024928305.jpg', 'images/1024928306.jpg', 1),
(7, 'Игровая приставка Dendy Junior', 1551, 1, 'images/1021877092.jpg', 'images/1021877092.jpg', 1),
(8, 'Игровая приставка Sony PlayStation Classic', 10445, 0, 'images/1025222877.jpg', 'images/102538227.jpg', 1),
(9, 'Клавиатура Logitech Wireless Keyboard K360', 2390, 0, 'images/1015518726.jpg', 'images/102518725.jpg', 2),
(10, 'Клавиатура Defender Element HB-195', 566, 1, 'images/1028488609.jpg', 'images/1028488611.jpg', 2),
(11, 'Игровая клавиатура Steelseries Apex M750- RU', 12848, 1, 'images/1027006299.jpg', 'images/1027006301.jpg', 2),
(12, 'Мышь + коврик A4Tech Bloody V7M+B-071', 1649, 0, 'images/1026202934.jpg', 'images/1026202933.jpg', 2),
(13, 'Мышь Trust Varo', 1097, 1, 'images/1025117257.jpg', 'images/1025117012.jpg', 2),
(14, 'Мышь Genius DX-120', 350, 0, 'images/1014472326.jpg', 'images/1014472325.jpg', 2),
(15, 'Коврик для мыши Orico MPA9040', 1279, 1, 'images/1026748248.jpg', 'images/1026748250.jpg', 2),
(16, 'Коврик для мыши Trust GXT 760 Glide RGB', 4959, 0, 'images/1025053907.jpg', '', 2),
(17, 'Метро: Исход', 1479, 1, 'images/1026951535.jpg', '', 3),
(18, 'Darksiders III. Коллекционное издание', 3990, 0, 'images/1023840682.jpg', 'images/1023849642.jpg', 3),
(19, 'Mortal Kombat X', 1076, 0, 'images/1011627377.jpg', '', 3),
(20, 'Microsoft Windows 10 Home (32/64-bit)', 9412, 0, 'images/1013975751.jpg', 'images/1013975799.jpg', 3),
(21, '1С:Предприятие 8.3. Версия для обучения программированию', 560, 1, 'images/1015773076.jpg', '', 3),
(22, 'ABBYY FotoTranslate', 805, 0, 'images/1001559725.jpg', '', 3),
(23, 'Destiny (Xbox 360)', 723, 1, 'images/1021419099.jpg', '', 3),
(24, 'Игра Onrush (PS4 Sony)', 1794, 1, 'images/1023547851.jpg', '', 3);

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `ID` int(11) NOT NULL,
  `ID_user` int(11) NOT NULL,
  `ID_adress` int(11) NOT NULL,
  `ID_detail` int(11) NOT NULL,
  `number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`ID`, `ID_user`, `ID_adress`, `ID_detail`, `number`, `status`) VALUES
(27, 1, 2, 0, '12321321', 0),
(28, 1, 2, 0, '12321321', 0),
(29, 1, 1, 0, '12321321', 0),
(30, 1, 1, 0, '12321321', 0),
(31, 1, 1, 0, '12321321', 0),
(32, 1, 2, 0, '12321321', 0),
(33, 1, 1, 0, '12321321', 0),
(34, 1, 1, 0, '12321321', 0),
(35, 1, 1, 0, '12321321', 0),
(36, 1, 1, 0, '12321321', 0),
(37, 1, 1, 0, '12321321', 0),
(38, 1, 1, 0, '12321321', 0),
(39, 1, 1, 0, '12321321', 0),
(40, 1, 1, 0, '12321321', 0),
(41, 1, 1, 0, '12321321', 0),
(42, 1, 1, 0, '12321321', 0),
(43, 1, 1, 0, '12321321', 0),
(44, 1, 2, 0, '12321321', 0),
(45, 1, 2, 0, '', 0),
(46, 1, 2, 0, '12321321', 0),
(47, 1, 2, 0, '12321321', 0),
(48, 1, 2, 0, '12321321', 0),
(49, 1, 2, 0, '12321321', 0),
(50, 1, 2, 0, '12321321', 0),
(51, 1, 2, 0, '12321321', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `second_name` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`ID`, `name`, `second_name`, `password`, `number`, `email`, `image`) VALUES
(1, 'admin', NULL, '$2y$10$NwGYTqmFO.mHMtgNwOcbm.mMv8qcvWCqRHUp.55TnALygST4xs96q', '12321321', 'anton2001snake@gmail.com', 'userImage/1620666403.jpg');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `adresses`
--
ALTER TABLE `adresses`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `categorytb`
--
ALTER TABLE `categorytb`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `goodstb`
--
ALTER TABLE `goodstb`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `adresses`
--
ALTER TABLE `adresses`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `categorytb`
--
ALTER TABLE `categorytb`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `goodstb`
--
ALTER TABLE `goodstb`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
