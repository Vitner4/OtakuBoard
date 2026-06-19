// Type: обработчик страницы index.html
// Author: Vitner4

// ======================
// Инициализация страницы
// ======================

document.addEventListener('DOMContentLoaded', () => {
     
    // ============
    // DOM Элементы
    // ============

    // начальная форма
    const welcomeForm = document.getElementById('welcome-form'); // начальная форма

    // Форма входа в аккаунт
    const loginForm = document.getElementById('login-form'); // форма входа в аккаунт
    const loginBtn = document.getElementById('login-btn'); // кнопка "Открыть форму входа в аккаунт"
    const submitLoginBtn = document.getElementById('submit-login-btn'); // кнопка "Войти" в форме входа в аккаунт
    const loginCloseBtn = document.getElementById('close-login-btn'); // кнопка "Закрыть форму входа в аккаунт"
    let noAccountMessage = document.getElementById('no-account-message'); // Сообщение об отсутствии аккаунтов для входа
    let accountListForm = document.getElementById('account-list'); // Блок списка аккаунтов

    // Форма создания нового аккаунта
    const registerForm = document.getElementById('register-form'); // форма создания нового аккаунта
    const registerBtn = document.getElementById('register-btn'); // кнопка "Открыть форму создания нового аккаунта"
    const submitRegBtn = document.getElementById('submit-reg-btn'); // кнопка "Создать" в форме создания нового аккаунта
    const registerCloseBtn = document.getElementById('close-reg-btn'); // кнопка "Закрыть форму создания нового аккаунта"
 
    // ============================
    // Функции отображения аккаунта
    // ============================

    function renderAccounts(accData) {

        accData.forEach(account => {
            // Если у карточки нет обложки, используем дефолтную
            const avatarSrc = account.avatar ? `../${account.avatar}` : "css/src/img/default/default-card.png";

            accountListForm.insertAdjacentHTML(
                "beforeend",
                `
                <div class="account">
                    <img src="${avatarSrc}" class="account-avatar">

                    <div class="account-info">
                        <p class="account-name">${account.name}</p>
                        <p class="account-id">${account.id}</p>
                    </div>

                    <button type="button" onclick="accountLogin('${account.file_path}')">
                        Войти в аккаунт
                    </button>
                </div>
                `
            );
        });
    }

    // ============================
    // Логика формы входа в аккаунт
    // ============================

    // Обработчик нажатия кнопки "Открыть форму входа в аккаунт"
    loginBtn.addEventListener('click', async () => {

        noAccountMessage.hidden = true; // Скрываем сообщение об отсутствии аккаунтов
        accountListForm.hidden = true; // Скрываем список аккаунтов

        welcomeForm.classList.add('hidden'); // скрываем начальную форму
        loginForm.classList.remove('hidden'); // Открываем форму входа в аккаунт

        // Меняем фон, когда открывается форма входа в аккаунт 
        const element = document.getElementById('body');
  
        // Установка нового фонового изображения
        element.style.backgroundImage = 'url("css/src/img/background/ob-bg-girl-left-login.png")'; 
  
        // Настройка свойств фона
        element.style.backgroundSize = 'cover';
        element.style.backgroundRepeat = 'no-repeat';

        // Запрос на получение всех имеющихся аккаунтов для входа
        response = await eel.find_accounts()();
        
        if(response && response.length !== 0){

            accountListForm.hidden = false;
            
            renderAccounts(response);

        }else{
            noAccountMessage.hidden = false;
        }
    });

    // Обработчик нажатия кнопки "Закрыть форму входа в аккаунт"
    loginCloseBtn.addEventListener('click', () => {

        document.querySelectorAll(".account").forEach(el => el.remove());

        welcomeForm.classList.remove('hidden'); // Показываем начальную форму
        loginForm.classList.add('hidden'); // Закрываем форму входа в аккаунт

        // Возвращаем исходный фон, когда закрывается форма входа в аккаунт
        const element = document.getElementById('body');
  
        // Установка нового фонового изображения
        element.style.backgroundImage = 'url("css/src/img/background/ob-bg-girl-left.png")'; 

        // Настройка свойств фона
        element.style.backgroundSize = 'cover';
        element.style.backgroundRepeat = 'no-repeat';
    });

    // =====================================
    // Логика формы создания нового аккаунта
    // =====================================

    // Обработчик нажатия кнопки "Открыть форму создания нового аккаунта"
    registerBtn.addEventListener('click', () => {

        welcomeForm.classList.add('hidden'); // скрываем начальную форму
        registerForm.classList.remove('hidden'); // Открываем форму создания нового аккаунта
        
        // Меняем фон, когда открывается форма создания нового аккаунта 
        const element = document.getElementById('body');

        // Установка нового фонового изображения
        element.style.backgroundImage = 'url("css/src/img/background/ob-bg-girl-left-reg.png")';

        // Настройка свойств фона
        element.style.backgroundSize = 'cover';
        element.style.backgroundRepeat = 'no-repeat';
    });

    // Обработчик нажатия кнопки "Закрыть форму создания нового аккаунта"
    registerCloseBtn.addEventListener('click', () => {
        
        welcomeForm.classList.remove('hidden'); // Показываем начальную форму
        registerForm.classList.add('hidden'); // Закрываем форму создания нового аккаунта

        // Возвращаем исходный фон, когда закрывается форма создания нового аккаунта
        const element = document.getElementById('body');
  
        // Установка нового фонового изображения
        element.style.backgroundImage = 'url("css/src/img/background/ob-bg-girl-left.png")'; 

        // Настройка свойств фона
        element.style.backgroundSize = 'cover';
        element.style.backgroundRepeat = 'no-repeat';
    });
});