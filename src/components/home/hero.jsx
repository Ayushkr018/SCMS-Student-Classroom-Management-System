import { FaRocket, FaPlayCircle, FaUsers, FaBook, FaTasks, FaChartBar } from 'react-icons/fa';

const Hero = ({ openSignupModal }) => {
  const stats = [
    { number: '2,500+', label: 'Active Users' },
    { number: '98.5%', label: 'Accuracy Rate' },
    { number: '24/7', label: 'Support' },
  ];

  const dashboardItems = [
    { icon: <FaUsers />, text: "Today's Attendance", value: '94.2%', color: 'text-green-500' },
    { icon: <FaBook />, text: 'Active Classes', value: '12', color: 'text-blue-500' },
    { icon: <FaTasks />, text: 'Assignments Due', value: '5', color: 'text-amber-500' },
  ];

  return (
    <section className="bg-slate-50 dark:bg-slate-800/50 py-20 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Smart Classroom Management for the <span className="text-blue-600 dark:text-accent-blue-light">Digital Age</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0">
            Revolutionary education platform with AI-powered attendance tracking, real-time analytics, and seamless classroom management tools.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button onClick={openSignupModal} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-accent-blue-dark transition-all duration-300 transform hover:-translate-y-1">
              <FaRocket />
              Get Started Free
            </button>
            <a href="#features" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:border-blue-600 dark:hover:border-accent-blue-light hover:text-blue-600 dark:hover:text-accent-blue-light transition-all duration-300 transform hover:-translate-y-1">
              <FaPlayCircle />
              Watch Demo
            </a>
          </div>
          <div className="mt-12 flex justify-center lg:justify-start gap-8 sm:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="block text-3xl sm:text-4xl font-bold text-blue-600 dark:text-accent-blue-light">{stat.number}</span>
                <span className="block mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Visual */}
        <div className="flex justify-center">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-black/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-600 dark:bg-accent-blue-light rounded-lg text-white text-2xl">
                <FaChartBar />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Live Dashboard</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Real-time classroom insights</p>
              </div>
            </div>
            <div className="space-y-4">
              {dashboardItems.map((item) => (
                <div key={item.text} className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-accent-blue-light rounded-md">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{item.text}</span>
                  </div>
                  <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;