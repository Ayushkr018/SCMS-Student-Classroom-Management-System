console.log('💬 Chat JS loading...');

// Chat State
let chatState = {
    messages: [],
    currentUser: null,
    isTyping: false,
    lastMessageTime: 0,
    unreadCount: 0,
    isActive: true
};

// Initialize Chat System
function initializeChat() {
    chatState.currentUser = getCurrentUser();
    loadInitialMessages();
    startChatSimulation();
    setupChatInputHandlers();
    
    console.log('💬 Chat system initialized');
}

// Load Initial Chat Messages
function loadInitialMessages() {
    chatState.messages = [
        {
            id: 'msg-1',
            sender: 'Study Moderator',
            avatar: 'T',
            text: 'Welcome everyone! Let\'s start with integration problems. Feel free to ask questions anytime.',
            timestamp: Date.now() - 900000, // 15 min ago
            isTeacher: true,
            type: 'text'
        },
        {
            id: 'msg-2',
            sender: 'Sarah',
            avatar: 'S',
            text: 'Good morning! Ready for the session. I have some questions about u-substitution.',
            timestamp: Date.now() - 720000, // 12 min ago
            isTeacher: false,
            type: 'text'
        },
        {
            id: 'msg-3',
            sender: 'Mike',
            avatar: 'M',
            text: 'Can we work on problem #5 from the textbook? I\'m having trouble with it.',
            timestamp: Date.now() - 600000, // 10 min ago
            isTeacher: false,
            type: 'text'
        },
        {
            id: 'msg-4',
            sender: 'Study Moderator',
            avatar: 'T',
            text: 'Great question Mike! Let me solve that on the whiteboard. Everyone can follow along.',
            timestamp: Date.now() - 480000, // 8 min ago
            isTeacher: true,
            type: 'text'
        },
        {
            id: 'msg-5',
            sender: 'Rita',
            avatar: 'R',
            text: 'Thanks! This is really helpful. Could you also explain the chain rule application?',
            timestamp: Date.now() - 360000, // 6 min ago
            isTeacher: false,
            type: 'text'
        }
    ];
    
    displayChatMessages();
    updateChatBadge();
}

// Display Chat Messages
function displayChatMessages() {
    const chatArea = document.getElementById('chatArea');
    if (!chatArea) return;
    
    chatArea.innerHTML = '';
    
    chatState.messages.forEach((message, index) => {
        const messageElement = createMessageElement(message, index);
        chatArea.appendChild(messageElement);
    });
    
    // Auto-scroll to bottom
    setTimeout(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 100);
}

// Create Message Element
function createMessageElement(message, index) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    messageDiv.setAttribute('data-message-id', message.id);
    
    const isMe = message.sender === chatState.currentUser.name;
    const timeSinceMessage = Date.now() - message.timestamp;
    const isRecent = timeSinceMessage < 300000; // 5 minutes
    
    if (isMe) {
        messageDiv.classList.add('my-message');
    }
    
    if (isRecent) {
        messageDiv.classList.add('recent-message');
    }
    
    const timeString = formatMessageTime(message.timestamp);
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <div class="message-avatar ${message.isTeacher ? 'teacher' : (isMe ? 'me' : '')}">${message.avatar}</div>
            <div class="message-name">${message.sender}${isMe ? ' (You)' : ''}</div>
            <div class="message-time">${timeString}</div>
            ${message.isTeacher ? '<i class="fas fa-crown teacher-crown" title="Moderator"></i>' : ''}
        </div>
        <div class="message-text">${formatMessageText(message.text)}</div>
        ${message.type === 'system' ? '<div class="message-system-indicator"><i class="fas fa-info-circle"></i> System Message</div>' : ''}
    `;
    
    // Add animation for new messages
    if (index === chatState.messages.length - 1 && timeSinceMessage < 5000) {
        messageDiv.style.animation = 'messageSlideIn 0.3s ease';
    }
    
    return messageDiv;
}

// Format Message Time
function formatMessageTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const date = new Date(timestamp);
    
    if (diff < 60000) { // Less than 1 minute
        return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
        const minutes = Math.floor(diff / 60000);
        return `${minutes}m ago`;
    } else if (diff < 86400000) { // Less than 1 day
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

// Format Message Text (handle mentions, links, etc.)
function formatMessageText(text) {
    // Handle mentions (@username)
    text = text.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
    
    // Handle simple markdown
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Handle URLs (basic)
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="message-link">$1</a>');
    
    // Handle newlines
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// Setup Chat Input Handlers
function setupChatInputHandlers() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;
    
    let typingTimeout;
    
    // Typing indicator
    chatInput.addEventListener('input', function() {
        clearTimeout(typingTimeout);
        
        if (!chatState.isTyping && this.value.trim()) {
            chatState.isTyping = true;
            showTypingIndicator();
        }
        
        typingTimeout = setTimeout(() => {
            chatState.isTyping = false;
            hideTypingIndicator();
        }, 2000);
    });
    
    // Auto-resize input
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
    
    // Focus handling
    chatInput.addEventListener('focus', function() {
        markMessagesAsRead();
    });
}

// Handle Chat Enter Key
function handleChatEnter(event) {
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            // Allow new line with Shift+Enter
            return;
        } else {
            event.preventDefault();
            sendMessage();
        }
    }
}

// Send Message Function
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;
    
    const text = chatInput.value.trim();
    if (!text) return;
    
    const newMessage = {
        id: `msg-${Date.now()}`,
        sender: chatState.currentUser.name,
        avatar: chatState.currentUser.name.charAt(0).toUpperCase(),
        text: text,
        timestamp: Date.now(),
        isTeacher: false,
        type: 'text'
    };
    
    // Add message to state
    chatState.messages.push(newMessage);
    
    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // Hide typing indicator
    chatState.isTyping = false;
    hideTypingIndicator();
    
    // Display updated messages
    displayChatMessages();
    
    // Update last message time
    chatState.lastMessageTime = Date.now();
    
    // Show sent confirmation
    showNotification('💬 Message sent successfully!', 'success');
    
    // Simulate typing response from others (sometimes)
    if (Math.random() > 0.7) {
        setTimeout(() => {
            generateRandomResponse(text);
        }, 2000 + Math.random() * 3000);
    }
    
    // Save to localStorage
    saveChatHistory();
    
    console.log('💬 Message sent:', text);
}

// Generate Random Response (AI-like simulation)
function generateRandomResponse(originalMessage) {
    const responses = {
        greeting: [
            "Hello there! Great to see you in the session.",
            "Hi! Thanks for joining us today.",
            "Welcome! Let's learn together."
        ],
        question: [
            "That's a great question! Let me think about it.",
            "Interesting point! I'll help you with that.",
            "Good question - this is important to understand.",
            "Let me explain that concept step by step."
        ],
        help: [
            "I'm here to help! What specifically are you stuck on?",
            "Don't worry, we'll work through this together.",
            "That's totally normal - let's break it down.",
            "Great that you're asking questions!"
        ],
        thanks: [
            "You're very welcome! Happy to help.",
            "Glad I could help! Keep asking questions.",
            "No problem at all! That's what we're here for.",
            "Anytime! Learning together is the best way."
        ],
        general: [
            "Absolutely! That makes perfect sense.",
            "I agree! Good observation.",
            "That's exactly right!",
            "Great point! Thanks for sharing.",
            "Very interesting perspective!",
            "That's a smart approach to the problem."
        ]
    };
    
    let responseType = 'general';
    const msgLower = originalMessage.toLowerCase();
    
    if (msgLower.includes('hello') || msgLower.includes('hi') || msgLower.includes('hey')) {
        responseType = 'greeting';
    } else if (msgLower.includes('?') || msgLower.includes('how') || msgLower.includes('what') || msgLower.includes('why')) {
        responseType = 'question';
    } else if (msgLower.includes('help') || msgLower.includes('stuck') || msgLower.includes('confused')) {
        responseType = 'help';
    } else if (msgLower.includes('thank') || msgLower.includes('thanks') || msgLower.includes('appreciate')) {
        responseType = 'thanks';
    }
    
    const possibleResponses = responses[responseType];
    const randomResponse = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
    
    const respondents = [
        { name: 'Study Moderator', avatar: 'T', isTeacher: true },
        { name: 'Sarah', avatar: 'S', isTeacher: false },
        { name: 'Mike', avatar: 'M', isTeacher: false },
        { name: 'Rita', avatar: 'R', isTeacher: false }
    ];
    
    const randomRespondent = respondents[Math.floor(Math.random() * respondents.length)];
    
    const responseMessage = {
        id: `msg-${Date.now()}`,
        sender: randomRespondent.name,
        avatar: randomRespondent.avatar,
        text: randomResponse,
        timestamp: Date.now(),
        isTeacher: randomRespondent.isTeacher,
        type: 'text'
    };
    
    // Add response to messages
    chatState.messages.push(responseMessage);
    displayChatMessages();
    
    // Update badge if user is not in chat tab
    const chatTab = document.getElementById('chatTab');
    if (!chatTab || !chatTab.classList.contains('active')) {
        chatState.unreadCount++;
        updateChatBadge();
        
        // Show notification
        showNotification(`💬 New message from ${randomRespondent.name}`, 'info');
    }
    
    saveChatHistory();
}

// Start Chat Simulation (random messages)
function startChatSimulation() {
    // Random teacher messages
    const teacherMessages = [
        "Remember to take notes on the key concepts we're covering.",
        "This topic will be important for your upcoming exam.",
        "Feel free to use the whiteboard to work out problems.",
        "Great participation everyone! Keep it up.",
        "Let's take a quick 2-minute break to stretch.",
        "Any questions about what we've covered so far?",
        "Make sure you're following along with the examples.",
        "We'll have a quick quiz on this material next class."
    ];
    
    // Random student messages
    const studentMessages = [
        "This is really helpful, thanks!",
        "Could you go over that last part again?",
        "I think I understand now.",
        "What textbook chapter covers this?",
        "Is this going to be on the test?",
        "Great explanation!",
        "I have a similar question...",
        "This makes much more sense now.",
        "Could you show another example?",
        "Thanks for the clarification!"
    ];
    
    // Send random teacher message every 3-5 minutes
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance
            const randomMessage = teacherMessages[Math.floor(Math.random() * teacherMessages.length)];
            const teacherMessage = {
                id: `msg-${Date.now()}`,
                sender: 'Study Moderator',
                avatar: 'T',
                text: randomMessage,
                timestamp: Date.now(),
                isTeacher: true,
                type: 'text'
            };
            
            chatState.messages.push(teacherMessage);
            displayChatMessages();
            
            // Update badge if not active
            const chatTab = document.getElementById('chatTab');
            if (!chatTab || !chatTab.classList.contains('active')) {
                chatState.unreadCount++;
                updateChatBadge();
            }
            
            saveChatHistory();
        }
    }, 180000 + Math.random() * 120000); // 3-5 minutes
    
    // Send random student message every 2-4 minutes
    setInterval(() => {
        if (Math.random() > 0.8) { // 20% chance
            const randomMessage = studentMessages[Math.floor(Math.random() * studentMessages.length)];
            const students = [
                { name: 'Sarah', avatar: 'S' },
                { name: 'Mike', avatar: 'M' },
                { name: 'Rita', avatar: 'R' },
                { name: 'David', avatar: 'D' },
                { name: 'Emma', avatar: 'E' }
            ];
            
            const randomStudent = students[Math.floor(Math.random() * students.length)];
            
            const studentMessage = {
                id: `msg-${Date.now()}`,
                sender: randomStudent.name,
                avatar: randomStudent.avatar,
                text: randomMessage,
                timestamp: Date.now(),
                isTeacher: false,
                type: 'text'
            };
            
            chatState.messages.push(studentMessage);
            displayChatMessages();
            
            // Update badge if not active
            const chatTab = document.getElementById('chatTab');
            if (!chatTab || !chatTab.classList.contains('active')) {
                chatState.unreadCount++;
                updateChatBadge();
            }
            
            saveChatHistory();
        }
    }, 120000 + Math.random() * 120000); // 2-4 minutes
}

// Typing Indicator Functions
function showTypingIndicator() {
    const chatArea = document.getElementById('chatArea');
    if (!chatArea || document.querySelector('.typing-indicator')) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="typing-avatar">${chatState.currentUser.name.charAt(0)}</div>
        <div class="typing-text">
            <span>${chatState.currentUser.name} is typing</span>
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    // Add typing indicator styles
    if (!document.querySelector('.typing-styles')) {
        const style = document.createElement('style');
        style.className = 'typing-styles';
        style.textContent = `
            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                margin: 5px 0;
                background: rgba(37, 99, 235, 0.1);
                border-radius: 8px;
                font-size: 0.8rem;
                color: var(--accent-blue);
                animation: fadeIn 0.3s ease;
            }
            .typing-avatar {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: var(--accent-blue);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.7rem;
                font-weight: 600;
            }
            .typing-dots {
                display: inline-flex;
                gap: 2px;
                margin-left: 5px;
            }
            .typing-dots span {
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: var(--accent-blue);
                animation: typingDot 1.4s infinite ease-in-out;
            }
            .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
            .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typingDot {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `;
        document.head.appendChild(style);
    }
    
    chatArea.appendChild(typingDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Update Chat Badge
function updateChatBadge() {
    const chatBadge = document.getElementById('chatBadge');
    if (!chatBadge) return;
    
    if (chatState.unreadCount > 0) {
        chatBadge.textContent = chatState.unreadCount > 99 ? '99+' : chatState.unreadCount.toString();
        chatBadge.style.display = 'inline';
        
        // Animate badge
        chatBadge.style.animation = 'badgePulse 0.5s ease';
        setTimeout(() => {
            chatBadge.style.animation = '';
        }, 500);
    } else {
        chatBadge.textContent = '0';
        chatBadge.style.display = 'none';
    }
    
    // Add badge animation styles
    if (!document.querySelector('.badge-styles')) {
        const style = document.createElement('style');
        style.className = 'badge-styles';
        style.textContent = `
            @keyframes badgePulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.3); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Mark Messages as Read
function markMessagesAsRead() {
    chatState.unreadCount = 0;
    updateChatBadge();
}

// Save Chat History
function saveChatHistory() {
    const chatHistory = {
        roomId: roomState ? roomState.roomId : 'room-1',
        messages: chatState.messages.slice(-50), // Keep last 50 messages
        lastUpdated: Date.now()
    };
    
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Load Chat History
function loadChatHistory() {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
        const chatHistory = JSON.parse(saved);
        if (chatHistory.roomId === (roomState ? roomState.roomId : 'room-1')) {
            chatState.messages = [...chatHistory.messages];
            displayChatMessages();
        }
    }
}

// Chat Commands
function handleChatCommands(text) {
    if (!text.startsWith('/')) return false;
    
    const [command, ...args] = text.slice(1).split(' ');
    
    switch (command.toLowerCase()) {
        case 'help':
            showChatHelp();
            return true;
        case 'clear':
            clearChatHistory();
            return true;
        case 'time':
            sendSystemMessage(`Current time: ${new Date().toLocaleTimeString()}`);
            return true;
        case 'participants':
            const count = roomState ? roomState.participants.length : 4;
            sendSystemMessage(`${count} participants in this room`);
            return true;
        default:
            sendSystemMessage(`Unknown command: /${command}. Type /help for available commands.`);
            return true;
    }
}

// System Messages
function sendSystemMessage(text) {
    const systemMessage = {
        id: `sys-${Date.now()}`,
        sender: 'System',
        avatar: '⚙️',
        text: text,
        timestamp: Date.now(),
        isTeacher: false,
        type: 'system'
    };
    
    chatState.messages.push(systemMessage);
    displayChatMessages();
}

// Show Chat Help
function showChatHelp() {
    const helpText = `Available chat commands:
/help - Show this help message
/clear - Clear chat history
/time - Show current time
/participants - Show participant count

Chat features:
• @username - Mention someone
• **bold** - Bold text
• *italic* - Italic text
• \`code\` - Code formatting
• Shift+Enter - New line`;
    
    sendSystemMessage(helpText);
}

// Clear Chat History
function clearChatHistory() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        chatState.messages = [];
        displayChatMessages();
        saveChatHistory();
        showNotification('💬 Chat history cleared', 'info');
    }
}

// Export Chat
function exportChat() {
    const chatData = chatState.messages.map(msg => ({
        time: formatMessageTime(msg.timestamp),
        sender: msg.sender,
        message: msg.text
    }));
    
    const csvContent = [
        'Time,Sender,Message',
        ...chatData.map(row => `"${row.time}","${row.sender}","${row.message}"`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-export-${roomState ? roomState.roomId : 'room'}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification('💬 Chat exported successfully!', 'success');
}

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat after room is loaded
    setTimeout(() => {
        initializeChat();
        
        // Load chat history if available
        loadChatHistory();
        
        // Mark as read when chat tab is selected
        document.addEventListener('click', function(e) {
            if (e.target.closest('#chatTab')) {
                markMessagesAsRead();
            }
        });
        
    }, 500);
});

// Add message animation styles
const messageStyles = document.createElement('style');
messageStyles.textContent = `
    .my-message {
        background: rgba(37, 99, 235, 0.1) !important;
        border-left: 3px solid var(--accent-blue);
    }
    .recent-message {
        box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
    }
    .teacher-crown {
        color: var(--accent-yellow);
        font-size: 0.7rem;
        margin-left: 4px;
    }
    .mention {
        background: rgba(37, 99, 235, 0.2);
        color: var(--accent-blue);
        padding: 2px 4px;
        border-radius: 4px;
        font-weight: 600;
    }
    .message-link {
        color: var(--accent-blue);
        text-decoration: none;
        border-bottom: 1px dashed;
    }
    .message-link:hover {
        text-decoration: none;
        border-bottom: 1px solid;
    }
    .message-system-indicator {
        font-size: 0.7rem;
        color: var(--text-tertiary);
        margin-top: 4px;
        font-style: italic;
    }
    @keyframes messageSlideIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(messageStyles);

console.log('💬 Chat JS fully loaded!');
