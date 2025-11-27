import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useSports } from '../hooks/UseSports';
import { fetchSlots, createBooking, verifyPayment } from '../services/api';
import SportSelector from '../components/booking/SportSelector';
import Calendar from '../components/booking/Calendar';
import DurationSelector from '../components/booking/DurationSelector';
import TurfSelector from '../components/booking/TurfSelector';
import BookingSummary from '../components/booking/BookingSummary';
import { isLoggedIn } from '../services/is_logged_in';
import PhoneOTPComponent from "../components/Register";
import toast from "react-hot-toast";

const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Razorpay SDK failed to load.'));
    document.body.appendChild(script);
  });
};

export default function SportsBooking() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [duration, setDuration] = useState(1);
  const [selectedTurf, setSelectedTurf] = useState();
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const { sports, loading, error } = useSports();
  const [login, setLogin] = useState(isLoggedIn());

  const turfs = [
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

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const formatSelectedDate = () => {
    const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${selectedDate.getDate()} ${m[selectedDate.getMonth()]}, ${selectedDate.getFullYear()}`;
  };

  const goToPreviousMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const goToNextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

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
    const handler = () => setLogin(isLoggedIn());
    window.addEventListener("authChanged", handler);
    return () => window.removeEventListener("authChanged", handler);
  }, []);

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
        let slots = res.data.slots;
        setAvailableSlots(slots);
        setSelectedSlot(null);
      })
      .catch(err => {
        console.error('Failed to fetch slots:', err);
        setAvailableSlots([]);
        setSelectedSlot(null);
      });
  }, [selectedSport, selectedDate, sports]);

  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(':');
    let hourNum = parseInt(h, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    hourNum = hourNum % 12 || 12;
    return `${hourNum}:${m} ${ampm}`;
  };

  const getMaxDuration = (slotId = selectedSlot) => {
    if (!slotId) return 1;
    const index = availableSlots.findIndex(s => s.id === slotId);
    if (index === -1) return 1;

    let max = 1;
    for (let i = index + 1; i < availableSlots.length; i++) {
      const prev = availableSlots[i - 1];
      const next = availableSlots[i];
      if (next.is_taken) break;
      if (prev.end_time !== next.start_time) break;
      max++;
    }
    return max;
  };

  const handleBooking = async (partial = false) => {
    if (!selectedSport || !selectedSlot || !selectedDate) {
      toast.error("Please select sport, slot, and date before proceeding.");
      return;
    }

    const serviceObj = sports.find(s => s.name.toLowerCase() === selectedSport);

    const utcDate = new Date(
      selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
    );
    const dateStr = utcDate.toISOString().split("T")[0];

    const bookingData = {
      service: serviceObj.id,
      time_slot: selectedSlot,
      date: dateStr,
      duration_hours: duration,
      is_partial_payment: partial,
    };

    setIsProcessingPayment(true);

    try {
      const bookingResponse = await createBooking(bookingData);
      const { booking_id, razorpay_order_id, razorpay_key_id, amount } =
        bookingResponse.data || {};

      await loadRazorpayScript();

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      const options = {
        key: razorpay_key_id,
        amount,
        currency: "INR",
        name: "Strikers Yard",
        order_id: razorpay_order_id,
        prefill: {
          name: storedUser?.name,
          contact: storedUser?.phone_number,
        },
        handler: async (response) => {
          await verifyPayment({
            razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            is_partial_payment: partial,
          });
          toast.success("Payment verified!");
          window.location.href = "/My-bookings";
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-[Montserrat] pt-32">

      {/* BLURRED BACKGROUND */}
      <div
        className="absolute inset-0 -z-20 filter blur-[2px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1744565473172-a3c64b1e1bbb?q=80&w=1051&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top'
        }}
      />

      {/* DIM LAYER */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10" />

      <div className="max-w-7xl mx-auto p-6 lg:flex lg:gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:flex-1 space-y-6">

          <SportSelector
            sports={sports}
            selectedSport={selectedSport}
            onSelectSport={setSelectedSport}
          />

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

        {/* RIGHT COLUMN */}
        <div className="lg:flex-1 space-y-6">

          {/* SLOT SELECTOR */}
          <div className="
            rounded-3xl backdrop-blur-3xl bg-gray-950/10 
            border border-white/15 shadow-[0_24px_80px_rgba(0,0,0,0.55)]
            p-7
          ">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-300 to-lime-300 rounded-full" />
              Select Slot
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {availableSlots.length === 0 ? (
                <p className="text-emerald-100/70">No slots available.</p>
              ) : (
                availableSlots.map((slot) => {
                  const slotText = `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`;
                  const isSelected = selectedSlot === slot.id;

                  return (
                    <button
                      key={slot.id}
                      disabled={slot.is_taken}
                      onClick={() => {
                        const max = getMaxDuration(slot.id);
                        setSelectedSlot(slot.id);
                        if (duration > max) setDuration(1);
                      }}
                      className={`
                        relative p-4 rounded-xl text-sm font-semibold transition-all duration-300
                        ${
                          slot.is_taken
                            ? 'bg-white/5 text-emerald-200/40 cursor-not-allowed'
                            : isSelected
                            ? 'bg-gradient-to-br from-emerald-400 to-lime-300 text-emerald-900 shadow-lg scale-110'
                            : 'bg-white/5 text-emerald-50 hover:bg-white/15 hover:scale-105 hover:shadow-md'
                        }
                      `}
                    >
                      {slotText}

                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* DURATION */}
          <DurationSelector
            duration={duration}
            setDuration={setDuration}
            getMaxDuration={getMaxDuration}
            selectedSlot={selectedSlot}
          />

          {/* TURF SELECTOR */}
          <div className="
            rounded-3xl backdrop-blur-3xl bg-gray-950/10 
            border border-white/15 shadow-[0_24px_80px_rgba(0,0,0,0.55)]
            p-7
          ">
            <TurfSelector
              turfs={turfs}
              selectedTurf={selectedTurf}
              setSelectedTurf={setSelectedTurf}
            />
          </div>

          {/* BOOKING SUMMARY */}
          <div >
            <BookingSummary
              selectedSportObj={sports.find(s => s.name.toLowerCase() === selectedSport)}
              convenienceFee={convenienceFee}
              total={total}
              selectedSlot={availableSlots.find(s => s.id === selectedSlot)}
              duration={duration}
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="
            rounded-3xl backdrop-blur-3xl bg-gray-950/10 
            border border-white/15 shadow-[0_24px_80px_rgba(0,0,0,0.55)]
            p-7 space-y-4
          ">
            {login ? (
              <>
                <button
                  onClick={() => handleBooking(false)}
                  disabled={isProcessingPayment}
                  className="
                    w-full bg-gradient-to-r from-emerald-400 to-lime-300
                    text-emerald-900 font-bold py-5 rounded-2xl shadow-xl
                    transition-all duration-300 hover:shadow-2xl hover:scale-105 
                    active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {isProcessingPayment ? 'Processing...' : 'PROCEED TO PAY'}
                </button>

                <button
                  onClick={() => handleBooking(true)}
                  disabled={isProcessingPayment}
                  className="
                    w-full bg-gradient-to-r from-amber-500 to-orange-400
                    text-white font-bold py-5 rounded-2xl shadow-xl
                    transition-all duration-300 hover:shadow-2xl hover:scale-105 
                    active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {isProcessingPayment ? 'Processing...' : 'PAY PARTIAL'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setOverlay(true)}
                disabled={isProcessingPayment}
                className="
                  w-full bg-gradient-to-r from-emerald-400 to-lime-300
                  text-emerald-900 font-bold py-5 rounded-2xl shadow-xl
                  transition-all duration-300 hover:shadow-2xl hover:scale-105 
                  active:scale-95
                "
              >
                Login to Continue
              </button>
            )}

            {overlay && (
              <PhoneOTPComponent
                onSuccess={() => {
                  setLogin(true);
                  setOverlay(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
