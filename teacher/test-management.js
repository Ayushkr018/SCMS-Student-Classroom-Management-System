// Theme Management - Same as existing files
function initializeTheme() {
    const savedTheme = localStorage.getItem('scms-theme') || 'light';
    const themeIcon = document.getElementById('themeIcon');
    const mobileThemeIcon = document.getElementById('mobileThemeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const themeSwitch = document.getElementById('themeSwitch');

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        mobileThemeIcon.className = 'fas fa-sun';
        themeLabel.textContent = 'Light Mode';
        themeSwitch.classList.add('active');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon';
        mobileThemeIcon.className = 'fas fa-moon';
        themeLabel.textContent = 'Dark Mode';
        themeSwitch.classList.remove('active');
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
        themeIcon.className = 'fas fa-moon';
        mobileThemeIcon.className = 'fas fa-moon';
        themeLabel.textContent = 'Dark Mode';
        themeSwitch.classList.remove('active');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('scms-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        mobileThemeIcon.className = 'fas fa-sun';
        themeLabel.textContent = 'Light Mode';
        themeSwitch.classList.add('active');
    }
}

// Mobile Sidebar Management
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
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
    
    document.getElementById('userName').textContent = user.name || 'Teacher';
    if (user.department) {
        document.getElementById('userDept').textContent = 
            user.department.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
}

// ⭐ LOGOUT FUNCTION - Updated
function logout() {
    if (confirm('Are you sure you want to logout from Test Management System?')) {
        // Clear user session
        localStorage.removeItem('scms_current_user');
        
        // Show logout notification
        showNotification('Logging out...', 'info');
        
        // Redirect to login page after delay
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    }
}

// ============================================
// ENHANCED MOCK DATABASE WITH AI QUESTIONS
// ============================================

const MOCK_DATABASE = {
    questions: [
        // Original questions
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
            id: 'q003',
            type: 'theory',
            subject: 'cs',
            difficulty: 'hard',
            topic: 'Algorithms',
            question: 'Explain the working principle of Dijkstra\'s algorithm with an example. Discuss its time complexity.',
            modelAnswer: 'Dijkstra\'s algorithm finds shortest paths from source to all vertices. Uses priority queue, relaxes edges, maintains distance array. Time complexity: O((V+E)logV) with binary heap.',
            keywords: ['shortest path', 'priority queue', 'relaxation', 'greedy algorithm', 'graph'],
            marks: 5,
            createdAt: '2024-01-12T16:45:00Z',
            lastModified: '2024-01-20T11:30:00Z',
            usageCount: 12,
            avgScore: 65.2,
            media: null
        },
        {
            id: 'q004',
            type: 'coding',
            subject: 'cs',
            difficulty: 'medium',
            topic: 'Programming',
            question: 'Write a function to reverse a linked list iteratively.',
            language: 'python',
            starterCode: 'def reverse_linked_list(head):\n    # Your code here\n    pass',
            testCases: [
                { input: '[1,2,3,4,5]', output: '[5,4,3,2,1]' },
                { input: '[1,2]', output: '[2,1]' },
                { input: '[]', output: '[]' }
            ],
            marks: 4,
            createdAt: '2024-01-18T13:20:00Z',
            lastModified: '2024-01-22T15:10:00Z',
            usageCount: 8,
            avgScore: 71.8,
            media: null
        },
        
        // ⭐ AI Generated Questions - For Real Prototype Look
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
        },
        {
            id: 'ai_q002',
            type: 'mcq',
            subject: 'cs',
            difficulty: 'medium',
            topic: 'Linked Lists',
            question: 'Which operation is more efficient in a linked list compared to an array?',
            options: ['Random access', 'Insertion at beginning', 'Memory usage', 'Cache performance'],
            correctAnswer: 1,
            explanation: 'Linked lists can insert at the beginning in O(1) time, while arrays require O(n) for shifting elements.',
            marks: 2,
            createdAt: '2025-08-16T18:05:00Z',
            lastModified: '2025-08-16T18:05:00Z',
            usageCount: 3,
            avgScore: 76.4,
            media: null,
            isAIGenerated: true
        },
        {
            id: 'ai_q003',
            type: 'theory',
            subject: 'cs',
            difficulty: 'hard',
            topic: 'Graph Algorithms',
            question: 'Compare and contrast BFS and DFS algorithms. When would you choose one over the other?',
            modelAnswer: 'BFS explores level by level using queue, finds shortest path in unweighted graphs. DFS explores deep using stack/recursion, better for topological sorting. BFS uses more memory but guarantees shortest path. DFS is memory efficient and good for path existence.',
            keywords: ['breadth-first', 'depth-first', 'queue', 'stack', 'shortest path', 'memory'],
            marks: 5,
            createdAt: '2025-08-16T18:10:00Z',
            lastModified: '2025-08-16T18:10:00Z',
            usageCount: 2,
            avgScore: 68.9,
            media: null,
            isAIGenerated: true
        },
        {
            id: 'ai_q004',
            type: 'mcq',
            subject: 'math',
            difficulty: 'easy',
            topic: 'Linear Equations',
            question: 'What is the solution to the equation 3x + 9 = 21?',
            options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
            correctAnswer: 1,
            explanation: '3x + 9 = 21, so 3x = 12, therefore x = 4.',
            marks: 1,
            createdAt: '2025-08-16T18:15:00Z',
            lastModified: '2025-08-16T18:15:00Z',
            usageCount: 8,
            avgScore: 94.1,
            media: null,
            isAIGenerated: true
        },
        {
            id: 'ai_q005',
            type: 'mcq',
            subject: 'cs',
            difficulty: 'medium',
            topic: 'Database',
            question: 'Which normal form eliminates transitive dependencies?',
            options: ['1NF', '2NF', '3NF', 'BCNF'],
            correctAnswer: 2,
            explanation: 'Third Normal Form (3NF) eliminates transitive dependencies where non-key attributes depend on other non-key attributes.',
            marks: 2,
            createdAt: '2025-08-16T18:20:00Z',
            lastModified: '2025-08-16T18:20:00Z',
            usageCount: 6,
            avgScore: 72.8,
            media: null,
            isAIGenerated: true
        },
        {
            id: 'ai_q006',
            type: 'coding',
            subject: 'cs',
            difficulty: 'medium',
            topic: 'Sorting',
            question: 'Implement bubble sort algorithm in Python.',
            language: 'python',
            starterCode: 'def bubble_sort(arr):\n    # Your implementation here\n    pass',
            testCases: [
                { input: '[64, 34, 25, 12, 22, 11, 90]', output: '[11, 12, 22, 25, 34, 64, 90]' },
                { input: '[5, 2, 8, 1, 9]', output: '[1, 2, 5, 8, 9]' },
                { input: '[1]', output: '[1]' }
            ],
            marks: 3,
            createdAt: '2025-08-16T18:25:00Z',
            lastModified: '2025-08-16T18:25:00Z',
            usageCount: 4,
            avgScore: 79.3,
            media: null,
            isAIGenerated: true
        },
        {
            id: 'ai_q007',
            type: 'theory',
            subject: 'cs',
            difficulty: 'easy',
            topic: 'Object-Oriented Programming',
            question: 'Define encapsulation and explain its benefits in object-oriented programming.',
            modelAnswer: 'Encapsulation is bundling data and methods together in a class while hiding internal implementation. Benefits include data protection, modularity, code reusability, and easier maintenance.',
            keywords: ['encapsulation', 'data hiding', 'modularity', 'class', 'methods'],
            marks: 3,
            createdAt: '2025-08-16T18:30:00Z',
            lastModified: '2025-08-16T18:30:00Z',
            usageCount: 7,
            avgScore: 81.6,
            media: null,
            isAIGenerated: true
        },
        {
            id: 'ai_q008',
            type: 'mcq',
            subject: 'cs',
            difficulty: 'hard',
            topic: 'Operating Systems',
            question: 'Which scheduling algorithm can lead to starvation of long processes?',
            options: ['First Come First Serve', 'Shortest Job First', 'Round Robin', 'Priority Scheduling'],
            correctAnswer: 1,
            explanation: 'Shortest Job First (SJF) can cause starvation as long processes may never execute if short processes keep arriving.',
            marks: 3,
            createdAt: '2025-08-16T18:35:00Z',
            lastModified: '2025-08-16T18:35:00Z',
            usageCount: 3,
            avgScore: 63.2,
            media: null,
            isAIGenerated: true
        },
        {
            id: 'ai_q009',
            type: 'mcq',
            subject: 'math',
            difficulty: 'medium',
            topic: 'Probability',
            question: 'What is the probability of getting two heads when flipping a fair coin twice?',
            options: ['1/2', '1/3', '1/4', '3/4'],
            correctAnswer: 2,
            explanation: 'Probability = (Number of favorable outcomes)/(Total outcomes) = 1/4. Possible outcomes: HH, HT, TH, TT.',
            marks: 2,
            createdAt: '2025-08-16T18:40:00Z',
            lastModified: '2025-08-16T18:40:00Z',
            usageCount: 9,
            avgScore: 87.3,
            media: null,
            isAIGenerated: true
        },
        {
            id: 'ai_q010',
            type: 'theory',
            subject: 'cs',
            difficulty: 'medium',
            topic: 'Software Engineering',
            question: 'Explain the Agile methodology and its key principles. How does it differ from Waterfall model?',
            modelAnswer: 'Agile is iterative development approach with short sprints, customer collaboration, and adaptive planning. Key principles: individuals over processes, working software over documentation, customer collaboration over contracts. Unlike Waterfall, Agile allows changes, promotes early delivery, and encourages feedback.',
            keywords: ['agile', 'iterative', 'sprints', 'waterfall', 'collaboration', 'adaptive'],
            marks: 4,
            createdAt: '2025-08-16T18:45:00Z',
            lastModified: '2025-08-16T18:45:00Z',
            usageCount: 5,
            avgScore: 74.7,
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
            questions: ['q001', 'q002', 'q003', 'q004'],
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
                faceRecognition: false,
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
            avgScore: 78.5,
            analytics: {
                scoreDistribution: [2, 5, 12, 18, 8],
                difficultyAnalysis: { easy: 85.2, medium: 72.3, hard: 58.9 },
                violations: {
                    tabSwitches: 12,
                    faceNotDetected: 3,
                    multipleFaces: 1,
                    suspiciousMovement: 5
                }
            }
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
            questions: ['q001', 'q002', 'ai_q001', 'ai_q002'],
            settings: {
                shuffleQuestions: true,
                shuffleOptions: false,
                showResults: true,
                negativeMarking: false,
                negativePercent: 0,
                passPercentage: 50,
                timePerQuestion: false,
                autoSubmit: true
            },
            antiCheat: {
                enableCamera: false,
                tabSwitchDetection: true,
                maxTabSwitches: 5,
                fullscreenMode: false,
                disableRightClick: false,
                copyPaste: false,
                printScreen: false,
                violationAction: 'warn'
            },
            createdAt: '2024-02-18T11:15:00Z',
            createdBy: 'prof_001',
            participants: 38,
            completed: 0,
            avgScore: 0,
            analytics: null
        },
        {
            id: 'test003',
            title: 'AI Generated Test - Algorithms',
            subject: 'cs',
            description: 'Auto-generated test covering various algorithmic concepts',
            totalMarks: 35,
            duration: 60,
            startTime: '2025-08-20T14:00:00Z',
            endTime: '2025-08-20T15:00:00Z',
            status: 'scheduled',
            questions: ['ai_q003', 'ai_q005', 'ai_q006', 'ai_q008'],
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
                maxTabSwitches: 2,
                fullscreenMode: true,
                disableRightClick: true,
                copyPaste: true,
                printScreen: true,
                violationAction: 'submit'
            },
            createdAt: '2025-08-16T18:50:00Z',
            createdBy: 'ai_generator',
            participants: 0,
            completed: 0,
            avgScore: 0,
            analytics: null,
            isAIGenerated: true
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
                violations: 0,
                lastActivity: new Date()
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
                violations: 1,
                lastActivity: new Date()
            },
            performance: {
                testsCompleted: 4,
                avgScore: 89.1,
                bestScore: 98,
                worstScore: 75,
                totalViolations: 0
            }
        },
        {
            id: 'st003',
            name: 'Arjun Patel',
            rollNo: 'CS003',
            email: 'arjun.patel@student.edu',
            avatar: 'AP',
            currentStatus: 'offline',
            testActivity: {
                currentTest: null,
                progress: 0,
                timeRemaining: 0,
                questionsAnswered: 0,
                totalQuestions: 0,
                violations: 0,
                lastActivity: new Date(Date.now() - 300000)
            },
            performance: {
                testsCompleted: 6,
                avgScore: 76.8,
                bestScore: 88,
                worstScore: 62,
                totalViolations: 1
            }
        }
    ],
    
    liveMonitoring: {
        activeTest: 'test002',
        totalStudents: 24,
        violations: 3,
        timeRemaining: '45:32',
        avgProgress: 67,
        alerts: [
            {
                id: 'alert001',
                type: 'warning',
                student: 'st001',
                message: 'Tab switch detected',
                timestamp: new Date(Date.now() - 300000),
                severity: 'medium'
            },
            {
                id: 'alert002',
                type: 'danger',
                student: 'st003',
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
let alertsInterval;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    initializeTestManagement();
    startRealTimeUpdates();

    // Close mobile sidebar when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    });
});

function initializeTestManagement() {
    loadOverviewData();
    loadQuestionBank();
    initializeTestCreator();
    setupEventListeners();
    updateStats();
}

// ============================================
// TAB MANAGEMENT (Fixed Functions)
// ============================================

function switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Update active tab content
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
// OVERVIEW TAB FUNCTIONS (Fixed avg score bug)
// ============================================

function loadOverviewData() {
    updateStats();
    loadRecentTests();
}

function updateStats() {
    const totalTests = MOCK_DATABASE.tests.length;
    const activeTests = MOCK_DATABASE.tests.filter(test => test.status === 'active').length;
    const totalQuestions = MOCK_DATABASE.questions.length;
    
    // Fixed: Calculate average score only from completed tests
    const completedTests = MOCK_DATABASE.tests.filter(test => test.status === 'completed' && test.avgScore > 0);
    const avgScore = completedTests.length > 0 
        ? completedTests.reduce((acc, test) => acc + test.avgScore, 0) / completedTests.length 
        : 0;
    
    // Update DOM elements with proper checks
    const totalTestsEl = document.getElementById('totalTests');
    const activeTestsEl = document.getElementById('activeTests'); 
    const totalQuestionsEl = document.getElementById('totalQuestions');
    const avgScoreEl = document.getElementById('avgScore');
    
    if (totalTestsEl) totalTestsEl.textContent = totalTests;
    if (activeTestsEl) activeTestsEl.textContent = activeTests;
    if (totalQuestionsEl) totalQuestionsEl.textContent = totalQuestions.toLocaleString();
    if (avgScoreEl) avgScoreEl.textContent = avgScore.toFixed(1) + '%';
    
    // Animate counters
    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        if (!counter.textContent) return;
        
        const targetText = counter.textContent;
        const targetValue = parseFloat(targetText.replace(/[^\d.]/g, ''));
        
        if (isNaN(targetValue)) return;
        
        let current = 0;
        const increment = targetValue / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                if (counter.id === 'avgScore') {
                    counter.textContent = targetValue.toFixed(1) + '%';
                } else if (counter.id === 'totalQuestions') {
                    counter.textContent = targetValue.toLocaleString();
                } else {
                    counter.textContent = Math.floor(targetValue);
                }
                clearInterval(timer);
            } else {
                if (counter.id === 'avgScore') {
                    counter.textContent = current.toFixed(1) + '%';
                } else if (counter.id === 'totalQuestions') {
                    counter.textContent = Math.floor(current).toLocaleString();
                } else {
                    counter.textContent = Math.floor(current);
                }
            }
        }, 20);
    });
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
    const timeInfo = getTimeInfo(test);
    
    // Add AI indicator if test is AI generated
    const aiIndicator = test.isAIGenerated ? '<span class="meta-tag" style="background: var(--accent-purple); color: white; margin-left: 10px;">🤖 AI</span>' : '';
    
    item.innerHTML = `
        <div class="test-info">
            <h4>${test.title}${aiIndicator}</h4>
            <div class="test-details">
                <div><i class="fas fa-book"></i> ${test.subject.toUpperCase()}</div>
                <div><i class="fas fa-clock"></i> ${test.duration} minutes</div>
                <div><i class="fas fa-users"></i> ${test.participants} students</div>
                <div><i class="fas fa-calendar"></i> ${formatDate(test.startTime)}</div>
            </div>
        </div>
        <div class="test-status">
            <span class="status-badge ${statusClass}">${statusText}</span>
            <span class="test-time-info">${timeInfo}</span>
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

function getTimeInfo(test) {
    const now = new Date();
    const startTime = new Date(test.startTime);
    const endTime = new Date(test.endTime);
    
    if (test.status === 'active') {
        const remaining = Math.max(0, endTime - now);
        return `${Math.floor(remaining / 60000)}m remaining`;
    } else if (test.status === 'scheduled') {
        const timeToStart = startTime - now;
        if (timeToStart > 86400000) { // > 1 day
            return `In ${Math.floor(timeToStart / 86400000)}d`;
        } else {
            return `In ${Math.floor(timeToStart / 3600000)}h ${Math.floor((timeToStart % 3600000) / 60000)}m`;
        }
    } else if (test.status === 'completed') {
        return `${test.completed}/${test.participants} completed`;
    }
    return 'Not scheduled';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ============================================
// QUESTION BANK FUNCTIONS (Enhanced with AI questions)
// ============================================

function loadQuestionBank() {
    filteredQuestions = [...MOCK_DATABASE.questions];
    renderQuestions();
    setupQuestionFilters();
}

function setupQuestionFilters() {
    const subjectFilter = document.getElementById('subjectFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const typeFilter = document.getElementById('typeFilter');
    const searchInput = document.getElementById('questionSearch');
    
    if (subjectFilter) {
        subjectFilter.addEventListener('change', filterQuestions);
    }
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', filterQuestions);
    }
    if (typeFilter) {
        typeFilter.addEventListener('change', filterQuestions);
    }
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterQuestions, 300));
    }
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

function renderQuestions() {
    const questionsList = document.getElementById('questionsList');
    if (!questionsList) return;
    
    questionsList.innerHTML = '';
    
    if (filteredQuestions.length === 0) {
        questionsList.innerHTML = `
            <div class="no-questions" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                <i class="fas fa-question-circle" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <h3>No questions found</h3>
                <p>Try adjusting your filters or add new questions</p>
                <button class="btn btn-primary" onclick="addNewQuestion()" style="margin-top: 15px;">
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
    card.dataset.questionId = question.id;
    
    const difficultyClass = `difficulty-${question.difficulty}`;
    const typeClass = `type-${question.type}`;
    
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
    } else if (question.type === 'theory') {
        optionsHtml = `
            <div class="question-keywords">
                <strong>Keywords:</strong> ${question.keywords?.join(', ') || 'N/A'}
            </div>
        `;
    }
    
    // Add AI indicator
    const aiGenerated = question.isAIGenerated ? '<span class="meta-tag" style="background: var(--accent-purple); color: white;">🤖 AI</span>' : '';
    
    card.innerHTML = `
        <div class="question-header">
            <div class="question-meta">
                <span class="meta-tag ${difficultyClass}">${question.difficulty}</span>
                <span class="meta-tag ${typeClass}">${question.type.toUpperCase()}</span>
                <span class="meta-tag">${question.marks} marks</span>
                ${aiGenerated}
            </div>
            <div class="question-stats">
                <span title="Usage count"><i class="fas fa-chart-bar"></i> ${question.usageCount}</span>
                <span title="Average score"><i class="fas fa-star"></i> ${question.avgScore}%</span>
            </div>
        </div>
        <div class="question-text">${question.question}</div>
        ${optionsHtml}
        <div class="question-footer">
            <div class="question-info">
                <span><i class="fas fa-tag"></i> ${question.topic}</span>
                <span><i class="fas fa-clock"></i> ${formatDate(question.createdAt)}</span>
            </div>
            <div class="question-actions">
                <button class="action-btn" onclick="editQuestion('${question.id}')" title="Edit">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn" onclick="duplicateQuestion('${question.id}')" title="Duplicate">
                    <i class="fas fa-copy"></i> Duplicate
                </button>
                <button class="action-btn" onclick="deleteQuestion('${question.id}')" title="Delete">
                    <i class="fas fa-trash"></i> Delete
                </button>
                <button class="action-btn" onclick="previewQuestion('${question.id}')" title="Preview">
                    <i class="fas fa-eye"></i> Preview
                </button>
            </div>
        </div>
    `;
    
    // Add click to select functionality
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.question-actions')) {
            toggleQuestionSelection(question.id);
        }
    });
    
    return card;
}

function toggleQuestionSelection(questionId) {
    const card = document.querySelector(`[data-question-id="${questionId}"]`);
    const isSelected = card.classList.contains('selected');
    
    if (isSelected) {
        card.classList.remove('selected');
        selectedQuestions = selectedQuestions.filter(id => id !== questionId);
    } else {
        card.classList.add('selected');
        selectedQuestions.push(questionId);
    }
    
    updateSelectedCount();
}

function updateSelectedCount() {
    const countElement = document.getElementById('selectedCount');
    if (countElement) {
        countElement.textContent = selectedQuestions.length;
    }
}

// ============================================
// TEST CREATOR FUNCTIONS (Enhanced)
// ============================================

function initializeTestCreator() {
    currentStep = 1;
    selectedQuestions = [];
    testSettings = {};
    antiCheatSettings = {};
    
    showCreatorStep(1);
    setupCreatorEventListeners();
    loadAvailableQuestions();
}

function setupCreatorEventListeners() {
    // Form validation
    const testForm = document.querySelector('.test-basic-form');
    if (testForm) {
        testForm.addEventListener('input', validateCurrentStep);
    }
    
    // Settings toggles
    const settingsToggle = document.getElementById('negativeMarking');
    if (settingsToggle) {
        settingsToggle.addEventListener('change', function() {
            const valueInput = document.getElementById('negativeMarkingValue');
            if (valueInput) {
                valueInput.style.display = this.checked ? 'block' : 'none';
            }
        });
    }
    
    const cameraToggle = document.getElementById('enableCamera');
    if (cameraToggle) {
        cameraToggle.addEventListener('change', function() {
            const cameraSettings = document.getElementById('cameraSettings');
            if (cameraSettings) {
                cameraSettings.style.display = this.checked ? 'block' : 'none';
            }
        });
    }
}

function showCreatorStep(step) {
    // Update step indicator
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        stepEl.classList.toggle('active', index + 1 === step);
    });
    
    // Show corresponding step content
    document.querySelectorAll('.creator-step').forEach((stepContent, index) => {
        stepContent.classList.toggle('active', index + 1 === step);
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const createBtn = document.getElementById('createBtn');
    
    if (prevBtn) prevBtn.style.display = step === 1 ? 'none' : 'inline-flex';
    if (nextBtn) nextBtn.style.display = step === 5 ? 'none' : 'inline-flex';
    if (createBtn) createBtn.style.display = step === 5 ? 'inline-flex' : 'none';
    
    // Load step-specific content
    if (step === 2) loadAvailableQuestions();
    if (step === 5) generateTestPreview();
    
    currentStep = step;
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < 5) {
            showCreatorStep(currentStep + 1);
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        showCreatorStep(currentStep - 1);
    }
}

function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            return validateBasicInfo();
        case 2:
            return validateQuestionSelection();
        case 3:
            return validateTestSettings();
        case 4:
            return validateAntiCheatSettings();
        case 5:
            return true;
        default:
            return false;
    }
}

function validateBasicInfo() {
    const title = document.getElementById('testTitle')?.value;
    const subject = document.getElementById('testSubject')?.value;
    const duration = document.getElementById('testDuration')?.value;
    
    if (!title || !subject || !duration) {
        showNotification('Please fill all required fields', 'error');
        return false;
    }
    
    if (duration < 1 || duration > 600) {
        showNotification('Duration must be between 1 and 600 minutes', 'error');
        return false;
    }
    
    return true;
}

function validateQuestionSelection() {
    if (selectedQuestions.length === 0) {
        showNotification('Please select at least one question', 'error');
        return false;
    }
    
    return true;
}

function validateTestSettings() {
    storeTestSettings();
    return true;
}

function validateAntiCheatSettings() {
    storeAntiCheatSettings();
    return true;
}

function storeTestSettings() {
    testSettings = {
        shuffleQuestions: document.getElementById('shuffleQuestions')?.checked || false,
        shuffleOptions: document.getElementById('shuffleOptions')?.checked || false,
        showResults: document.getElementById('showResults')?.checked || false,
        negativeMarking: document.getElementById('negativeMarking')?.checked || false,
        negativePercent: parseInt(document.getElementById('negativePercent')?.value) || 25,
        passPercentage: parseInt(document.getElementById('passPercentage')?.value) || 40,
        timePerQuestion: document.getElementById('timePerQuestion')?.checked || false,
        autoSubmit: document.getElementById('autoSubmit')?.checked || true
    };
}

function storeAntiCheatSettings() {
    antiCheatSettings = {
        enableCamera: document.getElementById('enableCamera')?.checked || false,
        livenessCheck: document.getElementById('livenessCheck')?.checked || false,
        faceRecognition: document.getElementById('faceRecognition')?.checked || false,
        recordingFreq: document.getElementById('recordingFreq')?.value || 'continuous',
        tabSwitchDetection: document.getElementById('tabSwitchDetection')?.checked || true,
        maxTabSwitches: parseInt(document.getElementById('maxTabSwitches')?.value) || 3,
        fullscreenMode: document.getElementById('fullscreenMode')?.checked || true,
        disableRightClick: document.getElementById('disableRightClick')?.checked || true,
        copyPaste: document.getElementById('copyPaste')?.checked || true,
        printScreen: document.getElementById('printScreen')?.checked || true,
        violationAction: document.getElementById('violationAction')?.value || 'warn'
    };
}

function loadAvailableQuestions() {
    const availableQuestions = document.getElementById('availableQuestions');
    if (!availableQuestions) return;
    
    availableQuestions.innerHTML = '';
    
    MOCK_DATABASE.questions.forEach(question => {
        const questionCard = createSelectableQuestionCard(question);
        availableQuestions.appendChild(questionCard);
    });
    
    updateSelectedQuestionsList();
}

function createSelectableQuestionCard(question) {
    const card = document.createElement('div');
    card.className = 'selectable-question';
    card.dataset.questionId = question.id;
    
    if (selectedQuestions.includes(question.id)) {
        card.classList.add('selected');
    }
    
    // Add AI indicator
    const aiIndicator = question.isAIGenerated ? ' 🤖' : '';
    
    card.innerHTML = `
        <div class="question-meta">
            <span class="difficulty-${question.difficulty}">${question.difficulty}</span>
            <span class="type-${question.type}">${question.type.toUpperCase()}</span>
            <span>${question.marks} marks</span>
        </div>
        <div class="question-preview">${question.question.substring(0, 100)}...${aiIndicator}</div>
        <div class="question-topic">${question.topic}</div>
    `;
    
    card.addEventListener('click', () => {
        toggleQuestionForTest(question.id);
    });
    
    return card;
}

function toggleQuestionForTest(questionId) {
    const card = document.querySelector(`[data-question-id="${questionId}"]`);
    const isSelected = selectedQuestions.includes(questionId);
    
    if (isSelected) {
        selectedQuestions = selectedQuestions.filter(id => id !== questionId);
        card.classList.remove('selected');
    } else {
        selectedQuestions.push(questionId);
        card.classList.add('selected');
    }
    
    updateSelectedQuestionsList();
    updateSelectedCount();
}

function updateSelectedQuestionsList() {
    const selectedList = document.getElementById('selectedQuestionsList');
    if (!selectedList) return;
    
    selectedList.innerHTML = '';
    
    if (selectedQuestions.length === 0) {
        selectedList.innerHTML = '<p>No questions selected yet</p>';
        return;
    }
    
    selectedQuestions.forEach(questionId => {
        const question = MOCK_DATABASE.questions.find(q => q.id === questionId);
        if (question) {
            const item = document.createElement('div');
            item.className = 'selected-item';
            const aiIndicator = question.isAIGenerated ? ' 🤖' : '';
            item.innerHTML = `
                <span>${question.question.substring(0, 60)}...${aiIndicator}</span>
                <button class="remove-question" onclick="removeQuestionFromTest('${questionId}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            selectedList.appendChild(item);
        }
    });
}

function removeQuestionFromTest(questionId) {
    selectedQuestions = selectedQuestions.filter(id => id !== questionId);
    
    // Update UI
    const card = document.querySelector(`[data-question-id="${questionId}"]`);
    if (card) card.classList.remove('selected');
    
    updateSelectedQuestionsList();
    updateSelectedCount();
    showNotification('Question removed from test', 'info');
}

function selectMethod(method) {
    // Update method buttons
    document.querySelectorAll('.method-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.method-btn').classList.add('active');
    
    // Show/hide selection interfaces
    document.querySelectorAll('.manual-selection').forEach(sel => sel.classList.remove('active'));
    if (method === 'manual') {
        document.getElementById('manual-selection').classList.add('active');
    }
    
    showNotification(`${method} selection method activated`, 'info');
}

function generateTestPreview() {
    const previewDetails = document.getElementById('testPreviewDetails');
    const questionsSummary = document.getElementById('questionsSummary');
    const securitySummary = document.getElementById('securitySummary');
    
    if (previewDetails) {
        const title = document.getElementById('testTitle')?.value || 'Untitled Test';
        const subject = document.getElementById('testSubject')?.value || 'Unknown';
        const duration = document.getElementById('testDuration')?.value || '0';
        const totalMarks = selectedQuestions.reduce((sum, qId) => {
            const q = MOCK_DATABASE.questions.find(question => question.id === qId);
            return sum + (q ? q.marks : 0);
        }, 0);
        
        previewDetails.innerHTML = `
            <div class="preview-item">
                <span class="preview-label">Title:</span>
                <span class="preview-value">${title}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Subject:</span>
                <span class="preview-value">${subject.toUpperCase()}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Duration:</span>
                <span class="preview-value">${duration} minutes</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Total Marks:</span>
                <span class="preview-value">${totalMarks}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Questions:</span>
                <span class="preview-value">${selectedQuestions.length}</span>
            </div>
        `;
    }
    
    if (questionsSummary) {
        const questionTypes = {};
        const difficulties = {};
        let aiCount = 0;
        
        selectedQuestions.forEach(qId => {
            const q = MOCK_DATABASE.questions.find(question => question.id === qId);
            if (q) {
                questionTypes[q.type] = (questionTypes[q.type] || 0) + 1;
                difficulties[q.difficulty] = (difficulties[q.difficulty] || 0) + 1;
                if (q.isAIGenerated) aiCount++;
            }
        });
        
        questionsSummary.innerHTML = `
            <h5>By Type:</h5>
            ${Object.entries(questionTypes).map(([type, count]) => 
                `<div class="summary-item">${type.toUpperCase()}: ${count}</div>`
            ).join('')}
            <h5>By Difficulty:</h5>
            ${Object.entries(difficulties).map(([diff, count]) => 
                `<div class="summary-item">${diff}: ${count}</div>`
            ).join('')}
            ${aiCount > 0 ? `<h5>AI Generated: ${aiCount} questions</h5>` : ''}
        `;
    }
    
    if (securitySummary) {
        const enabledFeatures = [];
        if (antiCheatSettings.enableCamera) enabledFeatures.push('📷 Camera Monitoring');
        if (antiCheatSettings.tabSwitchDetection) enabledFeatures.push('🚫 Tab Switch Detection');
        if (antiCheatSettings.fullscreenMode) enabledFeatures.push('🖥️ Fullscreen Mode');
        if (antiCheatSettings.disableRightClick) enabledFeatures.push('🖱️ Right Click Disabled');
        if (antiCheatSettings.copyPaste) enabledFeatures.push('📋 Copy/Paste Disabled');
        if (antiCheatSettings.printScreen) enabledFeatures.push('🖨️ Print Screen Disabled');

        securitySummary.innerHTML = enabledFeatures.length > 0 
            ? enabledFeatures.map(feature => `<div class="security-feature">${feature}</div>`).join('')
            : '<div class="no-security">No security features enabled</div>';
    }
}

function createTest() {
    if (!validateCurrentStep()) return;
    
    // Collect test data
    const testData = {
        id: 'test' + Date.now(),
        title: document.getElementById('testTitle').value,
        subject: document.getElementById('testSubject').value,
        description: document.getElementById('testDescription').value,
        totalMarks: selectedQuestions.reduce((sum, qId) => {
            const q = MOCK_DATABASE.questions.find(question => question.id === qId);
            return sum + (q ? q.marks : 0);
        }, 0),
        duration: parseInt(document.getElementById('testDuration').value),
        startTime: document.getElementById('startDateTime').value,
        endTime: document.getElementById('endDateTime').value,
        questions: [...selectedQuestions],
        settings: testSettings,
        antiCheat: antiCheatSettings,
        status: 'draft',
        createdAt: new Date().toISOString(),
        createdBy: 'current_user',
        participants: 0,
        completed: 0,
        avgScore: 0
    };

    MOCK_DATABASE.tests.unshift(testData);
    showNotification('Test created successfully!', 'success');

    setTimeout(() => {
        switchTab('overview');
        initializeTestCreator();
    }, 1500);
}

// ============================================
// LIVE MONITORING FUNCTIONS (Enhanced)
// ============================================

function loadLiveMonitoring() {
    updateMonitoringStats();
    loadStudentGrid();
    loadAlerts();
    
    // Start real-time updates
    if (liveMonitoringInterval) clearInterval(liveMonitoringInterval);
    liveMonitoringInterval = setInterval(() => {
        updateMonitoringStats();
        updateStudentGrid();
        updateAlerts();
    }, 5000);
}

function updateMonitoringStats() {
    const monitoring = MOCK_DATABASE.liveMonitoring;
    
    const statNumbers = document.querySelectorAll('.monitor-stat .stat-number');
    if (statNumbers[0]) statNumbers.textContent = monitoring.totalStudents;
    if (statNumbers[1]) statNumbers[1].textContent = monitoring.violations;
    if (statNumbers[2]) statNumbers[2].textContent = monitoring.timeRemaining;
    if (statNumbers[3]) statNumbers[3].textContent = monitoring.avgProgress + '%';
}

function loadStudentGrid() {
    const studentGrid = document.getElementById('studentGrid');
    if (!studentGrid) return;
    
    studentGrid.innerHTML = '';
    
    MOCK_DATABASE.students.forEach(student => {
        const studentCard = createStudentMonitorCard(student);
        studentGrid.appendChild(studentCard);
    });
}

function updateStudentGrid() {
    // Simulate real-time updates
    MOCK_DATABASE.students.forEach(student => {
        // Randomly update progress
        if (student.testActivity.progress < 100) {
            student.testActivity.progress += Math.random() * 5;
            student.testActivity.progress = Math.min(100, student.testActivity.progress);
        }
        
        // Update time remaining
        if (student.testActivity.timeRemaining > 0) {
            student.testActivity.timeRemaining -= 5;
        }
        
        // Randomly add violations
        if (Math.random() < 0.01) { // 1% chance per update
            student.testActivity.violations++;
            addRandomAlert(student.id);
        }
    });
    
    loadStudentGrid();
}

function createStudentMonitorCard(student) {
    const card = document.createElement('div');
    card.className = `student-monitor-card ${student.testActivity.violations > 0 ? 'violation' : 'active'}`;
    
    const statusClass = student.testActivity.violations > 2 ? 'danger' : 
                       student.testActivity.violations > 0 ? 'warning' : '';
    
    card.innerHTML = `
        <div class="monitor-card-header">
            <span class="student-name">${student.name}</span>
            <span class="status-indicator ${statusClass}"></span>
        </div>
        <div class="camera-feed">
            <i class="fas fa-video"></i>
            Camera Feed - ${student.rollNo}
        </div>
        <div class="monitor-info">
            <span>Progress: <span class="value">${Math.floor(student.testActivity.progress)}%</span></span>
            <span>Time Left: <span class="value">${formatTime(student.testActivity.timeRemaining)}</span></span>
            <span>Questions: <span class="value">${student.testActivity.questionsAnswered}/${student.testActivity.totalQuestions}</span></span>
            <span>Violations: <span class="value">${student.testActivity.violations}</span></span>
        </div>
    `;
    
    card.addEventListener('click', () => viewStudentDetails(student.id));
    
    return card;
}

function formatTime(seconds) {
    if (seconds <= 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function loadAlerts() {
    const alertsList = document.getElementById('alertsList');
    if (!alertsList) return;
    
    alertsList.innerHTML = '';
    
    const alerts = MOCK_DATABASE.liveMonitoring.alerts
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
    
    alerts.forEach(alert => {
        const alertItem = createAlertItem(alert);
        alertsList.appendChild(alertItem);
    });
}

function updateAlerts() {
    // Add new alerts occasionally
    if (Math.random() < 0.1) { // 10% chance
        const students = MOCK_DATABASE.students;
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        addRandomAlert(randomStudent.id);
    }
    
    loadAlerts();
}

function addRandomAlert(studentId) {
    const alertTypes = [
        { type: 'warning', message: 'Tab switch detected', severity: 'medium' },
        { type: 'warning', message: 'Suspicious mouse movement', severity: 'low' },
        { type: 'danger', message: 'Multiple faces detected', severity: 'high' },
        { type: 'warning', message: 'Face not visible', severity: 'medium' },
        { type: 'info', message: 'Returned to test window', severity: 'low' }
    ];
    
    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    
    const newAlert = {
        id: 'alert' + Date.now(),
        type: randomAlert.type,
        student: studentId,
        message: randomAlert.message,
        timestamp: new Date(),
        severity: randomAlert.severity
    };
    
    MOCK_DATABASE.liveMonitoring.alerts.unshift(newAlert);
    MOCK_DATABASE.liveMonitoring.violations++;
}

function createAlertItem(alert) {
    const item = document.createElement('div');
    item.className = `alert-item ${alert.type}`;
    
    const student = MOCK_DATABASE.students.find(s => s.id === alert.student);
    const studentName = student ? student.name : 'Unknown Student';
    
    item.innerHTML = `
        <div class="alert-icon">
            <i class="fas fa-${alert.type === 'danger' ? 'exclamation-triangle' : 
                              alert.type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i>
        </div>
        <div class="alert-content">
            <div class="alert-message">${studentName}: ${alert.message}</div>
            <div class="alert-time">${getTimeAgo(alert.timestamp)}</div>
        </div>
    `;
    
    return item;
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

// ============================================
// ANALYTICS FUNCTIONS (Enhanced)
// ============================================

function loadTestAnalytics() {
    loadBasicCharts();
    loadPerformanceTable();
}

function loadBasicCharts() {
    // Simulate chart loading with placeholders
    const chartContainers = document.querySelectorAll('.chart-container canvas');
    chartContainers.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'var(--accent-green)';
        ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Chart Coming Soon', canvas.width/2, canvas.height/2);
    });
}

function loadPerformanceTable() {
    const tableBody = document.getElementById('performanceTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Generate mock performance data
    MOCK_DATABASE.students.forEach((student, index) => {
        const row = document.createElement('tr');
        const score = Math.floor(Math.random() * 40 + 60); // 60-100
        const timeTaken = Math.floor(Math.random() * 30 + 45); // 45-75 minutes
        const violations = Math.floor(Math.random() * 3);
        
        row.innerHTML = `
            <td>
                <div class="student-profile">
                    <div class="student-avatar">${student.avatar}</div>
                    <div>
                        <div class="student-name">${student.name}</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">${student.rollNo}</div>
                    </div>
                </div>
            </td>
            <td><strong>${score}%</strong></td>
            <td>${timeTaken} mins</td>
            <td><span class="violation-count">${violations}</span></td>
            <td><span class="status-badge ${score >= 60 ? 'status-completed' : 'status-danger'}">
                ${score >= 60 ? 'PASSED' : 'FAILED'}</span></td>
            <td>
                <button class="action-btn" onclick="viewStudentReport('${student.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const iconClasses = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-triangle',
        warning: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    if (notification) {
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="notification-icon ${iconClasses[type]}"></i>
            <span class="notification-text">${message}</span>
        `;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }
}

function setupEventListeners() {
    // Close sidebar overlay on click
    document.getElementById('sidebarOverlay')?.addEventListener('click', closeMobileSidebar);
    
    // Prevent form submission
    document.addEventListener('submit', (e) => {
        e.preventDefault();
    });
}

function startRealTimeUpdates() {
    // Update timestamps and stats every minute
    setInterval(() => {
        updateStats();
        loadRecentTests();
    }, 60000);
}

// ============================================
// ACTION FUNCTIONS (Enhanced with working buttons)
// ============================================

// Header Actions
function createNewTest() {
    switchTab('test-creator');
    initializeTestCreator();
    showNotification('Test creator initialized', 'success');
}

function openQuestionBank() {
    switchTab('question-bank');
    loadQuestionBank();
    showNotification('Question bank loaded', 'info');
}

function viewLiveTests() {
    switchTab('live-monitoring');
    loadLiveMonitoring();
    showNotification('Live monitoring activated', 'success');
}

// Quick Actions
function quickCreateMCQ() {
    switchTab('test-creator');
    initializeTestCreator();
    
    // Pre-filter to MCQ questions
    setTimeout(() => {
        const typeFilter = document.getElementById('browserDifficulty');
        if (typeFilter) {
            typeFilter.value = 'mcq';
            filterQuestions();
        }
    }, 500);
    
    showNotification('Quick MCQ creator ready', 'success');
}

// Continuing from where it was cut off...

function duplicateLastTest() {
    if (MOCK_DATABASE.tests.length > 0) {
        const lastTest = MOCK_DATABASE.tests[0];
        showNotification(`Duplicating "${lastTest.title}"`, 'info');
        
        // Pre-fill creator with last test data
        switchTab('test-creator');
        setTimeout(() => {
            document.getElementById('testTitle').value = lastTest.title + ' (Copy)';
            document.getElementById('testSubject').value = lastTest.subject;
            document.getElementById('testDuration').value = lastTest.duration;
            selectedQuestions = [...lastTest.questions];
            updateSelectedCount();
        }, 500);
    } else {
        showNotification('No tests available to duplicate', 'warning');
    }
}

function importQuestions() {
    showNotification('Question import feature coming soon', 'info');
    // TODO: Implement CSV/Excel import
}

function scheduleTest() {
    switchTab('test-creator');
    showNotification('Test scheduler opened', 'info');
    
    // Focus on datetime fields
    setTimeout(() => {
        const startDateTime = document.getElementById('startDateTime');
        if (startDateTime) {
            const now = new Date();
            now.setHours(now.getHours() + 1);
            startDateTime.value = now.toISOString().slice(0, 16);
            startDateTime.focus();
        }
    }, 500);
}

// Question Bank Actions
function addNewQuestion() {
    showModal('questionModal');
    showNotification('Question creator opened', 'info');
}

function bulkImport() {
    showNotification('Bulk import feature coming soon', 'info');
}

function exportQuestions() {
    // Simulate export
    showNotification('Exporting questions...', 'info');
    
    setTimeout(() => {
        const data = {
            questions: filteredQuestions,
            exportDate: new Date().toISOString(),
            totalCount: filteredQuestions.length
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `questions_export_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Questions exported successfully', 'success');
    }, 1500);
}

function editQuestion(questionId) {
    const question = MOCK_DATABASE.questions.find(q => q.id === questionId);
    if (question) {
        showModal('questionModal');
        populateQuestionForm(question);
        showNotification(`Editing question: ${question.question.substring(0, 30)}...`, 'info');
    }
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

function previewQuestion(questionId) {
    const question = MOCK_DATABASE.questions.find(q => q.id === questionId);
    if (question) {
        showNotification(`Previewing: ${question.question.substring(0, 50)}...`, 'info');
        // TODO: Implement preview modal
    }
}

// Monitoring Actions
function refreshMonitoring() {
    loadLiveMonitoring();
    showNotification('Monitoring data refreshed', 'success');
}

function viewStudentDetails(studentId) {
    const student = MOCK_DATABASE.students.find(s => s.id === studentId);
    if (student) {
        showNotification(`Viewing details for ${student.name}`, 'info');
        // TODO: Implement student details modal
    }
}

// Analytics Actions
function exportAnalytics() {
    showNotification('Exporting analytics report...', 'info');
    
    setTimeout(() => {
        const report = {
            testData: MOCK_DATABASE.tests,
            exportDate: new Date().toISOString(),
            summary: {
                totalTests: MOCK_DATABASE.tests.length,
                totalQuestions: MOCK_DATABASE.questions.length,
                avgScore: 78.5
            }
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `test_analytics_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Analytics exported successfully', 'success');
    }, 2000);
}

function viewStudentReport(studentId) {
    const student = MOCK_DATABASE.students.find(s => s.id === studentId);
    if (student) {
        showNotification(`Opening report for ${student.name}`, 'info');
        // TODO: Implement detailed student report
    }
}

function viewTestDetails(testId) {
    const test = MOCK_DATABASE.tests.find(t => t.id === testId);
    if (test) {
        showNotification(`Viewing test: ${test.title}`, 'info');
        // TODO: Implement test details view
    }
}

function viewAllTests() {
    showNotification('Showing all tests', 'info');
    // TODO: Implement expanded test list view
}

// ============================================
// MODAL FUNCTIONS
// ============================================

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

function populateQuestionForm(question) {
    document.getElementById('questionType').value = question.type;
    document.getElementById('questionSubject').value = question.subject;
    document.getElementById('questionDifficulty').value = question.difficulty;
    document.getElementById('questionText').value = question.question;
    document.getElementById('questionMarks').value = question.marks;
    document.getElementById('questionExplanation').value = question.explanation || '';
    
    toggleQuestionType();
    
    if (question.type === 'mcq') {
        const optionInputs = document.querySelectorAll('[data-option]');
        question.options.forEach((option, index) => {
            if (optionInputs[index]) {
                optionInputs[index].value = option;
            }
        });
        
        const correctRadio = document.querySelector(`input[name="correctAnswer"][value="${question.correctAnswer}"]`);
        if (correctRadio) {
            correctRadio.checked = true;
        }
    }
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
    
    // Update option labels and values
    const options = optionsList.querySelectorAll('.option-item');
    options.forEach((option, index) => {
        const radio = option.querySelector('input[type="radio"]');
        const input = option.querySelector('input[type="text"]');
        
        radio.value = index;
        input.setAttribute('data-option', index);
        input.placeholder = `Option ${String.fromCharCode(65 + index)}`;
    });
}

function saveQuestion() {
    const questionData = {
        id: 'q' + Date.now(),
        type: document.getElementById('questionType').value,
        subject: document.getElementById('questionSubject').value,
        difficulty: document.getElementById('questionDifficulty').value,
        topic: 'General', // TODO: Add topic selection
        question: document.getElementById('questionText').value,
        marks: parseInt(document.getElementById('questionMarks').value),
        explanation: document.getElementById('questionExplanation').value,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        usageCount: 0,
        avgScore: 0,
        media: null
    };
    
    if (questionData.type === 'mcq') {
        const optionInputs = document.querySelectorAll('[data-option]');
        const correctAnswer = document.querySelector('input[name="correctAnswer"]:checked');
        
        questionData.options = Array.from(optionInputs).map(input => input.value);
        questionData.correctAnswer = correctAnswer ? parseInt(correctAnswer.value) : 0;
    } else if (questionData.type === 'theory') {
        const theoryTextarea = document.querySelector('#theoryAnswer textarea');
        questionData.modelAnswer = theoryTextarea ? theoryTextarea.value : '';
        questionData.keywords = questionData.modelAnswer.split(' ').slice(0, 10); // Simple keyword extraction
    }
    
    // Validate required fields
    if (!questionData.question || !questionData.subject || !questionData.marks) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    if (questionData.type === 'mcq' && questionData.options.some(opt => !opt.trim())) {
        showNotification('Please fill all option fields', 'error');
        return;
    }
    
    // Add to database
    MOCK_DATABASE.questions.unshift(questionData);
    
    // Update UI
    closeModal('questionModal');
    if (currentTab === 'question-bank') {
        loadQuestionBank();
    }
    
    showNotification('Question saved successfully!', 'success');
}

// ============================================
// AI QUESTION GENERATOR (Bonus Feature)
// ============================================

function generateAIQuestions() {
    showNotification('🤖 AI Question Generator activated!', 'info');
    
    setTimeout(() => {
        const newAIQuestion = {
            id: 'ai_q' + Date.now(),
            type: 'mcq',
            subject: 'cs',
            difficulty: 'medium',
            topic: 'AI Generated',
            question: 'What is the primary advantage of using hash tables for data storage?',
            options: [
                'Constant time complexity for search operations',
                'Guaranteed sorted order of elements',
                'Minimal memory usage',
                'Easy implementation without collision handling'
            ],
            correctAnswer: 0,
            explanation: 'Hash tables provide O(1) average time complexity for search, insert, and delete operations.',
            marks: 2,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            usageCount: 0,
            avgScore: 0,
            media: null,
            isAIGenerated: true
        };
        
        MOCK_DATABASE.questions.unshift(newAIQuestion);
        if (currentTab === 'question-bank') {
            loadQuestionBank();
        }
        
        showNotification('🎉 AI Question generated successfully!', 'success');
    }, 2000);
}

// ============================================
// ENHANCED FEATURES FOR DEMONSTRATION
// ============================================

// Test publishing function
function publishTest(testId) {
    const test = MOCK_DATABASE.tests.find(t => t.id === testId);
    if (test) {
        test.status = 'scheduled';
        showNotification(`Test "${test.title}" published successfully!`, 'success');
        loadRecentTests();
    }
}

// Test activation function
function activateTest(testId) {
    const test = MOCK_DATABASE.tests.find(t => t.id === testId);
    if (test) {
        test.status = 'active';
        showNotification(`Test "${test.title}" is now LIVE!`, 'success');
        loadRecentTests();
        updateStats();
    }
}

// Real-time test monitoring toggle
let monitoringEnabled = false;
function toggleRealTimeMonitoring() {
    monitoringEnabled = !monitoringEnabled;
    if (monitoringEnabled) {
        showNotification('🔴 Real-time monitoring enabled', 'warning');
        document.body.style.setProperty('--accent-green', '#ef4444');
    } else {
        showNotification('⚫ Real-time monitoring disabled', 'info');
        document.body.style.removeProperty('--accent-green');
    }
}

// Auto-save test progress
function autoSaveTestProgress() {
    if (currentTab === 'test-creator' && currentStep > 1) {
        const testProgress = {
            step: currentStep,
            selectedQuestions: selectedQuestions,
            testSettings: testSettings,
            antiCheatSettings: antiCheatSettings,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('test_creator_progress', JSON.stringify(testProgress));
        showNotification('💾 Progress auto-saved', 'info');
    }
}

// Load saved test progress
function loadSavedProgress() {
    const savedProgress = localStorage.getItem('test_creator_progress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        selectedQuestions = progress.selectedQuestions || [];
        testSettings = progress.testSettings || {};
        antiCheatSettings = progress.antiCheatSettings || {};
        showCreatorStep(progress.step || 1);
        showNotification('📂 Previous progress loaded', 'success');
    }
}

// ============================================
// CLEANUP AND INITIALIZATION
// ============================================

// Auto-save progress every 30 seconds
setInterval(autoSaveTestProgress, 30000);

// Cleanup intervals on page unload
window.addEventListener('beforeunload', () => {
    if (liveMonitoringInterval) clearInterval(liveMonitoringInterval);
    if (alertsInterval) clearInterval(alertsInterval);
    
    // Save current progress
    autoSaveTestProgress();
});

// Initialize enhanced features on load
document.addEventListener('DOMContentLoaded', () => {
    // Load saved progress if available
    setTimeout(loadSavedProgress, 1000);
    
    // Add AI question generator button to question bank
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
    }, 2000);
});

// ============================================
// FINAL ENHANCEMENTS & ERROR HANDLING
// ============================================

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Test Management Error:', e.error);
    showNotification('An error occurred. Please try again.', 'error');
});

// Network status indicator
window.addEventListener('online', () => {
    showNotification('🌐 Connection restored', 'success');
});

window.addEventListener('offline', () => {
    showNotification('📵 Working offline', 'warning');
});

// Performance monitoring
function logPerformance(action) {
    const timestamp = new Date().toISOString();
    const memory = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB' : 'N/A';
    console.log(`[${timestamp}] Action: ${action}, Memory: ${memory}`);
}

// Enhanced notifications with sound (optional)
function playNotificationSound(type) {
    if (type === 'success') {
        // Success sound
    } else if (type === 'error') {
        // Error sound  
    }
}

// Final initialization message
console.log('🎓 SCMS Test Management System loaded successfully!');
console.log('📊 Features: Question Bank, Test Creator, Live Monitoring, Analytics, AI Generation');
console.log('🔒 Security: Anti-cheat, Proctoring, Violation Detection');
console.log('📱 Responsive: Mobile, Tablet, Desktop optimized');
console.log('🎨 Themes: Light/Dark mode support');
console.log('⚡ Real-time: Live updates, monitoring, alerts');

// Export functions for testing (development only)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MOCK_DATABASE,
        showNotification,
        switchTab,
        createTest,
        generateAIQuestions
    };
}
