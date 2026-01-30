# Type: менеджер аккаунтов приложения на backend
# Author: Vitner4

import os
import eel
import log
import time
import json
import config
from pathlib import Path

account_data = None # Данные аккаунта, полученные из файла
data_loading_status = False # Статус загрузки данных аккаунта

# Структура директорий и файлов
acc_symbol  = '@' # Символ аккаунта 
acc_suffix = ".ob" # Суффикс директории аккаунта
acc_type = "-ob.json" # Файл аккаунта

# Getter для account_data
def account_data_get():
    return account_data

# Getter для значений account_data
def account_data_get_value(key):
    return account_data[key]

# Setter данных для account_data
def account_data_set(data):
    global account_data
    account_data = data

# Getter для data_loading_status
def data_loading_status_get():
    return data_loading_status

# Setter данных для data_loading_status
def data_loading_status_set(data):
    global data_loading_status
    data_loading_status = data

# Функция создания нового аккаунта
@eel.expose
def create_new_account(formData):
    try:
        # Добавляем доп. поля в данные аккаунта
        # Модифицируем ID
        formData['id'] = f'{acc_symbol}{formData['id']}'
        # Добавляем два вида хранения аватарки аккаунта
        formData['img'] = "none" # Локальное
        formData['web_img'] = "none" # Web
        # Кол-во карточек и групп
        formData['cards'] = 0
        formData['groups'] = 0
        # Добавляем время создания, работы и пометку приложения
        formData['timestamp'] = time.strftime('%d.%m.%Y')
        formData['timestamp_extra'] = time.strftime('%H:%M:%S')
        formData['work_time'] = 0 #! Решить вопрос с счётом времени работы программы
        formData['for'] = config.get_value("app", "name")

        # Определяем имена директорий
        acc_dir = f"{formData['id']}{acc_suffix}" # Директория аккаунта
        acc_place = config.get_value("directories", "account_dir") # Место создания аккаунта
        card_dir = config.get_value("directories", "card_dir") # Директория карточек
        group_dir = config.get_value("directories", "group_dir") # Директория групп 
        src_dir = config.get_value("directories", "src_dir") # Директория источника
        cover_dir = config.get_value("directories", "cover_dir") # Директория обложек
        avatar_dir = config.get_value("directories", "avatar_dir") # Директория аватара аккаунта

        # Определяем имена файлов
        acc_file = f"{formData['id']}{acc_type}" # Файл аккаунта

        # Создаём директорию аккаунта
        os.mkdir(f'{acc_place}/{acc_dir}')
        # Создаём директорию src
        os.mkdir(f'{acc_place}/{acc_dir}/{src_dir}')
        os.mkdir(f'{acc_place}/{acc_dir}/{src_dir}/{avatar_dir}')
        # Создаём директорию cards
        os.mkdir(f'{acc_place}/{acc_dir}/{card_dir}')
        os.mkdir(f'{acc_place}/{acc_dir}/{card_dir}/{src_dir}')
        os.mkdir(f'{acc_place}/{acc_dir}/{card_dir}/{src_dir}/{cover_dir}')
        # Создаём директорию groups
        os.mkdir(f'{acc_place}/{acc_dir}/{group_dir}')
        os.mkdir(f'{acc_place}/{acc_dir}/{group_dir}/{src_dir}')
        os.mkdir(f'{acc_place}/{acc_dir}/{group_dir}/{src_dir}/{cover_dir}')

        # Создаём файл аккаунта
        with open(f'{acc_place}/{acc_dir}/{acc_file}', 'w', encoding='utf-8') as file:
            json.dump(formData, file, ensure_ascii=False, indent=4)

        # Записываем путь до аккаунта в Config.json
        config.set_value("account", "account_link", f'{acc_place}/{acc_dir}')
        config.set_value("account", "account_id", f'{formData['id']}')
        config.set_value("account", "connection", "true")

        # Загружаем данные аккаунта и устанавливаем статус загрузки
        account_data_set(formData) 
        data_loading_status_set(True)

        # Возвращение успешного создания аккаунта
        log.log("accountManager.py", f"Новый аккаунт {formData['id']} создан!")
        return {"status": "success"}
    except Exception as e:
        if FileExistsError:
            # Возвращение ошибки при создании уже существующего аккаунта
            log.log("accountManager.py", f"Произошла ошибка при создании аккаунта. Аккаунт {formData['id']} уже существует! ({e})")
            return {"status": "error", "message": f"Произошла ошибка при создании аккаунта. Аккаунт {formData['id']} уже существует!"}
        else:
            # Возвращение ошибки при создании
            log.log("accountManager.py", f"Произошла ошибка при создании аккаунта на стороне Python! ({e})")
            return {"status": "error", "message": f"Произошла ошибка при создании аккаунта на стороне Python! ({str(e)})"}

# Функция входа в аккаунт
@eel.expose
def account_login(link):
    try:
        # Проверка ссылки
        if acc_symbol in link['link'] and str(link['link']).endswith(acc_suffix):
            file_path = Path(link['link'])

            # Проверка на существование папки аккаунта
            if file_path.exists():
                log.log("accountManager.py", f"Папка аккаунта найдена! Ссылка: {link['link']}")

                # Поиск файла аккаунта по типу
                for fp in file_path.glob(f"*{acc_type}*"):
                    if fp.is_file():
                        log.log("accountManager.py", f"Найден файл аккаунта: {fp.name}")
                        # Открытие файла аккаунта
                        with open(fp, 'r', encoding='utf-8') as file:
                            # Загружаем данные аккаунта в account_data                        
                            accDta = json.load(file)  
                        # Загружаем данные аккаунта и устанавливаем статус загрузки
                        account_data_set(accDta) 
                        data_loading_status_set(True) 
                        
                        # Записываем данные аккаунта в Config.json
                        config.set_value("account", "account_link", link['link'])
                        config.set_value("account", "account_id", account_data_get_value('id'))
                        config.set_value("account", "connection", 'true')
                        
                        # Возвращаем True при успешном нахождении аккаунта
                        log.log("accountManager.py", "Файл аккаунта найден и загружен!")
                        return {"status": "success"}
                    else:
                        # Возвращаем False при ошибке поиска файла аккаунта
                        log.log("accountManager.py", "Файл аккаунта не найден!")
                        return {"status": "error", "message": "Файл аккаунта не найден!"}                                      
            else:
                log.log("accountManager.py", f"Папка аккаунта не найдена! Ссылка: {link['link']}")
                 # Возвращаем False при ошибке поиска аккаунта
                return {"status": "error", "message": "Папка аккаунта не найдена!"}
        else:
            # Возвращаем False при ошибке неверной ссылки
            return {"status": "error", "message": "Неверная ссылка аккаунта!"}
    except Exception as e:
        # Возвращаем False при ошибке попытки найти аккаунт
        log.log("accountManager.py", f"Произошла ошибка при попытке найти аккаунт на стороне Python! ({e})")
        return {"status": "error", "message": f"Произошла ошибка при попытке найти аккаунт на стороне Python! ({e})"}

# Функция отправки данных аккаунта на frontend
@eel.expose
def sending_account_data():
    # Проверка статуса загрузки данных аккаунта
    if data_loading_status_get() == True:    
        try:
            return account_data_get()
        except Exception as e:
            # Возвращаем False при ошибке отправки данных аккаунта
            log.log("accountManager.py", "Произошла ошибка при отправке данных аккаунта! ({e})")
            return {"status": "error", "message": "Произошла ошибка при отправке данных аккаунта! ({e})"}
    else:
        # Возвращаем False при ошибке отправки данных аккаунта
        log.log("accountManager.py", "Произошла ошибка при отправке данных аккаунта. Аккаунт не подключен!")
        return {"status": "error", "message": "Произошла ошибка при отправке данных аккаунта. Аккаунт не подключен!"}

# Функция редактирования аккаунта

# Функция выхода из аккаунта
@eel.expose
def account_logout(value):
    try:
        if value == "true":
            # Запись id аккаунта для log
            acc_id = account_data_get_value('id')

            # Очистка данных аккаунта и статуса загрузки
            account_data_set(None)
            data_loading_status_set(False)

            # Очистка пути до аккаунта в Config.json
            config.set_value("account", "account_link", config.get_default_config_value("account", "account_link"))
            config.set_value("account", "account_id", config.get_default_config_value("account", "account_id"))
            config.set_value("account", "connection", config.get_default_config_value("account", "connection"))

            # Возвращаем True при успешном выходе из аккаунта
            log.log("accountManager.py", f"Выход из аккаунта {acc_id} выполнен!")
            return {"status": "success"}
        else:
            return {"status": "error", "message": f"Отмена выхода из аккаунта {acc_id}!"}
    except Exception as e:
        return {"status": "error", "message": f"Произошла ошибка при выходе из аккаунта {acc_id} на стороне Python! ({e})"}       


