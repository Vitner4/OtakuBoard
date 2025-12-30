// Type: работа с карточками на frontend
// Author: Vitner4

let star = "0"; // Переменная для хранения выбранной звезды рейтинга

// Получение выбранной звезды рейтинга
function getSelectedStar(starID) {
    let starChosen = document.getElementById(starID);
    star = starChosen.value;
}

// Функция получения локальной обложки из поля
function getLocalCover() {
    try {
        coverLink = document.getElementById('cover-preview-img').src
        return coverLink;
    }catch (error) {
        return "";
    }
}

// Функция проверки на запрещенные символы
function checkInvalidChars(text) {
    const forbidden = /[<>:"\/\\|?*]/;
    return forbidden.test(text);
}

// Функция отправки данных в Python для создания новой карточки
async function createNewCard() {
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
            const statusField = document.getElementById('status');
            statusField.style.color = 'red';
            statusField.textContent = "В названии карточки указаны запрещённые символы!";      
        }else{
            // Собираем данные формы
            const formData = {
            name: document.getElementById('name').value,
            author: document.getElementById('author').value,
            genre: document.getElementById('genre').value,
            year: document.getElementById('year').value,
            type: document.getElementById('type').value,
            link: document.getElementById('link').value,
            description: document.getElementById('description').value,
            star: star,
            timestamp: new Date().toISOString(),
            cover: getLocalCover(),
            URLcover: document.getElementById('cover-link').value
            };

            // Отправляем данные в Python
            try {
                func = await eel.create_card(formData)();
                // Возвращение цвета полей
                const name = document.getElementById('name');
                name.style.borderColor = '#ccc';
                // Статус загрузки данных
                const statusField = document.getElementById('status');

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
}
