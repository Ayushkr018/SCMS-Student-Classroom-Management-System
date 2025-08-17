// Student Profiles JavaScript - Advanced Features with Real Experience

// Global Variables
let students = [];
let filteredStudents = [];
let currentStudent = null;
let currentView = 'grid';
let currentSortBy = 'name';
let performanceCharts = {};
let currentUser = {
    name: 'Dr. Michael Chen',
    department: 'Computer Science',
    avatar: 'MC'
};

// Mock Database with Realistic Data
const MOCK_STUDENTS = [
    {
        id: 'stud-001',
        name: 'Aarav Sharma',
        rollNo: 'CS2021A001',
        email: 'aarav.sharma@student.scms.edu',
        phone: '+91 9876543210',
        class: 'cs-2a',
        dateOfBirth: '2003-05-15',
        address: '123 MG Road, Bangalore, Karnataka 560001',
        photo: null,
        performance: {
            currentGPA: 8.7,
            averageGrade: 87.2,
            rank: 3,
            totalCredits: 125
        },
        attendance: {
            percentage: 92.5,
            present: 111,
            absent: 9,
            total: 120
        },
        parents: {
            father: {
                name: 'Rajesh Sharma',
                phone: '+91 9876543211',
                email: 'rajesh.sharma@gmail.com',
                occupation: 'Software Engineer'
            },
            mother: {
                name: 'Priya Sharma',
                phone: '+91 9876543212',
                email: 'priya.sharma@gmail.com',
                occupation: 'Teacher'
            }
        },
        subjects: {
            'Data Structures': { grade: 89, attendance: 95 },
            'Algorithms': { grade: 92, attendance: 88 },
            'Database Management': { grade: 85, attendance: 97 },
            'Web Technology': { grade: 88, attendance: 90 }
        },
        assignments: [
            { title: 'Data Structures Lab', grade: 18, maxGrade: 20, submittedOn: '2025-08-20' },
            { title: 'Algorithm Analysis', grade: 16, maxGrade: 20, submittedOn: '2025-08-18' },
            { title: 'Database Project', grade: 45, maxGrade: 50, submittedOn: '2025-08-15' }
        ],
        notes: [
            { 
                id: 'note-1', 
                content: 'Excellent student with strong programming skills. Shows great interest in algorithms and data structures.',
                date: '2025-08-15',
                important: true,
                category: 'Academic'
            },
            { 
                id: 'note-2', 
                content: 'Participated actively in coding competition. Secured 2nd position.',
                date: '2025-08-10',
                important: false,
                category: 'Achievement'
            }
        ],
        activities: [
            { type: 'assignment', title: 'Submitted Data Structures Lab', time: '2 hours ago', icon: 'fas fa-upload' },
            { type: 'test', title: 'Appeared for Algorithms Quiz', time: '1 day ago', icon: 'fas fa-clipboard-check' },
            { type: 'attendance', title: 'Present in Database class', time: '2 days ago', icon: 'fas fa-check' }
        ],
        status: 'active',
        riskLevel: 'low',
        lastActivity: '2025-08-20T14:30:00'
    },
    {
        id: 'stud-002',
        name: 'Kavya Patel',
        rollNo: 'CS2021A002',
        email: 'kavya.patel@student.scms.edu',
        phone: '+91 9876543213',
        class: 'cs-2a',
        dateOfBirth: '2003-08-22',
        address: '456 Brigade Road, Bangalore, Karnataka 560025',
        photo: null,
        performance: {
            currentGPA: 9.2,
            averageGrade: 92.8,
            rank: 1,
            totalCredits: 128
        },
        attendance: {
            percentage: 96.7,
            present: 116,
            absent: 4,
            total: 120
        },
        parents: {
            father: {
                name: 'Amit Patel',
                phone: '+91 9876543214',
                email: 'amit.patel@gmail.com',
                occupation: 'Business Owner'
            },
            mother: {
                name: 'Sneha Patel',
                phone: '+91 9876543215',
                email: 'sneha.patel@gmail.com',
                occupation: 'Doctor'
            }
        },
        subjects: {
            'Data Structures': { grade: 95, attendance: 98 },
            'Algorithms': { grade: 97, attendance: 96 },
            'Database Management': { grade: 91, attendance: 94 },
            'Web Technology': { grade: 88, attendance: 100 }
        },
        assignments: [
            { title: 'Data Structures Lab', grade: 20, maxGrade: 20, submittedOn: '2025-08-19' },
            { title: 'Algorithm Analysis', grade: 19, maxGrade: 20, submittedOn: '2025-08-17' },
            { title: 'Database Project', grade: 48, maxGrade: 50, submittedOn: '2025-08-14' }
        ],
        notes: [
            { 
                id: 'note-3', 
                content: 'Top performer in the class. Excellent analytical skills and leadership qualities.',
                date: '2025-08-16',
                important: true,
                category: 'Academic'
            }
        ],
        activities: [
            { type: 'assignment', title: 'Submitted Algorithm Analysis', time: '3 hours ago', icon: 'fas fa-upload' },
            { type: 'achievement', title: 'Received Dean\'s List Award', time: '5 days ago', icon: 'fas fa-award' },
            { type: 'attendance', title: 'Perfect attendance this month', time: '1 week ago', icon: 'fas fa-star' }
        ],
        status: 'active',
        riskLevel: 'low',
        lastActivity: '2025-08-20T16:45:00'
    },
    {
        id: 'stud-003',
        name: 'Arjun Kumar',
        rollNo: 'CS2021A003',
        email: 'arjun.kumar@student.scms.edu',
        phone: '+91 9876543216',
        class: 'cs-2a',
        dateOfBirth: '2003-12-10',
        address: '789 Indiranagar, Bangalore, Karnataka 560038',
        photo: null,
        performance: {
            currentGPA: 6.8,
            averageGrade: 68.5,
            rank: 28,
            totalCredits: 115
        },
        attendance: {
            percentage: 72.5,
            present: 87,
            absent: 33,
            total: 120
        },
        parents: {
            father: {
                name: 'Suresh Kumar',
                phone: '+91 9876543217',
                email: 'suresh.kumar@gmail.com',
                occupation: 'Government Employee'
            },
            mother: {
                name: 'Meera Kumar',
                phone: '+91 9876543218',
                email: 'meera.kumar@gmail.com',
                occupation: 'Homemaker'
            }
        },
        subjects: {
            'Data Structures': { grade: 65, attendance: 70 },
            'Algorithms': { grade: 72, attendance: 75 },
            'Database Management': { grade: 68, attendance: 73 },
            'Web Technology': { grade: 69, attendance: 72 }
        },
        assignments: [
            { title: 'Data Structures Lab', grade: 12, maxGrade: 20, submittedOn: '2025-08-21' },
            { title: 'Algorithm Analysis', grade: 13, maxGrade: 20, submittedOn: '2025-08-19' },
            { title: 'Database Project', grade: null, maxGrade: 50, submittedOn: null }
        ],
        notes: [
            { 
                id: 'note-4', 
                content: 'Student is struggling with attendance and assignments. Need to schedule parent meeting.',
                date: '2025-08-18',
                important: true,
                category: 'Concern'
            },
            { 
                id: 'note-5', 
                content: 'Spoke to parents about attendance issues. They promised to monitor closely.',
                date: '2025-08-12',
                important: false,
                category: 'Communication'
            }
        ],
        activities: [
            { type: 'assignment', title: 'Late submission - Data Structures Lab', time: '1 day ago', icon: 'fas fa-clock' },
            { type: 'attendance', title: 'Absent from Algorithms class', time: '3 days ago', icon: 'fas fa-times' },
            { type: 'communication', title: 'Parent meeting scheduled', time: '1 week ago', icon: 'fas fa-calendar' }
        ],
        status: 'active',
        riskLevel: 'high',
        lastActivity: '2025-08-19T10:15:00'
    },
    {
        id: 'stud-004',
        name: 'Sneha Reddy',
        rollNo: 'IT2021A001',
        email: 'sneha.reddy@student.scms.edu',
        phone: '+91 9876543219',
        class: 'it-3a',
        dateOfBirth: '2002-03-18',
        address: '321 Koramangala, Bangalore, Karnataka 560034',
        photo: null,
        performance: {
            currentGPA: 8.4,
            averageGrade: 84.6,
            rank: 5,
            totalCredits: 145
        },
        attendance: {
            percentage: 89.2,
            present: 107,
            absent: 13,
            total: 120
        },
        parents: {
            father: {
                name: 'Venkat Reddy',
                phone: '+91 9876543220',
                email: 'venkat.reddy@gmail.com',
                occupation: 'Bank Manager'
            },
            mother: {
                name: 'Lakshmi Reddy',
                phone: '+91 9876543221',
                email: 'lakshmi.reddy@gmail.com',
                occupation: 'Nurse'
            }
        },
        subjects: {
            'Software Engineering': { grade: 88, attendance: 92 },
            'Web Technology': { grade: 85, attendance: 87 },
            'Database Management': { grade: 82, attendance: 89 },
            'Network Security': { grade: 84, attendance: 88 }
        },
        assignments: [
            { title: 'Web Development Project', grade: 42, maxGrade: 50, submittedOn: '2025-08-16' },
            { title: 'Security Analysis', grade: 17, maxGrade: 20, submittedOn: '2025-08-14' }
        ],
        notes: [
            { 
                id: 'note-6', 
                content: 'Great potential in web development. Should consider internship opportunities.',
                date: '2025-08-14',
                important: false,
                category: 'Career'
            }
        ],
        activities: [
            { type: 'project', title: 'Completed Web Development Project', time: '4 days ago', icon: 'fas fa-code' },
            { type: 'attendance', title: 'Present in all classes this week', time: '1 week ago', icon: 'fas fa-check-circle' }
        ],
        status: 'active',
        riskLevel: 'low',
        lastActivity: '2025-08-20T11:20:00'
    }
];

// Communication Templates
const MESSAGE_TEMPLATES = {
    excellent: {
        subject: 'Excellent Academic Performance - {studentName}',
        content: `Dear {parentName},

I hope this message finds you well. I am writing to share some wonderful news about {studentName}'s academic performance.

{studentName} has been consistently performing exceptionally well in class with:
• Current GPA: {gpa}
• Class Rank: {rank}
• Attendance: {attendance}%

{studentName} demonstrates excellent understanding of concepts and actively participates in class discussions. It's a pleasure to have such a dedicated student.

Please continue to encourage {studentName}. With such dedication, I'm confident about their bright future.

Best regards,
{teacherName}
{department} Department`
    },
    improvement: {
        subject: 'Academic Performance - Areas for Improvement - {studentName}',
        content: `Dear {parentName},

I hope you are doing well. I am writing to discuss {studentName}'s academic progress and areas where we can work together to help them improve.

Current Performance Status:
• Current GPA: {gpa}
• Attendance: {attendance}%
• Areas needing attention: {subjects}

I believe {studentName} has great potential, and with proper guidance and support, can achieve much better results. I would like to suggest:
1. Regular study schedule at home
2. Completion of assignments on time
3. Active participation in class

Please let me know if you'd like to schedule a meeting to discuss this further.

Best regards,
{teacherName}
{department} Department`
    },
    attendance: {
        subject: 'Attendance Concern - {studentName}',
        content: `Dear {parentName},

I hope this message finds you well. I am writing to bring to your attention {studentName}'s attendance pattern.

Attendance Details:
• Current Attendance: {attendance}%
• Classes Missed: {absentDays}
• Total Classes: {totalClasses}

Regular attendance is crucial for academic success. Missing classes can significantly impact {studentName}'s understanding of concepts and overall performance.

I request your support in ensuring {studentName} attends classes regularly. If there are any challenges, please feel free to discuss with me.

Thank you for your cooperation.

Best regards,
{teacherName}
{department} Department`
    },
    meeting: {
        subject: 'Parent-Teacher Meeting Request - {studentName}',
        content: `Dear {parentName},

I hope you are doing well. I would like to schedule a meeting to discuss {studentName}'s academic progress and future plans.

Discussion Points:
• Academic Performance Review
• Strengths and Areas for Improvement
• Career Guidance and Opportunities
• Any concerns or questions you may have

Please let me know your available dates and times. I am flexible and can accommodate your schedule.

Looking forward to meeting with you.

Best regards,
{teacherName}
{department} Department`
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 Student Profiles System Loading...');
    
    // Load initial data
    students = [...MOCK_STUDENTS];
    filteredStudents = [...students];
    
    // Initialize components
    initializeUserInfo();
    initializeTheme();
    initializeMobileControls();
    loadStudentStats();
    renderStudents();
    initializeEventListeners();
    initializeFormValidation();
    
    // Show success notification
    setTimeout(() => {
        showNotification('Student Profiles System loaded successfully!', 'success');
        console.log('✅ Student Profiles System Ready!');
    }, 800);
});

// User Info Functions
function initializeUserInfo() {
    try {
        const userName = document.getElementById('userName');
        const userDept = document.getElementById('userDept');
        
        if (userName) userName.textContent = currentUser.name;
        if (userDept) userDept.textContent = currentUser.department;
        
        console.log('👤 User info initialized');
    } catch (error) {
        console.error('❌ Error initializing user info:', error);
    }
}

// Theme Functions
function initializeTheme() {
    try {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcons(savedTheme);
        console.log('🎨 Theme initialized:', savedTheme);
    } catch (error) {
        console.error('❌ Error initializing theme:', error);
    }
}

function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
        
        // Recreate charts with new theme
        setTimeout(() => {
            if (currentStudent && Object.keys(performanceCharts).length > 0) {
                createPerformanceCharts(currentStudent);
            }
        }, 100);
        
        showNotification(`Switched to ${newTheme} mode`, 'info');
        console.log('🎨 Theme toggled to:', newTheme);
    } catch (error) {
        console.error('❌ Error toggling theme:', error);
        showNotification('Failed to toggle theme', 'error');
    }
}

function updateThemeIcons(theme) {
    try {
        const themeIcon = document.getElementById('themeIcon');
        const mobileThemeIcon = document.getElementById('mobileThemeIcon');
        const themeLabel = document.getElementById('themeLabel');
        const themeSwitch = document.getElementById('themeSwitch');
        
        const isDark = theme === 'dark';
        const icon = isDark ? 'fas fa-sun' : 'fas fa-moon';
        const label = isDark ? 'Light Mode' : 'Dark Mode';
        
        if (themeIcon) themeIcon.className = icon;
        if (mobileThemeIcon) mobileThemeIcon.className = icon;
        if (themeLabel) themeLabel.textContent = label;
        if (themeSwitch) themeSwitch.classList.toggle('active', isDark);
        
        console.log('🎨 Theme icons updated for:', theme);
    } catch (error) {
        console.error('❌ Error updating theme icons:', error);
    }
}

// Mobile Controls
function initializeMobileControls() {
    try {
        console.log('📱 Mobile controls initialized');
    } catch (error) {
        console.error('❌ Error initializing mobile controls:', error);
    }
}

function toggleMobileSidebar() {
    try {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // Prevent body scroll when sidebar is open
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
            
            console.log('📱 Mobile sidebar toggled');
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
            document.body.style.overflow = '';
            
            console.log('📱 Mobile sidebar closed');
        }
    } catch (error) {
        console.error('❌ Error closing mobile sidebar:', error);
    }
}

// Student Statistics
function loadStudentStats() {
    try {
        const stats = calculateStudentStats();
        
        updateStatElement('totalStudents', stats.total);
        updateStatElement('activeStudents', stats.active);
        updateStatElement('avgAttendance', stats.avgAttendance + '%');
        updateStatElement('avgGrade', stats.avgGrade + '%');
        updateStatElement('atRiskStudents', stats.atRisk);
        
        console.log('📊 Student stats loaded:', stats);
    } catch (error) {
        console.error('❌ Error loading student stats:', error);
    }
}

function calculateStudentStats() {
    try {
        const total = students.length;
        const active = students.filter(s => s.status === 'active').length;
        const atRisk = students.filter(s => s.riskLevel === 'high').length;
        
        let totalAttendance = 0;
        let totalGrades = 0;
        
        students.forEach(student => {
            totalAttendance += student.attendance.percentage;
            totalGrades += student.performance.averageGrade;
        });
        
        const avgAttendance = total > 0 ? Math.round(totalAttendance / total * 10) / 10 : 0;
        const avgGrade = total > 0 ? Math.round(totalGrades / total * 10) / 10 : 0;
        
        return {
            total,
            active,
            avgAttendance,
            avgGrade,
            atRisk
        };
    } catch (error) {
        console.error('❌ Error calculating student stats:', error);
        return { total: 0, active: 0, avgAttendance: 0, avgGrade: 0, atRisk: 0 };
    }
}

function updateStatElement(id, value) {
    try {
        const element = document.getElementById(id);
        if (element) {
            // Add animation effect
            element.style.opacity = '0.5';
            setTimeout(() => {
                element.textContent = value;
                element.style.opacity = '1';
            }, 200);
        }
    } catch (error) {
        console.error('❌ Error updating stat element:', id, error);
    }
}

// View Management
function switchView(view) {
    try {
        currentView = view;
        
        // Update view toggle buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        renderStudents();
        console.log('👁️ View switched to:', view);
    } catch (error) {
        console.error('❌ Error switching view:', error);
    }
}

// Student Rendering
function renderStudents() {
    try {
        const container = document.getElementById('studentsContainer');
        if (!container) return;
        
        container.className = `students-container`;
        
        if (filteredStudents.length === 0) {
            container.innerHTML = createEmptyState();
            return;
        }
        
        const studentsHTML = currentView === 'grid' ? 
            createGridView(filteredStudents) : 
            createListView(filteredStudents);
        
        container.innerHTML = `<div class="students-${currentView}">${studentsHTML}</div>`;
        
        // Add entrance animation
        setTimeout(() => {
            const studentElements = container.querySelectorAll(`.student-${currentView === 'grid' ? 'card' : 'list-item'}`);
            studentElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(20px)';
                    element.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
            });
        }, 50);
        
        console.log('👥 Students rendered:', filteredStudents.length, 'in', currentView, 'view');
    } catch (error) {
        console.error('❌ Error rendering students:', error);
        showNotification('Failed to load student data', 'error');
    }
}

function createEmptyState() {
    return `
        <div class="empty-state">
            <i class="fas fa-user-graduate"></i>
            <h3>No students found</h3>
            <p>No students match your current filters, or you haven't added any students yet.</p>
            <button class="btn btn-primary" onclick="addNewStudent()" style="margin-top: 15px;">
                <i class="fas fa-user-plus"></i> Add First Student
            </button>
        </div>
    `;
}

function createGridView(students) {
    return students.map(student => createStudentCard(student)).join('');
}

function createListView(students) {
    return students.map(student => createStudentListItem(student)).join('');
}

function createStudentCard(student) {
    try {
        const initials = getInitials(student.name);
        const performanceClass = getPerformanceClass(student.performance.averageGrade);
        const attendanceClass = getAttendanceClass(student.attendance.percentage);
        const riskIndicator = student.riskLevel === 'high' ? '<div style="position: absolute; top: 10px; right: 10px; background: var(--accent-red); color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 600;">At Risk</div>' : '';
        
        return `
            <div class="student-card" onclick="openStudentProfile('${student.id}')">
                ${riskIndicator}
                <div class="student-card-header">
                    <div class="student-photo">
                        ${student.photo ? `<img src="${student.photo}" alt="${student.name}">` : initials}
                    </div>
                    <div class="student-basic-info">
                        <div class="student-name">${student.name}</div>
                        <div class="student-roll">${student.rollNo}</div>
                        <div class="student-class">${getClassName(student.class)}</div>
                    </div>
                </div>
                
                <div class="student-stats-row">
                    <div class="student-stat">
                        <span class="stat-value">${student.performance.currentGPA}</span>
                        <span class="stat-label">GPA</span>
                    </div>
                    <div class="student-stat">
                        <span class="stat-value">${student.attendance.percentage}%</span>
                        <span class="stat-label">Attendance</span>
                    </div>
                    <div class="student-stat">
                        <span class="stat-value">#${student.performance.rank}</span>
                        <span class="stat-label">Rank</span>
                    </div>
                    <div class="student-stat">
                        <span class="stat-value">${student.assignments.filter(a => a.grade !== null).length}</span>
                        <span class="stat-label">Completed</span>
                    </div>
                </div>
                
                <div class="student-quick-actions">
                    <button class="quick-action-btn" onclick="event.stopPropagation(); openStudentProfile('${student.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="quick-action-btn" onclick="event.stopPropagation(); sendMessageToParent('${student.id}')">
                        <i class="fas fa-envelope"></i> Message
                    </button>
                    <button class="quick-action-btn" onclick="event.stopPropagation(); editStudent('${student.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('❌ Error creating student card:', error);
        return '<div class="student-card"><p>Error loading student data</p></div>';
    }
}

function createStudentListItem(student) {
    try {
        const initials = getInitials(student.name);
        const performanceClass = getPerformanceClass(student.performance.averageGrade);
        const attendanceClass = getAttendanceClass(student.attendance.percentage);
        const lastActive = formatRelativeTime(new Date(student.lastActivity));
        
        return `
            <div class="student-list-item" onclick="openStudentProfile('${student.id}')">
                <div class="student-list-photo">
                    ${student.photo ? `<img src="${student.photo}" alt="${student.name}">` : initials}
                </div>
                <div class="student-list-info">
                    <div class="student-list-details">
                        <div class="student-list-name">${student.name}</div>
                        <div class="student-list-meta">
                            <span>${student.rollNo}</span>
                            <span>•</span>
                            <span>${getClassName(student.class)}</span>
                            <span>•</span>
                            <span>Last active: ${lastActive}</span>
                        </div>
                    </div>
                    <div class="student-list-stats">
                        <div class="student-list-stat">
                            <span class="stat-value">${student.performance.currentGPA}</span>
                            <span class="stat-label">GPA</span>
                        </div>
                        <div class="student-list-stat">
                            <span class="stat-value">${student.attendance.percentage}%</span>
                            <span class="stat-label">Attendance</span>
                        </div>
                        <div class="student-list-stat">
                            <span class="stat-value performance-indicator ${performanceClass}">${student.performance.averageGrade}%</span>
                            <span class="stat-label">Performance</span>
                        </div>
                        <div class="student-list-stat">
                            <span class="stat-value">#${student.performance.rank}</span>
                            <span class="stat-label">Rank</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('❌ Error creating student list item:', error);
        return '<div class="student-list-item"><p>Error loading student data</p></div>';
    }
}

// Student Profile Modal
function openStudentProfile(studentId) {
    try {
        const student = students.find(s => s.id === studentId);
        if (!student) {
            showNotification('Student not found', 'error');
            return;
        }
        
        currentStudent = student;
        const modal = document.getElementById('studentModal');
        
        // Update modal title
        document.getElementById('studentModalTitle').textContent = `${student.name} - Profile`;
        
        // Populate profile header
        populateProfileHeader(student);
        
        // Show overview tab by default
        switchProfileTab('overview');
        
        // Show modal
        modal.style.display = 'flex';
        
        console.log('👤 Student profile opened for:', student.name);
    } catch (error) {
        console.error('❌ Error opening student profile:', error);
        showNotification('Failed to open student profile', 'error');
    }
}

function closeStudentModal() {
    try {
        const modal = document.getElementById('studentModal');
        modal.style.display = 'none';
        
        // Destroy charts to prevent memory leaks
        Object.keys(performanceCharts).forEach(key => {
            if (performanceCharts[key]) {
                performanceCharts[key].destroy();
            }
        });
        performanceCharts = {};
        
        currentStudent = null;
        console.log('👤 Student profile modal closed');
    } catch (error) {
        console.error('❌ Error closing student modal:', error);
    }
}

function populateProfileHeader(student) {
    try {
        const profileHeader = document.getElementById('profileHeader');
        const initials = getInitials(student.name);
        const className = getClassName(student.class);
        
        profileHeader.innerHTML = `
            <div class="profile-header-content">
                <div class="profile-photo-large">
                    ${student.photo ? `<img src="${student.photo}" alt="${student.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` : initials}
                </div>
                <div class="profile-header-info">
                    <h2>${student.name}</h2>
                    <p><i class="fas fa-id-card"></i> ${student.rollNo}</p>
                    <p><i class="fas fa-graduation-cap"></i> ${className}</p>
                    <p><i class="fas fa-envelope"></i> ${student.email}</p>
                    <p><i class="fas fa-phone"></i> ${student.phone}</p>
                </div>
            </div>
            <div class="profile-quick-stats">
                <div class="profile-quick-stat">
                    <div class="stat-value">${student.performance.currentGPA}</div>
                    <div class="stat-label">Current GPA</div>
                </div>
                <div class="profile-quick-stat">
                    <div class="stat-value">${student.attendance.percentage}%</div>
                    <div class="stat-label">Attendance</div>
                </div>
                <div class="profile-quick-stat">
                    <div class="stat-value">#${student.performance.rank}</div>
                    <div class="stat-label">Class Rank</div>
                </div>
                <div class="profile-quick-stat">
                    <div class="stat-value">${student.performance.totalCredits}</div>
                    <div class="stat-label">Total Credits</div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('❌ Error populating profile header:', error);
    }
}

function switchProfileTab(tabName) {
    try {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick="switchProfileTab('${tabName}')"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.profile-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Load tab-specific content
        switch(tabName) {
            case 'overview':
                loadOverviewTab(currentStudent);
                break;
            case 'performance':
                loadPerformanceTab(currentStudent);
                break;
            case 'attendance':
                loadAttendanceTab(currentStudent);
                break;
            case 'contact':
                loadContactTab(currentStudent);
                break;
            case 'notes':
                loadNotesTab(currentStudent);
                break;
        }
        
        console.log('📑 Profile tab switched to:', tabName);
    } catch (error) {
        console.error('❌ Error switching profile tab:', error);
    }
}

function loadOverviewTab(student) {
    try {
        const overviewStats = document.getElementById('overviewStats');
        const recentActivities = document.getElementById('recentActivities');
        
        // Load overview stats
        overviewStats.innerHTML = `
            <div class="overview-stat-card">
                <h4><i class="fas fa-chart-bar"></i> Academic Performance</h4>
                <div class="overview-stat-grid">
                    <div class="overview-stat-item">
                        <div class="stat-value">${student.performance.averageGrade}%</div>
                        <div class="stat-label">Avg Grade</div>
                    </div>
                    <div class="overview-stat-item">
                        <div class="stat-value">${student.assignments.filter(a => a.grade !== null).length}</div>
                        <div class="stat-label">Completed</div>
                    </div>
                    <div class="overview-stat-item">
                        <div class="stat-value">${student.assignments.filter(a => a.grade === null).length}</div>
                        <div class="stat-label">Pending</div>
                    </div>
                    <div class="overview-stat-item">
                        <div class="stat-value">${Object.keys(student.subjects).length}</div>
                        <div class="stat-label">Subjects</div>
                    </div>
                </div>
            </div>
            <div class="overview-stat-card">
                <h4><i class="fas fa-calendar-check"></i> Attendance Summary</h4>
                <div class="overview-stat-grid">
                    <div class="overview-stat-item">
                        <div class="stat-value">${student.attendance.present}</div>
                        <div class="stat-label">Present</div>
                    </div>
                    <div class="overview-stat-item">
                        <div class="stat-value">${student.attendance.absent}</div>
                        <div class="stat-label">Absent</div>
                    </div>
                    <div class="overview-stat-item">
                        <div class="stat-value">${student.attendance.total}</div>
                        <div class="stat-label">Total</div>
                    </div>
                    <div class="overview-stat-item">
                        <div class="stat-value">${student.attendance.percentage}%</div>
                        <div class="stat-label">Percentage</div>
                    </div>
                </div>
            </div>
        `;
        
        // Load recent activities
        const activitiesHTML = student.activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
        
        recentActivities.innerHTML = `
            <h4><i class="fas fa-clock"></i> Recent Activities</h4>
            <div class="activity-list">
                ${activitiesHTML}
            </div>
        `;
        
        console.log('📊 Overview tab loaded');
    } catch (error) {
        console.error('❌ Error loading overview tab:', error);
    }
}

function loadPerformanceTab(student) {
    try {
        const assignmentsHistory = document.getElementById('assignmentsHistory');
        
        // Load assignments history
        const assignmentsHTML = student.assignments.map(assignment => {
            const gradeClass = assignment.grade ? getGradeClass(assignment.grade, assignment.maxGrade) : 'grade-pending';
            const gradeText = assignment.grade ? 
                `${assignment.grade}/${assignment.maxGrade}` : 
                'Pending';
            const dateText = assignment.submittedOn ? 
                formatDate(new Date(assignment.submittedOn)) : 
                'Not submitted';
            
            return `
                <div class="assignment-history-item">
                    <div class="assignment-history-info">
                        <div class="assignment-history-title">${assignment.title}</div>
                        <div class="assignment-history-date">${dateText}</div>
                    </div>
                    <div class="assignment-grade ${gradeClass}">${gradeText}</div>
                </div>
            `;
        }).join('');
        
        assignmentsHistory.innerHTML = `
            <h4><i class="fas fa-tasks"></i> Assignment History</h4>
            ${assignmentsHTML}
        `;
        
        // Create performance charts
        setTimeout(() => {
            createPerformanceCharts(student);
        }, 100);
        
        console.log('📈 Performance tab loaded');
    } catch (error) {
        console.error('❌ Error loading performance tab:', error);
    }
}

function createPerformanceCharts(student) {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const isDark = currentTheme === 'dark';
        
        const textColor = isDark ? '#cbd5e1' : '#64748b';
        const gridColor = isDark ? '#475569' : '#e2e8f0';
        
        // Grade Trends Chart
        const gradeCtx = document.getElementById('gradeChart');
        if (gradeCtx) {
            if (performanceCharts.gradeChart) {
                performanceCharts.gradeChart.destroy();
            }
            
            performanceCharts.gradeChart = new Chart(gradeCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                    datasets: [{
                        label: 'Grade Trend',
                        data: generateGradeTrendData(student.performance.averageGrade),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: textColor
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: {
                                color: gridColor
                            },
                            ticks: {
                                color: textColor
                            }
                        },
                        x: {
                            grid: {
                                color: gridColor
                            },
                            ticks: {
                                color: textColor
                            }
                        }
                    }
                }
            });
        }
        
        // Subject Performance Chart
        const subjectCtx = document.getElementById('subjectChart');
        if (subjectCtx) {
            if (performanceCharts.subjectChart) {
                performanceCharts.subjectChart.destroy();
            }
            
            const subjects = Object.keys(student.subjects);
            const grades = subjects.map(subject => student.subjects[subject].grade);
            
            performanceCharts.subjectChart = new Chart(subjectCtx, {
                type: 'radar',
                data: {
                    labels: subjects,
                    datasets: [{
                        label: 'Subject Performance',
                        data: grades,
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.2)',
                        borderWidth: 2,
                        pointBackgroundColor: '#2563eb',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: textColor
                            }
                        }
                    },
                    scales: {
                        r: {
                            angleLines: {
                                color: gridColor
                            },
                            grid: {
                                color: gridColor
                            },
                            pointLabels: {
                                color: textColor
                            },
                            ticks: {
                                color: textColor,
                                backdropColor: 'transparent'
                            },
                            min: 0,
                            max: 100
                        }
                    }
                }
            });
        }
        
        console.log('📊 Performance charts created');
    } catch (error) {
        console.error('❌ Error creating performance charts:', error);
    }
}

function generateGradeTrendData(currentGrade) {
    // Generate realistic grade trend data based on current performance
    const trend = [];
    let grade = Math.max(40, currentGrade - Math.random() * 15);
    
    for (let i = 0; i < 8; i++) {
        trend.push(Math.round(grade));
        // Simulate gradual improvement or decline
        const change = (Math.random() - 0.4) * 10;
        grade = Math.min(100, Math.max(30, grade + change));
    }
    
    // Ensure last value is close to current grade
    trend[trend.length - 1] = currentGrade;
    
    return trend;
}

function loadAttendanceTab(student) {
    try {
        const attendanceOverview = document.getElementById('attendanceOverview');
        const attendanceCalendar = document.getElementById('attendanceCalendar');
        
        // Load attendance overview
        attendanceOverview.innerHTML = `
            <div class="attendance-stat-card">
                <h4><i class="fas fa-percentage"></i> Attendance Statistics</h4>
                <div class="overview-stat-grid">
                    <div class="overview-stat-item">
                        <div class="stat-value">${student.attendance.percentage}%</div>
                        <div class="stat-label">Overall</div>
                    </div>
                    <div class="overview-stat-item">
                        <div class="stat-value">${Math.round((student.attendance.present / student.attendance.total) * 30)}</div>
                        <div class="stat-label">This Month</div>
                    </div>
                    <div class="overview-stat-item">
                        <div class="stat-value">${Math.max(0, 75 - student.attendance.percentage)}%</div>
                        <div class="stat-label">To 75%</div>
                    </div>
                    <div class="overview-stat-item">
                        <div class="stat-value">${student.attendance.absent > 10 ? 'Yes' : 'No'}</div>
                        <div class="stat-label">At Risk</div>
                    </div>
                </div>
            </div>
            <div class="attendance-stat-card">
                <h4><i class="fas fa-chart-pie"></i> Subject-wise Attendance</h4>
                <div class="overview-stat-grid">
                    ${Object.keys(student.subjects).map(subject => `
                        <div class="overview-stat-item">
                            <div class="stat-value">${student.subjects[subject].attendance}%</div>
                            <div class="stat-label">${subject.split(' ').slice(0, 2).join(' ')}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Generate attendance calendar
        const calendar = generateAttendanceCalendar(student);
        attendanceCalendar.innerHTML = `
            <h4><i class="fas fa-calendar-alt"></i> Attendance Calendar - Current Month</h4>
            <div class="calendar-legend" style="display: flex; gap: 15px; margin-bottom: 15px; font-size: 0.8rem;">
                <span><div style="width: 12px; height: 12px; background: var(--accent-green); border-radius: 3px; display: inline-block; margin-right: 5px;"></div>Present</span>
                <span><div style="width: 12px; height: 12px; background: var(--accent-red); border-radius: 3px; display: inline-block; margin-right: 5px;"></div>Absent</span>
                <span><div style="width: 12px; height: 12px; background: var(--accent-yellow); border-radius: 3px; display: inline-block; margin-right: 5px;"></div>Holiday</span>
                <span><div style="width: 12px; height: 12px; border: 2px solid var(--accent-blue); border-radius: 3px; display: inline-block; margin-right: 5px;"></div>Today</span>
            </div>
            ${calendar}
        `;
        
        console.log('📅 Attendance tab loaded');
    } catch (error) {
        console.error('❌ Error loading attendance tab:', error);
    }
}

function generateAttendanceCalendar(student) {
    try {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        
        let calendarHTML = '<div class="calendar-grid">';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            calendarHTML += `<div style="font-weight: 600; text-align: center; padding: 8px; color: var(--text-secondary);">${day}</div>`;
        });
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += '<div class="calendar-day"></div>';
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === today.getDate();
            const dayType = generateDayType(day, student.attendance.percentage);
            
            let dayClass = 'calendar-day';
            if (dayType !== 'none') dayClass += ` ${dayType}`;
            if (isToday) dayClass += ' today';
            
            calendarHTML += `<div class="${dayClass}">${day}</div>`;
        }
        
        calendarHTML += '</div>';
        return calendarHTML;
    } catch (error) {
        console.error('❌ Error generating attendance calendar:', error);
        return '<p>Error loading calendar</p>';
    }
}

function generateDayType(day, attendancePercent) {
    // Skip weekends and future dates
    const today = new Date().getDate();
    const dayOfWeek = new Date(new Date().getFullYear(), new Date().getMonth(), day).getDay();
    
    if (day > today || dayOfWeek === 0 || dayOfWeek === 6) {
        return 'none';
    }
    
    // Generate random attendance based on student's overall attendance
    const random = Math.random() * 100;
    
    if (random < 5) return 'holiday'; // 5% holidays
    if (random < attendancePercent) return 'present';
    return 'absent';
}

function loadContactTab(student) {
    try {
        const contactForm = document.getElementById('contactForm');
        const communicationHistory = document.getElementById('communicationHistory');
        
        // Load contact information
        contactForm.innerHTML = `
            <div class="contact-section">
                <h4><i class="fas fa-user"></i> Student Information</h4>
                <div class="contact-field">
                    <div class="contact-label">Full Name</div>
                    <div class="contact-value">${student.name}</div>
                </div>
                <div class="contact-field">
                    <div class="contact-label">Email</div>
                    <div class="contact-value">${student.email}</div>
                </div>
                <div class="contact-field">
                    <div class="contact-label">Phone</div>
                    <div class="contact-value">${student.phone}</div>
                </div>
                <div class="contact-field">
                    <div class="contact-label">Date of Birth</div>
                    <div class="contact-value">${formatDate(new Date(student.dateOfBirth))}</div>
                </div>
                <div class="contact-field">
                    <div class="contact-label">Address</div>
                    <div class="contact-value">${student.address}</div>
                </div>
            </div>
            
            <div class="contact-section">
                <h4><i class="fas fa-male"></i> Father's Information</h4>
                <div class="contact-field">
                    <div class="contact-label">Name</div>
                    <div class="contact-value">${student.parents.father.name}</div>
                </div>
                <div class="contact-field">
                    <div class="contact-label">Phone</div>
                    <div class="contact-value">${student.parents.father.phone}</div>
                </div>
                <div class="contact-field">
                    <div class="contact-label">Email</div>
                    <div class="contact-value">${student.parents.father.email}</div>
                </div>
                <div class="contact-field">
                    <div class="contact-label">Occupation</div>
                    <div class="contact-value">${student.parents.father.occupation}</div>
                </div>
            </div>
            
            <div class="contact-section">
                <h4><i class="fas fa-female"></i> Mother's Information</h4>
                <div class="contact-field">
                    <div class="contact-label">Name</div>
                    <div class="contact-value">${student.parents.mother.name}</div>
                </div>
                <div class="contact-field">
                    <div class="contact-label">Phone</div>
                    <div class="contact-value">${student.parents.mother.phone}</div>
                </div>
                <div class="contact-field">
                    <div class="contact-label">Email</div>
                    <div class="contact-value">${student.parents.mother.email}</div>
                </div>
                <div class="contact-field">
                    <div class="contact-label">Occupation</div>
                    <div class="contact-value">${student.parents.mother.occupation}</div>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="sendMessageToParent('${student.id}')">
                    <i class="fas fa-envelope"></i> Send Message
                </button>
                <button class="btn btn-info" onclick="scheduleParentMeeting('${student.id}')">
                    <i class="fas fa-calendar"></i> Schedule Meeting
                </button>
                <button class="btn btn-secondary" onclick="editStudentContact('${student.id}')">
                    <i class="fas fa-edit"></i> Edit Contact Info
                </button>
            </div>
        `;
        
        // Load communication history (mock data)
        const communications = [
            { type: 'email', subject: 'Monthly Progress Report', date: '2025-08-15', icon: 'fas fa-envelope' },
            { type: 'call', subject: 'Discussed attendance concerns', date: '2025-08-10', icon: 'fas fa-phone' },
            { type: 'meeting', subject: 'Parent-Teacher Meeting', date: '2025-08-05', icon: 'fas fa-handshake' }
        ];
        
        const communicationsHTML = communications.map(comm => `
            <div class="communication-item">
                <div class="communication-icon">
                    <i class="${comm.icon}"></i>
                </div>
                <div class="communication-content">
                    <div class="communication-subject">${comm.subject}</div>
                    <div class="communication-date">${formatDate(new Date(comm.date))}</div>
                </div>
            </div>
        `).join('');
        
        communicationHistory.innerHTML = `
            <h4><i class="fas fa-history"></i> Communication History</h4>
            ${communicationsHTML}
        `;
        
        console.log('📞 Contact tab loaded');
    } catch (error) {
        console.error('❌ Error loading contact tab:', error);
    }
}

function loadNotesTab(student) {
    try {
        const notesList = document.getElementById('notesList');
        
        const notesHTML = student.notes.map(note => `
            <div class="note-item ${note.important ? 'important' : ''}">
                <div class="note-header">
                    <div class="note-date">
                        ${formatDate(new Date(note.date))} • ${note.category}
                        ${note.important ? '<i class="fas fa-star" style="color: var(--accent-yellow); margin-left: 5px;"></i>' : ''}
                    </div>
                    <div class="note-actions">
                        <button class="note-action-btn" onclick="editNote('${note.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="note-action-btn" onclick="deleteNote('${note.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="note-content">${note.content}</div>
            </div>
        `).join('');
        
        notesList.innerHTML = notesHTML || '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No notes available for this student.</p>';
        
        console.log('📝 Notes tab loaded');
    } catch (error) {
        console.error('❌ Error loading notes tab:', error);
    }
}

// Filtering and Sorting
function filterStudents() {
    try {
        const classFilter = document.getElementById('classFilter').value;
        const performanceFilter = document.getElementById('performanceFilter').value;
        const attendanceFilter = document.getElementById('attendanceFilter').value;
        const searchTerm = document.getElementById('studentSearch').value.toLowerCase().trim();
        
        filteredStudents = students.filter(student => {
            // Class filter
            if (classFilter !== 'all' && student.class !== classFilter) {
                return false;
            }
            
            // Performance filter
            if (performanceFilter !== 'all') {
                const grade = student.performance.averageGrade;
                if (performanceFilter === 'excellent' && grade < 90) return false;
                if (performanceFilter === 'good' && (grade < 75 || grade >= 90)) return false;
                if (performanceFilter === 'average' && (grade < 60 || grade >= 75)) return false;
                if (performanceFilter === 'poor' && grade >= 60) return false;
            }
            
            // Attendance filter
            if (attendanceFilter !== 'all') {
                const attendance = student.attendance.percentage;
                if (attendanceFilter === 'high' && attendance < 90) return false;
                if (attendanceFilter === 'medium' && (attendance < 75 || attendance >= 90)) return false;
                if (attendanceFilter === 'low' && attendance >= 75) return false;
            }
            
            // Search filter
            if (searchTerm && 
                !student.name.toLowerCase().includes(searchTerm) && 
                !student.rollNo.toLowerCase().includes(searchTerm) &&
                !student.email.toLowerCase().includes(searchTerm)) {
                return false;
            }
            
            return true;
        });
        
        sortStudents();
        console.log('🔍 Students filtered:', filteredStudents.length);
    } catch (error) {
        console.error('❌ Error filtering students:', error);
        showNotification('Error filtering students', 'error');
    }
}

function sortStudents() {
    try {
        const sortBy = document.getElementById('sortBy').value;
        
        filteredStudents.sort((a, b) => {
            switch(sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'rollno':
                    return a.rollNo.localeCompare(b.rollNo);
                case 'performance':
                    return b.performance.averageGrade - a.performance.averageGrade;
                case 'attendance':
                    return b.attendance.percentage - a.attendance.percentage;
                default:
                    return 0;
            }
        });
        
        renderStudents();
        console.log('🔄 Students sorted by:', sortBy);
    } catch (error) {
        console.error('❌ Error sorting students:', error);
    }
}

function refreshStudents() {
    try {
        // Reset filters
        document.getElementById('classFilter').value = 'all';
        document.getElementById('performanceFilter').value = 'all';
        document.getElementById('attendanceFilter').value = 'all';
        document.getElementById('studentSearch').value = '';
        document.getElementById('sortBy').value = 'name';
        
        // Refresh data
        filteredStudents = [...students];
        renderStudents();
        loadStudentStats();
        
        showNotification('Student data refreshed!', 'info');
        console.log('🔄 Students refreshed');
    } catch (error) {
        console.error('❌ Error refreshing students:', error);
        showNotification('Failed to refresh students', 'error');
    }
}

// Student Management
function addNewStudent() {
    try {
        const modal = document.getElementById('addStudentModal');
        const modalTitle = document.getElementById('addStudentModalTitle');
        
        modalTitle.textContent = 'Add New Student';
        resetStudentForm();
        
        modal.style.display = 'flex';
        console.log('➕ Add student modal opened');
    } catch (error) {
        console.error('❌ Error opening add student modal:', error);
        showNotification('Failed to open add student form', 'error');
    }
}

function closeAddStudentModal() {
    try {
        const modal = document.getElementById('addStudentModal');
        modal.style.display = 'none';
        resetStudentForm();
        console.log('➕ Add student modal closed');
    } catch (error) {
        console.error('❌ Error closing add student modal:', error);
    }
}

function resetStudentForm() {
    try {
        const form = document.getElementById('studentForm');
        if (form) {
            form.reset();
        }
        console.log('📝 Student form reset');
    } catch (error) {
        console.error('❌ Error resetting student form:', error);
    }
}

function saveStudent() {
    try {
        const formData = getStudentFormData();
        
        if (!validateStudentForm(formData)) {
            return;
        }
        
        // Create new student object
        const newStudent = {
            id: 'stud-' + Date.now().toString().slice(-3),
            ...formData,
            performance: {
                currentGPA: 0,
                averageGrade: 0,
                rank: students.length + 1,
                totalCredits: 0
            },
            attendance: {
                percentage: 0,
                present: 0,
                absent: 0,
                total: 0
            },
            subjects: {},
            assignments: [],
            notes: [],
            activities: [
                { type: 'enrollment', title: 'Student enrolled in the system', time: 'just now', icon: 'fas fa-user-plus' }
            ],
            status: 'active',
            riskLevel: 'low',
            lastActivity: new Date().toISOString()
        };
        
        // Add to students array
        students.unshift(newStudent);
        filteredStudents = [...students];
        
        // Update UI
        renderStudents();
        loadStudentStats();
        closeAddStudentModal();
        
        showNotification(`Student ${formData.name} added successfully!`, 'success');
        console.log('👤 New student added:', formData.name);
    } catch (error) {
        console.error('❌ Error saving student:', error);
        showNotification('Failed to save student', 'error');
    }
}

function getStudentFormData() {
    return {
        name: document.getElementById('studentName').value.trim(),
        rollNo: document.getElementById('studentRollNo').value.trim(),
        email: document.getElementById('studentEmail').value.trim(),
        phone: document.getElementById('studentPhone').value.trim(),
        class: document.getElementById('studentClass').value,
        dateOfBirth: document.getElementById('studentDOB').value,
        address: document.getElementById('studentAddress').value.trim(),
        parents: {
            father: {
                name: document.getElementById('fatherName').value.trim(),
                phone: document.getElementById('fatherPhone').value.trim(),
                email: document.getElementById('fatherEmail').value.trim(),
                occupation: 'Not specified'
            },
            mother: {
                name: document.getElementById('motherName').value.trim(),
                phone: document.getElementById('motherPhone').value.trim(),
                email: document.getElementById('motherEmail').value.trim(),
                occupation: 'Not specified'
            }
        },
        photo: null
    };
}

function validateStudentForm(formData) {
    const errors = [];
    
    if (!formData.name) errors.push('Student name is required');
    if (!formData.rollNo) errors.push('Roll number is required');
    if (!formData.email) errors.push('Email is required');
    if (!formData.class) errors.push('Class selection is required');
    
    // Check for duplicate roll number
    if (students.some(s => s.rollNo === formData.rollNo)) {
        errors.push('Roll number already exists');
    }
    
    // Check for duplicate email
    if (students.some(s => s.email === formData.email)) {
        errors.push('Email already exists');
    }
    
    if (errors.length > 0) {
        showNotification(errors[0], 'error');
        return false;
    }
    
    return true;
}

function editStudent(studentId) {
    try {
        const student = students.find(s => s.id === studentId);
        if (!student) {
            showNotification('Student not found', 'error');
            return;
        }
        
        // This would open the edit modal with pre-filled data
        // For demo purposes, just show a notification
        showNotification(`Edit functionality for ${student.name} would open here`, 'info');
        console.log('✏️ Edit student:', student.name);
    } catch (error) {
        console.error('❌ Error editing student:', error);
        showNotification('Failed to edit student', 'error');
    }
}

// Parent Communication
function sendMessageToParent(studentId) {
    try {
        const student = students.find(s => s.id === studentId);
        if (!student) {
            showNotification('Student not found', 'error');
            return;
        }
        
        const modal = document.getElementById('communicationModal');
        const recipientList = document.getElementById('recipientList');
        
        // Populate recipients
        recipientList.innerHTML = `
            <div class="recipient-item">
                <input type="checkbox" id="father-${studentId}" checked>
                <label for="father-${studentId}">${student.parents.father.name} (Father) - ${student.parents.father.email}</label>
            </div>
            <div class="recipient-item">
                <input type="checkbox" id="mother-${studentId}" checked>
                <label for="mother-${studentId}">${student.parents.mother.name} (Mother) - ${student.parents.mother.email}</label>
            </div>
        `;
        
        // Store current student for message sending
        modal.setAttribute('data-student-id', studentId);
        
        modal.style.display = 'flex';
        console.log('📧 Communication modal opened for:', student.name);
    } catch (error) {
        console.error('❌ Error opening communication modal:', error);
        showNotification('Failed to open message composer', 'error');
    }
}

function closeCommunicationModal() {
    try {
        const modal = document.getElementById('communicationModal');
        modal.style.display = 'none';
        modal.removeAttribute('data-student-id');
        
        // Clear form
        document.getElementById('messageType').value = 'general';
        document.getElementById('messageSubject').value = '';
        document.getElementById('messageContent').value = '';
        
        console.log('📧 Communication modal closed');
    } catch (error) {
        console.error('❌ Error closing communication modal:', error);
    }
}

function insertTemplate(templateType) {
    try {
        const modal = document.getElementById('communicationModal');
        const studentId = modal.getAttribute('data-student-id');
        const student = students.find(s => s.id === studentId);
        
        if (!student) return;
        
        const template = MESSAGE_TEMPLATES[templateType];
        if (!template) return;
        
        // Replace placeholders
        const replacements = {
            '{studentName}': student.name,
            '{parentName}': student.parents.father.name,
            '{gpa}': student.performance.currentGPA,
            '{rank}': student.performance.rank,
            '{attendance}': student.attendance.percentage,
            '{subjects}': Object.keys(student.subjects).join(', '),
            '{absentDays}': student.attendance.absent,
            '{totalClasses}': student.attendance.total,
            '{teacherName}': currentUser.name,
            '{department}': currentUser.department
        };
        
        let subject = template.subject;
        let content = template.content;
        
        Object.keys(replacements).forEach(placeholder => {
            subject = subject.replace(new RegExp(placeholder, 'g'), replacements[placeholder]);
            content = content.replace(new RegExp(placeholder, 'g'), replacements[placeholder]);
        });
        
        // Fill form
        document.getElementById('messageSubject').value = subject;
        document.getElementById('messageContent').value = content;
        
        console.log('📝 Message template inserted:', templateType);
    } catch (error) {
        console.error('❌ Error inserting template:', error);
    }
}

function sendMessage() {
    try {
        const modal = document.getElementById('communicationModal');
        const studentId = modal.getAttribute('data-student-id');
        const student = students.find(s => s.id === studentId);
        
        if (!student) {
            showNotification('Student not found', 'error');
            return;
        }
        
        const subject = document.getElementById('messageSubject').value.trim();
        const content = document.getElementById('messageContent').value.trim();
        
        if (!subject || !content) {
            showNotification('Please fill in subject and message', 'error');
            return;
        }
        
        // Get selected recipients
        const recipients = [];
        if (document.getElementById(`father-${studentId}`).checked) {
            recipients.push(student.parents.father.name);
        }
        if (document.getElementById(`mother-${studentId}`).checked) {
            recipients.push(student.parents.mother.name);
        }
        
        if (recipients.length === 0) {
            showNotification('Please select at least one recipient', 'error');
            return;
        }
        
        // Simulate sending message
        showNotification('Sending message...', 'info');
        
        setTimeout(() => {
            closeCommunicationModal();
            showNotification(`Message sent successfully to ${recipients.join(' and ')}!`, 'success');
            
            // Add to student's activities
            student.activities.unshift({
                type: 'communication',
                title: `Message sent to parents: "${subject}"`,
                time: 'just now',
                icon: 'fas fa-envelope'
            });
            
            console.log('📧 Message sent to:', recipients.join(', '));
        }, 2000);
    } catch (error) {
        console.error('❌ Error sending message:', error);
        showNotification('Failed to send message', 'error');
    }
}

function scheduleParentMeeting(studentId) {
    try {
        const student = students.find(s => s.id === studentId);
        if (!student) {
            showNotification('Student not found', 'error');
            return;
        }
        
        // This would open a meeting scheduler
        // For demo purposes, just show a notification
        showNotification(`Meeting scheduler for ${student.name}'s parents would open here`, 'info');
        console.log('📅 Schedule meeting for:', student.name);
    } catch (error) {
        console.error('❌ Error scheduling meeting:', error);
    }
}

// Notes Management
function addNewNote() {
    try {
        if (!currentStudent) return;
        
        const noteContent = prompt('Enter your note:');
        if (!noteContent || !noteContent.trim()) return;
        
        const newNote = {
            id: 'note-' + Date.now(),
            content: noteContent.trim(),
            date: new Date().toISOString().split('T')[0],
            important: false,
            category: 'General'
        };
        
        currentStudent.notes.unshift(newNote);
        loadNotesTab(currentStudent);
        
        showNotification('Note added successfully!', 'success');
        console.log('📝 Note added for:', currentStudent.name);
    } catch (error) {
        console.error('❌ Error adding note:', error);
        showNotification('Failed to add note', 'error');
    }
}

function editNote(noteId) {
    try {
        if (!currentStudent) return;
        
        const note = currentStudent.notes.find(n => n.id === noteId);
        if (!note) return;
        
        const newContent = prompt('Edit note:', note.content);
        if (newContent !== null && newContent.trim()) {
            note.content = newContent.trim();
            loadNotesTab(currentStudent);
            showNotification('Note updated successfully!', 'success');
        }
        
        console.log('✏️ Note edited:', noteId);
    } catch (error) {
        console.error('❌ Error editing note:', error);
        showNotification('Failed to edit note', 'error');
    }
}

function deleteNote(noteId) {
    try {
        if (!currentStudent) return;
        
        if (confirm('Are you sure you want to delete this note?')) {
            currentStudent.notes = currentStudent.notes.filter(n => n.id !== noteId);
            loadNotesTab(currentStudent);
            showNotification('Note deleted successfully!', 'success');
            console.log('🗑️ Note deleted:', noteId);
        }
    } catch (error) {
        console.error('❌ Error deleting note:', error);
        showNotification('Failed to delete note', 'error');
    }
}

function markImportant() {
    try {
        showNotification('Mark important functionality would be implemented here', 'info');
        console.log('⭐ Mark important clicked');
    } catch (error) {
        console.error('❌ Error marking important:', error);
    }
}

// Data Export/Import
function exportStudentData() {
    try {
        showNotification('Preparing export...', 'info');
        
        setTimeout(() => {
            const csvData = createStudentCSV();
            downloadCSV(csvData, 'student_data.csv');
            showNotification('Student data exported successfully!', 'success');
            console.log('📤 Student data exported');
        }, 1500);
    } catch (error) {
        console.error('❌ Error exporting student data:', error);
        showNotification('Failed to export student data', 'error');
    }
}

function createStudentCSV() {
    const headers = [
        'Name', 'Roll No', 'Email', 'Phone', 'Class', 'GPA', 'Average Grade', 
        'Attendance %', 'Rank', 'Risk Level', 'Father Name', 'Mother Name'
    ];
    const rows = [headers.join(',')];
    
    students.forEach(student => {
        const row = [
            `"${student.name}"`,
            student.rollNo,
            student.email,
            student.phone,
            student.class,
            student.performance.currentGPA,
            student.performance.averageGrade,
            student.attendance.percentage,
            student.performance.rank,
            student.riskLevel,
            `"${student.parents.father.name}"`,
            `"${student.parents.mother.name}"`
        ];
        rows.push(row.join(','));
    });
    
    return rows.join('\n');
}

function downloadCSV(csvData, filename) {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function importStudentData() {
    try {
        showNotification('CSV import functionality would be implemented here', 'info');
        console.log('📥 Import student data clicked');
    } catch (error) {
        console.error('❌ Error importing student data:', error);
    }
}

// Utility Functions
function getInitials(name) {
    return name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
}

function getClassName(classCode) {
    const classMap = {
        'cs-2a': 'BTech CS - 2A',
        'cs-2b': 'BTech CS - 2B',
        'it-3a': 'BTech IT - 3A',
        'mca-1': 'MCA - 1st Year'
    };
    return classMap[classCode] || classCode;
}

function getPerformanceClass(grade) {
    if (grade >= 90) return 'performance-excellent';
    if (grade >= 75) return 'performance-good';
    if (grade >= 60) return 'performance-average';
    return 'performance-poor';
}

function getAttendanceClass(attendance) {
    if (attendance >= 90) return 'attendance-high';
    if (attendance >= 75) return 'attendance-medium';
    return 'attendance-low';
}

function getGradeClass(grade, maxGrade) {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return 'grade-excellent';
    if (percentage >= 75) return 'grade-good';
    if (percentage >= 60) return 'grade-average';
    if (percentage < 60) return 'grade-poor';
    return 'grade-pending';
}

function formatDate(date) {
    try {
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error('❌ Error formatting date:', error);
        return 'Invalid Date';
    }
}

function formatRelativeTime(date) {
    try {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return formatDate(date);
    } catch (error) {
        return 'recently';
    }
}

function showNotification(message, type = 'info') {
    try {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        // Remove existing classes
        notification.className = 'notification';
        
        // Add type class
        notification.classList.add(type);
        
        // Set icon based on type
        const icon = notification.querySelector('.notification-icon');
        const text = notification.querySelector('.notification-text');
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        if (icon) icon.className = `notification-icon ${icons[type] || icons.info}`;
        if (text) text.textContent = message;
        
        // Show notification
        notification.classList.add('show');
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
        
        console.log(`🔔 ${type.toUpperCase()}:`, message);
    } catch (error) {
        console.error('❌ Error showing notification:', error);
        // Fallback to alert
        alert(message);
    }
}

// Event Listeners
function initializeEventListeners() {
    try {
        // Form submission
        const studentForm = document.getElementById('studentForm');
        if (studentForm) {
            studentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveStudent();
            });
        }
        
        // Close modals when clicking outside
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
        
        // Close sidebar when clicking on links (mobile)
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.addEventListener('click', closeMobileSidebar);
        });
        
        // Real-time search
        const searchInput = document.getElementById('studentSearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(filterStudents, 300);
            });
        }
        
        console.log('🎛️ Event listeners initialized');
    } catch (error) {
        console.error('❌ Error initializing event listeners:', error);
    }
}

function initializeFormValidation() {
    try {
        // Add real-time validation
        const nameInput = document.getElementById('studentName');
        const rollNoInput = document.getElementById('studentRollNo');
        const emailInput = document.getElementById('studentEmail');
        
        if (nameInput) {
            nameInput.addEventListener('input', validateName);
        }
        
        if (rollNoInput) {
            rollNoInput.addEventListener('input', validateRollNo);
        }
        
        if (emailInput) {
            emailInput.addEventListener('input', validateEmail);
        }
        
        console.log('✅ Form validation initialized');
    } catch (error) {
        console.error('❌ Error initializing form validation:', error);
    }
}

function validateName() {
    const nameInput = document.getElementById('studentName');
    const name = nameInput.value.trim();
    
    if (name.length < 2) {
        nameInput.setCustomValidity('Name must be at least 2 characters long');
    } else if (name.length > 50) {
        nameInput.setCustomValidity('Name must not exceed 50 characters');
    } else {
        nameInput.setCustomValidity('');
    }
}

function validateRollNo() {
    const rollNoInput = document.getElementById('studentRollNo');
    const rollNo = rollNoInput.value.trim();
    
    if (rollNo.length < 5) {
        rollNoInput.setCustomValidity('Roll number must be at least 5 characters long');
    } else if (students.some(s => s.rollNo === rollNo)) {
        rollNoInput.setCustomValidity('This roll number already exists');
    } else {
        rollNoInput.setCustomValidity('');
    }
}

function validateEmail() {
    const emailInput = document.getElementById('studentEmail');
    const email = emailInput.value.trim();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        emailInput.setCustomValidity('Please enter a valid email address');
    } else if (students.some(s => s.email === email)) {
        emailInput.setCustomValidity('This email already exists');
    } else {
        emailInput.setCustomValidity('');
    }
}

// Global Functions (called from HTML)
function logout() {
    try {
        if (confirm('Are you sure you want to logout?')) {
            showNotification('Logging out...', 'info');
            
            // Clear any stored data
            localStorage.removeItem('currentUser');
            
            // Simulate logout delay
            setTimeout(() => {
                // In a real app, redirect to login page
                window.location.href = 'login.html';
            }, 1500);
            
            console.log('👋 User logged out');
        }
    } catch (error) {
        console.error('❌ Error during logout:', error);
        showNotification('Logout failed', 'error');
    }
}

// Export for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        students,
        showNotification,
        formatDate
    };
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('💥 Global error caught:', e.error);
    showNotification('An unexpected error occurred', 'error');
});

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.duration > 100) {
            console.warn('⚠️ Slow operation detected:', entry.name, entry.duration + 'ms');
        }
    }
});

if (typeof PerformanceObserver !== 'undefined') {
    performanceObserver.observe({ entryTypes: ['measure'] });
}

// Print debug info
console.log(`
🎓 Student Profiles System v2.0
📊 Features: Profile Management, Performance Charts, Parent Communication
📱 Mobile Responsive with Touch Support
🌙 Dark/Light Theme with Chart Integration
⚡ Real-time Filtering & Search
📈 Advanced Analytics with Chart.js
🔔 Smart Notifications System
📧 Message Templates & Communication
📝 Notes Management with Categories
📤 Data Export/Import Capabilities
`);

console.log('🚀 Student Profiles JS loaded successfully! All systems operational!');
