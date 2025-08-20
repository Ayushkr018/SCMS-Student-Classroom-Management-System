/*
File: src/components/modals/ContactModal.jsx (Final Corrected Version)
Description: This is a precise replica of your original contact modal, converted to React.
It includes all contact methods, the form, and uses inline SVGs to avoid dependencies.
*/

import React, { useState } from 'react';

// --- Self-Contained SVG Icons ---
const TimesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" fill="currentColor" width="1em" height="1em"><path d="M242.7 256l100.1-100.1c12.3-12.3 12.3-32.2 0-44.5l-22.2-22.2c-12.3-12.3-32.2-12.3-44.5 0L176 189.3 75.9 89.2c-12.3-12.3-32.2-12.3-44.5 0L9.2 111.5c-12.3 12.3-12.3 32.2 0 44.5L109.3 256 9.2 356.1c-12.3 12.3-12.3 32.2 0 44.5l22.2 22.2c12.3 12.3 32.2 12.3 44.5 0L176 322.7l100.1 100.1c12.3 12.3 32.2 12.3 44.5 0l22.2-22.2c12.3-12.3 12.3-32.2 0-44.5L242.7 256z"/></svg>;
const EnvelopeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em"><path d="M48 64C21.5 64 0 85.5 0 112v288c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zM0 112V400c0 8.8 7.2 16 16 16H496c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16zM464 128L256 294.4 48 128h416z"/></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.2-46.1 11.7L307.6 368c-70.4-33.3-127.4-90.3-160.7-160.7l35.4-35.4c13.9-10.9 18.5-30 11.7-46.1l-40-96z"/></svg>;
const CommentsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em"><path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"/></svg>;
const PaperPlaneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em"><path d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"/></svg>;


const ContactModal = ({ isOpen, onClose, showNotification }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;
    
    const handleContactSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            onClose();
            showNotification("Message sent! We'll get back to you soon.", 'success');
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[10000] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-10 w-full max-w-2xl relative shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <TimesIcon />
                </button>
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Contact Us</h2>
                    <p className="text-slate-500 dark:text-slate-400">Get in touch with our support team</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0"><EnvelopeIcon /></div>
                        <div>
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">Email Support</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Response within 2-4 hours</p>
                        </div>
                    </div>
                     <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0"><PhoneIcon /></div>
                        <div>
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">Phone Support</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Mon-Fri: 8AM - 8PM EST</p>
                        </div>
                    </div>
                     <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0"><CommentsIcon /></div>
                        <div>
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">Live Chat</h4>
                            <button className="text-sm text-green-600 dark:text-green-400 font-semibold hover:underline">Start Chat</button>
                        </div>
                    </div>
                </div>
                
                <form className="mt-8" onSubmit={handleContactSubmit}>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 text-center">Send us a Message</h3>
                    <div className="grid sm:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                            <input type="text" placeholder="Enter your full name" required className="w-full p-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                            <input type="email" placeholder="Enter your email" required className="w-full p-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                    </div>
                     <div className="mb-6">
                        <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-300">Subject</label>
                        <select required className="w-full p-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none bg-no-repeat bg-right-4" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`}}>
                            <option value="">Select a subject</option>
                            <option value="general">General Inquiry</option>
                            <option value="technical">Technical Support</option>
                            <option value="billing">Billing Question</option>
                            <option value="feature">Feature Request</option>
                        </select>
                    </div>
                    <div className="mb-6">
                         <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-300">Message</label>
                         <textarea placeholder="Describe your question or issue..." required rows="4" className="w-full p-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"></textarea>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {isSubmitting ? 'Sending...' : <><PaperPlaneIcon /> Send Message</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactModal;