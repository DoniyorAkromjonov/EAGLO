
export const COURSES = [
  {
    id: 'ielts',
    title: 'IELTS',
    emoji: '🎓',
    color: '#e6f1fb',
    borderColor: '#378add',
    desc: 'Подготовка к академическому экзамену',
    tag: 'Академический',
    tagColor: '#185fa5',
    lessons: [
      {
        id: 'ielts-1',
        title: 'Academic Vocabulary',
        emoji: '📚',
        color: '#e6f1fb',
        xp: 20,
        locked: false,
        desc: 'Слова для Writing & Reading',
        questions: [
          {
            q: 'Что значит «Nevertheless»?',
            hint: 'Коннектор для эссе',
            options: ['Тем не менее', 'Следовательно', 'Кроме того', 'Например'],
            answer: 0,
          },
          {
            q: 'Переведи: «The data illustrates a significant trend»',
            hint: 'Фраза для анализа графика',
            options: [
              'Данные показывают незначительное изменение',
              'Данные иллюстрируют значимую тенденцию',
              'Данные скрывают важную информацию',
              'Данные требуют дополнительного анализа',
            ],
            answer: 1,
          },
          {
            q: 'Как лучше перефразировать «increase» в академическом тексте?',
            hint: 'Academic synonym',
            options: ['go up', 'rise', 'surge dramatically', 'escalate substantially'],
            answer: 3,
          },
          {
            q: 'Что значит «albeit»?',
            hint: 'Встречается в Reading passages',
            options: ['Хотя', 'Потому что', 'Вместо этого', 'Безусловно'],
            answer: 0,
          },
          {
            q: 'Выбери правильный вариант для Task 1: описание графика',
            hint: 'Вводная фраза',
            options: [
              'The graph is showing...',
              'As we can see from the graph...',
              'The graph illustrates...',
              'Looking at the graph, there is...',
            ],
            answer: 2,
          },
        ],
      },
      {
        id: 'ielts-2',
        title: 'Listening Skills',
        emoji: '🎧',
        color: '#eeedfe',
        xp: 25,
        locked: false,
        desc: 'Ключевые фразы для аудирования',
        questions: [
          {
            q: 'В Listening что значит «Mind you»?',
            hint: 'Разговорная фраза',
            options: ['Заметь', 'Забудь об этом', 'Напомни мне', 'Постарайся'],
            answer: 0,
          },
          {
            q: 'Что значит «approximately»?',
            hint: 'Часто в Listening Section 1',
            options: ['Точно', 'Приблизительно', 'Максимально', 'Полностью'],
            answer: 1,
          },
          {
            q: "Speaker says: «I'd rather not». Что это значит?",
            hint: 'Выражение предпочтения',
            options: ['Я не могу', 'Я предпочёл бы не делать этого', 'Мне всё равно', 'Я рад помочь'],
            answer: 1,
          },
          {
            q: 'Что значит «Could you elaborate on that?»',
            hint: 'Academic conversation',
            options: [
              'Можете ли вы замолчать?',
              'Можете ли вы повторить?',
              'Можете ли вы рассказать подробнее?',
              'Вы согласны с этим?',
            ],
            answer: 2,
          },
        ],
      },
      {
        id: 'ielts-3',
        title: 'Writing Task 2',
        emoji: '✍️',
        color: '#fbeaf0',
        xp: 30,
        locked: true,
        desc: 'Структура эссе IELTS',
        questions: [],
      },
      {
        id: 'ielts-4',
        title: 'Reading Comprehension',
        emoji: '📖',
        color: '#e6f7e6',
        xp: 25,
        locked: true,
        desc: 'Техники чтения и понимания текстов',
        questions: [
          {
            q: 'Что такое skimming?',
            hint: 'Техника чтения',
            options: ['Чтение по диагонали', 'Подробное чтение', 'Чтение вслух', 'Перевод'],
            answer: 0,
          },
          {
            q: 'Какой тип вопроса проверяет понимание главного?',
            hint: 'Reading question types',
            options: ['Detail', 'Main idea', 'Inference', 'Vocabulary'],
            answer: 1,
          },
          {
            q: 'Что значит «inference» в Reading?',
            hint: 'Вывод из текста',
            options: ['Прямой факт', 'Вывод', 'Пример', 'Определение'],
            answer: 1,
          },
          {
            q: 'Какой навык важен для True/False/Not Given?',
            hint: 'Ключевой навык',
            options: ['Запоминание фактов', 'Понимание нюансов', 'Скорость чтения', 'Счёт слов'],
            answer: 1,
          },
        ],
      },
      {
        id: 'ielts-5',
        title: 'Speaking Practice',
        emoji: '🗣️',
        color: '#fff2e6',
        xp: 25,
        locked: true,
        desc: 'Подготовка к устной части экзамена',
        questions: [
          {
            q: 'Как начать ответ в Speaking Part 1?',
            hint: 'Opening phrase',
            options: ['Well, I think...', 'Actually, I...', 'To be honest,...', 'Все вышеперечисленное'],
            answer: 3,
          },
          {
            q: 'Что делать, если не знаешь слово?',
            hint: 'Speaking strategy',
            options: ['Молчать', 'Объяснить по-другому', 'Повторить вопрос', 'Закончить разговор'],
            answer: 1,
          },
          {
            q: 'Как описать график в Speaking Part 2?',
            hint: 'Structure',
            options: ['Введение + детали + заключение', 'Только факты', 'Мнение', 'Вопросы'],
            answer: 0,
          },
          {
            q: 'Что оценивают в Speaking?',
            hint: 'Criteria',
            options: ['Только грамматика', 'Fluency, Lexis, Grammar, Pronunciation', 'Скорость речи', 'Длина ответа'],
            answer: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'sat',
    title: 'SAT',
    emoji: '📝',
    color: '#faeeda',
    borderColor: '#ef9f27',
    desc: 'Подготовка к американскому тесту',
    tag: 'США / Университет',
    tagColor: '#854f0b',
    lessons: [
      {
        id: 'sat-1',
        title: 'SAT Vocabulary',
        emoji: '🔤',
        color: '#faeeda',
        xp: 20,
        locked: false,
        desc: '500 слов для секции Reading',
        questions: [
          {
            q: 'Что значит «Benevolent»?',
            hint: 'SAT high-frequency word',
            options: ['Злобный', 'Доброжелательный', 'Равнодушный', 'Честолюбивый'],
            answer: 1,
          },
          {
            q: 'Антоним слова «Ephemeral»?',
            hint: 'Ephemeral = кратковременный',
            options: ['Fleeting', 'Temporary', 'Enduring', 'Fragile'],
            answer: 2,
          },
          {
            q: 'Что значит «Pragmatic»?',
            hint: 'Часто встречается в SAT passages',
            options: ['Идеалистичный', 'Практичный', 'Критичный', 'Творческий'],
            answer: 1,
          },
          {
            q: 'Синоним «Meticulous»?',
            hint: 'Описывает тщательный подход',
            options: ['Careless', 'Hasty', 'Thorough', 'Vague'],
            answer: 2,
          },
          {
            q: 'Что значит «Ambiguous»?',
            hint: 'SAT Reading — описание текстов',
            options: ['Ясный', 'Двусмысленный', 'Подробный', 'Краткий'],
            answer: 1,
          },
        ],
      },
      {
        id: 'sat-2',
        title: 'SAT Math Basics',
        emoji: '🔢',
        color: '#eaf3de',
        xp: 25,
        locked: false,
        desc: 'Основные формулы и понятия',
        questions: [
          {
            q: 'Чему равно (x²-9) при x=4?',
            hint: 'Подставь x=4',
            options: ['5', '7', '9', '16'],
            answer: 1,
          },
          {
            q: 'Что такое «slope» в уравнении y = mx + b?',
            hint: 'Линейное уравнение',
            options: ['Точка пересечения с осью Y', 'Наклон прямой', 'Длина отрезка', 'Площадь фигуры'],
            answer: 1,
          },
          {
            q: 'Если 3x + 6 = 21, чему равно x?',
            hint: 'Линейное уравнение',
            options: ['3', '5', '6', '9'],
            answer: 1,
          },
          {
            q: 'Что значит «median» в статистике?',
            hint: 'SAT Data Analysis',
            options: ['Среднее арифметическое', 'Наиболее частое значение', 'Серединное значение', 'Наибольшее значение'],
            answer: 2,
          },
        ],
      },
      {
        id: 'sat-3',
        title: 'Grammar & Writing',
        emoji: '📖',
        color: '#fcebeb',
        xp: 30,
        locked: true,
        desc: 'SAT Writing and Language',
        questions: [],
      },
    ],
  },
  {
    id: 'typing',
    title: 'Typing',
    emoji: '⌨️',
    color: '#f0f8ff',
    borderColor: '#4682b4',
    desc: 'Уроки печати и скорости набора',
    tag: 'Печать',
    tagColor: '#2e5c8a',
    lessons: [
      {
        id: "typing-beginner",
        title: "Typing Speed Basics",
        emoji: '⌨️',
        color: '#f0f8ff',
        xp: 50,
        locked: false,
        desc: 'Learn fast typing and finger placement',
        questions: [
          {
            q: "Which finger is used for the F key?",
            hint: 'Home row finger placement',
            options: [
              "Left index finger",
              "Right index finger",
              "Left thumb",
              "Right pinky"
            ],
            answer: 0
          },
          {
            q: "What is the main goal of touch typing?",
            hint: 'Typing technique',
            options: [
              "Typing without looking",
              "Typing with one hand",
              "Typing slowly",
              "Typing only numbers"
            ],
            answer: 0
          },
          {
            q: "Which row is called the home row?",
            hint: 'Keyboard layout',
            options: [
              "ASDF JKL;",
              "QWERTY",
              "ZXCV",
              "123456"
            ],
            answer: 0
          }
        ]
      },
      {
        id: "typing-advanced",
        title: "Typing Speed Master",
        emoji: '⚡',
        color: '#e6f3ff',
        xp: 100,
        locked: true,
        desc: 'Increase typing speed and accuracy',
        questions: [
          {
            q: "What is considered a good typing speed?",
            hint: 'WPM measurement',
            options: ["50+ WPM", "10 WPM", "20 WPM", "5 WPM"],
            answer: 0
          },
          {
            q: "What does WPM mean?",
            hint: 'Typing metric',
            options: [
              "Words Per Minute",
              "Writing Per Method",
              "Words Per Method",
              "Write Power Mode"
            ],
            answer: 0
          }
        ]
      }
    ]
  },
  {
    id: 'python',
    title: 'Coding',
    emoji: '🐍',
    color: '#fff3cd',
    borderColor: '#ffc107',
    desc: 'Основы программирования на Python',
    tag: 'Программирование',
    tagColor: '#856404',
    lessons: [
      {
        id: "python-basics",
        title: "Python Basics",
        emoji: '🐍',
        color: '#fff3cd',
        xp: 75,
        locked: false,
        desc: 'Learn variables, print, and input',
        questions: [
          {
            q: "How do you print text in Python?",
            hint: 'Basic output function',
            options: [
              "print('text')",
              "echo('text')",
              "write('text')",
              "output('text')"
            ],
            answer: 0
          },
          {
            q: "How do you create a variable in Python?",
            hint: 'Variable assignment',
            options: [
              "var x = 5",
              "x := 5",
              "x = 5",
              "let x = 5"
            ],
            answer: 2
          },
          {
            q: "What is the correct way to get user input?",
            hint: 'Input function',
            options: [
              "input()",
              "get_input()",
              "read()",
              "scan()"
            ],
            answer: 0
          }
        ]
      }
    ]
  }
];


// Flatten all lessons for quiz access
export const ALL_LESSONS = COURSES.flatMap(c => c.lessons);

