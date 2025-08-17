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

// Enhanced Student Data
const STUDENTS_DATA = [
    { id: 'st001', name: 'Raj Kumar', rollNo: 'CS001', avatar: 'RK', email: 'raj.kumar@student.edu', performance: 85 },
    { id: 'st002', name: 'Priya Sharma', rollNo: 'CS002', avatar: 'PS', email: 'priya.sharma@student.edu', performance: 92 },
    { id: 'st003', name: 'Arjun Patel', rollNo: 'CS003', avatar: 'AP', email: 'arjun.patel@student.edu', performance: 78 },
    { id: 'st004', name: 'Sneha Gupta', rollNo: 'CS004', avatar: 'SG', email: 'sneha.gupta@student.edu', performance: 88 },
    { id: 'st005', name: 'Vikram Singh', rollNo: 'CS005', avatar: 'VS', email: 'vikram.singh@student.edu', performance: 91 },
    { id: 'st006', name: 'Anita Rao', rollNo: 'CS006', avatar: 'AR', email: 'anita.rao@student.edu', performance: 87 },
    { id: 'st007', name: 'Rohit Mehta', rollNo: 'CS007', avatar: 'RM', email: 'rohit.mehta@student.edu', performance: 83 },
    { id: 'st008', name: 'Kavya Nair', rollNo: 'CS008', avatar: 'KN', email: 'kavya.nair@student.edu', performance: 95 },
    { id: 'st009', name: 'Aditya Kumar', rollNo: 'CS009', avatar: 'AK', email: 'aditya.kumar@student.edu', performance: 89 },
    { id: 'st010', name: 'Riya Agarwal', rollNo: 'CS010', avatar: 'RA', email: 'riya.agarwal@student.edu', performance: 86 }
];

// Global Variables
let attendanceData = [];
let sessionActive = false;
let selectedStudents = [];
let scannerStream = null;
let faceDetectionActive = false;
let geoWatchId = null;

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    loadAttendanceTable();
    updateStats();
    
    // Set today's date
    const dateInput = document.getElementById('attendanceDate');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Close mobile sidebar on resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    });
});

// User Management
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

    const userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = user.name;
    
    const userDeptEl = document.getElementById('userDept');
    if (user.department && userDeptEl) {
        userDeptEl.textContent = user.department.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
}

function logout() {
    localStorage.removeItem('scms_current_user');
    showNotification('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
}

// Attendance Table Management
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

    const totalEl = document.getElementById('totalStudents');
    if (totalEl) totalEl.textContent = total;
    
    const presentEl = document.getElementById('presentStudents');
    if (presentEl) presentEl.textContent = present;
    
    const lateEl = document.getElementById('lateStudents');
    if (lateEl) lateEl.textContent = late;
    
    const absentEl = document.getElementById('absentStudents');
    if (absentEl) absentEl.textContent = absent;
}

// Session Management
function startAttendanceSession() {
    sessionActive = true;
    showNotification('🎯 Attendance session started!', 'success');
    
    const statusEl = document.getElementById('sessionStatus');
    if (statusEl) {
        statusEl.innerHTML = '<i class="fas fa-circle"></i> Session Active';
        statusEl.style.color = 'var(--accent-green)';
    }
    
    setTimeout(simulateInitialAttendance, 2000);
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

function endSession() {
    if (confirm('End attendance session? No more check-ins will be allowed.')) {
        sessionActive = false;
        stopAllScanners();
        
        showNotification('🔚 Attendance session ended', 'warning');
        
        const statusEl = document.getElementById('sessionStatus');
        if (statusEl) {
            statusEl.innerHTML = '<i class="fas fa-stop-circle"></i> Session Ended';
            statusEl.style.color = 'var(--accent-red)';
        }
    }
}

// Manual Attendance Functions
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

// QR Scanner Functions
function openQRScanner() {
    const overlay = document.getElementById('scannerOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        showNotification('📱 QR Scanner opened - Point camera at student QR codes', 'info');
        initializeQRCamera();
    }
}

function initializeQRCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 640 },
                height: { ideal: 480 }
            } 
        })
        .then(function(stream) {
            scannerStream = stream;
            const video = document.getElementById('qrVideo');
            if (video) {
                video.srcObject = stream;
                video.play();
            }
            
            // Start QR detection simulation
            setTimeout(() => {
                if (scannerStream) {
                    simulateQRScan();
                }
            }, 3000);
        })
        .catch(function(error) {
            console.error('Camera access denied:', error);
            showNotification('Camera access required for QR scanning', 'error');
            simulateQRScan(); // Fallback to simulation
        });
    } else {
        showNotification('Camera not supported, using simulation', 'warning');
        simulateQRScan();
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
    
    // Auto-close scanner after successful scan
    setTimeout(() => {
        closeScanners();
    }, 2000);
}

function closeScanners() {
    const overlay = document.getElementById('scannerOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
    
    // Stop camera stream
    if (scannerStream) {
        scannerStream.getTracks().forEach(track => track.stop());
        scannerStream = null;
    }
    
    // Stop face detection
    faceDetectionActive = false;
    
    // Stop geolocation watching
    if (geoWatchId) {
        navigator.geolocation.clearWatch(geoWatchId);
        geoWatchId = null;
    }
}

// Face Recognition Functions
function startFaceRecognition() {
    faceDetectionActive = true;
    showNotification('🤖 Face recognition system activated...', 'info');
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            const video = document.getElementById('faceVideo');
            if (video) {
                video.srcObject = stream;
                video.play();
            }
            
            // Simulate face detection after delay
            setTimeout(() => {
                if (faceDetectionActive) {
                    processFaceDetection();
                }
            }, 3000);
        })
        .catch(function(error) {
            console.error('Camera access denied:', error);
            processFaceDetection(); // Fallback to simulation
        });
    } else {
        processFaceDetection(); // Fallback to simulation
    }
}

function processFaceDetection() {
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
}

// Geolocation Functions
function enableGeoAttendance() {
    showNotification('📍 Geolocation attendance enabled. Students can check in from classroom location.', 'info');
    
    if (navigator.geolocation) {
        geoWatchId = navigator.geolocation.watchPosition(
            function(position) {
                processGeolocationCheckin(position);
            },
            function(error) {
                console.error('Geolocation error:', error);
                simulateGeolocationCheckin(); // Fallback to simulation
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    } else {
        showNotification('Geolocation not supported, using simulation', 'warning');
        simulateGeolocationCheckin();
    }
}

function simulateGeolocationCheckin() {
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

function processGeolocationCheckin(position) {
    // Simulate checking if student is within classroom radius
    const classroomLat = 28.6139; // Example: Delhi coordinates
    const classroomLng = 77.2090;
    const maxDistance = 100; // meters
    
    // In real implementation, calculate distance between position and classroom
    simulateGeolocationCheckin();
}

// Utility Functions
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
    const selectAll = document.getElementById('selectAll');
    if (selectAll) selectAll.checked = false;
    
    showNotification(`Bulk operation completed for ${selectedStudents.length} students`, 'success');
}

function exportAttendance() {
    showNotification('📊 Exporting attendance data...', 'info');
    
    setTimeout(() => {
        const exportData = {
            class: 'CS101 - Data Structures',
            date: document.getElementById('attendanceDate')?.value || new Date().toISOString().split('T')[0],
            session: document.getElementById('sessionTime')?.value || 'Morning',
            total: STUDENTS_DATA.length,
            present: attendanceData.filter(a => a.status === 'present').length,
            late: attendanceData.filter(a => a.status === 'late').length,
            absent: STUDENTS_DATA.length - attendanceData.length,
            students: attendanceData
        };
        
        // Generate CSV content
        const csvContent = generateCSV(exportData);
        downloadCSV(csvContent, `attendance-${exportData.date}.csv`);
        
        showNotification('✅ Attendance data exported successfully!', 'success');
    }, 2000);
}

function generateCSV(data) {
    let csv = 'Student Name,Roll Number,Status,Check-in Time,Method,Confidence\n';
    
    STUDENTS_DATA.forEach(student => {
        const attendance = attendanceData.find(a => a.studentId === student.id);
        const status = attendance ? attendance.status : 'absent';
        const time = attendance ? attendance.time : '-';
        const method = attendance ? attendance.method : '-';
        const confidence = attendance ? Math.round(attendance.confidence * 100) + '%' : '0%';
        
        csv += `"${student.name}","${student.rollNo}","${status}","${time}","${method}","${confidence}"\n`;
    });
    
    return csv;
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function updateSelectedStudents() {
    selectedStudents = Array.from(document.querySelectorAll('.student-checkbox:checked'))
        .map(cb => cb.value);
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    if (!selectAll) return;
    
    const checked = selectAll.checked;
    document.querySelectorAll('.student-checkbox').forEach(cb => {
        cb.checked = checked;
    });
    updateSelectedStudents();
}

// Filter Functions
function changeClass() {
    const selectedClass = document.getElementById('classSelect')?.value;
    const classNames = {
        cs101: 'CS101 - Data Structures',
        cs102: 'CS102 - Algorithms', 
        cs103: 'CS103 - Database Systems'
    };
    
    const headerEl = document.querySelector('.table-header h3');
    if (headerEl && classNames[selectedClass]) {
        headerEl.innerHTML = `<i class="fas fa-table"></i> Student Attendance - ${classNames[selectedClass]}`;
    }
    
    showNotification(`Switched to ${classNames[selectedClass] || 'selected class'}`, 'info');
    
    // Reset attendance for new class
    attendanceData = [];
    loadAttendanceTable();
}

function filterByDate() {
    const selectedDate = document.getElementById('attendanceDate')?.value;
    if (selectedDate) {
        showNotification(`Filtering attendance for ${new Date(selectedDate).toLocaleDateString()}`, 'info');
    }
}

function filterBySession() {
    const selectedSession = document.getElementById('sessionTime')?.value;
    if (selectedSession) {
        showNotification(`Filtering by ${selectedSession} session`, 'info');
    }
}

function filterByStatus() {
    const filter = document.getElementById('statusFilter')?.value || 'all';
    const rows = document.querySelectorAll('#attendanceTableBody tr');
    
    rows.forEach(row => {
        const statusBadge = row.querySelector('.status-badge');
        if (!statusBadge) return;
        
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

function stopAllScanners() {
    closeScanners();
    faceDetectionActive = false;
    
    if (geoWatchId) {
        navigator.geolocation.clearWatch(geoWatchId);
        geoWatchId = null;
    }
}

// Enhanced Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type} show`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };

    notification.innerHTML = `
        <i class="notification-icon ${icons[type]}"></i>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
        <div class="notification-progress"></div>
    `;

    document.body.appendChild(notification);

    // Auto remove after delay
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 400);
        }
    }, 5000);
}

// Auto-generate realistic attendance data periodically
setInterval(() => {
    if (sessionActive && Math.random() > 0.88) {
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
}, 12000); // Every 12 seconds

// Click outside sidebar handler
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

// Initialize everything when script loads
console.log('🎓 SCMS Attendance System loaded successfully!');
