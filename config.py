# Type: работа с файлом конфигурации
# Author: Vitner4

import os
import sys
import log
import json

# Данные файла конфигурации
config_path = "config.json" # Путь к файлу конфигурации
config_data = {} # Данные конфигурации, загруженные из файла

# Стандартные данные конфигурации
default_config_data = { 
    "app": {
    "name": "OtakuBoard"
    },

    "account": {
        "connection": "false",
        "account_id": "none",
        "account_link": "none"
    },

    "settings": {
        "start_page": "index.html",
        "main_page": "list-page.html",
        "open_mode": "chrome",
        "port_value": 0,
        "theme": "light",
        "card_gradient": "true",
        "language": "ru",
        "logging": "true"
    },

    "directories": {
        "web_dir": "web",
        "account_dir": "account",
        "card_dir": "cards",
        "group_dir": "groups",
        "src_dir": "src",
        "cover_dir": "cover",
        "avatar_dir": "avatar"
    }
}

# Функция загрузки файла конфигурации
def config_loading():
    try:
        check_config_file() # Проверка наличия файла конфигурации
        load_config() # Загрузка файла конфигурации
        # Проверка целостности файла конфигурации
        if check_config_integrity() == True:
             log.log("config.py", "Файл конфигурации в порядке!") # Логирование
        else:
            log.log("config.py", "Файл конфигурации повреждён или имеет неверный формат. Восстановление стандартных настроек...") # Логирование
            restore_default_config() # Восстановление файла конфигурации к стандартным настройкам
    except Exception as e:
        log.log("config.py", f"Ошибка при проверке и загрузке файла конфигурации: {str(e)}") # Логирование
        sys.exit(1)
 
# Функция проверки на наличие файла конфигурации
def check_config_file():
    if not os.path.exists(config_path):
        # Если файла нет, создаем его с стандартными настройками
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(default_config_data, f, ensure_ascii=False, indent=4)
        log.log("config.py", "Файл конфигурации отсутствует. Создан новый стандартный файл конфигурации!") # Логирование
    else:
        log.log("config.py", "Файл конфигурации найден!") # Логирование

# Функция загрузки конфигурации из файла
def load_config():
    global config_data
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            config_data = json.load(f)
        log.log("config.py", "Файл конфигурации успешно загружен!") # Логирование
    except Exception as e:
        log.log("config.py", f"Ошибка загрузки файла конфигурации: {str(e)}") # Логирование
 
# Функция проверки целостности файла конфигурации
def check_config_integrity():
    global config_data
    # Проверка наличия всех необходимых секций
    for section in default_config_data:
        if section not in config_data:
            return False
        # Проверка наличия всех необходимых ключей
        for key in default_config_data[section]:
            if key not in config_data[section]:
                return False    
    return True

# Функция восстановления файла конфигурации к стандартным настройкам
def restore_default_config():
    global config_data
    try:
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(default_config_data, f, ensure_ascii=False, indent=4)
        config_data = default_config_data
        log.log("config.py", "Файл конфигурации успешно восстановлен к стандартным настройкам!") # Логирование
    except Exception as e:
        log.log("config.py", f"Ошибка восстановления файла конфигурации и закрытие приложения: {str(e)}") # Логирование
        sys.exit(1)

# Функция получения значения из конфигурации, выгруженной в словарь config_data
def get_value(section, key):
    return config_data[section][key]

# Функция получения значения напрямую из файла конфигурации
def get_value_from_file(section, key):
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data[section][key]
    except Exception as e:
        print(f"<< Ошибка получения значения из файла конфигурации: {str(e)}. Возвращено значение по умолчанию 'false'.")
        return "false"

# Функция установки значения в файл конфигурации
def set_value(section, key, new_value):
    global config_data
    try:
        # Установка значения в загруженных данных config_data
        config_data[section][key] = new_value
        # Установка значения в файл
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(config_data, f, ensure_ascii=False, indent=4)
        log.log("config.py", "Файл конфигурации успешно обновлён!") # Логирование
    except Exception as e:
        log.log("config.py", f"Ошибка обновления файла конфигурации: {str(e)}") # Логирование

# Getter для стандартных значений конфигурации
def get_default_config_value(section, key):
    return default_config_data[section][key]
