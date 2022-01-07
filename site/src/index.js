'use strict';

class CardGood {
    titleText;
    id;
    price;
    isSale;
    imgAdress;
    hoverImgAdress;
    constructor(id, titleText, price, isSale, imgAdress, hoverImgAdress) {
        this.id = id;
        this.titleText = titleText;
        this.price = price;
        this.isSale = isSale;
        this.imgAdress = imgAdress;
        this.hoverImgAdress = hoverImgAdress;
    }

    // Создает HTML карточку для отображения в основном окне
    createCard(isCart) {
        // Определяем:
        // есть ли скидка
        let saleString = this.isSale == 1 ? "<div class=\"card-sale\">&#128293;Hot sales!&#128293;</div>" : "";
        // Есть ли альт Изображение
        let altImg = this.hoverImgAdress != "" ? "<span class=\"card-img-top\"style=\"background-image: url('" + this.hoverImgAdress + "');opacity:0;\"></span>" : "";
        // Находится ли товар в корзине;
        let button = !isCart ? "<button class=\"btn btn-primary\" val=" + this.id + ">В корзину</button>" : "<button class=\"btn btn-secondary\" val=" + this.id + " disabled>В корзине</button>";
        // Собираем карточку
        let card = "<!-- КАРТОЧКА ТОВАРА -->" +
            "<div class=\"col-12 col-md-6 col-lg-4 col-xl-3\">" +
            "<div class=\"card\">" +
            saleString +
            "<div class=\"card-img-wrapper\">" +
            "<span class=\"card-img-top\"style=\"background-image: url('" + this.imgAdress + "')\"></span>" +
            altImg +
            "</div>" +
            "<div class=\"card-body justify-content-between\">" +
            "<div class=\"card-price\">" + this.price + " &#8381;</div>" +
            "<h5 class=\"card-title\">" + this.titleText + "</h5>" +
            button +
            "</div>" +
            "</div>" +
            "</div>";
        return card;
    }

    // Создает HTML карточку для отображения в корзине
    createCardCart(counter) {
        // Определяем:
        // есть ли скидка
        let saleString = this.isSale == 1 ? "<div class=\"card-sale\">&#128293;Hot sales!&#128293;</div>" : "";
        // Можно ли уменьшать кол-во товаров(если будет 1 в коризне кнопка "-" заблокируется)
        let disabled = counter < 2 ? "disabled" : "";
        let button = "<button class=\"btn btn-secondary delCart\" val=" + this.id + ">Убрать из корзины</button>";
        // Собираем карточку
        let card = "<!-- КАРТОЧКА ТОВАРА В КОРЗИНЕ -->" +
            "<div class=\"col-12 col-md-6 col-lg-4 col-xl-3\">" +
            "<div class=\"card\">" +
            saleString +
            "<div class=\"card-img-wrapper\">" +
            "<span class=\"card-img-top\"style=\"background-image: url('" + this.imgAdress + "')\"></span>" +
            "</div>" +
            "<div class=\"card-body justify-content-between\">" +
            "<div class=\"card-price\">" + this.price + " &#8381;</div>" +
            "<h5 class=\"card-title\">" + this.titleText + "</h5>" +
            "<div class=\"incartbuts\"><button class=\"btn btn-primary incartminus\" " + disabled + ">-</button>" + "<span class=\"counter\" id=" + this.id + ">" + counter + "</span>" + "<button class=\"btn btn-primary incartplus\">+</button></div>" +
            button +
            "</div>" +
            "</div>" +
            "</div>";
        return card;
    }

    // Преобразователь из данных о товаре в класс(например getLocalStorage такие возращает)
    static valueOf(cardData) {
        return new CardGood(
            cardData.id,
            cardData.titleText,
            cardData.price,
            cardData.isSale,
            cardData.imgAdress,
            cardData.hoverImgAdress
        );
    }

    searchGood(arr) {
        for (const object of arr)
            if (this.id == object.id)
                return object;
        return false;
    }

    // Получение товара по ID из корзины
    static searchGoodInCart(id, arr) {
        for (const object of arr)
            if (id == object.id)
                return object;
        return false;
    }

    // Получение индекса(массива корзины) по ID товара
    static searchGoodInCartIndex(id, arr) {
        let it = 0;
        for (const object of arr) {
            if (id == object.id)
                return it;
            it++;
        }
    }
}

class Cart {



    // Переменная для хранения данных о классе окна
    windowClass;

    constructor(windowClass) {
        this.windowClass = windowClass;
    }

    // Массив корзины
    cartGoods = [];

    // Обертка для добавления в массив корзины
    add(good) {
        this.cartGoods.push({ id: good.id, good: good, count: good.count });
    }

    // Обертка для получения длины массива корзины
    length() {
        return this.cartGoods.length;
    }

    // Обертка для удаления из массива корзины
    remove(id) {
        this.cartGoods.splice(id, 1);
    }

    // Изменение кол-ва товаров корзине по кнопкам "-" "+"
    changeCount(targetObj, type) {
        let counter = $(targetObj).parent().children(".counter");
        let minusBut = $(targetObj).parent().children(".incartminus");
        let plusBut = $(targetObj).parent().children(".incartplus");
        let id = counter.attr("id");
        let object = CardGood.searchGoodInCart(id, this.cartGoods);
        // Прозваниваем на изменение общего счетчика
        this.updateCount(type, 1);
        if (type == 1) {
            object.count++;
            counter.text(parseInt(counter.text()) + 1);
            if (object.count > 1) {
                minusBut.prop('disabled', false);
            }
        } else if (type == 0 && object.count > 1) {
            object.count--;
            counter.text(parseInt(counter.text()) - 1);
            if (object.count < 2) {
                minusBut.prop('disabled', true);
            }
        }
        // Сохранение в локальное хранилище
        this.setLocalStorage()
    }

    // Обертка для сохранения массива в локальном хранилище
    setLocalStorage() {
        localStorage.setItem("cart", JSON.stringify(this.cartGoods));
        this.changeSumm();
        console.log(this.getLocalSrorage)
    }

    // Обертка для получения массива из локального хранилища
    getLocalSrorage() {
        return localStorage.getItem("cart")
    }

    // Добавление товара в козину
    addCard(targetObg) {
        // Очищение надписи
        if (this.length() < 1)
            $("#cart-empty").empty();

        let cardClass = CardGood.searchGoodInCart($(targetObg).attr("val"), this.windowClass.arrGoods).good;
        // Обновление кол-ва товара
        this.updateCount(1, 1);
        // Добавление
        $("#cart-empty").append(cardClass.createCardCart(1));
        // Изменение основной карточки 
        $(targetObg).text("В корзине");
        $(targetObg).addClass("btn-secondary");
        $(targetObg).prop('disabled', true);
        cardClass.count = 1;
        this.add(cardClass);
        this.setLocalStorage()
    }

    // Удаление товара из корзины
    removeCard(targetObg) {
        $(targetObg).parent().parent().parent().remove();
        let id = CardGood.searchGoodInCartIndex($(targetObg).attr("val"), this.cartGoods);
        // Обновление кол-ва товаров в корзине
        this.updateCount(0, CardGood.searchGoodInCart($(targetObg).attr("val"), this.cartGoods).count);
        this.remove(id);
        this.windowClass.getGoods();
        this.setLocalStorage();

        // Если корзина пуста установить соответсвующую надпись
        if (this.length() < 1)
            $("#cart-empty").append("В данный момент корзина пуста");
    }
    removeAllCard() {
        this.cartGoods = [];
        $("#cart-empty").empty();
        // Обновление кол-ва товаров в корзине
        this.resetCount();
        this.windowClass.getGoods();
        this.setLocalStorage();

        // Если корзина пуста установить соответсвующую надпись
        if (this.length() < 1)
            $("#cart-empty").append("В данный момент корзина пуста");
    }

    // Фунция-"звонок" на изменение общей суммы
    changeSumm() {
        let counter = $(".cart-total span");
        counter.text("0");
        // Проходится по всему массиву корзины и считает общую сумму 
        for (let i = 0; i < this.length(); i++)
            counter.text(parseInt(counter.text()) + this.cartGoods[i].count * this.cartGoods[i].good.price);
    }

    // Функция обновления счетчика
    updateCount(type, count) {
        // Получаем данные о счетчике
        let counterCount = parseInt(this.windowClass.counter.text());

        // Определяем увеличивать или уменьшать счетчик по type
        counterCount += type == 1 ? count : -count;

        // Определяем показывать ли кнопку оформления заказа
        counterCount > 0 ? this.windowClass.cartConfirmBtn.show() : this.windowClass.cartConfirmBtn.hide();
        this.windowClass.counter.text(counterCount);

    }
    resetCount() {
        // Обнуляем
        let counterCount = 0;
        // Скрываем кнопку
        this.windowClass.cartConfirmBtn.hide();
        this.windowClass.counter.text(counterCount);
    }

    // Функция для отображения товаров в корзине при первом запуске
    display() {
        // Получаем товары из локального хранилища
        let carts = this.getLocalSrorage() != null ? JSON.parse(this.getLocalSrorage()) : [];
        // Если они есть то проходимся по ним иначе выводим соответсвующую надпись
        if (carts.length > 0) {
            for (let i = 0; i < carts.length; i++) {
                let cardClass = CardGood.valueOf(carts[i].good);
                cardClass.count = carts[i].count;
                let card = cardClass.createCardCart(cardClass.count);
                this.updateCount(1, cardClass.count);
                $("#cart-empty").append(card);
                this.add(cardClass);
            }
            // Прозванием на подсчет суммы
            this.changeSumm();
            this.windowClass.cartConfirmBtn.show();
        } else {
            this.windowClass.cartConfirmBtn.hide();
            $("#cart-empty").append("В данный момент корзина пуста");
        }
    }
}

class MainWindow {
    cartClass;
    cartConfirmBtn;
    cartWindow;
    openCartBtn;
    catalogBtn;
    catalogWindow;
    searchBtn;
    windowBody;
    confirmOrderBtn;
    authWindow;
    orderWindow;
    resWindow;
    closeBtn;
    pred;
    counter;
    arrGoods;
    category = "";
    galka;
    checkbox;
    constructor() {
        this.arrGoods = [];
        this.cartWindow = $(".cart");
        this.openCartBtn = $("#cart");
        this.catalogBtn = $(".catalog-button").children("button");
        this.catalogWindow = $(".catalog");
        this.searchBtn = $(".search-btn button");
        this.windowBody = $(".cart-body");
        this.confirmOrderBtn = $("#confirm");
        this.authWindow = $(".log_auth");
        this.orderWindow = $(".send_order");
        this.cartConfirmBtn = $(".cart-confirm");
        this.closeBtn = $(".cart-close");
        this.pred = "";
        this.counter = $("#cart .counter");
        this.resWindow = $(".res_modal");
        this.galka = $(".filter-check_checkmark");
        this.checkbox = $("#discount-checkbox");

        // Создаем обьект корзины для работы с ней
        this.cartClass = new Cart(this);

        // Отображам товары в корзине если они есть в локальном хранилище
        this.cartClass.display();
        // Получаем категории и товары
        this.getCategories();
        this.getGoods();

        // Подготавлвиаваем стили поля корзины
        $("#cart-empty").css({
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center"
        });

    }

    selectorClick(target) {
        // Получаем элементы которые были созданы динамически
        let categoryEl = $(".catalog-list li");
        let addCartBtn = $(".container .card button");
        let inCartBtn = $("#cart-empty .card button");

        // Если нажимаем вне тела модального окна, закрываем его
        if ((!this.windowBody.is(target) && this.windowBody.has(target).length === 0))
            if (this.isClicked(target, this.cartWindow) || this.isClicked(target, this.authWindow) || this.isClicked(target, this.orderWindow) || this.isClicked(target, this.resWindow))
                $(target).hide();


            // Закрытие модального окна по крестику
        if (this.isClicked(target, this.closeBtn))
            $(target).parent().parent().hide();

        // Открытие корзины по кнопке корзины
        if (this.isClicked(target, this.openCartBtn))
            this.cartWindow.show();

        // Открытие окна личного кабинета/регистрации/входа
        if (this.isClicked(target, $("#log"))) {
            this.cartWindow.hide();
            isOrder = false;
            this.authWindow.show();
        }

        // Если нажали на кнопку каталога мы изменияем его видимость иначе скрываем каталог
        this.isClicked(target, this.catalogBtn) ? this.catalogWindow.toggle() : this.catalogWindow.hide();

        // Вызов получения товаров из БД
        if (this.isClicked(target, this.searchBtn))
            this.getGoods();

        // Вызов функции добавления товара в корзину при нажатии добавления в корзину
        if (this.isClicked(target, addCartBtn))
            this.cartClass.addCard(target);

        // Обработка нажатии на кнопки карточки товара находящегося внутри коризны
        if (this.isClicked(target, inCartBtn)) {
            let delBtn = $("#cart-empty .card button.delCart");
            let plusBtn = $("#cart-empty .card button.incartplus");
            let minusBtn = $("#cart-empty .card button.incartminus");
            if (this.isClicked(target, delBtn))
                this.cartClass.removeCard(target);

            // Увеличиваем кро-во товара данной позиции на 1
            if (this.isClicked(target, plusBtn))
                this.cartClass.changeCount(target, 1);

            // Уменьшаем кро-во товара данной позиции на 1
            if (this.isClicked(target, minusBtn))
                this.cartClass.changeCount(target, 0);

        }

        // Обработка нажатии кнопок связанных с изменением или удалениям адреса в личном кабинете
        if (this.isClicked(target, $(".adr-el"))) {
            let delBtn = $(".adr-el .del");
            let editBtn = $(".adr-el .edit");
            // Удаления адреса
            if (this.isClicked(target, delBtn))
                this.delAdress($(target).val(), target);

            // Изменения адреса
            if (this.isClicked(target, editBtn))
                this.editAdress($(target).val(), $(target).parent().children("input").val(), target);

        }
        // Обработка нажатия на элемент списка категорий
        if (this.isClicked(target, categoryEl))
            this.changeCategory($(target).text(), target)

        // Обработка нажатия кнопки `оформления заказа`
        if (this.isClicked(target, this.cartConfirmBtn))
            this.showOrderFin(this.orderWindow, this.authWindow);

        // Обработка кнопки `подтверждение заказа`
        if (this.isClicked(target, this.confirmOrderBtn))
            if (isLog)
                this.sendOrder();

            // Обработка кнопки войти
        if (this.isClicked(target, $('#log_btn')))
            In("log");

        // Обработка кнопки зарегестрироватся
        if (this.isClicked(target, $('#reg_btn')))
            In("reg");

        // Обработка кнопки выйти
        if (this.isClicked(target, $('#log_out')))
            out();

        // Обработка кнопки изменить(изменение данных пользователя)
        if (this.isClicked(target, $('#log_edit')))
            update($('#log_edit'));

        // Обработка нажатия на чексбокс
        if (this.isClicked(target, this.checkbox))
            this.galka.toggleClass("checked");
    }

    timerAlert;

    // Смена категории выводимых товаров
    changeCategory(categoryText, categoryEl) {

        // Если раннее выбранная категория не пустая изменяем ее цвет текста на стандартный
        if (this.pred != "")
            this.pred.css({ color: "unset" });

        // Если нажали на ту же категорию которая и была выбрана раннее сбрасываем фильтр категорий
        // Иначе устанавливаем текст категории в спец переменную 
        if (this.category == categoryText) {
            $(categoryEl).css({ color: "unset" });
            this.category = "";
        } else {
            $(categoryEl).css({ color: "#005bff" });
            let textCat = categoryText;
            this.category = textCat != "Все товары" ? categoryText : "";
        }
        // Прозваниваем на получение спика товаров с сервера
        this.getGoods();
        // Устанавливаем значение предыдущей категории
        this.pred = $(categoryEl);
    }


    // Метод для отправки заказа
    sendOrder() {
        // Скрытие всех алертов на всякий случай
        hideAlert();
        let form = $(".send_order .form-group");
        let res = $(".res_modal .results");
        clearTimeout(this.timerAlert);
        $.ajax({
            url: 'src/php_api/api.php?type=addOrder',
            type: "POST",
            dataType: "json",
            data: { "orders": JSON.stringify(this.cartClass.cartGoods), "login": getCookInfo('login'), "token": getCookInfo('token'), "data": JSON.stringify(form.serializeArray()) },
            success: data => {
                console.log(data);
                // Закрытие модального окна
                form.parent().parent().parent().hide();
                // Показ конечного модального окна с результатом 
                res.parent().parent().show();
                // Обработка ответа от сервера
                if (data.status == "OK") {
                    showAlert(res, "Заказ оформлен номер заказа " + data.text, ".alert-success");
                    this.cartClass.removeAllCard();

                    // Прозванием на получение от сервера адресов и спика заказов чтобы обновить данные в личном кабинете
                    getOrders();
                    getAdress(null);
                } else {
                    showAlert(res, "Неизвестная ошибка", ".alert-danger");
                }
                this.timerAlert = setTimeout(hideAlert, 3000, res);
            },
            error: er => {
                // Закрытие модального окна
                form.parent().parent().parent().hide();
                // Показ конечного модального окна с результатом 
                res.parent().parent().show();
                console.log(er.responseText);
                showAlert(res, "Неизвестная ошибка", ".alert-danger");
                this.timerAlert = setTimeout(hideAlert, 3000, res);
            }
        });
    }

    // Метод полчения товаров из БД
    getGoods() {
        // Получаем поля фильтров
        let min = $("#min");
        let max = $("#max");
        let search = $(".search-wrapper_input");
        let sale = $("#discount-checkbox");
        let filterType = [];
        // Формируем массив фильтров
        // Если массив окажется пустым сервер(PHP) поймет это и просто вернет нам список всех товаров
        if (min.val() != "")
            filterType.push({ name: "min", value: min.val() });
        if (max.val() != "")
            filterType.push({ name: "max", value: max.val() });
        if (search.val() != "")
            filterType.push({ name: "search", value: search.val().trim() });
        if (sale.is(':checked'))
            filterType.push({ name: "sale", value: 1 });
        if (this.category != "")
            filterType.push({ name: "category", value: this.category });
        $.ajax({
            url: 'src/php_api/api.php?type=getGoods',
            type: "POST",
            dataType: "json",
            data: { "filterType": JSON.stringify(filterType) },
            success: data => {
                // Если длина массива товаров больше нуля то выводим карточки на экран иначе выводим соответствующую надпись
                data.goods.length > 0 ? this.display(data.goods) : this.showMessage("Ничего не найдено");
            },
            error: er => {
                console.log(er.responseText);
                this.showMessage("Уппс у нас произошли какие-то ошибки<br> Мы уже исправляем");
            }
        });
    }

    // Удаление адреса
    delAdress(id, obj) {
        if (confirm("Вы уверены")) {
            clearTimeout(this.timerAlert);
            console.log($(obj).parent().parent().parent());
            let form = $(obj).parent().parent().parent();
            $.ajax({
                url: 'src/php_api/api.php?type=delAdress',
                type: "POST",
                dataType: "json",
                data: { idAdress: id, 'login': getCookInfo('login'), 'token': getCookInfo('token') },
                success: data => {
                    console.log(data);
                    if (data.status == "OK") {
                        showAlert(form, "Адресс удален", ".alert-success");
                        getAdress();
                    } else {
                        showAlert(form, "Адресс неудален, попробуйте еще раз", ".alert-danger");
                    }
                    this.timerAlert = setTimeout(hideAlert, 3000, form);
                },
                error: er => {
                    console.log(er.responseText);
                    showAlert(form, "Неизвестная ошибка", ".alert-danger");
                    this.timerAlert = setTimeout(hideAlert, 3000, form);
                }
            });
        }
    }

    // Изменение адреса
    editAdress(id, value, obj) {
        clearTimeout(this.timerAlert);
        let form = $(obj).parent().parent().parent();
        $.ajax({
            url: 'src/php_api/api.php?type=editAdress',
            type: "POST",
            dataType: "json",
            data: { 'idAdress': id, 'newAdress': value, 'login': getCookInfo('login'), 'token': getCookInfo('token') },
            success: data => {
                console.log(data);
                if (data.status == "OK") {
                    showAlert(form, "Адресс изменен", ".alert-success");
                    getAdress();
                } else {
                    showAlert(form, "Адресс неизменен, попробуйте еще раз", ".alert-danger");
                }
                this.timerAlert = setTimeout(hideAlert, 3000, form);
            },
            error: er => {
                console.log(er.responseText);
                showAlert(form, "Неизвестная ошибка", ".alert-danger");
                this.timerAlert = setTimeout(hideAlert, 3000, form);
            }
        });
    }

    // Получение категорий из БД
    getCategories() {
        $.ajax({
            url: 'src/php_api/api.php?type=getCategory',
            type: "GET",
            dataType: "json",
            success: data => {
                this.displayCategory(data.categorys);
            },
        });
    }

    // Отображение категорий в список
    displayCategory(arr) {
        let catalog = this.catalogWindow.children();
        catalog.empty();
        catalog.append(this.createCategory("Все товары"));
        for (let i = 0; i < arr.length; i++) {
            catalog.append(this.createCategory(arr[i].category));
        }
    }

    // Отображение товаров в общем поле
    display(arr) {
        let container = $(".row.no-gutters.goods");
        container.empty();
        $(".row").css({ justifyContent: "unset", alignItems: "unset", });
        this.arrGoods = [];
        for (let i = 0; i < arr.length; i++) {
            let good = new CardGood(
                arr[i].id,
                arr[i].title,
                arr[i].price,
                arr[i].sale,
                arr[i].img,
                arr[i].hoverImg,
            );
            // Вызов метода из класса для создание разметки карточки если этот есть в корзине то в метод передается true иначе он вызывается без парметров
            let card = good.searchGood(this.cartClass.cartGoods) ? good.createCard(true) : good.createCard();
            container.append(card);
            this.arrGoods.push({ id: good.id, good: good });
        }
    }

    // Метод для отображение сообщения в общем поле
    showMessage(text) {
        let container = $(".row.no-gutters.goods");
        container.empty();
        container.css({
            justifyContent: "center",
            alignItems: "center",
        });
        $(".row").css({
            justifyContent: "center",
            alignItems: "center",
        });
        container.append(this.createErrorMessage(text));
    }

    // Метод для создания разметки сообщения об ошибке
    createErrorMessage(text) {
        return "<div class=\"err-div\">" +
            "<span class=\"err-mess\">" +
            text +
            "</span>" +
            "</div>"
    }

    // Метод для создания разметки елемента категории
    createCategory(title) {
        return "<li><h5 class=\"card-title\">" + title + "</h5></li>";
    }

    // Метод для проверки что клик произошел по обьекту
    // targetObj куда было нажато
    // object с чем сравниваем
    isClicked(targetObj, object) {
        if (object.is(targetObj) || object.has(targetObj).length > 0)
            return true;
        return false;
    }

    // Определение прехода после нажатия кнопки оформления заказа
    showOrderFin(sendObj, logObj) {
        // Если вход уже был выполнен переходим на окно с заполнение номера телефона и адреса
        // Иначе переходим на окно входа и регистрации
        let modal = isLog ? sendObj : logObj;
        isOrder = isLog ? false : true;
        this.cartWindow.hide();
        modal.show();
    }
}


let isLog = false;
let isOrder = false;
// Работа с документом(страницей)
$(document).ready(function() {
    let window = new MainWindow();

    // Проверяем есть ли данные о пользователе
    if (getCookInfo("login") != null) {
        isCorrectToken(getCookInfo("login"), getCookInfo("token"));
    }

    // Обработка изменения любого фильтра
    $('#min,#max,#discount-checkbox,.search-wrapper_input').on('input',
        function(e) {
            window.getGoods();
        }
    );

    // Обработка всех кликов на странице
    $("body").click(
        function cli(e) {
            window.selectorClick(e.target)
        }
    );
    // заполняем переменную данными, при изменении значения поля file 
    $('input[type=file]').on('change', function() {
        let files = this.files;
        // Отправляем изображение на сервер
        updateImg(files);
    });
});

// Обновление автарки пользователя
function updateImg(files) {
    var data = new FormData();
    let form = $("#out_form .form-container");
    let img = $("#out_form #img");
    clearTimeout(timer);
    // заполняем объект данных файлами в подходящем для отправки формате
    $.each(files, function(key, value) {
        data.append(key, value);
    });

    data.append("login", getCookInfo('login'));
    data.append("token", getCookInfo('token'));
    $.ajax({
        url: 'src/php_api/api.php?type=setImage',
        type: "POST",
        cache: false,
        processData: false,
        contentType: false,
        data: data,
        dataType: "json",
        success: function(data) {
            hideAlert(form)
            console.log(data);
            if (data.status == "OK") {
                showAlert(form, "Изображение обновлено", ".alert-success")
                console.log(form[4]);
                setImage(img, data.data);
            } else {
                showAlert(form, data.text, ".alert-danger")
                console.log(form);
            }
            $('input[type=file]').val(null)
            timer = setTimeout(hideAlert, 3000, form);
        },
        error: function(er) {
            hideAlert(form)
            $('input[type=file]').val(null)
            showAlert(form, "Произошла неизвестная ошибка", ".alert-danger")
            console.log(er.responseText);
            timer = setTimeout(hideAlert, 3000, form);
        }
    });
}

// Функция для обновления данных пользователя
function update(btn) {
    console.log(btn.parent().serializeArray());
    let form = btn.parent();
    $.ajax({
        url: 'src/php_api/api.php?type=updateData',
        type: "POST",
        data: { 'data': JSON.stringify(btn.parent().serializeArray()), "login": getCookInfo("login"), "token": getCookInfo("token") },
        dataType: "json",
        success: function(data) {
            hideAlert(form)
            console.log(data);
            if (data.status == "OK") {
                showAlert(form, "Данные обновлены", ".alert-success")
            } else {
                showAlert(form, data.text, ".alert-danger")
            }
            timer = setTimeout(hideAlert, 3000, form);
        },
        error: function(er) {
            hideAlert(form)
            showAlert(form, "Произошла неизвестная ошибка", ".alert-danger")
            console.log(er.responseText);
            timer = setTimeout(hideAlert, 3000, form);
        }
    });
}
let timer;

// Проверка аутентификации пользователя(обычно нужно после перезагрузки страницы)
function isCorrectToken(login, token) {
    $.ajax({
        url: 'src/php_api/api.php?type=token',
        type: "POST",
        dataType: "json",
        data: { "login": login, "token": token },
        success: function(data) {
            if (data.status == "OK") {
                let form = $("#log_form");
                isLog = true;
                goodRes(form, data, true);
            }
        },

        error: function(er) {}
    });
}


// Выход из аккаунта
function out() {
    setCookInfo("login", null);
    setCookInfo("token", null);
    goodRes($("#reg_form"), null, false);
    location.reload();
}

// Вход или регистрация(code=reg или log)
function In(code) {
    let form = $("#" + code + "_form");
    let arrData = form.serializeArray();
    $.ajax({
        url: 'src/php_api/api.php?type=' + code + 'In',
        type: "POST",
        dataType: "json",
        data: { "data": JSON.stringify(arrData) },
        success: function(data) {
            console.log(data);
            if (data.status != "OK") {
                showAlert(form, data.text);
            } else {
                setCookInfo("token", data.token);
                setCookInfo("login", data.login);
                goodRes(form, data, true);
                if (isOrder) {
                    $(".send_order").show();
                }
            }
            timer = setTimeout(hideAlert, 3000, form);
        },

        error: function(er) {
            showAlert(form, "Неизвестная ошибка");
            console.log(er.responseText);
            timer = setTimeout(hideAlert, 3000, form);
        }
    });
}

// Получение адресов пользователя
function getAdress(form) {
    $.ajax({
        url: 'src/php_api/api.php?type=getAdress',
        type: "POST",
        dataType: "json",
        data: { "login": getCookInfo("login") },
        success: function(data) {
            console.log($(".send_order").children(".form-container"));
            if (data.status != "ER") {
                let list = $("#adrs");
                list.empty();
                $(".send_order #cities").empty();
                for (let i = 0; i < data.adresses.length; i++) {
                    if (i == 0) {
                        $("#city").val(data.adresses[i][0]);
                    }
                    list.append("<div class='adr-el'><input class='form-control' type='text' value='" + data.adresses[i][0] + "'/><button type='button' class='btn btn-primary edit' value='" + data.adresses[i][1] + "'>Изменить</button><button type='button' class='btn btn-primary del' value='" + data.adresses[i][1] + "'>Удалить</button></div>");
                    $(".send_order #cities").append("<option value='" + data.adresses[i][0] + "'>" + data.adresses[i][1] + "</option>");
                }
            }
        },
        error: function(er) {
            console.log(er.responseText);
        }
    });
}

// Получение данных о пользователе
function getUserData(form) {

    $.ajax({
        url: 'src/php_api/api.php?type=getUserData',
        type: "POST",
        dataType: "json",
        data: { "login": getCookInfo("login") },
        success: function(data) {
            console.log(data);
            if (data.status != "ER") {
                form.children(".form-container").children("#out_email").val(data.email);
                form.children(".form-container").children("#out_login").val(data.name);
                form.children(".form-container").children("#out_number").val(data.number);
                $("#number").val(data.number);
                setImage(form.children(".img-container").children().children("#img"), data.image);

            }
        },
        error: function(er) {
            console.log(er.responseText);
        }
    });
}

// Установка изображения на фон элемента
function setImage(object, imgAdress) {
    object.css({
        backgroundImage: "url(" + imgAdress + ")"
    });
}

// Функция вызываемая при успешном входе(bool = true) или выходе (bool = false)
function goodRes(form, data, bool) {
    let block = form.parent();
    block.children("#reg_form").toggle();
    block.children("#log_form").toggle();
    let dataForm = block.children("#out_form");
    dataForm.toggle();
    if (bool) {
        isLog = true;
        block.parent().children(".cart-title").text("Добро пожаловать " + data.login);
        $("#log .desc").text(data.login);

        // Прозванивание на получение данных о пользователе в нужные поля
        getAdress(dataForm);
        getUserData(dataForm);
        getOrders();
    } else {
        isLog = false;
        block.parent().children(".cart-title").text("Вход или Регистрация");
        $("#log .desc").text("Войти");
    }
    block.parent().parent().hide();
}

// Получение данных о заказах
function getOrders() {
    let form = $("#ords")
    form.empty();
    $.ajax({
        url: 'src/php_api/api.php?type=getOrders',
        type: "POST",
        dataType: "json",
        data: { "login": getCookInfo("login") },
        success: function(data) {
            console.log(data);
            if (data.status != "ER") {
                for (let i = 0; i < data.length; i++) {
                    switch (data[i].status) {
                        case 0:
                            form.append("<div class='ord-el'>Заказ с номером " + data[i].ID + " отменен</div>");
                            break;
                        case 1:
                            form.append("<div class='ord-el '>Заказ с номером " + data[i].ID + " в обработке</div>");
                            break;
                        case 2:
                            form.append("<div class='ord-el'>Заказ с номером " + data[i].ID + " в пути</div>");
                            break;
                        case 3:
                            form.append("<div class='ord-el'>Заказ с номером " + data[i].ID + "  Доставлен в пункт самовывоза</div>");
                            break;
                    }
                }
            } else if (data.code == 1) {
                form.append("<div class='ord-el'>Заказов нет</div>");
            }
        },
        error: function(er) {
            console.log(er.responseText);
        }
    });
}

// Показ сообщения в элементе form должна быть скрытая разметка для показа этого сообщения
function showAlert(form, text, type = ".alert") {
    form.children(type).hide();
    form.children(type).text(text);
    form.children(type).show();
}

// Cкрытие сообщения в элементе form должна быть скрытая разметка для скрытия этого сообщения по умолчанию скроет все сообщения
function hideAlert(form = $("div"), type = ".alert", duration = 'slow') {
    form.children(type).hide(duration);
    form.children(type).text("");
}

// Установление куки
function setCookInfo(name, value) {
    $.cookie(name, value);
}

// Чтение куки
function getCookInfo(name) {
    return $.cookie(name);
}