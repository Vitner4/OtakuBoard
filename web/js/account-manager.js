// Type: менеджер аккаунтов приложения на frontend
// Author: Vitner4

// Структура директорий и файлов
acc_symbol  = '@' // Символ аккаунта 
acc_suffix = ".ob" // Суффикс директории аккаунта
acc_type = "-ob.json" // Файл аккаунта

// Функция загрузки данных аккаунта при входе на страницу
window.onload = function() {
    getData();
};

// Функция проверки данных на отсутствие символов
function checkData(text){
    return text.trim().length;
}

// Функция проверки на запрещенные символы
function checkInvalidChars(text) {
    const forbidden = /[<>:"\/\\|?*@!#№$^%.;{}&+=()\[\]]/;
    return forbidden.test(text);
}

// Функция создания нового аккаунта
async function createNewAccount(){
    // Статус проверка
    let nameStatus = false
    let idStatus = false

    // Проверка
    if(checkData(document.getElementById('regID').value) === 0){
        // Установка цвета обводки поля
        let id = document.getElementById('regID');
        id.style.borderColor = 'red';
        // Установка статуса
        const statusField = document.getElementById('status');
        statusField.style.color = 'red';
        statusField.textContent = "Заполните поле ID аккаунта!";      
    }else if (checkInvalidChars(document.getElementById('regID').value) == true){
        // Установка цвета обводки поля
        let id = document.getElementById('regID');
        id.style.borderColor = 'red';
        // Установка статуса
        const statusField = document.getElementById('status');
        statusField.style.color = 'red';
        statusField.textContent = "Найдены недопустимые символы в поле ID аккаунта!"; 
    }else{
        // Установка цвета обводки поля
        let id = document.getElementById('regID');
        id.style.borderColor = 'rgba(255, 255, 255, 0.2)';

        let input = document.getElementById('regID');
        // Применяем стили (аналог :focus)
        input.style.outline = 'none';
        input.style.borderColor = '#a66eff';

        // Чтобы вернуть назад (аналог потери фокуса)
        input.style.outline = '';
        input.style.borderColor = '';

        // Проверка пройдена успешно
        idStatus = true
    }

    if(checkData(document.getElementById('regName').value) === 0){
        // Установка цвета обводки поля
        let name = document.getElementById('regName');
        name.style.borderColor = 'red';
        // Установка статуса
        const statusField = document.getElementById('status');
        statusField.style.color = 'red';
        statusField.textContent = "Заполните поле имени аккаунта!";      
    }else if (checkInvalidChars(document.getElementById('regName').value) == true){
        // Установка цвета обводки поля
        let name = document.getElementById('regName');
        name.style.borderColor = 'red';
        // Установка статуса
        const statusField = document.getElementById('status');
        statusField.style.color = 'red';
        statusField.textContent = "Найдены недопустимые символы в поле имени аккаунта!";  
    }else{
        // Установка цвета обводки поля
        let name = document.getElementById('regName');
        name.style.borderColor = 'rgba(255, 255, 255, 0.2)';

        let input = document.getElementById('regName');
        // Применяем стили (аналог :focus)
        input.style.outline = 'none';
        input.style.borderColor = '#a66eff';

        // Чтобы вернуть назад (аналог потери фокуса)
        input.style.outline = '';
        input.style.borderColor = '';

        // Проверка пройдена успешно
        nameStatus = true;
    }

    // Создание нового аккаунта
    if(nameStatus == true && idStatus == true){
        // Собираем данные
        const formData = {
            name: document.getElementById('regName').value,
            id: document.getElementById('regID').value
        };

        // Процесс создания нового аккаунта
        func = await eel.create_new_account(formData)();

        if(func['status'] == 'success'){
            // Установка статуса
            const statusField = document.getElementById('status');
            statusField.style.color = 'green';
            statusField.textContent = "Аккаунт успешно создан!";

            // Переход на страницу list-page.html после успешного создания аккаунта
            window.location.href = "list-page.html";
        }else{
            // Установка статуса
            const statusField = document.getElementById('status');
            statusField.style.color = 'red';
            statusField.textContent = func['message'];
        }
    }
}

// Функция входа в аккаунт
async function accountLogin(){
    // Проверка данных
    if (checkData(document.getElementById('link-field').value) === 0){
        // Установка цвета обводки поля
        let input = document.getElementById('link-field');
        input.style.borderColor = 'red';
        // Установка статуса
        const statusField = document.getElementById('login-status');
        statusField.style.color = 'red';
        statusField.textContent = "Введите ссылку, чтобы войти в аккаунт!";
    }else if(checkData(document.getElementById('link-field').value) == acc_suffix && checkData(document.getElementById('link-field').value) == acc_symbol){
        // Установка цвета обводки поля
        let input = document.getElementById('link-field');
        input.style.borderColor = 'red';
        // Установка статуса
        const statusField = document.getElementById('login-status');
        statusField.style.color = 'red';
        statusField.textContent = "Неверная ссылка!";
    }else{
        // Собираем данные
        const formData = {
                link: document.getElementById('link-field').value,
                write_data_to_config: "true"
        };

        // Отправляем данные
        func = await eel.account_login(formData)();

        if(func['status'] == 'success'){
            // Установка цвета обводки поля
            let border = document.getElementById('link-field');
            border.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            // Применяем стили (аналог :focus)
            let borderFocus = document.getElementById('link-field');
            borderFocus.style.outline = 'none';
            borderFocus.style.borderColor = '#a66eff';
            // Установка статуса
            const statusField = document.getElementById('login-status');
            statusField.style.color = 'green';
            statusField.textContent = "Аккаунт найден!";

            // Переход на страницу list-page.html после успешного входа в аккаунт
            window.location.href = "list-page.html";
        }else{
             // Установка цвета обводки поля
            let input = document.getElementById('link-field');
            input.style.borderColor = 'red';
            // Установка статуса
            const statusField = document.getElementById('login-status');
            statusField.style.color = 'red';
            statusField.textContent = func['message'];
        }
    }  
}

// Функция получения данных аккаунта
async function getData(){
    // Процесс получения данных аккаунта
    func = await eel.sending_account_data()();

    // Получение количества карточек
    countCards = await eel.get_cards_count()();

    // Установка данных аккаунта
    document.getElementById('account-name').textContent = func['name']; 
    document.getElementById('account-id').textContent = func['id'];
    document.getElementById('account-reg-data').textContent = "Аккаунт создан: " + func['timestamp'];
    document.getElementById('account-all-cards').textContent = "Всего карточек: " + countCards['count'];
    // document.getElementById('account-all-groups').textContent = "Всего групп: " + func['groups'];  

    // Установка аватара
    const avatar = document.getElementById('account-avatar');
    if (func['avatar'] && func['avatar'] !== null) {
        avatar.src = `../${func['avatar']}`; // Установка аватара, если он есть
    }else{
        avatar.src = "css/src/img/default/default-avatar.jpg"; // Скрываем элемент аватара, если он не установлен
    }
}
 
// Функция выхода из аккаунта
logoutBtn = document.getElementById('account-logout');

async function accountLogout(){
    // Процесс выхода из аккаунта
    func = await eel.account_logout("true")();
    
    if(func['status'] == 'success'){
        // Переход на начальную страницу после успешного выхода из аккаунта
        window.location.href = "index.html";
    }
    else{
        // Вывод ошибки при неудачном выходе из аккаунта
        alert("Ошибка при выходе из аккаунта: " + func['message']);
    }
}

// Отслеживание действия выхода из аккаунта по нажатию кнопки
logoutBtn.addEventListener('click', () => {
    accountLogout();
});