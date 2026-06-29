# Type: менеджер аккаунтов приложения на backend
# Author: Vitner4

import os
import eel
import log
import time
import json
import config
import dataManager
from pathlib import Path

# Переменные
account_data = None # Данные аккаунта, полученные из файла
data_loading_status = False # Статус загрузки данных аккаунта
required_keys = ["name", "id", "avatar", "timestamp", "timestamp_extra", "for"] # Ключи файла аккаунта

# Структура директорий и файлов
acc_symbol  = '@' # Символ аккаунта 
acc_suffix = ".ob" # Суффикс директории аккаунта
acc_type = "-ob.json" # Файл аккаунта

# =======================
# Вспомогательные функции
# =======================

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

# =====================================================
# Функция для установки данных аккаунта в файл аккаунта
# =====================================================

def account_data_file_set(data: dict):
    try:
        # Получаем путь до файла аккаунта 
        account_file = os.path.join(
            config.get_value("account", "account_link"),
            config.get_value("account", "account_id") + acc_type,
        )

        if account_file:
            
            # Записываем данные аккаунта в файл
            with open(account_file, 'w', encoding='utf-8') as file:
                json.dump(data, file, ensure_ascii=False, indent=4)

            log.log("accountManager.py", f"Данные аккаунта успешно сохранены в файл: {account_file}")

        else:
            log.log("accountManager.py", "Путь до аккаунта не найден!")

    except Exception as e:
        log.log("accountManager.py", f"Произошла ошибка при сохранении данных аккаунта в файл! ({e})")

# ================================
# Функция создания нового аккаунта
# ================================
 
@eel.expose
def create_new_account(formData):    
    try:
        # Добавляем доп. поля в данные аккаунта
        
        # Модифицируем ID
        formData['id'] = f'{acc_symbol}{formData['id']}'
        # Добавляем аватарки аккаунта
        formData['avatar'] = None
        # Добавляем время создания, работы и пометку приложения
        formData['timestamp'] = time.strftime('%d.%m.%Y')
        formData['timestamp_extra'] = time.strftime('%H:%M:%S')
        formData['for'] = config.get_value("app", "name")

        # Определяем имена директорий
        acc_place = config.get_value("directories", "account_dir") # Место создания аккаунта
        acc_dir = f"{formData['id']}{acc_suffix}" # Директория аккаунта
        data_dir = config.get_value("directories", "data_dir") # Директория данных
        cover_dir = config.get_value("directories", "cover_dir") # Директория обложек
        card_cvr_dir = config.get_value("directories", "card_cvr_dir") # Директория обложек карточек
        group_cvr_dir = config.get_value("directories", "group_cvr_dir") # Директория обложек групп
        profile_dir = config.get_value("directories", "profile_dir") # Директория профиля
        logo_dir = config.get_value("directories", "logo_dir") # Директория логотипа аккаунта
               
        # Определяем имена файлов
        acc_file = f"{formData['id']}{acc_type}" # Файл аккаунта

        # Создаём директорию аккаунта
        os.mkdir(f'{acc_place}/{acc_dir}')
        # Создаём директорию data
        os.mkdir(f'{acc_place}/{acc_dir}/{data_dir}')
        os.mkdir(f'{acc_place}/{acc_dir}/{data_dir}/{cover_dir}')
        # Создаём директорию profile
        os.mkdir(f'{acc_place}/{acc_dir}/{profile_dir}')
        os.mkdir(f'{acc_place}/{acc_dir}/{profile_dir}/{logo_dir}')
        os.mkdir(f'{acc_place}/{acc_dir}/{data_dir}/{cover_dir}/{card_cvr_dir}')
        os.mkdir(f'{acc_place}/{acc_dir}/{data_dir}/{cover_dir}/{group_cvr_dir}')

        # Создаём файл аккаунта
        with open(f'{acc_place}/{acc_dir}/{acc_file}', 'w', encoding='utf-8') as file:
            json.dump(formData, file, ensure_ascii=False, indent=4)

        # Записываем путь до аккаунта в Config.json
        config.set_value("account", "account_link", f'{acc_place}/{acc_dir}')
        config.set_value("account", "account_id", f'{formData['id']}')
        config.set_value("account", "connection", "true")

        # Создаём базу данных аккаунта
        dataManager.create_database()

        # Загружаем данные аккаунта и устанавливаем статус загрузки
        account_data_set(formData) 
        data_loading_status_set(True)

        # Возвращение успешного создания аккаунта
        log.log("accountManager.py", f"Новый аккаунт {formData['id']} создан!")
        return {"status": "success"}
    
    # Возвращение ошибки при создании уже существующего аккаунта
    except FileExistsError as e:       
        log.log("accountManager.py", f"Произошла ошибка при создании аккаунта. Аккаунт {formData['id']} уже существует! ({e})")
        return {"status": "error", "message": f"Произошла ошибка при создании аккаунта. Аккаунт {formData['id']} уже существует!"}
    
    # Возвращение ошибки при создании аккаунта
    except Exception as e:      
        log.log("accountManager.py", f"Произошла ошибка при создании аккаунта на стороне Python! ({e})")
        return {"status": "error", "message": f"Произошла ошибка при создании аккаунта на стороне Python! ({str(e)})"}

# ==================================
# Функция поиска аккаунтов для входа
# ==================================

@eel.expose
def find_accounts():
    try:
        account_path = Path(config.get_value("directories", "account_dir"))

        result = []

        # перебор папок аккаунтов
        for item in account_path.iterdir():

            # Ищем папку аккаунта
            if item.is_dir() and item.name.endswith(acc_suffix):

                # рекурсивный обход JSON файлов внутри папки аккаунта
                for file in item.rglob("*.json"):
                    
                    # Проверка на тип файла
                    if file.name.endswith(acc_type):
                        try:
                            data = json.loads(file.read_text(encoding="utf-8"))

                            # Проверка на наличие ключей
                            if all(key in data for key in required_keys):
   
                                data["file_path"] = str(item)

                                result.append(data)

                            else:
                                continue

                        except (json.JSONDecodeError, UnicodeDecodeError):
                            continue  # пропускаем битые файлы    
                    else:
                        continue
           
        # возвращаем список аккаунтов (JSON-совместимый)
        return result
   
    except Exception as e:
        log.log("accountManager.py", f"Произошла ошибка при поиске аккаунтов на стороне Python! ({e})")
        return

# =======================
# Функция входа в аккаунт
# =======================

@eel.expose
def account_login(link):
    try:
        # Проверка ссылки
        if acc_symbol in link['link'] and str(link['link']).endswith(acc_suffix):

            file_path = Path(link['link'])

            # Проверка на существование папки аккаунта
            if file_path.exists():
                log.log("accountManager.py", f"Папка аккаунта найдена! Ссылка на аккаунт: {link['link']}")
      
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
                        if link['write_data_to_config'] == "true":
                            config.set_value("account", "account_link", link['link'])
                            config.set_value("account", "account_id", account_data_get_value('id'))
                            config.set_value("account", "connection", 'true')

                        else:
                            log.log("accountManager.py", "Запись данных аккаунта в Config.json пропущена")
                        
                        # Проверка структуры папок аккаунта
                        if folder_structure_check() == True:
                            log.log("accountManager.py", "Структура папок аккаунта соответствует требованиям!")

                            # Проверка наличия базы данных аккаунта
                            db_path = os.path.join(
                                link["link"],
                                config.get_value('directories', 'data_dir'),
                                config.get_value('files', 'db_file')
                            )

                            if os.path.isfile(db_path):
                                log.log("accountManager.py", "База данных аккаунта найдена!")
                            
                                # Возвращаем "success" при успешном нахождении и входе в аккаунт
                                log.log("accountManager.py", f"Вход в аккаунт {account_data_get_value('id')} успешно выполнен!")
                                return {"status": "success"}
                            
                            else:
                                log.log("accountManager.py", "База данных аккаунта не найдена!")    
                                return {"status": "error", "message": "Ошибка! База данных аккаунта не найдена!"} 
                                                
                        else:
                            log.log("accountManager.py", "Структура папок аккаунта нарушена. Не удалось восстановить структуру папок аккаунта!")
                            # Возвращаем "error" при ошибке структуры папок аккаунта
                            return {"status": "error", "message": "Структура папок аккаунта не соответствует требованиям!"} 
                        
                else:
                    # Возвращаем "error" при ошибке поиска файла аккаунта
                    log.log("accountManager.py", "Файл аккаунта не найден!")
                    return {"status": "error", "message": "Файл аккаунта не найден!"}   
                                                                 
            else:
                log.log("accountManager.py", f"Папка аккаунта не найдена! Ссылка на аккаунт: {link['link']}")
                 # Возвращаем "error" при ошибке поиска аккаунта
                return {"status": "error", "message": "Папка аккаунта не найдена!"}
            
        else:
            # Возвращаем "error" при ошибке неверной ссылки
            return {"status": "error", "message": "Неверная ссылка аккаунта!"}
        
    except Exception as e:
        # Возвращаем "error" при ошибке попытки найти аккаунт
        log.log("accountManager.py", f"Произошла ошибка при попытке найти аккаунт на стороне Python! ({e})")
        return {"status": "error", "message": f"Произошла ошибка при попытке найти аккаунт на стороне Python! ({e})"}

# ============================================
# Функция отправки данных аккаунта на frontend
# ============================================

@eel.expose
def sending_account_data():

    # Проверка статуса загрузки данных аккаунта
    if data_loading_status_get() == True: 

        try:
            return account_data_get()
        
        except Exception as e:
            # Возвращаем False при ошибке отправки данных аккаунта
            log.log("accountManager.py", f"Произошла ошибка при отправке данных аккаунта! ({e})")
            return {"status": "error", "message": f"Произошла ошибка при отправке данных аккаунта! ({e})"}
        
    else:
        # Возвращаем False при ошибке отправки данных аккаунта
        log.log("accountManager.py", "Произошла ошибка при отправке данных аккаунта. Аккаунт не подключен!")
        return {"status": "error", "message": "Произошла ошибка при отправке данных аккаунта. Аккаунт не подключен!"}

# ===============================
# Функция редактирования аккаунта
# ===============================

@eel.expose
def account_edit(newData):
    try:
        # Получаем путь до папки аватара аккаунта из Config.json
        avatar_file_path = os.path.join(
            config.get_value("account", "account_link"),
            config.get_value("directories", "profile_dir"),
            config.get_value("directories", "logo_dir")
        )

        # Проверка на наличие папки
        if not os.path.exists(avatar_file_path):
            log.log("accountManager.py", "Папка сохранения обложки не найдена, проверяем структуру...") # Логирование

            if not folder_structure_check():
                log.log("accountManager.py", "Структура папок аккаунта нарушена и не восстановлена!") # Логирование
                raise OSError("Структура папок аккаунта нарушена и не восстановлена!")
            
            else:
                log.log("accountManager.py", "Структура папок восстановлена, повторите редактирование аккаунта.") # Логирование
                return {"status": "error", "message": "Структура папок восстановлена, повторите редактирование аккаунта."}
        
        # Сохраняем аватар аккаунта
        avatar = newData.get("avatar") or {}
        avatar_path = None

        # Получаем данные аккаунта
        accDta = account_data_get()

        # Проверка на тип изображения
        if isinstance(avatar, dict):

            if avatar.get("type") == "file":

                # Удаляем аватар аккаунта из папки, если она существует
                if accDta["avatar"] and os.path.exists(accDta["avatar"]):
                    os.remove(accDta["avatar"])

                log.log("accountManager.py", f"Старый аватар \"{accDta['avatar']}\" удалён!") # Логирование
                avatar_path = dataManager.saveImage("avatar", avatar, avatar_file_path)

            elif avatar.get("type") == "URL":

                # Удаляем аватар аккаунта из папки, если она существует
                if accDta["avatar"] and os.path.exists(accDta["avatar"]):
                    os.remove(accDta["avatar"])

                log.log("accountManager.py", f"Старый аватар \"{accDta['avatar']}\" удалён!") # Логирование
                avatar_path = dataManager.saveURLImage("avatar", avatar, avatar_file_path)
            
            elif avatar.get("type") == "remove":

                # Удаляем аватар аккаунта из папки, если она существует
                if accDta["avatar"] and os.path.exists(accDta["avatar"]):
                    os.remove(accDta["avatar"])

                log.log("accountManager.py", f"Аватар \"{accDta['avatar']}\" удален по запросу!") # Логирование
                avatar_path = None # Устанавливаем значение аватара None, чтобы удалить её из карточки
            
            else:
                avatar_path = accDta["avatar"] # Если тип не распознан, сохраняем старый аватар
    
        # Обновляем данные аккаунта на основе полученных данных из формы
        accDta['name'] = newData['name']
        accDta['avatar'] = avatar_path

        # Сохраняем обновленные данные аккаунта в файл аккаунта
        account_data_file_set(accDta)

        # Загружаем обновленные данные аккаунта и устанавливаем статус загрузки
        account_data_set(accDta) 
        data_loading_status_set(True)

        # Возвращаем "success" при успешном редактировании аккаунта
        log.log("accountManager.py", f"Редактирование аккаунта {accDta['id']} успешно выполнено!")
        return {"status": "success", "message": f"Редактирование аккаунта {accDta['id']} успешно выполнено!"}
    
    except Exception as e:
        # Возвращаем "error" при ошибке редактирования аккаунта
        log.log("accountManager.py", f"Произошла ошибка при редактировании аккаунта на стороне Python! ({e})")
        return {"status": "error", "message": f"Произошла ошибка при редактировании аккаунта на стороне Python! ({e})"}

# ==========================
# Функция выхода из аккаунта
# ==========================                                 

@eel.expose
def account_logout(value):
    try:
        acc_id = None # id аккаунта

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

# ============================================
# Функция проверки папок аккаунта пользователя 
# ============================================

def folder_structure_check():
    try:
        # Путь до папки аккаунта
        account_path = config.get_value("account", "account_link") 

        # Структура папок аккаунта
        FOLDERS_STRUCTURE = [
            # data
            f"{config.get_value("directories", "data_dir")}",
            f"{config.get_value("directories", "data_dir")}/{config.get_value("directories", "cover_dir")}",
            f"{config.get_value("directories", "data_dir")}/{config.get_value("directories", "cover_dir")}/{config.get_value("directories", "card_cvr_dir")}",
            f"{config.get_value("directories", "data_dir")}/{config.get_value("directories", "cover_dir")}/{config.get_value("directories", "group_cvr_dir")}",
            # profile
            f"{config.get_value("directories", "profile_dir")}",
            f"{config.get_value("directories", "profile_dir")}/{config.get_value("directories", "logo_dir")}"        
        ]

        # Проверка структуры папок аккаунта
        log.log("accountManager.py", "Проверка структуры папок аккаунта...")
        for folder in FOLDERS_STRUCTURE:
            folder_path = os.path.join(account_path, folder)
            
            if os.path.isdir(folder_path):  
                log.log("accountManager.py", f"Папка найдена: {folder_path}")              
            else:
                log.log("accountManager.py", f"Нет папки: {folder_path}. Создание новой папки...")
                os.mkdir(folder_path)
                log.log("accountManager.py", f"Папка создана: {folder_path}")

        log.log("accountManager.py", "Проверка структуры папок аккаунта завершена!")
        return True  
    
    except Exception as e:
        log.log("accountManager.py", f"Произошла ошибка при проверке структуры папок аккаунта! ({e})")
        return False