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

let currentMethod = 'qr';
let isScanning = false;
let isCheckedIn = false;
let scannerInterval = null;
let flashlightOn = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    loadAttendanceStatus();
    initializeGeolocation();
    
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
            name: 'Alex Rodriguez',
            role: 'student',
            rollNumber: 'CS2023001'
        };
        localStorage.setItem('scms_current_user', JSON.stringify(defaultUser));
    }

    const user = JSON.parse(localStorage.getItem('scms_current_user'));
    if (user.role !== 'student') {
        alert('Access denied. Student access required.');
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('userName').textContent = user.name || 'Student';
    document.getElementById('userRoll').textContent = user.rollNumber || 'CS2023001';
}

function logout() {
    localStorage.removeItem('scms_current_user');
    showNotification('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
}

function loadAttendanceStatus() {
    const savedAttendance = localStorage.getItem('scms_student_attendance_today');
    if (savedAttendance) {
        isCheckedIn = JSON.parse(savedAttendance);
        updateAttendanceStatus();
    }
}

function startScanning() {
    if (isScanning) return;
    
    isScanning = true;
    const scanner = document.getElementById('qrScanner');
    scanner.classList.add('scanning');
    
    scanner.innerHTML = `
        <div class="scanner-icon" style="color: var(--accent-green);">
            <i class="fas fa-camera"></i>
        </div>
        <div class="scanner-text" style="color: var(--accent-green);">Scanning Active</div>
        <div class="scanner-subtext">Hold QR code steady in the frame</div>
        <div class="scan-animation"></div>
    `;
    
    showNotification('📷 QR Scanner activated. Point camera at QR code.', 'info');
    
    // Simulate camera activation
    setTimeout(() => {
        showNotification('🔍 Looking for QR codes...', 'info');
    }, 1000);
}

function stopScanning() {
    if (!isScanning) return;
    
    isScanning = false;
    const scanner = document.getElementById('qrScanner');
    scanner.classList.remove('scanning');
    
    scanner.innerHTML = `
        <div class="scanner-icon">
            <i class="fas fa-qrcode"></i>
        </div>
        <div class="scanner-text">Tap to Start Scanning</div>
        <div class="scanner-subtext">Point your camera at the QR code displayed by your teacher</div>
        <div class="scan-animation"></div>
    `;
    
    showNotification('📷 Scanner stopped', 'warning');
}

function simulateSuccess() {
    if (isCheckedIn) {
        showNotification('✅ Already checked in for today!', 'info');
        return;
    }
    
    showNotification('🎯 QR Code detected! Processing...', 'info');
    
    setTimeout(() => {
        isCheckedIn = true;
        localStorage.setItem('scms_student_attendance_today', JSON.stringify(true));
        updateAttendanceStatus();
        stopScanning();
        
        showNotification('✅ Successfully checked in for CS101 - Data Structures!', 'success');
        
        // Add to history
        addToHistory('CS101 - Data Structures', 'present', 'qr');
    }, 2000);
}

function updateAttendanceStatus() {
    const statusElement = document.getElementById('attendanceStatus');
    
    if (isCheckedIn) {
        statusElement.className = 'attendance-status success';
        statusElement.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Successfully Checked In
            <div style="font-size: 0.9em; margin-top: 8px; font-weight: normal;">
                Marked present at ${new Date().toLocaleTimeString('en-US', { 
                    hour12: true, 
                    hour: 'numeric', 
                    minute: '2-digit' 
                })}
            </div>
        `;
    } else {
        statusElement.className = 'attendance-status danger';
        statusElement.innerHTML = `
            <i class="fas fa-times-circle"></i>
            Not Checked In
            <div style="font-size: 0.9em; margin-top: 8px; font-weight: normal;">
                Class started 25 minutes ago
            </div>
        `;
    }
}

function selectMethod(method) {
    currentMethod = method;
    
    // Update active method card
    document.querySelectorAll('.method-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`.method-card.${method}`).classList.add('active');
    
    // Hide geo info for non-geo methods
    const geoInfo = document.getElementById('geoInfo');
    if (method === 'geo') {
        geoInfo.style.display = 'block';
    } else {
        geoInfo.style.display = 'none';
    }
    
    showNotification(`${method.toUpperCase()} method selected`, 'info');
}

function quickScan() {
    selectMethod('qr');
    startScanning();
}

function startFaceRecognition() {
    showNotification('🤖 Starting face recognition system...', 'info');
    
    setTimeout(() => {
        showNotification('👤 Please look at the camera and stay still...', 'info');
    }, 1500);
    
    setTimeout(() => {
        if (!isCheckedIn) {
            isCheckedIn = true;
            localStorage.setItem('scms_student_attendance_today', JSON.stringify(true));
            updateAttendanceStatus();
            
            showNotification('✅ Face recognized! Attendance marked successfully.', 'success');
            addToHistory('CS101 - Data Structures', 'present', 'face');
        } else {
            showNotification('⚠️ Already checked in for today!', 'warning');
        }
    }, 4000);
}

function startGeoCheckin() {
    showNotification('📍 Getting your location...', 'info');
    
    // Simulate getting location
    setTimeout(() => {
        document.getElementById('currentLocation').textContent = 'Computer Science Building, Room 201';
        showNotification('📍 Location verified. You are in the correct classroom!', 'success');
        
        setTimeout(() => {
            if (!isCheckedIn) {
                isCheckedIn = true;
                localStorage.setItem('scms_student_attendance_today', JSON.stringify(true));
                updateAttendanceStatus();
                
                showNotification('✅ Geolocation check-in successful!', 'success');
                addToHistory('CS101 - Data Structures', 'present', 'geo');
            } else {
                showNotification('⚠️ Already checked in for today!', 'warning');
            }
        }, 1500);
    }, 2000);
}

function requestManualEntry() {
    showNotification('📧 Manual entry request sent to teacher...', 'info');
    
    setTimeout(() => {
        showNotification('👨‍🏫 Teacher has been notified. Please wait for manual marking.', 'success');
    }, 2000);
}

function toggleFlashlight() {
    flashlightOn = !flashlightOn;
    const flashBtn = document.getElementById('flashBtn');
    
    if (flashlightOn) {
        flashBtn.innerHTML = '<i class="fas fa-lightbulb"></i> On';
        flashBtn.classList.remove('btn-primary');
        flashBtn.classList.add('btn-warning');
        showNotification('💡 Flashlight turned on', 'success');
    } else {
        flashBtn.innerHTML = '<i class="fas fa-flashlight"></i> Flash';
        flashBtn.classList.remove('btn-warning');
        flashBtn.classList.add('btn-primary');
        showNotification('💡 Flashlight turned off', 'info');
    }
}

function switchCamera() {
    showNotification('📷 Switching to front/back camera...', 'info');
    setTimeout(() => {
        showNotification('📷 Camera switched successfully', 'success');
    }, 1000);
}

function joinLiveClass() {
    showNotification('🎥 Joining live class session...', 'info');
    setTimeout(() => {
        window.location.href = 'interactive.html';
    }, 1500);
}

function viewHistory() {
    showNotification('📋 Loading complete attendance history...', 'info');
    setTimeout(() => {
        showNotification('📋 History loaded. Showing recent check-ins.', 'success');
    }, 1500);
}

function refreshHistory() {
    showNotification('🔄 Refreshing attendance history...', 'info');
    
    setTimeout(() => {
        // Simulate adding new history item
        const historyList = document.getElementById('historyList');
        const newItem = document.createElement('div');
        newItem.className = 'history-item';
        newItem.innerHTML = `
            <div class="history-info">
                <div class="history-icon present">
                    <i class="fas fa-check"></i>
                </div>
                <div class="history-details">
                    <h4>CS101 - Data Structures</h4>
                    <p>Today, ${new Date().toLocaleTimeString('en-US', { 
                        hour12: true, 
                        hour: 'numeric', 
                        minute: '2-digit' 
                    })} • Prof. Chen</p>
                </div>
            </div>
            <div class="history-status">
                <div class="status-badge status-present">Present</div>
                <div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 4px;">
                    QR Code
                </div>
            </div>
        `;
        
        historyList.insertBefore(newItem, historyList.firstChild);
        showNotification('✅ History updated with latest check-in', 'success');
    }, 1500);
}

function addToHistory(className, status, method) {
    // This would add to the history list in a real app
    setTimeout(() => {
        refreshHistory();
    }, 1000);
}

function initializeGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Location obtained successfully
                document.getElementById('currentLocation').textContent = 'Location detected';
            },
            (error) => {
                // Location access denied or unavailable
                document.getElementById('currentLocation').textContent = 'Location unavailable';
            }
        );
    }
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

// Auto check-in simulation for demo
setTimeout(() => {
    if (!isCheckedIn && Math.random() > 0.7) {
        showNotification('🔔 Reminder: Don\'t forget to check in for today\'s class!', 'warning');
    }
}, 30000); // After 30 seconds

// Simulate location updates
setInterval(() => {
    if (currentMethod === 'geo' && Math.random() > 0.8) {
        const locations = [
            'Computer Science Building, Room 201',
            'Engineering Block, Lab A',
            'Main Campus, Lecture Hall 1',
            'Library Building, Study Room 3'
        ];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        document.getElementById('currentLocation').textContent = randomLocation;
    }
}, 15000); // Every 15 seconds
