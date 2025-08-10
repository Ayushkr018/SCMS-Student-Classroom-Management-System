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
    updateCharts();
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

let gpaChart = null;
let subjectProgressChart = null;
let currentSemester = 'current';
let isChartVisible = true;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    initializeCharts();
    animateNumbers();
    
    // Close mobile sidebar when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
        updateCharts();
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

function initializeCharts() {
    // GPA Trend Chart
    const ctx = document.getElementById('gpaChart').getContext('2d');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    gpaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Current'],
            datasets: [{
                label: 'CGPA',
                data: [7.8, 8.1, 8.3, 8.4],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#8b5cf6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 7,
                    max: 10,
                    grid: {
                        color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        color: isDark ? '#cbd5e1' : '#64748b'
                    }
                },
                x: {
                    grid: {
                        color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        color: isDark ? '#cbd5e1' : '#64748b'
                    }
                }
            }
        }
    });
}

function animateNumbers() {
    animateValue(document.getElementById('currentGPA'), 0, 8.4, 2000, 1);
    animateValue(document.getElementById('earnedCredits'), 0, 84, 2000);
    animateValue(document.getElementById('attendanceRate'), 0, 92, 2000, 0, '%');
    
    // Animate grade values
    setTimeout(() => {
        const gradeValues = document.querySelectorAll('.grade-value');
        gradeValues.forEach(element => {
            const target = parseFloat(element.textContent);
            animateValue(element, 0, target, 1500, 1);
        });
    }, 500);
}

function animateValue(element, start, end, duration, decimals = 0, suffix = '') {
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

function switchSemester(semester) {
    currentSemester = semester;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update data based on semester
    updateSemesterData(semester);
    showNotification(`Switched to ${semester.replace('_', ' ')} view`, 'info');
}

function updateSemesterData(semester) {
    const semesterData = {
        current: { cgpa: 8.4, credits: 22, rank: '3rd' },
        sem1: { cgpa: 7.8, credits: 18, rank: '8th' },
        sem2: { cgpa: 8.1, credits: 20, rank: '5th' },
        sem3: { cgpa: 8.3, credits: 24, rank: '4th' },
        overall: { cgpa: 8.15, credits: 84, rank: '3rd' }
    };
    
    const data = semesterData[semester];
    
    animateValue(document.getElementById('currentGPA'), 0, data.cgpa, 1000, 1);
    animateValue(document.getElementById('earnedCredits'), 0, data.credits, 1000);
    document.getElementById('classRank').textContent = data.rank;
}

function viewSubjectDetails(subjectId) {
    const subjectData = {
        cs101: {
            title: 'CS101 - Data Structures & Algorithms',
            grade: 8.7
        },
        cs102: {
            title: 'CS102 - Object Oriented Programming',
            grade: 8.2
        },
        cs103: {
            title: 'CS103 - Database Management Systems',
            grade: 9.1
        },
        math201: {
            title: 'MATH201 - Applied Statistics',
            grade: 7.8
        },
        eng101: {
            title: 'ENG101 - Technical Communication',
            grade: 8.9
        }
    };
    
    const subject = subjectData[subjectId];
    if (subject) {
        document.getElementById('subjectModalTitle').textContent = subject.title;
        document.getElementById('subjectModal').classList.add('show');
        initializeSubjectChart(subject.grade);
    }
}

function closeSubjectModal() {
    document.getElementById('subjectModal').classList.remove('show');
    if (subjectProgressChart) {
        subjectProgressChart.destroy();
        subjectProgressChart = null;
    }
}

function initializeSubjectChart(currentGrade) {
    const ctx = document.getElementById('subjectProgressChart').getContext('2d');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    subjectProgressChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Assignment 1', 'Assignment 2', 'Quiz 1', 'Mid-term', 'Assignment 3', 'Quiz 2'],
            datasets: [{
                label: 'Grade',
                data: [8.5, 9.0, 9.5, 8.8, 9.2, 8.0],
                backgroundColor: [
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)'
                ],
                borderColor: [
                    '#8b5cf6',
                    '#10b981',
                    '#f59e0b',
                    '#3b82f6',
                    '#8b5cf6',
                    '#10b981'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 7,
                    max: 10,
                    grid: {
                        color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        color: isDark ? '#cbd5e1' : '#64748b'
                    }
                },
                x: {
                    grid: {
                        color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        color: isDark ? '#cbd5e1' : '#64748b'
                    }
                }
            }
        }
    });
}

function updateCharts() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (gpaChart) {
        gpaChart.options.scales.y.grid.color = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        gpaChart.options.scales.x.grid.color = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        gpaChart.options.scales.y.ticks.color = isDark ? '#cbd5e1' : '#64748b';
        gpaChart.options.scales.x.ticks.color = isDark ? '#cbd5e1' : '#64748b';
        gpaChart.update();
    }
    
    if (subjectProgressChart) {
        subjectProgressChart.options.scales.y.grid.color = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        subjectProgressChart.options.scales.x.grid.color = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        subjectProgressChart.options.scales.y.ticks.color = isDark ? '#cbd5e1' : '#64748b';
        subjectProgressChart.options.scales.x.ticks.color = isDark ? '#cbd5e1' : '#64748b';
        subjectProgressChart.update();
    }
}

function toggleChartView() {
    if (isChartVisible) {
        document.getElementById('gpaChart').style.display = 'none';
        showNotification('Chart hidden', 'info');
    } else {
        document.getElementById('gpaChart').style.display = 'block';
        updateCharts();
        showNotification('Chart visible', 'info');
    }
    isChartVisible = !isChartVisible;
}

function viewTrends() {
    showNotification('📈 Opening grade trends analysis...', 'info');
    setTimeout(() => {
        showNotification('📊 Trend analysis: Overall improving performance!', 'success');
    }, 2000);
}

function comparePerformance() {
    showNotification('⚖️ Comparing with class average...', 'info');
    setTimeout(() => {
        showNotification('📊 You are performing 12% above class average!', 'success');
    }, 2000);
}

function exportGrades() {
    showNotification('📄 Preparing grade report for export...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Grade report exported successfully!', 'success');
    }, 3000);
}

function refreshGrades() {
    showNotification('🔄 Refreshing grades data...', 'info');
    
    setTimeout(() => {
        // Simulate new grade addition
        const recentGrades = document.getElementById('recentGrades');
        const newGrade = document.createElement('div');
        newGrade.className = 'grade-item';
        newGrade.style.background = 'rgba(139, 92, 246, 0.1)';
        newGrade.innerHTML = `
            <div class="grade-item-info">
                <div class="grade-item-title">Algorithm Analysis Quiz</div>
                <div class="grade-item-subject">CS102 • Just now</div>
            </div>
            <div class="grade-item-score excellent">8.7</div>
        `;
        
        recentGrades.insertBefore(newGrade, recentGrades.firstChild);
        
        // Update GPA
        animateValue(document.getElementById('currentGPA'), 8.4, 8.5, 1000, 1);
        
        setTimeout(() => {
            newGrade.style.background = '';
        }, 3000);
        
        showNotification('✅ New grade added: Algorithm Analysis Quiz - 8.7/10', 'success');
    }, 2000);
}

function openAnalytics() {
    showNotification('📊 Opening advanced analytics dashboard...', 'info');
    setTimeout(() => {
        showNotification('📈 Analytics: Strong performance in programming subjects!', 'success');
    }, 1500);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type} show`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
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

// Close modal when clicking outside
document.getElementById('subjectModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeSubjectModal();
    }
});

// Simulate real-time grade updates
setInterval(() => {
    if (Math.random() > 0.9) {
        const subjects = ['CS101', 'CS102', 'CS103', 'MATH201', 'ENG101'];
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        showNotification(`📝 New assignment graded in ${randomSubject}!`, 'info');
    }
}, 45000); // Every 45 seconds

// Simulate achievement unlocking
setTimeout(() => {
    showNotification('🏆 Achievement Unlocked: Perfect Attendance Badge!', 'success');
}, 60000); // After 1 minute
