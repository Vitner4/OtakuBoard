// Пасхалка №1: Привет от автора
easterEgg = document.getElementById('easter-egg');
let eeNum = Math.floor(Math.random() * (50 - 1 + 1)) + 1;

if(eeNum == 50) {
    console.log("Congratulations! Easter egg №1 found!");
    easterEgg.removeAttribute('hidden');
    console.log("Easter egg: Hello from Vitner4!");
}

// Проверка на наличие карточек и отображение сообщения, если их нет
const cardsCount = document.querySelectorAll('.card-container').length; // Ищем все карточки и определяем длину
const noCardForm = document.getElementById('no_card_form'); // Ищем форму отсутствия карточек по ID

// Если карточек больше 0 — скрываем форму, если 0 — показываем
if (noCardForm) {
    noCardForm.hidden = cardsCount > 0;
}

