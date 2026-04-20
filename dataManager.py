# Type: менеджер данных карточек и групп приложения на backend
# Author: Vitner4

import os
import log
import eel
import time
import config
import random
import base64
import sqlite3
import urllib.request
import accountManager

# =========================
# ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ
# =========================
def get_connection():
    DB_PATH = f"{config.get_value('account', 'account_link')}/{config.get_value('directories', 'data_dir')}/{config.get_value('files', 'db_file')}"
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # возвращает строки как dict
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

# =============================
# СОЗДАНИЕ БАЗЫ ДАННЫХ И ТАБЛИЦ
# =============================
def create_database():
    try:
        """
        Создаём базу данных SQLite с таблицами:
        - cards (карточки)
        - groups (группы)
        - group_cards (связь многие-ко-многим)
        """

        log.log("dataManager.py", "Создание новой базы данных аккаунта...") # Логирование

        # Подключаемся к базе данных
        conn = get_connection()
        cursor = conn.cursor()

        # Включаем проверку внешних ключей
        cursor.execute("PRAGMA foreign_keys = ON;")

        # Таблица карточек
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS cards (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            author TEXT,
            genre TEXT,
            year INTEGER,
            type TEXT,
            link TEXT,
            description TEXT,
            star INTEGER CHECK(star >= 0 AND star <= 10),
            timestamp TEXT,
            cover TEXT           
        );
        """)

        # Таблица групп
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS groups (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT,
            cover TEXT,
            added_cards INTEGER DEFAULT 0,
            timestamp TEXT
        );
        """)

        # TODO idea №1: Создать таблицу Media для хранения цифровых объектов (Видео, аудио, изображения) и связать её с карточками.
        # TODO ...

        # Связующая таблица карточка ↔ группа (many-to-many)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS group_cards (
            group_id TEXT NOT NULL,
            card_id TEXT NOT NULL,
            PRIMARY KEY (group_id, card_id),
            FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
            FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
        );
        """)

        # Сохраняем изменения и закрываем соединение
        conn.commit()
        conn.close()

        log.log("dataManager.py", f"Новая база данных аккаунта {config.get_value("account","account_id")} создана!") # Логирование
    except Exception as e:
        log.log("dataManager.py", f"Ошибка при создании базы данных: {str(e)}") # Логирование

# ==========================
# ВОССТАНОВЛЕНИЕ БАЗЫ ДАННЫХ 
# ==========================
# TODO idea №2: Функция восстановление при потере доступа к БД. Поиск или создание новой БД в настройках приложения!
# TODO ...

# ===================
# ДОБАВЛЕНИЕ КАРТОЧКИ
# ===================
@eel.expose
def add_card(card_data: dict):
    """
    card_data должен содержать:
    id, name, author, genre, year, type, link,
    description, star, timestamp, cover, URLcover
    """

    try:
        # Подключаемся к базе данных
        conn = get_connection()
        cursor = conn.cursor()

        # Путь до папки обложек карточек
        folder_path = os.path.join(
            config.get_value("account", "account_link"),
            config.get_value("directories", "data_dir"),
            config.get_value("directories", "cover_dir"),
            config.get_value("directories", "card_cvr_dir")
        )

        # Проверка на наличие папки
        if not os.path.exists(folder_path):
            log.log("dataManager.py", "Папка сохранения обложки не найдена, проверяем структуру...") # Логирование
            if not accountManager.folder_structure_check():
                log.log("dataManager.py", "Структура папок аккаунта нарушена и не восстановлена!") # Логирование
                raise OSError("Структура папок аккаунта нарушена и не восстановлена!")
            else:
                log.log("dataManager.py", "Структура папок восстановлена, повторите создание карточки.") # Логирование
                return {"status": "error", "message": "Структура папок восстановлена, повторите создание карточки."}

        # Сохраняем обложку
        cover = card_data.get("cover") or {}
        cover_path = None

        # Проверка на тип изображения
        if isinstance(cover, dict):
            if cover.get("type") == "file":
                cover_path = saveImage(card_data.get("id"), cover, folder_path)

            elif cover.get("type") == "URL":
                cover_path = saveURLImage(card_data.get("id"), cover, folder_path)

        # Вставляем карточку в SQLite
        cursor.execute("""
            INSERT INTO cards (
                id, name, author, genre, year, type,
                link, description, star, timestamp, cover
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            card_data.get("id"),
            card_data.get("name"),
            card_data.get("author"),
            card_data.get("genre"),
            card_data.get("year"),
            card_data.get("type"),
            card_data.get("link"),
            card_data.get("description"),
            card_data.get("star"),
            card_data.get("timestamp"),
            cover_path
        ))

        conn.commit()
        log.log("dataManager.py", f"Новая карточка '{card_data.get('name', '')}' добавлена!") # Логирование
        return {"status": "success", "message": f"Карточка '{card_data.get('name', '')}' успешно создана!"}
    except Exception as e:
        log.log("dataManager.py", f"Ошибка при добавлении карточки: {str(e)}") # Логирование
        return {"status": "error", "message": str(e)}

    finally:
        conn.close()

# ==================
# ИЗМЕНЕНИЕ КАРТОЧКИ
# ==================

# =================
# УДАЛЕНИЕ КАРТОЧКИ
# =================

# ========================
# ПОЛУЧЕНИЕ КАРТОЧКИ ПО ID
# ========================

# =======================
# ПОЛУЧЕНИЕ ВСЕХ КАРТОЧЕК
# =======================
def get_all_cards():
    try:
        # Подключаемся к базе данных
        conn = get_connection()
        cursor = conn.cursor()
        
        # Получаем все карточки из таблицы cards
        cursor.execute("SELECT * FROM cards")
        result = [dict(row) for row in cursor.fetchall()]
        conn.close()

        log.log("dataManager.py", "Выполнено получение всех карточек!") # Логирование
        return {"status": "success", "data": result}
    except Exception as e:
        log.log("dataManager.py", f"Ошибка при получении всех карточек: {str(e)}") # Логирование
        return {"status": "error", "message": str(e)}
    
# ===============
# СОЗДАНИЕ ГРУППЫ
# ===============
# ! Не протестировано. Протестировать функцию!
def add_group(group_data: dict):
    """
    group_data должен содержать:
    id, name, type, cover, timestamp
    """

    # Подключаемся к базе данных
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO groups (
                id, name, type, cover, added_cards, timestamp
            ) VALUES (?, ?, ?, ?, 0, ?)
        """, (
            group_data["id"],
            group_data["name"],
            group_data.get("type"),
            group_data.get("cover"),
            group_data.get("timestamp")
        ))

        conn.commit()
        return {"status": "success"}

    except Exception as e:
        return {"status": "error", "message": str(e)}

    finally:
        conn.close()

# ================
# ИЗМЕНЕНИЕ ГРУППЫ
# ================

# ===============
# УДАЛЕНИЕ ГРУППЫ
# ===============

# =============================
# СВЯЗЫВАНИЕ КАРТОЧКИ С ГРУППОЙ
# =============================
# ! Не протестировано. Протестировать функцию!
def link_card_to_group(card_id: str, group_id: str):
    # Подключаемся к базе данных
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # добавляем связь
        cursor.execute("""
            INSERT INTO group_cards (group_id, card_id)
            VALUES (?, ?)
        """, (group_id, card_id))

        # обновляем счётчик карточек
        cursor.execute("""
            UPDATE groups
            SET added_cards = added_cards + 1
            WHERE id = ?
        """, (group_id,))

        conn.commit()
        return {"status": "success"}

    except Exception as e:
        return {"status": "error", "message": str(e)}

    finally:
        conn.close()

# ============================
# ПОЛУЧИТЬ ВСЕ КАРТОЧКИ ГРУППЫ
# ============================
# ! Не протестировано. Протестировать функцию!
def get_cards_by_group(group_id: str):
    # Подключаемся к базе данных
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT cards.*
        FROM cards
        JOIN group_cards ON cards.id = group_cards.card_id
        WHERE group_cards.group_id = ?
    """, (group_id,))

    result = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return result

# ================================
# ПОЛУЧИТЬ ВСЕ ГРУППЫ С КАРТОЧКАМИ
# ================================
# ! Не протестировано. Протестировать функцию!
def get_groups_by_card(card_id: str):
    # Подключаемся к базе данных
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT groups.*
        FROM groups
        JOIN group_cards ON groups.id = group_cards.group_id
        WHERE group_cards.card_id = ?
    """, (card_id,))

    result = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return result

# ==============
# ПОИСК КАРТОЧКИ
# ==============

# ===================
# СОРТИРОВКА КАРТОЧЕК
# ===================

# ======================
# СОХРАНЕНИЕ ИЗОБРАЖЕНИЯ
# ======================
def saveImage(cardID: str, image: dict, path):
        try:          
            # Проверка на наличие обложки
            if image and image.get("name") and image.get("data"):
                safe_name = f"{cardID}_{random.randint(1, 1000)}{image['name']}" # Имя файла для сохранения

                # Сохраняем файл в папку
                cover_path = os.path.join(path, safe_name)
                # Переводим файл из Base64 в бинарные данные
                cover_data = base64.b64decode(image["data"].split(",")[1])
                with open(cover_path, "wb") as f:
                    f.write(cover_data)
                log.log("dataManager.py", f"Новое изображение \"{safe_name}\" сохранено в \"{path}\"") # Логирование
                return cover_path
            else:
                return None
        except Exception as e:
            log.log("dataManager.py", f"Произошла ошибка при сохранении изображения \"{safe_name}\": {e}") # Логирование
            return None

# ==========================
# СОХРАНЕНИЕ URL ИЗОБРАЖЕНИЯ
# ==========================
def saveURLImage(cardID: str, image: dict, save_folder: str):
    try:
        # Получаем URL изображения из данных
        url = image.get("data")
        file_name = f"{cardID}_{random.randint(1, 1000)}{image['name']}" # Имя файла для сохранения

        # Формируем полный путь до файла
        file_path = os.path.join(save_folder, file_name)
        
        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        req = urllib.request.Request(url, headers=headers)

        # Скачиваем изображение потоком с таймаутом 10 секунд
        with urllib.request.urlopen(req, timeout=5) as response, open(file_path, "wb") as f:
            while True:
                # Читаем по 256KB блокам
                chunk = response.read(262144)
                if not chunk:
                    break
                f.write(chunk)

        log.log("dataManager.py", f"Новое изображение \"{file_name}\" сохранено в \"{file_path}\"") # Логирование
        return file_path
    except Exception as e:
        log.log("dataManager.py", f"Ошибка при сохранении URL изображения: {e}") # Логирование
        return None