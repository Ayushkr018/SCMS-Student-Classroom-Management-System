import React from 'react';

// --- Self-Contained SVG Icons ---
const TimesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" fill="currentColor" width="1em" height="1em"><path d="M242.7 256l100.1-100.1c12.3-12.3 12.3-32.2 0-44.5l-22.2-22.2c-12.3-12.3-32.2-12.3-44.5 0L176 189.3 75.9 89.2c-12.3-12.3-32.2-12.3-44.5 0L9.2 111.5c-12.3 12.3-12.3 32.2 0 44.5L109.3 256 9.2 356.1c-12.3 12.3-12.3 32.2 0 44.5l22.2 22.2c12.3 12.3 32.2 12.3 44.5 0L176 322.7l100.1 100.1c12.3 12.3 32.2 12.3 44.5 0l22.2-22.2c12.3-12.3 12.3-32.2 0-44.5L242.7 256z"/></svg>;
const ExclamationTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em"><path d="M256 32L0 480H512L256 32zm0 128c17.7 0 32 14.3 32 32V256c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32zm0 160a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>;


const SignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[10000] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-10 w-full max-w-md relative shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <TimesIcon />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Sign Up Currently Disabled</h2>
                    <p className="text-slate-500 dark:text-slate-400">Database integration in progress</p>
                </div>

                <div className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-800 rounded-xl p-4 mb-8 flex items-start gap-4">
                    <div className="text-xl mt-1 flex-shrink-0"><ExclamationTriangleIcon /></div>
                    <div>
                        <div className="font-bold mb-1">Feature Under Development</div>
                        <div className="text-sm leading-relaxed">
                            Sign up functionality is currently disabled. Please use the demo login credentials to explore the platform.
                        </div>
                    </div>
                </div>

                <div className="opacity-50 pointer-events-none">
                    <form className="space-y-4">
                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                            <input type="text" placeholder="Enter your full name" disabled className="w-full p-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-800"/>
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                            <input type="email" placeholder="Enter your email" disabled className="w-full p-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-800"/>
                        </div>
                        <button type="button" disabled className="w-full bg-slate-400 dark:bg-slate-600 text-white p-4 rounded-lg font-semibold text-base cursor-not-allowed">
                            Create Account (Disabled)
                        </button>
                    </form>
                </div>
                
                <div className="text-center mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400 mb-2">Already have an account?</p>
                    <span onClick={onSwitchToLogin} className="text-blue-600 dark:text-blue-500 font-semibold cursor-pointer hover:underline">Use Demo Login</span>
                </div>
            </div>
        </div>
    );
};

export default SignupModal;