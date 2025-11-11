import { useState } from 'react'
import PhoneOTPComponent from "./components/Register"
import SportsBooking from './components/Bookings'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <PhoneOTPComponent/>
       */}

       <SportsBooking/>
    </>
  )
}

export default App
