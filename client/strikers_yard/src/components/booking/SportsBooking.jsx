import { useState, useEffect } from 'react';
import { Clock, MapPin, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useSports } from '../../hooks/useSports'; 
import { fetchSlots, createBooking } from '../../services/api'; 
import SportSelector from './SportSelector';
import Calendar from './Calendar';
import DurationSelector from './DurationSelector';
import TurfSelector from './TurfSelector';
import BookingSummary from './BookingSummary';
import ActionButtons from './ActionButtons';

export default function SportsBooking() {
  const today = new Date(2025, 10, 11);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10, 1));
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [duration, setDuration] = useState(1);
  const [selectedTurf, setSelectedTurf] = useState('5-a-side-turf-a');
  const [availableSlots, setAvailableSlots] = useState([]);

  const { sports, loading, error } = useSports();

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
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${selectedDate.getDate()} ${monthsShort[selectedDate.getMonth()]}, ${selectedDate.getFullYear()}`;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isPreviousMonthDisabled = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    return prevMonth < new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthsLong = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  useEffect(() => {
    if (!selectedSport && sports.length > 0) {
      setSelectedSport(sports[0].name.toLowerCase());
    }
  }, [sports, selectedSport]);

  useEffect(() => {
    if (!selectedSport || !selectedDate || sports.length === 0) return;

    const service = sports.find(s => s.name.toLowerCase() === selectedSport);
    if (!service) return;

    const utcDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
    const dateStr = utcDate.toISOString().split('T')[0];

    fetchSlots(dateStr, service.id)
      .then(res => {
        setAvailableSlots(res.data.slots);
        setSelectedSlot(null);
      })
      .catch(err => {
        console.error('Failed to fetch slots:', err);
        setAvailableSlots([]);
        setSelectedSlot(null);
      });
  }, [selectedSport, selectedDate, sports]);

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    let hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    hourNum = hourNum % 12 || 12;
    return `${hourNum}:${minutes} ${ampm}`;
  };

  const handleBooking = async (partial = false) => {
    if (!selectedSport || !selectedSlot || !selectedDate) {
      alert("Please select sport, slot, and date before proceeding.");
      return;
    }

    const serviceObj = sports.find(s => s.name.toLowerCase() === selectedSport);
    if (!serviceObj) {
      alert("Selected sport invalid.");
      return;
    }

    const utcDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
    const dateStr = utcDate.toISOString().split('T')[0];

    const bookingData = {
      service: serviceObj.id,
      time_slot: selectedSlot,
      date: dateStr,
      hours: duration,
    };

    try {
      await createBooking(bookingData);
      alert(partial ? "Partial payment initiated." : "Booking successful.");
      // handle UI update or redirect
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    }
  };

  if (loading) return <p className="p-4">Loading sports...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div style={{ backgroundImage: "url('/home/sheikh/Downloads/111.jpg')" }}>
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="relative backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Book Your Turf
            </h1>
            <p className="text-gray-600 text-lg">Select your sport, time, and start playing!</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 lg:flex lg:gap-6">
          <div className="lg:flex-1 space-y-6 mb-6 lg:mb-0">
            <SportSelector sports={sports} selectedSport={selectedSport} onSelectSport={setSelectedSport} />
            <Calendar
              currentMonth={currentMonth}
              goToPreviousMonth={goToPreviousMonth}
              goToNextMonth={goToNextMonth}
              isPreviousMonthDisabled={isPreviousMonthDisabled}
              days={days}
              weekDays={weekDays}
              months={monthsLong}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              isDateDisabled={isDateDisabled}
              isSameDay={isSameDay}
              today={today}
              formatSelectedDate={formatSelectedDate}
            />
          </div>

          <div className="lg:flex-1 space-y-6">
            <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Select Slot
              </h2>
              <div className="grid grid-cols-2 gap-3 relative">
                {availableSlots.length === 0 ? (
                  <p className="text-gray-500">No slots available for selected date and sport.</p>
                ) : (
                  availableSlots.map(slot => {
                    const slotText = `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`;
                    return (
                      <button
                        key={slot.id}
                        disabled={slot.is_taken}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`relative p-4 rounded-xl transition-all duration-300 text-sm font-semibold ${
                          selectedSlot === slot.id
                            ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                            : slot.is_taken
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-white/50 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white/70 hover:scale-105 hover:shadow-md'
                        }`}
                      >
                        {slotText}
                        {selectedSlot === slot.id && (
                          <div className="absolute top-2 right-2 bg-white/30 backdrop-blur-sm rounded-full p-0.5">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            <DurationSelector duration={duration} setDuration={setDuration} />
            <TurfSelector turfs={turfs} selectedTurf={selectedTurf} setSelectedTurf={setSelectedTurf} />
            <BookingSummary selectedSportObj={sports.find(s => s.name.toLowerCase() === selectedSport)} convenienceFee={convenienceFee} total={total} selectedSlot={availableSlots.find(slot => slot.id === selectedSlot)} duration={duration} />
            <div className="space-y-4">
              <button
                onClick={() => handleBooking(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-lg"
              >
                PROCEED TO PAY
              </button>
              <button
                onClick={() => handleBooking(true)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-lg"
              >
                PAY PARTIAL (₹505/-)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
