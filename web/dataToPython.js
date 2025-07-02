// Скрипт получения данных из форм и передача functions.py для сохранения в JSON-файл
document.getElementById('dataForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Собираем данные формы
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // Отправляем данные в Python
    try {
        const response = await eel.save_to_json(formData)();
        
        // Статус загрузки данных
        const statusDiv = document.getElementById('status');
        statusDiv.className = response.status;
        statusDiv.textContent = response.message;
        
        if (response.status === 'success') {
            document.getElementById('dataForm').reset();
        }
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('status').textContent = 'Произошла ошибка';
    }
    
});
  
     