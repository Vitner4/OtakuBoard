// Загрузка данных при старте
document.addEventListener('DOMContentLoaded', async () => {
    const response = await eel.load_json_data()(); 

    if (response.status === 'success') {
        //  Создаём HTML элемент и добовляем в конец body
        document.body.insertAdjacentHTML('beforeend', 
        `<form id="contentBlock">
                <div>
                    <label for="name">Имя:</label>
                    <input type="text" id="name" required>
                    <br>
                    <label for="email">Email:</label>
                    <input type="email" id="email" required>
                </div>
            </form>`
        );

        // Заполняем форму данными из JSON
        document.getElementById('name').value = response.data.name || '';
        document.getElementById('email').value = response.data.email || '';  
    } 
});

