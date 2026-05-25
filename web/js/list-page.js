// Type: обработка страницы list-page.html
// Author: Vitner4

import { cardStyling } from "./card.js"; // Импорт функции стилизации карточек

let CardLoading = true; // Флаг для отслеживания, загружаются ли карточки в данный момент

// Функция получения и отображения карточек на странице
async function loadCards(limit, offset) {
    try {
        // Находим элемент, в который будем добавлять карточки
        const tileList = document.querySelector(".tile-list");

        let response = await eel.get_cards(limit, offset)(); // Получаем карточки из Python backend

        // Проверяем статус ответа и выбрасываем ошибку, если статус не "success"
        if (response.status !== "success") {
            throw new Error(response.message || "Неизвестная ошибка при загрузке карточек на стороне python."); // Выбрасываем ошибку с сообщением из ответа или с общим сообщением
        }

        const cards = response.data; // Получаем массив карточек из ответа
        if (cards && cards.length > 0) {
            // Проходим по каждой карточке и создаём HTML элементы для отображения
            cards.forEach(card => {
                tileList.insertAdjacentHTML('beforeend', 
                    `
                    <div id="${card.id}" class="card-container" title="${card.name}">
                        <div class="tilt-target">
                            <div class="glare"></div>
                            <div class="card_star">${card.star}</div>     
                            <img id="${card.id}_img" class="card-img" src="../${card.cover}" onerror="this.onerror=null; this.src='css/src/img/default/default-card.png';" >
                        </div>
                    </div>
                    `
                );
            });
  
            cardStyling(); // Применяем стилизацию карточек после их загрузки
            
            return true; // Возвращаем true, если карточки успешно получены
        } else {
            CardLoading = false; // Устанавливаем флаг, что все карточки были загружены
            return false; // Возвращаем false, если нет карточек для загрузки
        }     
    }catch (error) {
        console.error("Ошибка при загрузке карточек на стороне python: ", error);
        return false;
    }    
}

// Начальный offset и limit для пагинации
let limit = 50;
let offset = 0;

document.addEventListener('DOMContentLoaded', async () => {
    // Получаем и выводим все карточки на странице
    try {
        if (await loadCards(limit, offset)) {
            if (CardLoading) { // Проверяем, можно ли продолжать загрузку карточек
                offset += limit; // Увеличиваем offset для следующей загрузки
            }
        }

        // Проверка на загрузку карточек и создание запроса на загрузку новых карточек при достижении конца страницы (инфинити скролл)
        const trigger = document.querySelector("#scroll-trigger"); // Элемент, который будет служить триггером для загрузки новых карточек при достижении его видимости

        // Создаём IntersectionObserver для отслеживания видимости триггера
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Загружаем следующую порцию карточек при достижении конца страницы
                if (loadCards(limit, offset)){
                    if (CardLoading) { // Проверяем, можно ли продолжать загрузку карточек
                        offset += limit; // Увеличиваем offset для следующей загрузки
                    }
                } 
            }
        });

        observer.observe(trigger); // Начинаем наблюдение за триггером
    }catch (error) {
        console.error("Ошибка при загрузке карточек:", error);
    }

    // Проверка на наличие карточек и отображение сообщения, если их нет
    const cardsCount = document.querySelectorAll('.card-container').length; // Ищем все карточки и определяем длину
    const noCardForm = document.getElementById('no_card_form'); // Ищем форму отсутствия карточек по ID

    // Если карточек больше 0 — скрываем форму, если 0 — показываем
    if (noCardForm) {
        noCardForm.hidden = cardsCount > 0;
    }
});

// Обработчик кликов на карточки для открытия страницы с подробной информацией о карточке
document.addEventListener('click', (event) => {
    const cardContainer = event.target.closest('.card-container'); // Ищем ближайший элемент с классом 'card-container' от места клика

    if (cardContainer) { // Если такой элемент найден
        const cardId = cardContainer.id; // Получаем ID карточки из атрибута id элемента
        window.location.href = `page.html?card_id=${cardId}`; // Перенаправляем на страницу с подробной информацией о карточке, передавая ID в URL
    }
});

// Пасхалка №1: Привет от автора
    const easterEgg = document.getElementById('easter-egg');
    let eeNum = Math.floor(Math.random() * (50 - 1 + 1)) + 1;

    if(eeNum == 50) {
        console.log("Congratulations! Easter egg №1 found!");
        easterEgg.removeAttribute('hidden');
        console.log("Easter egg: Hello from Vitner4!");
    }