# Установка Windows SDK для better-sqlite3

## Проблема
При установке `better-sqlite3` возникает ошибка компиляции из-за отсутствия Windows SDK.

## У вас уже установлено
✅ Visual Studio 2022 Build Tools
✅ Visual Studio C++ core features
✅ VC++ toolset v143

## Что нужно установить
❌ Windows SDK

## Решение 1: Установка через Visual Studio Installer (Рекомендуется)

### Шаги:
1. Откройте **Visual Studio Installer**
   - Найдите в меню Пуск "Visual Studio Installer"
   - Или запустите: `"C:\Program Files (x86)\Microsoft Visual Studio\Installer\vs_installer.exe"`

2. Нажмите **"Изменить"** (Modify) для Visual Studio 2022 Build Tools

3. Во вкладке **"Отдельные компоненты"** (Individual components) найдите и отметьте:
   - **Windows 11 SDK** (последняя версия, например 10.0.22621.0)
   - или **Windows 10 SDK** (10.0.19041.0 или новее)

4. Нажмите **"Изменить"** (Modify) и дождитесь установки

5. После установки вернитесь в терминал и выполните:
   ```bash
   cd "D:\kai\3 course\js\photo-hosting\backend"
   npm install
   ```

## Решение 2: Установка через Chocolatey

Если у вас установлен Chocolatey:

```bash
choco install windows-sdk-10-version-2004-all
```

## Решение 3: Ручная загрузка

1. Скачайте Windows SDK с официального сайта:
   https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/

2. Запустите установщик и выберите:
   - ✅ Windows SDK for Desktop C++ Apps
   - ✅ Windows SDK for UWP C++ Apps

3. Установите SDK

4. Попробуйте снова установить зависимости:
   ```bash
   cd "D:\kai\3 course\js\photo-hosting\backend"
   npm install
   ```

## Проверка установки

После установки SDK выполните:

```bash
npm install better-sqlite3
```

Если установка прошла успешно, вы увидите:
```
added 1 package, and audited X packages in Xs
```

## Альтернатива: Использование sqlite3

Если установка Windows SDK невозможна, можно использовать пакет `sqlite3` вместо `better-sqlite3`, но это потребует изменений в коде (переход на асинхронный API).

---

## Статус
- [x] Visual Studio Build Tools установлены
- [ ] Windows SDK установлен ← **Нужно установить**
- [ ] better-sqlite3 скомпилирован
