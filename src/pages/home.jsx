import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/home/Header';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Roles from '../components/home/Roles';
import About from '../components/home/About';
import Help from '../components/home/Help';
import Footer from '../components/home/Footer';
import LoginModal from '../components/home/modals/LoginModal';
import SignupModal from '../components/home/modals/SignupModal';
import ContactModal from '../components/home/modals/ContactModal';
import ChatWidget from '../components/widgets/ChatWidget';
import Notification from '../components/ui/Notification';

const DEMO_CREDENTIALS = {
    admin: { email: 'admin@scms.edu', password: 'admin123' },
    teacher: { email: 'teacher@scms.edu', password: 'teacher123' },
    student: { email: 'student@scms.edu', password: 'student123' }
};

function Home() {
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isSignupOpen, setSignupOpen] = useState(false);
    const [isContactOpen, setContactOpen] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
    const notificationTimer = useRef(null);

    const showNotification = (message, type = 'info', duration = 4000) => {
        if (notificationTimer.current) clearTimeout(notificationTimer.current);
        setNotification({ message, type, show: true });
        notificationTimer.current = setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, duration);
    };

    const handleLoginSuccess = (role) => {
        setLoginOpen(false);
        showNotification('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = `/${role}`;
        }, 1500);
    };
    
    // NEW: Function to handle opening the Signup modal AND showing the notification
    const handleOpenSignupModal = () => {
        setLoginOpen(false); // Close login modal if it's open
        showNotification('Signup is currently disabled. Use the demo login.', 'warning');
        setSignupOpen(true);
    };

    return (
        <div className="bg-white dark:bg-slate-900">
            <Header 
                onLoginClick={() => setLoginOpen(true)}
                onSignupClick={handleOpenSignupModal} // Use the new handler here
            />
            <main>
                <Hero />
                <Features />
                <Roles onAccessPortalClick={() => setLoginOpen(true)} />
                <About />
                <Help />
            </main>
            <Footer onContactClick={() => setContactOpen(true)} />
            <ChatWidget />
            
            <LoginModal 
                isOpen={isLoginOpen} 
                onClose={() => setLoginOpen(false)} 
                onSwitchToSignup={handleOpenSignupModal} // Use the new handler here as well
                showNotification={showNotification}
                onLoginSuccess={handleLoginSuccess}
                credentials={DEMO_CREDENTIALS}
            />
            <SignupModal 
                isOpen={isSignupOpen} 
                onClose={() => setSignupOpen(false)} 
                onSwitchToLogin={() => { setSignupOpen(false); setLoginOpen(true); }}
            />
            <ContactModal 
                isOpen={isContactOpen} 
                onClose={() => setContactOpen(false)} 
                showNotification={showNotification} 
            />
            <Notification 
                message={notification.message} 
                type={notification.type} 
                show={notification.show} 
            />
        </div>
    );
}

export default Home;