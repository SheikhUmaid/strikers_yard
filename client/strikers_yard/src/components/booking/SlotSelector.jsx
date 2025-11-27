import { Clock, Check } from 'lucide-react';

export default function SlotSelector({ slots, selectedSlot, onSelectSlot }) {
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
        Select Slot
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot;
          return (
            <button
              key={slot}
              onClick={() => onSelectSlot(slot)}
              className={`
                relative 
                p-4 rounded-xl 
                text-sm font-semibold 
                transition-all duration-300
                ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-400 to-lime-300 text-emerald-950 shadow-lg scale-110'
                    : 'bg-white/5 text-emerald-50 hover:bg-white/15 hover:scale-105 hover:shadow-md'
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1">
                  <Check className="w-3 h-3 text-emerald-900" />
                </div>
              )}

              <Clock
                className={`w-4 h-4 mx-auto mb-1 ${
                  isSelected ? 'text-emerald-900' : 'text-emerald-100/80'
                }`}
              />
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}
