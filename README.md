# Photo Hosting

Веб-приложение для хостинга фотографий с использованием библиотеки компонентов UI.

## Запуск приложения

### Установка зависимостей

```bash
cd frontend
npm install

cd ../ui
npm install
```

### Запуск в режиме разработки

```bash
# Терминал 1: Сборка ui библиотеки
cd ui
npm run build

# Терминал 2: Запуск frontend приложения
cd frontend
npm run dev
```

Приложение будет доступно по адресу http://localhost:5173

## Дополнительные команды

### Линтинг

```bash
npm run lint       # Проверка кода
```

### Тестирование

```bash
npm run test              # Запуск тестов
```

скрины приложения:
![главная страница](./README-imgs/image.png)

![страница входа](./README-imgs/image-1.png)

![страница регистрации](./README-imgs/image-2.png)