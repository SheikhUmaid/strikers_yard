import { useState, useEffect } from 'react';
import { Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSports } from '../hooks/UseSports';

export default function SportsBooking() {
  const today = new Date(2025, 10, 11);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10, 1));
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('6:00 PM - 7:00 PM');
  const [selectedDate, setSelectedDate] = useState(today);
  const [duration, setDuration] = useState(1);
  const [selectedTurf, setSelectedTurf] = useState('5-a-side-turf-a');

  const { sports, loading, error } = useSports();

  const slots = [
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM',
    '7:00 PM - 8:00 PM',
    '8:00 PM - 9:00 PM',
    '9:00 PM - 10:00 PM',
    '10:00 PM - 11:00 PM',
  ];

  const turfs = [
    { id: '5-a-side-turf-a', name: '5 a side Turf A' },
    { id: '5-a-side-turf-b', name: '5 a side Turf B' },
    { id: '7-a-side-turf-c', name: '7 a side Turf C' },
  ];

  const bookingFee = 2000;
  const convenienceFee = 20;
  const total = bookingFee + convenienceFee;

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dateOnly < todayOnly;
  };

  const isSameDay = (d1, d2) =>
    d1 &&
    d2 &&
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const formatSelectedDate = () => {
    const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${selectedDate.getDate()} ${m[selectedDate.getMonth()]}, ${selectedDate.getFullYear()}`;
  };

  const goToPreviousMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const goToNextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const isPreviousMonthDisabled = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    return prev < new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January','February','March','April','May','June','July','August',
    'September','October','November','December'
  ];

  useEffect(() => {
    if (!selectedSport && sports.length > 0) {
      setSelectedSport(sports[0].name.toLowerCase());
    }
  }, [sports, selectedSport]);

  if (loading) return <p className="p-4 text-white">Loading sports...</p>;
  if (error) return <p className="p-4 text-red-400">{error}</p>;

  return (
    <div className="min-h-screen relative">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center filter blur-sm"
        style={{
          backgroundImage: "url('/home/sheikh/Downloads/111.jpg')",
        }}
      />

      {/* Frosted overlay */}
      <div className="absolute inset-0 -z-10 bg-black/25 backdrop-blur-lg" />

      {/* Header */}
      <div className="backdrop-blur-2xl bg-gray-950/10 border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-lime-200 bg-clip-text text-transparent">
            Book Your Turf
          </h1>
          <p className="text-emerald-100/70 text-lg">Select your sport, time & enjoy!</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 lg:flex lg:gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:flex-1 space-y-6 mb-6 lg:mb-0">

          {/* SPORTS */}
          <div className="
            rounded-3xl backdrop-blur-3xl bg-gray-950/10 border border-white/15
            shadow-[0_24px_80px_rgba(0,0,0,0.55)] p-7
          ">
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
                    onClick={() => setSelectedSport(sport.name.toLowerCase())}
                    className={`
                      relative p-5 rounded-2xl flex flex-col items-center gap-3
                      transition-all duration-300
                      ${
                        isSelected
                          ? 'bg-gradient-to-br from-emerald-400 to-lime-300 text-emerald-950 shadow-lg scale-110'
                          : 'bg-white/5 text-emerald-50 hover:bg-white/15 hover:scale-105 hover:shadow-md'
                      }
                    `}
                  >
                    <span className={`text-4xl ${isSelected ? 'text-emerald-900' : 'text-emerald-100/80'}`}>
                      ⚽
                    </span>

                    <span className={`font-semibold ${isSelected ? 'text-emerald-900' : 'text-emerald-100/80'}`}>
                      {sport.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CALENDAR */}
          <div className="
            rounded-3xl backdrop-blur-3xl bg-gray-950/10 border border-white/15
            shadow-[0_24px_80px_rgba(0,0,0,0.55)] p-7
          ">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-300 to-lime-300 rounded-full" />
              Select Playing Date
            </h2>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={goToPreviousMonth}
                disabled={isPreviousMonthDisabled()}
                className={`
                  p-2.5 rounded-xl transition-all duration-200
                  ${
                    isPreviousMonthDisabled()
                      ? 'bg-white/5 text-emerald-200/40 cursor-not-allowed'
                      : 'bg-white/10 text-emerald-50 hover:bg-white/20 hover:shadow-md'
                  }
                `}
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

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-emerald-100/70 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, idx) => {
                if (!day) return <div key={idx} className="aspect-square" />;

                const disabled = isDateDisabled(day);
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, today);

                return (
                  <button
                    key={idx}
                    onClick={() => !disabled && setSelectedDate(day)}
                    disabled={disabled}
                    className={`
                      aspect-square rounded-xl text-sm font-semibold transition-all duration-200
                      ${
                        disabled
                          ? 'text-emerald-200/35 cursor-not-allowed bg-white/5'
                          : isSelected
                          ? 'bg-gradient-to-br from-emerald-400 to-lime-300 text-emerald-950 shadow-lg scale-110'
                          : isToday
                          ? 'bg-emerald-800/70 text-emerald-50 hover:bg-emerald-700'
                          : 'bg-white/5 text-emerald-50 hover:bg-white/15 hover:scale-105 hover:shadow-md'
                      }
                    `}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Selected Date */}
            <div className="
              mt-4 rounded-2xl border border-white/20
              bg-gradient-to-br from-white/6 to-white/2 
              backdrop-blur-2xl p-4 text-center
            ">
              <div className="text-sm text-emerald-100/80 font-medium mb-1">
                Selected Date
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-lime-200 bg-clip-text text-transparent">
                {formatSelectedDate()}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:flex-1 space-y-6">

          {/* SLOT SELECTOR */}
          <div className="
            rounded-3xl backdrop-blur-3xl bg-gray-950/10 border border-white/15
            shadow-[0_24px_80px_rgba(0,0,0,0.55)] p-7
          ">
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
                    onClick={() => setSelectedSlot(slot)}
                    className={`
                      relative p-4 rounded-xl transition-all duration-300 text-sm font-semibold
                      ${
                        isSelected
                          ? 'bg-gradient-to-br from-emerald-400 to-lime-300 text-emerald-950 shadow-lg scale-110'
                          : 'bg-white/5 text-emerald-50 hover:bg-white/15 hover:scale-105 hover:shadow-md'
                      }
                    `}
                  >
                    <Clock
                      className={`
                        w-4 h-4 mx-auto mb-1
                        ${isSelected ? 'text-emerald-900' : 'text-emerald-100/70'}
                      `}
                    />
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DURATION */}
          <div className="
            rounded-3xl backdrop-blur-3xl bg-gray-950/10 border border-white/15
            shadow-[0_24px_80px_rgba(0,0,0,0.55)] p-7
          ">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-300 to-lime-300 rounded-full" />
              Select Duration
            </h2>

            <div className="flex items-center justify-center gap-6">

              {/* minus */}
              <button
                onClick={() => duration > 1 && setDuration(duration - 1)}
                disabled={duration <= 1}
                className={`
                  w-14 h-14 rounded-2xl font-bold text-3xl transition-all duration-200
                  flex items-center justify-center
                  ${
                    duration <= 1
                      ? 'bg-white/5 text-emerald-200/30 cursor-not-allowed'
                      : 'bg-white/10 text-emerald-50 hover:bg-white/20 hover:shadow-md hover:scale-110'
                  }
                `}
              >
                −
              </button>

              {/* Duration display */}
              <div className="
                text-center min-w-[120px] rounded-2xl
                border border-white/20 
                bg-gradient-to-br from-white/6 to-white/2 
                backdrop-blur-2xl p-4
              ">
                <div className="
                  text-4xl font-bold
                  bg-gradient-to-r from-emerald-300 to-lime-200 bg-clip-text text-transparent
                ">
                  {duration}
                </div>
                <div className="text-sm text-emerald-100/80 font-medium mt-1">
                  hour(s)
                </div>
              </div>

              {/* plus */}
              <button
                onClick={() => setDuration(duration + 1)}
                className="
                  w-14 h-14 rounded-2xl bg-white/10 text-emerald-50
                  font-bold text-3xl transition-all duration-200
                  flex items-center justify-center
                  hover:bg-white/20 hover:shadow-md hover:scale-110
                "
              >
                +
              </button>
            </div>
          </div>

          {/* TURF SELECTOR */}
          <div className="
            rounded-3xl backdrop-blur-3xl bg-gray-950/10 border border-white/15
            shadow-[0_24px_80px_rgba(0,0,0,0.55)] p-7
          ">
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
                      w-full p-4 rounded-xl transition-all duration-300 font-semibold
                      flex items-center gap-3
                      ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-400 to-lime-300 text-emerald-950 shadow-lg scale-110'
                          : 'bg-white/5 text-emerald-50 hover:bg-white/15 hover:scale-105 hover:shadow-md'
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

          {/* SUMMARY */}
          <div className="
            rounded-3xl backdrop-blur-3xl 
            bg-gradient-to-br from-emerald-900/40 to-lime-900/40 
            border border-white/20 shadow-[0_24px_80px_rgba(0,0,0,0.55)]
            p-7
          ">
            <h3 className="text-xl font-semibold text-emerald-50 mb-6">
              Booking Summary
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-emerald-100/80 font-medium">Booking Fee</span>
                <span className="font-bold text-2xl text-emerald-50">₹{bookingFee}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-emerald-100/80 font-medium">Convenience Fee</span>
                <span className="font-bold text-2xl text-emerald-50">₹{convenienceFee}</span>
              </div>

              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-emerald-50">Total Amount</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-lime-200 bg-clip-text text-transparent">
                    ₹{total}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Time */}
            <div className="
              rounded-2xl p-4 mb-6 
              bg-white/10 border border-white/20 backdrop-blur-lg
            ">
              <div className="flex items-center gap-3 text-emerald-50">
                <Clock className="w-5 h-5 text-emerald-300" />
                <div>
                  <div className="text-xs text-emerald-100/60 font-medium">Selected Time</div>
                  <div className="font-bold">{selectedSlot}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-4 mb-10">
            <button className="
              w-full bg-gradient-to-r from-emerald-400 to-lime-300 
              text-emerald-950 font-bold py-5 rounded-2xl
              shadow-xl hover:shadow-2xl transition-all duration-300
              hover:scale-105 active:scale-95 backdrop-blur-lg
            ">
              PROCEED TO PAY
            </button>

            <button className="
              w-full bg-gradient-to-r from-amber-500 to-orange-400 
              text-white font-bold py-5 rounded-2xl shadow-xl
              hover:shadow-2xl transition-all duration-300 
              hover:scale-105 active:scale-95 backdrop-blur-lg
            ">
              PAY PARTIAL
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
