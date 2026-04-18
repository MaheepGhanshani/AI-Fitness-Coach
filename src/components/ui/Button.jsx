import React from 'react'
import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon
}) => {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary'
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} flex items-center gap-2 justify-center`}
    >
      {Icon && <Icon size={20} />}
      {children}
    </motion.button>
  )
}

export default Button