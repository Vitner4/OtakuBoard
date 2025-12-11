# Type: Ведение журнала логов
# Author: Vitner4

import os
import time
import config

# Данные о log файле
log_path = "logs.txt" # Путь к файлу логов
logs_status = "false" # Статус логирования (по умолчанию вылючен)
space = 0 # Переменная для отступов в логах между сессиями

# Функция инициализации логирования
def log_init():
    try:
        global logs_status
        global space
        check_log_file() # Проверка на наличие log файла
        get_logging_status() # Получение статуса логирования из файла конфигурации
        if logs_status == "true":
            print("<< log включен!")
            # Добавление отступа в логах между сессиями
            if space == 0:
                with open(log_path, 'a', encoding='utf-8') as f:              
                    f.write(f"\n{'-'*20} {time.ctime()} {'-'*20}\n") # Разделитель сессий логов
                space += 1 
        else:
            print("<< log отключен!") 
    except Exception as e:
        print(f"<< Ошибка при инициализации логирования: {str(e)}") # Логирование

# Функция логирования процессов приложения
def log(python_file, message):
    try:
        global logs_status 
        if logs_status == "true":
            # Запись логов в файл
            with open(log_path, 'a', encoding='utf-8') as f:
                f.write(f"<< {time.ctime()} [{python_file}]: {message}\n")
            print(f"<< {time.ctime()} [{python_file}]: {message}") # Вывод логов в консоль
    except Exception as e:
        print(f"<< Ошибка при логировании: {str(e)}") 

# Проверка на наличие log файла
def check_log_file():
    try:
        if not os.path.exists(log_path):
            with open(log_path, 'w', encoding='utf-8') as f:
                f.write("")  # Создание пустого файла лога
            print(f"<< log файл отсутствует. Создан новый log файл!") 
        else:
            print(f"<< log файл найден!")  
    except Exception as e:
        print(f"<< Ошибка при проверке log файла: {str(e)}") 

# Получение статуса логирования из файла конфигурации
def get_logging_status():
    try:
        global logs_status 
        logs_status = config.get_value_from_file("settings", "logging") # Получение статуса логирования
    except:
        print("<< Ошибка при получении статуса логирования из файла конфигурации!") 

    