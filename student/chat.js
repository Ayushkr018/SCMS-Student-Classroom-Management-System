// chat.js - STUDENT DASHBOARD VERSION with Gemini API (UPDATED)

const GEMINI_API_KEY = 'AIzaSyAJ6niwBWd5Y17_R85NkFqKXbJnOr7GHTw';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const CHAT_BOT_NAME = "KIA Study Assistant";
const ALLOWED_TOPICS_HINT = 
    "You can ask about subject doubts, study tips, assignment help, exam prep, scheduling, motivation, grades, or academic improvement. Avoid chit-chat, only learning-focused queries!";

let chatbotState = {
    isOpen: false,
    messages: [],
    isTyping: false
};

// ---- ENTRY POINT ----
window.openChatBot = function() {
    if (chatbotState.isOpen) return;
    renderChatBot();
    chatbotState.isOpen = true;
};

// ---- RENDER UI ----
function renderChatBot() {
    let existing = document.getElementById('helpbot-container');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.id = 'helpbot-container';
    container.className = 'helpbot-container';
    container.innerHTML = `
        <div class="helpbot-modal">
            <div class="helpbot-header">
                <div class="helpbot-avatar"><i class="fas fa-graduation-cap"></i></div>
                <div class="helpbot-title">${CHAT_BOT_NAME} — Student Academic Helper</div>
                <button class="helpbot-close-btn" title="Close" onclick="closeHelpBot()"><i class="fas fa-times"></i></button>
            </div>
            <div class="helpbot-body" id="helpbot-messages"></div>
            <div class="helpbot-footer">
                <form id="helpbot-form" autocomplete="off">
                    <input id="helpbot-input" type="text" placeholder="Ask any academic question, study tips, assignment doubt..." maxlength="300" autofocus />
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
    }, 100);
    initialBotGreet();
    const form = document.getElementById('helpbot-form');
    if (form) {
        form.onsubmit = async function(e) {
            e.preventDefault();
            const input = document.getElementById('helpbot-input');
            if (!input) return;
            const q = input.value.trim();
            if (!q || chatbotState.isTyping) return;
            appendToHelpBotChat('user', q);
            input.value = '';
            await handleChatBotQuery(q);
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
    const avatarIcon = role === 'user' ? 'fa-user' : 'fa-graduation-cap';
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
    if (chatbotState.messages.length === 0) {
        const greetMessage = `Hello 🙌, I'm KIA! Ask me about your subjects, assignments, study planning, or how to improve your grades. Only learning-focused questions are allowed. What can I help you with today?`;
        appendToHelpBotChat('bot', greetMessage);
        chatbotState.messages = [
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
    if (typingMsg) typingMsg.remove();
}

// ---- Greeting Check (NEW) ----
function isGreeting(msg) {
    const greetWords = [
        'hello', 'hi', 'hey', 'greetings', 'namaste', 'good morning', 
        'good afternoon', 'good evening', 'good night', 'hola', 'howdy',
        'whats up', "what's up", 'sup', 'yo', 'hii', 'heyyy'
    ];
    const msgLower = msg.trim().toLowerCase();
    return greetWords.some(greet => 
        msgLower === greet || 
        msgLower.startsWith(greet + ' ') || 
        msgLower.startsWith(greet + '!')
    );
}

// ---- Basic Conversation Check (NEW) ----
function isBasicConversation(msg) {
    const basicWords = [
        'how are you', 'how r u', 'whats your name', "what's your name",
        'who are you', 'who r u', 'are you ok', 'fine', 'good', 'nice',
        'thank you', 'thanks', 'bye', 'goodbye', 'see you', 'ok', 'okay'
    ];
    const msgLower = msg.trim().toLowerCase();
    return basicWords.some(word => msgLower.includes(word));
}

// ---- Topic Filtering (UPDATED) ----
function isAllowedTopic(msg) {
    const allowedKeywords = [
        'subject', 'math', 'physics', 'chemistry', 'cs', 'computer', 'biology',
        'assignment', 'homework', 'project', 'doubt', 'question', 'topic', 'syllabus',
        'study', 'exam', 'grades', 'score', 'marks', 'improve', 'learning', 'schedule',
        'plan', 'time table', 'class', 'timetable', 'reminder', 'test', 'cgpa',
        'method', 'study technique', 'concept', 'difficulty', 'weak',
        'improvement', 'motivation', 'how to', 'preparation', 'resources', 'reference',
        'education', 'college', 'university', 'teacher', 'professor', 'help'
    ];
    const msgLower = msg.toLowerCase();
    return allowedKeywords.some(keyword => msgLower.includes(keyword));
}

// ---- GEMINI API LOGIC (UPDATED) ----
async function handleChatBotQuery(userMsg) {
    // Handle greetings naturally
    if (isGreeting(userMsg)) {
        const greetResponses = [
            `👋 Hi there! I'm KIA, your academic assistant. You can ask me about your subjects, assignments, doubts, study plans, or exam preparation. How can I help you today?`,
            `Hello! 😊 I'm here to help with your studies. Feel free to ask about any subject, assignment help, study techniques, or academic planning!`,
            `Hey! 🎓 Ready to tackle some academic challenges? Ask me about your subjects, homework, exam prep, or study strategies!`
        ];
        const randomGreet = greetResponses[Math.floor(Math.random() * greetResponses.length)];
        appendToHelpBotChat('bot', randomGreet);
        chatbotState.messages.push({ role: "user", content: userMsg });
        chatbotState.messages.push({ role: "assistant", content: randomGreet });
        return;
    }

    // Handle basic conversation politely
    if (isBasicConversation(userMsg)) {
        const conversationResponses = [
            `I'm doing great, thanks for asking! 😊 I'm here to help with your academic questions. What subject or study topic can I assist you with?`,
            `Thanks! I'm KIA, your study assistant. Let's focus on your academics - any subject doubts, assignments, or study planning you need help with?`,
            `I appreciate that! Now, how about we work on your studies? Ask me about any subject, exam prep, or academic planning!`
        ];
        const randomConv = conversationResponses[Math.floor(Math.random() * conversationResponses.length)];
        appendToHelpBotChat('bot', randomConv);
        chatbotState.messages.push({ role: "user", content: userMsg });
        chatbotState.messages.push({ role: "assistant", content: randomConv });
        return;
    }

    // Check if topic is allowed
    if (!isAllowedTopic(userMsg)) {
        appendToHelpBotChat('bot',
            `❗ Please ask academic questions only - like subject doubts, study plans, assignments, exam help, grades, or time management. I'm here to help you succeed in your studies! 📚`);
        return;
    }

    chatbotState.isTyping = true;
    const sendBtn = document.getElementById('helpbot-send-btn');
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }
    showTypingIndicator();

    // Use last 3 messages for context
    const conversationHistory = chatbotState.messages.slice(-3);
    const historyText = conversationHistory.map(h => `${h.role}: ${h.content}`).join('\n');
    
    // Student-specific prompt for Gemini
    const systemPrompt = `
You are KIA, an expert educational assistant for students. Always respond to subject questions, assignment help, study methods, exam strategies, grade improvement, time management, and motivation ONLY. 
No casual talk, entertainment, or non-academic topics.
Give practical, step-by-step, concise advice. Limit response to what helps students improve academically.
Be encouraging and supportive in your tone.

Recent messages:
${historyText}

Student's question: ${userMsg}
`;

    try {
        const response = await fetch(`${GEMINI_BASE_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 340
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        removeTypingIndicator();

        let botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!botReply) {
            botReply = "I'm sorry, I couldn't generate a response this time. Please try again, or ask a different academic question.";
        }

        botReply = botReply.trim();
        if (botReply.length < 40) {
            botReply += "\n\nIf you want more detailed advice, ask about your subjects, assignments or study plan!";
        }

        appendToHelpBotChat('bot', botReply);
        chatbotState.messages.push({ role: "user", content: userMsg });
        chatbotState.messages.push({ role: "assistant", content: botReply });

    } catch (error) {
        removeTypingIndicator();
        let errorMessage = "🚫 Can't connect now. Please check your internet or try again in some time.";
        if (error.message.includes('API_KEY')) {
            errorMessage = "🔑 API configuration issue. Contact admin.";
        } else if (error.message.includes('quota')) {
            errorMessage = "⚠️ Service unavailable. Please try later.";
        }
        appendToHelpBotChat('bot', errorMessage);
    } finally {
        chatbotState.isTyping = false;
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
    chatbotState.isOpen = false;
    chatbotState.isTyping = false;
    document.removeEventListener('keydown', closeOnEsc);
}

function resetHelpBot() {
    chatbotState.messages = [];
    chatbotState.isTyping = false;
    const messagesContainer = document.getElementById('helpbot-messages');
    if (messagesContainer) messagesContainer.innerHTML = "";
    initialBotGreet();
}

// ---- STYLES (dashboard/academic theme) ----
(function chatStylesInject() {
    if (document.getElementById('helpbot-style')) return;
    const style = document.createElement("style");
    style.id = "helpbot-style";
    style.innerHTML = `
    .helpbot-container {
        position: fixed; z-index: 120000; right: 0; bottom: 0; top: 0; left: 0;
        background: rgba(30, 41, 59, 0.32); display: flex;
        justify-content: flex-end; align-items: flex-end;
        font-family: 'Inter', Arial, sans-serif;
        transition: all 0.3s ease;
    }
    .helpbot-modal {
        background: var(--bg-primary, #fff);
        box-shadow: 0 8px 40px rgba(0,0,0,0.15);
        border-radius: 20px 20px 0 0;
        width: min(97vw, 400px); height: 73vh;
        display: flex; flex-direction: column; overflow: hidden;
        position: relative; margin: 0 2vw 2vw 0;
        animation: botSlideUp 0.35s cubic-bezier(0.4,0,0.2,1);
        border: 1px solid var(--border-color, #e2e8f0);
    }
    @keyframes botSlideUp {
        from { opacity:0.7; transform:translateY(55px) scale(0.95); }
        to { opacity:1; transform:translateY(0) scale(1);}
    }
    .helpbot-header {
        background: linear-gradient(135deg, var(--accent-green, #10b981), var(--accent-blue, #2563eb));
        color:#fff; font-weight:600;
        display:flex; align-items:center; padding:15px 18px; gap:12px; box-shadow:0 2px 9px rgba(0,0,0,0.09);
    }
    .helpbot-avatar {
        background:rgba(255,255,255,0.15); border-radius:50%; width:42px; height:42px;
        display:flex; align-items:center; justify-content:center; font-size:1.45rem;
        animation: robotPulse 2s infinite;
    }
    @keyframes robotPulse { 0%,100%{ transform:scale(1);} 50%{ transform:scale(1.05);} }
    .helpbot-title { flex:1; font-size:1.08rem; font-weight:600; letter-spacing:0.5px;}
    .helpbot-close-btn {
        background:transparent; border:none; color:#fff; font-size:1.3rem;
        cursor:pointer; padding:9px; border-radius:7px;
        transition:background 0.2s ease; display:flex; align-items:center; justify-content:center;
    }
    .helpbot-close-btn:hover { background:rgba(255,255,255,0.18); transform:scale(1.09);}
    .helpbot-body {
        flex:1 1 auto; overflow-y:auto; background:var(--bg-tertiary, #f8fafc);
        padding:16px 10px; display:flex; flex-direction:column; gap:13px; font-size:0.95rem;
        scrollbar-width: thin; scrollbar-color: var(--accent-green, #10b981) transparent;
    }
    .helpbot-body::-webkit-scrollbar { width:4px; }
    .helpbot-body::-webkit-scrollbar-thumb { background:var(--accent-green, #10b981); border-radius:2px;}
    .helpbot-msg {
        display:flex; align-items:flex-start; gap:12px; margin-bottom:7px; animation:msgSlideIn 0.28s ease-out;
    }
    @keyframes msgSlideIn { from{ transform:translateY(12px); opacity:0.38; } to{ transform:translateY(0); opacity:1; } }
    .helpbot-msg-avatar {
        width:34px; height:34px; background:#e0f2fe; border-radius:50%;
        display:flex; align-items:center; justify-content:center; font-size:1.16rem;
        color:var(--accent-green, #10b981); flex-shrink:0; box-shadow:0 2px 7px rgba(0,0,0,0.1);
    }
    .helpbot-msg.helpbot-user .helpbot-msg-avatar { background:var(--accent-blue, #2563eb); color:#fff;}
    .helpbot-msg-content {
        background:#fff; color:#2d3748; border-radius:12px 12px 12px 4px; padding:11px 14px; min-width:58px; max-width:calc(100% - 58px); box-shadow:0 2px 10px rgba(0,0,0,0.06); word-break:break-word; line-height:1.5; position:relative;
    }
    .helpbot-msg.helpbot-bot .helpbot-msg-content {
        background:var(--bg-secondary, #ffffff); color:var(--text-primary, #1a202c); border:1px solid var(--border-color, #e2e8f0);
    }
    .helpbot-msg.helpbot-user .helpbot-msg-content {
        background:var(--accent-blue, #2563eb); color:#fff; border-radius:12px 12px 4px 12px; margin-left:auto;
    }
    .helpbot-msg.helpbot-user { flex-direction: row-reverse;}
    .helpbot-typing-dots { display:flex; gap:4px; padding:8px 0;}
    .helpbot-typing-dots span { width:6px; height:6px; background:var(--accent-green, #10b981); border-radius:50%; animation:typingBounce 1.25s infinite;}
    .helpbot-typing-dots span:nth-child(1) { animation-delay:0s;}
    .helpbot-typing-dots span:nth-child(2) { animation-delay:0.15s;}
    .helpbot-typing-dots span:nth-child(3) { animation-delay:0.3s;}
    @keyframes typingBounce { 0%, 60%, 100% { transform: translateY(0);} 30% { transform: translateY(-8px);} }
    .helpbot-footer {
        border-top:1px solid var(--border-color, #e2e8f0); background:var(--bg-primary, #fff);
        display:flex; align-items:center; padding:11px 13px; gap:9px; box-shadow:0 -2px 10px rgba(0,0,0,0.04);
    }
    #helpbot-form { display:flex; align-items:center; gap:10px; flex:1;}
    #helpbot-input {
        flex:1; border:2px solid var(--accent-green, #10b981); border-radius:10px; padding:9px 13px;
        font-size:0.94rem; background:var(--bg-secondary, #f8fafc);
        color:var(--text-primary, #1a202c); transition:all 0.19s ease; outline:none;
    }
    #helpbot-input:focus { border-color:var(--accent-blue, #2563eb); box-shadow: 0 0 0 3px rgba(37,99,235,0.11);}
    .helpbot-footer button {
        background:var(--accent-green, #10b981); color:#fff; border:none; border-radius:10px;
        padding:9px 11px; font-size:1.09rem; cursor:pointer; transition:all 0.19s ease; display:flex; align-items:center; justify-content:center; min-width:38px; min-height:38px;
    }
    .helpbot-footer button:disabled { opacity:0.62; cursor:not-allowed;}
    .helpbot-footer button.helpbot-reset-btn { background:var(--accent-yellow, #f59e0b); color:#fff;}
    .helpbot-footer button:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 3px 9px rgba(0,0,0,0.15);}
    .helpbot-footer button.helpbot-reset-btn:hover:not(:disabled) { background:#d97706;}
    .helpbot-hint {
        font-size:0.8rem; color:var(--text-secondary, #64748b); background:var(--bg-secondary, #f8fafc);
        padding:11px 14px; border-top:1px solid var(--border-color, #e2e8f0); text-align:center; font-style:italic;
    }
    @media (max-width:550px) {
        .helpbot-modal { width:100vw; height:100vh; margin:0; border-radius:0;}
        .helpbot-hint { font-size:0.75rem; padding:9px 10px;}
        .helpbot-body { padding:12px 8px;}
        #helpbot-input { font-size:16px;}
    }`;
    document.head.appendChild(style);
})();

window.closeHelpBot = closeHelpBot;
window.resetHelpBot = resetHelpBot;

console.log('🎓 KIA Study Assistant loaded successfully!');
