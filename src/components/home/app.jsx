import { useState, useEffect } from 'react';
import Header from './header.jsx';
import Hero from './hero.jsx';
import Features from './features.jsx';
import Roles from './roles.jsx';
import About from './about.jsx';
import Help from './help.jsx';
import Footer from './footer';
import ChatWidget from './ChatWidget';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import ContactModal from './ContactModal';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [isContactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);
  const openSignupModal = () => setSignupModalOpen(true);
  const closeSignupModal = () => setSignupModalOpen(false);
  const openContactModal = () => setContactModalOpen(true);
  const closeContactModal = () => setContactModalOpen(false);

  const switchToSignup = () => {
    closeLoginModal();
    openSignupModal();
  };

  const switchToLogin = () => {
    closeSignupModal();
    openLoginModal();
  };


  return (
    <div className="font-inter bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors duration-300">
      <Header 
        toggleTheme={toggleTheme} 
        theme={theme}
        openLoginModal={openLoginModal}
        openSignupModal={openSignupModal}
      />
      <main>
        <Hero openSignupModal={openSignupModal} />
        <Features />
        <Roles />
        <About />
        <Help />
      </main>
      <Footer openContactModal={openContactModal} />
      <ChatWidget />
      
      {isLoginModalOpen && (
        <LoginModal 
          closeModal={closeLoginModal} 
          switchToSignup={switchToSignup}
        />
      )}
      {isSignupModalOpen && (
        <SignupModal 
          closeModal={closeSignupModal} 
          switchToLogin={switchToLogin}
        />
      )}
      {isContactModalOpen && (
        <ContactModal 
          closeModal={closeContactModal} 
        />
      )}
    </div>
  );
}

export default App;