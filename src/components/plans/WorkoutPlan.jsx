import React, { useState } from 'react'
import Card from '../ui/Card'
import { Dumbbell, Clock, Repeat, ChevronDown, ChevronUp } from 'lucide-react'
import ImageModal from '../features/ImageModal'
import { motion, AnimatePresence } from 'framer-motion'

const WorkoutPlan = ({ workout }) => {
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [openDays, setOpenDays] = useState([0]) 

  if (!workout) return null

  const toggleDay = (index) => {
    setOpenDays(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const toggleAllDays = () => {
    if (openDays.length === workout.weeklySchedule?.length) {
      setOpenDays([])
    } else {
      setOpenDays(workout.weeklySchedule?.map((_, i) => i) || [])
    }
  }

  return (
    <Card>
      <div className="-z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
            <Dumbbell size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Workout Plan</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {workout.weeklySchedule?.length || 0} day schedule
            </p>
          </div>
        </div>
        <button
          onClick={toggleAllDays}
          className="text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors"
        >
          {openDays.length === workout.weeklySchedule?.length ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {workout.overview && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
          <p className="text-slate-700 dark:text-slate-300">{workout.overview}</p>
        </div>
      )}

      <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
        {workout.weeklySchedule?.map((day, index) => {
          const isOpen = openDays.includes(index)
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-2 border-slate-200 dark:border-dark-border rounded-xl overflow-hidden hover:border-primary-400 dark:hover:border-primary-600 transition-all"
            >
              
              <button
                onClick={() => toggleDay(index)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {index + 1}
                    </span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      {day.day}
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">
                      {day.focus}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-slate-600 dark:text-slate-400">
                    {day.exercises?.length || 0} exercises
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
                      {day.exercises?.map((exercise, exIndex) => (
                        <div
                          key={exIndex}
                          onClick={() => setSelectedExercise(exercise.name)}
                          className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer transition-all group border border-transparent hover:border-primary-300 dark:hover:border-primary-700"
                        >
                          <div className="flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex-shrink-0">
                            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                              {exIndex + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center gap-2">
                              {exercise.name}
                              <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                👁️ View
                              </span>
                            </h4>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Repeat size={14} />
                                {exercise.sets} sets × {exercise.reps}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                Rest: {exercise.rest}
                              </span>
                            </div>
                            {exercise.tips && (
                              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border-l-2 border-yellow-400">
                                💡 <strong>Tip:</strong> {exercise.tips}
                              </p>
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

      
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          🛌 <strong>Rest Day (Sunday):</strong> Recovery is just as important as training. Stay active with light walking or stretching.
        </p>
      </div>

      {selectedExercise && (
        <ImageModal
          title={selectedExercise}
          type="exercise"
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </Card>
  )
}

export default WorkoutPlan