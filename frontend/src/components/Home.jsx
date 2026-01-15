import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <div key={interval} className="flex flex-col items-center mx-4">
        <span className="text-3xl md:text-5xl font-bold font-serif">{timeLeft[interval]}</span>
        <span className="text-xs md:text-sm uppercase tracking-widest mt-1">{interval}</span>
      </div>
    );
  });

  return (
    <div className="flex justify-center mt-8 text-white animate-fade-in-up">
      {timerComponents.length ? timerComponents : <span>Time's up!</span>}
    </div>
  );
};

const Home = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
        <p className="text-sm md:text-lg uppercase tracking-[0.3em] mb-4 animate-fade-in-down">
          We are getting married
        </p>
        <h1 className="text-5xl md:text-8xl font-serif font-bold mb-6 animate-fade-in">
          Ajay & Vandana
        </h1>
        <p className="text-xl md:text-2xl font-light italic mb-8 animate-fade-in-up">
          March 11, 2026
        </p>
        
        <CountdownTimer targetDate="2026-03-11T00:00:00" />
      </div>
    </div>
  );
};

export default Home;
