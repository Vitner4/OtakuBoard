// Type: обработка страницы list-page.html
// Author: Vitner4

import { cardStyling } from "./card.js";

// Объект для хранения состояния страницы
const state = {
    limit: 50,
    offset: 0,
    loading: true,
    search: null,
    filter: null,
    fetching: false
};

// DOM элементы
const tileList = document.querySelector(".tile-list"); // Контейнер для карточек
const searchInput = document.getElementById("search-input"); // Поле ввода для поиска
const searchButton = document.getElementById("search-button"); // Кнопка для запуска поиска
const noCardForm = document.getElementById("no_card_form"); // Форма для отображения сообщения "нет карточек"
const textPreview = document.getElementById("text-preview"); // Элемент для отображения текста из карточки
const noCardMessage = document.getElementById("not-found"); // Элемент сообщения о отсутствии карточек
const filterDisplay = document.getElementById("filter-display") // Элемент фильтра отображения
const filterStars = document.querySelectorAll('input[name="rating"]'); // Звёзды рейтинга фильтра
const applyFilters = document.getElementById("apply-filters") // Кнопка активации фильтра
const resetFilters = document.getElementById("reset-filters") // Кнопка сброса фильтра

// Переменные
let selectedStar = 0; // Выбранная звезда рейтинга фильтра

// =======================
// Вспомогательные функции
// =======================

// Сброс списка карточек
function resetCards() {
    tileList.innerHTML = "";
    state.offset = 0;
    state.loading = true;
}

// Отображение карточек
function renderCards(cards) {
    cards.forEach(card => {
        // Если у карточки нет обложки, используем дефолтную
        const coverSrc = card.cover ? `../${card.cover}` : "css/src/img/default/default-card.png";

        tileList.insertAdjacentHTML(
            "beforeend",
            `
            <div id="${card.id}" class="card-container" title="${card.name}">
                <div class="tilt-target">
                    <div class="glare"></div>
                    <div class="card_star">${card.star}</div>
                    <img
                        id="${card.id}_img"
                        class="card-img"
                        src="${coverSrc}"
                    >
                </div>
            </div>
            `
        );
    });

    // Применяем стилизацию карточек
    cardStyling();
}

// Обновление состояния формы "нет карточек"
function updateNoCardsMessage() {
    const hasCards =
        document.querySelectorAll(".card-container").length > 0;
    
    // Скрываем всё по умолчанию
    noCardForm.hidden = true;
    noCardMessage.hidden = true;

    // Если карточки есть — ничего не показываем
    if (hasCards) {
        return;
    }

    // Если есть поисковый запрос
    if (state.search) {
        noCardMessage.hidden = false;
    }
    // Если карточек вообще нет
    else {
        noCardForm.hidden = false;
    }
}

// =================
// Загрузка карточек
// =================
async function loadCards() {

    // Если уже выполняется запрос на загрузку, не запускаем новый
    if (state.fetching) {
        return false;
    }

    state.fetching = true;

    try {
        const response = await eel.get_cards(
            state.limit,
            state.offset,
            state.search,
            state.filter
        )();

        if (response.status !== "success") {
            throw new Error(
                response.message ||
                "Ошибка при загрузке карточек."
            );
        }

        const cards = response.data;

        if (!cards.length) {
            state.loading = false;
            updateNoCardsMessage();

            return false;
        }

        renderCards(cards);

        state.offset += state.limit;

        updateNoCardsMessage();

        return true;

    } catch (error) {
        console.error("Ошибка загрузки карточек:", error);
        return false;
    } finally {
        state.fetching = false;
    }
}

// ===============
// Infinite Scroll
// ===============

const observer = new IntersectionObserver(async entries => {

    if (!entries[0].isIntersecting) {
        return;
    }

    if (!state.loading) {
        return;
    }

    await loadCards();
});

// ======================
// Инициализация страницы
// ======================

document.addEventListener("DOMContentLoaded", async () => {

    try {

        // Первая загрузка
        await loadCards();

        // Infinite scroll
        const trigger = document.getElementById("scroll-trigger");

        if (trigger) {
            observer.observe(trigger);
        }

        // Поиск
        searchButton.addEventListener("click", async () => {

            const query = searchInput.value.trim();

            if (!query) {
                return;
            }

            resetCards();

            state.search = query || null;

            textPreview.textContent = `Поиск: ${query}`;

            await loadCards();
        });

        // Очистка поиска
        searchInput.addEventListener("input", async () => {

            if (searchInput.value.trim()) {
                return;
            }

            resetCards();

            state.search = null;

            textPreview.textContent = "Все карточки"; 

            await loadCards();
        });

        // Фильтр
        applyFilters.addEventListener("click", async () => {
            
            const filterDisplayValue = filterDisplay.value;
            const selectedStarOption = document.querySelector('input[name="optionGroup"]:checked');
  
            const starOptionParam = selectedStarOption ? selectedStarOption.value : null;

            const filterValues = {
                display: filterDisplayValue,
                star: selectedStar,
                starParam: starOptionParam
            }

            state.filter = filterValues;
            
            resetCards();

            textPreview.textContent = "Поиск с фильтрами";

            await loadCards();
        });

        // Сброс фильтра и поиска
        resetFilters.addEventListener("click", async () => {

            filterDisplay.selectedIndex = 0;

            filterStars.forEach(star => {
                star.checked = false;
            });

            document.querySelectorAll('input[name="optionGroup"]').forEach(radio => {
                radio.checked = false;
            });

            state.filter = null;

            state.search = null;

            searchInput.value = "";

            resetCards();

            textPreview.textContent = "Все карточки"; 

            await loadCards();
        });

        // Обработчик события для каждой звезды рейтинга
        filterStars.forEach(star => {
            star.addEventListener("change", () => {
                selectedStar = star.value;
            });
        });

        // Переход на страницу карточки
        document.addEventListener("click", event => {

            const cardContainer =
                event.target.closest(".card-container");

            if (!cardContainer) {
                return;
            }

            const cardId = cardContainer.id;

            window.location.href =
                `page.html?card_id=${cardId}`;
        });

    } catch (error) {
        console.error(
            "Ошибка инициализации страницы:",
            error
        );
    }
});

// Пасхалка №1: Привет от автора
const easterEgg = document.getElementById('easter-egg');
const eeNum = Math.floor(Math.random() * (50 - 1 + 1)) + 1;

if(eeNum == 50) {
    console.log("Congratulations! Easter egg №1 found!");
    easterEgg.removeAttribute('hidden');
    console.log("Easter egg: Hello from Vitner4!");
}