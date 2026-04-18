import React from 'react'
import { Dumbbell } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'
import { motion } from 'framer-motion'

const Header = () => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-effect sticky top-0 z-50 border-b border-slate-200 dark:border-dark-border"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl">
            <Dumbbell size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
              AI Fitness Coach
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your Personal Training Assistant</p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </motion.header>
  )
}

export default Header