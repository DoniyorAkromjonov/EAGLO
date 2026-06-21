import React, { useState } from 'react'
import styles from '../styles/AuthPage.module.css'

export default function AuthPage({ mode, onModeChange, onAuthSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const url = mode === 'login' ? '/api/login' : '/api/register'
    const body = mode === 'login'
      ? { email, password }
      : { email, password, name }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.message || 'Ошибка авторизации')
        return
      }

      onAuthSuccess(data.user, data.token)
    } catch (err) {
      setError('Сервер недоступен. Запусти backend на порту 4000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen" style={{ paddingLeft: 24 }}>
      <div className={styles.authBox}>
        <h1>{mode === 'login' ? 'Вход' : 'Регистрация'}</h1>
        <p className={styles.subtitle}>Используй аккаунт, чтобы входить с разных устройств.</p>

        <div className={styles.modeToggle}>
          <button
            className={mode === 'login' ? styles.active : ''}
            onClick={() => onModeChange('login')}
            type="button"
          >Вход</button>
          <button
            className={mode === 'register' ? styles.active : ''}
            onClick={() => onModeChange('register')}
            type="button"
          >Регистрация</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'register' && (
            <label className={styles.field}>
              Имя
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                disabled={loading}
                required
              />
            </label>
          )}

          <label className={styles.field}>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="example@mail.com"
              disabled={loading}
              required
            />
          </label>

          <label className={styles.field}>
            Пароль
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Секундочку...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  )
}
