import React from 'react'
import TypingTest from '../components/TypingTest'

export default function TypingTestPage({ onClose }) {
  return <TypingTest onClose={(result) => onClose(result)} />
}
