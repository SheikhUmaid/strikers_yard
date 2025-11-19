import { Clock, Check } from 'lucide-react';

export default function SlotSelector({ slots, selectedSlot, onSelectSlot }) {
  return (
    <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-3xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        Select Slot
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => onSelectSlot(slot)}
            className={`relative p-4 rounded-xl transition-all duration-300 text-sm font-semibold ${
              selectedSlot === slot
                ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                : 'bg-white/50 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white/70 hover:scale-105 hover:shadow-md'
            }`}
          >
            {selectedSlot === slot && (
              <div className="absolute top-2 right-2 bg-white/30 backdrop-blur-sm rounded-full p-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            <Clock className="w-4 h-4 mx-auto mb-1 opacity-80" />
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}
