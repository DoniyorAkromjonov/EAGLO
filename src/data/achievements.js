// ── Achievements ──
import listening10 from '../assets/achievements/listening_10days.jpg'
import listening1 from '../assets/achievements/listening_1day.jpg'
import reading10 from '../assets/achievements/reading_10days.jpg'
import reading1 from '../assets/achievements/reading_1day.jpg'
import speaking10 from '../assets/achievements/speaking_10days.jpg'
import speaking1 from '../assets/achievements/speaking_1day.jpg'
import writing10 from '../assets/achievements/writing_10days.jpg'
import writing1 from '../assets/achievements/writing_1day.jpg'
import satMath10 from '../assets/achievements/SATMath_10correct_answers.jpg'
import satMath50 from '../assets/achievements/SATMath_50correct_answers.png'
import satMath100 from '../assets/achievements/SATMath_100correct_answers.png'
import satReading10 from '../assets/achievements/SATReading_10correct_answers.png'
import satReading50 from '../assets/achievements/SATReading_50correct_answers.png'
import satReading100 from '../assets/achievements/SATReading_100correct_answers.png'
import satWriting10 from '../assets/achievements/SATWriting_10percent_answers.png'
import satWriting50 from '../assets/achievements/SATWriting_50percent_answers.png'
import satWriting100 from '../assets/achievements/SATWriting_100percent_answers.png'
import typing10 from '../assets/achievements/Typing_10wpm.png'
import typing40 from '../assets/achievements/Typing_40wpm.png'
import typing70 from '../assets/achievements/Typing_70wpm.png'
import typing100 from '../assets/achievements/Typing_100wpm.png'
import typing130 from '../assets/achievements/Typing_130_and_more_wpm.png'

export const ACHIEVEMENTS = [
  // New achievements for IELTS streaks
  {
    id: 'listening_1day',
    icon: listening1,
    name: 'Listening Day 1',
    desc: 'Занимайся listening 1 день подряд',
    condition: (s) => s.listeningStreak >= 1,
  },
  {
    id: 'listening_10days',
    icon: listening10,
    name: 'Listening Master',
    desc: 'Занимайся listening 10 дней подряд',
    condition: (s) => s.listeningStreak >= 10,
  },
  {
    id: 'reading_1day',
    icon: reading1,
    name: 'Reading Day 1',
    desc: 'Занимайся reading 1 день подряд',
    condition: (s) => s.readingStreak >= 1,
  },
  {
    id: 'reading_10days',
    icon: reading10,
    name: 'Reading Master',
    desc: 'Занимайся reading 10 дней подряд',
    condition: (s) => s.readingStreak >= 10,
  },
  {
    id: 'writing_1day',
    icon: writing1,
    name: 'Writing Day 1',
    desc: 'Занимайся writing 1 день подряд',
    condition: (s) => s.writingStreak >= 1,
  },
  {
    id: 'writing_10days',
    icon: writing10,
    name: 'Writing Master',
    desc: 'Занимайся writing 10 дней подряд',
    condition: (s) => s.writingStreak >= 10,
  },
  {
    id: 'speaking_1day',
    icon: speaking1,
    name: 'Speaking Day 1',
    desc: 'Занимайся speaking 1 день подряд',
    condition: (s) => s.speakingStreak >= 1,
  },
  {
    id: 'speaking_10days',
    icon: speaking10,
    name: 'Speaking Master',
    desc: 'Занимайся speaking 10 дней подряд',
    condition: (s) => s.speakingStreak >= 10,
  },
  // SAT achievements
  {
    id: 'sat_math_10',
    icon: satMath10,
    name: 'SAT Math 10',
    desc: 'Ответь правильно на 10 вопросов математики SAT',
    condition: (s) => s.satMathCorrect >= 10,
  },
  {
    id: 'sat_math_50',
    icon: satMath50,
    name: 'SAT Math 50',
    desc: 'Ответь правильно на 50 вопросов математики SAT',
    condition: (s) => s.satMathCorrect >= 50,
  },
  {
    id: 'sat_math_100',
    icon: satMath100,
    name: 'SAT Math 100',
    desc: 'Ответь правильно на 100 вопросов математики SAT',
    condition: (s) => s.satMathCorrect >= 100,
  },
  {
    id: 'sat_reading_10',
    icon: satReading10,
    name: 'SAT Reading 10',
    desc: 'Ответь правильно на 10 вопросов чтения SAT',
    condition: (s) => s.satReadingCorrect >= 10,
  },
  {
    id: 'sat_reading_50',
    icon: satReading50,
    name: 'SAT Reading 50',
    desc: 'Ответь правильно на 50 вопросов чтения SAT',
    condition: (s) => s.satReadingCorrect >= 50,
  },
  {
    id: 'sat_reading_100',
    icon: satReading100,
    name: 'SAT Reading 100',
    desc: 'Ответь правильно на 100 вопросов чтения SAT',
    condition: (s) => s.satReadingCorrect >= 100,
  },
  {
    id: 'sat_writing_10',
    icon: satWriting10,
    name: 'SAT Writing 10%',
    desc: 'Достигни 10% правильных ответов в письме SAT',
    condition: (s) => s.satWritingPercent >= 10,
  },
  {
    id: 'sat_writing_50',
    icon: satWriting50,
    name: 'SAT Writing 50%',
    desc: 'Достигни 50% правильных ответов в письме SAT',
    condition: (s) => s.satWritingPercent >= 50,
  },
  {
    id: 'sat_writing_100',
    icon: satWriting100,
    name: 'SAT Writing 100%',
    desc: 'Достигни 100% правильных ответов в письме SAT',
    condition: (s) => s.satWritingPercent >= 100,
  },
  // Typing achievements
  {
    id: 'typing_10',
    icon: typing10,
    name: 'Typing 10 WPM',
    desc: 'Достигни 10 слов в минуту',
    condition: (s) => s.maxWpm >= 10,
  },
  {
    id: 'typing_40',
    icon: typing40,
    name: 'Typing 40 WPM',
    desc: 'Достигни 40 слов в минуту',
    condition: (s) => s.maxWpm >= 40,
  },
  {
    id: 'typing_70',
    icon: typing70,
    name: 'Typing 70 WPM',
    desc: 'Достигни 70 слов в минуту',
    condition: (s) => s.maxWpm >= 70,
  },
  {
    id: 'typing_100',
    icon: typing100,
    name: 'Typing 100 WPM',
    desc: 'Достигни 100 слов в минуту',
    condition: (s) => s.maxWpm >= 100,
  },
  {
    id: 'typing_130',
    icon: typing130,
    name: 'Typing 130+ WPM',
    desc: 'Достигни 130 слов в минуту и больше',
    condition: (s) => s.maxWpm >= 130,
  },
];
