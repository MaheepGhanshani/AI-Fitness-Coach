import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Volume2, VolumeX } from 'lucide-react'

const VoiceReader = ({ workoutPlan, dietPlan }) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef(null)

  
  const speakText = (text, onEnd) => {
    const utterance = new SpeechSynthesisUtterance(text)
    if (onEnd) utterance.onend = onEnd
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
  }

  
  useEffect(() => {
    if (showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX - 180 // Align to right edge
      })
    }
  }, [showMenu])

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && buttonRef.current && !buttonRef.current.contains(event.target)) {
        const menu = document.getElementById('voice-reader-menu')
        if (menu && !menu.contains(event.target)) {
          setShowMenu(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  const handleSpeak = (type) => {
    let textToSpeak = ''

    if (type === 'workout') {
      textToSpeak = `Here is your workout plan. ${workoutPlan?.overview || ''}`
      workoutPlan?.weeklySchedule?.forEach(day => {
        textToSpeak += ` On ${day.day}, focus on ${day.focus}. `
      })
    } else if (type === 'diet') {
      textToSpeak = `Here is your diet plan. ${dietPlan?.overview || ''}`
      if (dietPlan?.dailyCalories) {
        textToSpeak += ` Your daily calorie target is ${dietPlan.dailyCalories}. `
      }
    } else {
      textToSpeak = `Here is your complete fitness plan. ${workoutPlan?.overview || ''} ${dietPlan?.overview || ''}`
    }

    try {
      speakText(textToSpeak, () => {
        setIsSpeaking(false)
      })
      setIsSpeaking(true)
      setShowMenu(false)
    } catch (error) {
      console.error('Text-to-speech error:', error)
      setIsSpeaking(false)
    }
  }

  const handleToggle = () => {
    if (isSpeaking) {
      stopSpeaking()
      setIsSpeaking(false)
    } else {
      setShowMenu(!showMenu)
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium"
      >
        {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
        {isSpeaking ? 'Stop Reading' : 'Read Plan'}
      </button>

      {showMenu && !isSpeaking && createPortal(
        <div
          id="voice-reader-menu"
          style={{
            position: 'absolute',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            zIndex: 50
          }}
          className="min-w-[180px] bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fadeIn"
        >
          <button
            onClick={() => handleSpeak('workout')}
            className="w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200 flex items-center gap-2"
          >
            <span>🏋️</span>
            <span>Workout Plan</span>
          </button>
          <button
            onClick={() => handleSpeak('diet')}
            className="w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2"
          >
            <span>🥗</span>
            <span>Diet Plan</span>
          </button>
          <button
            onClick={() => handleSpeak('all')}
            className="w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2"
          >
            <span>📋</span>
            <span>Complete Plan</span>
          </button>
        </div>,
        document.body
      )}
    </>
  )
}

export default VoiceReader