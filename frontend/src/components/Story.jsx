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
    description: 'Vandana planned an elaborate surprise with all of Ajay\'s friends. She got down on one knee, and Ajay pretended to be shocked... even though he had already said \'Yes\' three months ago. Good acting, Ajay.',
    images: ['/moments/proposal_1.jpeg', '/moments/proposal_2.jpeg', '/moments/proposal_3.jpeg', '/moments/proposal_4.jpeg']
  }
];

const Lightbox = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20 z-50"
      >
        <X size={32} />
      </button>

      {images.length > 1 && (
        <>
          <button 
            onClick={prevImage}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50"
          >
            <ChevronLeft size={40} />
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50"
          >
            <ChevronRight size={40} />
          </button>
        </>
      )}

      <motion.img 
        key={currentIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        src={images[currentIndex]} 
        alt="Full screen view" 
        className="max-h-screen max-w-screen object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-white w-4' : 'bg-white/30'
              }`}
            />
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

  const nextImage = (e) => {
    e.stopPropagation();
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % event.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + event.images.length) % event.images.length);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <>
      <div className={`mb-12 flex flex-col md:flex-row md:justify-between md:items-center w-full ${isLeft ? 'md:flex-row-reverse' : ''}`}>
        <div className="hidden md:block w-5/12"></div>
        
        <div className="z-20 flex items-center order-1 bg-wedding-primary shadow-xl w-10 h-10 rounded-full border-4 border-white absolute left-4 md:static md:left-auto transform -translate-x-1/2 md:translate-x-0">
          <Heart className="w-5 h-5 text-white mx-auto fill-current" />
        </div>
        
        <div className={`order-1 bg-white rounded-2xl shadow-xl w-full md:w-5/12 p-6 transition-transform hover:scale-[1.02] duration-300 ml-12 md:ml-0 ${isLeft ? 'md:animate-fade-in-right' : 'md:animate-fade-in-left'}`}>
          <span className="font-serif text-wedding-primary font-bold text-lg block mb-1">{event.date}</span>
          <h3 className="mb-3 font-bold text-gray-800 text-2xl font-serif">{event.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {event.description}
          </p>
          
          {event.images.length > 0 && (
            <div 
              className="relative group aspect-[4/3] rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 bg-gray-100 cursor-pointer"
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
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute w-full h-full object-cover"
                  alt={`${event.title} - ${activeIndex + 1}`}
                />
              </AnimatePresence>

              {/* Expand Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLightbox(true);
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/40 z-20"
              >
                <Maximize2 size={16} />
              </button>

              {/* Navigation Controls */}
              {event.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/50 hover:scale-110 z-10 shadow-lg"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/50 hover:scale-110 z-10 shadow-lg"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
                    {event.images.map((_, idx) => (
                      <div 
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                          idx === activeIndex ? 'bg-white w-3' : 'bg-white/50'
                        }`}
                      />
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
          <Lightbox 
            images={event.images}
            initialIndex={activeIndex}
            onClose={() => setShowLightbox(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const Story = () => {
  return (
    <div className="min-h-screen bg-wedding-secondary py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-4">Our Story</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Every love story is beautiful, but ours is my favorite. Here are some of the moments that led us to forever.
          </p>
        </div>

        <div className="relative wrap overflow-hidden p-4 md:p-10 h-full">
          {/* Vertical Timeline Line */}
          <div className="border-2-2 absolute border-opacity-20 border-wedding-primary h-full border left-4 md:left-1/2 top-0"></div>

          {storyEvents.map((event, index) => (
            <StoryCard key={index} event={event} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Story;
