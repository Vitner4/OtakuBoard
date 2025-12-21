# Type: работа с карточками на backend
# Author: Vitner4

import eel
import log
import json
import time
import random
import config

# Функция инициализации получения карточек

# Функция создания новой карточки
@eel.expose
def create_card(formData):
    try:
        # Добавляем данные новой карточки в список cards
        cards = []
        cards.append(formData)
        # Создание id карточки и добавление его в cards
        id = f'c{time.strftime('%Y%m%d%H%M%S')}0{random.randint(1, 100)}'
        cards[0]["id"] = id
        # Запись информации о создателе файла
        cards[0]["created"] = "" #!! Добавить id пользователя после реализации скрипта аккаунтов
        # Запись о приложении
        cards[0]["for"] = config.get_value("app", "name")
        # Пути к директориям для сохранения карточки и имя файла
        accountDir = config.get_value("directories", "account_dir") + "/"
        account = '' #!! Добавить ссылку на пользователя из файла конфигурации при реализации скрипта аккаунтов
        # cardDir = config.get_value("directories", "card_dir") + "/" #!! Включить после добавления account
        name = f"{cards[0]['name']}-{id}.json"

        # Сохраняем данные карточки в файл
        with open(accountDir + name, 'w', encoding='utf-8') as file: #!! Добавить account и cardDir в путь при реализации скрипта аккаунтов
            json.dump(cards, file, ensure_ascii=False, indent=4)

        # Возвращаем статус выполнения для фронтенда
        log.log("cardManager.py", f"Создана новая карточка: {name}")
        return {"status": "success"}
    except Exception as e:
        log.log("cardManager.py", f":Произошла ошибка при создании новой карточки: {str(e)}")
        return {"status": "error", "message": str(e)}

# Функция редактирования карточки

# Функция удаления карточки

# Функция отправки данных карточки

# Функция получения данных о карточках
