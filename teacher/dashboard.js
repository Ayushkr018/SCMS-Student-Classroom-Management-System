// Dashboard JavaScript - Complete Interactive Teaching System with Analytics

// Global Variables & Configuration
let currentUser = {};
let attendanceData = [];
let currentClass = 'cs101';
let activePoll = null;
let liveSession = null;
let realTimeUpdates = null;
let classTimer = null;
let weatherData = null;
let analyticsModal = null;
let systemStats = {
    studentsOnline: 42,
    activeClasses: 2,
    engagementRate: 94
};

// Enhanced Mock Data for Students
const STUDENTS_DATA = [
    { id: 'st001', name: 'Raj Kumar', rollNo: 'CS001', avatar: 'RK', email: 'raj.kumar@student.scms.edu', performance: 85 },
    { id: 'st002', name: 'Priya Sharma', rollNo: 'CS002', avatar: 'PS', email: 'priya.sharma@student.scms.edu', performance: 92 },
    { id: 'st003', name: 'Arjun Patel', rollNo: 'CS003', avatar: 'AP', email: 'arjun.patel@student.scms.edu', performance: 78 },
    { id: 'st004', name: 'Sneha Gupta', rollNo: 'CS004', avatar: 'SG', email: 'sneha.gupta@student.scms.edu', performance: 88 },
    { id: 'st005', name: 'Vikram Singh', rollNo: 'CS005', avatar: 'VS', email: 'vikram.singh@student.scms.edu', performance: 91 },
    { id: 'st006', name: 'Anita Rao', rollNo: 'CS006', avatar: 'AR', email: 'anita.rao@student.scms.edu', performance: 87 },
    { id: 'st007', name: 'Rohit Mehta', rollNo: 'CS007', avatar: 'RM', email: 'rohit.mehta@student.scms.edu', performance: 83 },
    { id: 'st008', name: 'Kavya Nair', rollNo: 'CS008', avatar: 'KN', email: 'kavya.nair@student.scms.edu', performance: 95 },
    { id: 'st009', name: 'Dev Sharma', rollNo: 'CS009', avatar: 'DS', email: 'dev.sharma@student.scms.edu', performance: 89 },
    { id: 'st010', name: 'Maya Singh', rollNo: 'CS010', avatar: 'MS', email: 'maya.singh@student.scms.edu', performance: 86 }
];

// Class Schedule Data
const CLASS_SCHEDULE = {
    'cs101': { 
        name: 'CS101 - Data Structures', 
        room: 'Room 201', 
        students: 45, 
        time: '10:00 - 11:30 AM',
        status: 'live',
        duration: 90
    },
    'cs102': { 
        name: 'CS102 - Algorithms', 
        room: 'Room 203', 
        students: 38, 
        time: '2:00 - 3:30 PM',
        status: 'scheduled',
        duration: 90
    },
    'cs103': { 
        name: 'CS103 - Database Systems', 
        room: 'Room 205', 
        students: 42, 
        time: '9:00 - 10:00 AM',
        status: 'completed',
        duration: 60
    },
    'cs104': { 
        name: 'CS104 - Web Development', 
        room: 'Lab 301', 
        students: 28, 
        time: '4:00 - 5:30 PM',
        status: 'scheduled',
        duration: 90
    }
};

// Analytics Data
const ANALYTICS_DATA = {
    attendance: {
        weekly: [85, 92, 88, 95, 87, 90, 93],
        monthly: [88, 91, 85, 89, 92, 87, 94, 90, 86, 88, 91, 89],
        byClass: {
            'CS101': 91,
            'CS102': 88,
            'CS103': 95,
            'CS104': 86
        }
    },
    performance: {
        distribution: [12, 25, 35, 20, 8], // Grades A, B, C, D, F
        trending: [82, 85, 88, 87, 90, 89, 92],
        bySubject: {
            'Data Structures': 89,
            'Algorithms': 87,
            'Database': 92,
            'Web Dev': 85
        }
    },
    engagement: {
        participation: [78, 82, 85, 88, 90, 87, 89],
        pollResponses: [65, 70, 75, 82, 78, 85, 88],
        questionFrequency: [15, 18, 22, 20, 25, 23, 28]
    },
    timeAnalysis: {
        peakHours: [
            { hour: '9 AM', engagement: 85 },
            { hour: '10 AM', engagement: 92 },
            { hour: '11 AM', engagement: 88 },
            { hour: '2 PM', engagement: 78 },
            { hour: '3 PM', engagement: 82 },
            { hour: '4 PM', engagement: 75 }
        ],
        classProgress: {
            'Week 1': 75,
            'Week 2': 82,
            'Week 3': 88,
            'Week 4': 91,
            'Week 5': 89,
            'Week 6': 93
        }
    }
};

// Activity Feed Data
let activityFeed = [
    { type: 'attendance', message: 'Sarah Johnson marked attendance for CS101', time: 2, icon: 'user-check', color: 'success' },
    { type: 'assignment', message: 'Assignment uploaded: Data Structures Lab 3', time: 15, icon: 'upload', color: 'info' },
    { type: 'request', message: 'Mike Chen requested attendance modification', time: 60, icon: 'exclamation-circle', color: 'warning' },
    { type: 'message', message: '3 new messages in CS102 discussion', time: 120, icon: 'comments', color: 'primary' }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 SCMS Dashboard Loading...');
    
    // Core Initialization
    initializeTheme();
    loadCurrentUser();
    initializeLiveTime();
    
    // Dashboard Components
    loadAttendanceTable();
    initializeClassSchedule();
    startRealTimeUpdates();
    initializeActivityFeed();
    
    // Event Listeners
    setupEventListeners();
    
    // Auto-refresh intervals
    setInterval(updateLiveTime, 1000);
    setInterval(updateLiveStats, 30000);
    setInterval(refreshActivityFeed, 60000);
    
    // Demo data after short delay
    setTimeout(loadDemoData, 2000);
    
    console.log('✅ Dashboard Ready!');
    showNotification('Welcome to SCMS Dashboard! 🎓', 'success');
});

// Theme Management - Enhanced & Consistent
function initializeTheme() {
    try {
        const savedTheme = localStorage.getItem('theme') || localStorage.getItem('scms-theme') || 'light';
        const themeIcon = document.getElementById('themeIcon');
        const mobileThemeIcon = document.getElementById('mobileThemeIcon');
        const themeLabel = document.getElementById('themeLabel');
        const themeSwitch = document.getElementById('themeSwitch');
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (savedTheme === 'dark') {
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-sun';
            if (themeLabel) themeLabel.textContent = 'Light Mode';
            if (themeSwitch) themeSwitch.classList.add('active');
        } else {
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-moon';
            if (themeLabel) themeLabel.textContent = 'Dark Mode';
            if (themeSwitch) themeSwitch.classList.remove('active');
        }
        
        console.log('🎨 Theme initialized:', savedTheme);
    } catch (error) {
        console.error('❌ Theme initialization error:', error);
    }
}

function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        const themeIcon = document.getElementById('themeIcon');
        const mobileThemeIcon = document.getElementById('mobileThemeIcon');
        const themeLabel = document.getElementById('themeLabel');
        const themeSwitch = document.getElementById('themeSwitch');
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        localStorage.setItem('scms-theme', newTheme);
        
        if (newTheme === 'dark') {
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-sun';
            if (themeLabel) themeLabel.textContent = 'Light Mode';
            if (themeSwitch) themeSwitch.classList.add('active');
        } else {
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-moon';
            if (themeLabel) themeLabel.textContent = 'Dark Mode';
            if (themeSwitch) themeSwitch.classList.remove('active');
        }
        
        showNotification(`Switched to ${newTheme} mode`, 'info');
        console.log('🎨 Theme toggled to:', newTheme);
    } catch (error) {
        console.error('❌ Theme toggle error:', error);
    }
}

// Mobile Sidebar Management - Enhanced
function toggleMobileSidebar() {
    try {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            console.log('📱 Mobile sidebar opened');
        }
    } catch (error) {
        console.error('❌ Error toggling mobile sidebar:', error);
    }
}

function closeMobileSidebar() {
    try {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            console.log('📱 Mobile sidebar closed');
        }
    } catch (error) {
        console.error('❌ Error closing mobile sidebar:', error);
    }
}

// User Management - Enhanced
function loadCurrentUser() {
    try {
        const userData = localStorage.getItem('scms_current_user') || localStorage.getItem('currentUser');
        
        if (!userData) {
            console.warn('⚠️ No user data found, redirecting...');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
            return;
        }

        currentUser = JSON.parse(userData);
        
        if (currentUser.role !== 'teacher') {
            showNotification('Access denied. Teacher privileges required.', 'error');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 3000);
            return;
        }

        // Update UI with user info
        const userNameEl = document.getElementById('userName');
        const headerUserNameEl = document.getElementById('headerUserName');
        const userDeptEl = document.getElementById('userDept');
        const userStatusEl = document.getElementById('userStatus');
        
        if (userNameEl) userNameEl.textContent = currentUser.name || 'Dr. John Doe';
        if (headerUserNameEl) {
            const firstName = (currentUser.name || 'Dr. John Doe').split(' ')[0];
            headerUserNameEl.textContent = firstName;
        }
        if (userDeptEl && currentUser.department) {
            userDeptEl.textContent = currentUser.department
                .replace('_', ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
        }
        if (userStatusEl) {
            userStatusEl.className = 'user-status online';
            userStatusEl.innerHTML = '<i class="fas fa-circle"></i> Online';
        }

        // Update greeting based on time
        updateGreeting();
        
        console.log('👤 User loaded:', currentUser.name);
    } catch (error) {
        console.error('❌ Error loading user:', error);
        showNotification('Error loading user data', 'error');
    }
}

function updateGreeting() {
    try {
        const hour = new Date().getHours();
        const greetingEl = document.getElementById('headerGreeting');
        let greeting = 'Ready to inspire minds today? Your classes await!';
        
        if (hour < 12) {
            greeting = 'Good morning! Ready to start an inspiring day of teaching?';
        } else if (hour < 17) {
            greeting = 'Good afternoon! Your students are eager to learn!';
        } else {
            greeting = 'Good evening! Time for some productive teaching sessions!';
        }
        
        if (greetingEl) greetingEl.textContent = greeting;
    } catch (error) {
        console.error('❌ Error updating greeting:', error);
    }
}

function logout() {
    try {
        const confirmLogout = confirm('Are you sure you want to logout?');
        if (!confirmLogout) return;
        
        // Clear user data
        localStorage.removeItem('scms_current_user');
        localStorage.removeItem('currentUser');
        
        showNotification('Logging out...', 'info');
        
        // Stop all intervals
        if (realTimeUpdates) clearInterval(realTimeUpdates);
        if (classTimer) clearInterval(classTimer);
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
        
        console.log('👋 User logged out');
    } catch (error) {
        console.error('❌ Logout error:', error);
        showNotification('Logout failed', 'error');
    }
}

// Live Time Management - Enhanced
function initializeLiveTime() {
    try {
        updateLiveTime();
    } catch (error) {
        console.error('❌ Error initializing live time:', error);
    }
}

function updateLiveTime() {
    try {
        const now = new Date();
        
        // Update live date time
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
        
        const liveDateTime = document.getElementById('liveDateTime');
        if (liveDateTime) liveDateTime.textContent = dateTimeString;
        
    } catch (error) {
        console.error('❌ Error updating live time:', error);
    }
}

// Live Stats Management
function updateLiveStats() {
    try {
        // Simulate dynamic stats
        systemStats.studentsOnline = Math.floor(Math.random() * 10) + 40; // 40-50
        systemStats.activeClasses = Math.floor(Math.random() * 3) + 1; // 1-3
        systemStats.engagementRate = Math.floor(Math.random() * 10) + 90; // 90-99%
        
        console.log('📊 Live stats updated');
    } catch (error) {
        console.error('❌ Error updating live stats:', error);
    }
}

// Class Schedule Management
function initializeClassSchedule() {
    try {
        const classList = document.getElementById('classList');
        if (!classList) return;
        
        // Class schedule is already in HTML, just add interactivity
        const classItems = document.querySelectorAll('.class-item');
        classItems.forEach(item => {
            item.addEventListener('click', function() {
                selectClass(this.getAttribute('data-class'));
            });
        });
        
        console.log('📅 Class schedule initialized');
    } catch (error) {
        console.error('❌ Error initializing class schedule:', error);
    }
}

function selectClass(classId) {
    try {
        // Remove active class from all items
        document.querySelectorAll('.class-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active to selected class
        const selectedItem = document.querySelector(`[data-class="${classId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
        
        currentClass = classId;
        
        // Update attendance table header
        const scheduleData = CLASS_SCHEDULE[classId];
        if (scheduleData) {
            const headerEl = document.querySelector('.card-header h3');
            if (headerEl) {
                headerEl.innerHTML = `<i class="fas fa-user-check"></i> Quick Attendance - ${scheduleData.name}`;
            }
        }
        
        // Reload attendance for selected class
        updateAttendanceStats();
        
        showNotification(`Selected ${scheduleData?.name || 'class'}`, 'info');
        console.log('📚 Class selected:', classId);
    } catch (error) {
        console.error('❌ Error selecting class:', error);
    }
}

// Quick Action Functions - Enhanced
function shareResource() {
    try {
        showNotification('Opening resource sharing...', 'info');
        setTimeout(() => {
            showNotification('📤 Resource sharing interface would open with file upload and distribution options', 'info');
        }, 1500);
    } catch (error) {
        console.error('❌ Error sharing resource:', error);
    }
}

function sendAnnouncement() {
    try {
        const message = prompt('Enter your announcement:');
        if (message && message.trim()) {
            showNotification('📢 Announcement sent to all students!', 'success');
            addToActivityFeed('announcement', `Announcement sent: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`, 0, 'bullhorn', 'warning');
        }
    } catch (error) {
        console.error('❌ Error sending announcement:', error);
    }
}

// ENHANCED ANALYTICS FUNCTION - Visual Implementation
function viewAnalytics() {
    try {
        showNotification('Loading comprehensive analytics...', 'info');
        setTimeout(() => {
            createAnalyticsModal();
        }, 1000);
    } catch (error) {
        console.error('❌ Error viewing analytics:', error);
    }
}

function createAnalyticsModal() {
    try {
        // Remove existing modal if present
        if (analyticsModal) {
            analyticsModal.remove();
        }
        
        // Create modal overlay
        analyticsModal = document.createElement('div');
        analyticsModal.className = 'analytics-modal-overlay';
        analyticsModal.innerHTML = `
            <div class="analytics-modal">
                <div class="analytics-header">
                    <h2><i class="fas fa-chart-line"></i> Comprehensive Analytics Dashboard</h2>
                    <button class="close-analytics-btn" onclick="closeAnalyticsModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="analytics-tabs">
                    <button class="analytics-tab active" onclick="switchAnalyticsTab('attendance')">
                        <i class="fas fa-user-check"></i> Attendance
                    </button>
                    <button class="analytics-tab" onclick="switchAnalyticsTab('performance')">
                        <i class="fas fa-chart-bar"></i> Performance
                    </button>
                    <button class="analytics-tab" onclick="switchAnalyticsTab('engagement')">
                        <i class="fas fa-heart"></i> Engagement
                    </button>
                    <button class="analytics-tab" onclick="switchAnalyticsTab('trends')">
                        <i class="fas fa-trending-up"></i> Trends
                    </button>
                </div>
                
                <div class="analytics-content">
                    <div id="attendance-analytics" class="analytics-panel active">
                        ${createAttendanceAnalytics()}
                    </div>
                    
                    <div id="performance-analytics" class="analytics-panel">
                        ${createPerformanceAnalytics()}
                    </div>
                    
                    <div id="engagement-analytics" class="analytics-panel">
                        ${createEngagementAnalytics()}
                    </div>
                    
                    <div id="trends-analytics" class="analytics-panel">
                        ${createTrendsAnalytics()}
                    </div>
                </div>
                
                <div class="analytics-footer">
                    <button class="btn btn-primary" onclick="exportAnalyticsReport()">
                        <i class="fas fa-download"></i> Export Report
                    </button>
                    <button class="btn btn-secondary" onclick="closeAnalyticsModal()">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
        
        // Add modal styles
        if (!document.getElementById('analytics-styles')) {
            const styles = document.createElement('style');
            styles.id = 'analytics-styles';
            styles.textContent = getAnalyticsStyles();
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(analyticsModal);
        
        // Show modal with animation
        requestAnimationFrame(() => {
            analyticsModal.classList.add('show');
        });
        
        // Initialize charts
        setTimeout(() => {
            initializeAttendanceCharts();
        }, 300);
        
        console.log('📊 Analytics modal created');
    } catch (error) {
        console.error('❌ Error creating analytics modal:', error);
    }
}

function createAttendanceAnalytics() {
    return `
        <div class="analytics-grid">
            <div class="analytics-card">
                <h3><i class="fas fa-calendar-week"></i> Weekly Attendance Trend</h3>
                <div class="chart-container">
                    <canvas id="weeklyAttendanceChart" width="400" height="200"></canvas>
                </div>
                <div class="chart-stats">
                    <div class="stat-item">
                        <span class="stat-label">Average:</span>
                        <span class="stat-value">90.1%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Trend:</span>
                        <span class="stat-value positive">↗ +2.3%</span>
                    </div>
                </div>
            </div>
            
            <div class="analytics-card">
                <h3><i class="fas fa-graduation-cap"></i> Class-wise Attendance</h3>
                <div class="class-attendance-bars">
                    ${Object.entries(ANALYTICS_DATA.attendance.byClass).map(([className, percentage]) => `
                        <div class="attendance-bar-item">
                            <div class="attendance-bar-label">${className}</div>
                            <div class="attendance-bar">
                                <div class="attendance-bar-fill" style="width: ${percentage}%"></div>
                                <span class="attendance-percentage">${percentage}%</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="analytics-card">
                <h3><i class="fas fa-clock"></i> Peak Attendance Hours</h3>
                <div class="peak-hours-chart">
                    ${ANALYTICS_DATA.timeAnalysis.peakHours.map(hour => `
                        <div class="peak-hour-item">
                            <div class="peak-hour-time">${hour.hour}</div>
                            <div class="peak-hour-bar">
                                <div class="peak-hour-fill" style="height: ${hour.engagement}%"></div>
                            </div>
                            <div class="peak-hour-value">${hour.engagement}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="analytics-card">
                <h3><i class="fas fa-users"></i> Student Attendance Distribution</h3>
                <div class="attendance-distribution">
                    <div class="distribution-item excellent">
                        <div class="distribution-color"></div>
                        <span>95-100%: 12 students</span>
                    </div>
                    <div class="distribution-item good">
                        <div class="distribution-color"></div>
                        <span>85-94%: 18 students</span>
                    </div>
                    <div class="distribution-item average">
                        <div class="distribution-color"></div>
                        <span>75-84%: 8 students</span>
                    </div>
                    <div class="distribution-item poor">
                        <div class="distribution-color"></div>
                        <span>Below 75%: 2 students</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createPerformanceAnalytics() {
    return `
        <div class="analytics-grid">
            <div class="analytics-card">
                <h3><i class="fas fa-chart-pie"></i> Grade Distribution</h3>
                <div class="grade-distribution">
                    <div class="grade-chart">
                        ${ANALYTICS_DATA.performance.distribution.map((count, index) => {
                            const grades = ['A', 'B', 'C', 'D', 'F'];
                            const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'];
                            const percentage = (count / ANALYTICS_DATA.performance.distribution.reduce((a, b) => a + b, 0) * 100).toFixed(1);
                            return `
                                <div class="grade-item">
                                    <div class="grade-bar" style="height: ${count * 10}px; background: ${colors[index]}"></div>
                                    <div class="grade-label">${grades[index]}</div>
                                    <div class="grade-count">${count}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
            
            <div class="analytics-card">
                <h3><i class="fas fa-trending-up"></i> Performance Trend</h3>
                <div class="performance-trend">
                    <canvas id="performanceTrendChart" width="400" height="200"></canvas>
                </div>
            </div>
            
            <div class="analytics-card">
                <h3><i class="fas fa-book"></i> Subject-wise Performance</h3>
                <div class="subject-performance">
                    ${Object.entries(ANALYTICS_DATA.performance.bySubject).map(([subject, score]) => `
                        <div class="subject-item">
                            <div class="subject-name">${subject}</div>
                            <div class="subject-score-bar">
                                <div class="subject-score-fill" style="width: ${score}%"></div>
                                <span class="subject-score">${score}%</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="analytics-card">
                <h3><i class="fas fa-trophy"></i> Top Performers</h3>
                <div class="top-performers">
                    ${STUDENTS_DATA
                        .sort((a, b) => b.performance - a.performance)
                        .slice(0, 5)
                        .map((student, index) => `
                            <div class="performer-item">
                                <div class="performer-rank">#${index + 1}</div>
                                <div class="performer-avatar">${student.avatar}</div>
                                <div class="performer-info">
                                    <div class="performer-name">${student.name}</div>
                                    <div class="performer-score">${student.performance}%</div>
                                </div>
                            </div>
                        `).join('')}
                </div>
            </div>
        </div>
    `;
}

function createEngagementAnalytics() {
    return `
        <div class="analytics-grid">
            <div class="analytics-card">
                <h3><i class="fas fa-comments"></i> Class Participation</h3>
                <div class="participation-chart">
                    <canvas id="participationChart" width="400" height="200"></canvas>
                </div>
            </div>
            
            <div class="analytics-card">
                <h3><i class="fas fa-poll"></i> Poll Response Rate</h3>
                <div class="poll-engagement">
                    <div class="engagement-metric">
                        <div class="metric-value">87.3%</div>
                        <div class="metric-label">Average Response Rate</div>
                    </div>
                    <div class="poll-timeline">
                        ${ANALYTICS_DATA.engagement.pollResponses.map((rate, index) => `
                            <div class="poll-day">
                                <div class="poll-bar" style="height: ${rate}%"></div>
                                <div class="poll-day-label">Day ${index + 1}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="analytics-card">
                <h3><i class="fas fa-question-circle"></i> Question Frequency</h3>
                <div class="question-frequency">
                    <div class="frequency-stats">
                        <div class="frequency-item">
                            <span class="frequency-number">23</span>
                            <span class="frequency-label">Avg Questions/Class</span>
                        </div>
                        <div class="frequency-item">
                            <span class="frequency-number">89%</span>
                            <span class="frequency-label">Students Asking</span>
                        </div>
                    </div>
                    <div class="frequency-chart">
                        ${ANALYTICS_DATA.engagement.questionFrequency.map((count, index) => `
                            <div class="frequency-bar">
                                <div class="frequency-fill" style="height: ${(count / 30) * 100}%"></div>
                                <div class="frequency-day">D${index + 1}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="analytics-card">
                <h3><i class="fas fa-eye"></i> Attention Metrics</h3>
                <div class="attention-metrics">
                    <div class="attention-gauge">
                        <div class="gauge-circle">
                            <div class="gauge-fill" style="stroke-dasharray: ${94 * 2.51}, 251"></div>
                            <div class="gauge-text">
                                <span class="gauge-value">94%</span>
                                <span class="gauge-label">Attention</span>
                            </div>
                        </div>
                    </div>
                    <div class="attention-factors">
                        <div class="factor-item">
                            <span class="factor-icon">📱</span>
                            <span class="factor-text">Device Usage: Low</span>
                        </div>
                        <div class="factor-item">
                            <span class="factor-icon">👁️</span>
                            <span class="factor-text">Eye Contact: High</span>
                        </div>
                        <div class="factor-item">
                            <span class="factor-icon">🗣️</span>
                            <span class="factor-text">Participation: Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createTrendsAnalytics() {
    return `
        <div class="analytics-grid">
            <div class="analytics-card full-width">
                <h3><i class="fas fa-chart-line"></i> Overall Progress Trends</h3>
                <div class="trends-overview">
                    <div class="trend-metrics">
                        <div class="trend-metric">
                            <div class="trend-icon positive">↗</div>
                            <div class="trend-info">
                                <div class="trend-value">+5.2%</div>
                                <div class="trend-label">Attendance Improvement</div>
                            </div>
                        </div>
                        <div class="trend-metric">
                            <div class="trend-icon positive">↗</div>
                            <div class="trend-info">
                                <div class="trend-value">+3.8%</div>
                                <div class="trend-label">Performance Growth</div>
                            </div>
                        </div>
                        <div class="trend-metric">
                            <div class="trend-icon positive">↗</div>
                            <div class="trend-info">
                                <div class="trend-value">+7.1%</div>
                                <div class="trend-label">Engagement Increase</div>
                            </div>
                        </div>
                    </div>
                    <div class="progress-timeline">
                        ${Object.entries(ANALYTICS_DATA.timeAnalysis.classProgress).map(([week, progress]) => `
                            <div class="timeline-item">
                                <div class="timeline-week">${week}</div>
                                <div class="timeline-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${progress}%"></div>
                                    </div>
                                    <span class="progress-value">${progress}%</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="analytics-card">
                <h3><i class="fas fa-calendar-alt"></i> Weekly Summary</h3>
                <div class="weekly-summary">
                    <div class="summary-item">
                        <div class="summary-day">Mon</div>
                        <div class="summary-stats">
                            <div class="summary-attendance">92%</div>
                            <div class="summary-engagement">87%</div>
                        </div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-day">Tue</div>
                        <div class="summary-stats">
                            <div class="summary-attendance">89%</div>
                            <div class="summary-engagement">91%</div>
                        </div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-day">Wed</div>
                        <div class="summary-stats">
                            <div class="summary-attendance">94%</div>
                            <div class="summary-engagement">88%</div>
                        </div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-day">Thu</div>
                        <div class="summary-stats">
                            <div class="summary-attendance">91%</div>
                            <div class="summary-engagement">93%</div>
                        </div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-day">Fri</div>
                        <div class="summary-stats">
                            <div class="summary-attendance">88%</div>
                            <div class="summary-engagement">89%</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="analytics-card">
                <h3><i class="fas fa-lightbulb"></i> AI Insights</h3>
                <div class="ai-insights">
                    <div class="insight-item positive">
                        <i class="fas fa-check-circle"></i>
                        <span>Attendance has improved by 5.2% this month</span>
                    </div>
                    <div class="insight-item warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>3 students need attention for low participation</span>
                    </div>
                    <div class="insight-item info">
                        <i class="fas fa-info-circle"></i>
                        <span>Best engagement time: 10-11 AM sessions</span>
                    </div>
                    <div class="insight-item positive">
                        <i class="fas fa-thumbs-up"></i>
                        <span>CS101 shows highest improvement trend</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getAnalyticsStyles() {
    return `
        .analytics-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            z-index: 50000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .analytics-modal-overlay.show {
            opacity: 1;
        }
        
        .analytics-modal {
            background: var(--bg-primary);
            border-radius: 15px;
            width: 95vw;
            max-width: 1200px;
            height: 90vh;
            max-height: 800px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid var(--border-color);
            transform: scale(0.9) translateY(20px);
            transition: all 0.3s ease;
        }
        
        .analytics-modal-overlay.show .analytics-modal {
            transform: scale(1) translateY(0);
        }
        
        .analytics-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 25px;
            border-bottom: 2px solid var(--border-color);
            background: var(--bg-secondary);
        }
        
        .analytics-header h2 {
            color: var(--text-primary);
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .close-analytics-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .close-analytics-btn:hover {
            background: var(--bg-tertiary);
            color: var(--text-primary);
        }
        
        .analytics-tabs {
            display: flex;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-color);
            overflow-x: auto;
        }
        
        .analytics-tab {
            flex: 1;
            padding: 15px 20px;
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            min-width: 150px;
            justify-content: center;
        }
        
        .analytics-tab:hover {
            background: var(--bg-tertiary);
            color: var(--text-primary);
        }
        
        .analytics-tab.active {
            background: var(--accent-green);
            color: white;
            border-bottom: 3px solid var(--accent-green-dark);
        }
        
        .analytics-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }
        
        .analytics-panel {
            display: none;
        }
        
        .analytics-panel.active {
            display: block;
        }
        
        .analytics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .analytics-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 20px var(--shadow-light);
            transition: all 0.3s ease;
        }
        
        .analytics-card:hover {
            box-shadow: 0 8px 30px var(--shadow-medium);
            transform: translateY(-2px);
        }
        
        .analytics-card.full-width {
            grid-column: 1 / -1;
        }
        
        .analytics-card h3 {
            color: var(--text-primary);
            font-size: 1.1rem;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .chart-container {
            position: relative;
            height: 200px;
            margin: 15px 0;
        }
        
        .chart-stats {
            display: flex;
            gap: 20px;
            margin-top: 15px;
        }
        
        .stat-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .stat-label {
            color: var(--text-secondary);
            font-size: 0.8rem;
        }
        
        .stat-value {
            color: var(--text-primary);
            font-weight: 600;
        }
        
        .stat-value.positive {
            color: var(--accent-green);
        }
        
        .class-attendance-bars,
        .subject-performance {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .attendance-bar-item,
        .subject-item {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .attendance-bar-label,
        .subject-name {
            min-width: 80px;
            color: var(--text-primary);
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .attendance-bar,
        .subject-score-bar {
            flex: 1;
            height: 25px;
            background: var(--border-color);
            border-radius: 12px;
            position: relative;
            overflow: hidden;
        }
        
        .attendance-bar-fill,
        .subject-score-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-green), var(--accent-green-dark));
            border-radius: 12px;
            transition: width 1s ease;
        }
        
        .attendance-percentage,
        .subject-score {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: white;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .peak-hours-chart {
            display: flex;
            gap: 10px;
            align-items: end;
            height: 150px;
        }
        
        .peak-hour-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        
        .peak-hour-bar {
            width: 30px;
            height: 100px;
            background: var(--border-color);
            border-radius: 15px;
            position: relative;
            overflow: hidden;
        }
        
        .peak-hour-fill {
            background: linear-gradient(180deg, var(--accent-blue), var(--accent-blue-dark));
            width: 100%;
            border-radius: 15px;
            transition: height 1s ease;
            position: absolute;
            bottom: 0;
        }
        
        .peak-hour-time,
        .peak-hour-value {
            color: var(--text-secondary);
            font-size: 0.8rem;
        }
        
        .attendance-distribution {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .distribution-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.9rem;
            color: var(--text-primary);
        }
        
        .distribution-color {
            width: 16px;
            height: 16px;
            border-radius: 50%;
        }
        
        .distribution-item.excellent .distribution-color {
            background: var(--accent-green);
        }
        
        .distribution-item.good .distribution-color {
            background: var(--accent-blue);
        }
        
        .distribution-item.average .distribution-color {
            background: var(--accent-yellow);
        }
        
        .distribution-item.poor .distribution-color {
            background: var(--accent-red);
        }
        
        .grade-chart {
            display: flex;
            gap: 15px;
            align-items: end;
            height: 150px;
            justify-content: center;
        }
        
        .grade-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        
        .grade-bar {
            width: 40px;
            border-radius: 8px 8px 0 0;
            transition: height 1s ease;
        }
        
        .grade-label {
            color: var(--text-primary);
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .grade-count {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .top-performers {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .performer-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px;
            background: var(--bg-tertiary);
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        
        .performer-item:hover {
            background: var(--bg-primary);
            box-shadow: 0 2px 10px var(--shadow-light);
        }
        
        .performer-rank {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: var(--accent-green);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .performer-avatar {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background: var(--accent-blue);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
        }
        
        .performer-info {
            flex: 1;
        }
        
        .performer-name {
            color: var(--text-primary);
            font-weight: 500;
        }
        
        .performer-score {
            color: var(--accent-green);
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .analytics-footer {
            display: flex;
            gap: 15px;
            padding: 20px 25px;
            border-top: 1px solid var(--border-color);
            background: var(--bg-secondary);
            justify-content: flex-end;
        }
        
        .ai-insights {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .insight-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            border-radius: 8px;
            font-size: 0.9rem;
        }
        
        .insight-item.positive {
            background: rgba(16, 185, 129, 0.1);
            color: var(--accent-green);
        }
        
        .insight-item.warning {
            background: rgba(245, 158, 11, 0.1);
            color: var(--accent-yellow);
        }
        
        .insight-item.info {
            background: rgba(37, 99, 235, 0.1);
            color: var(--accent-blue);
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
            .analytics-modal {
                width: 98vw;
                height: 95vh;
                margin: 10px;
            }
            
            .analytics-grid {
                grid-template-columns: 1fr;
            }
            
            .analytics-header {
                padding: 15px 20px;
            }
            
            .analytics-header h2 {
                font-size: 1.2rem;
            }
            
            .analytics-content {
                padding: 15px;
            }
            
            .analytics-footer {
                flex-direction: column;
                padding: 15px 20px;
            }
        }
    `;
}

function switchAnalyticsTab(tabName) {
    try {
        // Remove active class from all tabs and panels
        document.querySelectorAll('.analytics-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.analytics-panel').forEach(panel => panel.classList.remove('active'));
        
        // Add active class to selected tab and panel
        event.target.classList.add('active');
        document.getElementById(`${tabName}-analytics`).classList.add('active');
        
        // Initialize charts for the active tab
        setTimeout(() => {
            if (tabName === 'attendance') {
                initializeAttendanceCharts();
            } else if (tabName === 'performance') {
                initializePerformanceCharts();
            } else if (tabName === 'engagement') {
                initializeEngagementCharts();
            }
        }, 100);
        
        console.log('📊 Analytics tab switched to:', tabName);
    } catch (error) {
        console.error('❌ Error switching analytics tab:', error);
    }
}

function initializeAttendanceCharts() {
    try {
        const canvas = document.getElementById('weeklyAttendanceChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = ANALYTICS_DATA.attendance.weekly;
        
        // Simple line chart implementation
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-green');
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const stepX = canvas.width / (data.length - 1);
        const maxY = Math.max(...data);
        
        data.forEach((value, index) => {
            const x = index * stepX;
            const y = canvas.height - (value / maxY) * canvas.height * 0.8;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        console.log('📈 Attendance charts initialized');
    } catch (error) {
        console.error('❌ Error initializing attendance charts:', error);
    }
}

function initializePerformanceCharts() {
    try {
        const canvas = document.getElementById('performanceTrendChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = ANALYTICS_DATA.performance.trending;
        
        // Simple trend chart
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-blue');
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const stepX = canvas.width / (data.length - 1);
        const maxY = Math.max(...data);
        const minY = Math.min(...data);
        
        data.forEach((value, index) => {
            const x = index * stepX;
            const y = canvas.height - ((value - minY) / (maxY - minY)) * canvas.height * 0.8;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        console.log('📊 Performance charts initialized');
    } catch (error) {
        console.error('❌ Error initializing performance charts:', error);
    }
}

function initializeEngagementCharts() {
    try {
        const canvas = document.getElementById('participationChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = ANALYTICS_DATA.engagement.participation;
        
        // Simple participation chart
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-purple');
        
        const barWidth = canvas.width / data.length;
        const maxY = Math.max(...data);
        
        data.forEach((value, index) => {
            const x = index * barWidth;
            const height = (value / maxY) * canvas.height * 0.8;
            const y = canvas.height - height;
            
            ctx.fillRect(x + 5, y, barWidth - 10, height);
        });
        
        console.log('💬 Engagement charts initialized');
    } catch (error) {
        console.error('❌ Error initializing engagement charts:', error);
    }
}

function closeAnalyticsModal() {
    try {
        if (analyticsModal) {
            analyticsModal.classList.remove('show');
            setTimeout(() => {
                analyticsModal.remove();
                analyticsModal = null;
            }, 300);
        }
        console.log('📊 Analytics modal closed');
    } catch (error) {
        console.error('❌ Error closing analytics modal:', error);
    }
}

function exportAnalyticsReport() {
    try {
        showNotification('📄 Generating comprehensive analytics report...', 'info');
        setTimeout(() => {
            showNotification('📊 Analytics report exported successfully! Check your downloads.', 'success');
        }, 2000);
    } catch (error) {
        console.error('❌ Error exporting analytics report:', error);
    }
}

// Attendance Management Functions
function simulateCheckIn() {
    try {
        const availableStudents = STUDENTS_DATA.filter(s => 
            !attendanceData.find(a => a.studentId === s.id)
        );
        
        if (availableStudents.length === 0) {
            showNotification('All students are already marked!', 'warning');
            return;
        }
        
        const randomStudent = availableStudents[Math.floor(Math.random() * availableStudents.length)];
        const methods = ['qr', 'face', 'nfc', 'geo'];
        const randomMethod = methods[Math.floor(Math.random() * methods.length)];
        
        const record = {
            studentId: randomStudent.id,
            status: Math.random() > 0.15 ? 'present' : 'late',
            time: new Date().toLocaleTimeString('en-US', { 
                hour12: true, 
                hour: 'numeric', 
                minute: '2-digit' 
            }),
            method: randomMethod,
            isNew: true
        };
        
        attendanceData.push(record);
        updateAttendanceStats();
        
        const methodNames = {
            qr: 'QR Code',
            face: 'Face Recognition',
            nfc: 'NFC',
            geo: 'Geo Location'
        };
        
        showNotification(
            `${randomStudent.name} checked in via ${methodNames[randomMethod]}`, 
            'success'
        );
        
        addToActivityFeed('checkin', `${randomStudent.name} checked in via ${methodNames[randomMethod]}`, 0, 'user-check', 'success');
        
    } catch (error) {
        console.error('❌ Error simulating check-in:', error);
        showNotification('Failed to simulate check-in', 'error');
    }
}

function markAllPresent() {
    try {
        if (!confirm('Mark all remaining students as present?')) return;
        
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
                method: 'bulk',
                isNew: true
            });
        });
        
        updateAttendanceStats();
        showNotification(`${absentStudents.length} students marked present`, 'success');
        addToActivityFeed('bulk', `${absentStudents.length} students marked present (bulk action)`, 0, 'check-double', 'success');
        
    } catch (error) {
        console.error('❌ Error marking all present:', error);
    }
}

function viewAttendanceDetails() {
    try {
        showNotification('Opening detailed attendance view...', 'info');
        setTimeout(() => {
            window.location.href = 'attendance.html';
        }, 1000);
    } catch (error) {
        console.error('❌ Error viewing attendance details:', error);
    }
}

function exportAttendance() {
    try {
        showNotification('📄 Preparing attendance export...', 'info');
        setTimeout(() => {
            showNotification('📊 Attendance data exported successfully!', 'success');
        }, 2000);
    } catch (error) {
        console.error('❌ Error exporting attendance:', error);
    }
}

function updateAttendanceStats() {
    try {
        const presentCount = attendanceData.filter(a => a.status === 'present' || a.status === 'late').length;
        const totalStudents = STUDENTS_DATA.length;
        const attendanceRate = Math.round((presentCount / totalStudents) * 100);
        
        // Update attendance percentage
        const percentageCircle = document.querySelector('.percentage-circle span');
        if (percentageCircle) percentageCircle.textContent = `${attendanceRate}%`;
        
        // Update individual stat circles
        const presentEl = document.querySelector('.stat-circle.present .stat-number');
        const absentEl = document.querySelector('.stat-circle.absent .stat-number');
        const lateEl = document.querySelector('.stat-circle.late .stat-number');
        
        if (presentEl) presentEl.textContent = attendanceData.filter(a => a.status === 'present').length;
        if (absentEl) absentEl.textContent = totalStudents - presentCount;
        if (lateEl) lateEl.textContent = attendanceData.filter(a => a.status === 'late').length;
        
        // Update progress circle
        const progressCircle = document.querySelector('.percentage-circle');
        if (progressCircle) {
            const gradient = `conic-gradient(var(--accent-green) ${attendanceRate}%, var(--border-color) ${attendanceRate}%)`;
            progressCircle.style.background = gradient;
        }
        
        // Update overall stats
        const attendanceStatEl = document.getElementById('avgAttendance');
        if (attendanceStatEl) attendanceStatEl.textContent = `${attendanceRate}%`;
        
    } catch (error) {
        console.error('❌ Error updating attendance stats:', error);
    }
}

// QR Scanner Functions
function openQRScanner() {
    try {
        showNotification('📱 Initializing QR scanner...', 'info');
        setTimeout(() => {
            showNotification('📷 QR scanner would access camera for real-time scanning', 'info');
            setTimeout(() => {
                simulateCheckIn();
            }, 2000);
        }, 1500);
    } catch (error) {
        console.error('❌ Error opening QR scanner:', error);
    }
}

// Class Management Functions
function startClass() {
    try {
        showNotification('🎓 Starting class session...', 'info');
        setTimeout(() => {
            showNotification('✅ Class session started successfully!', 'success');
            addToActivityFeed('class', 'Live class session started', 0, 'play', 'success');
        }, 2000);
    } catch (error) {
        console.error('❌ Error starting class:', error);
    }
}

function markAttendance() {
    try {
        showNotification('📋 Opening attendance interface...', 'info');
        setTimeout(() => {
            simulateCheckIn();
        }, 1000);
    } catch (error) {
        console.error('❌ Error marking attendance:', error);
    }
}

function addNewClass() {
    try {
        showNotification('➕ Opening class creation form...', 'info');
        setTimeout(() => {
            showNotification('📅 Class creation interface would allow scheduling new sessions', 'info');
        }, 1500);
    } catch (error) {
        console.error('❌ Error adding new class:', error);
    }
}

function joinClass(classId) {
    try {
        showNotification(`🚀 Joining ${CLASS_SCHEDULE[classId]?.name || 'class'}...`, 'info');
        setTimeout(() => {
            window.location.href = 'session.html';
        }, 1500);
    } catch (error) {
        console.error('❌ Error joining class:', error);
    }
}

function prepareClass(classId) {
    try {
        const className = CLASS_SCHEDULE[classId]?.name || 'class';
        showNotification(`📚 Preparing ${className}...`, 'info');
        setTimeout(() => {
            showNotification('📖 Class preparation interface would show materials and setup options', 'info');
        }, 1500);
    } catch (error) {
        console.error('❌ Error preparing class:', error);
    }
}

// Poll Management
function createPoll() {
    try {
        const pollCreator = document.getElementById('pollCreator');
        const noActivePoll = document.getElementById('noActivePoll');
        
        if (pollCreator && noActivePoll) {
            pollCreator.style.display = 'block';
            pollCreator.classList.add('show');
            noActivePoll.style.display = 'none';
            
            const questionInput = document.getElementById('pollQuestion');
            if (questionInput) questionInput.focus();
        }
    } catch (error) {
        console.error('❌ Error creating poll:', error);
    }
}

function cancelPoll() {
    try {
        const pollCreator = document.getElementById('pollCreator');
        const noActivePoll = document.getElementById('noActivePoll');
        
        if (pollCreator && noActivePoll) {
            pollCreator.style.display = 'none';
            pollCreator.classList.remove('show');
            noActivePoll.style.display = 'block';
        }
        
        // Clear form
        const questionInput = document.getElementById('pollQuestion');
        const optionInputs = document.querySelectorAll('.poll-option');
        
        if (questionInput) questionInput.value = '';
        optionInputs.forEach(input => input.value = '');
        
        const charCount = document.getElementById('questionCharCount');
        if (charCount) charCount.textContent = '0';
        
    } catch (error) {
        console.error('❌ Error canceling poll:', error);
    }
}

function launchPoll() {
    try {
        const question = document.getElementById('pollQuestion')?.value?.trim();
        const optionInputs = document.querySelectorAll('.poll-option');
        const options = Array.from(optionInputs).map(input => input.value.trim()).filter(opt => opt);
        
        if (!question) {
            showNotification('Please enter a poll question', 'warning');
            return;
        }
        
        if (options.length < 2) {
            showNotification('Please provide at least 2 options', 'warning');
            return;
        }
        
        activePoll = {
            id: 'poll-' + Date.now(),
            question: question,
            options: options,
            responses: new Array(options.length).fill(0),
            totalResponses: 0,
            isActive: true
        };
        
        displayActivePoll();
        cancelPoll();
        
        showNotification('🗳️ Poll launched successfully!', 'success');
        addToActivityFeed('poll', `Poll launched: "${question}"`, 0, 'poll', 'primary');
        
        setTimeout(() => simulatePollResponses(), 3000);
        
    } catch (error) {
        console.error('❌ Error launching poll:', error);
    }
}

function displayActivePoll() {
    try {
        const activePollDiv = document.getElementById('activePoll');
        const noActivePollDiv = document.getElementById('noActivePoll');
        
        if (!activePollDiv || !noActivePollDiv || !activePoll) return;
        
        activePollDiv.innerHTML = `
            <div class="active-poll">
                <div class="poll-question">${activePoll.question}</div>
                <div class="poll-responses" id="pollResponses">
                    ${activePoll.options.map((option, index) => `
                        <div class="response-bar">
                            <div class="response-option">${option}</div>
                            <div class="response-progress">
                                <div class="response-fill" style="width: 0%" id="response-${index}"></div>
                            </div>
                            <div class="response-count" id="count-${index}">0 votes</div>
                        </div>
                    `).join('')}
                </div>
                <div class="poll-stats">
                    <div class="poll-total">
                        Total Responses: <span id="totalResponses">0</span>
                    </div>
                    <div class="poll-actions">
                        <button class="btn btn-danger" onclick="endPoll()">
                            <i class="fas fa-stop"></i> End Poll
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        activePollDiv.style.display = 'block';
        noActivePollDiv.style.display = 'none';
        
    } catch (error) {
        console.error('❌ Error displaying active poll:', error);
    }
}

function simulatePollResponses() {
    try {
        if (!activePoll || !activePoll.isActive) return;
        
        const numResponses = Math.floor(Math.random() * 5) + 2;
        
        for (let i = 0; i < numResponses; i++) {
            setTimeout(() => {
                if (!activePoll || !activePoll.isActive) return;
                
                const randomOption = Math.floor(Math.random() * activePoll.options.length);
                activePoll.responses[randomOption]++;
                activePoll.totalResponses++;
                
                updatePollDisplay();
                
            }, i * 800);
        }
        
        setTimeout(() => {
            if (activePoll && activePoll.isActive && Math.random() > 0.3) {
                simulatePollResponses();
            }
        }, 12000);
        
    } catch (error) {
        console.error('❌ Error simulating poll responses:', error);
    }
}

function updatePollDisplay() {
    try {
        if (!activePoll) return;
        
        const totalResponsesEl = document.getElementById('totalResponses');
        if (totalResponsesEl) {
            totalResponsesEl.textContent = activePoll.totalResponses;
        }
        
        activePoll.responses.forEach((count, index) => {
            const percentage = activePoll.totalResponses > 0 ? 
                (count / activePoll.totalResponses) * 100 : 0;
            
            const fillEl = document.getElementById(`response-${index}`);
            const countEl = document.getElementById(`count-${index}`);
            
            if (fillEl) fillEl.style.width = `${percentage}%`;
            if (countEl) {
                const label = count === 1 ? 'vote' : 'votes';
                countEl.textContent = `${count} ${label}`;
            }
        });
        
    } catch (error) {
        console.error('❌ Error updating poll display:', error);
    }
}

function endPoll() {
    try {
        if (!activePoll) return;
        
        if (!confirm('End this poll? Results will be saved and poll will close.')) return;
        
        activePoll.isActive = false;
        activePoll.endTime = new Date();
        
        showNotification(`🗳️ Poll ended! Total responses: ${activePoll.totalResponses}`, 'success');
        addToActivityFeed('poll', `Poll ended with ${activePoll.totalResponses} responses`, 0, 'check', 'success');
        
        // Reset poll interface after delay
        setTimeout(() => {
            document.getElementById('activePoll').style.display = 'none';
            document.getElementById('noActivePoll').style.display = 'block';
            activePoll = null;
        }, 3000);
        
    } catch (error) {
        console.error('❌ Error ending poll:', error);
    }
}

// AI Assistant Functions
function openChatBot() {
    try {
        showNotification('🤖 AI Teaching Assistant activated!', 'info');
        setTimeout(() => {
            showNotification('AI Assistant: "How can I help you improve your teaching today?"', 'info');
        }, 1500);
    } catch (error) {
        console.error('❌ Error opening chatbot:', error);
    }
}

// Activity Feed Management
function initializeActivityFeed() {
    try {
        renderActivityFeed();
    } catch (error) {
        console.error('❌ Error initializing activity feed:', error);
    }
}

function renderActivityFeed() {
    try {
        const feedContainer = document.getElementById('activityFeed');
        if (!feedContainer) return;
        
        const feedHTML = activityFeed.slice(0, 3).map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.color}">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${activity.message}</strong></p>
                    <span class="activity-time">${formatTimeAgo(activity.time)}</span>
                </div>
            </div>
        `).join('');
        
        feedContainer.innerHTML = feedHTML;
        
    } catch (error) {
        console.error('❌ Error rendering activity feed:', error);
    }
}

function addToActivityFeed(type, message, time, icon, color) {
    try {
        activityFeed.unshift({
            type: type,
            message: message,
            time: time,
            icon: icon,
            color: color,
            timestamp: new Date()
        });
        
        // Keep only latest 50 activities
        if (activityFeed.length > 50) {
            activityFeed = activityFeed.slice(0, 50);
        }
        
        renderActivityFeed();
        
    } catch (error) {
        console.error('❌ Error adding to activity feed:', error);
    }
}

function refreshActivityFeed() {
    try {
        // Update timestamps
        activityFeed.forEach(activity => {
            const now = new Date();
            activity.time = Math.floor((now - activity.timestamp) / 60000); // minutes
        });
        
        renderActivityFeed();
        
    } catch (error) {
        console.error('❌ Error refreshing activity feed:', error);
    }
}

// Utility Functions
function formatTimeAgo(minutes) {
    try {
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} min ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    } catch (error) {
        return 'Recently';
    }
}

function loadAttendanceTable() {
    try {
        // This function is called but we're using the attendance summary instead
        updateAttendanceStats();
        console.log('📊 Attendance data loaded');
    } catch (error) {
        console.error('❌ Error loading attendance table:', error);
    }
}

function startRealTimeUpdates() {
    try {
        // Clear existing interval
        if (realTimeUpdates) clearInterval(realTimeUpdates);
        
        realTimeUpdates = setInterval(() => {
            // Simulate random student check-ins (less frequent)
            if (Math.random() > 0.95 && attendanceData.length < STUDENTS_DATA.length) {
                simulateCheckIn();
            }
            
            // Update live stats
            updateLiveStats();
            
            // Simulate poll responses if poll is active
            if (activePoll && activePoll.isActive && Math.random() > 0.85) {
                simulatePollResponses();
            }
            
        }, 25000); // Every 25 seconds
        
        console.log('🔄 Real-time updates started');
    } catch (error) {
        console.error('❌ Error starting real-time updates:', error);
    }
}

function loadDemoData() {
    try {
        // Load some demo attendance data
        attendanceData = [
            { studentId: 'st001', status: 'present', time: '10:05 AM', method: 'face', isNew: false },
            { studentId: 'st002', status: 'present', time: '10:03 AM', method: 'qr', isNew: false },
            { studentId: 'st003', status: 'late', time: '10:12 AM', method: 'manual', isNew: false },
            { studentId: 'st004', status: 'present', time: '10:01 AM', method: 'nfc', isNew: false },
            { studentId: 'st005', status: 'present', time: '10:04 AM', method: 'geo', isNew: false }
        ];
        
        updateAttendanceStats();
        
        console.log('🎭 Demo data loaded');
    } catch (error) {
        console.error('❌ Error loading demo data:', error);
    }
}

function setupEventListeners() {
    try {
        // Character counter for poll question
        const pollQuestion = document.getElementById('pollQuestion');
        if (pollQuestion) {
            pollQuestion.addEventListener('input', function() {
                const charCount = document.getElementById('questionCharCount');
                if (charCount) {
                    charCount.textContent = this.value.length;
                }
            });
        }
        
        // Close mobile sidebar on resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMobileSidebar();
            }
        });
        
        // Click outside handlers
        document.addEventListener('click', function(e) {
            // Close mobile sidebar
            const sidebar = document.getElementById('sidebar');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            
            if (window.innerWidth <= 768 && 
                sidebar?.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !mobileMenuBtn?.contains(e.target)) {
                closeMobileSidebar();
            }
            
            // Close analytics modal if clicking outside
            if (analyticsModal && 
                analyticsModal.classList.contains('show') &&
                e.target === analyticsModal) {
                closeAnalyticsModal();
            }
        });
        
        // Escape key handlers
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (analyticsModal && analyticsModal.classList.contains('show')) {
                    closeAnalyticsModal();
                }
            }
        });
        
        console.log('👂 Event listeners setup');
    } catch (error) {
        console.error('❌ Error setting up event listeners:', error);
    }
}

// Enhanced Notification System
function showNotification(message, type = 'info') {
    try {
        // Remove existing notifications to prevent stacking
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
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

        // Show notification
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto remove
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 400);
            }
        }, 5000);
        
        console.log(`🔔 ${type.toUpperCase()}: ${message}`);
    } catch (error) {
        console.error('❌ Notification error:', error);
        // Fallback to alert
        alert(message);
    }
}

// Navigation Functions
function viewAllClasses() {
    try {
        showNotification('📚 Opening all classes overview...', 'info');
        setTimeout(() => {
            window.location.href = 'course-content.html';
        }, 1000);
    } catch (error) {
        console.error('❌ Error viewing all classes:', error);
    }
}

function viewStudentProfiles() {
    try {
        showNotification('👥 Loading student profiles...', 'info');
        setTimeout(() => {
            window.location.href = 'student-profiles.html';
        }, 1000);
    } catch (error) {
        console.error('❌ Error viewing student profiles:', error);
    }
}

// Additional Quick Actions
function generateReport() {
    try {
        showNotification('📊 Generating comprehensive report...', 'info');
        setTimeout(() => {
            showNotification('📄 Report generated! Would download PDF with attendance, performance, and engagement data.', 'success');
        }, 3000);
    } catch (error) {
        console.error('❌ Error generating report:', error);
    }
}

function scheduleMeeting() {
    try {
        showNotification('📅 Opening meeting scheduler...', 'info');
        setTimeout(() => {
            showNotification('🤝 Meeting scheduler would integrate with calendar for parent-teacher meetings', 'info');
        }, 1500);
    } catch (error) {
        console.error('❌ Error scheduling meeting:', error);
    }
}

// Performance Monitoring
if (typeof PerformanceObserver !== 'undefined') {
    try {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 100) {
                    console.warn('⚠️ Slow operation:', entry.name, entry.duration + 'ms');
                }
            }
        });
        perfObserver.observe({ entryTypes: ['measure'] });
    } catch (error) {
        console.warn('Performance Observer not supported');
    }
}

// Global Error Handler
window.addEventListener('error', function(e) {
    console.error('💥 Global error:', e.error);
    showNotification('An unexpected error occurred. Please refresh the page.', 'error');
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (realTimeUpdates) clearInterval(realTimeUpdates);
    if (classTimer) clearInterval(classTimer);
    
    // Close any open modals
    if (analyticsModal) {
        analyticsModal.remove();
    }
});

// Development Helper
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.log(`
🎓 SCMS Dashboard - Development Mode
👤 Current User: ${currentUser.name || 'Loading...'}
📊 Students: ${STUDENTS_DATA.length}
📚 Classes: ${Object.keys(CLASS_SCHEDULE).length}
🔄 Real-time Updates: Active
📈 Analytics: Enhanced Visual System
🎯 All systems operational!
    `);
}

// Service Worker Registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('🔧 ServiceWorker registered successfully');
            })
            .catch(function(error) {
                console.log('❌ ServiceWorker registration failed');
            });
    });
}

// Accessibility enhancements
document.addEventListener('keydown', function(e) {
    // Skip to main content with Tab key
    if (e.key === 'Tab' && e.shiftKey === false && document.activeElement === document.body) {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.focus();
            e.preventDefault();
        }
    }
    
    // Close modals with Escape key
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.analytics-modal-overlay.show');
        if (activeModal) {
            closeAnalyticsModal();
        }
    }
});

// Touch gesture support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Swipe right to open sidebar (mobile)
    if (Math.abs(diffX) > Math.abs(diffY) && diffX < -100 && window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.classList.contains('active')) {
            toggleMobileSidebar();
        }
    }
    
    // Swipe left to close sidebar (mobile)
    if (Math.abs(diffX) > Math.abs(diffY) && diffX > 100 && window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            closeMobileSidebar();
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
});

// Initialize app state management
const AppState = {
    currentTheme: 'light',
    currentClass: 'cs101',
    isOnline: navigator.onLine,
    
    setState: function(key, value) {
        this[key] = value;
        this.saveState();
    },
    
    saveState: function() {
        try {
            localStorage.setItem('scms_app_state', JSON.stringify({
                currentTheme: this.currentTheme,
                currentClass: this.currentClass,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('❌ Error saving app state:', error);
        }
    },
    
    loadState: function() {
        try {
            const saved = localStorage.getItem('scms_app_state');
            if (saved) {
                const state = JSON.parse(saved);
                this.currentTheme = state.currentTheme || 'light';
                this.currentClass = state.currentClass || 'cs101';
            }
        } catch (error) {
            console.error('❌ Error loading app state:', error);
        }
    }
};

// Online/Offline status handling
window.addEventListener('online', function() {
    AppState.setState('isOnline', true);
    showNotification('🌐 Connection restored', 'success');
});

window.addEventListener('offline', function() {
    AppState.setState('isOnline', false);
    showNotification('📡 Working offline', 'warning');
});

// Initialize app state
AppState.loadState();

// Final initialization log
console.log('🚀 SCMS Dashboard JavaScript loaded successfully! All systems operational!');
console.log('📊 Enhanced Analytics System Ready!');
console.log('🎯 Clean & Focused Dashboard Interface Active!');
console.log('🤖 AI Assistant & Interactive Features Loaded!');
console.log('✨ Ready for an amazing teaching experience!');

// Export functions for global access (if needed)
window.SCMSDashboard = {
    toggleTheme,
    toggleMobileSidebar,
    closeMobileSidebar,
    viewAnalytics,
    showNotification,
    startClass,
    markAttendance,
    createPoll,
    openChatBot
};

