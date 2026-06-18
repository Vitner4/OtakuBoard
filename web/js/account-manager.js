// Type: обработчик frontend. Функции создания или входа в аккаунт приложения на странице index.html
// Author: Vitner4

// Структура директорий и файлов
acc_symbol  = '@' // Символ аккаунта 
acc_suffix = ".ob" // Суффикс директории аккаунта
acc_type = "-ob.json" // Файл аккаунта

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
async function accountLogin(acc_path){

    // Собираем данные
    const formData = {
            link: acc_path,
            write_data_to_config: "true"
    };

    // Отправляем данные
    func = await eel.account_login(formData)();

    if(func['status'] == 'success'){
        // Установка статуса
        const statusField = document.getElementById('login-status');
        statusField.style.color = 'green';
        statusField.textContent = "Аккаунт найден!";

        // Переход на страницу list-page.html после успешного входа в аккаунт
        window.location.href = "list-page.html";
    }else{
        // Установка статуса
        const statusField = document.getElementById('login-status');
        statusField.style.color = 'red';
        statusField.textContent = func['message'];
    }
}  