import React from 'react';
import { FaRocket, FaPlayCircle, FaChartBar, FaUsers, FaBook, FaTasks } from 'react-icons/fa';
import { useCountUp } from '../hooks/useCountUp';

const Hero = () => {
    const [usersRef, usersCount] = useCountUp('2,500+');
    const [accuracyRef, accuracyCount] = useCountUp('98.5%');
    const [supportRef, supportCount] = useCountUp('24/7');

    const handleSmoothScroll = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const headerOffset = 88; // Height of the header + some padding
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <section className="bg-slate-50 dark:bg-slate-800 py-20 px-4">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                        Smart Classroom Management for the <span className="text-blue-600 dark:text-blue-500">Digital Age</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
                        Revolutionary education platform with AI-powered attendance tracking, real-time analytics, and seamless classroom management tools.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                         <button className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:bg-blue-700 dark:hover:bg-blue-600 hover:-translate-y-0.5">
                            <FaRocket /> Get Started Free
                        </button>
                        <a href="#features" onClick={handleSmoothScroll} className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:-translate-y-0.5 hover:shadow-xl">
                            <FaPlayCircle /> Watch Demo
                        </a>
                    </div>
                    <div className="flex gap-8 justify-center lg:justify-start">
                        <div className="text-center">
                            <span ref={usersRef} className="text-4xl font-extrabold text-blue-600 dark:text-blue-500 block">{usersCount}</span>
                            <span className="text-slate-500 dark:text-slate-400 text-sm mt-1">Active Users</span>
                        </div>
                         <div className="text-center">
                            <span ref={accuracyRef} className="text-4xl font-extrabold text-blue-600 dark:text-blue-500 block">{accuracyCount}</span>
                            <span className="text-slate-500 dark:text-slate-400 text-sm mt-1">Accuracy Rate</span>
                        </div>
                         <div className="text-center">
                            <span ref={supportRef} className="text-4xl font-extrabold text-blue-600 dark:text-blue-500 block">{supportCount}</span>
                            <span className="text-slate-500 dark:text-slate-400 text-sm mt-1">Support</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-2xl dark:shadow-black/30 border border-slate-200 dark:border-slate-800 w-full max-w-md">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl"><FaChartBar /></div>
                            <div>
                                <h3 className="text-slate-900 dark:text-white font-bold">Live Dashboard</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time classroom insights</p>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center text-sm"><FaUsers /></div>
                                    <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">Today's Attendance</span>
                                </div>
                                <span className="text-green-600 dark:text-green-500 font-bold">94.2%</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                     <div className="w-9 h-9 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center text-sm"><FaBook /></div>
                                     <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">Active Classes</span>
                                </div>
                                <span className="text-slate-900 dark:text-white font-bold">12</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                     <div className="w-9 h-9 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center text-sm"><FaTasks /></div>
                                     <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">Assignments Due</span>
                                </div>
                                <span className="text-slate-900 dark:text-white font-bold">5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default Hero;
