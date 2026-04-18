import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Dumbbell, UtensilsCrossed, RefreshCw, Sparkles } from 'lucide-react'
import { generateAIImage } from '../../services/geminiService'

const ImageModal = ({ title, type = 'exercise', onClose }) => {
  const [imageData, setImageData] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    loadAIImage()
  }, [title])

  const loadAIImage = async () => {
    setLoading(true)
    setError(false)
    setUsingFallback(false)

    try {
      
      const aiImageData = await generateAIImage(title, type)
      
      if (aiImageData) {
        setImageData(aiImageData)
        setImageUrl(aiImageData.primary)
        console.log('Using AI-generated image for:', title)
      } else {
        throw new Error('No image data received')
      }
    } catch (err) {
      console.error('Error loading AI image:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = () => {
    console.warn('Primary image failed, using fallback')
    if (imageData?.fallback && !usingFallback) {
      setImageUrl(imageData.fallback)
      setUsingFallback(true)
    } else {
      setError(true)
    }
  }

  const handleRegenerate = () => {
    loadAIImage()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-effect rounded-2xl p-6 max-w-3xl w-full shadow-2xl"
        >
          
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-3">
              <div className={`p-3 rounded-xl ${
                type === 'exercise' 
                  ? 'bg-orange-100 dark:bg-orange-900/30' 
                  : 'bg-green-100 dark:bg-green-900/30'
              }`}>
                {type === 'exercise' ? (
                  <Dumbbell className="text-orange-600 dark:text-orange-400" size={24} />
                ) : (
                  <UtensilsCrossed className="text-green-600 dark:text-green-400" size={24} />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                  <Sparkles size={14} className="text-primary-500" />
                  {loading ? 'AI is generating image...' : 'AI Generated Image'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Regenerate Image"
              >
                <RefreshCw 
                  size={20} 
                  className={`text-slate-600 dark:text-slate-400 ${loading ? 'animate-spin' : ''}`} 
                />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>

          {/* Image Container */}
          <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="loading-spinner mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  🤖 AI is creating your image...
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Powered by Gemini AI
                </p>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <div className={`p-4 rounded-full mb-4 ${
                  type === 'exercise' 
                    ? 'bg-orange-100 dark:bg-orange-900/30' 
                    : 'bg-green-100 dark:bg-green-900/30'
                }`}>
                  {type === 'exercise' ? (
                    <Dumbbell className="text-orange-600 dark:text-orange-400" size={48} />
                  ) : (
                    <UtensilsCrossed className="text-green-600 dark:text-green-400" size={48} />
                  )}
                </div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  {title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-center mb-4">
                  {type === 'exercise' 
                    ? 'Perform this exercise with proper form and controlled movements.' 
                    : 'Prepare this meal with fresh ingredients for optimal nutrition.'}
                </p>
                <button
                  onClick={handleRegenerate}
                  className="btn-secondary flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={handleImageError}
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6">
                  <h4 className="text-white font-bold text-xl mb-1">{title}</h4>
                  {imageData?.description && (
                    <p className="text-white/80 text-sm">
                      {imageData.description.substring(0, 100)}...
                    </p>
                  )}
                </div>
                
                <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <Sparkles size={12} />
                  AI Generated
                </div>
                {usingFallback && (
                  <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    Fallback Image
                  </div>
                )}
              </>
            )}
          </div>

          
          {!loading && !error && imageData?.description && (
            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-2">
                <Sparkles className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" size={16} />
                <div>
                  <p className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-1">
                    AI Image Description:
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {imageData.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          
          <div className={`mt-4 p-4 rounded-xl border-l-4 ${
            type === 'exercise'
              ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
              : 'bg-green-50 dark:bg-green-900/20 border-green-500'
          }`}>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {type === 'exercise' ? (
                <>
                  <strong className="text-orange-600 dark:text-orange-400">💪 Exercise Tip:</strong> 
                  {' '}Focus on proper form and controlled movements. Start with lighter weights 
                  to master the technique before increasing intensity. Listen to your body and rest when needed.
                </>
              ) : (
                <>
                  <strong className="text-green-600 dark:text-green-400">🥗 Nutrition Tip:</strong> 
                  {' '}Use fresh, whole ingredients for maximum nutritional benefit. 
                  Adjust portion sizes based on your specific caloric needs and fitness goals.
                </>
              )}
            </p>
          </div>

        
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Regenerate
            </button>
            <button
              onClick={onClose}
              className="btn-primary flex-1"
            >
              Got it!
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ImageModal