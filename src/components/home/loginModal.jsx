import { FaTimes, FaKey, FaUserShield, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';

const DemoCredential = ({ role, icon, email, password, onFill }) => {
  const colors = {
    admin: 'text-red-600 dark:text-red-400',
    teacher: 'text-green-600 dark:text-green-400',
    student: 'text-blue-600 dark:text-blue-400',
  };
  return (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
      <div className={`flex items-center justify-between text-sm font-semibold mb-1 ${colors[role]}`}>
        <div className="flex items-center gap-2">
          {icon}
          <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
        </div>
        <button onClick={() => onFill(email, password, role)} className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-blue-500 hover:text-white transition-colors">Fill</button>
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400">
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Password:</strong> {password}</p>
      </div>
    </div>
  );
};

const QuickDemoButton = ({ role, icon, text, onClick, colorClasses }) => (
    <button onClick={() => onClick(role)} className={`w-full flex items-center justify-center gap-2 py-2.5 border-2 rounded-lg font-semibold transition-colors duration-300 ${colorClasses}`}>
        {icon}
        {text}
    </button>
);

const LoginModal = ({ closeModal, switchToSignup }) => {

    const fillCredentials = (email, password, role) => {
        document.getElementById('loginEmail').value = email;
        document.getElementById('loginPassword').value = password;
        document.getElementById('loginRole').value = role;
    };

    const handleLogin = (e) => {
        e.preventDefault();
        alert('Login functionality is for demo purposes.');
        closeModal();
    }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative border border-slate-200 dark:border-slate-700">
        <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <FaTimes size={20} />
        </button>

        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back!</h2>
            <p className="text-slate-500 dark:text-slate-400">Sign in to your account</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6">
            <h3 className="flex items-center gap-2 font-semibold mb-3 text-slate-800 dark:text-slate-200"><FaKey /> Demo Login Credentials</h3>
            <div className="space-y-3">
                <DemoCredential role="admin" icon={<FaUserShield/>} email="admin@scms.edu" password="admin123" onFill={fillCredentials} />
                <DemoCredential role="teacher" icon={<FaChalkboardTeacher/>} email="teacher@scms.edu" password="teacher123" onFill={fillCredentials} />
                <DemoCredential role="student" icon={<FaUserGraduate/>} email="student@scms.edu" password="student123" onFill={fillCredentials} />
            </div>
        </div>
        
        <form onSubmit={handleLogin}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="loginEmail">Email Address</label>
                    <input type="email" id="loginEmail" required className="form-input" placeholder="Enter your email" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="loginPassword">Password</label>
                    <input type="password" id="loginPassword" required className="form-input" placeholder="Enter your password" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="loginRole">Role</label>
                    <select id="loginRole" required className="form-input">
                        <option value="">Select your role</option>
                        <option value="admin">Administrator</option>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                    </select>
                </div>
            </div>
            <button type="submit" className="w-full py-3 mt-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-accent-blue-dark transition-colors duration-300">Sign In</button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Don't have an account?{' '}
                <button onClick={switchToSignup} className="font-semibold text-blue-600 hover:underline">Create Account</button>
            </p>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-center font-semibold text-slate-600 dark:text-slate-400 mb-3">Quick Demo Access</h3>
            <div className="space-y-2">
                <QuickDemoButton role="admin" icon={<FaUserShield/>} text="Admin Demo" colorClasses="border-red-200 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-400/50 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white" />
                <QuickDemoButton role="teacher" icon={<FaChalkboardTeacher/>} text="Teacher Demo" colorClasses="border-green-200 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400/50 dark:text-green-400 dark:hover:bg-green-500 dark:hover:text-white" />
                <QuickDemoButton role="student" icon={<FaUserGraduate/>} text="Student Demo" colorClasses="border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400/50 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white" />
            </div>
        </div>

      </div>
       <style jsx>{`
            .form-input {
                @apply w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300;
            }
       `}</style>
    </div>
  );
};

export default LoginModal;