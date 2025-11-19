export default function ActionButtons() {
  return (
    <div className="space-y-4">
      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-lg">
        PROCEED TO PAY
      </button>
      <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-lg">
        PAY PARTIAL (₹505/-)
      </button>
    </div>
  );
}
