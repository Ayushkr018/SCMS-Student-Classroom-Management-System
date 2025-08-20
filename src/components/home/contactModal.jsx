import { FaTimes, FaEnvelope, FaPhone, FaComments, FaPaperPlane } from 'react-icons/fa';

const ContactMethod = ({ icon, title, detail, time, button }) => (
    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-accent-blue-light to-accent-blue-dark text-white rounded-lg text-xl">
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">{detail}</p>
            {time && <span className="text-xs text-slate-400 dark:text-slate-500">{time}</span>}
            {button && button}
        </div>
    </div>
);

const ContactModal = ({ closeModal }) => {

    const handleFormSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        closeModal();
    }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-slate-200 dark:border-slate-700">
        <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <FaTimes size={20} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Us</h2>
          <p className="text-slate-500 dark:text-slate-400">Get in touch with our support team</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mb-8">
            <ContactMethod icon={<FaEnvelope />} title="Email Support" detail="support@scms.edu" time="Response within 2-4 hours" />
            <ContactMethod icon={<FaPhone />} title="Phone Support" detail="+1 (555) 123-4567" time="Mon-Fri: 8AM - 8PM EST" />
            <ContactMethod 
                icon={<FaComments />} 
                title="Live Chat" 
                detail="Instant support" 
                button={<button className="mt-1 px-3 py-1 text-xs bg-green-500 text-white rounded-full hover:bg-green-600 transition">Start Chat</button>} 
            />
        </div>

        <form onSubmit={handleFormSubmit}>
            <h3 className="text-lg font-semibold text-center mb-4 text-slate-800 dark:text-slate-200">Send us a Message</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="form-label" htmlFor="contactName">Full Name</label>
                    <input type="text" id="contactName" required className="form-input" placeholder="Enter your full name" />
                </div>
                <div>
                    <label className="form-label" htmlFor="contactEmail">Email Address</label>
                    <input type="email" id="contactEmail" required className="form-input" placeholder="Enter your email" />
                </div>
            </div>
             <div className="mb-4">
                <label className="form-label" htmlFor="contactSubject">Subject</label>
                <select id="contactSubject" required className="form-input">
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="bug">Report a Bug</option>
                </select>
            </div>
            <div className="mb-6">
                <label className="form-label" htmlFor="contactMessage">Message</label>
                <textarea id="contactMessage" required rows="4" className="form-input" placeholder="Describe your question or issue..."></textarea>
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-accent-blue-dark transition-colors duration-300">
                <FaPaperPlane/>
                Send Message
            </button>
        </form>

      </div>
      <style jsx>{`
        .form-input {
            @apply w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300;
        }
        .form-label {
            @apply block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1;
        }
      `}</style>
    </div>
  );
};

export default ContactModal;