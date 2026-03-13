// Type: работа с карточками на frontend
// Author: Vitner4

import { createImageUploader } from "./image-uploader.js"; // Импорт функции загрузки изображения
import { removeCover } from "./image-uploader.js"; // Импорт функции удаления изображения

// Переменные 
const cardCover = createImageUploader("cover", "cover-preview"); // Получение обложки карточки
const stars = document.querySelectorAll('input[name="rating"]'); // Звёзды рейтинга 
let selectedStar = 0 // Выбранная звезда рейтинга (0 по умолчанию)

// Обработчик события для каждой звезды рейтинга
stars.forEach(star => {
    star.addEventListener("change", () => {
        console.log(star.value)
        selectedStar = star.value;
    });
});

// Функция проверки на запрещенные символы
function checkInvalidChars(text) {
    const forbidden = /[<>:"\/\\|?*]/;
    return forbidden.test(text);
}

// Функция преобразования файла в строку base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader(); // Создаём FileReader для чтения файла

        reader.readAsDataURL(file); // Читаем файл как DataURL (base64)

        reader.onload = () => resolve(reader.result); // При успешном чтении возвращаем результат
        reader.onerror = error => reject(error); // При ошибке возвращаем ошибку
    });
}

// Метод удаления обложки
document.getElementById("cover-remove").addEventListener("click", () => removeCover("cover", "cover-preview", "cover-link")); 

// Метод отправки данных в Python для создания новой карточки
document.getElementById("create-btn").addEventListener("click", async () => {
    // Переменные
    let statusField = null; // Переменная поля статуса

    // Проверка 
    if(document.getElementById('name').value.trim().length === 0){
        // Получение поля имени и установка красного цвета при ошибке
        const name = document.getElementById('name');
        name.style.borderColor = 'red';
        // Получение статуса и установка цвета при ошибке
        const statusField = document.getElementById('status');
        statusField.style.color = 'red';
        statusField.textContent = "Укажите название карточки!";
    }else{
        if(checkInvalidChars(document.getElementById('name').value) == true){
            // Получение поля имени и установка красного цвета при ошибке
            const name = document.getElementById('name');
            name.style.borderColor = 'red';
            // Получение статуса и установка цвета при ошибке
            statusField = document.getElementById('status');
            statusField.style.color = 'red';
            statusField.textContent = "В названии карточки указаны запрещённые символы!";      
        }else{           
            const file = cardCover.getFile(); // Получаем файл обложки, если он выбран
            let coverData = null; // Данные обложки с обновленными в base64 данными изображения
            
            if (file) {
                // Преобразуем файл в строку base64
                const base64 = await fileToBase64(file);

                // Формируем объект с именем файла и его base64-данными
                coverData = {
                    name: file.name,
                    data: base64
                };
            }

            // Собираем данные формы
            const formData = {
            id: `card_${Date.now().toString(36)}${Math.random().toString(36).slice(2,10)}`, 
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
                statusField = document.getElementById('status');

                if (func['status'] == 'success') {
                    statusField.style.color = 'green';
                    statusField.textContent = 'Карточка успешно создана!';
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
