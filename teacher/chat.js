// teacher-chatbot.js - Enhanced Teacher AI Chat Bot with Fixed CSS & API

class TeacherAIChatBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.conversationHistory = [];
        
        // ✅ Latest Gemini 2.0 Flash API Configuration with X-goog-api-key header
        this.GEMINI_API_KEY = 'AIzaSyAJ6niwBWd5Y17_R85NkFqKXbJnOr7GHTw';
        this.GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.FALLBACK_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        
        // Rate limiting
        this.lastRequestTime = 0;
        this.dailyRequestCount = parseInt(localStorage.getItem('gemini_daily_requests') || '0');
        this.lastResetDate = localStorage.getItem('gemini_last_reset') || new Date().toDateString();
        
        // Enhanced valid topics with greetings support
        this.validTopics = {
            greetings: [
                'hello', 'hi', 'hey', 'hii', 'helo', 'hlo', 'hlw', 'hei', 'hai',
                'good morning', 'good afternoon', 'good evening', 'good night',
                'namaste', 'namaskar', 'how are you', 'how r u', 'whats up', 'what up',
                'wassup', 'sup', 'yo', 'greetings', 'salaam', 'adaab', 'kaise ho'
            ],
            
            teaching: [
                'lesson plan', 'teaching method', 'classroom management', 'student engagement',
                'pedagogy', 'curriculum', 'syllabus', 'teaching strategy', 'interactive learning',
                'learning outcomes', 'instructional design', 'teaching techniques', 'education',
                'educate', 'teach', 'teacher', 'teaching', 'learn', 'learning', 'instruction'
            ],
            
            subjects: [
                'computer science', 'cs', 'programming', 'coding', 'software', 'algorithm',
                'data structure', 'database', 'web development', 'python', 'java', 'c++', 'javascript',
                'mathematics', 'math', 'maths', 'algebra', 'calculus', 'geometry', 'statistics',
                'physics', 'chemistry', 'biology', 'science', 'english', 'literature',
                'history', 'geography', 'economics', 'commerce', 'accounting', 'finance'
            ],
            
            assessment: [
                'exam', 'test', 'quiz', 'assignment', 'homework', 'evaluation', 'assessment',
                'grading', 'marking', 'feedback', 'rubric', 'scoring', 'marks', 'grade',
                'result', 'performance', 'progress', 'report card', 'evaluation criteria'
            ],
            
            attendance: [
                'attendance', 'present', 'absent', 'roll call', 'punctuality',
                'student tracking', 'attendance system', 'attendance management', 'roll number'
            ],
            
            tools: [
                'digital tools', 'educational software', 'lms', 'online platform',
                'presentation', 'projector', 'smartboard', 'educational apps',
                'teaching tools', 'classroom technology', 'zoom', 'teams', 'google classroom',
                'kahoot', 'moodle', 'blackboard', 'canvas'
            ],
            
            management: [
                'time management', 'schedule', 'timetable', 'planning', 'organization',
                'productivity', 'workflow', 'classroom discipline', 'student behavior',
                'class management', 'resource management', 'curriculum planning'
            ],
            
            student_help: [
                'student doubt', 'student question', 'student problem', 'learning difficulty',
                'student motivation', 'student performance', 'student progress', 'help student',
                'student support', 'academic counseling', 'career guidance'
            ]
        };
        
        this.init();
    }

    init() {
        this.createChatBot();
        this.addStyles();
        this.bindEvents();
        this.loadWelcomeMessage();
        console.log('🎓 Teacher AI Chat loaded with Gemini 2.0 Flash support!');
    }

    // Check rate limits
    checkRateLimit() {
        const today = new Date().toDateString();
        
        if (this.lastResetDate !== today) {
            this.dailyRequestCount = 0;
            this.lastResetDate = today;
            localStorage.setItem('gemini_daily_requests', '0');
            localStorage.setItem('gemini_last_reset', today);
        }
        
        if (this.dailyRequestCount >= 1500) {
            throw new Error('Daily API limit reached. Please try again tomorrow.');
        }
        
        const now = Date.now();
        if (now - this.lastRequestTime < 4000) {
            throw new Error('Please wait a moment before sending another message.');
        }
        
        return true;
    }

    createChatBot() {
        const chatBotHTML = `
            <!-- Teacher Chat Toggle Button -->
            <div class="teacher-chat-widget">
                <button class="teacher-chat-toggle" id="teacherChatToggle">
                    <div class="chat-icon">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <div class="chat-badge">
                        <span>AI</span>
                    </div>
                </button>
                
                <!-- Professional notification -->
                <div class="teacher-notification" id="teacherNotification">
                    <div class="notification-content">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Hi Teacher! Need help with your class?</span>
                    </div>
                </div>
            </div>

            <!-- Teacher Chat Box -->
            <div id="teacherChatBox" class="teacher-chat-container">
                <div class="teacher-chat-header">
                    <div class="chat-header-info">
                        <div class="teacher-avatar">
                            <div class="avatar-inner">
                                <i class="fas fa-graduation-cap"></i>
                            </div>
                            <div class="online-indicator"></div>
                        </div>
                        <div class="teacher-info">
                            <h4>Teaching Assistant AI</h4>
                            <p class="status">
                                <span class="status-text">Powered by Gemini 2.0 Flash</span>
                            </p>
                        </div>
                    </div>
                    <div class="chat-header-actions">
                        <button class="action-btn minimize-btn" id="teacherMinimizeBtn" title="Minimize">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="action-btn refresh-btn" id="teacherRefreshBtn" title="New Chat">
                            <i class="fas fa-refresh"></i>
                        </button>
                        <button class="action-btn close-btn" id="teacherCloseBtn" title="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div id="teacherMessages" class="teacher-messages">
                    <div class="teacher-placeholder" id="teacherPlaceholder">
                        <div class="placeholder-content">
                            <div class="placeholder-icon">
                                <i class="fas fa-chalkboard-teacher"></i>
                            </div>
                            <h3>Welcome Teacher!</h3>
                            <p>Your AI assistant for educational topics</p>
                            <div class="quick-actions">
                                <button class="quick-btn" onclick="window.teacherAI.sendQuickMessage('Hello! How can you help me today?')">
                                    <i class="fas fa-hand-wave"></i> Say Hello
                                </button>
                                <button class="quick-btn" onclick="window.teacherAI.sendQuickMessage('Help me create a lesson plan')">
                                    <i class="fas fa-clipboard-list"></i> Lesson Plans
                                </button>
                                <button class="quick-btn" onclick="window.teacherAI.sendQuickMessage('How to manage classroom effectively?')">
                                    <i class="fas fa-users-cog"></i> Classroom Management
                                </button>
                                <button class="quick-btn" onclick="window.teacherAI.sendQuickMessage('Student assessment strategies')">
                                    <i class="fas fa-chart-bar"></i> Assessment Help
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="teacherTyping" class="typing-indicator">
                    <div class="typing-avatar">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <div class="typing-content">
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span class="typing-text">AI is thinking...</span>
                    </div>
                </div>
                
                <div class="teacher-input-container">
                    <div class="input-wrapper">
                        <div class="input-group">
                            <input id="teacherInput" type="text" placeholder="Say hello or ask about teaching, lessons, students..." autocomplete="off">
                            <button id="teacherEmojiBtn" class="emoji-btn" title="Emoji">
                                <i class="fas fa-smile"></i>
                            </button>
                        </div>
                        <button id="teacherSendBtn" class="send-btn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="input-footer">
                        <span class="footer-text">🎓 Educational Topics & Greetings • Powered by Gemini 2.0</span>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatBotHTML);
    }

    addStyles() {
        const styles = `
            <style>
                /* ✅ Fixed Teacher Chat Widget - Maximum Z-index & Proper Positioning */
                .teacher-chat-widget {
                    position: fixed !important;
                    bottom: 25px !important;
                    right: 25px !important;
                    z-index: 2147483647 !important;
                    pointer-events: none;
                }

                .teacher-chat-toggle {
                    position: relative;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, var(--accent-green, #10b981) 0%, var(--accent-blue, #3b82f6) 100%);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    animation: teacherFloat 3s ease-in-out infinite;
                    pointer-events: all;
                }

                @keyframes teacherFloat {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-3px); }
                }

                .teacher-chat-toggle:hover {
                    transform: scale(1.1) translateY(-2px);
                    box-shadow: 0 12px 40px rgba(16, 185, 129, 0.6);
                }

                .teacher-chat-toggle.hidden {
                    transform: scale(0);
                    opacity: 0;
                    pointer-events: none;
                }

                .chat-badge {
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    background: linear-gradient(135deg, var(--accent-yellow, #f59e0b), var(--accent-red, #ef4444));
                    color: white;
                    border-radius: 12px;
                    padding: 3px 6px;
                    font-size: 10px;
                    font-weight: bold;
                    animation: teacherPulse 2s infinite;
                    border: 2px solid white;
                }

                @keyframes teacherPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); opacity: 0.8; }
                }

                /* ✅ Fixed Teacher Chat Container - Enhanced Positioning */
                .teacher-chat-container {
                    position: fixed !important;
                    bottom: 25px !important;
                    right: 25px !important;
                    width: 380px;
                    height: 580px;
                    background: var(--bg-primary, white);
                    border-radius: 20px;
                    box-shadow: 0 25px 70px rgba(0,0,0,0.2), 0 0 0 1px var(--border-color, #e2e8f0);
                    display: none;
                    flex-direction: column;
                    z-index: 2147483647 !important;
                    overflow: hidden;
                    font-family: var(--font-family, 'Inter', system-ui, sans-serif);
                    backdrop-filter: blur(20px);
                    border: 2px solid rgba(255,255,255,0.1);
                    pointer-events: all;
                }

                .teacher-chat-container.active {
                    display: flex !important;
                    animation: teacherChatSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }

                @keyframes teacherChatSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(50px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .teacher-chat-container.minimized {
                    height: 80px;
                }

                /* ✅ Enhanced Header with Better Gradient */
                .teacher-chat-header {
                    background: linear-gradient(135deg, var(--accent-green, #10b981) 0%, var(--accent-blue, #3b82f6) 50%, var(--accent-purple, #8b5cf6) 100%);
                    padding: 20px 22px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                    overflow: hidden;
                }

                .teacher-chat-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
                }

                .chat-header-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    position: relative;
                    z-index: 1;
                }

                .teacher-avatar {
                    position: relative;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.25);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 6px 25px rgba(0,0,0,0.2);
                    border: 2px solid rgba(255,255,255,0.3);
                }

                .avatar-inner {
                    color: white;
                    font-size: 24px;
                }

                .online-indicator {
                    position: absolute;
                    bottom: 2px;
                    right: 2px;
                    width: 12px;
                    height: 12px;
                    background: var(--accent-yellow, #f59e0b);
                    border: 2px solid white;
                    border-radius: 50%;
                    animation: teacherPulse 2s infinite;
                }

                .teacher-info h4 {
                    margin: 0;
                    color: white;
                    font-size: 18px;
                    font-weight: 700;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .status-text {
                    color: rgba(255,255,255,0.9);
                    font-size: 12px;
                    font-weight: 500;
                }

                .chat-header-actions {
                    display: flex;
                    gap: 8px;
                    position: relative;
                    z-index: 1;
                }

                .action-btn {
                    background: rgba(255,255,255,0.15);
                    border: none;
                    color: white;
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    backdrop-filter: blur(10px);
                    font-size: 13px;
                }

                .action-btn:hover {
                    background: rgba(255,255,255,0.25);
                    transform: scale(1.05);
                }

                /* ✅ Enhanced Messages Area */
                .teacher-messages {
                    flex: 1;
                    padding: 0;
                    overflow-y: auto;
                    background: linear-gradient(135deg, var(--bg-tertiary, #f8fafc) 0%, var(--bg-secondary, #f1f5f9) 100%);
                    position: relative;
                }

                .teacher-messages::-webkit-scrollbar {
                    width: 5px;
                }

                .teacher-messages::-webkit-scrollbar-thumb {
                    background: var(--accent-green, #10b981);
                    border-radius: 3px;
                    opacity: 0.7;
                }

                .teacher-messages::-webkit-scrollbar-track {
                    background: transparent;
                }

                /* ✅ Enhanced Placeholder */
                .teacher-placeholder {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    padding: 35px 20px;
                }

                .placeholder-content {
                    text-align: center;
                    max-width: 300px;
                }

                .placeholder-icon {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, var(--accent-green, #10b981), var(--accent-blue, #3b82f6));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    color: white;
                    font-size: 36px;
                    box-shadow: 0 12px 40px rgba(16, 185, 129, 0.3);
                    animation: teacherFloat 3s ease-in-out infinite;
                }

                .placeholder-content h3 {
                    margin: 0 0 8px;
                    color: var(--text-primary, #1f2937);
                    font-size: 20px;
                    font-weight: 700;
                }

                .placeholder-content p {
                    margin: 0 0 25px;
                    color: var(--text-secondary, #6b7280);
                    font-size: 14px;
                }

                .quick-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .quick-btn {
                    background: var(--bg-primary, white);
                    border: 2px solid var(--border-color, #e5e7eb);
                    color: var(--text-primary, #374151);
                    padding: 14px 16px;
                    border-radius: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-align: left;
                }

                .quick-btn:hover {
                    background: var(--accent-green, #10b981);
                    border-color: var(--accent-green, #10b981);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.25);
                }

                .quick-btn i {
                    color: var(--accent-green, #10b981);
                    font-size: 14px;
                    transition: color 0.3s;
                    width: 16px;
                }

                .quick-btn:hover i {
                    color: white;
                }

                /* ✅ Enhanced Messages */
                .message {
                    display: flex;
                    gap: 12px;
                    padding: 16px 20px;
                    animation: teacherMessageSlide 0.4s ease-out;
                }

                @keyframes teacherMessageSlide {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .user-message {
                    flex-direction: row-reverse;
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
                }

                .bot-message {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(10px);
                }

                .message-avatar {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 16px;
                    flex-shrink: 0;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                }

                .bot-message .message-avatar {
                    background: linear-gradient(135deg, var(--accent-green, #10b981), var(--accent-blue, #3b82f6));
                }

                .user-message .message-avatar {
                    background: linear-gradient(135deg, var(--accent-purple, #8b5cf6), var(--accent-pink, #ec4899));
                }

                .message-content {
                    max-width: 75%;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .message-bubble {
                    padding: 14px 18px;
                    border-radius: 18px;
                    line-height: 1.5;
                    font-size: 14px;
                    box-shadow: 0 3px 12px rgba(0,0,0,0.1);
                }

                .bot-message .message-bubble {
                    background: var(--bg-primary, white);
                    border: 1px solid var(--border-color, #e2e8f0);
                    border-bottom-left-radius: 6px;
                    color: var(--text-primary, #1f2937);
                }

                .user-message .message-bubble {
                    background: linear-gradient(135deg, var(--accent-blue, #3b82f6), var(--accent-purple, #8b5cf6));
                    color: white;
                    border-bottom-right-radius: 6px;
                }

                .message-bubble p {
                    margin: 0;
                    line-height: 1.5;
                }

                .message-time {
                    font-size: 10px;
                    color: var(--text-muted, #9ca3af);
                    align-self: flex-end;
                    margin-top: 4px;
                    font-weight: 500;
                }

                .user-message .message-time {
                    align-self: flex-start;
                    color: rgba(255,255,255,0.7);
                }

                /* ✅ Enhanced Typing Indicator */
                .typing-indicator {
                    padding: 16px 20px;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    border-top: 1px solid var(--border-color, #e5e7eb);
                    display: none;
                    align-items: center;
                    gap: 12px;
                }

                .typing-avatar {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, var(--accent-green, #10b981), var(--accent-blue, #3b82f6));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 14px;
                }

                .typing-content {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .typing-dots {
                    display: flex;
                    gap: 4px;
                }

                .typing-dots span {
                    width: 8px;
                    height: 8px;
                    background: var(--accent-green, #10b981);
                    border-radius: 50%;
                    animation: teacherTypingBounce 1.4s infinite;
                }

                .typing-dots span:nth-child(1) { animation-delay: 0s; }
                .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
                .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

                @keyframes teacherTypingBounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-10px); }
                }

                .typing-text {
                    color: var(--text-secondary, #6b7280);
                    font-size: 11px;
                    font-weight: 500;
                }

                /* ✅ Enhanced Input Area */
                .teacher-input-container {
                    padding: 20px;
                    background: var(--bg-primary, white);
                    border-top: 2px solid var(--border-color, #e5e7eb);
                    backdrop-filter: blur(10px);
                }

                .input-wrapper {
                    display: flex;
                    align-items: flex-end;
                    gap: 12px;
                    background: var(--bg-secondary, #f8fafc);
                    border-radius: 22px;
                    padding: 8px;
                    border: 2px solid transparent;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 15px rgba(0,0,0,0.05);
                }

                .input-wrapper:focus-within {
                    border-color: var(--accent-green, #10b981);
                    background: var(--bg-primary, white);
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
                }

                .input-group {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                #teacherInput {
                    flex: 1;
                    border: none;
                    background: none;
                    outline: none;
                    padding: 12px 16px;
                    font-size: 14px;
                    color: var(--text-primary, #374151);
                    line-height: 1.4;
                    font-family: inherit;
                }

                #teacherInput::placeholder {
                    color: var(--text-muted, #9ca3af);
                    font-weight: 500;
                }

                .emoji-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary, #6b7280);
                    padding: 8px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 14px;
                }

                .emoji-btn:hover {
                    background: var(--bg-tertiary, #f3f4f6);
                    color: var(--accent-green, #10b981);
                }

                .send-btn {
                    background: linear-gradient(135deg, var(--accent-green, #10b981), var(--accent-blue, #3b82f6));
                    border: none;
                    color: white;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    font-size: 16px;
                    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
                }

                .send-btn:hover {
                    transform: scale(1.05) translateY(-1px);
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
                }

                .send-btn:active {
                    transform: scale(0.95);
                }

                .input-footer {
                    text-align: center;
                    margin-top: 12px;
                }

                .footer-text {
                    color: var(--text-muted, #9ca3af);
                    font-size: 11px;
                    font-weight: 500;
                }

                /* ✅ Fixed Notification Positioning */
                .teacher-notification {
                    position: absolute;
                    bottom: 75px;
                    right: 0;
                    background: var(--bg-primary, white);
                    border: 2px solid var(--accent-green, #10b981);
                    border-radius: 12px;
                    padding: 10px 14px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                    min-width: 160px;
                    max-width: 200px;
                    opacity: 0;
                    transform: translateY(20px);
                    pointer-events: none;
                    transition: all 0.4s ease;
                    z-index: 2147483646;
                    font-size: 12px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .teacher-notification.show {
                    opacity: 1;
                    transform: translateY(0);
                    pointer-events: all;
                }

                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--text-primary, #374151);
                    font-weight: 500;
                }

                .notification-content i {
                    color: var(--accent-green, #10b981);
                    font-size: 14px;
                }

                /* ✅ Enhanced Responsive Design */
                @media (max-width: 480px) {
                    .teacher-chat-widget {
                        bottom: 20px !important;
                        right: 20px !important;
                    }
                    
                    .teacher-chat-toggle {
                        width: 55px;
                        height: 55px;
                        font-size: 22px;
                    }
                    
                    .teacher-chat-container {
                        width: calc(100vw - 30px) !important;
                        height: calc(100vh - 30px) !important;
                        bottom: 15px !important;
                        right: 15px !important;
                        left: 15px !important;
                        border-radius: 16px;
                    }
                    
                    .teacher-notification {
                        right: 5px;
                        max-width: 150px;
                        font-size: 11px;
                        padding: 8px 10px;
                    }
                    
                    .teacher-chat-header {
                        padding: 16px 18px;
                    }
                    
                    .teacher-avatar {
                        width: 45px;
                        height: 45px;
                    }
                    
                    .avatar-inner {
                        font-size: 20px;
                    }
                    
                    .teacher-info h4 {
                        font-size: 16px;
                    }
                    
                    .status-text {
                        font-size: 11px;
                    }
                    
                    .action-btn {
                        width: 32px;
                        height: 32px;
                        font-size: 12px;
                    }
                    
                    .placeholder-icon {
                        width: 70px;
                        height: 70px;
                        font-size: 32px;
                    }
                    
                    .placeholder-content h3 {
                        font-size: 18px;
                    }
                    
                    .placeholder-content p {
                        font-size: 13px;
                    }
                    
                    .quick-btn {
                        padding: 12px 14px;
                        font-size: 12px;
                    }
                    
                    .message {
                        padding: 14px 16px;
                    }
                    
                    .message-avatar {
                        width: 34px;
                        height: 34px;
                        font-size: 14px;
                    }
                    
                    .message-bubble {
                        padding: 12px 16px;
                        font-size: 13px;
                    }
                    
                    .teacher-input-container {
                        padding: 16px;
                    }
                    
                    #teacherInput {
                        font-size: 16px; /* Prevent iOS zoom */
                    }
                    
                    .send-btn {
                        width: 40px;
                        height: 40px;
                        font-size: 14px;
                    }
                    
                    .footer-text {
                        font-size: 10px;
                    }
                }

                @media (min-width: 481px) and (max-width: 768px) {
                    .teacher-chat-container {
                        width: 360px !important;
                        height: 560px !important;
                    }
                    
                    .teacher-notification {
                        max-width: 180px;
                    }
                }

                @media (min-width: 769px) {
                    .teacher-chat-widget {
                        bottom: 30px !important;
                        right: 30px !important;
                    }
                    
                    .teacher-chat-container {
                        bottom: 30px !important;
                        right: 30px !important;
                    }
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    bindEvents() {
        const chatToggle = document.getElementById('teacherChatToggle');
        const closeBtn = document.getElementById('teacherCloseBtn');
        const minimizeBtn = document.getElementById('teacherMinimizeBtn');
        const refreshBtn = document.getElementById('teacherRefreshBtn');
        const sendBtn = document.getElementById('teacherSendBtn');
        const input = document.getElementById('teacherInput');

        chatToggle.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeAndResetChat());
        minimizeBtn.addEventListener('click', () => this.minimizeChat());
        refreshBtn.addEventListener('click', () => this.resetChat());
        sendBtn.addEventListener('click', () => this.sendMessage());

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.showNotificationPeriodically();
    }

    // Enhanced topic validation including greetings
    isValidEducationalTopic(message) {
        const msgLower = message.toLowerCase().trim();
        
        const allValidKeywords = [
            ...this.validTopics.greetings,
            ...this.validTopics.teaching,
            ...this.validTopics.subjects,
            ...this.validTopics.assessment,
            ...this.validTopics.attendance,
            ...this.validTopics.tools,
            ...this.validTopics.management,
            ...this.validTopics.student_help
        ];

        return allValidKeywords.some(keyword => msgLower.includes(keyword));
    }

    // Check if message is just a greeting
    isGreeting(message) {
        const msgLower = message.toLowerCase().trim();
        return this.validTopics.greetings.some(greeting => msgLower.includes(greeting));
    }

    // Generate greeting response
    getGreetingResponse(message) {
        const greetings = [
            "Hello! 👋 I'm your Teaching Assistant AI. How can I help you with your educational needs today?",
            "Hi there! 😊 Great to see you! What teaching challenge can I assist you with?",
            "Hello Teacher! 🎓 I'm here to help with lesson planning, classroom management, assessments, and more. What would you like to know?",
            "Good to see you! 👨‍🏫 I'm your AI teaching assistant. Ask me about educational topics, teaching methods, or student management!",
            "Hey! 🌟 Ready to make teaching easier? I can help with lesson plans, classroom strategies, subject questions, and educational tools!",
            "Namaste! 🙏 I'm here to support your teaching journey. What educational topic can I help you explore today?",
            "Hi! 🎯 I'm powered by Gemini 2.0 Flash and ready to assist with all your teaching needs. What can I help you with?"
        ];
        
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeAndResetChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatBox = document.getElementById('teacherChatBox');
        const toggleBtn = document.getElementById('teacherChatToggle');
        
        chatBox.classList.add('active');
        toggleBtn.classList.add('hidden');
        this.isOpen = true;
        
        setTimeout(() => {
            document.getElementById('teacherInput').focus();
        }, 400);

        if (this.messages.length > 0) {
            document.getElementById('teacherPlaceholder').style.display = 'none';
        }
    }

    closeAndResetChat() {
        const chatBox = document.getElementById('teacherChatBox');
        const toggleBtn = document.getElementById('teacherChatToggle');
        
        chatBox.classList.remove('active');
        toggleBtn.classList.remove('hidden');
        this.isOpen = false;

        setTimeout(() => {
            this.resetChat();
        }, 400);
    }

    minimizeChat() {
        const chatBox = document.getElementById('teacherChatBox');
        chatBox.classList.toggle('minimized');
    }

    resetChat() {
        this.messages = [];
        this.conversationHistory = [];
        
        const messagesContainer = document.getElementById('teacherMessages');
        messagesContainer.innerHTML = `
            <div class="teacher-placeholder" id="teacherPlaceholder">
                <div class="placeholder-content">
                    <div class="placeholder-icon">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <h3>Welcome Teacher!</h3>
                    <p>Your AI assistant for educational topics</p>
                    <div class="quick-actions">
                        <button class="quick-btn" onclick="window.teacherAI.sendQuickMessage('Hello! How can you help me today?')">
                            <i class="fas fa-hand-wave"></i> Say Hello
                        </button>
                        <button class="quick-btn" onclick="window.teacherAI.sendQuickMessage('Help me create a lesson plan')">
                            <i class="fas fa-clipboard-list"></i> Lesson Plans
                        </button>
                        <button class="quick-btn" onclick="window.teacherAI.sendQuickMessage('How to manage classroom effectively?')">
                            <i class="fas fa-users-cog"></i> Classroom Management
                        </button>
                        <button class="quick-btn" onclick="window.teacherAI.sendQuickMessage('Student assessment strategies')">
                            <i class="fas fa-chart-bar"></i> Assessment Help
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.hideTyping();
        
        setTimeout(() => {
            this.loadWelcomeMessage();
        }, 500);
    }

    sendQuickMessage(message) {
        document.getElementById('teacherPlaceholder').style.display = 'none';
        document.getElementById('teacherInput').value = message;
        this.sendMessage();
    }

    async sendMessage() {
        const input = document.getElementById('teacherInput');
        const message = input.value.trim();
        
        if (!message) return;

        document.getElementById('teacherPlaceholder').style.display = 'none';

        // Check if valid educational topic
        if (!this.isValidEducationalTopic(message)) {
            this.addMessage(message, 'user');
            input.value = '';
            
            setTimeout(() => {
                this.addMessage("🚫 Sorry! I can only help with educational topics:\n\n🎓 Teaching & Education\n👋 Greetings & Hello\n📚 Subject Questions (CS, Math, Physics)\n📝 Lesson Planning & Curriculum\n👥 Classroom Management\n✅ Student Assessment\n💻 Educational Tools\n📊 Attendance Management\n🎯 Student Engagement\n\nPlease ask about teaching or say hello!", 'bot');
            }, 500);
            return;
        }

        this.addMessage(message, 'user');
        input.value = '';

        // Handle greetings separately for faster response
        if (this.isGreeting(message)) {
            setTimeout(() => {
                this.addMessage(this.getGreetingResponse(message), 'bot');
            }, 800);
            return;
        }
        
        this.showTyping();

        try {
            const response = await this.getTeacherAIResponse(message);
            this.hideTyping();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.hideTyping();
            console.error('Teacher AI Error:', error);
            this.addMessage("Sorry, I'm having trouble connecting to the AI service. Please try again in a moment! 🔄", 'bot');
        }
    }

    async getTeacherAIResponse(message) {
        try {
            // Check rate limits
            this.checkRateLimit();
            
            console.log('📡 Requesting Gemini 2.0 Flash API...');
            
            this.conversationHistory.push({role: 'user', content: message});

            const systemPrompt = `You are a Teaching Assistant AI exclusively for educational topics. Help teachers with:

1. 📚 Teaching methods and lesson planning
2. 👥 Classroom management strategies  
3. ✅ Student assessment and grading
4. 🧮 Subject-specific help (Computer Science, Mathematics, Physics, Chemistry, Biology, English, etc.)
5. 💻 Educational technology and digital tools
6. 📊 Attendance and student tracking
7. 🎯 Student engagement techniques
8. 📋 Curriculum design and syllabus planning

Guidelines:
- Keep responses practical, actionable, and teacher-focused
- Maximum 200-250 words
- Use educational terminology and examples  
- Be supportive and professional
- Include relevant emojis for engagement
- Provide specific, implementable advice

Current teacher question: ${message}`;

            const requestBody = {
                contents: [{
                    parts: [{
                        text: systemPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 500,
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH", 
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            };

            // ✅ Use X-goog-api-key header as per CURL example
            let response = await fetch(this.GEMINI_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': this.GEMINI_API_KEY
                },
                body: JSON.stringify(requestBody)
            });

            // Fallback to Gemini 1.5 Flash if 2.0 fails
            if (!response.ok) {
                console.log('⚠️ Gemini 2.0 Flash failed, trying 1.5 Flash...');
                response = await fetch(this.FALLBACK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-goog-api-key': this.GEMINI_API_KEY
                    },
                    body: JSON.stringify(requestBody)
                });
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API Error:', errorText);
                
                if (response.status === 400 && errorText.includes('API key')) {
                    throw new Error('Invalid API key. Please check your Gemini API configuration.');
                } else if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please wait a moment and try again.');
                } else if (response.status === 403) {
                    throw new Error('API access forbidden. Please check your API key permissions.');
                }
                
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ API Response received:', data);
            
            // ✅ Fixed response parsing
            if (data.candidates && data.candidates[0] && data.candidates.content && data.candidates.content.parts) {
                const aiResponse = data.candidates.content.parts[0].text.trim();
                this.conversationHistory.push({role: 'assistant', content: aiResponse});
                
                // Update rate limiting
                this.lastRequestTime = Date.now();
                this.dailyRequestCount++;
                localStorage.setItem('gemini_daily_requests', this.dailyRequestCount.toString());
                
                console.log('✅ AI Response generated successfully');
                return aiResponse;
            } else {
                throw new Error('Invalid response format from API');
            }

        } catch (error) {
            console.error('❌ Gemini API Error:', error);
            
            // Return user-friendly error messages
            if (error.message.includes('rate limit') || error.message.includes('quota')) {
                return "🚫 API rate limit reached. Please wait a moment and try again.";
            } else if (error.message.includes('API key')) {
                return "🔑 API key issue detected. Please check the configuration.";
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                return "🌐 Network connection issue. Please check your internet and try again.";
            } else {
                return "❗ Sorry, I'm having technical difficulties. Please try again in a moment.";
            }
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('teacherMessages');
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatarIcon = sender === 'bot' ? 'fa-graduation-cap' : 'fa-user-tie';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${avatarIcon}"></i>
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <p>${this.escapeHtml(text).replace(/\n/g, '<br>')}</p>
                </div>
                <span class="message-time">${time}</span>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        this.messages.push({text, sender, time});
        this.scrollToBottom();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showTyping() {
        document.getElementById('teacherTyping').style.display = 'flex';
        this.scrollToBottom();
    }

    hideTyping() {
        document.getElementById('teacherTyping').style.display = 'none';
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('teacherMessages');
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }

    loadWelcomeMessage() {
        if (this.messages.length === 0) {
            setTimeout(() => {
                document.getElementById('teacherPlaceholder').style.display = 'none';
                this.addMessage("👋 Hello Teacher! I'm your AI Teaching Assistant powered by Gemini 2.0 Flash!\n\n🎓 I can help you with:\n• Lesson planning & curriculum design 📚\n• Classroom management strategies 👥\n• Student assessment & grading ✅\n• Subject-specific questions 🧮\n• Educational technology & tools 💻\n• Attendance management 📊\n• Student engagement techniques 🎯\n\n✨ You can also just say 'Hi' or 'Hello' to start a conversation!\n\nWhat would you like assistance with today?", 'bot');
            }, 1000);
        }
    }

    showNotificationPeriodically() {
        if (!this.isOpen) {
            setTimeout(() => {
                const notification = document.getElementById('teacherNotification');
                notification.classList.add('show');
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 5000);
                
                setTimeout(() => {
                    if (!this.isOpen) {
                        this.showNotificationPeriodically();
                    }
                }, 30000);
            }, 10000);
        }
    }
}

// Initialize Teacher AI when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.teacherAI = new TeacherAIChatBot();
    console.log('🎓 Teacher AI Assistant loaded successfully!');
    console.log('✅ Gemini 2.0 Flash API ready with proper X-goog-api-key header');
    console.log('👋 Enhanced greetings support enabled');
    console.log('🚀 Educational topics restriction active');
    console.log('📊 Rate limiting implemented');
    console.log('💻 Fixed CSS positioning and responsive design');
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeacherAIChatBot;
}
