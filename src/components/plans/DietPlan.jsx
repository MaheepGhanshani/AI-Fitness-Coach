import React, { useState } from 'react'
import Card from '../ui/Card'
import { UtensilsCrossed, Flame, ChevronDown, ChevronUp } from 'lucide-react'
import ImageModal from '../features/ImageModal'
import { motion, AnimatePresence } from 'framer-motion'

const DietPlan = ({ diet }) => {
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [openMeals, setOpenMeals] = useState(['breakfast']) 

  if (!diet) return null

  const mealIcons = {
    breakfast: '🍳',
    lunch: '🍱',
    dinner: '🍽️',
    snacks: '🥤'
  }

  const mealColors = {
    breakfast: 'orange',
    lunch: 'green',
    dinner: 'purple',
    snacks: 'blue'
  }

  const toggleMeal = (mealType) => {
    setOpenMeals(prev => 
      prev.includes(mealType) 
        ? prev.filter(m => m !== mealType)
        : [...prev, mealType]
    )
  }

  const toggleAllMeals = () => {
    const allMealTypes = Object.keys(diet.meals || {})
    if (openMeals.length === allMealTypes.length) {
      setOpenMeals([])
    } else {
      setOpenMeals(allMealTypes)
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
            <UtensilsCrossed size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Diet Plan</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Fuel your body right</p>
          </div>
        </div>
        <button
          onClick={toggleAllMeals}
          className="text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors"
        >
          {openMeals.length === Object.keys(diet.meals || {}).length ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {diet.overview && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <p className="text-slate-700 dark:text-slate-300">{diet.overview}</p>
        </div>
      )}

      {diet.dailyCalories && (
        <div className="flex items-center gap-2 mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
          <Flame className="text-orange-600" size={20} />
          <span className="font-bold text-slate-800 dark:text-slate-100">
            Daily Target: {diet.dailyCalories} calories
          </span>
        </div>
      )}

      <div className="space-y-3 max-h-[70vh] min-h-[400px] overflow-y-auto">

        {Object.entries(diet.meals || {}).map(([mealType, items], index) => {
          if (!items || items.length === 0) return null
          
          const isOpen = openMeals.includes(mealType)
          const color = mealColors[mealType] || 'gray'
          
          return (
            <motion.div
              key={mealType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-2 border-slate-200 dark:border-dark-border rounded-xl overflow-hidden hover:border-green-400 dark:hover:border-green-600 transition-all"
            >
              
              <button
                onClick={() => toggleMeal(mealType)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{mealIcons[mealType]}</span>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {items.reduce((sum, item) => sum + parseInt(item.calories || 0), 0)} total calories
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-slate-600 dark:text-slate-400">
                    {items.length} items
                  </span>
                  {isOpen ? (
                    <ChevronUp className="text-slate-600 dark:text-slate-400" size={20} />
                  ) : (
                    <ChevronDown className="text-slate-600 dark:text-slate-400" size={20} />
                  )}
                </div>
              </button>

              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-3 bg-white dark:bg-slate-900/50">
                      {items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          onClick={() => setSelectedMeal(item.item)}
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition-all group border border-transparent hover:border-green-300 dark:hover:border-green-700"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-10 h-10 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <span className="text-lg">
                                {itemIndex === 0 ? '🥇' : itemIndex === 1 ? '🥈' : '🥉'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-green-600 dark:group-hover:text-green-400 flex items-center gap-2">
                                {item.item}
                                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  👁️ View
                                </span>
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {item.portion}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex flex-col gap-1">
                            <div className="text-sm font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                              {item.calories}
                            </div>
                            {item.protein && (
                              <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                {item.protein}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {selectedMeal && (
        <ImageModal
          title={selectedMeal}
          type="food"
          onClose={() => setSelectedMeal(null)}
        />
      )}
    </Card>
  )
}

export default DietPlan