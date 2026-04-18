import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
if (!API_KEY) {
  console.error('❌ VITE_GEMINI_API_KEY is not set in .env file')
}

const genAI = new GoogleGenerativeAI(API_KEY)


let availableModels = null
let workingModel = null


export const listAvailableModels = async () => {
  if (availableModels) return availableModels

  try {
    console.log('🔍 Fetching available Gemini models...')
    
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    
    availableModels = data.models
      .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
      .map(model => model.name.replace('models/', ''))
    
    console.log('✅ Available models:', availableModels)
    return availableModels
    
  } catch (error) {
    console.error('❌ Error fetching models:', error)
    
    
    availableModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']
    return availableModels
  }
}


const getWorkingModel = async () => {
  if (workingModel) return workingModel

  const models = await listAvailableModels()
  
  
  const prioritizedModels = [
    ...models.filter(m => m.includes('flash')),
    ...models.filter(m => m.includes('pro')),
    ...models
  ]

  for (const modelName of prioritizedModels) {
    try {
      console.log(`🧪 Testing model: ${modelName}`)
      const model = genAI.getGenerativeModel({ model: modelName })
      
      const result = await model.generateContent('Test')
      await result.response.text()
      
      console.log(`✅ Working model found: ${modelName}`)
      workingModel = modelName
      return modelName
      
    } catch (error) {
      console.log(`❌ Model ${modelName} failed:`, error.message)
    }
  }

  throw new Error('No working Gemini model found')
}


const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100
  return (weight / (heightInMeters * heightInMeters)).toFixed(1)
}


const calculateCalories = (userDetails) => {
  const { weight, height, age, gender, goal } = userDetails
  
  let bmr
  if (gender === 'Male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }
  
  const activityMultiplier = 1.55
  let tdee = bmr * activityMultiplier
  
  if (goal === 'Weight Loss') {
    tdee -= 500
  } else if (goal === 'Muscle Gain') {
    tdee += 300
  }
  
  return `${Math.round(tdee - 100)}-${Math.round(tdee + 100)}`
}


export const generateFitnessPlan = async (userDetails) => {
  const maxRetries = 2
  let lastError = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}`)
      
      const modelName = await getWorkingModel()
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })

      const bmi = calculateBMI(userDetails.weight, userDetails.height)
      const targetCalories = calculateCalories(userDetails)

      const prompt = `You are an expert fitness coach. Create a personalized fitness plan.

USER:
Name: ${userDetails.name}
Age: ${userDetails.age}
Gender: ${userDetails.gender}
Height: ${userDetails.height}cm
Weight: ${userDetails.weight}kg
BMI: ${bmi}
Goal: ${userDetails.goal}
Level: ${userDetails.fitnessLevel}
Location: ${userDetails.location}
Diet: ${userDetails.diet}
Stress: ${userDetails.stressLevel || 'Moderate'}
${userDetails.medicalHistory ? `Medical: ${userDetails.medicalHistory}` : ''}
${userDetails.medications ? `Medications: ${userDetails.medications}` : ''}

LOCATION RULES (${userDetails.location}):
${userDetails.location === 'Home' ? 
  '- ONLY bodyweight or minimal equipment\n- NO gym machines/barbells\n- Examples: Push-ups, Squats, Planks' :
  userDetails.location === 'Gym' ?
  '- Use barbells, dumbbells, machines\n- Include: Bench press, Squats, Deadlifts' :
  '- Bodyweight exercises\n- Use environment (benches, stairs)\n- Include running'
}

LEVEL RULES (${userDetails.fitnessLevel}):
${userDetails.fitnessLevel === 'Beginner' ? 
  '- 2-3 sets, 12-15 reps, 60-90s rest\n- Basic movements only' :
  userDetails.fitnessLevel === 'Intermediate' ?
  '- 3-4 sets, 8-12 reps, 60-90s rest' :
  '- 4-5 sets, 6-12 reps, 90-120s rest\n- Advanced techniques OK'
}

GOAL RULES (${userDetails.goal}):
${userDetails.goal === 'Weight Loss' ? 
  '- Higher reps (15-20), shorter rest (30-45s)\n- More cardio\n- Caloric deficit' :
  userDetails.goal === 'Muscle Gain' ?
  '- Moderate reps (8-12), longer rest (90-120s)\n- Heavy weights\n- Caloric surplus' :
  '- Balanced approach\n- Mix strength and cardio'
}

DIET RULES (${userDetails.diet}):
${userDetails.diet === 'Vegetarian' ? 
  '- Protein: Paneer, tofu, eggs, legumes\n- NO meat/fish' :
  userDetails.diet === 'Vegan' ?
  '- Protein: Tofu, tempeh, lentils, nuts\n- NO animal products' :
  userDetails.diet === 'Keto' ?
  '- Very low carb (<50g)\n- High fat (70%)' :
  '- Lean meats, fish, chicken OK'
}

${userDetails.medicalHistory ? `
MEDICAL SAFETY (${userDetails.medicalHistory}):
${userDetails.medicalHistory.toLowerCase().includes('diabetes') ? '- Low-GI foods, monitor blood sugar' : ''}
${userDetails.medicalHistory.toLowerCase().includes('blood pressure') ? '- Low sodium, moderate intensity' : ''}
${userDetails.medicalHistory.toLowerCase().includes('knee') || userDetails.medicalHistory.toLowerCase().includes('joint') ? '- No jumping, low-impact only' : ''}
${userDetails.medicalHistory.toLowerCase().includes('back') ? '- No heavy deadlifts, core focus' : ''}
${userDetails.medicalHistory.toLowerCase().includes('heart') ? '- Low-moderate intensity, doctor clearance' : ''}
` : ''}

OUTPUT (JSON only, no markdown):
{
  "workout": {
    "overview": "Brief overview for ${userDetails.name}",
    "weeklySchedule": [
      {
        "day": "Monday",
        "focus": "Muscle group",
        "exercises": [
          {"name": "Exercise for ${userDetails.location}", "sets": "X", "reps": "Y", "rest": "Zs", "tips": "Form tip"}
        ]
      }
    ]
  },
  "diet": {
    "overview": "${userDetails.diet} plan for ${userDetails.goal}",
    "dailyCalories": "${targetCalories}",
    "meals": {
      "breakfast": [{"item": "${userDetails.diet} food", "portion": "amount", "calories": "X", "protein": "Yg"}],
      "lunch": [],
      "dinner": [],
      "snacks": []
    }
  },
  "tips": {
    "lifestyle": ["tip1", "tip2", "tip3"],
    "posture": ["tip1", "tip2"],
    "motivation": "Message to ${userDetails.name}"
  }
}

REQUIREMENTS:
- 6 days (Mon-Sat)
- 4-5 exercises per day
- All exercises work at ${userDetails.location}
- All meals ${userDetails.diet}
${userDetails.medicalHistory ? `- Safe for ${userDetails.medicalHistory}` : ''}

Generate now:`

      console.log('📤 Sending to Gemini...')
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      let text = response.text()
      
      console.log('📥 Response received')
      
      
      text = text.trim()
      text = text.replace(/```json\s*/gi, '')
      text = text.replace(/```\s*/g, '')
      
      
      const jsonMatch = text.match(/\{[\s\S]*\}/s)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      
      const parsedData = JSON.parse(jsonMatch[0])
      
      
      if (!parsedData.workout?.weeklySchedule || parsedData.workout.weeklySchedule.length < 6) {
        throw new Error('Invalid plan structure')
      }
      
      console.log('✅ Plan generated successfully')
      return parsedData
      
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error)
      lastError = error
      
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1000))
      }
    }
  }
  
  throw lastError
}


export const generateMotivationQuote = async () => {
  try {
    const modelName = await getWorkingModel()
    const model = genAI.getGenerativeModel({ model: modelName })
    
    const result = await model.generateContent(
      'Generate one short inspiring fitness quote (max 12 words). Return only the quote, no quotes marks.'
    )
    
    let quote = (await result.response).text().trim()
    quote = quote.replace(/['""`]/g, '').replace(/^Quote:\s*/i, '')
    
    return quote || 'Your transformation starts today!'
    
  } catch (error) {
    return 'Push harder today for a stronger tomorrow!'
  }
}


export const generateAIImage = async (itemName, type = 'exercise') => {
  try {
    const modelName = await getWorkingModel()
    const model = genAI.getGenerativeModel({ model: modelName })
    
    const prompt = type === 'exercise'
      ? `Describe "${itemName}" exercise visually in 40 words for AI image generation. Include: body position, muscles, equipment, setting. Just the description:`
      : `Describe "${itemName}" meal visually in 40 words for AI image generation. Include: colors, plating, ingredients. Just the description:`
    
    const result = await model.generateContent(prompt)
    const description = (await result.response).text().trim()
    
    const enhancedPrompt = type === 'exercise'
      ? `Professional fitness photo: ${description}. Photorealistic, 4K, gym lighting.`
      : `Professional food photo: ${description}. Photorealistic, 4K, natural lighting.`
    console.log(description);
    
    return {
      primary: `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=800&height=600&nologo=true`,
      fallback: `https://source.unsplash.com/800x600/?${itemName},${type === 'exercise' ? 'fitness' : 'food'}`,
      description
    }
    
  } catch (error) {
    return {
      primary: `https://source.unsplash.com/800x600/?${itemName}`,
      fallback: `https://source.unsplash.com/800x600/?${itemName}`,
      description: itemName
    }
  }
}