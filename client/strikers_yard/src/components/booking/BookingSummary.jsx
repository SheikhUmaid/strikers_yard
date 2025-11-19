import { Clock } from 'lucide-react';

export default function BookingSummary({
  selectedSportObj,    // Pass entire selected sport object from API { id, name, price_per_hour }
  convenienceFee = 20, // Fixed fee
  selectedSlot,        // Pass actual slot object { start_time, end_time, ... }
  duration = 1
}) {
  // Fallback value if not loaded
  const bookingFee = selectedSportObj
    ? parseInt(selectedSportObj.price_per_hour, 10) * duration
    : 0;
  const total = bookingFee + convenienceFee;

  // Format slot time for display (if slot chosen), else show message
  const formatTime = (timeStr) => {
    if (!timeStr) return 'NA';
    const [hours, minutes] = timeStr.split(':');
    let hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    hourNum = hourNum % 12 || 12;
    return `${hourNum}:${minutes} ${ampm}`;
  };

  return (
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
            <span className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">₹{total}</span>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-lg bg-white/30 border border-white/30 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-3 text-gray-700">
          <Clock className="w-5 h-5 text-blue-600" />
          <div>
            <div className="text-xs text-gray-600 font-medium">Selected Time</div>
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
