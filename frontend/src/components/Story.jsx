import React, { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const storyEvents = [
  {
    title: 'The First Hello',
    date: 'March 11, 2025',
    description: 'It all started with a simple message that sparked a conversation lasting all night. We realized quickly that we shared more than just a sense of humor.',
    images: ['/moments/first_message.jpeg']
  },
  {
    title: 'First Date',
    date: 'March 21, 2025',
    description: 'Ironhill, Bangalore. There were professional dancers performing with fire, but honestly? Our moves on the dance floor were the real safety hazard.',
    images: ['/moments/first_date_1.jpeg']
  },
  {
    title: 'First Trip Together',
    date: 'April 26, 2025',
    description: 'Went to the mountains for the view, stayed for the coffee. We realized that sipping brew on a hilltop is basically peak romance (until the mosquitoes come out).',
    images: ['/moments/first_trip_1.jpeg', '/moments/first_trip_2.jpeg']
  },
  {
    title: 'Families Meet',
    date: 'August 15, 2025',
    description: 'The Great Summit. We put our parents in a room, held our breath, and waited for fireworks. Spoiler: They actually liked each other. Crisis averted.',
    images: ['/moments/families_meet_1.jpeg']
  },
  {
    title: 'The Proposal',
    date: 'September 11, 2025',
    description: "Vandana planned an elaborate surprise with all of Ajay's friends. She got down on one knee, and Ajay pretended to be shocked... even though he had already said 'Yes' three months ago. Good acting, Ajay.",
    images: ['/moments/proposal_1.jpeg', '/moments/proposal_2.jpeg', '/moments/proposal_3.jpeg', '/moments/proposal_4.jpeg']
  }
];

const Lightbox = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const next = (e) => { e.stopPropagation(); setCurrentIndex((p) => (p + 1) % images.length); };
  const prev = (e) => { e.stopPropagation(); setCurrentIndex((p) => (p - 1 + images.length) % images.length); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-wedding-blush/60 hover:text-wedding-primary transition-colors p-2 rounded-full bg-white/5 hover:bg-white/10 z-50"
      >
        <X size={28} />
      </button>

      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/15 text-wedding-blush transition-all z-50 border border-white/10">
            <ChevronLeft size={32} />
          </button>
          <button onClick={next} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/15 text-wedding-blush transition-all z-50 border border-white/10">
            <ChevronRight size={32} />
          </button>
        </>
      )}

      <motion.img
        key={currentIndex}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        src={images[currentIndex]}
        alt="Full screen"
        className="max-h-screen max-w-full object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, idx) => (
            <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-wedding-primary w-6' : 'bg-white/20 w-2'}`} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const StoryCard = ({ event, index }) => {
  const isLeft = index % 2 === 0;
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [direction, setDirection] = useState(0);

  const nextImage = (e) => { e.stopPropagation(); setDirection(1); setActiveIndex((p) => (p + 1) % event.images.length); };
  const prevImage = (e) => { e.stopPropagation(); setDirection(-1); setActiveIndex((p) => (p - 1 + event.images.length) % event.images.length); };

  const variants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (d) => ({ zIndex: 0, x: d < 0 ? '100%' : '-100%', opacity: 0 }),
  };

  return (
    <>
      <div className={`mb-16 flex flex-col md:flex-row md:justify-between md:items-start w-full gap-8 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
        {/* Hidden spacer */}
        <div className="hidden md:block w-5/12" />

        {/* Timeline dot (desktop) */}
        <div className="z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-wedding-secondary border-2 border-wedding-primary flex-shrink-0 mt-2">
          <Heart className="w-4 h-4 text-wedding-primary fill-current" />
        </div>

        {/* Card */}
        <div className={`glass-card rounded-none w-full md:w-5/12 p-8 transition-transform duration-500 hover:-translate-y-1 ml-8 md:ml-0 ${isLeft ? '' : ''}`}>
          {/* Mobile dot */}
          <div className="flex items-center gap-3 mb-5 md:hidden">
            <div className="w-7 h-7 rounded-full bg-wedding-secondary border border-wedding-primary flex items-center justify-center">
              <Heart className="w-3 h-3 text-wedding-primary fill-current" />
            </div>
            <div className="divider-gold flex-1 opacity-30" />
          </div>

          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-wedding-primary/80 block mb-2">
            {event.date}
          </span>
          <h3 className="font-serif text-2xl md:text-3xl font-light text-wedding-blush mb-4 leading-snug">
            {event.title}
          </h3>
          <div className="divider-gold w-12 mb-4 opacity-40" />
          <p className="font-sans text-sm leading-loose text-wedding-blush/60 mb-6">
            {event.description}
          </p>

          {event.images.length > 0 && (
            <div
              className="relative group aspect-[4/3] overflow-hidden cursor-pointer bg-wedding-dark/50"
              onClick={() => setShowLightbox(true)}
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.img
                  key={activeIndex}
                  src={event.images[activeIndex]}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                  className="absolute w-full h-full object-cover"
                  alt={`${event.title} - ${activeIndex + 1}`}
                />
              </AnimatePresence>

              {/* Gold overlay on hover */}
              <div className="absolute inset-0 bg-wedding-primary/0 group-hover:bg-wedding-primary/5 transition-colors duration-300 z-10" />

              <button
                onClick={(e) => { e.stopPropagation(); setShowLightbox(true); }}
                className="absolute top-3 right-3 p-1.5 bg-black/40 backdrop-blur-sm text-wedding-blush/70 opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:text-wedding-primary"
              >
                <Maximize2 size={14} />
              </button>

              {event.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-black/50">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-black/50">
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
                    {event.images.map((_, idx) => (
                      <div key={idx} className={`h-0.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-wedding-primary w-5' : 'bg-white/30 w-2'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showLightbox && (
          <Lightbox images={event.images} initialIndex={activeIndex} onClose={() => setShowLightbox(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

const Story = () => {
  return (
    <div className="min-h-screen bg-wedding-dark py-28 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-wedding-primary/60 mb-6">
            How it began
          </p>
          <h2 className="font-serif text-5xl md:text-7xl font-light text-wedding-blush mb-6 leading-none">
            Our Story
          </h2>
          <div className="divider-gold w-24 mx-auto mb-6 opacity-50" />
          <p className="font-sans text-sm text-wedding-blush/50 max-w-xl mx-auto leading-relaxed">
            Every love story is beautiful, but ours is our favourite. Here are some of the moments that led us to forever.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical timeline line (desktop only) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-wedding-primary/30 to-transparent -translate-x-1/2" />

          {storyEvents.map((event, index) => (
            <StoryCard key={index} event={event} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Story;
