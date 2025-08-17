console.log('🏠 Study Room JS loading...');

// Room State
let roomState = {
    roomId: null,
    userId: null,
    isHost: false,
    participants: [],
    settings: {
        showWhiteboard: true,
        showChat: true,
        enableNotifications: true,
        focusTimer: 45
    },
    controls: {
        micEnabled: true,
        cameraEnabled: false,
        screenSharing: false,
        handRaised: false,
        whiteboardVisible: true
    },
    sessionStartTime: null,
    sessionDuration: 0,
    currentTool: 'pen',
    currentColor: '#2563eb'
};

// Theme Management - Dashboard Sync
function initializeTheme() {
    const savedTheme = localStorage.getItem('scms-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const themeSwitch = document.getElementById('themeSwitch');
    
    if (savedTheme === 'dark') {
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        if (themeLabel) themeLabel.textContent = 'Light Mode';
        if (themeSwitch) themeSwitch.classList.add('active');
    } else {
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
        if (themeSwitch) themeSwitch.classList.remove('active');
    }
    
    console.log('🎨 Theme initialized:', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    localStorage.setItem('scms-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const themeSwitch = document.getElementById('themeSwitch');
    
    if (newTheme === 'dark') {
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        if (themeLabel) themeLabel.textContent = 'Light Mode';
        if (themeSwitch) themeSwitch.classList.add('active');
    } else {
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
        if (themeSwitch) themeSwitch.classList.remove('active');
    }
    
    showNotification(`🎨 Switched to ${newTheme} mode`, 'success');
}

// Get Room Data from URL or LocalStorage
function getRoomData() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room') || 'room-1';
    
    // Load room from Study Buddy data
    const studyRooms = JSON.parse(localStorage.getItem('studyBuddyRooms')) || [];
    const currentRoom = studyRooms.find(r => r.id === roomId);
    
    if (currentRoom) {
        return {
            id: currentRoom.id,
            title: currentRoom.title,
            subject: currentRoom.subject,
            capacity: currentRoom.capacity,
            members: currentRoom.members,
            remainingTime: currentRoom.remainingTime,
            status: currentRoom.status,
            isPrivate: currentRoom.isPrivate
        };
    }
    
    // Fallback room data
    return {
        id: 'room-1',
        title: 'Calculus Study Group',
        subject: 'Mathematics',
        capacity: 8,
        members: ['Alex', 'Sarah', 'Mike', 'Rita'],
        remainingTime: '1h 23m left',
        status: 'Active',
        isPrivate: false
    };
}

// Initialize Room
function initializeRoom() {
    const roomData = getRoomData();
    roomState.roomId = roomData.id;
    roomState.participants = roomData.members.map((name, index) => ({
        id: `user-${index}`,
        name: name,
        avatar: name.charAt(0).toUpperCase(),
        status: index === 0 ? 'online' : (Math.random() > 0.7 ? 'away' : 'online'),
        isMe: name === getCurrentUser().name,
        micEnabled: true,
        handRaised: false
    }));
    
    roomState.sessionStartTime = Date.now() - (Math.random() * 2700000); // 0-45 min ago
    
    updateRoomInfo(roomData);
    updateParticipantsList();
    startSessionTimer();
    initializeWhiteboard();
    
    console.log('🏠 Room initialized:', roomState.roomId);
}

// Update Room Information in Header
function updateRoomInfo(roomData) {
    const titleEl = document.getElementById('roomTitle');
    const subjectEl = document.getElementById('roomSubject');
    const participantsCountEl = document.getElementById('participantsCount');
    const roomTimerEl = document.getElementById('roomTimer');
    const roomStatusEl = document.getElementById('roomStatus');
    const activeMembersEl = document.getElementById('activeMembers');
    
    if (titleEl) titleEl.textContent = roomData.title;
    if (subjectEl) subjectEl.textContent = roomData.subject;
    if (participantsCountEl) participantsCountEl.textContent = `${roomData.members.length}/${roomData.capacity}`;
    if (roomTimerEl) roomTimerEl.textContent = roomData.remainingTime;
    if (roomStatusEl) roomStatusEl.textContent = roomData.status;
    if (activeMembersEl) {
        const activeCount = roomState.participants.filter(p => p.status === 'online').length;
        activeMembersEl.textContent = activeCount;
    }
}

// Start Session Timer
function startSessionTimer() {
    const sessionTimeEl = document.getElementById('sessionTime');
    
    setInterval(() => {
        if (!roomState.sessionStartTime) return;
        
        const elapsed = Date.now() - roomState.sessionStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        let timeString;
        if (hours > 0) {
            timeString = `${hours}h ${remainingMinutes}m`;
        } else {
            timeString = `${minutes} minutes`;
        }
        
        if (sessionTimeEl) sessionTimeEl.textContent = timeString;
        roomState.sessionDuration = elapsed;
    }, 30000); // Update every 30 seconds
}

// Get Current User
function getCurrentUser() {
    const user = localStorage.getItem('scms_current_user');
    if (user) return JSON.parse(user);
    return { 
        name: 'Alex Rodriguez', 
        role: 'student',
        rollNumber: 'CS2023001' 
    };
}

// Tab Management with Active States
function showTab(tabName) {
    // Remove active class from all tabs and panels
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab and panel
    const selectedTab = document.getElementById(`${tabName}Tab`);
    const selectedPanel = document.getElementById(`${tabName}Panel`);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedPanel) selectedPanel.classList.add('active');
    
    // Clear notification badge for selected tab
    if (tabName === 'chat') {
        const chatBadge = document.getElementById('chatBadge');
        if (chatBadge) chatBadge.textContent = '0';
    }
    
    console.log('📋 Switched to tab:', tabName);
}

// Whiteboard Tool Selection with Active States
function selectTool(toolName) {
    roomState.currentTool = toolName;
    
    // Remove active class from all tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to selected tool
    const selectedTool = document.getElementById(`${toolName}Tool`);
    if (selectedTool) selectedTool.classList.add('active');
    
    // Update cursor style
    const canvas = document.getElementById('whiteboard');
    if (canvas) {
        if (toolName === 'eraser') {
            canvas.style.cursor = 'grab';
        } else if (toolName === 'text') {
            canvas.style.cursor = 'text';
        } else {
            canvas.style.cursor = 'crosshair';
        }
    }
    
    showNotification(`🎨 Selected ${toolName} tool`, 'info');
}

function changeColor() {
    const colorPicker = document.getElementById('colorPicker');
    if (colorPicker) {
        roomState.currentColor = colorPicker.value;
        showNotification(`🎨 Color changed to ${roomState.currentColor}`, 'info');
    }
}

// Control Button Functions with Active States
function toggleMic() {
    roomState.controls.micEnabled = !roomState.controls.micEnabled;
    const micBtn = document.getElementById('micBtn');
    
    if (micBtn) {
        if (roomState.controls.micEnabled) {
            micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            micBtn.classList.remove('danger');
            micBtn.classList.remove('active');
            showNotification('🎤 Microphone enabled', 'success');
        } else {
            micBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            micBtn.classList.add('danger');
            micBtn.classList.add('active');
            showNotification('🔇 Microphone muted', 'warning');
        }
    }
    
    updateMyParticipantStatus();
}

function toggleCamera() {
    roomState.controls.cameraEnabled = !roomState.controls.cameraEnabled;
    const cameraBtn = document.getElementById('cameraBtn');
    
    if (cameraBtn) {
        if (roomState.controls.cameraEnabled) {
            cameraBtn.innerHTML = '<i class="fas fa-video"></i>';
            cameraBtn.classList.remove('danger');
            cameraBtn.classList.add('active');
            showNotification('📹 Camera enabled', 'success');
        } else {
            cameraBtn.innerHTML = '<i class="fas fa-video-slash"></i>';
            cameraBtn.classList.add('danger');
            cameraBtn.classList.remove('active');
            showNotification('📹 Camera disabled', 'info');
        }
    }
}

function toggleScreen() {
    roomState.controls.screenSharing = !roomState.controls.screenSharing;
    const screenBtn = document.getElementById('screenBtn');
    
    if (screenBtn) {
        if (roomState.controls.screenSharing) {
            screenBtn.innerHTML = '<i class="fas fa-desktop"></i>';
            screenBtn.classList.add('active');
            showNotification('🖥️ Screen sharing started', 'success');
        } else {
            screenBtn.innerHTML = '<i class="fas fa-desktop"></i>';
            screenBtn.classList.remove('active');
            showNotification('🖥️ Screen sharing stopped', 'info');
        }
    }
}

function raiseHand() {
    roomState.controls.handRaised = !roomState.controls.handRaised;
    const handBtn = document.getElementById('handBtn');
    
    if (handBtn) {
        if (roomState.controls.handRaised) {
            handBtn.classList.add('active');
            handBtn.style.background = 'var(--accent-yellow)';
            handBtn.style.borderColor = 'var(--accent-yellow)';
            handBtn.style.color = 'white';
            showNotification('🖐️ Hand raised! Waiting for attention.', 'warning');
        } else {
            handBtn.classList.remove('active');
            handBtn.style.background = '';
            handBtn.style.borderColor = '';
            handBtn.style.color = '';
            showNotification('🖐️ Hand lowered', 'info');
        }
    }
    
    updateMyParticipantStatus();
}

function updateMyParticipantStatus() {
    const currentUser = getCurrentUser();
    const myParticipant = roomState.participants.find(p => p.name === currentUser.name);
    if (myParticipant) {
        myParticipant.micEnabled = roomState.controls.micEnabled;
        myParticipant.handRaised = roomState.controls.handRaised;
        updateParticipantsList();
    }
}

// Participants Management
function updateParticipantsList() {
    const participantsList = document.getElementById('participantsList');
    if (!participantsList) return;
    
    const currentUser = getCurrentUser();
    
    participantsList.innerHTML = roomState.participants.map(participant => {
        const isMe = participant.name === currentUser.name;
        const statusClass = participant.status === 'away' ? 'away' : 
                           !participant.micEnabled ? 'muted' : 'online';
        
        return `
            <div class="participant-item ${isMe ? 'me' : ''}">
                <div class="participant-profile">
                    <div class="participant-avatar ${isMe ? 'me' : ''}">${participant.avatar}</div>
                    <div class="participant-details">
                        <div class="participant-name">${participant.name}${isMe ? ' (You)' : ''}</div>
                        <div class="participant-role">Member • ${participant.status === 'away' ? 'Away' : 'Active'}${participant.handRaised ? ' • ✋ Hand Raised' : ''}</div>
                    </div>
                </div>
                <div class="participant-status">
                    <div class="status-icon ${statusClass}"></div>
                </div>
            </div>
        `;
    }).join('');
}

function refreshParticipants() {
    // Simulate status changes
    roomState.participants.forEach(participant => {
        if (!participant.isMe && Math.random() > 0.8) {
            participant.status = participant.status === 'online' ? 'away' : 'online';
        }
    });
    
    updateParticipantsList();
    
    const activeCount = roomState.participants.filter(p => p.status === 'online').length;
    const activeMembersEl = document.getElementById('activeMembers');
    if (activeMembersEl) activeMembersEl.textContent = activeCount;
    
    showNotification('👥 Participant list refreshed', 'info');
}

function inviteMembers() {
    const roomLink = `${window.location.origin}/study-room/index.html?room=${roomState.roomId}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Join Study Room',
            text: 'Join me in this study session!',
            url: roomLink
        }).then(() => {
            showNotification('📤 Invitation shared successfully!', 'success');
        }).catch(() => {
            copyToClipboard(roomLink);
        });
    } else {
        copyToClipboard(roomLink);
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('📋 Room link copied to clipboard!', 'success');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('📋 Room link copied to clipboard!', 'success');
    }
}

// Basic Whiteboard Initialization
function initializeWhiteboard() {
    const canvas = document.getElementById('whiteboard');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // Set canvas size to match container
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
    
    function startDrawing(e) {
        if (roomState.currentTool === 'text') return;
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
    }
    
    function draw(e) {
        if (!isDrawing || roomState.currentTool === 'text') return;
        
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        
        if (roomState.currentTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 20;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = roomState.currentColor;
            ctx.lineWidth = 3;
        }
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        
        lastX = currentX;
        lastY = currentY;
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                        e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
}

// Whiteboard Functions with Active States
function toggleWhiteboard() {
    roomState.controls.whiteboardVisible = !roomState.controls.whiteboardVisible;
    const whiteboardSection = document.querySelector('.whiteboard-section');
    const whiteboardBtn = document.getElementById('whiteboardBtn');
    
    if (!whiteboardSection) return;
    
    if (roomState.controls.whiteboardVisible) {
        whiteboardSection.style.display = 'flex';
        if (whiteboardBtn) whiteboardBtn.classList.add('active');
        showNotification('🎨 Whiteboard shown', 'info');
    } else {
        whiteboardSection.style.display = 'none';
        if (whiteboardBtn) whiteboardBtn.classList.remove('active');
        showNotification('🎨 Whiteboard hidden', 'info');
    }
}

function clearWhiteboard() {
    if (confirm('Are you sure you want to clear the whiteboard?')) {
        const canvas = document.getElementById('whiteboard');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            showNotification('🗑️ Whiteboard cleared', 'success');
        }
    }
}

function saveWhiteboard() {
    const canvas = document.getElementById('whiteboard');
    if (!canvas) return;
    
    try {
        const link = document.createElement('a');
        link.download = `whiteboard-${roomState.roomId}-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        showNotification('💾 Whiteboard saved successfully!', 'success');
    } catch (error) {
        showNotification('❌ Failed to save whiteboard', 'error');
    }
}

function toggleFullscreenWhiteboard() {
    const whiteboardSection = document.querySelector('.whiteboard-section');
    if (!whiteboardSection) return;
    
    if (document.fullscreenElement) {
        document.exitFullscreen();
        showNotification('🖥️ Exited whiteboard fullscreen', 'info');
    } else {
        whiteboardSection.requestFullscreen().then(() => {
            showNotification('🖥️ Whiteboard in fullscreen', 'info');
        }).catch(() => {
            showNotification('❌ Fullscreen not supported', 'warning');
        });
    }
}

// Screenshot Function
function takeScreenshot() {
    showNotification('📸 Taking screenshot...', 'info');
    
    setTimeout(() => {
        // Simulate screenshot functionality
        const timestamp = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        showNotification(`📸 Screenshot saved as study-session-${timestamp}.png`, 'success');
        
        // Save screenshot info to localStorage for badges
        const screenshots = JSON.parse(localStorage.getItem('sessionScreenshots')) || [];
        screenshots.push({
            roomId: roomState.roomId,
            timestamp: Date.now(),
            filename: `study-session-${timestamp}.png`
        });
        localStorage.setItem('sessionScreenshots', JSON.stringify(screenshots));
    }, 1500);
}

// Settings Management
function openSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function saveSettings() {
    const showWhiteboard = document.getElementById('showWhiteboard').checked;
    const showChat = document.getElementById('showChat').checked;
    const enableNotifications = document.getElementById('enableNotifications').checked;
    const focusTimer = document.getElementById('focusTimer').value;
    
    roomState.settings = {
        showWhiteboard,
        showChat,
        enableNotifications,
        focusTimer: parseInt(focusTimer)
    };
    
    // Apply settings
    const whiteboardSection = document.querySelector('.whiteboard-section');
    
    if (whiteboardSection) {
        whiteboardSection.style.display = showWhiteboard ? 'flex' : 'none';
        roomState.controls.whiteboardVisible = showWhiteboard;
    }
    
    if (!showChat) {
        showTab('participants');
    }
    
    // Save to localStorage
    localStorage.setItem('roomSettings', JSON.stringify(roomState.settings));
    
    closeSettings();
    showNotification('⚙️ Settings saved successfully!', 'success');
}

// Fullscreen and Help
function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        showNotification('📺 Exited fullscreen', 'info');
    } else {
        document.documentElement.requestFullscreen().then(() => {
            showNotification('📺 Entered fullscreen mode', 'success');
        }).catch(() => {
            showNotification('❌ Fullscreen not supported', 'warning');
        });
    }
}

function showHelp() {
    const helpText = `🔥 Study Room Shortcuts & Features:

🎨 Whiteboard Tools:
• Pen: Click and drag to draw
• Eraser: Click and drag to erase
• Color Picker: Change drawing color
• Clear: Remove all drawings
• Save: Download whiteboard as PNG

💬 Chat Features:
• Enter: Send message
• @name: Mention someone
• Real-time messaging

🎮 Control Shortcuts:
• M: Toggle microphone
• V: Toggle camera
• H: Raise/lower hand
• F: Toggle fullscreen
• S: Take screenshot

🌙 Theme Toggle:
• Switch between light/dark modes
• Syncs with main dashboard

👥 Participants:
• See who's online/away
• View raised hands
• Invite new members

🤖 AI Assistant:
• Generate study roadmaps
• Explain concepts
• Create practice quizzes

⚙️ Settings:
• Customize display options
• Set focus timer
• Enable/disable notifications

🏆 Achievements:
• Earn badges for participation
• Track study time
• Build learning streaks`;
    
    // Create a better modal for help
    const helpModal = document.createElement('div');
    helpModal.className = 'modal-overlay show';
    helpModal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3><i class="fas fa-question-circle"></i> Help & Shortcuts</h3>
                <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <pre style="white-space: pre-wrap; font-family: inherit; line-height: 1.6;">${helpText}</pre>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">Got it!</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(helpModal);
    document.body.style.overflow = 'hidden';
    
    // Auto-close after clicking outside
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.remove();
            document.body.style.overflow = '';
        }
    });
}

// Leave Room
function leaveRoom() {
    if (confirm('Are you sure you want to leave the study room?')) {
        // Update room data in localStorage
        const studyRooms = JSON.parse(localStorage.getItem('studyBuddyRooms')) || [];
        const currentRoomIndex = studyRooms.findIndex(r => r.id === roomState.roomId);
        
        if (currentRoomIndex !== -1) {
            const currentUser = getCurrentUser();
            studyRooms[currentRoomIndex].members = studyRooms[currentRoomIndex].members.filter(
                member => member !== currentUser.name
            );
            
            // Update status based on remaining members
            if (studyRooms[currentRoomIndex].members.length === 0) {
                studyRooms[currentRoomIndex].status = 'Available';
            }
            
            localStorage.setItem('studyBuddyRooms', JSON.stringify(studyRooms));
        }
        
        // Award session badge
        const sessionLength = Math.floor(roomState.sessionDuration / 60000);
        if (sessionLength >= 15) {
            awardStudyBadge('study-session', sessionLength);
        }
        
        showNotification('👋 Leaving study room... Thanks for studying!', 'info');
        
        setTimeout(() => {
            // Try to close window first
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // Fallback: redirect to study buddy
                window.location.href = '../study-buddy.html';
            }
        }, 2000);
    }
}

// Badge System
function awardStudyBadge(type, duration) {
    const badges = JSON.parse(localStorage.getItem('studentBadges')) || [];
    
    let badgeName = 'Study Participant';
    if (type === 'study-session') {
        if (duration >= 60) badgeName = 'Study Marathon';
        else if (duration >= 30) badgeName = 'Focused Learner';
        else badgeName = 'Study Buddy';
    }
    
    const newBadge = {
        id: Date.now(),
        type: type,
        name: badgeName,
        description: `Studied for ${duration} minutes`,
        earnedAt: new Date(),
        icon: 'fas fa-medal'
    };
    
    badges.push(newBadge);
    localStorage.setItem('studentBadges', JSON.stringify(badges));
    
    showNotification(`🏆 Badge earned: ${badgeName}!`, 'success');
}

// Enhanced Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications to prevent spam
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };

    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${icons[type]}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add notification styles if not present
    if (!document.querySelector('.notification-styles')) {
        const style = document.createElement('style');
        style.className = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 16px;
                border-radius: 12px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 12px;
                max-width: 350px;
                box-shadow: 0 6px 25px rgba(0,0,0,0.15);
                animation: slideInRight 0.4s ease;
                backdrop-filter: blur(10px);
                font-size: 0.9rem;
            }
            .notification.success { background: linear-gradient(135deg, var(--accent-green), var(--accent-green-dark)); }
            .notification.error { background: linear-gradient(135deg, var(--accent-red), #dc2626); }
            .notification.info { background: linear-gradient(135deg, var(--accent-blue), var(--accent-blue-dark)); }
            .notification.warning { background: linear-gradient(135deg, var(--accent-yellow), #d97706); color: var(--text-primary); }
            .notification-icon { font-size: 1.2rem; flex-shrink: 0; }
            .notification-content { flex: 1; }
            .notification-close { 
                background: none; 
                border: none; 
                color: inherit; 
                cursor: pointer; 
                font-size: 1.1rem; 
                padding: 4px; 
                border-radius: 50%;
                transition: background 0.3s ease;
                flex-shrink: 0;
            }
            .notification-close:hover { background: rgba(255,255,255,0.2); }
            @keyframes slideInRight { 
                from { transform: translateX(100px); opacity: 0; } 
                to { transform: translateX(0); opacity: 1; } 
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.4s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, 5000);
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(event) {
    // Don't trigger shortcuts when typing in inputs
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
    
    switch(event.key.toLowerCase()) {
        case 'm':
            event.preventDefault();
            toggleMic();
            break;
        case 'v':
            event.preventDefault();
            toggleCamera();
            break;
        case 'h':
            event.preventDefault();
            raiseHand();
            break;
        case 'f':
            if (event.ctrlKey || event.metaKey) return; // Don't override browser fullscreen
            event.preventDefault();
            toggleFullscreen();
            break;
        case 's':
            if (event.ctrlKey || event.metaKey) return; // Don't override browser save
            event.preventDefault();
            takeScreenshot();
            break;
        case 't':
            event.preventDefault();
            toggleTheme();
            break;
        case 'escape':
            // Close modals on escape
            const openModal = document.querySelector('.modal-overlay.show');
            if (openModal) {
                openModal.classList.remove('show');
                document.body.style.overflow = '';
            }
            break;
    }
}

// Auto-save progress
function autoSaveProgress() {
    const progressData = {
        roomId: roomState.roomId,
        sessionDuration: roomState.sessionDuration,
        lastActive: Date.now(),
        participantCount: roomState.participants.length,
        controls: roomState.controls,
        settings: roomState.settings
    };
    
    localStorage.setItem('currentStudySession', JSON.stringify(progressData));
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Study Room initializing...');
    
    try {
        initializeTheme();
        initializeRoom();
        
        // Set default tab
        showTab('chat');
        
        // Set default tool
        selectTool('pen');
        
        // Initialize keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
        
        // Auto-save progress every 30 seconds
        setInterval(autoSaveProgress, 30000);
        
        // Load saved settings
        const savedSettings = localStorage.getItem('roomSettings');
        if (savedSettings) {
            roomState.settings = { ...roomState.settings, ...JSON.parse(savedSettings) };
        }
        
        // Welcome message
        setTimeout(() => {
            showNotification('🎉 Welcome to the study room! Happy learning!', 'success');
        }, 1000);
        
        // Keyboard shortcuts hint
        setTimeout(() => {
            showNotification('💡 Press H for help and keyboard shortcuts!', 'info');
        }, 5000);
        
        // Random participant activity simulation
        setInterval(() => {
            if (Math.random() > 0.95) {
                const randomParticipant = roomState.participants[Math.floor(Math.random() * roomState.participants.length)];
                if (!randomParticipant.isMe) {
                    randomParticipant.status = randomParticipant.status === 'online' ? 'away' : 'online';
                    updateParticipantsList();
                }
            }
        }, 15000);
        
        console.log('✅ Study Room initialized successfully!');
        
    } catch (error) {
        console.error('❌ Error initializing Study Room:', error);
        showNotification('Error loading study room. Please refresh.', 'error');
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function(event) {
    // Save final session data
    autoSaveProgress();
    
    // Award participation badge if session was meaningful
    const sessionLength = Math.floor(roomState.sessionDuration / 60000);
    if (sessionLength >= 5) {
        awardStudyBadge('participation', sessionLength);
    }
});

// Handle page visibility for better performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('🔇 Study room minimized');
    } else {
        console.log('👁️ Study room focused');
        // Refresh participants when coming back
        refreshParticipants();
    }
});

console.log('📝 Room JS fully loaded with theme support!');
