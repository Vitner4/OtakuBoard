// Получаем все блоки звёзд на карточках
const stars = document.querySelectorAll('.star-icon');

// Установка цвета блока звёзд на карточке
stars.forEach(stars => {
    const value = parseInt(stars.textContent);
    if(value == 0){
        stars.style = "background-color: #444444ff";
    }
    if(value >= 1 && value <= 3){
        stars.style = "background-color: #df1212ff";
    }
    if(value >= 4 && value <= 6){
        stars.style = "background-color: #e7d210ff";
    }
     if(value >= 7 && value <= 9){
        stars.style = "background-color: #0db10dff";
    }
    if(value == 10){
        stars.style = "background: linear-gradient(22deg,rgba(140, 72, 0, 1) 0%, rgba(158, 98, 14, 1) 0%, rgba(255, 215, 0, 1) 100%)";
    }   
});

