export default function ActionButtons() {
  return (
    <div className="backdrop-blur-xl bg-white/25 border border-white/40 rounded-3xl shadow-2xl p-6 space-y-4">
      <button
        className="w-full bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 font-semibold py-4 rounded-2xl shadow-lg
                   transition-all duration-200 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
      >
        PROCEED TO PAY
      </button>

      <button
        className="w-full bg-white/10 text-emerald-200 font-semibold py-4 rounded-2xl border border-emerald-300/60
                   shadow-md transition-all duration-200 hover:bg-white/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
      >
        PAY PARTIAL (₹505/-)
      </button>
    </div>
  );
}
