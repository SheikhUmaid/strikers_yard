import PhoneOTPComponent from "./Register";
export default function LoginModal({ onClose, onSuccess }) {
  return (

        <PhoneOTPComponent 
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
        />
      
  );
}
