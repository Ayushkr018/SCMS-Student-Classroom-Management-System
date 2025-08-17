// chat.js - FIXED VERSION with working API calls

const GEMINI_API_KEY = 'AIzaSyAJ6niwBWd5Y17_R85NkFqKXbJnOr7GHTw';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const HELP_BOT_NAME = "KIA Assistant";
const ALLOWED_TOPICS_HINT = "You can ask KIA about teaching, attendance, exams, time management, student engagement, digital classroom tools, or personal teaching productivity.";

let helpbotState = {
    isOpen: false,
    messages: [],
    isTyping: false
};

// ---- ENTRY POINT ----
window.openChatBot = function() {
    if (helpbotState.isOpen) return;
    renderHelpBotChat();
    helpbotState.isOpen = true;
};

// ---- RENDER UI ----
function renderHelpBotChat() {
    let existing = document.getElementById('helpbot-container');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.id = 'helpbot-container';
    container.className = 'helpbot-container';
    
    container.innerHTML = `
        <div class="helpbot-modal">
            <div class="helpbot-header">
                <div class="helpbot-avatar"><i class="fas fa-robot"></i></div>
                <div class="helpbot-title">${HELP_BOT_NAME} — Teaching & Management Assistant</div>
                <button class="helpbot-close-btn" title="Close" onclick="closeHelpBot()"><i class="fas fa-times"></i></button>
            </div>
            <div class="helpbot-body" id="helpbot-messages"></div>
            <div class="helpbot-footer">
                <form id="helpbot-form" autocomplete="off">
                    <input id="helpbot-input" type="text" placeholder="Ask about teaching, class tools, exams..." maxlength="300" autofocus />
                    <button type="submit" id="helpbot-send-btn" title="Send"><i class="fas fa-paper-plane"></i></button>
                    <button type="button" class="helpbot-reset-btn" title="Reset conversation" onclick="resetHelpBot()"><i class="fas fa-sync-alt"></i></button>
                </form>
            </div>
            <div class="helpbot-hint">${ALLOWED_TOPICS_HINT}</div>
        </div>
    `;

    document.body.appendChild(container);
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        const input = document.getElementById('helpbot-input');
        if (input) input.focus();
    }, 150);

    initialBotGreet();

    const form = document.getElementById('helpbot-form');
    if (form) {
        form.onsubmit = async function(e) {
            e.preventDefault();
            const input = document.getElementById('helpbot-input');
            if (!input) return;
            
            const q = input.value.trim();
            if (!q || helpbotState.isTyping) return;
            
            appendToHelpBotChat('user', q);
            input.value = '';
            await handleHelpBotQuery(q);
        };
    }

    document.addEventListener('keydown', closeOnEsc);
}

function closeOnEsc(e) {
    if (e.key === 'Escape') closeHelpBot();
}

// ---- MESSAGE LOGIC ----
function appendToHelpBotChat(role, message, opts = {}) {
    const messagesContainer = document.getElementById('helpbot-messages');
    if (!messagesContainer) return;

    const msgNode = document.createElement('div');
    msgNode.className = `helpbot-msg helpbot-${role === 'user' ? 'user' : 'bot'}`;
    
    if (opts.typing) {
        msgNode.classList.add('typing');
        msgNode.id = 'helpbot-typing-msg';
    }

    const avatarIcon = role === 'user' ? 'fa-user' : 'fa-robot';
    
    msgNode.innerHTML = `
        <div class="helpbot-msg-avatar">
            <i class="fas ${avatarIcon}"></i>
        </div>
        <div class="helpbot-msg-content">${message}</div>
    `;

    messagesContainer.appendChild(msgNode);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function initialBotGreet() {
    if (helpbotState.messages.length === 0) {
        const greetMessage = `Hello 👋, I'm KIA! I'm here to help you with teaching, attendance, management, productivity, and digital classroom tools. What would you like to know?`;
        
        appendToHelpBotChat('bot', greetMessage);
        
        helpbotState.messages = [
            { role: "assistant", content: greetMessage }
        ];
    }
}

function showTypingIndicator() {
    const typingHTML = `
        <div class="helpbot-typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    appendToHelpBotChat('bot', typingHTML, { typing: true });
}

function removeTypingIndicator() {
    const typingMsg = document.getElementById('helpbot-typing-msg');
    if (typingMsg) {
        typingMsg.remove();
    }
}

function isAllowedTopic(msg) {
    const educationKeywords = [
        'teach', 'teaching', 'teacher', 'education', 'educate', 'educational',
        'learn', 'learning', 'lesson', 'curriculum', 'syllabus',
        'class', 'classroom', 'student', 'students', 'management', 'manage',
        'attendance', 'present', 'absent', 'roll call',
        'exam', 'test', 'quiz', 'assessment', 'assignment', 'homework',
        'grade', 'grading', 'mark', 'marking', 'score', 'evaluation',
        'digital', 'online', 'technology', 'tool', 'software', 'app',
        'platform', 'lms', 'e-learning', 'virtual',
        'schedule', 'timetable', 'plan', 'planning', 'organize', 'productivity',
        'time management', 'efficient', 'workflow',
        'engage', 'engagement', 'motivate', 'participation', 'interactive',
        'method', 'strategy', 'approach', 'technique',
        'academic', 'school', 'college', 'university', 'faculty', 'course',
        'subject', 'topic', 'chapter', 'module'
    ];
    
    const msgLower = msg.toLowerCase();
    return educationKeywords.some(keyword => msgLower.includes(keyword));
}

// ---- GEMINI API LOGIC (FIXED) ----
async function handleHelpBotQuery(userMsg) {
    if (!isAllowedTopic(userMsg)) {
        appendToHelpBotChat('bot', `❗ Sorry, I can only help with questions related to teaching, attendance, management, digital classroom tools, or productivity. Please ask about these topics.`);
        return;
    }

    helpbotState.isTyping = true;
    const sendBtn = document.getElementById('helpbot-send-btn');
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }

    showTypingIndicator();

    // ✅ FIXED: Use StudentAI's working approach
    const conversationHistory = helpbotState.messages.slice(-3); // Last 3 messages only
    const historyText = conversationHistory.map(h => `${h.role}: ${h.content}`).join('\n');
    
    const systemPrompt = `You are KIA, a helpful teaching assistant AI. You help with education topics like teaching methods, classroom management, attendance, exams, student engagement, and digital tools for education. Keep responses concise, practical, and focused on educational contexts.

Recent conversation:
${historyText}

Current question: ${userMsg}`;

    try {
        // ✅ FIXED: Use same structure as working StudentAI
        const response = await fetch(`${GEMINI_BASE_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: systemPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 300
                }
            })
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`API error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        removeTypingIndicator();

        // ✅ FIXED: Same response parsing as StudentAI
        let botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!botReply) {
            botReply = "I'm sorry, I couldn't generate a response right now. Please try asking your question again.";
        }

        botReply = botReply.trim();
        
        if (botReply.length < 50) {
            botReply += "\n\nIs there a specific aspect of teaching or classroom management you'd like to explore further?";
        }

        appendToHelpBotChat('bot', botReply);
        
        helpbotState.messages.push({ role: "user", content: userMsg });
        helpbotState.messages.push({ role: "assistant", content: botReply });

    } catch (error) {
        console.error('Gemini API Error:', error);
        removeTypingIndicator();
        
        let errorMessage = "🚫 I'm having trouble connecting right now. Please check your internet connection and try again.";
        
        if (error.message.includes('API_KEY')) {
            errorMessage = "🔑 API configuration issue. Please contact support.";
        } else if (error.message.includes('quota')) {
            errorMessage = "⚠️ Service temporarily unavailable. Please try again later.";
        }
        
        appendToHelpBotChat('bot', errorMessage);
    } finally {
        helpbotState.isTyping = false;
        
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        }
    }
}

// ---- CLOSE / RESET ----
function closeHelpBot() {
    const container = document.getElementById('helpbot-container');
    if (container) container.remove();
    
    document.body.style.overflow = '';
    helpbotState.isOpen = false;
    helpbotState.isTyping = false;
    document.removeEventListener('keydown', closeOnEsc);
}

function resetHelpBot() {
    helpbotState.messages = [];
    helpbotState.isTyping = false;
    
    const messagesContainer = document.getElementById('helpbot-messages');
    if (messagesContainer) {
        messagesContainer.innerHTML = "";
    }
    
    initialBotGreet();
}

// ---- STYLES (SAME AS ORIGINAL) ----
(function chatStylesInject() {
    if (document.getElementById('helpbot-style')) return;

    const style = document.createElement("style");
    style.id = "helpbot-style";
    style.innerHTML = `
    .helpbot-container {
        position: fixed; 
        z-index: 120000; 
        right: 0; 
        bottom: 0; 
        top: 0;
        left: 0; 
        background: rgba(30, 41, 59, 0.4); 
        display: flex;
        justify-content: flex-end; 
        align-items: flex-end;
        font-family: 'Inter', Arial, sans-serif;
        transition: all 0.3s ease;
    }
    
    .helpbot-modal {
        background: var(--bg-primary, #fff);
        box-shadow: 0 8px 40px rgba(0,0,0,0.15);
        border-radius: 20px 20px 0 0;
        width: min(98vw, 420px);
        height: 75vh;
        display: flex; 
        flex-direction: column; 
        overflow: hidden;
        position: relative; 
        margin: 0 2vw 2vw 0;
        animation: botSlideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid var(--border-color, #e2e8f0);
    }
    
    @keyframes botSlideUp { 
        from {
            opacity: 0.7; 
            transform: translateY(60px) scale(0.95);
        } 
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        } 
    }
    
    .helpbot-header {
        background: linear-gradient(135deg, var(--accent-green, #10b981), var(--accent-blue, #2563eb));
        color: #fff;
        font-weight: 600;
        display: flex; 
        align-items: center;
        padding: 16px 18px;
        gap: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .helpbot-avatar {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        width: 44px; 
        height: 44px;
        display: flex; 
        align-items: center; 
        justify-content: center;
        font-size: 1.6rem;
        animation: robotPulse 2s infinite;
    }
    
    @keyframes robotPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .helpbot-title { 
        flex: 1; 
        font-size: 1.1rem; 
        font-weight: 600;
        letter-spacing: 0.5px; 
    }
    
    .helpbot-close-btn {
        background: transparent; 
        border: none; 
        color: #fff; 
        font-size: 1.3rem;
        cursor: pointer; 
        padding: 10px; 
        border-radius: 8px;
        transition: background 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .helpbot-close-btn:hover { 
        background: rgba(255, 255, 255, 0.15);
        transform: scale(1.1);
    }
    
    .helpbot-body {
        flex: 1 1 auto;
        overflow-y: auto;
        background: var(--bg-tertiary, #f8fafc);
        padding: 18px 12px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        font-size: 0.95rem;
        scrollbar-width: thin;
        scrollbar-color: var(--accent-green, #10b981) transparent;
    }
    
    .helpbot-body::-webkit-scrollbar {
        width: 4px;
    }
    
    .helpbot-body::-webkit-scrollbar-track {
        background: transparent;
    }
    
    .helpbot-body::-webkit-scrollbar-thumb {
        background: var(--accent-green, #10b981);
        border-radius: 2px;
    }
    
    .helpbot-msg {
        display: flex; 
        align-items: flex-start; 
        gap: 12px;
        margin-bottom: 8px;
        animation: msgSlideIn 0.3s ease-out;
    }
    
    @keyframes msgSlideIn { 
        from {
            transform: translateY(15px); 
            opacity: 0.4;
        } 
        to {
            transform: translateY(0); 
            opacity: 1;
        } 
    }
    
    .helpbot-msg-avatar {
        width: 36px; 
        height: 36px;
        background: #e0f2fe;
        border-radius: 50%;
        display: flex; 
        align-items: center; 
        justify-content: center;
        font-size: 1.2rem; 
        color: var(--accent-green, #10b981);
        flex-shrink: 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .helpbot-msg.helpbot-user .helpbot-msg-avatar { 
        background: var(--accent-blue, #2563eb); 
        color: #fff;
    }
    
    .helpbot-msg-content {
        background: #fff; 
        color: #2d3748; 
        border-radius: 12px 12px 12px 4px;
        padding: 12px 16px; 
        min-width: 60px; 
        max-width: calc(100% - 60px);
        box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        word-break: break-word;
        line-height: 1.5;
        position: relative;
    }
    
    .helpbot-msg.helpbot-bot .helpbot-msg-content {
        background: var(--bg-secondary, #ffffff);
        color: var(--text-primary, #1a202c);
        border: 1px solid var(--border-color, #e2e8f0);
    }
    
    .helpbot-msg.helpbot-user .helpbot-msg-content {
        background: var(--accent-blue, #2563eb); 
        color: #fff;
        border-radius: 12px 12px 4px 12px;
        margin-left: auto;
    }
    
    .helpbot-msg.helpbot-user {
        flex-direction: row-reverse;
    }
    
    .helpbot-typing-dots {
        display: flex;
        gap: 4px;
        padding: 8px 0;
    }
    
    .helpbot-typing-dots span {
        width: 6px;
        height: 6px;
        background: var(--accent-green, #10b981);
        border-radius: 50%;
        animation: typingBounce 1.4s infinite;
    }
    
    .helpbot-typing-dots span:nth-child(1) { animation-delay: 0s; }
    .helpbot-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .helpbot-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typingBounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
    }
    
    .helpbot-footer {
        border-top: 1px solid var(--border-color, #e2e8f0);
        background: var(--bg-primary, #fff);
        display: flex; 
        align-items: center;
        padding: 12px 14px;
        gap: 10px;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
    }
    
    #helpbot-form { 
        display: flex; 
        align-items: center; 
        gap: 10px; 
        flex: 1;
    }
    
    #helpbot-input {
        flex: 1;
        border: 2px solid var(--accent-green, #10b981);
        border-radius: 10px;
        padding: 10px 14px;
        font-size: 0.95rem;
        transition: all 0.2s ease;
        outline: none;
        background: var(--bg-secondary, #f8fafc);
        color: var(--text-primary, #1a202c);
    }
    
    #helpbot-input:focus { 
        border-color: var(--accent-blue, #2563eb);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    
    .helpbot-footer button {
        background: var(--accent-green, #10b981);
        color: #fff; 
        border: none; 
        border-radius: 10px;
        padding: 10px 12px; 
        font-size: 1.1rem; 
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex; 
        align-items: center; 
        justify-content: center;
        min-width: 44px;
        min-height: 44px;
    }
    
    .helpbot-footer button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .helpbot-footer button.helpbot-reset-btn {
        background: var(--accent-yellow, #f59e0b);
        color: #fff;
    }
    
    .helpbot-footer button:hover:not(:disabled) { 
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .helpbot-footer button.helpbot-reset-btn:hover:not(:disabled) { 
        background: #d97706;
    }
    
    .helpbot-hint {
        font-size: 0.8rem;
        color: var(--text-secondary, #64748b);
        background: var(--bg-secondary, #f8fafc);
        padding: 12px 16px;
        border-top: 1px solid var(--border-color, #e2e8f0);
        text-align: center;
        font-style: italic;
    }
    
    @media (max-width: 550px) {
        .helpbot-modal { 
            width: 100vw;
            height: 100vh; 
            margin: 0;
            border-radius: 0;
        }
        .helpbot-hint { 
            font-size: 0.75rem;
            padding: 10px 12px;
        }
        .helpbot-body {
            padding: 14px 10px;
        }
        #helpbot-input {
            font-size: 16px; 
        }
    }
    `;

    document.head.appendChild(style);
})();

// Export for global access
window.closeHelpBot = closeHelpBot;
window.resetHelpBot = resetHelpBot;

console.log('🤖 KIA Teaching Assistant loaded successfully!');
