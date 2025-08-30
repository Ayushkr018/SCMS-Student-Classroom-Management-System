import React from "react";
import {
	FaQrcode,
	FaChartLine,
	FaChalkboardTeacher,
	FaTasks,
	FaMobileAlt,
	FaShieldAlt,
} from "react-icons/fa";

const featureData = [
	{
		icon: <FaQrcode />,
		title: "Smart Attendance Tracking",
		desc: "Advanced QR code and facial recognition system with real-time attendance monitoring.",
		color: "bg-[linear-gradient(135deg,#3b82f6,#1d4ed8)]",
	},
	{
		icon: <FaChartLine />,
		title: "Real-time Analytics",
		desc: "Comprehensive dashboards with student performance tracking, attendance patterns, and predictive insights.",
		color: "bg-[linear-gradient(135deg,#10b981,#059669)]",
	},
	{
		icon: <FaChalkboardTeacher />,
		title: "Interactive Live Sessions",
		desc: "Virtual classrooms with whiteboard tools, screen sharing, polls, and real-time student engagement features.",
		color: "bg-[linear-gradient(135deg,#8b5cf6,#7c3aed)]",
	},
	{
		icon: <FaTasks />,
		title: "Assignment Management",
		desc: "Complete assignment lifecycle with submission tracking, automated grading, and detailed feedback systems.",
		color: "bg-[linear-gradient(135deg,#f59e0b,#d97706)]",
	},
	{
		icon: <FaMobileAlt />,
		title: "Mobile Responsive",
		desc: "Fully optimized mobile experience with offline capabilities and native app-like performance.",
		color: "bg-[linear-gradient(135deg,#ef4444,#dc2626)]",
	},
	{
		icon: <FaShieldAlt />,
		title: "Enterprise Security",
		desc: "Bank-level security with data encryption, role-based access control, and compliance with educational standards.",
		color: "bg-[linear-gradient(135deg,#6366f1,#4f46e5)]",
	},
];

const Features = () => (
	<section id="features" className="py-20 px-4 bg-white dark:bg-slate-900">
		<div className="max-w-7xl mx-auto">
			<div className="text-center mb-16 max-w-2xl mx-auto">
				<h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
					Powerful Features for Modern Education
				</h2>
				<p className="text-lg text-slate-600 dark:text-slate-300">
					Everything you need to manage classrooms efficiently and enhance
					learning outcomes
				</p>
			</div>
			<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				{featureData.map((feature, index) => (
					<div
						key={index}
						className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-blue-500/50 dark:hover:border-blue-500/50"
					>
						<div
							className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-white mb-6 ${feature.color}`}
						>
							{feature.icon}
						</div>
						<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
							{feature.title}
						</h3>
						<p className="text-slate-600 dark:text-slate-300 leading-relaxed">
							{feature.desc}
						</p>
					</div>
				))}
			</div>
		</div>
	</section>
);

export default Features;
