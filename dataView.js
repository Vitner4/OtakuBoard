// Получение данных JSON файлов из Python, создание "контент-блоков" на основе данных
document.addEventListener('DOMContentLoaded', async () => {

    // Получение количество файлов
    let dataLength = await eel.getDataLength()();
    console.log("Количество файлов: " + dataLength);

    let i = 0;
    while (i < dataLength) {
        // Поочередно получаем данные и создаёи "контент-блоки"
        let response = await eel.outputAllData(i)();

        if (response.status === 'success') {
            //  Создаём HTML элемент и добавляем в конец body
            document.body.insertAdjacentHTML('beforeend', 
            `<form id="contentBlock">
                    <div class="cb-${response.data.name}"> 
                        <label for="name">Имя:</label>
                        <input type="text" id="name" required>
                        <br>
                        <label for="email">Email:</label>
                        <input type="email" id="email" required>
                    </div>
                </form>`
            );

            // Получаем class "контент-блока"
            let cb = document.querySelector(`.cb-${response.data.name}`);

            // Заполняем форму данными из JSON
            cb.querySelector('#name').value = response.data.name || '';
            cb.querySelector('#email').value = response.data.email || '';  
        }

        i++;          
    }  
});

