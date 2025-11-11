import { useState } from 'react';
import { registerUser, verifyOTP } from '../services/api';

export default function PhoneOTPComponent() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOTP] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [message, setMessage] = useState('');

    const handleSendOTP = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            setMessage('Please enter a valid phone number');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await registerUser(phoneNumber);
            setShowOTP(true);
            setMessage('OTP sent successfully!');
            console.log('OTP Response:', response.data);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to send OTP. Please try again.');
            console.error('Send OTP Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length < 4) {
            setMessage('Please enter a valid OTP');
            return;
        }

        setIsVerifying(true);
        setMessage('');

        try {
            const response = await verifyOTP(phoneNumber, otp);
            setMessage('OTP verified successfully!');
            console.log('Verify Response:', response.data);

            // Store user data if returned
            if (response.data?.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            // Redirect or perform next action after successful verification
            // window.location.href = '/dashboard';
        } catch (error) {
            setMessage(error.response?.data?.message || 'Invalid OTP. Please try again.');
            console.error('Verify OTP Error:', error);
        } finally {
            setIsVerifying(false);
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setPhoneNumber(value);
        setMessage('');
    };

    const handleOTPChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setOTP(value);
        setMessage('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                    Phone Verification
                </h2>
                <p className="text-gray-600 text-center mb-8">
                    Enter your phone number to receive an OTP
                </p>

                <div className="space-y-6">
                    {/* Phone Number Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                placeholder="Enter phone number"
                                maxLength="10"
                                disabled={showOTP}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <button
                                onClick={handleSendOTP}
                                disabled={isLoading || showOTP}
                                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {isLoading ? 'Sending...' : showOTP ? 'Sent' : 'Send OTP'}
                            </button>
                        </div>
                    </div>

                    {/* OTP Input - Only shown after sending OTP */}
                    {showOTP && (
                        <div className="animate-fadeIn">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={handleOTPChange}
                                placeholder="Enter 4-6 digit OTP"
                                maxLength="6"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest font-semibold"
                            />

                            <button
                                onClick={handleVerifyOTP}
                                disabled={isVerifying}
                                className="w-full mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isVerifying ? 'Verifying...' : 'Verify OTP'}
                            </button>

                            <button
                                onClick={() => {
                                    setShowOTP(false);
                                    setOTP('');
                                    setPhoneNumber('');
                                    setMessage('');
                                }}
                                className="w-full mt-2 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 transition"
                            >
                                Change Number
                            </button>
                        </div>
                    )}

                    {/* Message Display */}
                    {message && (
                        <div
                            className={`p-4 rounded-lg text-center font-medium ${message.includes('success')
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                        >
                            {message}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}