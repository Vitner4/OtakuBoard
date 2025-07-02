// Загрузка данных при старте
document.addEventListener('DOMContentLoaded', async () => {
    const response = await eel.load_json_data()();
    
    if (response.status === 'success') {
        // Заполняем форму данными из JSON
        document.getElementById('name').value = response.data.name;
        document.getElementById('email').value = response.data.email || '';
        document.getElementById('message').value = response.data.message || '';
        
        showStatus('Данные загружены', 'success');
    } else {
        showStatus(`Ошибка: ${response.message}`, 'error');
    }
});

