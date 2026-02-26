import React, { useState, useEffect, useRef } from 'react';

// Floating bokeh particles
const BokehCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.4 + 0.05,
      gold: Math.random() > 0.6,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(212,175,55,${p.alpha})`
          : `rgba(201,132,122,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none"
    />
  );
};

// Animated countdown
const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return {};
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const entries = Object.entries(timeLeft);

  return (
    <div className="flex justify-center mt-12 gap-3 md:gap-5 animate-fade-in-up delay-500 opacity-0-init">
      {entries.length ? (
        entries.map(([label, value]) => (
          <div key={label} className="flex flex-col items-center">
            <div className="glass-card px-4 md:px-6 py-3 md:py-5 min-w-[64px] md:min-w-[90px] text-center border border-wedding-primary/20">
              <span className="block font-serif text-3xl md:text-5xl font-light text-wedding-primary leading-none">
                {String(value).padStart(2, '0')}
              </span>
            </div>
            <span className="mt-2 text-[10px] uppercase tracking-[0.25em] text-wedding-blush/50 font-sans">
              {label}
            </span>
          </div>
        ))
      ) : (
        <span className="font-serif text-2xl text-wedding-primary italic">
          The day has arrived ✦
        </span>
      )}
    </div>
  );
};

const Home = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-wedding-dark">
      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/moments/background_final.jpeg')" }}
      >
        {/* Multi-layer dark overlays for drama */}
        <div className="absolute inset-0 bg-gradient-to-b from-wedding-dark/70 via-wedding-dark/30 to-wedding-dark/80" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Bokeh particles */}
      <BokehCanvas />

      {/* Hero content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-6">
        {/* Decorative top ornament */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in-down opacity-0-init">
          <div className="divider-gold w-16 opacity-60" />
          <span className="text-wedding-primary text-xs tracking-[0.4em] uppercase font-sans">
            Joyfully invite you
          </span>
          <div className="divider-gold w-16 opacity-60" />
        </div>

        {/* Tagline */}
        <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-wedding-blush/60 mb-6 animate-fade-in opacity-0-init delay-100 font-sans">
          Together with their families
        </p>

        {/* Names — the hero moment */}
        <h1 className="font-script text-6xl sm:text-7xl md:text-9xl text-gold-shimmer mb-4 animate-fade-in opacity-0-init delay-200 leading-none">
          Vandana &amp; Ajay
        </h1>

        {/* Date */}
        <p className="font-serif text-lg md:text-2xl font-light tracking-widest text-wedding-blush/80 mb-2 animate-fade-in opacity-0-init delay-300 italic">
          March 11, 2026
        </p>
        <p className="text-xs uppercase tracking-[0.4em] text-wedding-primary/70 font-sans animate-fade-in opacity-0-init delay-400">
          Happy Retreats — KAI, Bangalore
        </p>

        {/* Divider */}
        <div className="divider-gold w-24 mx-auto mt-8 mb-2 opacity-50 animate-fade-in opacity-0-init delay-400" />

        {/* Countdown */}
        <CountdownTimer targetDate="2026-03-11T00:00:00" />
      </div>

      {/* Bottom scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-float">
        <span className="text-[10px] uppercase tracking-[0.3em] text-wedding-blush/30 font-sans">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-wedding-primary/50 to-transparent" />
      </div>
    </div>
  );
};

export default Home;
