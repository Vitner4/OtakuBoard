# Type: точка входа в приложение
# Author: Vitner4

import eel
import log
import config
import cardManager

try:
   # Проверка и загрузка компонентов перед запуском приложения
   log.log_init() # Инициализация логирования 
   config.config_loading() # Проверка и загрузка файла конфигурации

   # Получение параметров запуска из файла конфигурации
   eel.init(config.get_value("directories", "web_dir")) # Инициализация веб-папки
   main_page = config.get_value("settings", "main_page") # Начальная страница приложения
   open_mode = config.get_value("settings", "open_mode") # Режим открытия страницы
   port_value = config.get_value("settings", "port_value") # Порт для запуска приложения

   # Запуск приложения
   log.log("main.py", "Запуск приложения!") # Логирование 
   eel.start(main_page, mode=open_mode, port=port_value, block=True) # Запуск приложения с указанными параметрами
except Exception as e:
   log.log("main.py", f"Произошла ошибка при открытии приложения: {str(e)}") # Логирование