# Weather App

Веб-приложение для просмотра погоды с авторизацией и сохранением избранных городов. Позволяет искать погоду по городу, просматривать детали (температура, влажность, осадки, ветер) и сохранять города в личный список. Полноценный Full Stack проект с Frontend на vue.js и Backend на FastAPI и PostgreSQL.

**Рабочий сайт:** https://weather-app-seven-woad.vercel.app/

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

---

# Weather App

A web app for viewing the weather, with authentication and saved favorite cities. It lets you search weather by city, view details (temperature, humidity, precipitation, wind), and save cities to a personal list. A complete full-stack project with a Vue.js frontend and a FastAPI + PostgreSQL backend.

**Live site:** https://weather-app-seven-woad.vercel.app/

## Features

- Registration and authentication with validation (email, password, city)
- JWT authentication (access + refresh tokens)
- User profile with the ability to change city
- Weather search by city name (geocoding via Nominatim)
- Current weather display: temperature, humidity, precipitation, wind, description, icon
- Saving cities to favorites (tied to the user)
- Data storage in PostgreSQL + localStorage
- Responsive layout for desktop, tablets, and phones
- REST API with automatic Swagger documentation

## Stack

- **Vue 3** - Frontend
- **HTML/CSS** - Basic layout
- **Vue Router** - Routing
- **Pinia** - State management
- **Vite** - Build tool
- **FastAPI** - Backend
- **SQLAlchemy (async)** - ORM for database access
- **PostgreSQL** - Relational database
- **Alembic** - Database migrations
- **JWT (PyJWT)** - Authentication
- **passlib (pbkdf2_sha256)** - Password hashing

## APIs Used
- **Open-Meteo** - weather (no API key)
- **Nominatim** - geocoding (converting a city name into coordinates)

## Installation and Running

1) **Clone the repository**

```bash
git clone https://github.com/vulkan790/WeatherApp.git
npm install
```

2) **Configure and run the backend (FastAPI)**

1. **Go to the Backend folder**

```
cd backend
```

2. **Install the Python dependencies from requirements.txt**

3. **Create a file in the project root (inside WeatherApp/)**

```
cd ..
```

```env
SECRET_KEY=secret_key
Generate it with this console command: python -c "import secrets; print(secrets.token_hex(32))" 
```

4. **Create the database**

```sql
CREATE USER weather_user WITH PASSWORD 'xxxxxxxx';
CREATE DATABASE weather_db OWNER weather_user ENCODING 'UTF-8';
```

5. **Apply the Alembic migrations**

```
python -m alembic init -t async migrations
python -m alembic revision --autogenerate -m "Init migrations"
python -m alembic upgrade head
```

6. **Start the FastAPI server**

```
python -m uvicorn backend.main:app --reload
```

The server will be available at: http://localhost:8000

7. **Check the API**

Open in your browser: http://localhost:8000/docs — you'll see the interactive Swagger UI documentation describing all endpoints.

3) **Configure and run the frontend (vue.js)**

1. **Install dependencies**

```
cd frontend
npm install
```

2. **Run in development mode**

```
npm run dev
```

3. **Open in your browser**

4. **Build for production**

```
npm run build
```

## Structure

Frontend

```
src/
├── main.js                # Entry point
├── App.vue                # Root component with navigation
├── style.css              # Global styles and responsiveness
├── stores/
│   ├── auth.js            # Pinia store: authentication, registration, profile
│   └── weather.js         # Pinia store: weather, geocoding, saved cities
├── pages/                 # Pages
│   ├── AuthPage.vue       # Login page
│   ├── RegisterPage.vue   # Registration page
│   ├── HomePage.vue       # Home page
│   ├── ProfilePage.vue    # User profile
│   ├── WeatherPage.vue    # Weather search and display
│   └── NotFoundPage.vue   # 404 page
├── components/            # Reusable components
│   ├── WeatherCard.vue    # Weather card (with slots)
│   └── SavedCities.vue    # List of saved cities
└── router/
    └── index.js           # Routes
```

Backend
```
backend/
├── __init__.py
├── main.py                # FastAPI entry point
├── config.py              # Environment variables
├── database.py            # SQLAlchemy setup
├── db_depends.py          # DB session dependency
├── auth.py                # JWT, hashing, get_current_user
├── alembic.ini            # Alembic configuration
├── schemas.py             # Pydantic schemas
├── models/
│   ├── __init__.py
│   ├── user.py            # User model
│   └── saved_city.py      # SavedCity model
├── routers/
│   ├── __init__.py
│   ├── users.py           # Registration, login, profile
│   └── cities.py          # CRUD for favorite cities
└── migrations/            # Alembic
```

## API Endpoints

| Method | Endpoint             | Description                 |
|--------|----------------------|-----------------------------|
| GET    | /users/me            | Get profile                 |
| POST   | /users/              | Registration                |
| POST   | /users/token         | Authentication (OAuth2)     |
| POST   | /users/refresh-token | Refresh access_token        |
| PUT    | /users/me            | Update profile              |
| GET    | /cities/             | List of saved cities        |
| POST   | /cities/             | Add a city                  |
| DELETE | /cities/{city_name}  | Delete a city               |
