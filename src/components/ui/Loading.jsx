import React from 'react'
import { motion } from 'framer-motion'

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
        />
      </div>
      <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">{message}</p>
    </div>
  )
}

export default Loading