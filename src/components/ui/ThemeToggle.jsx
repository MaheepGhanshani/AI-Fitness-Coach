import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { motion } from 'framer-motion'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-3 rounded-xl bg-slate-200 dark:bg-dark-card hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-slate-700" />
      ) : (
        <Sun size={20} className="text-yellow-400" />
      )}
    </motion.button>
  )
}

export default ThemeToggle