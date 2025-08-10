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

// Load current user
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
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
    document.getElementById('headerUserName').textContent = user.name;
}

function logout() {
    localStorage.removeItem('scms_current_user');
    showNotification('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
}

function startSystemDemo() {
    showNotification('🎬 System demo started! Watch live updates.', 'info');
    
    setTimeout(() => addLiveActivity('New student registered - Alice Johnson'), 2000);
    setTimeout(() => addLiveActivity('CS102 class attendance completed - 38/40 present'), 4000);
    setTimeout(() => addLiveActivity('Maintenance alert - Smart Board calibration needed'), 6000);
    setTimeout(() => updateStats(), 8000);
}

function triggerEmergencyAlert() {
    const alert = document.createElement('div');
    alert.className = 'emergency-alert';
    alert.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <strong>EMERGENCY DRILL - Fire Alert Activated</strong>
        <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; font-size: 1.2em; cursor: pointer;">×</button>
    `;
    document.body.appendChild(alert);
    
    showNotification('🚨 Emergency alert triggered - All systems activated', 'info');
    
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 10000);
}

function addLiveActivity(text) {
    const container = document.getElementById('liveActivity');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const activityHtml = `
        <div class="activity-item new-activity">
            <span class="activity-time">${timeStr}</span>
            <span class="activity-text">${text}</span>
            <span class="activity-status">LIVE</span>
        </div>
    `;
    
    container.insertAdjacentHTML('afterbegin', activityHtml);
    
    setTimeout(() => {
        const newItem = container.querySelector('.new-activity');
        if (newItem) newItem.classList.remove('new-activity');
    }, 2000);
}

function updateStats() {
    const stats = {
        totalUsers: document.getElementById('totalUsers'),
        activeClasses: document.getElementById('activeClasses'),
        attendanceRate: document.getElementById('attendanceRate'),
        resourceUtilization: document.getElementById('resourceUtilization')
    };

    // Animate number increases
    animateNumber(stats.totalUsers, 1247, 1265);
    animateNumber(stats.activeClasses, 24, 26);
    animateNumber(stats.attendanceRate, 87, 89, '%');
    animateNumber(stats.resourceUtilization, 73, 76, '%');
}

function animateNumber(element, start, end, suffix = '') {
    let current = start;
    const increment = (end - start) / 20;
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 50);
}

function refreshLiveData() {
    showNotification('🔄 Live data refreshed', 'info');
    addLiveActivity('System refresh completed - All data updated');
}

function startRealTimeUpdates() {
    // Simulate real-time activity updates
    setInterval(() => {
        const activities = [
            'Student checked in via QR code',
            'Resource booking updated',
            'Attendance marked automatically',
            'System health check completed',
            'New class session started'
        ];
        
        if (Math.random() > 0.7) {
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            addLiveActivity(randomActivity);
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
