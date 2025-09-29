// client/src/utils/textToSpeech.js
class TextToSpeechService {
  constructor() {
    this.synth = window.speechSynthesis
    this.utterance = null
    this.isPlaying = false
    this.isPaused = false
    this.currentText = ''
    this.currentPosition = 0
    this.onProgress = null
    this.voices = []
    
    // Load voices
    this.loadVoices()
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices()
    }
  }

  loadVoices() {
    this.voices = this.synth.getVoices()
  }

  getVoices() {
    return this.voices
  }

  speak(text, options = {}) {
    if (!text) return

    this.stop() // Stop any current speech
    
    this.currentText = text
    this.utterance = new SpeechSynthesisUtterance(text)
    
    // Set voice options
    this.utterance.rate = options.rate || 1.0
    this.utterance.pitch = options.pitch || 1.0
    this.utterance.volume = options.volume || 1.0
    
    if (options.voice) {
      const selectedVoice = this.voices.find(voice => voice.name === options.voice)
      if (selectedVoice) {
        this.utterance.voice = selectedVoice
      }
    }

    // Set event handlers
    this.utterance.onstart = () => {
      this.isPlaying = true
      this.isPaused = false
      if (options.onStart) options.onStart()
    }

    this.utterance.onend = () => {
      this.isPlaying = false
      this.isPaused = false
      this.currentPosition = 0
      if (options.onEnd) options.onEnd()
    }

    this.utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error)
      this.isPlaying = false
      this.isPaused = false
      if (options.onError) options.onError(event.error)
    }

    this.utterance.onpause = () => {
      this.isPaused = true
      if (options.onPause) options.onPause()
    }

    this.utterance.onresume = () => {
      this.isPaused = false
      if (options.onResume) options.onResume()
    }

    this.synth.speak(this.utterance)
  }

  pause() {
    if (this.isPlaying && !this.isPaused) {
      this.synth.pause()
    }
  }

  resume() {
    if (this.isPlaying && this.isPaused) {
      this.synth.resume()
    }
  }

  stop() {
    if (this.isPlaying) {
      this.synth.cancel()
      this.isPlaying = false
      this.isPaused = false
      this.currentPosition = 0
    }
  }

  getStatus() {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentText: this.currentText,
      currentPosition: this.currentPosition
    }
  }
}

export const ttsService = new TextToSpeechService()