import { FaLightbulb, FaEye, FaHeart } from 'react-icons/fa';

const AboutCard = ({ icon, title, description }) => (
  <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-black/20 hover:border-blue-500">
    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-accent-blue-light to-accent-blue-dark text-white text-3xl shadow-lg">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{title}</h3>
    <p className="text-slate-600 dark:text-slate-300">{description}</p>
  </div>
);

const StatItem = ({ number, label }) => (
    <div className="p-4">
        <div className="text-4xl font-extrabold text-blue-600 dark:text-accent-blue-light mb-2">{number}</div>
        <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{label}</div>
    </div>
);

const About = () => {
    const aboutData = [
        { icon: <FaLightbulb />, title: 'Our Mission', description: 'To transform traditional classroom management through innovative technology, making education more accessible, efficient, and engaging for students, teachers, and administrators worldwide.' },
        { icon: <FaEye />, title: 'Our Vision', description: 'Creating a future where technology seamlessly integrates with education, empowering institutions to focus on what matters most - quality learning and student success.' },
        { icon: <FaHeart />, title: 'Our Values', description: 'Innovation, accessibility, security, and user-centric design drive everything we do. We believe in creating solutions that truly serve the educational community.' },
    ];

    const statsData = [
        { number: '50+', label: 'Educational Institutions' },
        { number: '10K+', label: 'Students Managed' },
        { number: '500+', label: 'Teachers Using Platform' },
        { number: '99.9%', label: 'System Uptime' },
    ]

  return (
    <section id="about" className="py-20 sm:py-24 lg:py-32 bg-white dark:bg-slate-900/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            About SCMS
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Revolutionizing education through intelligent classroom management solutions
          </p>
        </div>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {aboutData.map((item) => (
            <AboutCard key={item.title} {...item} />
          ))}
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {statsData.map(stat => <StatItem key={stat.label} {...stat} />)}
            </div>
        </div>
      </div>
    </section>
  );
};

export default About;