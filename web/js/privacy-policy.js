// Языки для перевода
const translations = {
    ru: {
        policy_title: "Политика конфиденциальности",
        last_updated: "Обновлено: 2025",
        data_collection: "Сбор данных",
        data_collection_text: "Приложение OtakuBoard не собирает и не передаёт никаких личных данных кроме введённого имени пользователя и ID. Вся информация и/или личная информация записывается в файлы и хранится лично на вашем устройстве под вашей ответственностью.",
        data_storage: "Хранение данных",
        data_storage_text: "Все данные сохраняются исключительно на вашем устройстве. Мы не имеем доступа к вашей информации и не передаем её третьим лицам.",
        your_responsibility: "Ваша ответственность",
        your_responsibility_text: "Вы несете ответственность за сохранность вашего устройства и данных, хранящихся на нем.",
    },
    en: {
        policy_title: "Privacy Policy",
        last_updated: "Last updated: 2025",
        data_collection: "Data Collection",
        data_collection_text: "The OtakuBoard application does not collect or transmit any personal data except for the entered username and ID. All information and/or personal information is written to files and stored personally on your device under your responsibility.",
        data_storage: "Data Storage",
        data_storage_text: "All data is stored exclusively on your device. We do not have access to your information and do not share it with third parties.",
        your_responsibility: "Your Responsibility",
        your_responsibility_text: "You are responsible for the security of your device and the data stored on it.",
    }
};

// Класс для управления политикой конфиденциальности
class PrivacyPolicy {
    constructor() {
        // Текущий выбранный язык
        this.currentLang = 'ru';
        this.init();
    }

    // Инициализация основных функций
    init() {
        this.setupLanguageSwitcher(); // Настройка переключателя языков
        this.setupAcceptCheckbox();   // Настройка чекбокса принятия политики
        this.loadLanguage(this.currentLang); // Загрузка выбранного языка
    }

    // Настройка кнопок переключения языков
    setupLanguageSwitcher() {
        const ruBtn = document.getElementById('lang-ru'); // Кнопка русского языка
        const enBtn = document.getElementById('lang-en'); // Кнопка английского языка

        // Обработчик нажатия на кнопку русского языка
        ruBtn.addEventListener('click', () => this.switchLanguage('ru'));
        // Обработчик нажатия на кнопку английского языка
        enBtn.addEventListener('click', () => this.switchLanguage('en'));
    }

    // Настройка чекбокса принятия политики и кнопки подтверждения
    setupAcceptCheckbox() {
        const checkbox = document.getElementById('accept-checkbox'); // Чекбокс принятия
        const acceptBtn = document.getElementById('accept-btn');     // Кнопка подтверждения

        // Обработчик изменения состояния чекбокса
        checkbox.addEventListener('change', () => {
            acceptBtn.disabled = !checkbox.checked; // Включение/отключение кнопки
        });

        // Обработчик нажатия на кнопку подтверждения
        acceptBtn.addEventListener('click', () => {
            if (checkbox.checked) {
                this.showSuccessMessage(); // Показ сообщения об успешном принятии
            }
        });
    }

    // Переключение языка интерфейса
    switchLanguage(lang) {
        this.currentLang = lang;         // Сохранение выбранного языка
        this.updateLanguageButtons();    // Обновление состояния кнопок языков
        this.loadLanguage(lang);         // Загрузка перевода
    }

    // Обновление состояния кнопок языков (активная/неактивная)
    updateLanguageButtons() {
        const ruBtn = document.getElementById('lang-ru'); // Кнопка русского
        const enBtn = document.getElementById('lang-en'); // Кнопка английского

        ruBtn.classList.toggle('active', this.currentLang === 'ru'); // Активность кнопки русского
        enBtn.classList.toggle('active', this.currentLang === 'en'); // Активность кнопки английского
    }

    // Загрузка перевода для выбранного языка
    loadLanguage(lang) {
        const elements = document.querySelectorAll('[data-translate]'); // Все элементы для перевода
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate'); // Ключ перевода
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key]; // Установка текста перевода
            }
        });

        // Установка языка документа
        document.documentElement.lang = lang;
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new PrivacyPolicy();
});