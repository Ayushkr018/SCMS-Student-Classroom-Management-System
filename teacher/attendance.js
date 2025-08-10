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

let attendanceData = [];
let sessionActive = false;
let selectedStudents = [];

// Load current user and initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    loadAttendanceTable();
    updateStats();
    
    // Set today's date
    document.getElementById('attendanceDate').value = new Date().toISOString().split('T')[0];
    
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

function loadAttendanceTable() {
    const tbody = document.getElementById('attendanceTableBody');
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

    document.getElementById('totalStudents').textContent = total;
    document.getElementById('presentStudents').textContent = present;
    document.getElementById('lateStudents').textContent = late;
    document.getElementById('absentStudents').textContent = absent;
}

function startAttendanceSession() {
    sessionActive = true;
    showNotification('🎯 Attendance session started!', 'success');
    
    // Update UI to show session is active
    document.getElementById('sessionStatus').innerHTML = 
        '<i class="fas fa-circle"></i> Session Active';
    
    // Auto-generate some attendance after starting
    setTimeout(() => {
        simulateInitialAttendance();
    }, 2000);
}

function simulateInitialAttendance() {
    // Mark a few students as present initially
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
    showNotification(`${student.name} marked as present`, 'success');
}

function markAbsent(studentId) {
    attendanceData = attendanceData.filter(a => a.studentId !== studentId);
    loadAttendanceTable();
    
    const student = STUDENTS_DATA.find(s => s.id === studentId);
    showNotification(`${student.name} marked as absent`, 'warning');
}

function toggleStatus(studentId) {
    const attendance = attendanceData.find(a => a.studentId === studentId);
    const student = STUDENTS_DATA.find(s => s.id === studentId);
    
    if (!attendance) {
        // Mark as present
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
        showNotification(`${student.name} marked as present`, 'success');
    } else {
        // Cycle through statuses
        if (attendance.status === 'present') {
            attendance.status = 'late';
            showNotification(`${student.name} marked as late`, 'warning');
        } else if (attendance.status === 'late') {
            attendanceData = attendanceData.filter(a => a.studentId !== studentId);
            showNotification(`${student.name} marked as absent`, 'error');
        } else {
            attendance.status = 'present';
            showNotification(`${student.name} marked as present`, 'success');
        }
    }
    
    loadAttendanceTable();
}

function openQRScanner() {
    document.getElementById('scannerOverlay').style.display = 'flex';
    showNotification('QR Scanner opened - Point camera at student QR codes', 'info');
}

function closeScanners() {
    document.getElementById('scannerOverlay').style.display = 'none';
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
    
    // Auto-close scanner after successful scan
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
    
    // Simulate geo check-in after enabling
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
    event.target.classList.add('active');
    
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
        
        // Update UI
        document.getElementById('sessionStatus').innerHTML = 
            '<i class="fas fa-stop-circle"></i> Session Ended';
        document.getElementById('sessionStatus').style.color = 'var(--accent-red)';
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
    
    // Clear selections
    selectedStudents = [];
    document.querySelectorAll('.student-checkbox').forEach(cb => cb.checked = false);
    document.getElementById('selectAll').checked = false;
    
    showNotification(`Bulk operation completed for ${selectedStudents.length} students`, 'success');
}

function exportAttendance() {
    showNotification('📊 Exporting attendance data...', 'info');
    
    setTimeout(() => {
        const exportData = {
            class: 'CS101 - Data Structures',
            date: document.getElementById('attendanceDate').value,
            session: document.getElementById('sessionTime').value,
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
    const selectAll = document.getElementById('selectAll').checked;
    document.querySelectorAll('.student-checkbox').forEach(cb => {
        cb.checked = selectAll;
    });
    updateSelectedStudents();
}

function changeClass() {
    const selectedClass = document.getElementById('classSelect').value;
    const classNames = {
        cs101: 'CS101 - Data Structures',
        cs102: 'CS102 - Algorithms', 
        cs103: 'CS103 - Database Systems'
    };
    
    document.querySelector('.table-header h3').innerHTML = 
        `<i class="fas fa-table"></i> Student Attendance - ${classNames[selectedClass]}`;
    
    showNotification(`Switched to ${classNames[selectedClass]}`, 'info');
    
    // Reset attendance for new class
    attendanceData = [];
    loadAttendanceTable();
}

function filterByDate() {
    const selectedDate = document.getElementById('attendanceDate').value;
    showNotification(`Filtering attendance for ${new Date(selectedDate).toLocaleDateString()}`, 'info');
}

function filterBySession() {
    const selectedSession = document.getElementById('sessionTime').value;
    showNotification(`Filtering by ${selectedSession} session`, 'info');
}

function filterByStatus() {
    const filter = document.getElementById('statusFilter').value;
    const rows = document.querySelectorAll('#attendanceTableBody tr');
    
    rows.forEach(row => {
        const statusBadge = row.querySelector('.status-badge');
        const status = statusBadge.textContent.toLowerCase().trim();
        
        if (filter === 'all' || status === filter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    showNotification(`Filtered by ${filter} status`, 'info');
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
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// Auto-generate realistic attendance data periodically
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
