import { MapPin, Check } from 'lucide-react';

export default function TurfSelector({ turfs, selectedTurf, setSelectedTurf }) {
  return (
    <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-3xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        Select Turf
      </h2>
      <div className="space-y-3">
        {turfs.map((turf) => (
          <button
            key={turf.id}
            onClick={() => setSelectedTurf(turf.id)}
            className={`relative w-full p-4 rounded-xl transition-all duration-300 text-left font-semibold flex items-center gap-3 ${
              selectedTurf === turf.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                : 'bg-white/50 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white/70 hover:scale-105 hover:shadow-md'
            }`}
          >
            <MapPin className="w-5 h-5" />
            {turf.name}
            {selectedTurf === turf.id && (
              <div className="ml-auto bg-white/30 backdrop-blur-sm rounded-full p-1">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
