import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const SignupModal = ({ closeModal, switchToLogin }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative border border-slate-200 dark:border-slate-700">
        <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <FaTimes size={20} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign Up Currently Disabled</h2>
          <p className="text-slate-500 dark:text-slate-400">Database integration in progress</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 rounded-lg p-4 mb-6 flex items-start gap-4">
          <FaExclamationTriangle className="text-xl mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-bold">Feature Under Development</h4>
            <p className="text-sm mt-1">Sign up functionality is currently disabled. Please use the demo login credentials to explore the platform.</p>
          </div>
        </div>
        
        <div className="opacity-50 pointer-events-none">
          <form>
            <div className="space-y-4">
              <input type="text" disabled className="form-input" placeholder="Enter your full name" />
              <input type="email" disabled className="form-input" placeholder="Enter your email" />
              <select disabled className="form-input">
                <option>Select your role</option>
              </select>
              <input type="password" disabled className="form-input" placeholder="Create a password" />
            </div>
            <button type="button" disabled className="w-full py-3 mt-6 bg-slate-400 dark:bg-slate-600 text-white font-semibold rounded-lg cursor-not-allowed">
                Create Account (Disabled)
            </button>
          </form>
        </div>

        <div className="text-center mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Want to explore the platform?{' '}
                <button onClick={switchToLogin} className="font-semibold text-blue-600 hover:underline">Use Demo Login</button>
            </p>
        </div>

      </div>
      <style jsx>{`
        .form-input {
            @apply w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg;
        }
      `}</style>
    </div>
  );
};

export default SignupModal;