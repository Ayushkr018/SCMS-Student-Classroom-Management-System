
import React, { useState, useRef } from 'react';
import { FaTimes, FaKey, FaUserShield, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';

const LoginModal = ({ isOpen, onClose, onSwitchToSignup, showNotification, onLoginSuccess, credentials }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role

    if (!isOpen) return null;
    
    const handleLogin = (e) => {
        e.preventDefault();
        const expectedCreds = credentials[role];
        if (expectedCreds && email === expectedCreds.email && password === expectedCreds.password) {
            onLoginSuccess(role);
        } else {
            showNotification('Invalid credentials for the selected role.', 'error');
        }
    };
    
    const fillCredentials = (roleToFill) => {
        const credsToFill = credentials[roleToFill];
        setEmail(credsToFill.email);
        setPassword(credsToFill.password);
        setRole(roleToFill);
        showNotification('Demo credentials filled!', 'info');
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[10000] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-10 w-full max-w-md relative shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><FaTimes /></button>
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back!</h2>
                    <p className="text-slate-500 dark:text-slate-400">Sign in to your account</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-8 space-y-3">
                    <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200"><FaKey /> Demo Login Credentials</div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-md">
                        <div className="flex justify-between items-center text-sm font-semibold text-red-600 dark:text-red-500">
                            <span className="flex items-center gap-2"><FaUserShield /> Administrator</span>
                            <button onClick={() => fillCredentials('admin')} className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">Fill</button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Email: admin@scms.edu | Pass: admin123</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-md">
                        <div className="flex justify-between items-center text-sm font-semibold text-green-600 dark:text-green-500">
                             <span className="flex items-center gap-2"><FaChalkboardTeacher /> Teacher</span>
                             <button onClick={() => fillCredentials('teacher')} className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">Fill</button>
                        </div>
                         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Email: teacher@scms.edu | Pass: teacher123</p>
                    </div>
                     <div className="bg-white dark:bg-slate-900 p-3 rounded-md">
                        <div className="flex justify-between items-center text-sm font-semibold text-blue-600 dark:text-blue-500">
                             <span className="flex items-center gap-2"><FaUserGraduate /> Student</span>
                             <button onClick={() => fillCredentials('student')} className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">Fill</button>
                        </div>
                         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Email: student@scms.edu | Pass: student123</p>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                     <div>
                        <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                     <div>
                        <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-300">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                     <div>
                        <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-300">Role</label>
                        <select value={role} onChange={e => setRole(e.target.value)} required className="w-full p-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600">Sign In</button>
                </form>

                <div className="text-center mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400 mb-2">Don't have an account?</p>
                    <span onClick={onSwitchToSignup} className="text-blue-600 dark:text-blue-500 font-semibold cursor-pointer hover:underline">Create Account</span>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;