// Translations
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

class PrivacyPolicy {
    constructor() {
        this.currentLang = 'ru';
        this.init();
    }

    init() {
        this.setupLanguageSwitcher();
        this.setupAcceptCheckbox();
        this.loadLanguage(this.currentLang);
    }

    setupLanguageSwitcher() {
        const ruBtn = document.getElementById('lang-ru');
        const enBtn = document.getElementById('lang-en');

        ruBtn.addEventListener('click', () => this.switchLanguage('ru'));
        enBtn.addEventListener('click', () => this.switchLanguage('en'));
    }

    setupAcceptCheckbox() {
        const checkbox = document.getElementById('accept-checkbox');
        const acceptBtn = document.getElementById('accept-btn');

        checkbox.addEventListener('change', () => {
            acceptBtn.disabled = !checkbox.checked;
        });

        acceptBtn.addEventListener('click', () => {
            if (checkbox.checked) {
                this.showSuccessMessage();
            }
        });
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        this.updateLanguageButtons();
        this.loadLanguage(lang);
    }

    updateLanguageButtons() {
        const ruBtn = document.getElementById('lang-ru');
        const enBtn = document.getElementById('lang-en');

        ruBtn.classList.toggle('active', this.currentLang === 'ru');
        enBtn.classList.toggle('active', this.currentLang === 'en');
    }

    loadLanguage(lang) {
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PrivacyPolicy();
});