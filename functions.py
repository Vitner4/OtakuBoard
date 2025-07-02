import eel
import json
import os
from datetime import datetime

# Создаем папку для данных, если её нет... (оставить для функции проверки аккаунта)
os.makedirs('data-test', exist_ok=True)

# Функция сохранения данных в JSON-файл
@eel.expose
def save_to_json(form_data):
    try:
        # Указываем имя файла
        filename = f"data-test/{form_data['name']}.json"
        
        # Сохраняем данные
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(form_data, f, ensure_ascii=False, indent=4)
        
        return {'status': 'success', 'message': f'Данные сохранены в {filename}'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

# Функция загрузки данных из JSON-файла
@eel.expose
def load_json_data():
    try:
        if os.path.exists('.\data-test\data.json'):
            with open('.\data-test\data.json', 'r', encoding='utf-8') as f:
                print('data.json получен')
                return {'status': 'success', 'data': json.load(f)}
        print('data.json не существует')        
        return {'status': 'error', 'message': 'Файл не существует'}
    except Exception as e:
        print('data.json ошибка получения')
        return {'status': 'error', 'message': str(e)}

