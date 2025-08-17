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

// Feedback System Data
let FEEDBACK_DATA = JSON.parse(localStorage.getItem('scms_feedback_data')) || [
    {
        id: 'FB001',
        studentName: 'John Doe',
        studentId: 'CS-2021-001',
        department: 'CSE',
        category: 'technical',
        priority: 'urgent',
        subject: 'Projector Not Working - Room 305',
        description: 'The projector in room 305 is not turning on. Students are unable to see the presentation.',
        location: 'Room 305',
        email: 'john.doe@college.edu',
        status: 'pending',
        timestamp: new Date('2024-01-15T10:30:00'),
        adminNotes: ''
    },
    {
        id: 'FB002',
        studentName: 'Sarah Smith',
        studentId: 'IT-2020-045',
        department: 'IT',
        category: 'facility',
        priority: 'normal',
        subject: 'Cafeteria Food Quality',
        description: 'The food quality in the cafeteria has decreased. Please look into this matter.',
        location: 'Main Cafeteria',
        email: 'sarah.smith@college.edu',
        status: 'in-progress',
        timestamp: new Date('2024-01-15T09:30:00'),
        adminNotes: 'Forwarded to cafeteria management'
    },
    {
        id: 'FB003',
        studentName: 'Mike Johnson',
        studentId: 'ECE-2019-078',
        department: 'ECE',
        category: 'library',
        priority: 'normal',
        subject: 'Library Timing Extension Request',
        description: 'Request to extend library hours during exam period for better study environment.',
        location: 'Central Library',
        email: 'mike.johnson@college.edu',
        status: 'resolved',
        timestamp: new Date('2024-01-15T08:30:00'),
        adminNotes: 'Library hours extended till 10 PM during exams'
    }
];

let filteredFeedback = [...FEEDBACK_DATA];

// Load current user and initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    loadFeedbackData();
    updateFeedbackStats();
    startRealTimeUpdates();
    
    // Close mobile sidebar when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    });
});
// Real-time Date & Time function
function updateLiveDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) + ' - ' + now.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: 'numeric', 
        minute: '2-digit',
        
    });
    
    // Update element
    const liveDateTime = document.getElementById('liveDateTime');
    if (liveDateTime) liveDateTime.textContent = dateTimeString;
}

// Start real-time updates
setInterval(updateLiveDateTime, 1000);
updateLiveDateTime(); // Initial call

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

    const userNameEl = document.getElementById('userName');
    const headerUserNameEl = document.getElementById('headerUserName');
    
    if (userNameEl) userNameEl.textContent = user.name;
    if (headerUserNameEl) headerUserNameEl.textContent = user.name;
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

// Feedback System Functions
function loadFeedbackData() {
    updateRecentFeedback();
    updateFeedbackStats();
}

function updateFeedbackStats() {
    const totalFeedback = FEEDBACK_DATA.length;
    const urgentFeedback = FEEDBACK_DATA.filter(f => f.priority === 'urgent').length;
    const pendingFeedback = FEEDBACK_DATA.filter(f => f.status === 'pending').length;
    
    // Update header counter
    const feedbackCountEl = document.getElementById('feedbackCount');
    if (feedbackCountEl) feedbackCountEl.textContent = pendingFeedback;
    
    // Update urgent counter
    const urgentCountEl = document.getElementById('urgentCount');
    if (urgentCountEl) urgentCountEl.textContent = `${urgentFeedback} Urgent`;
}

function updateRecentFeedback() {
    const recentFeedbackList = document.getElementById('recentFeedbackList');
    if (!recentFeedbackList) return;
    
    // Get latest 3 feedback items
    const recentFeedback = FEEDBACK_DATA
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 3);
    
    recentFeedbackList.innerHTML = '';
    
    recentFeedback.forEach(feedback => {
        const feedbackItem = createFeedbackItem(feedback);
        recentFeedbackList.appendChild(feedbackItem);
    });
}

function createFeedbackItem(feedback) {
    const div = document.createElement('div');
    div.className = `feedback-item ${feedback.priority}`;
    
    const timeAgo = getTimeAgo(feedback.timestamp);
    const categoryName = getCategoryName(feedback.category);
    
    div.innerHTML = `
        <div class="feedback-header">
            <span class="feedback-title">${feedback.subject}</span>
            <span class="feedback-time">${timeAgo}</span>
        </div>
        <div class="feedback-content">${feedback.description}</div>
        <div class="feedback-meta">
            <span class="feedback-student">By: ${feedback.studentName} (${feedback.studentId})</span>
            <span class="feedback-category">${categoryName}</span>
        </div>
    `;
    
    return div;
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes} mins ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

function getCategoryName(category) {
    const categories = {
        'technical': 'Technical Issue',
        'facility': 'Facility',
        'academic': 'Academic',
        'transport': 'Transportation',
        'cafeteria': 'Cafeteria',
        'library': 'Library',
        'faculty': 'Faculty',
        'other': 'Other'
    };
    return categories[category] || 'Other';
}

// Feedback Modal Management
function openFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.classList.add('show');
        loadDetailedFeedback();
        updateFeedbackStatsModal();
    }
}

function closeFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function loadDetailedFeedback() {
    const feedbackList = document.getElementById('detailedFeedbackList');
    if (!feedbackList) return;
    
    feedbackList.innerHTML = '';
    
    if (filteredFeedback.length === 0) {
        feedbackList.innerHTML = `
            <div style="padding: 40px; text-align: center; color: var(--text-secondary);">
                <i class="fas fa-inbox fa-3x" style="margin-bottom: 15px; opacity: 0.5;"></i>
                <h3>No feedback found</h3>
                <p>No feedback matches your current filters.</p>
            </div>
        `;
        return;
    }
    
    filteredFeedback
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .forEach(feedback => {
            const feedbackCard = createDetailedFeedbackCard(feedback);
            feedbackList.appendChild(feedbackCard);
        });
}

function createDetailedFeedbackCard(feedback) {
    const div = document.createElement('div');
    div.className = `feedback-item ${feedback.priority}`;
    
    const timeAgo = getTimeAgo(feedback.timestamp);
    const categoryName = getCategoryName(feedback.category);
    const priorityIcon = getPriorityIcon(feedback.priority);
    const statusBadge = getStatusBadge(feedback.status);
    
    div.innerHTML = `
        <div class="feedback-header">
            <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                ${priorityIcon}
                <span class="feedback-title">${feedback.subject}</span>
            </div>
            <span class="feedback-time">${timeAgo}</span>
        </div>
        <div class="feedback-content">${feedback.description}</div>
        <div class="feedback-details" style="margin: 12px 0;">
            ${feedback.location ? `<div><i class="fas fa-map-marker-alt"></i> Location: ${feedback.location}</div>` : ''}
            ${feedback.email ? `<div><i class="fas fa-envelope"></i> Contact: ${feedback.email}</div>` : ''}
        </div>
        <div class="feedback-meta">
            <div>
                <span class="feedback-student">By: ${feedback.studentName} (${feedback.studentId})</span>
                <span class="feedback-category">${categoryName}</span>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                ${statusBadge}
                <div class="feedback-actions">
                    <button class="btn btn-sm btn-primary" onclick="updateFeedbackStatus('${feedback.id}', 'in-progress')">
                        <i class="fas fa-play"></i> In Progress
                    </button>
                    <button class="btn btn-sm btn-success" onclick="updateFeedbackStatus('${feedback.id}', 'resolved')">
                        <i class="fas fa-check"></i> Resolve
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return div;
}

function getPriorityIcon(priority) {
    const icons = {
        'urgent': '<i class="fas fa-exclamation-triangle" style="color: var(--accent-red);"></i>',
        'high': '<i class="fas fa-exclamation-circle" style="color: var(--accent-orange);"></i>',
        'normal': '<i class="fas fa-info-circle" style="color: var(--accent-blue);"></i>',
        'low': '<i class="fas fa-minus-circle" style="color: var(--accent-green);"></i>'
    };
    return icons[priority] || icons['normal'];
}

function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="status-badge" style="background: var(--accent-yellow); color: white;">Pending</span>',
        'in-progress': '<span class="status-badge" style="background: var(--accent-blue); color: white;">In Progress</span>',
        'resolved': '<span class="status-badge" style="background: var(--accent-green); color: white;">Resolved</span>',
        'closed': '<span class="status-badge" style="background: var(--text-tertiary); color: white;">Closed</span>'
    };
    return badges[status] || badges['pending'];
}

function updateFeedbackStatsModal() {
    const totalFeedback = FEEDBACK_DATA.length;
    const urgentFeedback = FEEDBACK_DATA.filter(f => f.priority === 'urgent').length;
    const resolvedFeedback = FEEDBACK_DATA.filter(f => f.status === 'resolved').length;
    const pendingFeedback = FEEDBACK_DATA.filter(f => f.status === 'pending').length;
    
    // Update modal stats
    const statElements = {
        total: document.querySelector('.feedback-stat-item.total .stat-number'),
        urgent: document.querySelector('.feedback-stat-item.urgent .stat-number'),
        resolved: document.querySelector('.feedback-stat-item.resolved .stat-number'),
        pending: document.querySelector('.feedback-stat-item.pending .stat-number')
    };
    
    if (statElements.total) statElements.total.textContent = totalFeedback;
    if (statElements.urgent) statElements.urgent.textContent = urgentFeedback;
    if (statElements.resolved) statElements.resolved.textContent = resolvedFeedback;
    if (statElements.pending) statElements.pending.textContent = pendingFeedback;
}

function filterFeedback() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    
    const categoryValue = categoryFilter ? categoryFilter.value : '';
    const statusValue = statusFilter ? statusFilter.value : '';
    const priorityValue = priorityFilter ? priorityFilter.value : '';
    
    filteredFeedback = FEEDBACK_DATA.filter(feedback => {
        const matchesCategory = !categoryValue || feedback.category === categoryValue;
        const matchesStatus = !statusValue || feedback.status === statusValue;
        const matchesPriority = !priorityValue || feedback.priority === priorityValue;
        
        return matchesCategory && matchesStatus && matchesPriority;
    });
    
    loadDetailedFeedback();
    showNotification(`Found ${filteredFeedback.length} feedback items`, 'info');
}

function updateFeedbackStatus(feedbackId, newStatus) {
    const feedbackIndex = FEEDBACK_DATA.findIndex(f => f.id === feedbackId);
    if (feedbackIndex !== -1) {
        FEEDBACK_DATA[feedbackIndex].status = newStatus;
        FEEDBACK_DATA[feedbackIndex].adminNotes = `Status updated to ${newStatus} on ${new Date().toLocaleString()}`;
        
        saveFeedbackData();
        loadDetailedFeedback();
        updateFeedbackStats();
        updateRecentFeedback();
        
        showNotification(`Feedback status updated to ${newStatus}`, 'success');
    }
}

function saveFeedbackData() {
    localStorage.setItem('scms_feedback_data', JSON.stringify(FEEDBACK_DATA));
}

// Original Dashboard Functions
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
    if (!container) return;
    
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
    if (stats.totalUsers) animateNumber(stats.totalUsers, 1247, 1265);
    if (stats.activeClasses) animateNumber(stats.activeClasses, 24, 26);
    if (stats.attendanceRate) animateNumber(stats.attendanceRate, 87, 89, '%');
    if (stats.resourceUtilization) animateNumber(stats.resourceUtilization, 73, 76, '%');
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
    updateFeedbackStats();
    updateRecentFeedback();
}

function startRealTimeUpdates() {
    // Simulate real-time activity updates
    setInterval(() => {
        const activities = [
            'Student checked in via QR code',
            'Resource booking updated',
            'Attendance marked automatically',
            'System health check completed',
            'New class session started',
            'New feedback received from student',
            'Maintenance request submitted'
        ];
        
        if (Math.random() > 0.8) {
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            addLiveActivity(randomActivity);
        }
        
        // Occasionally add new feedback
        if (Math.random() > 0.95) {
            simulateNewFeedback();
        }
    }, 15000);
}

function simulateNewFeedback() {
    const sampleFeedback = [
        {
            studentName: 'Alex Kumar',
            studentId: 'CS-2022-089',
            department: 'CSE',
            category: 'technical',
            priority: 'normal',
            subject: 'WiFi connectivity issues in library',
            description: 'Internet connection is very slow in the library study area.',
            location: 'Central Library'
        },
        {
            studentName: 'Priya Singh',
            studentId: 'ECE-2021-045',
            department: 'ECE',
            category: 'facility',
            priority: 'high',
            subject: 'AC not working in Lab 302',
            description: 'The air conditioning system in ECE Lab 302 is not functioning properly.',
            location: 'ECE Lab 302'
        }
    ];
    
    const randomFeedback = sampleFeedback[Math.floor(Math.random() * sampleFeedback.length)];
    const newFeedback = {
        id: 'FB' + String(Date.now()).slice(-6),
        ...randomFeedback,
        email: `${randomFeedback.studentName.toLowerCase().replace(' ', '.')}@college.edu`,
        status: 'pending',
        timestamp: new Date(),
        adminNotes: ''
    };
    
    FEEDBACK_DATA.unshift(newFeedback);
    saveFeedbackData();
    updateFeedbackStats();
    updateRecentFeedback();
    
    addLiveActivity(`New ${randomFeedback.priority} feedback received: ${randomFeedback.subject}`);
}

function showNotification(message, type) {
    const existingNotification = document.querySelector('.notification.show');
    if (existingNotification) {
        existingNotification.remove();
    }
    
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

// Event Listeners
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (window.innerWidth <= 768 && 
        sidebar && sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
        closeMobileSidebar();
    }
});

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeFeedbackModal();
    }
});

// Handle escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeFeedbackModal();
        closeMobileSidebar();
    }
});

// Save data before page unload
window.addEventListener('beforeunload', function() {
    saveFeedbackData();
});

// Initialize filtered feedback
filteredFeedback = [...FEEDBACK_DATA];
