import { Check } from 'lucide-react';

export default function SportSelector({ sports, selectedSport, onSelectSport }) {
  return (
    <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-3xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        Select Sports
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {sports.map((sport) => (
          <button
            key={sport.id}
            onClick={() => onSelectSport(sport.name.toLowerCase())}
            className={`relative p-5 rounded-2xl transition-all duration-300 flex flex-col items-center gap-3 group ${
              selectedSport === sport.name.toLowerCase()
                ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                : 'bg-white/50 backdrop-blur-sm border border-white/40 hover:bg-white/70 hover:scale-105 hover:shadow-lg'
            }`}
          >
            <span className="text-4xl">⚽</span>
            <span className={`font-semibold ${selectedSport === sport.name.toLowerCase() ? 'text-white' : 'text-gray-700'}`}>
              {sport.name}
            </span>
            {selectedSport === sport.name.toLowerCase() && (
              <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-sm rounded-full p-1">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
