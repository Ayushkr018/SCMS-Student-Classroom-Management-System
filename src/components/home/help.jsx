import React from 'react';
import { FaSearch, FaRocket, FaChalkboardTeacher, FaUserGraduate, FaUserShield, FaCog, FaQuestionCircle } from 'react-icons/fa';

const helpCategories = [
    { icon: <FaRocket />, title: "Getting Started", links: ["Initial Setup Guide", "Login & Account Management", "Platform Navigation", "Understanding User Roles"] },
    { icon: <FaChalkboardTeacher />, title: "For Teachers", links: ["Managing Classes", "Attendance Tracking", "Creating Assignments", "Grading System"] },
    { icon: <FaUserGraduate />, title: "For Students", links: ["Digital Check-in Process", "Assignment Submissions", "Viewing Grades", "Class Schedule"] },
    { icon: <FaUserShield />, title: "For Administrators", links: ["User Management", "System Analytics", "Security Settings", "Generating Reports"] },
    { icon: <FaCog />, title: "Technical Support", links: ["Troubleshooting Guide", "Mobile App Issues", "Browser Compatibility", "Performance Optimization"] },
    { icon: <FaQuestionCircle />, title: "FAQ", links: ["Pricing & Plans", "Data Privacy & Security", "Third-party Integrations", "System Updates"] },
];

const Help = () => (
    <section id="help" className="bg-slate-50 dark:bg-slate-800 py-20 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Help Center</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300">Find answers to common questions and get the support you need</p>
            </div>
            <div className="max-w-2xl mx-auto mb-16">
                <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20">
                    <FaSearch className="text-slate-400 text-lg" />
                    <input type="text" placeholder="Search for help topics, tutorials, or FAQs..." className="flex-1 border-none bg-transparent text-base text-slate-900 dark:text-white outline-none placeholder:text-slate-400" />
                    <button className="bg-blue-600 text-white border-none px-6 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600">Search</button>
                </div>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {helpCategories.map((cat) => (
                    <div key={cat.title} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-blue-500/50 dark:hover:border-blue-500/50">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 flex items-center justify-center text-xl text-white mb-6 shadow-lg shadow-blue-500/20">
                            {cat.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{cat.title}</h3>
                        <ul className="space-y-2">
                            {cat.links.map(link => (
                                <li key={link}>
                                    <a href="#" className="text-slate-600 dark:text-slate-400 transition-colors duration-300 text-sm hover:text-blue-600 dark:hover:text-blue-400">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Help;