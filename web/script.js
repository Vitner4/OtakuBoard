
// Отображение текущего года в подвале сайта
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// Здесь произходит магия... хз че произходит. MasterFal понаписал ))  (Единственное что знаю - градиенд у контент-блока)
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