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

// Mock data for students
const STUDENTS_DATA = [
    { id: 'st001', name: 'Raj Kumar', rollNo: 'CS001', avatar: 'RK' },
    { id: 'st002', name: 'Priya Sharma', rollNo: 'CS002', avatar: 'PS' },
    { id: 'st003', name: 'Arjun Patel', rollNo: 'CS003', avatar: 'AP' },
    { id: 'st004', name: 'Sneha Gupta', rollNo: 'CS004', avatar: 'SG' },
    { id: 'st005', name: 'Vikram Singh', rollNo: 'CS005', avatar: 'VS' },
    { id: 'st006', name: 'Anita Rao', rollNo: 'CS006', avatar: 'AR' },
    { id: 'st007', name: 'Rohit Mehta', rollNo: 'CS007', avatar: 'RM' },
    { id: 'st008', name: 'Kavya Nair', rollNo: 'CS008', avatar: 'KN' }
];

let attendanceData = [];
let currentClass = 'cs101';
let activePoll = null;

// Load current user and initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    updateTime();
    loadAttendanceTable();
    startRealTimeUpdates();
    
    // Update time every minute
    setInterval(updateTime, 60000);
    
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
    if (user.role !== 'teacher') {
        alert('Access denied. Teacher privileges required.');
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('userName').textContent = user.name;
    document.getElementById('headerUserName').textContent = user.name.split(' ')[0];
    
    if (user.department) {
        document.getElementById('userDept').textContent = 
            user.department.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
}

function logout() {
    localStorage.removeItem('scms_current_user');
    showNotification('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: 'numeric', 
        minute: '2-digit' 
    });
    document.getElementById('currentTime').textContent = timeString;
}

function selectClass(classId) {
    // Remove active class from all items
    document.querySelectorAll('.class-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active to selected class
    event.currentTarget.classList.add('active');
    
    currentClass = classId;
    loadAttendanceTable();
    
    const className = event.currentTarget.querySelector('h4').textContent;
    document.querySelector('.card-header h3').innerHTML = 
        `<i class="fas fa-user-check"></i> Live Attendance - ${className}`;
}

function loadAttendanceTable() {
    const tbody = document.getElementById('attendanceTableBody');
    tbody.innerHTML = '';

    // Show current attendance data
    attendanceData.forEach(record => {
        const student = STUDENTS_DATA.find(s => s.id === record.studentId);
        if (student) {
            const row = createAttendanceRow(student, record);
            tbody.appendChild(row);
        }
    });

    // Show remaining students as absent
    STUDENTS_DATA.forEach(student => {
        if (!attendanceData.find(a => a.studentId === student.id)) {
            const row = createAttendanceRow(student, null);
            tbody.appendChild(row);
        }
    });
}

function createAttendanceRow(student, record) {
    const row = document.createElement('tr');
    
    const status = record ? record.status : 'absent';
    const time = record ? record.time : '-';
    const method = record ? record.method : '-';
    
    row.innerHTML = `
        <td>
            <div class="student-profile">
                <div class="student-avatar">${student.avatar}</div>
                <span>${student.name}</span>
            </div>
        </td>
        <td>${student.rollNo}</td>
        <td>
            <span class="attendance-status status-${status}">
                ${status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        </td>
        <td>${time}</td>
        <td>${method.toUpperCase()}</td>
    `;
    
    if (record) {
        row.style.background = 'var(--bg-tertiary)';
        setTimeout(() => {
            row.style.background = '';
        }, 3000);
    }
    
    return row;
}

function simulateCheckIn() {
    const availableStudents = STUDENTS_DATA.filter(s => 
        !attendanceData.find(a => a.studentId === s.id)
    );
    
    if (availableStudents.length === 0) {
        showNotification('All students are already marked!', 'warning');
        return;
    }
    
    const randomStudent = availableStudents[Math.floor(Math.random() * availableStudents.length)];
    const methods = ['qr', 'face', 'geo'];
    const randomMethod = methods[Math.floor(Math.random() * methods.length)];
    
    const record = {
        studentId: randomStudent.id,
        status: Math.random() > 0.1 ? 'present' : 'late',
        time: new Date().toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: 'numeric', 
            minute: '2-digit' 
        }),
        method: randomMethod
    };
    
    attendanceData.push(record);
    loadAttendanceTable();
    
    showNotification(
        `${randomStudent.name} checked in via ${randomMethod.toUpperCase()}`, 
        'success'
    );
    
    updateStats();
}

function markAllPresent() {
    if (confirm('Mark all remaining students as present?')) {
        const absentStudents = STUDENTS_DATA.filter(s => 
            !attendanceData.find(a => a.studentId === s.id)
        );
        
        absentStudents.forEach(student => {
            attendanceData.push({
                studentId: student.id,
                status: 'present',
                time: new Date().toLocaleTimeString('en-US', { 
                    hour12: true, 
                    hour: 'numeric', 
                    minute: '2-digit' 
                }),
                method: 'manual'
            });
        });
        
        loadAttendanceTable();
        showNotification(`${absentStudents.length} students marked present`, 'success');
        updateStats();
    }
}

function exportAttendance() {
    showNotification('Exporting attendance data...', 'info');
    setTimeout(() => {
        showNotification('Attendance exported successfully!', 'success');
    }, 2000);
}

function openAttendanceScanner() {
    showNotification('Opening QR scanner...', 'info');
    setTimeout(() => {
        showNotification('QR scanner would open camera in real app', 'info');
    }, 1500);
}

function startClass() {
    showNotification('Starting class session...', 'info');
    setTimeout(() => {
        showNotification('Class session started successfully!', 'success');
        
        // Update UI to show class as live
        const activeClass = document.querySelector('.class-item.active .status-badge');
        if (activeClass) {
            activeClass.textContent = 'LIVE NOW';
            activeClass.className = 'status-badge status-live';
        }
    }, 2000);
}

function markAttendance() {
    showNotification('Opening attendance marking interface...', 'info');
    setTimeout(() => {
        simulateCheckIn();
    }, 1000);
}

function createPoll() {
    document.getElementById('pollCreator').style.display = 'block';
    document.getElementById('noActivePoll').style.display = 'none';
}

function cancelPoll() {
    document.getElementById('pollCreator').style.display = 'none';
    document.getElementById('noActivePoll').style.display = 'block';
    
    // Clear form
    document.getElementById('pollQuestion').value = '';
    document.querySelectorAll('.poll-option').forEach(input => input.value = '');
}

function launchPoll() {
    const question = document.getElementById('pollQuestion').value;
    const options = Array.from(document.querySelectorAll('.poll-option')).map(input => input.value);
    
    if (!question || options.some(opt => !opt)) {
        showNotification('Please fill in all fields', 'warning');
        return;
    }
    
    activePoll = {
        question: question,
        options: options,
        responses: options.map(() => 0),
        totalResponses: 0
    };
    
    displayActivePoll();
    cancelPoll();
    
    showNotification('Poll launched successfully!', 'success');
    
    // Simulate student responses
    setTimeout(() => simulatePollResponses(), 2000);
}

function displayActivePoll() {
    const activePollDiv = document.getElementById('activePoll');
    const noActivePollDiv = document.getElementById('noActivePoll');
    
    activePollDiv.innerHTML = `
        <div class="active-poll">
            <h4 style="margin-bottom: 15px; color: var(--text-primary);">${activePoll.question}</h4>
            <div class="poll-responses" id="pollResponses">
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
            <div style="margin-top: 15px; text-align: center;">
                <span style="color: var(--accent-green); font-weight: 600;">
                    Total Responses: <span id="totalResponses">0</span>
                </span>
                <button class="btn btn-danger" onclick="endPoll()" style="margin-left: 15px; padding: 5px 15px;">
                    <i class="fas fa-stop"></i>
                    End Poll
                </button>
            </div>
        </div>
    `;
    
    activePollDiv.style.display = 'block';
    noActivePollDiv.style.display = 'none';
}

function simulatePollResponses() {
    if (!activePoll) return;
    
    const numResponses = Math.floor(Math.random() * 5) + 3; // 3-7 responses at a time
    
    for (let i = 0; i < numResponses; i++) {
        setTimeout(() => {
            const randomOption = Math.floor(Math.random() * activePoll.options.length);
            activePoll.responses[randomOption]++;
            activePoll.totalResponses++;
            
            updatePollDisplay();
        }, i * 500);
    }
}

function updatePollDisplay() {
    if (!activePoll) return;
    
    document.getElementById('totalResponses').textContent = activePoll.totalResponses;
    
    activePoll.responses.forEach((count, index) => {
        const percentage = activePoll.totalResponses > 0 ? 
            (count / activePoll.totalResponses) * 100 : 0;
        
        document.getElementById(`response-${index}`).style.width = `${percentage}%`;
        document.getElementById(`count-${index}`).textContent = count;
    });
}

function endPoll() {
    if (confirm('End this poll? Results will be saved.')) {
        showNotification('Poll ended. Results saved successfully!', 'success');
        
        document.getElementById('activePoll').style.display = 'none';
        document.getElementById('noActivePoll').style.display = 'block';
        
        activePoll = null;
    }
}

function shareResource() {
    showNotification('Opening resource sharing...', 'info');
    setTimeout(() => {
        showNotification('Resource sharing feature would open file picker', 'info');
    }, 1500);
}

function sendAnnouncement() {
    const message = prompt('Enter your announcement:');
    if (message) {
        showNotification('Announcement sent to all students!', 'success');
    }
}

function recordSession() {
    showNotification('Starting session recording...', 'info');
    setTimeout(() => {
        showNotification('Session recording started!', 'success');
    }, 2000);
}

function bookResource() {
    showNotification('Opening resource booking...', 'info');
    setTimeout(() => {
        showNotification('Resource booking interface would open', 'info');
    }, 1500);
}

function viewAnalytics() {
    showNotification('Loading class analytics...', 'info');
    setTimeout(() => {
        showNotification('Analytics dashboard would open with detailed insights', 'info');
    }, 2000);
}

function openChatBot() {
    showNotification('AI Assistant activated!', 'info');
    setTimeout(() => {
        showNotification('AI Teaching Assistant: "How can I help you today?"', 'info');
    }, 1500);
}

function emergencyAlert() {
    if (confirm('Trigger emergency alert to all students?')) {
        showNotification('🚨 Emergency alert sent to all students!', 'warning');
    }
}

function updateStats() {
    const presentCount = attendanceData.filter(a => a.status === 'present' || a.status === 'late').length;
    const attendanceRate = Math.round((presentCount / STUDENTS_DATA.length) * 100);
    
    document.getElementById('avgAttendance').textContent = `${attendanceRate}%`;
    
    // Update class display
    const activeClassStatus = document.querySelector('.class-item.active .class-status span:last-child');
    if (activeClassStatus) {
        activeClassStatus.textContent = `${presentCount}/${STUDENTS_DATA.length} Present`;
        activeClassStatus.style.color = presentCount > STUDENTS_DATA.length * 0.8 ? 'var(--accent-green)' : 'var(--accent-yellow)';
    }
}

function startRealTimeUpdates() {
    // Simulate random student check-ins
    setInterval(() => {
        if (Math.random() > 0.85 && attendanceData.length < STUDENTS_DATA.length) {
            simulateCheckIn();
        }
    }, 15000);
    
    // Simulate poll responses if poll is active
    setInterval(() => {
        if (activePoll && Math.random() > 0.7) {
            simulatePollResponses();
        }
    }, 10000);
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

// Initialize some demo attendance data
setTimeout(() => {
    attendanceData = [
        { studentId: 'st001', status: 'present', time: '10:05 AM', method: 'face' },
        { studentId: 'st002', status: 'present', time: '10:03 AM', method: 'qr' },
        { studentId: 'st003', status: 'late', time: '10:12 AM', method: 'manual' },
        { studentId: 'st004', status: 'present', time: '10:01 AM', method: 'geo' }
    ];
    loadAttendanceTable();
    updateStats();
}, 2000);

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
