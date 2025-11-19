export default function DurationSelector({ duration, setDuration }) {
  return (
    <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-3xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        Select Duration
      </h2>
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => duration > 1 && setDuration(duration - 1)}
          disabled={duration <= 1}
          className={`w-14 h-14 rounded-2xl font-bold text-2xl transition-all duration-200 flex items-center justify-center ${
            duration <= 1
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
              : 'bg-white/60 hover:bg-white/80 text-blue-600 hover:shadow-lg hover:scale-110'
          }`}
        >
          −
        </button>
        <div className="text-center min-w-[120px] backdrop-blur-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/30 rounded-2xl p-4">
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{duration}</div>
          <div className="text-sm text-gray-600 font-medium mt-1">hour(s)</div>
        </div>
        <button
          onClick={() => setDuration(duration + 1)}
          className="w-14 h-14 rounded-2xl bg-white/60 hover:bg-white/80 text-blue-600 font-bold text-2xl transition-all duration-200 flex items-center justify-center hover:shadow-lg hover:scale-110"
        >
          +
        </button>
      </div>
    </div>
  );
}
