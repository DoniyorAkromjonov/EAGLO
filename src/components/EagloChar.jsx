import React from 'react'

// Renders the Eaglo character based on the reference image:
// white fluffy head, brown body/wings, green hoodie with leaf logo,
// orange beak, big round eyes, orange talons
// mood: 'happy' | 'celebrate' | 'thinking' | 'wrong' | 'neutral'

export default function EagloChar({ mood = 'happy', size = 120, className = '' }) {
  const s = size
  const h = size * 1.55

  // Eye expressions
  const eyes = {
    happy: (
      <>
        <ellipse cx="56" cy="46" rx="8" ry="9" fill="#1a1a1a" />
        <ellipse cx="84" cy="46" rx="8" ry="9" fill="#1a1a1a" />
        <ellipse cx="58.5" cy="43" rx="3" ry="3.5" fill="white" />
        <ellipse cx="86.5" cy="43" rx="3" ry="3.5" fill="white" />
      </>
    ),
    celebrate: (
      <>
        {/* happy curved eyes */}
        <path d="M48 46 Q56 37 64 46" stroke="#1a1a1a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M76 46 Q84 37 92 46" stroke="#1a1a1a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </>
    ),
    thinking: (
      <>
        <ellipse cx="56" cy="48" rx="8" ry="7" fill="#1a1a1a" />
        <ellipse cx="84" cy="48" rx="8" ry="7" fill="#1a1a1a" />
        <ellipse cx="58.5" cy="45.5" rx="3" ry="3" fill="white" />
        <ellipse cx="86.5" cy="45.5" rx="3" ry="3" fill="white" />
        {/* raised eyebrow one side */}
        <path d="M48 38 Q56 34 64 37" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
      </>
    ),
    wrong: (
      <>
        {/* X eyes */}
        <line x1="49" y1="40" x2="62" y2="52" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
        <line x1="62" y1="40" x2="49" y2="52" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
        <line x1="77" y1="40" x2="90" y2="52" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
        <line x1="90" y1="40" x2="77" y2="52" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
    neutral: (
      <>
        <ellipse cx="56" cy="47" rx="8" ry="8" fill="#1a1a1a" />
        <ellipse cx="84" cy="47" rx="8" ry="8" fill="#1a1a1a" />
        <ellipse cx="58.5" cy="44" rx="3" ry="3.5" fill="white" />
        <ellipse cx="86.5" cy="44" rx="3" ry="3.5" fill="white" />
      </>
    ),
  }

  const showSmile = mood === 'happy' || mood === 'celebrate'

  return (
    <svg
      viewBox="0 0 140 220"
      width={s}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* ── Shadow ── */}
      <ellipse cx="70" cy="215" rx="38" ry="6" fill="rgba(0,0,0,0.08)" />

      {/* ── Legs ── */}
      <rect x="52" y="188" width="14" height="22" rx="5" fill="#7a4a22" />
      <rect x="76" y="188" width="14" height="22" rx="5" fill="#7a4a22" />
      {/* Talons left */}
      <path d="M46 208 L38 215 M52 210 L50 218 M58 209 L62 216"
        stroke="#e89a2e" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Talons right */}
      <path d="M94 208 L102 215 M88 210 L90 218 M82 209 L78 216"
        stroke="#e89a2e" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* ── Body (brown) ── */}
      <ellipse cx="70" cy="148" rx="42" ry="52" fill="#7a4a22" />

      {/* ── Green hoodie ── */}
      <path d="M30 148 Q28 195 40 208 L100 208 Q112 195 110 148 Z" fill="#3d7a18" />

      {/* Hoodie front pocket area */}
      <ellipse cx="70" cy="188" rx="20" ry="14" fill="#2d5a0e" opacity="0.5" />

      {/* Leaf logo on hoodie */}
      <path d="M70 176 C74 182 76 190 70 198 C64 190 66 182 70 176Z" fill="#c0dd97" />
      <line x1="70" y1="178" x2="70" y2="196" stroke="#3d7a18" strokeWidth="1.2" />

      {/* Hoodie drawstring */}
      <path d="M62 140 Q70 146 78 140" stroke="#c0dd97" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="62" cy="140" r="2.5" fill="#c0dd97" />
      <circle cx="78" cy="140" r="2.5" fill="#c0dd97" />

      {/* ── Chest white feathers ── */}
      <ellipse cx="70" cy="148" rx="28" ry="36" fill="#f0ede8" />

      {/* ── Left wing ── */}
      <path d="M30 148 Q5 138 10 165 Q18 182 34 178 L30 148Z" fill="#7a4a22" />
      {/* Wing feather details */}
      <path d="M10 155 Q18 148 30 155" stroke="#5a3210" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M10 163 Q18 156 30 163" stroke="#5a3210" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* ── Right wing (waving) ── */}
      {mood === 'happy' || mood === 'celebrate' ? (
        <path d="M110 148 Q140 128 138 155 Q132 175 116 172 L110 148Z" fill="#7a4a22" />
      ) : (
        <path d="M110 148 Q135 138 130 165 Q122 182 106 178 L110 148Z" fill="#7a4a22" />
      )}
      <path d="M130 145 Q122 140 110 150" stroke="#5a3210" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M130 153 Q122 148 110 158" stroke="#5a3210" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* ── Head (white fluffy) ── */}
      <ellipse cx="70" cy="62" rx="40" ry="44" fill="#f0ede8" />

      {/* Fluffy head feathers top */}
      <ellipse cx="54" cy="22" rx="10" ry="13" fill="#f0ede8" />
      <ellipse cx="70" cy="18" rx="12" ry="14" fill="#f0ede8" />
      <ellipse cx="86" cy="22" rx="10" ry="13" fill="#f0ede8" />

      {/* Brown top cap of head */}
      <path d="M32 52 Q70 10 108 52 Q90 38 70 40 Q50 38 32 52Z" fill="#7a4a22" />

      {/* White forehead tuft */}
      <ellipse cx="70" cy="30" rx="18" ry="12" fill="#f0ede8" />

      {/* ── Eyes ── */}
      {eyes[mood] || eyes.happy}

      {/* ── Beak ── */}
      <path d="M62 64 L78 64 L70 80Z" fill="#e89a2e" />
      {/* Beak highlight */}
      <path d="M63 66 L70 65 L77 66" stroke="#f5b84a" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Smile */}
      {showSmile && (
        <path d="M60 72 Q70 82 80 72" stroke="#e89a2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
      {/* Worried mouth */}
      {mood === 'wrong' && (
        <path d="M60 78 Q70 70 80 78" stroke="#e89a2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}

      {/* ── Sparkles for celebrate ── */}
      {mood === 'celebrate' && (
        <>
          <text x="115" y="28" fontSize="16" textAnchor="middle">✨</text>
          <text x="18" y="50" fontSize="13" textAnchor="middle">⭐</text>
          <text x="120" y="70" fontSize="11" textAnchor="middle">💫</text>
        </>
      )}
      {/* ── Question mark for thinking ── */}
      {mood === 'thinking' && (
        <text x="115" y="45" fontSize="22" textAnchor="middle" fill="#97c459">?</text>
      )}
    </svg>
  )
}
