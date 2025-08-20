import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaUser, FaRobot } from 'react-icons/fa';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Hello! Welcome to SCMS Support. How can I help you today?' }
    ]);
    const chatBodyRef = useRef(null);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const input = e.target.elements.message;
        const text = input.value.trim();
        if (text) {
            setMessages(prev => [...prev, { from: 'user', text }]);
            input.value = '';
            // Simulate bot response
            setTimeout(() => {
                 setMessages(prev => [...prev, { from: 'bot', text: "Thanks for your message. An agent will be with you shortly." }]);
            }, 1000);
        }
    };

    return (
        <>
            {/* Chat Window */}
            <div className={`fixed bottom-24 right-5 w-[calc(100vw-40px)] sm:w-[350px] h-[500px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-[1001] overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                {/* Chat Header */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 text-white p-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl"><FaRobot /></div>
                        <div>
                            <h4 className="font-semibold">SCMS Support</h4>
                            <span className="text-xs opacity-90">Online</span>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-xl p-2 rounded-lg transition-colors hover:bg-white/20"><FaTimes /></button>
                </div>
                {/* Messages Area */}
                <div ref={chatBodyRef} className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-800 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex gap-3 items-end ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                             <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white ${msg.from === 'user' ? 'bg-slate-400' : 'bg-blue-600 dark:bg-blue-500'}`}>
                                {msg.from === 'user' ? <FaUser /> : <FaRobot />}
                            </div>
                            <div className={`p-3 rounded-2xl max-w-[70%] text-sm ${msg.from === 'user' ? 'bg-blue-600 dark:bg-blue-500 text-white rounded-br-none' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-4 bg-white dark:bg-slate-900">
                    <input name="message" type="text" placeholder="Type your message..." className="flex-1 p-3 border-2 border-slate-200 dark:border-slate-700 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:outline-none" />
                    <button type="submit" className="w-10 h-10 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center text-base transition-all hover:bg-blue-700 dark:hover:bg-blue-600 hover:scale-105 flex-shrink-0">
                        <FaPaperPlane />
                    </button>
                </form>
            </div>

            {/* Chat Bubble */}
            <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-5 right-5 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 rounded-full flex items-center justify-center text-white text-2xl cursor-pointer shadow-2xl transition-all duration-300 z-[1000] hover:-translate-y-1 hover:scale-105">
                <FaComments />
            </button>
        </>
    );
};

export default ChatWidget;
