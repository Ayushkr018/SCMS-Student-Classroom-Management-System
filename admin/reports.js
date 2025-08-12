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

// Mock data for analytics
const ANALYTICS_DATA = {
    attendance: {
        overall: 89,
        departments: {
            computer_science: 92,
            mathematics: 87,
            physics: 85,
            chemistry: 78
        }
    },
    resources: {
        overall: 76,
        types: {
            projectors: 85,
            computers: 78,
            smartboards: 65
        }
    },
    engagement: {
        overall: 94,
        metrics: {
            polls: 96,
            questions: 88,
            responses: 92
        }
    },
    performance: {
        overall: 83,
        categories: {
            assignments: 87,
            quizzes: 82,
            projects: 79
        }
    }
};

// Load current user
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    animateCharts();
    startRealTimeUpdates();
    
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
    if (user.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('userName').textContent = user.name;
}

function logout() {
    localStorage.removeItem('scms_current_user');
    showNotification('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
}

function animateCharts() {
    // Animate progress bars
    setTimeout(() => {
        const progressFills = document.querySelectorAll('.progress-fill');
        progressFills.forEach(fill => {
            const width = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = width;
            }, 100);
        });
    }, 500);

    // Animate chart numbers
    setTimeout(() => {
        animateNumber(document.getElementById('attendancePercent'), 89, '%');
        animateNumber(document.getElementById('resourcePercent'), 76, '%');
        animateNumber(document.getElementById('engagementPercent'), 94, '%');
        animateNumber(document.getElementById('performancePercent'), 83, '%');
    }, 1000);
}

function animateNumber(element, target, suffix = '') {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 30);
}

function applyFilters() {
    const dateRange = document.getElementById('dateRange').value;
    const department = document.getElementById('department').value;
    const reportType = document.getElementById('reportType').value;

    showNotification(`Filters applied: ${dateRange}, ${department}, ${reportType}`, 'info');

    // Simulate data refresh with filters
    setTimeout(() => {
        updateChartsWithFilters(dateRange, department, reportType);
    }, 1000);
}

function updateChartsWithFilters(dateRange, department, reportType) {
    // Simulate different data based on filters
    let multiplier = 1;
    
    if (dateRange === 'month') multiplier = 0.95;
    if (dateRange === 'year') multiplier = 0.88;
    if (department === 'computer_science') multiplier = 1.05;
    if (department === 'chemistry') multiplier = 0.85;

    const newAttendance = Math.floor(89 * multiplier);
    const newResources = Math.floor(76 * multiplier);
    const newEngagement = Math.floor(94 * multiplier);
    const newPerformance = Math.floor(83 * multiplier);

    // Update chart numbers
    animateNumber(document.getElementById('attendancePercent'), newAttendance, '%');
    animateNumber(document.getElementById('resourcePercent'), newResources, '%');
    animateNumber(document.getElementById('engagementPercent'), newEngagement, '%');
    animateNumber(document.getElementById('performancePercent'), newPerformance, '%');

    showNotification('📊 Reports updated with new filters', 'success');
}

function refreshReports() {
    showNotification('🔄 Refreshing all reports...', 'info');
    
    // Simulate data refresh
    setTimeout(() => {
        animateCharts();
        showNotification('✅ All reports refreshed successfully', 'success');
    }, 2000);
}

function generateReport() {
    showNotification('📋 Generating comprehensive report...', 'info');
    
    // Simulate report generation
    setTimeout(() => {
        showNotification('✅ Report generated successfully!', 'success');
    }, 3000);
}

function exportReport(format) {
    showNotification(`📄 Exporting report as ${format.toUpperCase()}...`, 'info');
    
    // Simulate export process
    setTimeout(() => {
        showNotification(`✅ Report exported as ${format.toUpperCase()} successfully!`, 'success');
    }, 2500);
}

function exportTableData() {
    showNotification('📊 Exporting table data...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Table data exported successfully!', 'success');
    }, 2000);
}

function emailReport() {
    showNotification('📧 Preparing email report...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Report sent to your email successfully!', 'success');
    }, 3000);
}

function startRealTimeUpdates() {
    // Simulate real-time data updates
    setInterval(() => {
        if (Math.random() > 0.8) {
            // Random small updates to simulate live data
            const elements = [
                document.getElementById('attendancePercent'),
                document.getElementById('resourcePercent'),
                document.getElementById('engagementPercent'),
                document.getElementById('performancePercent')
            ];
            
            const randomElement = elements[Math.floor(Math.random() * elements.length)];
            const currentValue = parseInt(randomElement.textContent);
            const newValue = currentValue + (Math.random() > 0.5 ? 1 : -1);
            
            if (newValue >= 0 && newValue <= 100) {
                animateNumber(randomElement, newValue, '%');
            }
        }
    }, 15000);
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

// Add some sample data updates for demo
setTimeout(() => {
    // Add new row to table for demo
    const tbody = document.getElementById('analyticsTableBody');
    const newRow = tbody.insertRow();
    newRow.innerHTML = `
        <td><strong>CS103 - Database Systems</strong></td>
        <td>35</td>
        <td>88%</td>
        <td>91%</td>
        <td>82%</td>
        <td>76%</td>
        <td><span class="status-badge status-good">Good</span></td>
    `;
    newRow.style.background = 'var(--bg-tertiary)';
    
    setTimeout(() => {
        newRow.style.background = '';
    }, 3000);
    
    showNotification('📊 New class data added to analytics', 'info');
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
