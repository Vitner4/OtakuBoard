// Type: обработка страницы pre-license.html
// Author: Vitner4

// ======================
// Инициализация страницы
// ======================

document.addEventListener('DOMContentLoaded', function() {

    // DOM элементы
    const langButtons = document.querySelectorAll('.cc-lang-btn');
            
    langButtons.forEach(button => {

        button.addEventListener('click', function() {

            // Удаление активного класса из всех кнопок
            langButtons.forEach(btn => btn.classList.remove('active'));

            // Добавление активного класса к нажатой кнопке
            this.classList.add('active');
                
            // Получение полученного языка
            const lang = this.dataset.lang;
                
            // Обновление всех элементов с атрибутами данных
            document.querySelectorAll('[data-en], [data-ru]').forEach(element => {

                if (element.dataset[lang]) {

                    if (element.tagName === 'LI') {
                        element.innerHTML = element.dataset[lang];
                        
                    } else {
                        element.textContent = element.dataset[lang];
                    }
                }
            });
        });
    });
});