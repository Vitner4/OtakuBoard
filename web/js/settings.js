// Type: обработка страницы settings.html, редактирование файла конфигурации
// Author: Vitner4

// DOM элементы
const loggingToggle = document.getElementById("logging-toggle"); // Кнопка логирования приложения
const openMode = document.getElementById("open-mode"); // Selector для выбора режима открытия страницы 

// ==============================
// Действия при загрузке страницы
// ==============================

document.addEventListener("DOMContentLoaded", async () => {

    // Отображение данных конфигурации
    const response = await eel.config_value_get()();
   
    // Вывод данных
    if(response.logging == "true"){
        loggingToggle.checked = true;
    }else{
        loggingToggle.checked = false;
    }

    openMode.value = response.open_mode
});

// ====================================================
// Запросы на изменение файла конфигурации при действии
// ====================================================

loggingToggle.addEventListener("click", async () => {
    if(loggingToggle.checked == true){
        const response = await eel.config_value_set("settings", "logging", "true")();
    }else{
        const response = await eel.config_value_set("settings", "logging", "false")();
    }
});

openMode.addEventListener("change", async () => {
    if(openMode.value == "chrome"){
        const response = await eel.config_value_set("settings", "open_mode", openMode.value)();
    }

    if(openMode.value == "default"){
        const response = await eel.config_value_set("settings", "open_mode", openMode.value)();
    }
 });
