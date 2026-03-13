//! Заменено на set-image.js
// Предпросмотр загружаемого локального аватара
document.addEventListener('DOMContentLoaded', () => {
    // Получаем ссылки на HTML-элементы
    const fileInput = document.getElementById('cover');
    const previewContainer = document.getElementById('cover-preview');

    // Добавляем слушатель события на изменение поля input[type="file"]
    fileInput.addEventListener('change', function() {
        // Проверяем, был ли выбран хотя бы один файл
        const file = this.files[0];

        if (!file) {
            // Если файл не выбран (например, пользователь отменил выбор),
            // восстанавливаем текст-заглушку
            previewContainer.innerHTML = '';
            return;
        }

        // Проверка типа файла — только изображения
        if (!file.type || !file.type.startsWith('image/')) {
            previewContainer.innerHTML = '<p>Выбранный файл не является изображением</p>';
            // Можно очистить выбор, если нужно:
            // this.value = '';
            return;
        }

        // Создаем объект FileReader для чтения содержимого файла
        const reader = new FileReader();

        // Определяем, что произойдет после успешного чтения файла
        reader.onload = function(e) {
            // Создаем новый элемент <img>
            const img = document.createElement('img');
            img.alt = 'Превью аватара';
            img.id = 'cover-preview-img';
            // Устанавливаем его src равным прочитанным данным (Base64-изображение)
            img.src = e.target.result;

            // Успешная загрузка изображения в элемент <img>
            img.onload = function() {
                // Очищаем контейнер предпросмотра от старого текста/изображения
                previewContainer.innerHTML = '';
                // Вставляем новое изображение в контейнер
                previewContainer.appendChild(img);
                
                // Вывод код изображения Base64 в консоль
                // console.log('Base64 аватара:', img.src);
            };

            // Ошибка при создании/отображении изображения
            img.onerror = function() {
                previewContainer.innerHTML = '';
            };
        };

        // Обработка ошибок FileReader
        reader.onerror = function() {
            previewContainer.innerHTML = '<p>Ошибка при чтении файла</p>';
        };

        // Запускаем процесс чтения файла как Data URL (Base64)
        reader.readAsDataURL(file);
    });
});

// Предпросмотр аватара по URL ссылке
document.addEventListener('DOMContentLoaded', () => {
    // Получаем ссылку на поле ввода ссылки и контейнер предпросмотра
    const linkInput = document.getElementById('cover-link');
    const previewContainer = document.getElementById('cover-preview');

    // Вспомогательная функция для показа заглушки
    function showPlaceholder() {
    }

    // Обработчик события ввода/вставки ссылки
    linkInput.addEventListener('input', function () {
        const url = this.value.trim();

        // Если поле пустое — показываем заглушку
        if (!url) {
            showPlaceholder();
            return;
        }

        // Создаём изображение и навешиваем обработчики загрузки/ошибки
        const img = document.createElement('img');
        img.alt = 'Превью аватара';

        // Успешная загрузка — вставляем изображение в контейнер
        img.onload = function () {
            previewContainer.innerHTML = '';
            previewContainer.appendChild(img);
        };

        // Ошибка загрузки — показываем сообщение об ошибке
        img.onerror = function () {
            previewContainer.innerHTML = '<p>Не удалось загрузить изображение по указанной ссылке</p>';
        };

        // Присваиваем src после назначения обработчиков, чтобы корректно отработали события
        img.src = url;
    });

    // Инициализация: если при загрузке страницы поле пустое, показываем заглушку
    if (!linkInput.value.trim()) {
        showPlaceholder();
    }
});

// Взаимное исключение выбора файла и ввода ссылки
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('cover');
    const linkInput = document.getElementById('cover-link');

    function handleFileSelection() {
        const file = fileInput.files[0];
        // Если выбран файл и это изображение — очищаем ссылку
        if (file && file.type && file.type.startsWith('image/')) {
            if (linkInput.value) linkInput.value = '';
        }
    }

    function handleLinkInput() {
        const url = linkInput.value.trim();
        // Если введена ссылка — очищаем выбранный файл
        if (url) {
            if (fileInput.value) fileInput.value = '';
        }
    }

    fileInput.addEventListener('change', handleFileSelection);
    linkInput.addEventListener('input', handleLinkInput);

    // Начальная проверка при загрузке страницы
    handleFileSelection();
    handleLinkInput();
});

// удаление аватара при нажатии кнопки
function removeCover(){
    let coverInput = document.getElementById("cover");
    let coverLinkInput = document.getElementById("cover-link");
    let previewContainer = document.getElementById("cover-preview");

    // Очистка полей ввода
    if (coverInput) coverInput.value = "";
    if (coverLinkInput) coverLinkInput.value = "";

    // Восстановление текста-заглушки в контейнере предпросмотра
    if (previewContainer) previewContainer.innerHTML = '';
}