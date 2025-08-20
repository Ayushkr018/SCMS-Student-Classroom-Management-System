import { FaUserShield, FaChalkboardTeacher, FaUserGraduate, FaCheck } from 'react-icons/fa';

const RoleCard = ({ icon, title, description, features, color, buttonText }) => (
  <div className={`group bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-center transition-all duration-300 cursor-pointer hover:transform hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-black/20 ${color.hoverBorder}`}>
    <div className={`w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full text-white text-3xl shadow-lg ${color.bg}`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{title}</h3>
    <p className="text-slate-600 dark:text-slate-300 mb-8 h-20">{description}</p>
    <ul className="text-left space-y-3 mb-8">
      {features.map((feature) => (
        <li key={feature} className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <FaCheck className={color.text} />
          {feature}
        </li>
      ))}
    </ul>
    <button className={`w-full py-3 px-6 text-white font-semibold rounded-lg shadow-md transition-all duration-300 group-hover:transform group-hover:-translate-y-1 ${color.bg} ${color.hoverBg}`}>
      {buttonText}
    </button>
  </div>
);

const Roles = () => {
  const rolesData = [
    {
      icon: <FaUserShield />,
      title: 'Administrator',
      description: 'Complete system management with advanced analytics and user control capabilities.',
      features: ['User Management & Control', 'System-wide Analytics', 'Security & Compliance', 'Advanced Reporting'],
      color: {
        text: 'text-red-500',
        bg: 'bg-red-500',
        hoverBg: 'hover:bg-red-600',
        hoverBorder: 'hover:border-red-500'
      },
      buttonText: 'Access Admin Portal',
    },
    {
      icon: <FaChalkboardTeacher />,
      title: 'Teacher',
      description: 'Comprehensive classroom management tools for modern educators and faculty members.',
      features: ['Live Session Management', 'Attendance Tracking', 'Assignment Creation', 'Student Analytics'],
      color: {
        text: 'text-green-500',
        bg: 'bg-green-500',
        hoverBg: 'hover:bg-green-600',
        hoverBorder: 'hover:border-green-500'
      },
      buttonText: 'Access Teacher Portal',
    },
    {
      icon: <FaUserGraduate />,
      title: 'Student',
      description: 'Personalized learning dashboard with progress tracking and interactive tools.',
      features: ['Digital Check-in', 'Assignment Submission', 'Grade Tracking', 'Live Class Participation'],
      color: {
        text: 'text-blue-500',
        bg: 'bg-blue-600',
        hoverBg: 'hover:bg-accent-blue-dark',
        hoverBorder: 'hover:border-blue-500'
      },
      buttonText: 'Access Student Portal',
    },
  ];

  return (
    <section id="roles" className="py-20 sm:py-24 lg:py-32 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Choose Your Access Portal
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Select your role to access personalized dashboard and features
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rolesData.map((role) => (
            <RoleCard key={role.title} {...role} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roles;