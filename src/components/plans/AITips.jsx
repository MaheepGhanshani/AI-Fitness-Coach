import React from 'react'
import Card from '../ui/Card'
import { Sparkles, Heart, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const AITips = ({ tips }) => {
  if (!tips) return null

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
          <Sparkles size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">AI Tips & Motivation</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Expert advice for your journey</p>
        </div>
      </div>

      {tips.motivation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-start gap-3">
            <Heart className="text-pink-600 mt-1 flex-shrink-0" size={24} />
            <p className="text-lg font-medium text-slate-800 dark:text-slate-100 italic">
              "{tips.motivation}"
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {tips.lifestyle && tips.lifestyle.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Zap className="text-yellow-600" size={20} />
              Lifestyle Tips
            </h3>
            <ul className="space-y-3">
              {tips.lifestyle.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-slate-700 dark:text-slate-300"
                >
                  <span className="text-primary-600 font-bold mt-1">✓</span>
                  <span>{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {tips.posture && tips.posture.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Sparkles className="text-purple-600" size={20} />
              Posture Tips
            </h3>
            <ul className="space-y-3">
              {tips.posture.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-slate-700 dark:text-slate-300"
                >
                  <span className="text-purple-600 font-bold mt-1">✓</span>
                  <span>{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  )
}

export default AITips