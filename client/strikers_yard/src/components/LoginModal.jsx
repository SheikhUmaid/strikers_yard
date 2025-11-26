import PhoneOTPComponent from "./Register";
export default function LoginModal({ onClose, onSuccess }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[999]">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-[90%] max-w-md">
        <PhoneOTPComponent 
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
        />
      </div>
    </div>
  );
}
