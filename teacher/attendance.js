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

// Mock student data
const STUDENTS_DATA = [
    { id: 'st001', name: 'Raj Kumar', rollNo: 'CS001', avatar: 'RK', email: 'raj.kumar@student.edu' },
    { id: 'st002', name: 'Priya Sharma', rollNo: 'CS002', avatar: 'PS', email: 'priya.sharma@student.edu' },
    { id: 'st003', name: 'Arjun Patel', rollNo: 'CS003', avatar: 'AP', email: 'arjun.patel@student.edu' },
    { id: 'st004', name: 'Sneha Gupta', rollNo: 'CS004', avatar: 'SG', email: 'sneha.gupta@student.edu' },
    { id: 'st005', name: 'Vikram Singh', rollNo: 'CS005', avatar: 'VS', email: 'vikram.singh@student.edu' },
    { id: 'st006', name: 'Anita Rao', rollNo: 'CS006', avatar: 'AR', email: 'anita.rao@student.edu' },
    { id: 'st007', name: 'Rohit Mehta', rollNo: 'CS007', avatar: 'RM', email: 'rohit.mehta@student.edu' },
    { id: 'st008', name: 'Kavya Nair', rollNo: 'CS008', avatar: 'KN', email: 'kavya.nair@student.edu' },
    { id: 'st009', name: 'Aditya Kumar', rollNo: 'CS009', avatar: 'AK', email: 'aditya.kumar@student.edu' },
    { id: 'st010', name: 'Riya Agarwal', rollNo: 'CS010', avatar: 'RA', email: 'riya.agarwal@student.edu' }
];

// Teacher attendance data structure - NEW ADDITION
let TEACHER_ATTENDANCE_DATA = JSON.parse(localStorage.getItem('scms_teacher_attendance')) || [];

// Student attendance variables - PRESERVED EXACTLY
let attendanceData = [];
let sessionActive = false;
let selectedStudents = [];

// Load current user and initialize
document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    loadCurrentUser();
    loadAttendanceTable();
    updateStats();

    // Add teacher attendance controls - NEW
    addTeacherAttendanceControls();
    updateTeacherAttendanceDisplay();
    initializeDemoAttendanceData();

    // Set today's date - PRESERVED
    const dateElement = document.getElementById('attendanceDate');
    if (dateElement) {
        dateElement.value = new Date().toISOString().split('T')[0];
    }

    // Close mobile sidebar when resizing to desktop - PRESERVED
    window.addEventListener('resize', function () {
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

    const userNameElement = document.getElementById('userName');
    const userDeptElement = document.getElementById('userDept');

    if (userNameElement) userNameElement.textContent = user.name;

    if (user.department && userDeptElement) {
        userDeptElement.textContent = user.department.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('scms_current_user');
        showNotification('Logged out successfully', 'info');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    }
}

// ========== TEACHER ATTENDANCE FUNCTIONS - NEW SECTION ==========
function markTeacherAttendance(status, reason = null) {
    const currentUser = JSON.parse(localStorage.getItem('scms_current_user'));
    if (!currentUser) return;

    const today = new Date().toISOString().split('T')[0];

    const existingRecord = TEACHER_ATTENDANCE_DATA.find(record =>
        record.teacherId === currentUser.id && record.date === today
    );

    if (existingRecord) {
        existingRecord.status = status;
        existingRecord.reason = reason;
        existingRecord.timestamp = new Date().toISOString();
        if (status === 'present' || status === 'late') {
            existingRecord.checkInTime = new Date().toLocaleTimeString();
        }
    } else {
        const attendanceRecord = {
            id: 'ATT_' + Date.now(),
            teacherId: currentUser.id,
            teacherName: currentUser.name,
            department: currentUser.department || 'CSE',
            date: today,
            status: status,
            reason: reason,
            timestamp: new Date().toISOString(),
            checkInTime: status === 'present' || status === 'late' ? new Date().toLocaleTimeString() : null
        };

        TEACHER_ATTENDANCE_DATA.push(attendanceRecord);
    }

    localStorage.setItem('scms_teacher_attendance', JSON.stringify(TEACHER_ATTENDANCE_DATA));
    showNotification(`Attendance marked as ${status.toUpperCase()}`, 'success');
    updateTeacherAttendanceDisplay();
}

function applyLeave(reason) {
    markTeacherAttendance('leave', reason);
}

function addTeacherAttendanceControls() {
    const controlsSection = document.querySelector('.attendance-controls');
    if (controlsSection) {
        const teacherAttendanceHTML = `
            <div class="teacher-attendance-section" style="margin-top: 20px; padding: 20px; background: var(--bg-secondary); border-radius: 15px; border: 1px solid var(--border-color);">
                <h3 style="color: var(--text-primary); margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-user-check" style="color: var(--accent-green);"></i> Mark Your Attendance
                </h3>
                <div class="teacher-attendance-controls" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-bottom: 15px;">
                    <button class="btn btn-success btn-sm" onclick="markTeacherAttendance('present')" style="min-height: 44px;">
                        <i class="fas fa-check"></i> Present
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="markTeacherAttendance('late')" style="min-height: 44px;">
                        <i class="fas fa-clock"></i> Late
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="showLeaveModal()" style="min-height: 44px;">
                        <i class="fas fa-calendar-times"></i> Leave
                    </button>
                </div>
                <div id="teacherAttendanceStatus"></div>
            </div>
        `;
        controlsSection.insertAdjacentHTML('beforeend', teacherAttendanceHTML);
    }
}

function showLeaveModal() {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px; margin: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--border-color);">
                <h3 style="color: var(--text-primary); margin: 0;">Apply for Leave</h3>
                <button class="close-btn" onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary); padding: 5px; border-radius: 50%;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-primary);">Leave Reason:</label>
                    <textarea id="leaveReason" placeholder="Enter reason for leave..." style="width: 100%; padding: 15px; border: 2px solid var(--border-color); border-radius: 8px; min-height: 80px; font-size: 16px; background: var(--bg-primary); color: var(--text-primary); resize: vertical; font-family: inherit;"></textarea>
                </div>
                <div class="form-actions" style="margin-top: 20px; display: flex; gap: 10px;">
                    <button class="btn btn-danger" onclick="submitLeave()" style="flex: 1;">Apply Leave</button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()" style="flex: 1;">Cancel</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
        const textarea = document.getElementById('leaveReason');
        if (textarea) textarea.focus();
    }, 100);
}

function submitLeave() {
    const reason = document.getElementById('leaveReason');
    if (!reason || !reason.value.trim()) {
        showNotification('Please enter a reason for leave', 'error');
        return;
    }

    applyLeave(reason.value.trim());
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
}

function updateTeacherAttendanceDisplay() {
    const currentUser = JSON.parse(localStorage.getItem('scms_current_user'));
    if (!currentUser) return;

    const today = new Date().toISOString().split('T')[0];

    const todayRecord = TEACHER_ATTENDANCE_DATA.find(record =>
        record.teacherId === currentUser.id && record.date === today
    );

    const statusElement = document.getElementById('teacherAttendanceStatus');
    if (statusElement) {
        if (todayRecord) {
            const statusColor = {
                'present': 'var(--accent-green)',
                'late': 'var(--accent-yellow)',
                'leave': 'var(--accent-blue)',
                'absent': 'var(--accent-red)'
            };

            statusElement.innerHTML = `
                <div style="padding: 15px; background: var(--bg-primary); border-radius: 8px; border-left: 4px solid ${statusColor[todayRecord.status]}; box-shadow: 0 2px 8px var(--shadow-light);">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <strong style="color: var(--text-primary);">Today's Status:</strong> 
                        <span style="color: ${statusColor[todayRecord.status]}; text-transform: uppercase; font-weight: 600; font-size: 0.9rem;">
                            ${todayRecord.status}
                        </span>
                    </div>
                    ${todayRecord.checkInTime ? `<div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 5px;"><i class="fas fa-clock" style="width: 16px;"></i> Check-in: ${todayRecord.checkInTime}</div>` : ''}
                    ${todayRecord.reason ? `<div style="font-size: 0.85rem; color: var(--text-secondary);"><i class="fas fa-comment" style="width: 16px;"></i> Reason: ${todayRecord.reason}</div>` : ''}
                </div>
            `;
        } else {
            statusElement.innerHTML = `
                <div style="padding: 15px; background: var(--bg-tertiary); border-radius: 8px; border-left: 4px solid var(--text-tertiary); text-align: center;">
                    <span style="color: var(--text-secondary); font-style: italic;">No attendance marked for today</span>
                </div>
            `;
        }
    }
}

function initializeDemoAttendanceData() {
    const existingData = localStorage.getItem('scms_teacher_attendance');
    if (!existingData) {
        const demoAttendanceData = [];
        const today = new Date();

        const facultyData = JSON.parse(localStorage.getItem('scms_faculty_data')) || [
            { id: 'FAC001', name: 'Dr. Rajesh Kumar', department: 'CSE' },
            { id: 'FAC002', name: 'Dr. Priya Sharma', department: 'ECE' },
            { id: 'FAC003', name: 'Prof. Anand Gupta', department: 'EEE' },
            { id: 'FAC004', name: 'Ms. Meera Patel', department: 'MECH' },
            { id: 'FAC005', name: 'Prof. Vikram Singh', department: 'CIVIL' }
        ];

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];

            facultyData.forEach((faculty) => {
                const statuses = ['present', 'present', 'present', 'late', 'leave', 'absent'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

                let reason = null;
                if (randomStatus === 'leave') {
                    const leaveReasons = ['Medical appointment', 'Family emergency', 'Personal work', 'Sick leave', 'Conference attendance'];
                    reason = leaveReasons[Math.floor(Math.random() * leaveReasons.length)];
                } else if (randomStatus === 'absent') {
                    reason = 'Unplanned absence';
                }

                demoAttendanceData.push({
                    id: `ATT_${faculty.id}_${dateString}`,
                    teacherId: faculty.id,
                    teacherName: faculty.name,
                    department: faculty.department,
                    date: dateString,
                    status: randomStatus,
                    reason: reason,
                    timestamp: date.toISOString(),
                    checkInTime: randomStatus === 'present' || randomStatus === 'late' ?
                        `${8 + Math.floor(Math.random() * 3)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM` : null
                });
            });
        }

        localStorage.setItem('scms_teacher_attendance', JSON.stringify(demoAttendanceData));
        TEACHER_ATTENDANCE_DATA = demoAttendanceData;
    }
}

// ========== ALL YOUR EXISTING STUDENT ATTENDANCE FUNCTIONS - PRESERVED EXACTLY ==========
function loadAttendanceTable() {
    const tbody = document.getElementById('attendanceTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    STUDENTS_DATA.forEach(student => {
        const attendance = attendanceData.find(a => a.studentId === student.id);
        const row = createAttendanceRow(student, attendance);
        tbody.appendChild(row);
    });

    updateStats();
}

function createAttendanceRow(student, attendance) {
    const row = document.createElement('tr');

    const status = attendance ? attendance.status : 'absent';
    const time = attendance ? attendance.time : '-';
    const method = attendance ? attendance.method : '-';
    const confidence = attendance ? attendance.confidence : 0;

    row.innerHTML = `
        <td>
            <input type="checkbox" class="student-checkbox" value="${student.id}" 
                   onchange="updateSelectedStudents()">
        </td>
        <td>
            <div class="student-profile">
                <div class="student-avatar">${student.avatar}</div>
                <div class="student-details">
                    <h4>${student.name}</h4>
                    <span>${student.email}</span>
                </div>
            </div>
        </td>
        <td><strong>${student.rollNo}</strong></td>
        <td>
            <span class="status-badge status-${status}" onclick="toggleStatus('${student.id}')">
                ${status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        </td>
        <td>${time}</td>
        <td>${method.toUpperCase()}</td>
        <td>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div class="confidence-bar">
                    <div class="confidence-fill ${getConfidenceClass(confidence)}" 
                         style="width: ${confidence * 100}%"></div>
                </div>
                <span style="font-size: 0.8em;">${Math.round(confidence * 100)}%</span>
            </div>
        </td>
        <td>
            <div style="display: flex; gap: 5px;">
                <button class="btn btn-success" style="padding: 5px 10px; font-size: 0.8em;" 
                        onclick="markPresent('${student.id}')">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-danger" style="padding: 5px 10px; font-size: 0.8em;" 
                        onclick="markAbsent('${student.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </td>
    `;

    return row;
}

function getConfidenceClass(confidence) {
    if (confidence >= 0.8) return 'confidence-high';
    if (confidence >= 0.6) return 'confidence-medium';
    return 'confidence-low';
}

function updateStats() {
    const total = STUDENTS_DATA.length;
    const present = attendanceData.filter(a => a.status === 'present').length;
    const late = attendanceData.filter(a => a.status === 'late').length;
    const absent = total - present - late;

    const totalElement = document.getElementById('totalStudents');
    const presentElement = document.getElementById('presentStudents');
    const lateElement = document.getElementById('lateStudents');
    const absentElement = document.getElementById('absentStudents');

    if (totalElement) totalElement.textContent = total;
    if (presentElement) presentElement.textContent = present;
    if (lateElement) lateElement.textContent = late;
    if (absentElement) absentElement.textContent = absent;
}

function startAttendanceSession() {
    sessionActive = true;
    showNotification('🎯 Attendance session started!', 'success');

    const sessionStatusElement = document.getElementById('sessionStatus');
    if (sessionStatusElement) {
        sessionStatusElement.innerHTML = '<i class="fas fa-circle"></i> Session Active';
    }

    setTimeout(() => {
        simulateInitialAttendance();
    }, 2000);
}

function simulateInitialAttendance() {
    const initialStudents = STUDENTS_DATA.slice(0, 3);
    const methods = ['qr', 'face', 'geo'];

    initialStudents.forEach((student, index) => {
        setTimeout(() => {
            const record = {
                studentId: student.id,
                status: 'present',
                time: new Date().toLocaleTimeString('en-US', {
                    hour12: true,
                    hour: 'numeric',
                    minute: '2-digit'
                }),
                method: methods[index % 3],
                confidence: Math.random() * 0.3 + 0.7
            };

            attendanceData.push(record);
            loadAttendanceTable();

            showNotification(`${student.name} checked in via ${record.method.toUpperCase()}`, 'success');
        }, index * 1000);
    });
}

function markAllPresent() {
    if (confirm('Mark all students as present for this session?')) {
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
                method: 'manual',
                confidence: 1.0
            });
        });

        loadAttendanceTable();
        showNotification(`${absentStudents.length} students marked as present!`, 'success');
    }
}

function markPresent(studentId) {
    const existingIndex = attendanceData.findIndex(a => a.studentId === studentId);

    if (existingIndex >= 0) {
        attendanceData[existingIndex].status = 'present';
        attendanceData[existingIndex].time = new Date().toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit'
        });
    } else {
        attendanceData.push({
            studentId: studentId,
            status: 'present',
            time: new Date().toLocaleTimeString('en-US', {
                hour12: true,
                hour: 'numeric',
                minute: '2-digit'
            }),
            method: 'manual',
            confidence: 1.0
        });
    }

    loadAttendanceTable();

    const student = STUDENTS_DATA.find(s => s.id === studentId);
    if (student) {
        showNotification(`${student.name} marked as present`, 'success');
    }
}

function markAbsent(studentId) {
    attendanceData = attendanceData.filter(a => a.studentId !== studentId);
    loadAttendanceTable();

    const student = STUDENTS_DATA.find(s => s.id === studentId);
    if (student) {
        showNotification(`${student.name} marked as absent`, 'warning');
    }
}

function toggleStatus(studentId) {
    const attendance = attendanceData.find(a => a.studentId === studentId);
    const student = STUDENTS_DATA.find(s => s.id === studentId);

    if (!attendance) {
        attendanceData.push({
            studentId: studentId,
            status: 'present',
            time: new Date().toLocaleTimeString('en-US', {
                hour12: true,
                hour: 'numeric',
                minute: '2-digit'
            }),
            method: 'manual',
            confidence: 1.0
        });
        if (student) showNotification(`${student.name} marked as present`, 'success');
    } else {
        if (attendance.status === 'present') {
            attendance.status = 'late';
            if (student) showNotification(`${student.name} marked as late`, 'warning');
        } else if (attendance.status === 'late') {
            attendanceData = attendanceData.filter(a => a.studentId !== studentId);
            if (student) showNotification(`${student.name} marked as absent`, 'error');
        } else {
            attendance.status = 'present';
            if (student) showNotification(`${student.name} marked as present`, 'success');
        }
    }

    loadAttendanceTable();
}

function openQRScanner() {
    const scannerOverlay = document.getElementById('scannerOverlay');
    if (scannerOverlay) {
        scannerOverlay.style.display = 'flex';
        showNotification('QR Scanner opened - Point camera at student QR codes', 'info');
    }
}

function closeScanners() {
    const scannerOverlay = document.getElementById('scannerOverlay');
    if (scannerOverlay) {
        scannerOverlay.style.display = 'none';
    }
}

function simulateQRScan() {
    const availableStudents = STUDENTS_DATA.filter(s =>
        !attendanceData.find(a => a.studentId === s.id)
    );

    if (availableStudents.length === 0) {
        showNotification('All students have already been marked!', 'warning');
        return;
    }

    const randomStudent = availableStudents[Math.floor(Math.random() * availableStudents.length)];

    const record = {
        studentId: randomStudent.id,
        status: Math.random() > 0.15 ? 'present' : 'late',
        time: new Date().toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit'
        }),
        method: 'qr',
        confidence: Math.random() * 0.2 + 0.8
    };

    attendanceData.push(record);
    loadAttendanceTable();

    showNotification(`✅ QR Scan: ${randomStudent.name} - ${record.status}`, 'success');

    setTimeout(() => {
        closeScanners();
    }, 2000);
}

function startFaceRecognition() {
    showNotification('🤖 Face recognition system activated...', 'info');

    setTimeout(() => {
        const availableStudents = STUDENTS_DATA.filter(s =>
            !attendanceData.find(a => a.studentId === s.id)
        );

        if (availableStudents.length > 0) {
            const randomStudent = availableStudents[Math.floor(Math.random() * availableStudents.length)];

            const record = {
                studentId: randomStudent.id,
                status: 'present',
                time: new Date().toLocaleTimeString('en-US', {
                    hour12: true,
                    hour: 'numeric',
                    minute: '2-digit'
                }),
                method: 'face',
                confidence: Math.random() * 0.25 + 0.75
            };

            attendanceData.push(record);
            loadAttendanceTable();

            showNotification(`🎭 Face Recognition: ${randomStudent.name} detected with ${Math.round(record.confidence * 100)}% confidence`, 'success');
        } else {
            showNotification('No new faces detected', 'warning');
        }
    }, 3000);
}

function enableGeoAttendance() {
    showNotification('📍 Geolocation attendance enabled. Students can check in from classroom location.', 'info');

    setTimeout(() => {
        const availableStudents = STUDENTS_DATA.filter(s =>
            !attendanceData.find(a => a.studentId === s.id)
        );

        if (availableStudents.length > 0) {
            const randomStudent = availableStudents[Math.floor(Math.random() * availableStudents.length)];

            const record = {
                studentId: randomStudent.id,
                status: 'present',
                time: new Date().toLocaleTimeString('en-US', {
                    hour12: true,
                    hour: 'numeric',
                    minute: '2-digit'
                }),
                method: 'geo',
                confidence: 0.95
            };

            attendanceData.push(record);
            loadAttendanceTable();

            showNotification(`📍 Geo Check-in: ${randomStudent.name} verified at classroom location`, 'success');
        }
    }, 2000);
}

function enableManualEntry() {
    document.querySelectorAll('.method-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }

    showNotification('✋ Manual entry mode enabled. Click on student status to mark attendance.', 'info');
}

function sendReminder() {
    const absentCount = STUDENTS_DATA.length - attendanceData.length;

    if (absentCount > 0) {
        showNotification(`📨 Attendance reminder sent to ${absentCount} students`, 'success');
    } else {
        showNotification('All students have already checked in!', 'info');
    }
}

function endSession() {
    if (confirm('End attendance session? No more check-ins will be allowed.')) {
        sessionActive = false;
        showNotification('🔚 Attendance session ended', 'warning');

        const sessionStatusElement = document.getElementById('sessionStatus');
        if (sessionStatusElement) {
            sessionStatusElement.innerHTML = '<i class="fas fa-stop-circle"></i> Session Ended';
            sessionStatusElement.style.color = 'var(--accent-red)';
        }
    }
}

function bulkMarkAttendance() {
    if (selectedStudents.length === 0) {
        showNotification('Please select students first', 'warning');
        return;
    }

    const action = confirm('Mark selected students as:\nOK = Present\nCancel = Absent');

    selectedStudents.forEach(studentId => {
        if (action) {
            markPresent(studentId);
        } else {
            markAbsent(studentId);
        }
    });

    selectedStudents = [];
    document.querySelectorAll('.student-checkbox').forEach(cb => cb.checked = false);
    const selectAllElement = document.getElementById('selectAll');
    if (selectAllElement) selectAllElement.checked = false;

    showNotification(`Bulk operation completed for ${selectedStudents.length} students`, 'success');
}

function exportAttendance() {
    showNotification('📊 Exporting attendance data...', 'info');

    setTimeout(() => {
        const attendanceDateElement = document.getElementById('attendanceDate');
        const sessionTimeElement = document.getElementById('sessionTime');

        const exportData = {
            class: 'CS101 - Data Structures',
            date: attendanceDateElement ? attendanceDateElement.value : new Date().toISOString().split('T')[0],
            session: sessionTimeElement ? sessionTimeElement.value : 'Morning',
            total: STUDENTS_DATA.length,
            present: attendanceData.filter(a => a.status === 'present').length,
            late: attendanceData.filter(a => a.status === 'late').length,
            absent: STUDENTS_DATA.length - attendanceData.length,
            students: attendanceData
        };

        console.log('Exported Data:', exportData);
        showNotification('✅ Attendance data exported successfully!', 'success');
    }, 2000);
}

function updateSelectedStudents() {
    selectedStudents = Array.from(document.querySelectorAll('.student-checkbox:checked'))
        .map(cb => cb.value);
}

function toggleSelectAll() {
    const selectAllElement = document.getElementById('selectAll');
    if (selectAllElement) {
        const selectAll = selectAllElement.checked;
        document.querySelectorAll('.student-checkbox').forEach(cb => {
            cb.checked = selectAll;
        });
        updateSelectedStudents();
    }
}

function changeClass() {
    const classSelectElement = document.getElementById('classSelect');
    if (classSelectElement) {
        const selectedClass = classSelectElement.value;
        const classNames = {
            cs101: 'CS101 - Data Structures',
            cs102: 'CS102 - Algorithms',
            cs103: 'CS103 - Database Systems'
        };

        const tableHeaderElement = document.querySelector('.table-header h3');
        if (tableHeaderElement) {
            tableHeaderElement.innerHTML =
                `<i class="fas fa-table"></i> Student Attendance - ${classNames[selectedClass]}`;
        }

        showNotification(`Switched to ${classNames[selectedClass]}`, 'info');

        attendanceData = [];
        loadAttendanceTable();
    }
}

function filterByDate() {
    const attendanceDateElement = document.getElementById('attendanceDate');
    if (attendanceDateElement) {
        const selectedDate = attendanceDateElement.value;
        showNotification(`Filtering attendance for ${new Date(selectedDate).toLocaleDateString()}`, 'info');
    }
}

function filterBySession() {
    const sessionTimeElement = document.getElementById('sessionTime');
    if (sessionTimeElement) {
        const selectedSession = sessionTimeElement.value;
        showNotification(`Filtering by ${selectedSession} session`, 'info');
    }
}

function filterByStatus() {
    const statusFilterElement = document.getElementById('statusFilter');
    if (statusFilterElement) {
        const filter = statusFilterElement.value;
        const rows = document.querySelectorAll('#attendanceTableBody tr');

        rows.forEach(row => {
            const statusBadge = row.querySelector('.status-badge');
            if (statusBadge) {
                const status = statusBadge.textContent.toLowerCase().trim();

                if (filter === 'all' || status === filter) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });

        showNotification(`Filtered by ${filter} status`, 'info');
    }
}

function refreshTable() {
    loadAttendanceTable();
    showNotification('🔄 Table refreshed', 'info');
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
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, 4000);
}

// Auto-generate realistic attendance data periodically - PRESERVED
setInterval(() => {
    if (sessionActive && Math.random() > 0.85) {
        const availableStudents = STUDENTS_DATA.filter(s =>
            !attendanceData.find(a => a.studentId === s.id)
        );

        if (availableStudents.length > 0) {
            const methods = ['qr', 'face', 'geo'];
            const randomStudent = availableStudents[Math.floor(Math.random() * availableStudents.length)];
            const randomMethod = methods[Math.floor(Math.random() * methods.length)];

            const record = {
                studentId: randomStudent.id,
                status: Math.random() > 0.1 ? 'present' : 'late',
                time: new Date().toLocaleTimeString('en-US', {
                    hour12: true,
                    hour: 'numeric',
                    minute: '2-digit'
                }),
                method: randomMethod,
                confidence: Math.random() * 0.3 + 0.7
            };

            attendanceData.push(record);
            loadAttendanceTable();

            showNotification(`${randomStudent.name} auto-checked in via ${randomMethod.toUpperCase()}`, 'success');
        }
    }
}, 10000);

// Handle click outside sidebar on mobile - PRESERVED
document.addEventListener('click', function (e) {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    if (window.innerWidth <= 768 &&
        sidebar && sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) &&
        mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
        closeMobileSidebar();
    }
});
