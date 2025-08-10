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

// Class state
let isHandRaised = false;
let isMuted = false;
let isAudioOn = true;
let chatMessages = [];
let participants = [];
let currentPoll = null;
let myVote = null;

// Mock participants data
const PARTICIPANTS_DATA = [
    { id: 'st001', name: 'Raj Kumar', avatar: 'RK', status: 'online', handRaised: false },
    { id: 'st002', name: 'Priya Sharma', avatar: 'PS', status: 'online', handRaised: true },
    { id: 'st003', name: 'Arjun Patel', avatar: 'AP', status: 'away', handRaised: false },
    { id: 'st004', name: 'Sneha Gupta', avatar: 'SG', status: 'online', handRaised: false },
    { id: 'st005', name: 'Vikram Singh', avatar: 'VS', status: 'online', handRaised: false },
    { id: 'st006', name: 'Anita Rao', avatar: 'AR', status: 'muted', handRaised: false }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    initializeChat();
    loadParticipants();
    startClassUpdates();
    showWelcomeMessage();
    
    // Show sample poll after 5 seconds
    setTimeout(() => {
        showPoll();
    }, 5000);
    
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
        window.location.href = '../index.html';
        return;
    }

    const user = JSON.parse(currentUser);
    if (user.role !== 'student') {
        alert('Access denied. Student access required.');
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('userName').textContent = user.name;
    document.getElementById('myName').textContent = user.name;
    document.getElementById('userRoll').textContent = user.rollNumber || 'CS2023001';
    
    // Set user avatar
    const initials = user.name.split(' ').map(n => n[0]).join('');
    document.getElementById('myAvatar').textContent = initials;
}

function logout() {
    if (confirm('Leave class and logout?')) {
        localStorage.removeItem('scms_current_user');
        showNotification('Left class. Logging out...', 'info');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    }
}

function showWelcomeMessage() {
    showNotification('🎉 Welcome to CS101 live class! You are now connected.', 'success');
    
    setTimeout(() => {
        showNotification('💡 Use the floating buttons to raise hand, mute, or leave class.', 'info');
    }, 3000);
}

function initializeChat() {
    // Add some initial messages
    chatMessages = [
        {
            id: 'msg1',
            sender: 'Prof. Michael Chen',
            avatar: 'T',
            text: 'Welcome everyone! Today we will cover binary trees.',
            time: new Date(Date.now() - 300000).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            }),
            isTeacher: true
        },
        {
            id: 'msg2',
            sender: 'Raj Kumar',
            avatar: 'RK',
            text: 'Good morning sir! Ready for the class.',
            time: new Date(Date.now() - 240000).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            }),
            isTeacher: false
        },
        {
            id: 'msg3',
            sender: 'Prof. Michael Chen',
            avatar: 'T',
            text: 'Let me know if you have any questions during the session.',
            time: new Date(Date.now() - 180000).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            }),
            isTeacher: true
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
        
        const isMyMessage = message.sender === document.getElementById('myName').textContent;
        
        messageElement.innerHTML = `
            <div class="message-header">
                <div class="message-avatar" style="background: ${message.isTeacher ? 'linear-gradient(135deg, var(--accent-green), #059669)' : 'linear-gradient(135deg, var(--accent-blue), var(--accent-blue-dark))'}">
                    ${message.avatar}
                </div>
                <div class="message-name">${message.sender}</div>
                <div class="message-time">${message.time}</div>
            </div>
            <div class="message-text ${isMyMessage ? 'my-message' : ''}">${message.text}</div>
        `;
        
        chatArea.appendChild(messageElement);
    });
    
    // Scroll to bottom
    chatArea.scrollTop = chatArea.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    const userName = document.getElementById('myName').textContent;
    const userAvatar = document.getElementById('myAvatar').textContent;
    
    const newMessage = {
        id: `msg_${Date.now()}`,
        sender: userName,
        avatar: userAvatar,
        text: text,
        time: new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        }),
        isTeacher: false
    };
    
    chatMessages.push(newMessage);
    displayChatMessages();
    
    input.value = '';
    showNotification('💬 Message sent to class', 'success');
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
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
    } else {
        chatArea.style.display = 'none';
        toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    }
}

function loadParticipants() {
    const participantsList = document.getElementById('participantsList');
    
    // Keep teacher and me, add other students
    PARTICIPANTS_DATA.forEach(participant => {
        const participantItem = document.createElement('div');
        participantItem.className = 'participant-item';
        
        participantItem.innerHTML = `
            <div class="participant-profile">
                <div class="participant-avatar student">${participant.avatar}</div>
                <div>
                    <div class="participant-name">${participant.name}</div>
                    <div class="participant-role">Student</div>
                </div>
            </div>
            <div class="participant-status">
                <div class="status-icon ${participant.status === 'muted' ? 'muted' : participant.status === 'away' ? 'away' : ''}"></div>
                ${participant.handRaised ? '<i class="fas fa-hand-paper" style="color: var(--accent-yellow); font-size: 0.8em;"></i>' : ''}
            </div>
        `;
        
        participantsList.appendChild(participantItem);
    });
}

function refreshParticipants() {
    showNotification('🔄 Refreshing participant list...', 'info');
    
    setTimeout(() => {
        // Simulate status changes
        PARTICIPANTS_DATA.forEach(participant => {
            if (Math.random() > 0.8) {
                const statuses = ['online', 'away', 'muted'];
                participant.status = statuses[Math.floor(Math.random() * statuses.length)];
            }
            if (Math.random() > 0.9) {
                participant.handRaised = !participant.handRaised;
            }
        });
        
        // Reload participants
        const participantsList = document.getElementById('participantsList');
        const existingStudents = participantsList.querySelectorAll('.participant-item:not(.me):not(:first-child)');
        existingStudents.forEach(item => item.remove());
        
        loadParticipants();
        showNotification('✅ Participant list updated', 'success');
    }, 1500);
}

function toggleRaiseHand() {
    isHandRaised = !isHandRaised;
    const fab = document.getElementById('raiseHandFab');
    const handIcon = document.getElementById('myHandIcon');
    
    if (isHandRaised) {
        fab.classList.add('active');
        handIcon.style.display = 'inline';
        showNotification('🖐️ Hand raised! Teacher has been notified.', 'warning');
    } else {
        fab.classList.remove('active');
        handIcon.style.display = 'none';
        showNotification('🖐️ Hand lowered.', 'info');
    }
    
    // Also update the button in student controls
    const handBtn = document.getElementById('handBtn');
    if (handBtn) {
        if (isHandRaised) {
            handBtn.innerHTML = '<i class="fas fa-hand-paper"></i> Hand Raised';
            handBtn.classList.remove('btn-warning');
            handBtn.classList.add('btn-danger');
        } else {
            handBtn.innerHTML = '<i class="fas fa-hand-paper"></i> Raise Hand';
            handBtn.classList.remove('btn-danger');
            handBtn.classList.add('btn-warning');
        }
    }
}

function toggleMute() {
    isMuted = !isMuted;
    const fab = document.getElementById('muteFab');
    const myStatus = document.getElementById('myStatus');
    
    if (isMuted) {
        fab.classList.add('muted');
        fab.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        myStatus.classList.add('muted');
        showNotification('🔇 Microphone muted', 'warning');
    } else {
        fab.classList.remove('muted');
        fab.innerHTML = '<i class="fas fa-microphone"></i>';
        myStatus.classList.remove('muted');
        showNotification('🔊 Microphone unmuted', 'success');
    }
}

function toggleAudio() {
    isAudioOn = !isAudioOn;
    const audioBtn = document.getElementById('audioBtn');
    
    if (isAudioOn) {
        audioBtn.innerHTML = '<i class="fas fa-volume-up"></i> Audio On';
        audioBtn.classList.remove('btn-danger');
        audioBtn.classList.add('btn-success');
        showNotification('🔊 Audio enabled', 'success');
    } else {
        audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Audio Off';
        audioBtn.classList.remove('btn-success');
        audioBtn.classList.add('btn-danger');
        showNotification('🔇 Audio disabled', 'warning');
    }
}

function raiseHand() {
    toggleRaiseHand();
}

function leaveClass() {
    if (confirm('Are you sure you want to leave the class?')) {
        showNotification('👋 Leaving class...', 'warning');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }
}

function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        showNotification('📺 Exited fullscreen mode', 'info');
    } else {
        document.getElementById('screenArea').requestFullscreen();
        showNotification('📺 Entered fullscreen mode', 'success');
    }
}

function reportIssue() {
    const issues = [
        'Audio not clear',
        'Video lagging',
        'Screen share not visible',
        'Connection problems',
        'Other technical issue'
    ];
    
    const selectedIssue = prompt(`Report an issue:\n\n${issues.map((issue, index) => `${index + 1}. ${issue}`).join('\n')}\n\nEnter issue number (1-5):`);
    
    if (selectedIssue && selectedIssue >= 1 && selectedIssue <= 5) {
        showNotification(`🚨 Issue reported: ${issues[selectedIssue - 1]}. Teacher has been notified.`, 'warning');
    }
}

function requestScreenshot() {
    showNotification('📸 Screenshot request sent to teacher...', 'info');
    
    setTimeout(() => {
        showNotification('📸 Screenshot will be shared after class ends.', 'success');
    }, 2000);
}

function requestControl() {
    showNotification('🖐️ Control request sent to teacher...', 'info');
    
    setTimeout(() => {
        const granted = Math.random() > 0.5;
        if (granted) {
            showNotification('✅ Whiteboard control granted! You can now draw.', 'success');
        } else {
            showNotification('⏳ Please wait, teacher is currently presenting.', 'warning');
        }
    }, 3000);
}

function saveWhiteboard() {
    showNotification('💾 Saving current whiteboard content...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Whiteboard notes saved to your account!', 'success');
    }, 2000);
}

function showPoll() {
    const pollCard = document.getElementById('pollCard');
    pollCard.style.display = 'block';
    
    showNotification('📊 New poll from teacher! Please participate.', 'info');
    
    // Start poll timer
    let timeLeft = 150; // 2:30 in seconds
    const timerElement = document.getElementById('pollTimer');
    
    const pollTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(pollTimer);
            endPoll();
        }
    }, 1000);
}

function votePoll(optionIndex) {
    if (myVote !== null) {
        showNotification('⚠️ You have already voted in this poll.', 'warning');
        return;
    }
    
    myVote = optionIndex;
    
    // Update UI
    const options = document.querySelectorAll('.poll-option');
    options[optionIndex].classList.add('voted');
    
    // Simulate vote count increase
    const voteCount = options[optionIndex].querySelector('.option-votes');
    const currentVotes = parseInt(voteCount.textContent);
    voteCount.textContent = currentVotes + 1;
    
    // Update response count
    const responseCount = document.getElementById('responseCount');
    responseCount.textContent = parseInt(responseCount.textContent) + 1;
    
    showNotification(`✅ Vote submitted for option: "${options[optionIndex].querySelector('.option-text').textContent}"`, 'success');
}

function endPoll() {
    showNotification('📊 Poll ended. Results are being compiled by teacher.', 'info');
    
    setTimeout(() => {
        document.getElementById('pollCard').style.display = 'none';
    }, 3000);
}

function startClassUpdates() {
    // Simulate new chat messages
    setInterval(() => {
        if (Math.random() > 0.85) {
            const studentMessages = [
                'Thank you for the explanation!',
                'Could you please repeat that?',
                'This is very helpful.',
                'I have a question about this topic.',
                'Great example!',
                'Can we have the slides?',
                'Very clear explanation, sir.',
                'Is this in the exam?'
            ];
            
            const randomStudent = PARTICIPANTS_DATA[Math.floor(Math.random() * PARTICIPANTS_DATA.length)];
            const randomMessage = studentMessages[Math.floor(Math.random() * studentMessages.length)];
            
            const newMessage = {
                id: `msg_${Date.now()}`,
                sender: randomStudent.name,
                avatar: randomStudent.avatar,
                text: randomMessage,
                time: new Date().toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                }),
                isTeacher: false
            };
            
            chatMessages.push(newMessage);
            displayChatMessages();
        }
    }, 20000);
    
    // Simulate teacher messages
    setInterval(() => {
        if (Math.random() > 0.9) {
            const teacherMessages = [
                'Any questions so far?',
                'Let me know if the pace is okay.',
                'This is an important concept to remember.',
                'We will have a quick quiz on this later.',
                'Great participation, everyone!',
                'Feel free to ask questions anytime.',
                'Let me demonstrate this with an example.'
            ];
            
            const randomMessage = teacherMessages[Math.floor(Math.random() * teacherMessages.length)];
            
            const newMessage = {
                id: `msg_${Date.now()}`,
                sender: 'Prof. Michael Chen',
                avatar: 'T',
                text: randomMessage,
                time: new Date().toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                }),
                isTeacher: true
            };
            
            chatMessages.push(newMessage);
            displayChatMessages();
        }
    }, 30000);
    
    // Update connection status randomly
    setInterval(() => {
        if (Math.random() > 0.95) {
            const statusElement = document.getElementById('connectionStatus');
            const statuses = [
                { class: 'connected', text: 'Connected to Live Class' },
                { class: 'connecting', text: 'Reconnecting...' },
            ];
            
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            statusElement.className = `connection-status ${randomStatus.class}`;
            statusElement.innerHTML = `
                <div class="status-indicator"></div>
                <span>${randomStatus.text}</span>
            `;
            
            if (randomStatus.class === 'connecting') {
                setTimeout(() => {
                    statusElement.className = 'connection-status connected';
                    statusElement.innerHTML = `
                        <div class="status-indicator"></div>
                        <span>Connected to Live Class</span>
                    `;
                }, 3000);
            }
        }
    }, 45000);
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
