# Type: менеджер данных карточек и групп приложения на backend
# Author: Vitner4

import os
import log
import eel
import config
import random
import base64
import sqlite3
import urllib.request
import accountManager
from pathlib import Path

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

        log.log("dataManager.py", f"Новая база данных аккаунта {config.get_value("account","account_id")} создана!") # Логирование
    except Exception as e:
        log.log("dataManager.py", f"Ошибка при создании базы данных: {str(e)}") # Логирование
    finally:
        # Закрываем соединение с базой данных
        conn.close()

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
        # Закрываем соединение с базой данных
        conn.close()

# ==================
# ИЗМЕНЕНИЕ КАРТОЧКИ
# ==================
@eel.expose
def edit_card(card_id: str, updated_data: dict):
    try:
        # Подключаемся к базе данных
        conn = get_connection()
        cursor = conn.cursor()

        # Получаем текущую карточку из базы данных
        cursor.execute("SELECT * FROM cards WHERE id = ?", (card_id,))
        existing_card = cursor.fetchone()

        # Если карточка не найдена, возвращаем ошибку
        if not existing_card:
            return {"status": "error", "message": "Карточка не найдена!"}
        
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
                log.log("dataManager.py", "Структура папок восстановлена, повторите редактирование карточки.") # Логирование
                return {"status": "error", "message": "Структура папок восстановлена, повторите редактирование карточки."}

        # Сохраняем обложку
        cover = updated_data.get("cover") or {}
        cover_path = None

        # Проверка на тип изображения
        if isinstance(cover, dict):
            if cover.get("type") == "file":
                # Удаляем обложку карточки из папки, если она существует
                if existing_card["cover"] and os.path.exists(existing_card["cover"]):
                    os.remove(existing_card["cover"])
                log.log("dataManager.py", f"Старая обложка \"{existing_card['cover']}\" удалена!") # Логирование
                cover_path = saveImage(card_id, cover, folder_path)

            elif cover.get("type") == "URL":
                # Удаляем обложку карточки из папки, если она существует
                if existing_card["cover"] and os.path.exists(existing_card["cover"]):
                    os.remove(existing_card["cover"])
                log.log("dataManager.py", f"Старая обложка \"{existing_card['cover']}\" удалена!") # Логирование
                cover_path = saveURLImage(card_id, cover, folder_path)
            
            elif cover.get("type") == "remove":
                # Удаляем обложку карточки из папки, если она существует
                if existing_card["cover"] and os.path.exists(existing_card["cover"]):
                    os.remove(existing_card["cover"])
                log.log("dataManager.py", f"Обложка \"{existing_card['cover']}\" удалена по запросу!") # Логирование
                cover_path = None # Устанавливаем значение обложки None, чтобы удалить её из карточки
            
            else:
                cover_path = existing_card["cover"] # Если тип не распознан, сохраняем старую обложку
        
        # Обновляем поля карточки
        updated_card = {
            "name": updated_data.get("name", existing_card["name"]),
            "author": updated_data.get("author", existing_card["author"]),
            "genre": updated_data.get("genre", existing_card["genre"]),
            "year": updated_data.get("year", existing_card["year"]),
            "type": updated_data.get("type", existing_card["type"]),
            "link": updated_data.get("link", existing_card["link"]),
            "description": updated_data.get("description", existing_card["description"]),
            "star": updated_data.get("star", existing_card["star"]),
            "cover": cover_path
        }

        # Выполняем обновление карточки в базе данных
        cursor.execute("""
            UPDATE cards
            SET name = ?, author = ?, genre = ?, year = ?, type = ?,
                link = ?, description = ?, star = ?, cover = ?
            WHERE id = ?
        """, (
            updated_card["name"],
            updated_card["author"],
            updated_card["genre"],
            updated_card["year"],
            updated_card["type"],
            updated_card["link"],
            updated_card["description"],
            updated_card["star"],
            updated_card["cover"],
            card_id
        ))  

        conn.commit()
        log.log("dataManager.py", f"Карточка '{updated_card.get('name')}' успешно отредактирована!") # Логирование
        return {"status": "success", "message": f"Карточка '{updated_card.get('name')}' успешно отредактирована!"}
    except Exception as e:
        log.log("dataManager.py", f"Ошибка редактировании карточки: {str(e)}") # Логирование
        return {"status": "error", "message": str(e)}
    finally:
        # Закрываем соединение с базой данных
        conn.close()

# =================
# УДАЛЕНИЕ КАРТОЧКИ
# =================
@eel.expose
def delete_card(card_id: str):
    try:
        # Подключаемся к базе данных
        conn = get_connection()
        cursor = conn.cursor()

        # Получаем карточку из базы данных
        cursor.execute("SELECT * FROM cards WHERE id = ?", (card_id,))
        card = cursor.fetchone()

        # Если карточка не найдена, возвращаем ошибку
        if not card:
            return {"status": "error", "message": "Карточка не найдена!"}

        # Удаляем обложку карточки из папки, если она существует
        if card["cover"] and os.path.exists(card["cover"]):
            os.remove(card["cover"])
            log.log("dataManager.py", f"Обложка \"{card['cover']}\" удалена!") # Логирование

        # Удаляем карточку из базы данных
        cursor.execute("DELETE FROM cards WHERE id = ?", (card_id,))
        conn.commit()
        log.log("dataManager.py", f"Карточка \"{card['name']}\" успешно удалена!") # Логирование
        return {"status": "success", "message": f"Карточка \"{card['name']}\" успешно удалена!"}
    except Exception as e:
        log.log("dataManager.py", f"Ошибка при удалении карточки: {str(e)}") # Логирование
        return {"status": "error", "message": str(e)}
    finally:
        # Закрываем соединение с базой данных
        conn.close()

# ========================
# ПОЛУЧЕНИЕ КАРТОЧКИ ПО ID
# ========================
@eel.expose
def get_card_by_id(card_id: str):
    try:
        # Подключаемся к базе данных
        conn = get_connection()
        cursor = conn.cursor()

        # Выполняем запрос к базе данных по id карточки
        cursor.execute("SELECT * FROM cards WHERE id = ?", (card_id,))
        row = cursor.fetchone()

        # Если запись найдена, возвращаем её как словарь
        if row:
            result = dict(row)
            return {"status": "success", "data": result}
        else:
            # Если карточка не найдена, возвращаем ошибку
            return {"status": "error", "message": "Карточка не найдена"}

    except Exception as e:
        # Логирование ошибки и возврат описания ошибки
        log.log("dataManager.py", f"Ошибка при получении карточки по ID: {str(e)}")
        return {"status": "error", "message": str(e)}
    finally:
        # Закрываем соединение с базой данных
        conn.close()

# =========================================
# ПОЛУЧЕНИЕ ВСЕХ КАРТОЧЕК + ПОИСК + ФИЛЬТРЫ
# =========================================
@eel.expose
def get_cards(limit=50, offset=0, search=None, type_filter=None):
    # Функция возвращает список карточек с пагинацией и возможностью фильтрации
    try:
        # Подключаемся к базе данных
        conn = get_connection()
        cursor = conn.cursor()

        # Формируем базовый SQL запрос
        query = "SELECT * FROM cards ORDER BY id DESC LIMIT ? OFFSET ?"
        params = []

        # TODO: Добавить возможность поиска и фильтрации карточек по различным полям (название, автор, жанр, год, тип и т.д.)

        # Добавляем условие поиска по названию если параметр передан
        # if search:
        #     query += " AND name LIKE ?"
        #     params.append(f"%{search}%")

        # Добавляем фильтр по типу если параметр передан
        # if type_filter:
        #     query += " AND type = ?"
        #     params.append(type_filter)

        # Добавляем сортировку, лимит и смещение для пагинации
        # query += " ORDER BY id DESC LIMIT ? OFFSET ?"

        # Добавляем параметры для пагинации
        params.extend([limit, offset])

        # Выполняем запрос к базе данных
        cursor.execute(query, params)

        # Преобразуем результаты в список словарей
        result = [dict(row) for row in cursor.fetchall()]
        
        # Возвращаем результаты
        return {"status": "success", "data": result}
    except Exception as e:
        if conn is not None:
            conn.close()
        log.log("dataManager.py", f"Ошибка при получении карточек: {str(e)}") # Логирование
        return {"status": "error", "message": str(e)}
    finally:
        # Закрываем соединение с базой данных
        conn.close()

# ===========================================
# ПОЛУЧЕНИЕ КОЛИЧЕСТВА КАРТОЧЕК В БАЗЕ ДАННЫХ
# ===========================================
@eel.expose
def get_cards_count():
    try:
        # Подключаемся к базе данных
        conn = get_connection()
        cursor = conn.cursor()

        # Выполняем запрос к базе данных для получения количества карточек
        cursor.execute("SELECT COUNT(*) AS count FROM cards")
        row = cursor.fetchone()

        # Возвращаем количество карточек
        return {"status": "success", "count": row["count"]}

    except Exception as e:
        log.log("dataManager.py", f"Ошибка при получении количества карточек: {str(e)}") # Логирование
        return {"status": "error", "message": str(e)}
    finally:
        # Закрываем соединение с базой данных
        conn.close()

# ===============
# СОЗДАНИЕ ГРУППЫ
# ===============
# ! Не протестировано. Протестировать функцию!
# def add_group(group_data: dict):
#     """
#     group_data должен содержать:
#     id, name, type, cover, timestamp
#     """

#     # Подключаемся к базе данных
#     conn = get_connection()
#     cursor = conn.cursor()

#     try:
#         cursor.execute("""
#             INSERT INTO groups (
#                 id, name, type, cover, added_cards, timestamp
#             ) VALUES (?, ?, ?, ?, 0, ?)
#         """, (
#             group_data["id"],
#             group_data["name"],
#             group_data.get("type"),
#             group_data.get("cover"),
#             group_data.get("timestamp")
#         ))

#         conn.commit()
#         return {"status": "success"}

#     except Exception as e:
#         return {"status": "error", "message": str(e)}
#     finally:
#         # Закрываем соединение с базой данных
#         conn.close()

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
# def link_card_to_group(card_id: str, group_id: str):
#     # Подключаемся к базе данных
#     conn = get_connection()
#     cursor = conn.cursor()

#     try:
#         # добавляем связь
#         cursor.execute("""
#             INSERT INTO group_cards (group_id, card_id)
#             VALUES (?, ?)
#         """, (group_id, card_id))

#         # обновляем счётчик карточек
#         cursor.execute("""
#             UPDATE groups
#             SET added_cards = added_cards + 1
#             WHERE id = ?
#         """, (group_id,))

#         conn.commit()
#         return {"status": "success"}

#     except Exception as e:
#         return {"status": "error", "message": str(e)}
#     finally:
#         # Закрываем соединение с базой данных
#         conn.close()

# ============================
# ПОЛУЧИТЬ ВСЕ КАРТОЧКИ ГРУППЫ
# ============================
# ! Не протестировано. Протестировать функцию!
# def get_cards_by_group(group_id: str):
#     # Подключаемся к базе данных
#     conn = get_connection()
#     cursor = conn.cursor()

#     cursor.execute("""
#         SELECT cards.*
#         FROM cards
#         JOIN group_cards ON cards.id = group_cards.card_id
#         WHERE group_cards.group_id = ?
#     """, (group_id,))

#     result = [dict(row) for row in cursor.fetchall()]
#     conn.close()

#     return result

# ================================
# ПОЛУЧИТЬ ВСЕ ГРУППЫ С КАРТОЧКАМИ
# ================================
# ! Не протестировано. Протестировать функцию!
# def get_groups_by_card(card_id: str):
#     # Подключаемся к базе данных
#     conn = get_connection()
#     cursor = conn.cursor()

#     cursor.execute("""
#         SELECT groups.*
#         FROM groups
#         JOIN group_cards ON groups.id = group_cards.group_id
#         WHERE group_cards.card_id = ?
#     """, (card_id,))

#     result = [dict(row) for row in cursor.fetchall()]
#     conn.close()

#     return result

# ======================
# СОХРАНЕНИЕ ИЗОБРАЖЕНИЯ
# ======================
def saveImage(cardID: str, image: dict, save_path: str):
        try:          
            # Проверка на наличие обложки
            if image and image.get("name") and image.get("data"):
                safe_name = f"{cardID}_{random.randint(1, 1000)}{image['name']}" # Имя файла для сохранения

                # Сохраняем файл в папку
                cover_path = os.path.join(save_path, safe_name)
                # Переводим файл из Base64 в бинарные данные
                cover_data = base64.b64decode(image["data"].split(",")[1])
                with open(cover_path, "wb") as f:
                    f.write(cover_data)
                log.log("dataManager.py", f"Новое изображение \"{safe_name}\" сохранено в \"{save_path}\"") # Логирование
                return cover_path
            else:
                return None
        except Exception as e:
            log.log("dataManager.py", f"Произошла ошибка при сохранении изображения \"{safe_name}\": {e}") # Логирование
            return None

# ==========================
# СОХРАНЕНИЕ URL ИЗОБРАЖЕНИЯ
# ==========================
def saveURLImage(cardID: str, image: dict, save_path: str):
    try:
        # Получаем URL изображения из данных
        url = image.get("data")

        # Инициализируем переменные для расширения и статуса расширения
        extension = ".jpg"  # Расширение по умолчанию

        # Проверяем расширение файла
        filename = image['name'].lower()
        
        for ext in (".png", ".jpg", ".jpeg", ".webp", ".gif"):
            if ext in filename:
                extension = ext
                break

        file_name = f"{cardID}_{random.randint(1, 1000)}{extension}" # Имя файла для сохранения

        # Формируем полный путь до файла
        cover_path = os.path.join(save_path, file_name)
        
        # Устанавливаем заголовки для запроса
        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        # Создаем запрос с заголовками
        req = urllib.request.Request(url, headers=headers)

        # Скачиваем изображение потоком с таймаутом 10 секунд
        with urllib.request.urlopen(req, timeout=5) as response, open(cover_path, "wb") as f:
            while True:
                # Читаем по 256KB блокам
                chunk = response.read(262144)
                if not chunk:
                    break
                f.write(chunk)

        log.log("dataManager.py", f"Новое изображение \"{file_name}\" сохранено в \"{cover_path}\"") # Логирование
        return cover_path
    except Exception as e:
        log.log("dataManager.py", f"Ошибка при сохранении URL изображения: {e}") # Логирование
        return None