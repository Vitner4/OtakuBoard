# Type: точка входа в приложение 
# Author: Vitner4

import eel
import log
import init
import config
import dataManager
import accountManager

try:
   # Инициализация компонентов приложения
   init.start() # Запуск проверки и загрузки компонентов приложения
   
   # Получение параметров запуска из файла конфигурации
   eel.init(".") # Инициализация папки
   open_page = f"{config.get_value("directories", "web_dir")}/{config.get_value("settings", "start_page")}" # Открывающаяся страница приложения
   open_mode = config.get_value("settings", "open_mode") # Режим открытия страницы
   port_value = config.get_value("settings", "port_value") # Порт для запуска приложения

   # Проверка наличия аккаунта
   if config.get_value("account", "connection") == "true":

      # Автоматический вход в аккаунт
      login = accountManager.account_login({"link": config.get_value("account", "account_link"), "write_data_to_config": "false"})

      if login['status'] == "success":
         open_page = f"{config.get_value("directories", "web_dir")}/{config.get_value("settings", "main_page")}" # Установка главной страницы приложения

      else:
         log.log("main.py", "Автоматический вход в аккаунт не выполнен!") # Логирование

         # Очистка пути до аккаунта в Config.json
         config.set_value("account", "account_link", config.get_default_config_value("account", "account_link"))
         config.set_value("account", "account_id", config.get_default_config_value("account", "account_id"))
         config.set_value("account", "connection", config.get_default_config_value("account", "connection"))

   # Запуск приложения
   if __name__ == "__main__":
      log.log("main.py", "Запуск приложения!") # Логирование

      try:
        # Запуск в стандартном режиме
        eel.start(open_page, mode=open_mode, port=port_value, block=True, cmdline_args=['--start-maximized'])
        
      except (EnvironmentError, OSError) as e:
         # Eel выбросит эту ошибку, если не найдет исполняемый файл Chrome/Chromium
         log.log("main.py", f"Режим '{open_mode}' недоступен (браузер не найден). Запуск в браузере по умолчанию. ({e})")
         
         try:
               # Устанавливаем default значение в режиме открытия страницы
               open_mode = config.set_value("settings", "open_mode", "default") # Режим открытия страницы

               # Запускаем fallback-вариант. 
               eel.start(open_page, mode='default', port=port_value, block=True)
         except Exception as fallback_error:
               # Если даже дефолтный браузер не открылся (что бывает крайне редко)
               log.log("main.py", f"Критическая ошибка: не удалось запустить даже дефолтный браузер. ({fallback_error})")

except Exception as e:
   # Ошибка запуска приложения
   log.log("main.py", f"Произошла ошибка при открытии приложения: {str(e)}") # Логирование