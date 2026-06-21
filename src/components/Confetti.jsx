import React, { useMemo } from 'react'

const COLORS = ['#97c459', '#ef9f27', '#378add', '#d4537e', '#e89a2e', '#63991d', '#f5c842']

export default function Confetti() {
  const pieces = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 1.8,
      dur: 2.2 + Math.random() * 2,
      size: 8 + Math.random() * 10,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
    })), []
  )

  return (
    <div className="confetti-wrap">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left + '%',
            background: p.color,
            width: p.size,
            height: p.size,
            borderRadius: p.borderRadius,
            animationDuration: p.dur + 's',
            animationDelay: p.delay + 's',
          }}
        />
      ))}
    </div>
  )
}
