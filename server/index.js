const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('./db')
const {
  closeRedis,
  connectRedis,
  delByPattern,
  delCache,
  getCache,
  isReady: isRedisReady,
  setCache,
} = require('./redis')

const app = express()
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'eaglo-secret'
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: CLIENT_ORIGIN }))
app.use(express.json())
connectRedis()

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err)
      else resolve({ lastID: this.lastID, changes: this.changes })
    })
  })
}

async function cachedJson(key, loader, ttlSeconds = 60) {
  const cached = await getCache(key)
  if (cached) return cached

  const fresh = await loader()
  await setCache(key, fresh, ttlSeconds)
  return fresh
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Токен не передан' })

  const token = authHeader.replace('Bearer ', '')
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Неверный токен' })
  }
}

function mapUser(row) {
  if (!row) return null
  let ownedAvatarFrames = []
  try {
    ownedAvatarFrames = JSON.parse(row.ownedAvatarFrames || '[]')
  } catch (err) {
    ownedAvatarFrames = []
  }

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatarUrl,
    xp: row.xp,
    coins: row.coins,
    streak: row.streak,
    lessonsCompleted: row.lessonsCompleted,
    perfectLessons: row.perfectLessons,
    ieltsLessons: row.ieltsLessons,
    satLessons: row.satLessons,
    listeningStreak: row.listeningStreak,
    readingStreak: row.readingStreak,
    writingStreak: row.writingStreak,
    speakingStreak: row.speakingStreak,
    satMathCorrect: row.satMathCorrect,
    satReadingCorrect: row.satReadingCorrect,
    satWritingPercent: row.satWritingPercent,
    maxWpm: row.maxWpm,
    theme: row.theme,
    iconSize: row.iconSize,
    font: row.font,
    avatarFrameId: row.avatarFrameId || '',
    ownedAvatarFrames,
    clan_id: row.clan_id,
  }
}

function mapClan(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    leader_id: row.leader_id,
    value: row.value,
    createdAt: row.createdAt,
  }
}

function mapClanQuest(row) {
  if (!row) return null
  return {
    id: row.id,
    clan_id: row.clan_id,
    description: row.description,
    deadline: row.deadline,
    reward_coins: row.reward_coins,
    completed: row.completed,
    createdAt: row.createdAt,
  }
}

app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Заполните email, пароль и имя' })
  }

  try {
    const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email.toLowerCase()])
    if (existing) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' })
    }

    const passwordHash = bcrypt.hashSync(password, 10)
    const createdAt = new Date().toISOString()
    const result = await dbRun(
      `INSERT INTO users (email, passwordHash, name, avatarUrl, createdAt) VALUES (?, ?, ?, ?, ?)`,
      [email.toLowerCase(), passwordHash, name, '', createdAt]
    )

    const user = await dbGet('SELECT * FROM users WHERE id = ?', [result.lastID])
    const token = signToken({ id: user.id })
    res.json({ user: mapUser(user), token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Заполните email и пароль' })
  }

  try {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email.toLowerCase()])
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' })
    }

    const valid = bcrypt.compareSync(password, user.passwordHash)
    if (!valid) {
      return res.status(400).json({ message: 'Неверный пароль' })
    }

    const token = signToken({ id: user.id })
    res.json({ user: mapUser(user), token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.get('/api/user', authMiddleware, async (req, res) => {
  try {
    const payload = await cachedJson(`user:${req.userId}`, async () => {
      const user = await dbGet('SELECT * FROM users WHERE id = ?', [req.userId])
      return { user: mapUser(user) }
    })
    if (!payload.user) return res.status(404).json({ message: 'Пользователь не найден' })
    res.json(payload)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.put('/api/user', authMiddleware, async (req, res) => {
  const { name, avatarUrl, theme, iconSize, font, avatarFrameId, ownedAvatarFrames } = req.body
  try {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [req.userId])
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' })

    await dbRun(
      `UPDATE users SET name = ?, avatarUrl = ?, theme = ?, iconSize = ?, font = ?, avatarFrameId = ?, ownedAvatarFrames = ? WHERE id = ?`,
      [
        name !== undefined ? name : user.name,
        avatarUrl !== undefined ? avatarUrl : user.avatarUrl,
        theme !== undefined ? theme : user.theme,
        iconSize !== undefined ? iconSize : user.iconSize,
        font !== undefined ? font : user.font,
        avatarFrameId !== undefined ? avatarFrameId : user.avatarFrameId,
        ownedAvatarFrames !== undefined ? JSON.stringify(ownedAvatarFrames) : user.ownedAvatarFrames,
        req.userId,
      ]
    )

    const updated = await dbGet('SELECT * FROM users WHERE id = ?', [req.userId])
    await delCache(`user:${req.userId}`, `my-clan:${req.userId}`)
    await delByPattern('my-clan:*')
    res.json({ user: mapUser(updated) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.put('/api/user/stats', authMiddleware, async (req, res) => {
  const {
    xp,
    coins,
    streak,
    lessonsCompleted,
    perfectLessons,
    ieltsLessons,
    satLessons,
    listeningStreak,
    readingStreak,
    writingStreak,
    speakingStreak,
    satMathCorrect,
    satReadingCorrect,
    satWritingPercent,
    maxWpm,
  } = req.body

  try {
    await dbRun(
      `UPDATE users SET xp = ?, coins = ?, streak = ?, lessonsCompleted = ?, perfectLessons = ?, ieltsLessons = ?, satLessons = ?, listeningStreak = ?, readingStreak = ?, writingStreak = ?, speakingStreak = ?, satMathCorrect = ?, satReadingCorrect = ?, satWritingPercent = ?, maxWpm = ? WHERE id = ?`,
      [xp, coins, streak, lessonsCompleted, perfectLessons, ieltsLessons, satLessons, listeningStreak, readingStreak, writingStreak, speakingStreak, satMathCorrect, satReadingCorrect, satWritingPercent, maxWpm, req.userId]
    )
    const updated = await dbGet('SELECT * FROM users WHERE id = ?', [req.userId])
    await delCache(`user:${req.userId}`)
    await delByPattern('my-clan:*')
    res.json({ user: mapUser(updated) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.get('/api/clans', async (req, res) => {
  try {
    const payload = await cachedJson('clans:list', async () => {
      const clans = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM clans ORDER BY value DESC', [], (err, rows) => {
          if (err) reject(err)
          else resolve(rows.map(mapClan))
        })
      })
      return { clans }
    })
    res.json(payload)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.post('/api/clans', authMiddleware, async (req, res) => {
  const { name, description } = req.body
  if (!name) {
    return res.status(400).json({ message: 'Укажите название клана' })
  }

  try {
    const existing = await dbGet('SELECT id FROM clans WHERE name = ?', [name])
    if (existing) {
      return res.status(400).json({ message: 'Клан с таким названием уже существует' })
    }

    const user = await dbGet('SELECT clan_id FROM users WHERE id = ?', [req.userId])
    if (user.clan_id) {
      return res.status(400).json({ message: 'Вы уже состоите в клане' })
    }

    const createdAt = new Date().toISOString()
    const result = await dbRun(
      'INSERT INTO clans (name, description, leader_id, createdAt) VALUES (?, ?, ?, ?)',
      [name, description || '', req.userId, createdAt]
    )

    await dbRun('UPDATE users SET clan_id = ? WHERE id = ?', [result.lastID, req.userId])

    const clan = await dbGet('SELECT * FROM clans WHERE id = ?', [result.lastID])
    // Create initial quest
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + 7) // 1 week
    const quests = [
      'Завершить 50 уроков всем кланом',
      'Достичь средней скорости печати 60 WPM',
      'Получить 1000 XP всем кланом',
      'Пройти все IELTS уроки'
    ]
    const randomQuest = quests[Math.floor(Math.random() * quests.length)]
    await dbRun(
      'INSERT INTO clan_quests (clan_id, description, deadline, createdAt) VALUES (?, ?, ?, ?)',
      [result.lastID, randomQuest, deadline.toISOString(), createdAt]
    )
    await delCache('clans:list', `user:${req.userId}`, `my-clan:${req.userId}`, `clan-quest:${req.userId}`)
    await delByPattern('my-clan:*')
    res.json({ clan: mapClan(clan) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.post('/api/clans/:id/join', authMiddleware, async (req, res) => {
  const clanId = req.params.id

  try {
    const clan = await dbGet('SELECT * FROM clans WHERE id = ?', [clanId])
    if (!clan) {
      return res.status(404).json({ message: 'Клан не найден' })
    }

    const user = await dbGet('SELECT clan_id FROM users WHERE id = ?', [req.userId])
    if (user.clan_id) {
      return res.status(400).json({ message: 'Вы уже состоите в клане' })
    }

    await dbRun('UPDATE users SET clan_id = ? WHERE id = ?', [clanId, req.userId])
    await delCache(`user:${req.userId}`, `my-clan:${req.userId}`, `clan-quest:${req.userId}`)
    await delByPattern('my-clan:*')
    res.json({ message: 'Вы присоединились к клану' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.get('/api/clans/:id', async (req, res) => {
  const clanId = req.params.id

  try {
    const clan = await dbGet('SELECT * FROM clans WHERE id = ?', [clanId])
    if (!clan) {
      return res.status(404).json({ message: 'Клан не найден' })
    }

    const members = await new Promise((resolve, reject) => {
      db.all('SELECT id, name, avatarUrl, xp, coins FROM users WHERE clan_id = ?', [clanId], (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })

    res.json({ clan: mapClan(clan), members })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.get('/api/my-clan', authMiddleware, async (req, res) => {
  try {
    const payload = await cachedJson(`my-clan:${req.userId}`, async () => {
      const user = await dbGet('SELECT clan_id FROM users WHERE id = ?', [req.userId])
      if (!user.clan_id) {
        return { clan: null }
      }

      const clan = await dbGet('SELECT * FROM clans WHERE id = ?', [user.clan_id])
      const members = await new Promise((resolve, reject) => {
        db.all('SELECT id, name, avatarUrl, xp, coins FROM users WHERE clan_id = ?', [user.clan_id], (err, rows) => {
          if (err) reject(err)
          else resolve(rows)
        })
      })

      return { clan: mapClan(clan), members }
    })

    res.json(payload)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.get('/api/clan-quest', authMiddleware, async (req, res) => {
  try {
    const payload = await cachedJson(`clan-quest:${req.userId}`, async () => {
      const user = await dbGet('SELECT clan_id FROM users WHERE id = ?', [req.userId])
      if (!user.clan_id) {
        return { noClan: true }
      }

      const quest = await dbGet('SELECT * FROM clan_quests WHERE clan_id = ? AND completed = 0 ORDER BY createdAt DESC LIMIT 1', [user.clan_id])
      return { quest: mapClanQuest(quest) }
    })
    if (payload.noClan) {
      return res.status(400).json({ message: 'Вы не состоите в клане' })
    }
    res.json(payload)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.post('/api/clan-quest/complete', authMiddleware, async (req, res) => {
  try {
    const user = await dbGet('SELECT clan_id FROM users WHERE id = ?', [req.userId])
    if (!user.clan_id) {
      return res.status(400).json({ message: 'Вы не состоите в клане' })
    }

    const quest = await dbGet('SELECT * FROM clan_quests WHERE clan_id = ? AND completed = 0 ORDER BY createdAt DESC LIMIT 1', [user.clan_id])
    if (!quest) {
      return res.status(404).json({ message: 'Задание не найдено' })
    }

    // Проверить, все ли участники прошли (упрощено: если лидер завершает, то все)
    await dbRun('UPDATE clan_quests SET completed = 1 WHERE id = ?', [quest.id])

    // Дать монеты всем участникам
    await dbRun('UPDATE users SET coins = coins + ? WHERE clan_id = ?', [quest.reward_coins, user.clan_id])

    // Увеличить ценность клана
    await dbRun('UPDATE clans SET value = value + ? WHERE id = ?', [quest.reward_coins * 10, user.clan_id]) // например, 10x
    await delCache('clans:list', `user:${req.userId}`, `my-clan:${req.userId}`, `clan-quest:${req.userId}`)
    await delByPattern('user:*')
    await delByPattern('my-clan:*')

    res.json({ message: 'Задание выполнено!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    redis: isRedisReady() ? 'connected' : 'disabled',
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

process.on('SIGINT', async () => {
  await closeRedis()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await closeRedis()
  process.exit(0)
})
