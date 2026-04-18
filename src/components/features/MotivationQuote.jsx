import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw } from 'lucide-react'
import { generateMotivationQuote } from '../../services/geminiService'

const MotivationQuote = () => {
  const [quote, setQuote] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchQuote = async () => {
    setLoading(true)
    const newQuote = await generateMotivationQuote()
    setQuote(newQuote)
    setLoading(false)
  }

  useEffect(() => {
    fetchQuote()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6 mb-8 max-w-3xl mx-auto"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-yellow-500" size={20} />
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Daily Motivation</h3>
          </div>
          {loading ? (
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          ) : (
            <p className="text-lg text-slate-700 dark:text-slate-300 italic">"{quote}"</p>
          )}
        </div>
        <button
          onClick={fetchQuote}
          disabled={loading}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <RefreshCw size={18} className={`text-slate-600 dark:text-slate-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </motion.div>
  )
}

export default MotivationQuote