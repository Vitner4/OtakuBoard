// Type: обработка страницы page-edit.html и редактирование карточки
// Author: Vitner4

import { getSelectedFormat } from "./image-uploader.js"; // Импорт функции получения выбранного формата изображения
import { createImageUploader } from "./image-uploader.js"; // Импорт функции загрузки изображения
import { fileToBase64 } from "./image-uploader.js"; // Импорт функции преобразования файла в строку base64
import { URLViewer } from "./image-uploader.js"; // Импорт функции предпросмотра URL обложки
import { selectionChecker } from "./image-uploader.js"; // Импорт функции взаимного исключения выбора файла и ввода ссылки
import { removeCover } from "./image-uploader.js"; // Импорт функции удаления изображения


// Загрузка карточки //


// Получаем данные карточки из URL
const queryString = window.location.search; // Берем строку параметров
const urlParams = new URLSearchParams(queryString); // Создаем объект для удобной работы с параметрами
const cardId = urlParams.get('card_id'); // Достаем конкретное значение по имени ключа
let selectedStar; // Выбранная звезда рейтинга 

// Метод загрузки карточки по ID и отображения её информации на странице
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const cardData = await eel.get_card_by_id(cardId)(); // Получаем данные карточки по её ID
        // Проверяем статус ответа и выводим информацию о карточке на страницу 
        if (cardData['status'] === 'success') { 
            // Название карточки
            if (cardData['data']['name']) {
                    document.getElementById('name').value = cardData['data']['name'];
            }
            // Автор карточки
            if (cardData['data']['author']) {
                document.getElementById('author').value = cardData['data']['author'];
            }
            // Год контента карточки
            if (cardData['data']['year']) {
                document.getElementById('year').value = cardData['data']['year'];
            }
            // Жанра карточки
            if (cardData['data']['genre']) {
                document.getElementById('genre').value = cardData['data']['genre'];
            }
            // Тип карточки (аниме, манга, ранобэ и т.д.)
            if (cardData['data']['type']) {
                document.getElementById('content').value = cardData['data']['type'];
            }
            // Ссылка на контент карточки 
            if (cardData['data']['link']) {     
                document.getElementById('link').value = cardData['data']['link'];              
            }
            // Комментарии карточки
            if (cardData['data']['description']) {
                document.getElementById('description').value = cardData['data']['description'];
            }
            // Звезда рейтинга карточки
            if (cardData['data']['star']) {
                if (cardData['data']['star'] > "0" & cardData['data']['star'] <= "10") {
                    const starId = `star${cardData['data']['star']}`; // Формируем ID звезды на основе значения рейтинга
                    const star = document.getElementById(starId); // Получаем элемент звезды по сформированному ID
                    selectedStar = cardData['data']['star']; // Устанавливаем звезду рейтинга в переменную
                    star.checked = true; // Устанавливаем выбранную звезду в соответствии с рейтингом карточки
                }
            }
            // Изображение карточки
            if (cardData['data']['cover']) {
                document.getElementById('installed-cover').src =`../${cardData['data']['cover']}`;
                document.getElementById('cover-message').style.display = "none"; // Скрываем сообщение об отсутствии изображения, если обложка есть
            }else{
                document.getElementById('installed-cover').style.display = "none"; // Скрываем элемент изображения, если обложки нет
            }
        }else {
            throw new Error(cardData['message'] || "Неизвестная ошибка при загрузке карточки на стороне python."); // Выбрасываем ошибку
        }
    }catch (error) {
        console.error("Ошибка при загрузке карточки на стороне python: ", error);
    }
});


// Проверка и отправка карточки для редактирования //


// Переменные 
const cardCover = createImageUploader("cover", "cover-preview"); // Получение обложки из файла
const stars = document.querySelectorAll('input[name="rating"]'); // Звёзды рейтинга 

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

// Проверка загрузки обложки из файла
const coverInput = document.getElementById('cover');

coverInput.addEventListener('change', () => {
     document.getElementById('installed-cover').style.display = "none";
});

// Проверка загрузки URL обложки
const coverLinkInput = document.getElementById('cover-link');

coverLinkInput.addEventListener('input', () => {
     if (coverLinkInput.value !== '') {
        document.getElementById('installed-cover').style.display = "none";
    }
});

// Метод просмотра URL обложки 
document.addEventListener('DOMContentLoaded', () => {
    URLViewer("cover-link", "cover-preview");
});

// Метод проверки выбранного формата обложки
document.addEventListener('DOMContentLoaded', () => {
    selectionChecker("cover", "cover-link");
});

// Метод удаления обложки
document.getElementById("cover-remove").addEventListener("click", () => {
    document.getElementById('installed-cover').style.display = "none";
    removeCover("cover", "cover-preview", "cover-link");
}); 

// Метод отправки данных в Python для редактирования карточки
document.getElementById("edit-btn").addEventListener("click", async () => {
    // Переменные
    const button = document.getElementById("edit-btn"); // Кнопка редактирования карточки
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
            author: document.getElementById('author').value,
            genre: document.getElementById('genre').value,
            year: document.getElementById('year').value,
            type: document.getElementById('content').value,
            link: document.getElementById('link').value,
            description: document.getElementById('description').value,
            star: selectedStar,
            cover: coverData
            };

            // Отправляем данные в Python
            try {
                let func = await eel.edit_card(cardId, formData)();
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

// Метод перехода на страницу просмотра карточки и передача ID карточки через URL
const button = document.getElementById('page-view'); // Обработчик клика по кнопке "Просмотр" для перехода на страницу просмотра карточки

button.addEventListener('click', () => {
    event.preventDefault(); // Предотвращаем стандартное поведение ссылки, чтобы не произошло перезагрузки страницы при клике на кнопку
    window.location.href = `page.html?card_id=${encodeURIComponent(cardId)}`; // Кодируем данные карточки в строку и передаем через URL
});

// Функция удаления карточки
const deleteButton = document.getElementById('delete-btn'); // Получаем кнопку удаления карточки

deleteButton.addEventListener('click', async () => {
    if (confirm("Вы уверены, что хотите удалить эту карточку?")) { // Подтверждение удаления карточки
        try {
            let func = await eel.delete_card(cardId)(); // Отправляем запрос на удаление карточки в Python
            if (func['status'] == 'success') {
                alert(func['message']); // Выводим сообщение об успешном удалении карточки
                window.location.href = 'list-page.html'; // Переходим на главную страницу после удаления карточки
            }
            if (func['status'] == 'error') {
                alert('Произошла ошибка при удалении карточки на стороне Python! '+"("+ func['message'] +")"); // Выводим сообщение об ошибке при удалении карточки
            }
        } catch (error) {
            alert('Произошла ошибка при удалении карточки на стороне JS! '+"("+ error +")"); // Выводим сообщение об ошибке при удалении карточки
        }
     }
});