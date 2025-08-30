import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaMoon, FaSun, FaBars, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Header = ({ onLoginClick, onSignupClick }) => {
    const [theme, setTheme] = useState(null);
    const [isMobileNavOpen, setMobileNavOpen] = useState(false);
    
    useEffect(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, []);

    useEffect(() => {
        if (theme === null) return;
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleMobileLogin = () => { onLoginClick(); setMobileNavOpen(false); };
    const handleMobileSignup = () => { onSignupClick(); setMobileNavOpen(false); };
    
    // Function for smooth scrolling to a section
    const handleSmoothScroll = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const headerOffset = 88; // Height of the header + padding
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            setMobileNavOpen(false); // Close mobile nav after clicking
        }
    };

    // Function to scroll to the top of the page
    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    if (theme === null) {
        return <header className="h-[88px]" />; // Render a placeholder to prevent layout shift
    }

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-4 shadow-md dark:shadow-black/20 sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8">
                {/* Logo is now a button that scrolls to top */}
                <button onClick={handleScrollToTop} className="flex items-center gap-3 font-extrabold text-2xl text-blue-600 dark:text-blue-500">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/30">
                        <FaGraduationCap />
                    </div>
                    <span>SCMS</span>
                </button>
                
                {/* Desktop Navigation Links now use smooth scroll */}
                <nav className="hidden lg:flex list-none gap-8 items-center">
                    <a href="#features" onClick={handleSmoothScroll} className="text-slate-600 dark:text-slate-400 font-medium transition-colors py-2 hover:text-blue-600 dark:hover:text-blue-400">Features</a>
                    <a href="#roles" onClick={handleSmoothScroll} className="text-slate-600 dark:text-slate-400 font-medium transition-colors py-2 hover:text-blue-600 dark:hover:text-blue-400">Access Portal</a>
                    <a href="#about" onClick={handleSmoothScroll} className="text-slate-600 dark:text-slate-400 font-medium transition-colors py-2 hover:text-blue-600 dark:hover:text-blue-400">About</a>
                    <a href="#help" onClick={handleSmoothScroll} className="text-slate-600 dark:text-slate-400 font-medium transition-colors py-2 hover:text-blue-600 dark:hover:text-blue-400">Help</a>
                </nav>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleTheme} 
                        title="Toggle Theme" 
                        className="bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-full w-11 h-11 flex items-center justify-center cursor-pointer transition-all text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 dark:hover:border-blue-500 hover:scale-105"
                    >
                        {theme === 'dark' ? <FaSun /> : <FaMoon />}
                    </button>
                    <div className="hidden sm:flex gap-4 items-center">
                        <button onClick={onLoginClick} className="bg-transparent text-blue-600 dark:text-blue-500 px-6 py-3 border-2 border-blue-600 dark:border-blue-500 rounded-lg font-semibold transition-all hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white">
                            <FaSignInAlt className="inline -mt-1 mr-2" /> Login
                        </button>
                        <button onClick={onSignupClick} className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md shadow-blue-500/30 hover:bg-blue-700 dark:hover:bg-blue-600 hover:-translate-y-px">
                            <FaUserPlus className="inline -mt-1 mr-2" /> Sign Up
                        </button>
                    </div>
                    <button className="lg:hidden text-2xl text-slate-500 dark:text-slate-400" onClick={() => setMobileNavOpen(!isMobileNavOpen)}>
                        <FaBars />
                    </button>
                </div>
            </div>
            {isMobileNavOpen && (
                 <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg p-6">
                    <div className="flex flex-col gap-4 mb-6">
                         <a href="#features" onClick={handleSmoothScroll} className="text-slate-600 dark:text-slate-300 font-medium py-3 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400">Features</a>
                         <a href="#roles" onClick={handleSmoothScroll} className="text-slate-600 dark:text-slate-300 font-medium py-3 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400">Access Portal</a>
                         <a href="#about" onClick={handleSmoothScroll} className="text-slate-600 dark:text-slate-300 font-medium py-3 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400">About</a>
                         <a href="#help" onClick={handleSmoothScroll} className="text-slate-600 dark:text-slate-300 font-medium py-3 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400">Help</a>
                    </div>
                     <div className="flex flex-col gap-3">
                         <button onClick={handleMobileLogin} className="bg-transparent text-center text-blue-600 dark:text-blue-500 w-full block p-3.5 border-2 border-blue-600 dark:border-blue-500 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white">Login</button>
                         <button onClick={handleMobileSignup} className="bg-blue-600 dark:bg-blue-500 text-center text-white w-full block p-3.5 rounded-lg font-semibold transition-all duration-300 shadow-md shadow-blue-500/30 hover:bg-blue-700 dark:hover:bg-blue-600">Sign Up</button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
