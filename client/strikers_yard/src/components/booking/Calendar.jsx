import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar({
  currentMonth,
  goToPreviousMonth,
  goToNextMonth,
  isPreviousMonthDisabled,
  days,
  weekDays,
  months,
  selectedDate,
  setSelectedDate,
  isDateDisabled,
  isSameDay,
  today,
  formatSelectedDate,
}) {
  return (
    <div className="
      rounded-3xl 
      backdrop-blur-3xl 
      bg-gray-950/10 
      border border-white/15 
      shadow-[0_24px_80px_rgba(0,0,0,0.55)]
      p-7
    ">
      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
        <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-300 to-lime-300 rounded-full" />
        Select Playing Date
      </h2>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            disabled={isPreviousMonthDisabled()}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isPreviousMonthDisabled()
                ? 'bg-white/5 text-emerald-200/40 cursor-not-allowed'
                : 'bg-white/10 text-emerald-50 hover:bg-white/20 hover:shadow-md'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-lg text-emerald-50 tracking-wide">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-2.5 rounded-xl bg-white/10 text-emerald-50 hover:bg-white/20 transition-all duration-200 hover:shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-3">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-emerald-100/70 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }

            const disabled = isDateDisabled(day);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, today);

            return (
              <button
                key={idx}
                onClick={() => !disabled && setSelectedDate(day)}
                disabled={disabled}
                className={`aspect-square rounded-xl text-sm font-semibold transition-all duration-200 ${
                  disabled
                    ? 'text-emerald-200/35 cursor-not-allowed bg-white/5'
                    : isSelected
                    ? 'bg-gradient-to-br from-emerald-400 to-lime-300 text-emerald-950 shadow-lg scale-110'
                    : isToday
                    ? 'bg-emerald-800/70 text-emerald-50 hover:bg-emerald-700'
                    : 'bg-white/5 text-emerald-50 hover:bg-white/15 hover:scale-105 hover:shadow-md'
                }`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="
        mt-4 
        rounded-2xl 
        border border-white/20 
        bg-gradient-to-br from-white/6 to-white/2 
        backdrop-blur-2xl 
        p-4 
        text-center
      ">
        <div className="text-sm text-emerald-100/80 font-medium mb-1">
          Selected Date
        </div>
        <div className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-lime-200 bg-clip-text text-transparent">
          {formatSelectedDate()}
        </div>
      </div>
    </div>
  );
}
