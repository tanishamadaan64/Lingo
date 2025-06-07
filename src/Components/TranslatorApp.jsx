import { languages } from '../languagesData'
import { useState, useRef, useEffect } from 'react'

const TranslatorApp = ({ onClose }) => {
  const [selectedLanguageFrom, setSelectedLanguageFrom] = useState('en')
  const [selectedLanguageTo, setSelectedLanguageTo] = useState('en')
  const [showLanguages, setShowLanguages] = useState(false)
  const [currentLanguageSelection, setCurrentLanguageSelection] = useState(null)
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const maxChars = 200
  const dropdownRef = useRef(null)

  // Cache voices to avoid delays
  const voicesRef = useRef([])

  // Load voices once on mount
  useEffect(() => {
    const synth = window.speechSynthesis
    const loadVoices = () => {
      voicesRef.current = synth.getVoices()
      if (voicesRef.current.length === 0) {
        // Sometimes voices load asynchronously
        setTimeout(loadVoices, 100)
      }
    }
    loadVoices()
  }, [])

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowLanguages(false)
    }
  }

  useEffect(() => {
    if (showLanguages) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLanguages])

  const handleLanguageClick = (type) => {
    setCurrentLanguageSelection(type)
    setShowLanguages(true)
  }

  const handleLanguagesSelect = (languageCode) => {
    if (currentLanguageSelection === 'from') {
      setSelectedLanguageFrom(languageCode)
    } else {
      setSelectedLanguageTo(languageCode)
    }
    setShowLanguages(false)
  }

  const handleSwapLanguages = () => {
    setSelectedLanguageFrom(selectedLanguageTo)
    setSelectedLanguageTo(selectedLanguageFrom)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    if (value.length <= maxChars) {
      setInputText(value)
      setCharCount(value.length)
    }
  }

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setTranslatedText('')
      return
    }

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          inputText
        )}&langpair=${selectedLanguageFrom}|${selectedLanguageTo}&key=d1d0ab15f2336b1478ba`
      )

      const data = await response.json()

      if (data.responseData?.translatedText) {
        setTranslatedText(data.responseData.translatedText)
      } else {
        setTranslatedText('Translation not available')
      }
    } catch (error) {
      console.error('Translation error:', error)
      setTranslatedText('An error occurred during translation.')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTranslate()
    }
  }

  // Simple sentiment analysis heuristic for tone
  const getSentimentScore = (text) => {
    const positiveWords = ['happy', 'joy', 'love', 'good', 'great', 'peace', 'beautiful', 'smile', 'hope', 'bright']
    const negativeWords = ['sad', 'hate', 'bad', 'angry', 'pain', 'hurt', 'dark', 'fear', 'cry', 'lonely']

    let score = 0
    const words = text.toLowerCase().split(/\W+/)

    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1
      if (negativeWords.includes(word)) score -= 1
    })

    return score
  }

  const handleSpeak = () => {
    if (!translatedText.trim()) return

    const synth = window.speechSynthesis
    if (!synth) return

    synth.cancel()

    const utterance = new SpeechSynthesisUtterance(translatedText)

    // Use cached voices to avoid delay
    const voices = voicesRef.current
    const langVoices = voices.filter(v => v.lang.startsWith(selectedLanguageTo))
    if (langVoices.length > 0) {
      utterance.voice = langVoices[0]
    }

    // Analyze sentiment for tone
    const sentiment = getSentimentScore(translatedText)

    if (sentiment > 0) {
      // Positive tone: slightly faster and higher pitch
      utterance.rate = 1.1
      utterance.pitch = 1.4
    } else if (sentiment < 0) {
      // Negative tone: slower and lower pitch
      utterance.rate = 0.8
      utterance.pitch = 0.8
    } else {
      // Neutral tone
      utterance.rate = 0.9
      utterance.pitch = 1.0
    }

    utterance.lang = selectedLanguageTo

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synth.speak(utterance)
  }

  return (
    <div className="w-full h-full flex flex-col justify-between items-center px-8 sm:px-16 pt-8 pb-10 relative bg-gradient-to-r min-h-screen">
      {/* Close Button */}
      <button className="absolute top-5 right-5" onClick={onClose}>
        <i className="fa-solid fa-xmark text-3xl text-white hover:text-gray-200 transition" />
      </button>

      {/* Language Selection */}
      <div className="w-full max-w-4xl flex justify-center items-center px-6 py-4 card text-primary rounded-lg lingo-shadow">
        <div
          className="language cursor-pointer px-4 py-2 hover:bg-orange-100 rounded text-lg"
          onClick={() => handleLanguageClick('from')}
        >
          {languages[selectedLanguageFrom] || 'English'}
        </div>
        <i
          className="fa-solid fa-arrows-rotate text-3xl mx-10 cursor-pointer hover:rotate-180 transition-transform text-orange-500"
          onClick={handleSwapLanguages}
        ></i>
        <div
          className="language cursor-pointer px-4 py-2 hover:bg-orange-100 rounded text-lg"
          onClick={() => handleLanguageClick('to')}
        >
          {languages[selectedLanguageTo] || 'English'}
        </div>
      </div>

      {/* Language Dropdown */}
      {showLanguages && (
        <div
          className="absolute top-[7.5rem] w-72 max-h-80 card rounded lingo-shadow z-20 overflow-y-auto p-3"
          ref={dropdownRef}
        >
          <ul className="text-base text-primary">
            {Object.entries(languages).map(([code, name]) => (
              <li
                key={code}
                className="cursor-pointer hover:bg-orange-100 transition p-3 rounded"
                onClick={() => handleLanguagesSelect(code)}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Input and Output side-by-side */}
      <div className="w-full max-w-4xl mt-8 flex flex-col sm:flex-row gap-8">
        {/* Input Textarea */}
        <div className="flex-1 relative">
          <textarea
            className="w-full h-56 p-6 rounded-lg card text-primary resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
            placeholder="Enter text to translate..."
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute bottom-3 right-5 text-sm text-secondary">
            {charCount}/{maxChars}
          </div>
        </div>

        {/* Output Textarea */}
        <div className="flex-1 relative">
          <textarea
            className="w-full h-56 p-6 rounded-lg card text-orange-600 resize-none text-lg"
            readOnly
            placeholder="Translation will appear here..."
            value={translatedText || ''}
          />
          {/* Audio button */}
          <button
            className={`absolute bottom-5 right-5 w-10 h-10 rounded-full bg-orange-500 text-white flex justify-center items-center hover:bg-orange-600 transition`}
            onClick={handleSpeak}
            disabled={isSpeaking}
            title={isSpeaking ? 'Playing audio...' : 'Listen to translation'}
          >
            <i className="fa-solid fa-volume-high"></i>
          </button>
        </div>
      </div>

      {/* Translate Button */}
      <button
        className="w-16 h-16 btn rounded-full text-2xl flex justify-center items-center mt-6"
        onClick={handleTranslate}
      >
        <i className="fa-solid fa-chevron-down"></i>
      </button>
    </div>
  )
}

export default TranslatorApp
