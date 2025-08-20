import React from 'react';
import { FaUserShield, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';

const rolesData = [
    { 
        icon: <FaUserShield />, 
        title: "Administrator", 
        desc: "Complete system management with advanced analytics and user control capabilities.",
        features: ["User Management & Control", "System-wide Analytics", "Security & Compliance", "Advanced Reporting"],
        theme: {
            gradient: "bg-gradient-to-br from-red-500 to-red-700 dark:from-red-400 dark:to-red-600",
            text: "text-red-600 dark:text-red-500",
            border: "hover:border-red-500",
            buttonBg: "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
        }
    },
    { 
        icon: <FaChalkboardTeacher />, 
        title: "Teacher", 
        desc: "Comprehensive classroom management tools for modern educators.",
        features: ["Live Session Management", "Attendance Tracking", "Assignment Creation", "Student Analytics"],
        theme: {
            gradient: "bg-gradient-to-br from-green-500 to-green-700 dark:from-green-400 dark:to-green-600",
            text: "text-green-600 dark:text-green-500",
            border: "hover:border-green-500",
            buttonBg: "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
        }
    },
    { 
        icon: <FaUserGraduate />, 
        title: "Student", 
        desc: "Personalized learning dashboard with progress tracking and interactive tools.",
        features: ["Digital Check-in", "Assignment Submission", "Grade Tracking", "Live Class Participation"],
        theme: {
            gradient: "bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600",
            text: "text-blue-600 dark:text-blue-500",
            border: "hover:border-blue-500",
            buttonBg: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        }
    }
];

// THIS IS THE FIX: The component now accepts the onAccessPortalClick prop.
const Roles = ({ onAccessPortalClick }) => (
    <section id="roles" className="bg-slate-50 dark:bg-slate-800 py-20 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Choose Your Access Portal</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300">Select your role to access personalized dashboard and features</p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
                {rolesData.map((role) => (
                    <div key={role.title} className={`bg-white dark:bg-slate-900 p-10 rounded-2xl text-center border-2 border-slate-200 dark:border-slate-700 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-2xl ${role.theme.border}`}>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-6 shadow-lg ${role.theme.gradient}`}>
                            {role.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{role.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">{role.desc}</p>
                        <ul className="text-left mb-8 space-y-2">
                            {role.features.map(feature => (
                                <li key={feature} className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                    <span className={`font-bold text-lg ${role.theme.text}`}>✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={onAccessPortalClick}
                            className={`text-white w-full px-8 py-4 border-none rounded-xl font-semibold cursor-pointer transition-all duration-300 text-base hover:-translate-y-0.5 hover:shadow-lg ${role.theme.buttonBg}`}
                        >
                            Access {role.title} Portal
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Roles;