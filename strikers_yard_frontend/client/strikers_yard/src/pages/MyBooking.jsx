import { useEffect, useState } from "react";
import { fetchMyBookings } from "../services/api";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const res = await fetchMyBookings();
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to load bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-emerald-400" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="relative min-h-screen pt-36">

        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 -z-20 filter blur-[2px]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1744565473172-a3c64b1e1bbb?q=80&w=1051&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center top"
          }}
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10" />

        <div className="py-20 text-center text-emerald-100/80 text-xl">
          You have no bookings yet.
        </div>
      </div>
    );
  }

  const toggleOpen = (id) => setOpenId(openId === id ? null : id);

  return (
    <div className="relative min-h-screen pt-36">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 -z-20 filter blur-[2px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1744565473172-a3c64b1e1bbb?q=80&w=1051&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center top"
        }}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10" />

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-10 text-emerald-200 drop-shadow-lg">
          My Bookings
        </h1>

        <div className="space-y-5">
          {bookings.map((b) => {
            const open = openId === b.booking_id;

            return (
              <div
                key={b.booking_id}
                className="
                  rounded-3xl backdrop-blur-3xl bg-gray-950/20 
                  border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.55)]
                "
              >

                {/* ---- TOP BAR ---- */}
                <button
                  onClick={() => toggleOpen(b.booking_id)}
                  className="
                    w-full flex justify-between items-center 
                    px-6 py-5 text-left transition-all
                    hover:bg-white/5 rounded-3xl
                  "
                >
                  <div>
                    <div className="text-lg font-semibold text-emerald-200">
                      {b.service?.name}
                    </div>
                    <div className="text-sm text-emerald-100/60">
                      {b.date} • {b.time_slot.start_time}
                    </div>
                  </div>

                  {/* STATUS BADGE */}
                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        b.status === "paid"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : b.status === "partial"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-gray-500/20 text-gray-300"
                      }
                    `}
                  >
                    {b.status.toUpperCase()}
                  </span>

                  {/* CHEVRON */}
                  {open ? (
                    <ChevronUp className="ml-3 text-emerald-200" />
                  ) : (
                    <ChevronDown className="ml-3 text-emerald-200" />
                  )}
                </button>

                {/* ---- EXPANDED DETAILS ---- */}
                {open && (
                  <div className="px-6 pb-6 text-emerald-100 animate-fadeIn">
                    <p>
                      <strong className="text-emerald-300">Date:</strong> {b.date}
                    </p>
                    <p>
                      <strong className="text-emerald-300">Time:</strong>{" "}
                      {b.time_slot.start_time} – {b.time_slot.end_time}
                    </p>
                    <p>
                      <strong className="text-emerald-300">Duration:</strong>{" "}
                      {b.duration_hours} hour(s)
                    </p>
                    <p>
                      <strong className="text-emerald-300">Payment ID:</strong>{" "}
                      {b.payment_id || "Not Paid Yet"}
                    </p>
                    <p>
                      <strong className="text-emerald-300">Booking ID:</strong>{" "}
                      {b.booking_id}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Animation */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn .25s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
