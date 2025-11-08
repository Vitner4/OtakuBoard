
// Получение выбранной звезды фильтра
function getSelectedStar(starID){
    let starChoosed = document.getElementById(starID);
    alert("Выбрана звезда: " + starChoosed.value);
}

// Предпросмотр загружаемой обложки
document.addEventListener('DOMContentLoaded', () => {
    // Получаем ссылки на HTML-элементы
    const fileInput = document.getElementById('cover');
    const previewContainer = document.getElementById('cover-preview');

    // Добавляем слушатель события на изменение поля input[type="file"]
    fileInput.addEventListener('change', function() {
        // Проверяем, был ли выбран хотя бы один файл
        const file = this.files[0]; 

        if (file) {
            // Создаем объект FileReader для чтения содержимого файла
            const reader = new FileReader();

            // Определяем, что произойдет после успешного чтения файла
            reader.onload = function(e) {
                // Создаем новый элемент <img>
                const img = document.createElement('img');
                // Устанавливаем его src равным прочитанным данным (Base64-изображение)
                img.src = e.target.result; 

                // Очищаем контейнер предпросмотра от старого текста/изображения
                previewContainer.innerHTML = ''; 
                // Вставляем новое изображение в контейнер
                previewContainer.appendChild(img);
            };

            // Запускаем процесс чтения файла как Data URL (Base64)
            reader.readAsDataURL(file);
        } else {
            // Если файл не выбран (например, пользователь отменил выбор), 
            // восстанавливаем текст-заглушку
            previewContainer.innerHTML = '<p>Предпросмотр обложки появится здесь после выбора файла.</p>';
        }
    });
});
