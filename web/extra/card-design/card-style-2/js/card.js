// Получаем все блоки звёзд на карточках
const stars = document.querySelectorAll('.card_star'); 

// Установка цвета блока звёзд на карточке
stars.forEach(stars => {
    const value = parseInt(stars.textContent);
    if(value == 0){
        stars.style = "background-color: rgb(139, 139, 139)";
    }
    if(value >= 1 && value <= 3){
        stars.style = "background-color: rgb(220, 20, 20)";
    }
    if(value >= 4 && value <= 6){
        stars.style = "background-color: rgb(228, 186, 16)";
    }
     if(value >= 7 && value <= 9){
        stars.style = "background-color: rgb(24, 217, 24)";
    }
    if(value == 10){
        stars.style = "background: linear-gradient(22deg,rgba(140, 72, 0, 1) 0%, rgba(158, 98, 14, 1) 0%, rgba(255, 215, 0, 1) 100%)";
    }   
});

// 3D анимация карточки при наведении мыши
const containers = document.querySelectorAll('.card-container'); // Выбираем ВСЕ контейнеры карточек

containers.forEach(container => {
    // Находим цель для наклона ВНУТРИ текущего контейнера
    const card = container.querySelector('.tilt-target');

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        
        // Вычисляем позицию мыши относительно текущей карточки
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const degX = y * -20; 
        const degY = x * 20;

        card.style.transform = `rotateX(${degX}deg) rotateY(${degY}deg) scale(1.05)`;
    });

    container.addEventListener('mouseleave', () => {
        // Сбрасываем именно эту карточку
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
});
