// Type: редактирование аккаунта приложения на frontend
// Author: Vitner4

import { getSelectedFormat } from "./image-uploader.js"; // Импорт функции получения выбранного формата изображения
import { createImageUploader } from "./image-uploader.js"; // Импорт функции загрузки изображения
import { fileToBase64 } from "./image-uploader.js"; // Импорт функции преобразования файла в строку base64
import { URLViewer } from "./image-uploader.js"; // Импорт функции предпросмотра URL обложки
import { selectionChecker } from "./image-uploader.js"; // Импорт функции взаимного исключения выбора файла и ввода ссылки
import { removeCover } from "./image-uploader.js"; // Импорт функции удаления изображения

// DOM элементы
const avatar = document.getElementById('account-avatar'); // Получаем элемент для аватара
const coverInput = document.getElementById('cover'); // Обложка из проводника
const coverLinkInput = document.getElementById('cover-link'); // Обложка из ссылки

// Переменные 
const fileCover = createImageUploader("cover", "cover-placeholder"); // Получение аватара из файла

// ======================
// Инициализация страницы
// ======================

document.addEventListener('DOMContentLoaded', async () => {

    try {

        const accountData = await eel.sending_account_data()(); // Получаем данные аккаунта

        // Установка имени аккаунта
        document.getElementById('name').value = accountData['name']; // Установка имени аккаунта

        // Установка аватара аккаунта
        const avatar = document.getElementById('account-avatar'); // Получаем элемент для аватара

        if (accountData['avatar'] && accountData['avatar'] !== null) {

            avatar.src = `../${accountData['avatar']}`; // Установка аватара, если он есть
            document.getElementById('cover-message').style.display = "none"; // Скрываем плейсхолдер, если аватар установлен

        }else{
            avatar.style.display = "none"; // Скрываем элемент аватара, если он не установлен
        }
        
    }catch (error) {
        console.error("Ошибка при загрузке данных аккаунта:", error);
    }
});

// =======================
// Вспомогательные функции
// =======================

// Функция проверки на запрещенные символы
function checkInvalidChars(text) {
    const forbidden = /[<>:"\/\\|?*]/;
    return forbidden.test(text);
}

// ============================================
// Методы проверки и отправки данных на backend
// ============================================

// Проверка загрузки обложки из файла
coverInput.addEventListener('change', () => {
        avatar.style.display = "none";
});

// Проверка загрузки URL обложки
coverLinkInput.addEventListener('input', () => {
    if (coverLinkInput.value !== '') {
        avatar.style.display = "none";
    }
});

// Метод просмотра URL обложки 
document.addEventListener('DOMContentLoaded', () => {
    URLViewer("cover-link", "cover-placeholder");
});

// Метод проверки выбранного формата обложки
document.addEventListener('DOMContentLoaded', () => {
    selectionChecker("cover", "cover-link");
});

// Метод удаления обложки
document.getElementById("cover-remove").addEventListener("click", () => {
    avatar.style.display = "none";
    removeCover("cover", "cover-placeholder", "cover-link");
});

// Метод сборки и отправки данных в Python для редактирования аккаунта
document.getElementById("account-edit").addEventListener("click", async () => {

    // Переменные
    const button = document.getElementById("account-edit"); // Кнопка создания карточки
    const statusField = document.getElementById('status'); // Переменная поля статуса

    // Деактивация кнопки на время обработки данных
    button.disabled = true;
    button.style.backgroundColor = '#7e7e7e'; // Изменение цвета кнопки при деактивации

    // Восстанавливаем кнопку через 1,5 секунды, чтобы предотвратить множественные клики
    setTimeout(() => {
        button.disabled = false;
        button.style.backgroundColor = ''; // Восстановление цвета кнопки
    }, 1500);

    // Проверка 
    if(document.getElementById('name').value.trim().length === 0){

        // Получение поля имени и установка красного цвета при ошибке
        const name = document.getElementById('name');
        name.style.borderColor = 'red';

        // Получение статуса и установка цвета при ошибке
        statusField.style.color = 'red';
        statusField.textContent = "Укажите ваше имя!";

    }else{

        if(checkInvalidChars(document.getElementById('name').value) == true){

            // Получение поля имени и установка красного цвета при ошибке
            const name = document.getElementById('name');
            name.style.borderColor = 'red';

            // Получение статуса и установка цвета при ошибке
            statusField.style.color = 'red';
            statusField.textContent = "В имени указаны запрещённые символы!";  
                
        }else{  
            const selectedFormat = getSelectedFormat(); // Получение формата изображения
            let coverData = null; // Данные аватара для отправки в Python
       
            // Если выбран файл изображения
            if (selectedFormat == "file") {

                const file = fileCover.getFile(); // Получаем файл обложки

                // Преобразуем файл в строку base64
                const base64 = await fileToBase64(file, 'status');

                // Формируем объект с именем файла и его base64-данными
                coverData = {
                    name: file.name,
                    data: base64,
                    type: "file"
                };
            }

            // Если введён URL изображения
            else if (selectedFormat == "URL") {

                // Получение поля имени и установка синего цвета при загрузке изображения
                const coverURL = document.getElementById("cover-link").value; // Получение URL обложки
                statusField.style.color = 'blue';
                statusField.textContent = 'Загрузка URL изображения...';

                // Формируем объект
                coverData = {
                    name: coverURL.split('/').pop(), // Получаем имя файла из URL
                    data: coverURL,
                    type: "URL"
                };

            }

            // Если обложка была удалена
            else if (selectedFormat == "remove") {

                coverData = {
                    type: "remove"
                };

            }

            //Если обложка не изменена
            else {

                coverData = {
                    type: null
                };

            }

            // Собираем данные формы для редактирования карточки
            const formData = {
            name: document.getElementById('name').value,
            avatar: coverData
            };

            // Отправляем данные в Python для редактирования аккаунта
            try {
                let func = await eel.account_edit(formData)();

                // Возвращение цвета полей
                const name = document.getElementById('name');
                name.style.borderColor = '#ccc';

                // Статус загрузки данных
                if (func['status'] == 'success') {
                    statusField.style.color = 'green';
                    statusField.textContent = func['message'];
                }

                if (func['status'] == 'error') {
                    statusField.style.color = 'red';
                    statusField.textContent = 'Произошла ошибка при редактировании аккаунта на стороне Python! '+"("+ func['message'] +")";
                }
                
            } catch (error) { 
                statusField.style.color = 'red';
                statusField.textContent = 'Произошла ошибка при редактировании аккаунта на стороне JS! '+"("+ error +")";
            }           
        }  
    }              
});