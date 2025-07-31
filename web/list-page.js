
// Ждем полной загрузки DOM-дерева перед выполнением скрипта
document.addEventListener('DOMContentLoaded', function() {
    // Находим все элементы с классом 'tile'
    const tiles = document.querySelectorAll('.tile');
    
    // Перебираем все найденные плитки
    tiles.forEach(tile => {
        // Ищем изображение внутри текущей плитки
        const img = tile.querySelector('.tile-img');
        // Если изображение не найдено, пропускаем эту плитку
        if (!img) return;
        
        // Проверяем, загружено ли изображение
        if (img.complete) {
            // Если изображение уже загружено, сразу устанавливаем цвет
            setTileColor(tile, img);
        } else {
            // Если изображение еще загружается, добавляем обработчики событий:
            // 1. На успешную загрузку
            img.addEventListener('load', () => setTileColor(tile, img));
            // 2. На ошибку загрузки
            img.addEventListener('error', () => console.error('Image load error'));
        }
    });
});

// Функция для установки цвета плитки на основе изображения
function setTileColor(tile, img) {
    // Получаем доминирующий цвет изображения
    getDominantColor(img).then(color => {
        // Устанавливаем CSS-переменные для плитки:
        // 1. Основной цвет (полная непрозрачность)
        tile.style.setProperty('--solid-color', `rgba(${color}, 1)`);
        // 2. Цвет плитки (80% непрозрачности)
        tile.style.setProperty('--tile-color', `rgba(${color}, 0.8)`);
        // 3. Цвет нижней части плитки (10% непрозрачности)
        tile.style.setProperty('--tile-color-bottom', `rgba(${color}, 0.1)`);
        // Показываем изображение (изначально оно могло быть скрыто)
        img.style.opacity = '1';
    });
}

// Функция для определения доминирующего цвета изображения
function getDominantColor(img) {
    // Возвращаем Promise, так как работа с изображением асинхронна
    return new Promise((resolve) => {
        // Создаем временный canvas для анализа изображения
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Устанавливаем маленький размер для оптимизации
        canvas.width = 10;
        canvas.height = 10;
        
        // Рисуем изображение на canvas (с масштабированием)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Получаем данные о пикселях изображения
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        // Переменные для накопления значений RGB
        let r = 0, g = 0, b = 0;
        
        // Перебираем все пиксели (каждый 4-й элемент массива - новый пиксель: R,G,B,A)
        for (let i = 0; i < imageData.length; i += 4) {
            // Суммируем значения красного, зеленого и синего каналов
            r += imageData[i];       // Красный
            g += imageData[i + 1];   // Зеленый
            b += imageData[i + 2];   // Синий
            // Прозрачность (imageData[i + 3]) не учитываем
        }
        
        // Вычисляем количество пикселей
        const pixels = imageData.length / 4;
        // Возвращаем средние значения RGB в формате "R, G, B"
        resolve(`${Math.round(r / pixels)}, ${Math.round(g / pixels)}, ${Math.round(b / pixels)}`);
    });
}