# Архитектура проекта
## Обзор
Система состоит из двух независимых проектов в монорепозитории:
### frontend - основное приложение для пользователей
```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── UploadForm/
│   │   └── Loader/
│   ├── pages/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Gallery/
│   │   └── Upload/
│   ├── router/
│   │   ├── AppRouter.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   ├── SessionContext.tsx
│   │   └── SessionProvider.tsx
│   ├── db/
│   │   ├── index.ts
│   │   └── types.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── imageService.ts
│   │   └── sessionService.ts
│   ├── utils/
│   │   ├── crypto.ts
│   │   └── validators.ts
│   ├── App.tsx
│   ├── App.test.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── .gitignore
├── eslint.config.js
├── index.html
├── jest.config.ts
├── package.json
├── vite.config.ts
└── tsconfig.json
```
### ui - библиотека UI-компонентов
```
ui/
├── src/
│   ├── Gallery/
│   ├── PhotoCard/
│   ├── Button/
│   ├── Input/
│   ├── Form/
│   └── index.ts
├── package.json
├── .gitignore
├── eslint.config.js
├── jest.config.ts
├── vite.config.ts
└── tsconfig.json
```

## Технологический стек
### Runtime зависимости
- react ^19.2.1 - UI библиотека
- react-dom ^19.2.1 - Рендеринг React
- react-router-dom ^7.10.1 - Маршрутизация
- dexie ^4.2.1 - Работа с IndexedDB

### Dev зависимости
- typescript ~5.9.3 - Статическая типизация
- vite ^7.2.6 - Сборщик и dev-сервер
- eslint ^9.39.1 - Линтинг кода
- jest ^30.2.0 - Тестирование

## Компоненты
- Gallery - Адаптивная сетка для отображения фотографий
- PhotoCard - Карточка фотографии с метаданными
- Button - Универсальная кнопка с вариантами стилей
- Input - Поле ввода данных
- Form - Базовая форма с валидацией

## Структура роутинга
### Основное приложение
```
Публичные маршруты
├── /login - Авторизация
└── /register - Регистрация

Защищенные маршруты
├── /gallery - Галерея изображений
└── /upload - Загрузка изображений
```

## Хранение данных
Данные хранятся в IndexedDB (база AppDB):
- **users** - пользователи (id, email, passwordHash, createdAt)
- **images** - изображения (id, userId, file, filename, createdAt)

Состояние управляется через React Context (SessionContext). Сессия сохраняется в localStorage для восстановления после перезагрузки.
