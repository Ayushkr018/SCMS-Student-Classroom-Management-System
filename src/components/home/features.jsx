import { FaQrcode, FaChartLine, FaChalkboardTeacher, FaTasks, FaMobileAlt, FaShieldAlt } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description, colorClass }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 hover:border-blue-500 dark:hover:border-accent-blue-light">
    <div className={`w-16 h-16 mb-6 flex items-center justify-center rounded-xl text-white text-3xl ${colorClass}`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{title}</h3>
    <p className="text-slate-600 dark:text-slate-300">{description}</p>
  </div>
);

const Features = () => {
  const featuresData = [
    {
      icon: <FaQrcode />,
      title: 'Smart Attendance Tracking',
      description: 'Advanced QR code and facial recognition system with real-time attendance monitoring and automated notifications.',
      colorClass: 'bg-gradient-to-br from-blue-500 to-blue-700',
    },
    {
      icon: <FaChartLine />,
      title: 'Real-time Analytics',
      description: 'Comprehensive dashboards with student performance tracking, attendance patterns, and predictive insights.',
      colorClass: 'bg-gradient-to-br from-green-500 to-green-700',
    },
    {
      icon: <FaChalkboardTeacher />,
      title: 'Interactive Live Sessions',
      description: 'Virtual classrooms with whiteboard tools, screen sharing, polls, and real-time student engagement features.',
      colorClass: 'bg-gradient-to-br from-purple-500 to-purple-700',
    },
    {
      icon: <FaTasks />,
      title: 'Assignment Management',
      description: 'Complete assignment lifecycle with submission tracking, automated grading, and detailed feedback systems.',
      colorClass: 'bg-gradient-to-br from-orange-500 to-orange-700',
    },
    {
      icon: <FaMobileAlt />,
      title: 'Mobile Responsive',
      description: 'Fully optimized mobile experience with offline capabilities and native app-like performance.',
      colorClass: 'bg-gradient-to-br from-red-500 to-red-700',
    },
    {
      icon: <FaShieldAlt />,
      title: 'Enterprise Security',
      description: 'Bank-level security with data encryption, role-based access control, and compliance with educational standards.',
      colorClass: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-24 lg:py-32 bg-white dark:bg-slate-900/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Powerful Features for Modern Education
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Everything you need to manage classrooms efficiently and enhance learning outcomes
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;