import { useState } from 'react';
import { FaGraduationCap, FaMoon, FaSun, FaBars, FaTimes, FaSignInAlt, FaUserPlus, FaToggleOff, FaToggleOn } from 'react-icons/fa';

const Header = ({ toggleTheme, theme, openLoginModal, openSignupModal }) => {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setMobileNavOpen(!isMobileNavOpen);
  };

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  const navLinks = [
    { href: '#features', text: 'Features' },
    { href: '#roles', text: 'Access Portal' },
    { href: '#about', text: 'About' },
    { href: '#help', text: 'Help' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-800 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center gap-3 text-blue-600 dark:text-accent-blue-light">
              <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-accent-blue-light to-accent-blue-dark rounded-xl text-white text-2xl shadow-lg">
                <FaGraduationCap />
              </div>
              <span className="text-2xl font-extrabold">SCMS</span>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-accent-blue-light font-medium transition-colors duration-300">
                {link.text}
              </a>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title="Toggle Dark/Light Mode"
              className="w-11 h-11 flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-full text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:border-accent-blue-light dark:hover:bg-accent-blue-light transition-all duration-300 transform hover:scale-105"
            >
              {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
            </button>

            <div className="hidden md:flex items-center gap-2">
              <button onClick={openLoginModal} className="flex items-center gap-2 px-6 py-2.5 border-2 border-blue-600 dark:border-accent-blue-light text-blue-600 dark:text-accent-blue-light font-semibold rounded-lg hover:bg-blue-600 dark:hover:bg-accent-blue-light hover:text-white dark:hover:text-white transition-all duration-300 text-sm">
                <FaSignInAlt />
                Login
              </button>
              <button onClick={openSignupModal} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-accent-blue-dark dark:hover:bg-accent-blue-light transition-all duration-300 transform hover:-translate-y-0.5 text-sm">
                <FaUserPlus />
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileNav}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              >
                {isMobileNavOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileNavOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4">
          <nav className="flex flex-col gap-2 mb-4">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={closeMobileNav} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600">
                {link.text}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col gap-3">
              <button onClick={() => { openLoginModal(); closeMobileNav(); }} className="w-full text-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300">
                Login
              </button>
              <button onClick={() => { openSignupModal(); closeMobileNav(); }} className="w-full text-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-accent-blue-dark transition-all duration-300">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;