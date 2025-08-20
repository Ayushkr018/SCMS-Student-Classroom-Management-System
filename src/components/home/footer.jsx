import React from 'react';
import { FaTwitter, FaLinkedin, FaFacebook, FaYoutube } from 'react-icons/fa';

const Footer = ({ onContactClick }) => (
    <footer className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="sm:col-span-2 lg:col-span-1">
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-6">SCMS Platform</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">Smart Classroom Management System for modern educational institutions. Empowering education through technology.</p>
                    <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Connect With Us</h4>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center justify-center text-lg transition-all duration-300 text-[#1da1f2] hover:-translate-y-0.5 hover:shadow-lg hover:bg-[#1da1f2] hover:text-white"><FaTwitter /></a>
                        <a href="#" className="w-10 h-10 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center justify-center text-lg transition-all duration-300 text-[#0077b5] hover:-translate-y-0.5 hover:shadow-lg hover:bg-[#0077b5] hover:text-white"><FaLinkedin /></a>
                        <a href="#" className="w-10 h-10 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center justify-center text-lg transition-all duration-300 text-[#1877f2] hover:-translate-y-0.5 hover:shadow-lg hover:bg-[#1877f2] hover:text-white"><FaFacebook /></a>
                        <a href="#" className="w-10 h-10 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center justify-center text-lg transition-all duration-300 text-[#ff0000] hover:-translate-y-0.5 hover:shadow-lg hover:bg-[#ff0000] hover:text-white"><FaYoutube /></a>
                    </div>
                </div>
                <div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-6">Quick Links</h3>
                    <ul className="space-y-3">
                        <li><a href="#features" className="transition-colors duration-300 text-sm hover:text-blue-600 dark:hover:text-blue-400">Features</a></li>
                        <li><a href="#roles" className="transition-colors duration-300 text-sm hover:text-blue-600 dark:hover:text-blue-400">Access Portal</a></li>
                        <li><a href="#about" className="transition-colors duration-300 text-sm hover:text-blue-600 dark:hover:text-blue-400">About Us</a></li>
                        <li><a href="#help" className="transition-colors duration-300 text-sm hover:text-blue-600 dark:hover:text-blue-400">Help Center</a></li>
                    </ul>
                </div>
                 <div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-6">Support</h3>
                    <ul className="space-y-3">
                        <li><button onClick={onContactClick} className="bg-transparent border-none text-left p-0 transition-colors duration-300 text-sm hover:text-blue-600 dark:hover:text-blue-400">Contact Us</button></li>
                        <li><button onClick={onContactClick} className="bg-transparent border-none text-left p-0 transition-colors duration-300 text-sm hover:text-blue-600 dark:hover:text-blue-400">Contact Support</button></li>
                        <li><a href="#help" className="transition-colors duration-300 text-sm hover:text-blue-600 dark:hover:text-blue-400">Help Documentation</a></li>
                        <li><a href="#" className="transition-colors duration-300 text-sm hover:text-blue-600 dark:hover:text-blue-400">Live Chat Support</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-t-slate-200 dark:border-t-slate-700 pt-8 mt-8 text-center">
                <p>&copy; 2025 SCMS - Student Classroom Management System. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

export default Footer;