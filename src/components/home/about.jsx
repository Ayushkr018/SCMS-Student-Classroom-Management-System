import React from 'react';
import { FaLightbulb, FaEye, FaHeart } from 'react-icons/fa';
import { useCountUp } from '../hooks/useCountUp';

const aboutData = [
    { icon: <FaLightbulb />, title: "Our Mission", text: "To transform traditional classroom management through innovative technology, making education more accessible, efficient, and engaging worldwide." },
    { icon: <FaEye />, title: "Our Vision", text: "Creating a future where technology seamlessly integrates with education, empowering institutions to focus on quality learning and student success." },
    { icon: <FaHeart />, title: "Our Values", text: "Innovation, accessibility, security, and user-centric design drive everything we do. We believe in creating solutions that truly serve the educational community." }
];

const About = () => {
  const [institutionsRef, institutionsCount] = useCountUp("50+");
  const [studentsRef, studentsCount] = useCountUp("10K+");
  const [teachersRef, teachersCount] = useCountUp("500+");
  const [uptimeRef, uptimeCount] = useCountUp("99.9%");

  return (
    <section id="about" className="py-20 px-4 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">About SCMS</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">Revolutionizing education through intelligent classroom management solutions</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {aboutData.map((item, index) => (
            <div key={index} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-blue-500/50 dark:hover:border-blue-500/50">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 flex items-center justify-center text-2xl text-white mx-auto mb-6 shadow-lg shadow-blue-500/20">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-8 grid-cols-2 lg:grid-cols-4 bg-slate-50 dark:bg-slate-800 p-8 md:p-12 rounded-2xl text-center">
          <div ref={institutionsRef}>
            <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-500 mb-2">{institutionsCount}</div>
            <div className="text-slate-600 dark:text-slate-400 font-medium text-sm">Educational Institutions</div>
          </div>
          <div ref={studentsRef}>
            <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-500 mb-2">{studentsCount}</div>
            <div className="text-slate-600 dark:text-slate-400 font-medium text-sm">Students Managed</div>
          </div>
          <div ref={teachersRef}>
            <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-500 mb-2">{teachersCount}</div>
            <div className="text-slate-600 dark:text-slate-400 font-medium text-sm">Teachers Using Platform</div>
          </div>
          <div ref={uptimeRef}>
            <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-500 mb-2">{uptimeCount}</div>
            <div className="text-slate-600 dark:text-slate-400 font-medium text-sm">System Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;