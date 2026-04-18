import jsPDF from 'jspdf'

export const generatePDF = async (userDetails, fitnessPlans) => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yOffset = 20

 
  const colors = {
    primary: [41, 128, 185],     
    secondary: [46, 204, 113],   
    accent: [155, 89, 182],      
    warning: [241, 196, 15],   
    dark: [52, 73, 94],          
    light: [236, 240, 241],      
    text: [44, 62, 80]           
  }

  
  const drawRoundedRect = (x, y, width, height, radius, color = null, fill = false) => {
    pdf.setDrawColor(...color || colors.dark)
    if (fill) {
      pdf.setFillColor(...color)
      pdf.roundedRect(x, y, width, height, radius, radius, 'F')
    } else {
      pdf.roundedRect(x, y, width, height, radius, radius, 'S')
    }
  }

  
  const addSectionHeader = (title, y, color = colors.primary) => {
    pdf.setFillColor(...color)
    pdf.roundedRect(15, y, pageWidth - 30, 8, 4, 4, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text(title, 20, y + 5.5)
    return y + 15
  }

  
  const coverHeight = pageHeight / 2
  
  
  pdf.setFillColor(...colors.primary)
  pdf.rect(0, 0, pageWidth, coverHeight, 'F')
  

  pdf.setFillColor(46, 204, 113, 0.3) 
  pdf.circle(-15, 30, 40, 'F')
  
  pdf.setFillColor(241, 196, 15, 0.3) 
  pdf.circle(pageWidth + 10, 50, 45, 'F')
  
  pdf.setFillColor(155, 89, 182, 0.3) 
  pdf.circle(pageWidth - 30, coverHeight + 10, 50, 'F')
  
  pdf.setFillColor(231, 76, 60, 0.3) 
  pdf.circle(20, coverHeight - 20, 35, 'F')
  
  
  const iconSize = 20
  const leftIconX = 30
  const iconY = 60
  
  
  pdf.setFillColor(46, 204, 113) 
  pdf.circle(leftIconX, iconY, 4, 'F')
  pdf.circle(leftIconX + 15, iconY, 4, 'F')
  pdf.setLineWidth(2)
  pdf.setDrawColor(46, 204, 113)
  pdf.line(leftIconX + 4, iconY, leftIconX + 11, iconY)
  

  const rightIconX = pageWidth - 30
  pdf.setFillColor(231, 76, 60) 
  pdf.circle(rightIconX - 3, iconY - 2, 4, 'F')
  pdf.circle(rightIconX + 3, iconY - 2, 4, 'F')
  pdf.triangle(rightIconX - 7, iconY, rightIconX + 7, iconY, rightIconX, iconY + 8, 'F')
  
  
  const appleX = 35
  const appleY = coverHeight - 30
  pdf.setFillColor(241, 196, 15) 
  pdf.circle(appleX, appleY, 6, 'F')
  pdf.setFillColor(46, 204, 113)
  pdf.rect(appleX - 1, appleY - 10, 2, 5, 'F') 
  
  
  const runX = pageWidth - 35
  const runY = coverHeight - 35
  pdf.setLineWidth(2.5)
  pdf.setDrawColor(155, 89, 182) 
  pdf.circle(runX, runY, 4, 'S') 
  pdf.line(runX, runY + 4, runX, runY + 15) 
  pdf.line(runX, runY + 7, runX - 6, runY + 12) 
  pdf.line(runX, runY + 7, runX + 7, runY + 10) 
  pdf.line(runX, runY + 15, runX - 5, runY + 24) 
  pdf.line(runX, runY + 15, runX + 6, runY + 22) 
  
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(32)
  pdf.setFont('helvetica', 'bold')
  pdf.text('FITNESS PLAN', pageWidth / 2, 70, { align: 'center' })
  
  
  pdf.setFontSize(13)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Personalized Training & Nutrition Guide', pageWidth / 2, 85, { align: 'center' })
  
  
  const lineY = 90
  const lineSegments = [
    { color: [231, 76, 60], start: 0 },      
    { color: [241, 196, 15], start: 0.25 },  
    { color: [46, 204, 113], start: 0.5 },   
    { color: [155, 89, 182], start: 0.75 }   
  ]
  
  const lineWidth = 80
  const lineStartX = (pageWidth - lineWidth) / 2
  const segmentWidth = lineWidth / 4
  
  pdf.setLineWidth(1.5)
  lineSegments.forEach((seg, idx) => {
    pdf.setDrawColor(...seg.color)
    pdf.line(
      lineStartX + (idx * segmentWidth), 
      lineY, 
      lineStartX + ((idx + 1) * segmentWidth), 
      lineY
    )
  })

  
  yOffset = coverHeight + 15

  yOffset = addSectionHeader('PERSONAL DETAILS', yOffset, colors.primary)
  
  pdf.setTextColor(...colors.text)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')

  
  drawRoundedRect(15, yOffset, pageWidth - 30, 35, 3, colors.light, true)
  drawRoundedRect(15, yOffset, pageWidth - 30, 35, 3, colors.primary, false)

  const details = [
    { label: 'Name', value: userDetails.name, x: 20 },
    { label: 'Age', value: userDetails.age, x: 80 },
    { label: 'Gender', value: userDetails.gender, x: 140 },
    { label: 'Height', value: `${userDetails.height} cm`, x: 20, yOffset: 12 },
    { label: 'Weight', value: `${userDetails.weight} kg`, x: 80, yOffset: 12 },
    { label: 'Goal', value: userDetails.goal, x: 140, yOffset: 12 },
    { label: 'Fitness Level', value: userDetails.fitnessLevel, x: 20, yOffset: 24 },
    { label: 'Location', value: userDetails.location, x: 80, yOffset: 24 }
  ]

  details.forEach(detail => {
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${detail.label}:`, detail.x, yOffset + (detail.yOffset || 6))
    pdf.setFont('helvetica', 'normal')
    pdf.text(detail.value, detail.x + 25, yOffset + (detail.yOffset || 6))
  })

  yOffset += 45

  
  if (yOffset > pageHeight - 60) {
    pdf.addPage()
    yOffset = 20
  }

  
  yOffset = addSectionHeader('WORKOUT PLAN', yOffset, colors.secondary)

  if (fitnessPlans.workout?.overview) {
    pdf.setTextColor(...colors.text)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    
    
    drawRoundedRect(15, yOffset, pageWidth - 30, 25, 3, [249, 251, 253], true)
    drawRoundedRect(15, yOffset, pageWidth - 30, 25, 3, colors.secondary, false)
    
    const overviewText = pdf.splitTextToSize(fitnessPlans.workout.overview, pageWidth - 40)
    pdf.text(overviewText, 20, yOffset + 7)
    yOffset += 30
  }

  
  if (fitnessPlans.workout?.weeklySchedule) {
    if (yOffset > pageHeight - 60) {
      pdf.addPage()
      yOffset = 20
    }
    
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.secondary)
    pdf.text('Weekly Schedule:', 15, yOffset)
    yOffset += 8

    fitnessPlans.workout.weeklySchedule.forEach((day, index) => {
      if (yOffset > pageHeight - 60) {
        pdf.addPage()
        yOffset = 20
      }

      
      drawRoundedRect(15, yOffset, pageWidth - 30, 25, 3, [249, 251, 253], true)
      drawRoundedRect(15, yOffset, pageWidth - 30, 25, 3, colors.secondary, false)

      
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...colors.secondary)
      pdf.text(`${day.day.toUpperCase()}`, 20, yOffset + 7)
      pdf.setFontSize(9)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Focus: ${day.focus}`, 20, yOffset + 13)

      
      if (day.exercises) {
        let exerciseText = day.exercises.slice(0, 3).map(ex => 
          `${ex.name} (${ex.sets}x${ex.reps})`
        ).join(', ')
        
        pdf.setFontSize(8)
        pdf.setTextColor(...colors.text)
        const exerciseLines = pdf.splitTextToSize(exerciseText, pageWidth - 50)
        pdf.text(exerciseLines, 20, yOffset + 19)
        
        yOffset += 30 + (exerciseLines.length - 1) * 4
      } else {
        yOffset += 30
      }
    })
  }

  
  pdf.addPage()
  yOffset = 20

  yOffset = addSectionHeader('DIET PLAN', yOffset, colors.accent)

  if (fitnessPlans.diet?.overview) {
    drawRoundedRect(15, yOffset, pageWidth - 30, 25, 3, [249, 251, 253], true)
    drawRoundedRect(15, yOffset, pageWidth - 30, 25, 3, colors.accent, false)
    
    const dietText = pdf.splitTextToSize(fitnessPlans.diet.overview, pageWidth - 40)
    pdf.setTextColor(...colors.text)
    pdf.setFontSize(10)
    pdf.text(dietText, 20, yOffset + 7)
    yOffset += 30
  }

  
  if (fitnessPlans.diet?.dailyCalories) {
    drawRoundedRect(15, yOffset, pageWidth - 30, 15, 3, [254, 249, 231], true)
    drawRoundedRect(15, yOffset, pageWidth - 30, 15, 3, colors.warning, false)
    
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.warning)
    pdf.text(`Daily Calorie Target: ${fitnessPlans.diet.dailyCalories}`, 20, yOffset + 9)
    yOffset += 22
  }

  
  const meals = [
    { type: 'breakfast', label: 'BREAKFAST', color: colors.warning },
    { type: 'lunch', label: 'LUNCH', color: colors.secondary },
    { type: 'dinner', label: 'DINNER', color: colors.primary },
    { type: 'snacks', label: 'SNACKS', color: colors.accent }
  ]

  meals.forEach(meal => {
    if (fitnessPlans.diet?.meals?.[meal.type]?.length > 0) {
      if (yOffset > pageHeight - 80) {
        pdf.addPage()
        yOffset = 20
      }

      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...meal.color)
      pdf.text(meal.label, 15, yOffset)
      yOffset += 7

      
      drawRoundedRect(15, yOffset, pageWidth - 30, 30, 3, [249, 251, 253], true)
      drawRoundedRect(15, yOffset, pageWidth - 30, 30, 3, meal.color, false)

      let mealY = yOffset + 7
      fitnessPlans.diet.meals[meal.type].slice(0, 4).forEach(item => {
        pdf.setFontSize(9)
        pdf.setTextColor(...colors.text)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`• ${item.item}`, 20, mealY)
        
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(100, 100, 100)
        pdf.text(`${item.portion}`, pageWidth - 45, mealY, { align: 'right' })
        
        mealY += 5
      })

      yOffset += 35
    }
  })

  
  pdf.addPage()
  yOffset = 20

  yOffset = addSectionHeader('AI TIPS & MOTIVATION', yOffset, colors.warning)

  
  if (fitnessPlans.tips?.motivation) {
    drawRoundedRect(15, yOffset, pageWidth - 30, 25, 3, [254, 249, 231], true)
    drawRoundedRect(15, yOffset, pageWidth - 30, 25, 3, colors.warning, false)
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'italic')
    pdf.setTextColor(...colors.text)
    const motivationText = pdf.splitTextToSize(`${fitnessPlans.tips.motivation}`, pageWidth - 40)
    pdf.text(motivationText, 20, yOffset + 10)
    yOffset += 35
  }


  if (fitnessPlans.tips?.lifestyle) {
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.warning)
    pdf.text('Lifestyle Tips:', 15, yOffset)
    yOffset += 8

    fitnessPlans.tips.lifestyle.forEach((tip, index) => {
      if (yOffset > pageHeight - 40) {
        pdf.addPage()
        yOffset = 20
      }

      drawRoundedRect(15, yOffset, pageWidth - 30, 15, 3, [249, 251, 253], true)
      drawRoundedRect(15, yOffset, pageWidth - 30, 15, 3, colors.dark, false)

      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...colors.text)
      const tipText = pdf.splitTextToSize(`${tip}`, pageWidth - 40)
      pdf.text(tipText, 20, yOffset + 7)
      
      yOffset += 18 + (tipText.length - 1) * 5
    })
  }

  
  if (fitnessPlans.tips?.workoutTips) {
    if (yOffset > pageHeight - 60) {
      pdf.addPage()
      yOffset = 20
    }

    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.secondary)
    pdf.text('Workout Tips:', 15, yOffset)
    yOffset += 8

    fitnessPlans.tips.workoutTips.forEach((tip, index) => {
      if (yOffset > pageHeight - 40) {
        pdf.addPage()
        yOffset = 20
      }

      drawRoundedRect(15, yOffset, pageWidth - 30, 15, 3, [230, 245, 233], true)
      drawRoundedRect(15, yOffset, pageWidth - 30, 15, 3, colors.secondary, false)

      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...colors.text)
      const tipText = pdf.splitTextToSize(`• ${tip}`, pageWidth - 40)
      pdf.text(tipText, 20, yOffset + 7)
      
      yOffset += 18 + (tipText.length - 1) * 5
    })
  }

  
  if (fitnessPlans.tips?.nutritionTips) {
    if (yOffset > pageHeight - 60) {
      pdf.addPage()
      yOffset = 20
    }

    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.accent)
    pdf.text('Nutrition Tips:', 15, yOffset)
    yOffset += 8

    fitnessPlans.tips.nutritionTips.forEach((tip, index) => {
      if (yOffset > pageHeight - 40) {
        pdf.addPage()
        yOffset = 20
      }

      drawRoundedRect(15, yOffset, pageWidth - 30, 15, 3, [245, 238, 248], true)
      drawRoundedRect(15, yOffset, pageWidth - 30, 15, 3, colors.accent, false)

      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...colors.text)
      const tipText = pdf.splitTextToSize(`• ${tip}`, pageWidth - 40)
      pdf.text(tipText, 20, yOffset + 7)
      
      yOffset += 18 + (tipText.length - 1) * 5
    })
  }


  if (fitnessPlans.tips?.recoveryTips) {
    if (yOffset > pageHeight - 60) {
      pdf.addPage()
      yOffset = 20
    }

    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.primary)
    pdf.text('Recovery Tips:', 15, yOffset)
    yOffset += 8

    fitnessPlans.tips.recoveryTips.forEach((tip, index) => {
      if (yOffset > pageHeight - 40) {
        pdf.addPage()
        yOffset = 20
      }

      drawRoundedRect(15, yOffset, pageWidth - 30, 15, 3, [232, 245, 253], true)
      drawRoundedRect(15, yOffset, pageWidth - 30, 15, 3, colors.primary, false)

      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...colors.text)
      const tipText = pdf.splitTextToSize(`• ${tip}`, pageWidth - 40)
      pdf.text(tipText, 20, yOffset + 7)
      
      yOffset += 18 + (tipText.length - 1) * 5
    })
  }

  
  pdf.addPage()
  yOffset = 20

  yOffset = addSectionHeader('IMPORTANT NOTES', yOffset, colors.dark)

  const notes = [
    "This plan is personalized for you - stick to it consistently",
    "Stay hydrated throughout your workouts",
    "Listen to your body and adjust intensity as needed",
    "Track your progress regularly",
    "Update your plan every 4-6 weeks for continued progress",
    "Consult with healthcare professional before starting new fitness programs",
    "Get adequate sleep (7-9 hours) for optimal recovery",
    "Combine this plan with an active lifestyle for best results",
    "Be patient - sustainable results take time and consistency"
  ]

  notes.forEach(note => {
    if (yOffset > pageHeight - 30) {
      pdf.addPage()
      yOffset = 20
    }

    pdf.setFontSize(9)
    pdf.setTextColor(...colors.text)
    pdf.text(`• ${note}`, 20, yOffset)
    yOffset += 8
  })

  
  if (yOffset > pageHeight - 50) {
    pdf.addPage()
    yOffset = 20
  }

  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...colors.primary)
  pdf.text('You Got This! 💪', pageWidth / 2, yOffset, { align: 'center' })
  
  yOffset += 10
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'italic')
  pdf.setTextColor(100, 100, 100)
  pdf.text('Consistency is the key to success. Start today, stay committed!', pageWidth / 2, yOffset, { align: 'center' })
  
  yOffset += 10
  pdf.setFontSize(15)
  pdf.setFont('helvetica', 'bold')
  pdf.text('God Bless You!', pageWidth / 2, yOffset, { align: 'center' })


  const totalPages = pdf.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    
    
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
    
    
    if (i > 1) {
      pdf.setDrawColor(...colors.light)
      pdf.setLineWidth(0.3)
      pdf.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15)
    }
  }

  
  const fileName = `${userDetails.name.replace(/\s+/g, '_')}_Fitness_Plan.pdf`
  pdf.save(fileName)
}

export default generatePDF