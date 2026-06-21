const path = require('path')
const sqlite3 = require('sqlite3').verbose()

const dbPath = path.resolve(__dirname, 'data.sqlite')
const db = new sqlite3.Database(dbPath)

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  name TEXT NOT NULL,
  avatarUrl TEXT,
  xp INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 1,
  lessonsCompleted INTEGER DEFAULT 0,
  perfectLessons INTEGER DEFAULT 0,
  ieltsLessons INTEGER DEFAULT 0,
  satLessons INTEGER DEFAULT 0,
  listeningStreak INTEGER DEFAULT 0,
  readingStreak INTEGER DEFAULT 0,
  writingStreak INTEGER DEFAULT 0,
  speakingStreak INTEGER DEFAULT 0,
  satMathCorrect INTEGER DEFAULT 0,
  satReadingCorrect INTEGER DEFAULT 0,
  satWritingPercent INTEGER DEFAULT 0,
  maxWpm INTEGER DEFAULT 0,
  theme TEXT DEFAULT 'light',
  iconSize TEXT DEFAULT 'medium',
  font TEXT DEFAULT 'default',
  avatarFrameId TEXT DEFAULT '',
  ownedAvatarFrames TEXT DEFAULT '[]',
  clan_id INTEGER,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (clan_id) REFERENCES clans(id)
)
`

const createClansTable = `
CREATE TABLE IF NOT EXISTS clans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  leader_id INTEGER NOT NULL,
  value INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (leader_id) REFERENCES users(id)
)
`

const createClanQuestsTable = `
CREATE TABLE IF NOT EXISTS clan_quests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clan_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  deadline TEXT NOT NULL,
  reward_coins INTEGER DEFAULT 1000,
  completed INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (clan_id) REFERENCES clans(id)
)
`

db.serialize(() => {
  db.run(createUsersTable)
  db.run(createClansTable)
  db.run(createClanQuestsTable)

  // Migration: add clan_id column to users if not exists
  db.run(`ALTER TABLE users ADD COLUMN clan_id INTEGER REFERENCES clans(id)`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Migration error:', err.message)
    }
  })

  db.run(`ALTER TABLE users ADD COLUMN avatarFrameId TEXT DEFAULT ''`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Migration error:', err.message)
    }
  })

  db.run(`ALTER TABLE users ADD COLUMN ownedAvatarFrames TEXT DEFAULT '[]'`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Migration error:', err.message)
    }
  })
})

module.exports = db
