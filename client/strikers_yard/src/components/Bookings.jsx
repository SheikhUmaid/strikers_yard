import { useState, useEffect } from 'react';
import { Clock, MapPin, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useSports } from '../hooks/UseSports'; // Adjust path as needed

export default function SportsBooking() {
  const today = new Date(2025, 10, 11); // November 11, 2025
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10, 1));
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('6:00 PM - 7:00 PM');
  const [selectedDate, setSelectedDate] = useState(today);
  const [duration, setDuration] = useState(1);
  const [selectedTurf, setSelectedTurf] = useState('5-a-side-turf-a');

  // Use the custom hook to fetch sports
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
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dateOnly < todayOnly;
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const formatSelectedDate = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${selectedDate.getDate()} ${months[selectedDate.getMonth()]}, ${selectedDate.getFullYear()}`;
  };

  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(newMonth);
  };

  const isPreviousMonthDisabled = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    return prevMonth < new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Set default selectedSport once sports loaded
  useEffect(() => {
    if (!selectedSport && sports.length > 0) {
      setSelectedSport(sports[0].name.toLowerCase());
    }
  }, [sports, selectedSport]);

  if (loading) return <p className="p-4">Loading sports...</p>;

  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div
      style={{
        backgroundImage: "url('/home/sheikh/Downloads/111.jpg')",
      }}
    >
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Header with Glassmorphism */}
        <div className="relative backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Book Your Turf
            </h1>
            <p className="text-gray-600 text-lg">Select your sport, time, and start playing!</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 lg:flex lg:gap-6">
          {/* Left Column */}
          <div className="lg:flex-1 space-y-6 mb-6 lg:mb-0">
            {/* Select Sports - Glassmorphism Card */}
            <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Select Sports
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {sports.map((sport) => (
                  <button
                    key={sport.id}
                    onClick={() => setSelectedSport(sport.name.toLowerCase())}
                    className={`relative p-5 rounded-2xl transition-all duration-300 flex flex-col items-center gap-3 group ${
                      selectedSport === sport.name.toLowerCase()
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                        : 'bg-white/50 backdrop-blur-sm border border-white/40 hover:bg-white/70 hover:scale-105 hover:shadow-lg'
                    }`}
                  >
                    <span className="text-4xl">⚽</span>
                    <span
                      className={`font-semibold ${
                        selectedSport === sport.name.toLowerCase() ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {sport.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar - Glassmorphism Card */}
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
                    const isSelected = isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, today);
                    const disabled = isDateDisabled(day);

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
          </div>

          {/* Right Column */}
          <div className="lg:flex-1 space-y-6">
            {/* Select Slot - Glassmorphism Card */}
            <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Select Slot
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
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

            {/* Duration - Glassmorphism Card */}
            <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Select Duration
              </h2>
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => duration > 1 && setDuration(duration - 1)}
                  disabled={duration <= 1}
                  className={`w-14 h-14 rounded-2xl font-bold text-2xl transition-all duration-200 flex items-center justify-center ${
                    duration <= 1
                      ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      : 'bg-white/60 hover:bg-white/80 text-blue-600 hover:shadow-lg hover:scale-110'
                  }`}
                >
                  −
                </button>
                <div className="text-center min-w-[120px] backdrop-blur-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/30 rounded-2xl p-4">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {duration}
                  </div>
                  <div className="text-sm text-gray-600 font-medium mt-1">hour(s)</div>
                </div>
                <button
                  onClick={() => setDuration(duration + 1)}
                  className="w-14 h-14 rounded-2xl bg-white/60 hover:bg-white/80 text-blue-600 font-bold text-2xl transition-all duration-200 flex items-center justify-center hover:shadow-lg hover:scale-110"
                >
                  +
                </button>
              </div>
            </div>

            {/* Select Turf - Glassmorphism Card */}
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

            {/* Pricing Summary - Glassmorphism Card */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20 rounded-3xl shadow-xl p-6">
              <h3 className="font-bold text-xl mb-6 text-gray-800">Booking Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Booking Fee</span>
                  <span className="font-bold text-2xl text-gray-800">₹{bookingFee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Convenience Fee</span>
                  <span className="font-bold text-2xl text-gray-800">₹{convenienceFee}</span>
                </div>
                <div className="border-t border-white/30 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-800">Total Amount</span>
                    <span className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{total}
                    </span>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-lg bg-white/30 border border-white/30 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-600 font-medium">Selected Time</div>
                    <div className="font-bold">{selectedSlot}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-lg">
                PROCEED TO PAY
              </button>
              <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-lg">
                PAY PARTIAL (₹505/-)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
