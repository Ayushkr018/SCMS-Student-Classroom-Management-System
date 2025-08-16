// chat.js - HelpBot for teachers, focused on education/management assistance, Gemini API integration

// ---- CONFIGURATION ----
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAJ6niwBWd5Y17_R85NkFqKXbJnOr7GHTw';
// Replace YOUR_GEMINI_API_KEY with your Gemini or Google AI API key (keep it secure on the server).

const HELP_BOT_NAME = "HelpBot";
const ALLOWED_TOPICS_HINT = "You can ask HelpBot any questions related to teaching, attendance, exams, time management, student engagement, digital classroom tools, or personal teaching productivity. For anything else, please use another tool.";

let helpbotState = {
    isOpen: false,
    messages: []
};

// ---- ENTRY POINT ----
window.openChatBot = function() {
    if (helpbotState.isOpen) return;
    renderHelpBotChat();
    helpbotState.isOpen = true;
};

// ---- RENDER UI ----
function renderHelpBotChat() {
    // Remove if already present
    let existing = document.getElementById('helpbot-container');
    if (existing) existing.remove();

    // Main container
    const container = document.createElement('div');
    container.id = 'helpbot-container';
    container.className = 'helpbot-container';

    container.innerHTML = `
        <div class="helpbot-modal">
            <div class="helpbot-header">
                <div class="helpbot-avatar"><i class="fas fa-robot"></i></div>
                <div class="helpbot-title">KIA — Teaching & Management Assistant</div>
                <button class="helpbot-close-btn" title="Close" onclick="closeHelpBot()"><i class="fas fa-times"></i></button>
            </div>
            <div class="helpbot-body" id="helpbot-messages"></div>
            <div class="helpbot-footer">
                <form id="helpbot-form" autocomplete="off">
                    <input id="helpbot-input" type="text" placeholder="Ask about teaching, class tools, exams..." maxlength="300" autofocus />
                    <button type="submit" title="Send"><i class="fas fa-paper-plane"></i></button>
                    <button type="button" class="helpbot-reset-btn" title="Reset conversation" onclick="resetHelpBot()"><i class="fas fa-sync-alt"></i></button>
                </form>
            </div>
            <div class="helpbot-hint">${ALLOWED_TOPICS_HINT}</div>
        </div>
    `;

    document.body.appendChild(container);
    document.body.style.overflow = 'hidden'; // Prevent scroll

    // Focus input on open
    setTimeout(() => document.getElementById('helpbot-input').focus(), 150);

    // Show initial message
    initialBotGreet();

    // Submit handler
    document.getElementById('helpbot-form').onsubmit = async function(e) {
        e.preventDefault();
        const q = document.getElementById('helpbot-input').value.trim();
        if (!q) return;
        appendToHelpBotChat('user', q);
        document.getElementById('helpbot-input').value = '';
        await handleHelpBotQuery(q);
    };

    // ESC closes
    document.addEventListener('keydown', closeOnEsc);
}

function closeOnEsc(e) {
    if (e.key === 'Escape') closeHelpBot();
}

// ---- MESSAGE LOGIC ----
function appendToHelpBotChat(role, message, opts = {}) {
    const msgNode = document.createElement('div');
    msgNode.className = 'helpbot-msg helpbot-' + (role === 'user' ? 'user' : 'bot');
    if (opts.typing) msgNode.classList.add('typing');
    msgNode.innerHTML = `
        <div class="helpbot-msg-avatar">
            <i class="fas ${role === 'user' ? 'fa-user' : 'fa-robot'}"></i>
        </div>
        <div class="helpbot-msg-content">${escapeHTML(message)}</div>
    `;

    document.getElementById('helpbot-messages').appendChild(msgNode);
    document.getElementById('helpbot-messages').scrollTop = 99999;
}

function initialBotGreet() {
    if (!helpbotState.messages.length) {
        appendToHelpBotChat('bot', 
            `Hello 👋, I'm KIA! Ask me anything related to teaching, attendance, management, productivity, or digital tools. I can't help with topics not related to teaching/management.`
        );
        helpbotState.messages = [
            { role: "assistant", content: "Hello! How may I assist you with teaching or management today?" }
        ];
    }
}

// ---- GEMINI API LOGIC ----
async function handleHelpBotQuery(userMsg) {
    // Only allow allowed topics
    if (!isAllowedTopic(userMsg)) {
        appendToHelpBotChat('bot', `❗ Sorry, I can only help with questions related to teaching, attendance, management, digital classroom tools, or productivity.`);
        return;
    }

    appendToHelpBotChat('bot', '<span class="helpbot-typing">Typing...</span>', {typing: true});

    // Build messages history (last 6 exchanges for context)
    const contextMsgs = helpbotState.messages.slice(-6).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        parts: [{ text: m.content }]
    }));
    contextMsgs.push({ role: "user", parts: [{ text: userMsg }] });

    try {
        const res = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: contextMsgs,
                generationConfig: {
                    temperature: 0.6,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 512,
                    stopSequences: []
                },
                safetySettings: [
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
                ]
            })
        });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();

        // Remove typing...
        removeHelpBotTyping();

        let botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand. Please ask about teaching or management topics.";

        // Defensive: Never show unsafe output
        if (/inappropriate|illegal|harmful|not allowed|apologize/i.test(botReply)) {
            botReply = "Sorry, I'm not able to help with that.";
        }

        appendToHelpBotChat('bot', botReply);
        // Update conversation history
        helpbotState.messages.push({ role: "user", content: userMsg });
        helpbotState.messages.push({ role: "assistant", content: botReply });
    } catch (err) {
        removeHelpBotTyping();
        appendToHelpBotChat('bot', "🚫 Oops! Unable to reply just now. Please check your connection or try later.");
    }
}

function removeHelpBotTyping() {
    const msgNodes = [...document.querySelectorAll('.helpbot-msg.bot')];
    for (const node of msgNodes) {
        if (node.classList.contains('typing')) node.remove();
    }
}

function isAllowedTopic(msg) {
    const keywords = [
        "attendance", "exam", "test", "assignment", "syllabus",
        "classroom", "class", "student", "grading", "timetable",
        "schedule", "digital", "tools", "management", "school",
        "college", "faculty", "productivity", "teach", "lecture",
        "quiz", "question", "engagement", "learning", "education"
    ];
    msg = msg.toLowerCase();
    return keywords.some(kw => msg.includes(kw));
}

// ---- CLOSE / RESET ----
function closeHelpBot() {
    let container = document.getElementById('helpbot-container');
    if (container) container.remove();
    document.body.style.overflow = '';
    helpbotState.isOpen = false;
    helpbotState.messages = [];
    document.removeEventListener('keydown', closeOnEsc);
}

function resetHelpBot() {
    helpbotState.messages = [];
    let body = document.getElementById('helpbot-messages');
    if (body) body.innerHTML = "";
    initialBotGreet();
}

// ---- UTILS ----
function escapeHTML(str) {
    return (str+"").replace(/[&<>"']/g, function(m) {
        return ({
            '&':'&amp;',
            '<':'&lt;',
            '>':'&gt;',
            '"':'&quot;',
            "'":'&#39;'
        })[m];
    });
}

// ---- STYLES INJECT ----
(function chatStylesInject() {
    if (document.getElementById('helpbot-style')) return;

    const style = document.createElement("style");
    style.id = "helpbot-style";
    style.innerHTML = `
    .helpbot-container {
        position: fixed; z-index: 120000; right: 0; bottom: 0; top: 0;
        left: 0; background: rgba(30, 41, 59, .35); display: flex;
        justify-content: flex-end; align-items: flex-end;
        font-family: Inter, Arial, sans-serif;
        transition: background 0.1s;
    }
    .helpbot-modal {
        background: var(--bg-primary, #fff);
        box-shadow: 0 6px 36px #0007;
        border-radius: 20px 20px 0 0;
        width: min(98vw,400px);
        height: 70vh;
        display: flex; flex-direction: column; overflow: hidden;
        position: relative; margin: 0 2vw 2vw 0;
        animation: botFadeIn 0.3s;
    }
    @keyframes botFadeIn { from{opacity:.5; transform:translateY(45px);} to{opacity:1;transform:none;} }
    .helpbot-header {
        background: var(--accent-green, #10b981);
        color: #fff;
        font-weight: 600;
        display: flex; align-items: center;
        padding: 14px;
        gap: 12px;
    }
    .helpbot-avatar {
        background: #fff2;
        border-radius: 50%;
        width: 40px; height: 40px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.5rem;
    }
    .helpbot-title { flex:1; font-size:1rem; letter-spacing:.5px; }
    .helpbot-close-btn {
        background: transparent; border: none; color: #fff; font-size: 1.25rem;
        cursor: pointer; padding: 8px; border-radius:6px;
        transition: background .2s;
    }
    .helpbot-close-btn:hover { background: rgba(0,0,0,.10);}
    .helpbot-body {
        flex: 1 1 auto;
        overflow-y: auto;
        background: var(--bg-tertiary,#f1f5f9);
        padding: 16px 10px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        font-size: 0.98rem;
    }
    .helpbot-msg {
        display: flex; align-items: flex-start; gap: 10px;
        margin-bottom: 5px;
        animation: msgFadeIn .27s;
    }
    @keyframes msgFadeIn { from{transform: translateY(12px); opacity:0.6;} to{transform:none; opacity:1;} }
    .helpbot-msg-avatar {
        width: 32px; height: 32px;
        background: #e0f2fe;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.1rem; color:var(--accent-green,#10b981);
        flex-shrink: 0;
    }
    .helpbot-msg.helpbot-user .helpbot-msg-avatar { background: var(--accent-blue,#2563eb); color: #fff;}
    .helpbot-msg-content {
        background: #fff; color:#23272f; border-radius: 10px;
        padding: 10px 13px; min-width: 60px; max-width: 80vw;
        box-shadow: 0 2px 8px #0001;
        word-break: break-word;
    }
    .helpbot-msg.helpbot-bot .helpbot-msg-content {
        background: var(--bg-secondary,#f8fafc);
        color:var(--text-primary,#101010);
    }
    .helpbot-msg.helpbot-user .helpbot-msg-content {
        background: var(--accent-blue,#2563eb); color: #fff;
    }
    .helpbot-msg.typing .helpbot-msg-content { font-style: italic; opacity: 0.7;}
    .helpbot-footer {
        border-top: 1px solid var(--border-color,#e2e8f0);
        background: #fff;
        display: flex; align-items: center;
        padding: 8px 10px;
        gap: 8px;
    }
    #helpbot-form { display: flex; align-items: center; gap: 8px; flex:1;}
    #helpbot-input {
        flex:1;
        border:1.8px solid var(--accent-green,#10b981);
        border-radius: 7px;
        padding:7px 12px;
        font-size:0.95rem;
        transition: border .2s, box-shadow .2s;
        outline: none;
        background: var(--bg-secondary,#f8fafc);
    }
    #helpbot-input:focus { border-color: var(--accent-green-dark,#059669);}
    .helpbot-footer button {
        background: var(--accent-green,#10b981);
        color: #fff; border:none; border-radius:7px;
        padding:7px 11px; font-size:1rem; cursor:pointer;
        transition: background .18s;
        display: flex; align-items: center; justify-content: center;
    }
    .helpbot-footer button.helpbot-reset-btn {
        background: var(--accent-blue,#2563eb);
        color: #fff;
    }
    .helpbot-footer button:hover { background: var(--accent-green-dark,#059669);}
    .helpbot-footer button.helpbot-reset-btn:hover { background: var(--accent-blue-dark,#1d4ed8);}
    .helpbot-hint {
        font-size:0.78rem;
        color: var(--accent-green,#10b981);
        background: #f8fafc;
        padding: 10px 12px;
        border-top: 1px solid var(--border-color,#e2e8f0);
        text-align:center;
    }
    @media (max-width:550px){
        .helpbot-modal { width:99vw;height: 99vh; margin:0;}
        .helpbot-hint { font-size:0.76rem;}
    }
    `;
    document.head.appendChild(style);
})();
