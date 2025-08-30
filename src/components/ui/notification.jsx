import React, { useEffect, useState } from 'react';

// --- Self-Contained SVG Icons ---
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
);
const TimesCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
);
const InfoCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"/></svg>
);
const ExclamationTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em"><path d="M256 32L0 480H512L256 32zm0 128c17.7 0 32 14.3 32 32V256c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32zm0 160a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
);

// The configuration now uses standard Tailwind classes instead of CSS variables.
const notificationConfig = {
    success: { icon: <CheckCircleIcon />, class: 'bg-green-500' },
    error: { icon: <TimesCircleIcon />, class: 'bg-red-500' },
    info: { icon: <InfoCircleIcon />, class: 'bg-blue-500' },
    warning: { icon: <ExclamationTriangleIcon />, class: 'bg-yellow-400 text-slate-800' },
};

const Notification = ({ message, type, show }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(show);
    }, [show]);

    if (!message) return null;

    const config = notificationConfig[type] || notificationConfig.info;

    return (
        <div className={`fixed top-5 right-5 p-4 rounded-xl text-white font-semibold z-[20000] flex items-center gap-3 shadow-lg transition-transform duration-300 ease-out ${isVisible ? 'translate-x-0' : 'translate-x-[calc(100%+2rem)]'} ${config.class}`}>
            {config.icon}
            {message}
        </div>
    );
};

export default Notification;