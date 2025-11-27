export default function DurationSelector({ duration, setDuration, getMaxDuration, selectedSlot }) {
  const maxDuration = getMaxDuration(selectedSlot);

  return (
    <div
      className="
        rounded-3xl 
        backdrop-blur-3xl 
        bg-gray-950/10 
        border border-white/15 
        shadow-[0_24px_80px_rgba(0,0,0,0.55)]
        p-7
      "
    >
      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
        <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-300 to-lime-300 rounded-full" />
        Select Duration
      </h2>

      <div className="flex items-center justify-center gap-6">

        {/* MINUS BUTTON */}
        <button
          onClick={() => duration > 1 && setDuration(duration - 1)}
          disabled={duration <= 1}
          className={`
            w-14 h-14 rounded-2xl font-bold text-3xl flex items-center justify-center transition-all duration-200
            ${
              duration <= 1
                ? 'bg-white/5 text-emerald-200/40 cursor-not-allowed'
                : 'bg-white/10 text-emerald-50 hover:bg-white/20 hover:shadow-md hover:scale-110'
            }
          `}
        >
          −
        </button>

        {/* DISPLAY */}
        <div
          className="
            text-center min-w-[120px] 
            rounded-2xl 
            border border-white/20 
            bg-gradient-to-br from-white/6 to-white/2 
            backdrop-blur-2xl 
            p-4
          "
        >
          <div className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-lime-200 bg-clip-text text-transparent">
            {duration}
          </div>
          <div className="text-sm text-emerald-100/70 font-medium mt-1">hour(s)</div>
        </div>

        {/* PLUS BUTTON */}
        <button
          onClick={() => setDuration(duration + 1)}
          disabled={duration >= maxDuration}
          className={`
            w-14 h-14 rounded-2xl font-bold text-3xl flex items-center justify-center transition-all duration-200
            ${
              duration >= maxDuration
                ? 'bg-white/5 text-emerald-200/40 cursor-not-allowed'
                : 'bg-white/10 text-emerald-50 hover:bg-white/20 hover:shadow-md hover:scale-110'
            }
          `}
        >
          +
        </button>

      </div>
    </div>
  );
}
