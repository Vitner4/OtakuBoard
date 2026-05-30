// Type: обработка страницы page.html
// Author: Vitner4

// Получаем ID выбранной карточки и загружаем её информацию на страницу
const queryString = window.location.search; // Берем строку параметров
const urlParams = new URLSearchParams(queryString); // Создаем объект для удобной работы с параметрами
const cardId = urlParams.get('card_id'); // Достаем конкретное значение по имени ключа

// Метод загрузки карточки по ID и отображения её информации на странице
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const cardData = await eel.get_card_by_id(cardId)(); // Получаем данные карточки по её ID
        // Проверяем статус ответа и выводим информацию о карточке на страницу 
        if (cardData['status'] === 'success') { 
            // Название карточки
            if (cardData['data']['name']) {
                    document.getElementById('name').textContent = cardData['data']['name'];
            }
            // Автор карточки
            if (cardData['data']['author']) {
                document.getElementById('author').value = cardData['data']['author'];
            }
            // Жанра карточки
            if (cardData['data']['genre']) {
                document.getElementById('genre').value = cardData['data']['genre'];
            }
            // Год контента карточки
            if (cardData['data']['year']) {
                document.getElementById('year').value = cardData['data']['year'];
            }
            // Тип карточки (аниме, манга, ранобэ и т.д.)
            if (cardData['data']['type']) {
                document.getElementById('content').value = cardData['data']['type'];
            }
            // Ссылка на контент карточки
            const link = document.getElementById('link'); 
            if (cardData['data']['link']) {
                link.href = cardData['data']['link'];
                link.textContent = "Нажми на меня!";
            }else{
                link.href = "#";
                link.removeAttribute("target"); 
                link.textContent = "Ссылка не указана";
            }
            // Комментарии карточки
            if (cardData['data']['description']) {
                document.getElementById('description').value = cardData['data']['description'];
            }
            // Звезда рейтинга карточки
            if (cardData['data']['star']) {
                document.getElementById('rating-star').textContent = cardData['data']['star'];
            }
            // Дата создания карточки
            if (cardData['data']['timestamp']) {
                // Форматируем дату в более читаемый вид (например, "2024-06-01 14:30:00" -> "1 июня 2024 г., 14:30")
                timestamp = new Date(cardData['data']['timestamp']);
                const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                const formattedDate = timestamp.toLocaleDateString('ru-RU', options);
                // Выводим отформатированную дату на страницу
                document.getElementById('timestamp').textContent = `Дата создания: ${formattedDate}`;
            }
            // Изображение карточки
            if (cardData['data']['cover']) {
                document.getElementById('cover').src =`../${cardData['data']['cover']}`;
                document.getElementById('cover-message').style.display = "none"; // Скрываем сообщение об отсутствии изображения, если обложка есть
            }else{
                document.getElementById('cover').style.display = "none"; // Скрываем элемент изображения, если обложки нет
            }
        }else {
            throw new Error(cardData['message'] || "Неизвестная ошибка при загрузке карточки на стороне python."); // Выбрасываем ошибку
        }
    }catch (error) {
        console.error("Ошибка при загрузке карточки на стороне python: ", error);
    }
});

// Метод перехода на страницу редактирования карточки и передача ID карточки через URL
const button = document.getElementById('page-edit');

button.addEventListener('click', () => {
    event.preventDefault(); // Предотвращаем стандартное поведение ссылки, чтобы не произошло перезагрузки страницы при клике на кнопку
    window.location.href = `page-edit.html?card_id=${encodeURIComponent(cardId)}`; // Кодируем данные карточки в строку и передаем через URL
});
