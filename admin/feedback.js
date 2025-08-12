// Theme Management
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

// Feedback Data Management
let FEEDBACK_DATA = JSON.parse(localStorage.getItem('scms_feedback_data')) || [
    {
        id: 'FB001',
        studentName: 'John Doe',
        studentId: 'CS-2021-001',
        department: 'CSE',
        category: 'technical',
        priority: 'urgent',
        subject: 'Projector Not Working - Room 305',
        description: 'The projector in room 305 is not turning on. Students are unable to see the presentation. This is affecting our daily classes and we need immediate assistance.',
        location: 'Room 305',
        email: 'john.doe@college.edu',
        status: 'pending',
        timestamp: new Date('2024-01-15T10:30:00'),
        adminNotes: '',
        responses: []
    },
    {
        id: 'FB002',
        studentName: 'Sarah Smith',
        studentId: 'IT-2020-045',
        department: 'IT',
        category: 'facility',
        priority: 'normal',
        subject: 'Cafeteria Food Quality',
        description: 'The food quality in the cafeteria has decreased significantly over the past few weeks. Many students are complaining about the taste and hygiene standards.',
        location: 'Main Cafeteria',
        email: 'sarah.smith@college.edu',
        status: 'in-progress',
        timestamp: new Date('2024-01-15T09:30:00'),
        adminNotes: 'Forwarded to cafeteria management',
        responses: [
            {
                adminName: 'Admin',
                response: 'Thank you for your feedback. We have forwarded this to the cafeteria management team for immediate review.',
                timestamp: new Date('2024-01-15T11:00:00')
            }
        ]
    },
    {
        id: 'FB003',
        studentName: 'Mike Johnson',
        studentId: 'ECE-2019-078',
        department: 'ECE',
        category: 'library',
        priority: 'normal',
        subject: 'Library Timing Extension Request',
        description: 'Request to extend library hours during exam period for better study environment. Current timings are not sufficient for proper preparation.',
        location: 'Central Library',
        email: 'mike.johnson@college.edu',
        status: 'resolved',
        timestamp: new Date('2024-01-15T08:30:00'),
        adminNotes: 'Library hours extended till 10 PM during exams',
        responses: [
            {
                adminName: 'Admin',
                response: 'We are pleased to inform you that library hours have been extended till 10 PM during the exam period.',
                timestamp: new Date('2024-01-15T12:00:00')
            }
        ]
    },
    {
        id: 'FB004',
        studentName: 'Alex Kumar',
        studentId: 'CS-2022-089',
        department: 'CSE',
        category: 'technical',
        priority: 'high',
        subject: 'WiFi Connectivity Issues in Library',
        description: 'Internet connection is very slow in the library study area. Students are unable to access online resources properly.',
        location: 'Central Library',
        email: 'alex.kumar@college.edu',
        status: 'pending',
        timestamp: new Date('2024-01-14T15:20:00'),
        adminNotes: '',
        responses: []
    },
    {
        id: 'FB005',
        studentName: 'Priya Singh',
        studentId: 'ECE-2021-045',
        department: 'ECE',
        category: 'facility',
        priority: 'urgent',
        subject: 'AC Not Working in Lab 302',
        description: 'The air conditioning system in ECE Lab 302 is not functioning properly. It is making the lab environment very uncomfortable for practical sessions.',
        location: 'ECE Lab 302',
        email: 'priya.singh@college.edu',
        status: 'in-progress',
        timestamp: new Date('2024-01-14T11:45:00'),
        adminNotes: 'Technician assigned',
        responses: [
            {
                adminName: 'Admin',
                response: 'A technician has been assigned to fix the AC. Work will be completed by tomorrow.',
                timestamp: new Date('2024-01-14T14:30:00')
            }
        ]
    }
];

let filteredFeedback = [...FEEDBACK_DATA];
let currentView = 'card';
let currentFeedbackId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    updateFeedbackStats();
    renderFeedback();
    
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

    const userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = user.name;
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

// Feedback Statistics
function updateFeedbackStats() {
    const total = FEEDBACK_DATA.length;
    const urgent = FEEDBACK_DATA.filter(f => f.priority === 'urgent').length;
    const pending = FEEDBACK_DATA.filter(f => f.status === 'pending').length;
    const resolved = FEEDBACK_DATA.filter(f => f.status === 'resolved').length;
    
    document.getElementById('totalFeedback').textContent = total;
    document.getElementById('urgentFeedback').textContent = urgent;
    document.getElementById('pendingFeedback').textContent = pending;
    document.getElementById('resolvedFeedback').textContent = resolved;
    
    // Update feedback count
    document.getElementById('feedbackCount').textContent = `${filteredFeedback.length} items`;
}

// Filtering Functions
function filterFeedback() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const timeFilter = document.getElementById('timeFilter').value;
    
    filteredFeedback = FEEDBACK_DATA.filter(feedback => {
        const matchesSearch = !searchTerm || 
            feedback.subject.toLowerCase().includes(searchTerm) ||
            feedback.description.toLowerCase().includes(searchTerm) ||
            feedback.studentName.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || feedback.category === categoryFilter;
        const matchesStatus = !statusFilter || feedback.status === statusFilter;
        const matchesPriority = !priorityFilter || feedback.priority === priorityFilter;
        const matchesTime = !timeFilter || filterByTime(feedback.timestamp, timeFilter);
        
        return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesTime;
    });
    
    renderFeedback();
    updateFeedbackStats();
}

function filterByTime(timestamp, filter) {
    const now = new Date();
    const feedbackDate = new Date(timestamp);
    
    switch(filter) {
        case 'today':
            return feedbackDate.toDateString() === now.toDateString();
        case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return feedbackDate >= weekAgo;
        case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return feedbackDate >= monthAgo;
        default:
            return true;
    }
}

function filterByPriority(priority) {
    document.getElementById('priorityFilter').value = priority;
    filterFeedback();
}

function filterByStatus(status) {
    document.getElementById('statusFilter').value = status;
    filterFeedback();
}

function filterByCategory(category) {
    document.getElementById('categoryFilter').value = category;
    filterFeedback();
}

// View Management
function switchView(view) {
    currentView = view;
    
    // Update view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide view containers
    document.getElementById('cardView').classList.toggle('active', view === 'card');
    document.getElementById('tableView').classList.toggle('active', view === 'table');
    
    renderFeedback();
}

// Render Functions
function renderFeedback() {
    if (currentView === 'card') {
        renderCardView();
    } else {
        renderTableView();
    }
    
    document.getElementById('feedbackCount').textContent = `${filteredFeedback.length} items`;
}

function renderCardView() {
    const container = document.getElementById('cardView');
    
    if (filteredFeedback.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No feedback found</h3>
                <p>No feedback matches your current filters.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredFeedback.map(feedback => createFeedbackCard(feedback)).join('');
}

function renderTableView() {
    const tbody = document.getElementById('feedbackTableBody');
    
    if (filteredFeedback.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>No feedback found</h3>
                        <p>No feedback matches your current filters.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredFeedback.map(feedback => createFeedbackRow(feedback)).join('');
}

function createFeedbackCard(feedback) {
    const timeAgo = getTimeAgo(feedback.timestamp);
    const categoryName = getCategoryName(feedback.category);
    const priorityIcon = getPriorityIcon(feedback.priority);
    
    return `
        <div class="feedback-card ${feedback.priority}" onclick="viewFeedbackDetails('${feedback.id}')">
            <div class="feedback-card-header">
                <div class="feedback-title">
                    ${priorityIcon}
                    ${feedback.subject}
                </div>
                <div class="feedback-meta">
                    <span>${timeAgo}</span>
                    <span>${feedback.location || 'No location'}</span>
                </div>
                <div class="feedback-description">
                    ${feedback.description}
                </div>
            </div>
            <div class="feedback-card-body">
                <div class="student-info">
                    <div class="student-avatar">
                        ${feedback.studentName.charAt(0)}
                    </div>
                    <div class="student-details">
                        <h4>${feedback.studentName}</h4>
                        <p>${feedback.studentId} • ${feedback.department}</p>
                    </div>
                </div>
                <div class="feedback-tags">
                    <span class="category-tag">${categoryName}</span>
                    <span class="status-tag ${feedback.status}">${getStatusName(feedback.status)}</span>
                </div>
                <div class="feedback-actions" onclick="event.stopPropagation()">
                    <button class="action-btn view" onclick="viewFeedbackDetails('${feedback.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn respond" onclick="openResponseModal('${feedback.id}')">
                        <i class="fas fa-reply"></i> Respond
                    </button>
                    <button class="action-btn delete" onclick="deleteFeedback('${feedback.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createFeedbackRow(feedback) {
    const timeAgo = getTimeAgo(feedback.timestamp);
    const categoryName = getCategoryName(feedback.category);
    const statusName = getStatusName(feedback.status);
    const priorityIcon = getPriorityIcon(feedback.priority);
    
    return `
        <tr onclick="viewFeedbackDetails('${feedback.id}')" style="cursor: pointer;">
            <td>
                <div class="priority-cell">
                    <div class="priority-dot ${feedback.priority}"></div>
                    ${feedback.priority.charAt(0).toUpperCase() + feedback.priority.slice(1)}
                </div>
            </td>
            <td>
                <strong>${feedback.subject}</strong>
                <br>
                <small style="color: var(--text-secondary);">${feedback.description.substring(0, 50)}...</small>
            </td>
            <td>
                <strong>${feedback.studentName}</strong>
                <br>
                <small style="color: var(--text-secondary);">${feedback.studentId} • ${feedback.department}</small>
            </td>
            <td>
                <span class="category-tag">${categoryName}</span>
            </td>
            <td>
                <span class="status-tag ${feedback.status}">${statusName}</span>
            </td>
            <td>${timeAgo}</td>
            <td onclick="event.stopPropagation()">
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewFeedbackDetails('${feedback.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn respond" onclick="openResponseModal('${feedback.id}')">
                        <i class="fas fa-reply"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteFeedback('${feedback.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

// Helper Functions
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
        'technical': 'Technical',
        'facility': 'Facility',
        'academic': 'Academic',
        'transport': 'Transport',
        'cafeteria': 'Cafeteria',
        'library': 'Library',
        'faculty': 'Faculty',
        'other': 'Other'
    };
    return categories[category] || 'Other';
}

function getStatusName(status) {
    const statuses = {
        'pending': 'Pending',
        'in-progress': 'In Progress',
        'resolved': 'Resolved',
        'closed': 'Closed'
    };
    return statuses[status] || 'Pending';
}

function getPriorityIcon(priority) {
    const icons = {
        'urgent': '<i class="fas fa-exclamation-triangle priority-icon" style="color: var(--accent-red);"></i>',
        'high': '<i class="fas fa-exclamation-circle priority-icon" style="color: var(--accent-orange);"></i>',
        'normal': '<i class="fas fa-info-circle priority-icon" style="color: var(--accent-blue);"></i>',
        'low': '<i class="fas fa-minus-circle priority-icon" style="color: var(--accent-green);"></i>'
    };
    return icons[priority] || icons['normal'];
}

// Modal Functions
function viewFeedbackDetails(feedbackId) {
    const feedback = FEEDBACK_DATA.find(f => f.id === feedbackId);
    if (!feedback) return;
    
    const modal = document.getElementById('feedbackDetailModal');
    const content = document.getElementById('feedbackDetailContent');
    
    content.innerHTML = createFeedbackDetailView(feedback);
    modal.classList.add('show');
}

function createFeedbackDetailView(feedback) {
    const timeAgo = getTimeAgo(feedback.timestamp);
    const categoryName = getCategoryName(feedback.category);
    const statusName = getStatusName(feedback.status);
    const priorityIcon = getPriorityIcon(feedback.priority);
    
    return `
        <div class="feedback-detail-header">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                ${priorityIcon}
                <h2>${feedback.subject}</h2>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div>
                    <strong>Student:</strong><br>
                    ${feedback.studentName} (${feedback.studentId})
                </div>
                <div>
                    <strong>Department:</strong><br>
                    ${feedback.department}
                </div>
                <div>
                    <strong>Category:</strong><br>
                    <span class="category-tag">${categoryName}</span>
                </div>
                <div>
                    <strong>Priority:</strong><br>
                    ${feedback.priority.charAt(0).toUpperCase() + feedback.priority.slice(1)}
                </div>
                <div>
                    <strong>Status:</strong><br>
                    <span class="status-tag ${feedback.status}">${statusName}</span>
                </div>
                <div>
                    <strong>Submitted:</strong><br>
                    ${timeAgo}
                </div>
            </div>
        </div>
        
        <div class="feedback-detail-body">
            <div style="margin-bottom: 20px;">
                <h4>Description:</h4>
                <p style="background: var(--bg-secondary); padding: 15px; border-radius: 8px; margin-top: 10px;">
                    ${feedback.description}
                </p>
            </div>
            
            ${feedback.location ? `
                <div style="margin-bottom: 20px;">
                    <h4>Location:</h4>
                    <p style="color: var(--text-secondary);">${feedback.location}</p>
                </div>
            ` : ''}
            
            ${feedback.email ? `
                <div style="margin-bottom: 20px;">
                    <h4>Contact Email:</h4>
                    <p style="color: var(--text-secondary);">${feedback.email}</p>
                </div>
            ` : ''}
            
            ${feedback.adminNotes ? `
                <div style="margin-bottom: 20px;">
                    <h4>Admin Notes:</h4>
                    <p style="background: var(--bg-tertiary); padding: 15px; border-radius: 8px; margin-top: 10px;">
                        ${feedback.adminNotes}
                    </p>
                </div>
            ` : ''}
            
            ${feedback.responses && feedback.responses.length > 0 ? `
                <div style="margin-bottom: 20px;">
                    <h4>Admin Responses:</h4>
                    ${feedback.responses.map(response => `
                        <div style="background: var(--bg-secondary); padding: 15px; border-radius: 8px; margin-top: 10px; border-left: 4px solid var(--accent-blue);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <strong>${response.adminName}</strong>
                                <small style="color: var(--text-secondary);">${getTimeAgo(response.timestamp)}</small>
                            </div>
                            <p>${response.response}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
        
        <div class="feedback-detail-actions" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color);">
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-primary" onclick="openResponseModal('${feedback.id}')">
                    <i class="fas fa-reply"></i> Respond
                </button>
                <button class="btn btn-success" onclick="updateFeedbackStatus('${feedback.id}', 'resolved')">
                    <i class="fas fa-check"></i> Mark Resolved
                </button>
                <button class="btn btn-danger" onclick="deleteFeedback('${feedback.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
}

function closeFeedbackDetailModal() {
    document.getElementById('feedbackDetailModal').classList.remove('show');
}

function openResponseModal(feedbackId) {
    currentFeedbackId = feedbackId;
    const modal = document.getElementById('responseModal');
    modal.classList.add('show');
    
    // Reset form
    document.getElementById('responseForm').reset();
}

function closeResponseModal() {
    document.getElementById('responseModal').classList.remove('show');
    currentFeedbackId = null;
}

function submitResponse(event) {
    event.preventDefault();
    
    const status = document.getElementById('responseStatus').value;
    const responseText = document.getElementById('responseText').value;
    
    if (!currentFeedbackId || !status || !responseText) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    const feedbackIndex = FEEDBACK_DATA.findIndex(f => f.id === currentFeedbackId);
    if (feedbackIndex === -1) return;
    
    // Update feedback
    FEEDBACK_DATA[feedbackIndex].status = status;
    FEEDBACK_DATA[feedbackIndex].adminNotes = responseText;
    
    if (!FEEDBACK_DATA[feedbackIndex].responses) {
        FEEDBACK_DATA[feedbackIndex].responses = [];
    }
    
    FEEDBACK_DATA[feedbackIndex].responses.push({
        adminName: 'Admin',
        response: responseText,
        timestamp: new Date()
    });
    
    saveFeedbackData();
    updateFeedbackStats();
    renderFeedback();
    closeResponseModal();
    
    showNotification('Response sent successfully!', 'success');
}

function updateFeedbackStatus(feedbackId, newStatus) {
    const feedbackIndex = FEEDBACK_DATA.findIndex(f => f.id === feedbackId);
    if (feedbackIndex === -1) return;
    
    FEEDBACK_DATA[feedbackIndex].status = newStatus;
    FEEDBACK_DATA[feedbackIndex].adminNotes = `Status updated to ${newStatus} on ${new Date().toLocaleString()}`;
    
    saveFeedbackData();
    updateFeedbackStats();
    renderFeedback();
    closeFeedbackDetailModal();
    
    showNotification(`Feedback status updated to ${newStatus}`, 'success');
}

function deleteFeedback(feedbackId) {
    if (confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
        const feedbackIndex = FEEDBACK_DATA.findIndex(f => f.id === feedbackId);
        if (feedbackIndex === -1) return;
        
        FEEDBACK_DATA.splice(feedbackIndex, 1);
        filteredFeedback = filteredFeedback.filter(f => f.id !== feedbackId);
        
        saveFeedbackData();
        updateFeedbackStats();
        renderFeedback();
        closeFeedbackDetailModal();
        
        showNotification('Feedback deleted successfully', 'success');
    }
}

// Utility Functions
function saveFeedbackData() {
    localStorage.setItem('scms_feedback_data', JSON.stringify(FEEDBACK_DATA));
}

function refreshFeedbackData() {
    showNotification('Data refreshed successfully', 'info');
    updateFeedbackStats();
    renderFeedback();
}

function exportFeedbackData() {
    const dataStr = JSON.stringify(FEEDBACK_DATA, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `feedback_data_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Feedback data exported successfully', 'success');
}

function viewAnalytics() {
    const modal = document.getElementById('analyticsModal');
    modal.classList.add('show');
    
    // Simple analytics display (without chart library)
    showAnalyticsData();
}

function showAnalyticsData() {
    // Category distribution
    const categoryStats = FEEDBACK_DATA.reduce((acc, feedback) => {
        acc[feedback.category] = (acc[feedback.category] || 0) + 1;
        return acc;
    }, {});
    
    // Status distribution
    const statusStats = FEEDBACK_DATA.reduce((acc, feedback) => {
        acc[feedback.status] = (acc[feedback.status] || 0) + 1;
        return acc;
    }, {});
    
    // Priority distribution
    const priorityStats = FEEDBACK_DATA.reduce((acc, feedback) => {
        acc[feedback.priority] = (acc[feedback.priority] || 0) + 1;
        return acc;
    }, {});
    
    // Display simple text-based analytics
    document.getElementById('categoryChart').innerHTML = createSimpleChart('Category Distribution', categoryStats);
    document.getElementById('statusChart').innerHTML = createSimpleChart('Status Overview', statusStats);
    document.getElementById('priorityChart').innerHTML = createSimpleChart('Priority Levels', priorityStats);
    document.getElementById('trendsChart').innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Monthly trends data would be displayed here with a proper chart library.</p>';
}

function createSimpleChart(title, data) {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    
    return `
        <div style="text-align: left;">
            ${Object.entries(data).map(([key, value]) => `
                <div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>${getCategoryName(key)}</span>
                        <span>${value} (${Math.round(value/total*100)}%)</span>
                    </div>
                    <div style="background: var(--border-color); height: 8px; border-radius: 4px;">
                        <div style="background: var(--accent-blue); height: 100%; width: ${value/total*100}%; border-radius: 4px;"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function closeAnalyticsModal() {
    document.getElementById('analyticsModal').classList.remove('show');
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
        closeFeedbackDetailModal();
        closeResponseModal();
        closeAnalyticsModal();
    }
});

// Handle escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeFeedbackDetailModal();
        closeResponseModal();
        closeAnalyticsModal();
        closeMobileSidebar();
    }
});

// Save data before page unload
window.addEventListener('beforeunload', function() {
    saveFeedbackData();
});
