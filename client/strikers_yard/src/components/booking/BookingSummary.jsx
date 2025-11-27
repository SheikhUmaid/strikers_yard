import { Clock } from 'lucide-react';

export default function BookingSummary({
  selectedSportObj,
  convenienceFee = 20,
  selectedSlot,
  duration = 1
}) {
  const bookingFee = selectedSportObj
    ? parseInt(selectedSportObj.price_per_hour, 10) * duration
    : 0;

  const total = bookingFee + convenienceFee;

  const formatTime = (timeStr) => {
    if (!timeStr) return 'NA';
    const [hours, minutes] = timeStr.split(':');
    let hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    hourNum = hourNum % 12 || 12;
    return `${hourNum}:${minutes} ${ampm}`;
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
      <h3 className="font-semibold text-xl mb-6 text-emerald-50">
        Booking Summary
      </h3>

      {/* Price Details */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-emerald-100/80 font-medium">Booking Fee</span>
          <span className="font-bold text-2xl text-emerald-50">
            ₹{bookingFee - 20}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-emerald-100/80 font-medium">Convenience Fee</span>
          <span className="font-bold text-2xl text-emerald-50">
            ₹{convenienceFee}
          </span>
        </div>

        <div className="border-t border-white/20 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-emerald-50">
              Total Amount
            </span>
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-lime-200 bg-clip-text text-transparent">
              ₹{total - 20}
            </span>
          </div>
        </div>
      </div>

      {/* Selected Time */}
      <div
        className="
          rounded-2xl 
          border border-white/20 
          bg-white/10 
          backdrop-blur-xl 
          p-4
        "
      >
        <div className="flex items-center gap-3 text-emerald-50">
          <Clock className="w-5 h-5 text-emerald-300" />

          <div>
            <div className="text-xs text-emerald-100/60 font-medium">
              Selected Time
            </div>

            <div className="font-bold">
              {selectedSlot
                ? `${formatTime(selectedSlot.start_time)} - ${formatTime(selectedSlot.end_time)}`
                : 'No slot selected'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
