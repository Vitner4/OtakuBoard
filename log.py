# Type: ведение журнала логов
# Author: Vitner4

import os
import time

# Данные о log файле
log_path = "logs.txt" # Путь к файлу логов
logs_status = None # Статус логирования
space = 0 # Переменная для отступов в логах между сессиями

# =======================================
# Функции взаимодействия с журналом логов
# =======================================

# Установка статуса логирования
def set_logging_status(value):
    global logs_status
    logs_status = value

# Получение статуса логирования
def get_logging_status():
    return logs_status

# ========================================
# Функция логирования процессов приложения
# ========================================

def log(python_file, message):
    try:
        global logs_status 
        global space

        if logs_status == "true":
            # Добавление отступа в логах между сессиями

            if space == 0:
                with open(log_path, 'a', encoding='utf-8') as f:              
                    f.write(f"\n{'-'*20} {time.ctime()} {'-'*20}\n") # Разделитель сессий логов

                space += 1 

            # Запись логов в файл
            with open(log_path, 'a', encoding='utf-8') as f:
                f.write(f"<< {time.ctime()} [{python_file}]: {message}\n")

            print(f"<< {time.ctime()} [{python_file}]: {message}") # Вывод логов в консоль
            
    except Exception as e:
        log("log.py", f"Ошибка при логировании: {str(e)}") 


    