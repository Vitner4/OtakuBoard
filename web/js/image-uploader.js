// Type: загрузка изображения на frontend
// Author: Vitner4

let selectedFormat = null; // Выбранный формат изображения

// Функция получения выбранного формата изображения 
export function getSelectedFormat(){
    return selectedFormat;
}

// Функция загрузки изображения из проводника
export function createImageUploader(inputId, previewId) {
    // Получаем элементы input и preview
    const input = document.getElementById(inputId); // Загруженное изображения
    const preview = document.getElementById(previewId); // Превью изображения 
    // Переменная для файла изображения 
    let file = null;

    // Добавляем обработчик события изменения файла в input
    input.addEventListener("change", () => {

        // Помещаем выбранный файл в переменную selected
        const selected = input.files[0];

        // Проверяем, выбран ли файл
        if (!selected) {
            preview.innerHTML = "<p>Изображение не выбрано</p>";
            file = null;
            return;
        }

        // Проверяем, является ли файл изображением
        if (!selected.type.startsWith("image/")) {
            preview.innerHTML = "<p>Файл не является изображением!</p>";
            file = null;
            return;
        }

        // Сохраняем выбранный файл
        file = selected;
        selectedFormat = "file" // Установка формата изображения

        // Создаём временный URL для отображения превью
        const url = URL.createObjectURL(selected);

        // Отображаем превью изображения
        preview.innerHTML = `<img src="${url}" alt="Превью обложки">`;
    });

    // Возвращаем объект с методом для получения файла и статуса
    return {
        "status": "success",
        getFile: () => file
    };
}

// Функция преобразования файла в строку base64
export function fileToBase64(file, statusFieldId) {
    // Переменные
    const statusField = document.getElementById(statusFieldId); // Переменная поля статуса

    try {
        return new Promise((resolve, reject) => {
        const reader = new FileReader(); // Создаём FileReader для чтения файла

        reader.readAsDataURL(file); // Читаем файл как DataURL (base64)

        reader.onload = () => resolve(reader.result); // При успешном чтении возвращаем результат
        reader.onerror = error => reject(error); // При ошибке возвращаем ошибку
    });
    }catch (error){
        statusField.style.color = 'red';
        statusField.textContent = 'Произошла ошибка при загрузке изображения! '+ error;
    }
}

// Функция предпросмотра URL обложки
export function URLViewer(coverURLId, previewId) {
    // Получаем ссылку на поле ввода ссылки и контейнер предпросмотра
    const linkInput = document.getElementById(coverURLId);
    const previewContainer = document.getElementById(previewId);

    // Вспомогательная функция для показа заглушки
    function showPlaceholder() {
        previewContainer.innerHTML = '<p>Изображение не выбрано</p>';
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
        img.alt = 'Превью обложки';

        // Успешная загрузка — вставляем изображение в контейнер
        img.onload = function () {
            previewContainer.innerHTML = '';
            previewContainer.appendChild(img);
            selectedFormat = "URL"; // Установка формата изображения
        };

        // Ошибка загрузки — показываем сообщение об ошибке
        img.onerror = function () {
            previewContainer.innerHTML = '<p>Не удалось загрузить изображение по указанной ссылке</p>';
        };

        // Присваиваем src после назначения обработчиков, чтобы корректно отработали события
        img.src = url;
    });
}

// Функция взаимного исключения выбора файла и ввода ссылки
export function selectionChecker(CoverId, CoverLinkId){
    const fileInput = document.getElementById(CoverId);
    const linkInput = document.getElementById(CoverLinkId);

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
}

// Функция отчистки изображения
export function removeCover(coverId, previewId, linkId){
    let coverInput = document.getElementById(coverId);
    let previewContainer = document.getElementById(previewId);
    let coverLinkInput = document.getElementById(linkId);

    // Очистка полей ввода
    if (coverInput) coverInput.value = "";
    if (coverLinkInput) coverLinkInput.value = "";

    // Восстановление текста-заглушки в контейнере предпросмотра
    if (previewContainer) previewContainer.innerHTML = '<p>Изображение не выбрано</p>';

    selectedFormat = "remove"; // Установка формата изображения
}