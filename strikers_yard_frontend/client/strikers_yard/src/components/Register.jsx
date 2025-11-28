import { useState } from "react";
import { updateUserDetails, registerUser, verifyOTP } from "../services/api";

export default function PhoneOTPComponent({ onSuccess }) {
  const [isNewUser, setIsNewUser] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState("");

  // SEND OTP
  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setMessage("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await registerUser(phoneNumber);
      setShowOTP(true);
      setMessage("OTP sent successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      setMessage("Please enter a valid OTP");
      return;
    }

    setIsVerifying(true);
    setMessage("");

    try {
      const response = await verifyOTP(phoneNumber, otp);

      if (response.data?.user)
        localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data?.access)
        localStorage.setItem("access_token", response.data.access);

      if (response.data?.refresh)
        localStorage.setItem("refresh_token", response.data.refresh);

      // New user → move to details
      if (response.data?.user?.is_first_login) {
        setIsNewUser(true);
        setShowOTP(false);
        return;
      }

      window.dispatchEvent(new Event("authChanged"));
      onSuccess && onSuccess();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // SUBMIT NEW USER DETAILS
  const handleNewUserSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      setMessage("Please enter name and email");
      return;
    }

    setIsVerifying(true);

    try {
      const res = await updateUserDetails({ name, email });

      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      window.dispatchEvent(new Event("authChanged"));
      onSuccess && onSuccess();
    } catch {
      setMessage("Could not save details, try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div
        className="
          w-full max-w-md rounded-3xl p-8 
          backdrop-blur-3xl bg-gray-950/20 
          border border-white/15 
          shadow-[0_24px_80px_rgba(0,0,0,0.7)]
          animate-fadeIn
        "
      >
        {/* TITLE */}
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          {isNewUser ? "Complete Your Profile" : "Phone Verification"}
        </h2>

        <p className="text-emerald-100/80 text-center mb-8">
          {isNewUser
            ? "You're almost done! Add your name and email"
            : "Enter your phone number to receive an OTP"}
        </p>

        {/* ------------------------------
            STEP 1: PHONE + OTP
        -------------------------------- */}
        {!isNewUser && (
          <div className="space-y-6">

            {/* PHONE INPUT */}
            <div>
              <label className="text-sm font-medium text-emerald-200 mb-2 block">
                Phone Number
              </label>

              {/* Responsive input + button */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  disabled={showOTP}
                  maxLength={10}
                  placeholder="Enter phone number"
                  className="
                    flex-1 px-4 py-3 rounded-xl text-white 
                    bg-white/5 border border-white/10 
                    placeholder-emerald-200/40
                    focus:ring-2 focus:ring-emerald-400
                  "
                />

                <button
                  onClick={handleSendOTP}
                  disabled={isLoading || showOTP}
                  className="
                    w-full sm:w-auto px-6 py-3 rounded-xl font-bold
                    text-emerald-900 bg-gradient-to-r from-emerald-400 to-lime-300
                    disabled:opacity-40 disabled:cursor-not-allowed
                  "
                >
                  {isLoading ? "Sending..." : showOTP ? "Sent" : "Send OTP"}
                </button>
              </div>
            </div>

            {/* OTP FIELD */}
            {showOTP && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-emerald-200 mb-2">
                  Enter OTP
                </label>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className="
                    w-full px-4 py-3 rounded-xl text-center text-2xl text-white
                    bg-white/5 border border-white/10
                    focus:ring-2 focus:ring-emerald-400
                    placeholder-emerald-200/40
                  "
                  placeholder="Enter OTP"
                />

                <button
                  onClick={handleVerifyOTP}
                  disabled={isVerifying}
                  className="
                    w-full mt-4 py-3 rounded-xl font-bold text-emerald-900
                    bg-gradient-to-r from-emerald-400 to-lime-300
                    disabled:opacity-40
                  "
                >
                  {isVerifying ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                  onClick={() => {
                    setShowOTP(false);
                    setOTP("");
                    setPhoneNumber("");
                    setMessage("");
                  }}
                  className="
                    w-full mt-3 py-3 rounded-xl text-emerald-200
                    bg-white/5 border border-white/10 hover:bg-white/10
                  "
                >
                  Change Number
                </button>
              </div>
            )}
          </div>
        )}

        {/* -------------------------
            STEP 2: NEW USER DETAILS
        -------------------------- */}
        {isNewUser && (
          <div className="space-y-6 animate-fadeIn">

            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-emerald-200 mb-2">
                Full Name
              </label>
              <input
                className="
                  w-full px-4 py-3 bg-white/5 border border-white/10
                  rounded-xl text-white placeholder-emerald-200/40
                "
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-emerald-200 mb-2">
                Email Address
              </label>
              <input
                className="
                  w-full px-4 py-3 bg-white/5 border border-white/10
                  rounded-xl text-white placeholder-emerald-200/40
                "
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={handleNewUserSubmit}
              disabled={isVerifying}
              className="
                w-full py-3 rounded-xl font-bold 
                text-emerald-900 bg-gradient-to-r from-emerald-400 to-lime-300
                disabled:opacity-40
              "
            >
              {isVerifying ? "Saving..." : "Continue"}
            </button>
          </div>
        )}

        {/* MESSAGE */}
        {message && (
          <p
            className={`
              mt-5 p-3 rounded-xl text-center text-sm
              ${
                message.includes("success")
                  ? "bg-emerald-500/20 text-emerald-200"
                  : "bg-red-500/20 text-red-200"
              }
            `}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
