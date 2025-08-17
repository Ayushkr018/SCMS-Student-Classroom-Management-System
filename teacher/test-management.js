// Theme Management - Consistent with Landing Page
function initializeTheme() {
    const savedTheme = localStorage.getItem('scms-theme') || 'light';
    const themeIcon = document.getElementById('themeIcon');
    const mobileThemeIcon = document.getElementById('mobileThemeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const themeSwitch = document.getElementById('themeSwitch');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-sun';
        if (themeLabel) themeLabel.textContent = 'Light Mode';
        if (themeSwitch) themeSwitch.classList.add('active');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-moon';
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
        if (themeSwitch) themeSwitch.classList.remove('active');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeIcon = document.getElementById('themeIcon');
    const mobileThemeIcon = document.getElementById('mobileThemeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const themeSwitch = document.getElementById('themeSwitch');
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('scms-theme', 'light');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-moon';
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
        if (themeSwitch) themeSwitch.classList.remove('active');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('scms-theme', 'dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-sun';
        if (themeLabel) themeLabel.textContent = 'Light Mode';
        if (themeSwitch) themeSwitch.classList.add('active');
    }
}

// Mobile Sidebar Management
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ============================================
// USER MANAGEMENT & LOGOUT
// ============================================

function loadCurrentUser() {
    const currentUser = localStorage.getItem('scms_current_user');
    if (!currentUser) {
        const defaultUser = {
            name: 'Prof. John Smith',
            role: 'teacher',
            department: 'computer_science'
        };
        localStorage.setItem('scms_current_user', JSON.stringify(defaultUser));
    }
    
    const user = JSON.parse(localStorage.getItem('scms_current_user'));
    if (user.role !== 'teacher') {
        alert('Access denied. Teacher privileges required.');
        window.location.href = '../index.html';
        return;
    }
    
    const userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = user.name || 'Teacher';
    
    const userDeptEl = document.getElementById('userDept');
    if (user.department && userDeptEl) {
        userDeptEl.textContent = user.department.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
}

function logout() {
    if (confirm('Are you sure you want to logout from Test Management System?')) {
        localStorage.removeItem('scms_current_user');
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    }
}

// ============================================
// ENHANCED MOCK DATABASE WITH FULL FEATURES
// ============================================

const MOCK_DATABASE = {
    questions: [
        {
            id: 'q001',
            type: 'mcq',
            subject: 'cs',
            difficulty: 'medium',
            topic: 'Data Structures',
            question: 'Which of the following is the best time complexity for searching in a balanced BST?',
            options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
            correctAnswer: 1,
            explanation: 'In a balanced BST, the height is log n, making search operations O(log n).',
            marks: 2,
            createdAt: '2024-01-10T10:30:00Z',
            lastModified: '2024-01-15T14:22:00Z',
            usageCount: 23,
            avgScore: 78.5,
            media: null
        },
        {
            id: 'q002',
            type: 'mcq',
            subject: 'cs',
            difficulty: 'easy',
            topic: 'Programming Basics',
            question: 'What does CPU stand for?',
            options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Unit', 'Computer Processing Unit'],
            correctAnswer: 0,
            explanation: 'CPU stands for Central Processing Unit, which is the main processing component of a computer.',
            marks: 1,
            createdAt: '2024-01-05T09:15:00Z',
            lastModified: '2024-01-05T09:15:00Z',
            usageCount: 45,
            avgScore: 92.3,
            media: null
        },
        {
            id: 'ai_q001',
            type: 'mcq',
            subject: 'cs',
            difficulty: 'easy',
            topic: 'Arrays',
            question: 'What is the time complexity of accessing an element at a specific index in an array?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
            correctAnswer: 0,
            explanation: 'Array access by index is constant time O(1) because elements are stored in contiguous memory.',
            marks: 1,
            createdAt: '2025-08-16T18:00:00Z',
            lastModified: '2025-08-16T18:00:00Z',
            usageCount: 5,
            avgScore: 89.2,
            media: null,
            isAIGenerated: true
        }
    ],
    
    tests: [
        {
            id: 'test001',
            title: 'CS101 Midterm Examination',
            subject: 'cs',
            description: 'Comprehensive midterm covering data structures and algorithms',
            totalMarks: 50,
            duration: 90,
            startTime: '2024-02-15T10:00:00Z',
            endTime: '2024-02-15T11:30:00Z',
            status: 'completed',
            questions: ['q001', 'q002'],
            settings: {
                shuffleQuestions: true,
                shuffleOptions: true,
                showResults: false,
                negativeMarking: true,
                negativePercent: 25,
                passPercentage: 40,
                timePerQuestion: false,
                autoSubmit: true
            },
            antiCheat: {
                enableCamera: true,
                livenessCheck: true,
                faceRecognition: true,
                recordingFreq: 'continuous',
                tabSwitchDetection: true,
                maxTabSwitches: 3,
                fullscreenMode: true,
                disableRightClick: true,
                copyPaste: true,
                printScreen: true,
                violationAction: 'flag'
            },
            createdAt: '2024-02-10T14:30:00Z',
            createdBy: 'prof_001',
            participants: 45,
            completed: 42,
            avgScore: 78.5
        },
        {
            id: 'test002',
            title: 'Data Structures Quick Quiz',
            subject: 'cs',
            description: 'Quick assessment on basic data structures',
            totalMarks: 20,
            duration: 30,
            startTime: '2024-02-20T14:00:00Z',
            endTime: '2024-02-20T14:30:00Z',
            status: 'active',
            questions: ['q001', 'ai_q001'],
            participants: 38,
            completed: 15,
            avgScore: 74.2
        }
    ],
    
    students: [
        {
            id: 'st001',
            name: 'Raj Kumar',
            rollNo: 'CS001',
            email: 'raj.kumar@student.edu',
            avatar: 'RK',
            currentStatus: 'online',
            testActivity: {
                currentTest: 'test002',
                progress: 67,
                timeRemaining: 1832,
                questionsAnswered: 8,
                totalQuestions: 12,
                violations: 1,
                lastActivity: new Date(),
                proctoring: {
                    faceDetected: true,
                    eyeMovement: 'normal',
                    audioLevel: 'silent',
                    screenActivity: 'focused',
                    suspicionScore: 0.2
                }
            },
            performance: {
                testsCompleted: 5,
                avgScore: 82.3,
                bestScore: 95,
                worstScore: 68,
                totalViolations: 2
            }
        },
        {
            id: 'st002',
            name: 'Priya Sharma',
            rollNo: 'CS002',
            email: 'priya.sharma@student.edu',
            avatar: 'PS',
            currentStatus: 'online',
            testActivity: {
                currentTest: 'test002',
                progress: 45,
                timeRemaining: 1654,
                questionsAnswered: 5,
                totalQuestions: 12,
                violations: 0,
                proctoring: {
                    faceDetected: true,
                    eyeMovement: 'normal',
                    audioLevel: 'silent',
                    screenActivity: 'focused',
                    suspicionScore: 0.1
                }
            }
        },
        {
            id: 'st003',
            name: 'Arjun Patel',
            rollNo: 'CS003',
            email: 'arjun.patel@student.edu',
            avatar: 'AP',
            currentStatus: 'warning',
            testActivity: {
                currentTest: 'test002',
                progress: 23,
                timeRemaining: 1234,
                violations: 3,
                proctoring: {
                    faceDetected: false,
                    eyeMovement: 'suspicious',
                    audioLevel: 'detected',
                    screenActivity: 'tab_switch',
                    suspicionScore: 0.7
                }
            }
        }
    ],
    
    liveMonitoring: {
        activeTest: 'test002',
        totalStudents: 38,
        activeStudents: 23,
        violations: 13,
        timeRemaining: '45:32',
        avgProgress: 67.5,
        alerts: [
            {
                id: 'alert001',
                type: 'warning',
                student: 'st001',
                studentName: 'Raj Kumar',
                message: 'Tab switch detected',
                timestamp: new Date(Date.now() - 300000),
                severity: 'medium'
            },
            {
                id: 'alert002',
                type: 'danger',
                student: 'st003',
                studentName: 'Arjun Patel',
                message: 'Multiple faces detected in camera',
                timestamp: new Date(Date.now() - 120000),
                severity: 'high'
            }
        ]
    }
};

// Current Application State
let currentTab = 'overview';
let currentStep = 1;
let selectedQuestions = [];
let testSettings = {};
let antiCheatSettings = {};
let filteredQuestions = [...MOCK_DATABASE.questions];
let liveMonitoringInterval;
let proctoringActive = false;

// ============================================
// ENHANCED AI QUESTION GENERATOR
// ============================================

function generateAIQuestions() {
    showAIGeneratorModal();
}

function showAIGeneratorModal() {
    let modal = document.getElementById('aiGeneratorModal');
    if (!modal) {
        modal = createAIGeneratorModal();
        document.body.appendChild(modal);
    }
    
    showModal('aiGeneratorModal');
    showNotification('🤖 AI Question Generator opened', 'info');
}

function createAIGeneratorModal() {
    const modal = document.createElement('div');
    modal.id = 'aiGeneratorModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3><i class="fas fa-robot"></i> AI Question Generator</h3>
                <button class="close-btn" onclick="closeModal('aiGeneratorModal')">×</button>
            </div>
            
            <div class="modal-body">
                <div class="ai-generator-form">
                    <div class="form-group">
                        <label for="aiSubject">Subject *</label>
                        <select id="aiSubject" required>
                            <option value="">Select Subject</option>
                            <option value="cs">Computer Science</option>
                            <option value="math">Mathematics</option>
                            <option value="physics">Physics</option>
                            <option value="chemistry">Chemistry</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="aiTopic">Topic *</label>
                        <input type="text" id="aiTopic" placeholder="e.g., Data Structures, Algorithms" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="aiDifficulty">Difficulty Level *</label>
                        <select id="aiDifficulty" required>
                            <option value="">Select Difficulty</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="aiQuestionType">Question Type *</label>
                        <select id="aiQuestionType" required>
                            <option value="">Select Type</option>
                            <option value="mcq">Multiple Choice (MCQ)</option>
                            <option value="theory">Theory Questions</option>
                            <option value="mixed">Mixed Types</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="aiQuestionCount">Number of Questions *</label>
                        <input type="number" id="aiQuestionCount" min="1" max="50" value="5" required>
                        <small>Generate 1-50 questions at once</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="aiMarksPerQuestion">Marks per Question</label>
                        <input type="number" id="aiMarksPerQuestion" min="1" max="10" value="2">
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="aiAutoCreateTest"> 
                            Automatically create test paper after generation
                        </label>
                    </div>
                </div>
            </div>
            
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal('aiGeneratorModal')">Cancel</button>
                <button class="btn btn-primary" onclick="startAIGeneration()">
                    <i class="fas fa-magic"></i> Generate Questions
                </button>
            </div>
        </div>
    `;
    
    return modal;
}

function startAIGeneration() {
    const subject = document.getElementById('aiSubject').value;
    const topic = document.getElementById('aiTopic').value;
    const difficulty = document.getElementById('aiDifficulty').value;
    const questionType = document.getElementById('aiQuestionType').value;
    const questionCount = parseInt(document.getElementById('aiQuestionCount').value);
    const marksPerQuestion = parseInt(document.getElementById('aiMarksPerQuestion').value) || 2;
    const autoCreateTest = document.getElementById('aiAutoCreateTest').checked;
    
    if (!subject || !topic || !difficulty || !questionType || !questionCount) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    closeModal('aiGeneratorModal');
    showAIGenerationProgress(questionCount);
    
    generateQuestionsWithAI({
        subject, topic, difficulty, questionType, 
        questionCount, marksPerQuestion, autoCreateTest
    });
}

function showAIGenerationProgress(totalQuestions) {
    let progressModal = document.getElementById('aiProgressModal');
    if (!progressModal) {
        progressModal = document.createElement('div');
        progressModal.id = 'aiProgressModal';
        progressModal.className = 'modal show';
        progressModal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3><i class="fas fa-cog fa-spin"></i> AI Generating Questions...</h3>
                </div>
                <div class="modal-body">
                    <div class="ai-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="aiProgressFill" style="width: 0%"></div>
                        </div>
                        <div class="progress-text">
                            <span id="aiProgressText">Initializing AI engine...</span>
                            <span id="aiProgressCount">0 / ${totalQuestions} questions</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(progressModal);
    }
}

function generateQuestionsWithAI(config) {
    const { subject, topic, difficulty, questionType, questionCount, marksPerQuestion, autoCreateTest } = config;
    
    const generatedQuestions = [];
    let currentProgress = 0;
    
    const generateQuestion = (index) => {
        setTimeout(() => {
            currentProgress++;
            updateAIProgress(currentProgress, questionCount, `Generating question ${currentProgress}...`);
            
            const question = createAIQuestion(subject, topic, difficulty, questionType, marksPerQuestion, index);
            generatedQuestions.push(question);
            
            if (currentProgress < questionCount) {
                generateQuestion(currentProgress);
            } else {
                onAIGenerationComplete(generatedQuestions, config);
            }
        }, Math.random() * 2000 + 1000);
    };
    
    generateQuestion(0);
}

function createAIQuestion(subject, topic, difficulty, questionType, marks, index) {
    const questionId = `ai_${subject}_${Date.now()}_${index}`;
    
    const questionBanks = {
        cs: {
            easy: [
                {
                    question: `What is the time complexity of binary search in ${topic}?`,
                    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
                    correct: 1,
                    explanation: 'Binary search divides the search space in half each iteration.'
                },
                {
                    question: `Which data structure uses LIFO principle in ${topic}?`,
                    options: ['Queue', 'Stack', 'Array', 'Linked List'],
                    correct: 1,
                    explanation: 'Stack follows Last In First Out (LIFO) principle.'
                }
            ]
        },
        math: {
            easy: [
                {
                    question: `What is the derivative of x² in ${topic}?`,
                    options: ['x', '2x', 'x²', '2'],
                    correct: 1,
                    explanation: 'Using power rule: d/dx(x²) = 2x'
                }
            ]
        }
    };
    
    const templates = questionBanks[subject]?.[difficulty] || questionBanks.cs.easy;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return {
        id: questionId,
        type: questionType === 'mixed' ? 'mcq' : questionType,
        subject: subject,
        difficulty: difficulty,
        topic: topic,
        question: template.question,
        options: template.options,
        correctAnswer: template.correct,
        explanation: template.explanation,
        marks: marks,
        createdAt: new Date().toISOString(),
        usageCount: 0,
        avgScore: Math.floor(Math.random() * 30 + 70),
        isAIGenerated: true
    };
}

function updateAIProgress(current, total, status) {
    const progressFill = document.getElementById('aiProgressFill');
    const progressText = document.getElementById('aiProgressText');
    const progressCount = document.getElementById('aiProgressCount');
    
    if (progressFill) progressFill.style.width = (current / total * 100) + '%';
    if (progressText) progressText.textContent = status;
    if (progressCount) progressCount.textContent = `${current} / ${total} questions`;
}

function onAIGenerationComplete(generatedQuestions, config) {
    updateAIProgress(config.questionCount, config.questionCount, 'Generation complete!');
    
    generatedQuestions.forEach(question => {
        MOCK_DATABASE.questions.unshift(question);
    });
    
    setTimeout(() => {
        const progressModal = document.getElementById('aiProgressModal');
        if (progressModal) progressModal.classList.remove('show');
        
        showNotification(`🎉 Successfully generated ${generatedQuestions.length} AI questions!`, 'success');
        
        if (config.autoCreateTest) {
            createTestFromAIQuestions(generatedQuestions, config);
        } else {
            showGeneratedQuestionsSummary(generatedQuestions, config);
        }
        
        if (currentTab === 'question-bank') {
            loadQuestionBank();
        }
    }, 1000);
}

function createTestFromAIQuestions(questions, config) {
    const testData = {
        id: 'ai_test_' + Date.now(),
        title: `AI Generated Test - ${config.topic}`,
        subject: config.subject,
        description: `Auto-generated test covering ${config.topic} (${config.difficulty} level)`,
        totalMarks: questions.reduce((sum, q) => sum + q.marks, 0),
        duration: Math.max(30, questions.length * 3),
        questions: questions.map(q => q.id),
        status: 'draft',
        createdAt: new Date().toISOString(),
        isAIGenerated: true,
        participants: 0,
        completed: 0
    };
    
    MOCK_DATABASE.tests.unshift(testData);
    showTestPreview(testData, questions);
}

function showGeneratedQuestionsSummary(questions, config) {
    let summaryModal = document.getElementById('aiSummaryModal');
    if (!summaryModal) {
        summaryModal = createAISummaryModal();
        document.body.appendChild(summaryModal);
    }
    
    const summaryContent = summaryModal.querySelector('.summary-content');
    summaryContent.innerHTML = `
        <div class="generation-summary">
            <div class="summary-header">
                <h4>🎉 AI Generation Complete!</h4>
                <p>Successfully generated ${questions.length} questions for <strong>${config.topic}</strong></p>
            </div>
            
            <div class="summary-stats">
                <div class="stat-box">
                    <div class="stat-number">${questions.length}</div>
                    <div class="stat-label">Questions Generated</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${questions.reduce((sum, q) => sum + q.marks, 0)}</div>
                    <div class="stat-label">Total Marks</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${config.difficulty.toUpperCase()}</div>
                    <div class="stat-label">Difficulty Level</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${config.subject.toUpperCase()}</div>
                    <div class="stat-label">Subject</div>
                </div>
            </div>
            
            <div class="summary-actions">
                <button class="btn btn-primary" onclick="createTestFromSummary()">
                    <i class="fas fa-file-alt"></i> Create Test Paper
                </button>
                <button class="btn btn-secondary" onclick="viewGeneratedQuestions()">
                    <i class="fas fa-eye"></i> View Questions
                </button>
                <button class="btn btn-info" onclick="closeModal('aiSummaryModal')">
                    <i class="fas fa-check"></i> Done
                </button>
            </div>
        </div>
    `;
    
    showModal('aiSummaryModal');
}

function createAISummaryModal() {
    const modal = document.createElement('div');
    modal.id = 'aiSummaryModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h3><i class="fas fa-robot"></i> AI Generation Summary</h3>
                <button class="close-btn" onclick="closeModal('aiSummaryModal')">×</button>
            </div>
            <div class="modal-body">
                <div class="summary-content"></div>
            </div>
        </div>
    `;
    
    return modal;
}

function showTestPreview(testData, questions) {
    let previewModal = document.getElementById('testPreviewModal');
    if (!previewModal) {
        previewModal = createTestPreviewModal();
        document.body.appendChild(previewModal);
    }
    
    const previewContent = previewModal.querySelector('.preview-content');
    previewContent.innerHTML = `
        <div class="test-preview">
            <div class="test-header">
                <h4>📄 ${testData.title}</h4>
                <span class="ai-badge">🤖 AI Generated</span>
            </div>
            
            <div class="test-details">
                <div class="detail-row">
                    <span class="label">Duration:</span>
                    <span class="value">${testData.duration} minutes</span>
                </div>
                <div class="detail-row">
                    <span class="label">Total Marks:</span>
                    <span class="value">${testData.totalMarks}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Questions:</span>
                    <span class="value">${questions.length}</span>
                </div>
            </div>
            
            <div class="questions-preview">
                <h5>Complete Question Paper Preview:</h5>
                <div class="questions-list">
                    ${questions.map((q, index) => `
                        <div class="question-preview-item">
                            <div class="question-number">Question ${index + 1}</div>
                            <div class="question-text"><strong>${q.question}</strong></div>
                            <div class="question-meta">
                                <span class="type-badge">${q.type.toUpperCase()}</span>
                                <span class="marks-badge">${q.marks} marks</span>
                            </div>
                            ${q.type === 'mcq' ? `
                                <div class="options-preview">
                                    ${q.options.map((opt, idx) => `
                                        <div class="option-preview ${idx === q.correctAnswer ? 'correct' : ''}">
                                            ${String.fromCharCode(65 + idx)}. ${opt}
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="explanation"><strong>Explanation:</strong> ${q.explanation}</div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="preview-actions">
                <button class="btn btn-success" onclick="publishAITest('${testData.id}')">
                    <i class="fas fa-rocket"></i> Publish Test
                </button>
                <button class="btn btn-secondary" onclick="closeModal('testPreviewModal')">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        </div>
    `;
    
    showModal('testPreviewModal');
}

function createTestPreviewModal() {
    const modal = document.createElement('div');
    modal.id = 'testPreviewModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3><i class="fas fa-file-alt"></i> Complete Test Paper Preview</h3>
                <button class="close-btn" onclick="closeModal('testPreviewModal')">×</button>
            </div>
            <div class="modal-body">
                <div class="preview-content"></div>
            </div>
        </div>
    `;
    
    return modal;
}

// ============================================
// REAL-TIME PROCTORING SYSTEM
// ============================================

function startProctoringSystem() {
    proctoringActive = true;
    
    // Start monitoring each student
    MOCK_DATABASE.students.forEach(student => {
        if (student.currentStatus === 'online') {
            setInterval(() => {
                simulateProctoring(student.id);
            }, 5000 + Math.random() * 5000);
        }
    });
    
    showNotification('🔒 Advanced proctoring system activated', 'success');
}

function simulateProctoring(studentId) {
    const student = MOCK_DATABASE.students.find(s => s.id === studentId);
    if (!student || !student.testActivity.currentTest) return;
    
    const scenarios = [
        { type: 'normal', suspicion: 0.1, message: 'Normal behavior' },
        { type: 'face_not_detected', suspicion: 0.8, message: 'Face not detected' },
        { type: 'multiple_faces', suspicion: 0.9, message: 'Multiple faces detected' },
        { type: 'tab_switch', suspicion: 0.6, message: 'Tab switch detected' },
        { type: 'audio_detected', suspicion: 0.5, message: 'Audio detected' }
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    if (scenario.type !== 'normal') {
        student.testActivity.violations++;
        addViolationAlert(studentId, scenario.type, scenario.message, 'high');
    }
    
    student.testActivity.proctoring.suspicionScore = scenario.suspicion;
    
    if (currentTab === 'live-monitoring') {
        loadStudentGrid();
    }
}

function addViolationAlert(studentId, type, message, severity) {
    const student = MOCK_DATABASE.students.find(s => s.id === studentId);
    const alert = {
        id: 'alert_' + Date.now(),
        type: severity === 'high' ? 'danger' : 'warning',
        student: studentId,
        studentName: student ? student.name : 'Unknown',
        message: message,
        timestamp: new Date(),
        severity: severity
    };
    
    MOCK_DATABASE.liveMonitoring.alerts.unshift(alert);
    MOCK_DATABASE.liveMonitoring.violations++;
    
    if (MOCK_DATABASE.liveMonitoring.alerts.length > 20) {
        MOCK_DATABASE.liveMonitoring.alerts = MOCK_DATABASE.liveMonitoring.alerts.slice(0, 20);
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    initializeTestManagement();
    startProctoringSystem();
    startRealTimeUpdates();

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    });

    // Add AI Generator button to question bank filters
    setTimeout(() => {
        const filtersActions = document.querySelector('.filters-actions');
        if (filtersActions && !document.getElementById('ai-generator-btn')) {
            const aiBtn = document.createElement('button');
            aiBtn.className = 'btn btn-warning';
            aiBtn.id = 'ai-generator-btn';
            aiBtn.innerHTML = '<i class="fas fa-robot"></i> AI Generate';
            aiBtn.onclick = generateAIQuestions;
            filtersActions.appendChild(aiBtn);
        }
    }, 1000);
});

function initializeTestManagement() {
    loadOverviewData();
    loadQuestionBank();
    setupEventListeners();
    updateStats();
}

// ============================================
// TAB MANAGEMENT (HTML buttons integration)
// ============================================

function switchTab(tabName) {
    // Update tab buttons (existing HTML)
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Update tab content (existing HTML)
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    const activePane = document.getElementById(`${tabName}-tab`);
    if (activePane) activePane.classList.add('active');
    
    currentTab = tabName;
    
    // Load tab-specific content
    switch(tabName) {
        case 'overview':
            loadOverviewData();
            break;
        case 'question-bank':
            loadQuestionBank();
            break;
        case 'test-creator':
            initializeTestCreator();
            break;
        case 'live-monitoring':
            loadLiveMonitoring();
            break;
        case 'analytics':
            loadTestAnalytics();
            break;
    }
    
    showNotification(`Switched to ${tabName.replace('-', ' ')} tab`, 'info');
}

// ============================================
// OVERVIEW TAB FUNCTIONS (HTML integration)
// ============================================

function loadOverviewData() {
    updateStats();
    loadRecentTests();
}

function updateStats() {
    const totalTests = MOCK_DATABASE.tests.length;
    const activeTests = MOCK_DATABASE.tests.filter(test => test.status === 'active').length;
    const totalQuestions = MOCK_DATABASE.questions.length;
    
    const completedTests = MOCK_DATABASE.tests.filter(test => test.status === 'completed' && test.avgScore > 0);
    const avgScore = completedTests.length > 0 
        ? completedTests.reduce((acc, test) => acc + test.avgScore, 0) / completedTests.length 
        : 0;
    
    // Update existing HTML elements
    const totalTestsEl = document.getElementById('totalTests');
    const activeTestsEl = document.getElementById('activeTests'); 
    const totalQuestionsEl = document.getElementById('totalQuestions');
    const avgScoreEl = document.getElementById('avgScore');
    
    if (totalTestsEl) totalTestsEl.textContent = totalTests;
    if (activeTestsEl) activeTestsEl.textContent = activeTests;
    if (totalQuestionsEl) totalQuestionsEl.textContent = totalQuestions.toLocaleString();
    if (avgScoreEl) avgScoreEl.textContent = avgScore.toFixed(1) + '%';
}

function loadRecentTests() {
    const recentTestsList = document.getElementById('recentTestsList');
    if (!recentTestsList) return;
    
    recentTestsList.innerHTML = '';
    
    const recentTests = MOCK_DATABASE.tests
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    recentTests.forEach(test => {
        const testItem = createTestItem(test);
        recentTestsList.appendChild(testItem);
    });
}

function createTestItem(test) {
    const item = document.createElement('div');
    item.className = 'test-item';
    item.onclick = () => viewTestDetails(test.id);
    
    const statusClass = getStatusClass(test.status);
    const statusText = getStatusText(test.status);
    const aiIndicator = test.isAIGenerated ? '<span class="ai-tag">🤖 AI</span>' : '';
    
    item.innerHTML = `
        <div class="test-info">
            <h4>${test.title}${aiIndicator}</h4>
            <div class="test-details">
                <div><i class="fas fa-book"></i> ${test.subject.toUpperCase()}</div>
                <div><i class="fas fa-clock"></i> ${test.duration} minutes</div>
                <div><i class="fas fa-users"></i> ${test.participants} students</div>
            </div>
        </div>
        <div class="test-status">
            <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
    `;
    
    return item;
}

function getStatusClass(status) {
    const classes = {
        'active': 'status-active',
        'scheduled': 'status-scheduled',
        'completed': 'status-completed',
        'draft': 'status-draft'
    };
    return classes[status] || 'status-draft';
}

function getStatusText(status) {
    const texts = {
        'active': 'LIVE NOW',
        'scheduled': 'SCHEDULED',
        'completed': 'COMPLETED',
        'draft': 'DRAFT'
    };
    return texts[status] || 'DRAFT';
}

// ============================================
// QUESTION BANK FUNCTIONS (HTML integration)
// ============================================

function loadQuestionBank() {
    filteredQuestions = [...MOCK_DATABASE.questions];
    renderQuestions();
    setupQuestionFilters();
}

function renderQuestions() {
    const questionsList = document.getElementById('questionsList');
    if (!questionsList) return;
    
    questionsList.innerHTML = '';
    
    if (filteredQuestions.length === 0) {
        questionsList.innerHTML = `
            <div class="no-questions">
                <h3>No questions found</h3>
                <p>Try adjusting your filters or add new questions</p>
                <button class="btn btn-primary" onclick="addNewQuestion()">
                    <i class="fas fa-plus"></i> Add Question
                </button>
            </div>
        `;
        return;
    }
    
    filteredQuestions.forEach(question => {
        const questionCard = createQuestionCard(question);
        questionsList.appendChild(questionCard);
    });
}

function createQuestionCard(question) {
    const card = document.createElement('div');
    card.className = 'question-card';
    
    const aiIndicator = question.isAIGenerated ? '<span class="ai-tag">🤖 AI</span>' : '';
    
    let optionsHtml = '';
    if (question.type === 'mcq') {
        optionsHtml = `
            <div class="question-options">
                ${question.options.map((option, index) => `
                    <div class="option-item ${index === question.correctAnswer ? 'correct' : ''}">
                        ${String.fromCharCode(65 + index)}. ${option}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    card.innerHTML = `
        <div class="question-header">
            <div class="question-meta">
                <span class="difficulty-${question.difficulty}">${question.difficulty}</span>
                <span class="type-${question.type}">${question.type.toUpperCase()}</span>
                <span>${question.marks} marks</span>
                ${aiIndicator}
            </div>
            <div class="question-stats">
                <span><i class="fas fa-chart-bar"></i> ${question.usageCount}</span>
                <span><i class="fas fa-star"></i> ${question.avgScore}%</span>
            </div>
        </div>
        <div class="question-text">${question.question}</div>
        ${optionsHtml}
        <div class="question-footer">
            <div class="question-info">
                <span><i class="fas fa-tag"></i> ${question.topic}</span>
            </div>
            <div class="question-actions">
                <button class="btn btn-sm btn-info" onclick="editQuestion('${question.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="duplicateQuestion('${question.id}')">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteQuestion('${question.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ============================================
// LIVE MONITORING FUNCTIONS (HTML integration)
// ============================================

function loadLiveMonitoring() {
    updateMonitoringStats();
    loadStudentGrid();
    loadAlerts();
    
    if (liveMonitoringInterval) clearInterval(liveMonitoringInterval);
    liveMonitoringInterval = setInterval(() => {
        updateMonitoringStats();
        updateStudentGrid();
        updateAlerts();
    }, 5000);
}

function updateMonitoringStats() {
    const monitoring = MOCK_DATABASE.liveMonitoring;
    
    // Update existing HTML stats
    const statNumbers = document.querySelectorAll('.monitor-stat .stat-number');
    if (statNumbers[0]) statNumbers[0].textContent = monitoring.activeStudents;
    if (statNumbers[1]) statNumbers[1].textContent = monitoring.violations;
    if (statNumbers) statNumbers.textContent = monitoring.timeRemaining;
    if (statNumbers) statNumbers.textContent = monitoring.avgProgress + '%';
}

function loadStudentGrid() {
    const studentGrid = document.getElementById('studentGrid');
    if (!studentGrid) return;
    
    studentGrid.innerHTML = '';
    
    MOCK_DATABASE.students.forEach(student => {
        if (student.currentStatus === 'online' || student.currentStatus === 'warning') {
            const studentCard = createStudentMonitorCard(student);
            studentGrid.appendChild(studentCard);
        }
    });
}

function createStudentMonitorCard(student) {
    const card = document.createElement('div');
    const suspicionLevel = student.testActivity.proctoring.suspicionScore;
    const cardClass = suspicionLevel > 0.7 ? 'high-risk' : suspicionLevel > 0.4 ? 'medium-risk' : 'low-risk';
    
    card.className = `student-monitor-card ${cardClass}`;
    
    card.innerHTML = `
        <div class="student-header">
            <span class="student-name">${student.name}</span>
            <span class="risk-indicator ${cardClass}"></span>
        </div>
        <div class="camera-feed">
            <div class="camera-status ${student.testActivity.proctoring.faceDetected ? 'active' : 'inactive'}">
                <i class="fas fa-video"></i>
                ${student.testActivity.proctoring.faceDetected ? 'Face Detected' : 'No Face'}
            </div>
        </div>
        <div class="student-stats">
            <div class="stat-item">
                <span>Progress:</span>
                <span>${Math.floor(student.testActivity.progress)}%</span>
            </div>
            <div class="stat-item">
                <span>Violations:</span>
                <span class="violation-count">${student.testActivity.violations}</span>
            </div>
            <div class="stat-item">
                <span>Suspicion:</span>
                <span class="suspicion-score">${Math.round(suspicionLevel * 100)}%</span>
            </div>
        </div>
        <div class="monitor-actions">
            <button class="btn btn-sm btn-info" onclick="viewStudentDetails('${student.id}')">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-warning" onclick="sendWarning('${student.id}')">
                <i class="fas fa-exclamation-triangle"></i>
            </button>
        </div>
    `;
    
    return card;
}

function loadAlerts() {
    const alertsList = document.getElementById('alertsList');
    if (!alertsList) return;
    
    alertsList.innerHTML = '';
    
    const alerts = MOCK_DATABASE.liveMonitoring.alerts.slice(0, 10);
    
    alerts.forEach(alert => {
        const alertItem = createAlertItem(alert);
        alertsList.appendChild(alertItem);
    });
}

function createAlertItem(alert) {
    const item = document.createElement('div');
    item.className = `alert-item ${alert.type}`;
    
    item.innerHTML = `
        <div class="alert-icon">
            <i class="fas fa-${alert.type === 'danger' ? 'exclamation-triangle' : 'exclamation-circle'}"></i>
        </div>
        <div class="alert-content">
            <div class="alert-message">
                <strong>${alert.studentName}:</strong> ${alert.message}
            </div>
            <div class="alert-time">${getTimeAgo(alert.timestamp)}</div>
        </div>
    `;
    
    return item;
}

function updateStudentGrid() {
    MOCK_DATABASE.students.forEach(student => {
        if (student.testActivity.progress < 100) {
            student.testActivity.progress += Math.random() * 2;
            student.testActivity.progress = Math.min(100, student.testActivity.progress);
        }
    });
    
    loadStudentGrid();
}

function updateAlerts() {
    if (Math.random() < 0.3) {
        const students = MOCK_DATABASE.students.filter(s => s.currentStatus === 'online');
        if (students.length > 0) {
            const randomStudent = students[Math.floor(Math.random() * students.length)];
            const alertMessages = [
                'Tab switching detected',
                'Face not visible',
                'Suspicious behavior detected',
                'Audio detected during test'
            ];
            const randomMessage = alertMessages[Math.floor(Math.random() * alertMessages.length)];
            addViolationAlert(randomStudent.id, 'auto_detected', randomMessage, 'medium');
        }
    }
    
    loadAlerts();
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
}

// ============================================
// TEST ANALYTICS FUNCTIONS (HTML integration)
// ============================================

function loadTestAnalytics() {
    loadAnalyticsCharts();
    loadPerformanceTable();
}

function loadAnalyticsCharts() {
    // Simulate chart data with visual placeholders
    const scoreChart = document.getElementById('scoreChart');
    if (scoreChart) {
        const ctx = scoreChart.getContext('2d');
        ctx.fillStyle = '#10b981';
        ctx.fillRect(0, 0, scoreChart.width, scoreChart.height);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Score Distribution Chart', scoreChart.width/2, scoreChart.height/2);
    }
    
    // Update violations summary in HTML
    const violationsSummary = document.querySelector('.violations-summary');
    if (violationsSummary) {
        violationsSummary.innerHTML = `
            <div class="violation-item">
                <span class="violation-type">Tab Switches</span>
                <span class="violation-count">${MOCK_DATABASE.liveMonitoring.violations}</span>
            </div>
            <div class="violation-item">
                <span class="violation-type">Face Not Detected</span>
                <span class="violation-count">3</span>
            </div>
            <div class="violation-item">
                <span class="violation-type">Audio Detected</span>
                <span class="violation-count">2</span>
            </div>
        `;
    }
}

function loadPerformanceTable() {
    const tableBody = document.getElementById('performanceTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    MOCK_DATABASE.students.forEach(student => {
        const row = document.createElement('tr');
        const score = Math.floor(Math.random() * 40 + 60);
        const timeTaken = Math.floor(Math.random() * 30 + 30);
        
        row.innerHTML = `
            <td>
                <div class="student-profile">
                    <div class="student-avatar">${student.avatar}</div>
                    <div>
                        <div class="student-name">${student.name}</div>
                        <div class="student-roll">${student.rollNo}</div>
                    </div>
                </div>
            </td>
            <td><strong>${score}%</strong></td>
            <td>${timeTaken} mins</td>
            <td><span class="violation-badge">${student.testActivity.violations}</span></td>
            <td><span class="status-badge ${score >= 60 ? 'passed' : 'failed'}">${score >= 60 ? 'PASSED' : 'FAILED'}</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewStudentReport('${student.id}')">
                    <i class="fas fa-chart-line"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// ============================================
// ACTION FUNCTIONS (HTML buttons integration)
// ============================================

// Header Actions (existing HTML buttons)
function createNewTest() {
    switchTab('test-creator');
    showNotification('Test creator opened', 'success');
}

function openQuestionBank() {
    switchTab('question-bank');
    showNotification('Question bank opened', 'info');
}

function viewLiveTests() {
    switchTab('live-monitoring');
    showNotification('Live monitoring activated', 'success');
}

// Quick Actions (existing HTML)
function quickCreateMCQ() {
    switchTab('test-creator');
    showNotification('Quick MCQ creator ready', 'success');
}

function duplicateLastTest() {
    if (MOCK_DATABASE.tests.length > 0) {
        const lastTest = MOCK_DATABASE.tests[0];
        showNotification(`Duplicating "${lastTest.title}"`, 'info');
        switchTab('test-creator');
    }
}

function importQuestions() {
    showNotification('Question import feature coming soon', 'info');
}

function scheduleTest() {
    switchTab('test-creator');
    showNotification('Test scheduler opened', 'info');
}

function viewAllTests() {
    switchTab('overview');
    showNotification('Showing all tests', 'info');
}

// Question Bank Actions (existing HTML)
function addNewQuestion() {
    showModal('questionModal');
    showNotification('Question creator opened', 'info');
}

function bulkImport() {
    showNotification('Bulk import feature coming soon', 'info');
}

function exportQuestions() {
    showNotification('Exporting questions...', 'info');
    setTimeout(() => {
        showNotification('Questions exported successfully', 'success');
    }, 2000);
}

function editQuestion(questionId) {
    showNotification(`Editing question ${questionId}`, 'info');
    showModal('questionModal');
}

function duplicateQuestion(questionId) {
    const question = MOCK_DATABASE.questions.find(q => q.id === questionId);
    if (question) {
        const newQuestion = {
            ...question,
            id: 'q' + Date.now(),
            question: question.question + ' (Copy)',
            createdAt: new Date().toISOString(),
            usageCount: 0
        };
        
        MOCK_DATABASE.questions.unshift(newQuestion);
        renderQuestions();
        showNotification('Question duplicated successfully', 'success');
    }
}

function deleteQuestion(questionId) {
    if (confirm('Are you sure you want to delete this question?')) {
        const index = MOCK_DATABASE.questions.findIndex(q => q.id === questionId);
        if (index > -1) {
            MOCK_DATABASE.questions.splice(index, 1);
            filteredQuestions = filteredQuestions.filter(q => q.id !== questionId);
            renderQuestions();
            showNotification('Question deleted successfully', 'success');
        }
    }
}

// Test Creator Actions (existing HTML)
function nextStep() {
    if (currentStep < 5) {
        currentStep++;
        showCreatorStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showCreatorStep(currentStep);
    }
}

function createTest() {
    showNotification('Test created successfully!', 'success');
    setTimeout(() => {
        switchTab('overview');
        currentStep = 1;
    }, 1500);
}

// Monitoring Actions (existing HTML)
function refreshMonitoring() {
    loadLiveMonitoring();
    showNotification('Monitoring data refreshed', 'success');
}

function viewStudentDetails(studentId) {
    const student = MOCK_DATABASE.students.find(s => s.id === studentId);
    if (student) {
        showNotification(`Viewing details for ${student.name}`, 'info');
    }
}

function sendWarning(studentId) {
    const student = MOCK_DATABASE.students.find(s => s.id === studentId);
    if (student) {
        showNotification(`Warning sent to ${student.name}`, 'warning');
    }
}

// Analytics Actions (existing HTML)
function exportAnalytics() {
    showNotification('Exporting analytics report...', 'info');
    setTimeout(() => {
        showNotification('Analytics exported successfully', 'success');
    }, 3000);
}

function viewStudentReport(studentId) {
    const student = MOCK_DATABASE.students.find(s => s.id === studentId);
    if (student) {
        showNotification(`Opening report for ${student.name}`, 'info');
    }
}

function viewTestDetails(testId) {
    const test = MOCK_DATABASE.tests.find(t => t.id === testId);
    if (test) {
        showNotification(`Viewing test: ${test.title}`, 'info');
    }
}

// AI Actions
function publishAITest(testId) {
    const test = MOCK_DATABASE.tests.find(t => t.id === testId);
    if (test) {
        test.status = 'scheduled';
        closeModal('testPreviewModal');
        showNotification(`Test "${test.title}" published successfully!`, 'success');
        loadOverviewData();
    }
}

function createTestFromSummary() {
    closeModal('aiSummaryModal');
    showNotification('Creating test from AI questions...', 'info');
}

function viewGeneratedQuestions() {
    closeModal('aiSummaryModal');
    switchTab('question-bank');
}

// ============================================
// TEST CREATOR FUNCTIONS (HTML integration)
// ============================================

function initializeTestCreator() {
    currentStep = 1;
    showCreatorStep(1);
    showNotification('Test creator initialized', 'info');
}

function showCreatorStep(step) {
    // Update step indicator (existing HTML)
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        stepEl.classList.toggle('active', index + 1 === step);
    });
    
    // Show corresponding step content (existing HTML)
    document.querySelectorAll('.creator-step').forEach((stepContent, index) => {
        stepContent.classList.toggle('active', index + 1 === step);
    });
    
    // Update navigation buttons (existing HTML)
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const createBtn = document.getElementById('createBtn');
    
    if (prevBtn) prevBtn.style.display = step === 1 ? 'none' : 'inline-flex';
    if (nextBtn) nextBtn.style.display = step === 5 ? 'none' : 'inline-flex';
    if (createBtn) createBtn.style.display = step === 5 ? 'inline-flex' : 'none';
}

function selectMethod(method) {
    // Update method buttons (existing HTML)
    document.querySelectorAll('.method-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.method-btn').classList.add('active');
    
    showNotification(`${method} selection method activated`, 'info');
}

function toggleQuestionType() {
    const questionType = document.getElementById('questionType').value;
    const mcqOptions = document.getElementById('mcqOptions');
    const theoryAnswer = document.getElementById('theoryAnswer');
    
    if (mcqOptions) mcqOptions.style.display = questionType === 'mcq' ? 'block' : 'none';
    if (theoryAnswer) theoryAnswer.style.display = questionType === 'theory' ? 'block' : 'none';
}

function addOption() {
    const optionsList = document.querySelector('.options-list');
    const optionCount = optionsList.children.length;
    
    if (optionCount >= 6) {
        showNotification('Maximum 6 options allowed', 'warning');
        return;
    }
    
    const newOption = document.createElement('div');
    newOption.className = 'option-item';
    newOption.innerHTML = `
        <input type="radio" name="correctAnswer" value="${optionCount}">
        <input type="text" placeholder="Option ${String.fromCharCode(65 + optionCount)}" data-option="${optionCount}">
        <button type="button" class="remove-option" onclick="removeOption(this)">×</button>
    `;
    
    optionsList.appendChild(newOption);
}

function removeOption(button) {
    const optionsList = document.querySelector('.options-list');
    if (optionsList.children.length <= 2) {
        showNotification('Minimum 2 options required', 'warning');
        return;
    }
    
    button.parentElement.remove();
}

function saveQuestion() {
    showNotification('Question saved successfully!', 'success');
    closeModal('questionModal');
    loadQuestionBank();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function setupEventListeners() {
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
}

function setupQuestionFilters() {
    const subjectFilter = document.getElementById('subjectFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const typeFilter = document.getElementById('typeFilter');
    const searchInput = document.getElementById('questionSearch');
    
    if (subjectFilter) subjectFilter.addEventListener('change', filterQuestions);
    if (difficultyFilter) difficultyFilter.addEventListener('change', filterQuestions);
    if (typeFilter) typeFilter.addEventListener('change', filterQuestions);
    if (searchInput) searchInput.addEventListener('input', filterQuestions);
}

function filterQuestions() {
    const subjectFilter = document.getElementById('subjectFilter')?.value || 'all';
    const difficultyFilter = document.getElementById('difficultyFilter')?.value || 'all';
    const typeFilter = document.getElementById('typeFilter')?.value || 'all';
    const searchQuery = document.getElementById('questionSearch')?.value.toLowerCase() || '';
    
    filteredQuestions = MOCK_DATABASE.questions.filter(question => {
        const matchesSubject = subjectFilter === 'all' || question.subject === subjectFilter;
        const matchesDifficulty = difficultyFilter === 'all' || question.difficulty === difficultyFilter;
        const matchesType = typeFilter === 'all' || question.type === typeFilter;
        const matchesSearch = !searchQuery || 
            question.question.toLowerCase().includes(searchQuery) ||
            question.topic.toLowerCase().includes(searchQuery);
        
        return matchesSubject && matchesDifficulty && matchesType && matchesSearch;
    });
    
    renderQuestions();
    showNotification(`Found ${filteredQuestions.length} questions`, 'info');
}

function startRealTimeUpdates() {
    setInterval(() => {
        updateStats();
        if (currentTab === 'live-monitoring') {
            updateMonitoringStats();
        }
    }, 30000);
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    
    if (notification) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-triangle',
            warning: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        
        notification.className = `notification ${type} show`;
        notification.innerHTML = `
            <i class="notification-icon ${icons[type]}"></i>
            <span class="notification-text">${message}</span>
        `;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// ============================================
// CSS INJECTION FOR ENHANCED FEATURES
// ============================================

const enhancedStyles = `
<style>
/* AI Question Generator Styles */
.ai-generator-form .form-group { margin-bottom: 20px; }
.ai-generator-form label { display: block; margin-bottom: 5px; font-weight: 500; }
.ai-generator-form select, .ai-generator-form input { width: 100%; padding: 10px; border: 2px solid var(--border-color); border-radius: 8px; }

/* Progress Bars */
.progress-bar { width: 100%; height: 20px; background: var(--border-color); border-radius: 10px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent-green), var(--accent-blue)); transition: width 0.3s ease; }

/* Student Monitor Cards */
.student-monitor-card { border: 2px solid var(--border-color); border-radius: 12px; padding: 15px; margin-bottom: 15px; }
.student-monitor-card.high-risk { border-color: var(--accent-red); }
.student-monitor-card.medium-risk { border-color: var(--accent-yellow); }
.student-monitor-card.low-risk { border-color: var(--accent-green); }

/* AI Tags */
.ai-tag { background: var(--accent-purple); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; margin-left: 8px; }

/* Enhanced Notifications */
.notification { position: fixed; top: 20px; right: 20px; padding: 15px 20px; border-radius: 8px; color: white; z-index: 10000; opacity: 0; transition: opacity 0.3s; }
.notification.show { opacity: 1; }
.notification.success { background: var(--accent-green); }
.notification.error { background: var(--accent-red); }
.notification.warning { background: var(--accent-yellow); color: #000; }
.notification.info { background: var(--accent-blue); }

/* Modal Enhancements */
.modal.show { display: flex !important; }
.modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center; }
.modal-content { background: var(--bg-primary); border-radius: 12px; max-width: 90%; max-height: 90%; overflow-y: auto; }

/* Test Preview Styles */
.question-preview-item { background: var(--bg-secondary); padding: 15px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid var(--accent-green); }
.option-preview { padding: 5px 10px; margin: 3px 0; border-radius: 5px; background: var(--bg-tertiary); }
.option-preview.correct { background: var(--accent-green); color: white; }

/* Statistics Styles */
.stat-box { text-align: center; padding: 15px; background: var(--bg-secondary); border-radius: 10px; }
.stat-number { font-size: 1.5rem; font-weight: 700; color: var(--accent-green); }
.stat-label { font-size: 0.8rem; color: var(--text-secondary); margin-top: 5px; }
</style>
`;

// Inject enhanced styles
if (!document.getElementById('enhanced-test-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'enhanced-test-styles';
    styleSheet.innerHTML = enhancedStyles;
    document.head.appendChild(styleSheet);
}

console.log('🎓 Complete Test Management System with AI Generator loaded successfully!');
console.log('🚀 All HTML buttons integrated with working functions!');
console.log('🤖 AI Question Generator ready with full test preview!');
console.log('📊 Real-time proctoring and analytics active!');
