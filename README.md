# 🦅 Eaglo — MVP приложения для изучения языков

Duolingo-подобный сайт для подготовки к IELTS и SAT с персонажем Eaglo.

---

## 🚀 Как запустить

### Шаг 1 — Установи Node.js (один раз)
Скачай с https://nodejs.org → кнопка **LTS**. Установи как обычную программу.

### Шаг 2 — Открой папку проекта в терминале

**Mac:** Открой Terminal → перетащи папку `eaglo` в окно → нажми Enter  
**Windows:** Открой папку `eaglo` → Shift + правая кнопка мыши → «Открыть в PowerShell»

### Шаг 3 — Установи зависимости (один раз)
```
npm install
```

### Шаг 4 — Запусти сайт
```
npm run dev
```

Открой в браузере: **http://localhost:5173**

---

## 📁 Структура проекта

```
eaglo/
├── index.html                  ← точка входа HTML
├── package.json                ← зависимости проекта
├── vite.config.js              ← настройка сборщика
│
└── src/
    ├── main.jsx                ← запуск React
    ├── App.jsx                 ← главная логика и роутинг
    │
    ├── components/             ← переиспользуемые компоненты
    │   ├── EagloChar.jsx       ← SVG-персонаж Eaglo
    │   ├── BottomNav.jsx       ← нижняя навигация
    │   └── Confetti.jsx        ← конфетти после урока
    │
    ├── pages/                  ← экраны приложения
    │   ├── HomePage.jsx        ← список курсов и уроков
    │   ├── QuizPage.jsx        ← экран квиза
    │   ├── ResultPage.jsx      ← результаты урока
    │   ├── AchievementsPage.jsx← достижения
    │   └── RanksPage.jsx       ← лиги и звания
    │
    ├── data/                   ← все данные приложения
    │   ├── lessons.js          ← курсы IELTS и SAT с вопросами
    │   ├── achievements.js     ← список достижений
    │   └── ranks.js            ← система лиг
    │
    └── styles/                 ← CSS стили
        ├── global.css          ← глобальные стили и переменные
        ├── HomePage.module.css
        ├── QuizPage.module.css
        ├── ResultPage.module.css
        ├── AchievementsPage.module.css
        └── RanksPage.module.css
```

---

## 🎮 Что есть в приложении

**Курсы:**
- 🎓 IELTS — Academic Vocabulary, Listening Skills, Writing Task 2
- 📝 SAT — Vocabulary, Math Basics, Grammar & Writing

**Система лиг:**
🪨 Камень → 🥉 Бронза → 🥈 Серебро → 🥇 Золото → 🏆 Платина → 💎 Алмаз → 🌑 Обсидиан → 👑 Легенда

**Достижения:** 12 штук — от «Первые слова» до «Орлиный взгляд»

**Eaglo:** прыгает, радуется, расстраивается, танцует — всё как положено!
