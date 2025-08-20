import { useState } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaHeadset, FaRobot} from 'react-icons/fa';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Hello! Welcome to SCMS Support. How can I help you today?', time: 'Just now' }
    ]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const input = e.target.elements.message;
        const messageText = input.value.trim();
        if(messageText) {
            const newMessages = [...messages, { from: 'user', text: messageText, time: 'Just now' }];
            setMessages(newMessages);
            input.value = '';
            // Simulate bot response
            setTimeout(() => {
                setMessages([...newMessages, { from: 'bot', text: 'Thanks for your message! An agent will be with you shortly.', time: 'Just now' }]);
            }, 1000);
        }
    }

  return (
    <>
      <button 
        onClick={toggleChat} 
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-accent-blue-light to-accent-blue-dark text-white rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 hover:-translate-y-1 z-50"
        aria-label="Open chat"
      >
        <FaComments size={24} />
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">1</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 bg-gradient-to-br from-accent-blue-light to-accent-blue-dark text-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full">
                        <FaHeadset size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold">SCMS Support</h4>
                        <span className="text-xs opacity-80">Online</span>
                    </div>
                </div>
                <button onClick={toggleChat} className="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Close chat">
                    <FaTimes size={20} />
                </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-800 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.from === 'user' ? 'justify-end' : ''}`}>
                        {msg.from === 'bot' && (
                            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-blue-600 text-white rounded-full">
                                <FaRobot />
                            </div>
                        )}
                        <div className={`max-w-[75%] p-3 rounded-2xl ${msg.from === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-600'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <span className={`text-xs mt-1 block ${msg.from === 'user' ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'}`}>{msg.time}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center gap-2">
                <input 
                    name="message"
                    type="text" 
                    placeholder="Type your message..."
                    className="flex-1 w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button type="submit" className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-blue-600 text-white rounded-full transition-colors hover:bg-accent-blue-dark">
                    <FaPaperPlane />
                </button>
            </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;