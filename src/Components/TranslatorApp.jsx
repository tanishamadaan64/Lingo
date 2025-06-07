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
  const maxChars = 200
  const dropdownRef = useRef(null)

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

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        inputText,
      )}&langpair=${selectedLanguageFrom}|${selectedLanguageTo}&key=d1d0ab15f2336b1478ba`,
    )

    const data = await response.json()

    setTranslatedText(data.responseData.translatedText)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTranslate()
    }
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
        <div className="flex-1">
          <textarea
            className="w-full h-56 p-6 rounded-lg card text-orange-600 resize-none text-lg"
            readOnly
            placeholder="Translation will appear here..."
            value={translatedText || ''}
          />
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