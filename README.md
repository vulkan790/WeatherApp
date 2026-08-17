# Weather App

Веб-приложение для просмотра погоды с авторизацией и сохранением избранных городов. Позволяет искать погоду по городу, просматривать детали (температура, влажность, осадки, ветер) и сохранять города в личный список. Полноценный Full Stack проект с Frontend на vue.js и Backend на FastAPI и PostgreSQL.

**Рабочий сайт:** https://weather-app-five-bay-60.vercel.app/

## Возможности

- Регистрация и авторизация с валидацией (email, пароль, город)
- JWT-аутентификация (access + refresh токены)
- Профиль пользователя с возможностью изменить город
- Поиск погоды по названию города (геокодинг через Nominatim)
- Отображение текущей погоды: температура, влажность, осадки, ветер, описание, иконка
- Сохранение городов в избранное (привязано к пользователю)
- Хранение данных в PostgreSQL + localStorage
- Адаптивная вёрстка для десктопа, планшетов и телефонов
- REST API с автоматической документацией Swagger

## Стек

- **Vue 3** - Frontend
- **HTML/CSS** - Базовая вёрстка
- **Vue Router** - Маршрутизация
- **Pinia** - управление состоянием
- **Vite** - Сборка
- **FastAPI** - Backend
- **SQLAlchemy (async)** - ORM для работы с БД
- **PostgreSQL**- Реляционная база данных
- **Alembic** - Миграции БД
- **JWT (PyJWT)** - Аутентификация
- **passlib (pbkdf2_sha256)** - Хеширование паролей

## Используемые API
- **Open-Meteo** - погода (без API-ключа)
- **Nominatim** - геокодинг (преобразование названия города в координаты)

## Установка и запуск

1) **Клонируйте репозиторий**

```bash
git clone https://github.com/vulkan790/WeatherApp.git
npm install
```

2) **Настройка и запуск бекенда (FastAPI)**

1. **Перейдите в папку с Backend**

```
cd backend
```

2. **Установите зависимости python из requirements.txt**

3. **Создайте файл в корне проекта (внутри WeatherApp/)**

```
cd ..
```

```env
SECRET_KEY=секретный_ключ
С помощью команды в консоли: python -c "import secrets; print(secrets.token_hex(32))" 
```

4. **Создайте базу данных**

```sql
CREATE USER weather_user WITH PASSWORD 'xxxxxxxx';
CREATE DATABASE weather_db OWNER weather_user ENCODING 'UTF-8';
```

5. **Примените миграции Alembic**

```
python -m alembic init -t async migrations
python -m alembic revision --autogenerate -m "Init migrations"
python -m alembic upgrade head
```

6. **Запустите сервер FastAPI**

```
python -m uvicorn backend.main:app --reload
```

Сервер будет доступен по адресу: http://localhost:8000

7. **Проверьте работу API**

Откройте в браузере: http://localhost:8000/docs Вы увидите интерактивную документацию Swagger UI с описанием всех эндпоинтов.

3) **Настройка и запуск Фронтенда (vue.js)**

1. **Установите зависимости**

```
cd frontend
npm install
```

2. **Запустите в режиме разработки**

```
npm run dev
```

3. **Откройте в браузере**

4. **Сборка для production**

```
npm run build
```

## Структура

Frontend

```
src/
├── main.js                # Точка входа
├── App.vue                # Корневой компонент с навигацией
├── style.css              # Глобальные стили и адаптивность
├── stores/
│   ├── auth.js            # Pinia store: авторизация, регистрация, профиль
│   └── weather.js         # Pinia store: погода, геокодинг, сохранённые города
├── pages/                 # Страницы
│   ├── AuthPage.vue       # Страница входа
│   ├── RegisterPage.vue   # Страница регистрации
│   ├── HomePage.vue       # Главная страница
│   ├── ProfilePage.vue    # Профиль пользователя
│   ├── WeatherPage.vue    # Поиск и отображение погоды
│   └── NotFoundPage.vue   # Страница 404
├── components/            # Переиспользуемые компоненты
│   ├── WeatherCard.vue    # Карточка с погодой (со слотами)
│   └── SavedCities.vue    # Список сохранённых городов
└── router/
    └── index.js           # Маршруты
```

Backend
```
backend/
├── __init__.py
├── main.py                # Точка входа FastAPI
├── config.py              # Переменные окружения
├── database.py            # Настройка SQLAlchemy
├── db_depends.py          # Зависимость для сессии БД
├── auth.py                # JWT, хеширование, get_current_user
├── alembic.ini            # Инициализация Alembic
├── schemas.py             # Pydantic-схемы
├── models/
│   ├── __init__.py
│   ├── user.py            # Модель User
│   └── saved_city.py      # Модель SavedCity
├── routers/
│   ├── __init__.py
│   ├── users.py           # Регистрация, логин, профиль
│   └── cities.py          # CRUD избранных городов
└── migrations/            # Alembic
```

## API Эндпоинты

| Метод	 |        Эндпоинт	    |           Описание          |
|--------|----------------------|-----------------------------|
| GET	 | /users/me	        | Получение профиля           |
| POST	 | /users/	            | Регистрация                 |
| POST	 | /users/token	        | Авторизация (OAuth2)        |
| POST   | /users/refresh-token	| Обновление access_token     |
| PUT    | /users/me	        | Обновление профиля          |
| GET    | /cities/  	        | Список сохранённых городов  |
| POST   | /cities/  	        | Добавить город              |
| DELETE | /cities/{city_name}  | Удалить город               |