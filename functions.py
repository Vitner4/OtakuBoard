import eel
import json
import os

# Заметка №1
# 
# Для более удобной сортировки и поиска данных в приложении, список со всеми файлами .json (files) надо вынести
# как глобыльный список и написать функции по ЕГО сортировке и выводе на основе этой сортировки. Данные для сортировки
# брать из отдельного файла сортировки (sorting.json), куда будут записаны параметры для сортировки. 
# (устанавливать значения: html -> js -> python -> sorting.json | брать значения: sorting.json -> python -> js -> html) 
# 

# Создаем папку для данных, если её нет... (оставить для функции проверки на наличие аккаунта)
os.makedirs('data-test', exist_ok=True)

# Функция сохранения данных в JSON-файл
@eel.expose
def save_to_json(form_data):
    try:
        # Указываем имя файла
        filename = f"data-test/{form_data['name']}-cont.json"
        
        # Сохраняем данные
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(form_data, f, ensure_ascii=False, indent=4)
        
        return {'status': 'success', 'message': f'Данные сохранены в {filename}'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

# Функция получения данных из определённого JSON-файла
@eel.expose
def load_json_data(file):
    try:
        if os.path.exists(f'./data-test/{file}'):
            with open(f'./data-test/{file}', 'r', encoding='utf-8') as f:
                print(f'{file} успешно получен!')
                return {'status': 'success', 'data': json.load(f)}
        print(f'{file} не существует')        
        return {'status': 'error', 'message': 'Файл не существует'}
    except Exception as e:
        print(f'{file}: ошибка получения')
        return {'status': 'error', 'message': str(e)}
     
# Функция получения и вывода всех данных из файлов JSON 
@eel.expose
def outputAllData(fileIndex):
    # Получаем все данные и записываем в список files
    files = os.listdir("data-test")
    if len(files) == 0:
        print("Файлы отсутствуют!")
    else:
        # Проверка на подленность и вывод данных
        if files[fileIndex].endswith('-cont.json'):
            print(f'{files[fileIndex]} подтверждён.')
            return load_json_data(files[fileIndex])
        else:
            print(files[fileIndex], "не соответствует!")  

# Функция поиска файлов и получение их колличества (для js)
@eel.expose
def getDataLength():
    # Поиск данных
    files = os.listdir("data-test")
    if len(files) == 0:
        print("Файлы отсутствуют!")
    else:
        print(f"Колличество файлов в папке: {len(files)}")
        return len(files)  