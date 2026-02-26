import React, { useState } from 'react';
import axios from 'axios';
import { Check, Loader2 } from 'lucide-react';

const FloatingInput = ({ id, name, type = 'text', value, onChange, label, required, min, max }) => (
  <div className="relative pt-5">
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      max={max}
      placeholder=" "
      className="peer w-full bg-transparent border-b border-wedding-border text-wedding-blush text-sm py-2.5 focus:outline-none focus:border-wedding-primary transition-colors placeholder-transparent"
    />
    <label
      htmlFor={id}
      className="absolute left-0 top-0 text-[11px] uppercase tracking-[0.2em] text-wedding-primary/60 font-sans transition-all peer-placeholder-shown:top-7 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-wedding-blush/30 peer-focus:top-0 peer-focus:text-[11px] peer-focus:tracking-[0.2em] peer-focus:text-wedding-primary/60"
    >
      {label}
    </label>
  </div>
);

const Rsvp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    attending: true,
    needsCab: false,
    guestCount: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await axios.post('/api/wedding/rsvp', formData);
      setIsSuccess(true);
    } catch {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wedding-dark px-4 pt-20">
        <div className="glass-card p-12 md:p-16 text-center max-w-lg w-full animate-fade-in-up">
          <div className="w-16 h-16 rounded-full border border-wedding-primary/40 flex items-center justify-center mx-auto mb-8">
            <Check className="w-7 h-7 text-wedding-primary" />
          </div>
          <div className="divider-gold w-16 mx-auto mb-8 opacity-40" />
          <h2 className="font-serif text-4xl font-light text-wedding-blush mb-4">Thank You</h2>
          <p className="font-sans text-sm text-wedding-blush/50 mb-10 leading-relaxed">
            Your RSVP has been received. We can't wait to celebrate with you!
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="text-[11px] uppercase tracking-[0.2em] text-wedding-primary/60 hover:text-wedding-primary transition-colors font-sans border-b border-wedding-primary/20 hover:border-wedding-primary pb-0.5"
          >
            Submit another response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-wedding-dark px-4 pt-24 pb-16 relative overflow-hidden">
      {/* Background bokeh */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-2xl opacity-5"
            style={{
              width: `${Math.random() * 200 + 80}px`,
              height: `${Math.random() * 200 + 80}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? '#D4AF37' : '#c9847a',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      <div className="glass-card p-10 md:p-14 max-w-xl w-full animate-fade-in relative">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-wedding-primary/60 mb-4">
            Kindly reply by February 15th
          </p>
          <h2 className="font-serif text-5xl md:text-6xl font-light text-wedding-blush mb-4 leading-none">
            RSVP
          </h2>
          <div className="divider-gold w-16 mx-auto opacity-40" />
        </div>

        {error && (
          <div className="border border-red-800/40 bg-red-900/20 text-red-400 p-4 text-xs tracking-wide mb-8 font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <FloatingInput id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} label="Full Name" required />
          <FloatingInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} label="Email Address" required />
          <FloatingInput id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} label="Phone Number" />

          {/* Attending toggle */}
          <div className="pt-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-wedding-primary/60 mb-4 font-sans">
              Will you be attending?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, attending: true }))}
                className={`py-3.5 text-[11px] uppercase tracking-[0.2em] font-sans transition-all duration-300 ${formData.attending
                    ? 'bg-wedding-primary text-wedding-dark'
                    : 'border border-wedding-border text-wedding-blush/40 hover:border-wedding-primary/40'
                  }`}
              >
                Joyfully Accept
              </button>
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, attending: false }))}
                className={`py-3.5 text-[11px] uppercase tracking-[0.2em] font-sans transition-all duration-300 ${!formData.attending
                    ? 'bg-wedding-rose/80 text-white'
                    : 'border border-wedding-border text-wedding-blush/40 hover:border-wedding-rose/40'
                  }`}
              >
                Regretfully Decline
              </button>
            </div>
          </div>

          {/* Attending extras */}
          {formData.attending && (
            <div className="space-y-6 animate-fade-in border-t border-wedding-border pt-6">
              {/* Cab toggle */}
              <div className="flex items-center justify-between">
                <label htmlFor="needsCab" className="text-sm text-wedding-blush/60 font-sans cursor-pointer">
                  Need a cab from the hotel?
                </label>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, needsCab: !p.needsCab }))}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-300 flex-shrink-0 ${formData.needsCab ? 'bg-wedding-primary' : 'bg-wedding-border'
                    }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${formData.needsCab ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <FloatingInput id="guestCount" name="guestCount" type="number" value={formData.guestCount} onChange={handleChange} label="Number of Guests (including you)" min={1} max={10} />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full mt-6 py-4 bg-wedding-primary text-wedding-dark text-[11px] uppercase tracking-[0.3em] font-sans font-medium overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Sending...
                </>
              ) : 'Send RSVP'}
            </span>
            {/* Shimmer overlay */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Rsvp;
