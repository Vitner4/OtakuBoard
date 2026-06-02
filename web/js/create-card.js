// Type: работа с карточками на frontend
// Author: Vitner4

import { getSelectedFormat } from "./image-uploader.js"; // Импорт функции получения выбранного формата изображения
import { createImageUploader } from "./image-uploader.js"; // Импорт функции загрузки изображения
import { fileToBase64 } from "./image-uploader.js"; // Импорт функции преобразования файла в строку base64
import { URLViewer } from "./image-uploader.js"; // Импорт функции предпросмотра URL обложки
import { selectionChecker } from "./image-uploader.js"; // Импорт функции взаимного исключения выбора файла и ввода ссылки
import { removeCover } from "./image-uploader.js"; // Импорт функции удаления изображения

// Переменные 
const cardCover = createImageUploader("cover", "cover-preview"); // Получение обложки из файла 
const stars = document.querySelectorAll('input[name="rating"]'); // Звёзды рейтинга 
let selectedStar = 0 // Выбранная звезда рейтинга (0 по умолчанию)

// Обработчик события для каждой звезды рейтинга
stars.forEach(star => {
    star.addEventListener("change", () => {
        selectedStar = star.value;
    });
});

// Функция проверки на запрещенные символы
function checkInvalidChars(text) {
    const forbidden = /[<>:"\/\\|?*]/;
    return forbidden.test(text);
}

// Метод просмотра URL обложки 
document.addEventListener('DOMContentLoaded', () => {URLViewer("cover-link", "cover-preview")});

// Метод проверки выбранного формата обложки
document.addEventListener('DOMContentLoaded', () => {selectionChecker("cover", "cover-link")});

// Метод удаления обложки
document.getElementById("cover-remove").addEventListener("click", () => removeCover("cover", "cover-preview", "cover-link")); 

// Метод отправки данных в Python для создания новой карточки
document.getElementById("create-btn").addEventListener("click", async () => {
    // Переменные
    const button = document.getElementById("create-btn"); // Кнопка создания карточки
    const statusField = document.getElementById('status'); // Переменная поля статуса

    // Деактивация кнопки на время обработки данных
    button.disabled = true;
    button.style.backgroundColor = '#ccc'; // Изменение цвета кнопки при деактивации

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
        statusField.textContent = "Укажите название карточки!";
    }else{
        if(checkInvalidChars(document.getElementById('name').value) == true){
            // Получение поля имени и установка красного цвета при ошибке
            const name = document.getElementById('name');
            name.style.borderColor = 'red';
            // Получение статуса и установка цвета при ошибке
            statusField.style.color = 'red';
            statusField.textContent = "В названии карточки указаны запрещённые символы!";      
        }else{  
            const now = new Date(); // Получение текущей даты    
            const selectedFormat = getSelectedFormat(); // Получение формата изображения
            let coverData = null; // Данные обложки
       
            // Если выбран файл изображения
            if (selectedFormat == "file") {
                const file = cardCover.getFile(); // Получаем файл обложки

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

            // Собираем данные формы
            const formData = {
            id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2,10)}`, 
            name: document.getElementById('name').value,
            author: document.getElementById('author').value,
            genre: document.getElementById('genre').value,
            year: document.getElementById('year').value,
            type: document.getElementById('type').value,
            link: document.getElementById('link').value,
            description: document.getElementById('description').value,
            star: selectedStar,
            timestamp: new Date().toISOString(),
            cover: coverData
            };

            // Отправляем данные в Python
            try {
                let func = await eel.add_card(formData)();
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
                    statusField.textContent = 'Произошла ошибка при создании карточки на стороне Python! '+"("+ func['message'] +")";
                }
            } catch (error) { 
                statusField.style.color = 'red';
                statusField.textContent = 'Произошла ошибка при создании карточки на стороне JS! '+"("+ error +")";
            }
        }  
    }              
});
