import React from 'react'
import styles from '../styles/SkinsPage.module.css'
import { AVATAR_FRAMES, AVATAR_FRAME_PRICE } from '../data/avatarFrames.js'

export default function SkinsPage({ stats, profile, onBuyFrame, onApplyFrame }) {
  const ownedFrames = profile.ownedAvatarFrames || []
  const activeFrameId = profile.avatarFrameId || ''

  return (
    <div className="screen">
      <div className={styles.header}>
        <h1 className={styles.title}>Скины</h1>
        <p className={styles.subtitle}>Кастомизируй аватар профиля.</p>
      </div>

      <div className={styles.coinsCard}>
        <span className={styles.coinsLabel}>Твои монеты:</span>
        <span className={styles.coinsAmount}>{stats.coins} монет</span>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.sectionTitle}>Рамки для авы</h2>
            <p className={styles.sectionText}>Покупай рамки за 50 монет и применяй их в профиле.</p>
          </div>
          {activeFrameId && (
            <button type="button" className={styles.clearBtn} onClick={() => onApplyFrame('')}>
              Снять
            </button>
          )}
        </div>

        <div className={styles.framesGrid}>
          {AVATAR_FRAMES.map((frame) => {
            const owned = ownedFrames.includes(frame.id)
            const active = activeFrameId === frame.id
            const canBuy = stats.coins >= AVATAR_FRAME_PRICE

            return (
              <article className={`${styles.frameCard} ${active ? styles.active : ''}`} key={frame.id}>
                <div className={styles.framePreview}>
                  <div className={styles.previewAvatar}>E</div>
                  <img src={frame.image} alt={frame.name} className={styles.previewFrame} />
                </div>
                <div className={styles.frameInfo}>
                  <h3 className={styles.frameName}>{frame.name}</h3>
                  <span className={styles.framePrice}>{owned ? 'Куплено' : `${AVATAR_FRAME_PRICE} монет`}</span>
                </div>
                {owned ? (
                  <button
                    type="button"
                    className={styles.applyBtn}
                    disabled={active}
                    onClick={() => onApplyFrame(frame.id)}
                  >
                    {active ? 'Надето' : 'Надеть'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.buyBtn}
                    disabled={!canBuy}
                    onClick={() => onBuyFrame(frame.id)}
                  >
                    {canBuy ? 'Купить' : 'Не хватает'}
                  </button>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
