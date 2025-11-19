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
    <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-3xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        Select Playing Date
      </h2>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            disabled={isPreviousMonthDisabled()}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isPreviousMonthDisabled()
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-white/60 hover:bg-white/80 text-gray-700 hover:shadow-md'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-lg text-gray-800">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-2.5 rounded-xl bg-white/60 hover:bg-white/80 text-gray-700 transition-all duration-200 hover:shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-3">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-bold text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="aspect-square"></div>;
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
                    ? 'text-gray-300 cursor-not-allowed bg-gray-50/50'
                    : isSelected
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-110'
                    : isToday
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-white/50 text-gray-700 hover:bg-white/80 hover:scale-105 hover:shadow-md'
                }`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
      <div className="backdrop-blur-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/30 rounded-2xl p-4 text-center">
        <div className="text-sm text-gray-600 font-medium mb-1">Selected Date</div>
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {formatSelectedDate()}
        </div>
      </div>
    </div>
  );
}
