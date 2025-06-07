const TranslatorStart = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between items-center p-6 sm:p-12 bg-gradient-to-r min-h-screen">
      {/* Header Language Bubble - Updated to match Lingo's white card style */}
      <div className="w-full max-w-4xl h-72 sm:h-80 card rounded-t-full rounded-bl-full flex flex-col justify-center items-center text-primary relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-yellow-400"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center h-full">
          <span className="font-shojumaru text-4xl sm:text-5xl md:text-6xl text-center text-gray-800 mb-2">Hello</span>
          <span className="text-xl sm:text-2xl md:text-3xl text-center text-gray-600 mb-1">გამარჯობა</span>
          <span className="font-notoSansJp text-2xl sm:text-3xl md:text-4xl text-right w-full pr-8 text-gray-700 mb-1">こんにちは</span>
          <span className="text-xl sm:text-2xl md:text-3xl text-right w-full pr-8 text-gray-600">Hola</span>
        </div>
      </div>

      {/* Title and Start Button */}
      <div className="w-full max-w-2xl text-center mt-10 flex flex-col items-center gap-y-8">
        <div className="flex flex-col items-center gap-y-4">
          <h1 className="app-title text-5xl sm:text-6xl md:text-7xl uppercase tracking-wider">LINGO</h1>
          <p className="text-white text-lg sm:text-xl font-light tracking-wide opacity-90">speak the world</p>
        </div>
        
        <button
          className="btn w-40 h-14 text-lg font-bold uppercase tracking-wider transform hover:scale-105 active:scale-95 transition-all duration-200"
          onClick={onStart}
        >
          Start
        </button>
      </div>

      {/* Spacer */}
      <div className="h-12" />
    </div>
  )
}

export default TranslatorStart