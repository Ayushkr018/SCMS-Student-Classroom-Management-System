// Test State Management
let testState = {
    timeLimit: 30 * 60, // 30 minutes in seconds
    startTime: null,
    questions: [],
    answers: {},
    violations: [],
    isSecureMode: false,
    cameraStream: null,
    screenStream: null
};

// Sample Questions Data
const SAMPLE_QUESTIONS = [
    {
        id: 1,
        text: "What is the time complexity of binary search?",
        options: [
            "O(n)",
            "O(log n)",
            "O(n²)",
            "O(1)"
        ],
        correct: 1
    },
    {
        id: 2,
        text: "Which data structure follows LIFO principle?",
        options: [
            "Queue",
            "Stack",
            "Array",
            "Linked List"
        ],
        correct: 1
    },
    // Add more questions as needed
];

// Initialize Test
document.addEventListener('DOMContentLoaded', function () {
    loadQuestions();
    setupSecurityListeners();
    showSetupModal();
});

function showSetupModal() {
    document.getElementById('setupModal').style.display = 'flex';
}

function enableCamera() {
    navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
    })
        .then(stream => {
            testState.cameraStream = stream;
            document.getElementById('enableCamera').textContent = '✓ Camera Enabled';
            document.getElementById('enableCamera').style.background = 'var(--accent-green)';
            checkSetupComplete();
        })
        .catch(err => {
            showWarning('Camera access is required for this test. Please enable camera permissions.');
        });
}

function enableScreenShare() {
    navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
    })
        .then(stream => {
            testState.screenStream = stream;
            document.getElementById('enableScreenShare').textContent = '✓ Screen Shared';
            document.getElementById('enableScreenShare').style.background = 'var(--accent-green)';
            checkSetupComplete();
        })
        .catch(err => {
            showWarning('Screen sharing is required for test monitoring.');
        });
}

function enterSecureMode() {
    // Request fullscreen
    const element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }

    testState.isSecureMode = true;
    document.getElementById('enterFullscreen').textContent = '✓ Secure Mode';
    document.getElementById('enterFullscreen').style.background = 'var(--accent-green)';
    checkSetupComplete();
}

function checkSetupComplete() {
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const cameraEnabled = testState.cameraStream !== null;
    const screenShared = testState.screenStream !== null;
    const secureMode = testState.isSecureMode;

    if (agreeTerms && cameraEnabled && screenShared && secureMode) {
        document.getElementById('startTest').disabled = false;
    }
}

function startSecureTest() {
    document.getElementById('setupModal').style.display = 'none';
    startTest();
}

function startTest() {
    testState.startTime = Date.now();
    setupCamera();
    startTimer();
    enableSecurityMode();
    showNotification('Test started! Good luck!', 'success');
}

function loadQuestions() {
    testState.questions = SAMPLE_QUESTIONS;
    renderQuestions();
}

function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';

    testState.questions.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <div class="question-header">
                <div class="question-number">${question.id}</div>
                <div class="question-text">${question.text}</div>
            </div>
            <div class="options">
                ${question.options.map((option, index) => `
                    <div class="option" onclick="selectAnswer(${question.id}, ${index})">
                        <input type="radio" name="q${question.id}" value="${index}" id="q${question.id}_${index}">
                        <label for="q${question.id}_${index}">${option}</label>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(questionDiv);
    });
}

function selectAnswer(questionId, optionIndex) {
    testState.answers[questionId] = optionIndex;

    // Update UI
    const options = document.querySelectorAll(`input[name="q${questionId}"]`);
    options.forEach(option => {
        option.parentElement.classList.remove('selected');
    });

    const selectedOption = document.getElementById(`q${questionId}_${optionIndex}`);
    selectedOption.checked = true;
    selectedOption.parentElement.classList.add('selected');
}

function setupCamera() {
    const video = document.getElementById('cameraStream');
    if (testState.cameraStream) {
        video.srcObject = testState.cameraStream;
        video.play();
    }
}

function startTimer() {
    const timerElement = document.getElementById('timeRemaining');

    const updateTimer = () => {
        const elapsed = Math.floor((Date.now() - testState.startTime) / 1000);
        const remaining = testState.timeLimit - elapsed;

        if (remaining <= 0) {
            autoSubmitTest();
            return;
        }

        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Warning at 5 minutes
        if (remaining === 300) {
            showWarning('5 minutes remaining!');
        }

        // Warning at 1 minute
        if (remaining === 60) {
            showWarning('1 minute remaining!');
        }
    };

    updateTimer();
    setInterval(updateTimer, 1000);
}

function submitTest() {
    if (confirm('Are you sure you want to submit your test?')) {
        processSubmission();
    }
}

function autoSubmitTest() {
    showWarning('Time\'s up! Test submitted automatically.');
    processSubmission();
}

function processSubmission() {
    const results = calculateResults();

    // Clean up streams
    if (testState.cameraStream) {
        testState.cameraStream.getTracks().forEach(track => track.stop());
    }
    if (testState.screenStream) {
        testState.screenStream.getTracks().forEach(track => track.stop());
    }

    // Exit fullscreen
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }

    // Show results
    showResults(results);
}

function calculateResults() {
    let correct = 0;
    const total = testState.questions.length;

    testState.questions.forEach(question => {
        if (testState.answers[question.id] === question.correct) {
            correct++;
        }
    });

    return {
        correct,
        total,
        percentage: Math.round((correct / total) * 100),
        violations: testState.violations.length
    };
}

function showResults(results) {
    const resultHtml = `
        <div style="text-align: center; padding: 40px;">
            <h2 style="color: var(--accent-blue); margin-bottom: 20px;">Test Completed!</h2>
            <div style="font-size: 1.2rem; margin-bottom: 15px;">
                Score: ${results.correct}/${results.total} (${results.percentage}%)
            </div>
            <div style="color: var(--text-secondary); margin-bottom: 20px;">
                Security Violations: ${results.violations}
            </div>
            <button onclick="window.location.href='dashboard.html'" style="
                background: var(--accent-blue); 
                color: white; 
                border: none; 
                padding: 15px 30px; 
                border-radius: 10px; 
                cursor: pointer;
                font-size: 1rem;
            ">
                Return to Dashboard
            </button>
        </div>
    `;

    document.body.innerHTML = resultHtml;
}

function showWarning(message) {
    document.getElementById('warningMessage').textContent = message;
    document.getElementById('warningModal').classList.add('show');

    // Log violation
    testState.violations.push({
        time: new Date().toLocaleTimeString(),
        message: message
    });

    updateViolationLog();
}

function acknowledgeWarning() {
    document.getElementById('warningModal').classList.remove('show');
}

function updateViolationLog() {
    const list = document.getElementById('violationsList');
    list.innerHTML = testState.violations.map(violation => `
        <div class="violation-item">
            <div class="violation-time">${violation.time}</div>
            <div class="violation-text">${violation.message}</div>
        </div>
    `).join('');
}

function toggleViolationSidebar() {
    document.getElementById('violationSidebar').classList.toggle('active');
}

// Security listeners will be in proctoring.js
function setupSecurityListeners() {
    // Basic listeners - detailed ones in proctoring.js
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // Disable common shortcuts
        if (e.key === 'F12' ||
            (e.ctrlKey && (e.key === 'u' || e.key === 'i' || e.key === 'j' || e.key === 's')) ||
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            e.key === 'PrintScreen') {
            e.preventDefault();
            showWarning('Keyboard shortcut disabled during test');
            return false;
        }
    });
}

function handleVisibilityChange() {
    if (document.hidden) {
        showWarning('Tab switching detected! Stay focused on the test.');
    }
}

function enableSecurityMode() {
    document.body.classList.add('no-select');

    // Disable right-click
    document.addEventListener('contextmenu', e => {
        e.preventDefault();
        showWarning('Right-click is disabled during test');
    });

    // Monitor for tab switching
    window.addEventListener('blur', () => {
        showWarning('Window lost focus - please stay on the test page');
    });
}

// Agreement checkbox listener
document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.getElementById('agreeTerms');
    if (checkbox) {
        checkbox.addEventListener('change', checkSetupComplete);
    }
});

// Simple notification function
function showNotification(message, type) {
    console.log(`${type.toUpperCase()}: ${message}`);
    // Could enhance with toast notifications
}
