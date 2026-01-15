import React, { useState } from 'react';
import axios from 'axios';
import { Check, Loader2 } from 'lucide-react';

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
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleToggle = (val) => {
    setFormData((prev) => ({ ...prev, attending: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await axios.post('/api/wedding/rsvp', formData);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wedding-secondary px-4 pt-20">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl text-center max-w-lg w-full animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-8">
            Your RSVP has been received. We can't wait to celebrate with you!
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="text-wedding-primary font-medium hover:underline"
          >
            Submit another response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-wedding-secondary px-4 pt-24 pb-12">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-2xl w-full animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-3">RSVP</h2>
          <p className="text-gray-500">Please respond by February 15th, 2026</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="peer w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-wedding-primary py-2 transition-colors bg-transparent"
              placeholder="Full Name"
            />
            <label
              htmlFor="fullName"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="peer w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-wedding-primary py-2 transition-colors bg-transparent"
              placeholder="Email Address"
            />
            <label
              htmlFor="email"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Email Address
            </label>
          </div>

          {/* Phone */}
          <div className="relative">
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="peer w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-wedding-primary py-2 transition-colors bg-transparent"
              placeholder="Phone Number"
            />
            <label
              htmlFor="phoneNumber"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Phone Number
            </label>
          </div>

          {/* Attending Toggle */}
          <div className="pt-4">
            <label className="block text-gray-700 font-medium mb-3">Will you be attending?</label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleToggle(true)}
                className={`flex-1 py-3 rounded-lg border transition-all duration-200 ${
                  formData.attending
                    ? 'bg-wedding-primary text-white border-wedding-primary shadow-md'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Joyfully Accept
              </button>
              <button
                type="button"
                onClick={() => handleToggle(false)}
                className={`flex-1 py-3 rounded-lg border transition-all duration-200 ${
                  !formData.attending
                    ? 'bg-gray-800 text-white border-gray-800 shadow-md'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Regretfully Decline
              </button>
            </div>
          </div>

          {/* Additional Options (Only if attending) */}
          {formData.attending && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <label htmlFor="needsCab" className="text-gray-700 cursor-pointer select-none">
                  Do you need a cab from the hotel?
                </label>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input
                    type="checkbox"
                    name="needsCab"
                    id="needsCab"
                    checked={formData.needsCab}
                    onChange={handleChange}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out checked:translate-x-6 checked:border-wedding-primary"
                  />
                  <label
                    htmlFor="needsCab"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                      formData.needsCab ? 'bg-wedding-primary' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>

              <div className="relative">
                 <input
                  type="number"
                  id="guestCount"
                  name="guestCount"
                  min="1"
                  max="10"
                  value={formData.guestCount}
                  onChange={handleChange}
                  className="peer w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-wedding-primary py-2 transition-colors bg-transparent"
                  placeholder="Number of Guests"
                />
                <label
                  htmlFor="guestCount"
                  className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                >
                  Number of Guests (including you)
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-wedding-primary text-white font-bold py-4 rounded-lg shadow-lg hover:bg-yellow-600 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-8 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Sending...
              </>
            ) : (
              'Send RSVP'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Rsvp;
