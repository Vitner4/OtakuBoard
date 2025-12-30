// Type: скрипт начальной страницы приложения
// Author: Vitner4

// Ждём, пока загрузится весь HTML
document.addEventListener('DOMContentLoaded', () => {
     

    // Элементы


    // начальная форма
    const welcomeForm = document.getElementById('welcome-form'); // начальная форма
    // Форма входа в аккаунт
    const loginForm = document.getElementById('login-form'); // форма входа в аккаунт
    const loginBtn = document.getElementById('login-btn'); // кнопка "Открыть форму входа в аккаунт"
     const submitLoginBtn = document.getElementById('submit-login-btn'); // кнопка "Войти" в форме входа в аккаунт
    const loginCloseBtn = document.getElementById('close-login-btn'); // кнопка "Закрыть форму входа в аккаунт"
    // Форма создания нового аккаунта
    const registerForm = document.getElementById('register-form'); // форма создания нового аккаунта
    const registerBtn = document.getElementById('register-btn'); // кнопка "Открыть форму создания нового аккаунта"
    const submitRegBtn = document.getElementById('submit-reg-btn'); // кнопка "Создать" в форме создания нового аккаунта
    const registerCloseBtn = document.getElementById('close-reg-btn'); // кнопка "Закрыть форму создания нового аккаунта"
    

    // Логика для формы входа в аккаунт


    // Обработчик нажатия кнопки "Открыть форму входа в аккаунт"
    loginBtn.addEventListener('click', () => {
        welcomeForm.classList.add('hidden'); // скрываем начальную форму
        loginForm.classList.remove('hidden'); // Открываем форму входа в аккаунт

        // Меняем фон, когда открывается форма входа в аккаунт 
        const element = document.getElementById('body');
  
        // Установка нового фонового изображения
        element.style.backgroundImage = 'url("css/src/img/background/ob-bg-girl-left-login.png")'; 
  
        // Настройка свойств фона
        element.style.backgroundSize = 'cover';
        element.style.backgroundRepeat = 'no-repeat';
    });

    // Обработчик нажатия кнопки "Войти" в форме входа в аккаунт
    // submitLoginBtn.addEventListener('click', () => {
    //     // Подтверждение Лицензионного соглашения и Политики конфиденциальности
    //     confirm("Нажимая кнопку, вы соглашаетесь с Лицензионным соглашением и Политикой конфиденциальности приложения OtakuBoard.");
    // });

    // Обработчик нажатия кнопки "Закрыть форму входа в аккаунт"
    loginCloseBtn.addEventListener('click', () => {
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


    // Логика для формы создания нового аккаунта


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

    // Обработчик нажатия кнопки "Создать" в форме создания нового аккаунта
    // submitRegBtn.addEventListener('click', () => {
    //     // Подтверждение Лицензионного соглашения и Политики конфиденциальности
    //     let result = confirm("Нажимая кнопку, вы соглашаетесь с Лицензионным соглашением и Политикой конфиденциальности приложения OtakuBoard.");
    //     if(result == true){
    //         createNewAccount()
    //     }
    // });

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