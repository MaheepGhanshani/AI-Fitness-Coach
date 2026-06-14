import React from 'react'
import { Heart, Github, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="glass-effect mt-12 border-t border-slate-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            Made with <Heart size={16} className="text-red-500 animate-pulse" /> by AI Fitness Coach
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
        <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-4">
         © 2024 AI Fitness Coach. Developed by Maheep Ghanshani.
        </p>
      </div>
    </footer>
  )
}

export default Footer