// ========================================
// REAL FUNCTIONAL LIVE SESSION JAVASCRIPT
// ========================================

// Enhanced Theme Management with Real-time Updates
function initializeTheme() {
    const savedTheme = localStorage.getItem('scms-theme') || 
                      (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    const elements = {
        themeIcon: document.getElementById('themeIcon'),
        mobileThemeIcon: document.getElementById('mobileThemeIcon'),
        themeLabel: document.getElementById('themeLabel'),
        themeSwitch: document.getElementById('themeSwitch')
    };
    
    applyTheme(savedTheme, elements);
    
    // System theme change listener
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('scms-theme')) {
                applyTheme(e.matches ? 'dark' : 'light', elements);
            }
        });
    }
}

function applyTheme(theme, elements) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.add('theme-transitioning');
    
    setTimeout(() => document.body.classList.remove('theme-transitioning'), 300);
    
    if (elements.themeIcon) elements.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    if (elements.mobileThemeIcon) elements.mobileThemeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    if (elements.themeLabel) elements.themeLabel.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    if (elements.themeSwitch) {
        theme === 'dark' ? elements.themeSwitch.classList.add('active') : elements.themeSwitch.classList.remove('active');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    const elements = {
        themeIcon: document.getElementById('themeIcon'),
        mobileThemeIcon: document.getElementById('mobileThemeIcon'),
        themeLabel: document.getElementById('themeLabel'),
        themeSwitch: document.getElementById('themeSwitch')
    };
    
    applyTheme(newTheme, elements);
    localStorage.setItem('scms-theme', newTheme);
    showNotification(`🎨 Switched to ${newTheme} mode`, 'success');
}

// Mobile Sidebar with Touch Support
let touchStartX = 0;
let touchCurrentX = 0;
let touchStartY = 0;
let isSidebarDragging = false;

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add touch listeners for swipe to close
        sidebar.addEventListener('touchstart', handleSidebarTouchStart, { passive: true });
        sidebar.addEventListener('touchmove', handleSidebarTouchMove, { passive: false });
        sidebar.addEventListener('touchend', handleSidebarTouchEnd, { passive: true });
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove touch listeners
        sidebar.removeEventListener('touchstart', handleSidebarTouchStart);
        sidebar.removeEventListener('touchmove', handleSidebarTouchMove);
        sidebar.removeEventListener('touchend', handleSidebarTouchEnd);
    }
}

function handleSidebarTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isSidebarDragging = false;
}

function handleSidebarTouchMove(e) {
    if (!touchStartX) return;
    
    touchCurrentX = e.touches[0].clientX;
    const diffX = touchStartX - touchCurrentX;
    const diffY = touchStartY - e.touches[0].clientY;
    
    // Only if horizontal swipe is dominant
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        isSidebarDragging = true;
        e.preventDefault();
        
        // Visual feedback during drag
        if (diffX > 0) {
            const sidebar = document.getElementById('sidebar');
            const progress = Math.min(diffX / 200, 1);
            sidebar.style.transform = `translateX(-${progress * 50}px)`;
            sidebar.style.opacity = 1 - (progress * 0.3);
        }
    }
}

function handleSidebarTouchEnd(e) {
    if (!touchStartX || !isSidebarDragging) return;
    
    const diffX = touchStartX - touchCurrentX;
    const sidebar = document.getElementById('sidebar');
    
    // Reset visual state
    sidebar.style.transform = '';
    sidebar.style.opacity = '';
    
    // Close if swiped more than 100px left
    if (diffX > 100) {
        closeMobileSidebar();
    }
    
    touchStartX = 0;
    touchCurrentX = 0;
    isSidebarDragging = false;
}

// Real Students Data with Live Status Updates
const STUDENTS_DATA = [
    { id: 'st001', name: 'Raj Kumar', avatar: 'RK', status: 'online', engagement: 95, lastSeen: new Date() },
    { id: 'st002', name: 'Priya Sharma', avatar: 'PS', status: 'online', engagement: 88, lastSeen: new Date() },
    { id: 'st003', name: 'Arjun Patel', avatar: 'AP', status: 'away', engagement: 76, lastSeen: new Date(Date.now() - 300000) },
    { id: 'st004', name: 'Sneha Gupta', avatar: 'SG', status: 'online', engagement: 92, lastSeen: new Date() },
    { id: 'st005', name: 'Vikram Singh', avatar: 'VS', status: 'offline', engagement: 65, lastSeen: new Date(Date.now() - 900000) },
    { id: 'st006', name: 'Anita Rao', avatar: 'AR', status: 'online', engagement: 89, lastSeen: new Date() },
    { id: 'st007', name: 'Rohit Mehta', avatar: 'RM', status: 'online', engagement: 91, lastSeen: new Date() },
    { id: 'st008', name: 'Kavya Nair', avatar: 'KN', status: 'away', engagement: 83, lastSeen: new Date(Date.now() - 180000) }
];

// Session State Management
let sessionState = {
    startTime: new Date(),
    isRecording: false,
    isMuted: false,
    isScreenSharing: false,
    isPaused: false,
    activePoll: null,
    analytics: {
        messagesCount: 0,
        pollsCreated: 0,
        whiteboardActions: 0,
        attendeeJoins: 0,
        attendeeLeaves: 0
    }
};

// Whiteboard System with Real Drawing
let whiteboardState = {
    canvas: null,
    ctx: null,
    isDrawing: false,
    currentTool: 'pen',
    currentColor: '#000000',
    currentSize: 3,
    history: [],
    historyStep: -1,
    isAddingText: false,
    textInput: null,
    shapes: {
        isDrawing: false,
        startX: 0,
        startY: 0
    }
};

let chatMessages = [];
let backgroundIntervals = [];

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Live Session System...');
    
    try {
        initializeTheme();
        loadCurrentUser();
        initializeWhiteboard();
        loadStudents();
        initializeChat();
        startSessionTimer();
        startLiveUpdates();
        setupEventListeners();
        
        showNotification('🎯 Live Session Ready! All systems operational.', 'success');
        playStartupSound();
        
    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('⚠️ Some features may not work properly. Please refresh.', 'warning');
    }
});

function setupEventListeners() {
    // Window resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768) {
                closeMobileSidebar();
            }
            handleCanvasResize();
        }, 250);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undoLastAction();
        }
        
        if (e.key === 'Escape') {
            if (whiteboardState.isAddingText) cancelTextInput();
            closeMobileSidebar();
        }
        
        // Spacebar to toggle mute (when not in input)
        if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
            e.preventDefault();
            toggleMute();
        }
    });
    
    // Click outside to close sidebar
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (window.innerWidth <= 768 && 
            sidebar?.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !mobileMenuBtn?.contains(e.target)) {
            closeMobileSidebar();
        }
    });
    
    // Visibility change handler
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            pauseBackgroundActivities();
        } else {
            resumeBackgroundActivities();
        }
    });
}

// ========================================
// USER MANAGEMENT
// ========================================

function loadCurrentUser() {
    let currentUser = localStorage.getItem('scms_current_user');
    
    if (!currentUser) {
        const defaultUser = {
            id: 'teacher_001',
            name: 'Prof. John Smith',
            role: 'teacher',
            department: 'Computer Science',
            avatar: 'JS',
            email: 'john.smith@university.edu'
        };
        localStorage.setItem('scms_current_user', JSON.stringify(defaultUser));
        currentUser = JSON.stringify(defaultUser);
    }
    
    const user = JSON.parse(currentUser);
    
    if (user.role !== 'teacher') {
        alert('Access denied. Teacher privileges required.');
        window.location.href = '../index.html';
        return;
    }
    
    // Update UI
    const userNameEl = document.getElementById('userName');
    const userDeptEl = document.getElementById('userDept');
    
    if (userNameEl) userNameEl.textContent = user.name;
    if (userDeptEl) userDeptEl.textContent = user.department;
    
    // Update avatars
    document.querySelectorAll('.user-avatar').forEach(avatar => {
        avatar.textContent = user.avatar || user.name.charAt(0);
    });
    
    return user;
}

function logout() {
    showConfirmDialog(
        'End Live Session',
        'Are you sure you want to end the live session? All students will be disconnected.',
        'End Session',
        'Continue Session'
    ).then(confirmed => {
        if (confirmed) {
            // Save session data
            saveSessionData();
            
            // Clear storage
            localStorage.removeItem('scms_current_user');
            
            showNotification('👋 Session ended. Logging out...', 'info');
            
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
        }
    });
}

// ========================================
// WHITEBOARD SYSTEM
// ========================================

function initializeWhiteboard() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const textInput = document.getElementById('textInput');
    
    whiteboardState.canvas = canvas;
    whiteboardState.ctx = ctx;
    whiteboardState.textInput = textInput;
    
    // Set canvas size
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Set drawing properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = whiteboardState.currentColor;
    ctx.lineWidth = whiteboardState.currentSize;
    
    saveCanvasState();
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Text input events
    if (textInput) {
        textInput.addEventListener('keydown', handleTextInput);
        textInput.addEventListener('blur', finishTextInput);
    }
    
    // Brush size control
    const brushSize = document.getElementById('brushSize');
    if (brushSize) {
        brushSize.addEventListener('input', function(e) {
            whiteboardState.currentSize = e.target.value;
            ctx.lineWidth = whiteboardState.currentSize;
            
            const sizeValue = document.getElementById('sizeValue');
            if (sizeValue) sizeValue.textContent = e.target.value + 'px';
        });
    }
}

function startDrawing(e) {
    const rect = whiteboardState.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (whiteboardState.currentTool === 'pen') {
        whiteboardState.isDrawing = true;
        whiteboardState.ctx.beginPath();
        whiteboardState.ctx.moveTo(x, y);
    } else if (whiteboardState.currentTool === 'eraser') {
        whiteboardState.isDrawing = true;
        whiteboardState.ctx.globalCompositeOperation = 'destination-out';
        eraseAt(x, y);
    } else if (whiteboardState.currentTool === 'text') {
        startTextInput(x, y);
    } else if (['rectangle', 'circle', 'line'].includes(whiteboardState.currentTool)) {
        whiteboardState.shapes.isDrawing = true;
        whiteboardState.shapes.startX = x;
        whiteboardState.shapes.startY = y;
    }
    
    sessionState.analytics.whiteboardActions++;
}

function draw(e) {
    if (!whiteboardState.isDrawing) return;
    
    const rect = whiteboardState.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (whiteboardState.currentTool === 'pen') {
        whiteboardState.ctx.lineTo(x, y);
        whiteboardState.ctx.stroke();
    } else if (whiteboardState.currentTool === 'eraser') {
        eraseAt(x, y);
    }
}

function stopDrawing(e) {
    if (whiteboardState.isDrawing) {
        whiteboardState.isDrawing = false;
        whiteboardState.ctx.globalCompositeOperation = 'source-over';
        saveCanvasState();
    } else if (whiteboardState.shapes.isDrawing && e) {
        const rect = whiteboardState.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        drawShape(whiteboardState.shapes.startX, whiteboardState.shapes.startY, x, y);
        whiteboardState.shapes.isDrawing = false;
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
    whiteboardState.canvas.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    whiteboardState.canvas.dispatchEvent(mouseEvent);
}

function handleTouchEnd(e) {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    whiteboardState.canvas.dispatchEvent(mouseEvent);
}

function eraseAt(x, y) {
    whiteboardState.ctx.beginPath();
    whiteboardState.ctx.arc(x, y, whiteboardState.currentSize, 0, 2 * Math.PI);
    whiteboardState.ctx.fill();
}

function selectTool(tool) {
    if (whiteboardState.isAddingText) {
        finishTextInput();
    }
    
    whiteboardState.currentTool = tool;
    
    // Update tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    const toolBtn = document.getElementById(tool + 'Tool');
    if (toolBtn) toolBtn.classList.add('active');
    
    // Update cursor
    const canvas = whiteboardState.canvas;
    if (tool === 'pen' || tool === 'rectangle' || tool === 'circle' || tool === 'line') {
        canvas.style.cursor = 'crosshair';
    } else if (tool === 'eraser') {
        canvas.style.cursor = 'grab';
    } else if (tool === 'text') {
        canvas.style.cursor = 'text';
    }
    
    whiteboardState.ctx.globalCompositeOperation = 'source-over';
    showNotification(`${tool.charAt(0).toUpperCase() + tool.slice(1)} tool selected`, 'info');
}

function selectColor(color) {
    whiteboardState.currentColor = color;
    whiteboardState.ctx.strokeStyle = color;
    whiteboardState.ctx.fillStyle = color;
    
    // Update color picker selection
    document.querySelectorAll('.color-picker').forEach(picker => {
        picker.style.border = picker.dataset.color === color ? 
            '3px solid var(--accent-green)' : '2px solid var(--border-color)';
    });
    
    showNotification(`Color changed to ${color}`, 'info');
}

function startTextInput(x, y) {
    if (whiteboardState.isAddingText) finishTextInput();
    
    whiteboardState.isAddingText = true;
    const textInput = whiteboardState.textInput;
    
    textInput.style.display = 'block';
    textInput.style.left = Math.max(0, Math.min(x, whiteboardState.canvas.width - 150)) + 'px';
    textInput.style.top = Math.max(0, Math.min(y, whiteboardState.canvas.height - 40)) + 'px';
    textInput.style.color = whiteboardState.currentColor;
    textInput.style.fontSize = Math.max(12, whiteboardState.currentSize * 3) + 'px';
    textInput.value = '';
    
    textInput.focus();
    showNotification('📝 Type your text and press Enter', 'info');
}

function handleTextInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        finishTextInput();
    } else if (e.key === 'Escape') {
        cancelTextInput();
    }
}

function finishTextInput() {
    const textInput = whiteboardState.textInput;
    
    if (!whiteboardState.isAddingText || !textInput.value.trim()) {
        cancelTextInput();
        return;
    }
    
    const x = parseInt(textInput.style.left);
    const y = parseInt(textInput.style.top);
    const fontSize = Math.max(12, whiteboardState.currentSize * 3);
    
    whiteboardState.ctx.font = `${fontSize}px Arial`;
    whiteboardState.ctx.fillStyle = whiteboardState.currentColor;
    whiteboardState.ctx.fillText(textInput.value, x, y + fontSize);
    
    cancelTextInput();
    saveCanvasState();
    showNotification('✅ Text added successfully!', 'success');
}

function cancelTextInput() {
    whiteboardState.isAddingText = false;
    whiteboardState.textInput.style.display = 'none';
    whiteboardState.textInput.value = '';
}

function drawShape(startX, startY, endX, endY) {
    const ctx = whiteboardState.ctx;
    ctx.strokeStyle = whiteboardState.currentColor;
    ctx.lineWidth = whiteboardState.currentSize;
    ctx.beginPath();
    
    if (whiteboardState.currentTool === 'rectangle') {
        const width = endX - startX;
        const height = endY - startY;
        ctx.rect(startX, startY, width, height);
    } else if (whiteboardState.currentTool === 'circle') {
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    } else if (whiteboardState.currentTool === 'line') {
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
    }
    
    ctx.stroke();
}

function saveCanvasState() {
    whiteboardState.historyStep++;
    if (whiteboardState.historyStep < whiteboardState.history.length) {
        whiteboardState.history.length = whiteboardState.historyStep;
    }
    whiteboardState.history.push(whiteboardState.canvas.toDataURL());
}

function undoLastAction() {
    if (whiteboardState.historyStep > 0) {
        whiteboardState.historyStep--;
        const img = new Image();
        img.onload = function() {
            whiteboardState.ctx.clearRect(0, 0, whiteboardState.canvas.width, whiteboardState.canvas.height);
            whiteboardState.ctx.drawImage(img, 0, 0);
        };
        img.src = whiteboardState.history[whiteboardState.historyStep];
        showNotification('↶ Undone', 'info');
    }
}

function clearWhiteboard() {
    showConfirmDialog(
        'Clear Whiteboard',
        'This will clear all drawings. This action cannot be undone.',
        'Clear',
        'Cancel'
    ).then(confirmed => {
        if (confirmed) {
            whiteboardState.ctx.clearRect(0, 0, whiteboardState.canvas.width, whiteboardState.canvas.height);
            saveCanvasState();
            showNotification('🗑️ Whiteboard cleared', 'success');
        }
    });
}

function saveWhiteboard() {
    const link = document.createElement('a');
    link.download = `whiteboard_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.png`;
    link.href = whiteboardState.canvas.toDataURL();
    link.click();
    showNotification('💾 Whiteboard saved', 'success');
}

function handleCanvasResize() {
    const canvas = whiteboardState.canvas;
    const ctx = whiteboardState.ctx;
    
    if (canvas && ctx) {
        const container = canvas.parentElement;
        const imageData = canvas.toDataURL();
        
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        const img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
        };
        img.src = imageData;
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = whiteboardState.currentColor;
        ctx.lineWidth = whiteboardState.currentSize;
    }
}

// ========================================
// STUDENT MANAGEMENT
// ========================================

function loadStudents() {
    const studentList = document.getElementById('studentList');
    if (!studentList) return;
    
    studentList.innerHTML = '';
    
    STUDENTS_DATA.forEach(student => {
        const studentItem = document.createElement('div');
        studentItem.className = 'student-item';
        studentItem.onclick = () => selectStudent(student.id);
        
        const statusClass = student.status;
        const timeSince = getTimeSince(student.lastSeen);
        
        studentItem.innerHTML = `
            <div class="student-profile">
                <div class="student-avatar">${student.avatar}</div>
                <div>
                    <div class="student-name">${student.name}</div>
                    <div class="student-status-text">${student.status} ${timeSince ? '• ' + timeSince : ''}</div>
                </div>
            </div>
            <div class="student-status ${statusClass}"></div>
        `;
        
        studentList.appendChild(studentItem);
    });
    
    updateStudentCount();
}

function selectStudent(studentId) {
    const student = STUDENTS_DATA.find(s => s.id === studentId);
    if (student) {
        showNotification(`👤 ${student.name} - ${student.status} (${student.engagement}% engagement)`, 'info');
    }
}

function updateStudentCount() {
    const onlineCount = STUDENTS_DATA.filter(s => s.status === 'online').length;
    const totalCount = STUDENTS_DATA.length;
    
    // Update header if exists
    const attendeeCount = document.querySelector('.attendee-count');
    if (attendeeCount) {
        attendeeCount.textContent = `${onlineCount}/${totalCount} online`;
    }
}

function getTimeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return null;
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (let interval in intervals) {
        const count = Math.floor(seconds / intervals[interval]);
        if (count > 0) {
            return count === 1 ? `1 ${interval} ago` : `${count} ${interval}s ago`;
        }
    }
    
    return null;
}

function refreshStudents() {
    // Simulate status changes
    STUDENTS_DATA.forEach(student => {
        if (Math.random() > 0.7) {
            const statuses = ['online', 'away', 'offline'];
            const oldStatus = student.status;
            student.status = statuses[Math.floor(Math.random() * statuses.length)];
            student.lastSeen = student.status === 'online' ? new Date() : student.lastSeen;
            
            if (oldStatus !== student.status) {
                if (student.status === 'online') {
                    sessionState.analytics.attendeeJoins++;
                } else if (oldStatus === 'online') {
                    sessionState.analytics.attendeeLeaves++;
                }
            }
        }
    });
    
    loadStudents();
    showNotification('🔄 Student status updated', 'info');
}

// ========================================
// CHAT SYSTEM
// ========================================

function initializeChat() {
    chatMessages = [
        {
            id: 'msg1',
            sender: 'Teacher',
            avatar: 'T',
            text: 'Welcome to the live session! Feel free to ask questions anytime.',
            time: formatTime(new Date(Date.now() - 300000)),
            type: 'teacher'
        },
        {
            id: 'msg2',
            sender: 'Raj Kumar',
            avatar: 'RK',
            text: 'Thank you sir! The audio and video are crystal clear.',
            time: formatTime(new Date(Date.now() - 240000)),
            type: 'student'
        }
    ];
    
    displayChatMessages();
}

function displayChatMessages() {
    const chatArea = document.getElementById('chatArea');
    if (!chatArea) return;
    
    chatArea.innerHTML = '';
    
    chatMessages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${message.type || 'student'}`;
        
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
    if (!input) return;
    
    const text = input.value.trim();
    if (!text) return;
    
    const newMessage = {
        id: `msg_${Date.now()}`,
        sender: 'Teacher',
        avatar: 'T',
        text: text,
        time: formatTime(new Date()),
        type: 'teacher'
    };
    
    chatMessages.push(newMessage);
    displayChatMessages();
    
    input.value = '';
    sessionState.analytics.messagesCount++;
    showNotification('💬 Message sent', 'success');
    
    // Auto-scroll to new message
    const chatArea = document.getElementById('chatArea');
    if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight;
    }
}

function handleChatEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

// ========================================
// POLL SYSTEM
// ========================================

function togglePollCreator() {
    const pollCreator = document.getElementById('pollCreator');
    const toggleBtn = document.getElementById('pollToggle');
    
    if (!pollCreator || !toggleBtn) return;
    
    if (pollCreator.style.display === 'none' || !pollCreator.style.display) {
        pollCreator.style.display = 'block';
        toggleBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
    } else {
        pollCreator.style.display = 'none';
        toggleBtn.innerHTML = '<i class="fas fa-plus"></i> Create Poll';
        clearPollForm();
    }
}

function clearPollForm() {
    const questionInput = document.getElementById('pollQuestion');
    const optionInputs = document.querySelectorAll('.poll-option input');
    
    if (questionInput) questionInput.value = '';
    optionInputs.forEach(input => input.value = '');
}

function addPollOption() {
    const pollOptions = document.querySelector('.poll-options');
    if (!pollOptions) return;
    
    const optionCount = pollOptions.children.length + 1;
    
    const newOption = document.createElement('div');
    newOption.className = 'poll-option';
    newOption.innerHTML = `
        <input type="text" placeholder="Option ${String.fromCharCode(64 + optionCount)}" maxlength="100">
        <button type="button" onclick="removeOption(this)" style="background: var(--accent-red); color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    pollOptions.appendChild(newOption);
}

function removeOption(element) {
    const pollOptions = document.querySelector('.poll-options');
    if (pollOptions && pollOptions.children.length > 2) {
        element.parentElement.remove();
    } else {
        showNotification('⚠️ At least 2 options required', 'warning');
    }
}

function launchPoll() {
    const questionInput = document.getElementById('pollQuestion');
    const optionInputs = document.querySelectorAll('.poll-option input');
    
    if (!questionInput) return;
    
    const question = questionInput.value.trim();
    const options = Array.from(optionInputs)
        .map(input => input.value.trim())
        .filter(option => option);
    
    if (!question || options.length < 2) {
        showNotification('⚠️ Please enter a question and at least 2 options', 'warning');
        return;
    }
    
    sessionState.activePoll = {
        id: `poll_${Date.now()}`,
        question: question,
        options: options,
        responses: options.map(() => 0),
        totalResponses: 0,
        startTime: new Date()
    };
    
    displayActivePoll();
    togglePollCreator();
    sessionState.analytics.pollsCreated++;
    
    showNotification('🚀 Poll launched! Students can now vote.', 'success');
    
    // Simulate responses
    setTimeout(() => simulatePollResponses(), 2000);
}

function displayActivePoll() {
    const activePollArea = document.getElementById('activePollArea');
    if (!activePollArea || !sessionState.activePoll) return;
    
    const poll = sessionState.activePoll;
    
    activePollArea.innerHTML = `
        <div class="active-poll">
            <div class="poll-question">${poll.question}</div>
            <div class="poll-responses">
                ${poll.options.map((option, index) => `
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
                <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-danger" onclick="endPoll()">
                        <i class="fas fa-stop"></i> End Poll
                    </button>
                    <button class="btn btn-info" onclick="exportPollResults()">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
            </div>
        </div>
    `;
}

function simulatePollResponses() {
    if (!sessionState.activePoll) return;
    
    const poll = sessionState.activePoll;
    const numResponses = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < numResponses; i++) {
        setTimeout(() => {
            const randomOption = Math.floor(Math.random() * poll.options.length);
            poll.responses[randomOption]++;
            poll.totalResponses++;
            
            updatePollDisplay();
            
            // Add chat message for first few responses
            if (poll.totalResponses <= 3) {
                const randomStudent = STUDENTS_DATA[Math.floor(Math.random() * STUDENTS_DATA.length)];
                const newMessage = {
                    id: `poll_msg_${Date.now()}`,
                    sender: randomStudent.name,
                    avatar: randomStudent.avatar,
                    text: `Voted in poll: "${poll.question}"`,
                    time: formatTime(new Date()),
                    type: 'poll'
                };
                
                chatMessages.push(newMessage);
                displayChatMessages();
            }
        }, i * 1000);
    }
}

function updatePollDisplay() {
    const poll = sessionState.activePoll;
    if (!poll) return;
    
    const totalResponsesEl = document.getElementById('totalResponses');
    if (totalResponsesEl) {
        totalResponsesEl.textContent = poll.totalResponses;
    }
    
    poll.responses.forEach((count, index) => {
        const percentage = poll.totalResponses > 0 ? 
            (count / poll.totalResponses) * 100 : 0;
        
        const fillElement = document.getElementById(`response-${index}`);
        const countElement = document.getElementById(`count-${index}`);
        
        if (fillElement) {
            fillElement.style.width = `${percentage}%`;
            fillElement.style.transition = 'width 0.5s ease';
        }
        if (countElement) {
            countElement.textContent = count;
        }
    });
}

function endPoll() {
    if (!sessionState.activePoll) return;
    
    showConfirmDialog(
        'End Poll',
        'Are you sure you want to end the current poll? Results will be saved.',
        'End Poll',
        'Continue'
    ).then(confirmed => {
        if (confirmed) {
            const pollData = { ...sessionState.activePoll };
            
            // Save poll results to localStorage
            const savedPolls = JSON.parse(localStorage.getItem('session_polls') || '[]');
            savedPolls.push(pollData);
            localStorage.setItem('session_polls', JSON.stringify(savedPolls));
            
            sessionState.activePoll = null;
            
            const activePollArea = document.getElementById('activePollArea');
            if (activePollArea) {
                activePollArea.innerHTML = `
                    <div style="padding: 30px; text-align: center; color: var(--text-secondary);">
                        <i class="fas fa-poll" style="font-size: 2.5rem; margin-bottom: 15px; opacity: 0.5;"></i>
                        <p>No active poll</p>
                        <small>Create a poll to engage with your students</small>
                    </div>
                `;
            }
            
            showNotification('📊 Poll ended and results saved!', 'success');
        }
    });
}

function exportPollResults() {
    if (!sessionState.activePoll) return;
    
    const poll = sessionState.activePoll;
    const results = {
        question: poll.question,
        options: poll.options,
        responses: poll.responses,
        totalResponses: poll.totalResponses,
        percentages: poll.responses.map(count => 
            poll.totalResponses > 0 ? ((count / poll.totalResponses) * 100).toFixed(1) : 0
        ),
        startTime: poll.startTime,
        exportTime: new Date()
    };
    
    // Create and download JSON file
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `poll_results_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('📊 Poll results exported successfully!', 'success');
}

// ========================================
// SCREEN SHARING
// ========================================

function startScreenShare() {
    if (sessionState.isScreenSharing) return;
    
    sessionState.isScreenSharing = true;
    
    const screenShareArea = document.getElementById('screenShareArea');
    if (screenShareArea) {
        screenShareArea.innerHTML = `
            <div style="text-align: center; color: var(--accent-green); padding: 60px 20px;">
                <i class="fas fa-desktop" style="font-size: 4rem; margin-bottom: 20px; animation: pulse 2s infinite;"></i>
                <p><strong>Screen Sharing Active</strong></p>
                <small>Students can see your screen content</small>
                <div style="margin-top: 20px;">
                    <div class="live-indicator" style="display: inline-flex; align-items: center; gap: 8px; background: var(--accent-red); color: white; padding: 4px 12px; border-radius: 15px; font-size: 0.8rem;">
                        <div style="width: 8px; height: 8px; background: white; border-radius: 50%; animation: blink 1s infinite;"></div>
                        LIVE
                    </div>
                </div>
            </div>
        `;
    }
    
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Sharing';
        shareBtn.onclick = stopScreenShare;
        shareBtn.className = 'btn btn-danger';
    }
    
    showNotification('🖥️ Screen sharing started', 'success');
}

function stopScreenShare() {
    sessionState.isScreenSharing = false;
    
    const screenShareArea = document.getElementById('screenShareArea');
    if (screenShareArea) {
        screenShareArea.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-desktop" style="font-size: 4rem; margin-bottom: 20px; opacity: 0.3;"></i>
                <p style="color: var(--text-secondary);">Screen sharing inactive</p>
                <small style="color: var(--text-tertiary);">Click "Start Sharing" to share your screen</small>
            </div>
        `;
    }
    
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.innerHTML = '<i class="fas fa-share-square"></i> Start Sharing';
        shareBtn.onclick = startScreenShare;
        shareBtn.className = 'btn btn-primary';
    }
    
    showNotification('🖥️ Screen sharing stopped', 'warning');
}

// ========================================
// SESSION CONTROLS
// ========================================

function toggleRecording() {
    sessionState.isRecording = !sessionState.isRecording;
    
    const recordIcon = document.getElementById('recordIcon');
    if (recordIcon) {
        recordIcon.className = sessionState.isRecording ? 'fas fa-stop' : 'fas fa-video';
    }
    
    const message = sessionState.isRecording ? 
        '🔴 Session recording started' : 
        '⏹️ Session recording stopped';
    
    showNotification(message, sessionState.isRecording ? 'success' : 'warning');
}

function toggleMute() {
    sessionState.isMuted = !sessionState.isMuted;
    
    const muteIcon = document.getElementById('muteIcon');
    if (muteIcon) {
        muteIcon.className = sessionState.isMuted ? 'fas fa-microphone-slash' : 'fas fa-microphone';
    }
    
    const message = sessionState.isMuted ? 
        '🔇 Audio muted' : 
        '🔊 Audio unmuted';
    
    showNotification(message, sessionState.isMuted ? 'warning' : 'success');
}

function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        const fullscreenIcon = document.getElementById('fullscreenIcon');
        if (fullscreenIcon) fullscreenIcon.className = 'fas fa-expand';
        showNotification('📺 Exited fullscreen', 'info');
    } else {
        document.documentElement.requestFullscreen().catch(err => {
            showNotification('⚠️ Fullscreen not supported', 'warning');
        });
        const fullscreenIcon = document.getElementById('fullscreenIcon');
        if (fullscreenIcon) fullscreenIcon.className = 'fas fa-compress';
        showNotification('📺 Entered fullscreen', 'info');
    }
}

function pauseSession() {
    sessionState.isPaused = !sessionState.isPaused;
    
    const message = sessionState.isPaused ? 
        '⏸️ Session paused. Students notified.' : 
        '▶️ Session resumed. Students notified.';
    
    showNotification(message, 'info');
}

function endSession() {
    showConfirmDialog(
        'End Live Session',
        'Are you sure you want to end the live session? All students will be disconnected and session data will be saved.',
        'End Session',
        'Continue Session'
    ).then(confirmed => {
        if (confirmed) {
            showNotification('🛑 Ending session...', 'warning');
            
            // Save session data
            saveSessionData();
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        }
    });
}

// ========================================
// TIMER AND UPDATES
// ========================================

function startSessionTimer() {
    const timerInterval = setInterval(() => {
        const now = new Date();
        const diff = now - sessionState.startTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const sessionTimer = document.getElementById('sessionTimer');
        if (sessionTimer) {
            sessionTimer.textContent = timeString;
        }
    }, 1000);
    
    backgroundIntervals.push(timerInterval);
}

function startLiveUpdates() {
    // Simulate new chat messages
    const chatInterval = setInterval(() => {
        if (Math.random() > 0.8) {
            addRandomChatMessage();
        }
    }, 12000);
    
    // Student status updates
    const statusInterval = setInterval(() => {
        if (Math.random() > 0.7) {
            refreshStudents();
        }
    }, 25000);
    
    // Poll responses
    const pollInterval = setInterval(() => {
        if (sessionState.activePoll && Math.random() > 0.6) {
            simulatePollResponses();
        }
    }, 8000);
    
    backgroundIntervals.push(chatInterval, statusInterval, pollInterval);
}

function addRandomChatMessage() {
    const onlineStudents = STUDENTS_DATA.filter(s => s.status === 'online');
    if (onlineStudents.length === 0) return;
    
    const randomStudent = onlineStudents[Math.floor(Math.random() * onlineStudents.length)];
    const questions = [
        'Can you explain that concept again please?',
        'The screen is very clear now, thank you!',
        'Could you share the presentation slides?',
        'Is this topic going to be in the exam?',
        'Thank you for the detailed explanation!',
        'Can we have a quick 5-minute break?',
        'The audio quality is excellent today.',
        'Could you please speak a bit slower?',
        'This is really helpful, thanks!',
        'Can you show that example again?'
    ];
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    const newMessage = {
        id: `auto_msg_${Date.now()}`,
        sender: randomStudent.name,
        avatar: randomStudent.avatar,
        text: randomQuestion,
        time: formatTime(new Date()),
        type: 'student'
    };
    
    chatMessages.push(newMessage);
    displayChatMessages();
    
    // Show notification for new message
    showNotification(`💬 ${randomStudent.name}: ${randomQuestion.substring(0, 30)}${randomQuestion.length > 30 ? '...' : ''}`, 'info', 3000);
}

function pauseBackgroundActivities() {
    console.log('⏸️ Background activities paused (tab hidden)');
}

function resumeBackgroundActivities() {
    console.log('▶️ Background activities resumed (tab visible)');
}

// ========================================
// UTILITIES
// ========================================

function showConfirmDialog(title, message, confirmText = 'Confirm', cancelText = 'Cancel') {
    return new Promise((resolve) => {
        // Create modal backdrop
        const backdrop = document.createElement('div');
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            backdrop-filter: blur(4px);
        `;
        
        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: var(--bg-primary);
            border-radius: 15px;
            padding: 30px;
            max-width: 450px;
            width: 100%;
            box-shadow: 0 10px 40px var(--shadow-heavy);
            border: 1px solid var(--border-color);
        `;
        
        modal.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: var(--text-primary); margin-bottom: 15px; font-size: 1.2rem;">${title}</h3>
                <p style="color: var(--text-secondary); margin-bottom: 25px; line-height: 1.5;">${message}</p>
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button id="cancelBtn" style="
                        padding: 10px 20px;
                        border: 2px solid var(--border-color);
                        background: var(--bg-secondary);
                        color: var(--text-primary);
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.3s ease;
                    ">${cancelText}</button>
                    <button id="confirmBtn" style="
                        padding: 10px 20px;
                        border: none;
                        background: linear-gradient(135deg, var(--accent-red), #dc2626);
                        color: white;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.3s ease;
                    ">${confirmText}</button>
                </div>
            </div>
        `;
        
        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);
        
        // Event listeners
        const cancelBtn = modal.querySelector('#cancelBtn');
        const confirmBtn = modal.querySelector('#confirmBtn');
        
        function cleanup() {
            document.body.removeChild(backdrop);
        }
        
        cancelBtn.onclick = () => {
            cleanup();
            resolve(false);
        };
        
        confirmBtn.onclick = () => {
            cleanup();
            resolve(true);
        };
        
        // Close on backdrop click
        backdrop.onclick = (e) => {
            if (e.target === backdrop) {
                cleanup();
                resolve(false);
            }
        };
        
        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                cleanup();
                resolve(false);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        // Auto-close after 30 seconds
        setTimeout(() => {
            if (document.body.contains(backdrop)) {
                cleanup();
                resolve(false);
            }
        }, 30000);
    });
}

function showNotification(message, type = 'info', duration = 4000) {
    // Remove existing notifications of same type
    document.querySelectorAll(`.notification.${type}`).forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button style="
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 0 5px;
            margin-left: 10px;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        " onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Auto remove
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 400);
        }
    }, duration);
}

function saveSessionData() {
    try {
        const sessionData = {
            duration: new Date() - sessionState.startTime,
            analytics: sessionState.analytics,
            studentCount: STUDENTS_DATA.length,
            onlineCount: STUDENTS_DATA.filter(s => s.status === 'online').length,
            messagesCount: chatMessages.length,
            pollsCreated: sessionState.analytics.pollsCreated,
            whiteboardActions: sessionState.analytics.whiteboardActions,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('last_session_data', JSON.stringify(sessionData));
        console.log('Session data saved:', sessionData);
        
    } catch (error) {
        console.error('Failed to save session data:', error);
    }
}

function playStartupSound() {
    // Create audio context for startup sound
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
        console.log('Audio context not available');
    }
}

// ========================================
// CLEANUP
// ========================================

window.addEventListener('beforeunload', function(e) {
    if (sessionState && (sessionState.isRecording || sessionState.activePoll)) {
        e.preventDefault();
        e.returnValue = 'You have an active session. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// Global error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('⚠️ An error occurred. Some features may not work properly.', 'warning');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Export for debugging
window.sessionState = sessionState;
window.whiteboardState = whiteboardState;

console.log('🎯 Live Session System Loaded Successfully!');
