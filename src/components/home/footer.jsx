import { FaTwitter, FaLinkedin, FaFacebook, FaYoutube } from 'react-icons/fa';

const FooterLink = ({ href, children }) => (
    <li><a href={href} className="text-slate-400 hover:text-blue-600 dark:hover:text-accent-blue-light transition-colors duration-200">{children}</a></li>
);

const SocialIcon = ({ href, icon, brandColor }) => (
    <a href={href} className={`w-10 h-10 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-lg text-lg ${brandColor} hover:text-white transition-all duration-300 hover:-translate-y-1`}>
        {icon}
    </a>
);

const Footer = ({ openContactModal }) => {
    const socialLinks = [
        { href: '#', icon: <FaTwitter />, brandColor: 'hover:bg-[#1DA1F2] text-[#1DA1F2]' },
        { href: '#', icon: <FaLinkedin />, brandColor: 'hover:bg-[#0A66C2] text-[#0A66C2]' },
        { href: '#', icon: <FaFacebook />, brandColor: 'hover:bg-[#1877F2] text-[#1877F2]' },
        { href: '#', icon: <FaYoutube />, brandColor: 'hover:bg-[#FF0000] text-[#FF0000]' },
    ];
  return (
    <footer className="bg-slate-800 dark:bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* SCMS Info */}
            <div className="md:col-span-2 lg:col-span-1">
                <h3 className="text-lg font-semibold text-white mb-4">SCMS Platform</h3>
                <p className="text-sm mb-6">Smart Classroom Management System for modern educational institutions. Empowering education through technology.</p>
                <h4 className="text-md font-semibold text-white mb-3">Connect With Us</h4>
                <div className="flex items-center gap-3">
                    {socialLinks.map(link => <SocialIcon key={link.brandColor} {...link} />)}
                </div>
            </div>

            {/* Quick Links */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                    <FooterLink href="#features">Features</FooterLink>
                    <FooterLink href="#roles">Access Portal</FooterLink>
                    <FooterLink href="#about">About Us</FooterLink>
                    <FooterLink href="#help">Help Center</FooterLink>
                </ul>
            </div>

            {/* Support */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
                <ul className="space-y-2 text-sm">
                    <li><button onClick={openContactModal} className="text-slate-400 hover:text-blue-600 dark:hover:text-accent-blue-light transition-colors duration-200 text-left">Contact Us</button></li>
                    <li><button onClick={openContactModal} className="text-slate-400 hover:text-blue-600 dark:hover:text-accent-blue-light transition-colors duration-200 text-left">Contact Support</button></li>
                    <FooterLink href="#help">Help Documentation</FooterLink>
                    <li><button className="text-slate-400 hover:text-blue-600 dark:hover:text-accent-blue-light transition-colors duration-200 text-left">Live Chat Support</button></li>
                </ul>
            </div>
        </div>
        <div className="mt-16 border-t border-slate-700 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} SCMS - Student Classroom Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;