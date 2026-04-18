import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Loading from '../ui/Loading'
import { 
  FITNESS_GOALS, 
  FITNESS_LEVELS, 
  WORKOUT_LOCATIONS, 
  DIETARY_PREFERENCES,
  GENDERS,
  STRESS_LEVELS 
} from '../../utils/constants'
import { generateFitnessPlan } from '../../services/geminiService'
import { Sparkles, User, Target, Activity, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const UserDetailsForm = ({ onPlanGenerated, setUserDetails, loading, setLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    fitnessLevel: '',
    location: '',
    diet: '',
    stressLevel: '',
    medicalHistory: '',
    medications: ''
  })

  const [step, setStep] = useState(1)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep = (currentStep) => {
    switch(currentStep) {
      case 1:
        return formData.name && formData.age && formData.gender && formData.height && formData.weight
      case 2:
        return formData.goal && formData.fitnessLevel && formData.location && formData.diet
      case 3:
        return true
      default:
        return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setUserDetails(formData)

    try {
      toast.loading('🤖 AI is analyzing your profile...', { id: 'generating' })
      const plans = await generateFitnessPlan(formData)
      toast.success('✅ Your personalized plan is ready!', { id: 'generating' })
      onPlanGenerated(plans)
    } catch (error) {
      toast.error('❌ Failed to generate plan. Please try again.', { id: 'generating' })
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1)
      }
    } else {
      toast.error('Please fill all required fields')
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <Loading message="AI is creating your personalized fitness plan... ✨" />
        <div className="mt-6 space-y-2">
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            ⚡ Analyzing your fitness goals...
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            💪 Customizing workout routines for {formData.location}...
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            🥗 Preparing {formData.diet} meal plans...
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent mb-3">
          Let's Build Your Perfect Plan
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Tell us about yourself and we'll create a personalized fitness journey
        </p>
      </motion.div>

      
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex flex-col items-center ${step >= s ? '' : 'opacity-50'}`}>
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all ${
                  step >= s 
                    ? 'bg-gradient-to-br from-primary-600 to-blue-600 text-white shadow-lg scale-110' 
                    : 'bg-slate-200 dark:bg-dark-card text-slate-400'
                }`}>
                  {s}
                </div>
                <p className="text-xs mt-2 font-medium text-slate-600 dark:text-slate-400">
                  {s === 1 ? 'Personal' : s === 2 ? 'Fitness' : 'Health'}
                </p>
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 rounded-full transition-all ${
                  step > s ? 'bg-primary-600' : 'bg-slate-200 dark:bg-dark-card'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <User className="text-primary-600" size={24} />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Personal Information
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Sarah Johnson"
                  required
                />
                <Input
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  placeholder="e.g., 28"
                  required
                  min="10"
                  max="100"
                />
                <Select
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  options={GENDERS}
                  required
                />
                <Input
                  label="Height (cm)"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  placeholder="e.g., 165"
                  required
                  min="100"
                  max="250"
                />
                <Input
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  placeholder="e.g., 75"
                  required
                  min="30"
                  max="300"
                />
              </div>

              
              {formData.height && formData.weight && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 <strong>Your BMI:</strong> {((formData.weight / ((formData.height / 100) ** 2)).toFixed(1))}
                    {' - '}
                    <span className="font-semibold">
                      {((formData.weight / ((formData.height / 100) ** 2)) < 18.5) ? 'Underweight' :
                       ((formData.weight / ((formData.height / 100) ** 2)) < 25) ? 'Normal Weight' :
                       ((formData.weight / ((formData.height / 100) ** 2)) < 30) ? 'Overweight' : 'Obese'}
                    </span>
                  </p>
                </div>
              )}
            </motion.div>
          )}

          
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Target className="text-primary-600" size={24} />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Fitness Goals & Preferences
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Primary Fitness Goal"
                  value={formData.goal}
                  onChange={(e) => handleChange('goal', e.target.value)}
                  options={FITNESS_GOALS}
                  required
                />
                <Select
                  label="Current Fitness Level"
                  value={formData.fitnessLevel}
                  onChange={(e) => handleChange('fitnessLevel', e.target.value)}
                  options={FITNESS_LEVELS}
                  required
                />
                <Select
                  label="Workout Location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  options={WORKOUT_LOCATIONS}
                  required
                />
                <Select
                  label="Dietary Preference"
                  value={formData.diet}
                  onChange={(e) => handleChange('diet', e.target.value)}
                  options={DIETARY_PREFERENCES}
                  required
                />
              </div>

              
              {formData.goal && formData.fitnessLevel && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    🎯 <strong>Your Plan:</strong> {formData.fitnessLevel} level training for {formData.goal} at {formData.location}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Activity className="text-primary-600" size={24} />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Health Status & Lifestyle
                </h3>
              </div>

              <div className="space-y-6">
                <Select
                  label="Stress Level"
                  value={formData.stressLevel}
                  onChange={(e) => handleChange('stressLevel', e.target.value)}
                  options={STRESS_LEVELS}
                />

                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Medical History (Optional)
                  </label>
                  <textarea
                    value={formData.medicalHistory}
                    onChange={(e) => handleChange('medicalHistory', e.target.value)}
                    placeholder="Please mention any medical conditions, injuries, surgeries, allergies, or health concerns we should be aware of..."
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-card text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-200 min-h-[100px] resize-none"
                    rows="4"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    💡 This helps us create a safer and more personalized fitness plan tailored to your health needs.
                  </p>
                </div>

                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Current Medications (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.medications}
                    onChange={(e) => handleChange('medications', e.target.value)}
                    placeholder="e.g., Blood pressure medication, asthma inhaler, supplements..."
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-card text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-200"
                  />
                </div>

                
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Common Conditions (Click to add):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Diabetes', 'High Blood Pressure', 'Asthma', 'Back Pain',
                      'Knee Injury', 'Shoulder Injury', 'Heart Condition', 'Thyroid',
                      'Arthritis', 'PCOS', 'Anxiety/Depression', 'High Cholesterol'
                    ].map((condition) => (
                      <button
                        key={condition}
                        type="button"
                        onClick={() => {
                          const current = formData.medicalHistory || ''
                          if (!current.includes(condition)) {
                            const separator = current ? ', ' : ''
                            handleChange('medicalHistory', current + separator + condition)
                          }
                        }}
                        className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full text-xs hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-400 transition-colors"
                      >
                        + {condition}
                      </button>
                    ))}
                  </div>
                </div>

               
                {(formData.medicalHistory || formData.medications) && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-l-4 border-yellow-500">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                          Health Information Summary
                        </h4>
                        {formData.medicalHistory && (
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                            <strong>Conditions:</strong> {formData.medicalHistory}
                          </p>
                        )}
                        {formData.medications && (
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            <strong>Medications:</strong> {formData.medications}
                          </p>
                        )}
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 font-semibold">
                          ⚕️ Your fitness plan will be adjusted accordingly. Please consult your doctor before starting any new exercise program.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

               
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                    <strong>Disclaimer:</strong> This AI-generated plan is for informational purposes only. 
                    Always consult with healthcare professionals before starting new fitness programs.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

         
          <div className="flex justify-between mt-8 gap-4">
            {step > 1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={prevStep}
                className="flex-1"
              >
                ← Previous
              </Button>
            )}
            
            {step === 1 && (
              <Button
                type="button"
                onClick={nextStep}
                className="flex-1"
              >
                Next Step →
              </Button>
            )}
            
            {step === 2 && (
              <Button
                type="button"
                onClick={nextStep}
                className="flex-1"
              >
                Continue to Health Info →
              </Button>
            )}
            
            {step === 3 && (
              <Button
                type="submit"
                icon={Sparkles}
                className="flex-1"
              >
                🚀 Generate My AI Plan
              </Button>
            )}
          </div>

         
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Step {step} of 3 • {Math.round((step / 3) * 100)}% Complete
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-primary-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default UserDetailsForm