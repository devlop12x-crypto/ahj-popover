# AHJ — Popover Widget

[![Build and Deploy](https://github.com/devlop12x-crypto/ahj-popover/actions/workflows/deploy.yml/badge.svg)](https://github.com/devlop12x-crypto/ahj-popover/actions/workflows/deploy.yml)

Реализация Bootstrap Popover на чистом JavaScript (без jQuery).

## 🔗 GitHub Pages

👉 **[Демо](https://devlop12x-crypto.github.io/ahj-popover/)**

## Описание

Виджет Popover показывается **сверху** кнопки-триггера и **горизонтально центрируется** по ней.  
Позиционирование выполняется в `px` (без `translate` / `translate3d`).

### Возможности
- Показ/скрытие по клику (toggle)
- Заголовок и текст контента
- Стрелка-каретка снизу popover'а
- Горизонтальное центрирование по триггеру

## Технологии

- Webpack 5 + Babel
- CSS (MiniCssExtractPlugin для prod)
- ESLint (airbnb-base)
- Jest + JSDOM (15 тестов)
- GitHub Actions CI/CD

## Установка и запуск

```bash
npm install
npm start         # dev-сервер на http://localhost:9000
npm run build     # production сборка в ./dist
npm test          # запуск тестов
```

## Структура проекта

```
src/
  Popover.js          # класс Popover
  index.js            # точка входа
  index.html          # HTML-шаблон
  styles.css          # стили
  __tests__/
    Popover.test.js   # тесты (JSDOM)
  __mocks__/
    styleMock.js      # мок CSS для Jest
.github/workflows/
  deploy.yml          # CI/CD pipeline
webpack.config.js
.babelrc
```
