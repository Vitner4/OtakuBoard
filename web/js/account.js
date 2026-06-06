// Type: вывод данных или выход из аккаунта приложения на frontend
// Author: Vitner4

// Dom элементы
logoutBtn = document.getElementById('account-logout');

// Получение данных аккаунта при загрузке страницы
window.onload = function() {
    getData();
};

// Функция получения данных аккаунта
async function getData(){
    // Процесс получения данных аккаунта
    func = await eel.sending_account_data()();

    // Получение количества карточек
    countCards = await eel.get_cards_count()();

    // Установка данных аккаунта
    document.getElementById('account-name').textContent = func['name']; 
    document.getElementById('account-id').textContent = func['id'];
    document.getElementById('account-reg-data').textContent = "Аккаунт создан: " + func['timestamp'];
    document.getElementById('account-all-cards').textContent = "Всего карточек: " + countCards['count'];
    // document.getElementById('account-all-groups').textContent = "Всего групп: " + func['groups'];  

    // Установка аватара
    const avatar = document.getElementById('account-avatar');
    if (func['avatar'] && func['avatar'] !== null) {
        avatar.src = `../${func['avatar']}`; // Установка аватара, если он есть
    }else{
        avatar.src = "css/src/img/default/default-avatar.jpg"; // Скрываем элемент аватара, если он не установлен
    }
}
 
// Функция выхода из аккаунта
async function accountLogout(){
    // Процесс выхода из аккаунта
    func = await eel.account_logout("true")();
    
    if(func['status'] == 'success'){
        // Переход на начальную страницу после успешного выхода из аккаунта
        window.location.href = "index.html";
    }
    else{
        // Вывод ошибки при неудачном выходе из аккаунта
        alert("Ошибка при выходе из аккаунта: " + func['message']);
    }
}

// Отслеживание действия выхода из аккаунта по нажатию кнопки
logoutBtn.addEventListener('click', () => {
    accountLogout();
});