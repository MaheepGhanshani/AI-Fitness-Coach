export const speakText = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1
    
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(voice => voice.lang.includes('en'))
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }
    
    window.speechSynthesis.speak(utterance)
    
    return {
      stop: () => window.speechSynthesis.cancel(),
      pause: () => window.speechSynthesis.pause(),
      resume: () => window.speechSynthesis.resume()
    }
  } else {
    console.error('Speech synthesis not supported')
    return null
  }
}

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}