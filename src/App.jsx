import { useState } from 'react'
import TranslatorStart from './Components/TranslatorStart'
import TranslatorApp from './Components/TranslatorApp'

const App = () => {
  const [showTranslatorApp, setShowTranslatorApp] = useState(false)

  return (
    <div className="w-full h-screen bg-gradient-to-l from-[#b6f492] to-[#338b93]">
      <div className="w-full h-full bg-[#2d2d2d] flex flex-col">
        {showTranslatorApp ? (
          <TranslatorApp onClose={() => setShowTranslatorApp(false)} />
        ) : (
          <TranslatorStart onStart={() => setShowTranslatorApp(true)} />
        )}
      </div>
    </div>
  )
}

export default App
