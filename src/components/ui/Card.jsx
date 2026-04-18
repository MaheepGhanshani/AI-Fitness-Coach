import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ children, className = '', hover = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-effect rounded-2xl p-6 ${hover ? 'card-hover' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default Card