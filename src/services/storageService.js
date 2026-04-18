export const storageService = {
  saveUserDetails: (details) => {
    try {
      localStorage.setItem('userDetails', JSON.stringify(details))
      return true
    } catch (error) {
      console.error('Error saving user details:', error)
      return false
    }
  },

  getUserDetails: () => {
    try {
      const details = localStorage.getItem('userDetails')
      return details ? JSON.parse(details) : null
    } catch (error) {
      console.error('Error getting user details:', error)
      return null
    }
  },

  saveFitnessPlans: (plans) => {
    try {
      localStorage.setItem('fitnessPlans', JSON.stringify(plans))
      localStorage.setItem('planGeneratedAt', new Date().toISOString())
      return true
    } catch (error) {
      console.error('Error saving fitness plans:', error)
      return false
    }
  },

  getFitnessPlans: () => {
    try {
      const plans = localStorage.getItem('fitnessPlans')
      return plans ? JSON.parse(plans) : null
    } catch (error) {
      console.error('Error getting fitness plans:', error)
      return null
    }
  },

  clearAll: () => {
    try {
      localStorage.removeItem('userDetails')
      localStorage.removeItem('fitnessPlans')
      localStorage.removeItem('planGeneratedAt')
      return true
    } catch (error) {
      console.error('Error clearing storage:', error)
      return false
    }
  }
}