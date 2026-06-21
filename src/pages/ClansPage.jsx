import React, { useState, useEffect } from 'react'
import mainImage from '../assets/main.png'
import styles from '../styles/ClansPage.module.css'

export default function ClansPage({ user, authToken, onUpdateUser }) {
  const [clans, setClans] = useState([])
  const [myClan, setMyClan] = useState(null)
  const [members, setMembers] = useState([])
  const [quest, setQuest] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newClanName, setNewClanName] = useState('')
  const [newClanDesc, setNewClanDesc] = useState('')
  const [loading, setLoading] = useState(true)
  const token = authToken || localStorage.getItem('authToken')

  useEffect(() => {
    fetchClans()
    if (user) fetchMyClan()
  }, [user])

  const fetchClans = async () => {
    try {
      const res = await fetch('/api/clans')
      const data = await res.json()
      setClans(data.clans)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyClan = async () => {
    try {
      const res = await fetch('/api/my-clan', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setMyClan(data.clan)
      setMembers(data.members || [])
      if (data.clan) fetchQuest()
    } catch (err) {
      console.error(err)
    }
  }

  const fetchQuest = async () => {
    try {
      const res = await fetch('/api/clan-quest', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setQuest(data.quest)
    } catch (err) {
      console.error(err)
    }
  }

  const createClan = async () => {
    if (!newClanName.trim()) return

    try {
      const res = await fetch('/api/clans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newClanName, description: newClanDesc })
      })
      const data = await res.json()
      if (res.ok) {
        setMyClan(data.clan)
        setShowCreateForm(false)
        setNewClanName('')
        setNewClanDesc('')
        fetchClans()
        onUpdateUser()
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const joinClan = async (clanId) => {
    try {
      const res = await fetch(`/api/clans/${clanId}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        fetchMyClan()
        onUpdateUser()
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const completeQuest = async () => {
    try {
      const res = await fetch('/api/clan-quest/complete', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        alert('Задание выполнено!')
        setQuest(null)
        fetchMyClan()
        onUpdateUser()
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="screen">Загрузка...</div>

  return (
    <div className="screen">
      <div className={styles.header}>
        <img src={mainImage} alt="Eaglo" className={styles.headerImage} />
        <h2 className={styles.title}>Кланы</h2>
        {myClan ? (
          <div className={styles.myClanBadge}>
            Твой клан: {myClan.name}
          </div>
        ) : (
          <button className={styles.createBtn} onClick={() => setShowCreateForm(true)}>
            Создать клан
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className={styles.createForm}>
          <input
            type="text"
            placeholder="Название клана"
            value={newClanName}
            onChange={(e) => setNewClanName(e.target.value)}
          />
          <textarea
            placeholder="Описание клана"
            value={newClanDesc}
            onChange={(e) => setNewClanDesc(e.target.value)}
          />
          <button onClick={createClan}>Создать</button>
          <button onClick={() => setShowCreateForm(false)}>Отмена</button>
        </div>
      )}

      {myClan && (
        <div className={styles.myClanSection}>
          <h3>Участники клана</h3>
          <div className={styles.membersList}>
            {members.map(member => (
              <div key={member.id} className={styles.member}>
                <img src={member.avatarUrl || '/default-avatar.png'} alt={member.name} />
                <span>{member.name}</span>
                <span>{member.xp} XP</span>
              </div>
            ))}
          </div>
          {quest && (
            <div className={styles.quest}>
              <h4>Недельное задание</h4>
              <p>{quest.description}</p>
              <p>Награда: {quest.reward_coins} монет каждому</p>
              <p>Дедлайн: {new Date(quest.deadline).toLocaleDateString()}</p>
              <button onClick={completeQuest}>Завершить задание</button>
            </div>
          )}
        </div>
      )}

      <div className={styles.clanList}>
        {clans.map((clan, index) => (
          <div key={clan.id} className={styles.clanItem}>
            <div className={styles.clanRank}>#{index + 1}</div>
            <div className={styles.clanInfo}>
              <h4 className={styles.clanName}>{clan.name}</h4>
              <p className={styles.clanDesc}>{clan.description}</p>
              <p className={styles.clanValue}>Ценность: {clan.value} монет</p>
            </div>
            <div className={styles.clanActions}>
              {!myClan && (
                <button onClick={() => joinClan(clan.id)}>Присоединиться</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}