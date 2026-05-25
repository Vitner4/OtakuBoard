# Type: Загрузка и проверка компонентов перед запуском приложения
# Author: Vitner4

import os
import log
import sys
import config

# Функция запуска проверки и загрузки компонентов приложения
def start():
    try: 
        # Получение значения статуса логирования из файла конфигурации
        log_status = config.get_value_from_file("settings", "logging")

        # Проверка наличия статуса логирования из файла конфигурации
        if log_status == None:
            log.set_logging_status("true") # Установка статуса логирования по умолчанию
            log.log("init.py", "Произошла ошибка при получении статуса логирования из файла конфигурации. Логирование по умолчанию включено!") # Логирование
        elif log_status == "true":
            log.set_logging_status("true") # Установка статуса логирования из файла конфигурации
            log.log("init.py", "Логирование включено!") # Логирование
        else:
            log.set_logging_status("false") # Установка статуса логирования из файла конфигурации

        # Проверка конфиг-файла
        config.check_config_file() # Проверка наличия файла конфигурации
        config.load_config() # Загрузка файла конфигурации

        # Проверка целостности файла конфигурации
        if config.check_config_integrity() == True:
            log.log("config.py", "Файл конфигурации в порядке!") # Логирование
        else:
            log.log("config.py", "Файл конфигурации повреждён или имеет неверный формат. Восстановление стандартных настроек...") # Логирование
            config.restore_default_config() # Восстановление файла конфигурации к стандартным настройкам
        
        # Проверка наличия папки account и её создание при отсутствии
        # os.makedirs(config.get_value("directories", "account_dir"), exist_ok=True)

        log.log("init.py", "Компоненты приложения успешно проверены и загружены!") # Логирование
    except Exception as e:
        log.log("init.py", f"Ошибка при запуске и проверке компонентов приложения: {str(e)}")
        sys.exit(1)