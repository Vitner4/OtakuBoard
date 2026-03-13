// Type: загрузка изображения на frontend
// Author: Vitner4

// todo: Добавить предпросмотр обложки по URL ссылке, скачивание URL обложки и взаимное исключение выбора файла и ввода ссылки (Брать из set-cover.js)

// Функция загрузки изображения
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

        // Создаём временный URL для отображения превью
        const url = URL.createObjectURL(selected);

        // Отображаем превью изображения
        preview.innerHTML = `<img src="${url}" alt="preview">`;
    });

    // Возвращаем объект с методом для получения файла и статуса
    return {
        "status": "success",
        getFile: () => file
    };
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
}
