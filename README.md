# Weather App

Веб-приложение для просмотра погоды с авторизацией и сохранением избранных городов. Позволяет искать погоду по городу, просматривать детали (температура, влажность, осадки, ветер) и сохранять города в личный список.

**Рабочий сайт:** https://weather-app-five-bay-60.vercel.app/

## Возможности

- Регистрация и авторизация с валидацией (email, пароль, город)
- Профиль пользователя с возможностью изменить город
- Поиск погоды по названию города (геокодинг через Nominatim)
- Отображение текущей погоды: температура, влажность, осадки, ветер, описание, иконка
- Сохранение городов в избранное (привязано к пользователю)
- Хранение данных в localStorage (имитация базы данных, backend будет добавлен позже)
- Адаптивная вёрстка для десктопа, планшетов и телефонов

## Стек

- **Vue 3** - Frontend
- **HTML/CSS** - Базовая вёрстка
- **Vue Router** — Маршрутизация
- **Pinia** — управление состоянием
- **Vite** — Сборка

## Используемые API
- **Open-Meteo** — погода (без API-ключа)
- **Nominatim** — геокодинг (преобразование названия города в координаты)

## Запуск локально

```bash
git clone https://github.com/vulkan790/WeatherApp.git
npm install
```

Запустите:

```bash
npm run dev
```

## Структура

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

# Weather App

A web application for viewing weather with authentication and saving favorite cities. Allows you to search for weather by city, view details (temperature, humidity, precipitation, wind), and save cities to a personal list.

**Live site:** https://weather-app-five-bay-60.vercel.app/

## Features

- Registration and login with validation (email, password, city)
- User profile with the ability to change city
- Weather search by city name (geocoding via Nominatim)
- Display current weather: temperature, humidity, precipitation, wind, description, icon
- Save cities to favorites (tied to user)
- Data storage in localStorage (simulating a database, backend will be added later)
- Responsive layout for desktop, tablet, and mobile

## Stack

- **Vue 3** - Frontend
- **HTML/CSS** - Basic styling
- **Vue Router** — Routing
- **Pinia** — State management
- **Vite** — Build tool

## Used API
- **Open-Meteo** — weather (no API key required)
- **Nominatim** — geocoding (converts city name to coordinates)

## Running locally

```bash
git clone https://github.com/vulkan790/WeatherApp.git
npm install
```

Start the dev server:

```bash
npm run dev
```

## Structure

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