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

// Chatbot Management
let isChatBotOpen = false;

function openChatBot() {
    const chatBotWindow = document.getElementById('chatBotWindow');
    if (chatBotWindow) {
        chatBotWindow.style.display = 'block';
        isChatBotOpen = true;
        
        // Focus on input
        setTimeout(() => {
            const chatInput = document.getElementById('chatInput');
            if (chatInput) chatInput.focus();
        }, 300);
        
        showNotification('🤖 AI Assistant activated!', 'info');
    }
}

function closeChatBot() {
    const chatBotWindow = document.getElementById('chatBotWindow');
    if (chatBotWindow) {
        chatBotWindow.style.display = 'none';
        isChatBotOpen = false;
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    // This function will be handled by chat.js
    // Just ensuring the interface is ready
    console.log('Chat message sending - handled by chat.js');
}

// Dashboard State
let isQRScanning = false;
let isCheckedIn = false;
let currentTime = new Date();

// Real-time Date & Time Updates
function updateLiveDateTime() {
    try {
        const now = new Date();
        
        // Full datetime string
        const dateTimeString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) + ' - ' + now.toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: 'numeric', 
            minute: '2-digit' 
        });
        
        // Time only string
        const timeOnlyString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        // Update elements
        const liveDateTime = document.getElementById('liveDateTime');
        const currentTime = document.getElementById('currentTime');
        
        if (liveDateTime) liveDateTime.textContent = dateTimeString;
        if (currentTime) currentTime.textContent = timeOnlyString;
        
    } catch (error) {
        console.error('❌ Error updating live time:', error);
    }
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    updateLiveDateTime();
    animateStats();
    loadAttendanceStatus();
    startRealTimeUpdates();
    
    // Start real-time clock updates
    setInterval(updateLiveDateTime, 1000);
    
    // Initialize chatbot window as hidden
    const chatBotWindow = document.getElementById('chatBotWindow');
    if (chatBotWindow) {
        chatBotWindow.style.display = 'none';
    }
    
    // Close mobile sidebar when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    });
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('🎉 Welcome to your dashboard! Have a great day of learning!', 'success');
    }, 1000);
});

function loadCurrentUser() {
    const currentUser = localStorage.getItem('scms_current_user');
    if (!currentUser) {
        // Set default student data if not found
        const defaultUser = {
            name: 'Alex Rodriguez',
            role: 'student',
            rollNumber: 'CS2023001',
            email: 'alex.rodriguez@student.scms.edu'
        };
        localStorage.setItem('scms_current_user', JSON.stringify(defaultUser));
    }

    const user = JSON.parse(localStorage.getItem('scms_current_user'));
    if (user.role !== 'student') {
        alert('Access denied. Student access required.');
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRoll').textContent = user.rollNumber || 'CS2023001';
    document.getElementById('headerUserName').textContent = user.name.split(' ')[0];
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('scms_current_user');
        showNotification('Logging out... See you soon!', 'info');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    }
}

function animateStats() {
    animateNumber(document.getElementById('attendanceRate'), 0, 92, 2000, 0, '%');
    animateNumber(document.getElementById('pendingAssignments'), 0, 3, 1500);
    animateNumber(document.getElementById('enrolledCourses'), 0, 5, 1800);
    animateNumber(document.getElementById('avgGrade'), 0, 8.4, 2200, 1);
}

function animateNumber(element, start, end, duration, decimals = 0, suffix = '') {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (end - start) * easeOutCubic(progress);
        
        element.textContent = current.toFixed(decimals) + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function loadAttendanceStatus() {
    const savedAttendance = localStorage.getItem('scms_student_attendance_today');
    const attendanceStatus = document.getElementById('attendanceStatus');
    
    if (savedAttendance && JSON.parse(savedAttendance)) {
        isCheckedIn = true;
        attendanceStatus.className = 'attendance-status checked';
        attendanceStatus.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Checked in for today's classes
        `;
    } else {
        attendanceStatus.className = 'attendance-status not-checked';
        attendanceStatus.innerHTML = `
            <i class="fas fa-times-circle"></i>
            Not checked in for current class
        `;
    }
}

function quickCheckIn() {
    window.location.href = 'checkin.html';
}

function startQRScan() {
    if (isQRScanning) return;
    
    isQRScanning = true;
    const scanner = document.querySelector('.qr-scanner');
    scanner.classList.add('scanning');
    
    scanner.innerHTML = `
        <div>
            <i class="fas fa-camera" style="font-size: 2.5rem; color: var(--accent-green);"></i>
            <p class="qr-scanner-text">
                Scanning for QR code...
            </p>
        </div>
        <div class="scan-animation"></div>
    `;
    
    showNotification('📷 QR Scanner activated!', 'info');
    
    setTimeout(() => {
        if (Math.random() > 0.3) {
            isCheckedIn = true;
            localStorage.setItem('scms_student_attendance_today', JSON.stringify(true));
            
            scanner.classList.remove('scanning');
            scanner.innerHTML = `
                <div>
                    <i class="fas fa-check-circle" style="font-size: 2.5rem; color: var(--accent-green);"></i>
                    <p class="qr-scanner-text">
                        Successfully checked in!
                    </p>
                </div>
            `;
            
            loadAttendanceStatus();
            showNotification('✅ Successfully checked in for CS101!', 'success');
            
            setTimeout(() => {
                resetQRScanner();
            }, 2000);
        } else {
            scanner.classList.remove('scanning');
            scanner.innerHTML = `
                <div>
                    <i class="fas fa-exclamation-triangle" style="font-size: 2.5rem; color: var(--accent-red);"></i>
                    <p class="qr-scanner-text">
                        No QR code detected
                    </p>
                </div>
            `;
            
            showNotification('❌ No QR code found. Try again.', 'error');
            
            setTimeout(() => {
                resetQRScanner();
            }, 2000);
        }
        
        isQRScanning = false;
    }, 3000);
}

function resetQRScanner() {
    const scanner = document.querySelector('.qr-scanner');
    scanner.classList.remove('scanning');
    scanner.innerHTML = `
        <div>
            <i class="fas fa-qrcode"></i>
            <p class="qr-scanner-text">
                Tap to scan QR code
            </p>
        </div>
        <div class="scan-animation"></div>
    `;
}

function openFullScanner() {
    window.location.href = 'checkin.html';
}

function joinLiveClass() {
    showNotification('🎥 Joining live class...', 'info');
    setTimeout(() => {
        window.location.href = 'interactive.html';
    }, 1500);
}

function joinClass(classId) {
    const classNames = {
        cs101: 'CS101 - Data Structures',
        cs102: 'CS102 - Algorithms',
        cs103: 'CS103 - Database Systems'
    };
    
    showNotification(`🎓 Joining ${classNames[classId] || 'class'}...`, 'info');
    
    setTimeout(() => {
        window.location.href = 'interactive.html';
    }, 2000);
}

function scheduleReminder(classId) {
    const classNames = {
        cs102: 'CS102 - Algorithms',
        math201: 'MATH201 - Statistics'
    };
    
    showNotification(`⏰ Reminder set for ${classNames[classId] || 'class'}`, 'success');
}

function viewAllAssignments() {
    window.location.href = 'assignment.html';
}

function startAssignment(assignmentId) {
    const assignments = {
        cs101_assignment1: 'Binary Trees Implementation',
        cs102_assignment1: 'Algorithm Analysis Report',
        cs103_assignment1: 'ER Diagram Creation'
    };
    
    showNotification(`📝 Opening ${assignments[assignmentId] || 'assignment'}...`, 'info');
    
    setTimeout(() => {
        window.location.href = 'assignment.html';
    }, 1500);
}

function downloadResources() {
    showNotification('📚 Preparing course resources for download...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Resources downloaded successfully!', 'success');
    }, 3000);
}

function contactTeacher() {
    showNotification('📧 Opening teacher contact form...', 'info');
    
    setTimeout(() => {
        showNotification('✉️ Message sent to teacher!', 'success');
    }, 2000);
}

function markAllRead() {
    const notifications = document.querySelectorAll('.notification-item.unread');
    notifications.forEach(notification => {
        notification.classList.remove('unread');
    });
    
    showNotification('✅ All notifications marked as read', 'success');
}

function startRealTimeUpdates() {
    setTimeout(() => {
        addNewNotification();
    }, 30000);
    
    setTimeout(() => {
        updateGrade();
    }, 45000);
    
    setInterval(() => {
        if (Math.random() > 0.8) {
            showAssignmentReminder();
        }
    }, 60000);
}

function addNewNotification() {
    const notificationsPanel = document.getElementById('notificationsPanel');
    const newNotification = document.createElement('div');
    newNotification.className = 'notification-item unread';
    
    newNotification.innerHTML = `
        <div class="notification-icon class">
            <i class="fas fa-chalkboard"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">Class Reminder</div>
            <div class="notification-text">CS102 - Algorithms class starts in 1 hour</div>
            <div class="notification-time">Just now</div>
        </div>
    `;
    
    notificationsPanel.insertBefore(newNotification, notificationsPanel.firstChild);
    showNotification('📢 New notification received!', 'info');
}

function updateGrade() {
    showNotification('🌟 New grade available: Database Quiz - 9.2/10', 'success');
    
    const avgGradeElement = document.getElementById('avgGrade');
    animateNumber(avgGradeElement, 8.4, 8.5, 1000, 1);
}

function showAssignmentReminder() {
    const reminders = [
       '📝 Reminder: Binary Trees assignment due tomorrow!',
        '⏰ Don\'t forget: Algorithm Analysis report due in 2 days',
        '📋 Upcoming: Database ER diagram submission next week',
    ];
    
    const randomReminder = reminders[Math.floor(Math.random() * reminders.length)];
    showNotification(randomReminder, 'warning');
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
    const chatBotWindow = document.getElementById('chatBotWindow');
    
    // Close sidebar
    if (window.innerWidth <= 768 && 
        sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
        closeMobileSidebar();
    }
    
    // Close chatbot if clicking outside
    if (isChatBotOpen && chatBotWindow && 
        !chatBotWindow.contains(e.target) && 
        !e.target.closest('.fab')) {
        closeChatBot();
    }
});

// Add smooth scrolling for better UX
document.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.header');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + C for check-in
    if (e.altKey && e.key === 'c') {
        e.preventDefault();
        quickCheckIn();
    }
    
    // Alt + J for join class
    if (e.altKey && e.key === 'j') {
        e.preventDefault();
        joinLiveClass();
    }
    
    // Alt + A for assignments
    if (e.altKey && e.key === 'a') {
        e.preventDefault();
        viewAllAssignments();
    }
    
    // Alt + B for chatbot
    if (e.altKey && e.key === 'b') {
        e.preventDefault();
        if (isChatBotOpen) {
            closeChatBot();
        } else {
            openChatBot();
        }
    }
    
    // Escape to close chatbot
    if (e.key === 'Escape' && isChatBotOpen) {
        closeChatBot();
    }
});

// Service Worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registered successfully');
            })
            .catch(function(registrationError) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Handle online/offline status
window.addEventListener('online', function() {
    showNotification('🌐 Connection restored!', 'success');
});

window.addEventListener('offline', function() {
    showNotification('🔌 You are offline. Some features may be limited.', 'warning');
});
