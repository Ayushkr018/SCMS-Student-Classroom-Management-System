console.log('🤖 AI Assistant JS loading...');

// Multiple Gemini API Configurations with Fallbacks
const GEMINI_API_CONFIGS = [
    {
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
        apiKey: 'AIzaSyBEXVeXoWkXUZ9hSjklbLgfPoq1ZkqT9zU', // Backup key 1
        maxTokens: 1024,
        temperature: 0.7
    },
    {
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        apiKey: 'AIzaSyDf2gH7jK9mP3qR8sT1vX6cZ5nB4eW2yU9', // Backup key 2
        maxTokens: 1024,
        temperature: 0.7
    },
    {
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
        apiKey: 'AIzaSyAY2a_gtsVhymOw9G_AS_vM5AAHfxgtKJU', // Backup key 3
        maxTokens: 1024,
        temperature: 0.7
    }
];

// Current config index
let currentConfigIndex = 0;
let currentConfig = GEMINI_API_CONFIGS[0];

// AI Assistant State
let aiState = {
    isActive: true,
    apiKeySet: true, // Always true now
    currentSession: null,
    conversationHistory: [],
    isTyping: false,
    lastMessageTime: 0,
    requestCount: 0,
    dailyLimit: 200,
    errorCount: 0,
    maxErrors: 3,
    retryCount: 0,
    maxRetries: 3,
    isOnline: navigator.onLine,
    userPreferences: {
        studyLevel: 'intermediate',
        subjects: ['Mathematics', 'Physics', 'Computer Science'],
        learningStyle: 'visual',
        language: 'English'
    },
    systemPrompts: {
        base: `You are a friendly and knowledgeable AI Study Assistant helping students in a virtual study room.

🎯 YOUR ROLE:
- Help students understand complex concepts simply
- Create personalized study plans and roadmaps  
- Generate practice questions and quizzes
- Provide study tips and motivation
- Answer academic questions clearly
- Be encouraging and supportive

📋 RESPONSE GUIDELINES:
- Keep responses helpful and educational
- Use emojis and clear formatting
- Provide step-by-step explanations
- Include practical examples
- Be concise but comprehensive
- Stay positive and motivating
- Focus only on educational content

📊 STUDENT CONTEXT:
- Level: {level}
- Subjects: {subjects}  
- Learning Style: {style}
- Room Topic: {roomSubject}

Always format responses with clear headings and bullet points for better readability.`,

        roadmap: `Create a structured study roadmap including:

🎯 **Learning Goals**
📅 **Timeline (weekly breakdown)**
📚 **Key Resources** 
🔄 **Practice Activities**
📊 **Progress Checkpoints**
💡 **Study Strategies**

Make it specific and actionable for the student's level.`,

        explain: `Explain this concept clearly:

🔍 **Simple Definition**
📖 **Step-by-Step Breakdown**
💡 **Real Examples** 
🎨 **Easy Analogies**
📝 **Key Points**
❓ **Common Mistakes**

Use simple language and practical examples.`,

        quiz: `Create an educational quiz:

📝 **5-7 Questions** (mixed difficulty)
✅ **Answer Key**  
💡 **Explanations**
📚 **Study Tips**
🏆 **Scoring Guide**

Make it engaging and educational.`
    }
};

// Initialize AI Assistant
function initializeAI() {
    console.log('🤖 Initializing AI Assistant...');
    
    loadUserPreferences();
    loadDailyUsage();
    loadConversationHistory();
    setupAIInterface();
    startAISession();
    setupConnectionMonitoring();
    
    // Set status to ready
    updateAIStatus('Ready', '🟢');
    
    console.log('✅ AI Assistant initialized successfully');
}

// Setup Connection Monitoring
function setupConnectionMonitoring() {
    window.addEventListener('online', () => {
        aiState.isOnline = true;
        updateAIStatus('Ready', '🟢');
        console.log('🌐 Connection restored');
    });
    
    window.addEventListener('offline', () => {
        aiState.isOnline = false;
        updateAIStatus('Offline', '🔴');
        console.log('📡 Connection lost');
    });
}

// Load Daily Usage
function loadDailyUsage() {
    const today = new Date().toDateString();
    const savedUsage = localStorage.getItem('aiDailyUsage');
    const usage = savedUsage ? JSON.parse(savedUsage) : {};
    aiState.requestCount = usage[today] || 0;
    
    console.log(`📊 Daily usage: ${aiState.requestCount}/${aiState.dailyLimit}`);
}

// Update AI Status
function updateAIStatus(status, indicator = '🟢') {
    const statusEl = document.querySelector('.ai-status');
    if (statusEl) {
        statusEl.innerHTML = `
            <span class="status-indicator">${indicator}</span>
            <span class="status-text">${status}</span>
        `;
    }
    
    console.log(`🤖 AI Status: ${status}`);
}

// Load User Preferences
function loadUserPreferences() {
    const savedPrefs = localStorage.getItem('aiUserPreferences');
    if (savedPrefs) {
        try {
            const prefs = JSON.parse(savedPrefs);
            aiState.userPreferences = { ...aiState.userPreferences, ...prefs };
        } catch (e) {
            console.log('❌ Error loading preferences');
        }
    }
}

// Load Conversation History
function loadConversationHistory() {
    const roomId = roomState?.roomId || 'room-1';
    const savedHistory = localStorage.getItem(`aiHistory_${roomId}`);
    
    if (savedHistory) {
        try {
            aiState.conversationHistory = JSON.parse(savedHistory);
            displayConversationHistory();
        } catch (e) {
            addWelcomeMessage();
        }
    } else {
        addWelcomeMessage();
    }
}

// Save Conversation History
function saveConversationHistory() {
    try {
        const roomId = roomState?.roomId || 'room-1';
        const historyToSave = aiState.conversationHistory.slice(-15);
        localStorage.setItem(`aiHistory_${roomId}`, JSON.stringify(historyToSave));
    } catch (e) {
        console.log('❌ Error saving conversation');
    }
}

// Setup AI Interface
function setupAIInterface() {
    const aiInput = document.getElementById('aiInput');
    if (aiInput) {
        aiInput.addEventListener('keypress', handleAIEnter);
        aiInput.addEventListener('focus', markAIMessagesAsRead);
    }
}

// Start AI Session
function startAISession() {
    const currentUser = getCurrentUser ? getCurrentUser() : { name: 'Student' };
    const roomData = roomState || { subject: 'General Study' };
    
    aiState.currentSession = {
        id: `session_${Date.now()}`,
        startTime: Date.now(),
        roomId: roomData.roomId || 'room-1',
        subject: roomData.subject || 'General Study',
        userName: currentUser.name,
        messagesCount: 0,
        successfulRequests: 0,
        errors: 0
    };
}

// Add Welcome Message
function addWelcomeMessage() {
    const currentUser = getCurrentUser ? getCurrentUser() : { name: 'Student' };
    const roomSubject = roomState?.subject || 'your studies';
    
    const welcomeMessage = {
        id: `ai_welcome_${Date.now()}`,
        type: 'ai',
        content: `# Hello ${currentUser.name}! 🤖✨

I'm your **AI Study Assistant**, ready to help you excel in **${roomSubject}**!

## 🚀 What I Can Help With:

### 📚 **Study Planning**
• Create personalized study roadmaps
• Design effective study schedules  
• Track your learning progress

### 💡 **Concept Explanation**
• Break down complex topics
• Provide clear examples
• Simplify difficult concepts

### 📝 **Practice & Testing** 
• Generate custom quizzes
• Create practice problems
• Review and assess knowledge

### 🎯 **Study Optimization**
• Recommend study techniques
• Improve retention methods
• Boost productivity

---

**✨ Quick Examples:**
• *"Create a calculus study plan"*
• *"Explain photosynthesis simply"*
• *"Make a quiz on Newton's laws"*
• *"How to study more effectively?"*

**Ready to learn?** Ask me anything! 🌟`,
        timestamp: Date.now(),
        isWelcome: true,
        formatted: true
    };
    
    aiState.conversationHistory.push(welcomeMessage);
    displayConversationHistory();
    saveConversationHistory();
}

// Display Conversation History
function displayConversationHistory() {
    const aiChatArea = document.getElementById('aiChatArea');
    if (!aiChatArea) return;
    
    aiChatArea.innerHTML = '';
    
    aiState.conversationHistory.forEach((message) => {
        const messageElement = createAIMessageElement(message);
        aiChatArea.appendChild(messageElement);
    });
    
    // Smooth scroll to bottom
    requestAnimationFrame(() => {
        aiChatArea.scrollTop = aiChatArea.scrollHeight;
    });
}

// Create AI Message Element
function createAIMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${message.type}-message`;
    messageDiv.setAttribute('data-message-id', message.id);
    
    const timeString = formatAIMessageTime(message.timestamp);
    
    if (message.type === 'user') {
        messageDiv.innerHTML = `
            <div class="message-wrapper user-wrapper">
                <div class="message-avatar user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="message-content user-content">
                    <div class="message-header">
                        <span class="message-sender">You</span>
                        <span class="message-time">${timeString}</span>
                    </div>
                    <div class="message-text">${formatAIMessageContent(message.content)}</div>
                </div>
            </div>
        `;
    } else if (message.type === 'system') {
        messageDiv.innerHTML = `
            <div class="system-message">
                <i class="fas fa-info-circle"></i>
                <span>${message.content}</span>
            </div>
        `;
    } else if (message.type === 'error') {
        messageDiv.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message.content}</span>
                <button class="retry-btn" onclick="retryLastMessage()">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-wrapper ai-wrapper">
                <div class="message-avatar ai-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content ai-content">
                    <div class="message-header">
                        <span class="message-sender">
                            <i class="fas fa-sparkles"></i> AI Assistant
                            ${message.isWelcome ? '<span class="welcome-badge">Welcome</span>' : ''}
                        </span>
                        <span class="message-time">${timeString}</span>
                    </div>
                    <div class="message-text ai-response">${formatAIMessageContent(message.content, message.formatted)}</div>
                    ${createMessageActions(message)}
                </div>
            </div>
        `;
    }
    
    return messageDiv;
}

// Create Message Actions
function createMessageActions(message) {
    if (message.isWelcome || message.type === 'system') return '';
    
    return `
        <div class="message-actions">
            <button class="action-btn" onclick="copyMessageText('${message.id}')" title="Copy">
                <i class="fas fa-copy"></i>
            </button>
            <button class="action-btn" onclick="likeMessage('${message.id}')" title="Helpful">
                <i class="fas fa-thumbs-up"></i>
            </button>
        </div>
    `;
}

// Format AI Message Time
function formatAIMessageTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// Format AI Message Content
function formatAIMessageContent(content, isFormatted = false) {
    if (isFormatted) return content;
    
    let formatted = content
        // Headers
        .replace(/^# (.*$)/gim, '<h2 class="msg-h2">$1</h2>')
        .replace(/^## (.*$)/gim, '<h3 class="msg-h3">$1</h3>')
        .replace(/^### (.*$)/gim, '<h4 class="msg-h4">$1</h4>')
        
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // Code
        .replace(/``````/g, '<pre class="code-block"><code>$1</code></pre>')
        .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
        
        // Lists
        .replace(/^• (.*$)/gim, '<li class="bullet-item">$1</li>')
        .replace(/^[\*\-] (.*$)/gim, '<li class="bullet-item">$1</li>')
        
        // Horizontal rule
        .replace(/^---$/gim, '<hr class="divider">')
        
        // Newlines
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    
    // Wrap in paragraphs
    if (!formatted.includes('<h') && !formatted.includes('<pre>')) {
        formatted = '<p>' + formatted + '</p>';
    }
    
    // Fix lists
    formatted = formatted.replace(/(<li class="bullet-item">.*?<\/li>)/gs, '<ul class="bullet-list">$1</ul>');
    
    return formatted;
}

// Handle AI Enter Key
function handleAIEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendAIMessage();
    }
}

// Send AI Message - Main Function
function sendAIMessage() {
    const aiInput = document.getElementById('aiInput');
    if (!aiInput) return;
    
    const message = aiInput.value.trim();
    if (!message || message.length > 400) {
        if (message.length > 400) {
            showNotification('❌ Message too long. Keep it under 400 characters.', 'warning');
        }
        return;
    }
    
    // Check if online
    if (!aiState.isOnline) {
        showNotification('📡 You\'re offline. Please check your connection.', 'error');
        return;
    }
    
    // Check daily limit
    if (aiState.requestCount >= aiState.dailyLimit) {
        showNotification('📊 Daily limit reached. Try again tomorrow!', 'warning');
        return;
    }
    
    // Add user message
    const userMessage = {
        id: `user_${Date.now()}`,
        type: 'user',
        content: message,
        timestamp: Date.now()
    };
    
    aiState.conversationHistory.push(userMessage);
    aiInput.value = '';
    
    displayConversationHistory();
    showTypingIndicator();
    updateAIStatus('Thinking...', '🤔');
    
    // Send to API with retries
    sendToGeminiWithRetry(message);
    saveConversationHistory();
}

// Show/Hide Typing Indicator
function showTypingIndicator() {
    if (aiState.isTyping) return;
    
    aiState.isTyping = true;
    const typingMessage = {
        id: 'typing_indicator',
        type: 'ai',
        content: '<div class="typing-indicator"><div class="dots"><span></span><span></span><span></span></div><span class="typing-text">AI is thinking...</span></div>',
        timestamp: Date.now(),
        isTyping: true,
        formatted: true
    };
    
    aiState.conversationHistory.push(typingMessage);
    displayConversationHistory();
}

function hideTypingIndicator() {
    if (!aiState.isTyping) return;
    
    aiState.isTyping = false;
    aiState.conversationHistory = aiState.conversationHistory.filter(msg => msg.id !== 'typing_indicator');
}

// Send to Gemini API with Retry Logic and Fallbacks
async function sendToGeminiWithRetry(userMessage, retryCount = 0) {
    try {
        console.log(`🔄 Attempt ${retryCount + 1} with config ${currentConfigIndex + 1}`);
        
        const context = buildContextPrompt(userMessage);
        const response = await fetch(`${currentConfig.endpoint}?key=${currentConfig.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: context }]
                }],
                generationConfig: {
                    temperature: currentConfig.temperature,
                    maxOutputTokens: currentConfig.maxTokens,
                    topP: 0.8,
                    topK: 40
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            }),
            signal: AbortSignal.timeout(25000) // 25s timeout
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`${response.status}: ${errorData.error?.message || response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            handleSuccessfulResponse(aiResponse);
            
            // Reset retry count on success
            aiState.retryCount = 0;
            aiState.errorCount = 0;
            
        } else {
            throw new Error('Invalid response format');
        }
        
    } catch (error) {
        console.error(`❌ API Error (Attempt ${retryCount + 1}):`, error.message);
        
        // Try different config or retry
        if (retryCount < aiState.maxRetries) {
            // Try next config
            if (error.message.includes('500') || error.message.includes('503') || error.message.includes('401')) {
                switchToNextConfig();
                console.log(`🔄 Switching to config ${currentConfigIndex + 1}`);
            }
            
            // Wait before retry (exponential backoff)
            const delay = Math.min(1000 * Math.pow(2, retryCount), 8000);
            await new Promise(resolve => setTimeout(resolve, delay));
            
            return sendToGeminiWithRetry(userMessage, retryCount + 1);
        }
        
        // All retries failed
        handleAPIError(error);
    }
}

// Switch to Next API Configuration
function switchToNextConfig() {
    currentConfigIndex = (currentConfigIndex + 1) % GEMINI_API_CONFIGS.length;
    currentConfig = GEMINI_API_CONFIGS[currentConfigIndex];
    console.log(`🔄 Switched to API config ${currentConfigIndex + 1}`);
}

// Handle Successful Response
function handleSuccessfulResponse(aiResponse) {
    hideTypingIndicator();
    updateAIStatus('Ready', '🟢');
    
    const responseMessage = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: aiResponse,
        timestamp: Date.now(),
        formatted: false
    };
    
    aiState.conversationHistory.push(responseMessage);
    displayConversationHistory();
    
    // Update usage
    updateUsageStats();
    aiState.currentSession.successfulRequests++;
    
    console.log('✅ AI response successful');
}

// Handle API Error
function handleAPIError(error) {
    hideTypingIndicator();
    updateAIStatus('Ready', '🟡');
    
    aiState.errorCount++;
    
    let errorMessage = '❌ I\'m having trouble right now. ';
    
    if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage += 'API authentication issue.';
    } else if (error.message.includes('429')) {
        errorMessage += 'Too many requests. Please wait a moment.';
    } else if (error.message.includes('500') || error.message.includes('503')) {
        errorMessage += 'Server temporarily unavailable.';
    } else if (error.name === 'AbortError') {
        errorMessage += 'Request timed out.';
    } else {
        errorMessage += 'Please check your connection.';
    }
    
    errorMessage += ' Try asking again!';
    
    const errorResponse = {
        id: `error_${Date.now()}`,
        type: 'error',
        content: errorMessage,
        timestamp: Date.now()
    };
    
    aiState.conversationHistory.push(errorResponse);
    displayConversationHistory();
    saveConversationHistory();
}

// Build Context Prompt
function buildContextPrompt(userMessage) {
    const roomData = roomState || {};
    const userPrefs = aiState.userPreferences;
    
    let systemPrompt = aiState.systemPrompts.base
        .replace('{level}', userPrefs.studyLevel)
        .replace('{subjects}', userPrefs.subjects.join(', '))
        .replace('{style}', userPrefs.learningStyle)
        .replace('{roomSubject}', roomData.subject || 'General Study');
    
    // Add recent context (last 2 exchanges)
    const recentHistory = aiState.conversationHistory
        .filter(msg => !msg.isTyping && msg.type !== 'system' && msg.type !== 'error')
        .slice(-4)
        .map(msg => `${msg.type === 'user' ? 'Student' : 'AI'}: ${msg.content.replace(/<[^>]*>/g, '')}`)
        .join('\n\n');
    
    if (recentHistory) {
        systemPrompt += `\n\nRecent conversation:\n${recentHistory}\n\n`;
    }
    
    // Detect intent
    const intent = detectUserIntent(userMessage);
    if (intent && aiState.systemPrompts[intent]) {
        systemPrompt += `\nTask: ${aiState.systemPrompts[intent]}\n\n`;
    }
    
    systemPrompt += `Current question: ${userMessage}`;
    
    return systemPrompt;
}

// Detect User Intent
function detectUserIntent(message) {
    const lowercaseMessage = message.toLowerCase();
    
    if (/(roadmap|plan|schedule|timeline)/i.test(message)) {
        return 'roadmap';
    }
    if (/(explain|what is|how|define)/i.test(message)) {
        return 'explain';
    }
    if (/(quiz|test|questions|practice)/i.test(message)) {
        return 'quiz';
    }
    
    return null;
}

// Update Usage Stats
function updateUsageStats() {
    const today = new Date().toDateString();
    const savedUsage = localStorage.getItem('aiDailyUsage');
    const usage = savedUsage ? JSON.parse(savedUsage) : {};
    
    usage[today] = (usage[today] || 0) + 1;
    aiState.requestCount = usage[today];
    
    localStorage.setItem('aiDailyUsage', JSON.stringify(usage));
}

// Quick Action Functions
function generateRoadmap() {
    const subject = roomState?.subject || 'the current topic';
    const message = `Create a comprehensive study roadmap for ${subject} at ${aiState.userPreferences.studyLevel} level. Include timeline, resources, and practice activities.`;
    
    const aiInput = document.getElementById('aiInput');
    if (aiInput) {
        aiInput.value = message;
        sendAIMessage();
    }
}

function explainConcept() {
    const subject = roomState?.subject || 'your subject';
    const message = `I need help understanding a concept in ${subject}. Please explain it step by step with examples.`;
    
    const aiInput = document.getElementById('aiInput');
    if (aiInput) {
        aiInput.value = message;
        aiInput.focus();
    }
}

function createQuiz() {
    const subject = roomState?.subject || 'the current topic';
    const message = `Create a practice quiz for ${subject} with 5-7 questions at ${aiState.userPreferences.studyLevel} level. Include answers and explanations.`;
    
    const aiInput = document.getElementById('aiInput');
    if (aiInput) {
        aiInput.value = message;
        sendAIMessage();
    }
}

function summarizeSession() {
    const subject = roomState?.subject || 'this study session';
    const minutes = Math.floor((roomState?.sessionDuration || 0) / 60000);
    const message = `Provide study tips and next steps for ${subject}. My session has been ${minutes} minutes so far. What should I focus on next?`;
    
    const aiInput = document.getElementById('aiInput');
    if (aiInput) {
        aiInput.value = message;
        sendAIMessage();
    }
}

// Message Action Functions
function copyMessageText(messageId) {
    const message = aiState.conversationHistory.find(m => m.id === messageId);
    if (message) {
        const textContent = message.content.replace(/<[^>]*>/g, '').trim();
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textContent).then(() => {
                showNotification('📋 Copied to clipboard!', 'success');
            });
        }
    }
}

function likeMessage(messageId) {
    const message = aiState.conversationHistory.find(m => m.id === messageId);
    if (message) {
        message.liked = !message.liked;
        saveConversationHistory();
        
        const likeBtn = document.querySelector(`[onclick="likeMessage('${messageId}')"]`);
        if (likeBtn) {
            likeBtn.innerHTML = message.liked ? '<i class="fas fa-thumbs-up" style="color: var(--accent-green);"></i>' : '<i class="fas fa-thumbs-up"></i>';
        }
        
        showNotification(message.liked ? '👍 Thanks!' : '👍 Feedback removed', 'info');
    }
}

function retryLastMessage() {
    const lastUserMessage = aiState.conversationHistory.filter(m => m.type === 'user').pop();
    if (lastUserMessage) {
        const aiInput = document.getElementById('aiInput');
        if (aiInput) {
            aiInput.value = lastUserMessage.content;
            sendAIMessage();
        }
    }
}

// Add System Message
function addSystemMessage(content) {
    const systemMessage = {
        id: `system_${Date.now()}`,
        type: 'system',
        content: content,
        timestamp: Date.now()
    };
    
    aiState.conversationHistory.push(systemMessage);
    displayConversationHistory();
    saveConversationHistory();
}

function markAIMessagesAsRead() {
    // Mark messages as read
}

// Clear Conversation
function clearAIConversation() {
    if (confirm('Clear AI conversation history?')) {
        aiState.conversationHistory = [];
        displayConversationHistory();
        addWelcomeMessage();
        showNotification('🗑️ Conversation cleared', 'info');
    }
}

// Add Enhanced Styles
const aiStyles = document.createElement('style');
aiStyles.textContent = `
    /* AI Enhanced Styles */
    .ai-message {
        margin-bottom: 20px;
        animation: fadeInUp 0.3s ease;
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .message-wrapper {
        display: flex;
        gap: 12px;
        align-items: flex-start;
    }
    
    .user-wrapper {
        flex-direction: row-reverse;
    }
    
    .message-avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        flex-shrink: 0;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .user-avatar {
        background: linear-gradient(135deg, var(--accent-purple), #7c3aed);
        color: white;
    }
    
    .ai-avatar {
        background: linear-gradient(135deg, var(--accent-blue), var(--accent-blue-dark));
        color: white;
    }
    
    .message-content {
        max-width: 85%;
        border-radius: 18px;
        padding: 14px 16px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        border: 1px solid var(--border-light);
    }
    
    .user-content {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05));
        border-radius: 18px 18px 6px 18px;
        border-left: 3px solid var(--accent-purple);
    }
    
    .ai-content {
        background: var(--bg-secondary);
        border-radius: 18px 18px 18px 6px;
        border-left: 3px solid var(--accent-blue);
    }
    
    .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 0.85rem;
    }
    
    .message-sender {
        font-weight: 700;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    .message-time {
        color: var(--text-tertiary);
        font-size: 0.75rem;
    }
    
    .welcome-badge {
        background: linear-gradient(135deg, var(--accent-yellow), #f59e0b);
        color: white;
        font-size: 0.65rem;
        padding: 2px 6px;
        border-radius: 8px;
        margin-left: 6px;
    }
    
    .message-text {
        line-height: 1.5;
        color: var(--text-primary);
    }
    
    .ai-response {
        font-size: 0.95rem;
    }
    
    /* Enhanced AI Response Formatting */
    .ai-response .msg-h2 {
        font-size: 1.2rem;
        color: var(--accent-blue);
        margin: 16px 0 12px 0;
        font-weight: 700;
        border-bottom: 2px solid var(--accent-blue);
        padding-bottom: 4px;
    }
    
    .ai-response .msg-h3 {
        font-size: 1.1rem;
        color: var(--accent-purple);
        margin: 14px 0 10px 0;
        font-weight: 600;
    }
    
    .ai-response .msg-h4 {
        font-size: 1rem;
        color: var(--text-primary);
        margin: 12px 0 8px 0;
        font-weight: 600;
    }
    
    .ai-response .bullet-list {
        margin: 12px 0;
        padding-left: 0;
        list-style: none;
    }
    
    .ai-response .bullet-item {
        position: relative;
        padding: 4px 0 4px 20px;
        margin: 0;
    }
    
    .ai-response .bullet-item::before {
        content: '▸';
        position: absolute;
        left: 0;
        color: var(--accent-blue);
        font-size: 1rem;
        font-weight: bold;
    }
    
    .ai-response .inline-code {
        background: rgba(37, 99, 235, 0.1);
        color: var(--accent-blue);
        padding: 2px 5px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
    }
    
    .ai-response .code-block {
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 12px;
        margin: 12px 0;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
        overflow-x: auto;
        border-left: 4px solid var(--accent-blue);
    }
    
    .ai-response .divider {
        border: none;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--border-color), transparent);
        margin: 16px 0;
    }
    
    .message-actions {
        margin-top: 10px;
        display: flex;
        gap: 6px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .message-content:hover .message-actions {
        opacity: 1;
    }
    
    .action-btn {
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        padding: 5px 8px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.3s ease;
    }
    
    .action-btn:hover {
        background: var(--accent-blue);
        color: white;
        border-color: var(--accent-blue);
        transform: translateY(-1px);
    }
    
    .system-message {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: var(--accent-green);
        padding: 10px 15px;
        border-radius: 12px;
        font-size: 0.9rem;
        font-weight: 500;
        margin: 15px 0;
    }
    
    .error-message {
        display: flex;
        align-items: center;
        gap: 10px;
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: var(--accent-red);
        padding: 10px 15px;
        border-radius: 12px;
        font-size: 0.9rem;
        margin: 15px 0;
    }
    
    .retry-btn {
        background: var(--accent-red);
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 6px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .retry-btn:hover {
        background: #dc2626;
        transform: translateY(-1px);
    }
    
    .typing-indicator {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
    }
    
    .typing-indicator .dots {
        display: flex;
        gap: 3px;
    }
    
    .typing-indicator .dots span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--accent-blue);
        animation: typingDots 1.4s infinite ease-in-out;
    }
    
    .typing-indicator .dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator .dots span:nth-child(3) { animation-delay: 0.4s; }
    
    .typing-text {
        color: var(--text-secondary);
        font-style: italic;
        font-size: 0.9rem;
    }
    
    @keyframes typingDots {
        0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
        40% { opacity: 1; transform: scale(1.2); }
    }
    
    .ai-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .status-indicator {
        font-size: 0.9rem;
    }
    
    .status-text {
        color: var(--text-secondary);
    }
    
    @media (max-width: 768px) {
        .message-content {
            max-width: 90%;
            padding: 12px 14px;
        }
        
        .message-avatar {
            width: 34px;
            height: 34px;
        }
        
        .message-actions {
            opacity: 1;
        }
    }
`;
document.head.appendChild(aiStyles);

// Initialize AI when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeAI, 800);
});

// Global function exports
window.generateRoadmap = generateRoadmap;
window.explainConcept = explainConcept;
window.createQuiz = createQuiz;
window.summarizeSession = summarizeSession;
window.clearAIConversation = clearAIConversation;
window.copyMessageText = copyMessageText;
window.likeMessage = likeMessage;
window.retryLastMessage = retryLastMessage;

console.log('🤖 Complete AI Assistant loaded with built-in API keys and retry logic!');
