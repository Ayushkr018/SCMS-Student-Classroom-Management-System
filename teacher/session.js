// Theme Management - Consistent with Landing Page
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

// Mock student data
const STUDENTS_DATA = [
    { id: 'st001', name: 'Raj Kumar', avatar: 'RK', status: 'online' },
    { id: 'st002', name: 'Priya Sharma', avatar: 'PS', status: 'online' },
    { id: 'st003', name: 'Arjun Patel', avatar: 'AP', status: 'away' },
    { id: 'st004', name: 'Sneha Gupta', avatar: 'SG', status: 'online' },
    { id: 'st005', name: 'Vikram Singh', avatar: 'VS', status: 'offline' },
    { id: 'st006', name: 'Anita Rao', avatar: 'AR', status: 'online' },
    { id: 'st007', name: 'Rohit Mehta', avatar: 'RM', status: 'online' },
    { id: 'st008', name: 'Kavya Nair', avatar: 'KN', status: 'away' }
];

// Session state
let sessionStartTime = new Date();
let isRecording = false;
let isMuted = false;
let isScreenSharing = false;
let activePoll = null;
let currentTool = 'pen';
let currentColor = '#000';
let currentSize = 3;
let isDrawing = false;
let chatMessages = [];

// Canvas setup
let canvas, ctx;
let canvasHistory = [];
let historyStep = -1;

// Shape drawing variables
let startX, startY;
let isDrawingShape = false;

// Text tool variables
let textInput;
let isAddingText = false;

// Initialize session
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    initializeWhiteboard();
    loadStudents();
    startSessionTimer();
    initializeChat();
    startLiveUpdates();
    
    // Close mobile sidebar when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    });
});

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

function logout() {
    if (confirm('End session and logout?')) {
        localStorage.removeItem('scms_current_user');
        showNotification('Session ended. Logging out...', 'info');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    }
}

function initializeWhiteboard() {
    canvas = document.getElementById('drawingCanvas');
    ctx = canvas.getContext('2d');
    textInput = document.getElementById('textInput');
    
    // Set canvas size to fill container
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Set drawing properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    
    // Save initial state
    saveCanvasState();
    
    // Mouse events for drawing
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseUp);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    
    // Text input events
    textInput.addEventListener('keydown', handleTextInput);
    textInput.addEventListener('blur', finishTextInput);
    textInput.addEventListener('input', updateTextInputSize);
    
    // Brush size slider
    document.getElementById('brushSize').addEventListener('input', function(e) {
        currentSize = e.target.value;
        document.getElementById('sizeValue').textContent = e.target.value + 'px';
        ctx.lineWidth = currentSize;
    });
}

function handleMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (currentTool === 'pen') {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else if (currentTool === 'eraser') {
        isDrawing = true;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, currentSize, 0, 2 * Math.PI);
        ctx.fill();
    } else if (currentTool === 'text') {
        startTextInput(x, y);
    } else if (['rectangle', 'circle', 'line'].includes(currentTool)) {
        isDrawingShape = true;
        startX = x;
        startY = y;
    }
}

function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (currentTool === 'pen' && isDrawing) {
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if (currentTool === 'eraser' && isDrawing) {
        ctx.beginPath();
        ctx.arc(x, y, currentSize, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function handleMouseUp(e) {
    if (isDrawing) {
        isDrawing = false;
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        saveCanvasState();
    } else if (isDrawingShape) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        drawShape(startX, startY, x, y);
        isDrawingShape = false;
        saveCanvasState();
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function handleTouchEnd(e) {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
}

function selectTool(tool) {
    if (isAddingText) {
        finishTextInput();
    }
    
    currentTool = tool;
    
    // Update tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tool + 'Tool').classList.add('active');
    
    // Update cursor and settings
    if (tool === 'pen') {
        canvas.style.cursor = 'crosshair';
        ctx.globalCompositeOperation = 'source-over';
    } else if (tool === 'eraser') {
        canvas.style.cursor = 'grab';
    } else if (tool === 'text') {
        canvas.style.cursor = 'text';
        ctx.globalCompositeOperation = 'source-over';
    } else if (['rectangle', 'circle', 'line'].includes(tool)) {
        canvas.style.cursor = 'crosshair';
        ctx.globalCompositeOperation = 'source-over';
    }
    
    showNotification(`${tool.charAt(0).toUpperCase() + tool.slice(1)} tool selected`, 'info');
}

function selectColor(color) {
    currentColor = color;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    
    // Update color picker selection
    document.querySelectorAll('.color-picker').forEach(picker => {
        picker.style.border = picker.dataset.color === color ? 
            '3px solid var(--accent-green)' : '2px solid var(--border-color)';
    });
    
    // Update text input color
    if (textInput) {
        textInput.style.color = color;
    }
    
    showNotification(`Color changed to ${color}`, 'info');
}

// Text input functions
function startTextInput(x, y) {
    if (isAddingText) {
        finishTextInput();
    }
    
    isAddingText = true;
    
    textInput.style.display = 'block';
    textInput.style.left = Math.max(0, Math.min(x, canvas.width - 150)) + 'px';
    textInput.style.top = Math.max(0, Math.min(y, canvas.height - 40)) + 'px';
    textInput.style.color = currentColor;
    textInput.style.fontSize = Math.max(12, currentSize * 3) + 'px';
    textInput.value = '';
    
    textInput.focus();
    textInput.select();
    
    showNotification('📝 Click anywhere or press Enter to place text', 'info');
}

function handleTextInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        finishTextInput();
    } else if (e.key === 'Escape') {
        cancelTextInput();
    }
}

function updateTextInputSize() {
    const length = textInput.value.length;
    textInput.style.width = Math.max(150, length * 8 + 30) + 'px';
}

function finishTextInput() {
    if (!isAddingText || !textInput.value.trim()) {
        cancelTextInput();
        return;
    }
    
    const x = parseInt(textInput.style.left);
    const y = parseInt(textInput.style.top);
    const fontSize = Math.max(12, currentSize * 3);
    
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = currentColor;
    ctx.fillText(textInput.value, x, y + fontSize);
    
    cancelTextInput();
    saveCanvasState();
    showNotification('✅ Text added to whiteboard successfully!', 'success');
}

function cancelTextInput() {
    isAddingText = false;
    textInput.style.display = 'none';
    textInput.value = '';
}

function drawShape(startX, startY, endX, endY) {
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    ctx.beginPath();
    
    if (currentTool === 'rectangle') {
        const width = endX - startX;
        const height = endY - startY;
        ctx.rect(startX, startY, width, height);
        ctx.stroke();
    } else if (currentTool === 'circle') {
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
    } else if (currentTool === 'line') {
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}

function saveCanvasState() {
    historyStep++;
    if (historyStep < canvasHistory.length) {
        canvasHistory.length = historyStep;
    }
    canvasHistory.push(canvas.toDataURL());
}

function undoLastAction() {
    if (historyStep > 0) {
        historyStep--;
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = canvasHistory[historyStep];
        showNotification('↶ Last action undone', 'info');
    } else {
        showNotification('⚠️ Nothing to undo', 'warning');
    }
}

function clearWhiteboard() {
    if (confirm('Clear the whiteboard? This action cannot be undone.')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        saveCanvasState();
        showNotification('🗑️ Whiteboard cleared successfully', 'success');
    }
}

function saveWhiteboard() {
    const link = document.createElement('a');
    link.download = `whiteboard_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    showNotification('💾 Whiteboard saved successfully', 'success');
}

function loadStudents() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';
    
    STUDENTS_DATA.forEach(student => {
        const studentItem = document.createElement('div');
        studentItem.className = 'student-item';
        studentItem.onclick = () => selectStudent(student.id);
        
        studentItem.innerHTML = `
            <div class="student-profile">
                <div class="student-avatar">${student.avatar}</div>
                <div>
                    <div class="student-name">${student.name}</div>
                    <div class="student-status-text">${student.status}</div>
                </div>
            </div>
            <div class="student-status ${student.status}"></div>
        `;
        
        studentList.appendChild(studentItem);
    });
}

function selectStudent(studentId) {
    const student = STUDENTS_DATA.find(s => s.id === studentId);
    if (student) {
        showNotification(`Selected ${student.name} - Status: ${student.status}`, 'info');
    }
}

function refreshStudents() {
    STUDENTS_DATA.forEach(student => {
        if (Math.random() > 0.8) {
            const statuses = ['online', 'away', 'offline'];
            student.status = statuses[Math.floor(Math.random() * statuses.length)];
        }
    });
    
    loadStudents();
    showNotification('🔄 Student status refreshed', 'info');
}

function startSessionTimer() {
    setInterval(() => {
        const now = new Date();
        const diff = now - sessionStartTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('sessionTimer').textContent = timeString;
    }, 1000);
}

function initializeChat() {
    chatMessages = [
        {
            id: 'msg1',
            sender: 'Teacher',
            avatar: 'T',
            text: 'Welcome to the live session! Feel free to ask questions.',
            time: new Date(Date.now() - 300000).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            })
        },
        {
            id: 'msg2',
            sender: 'Raj Kumar',
            avatar: 'RK',
            text: 'Thank you sir! The screen is clear.',
            time: new Date(Date.now() - 240000).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            })
        }
    ];
    
    displayChatMessages();
}

function displayChatMessages() {
    const chatArea = document.getElementById('chatArea');
    chatArea.innerHTML = '';
    
    chatMessages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        
        messageElement.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">${message.avatar}</div>
                <div class="message-name">${message.sender}</div>
                <div class="message-time">${message.time}</div>
            </div>
            <div class="message-text">${message.text}</div>
        `;
        
        chatArea.appendChild(messageElement);
    });
    
    chatArea.scrollTop = chatArea.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    const newMessage = {
        id: `msg_${Date.now()}`,
        sender: 'Teacher',
        avatar: 'T',
        text: text,
        time: new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        })
    };
    
    chatMessages.push(newMessage);
    displayChatMessages();
    
    input.value = '';
    showNotification('💬 Message sent to all students', 'success');
}

function handleChatEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function toggleChat() {
    const chatArea = document.getElementById('chatArea');
    const toggleBtn = document.getElementById('chatToggle');
    
    if (chatArea.style.display === 'none') {
        chatArea.style.display = 'block';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i> Hide';
    } else {
        chatArea.style.display = 'none';
        toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Show';
    }
}

function togglePollCreator() {
    const pollCreator = document.getElementById('pollCreator');
    const toggleBtn = document.getElementById('pollToggle');
    
    if (pollCreator.style.display === 'none') {
        pollCreator.style.display = 'block';
        toggleBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
    } else {
        pollCreator.style.display = 'none';
        toggleBtn.innerHTML = '<i class="fas fa-plus"></i> Create';
    }
}

function addPollOption() {
    const pollOptions = document.querySelector('.poll-options');
    const optionCount = pollOptions.children.length + 1;
    
    const newOption = document.createElement('div');
    newOption.className = 'poll-option';
    newOption.innerHTML = `
        <input type="text" placeholder="Option ${String.fromCharCode(64 + optionCount)}">
        <i class="fas fa-times" onclick="removeOption(this)" style="cursor: pointer; color: var(--accent-red);"></i>
    `;
    
    pollOptions.appendChild(newOption);
}

function removeOption(element) {
    const pollOptions = document.querySelector('.poll-options');
    if (pollOptions.children.length > 2) {
        element.parentElement.remove();
    } else {
        showNotification('At least 2 options required', 'warning');
    }
}

function launchPoll() {
    const question = document.getElementById('pollQuestion').value.trim();
    const optionInputs = document.querySelectorAll('.poll-option input');
    const options = Array.from(optionInputs).map(input => input.value.trim()).filter(option => option);
    
    if (!question || options.length < 2) {
        showNotification('Please enter a question and at least 2 options', 'warning');
        return;
    }
    
    activePoll = {
        question: question,
        options: options,
        responses: options.map(() => 0),
        totalResponses: 0
    };
    
    displayActivePoll();
    togglePollCreator();
    
    showNotification('🚀 Poll launched successfully! Students can now vote.', 'success');
    
    setTimeout(() => simulatePollResponses(), 2000);
}

function displayActivePoll() {
    const activePollArea = document.getElementById('activePollArea');
    
    activePollArea.innerHTML = `
        <div class="active-poll">
            <div class="poll-question">${activePoll.question}</div>
            <div class="poll-responses">
                ${activePoll.options.map((option, index) => `
                    <div class="response-bar">
                        <div class="response-option">${option}</div>
                        <div class="response-progress">
                            <div class="response-fill" style="width: 0%" id="response-${index}"></div>
                        </div>
                        <div class="response-count" id="count-${index}">0</div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 20px; text-align: center;">
                <strong>Total Responses: <span id="totalResponses">0</span></strong>
                <div style="margin-top: 15px;">
                    <button class="btn btn-danger" onclick="endPoll()">
                        <i class="fas fa-stop"></i>
                        End Poll
                    </button>
                    <button class="btn btn-info" onclick="exportPollResults()" style="margin-left: 10px;">
                        <i class="fas fa-download"></i>
                        Export Results
                    </button>
                </div>
            </div>
        </div>
    `;
}

function simulatePollResponses() {
    if (!activePoll) return;
    
    const numResponses = Math.floor(Math.random() * 5) + 2;
    
    for (let i = 0; i < numResponses; i++) {
        setTimeout(() => {
            const randomOption = Math.floor(Math.random() * activePoll.options.length);
            activePoll.responses[randomOption]++;
            activePoll.totalResponses++;
            
            updatePollDisplay();
        }, i * 800);
    }
}

function updatePollDisplay() {
    if (!activePoll) return;
    
    document.getElementById('totalResponses').textContent = activePoll.totalResponses;
    
    activePoll.responses.forEach((count, index) => {
        const percentage = activePoll.totalResponses > 0 ? 
            (count / activePoll.totalResponses) * 100 : 0;
        
        const fillElement = document.getElementById(`response-${index}`);
        const countElement = document.getElementById(`count-${index}`);
        
        if (fillElement && countElement) {
            fillElement.style.width = `${percentage}%`;
            countElement.textContent = count;
        }
    });
}

function endPoll() {
    if (confirm('End the current poll? Results will be saved.')) {
        showNotification('📊 Poll ended. Results saved successfully!', 'success');
        
        document.getElementById('activePollArea').innerHTML = `
            <div style="padding: 30px; text-align: center; color: var(--text-secondary);">
                <i class="fas fa-poll" style="font-size: 2.5em; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>No active poll</p>
                <small>Create a poll to engage with your students</small>
            </div>
        `;
        
        activePoll = null;
    }
}

function exportPollResults() {
    if (!activePoll) return;
    
    const results = {
        question: activePoll.question,
        options: activePoll.options,
        responses: activePoll.responses,
        totalResponses: activePoll.totalResponses,
        timestamp: new Date().toISOString()
    };
    
    console.log('Poll Results:', results);
    showNotification('📊 Poll results exported successfully!', 'success');
}

function startScreenShare() {
    if (isScreenSharing) return;
    
    isScreenSharing = true;
    
    document.getElementById('screenShareArea').innerHTML = `
        <div style="text-align: center; color: var(--accent-green);">
            <i class="fas fa-desktop" style="font-size: 4em; margin-bottom: 20px;"></i>
            <p><strong>Screen sharing active</strong></p>
            <small>Students can see your screen</small>
        </div>
    `;
    
    document.getElementById('screenControls').style.display = 'flex';
    document.getElementById('shareBtn').innerHTML = '<i class="fas fa-stop"></i> Stop Sharing';
    document.getElementById('shareBtn').onclick = stopScreenShare;
    
    showNotification('🖥️ Screen sharing started', 'success');
}

function stopScreenShare() {
    isScreenSharing = false;
    
    document.getElementById('screenShareArea').innerHTML = `
        <div style="text-align: center;">
            <i class="fas fa-desktop" style="font-size: 4em; margin-bottom: 20px; opacity: 0.5;"></i>
            <p>Screen sharing inactive</p>
            <small>Click "Start Sharing" to share your screen with students</small>
        </div>
    `;
    
    document.getElementById('screenControls').style.display = 'none';
    document.getElementById('shareBtn').innerHTML = '<i class="fas fa-share-square"></i> Start Sharing';
    document.getElementById('shareBtn').onclick = startScreenShare;
    
    showNotification('🖥️ Screen sharing stopped', 'warning');
}

function pauseScreenShare() {
    showNotification('⏸️ Screen sharing paused', 'info');
}

function shareApplication() {
    showNotification('🖥️ Application sharing would open app selector in real implementation', 'info');
}

function togglePointer() {
    showNotification('👆 Pointer tool toggled', 'info');
}

function toggleRecording() {
    if (isRecording) {
        isRecording = false;
        document.getElementById('recordIcon').className = 'fas fa-video';
        showNotification('⏹️ Session recording stopped', 'warning');
    } else {
        isRecording = true;
        document.getElementById('recordIcon').className = 'fas fa-stop';
        showNotification('🔴 Session recording started', 'success');
    }
}

function toggleMute() {
    if (isMuted) {
        isMuted = false;
        document.getElementById('muteIcon').className = 'fas fa-microphone';
        showNotification('🔊 Audio unmuted', 'success');
    } else {
        isMuted = true;
        document.getElementById('muteIcon').className = 'fas fa-microphone-slash';
        showNotification('🔇 Audio muted', 'warning');
    }
}

function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        document.getElementById('fullscreenIcon').className = 'fas fa-expand';
        showNotification('📺 Exited fullscreen mode', 'info');
    } else {
        document.documentElement.requestFullscreen();
        document.getElementById('fullscreenIcon').className = 'fas fa-compress';
        showNotification('📺 Entered fullscreen mode', 'info');
    }
}

function pauseSession() {
    showNotification('⏸️ Session paused. Students have been notified.', 'warning');
}

function endSession() {
    if (confirm('End the live session? All students will be disconnected.')) {
        showNotification('🛑 Ending session...', 'warning');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }
}

function startLiveUpdates() {
    // Simulate new chat messages
    setInterval(() => {
        if (Math.random() > 0.7) {
            const randomStudent = STUDENTS_DATA[Math.floor(Math.random() * STUDENTS_DATA.length)];
            const questions = [
                'Can you explain that concept again?',
                'The screen is clear now, thank you!',
                'Could you share the notes?',
                'Is this topic in the exam?',
                'Thank you for the explanation!',
                'Can we have a quick break?',
                'The audio is perfect now.',
                'Could you slow down a bit?'
            ];
            
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            
            const newMessage = {
                id: `msg_${Date.now()}`,
                sender: randomStudent.name,
                avatar: randomStudent.avatar,
                text: randomQuestion,
                time: new Date().toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                })
            };
            
            chatMessages.push(newMessage);
            displayChatMessages();
        }
    }, 15000);
    
    // Simulate poll responses
    setInterval(() => {
        if (activePoll && Math.random() > 0.8) {
            simulatePollResponses();
        }
    }, 10000);
    
    // Simulate student status changes
    setInterval(() => {
        if (Math.random() > 0.9) {
            refreshStudents();
        }
    }, 20000);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type} show`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };

    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// Handle window resize for canvas
window.addEventListener('resize', () => {
    if (canvas) {
        const container = canvas.parentElement;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        ctx.putImageData(imageData, 0, 0);
    }
});

// Close text input when clicking outside
document.addEventListener('click', function(e) {
    if (isAddingText && !textInput.contains(e.target) && !canvas.contains(e.target)) {
        finishTextInput();
    }
});

// Handle click outside sidebar on mobile
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (window.innerWidth <= 768 && 
        sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
        closeMobileSidebar();
    }
});
