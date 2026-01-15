import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Story', path: '/story' },
    { name: 'Events', path: '/events' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      <nav
          // We moved the white background colors OUT of the condition so they are always applied
          className={`fixed w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm ${
              isScrolled ? 'py-2' : 'py-4'
          }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link to="/" className="text-2xl md:text-3xl font-script font-bold text-gray-900">
            Vandana & Ajay
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-wedding-primary transition-colors font-medium font-sans"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin"
              className="text-gray-400 hover:text-gray-600 text-sm transition-colors font-sans"
            >
              Admin
            </Link>
            <Link
              to="/rsvp"
              className="bg-wedding-primary text-white px-6 py-2 rounded-full font-medium hover:bg-yellow-600 transition-colors shadow-md font-sans"
            >
              RSVP
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 flex flex-col items-center space-y-4 animate-fade-in-down">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-800 text-lg font-medium hover:text-wedding-primary font-sans"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin"
              className="text-gray-400 hover:text-gray-600 text-sm transition-colors font-sans"
            >
              Admin
            </Link>
            <Link
              to="/rsvp"
              className="bg-wedding-primary text-white px-8 py-2 rounded-full font-medium hover:bg-yellow-600 transition-colors shadow-sm font-sans"
            >
              RSVP
            </Link>
          </div>
        )}
      </nav>

      <main className="flex-grow pt-0">
        <Outlet />
      </main>

      <footer className="bg-wedding-secondary py-8 text-center text-gray-600">
        <p className="font-script text-3xl mb-2">Vandana & Ajay</p>
        <p className="text-sm font-sans">We can't wait to celebrate with you!</p>
      </footer>
    </div>
  );
};

export default Layout;
