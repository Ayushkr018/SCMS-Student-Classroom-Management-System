import { FaSearch, FaRocket, FaChalkboardTeacher, FaUserGraduate, FaUserShield, FaCog, FaQuestionCircle } from 'react-icons/fa';

const HelpCategory = ({ icon, title, links }) => (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-black/20 hover:border-blue-500">
        <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue-light to-accent-blue-dark text-white text-2xl">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{title}</h3>
        <ul className="space-y-2">
            {links.map(link => (
                <li key={link.text}>
                    <a href={link.href} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-accent-blue-light transition-colors duration-200">{link.text}</a>
                </li>
            ))}
        </ul>
    </div>
);


const Help = () => {
    const categories = [
        { icon: <FaRocket />, title: 'Getting Started', links: [{text: 'Initial Setup Guide', href: '#'}, {text: 'Login & Account Management', href: '#'}, {text: 'Platform Navigation', href: '#'}, {text: 'Understanding User Roles', href: '#'}] },
        { icon: <FaChalkboardTeacher />, title: 'For Teachers', links: [{text: 'Managing Classes', href: '#'}, {text: 'Attendance Tracking', href: '#'}, {text: 'Creating Assignments', href: '#'}, {text: 'Grading System', href: '#'}] },
        { icon: <FaUserGraduate />, title: 'For Students', links: [{text: 'Digital Check-in Process', href: '#'}, {text: 'Assignment Submissions', href: '#'}, {text: 'Viewing Grades', href: '#'}, {text: 'Class Schedule', href: '#'}] },
        { icon: <FaUserShield />, title: 'For Administrators', links: [{text: 'User Management', href: '#'}, {text: 'System Analytics', href: '#'}, {text: 'Security Settings', href: '#'}, {text: 'Generating Reports', href: '#'}] },
        { icon: <FaCog />, title: 'Technical Support', links: [{text: 'Troubleshooting Guide', href: '#'}, {text: 'Mobile App Issues', href: '#'}, {text: 'Browser Compatibility', href: '#'}, {text: 'Performance Optimization', href: '#'}] },
        { icon: <FaQuestionCircle />, title: 'FAQ', links: [{text: 'Pricing & Plans', href: '#'}, {text: 'Data Privacy & Security', href: '#'}, {text: 'Third-party Integrations', href: '#'}, {text: 'System Updates', href: '#'}] },
    ];

  return (
    <section id="help" className="py-20 sm:py-24 lg:py-32 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Help Center
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Find answers to common questions and get the support you need
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="text-slate-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search for help topics, tutorials, or FAQs..."
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-300"
                />
            </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(category => <HelpCategory key={category.title} {...category} />)}
        </div>
      </div>
    </section>
  );
};

export default Help;