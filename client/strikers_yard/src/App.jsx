import { useState } from "react";
import SportsBooking from "./components/booking/SportsBooking";
import PhoneOTPComponent from "./components/Register";
import { Toaster } from "react-hot-toast";
function App() {
 

  return (

    // <>
    // {/* <PhoneOTPComponent/> */}
    // </>
    
    <>
      <Toaster position="top-center" />
    {/* // <PhoneOTPComponent /> */}
<SportsBooking/>
    </>
  );
}

export default App;
