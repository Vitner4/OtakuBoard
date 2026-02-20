# Type: точка входа в приложение
# Author: Vitner4

import eel
import log
import init
import config
import cardManager
import accountManager

try:
   # Инициализация компонентов приложения
   init.start() # Запуск проверки и загрузки компонентов приложения
   
   # Получение параметров запуска из файла конфигурации
   eel.init(config.get_value("directories", "web_dir")) # Инициализация веб-папки
   open_page = config.get_value("settings", "start_page") # Открывающаяся страница приложения
   open_mode = config.get_value("settings", "open_mode") # Режим открытия страницы
   port_value = config.get_value("settings", "port_value") # Порт для запуска приложения

   # Проверка наличия аккаунта
   if config.get_value("account", "connection") == "true":
      # Вход в аккаунт
      login = accountManager.account_login({"link": config.get_value("account", "account_link"), "write_data_to_config": "false"})
      if login['status'] == "success":
         open_page = config.get_value("settings", "main_page") # Установка главной страницы приложения
      else:
         log.log("main.py", "Автоматический вход в аккаунт не выполнен!") # Логирование

   # Запуск приложения
   if __name__ == "__main__":
      log.log("main.py", "Запуск приложения!") # Логирование 
      eel.start(open_page, mode=open_mode, port=port_value, block=True, cmdline_args=['--start-maximized']) # Открытие приложения с указанными параметрами
except Exception as e:
   # Ошибка запуска приложения
   log.log("main.py", f"Произошла ошибка при открытии приложения: {str(e)}") # Логирование