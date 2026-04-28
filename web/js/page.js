// Type: обработка страницы page.html
// Author: Vitner4

// Получаем ID выбранной карточки и загружаем её информацию на страницу
const queryString = window.location.search; // Берем строку параметров
const urlParams = new URLSearchParams(queryString); // Создаем объект для удобной работы с параметрами
const cardId = urlParams.get('card_id'); // Достаем конкретное значение по имени ключа

// TODO: Метод загрузки карточки по ID и отображения её информации на странице
//...
