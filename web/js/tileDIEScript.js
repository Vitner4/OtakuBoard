// document.addEventListener('DOMContentLoaded', function() {
//     const tiles = document.querySelectorAll('.tile');
    
//     tiles.forEach(tile => {
//         const img = tile.querySelector('.tile-img');
        
//         if (!img) return;
        
//         // Обработка уже загруженных изображений
//         if (img.complete) {
//             processImage(tile, img);
//         } 
//         // И обработка при загрузке
//         else {
//             img.addEventListener('load', () => processImage(tile, img));
//             img.addEventListener('error', () => console.error('Image failed to load', img.src));
//         }
//     });
// });

// function processImage(tile, img) {
//     // Получаем доминирующий цвет
//     const dominantColor = getDominantColor(img);
    
//     // Устанавливаем CSS переменную
//     tile.style.setProperty('--tile-color', `${dominantColor}60`); // 60% прозрачности
    
//     // Показываем изображение
//     img.style.opacity = '1';
// }

// function getDominantColor(img) {
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
    
//     // Анализируем уменьшенную версию изображения для производительности
//     canvas.width = 10;
//     canvas.height = 10;
    
//     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
//     // Получаем усредненный цвет
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
//     let r = 0, g = 0, b = 0;
    
//     for (let i = 0; i < imageData.length; i += 4) {
//         r += imageData[i];
//         g += imageData[i + 1];
//         b += imageData[i + 2];
//     }
    
//     const pixels = imageData.length / 4;
//     r = Math.round(r / pixels);
//     g = Math.round(g / pixels);
//     b = Math.round(b / pixels);
    
//     return `${r}, ${g}, ${b}`;
// }

document.addEventListener('DOMContentLoaded', function() {
    const tiles = document.querySelectorAll('.tile');
    
    tiles.forEach(tile => {
        const img = tile.querySelector('.tile-img');
        if (!img) return;
        
        if (img.complete) {
            setTileColor(tile, img);
        } else {
            img.addEventListener('load', () => setTileColor(tile, img));
            img.addEventListener('error', () => console.error('Image load error'));
        }
    });
});

function setTileColor(tile, img) {
    getDominantColor(img).then(color => {
        tile.style.setProperty('--solid-color', `rgba(${color}, 1)`);
        tile.style.setProperty('--tile-color', `rgba(${color}, 0.8)`);
        tile.style.setProperty('--tile-color-bottom', `rgba(${color}, 0.1)`);
        img.style.opacity = '1'; // Показываем изображение
    });
}

function getDominantColor(img) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 10;
        canvas.height = 10;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0;
        
        for (let i = 0; i < imageData.length; i += 4) {
            r += imageData[i];
            g += imageData[i + 1];
            b += imageData[i + 2];
        }
        
        const pixels = imageData.length / 4;
        resolve(`${Math.round(r / pixels)}, ${Math.round(g / pixels)}, ${Math.round(b / pixels)}`);
    });
}