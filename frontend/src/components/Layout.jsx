import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Story', path: '/story' },
    { name: 'Events', path: '/events' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-wedding-dark text-wedding-blush">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${isScrolled
            ? 'bg-wedding-dark/95 backdrop-blur-md border-b border-wedding-border py-3'
            : 'bg-transparent py-5'
          }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="font-script text-3xl md:text-4xl text-wedding-primary transition-opacity hover:opacity-80"
          >
            Vandana &amp; Ajay
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-sans text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${location.pathname === link.path
                    ? 'text-wedding-primary'
                    : 'text-wedding-blush/70 hover:text-wedding-blush'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin"
              className="text-wedding-blush/30 hover:text-wedding-blush/50 text-xs tracking-widest uppercase transition-colors font-sans"
            >
              Admin
            </Link>
            <Link
              to="/rsvp"
              className="relative font-sans text-xs uppercase tracking-[0.2em] px-6 py-2.5 text-wedding-dark bg-wedding-primary hover:bg-wedding-primary/90 transition-all duration-300 overflow-hidden group"
            >
              <span className="relative z-10">RSVP</span>
              <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-wedding-blush focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-wedding-dark/98 backdrop-blur-md border-b border-wedding-border py-8 flex flex-col items-center space-y-6 animate-fade-in-down">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="font-sans text-xs uppercase tracking-[0.25em] text-wedding-blush/80 hover:text-wedding-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin"
              className="text-wedding-blush/30 hover:text-wedding-blush/50 text-xs tracking-widest uppercase transition-colors font-sans"
            >
              Admin
            </Link>
            <Link
              to="/rsvp"
              className="font-sans text-xs uppercase tracking-[0.2em] px-8 py-3 bg-wedding-primary text-wedding-dark"
            >
              RSVP
            </Link>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-wedding-secondary border-t border-wedding-border py-12 text-center">
        <div className="divider-gold w-32 mx-auto mb-8 opacity-40" />
        <p className="font-script text-4xl text-wedding-primary mb-3">Vandana &amp; Ajay</p>
        <p className="text-xs uppercase tracking-[0.3em] text-wedding-blush/50 font-sans">March 11, 2026</p>
        <p className="text-sm text-wedding-blush/40 mt-4 font-sans">We can't wait to celebrate with you</p>
        <div className="divider-gold w-32 mx-auto mt-8 opacity-40" />
      </footer>
    </div>
  );
};

export default Layout;
