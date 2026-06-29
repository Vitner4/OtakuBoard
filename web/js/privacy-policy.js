// Type: обработка страницы privacy-policy.html
// Author: Vitner4

// Языки для перевода
const translations = {
    ru: {
        policy_title: "Политика конфиденциальности",
        last_updated: "Обновлено: 2025",

        data_collection: "Сбор данных",
        data_collection_text: "Приложение OtakuBoard не собирает, не передаёт и не хранит ваши данные на сторонних серверах. Единственными данными, которые могут быть сохранены, являются указанные вами имя пользователя, идентификатор (ID), а также информация, создаваемая в процессе использования приложения.",

        data_storage: "Хранение данных",
        data_storage_text: "Все данные приложения, включая настройки, информацию аккаунта и пользовательский контент, сохраняются исключительно на вашем устройстве в локальных файлах. Разработчик не имеет доступа к этим данным и не передаёт их третьим лицам.",

        your_responsibility: "Ваша ответственность",
        your_responsibility_text: "Вы самостоятельно несёте ответственность за сохранность, резервное копирование и защиту данных, хранящихся на вашем устройстве. Рекомендуется регулярно создавать резервные копии важных данных."
    },

    en: {
        policy_title: "Privacy Policy",
        last_updated: "Last updated: 2025",

        data_collection: "Data Collection",
        data_collection_text: "OtakuBoard does not collect, transmit, or store your data on external servers. The only data that may be stored includes the username, ID, and information created while using the application.",

        data_storage: "Data Storage",
        data_storage_text: "All application data, including settings, account information, and user content, is stored exclusively on your device in local files. The developer does not have access to this data and does not share it with third parties.",

        your_responsibility: "Your Responsibility",
        your_responsibility_text: "You are solely responsible for the security, backup, and protection of the data stored on your device. Regular backups of important data are recommended."
    }
};

// =============================================
// Класс управления политикой конфиденциальности
// =============================================

class PrivacyPolicy {

    constructor() {
        
        // Текущий выбранный язык
        this.currentLang = 'ru';
        this.init();
        
    }

    // Инициализация основных функций
    init() {
        this.setupLanguageSwitcher(); // Настройка переключателя языков
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

// ===========================================
// Инициализация приложения после загрузки DOM
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    new PrivacyPolicy();
});