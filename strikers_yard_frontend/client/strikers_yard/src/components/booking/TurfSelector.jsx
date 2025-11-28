import { useEffect } from 'react';
import { MapPin } from 'lucide-react';

export default function TurfSelector({ turfs, selectedTurf, setSelectedTurf }) {

  // ✅ Auto-select the first turf by default
  useEffect(() => {
    if (!selectedTurf && turfs.length > 0) {
      setSelectedTurf(turfs[0].id);
    }
  }, [selectedTurf, turfs, setSelectedTurf]);

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
        Select Turf
      </h2>

      <div className="space-y-3">
        {turfs.map((turf) => {
          const isSelected = selectedTurf === turf.id;

          return (
            <button
              key={turf.id}
              onClick={() => setSelectedTurf(turf.id)}
              className={`
                w-full p-4 rounded-xl font-semibold 
                flex items-center gap-3 transition-all duration-300
                ${
                  isSelected
                    ? "bg-gradient-to-r from-emerald-400 to-lime-300 text-emerald-900 shadow-lg scale-105"
                    : "bg-white/5 text-emerald-50 hover:bg-white/15 hover:scale-105 hover:shadow-md"
                }
              `}
            >
              <MapPin className="w-5 h-5" />
              {turf.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
