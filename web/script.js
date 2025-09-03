
// Отображение текущего года в подвале сайта
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// Ссылка на GitHub OtakuBoard
document.getElementById('github-link').href = 'https://github.com/Omiraiix/OtakuBoard';