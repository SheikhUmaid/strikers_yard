import { FaFutbol } from "react-icons/fa";
import { GiCricketBat, GiShuttlecock } from "react-icons/gi";

export default function SportSelector({ sports, selectedSport, onSelectSport }) {
  
  // Map each sport to an icon
  const getIcon = (name) => {
    const sport = name.toLowerCase();
    if (sport.includes("football") || sport.includes("soccer")) return <FaFutbol />;
    if (sport.includes("cricket")) return <GiCricketBat />;
    if (sport.includes("badminton")) return <GiShuttlecock />;
    return <FaFutbol />; // fallback
  };

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
        Select Sports
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {sports.map((sport) => {
          const isSelected = selectedSport === sport.name.toLowerCase();

          return (
            <button
              key={sport.id}
              onClick={() => onSelectSport(sport.name.toLowerCase())}
              className={`
                relative 
                p-5 rounded-2xl 
                transition-all duration-300 
                flex flex-col items-center gap-3 
                group
                ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-400 to-lime-300 text-emerald-950 shadow-lg scale-110'
                    : 'bg-white/5 text-emerald-50 hover:bg-white/15 hover:scale-105 hover:shadow-md'
                }
              `}
            >

              {/* Icon */}
              <span
                className={`
                  text-4xl transition-all duration-300
                  ${isSelected ? 'text-emerald-900 scale-110' : 'text-emerald-100/90'}
                `}
              >
                {getIcon(sport.name)}
              </span>

              {/* Sport Name */}
              <span
                className={`
                  font-semibold transition-all duration-300
                  ${isSelected ? 'text-emerald-900' : 'text-emerald-100/90'}
                `}
              >
                {sport.name}
              </span>

            </button>
          );
        })}
      </div>
    </div>
  );
}
