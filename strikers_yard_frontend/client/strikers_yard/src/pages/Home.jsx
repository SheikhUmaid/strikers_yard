import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { useEffect, useState } from 'react';

const images = [
  "https://images.unsplash.com/photo-1744565473172-a3c64b1e1bbb?q=80&w=1051&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1725972006441-6fd5ec6d6ef3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1603477213680-b562a3445e10?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1501127152955-b1efb91ef012?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

export default function Home() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-[Montserrat]">
      {/* Hero background carousel */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={images[current]}
          alt="Turf background"
          className="w-full h-full object-cover object-center"
          style={{ maxHeight: '100vh' }}
        />
        <div className="absolute inset-0 bg-linear-to-tr from-black/20 via-green-800/20 to-blue-900/40 backdrop-blur-sm" />
      </div>
      {/* Main glass hero and call-to-action, center both axes */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-20">
          <h1 className="text-white text-5xl font-black mb-6 text-center drop-shadow-xl">
            BRING YOUR GAME ON!
          </h1>
          <div className="text-white text-lg mb-6 font-medium text-center" style={{ textShadow: "0 2px 8px rgba(50,205,50,0.13)" }}>
            Book football turfs easily & instantly. <br />
            Discover local grounds and reserve your spot.
          </div>
          <button
            className="mt-2 bg-green-400 hover:bg-green-300 text-black font-bold px-8 py-4 rounded-full shadow-xl transition transform hover:-translate-y-1"
            onClick={() => navigate('/booking')}
          >
            <AiOutlineArrowRight className="text-2xl inline-block mr-2 align-middle" />
            Book Now
          </button>
        
      </div>
      {/* Carousel dots with glass effect */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-4 h-4 rounded-full border-2 ${current === idx ? 'bg-green-400 border-white' : 'bg-white/20 border-green-300'} shadow-lg backdrop-blur-lg transition`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
