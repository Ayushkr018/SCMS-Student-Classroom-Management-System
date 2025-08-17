// Notifications Center JavaScript - Advanced Communication Management System

// Global Variables
let notifications = [];
let filteredNotifications = [];
let messageTemplates = [];
let currentUser = {
    name: 'Dr. Michael Chen',
    department: 'Computer Science',
    email: 'michael.chen@scms.edu',
    avatar: 'MC'
};
let quillEditor = null;
let templateEditor = null;
let currentRecipients = [];
let attachments = [];
let sendingProgress = {
    total: 0,
    sent: 0,
    failed: 0,
    percentage: 0
};

// Mock Database with Realistic Notification Data
const MOCK_NOTIFICATIONS = [
    {
        id: 'notif-001',
        title: 'Important: Mid-Semester Exam Schedule Released',
        content: '<p>Dear Students,</p><p>The mid-semester examination schedule has been released. Please check the academic portal for detailed timetable and exam guidelines.</p><p>Exam dates: March 15-25, 2025</p><p>Best regards,<br>Academic Office</p>',
        category: 'exam',
        priority: 'high',
        status: 'sent',
        recipients: {
            students: ['cs-2a', 'cs-2b', 'it-3a'],
            parents: [],
            teachers: [],
            custom: []
        },
        recipientCount: 125,
        channels: ['email', 'inapp', 'push'],
        createdAt: '2025-08-20T10:30:00Z',
        sentAt: '2025-08-20T10:35:00Z',
        scheduledAt: null,
        expiryDate: '2025-09-15T23:59:00Z',
        analytics: {
            sent: 125,
            delivered: 122,
            opened: 98,
            clicked: 45,
            replied: 12,
            openRate: 80.3,
            clickRate: 36.7,
            responseRate: 9.8
        },
        attachments: [
            { name: 'exam_schedule.pdf', size: 245760, type: 'application/pdf' }
        ],
        author: 'Dr. John Doe'
    },
    {
        id: 'notif-002',
        title: 'Reminder: Assignment Submission Due Tomorrow',
        content: '<p>Hello Students,</p><p>This is a friendly reminder that your Data Structures assignment is due tomorrow (August 21, 2025) at 11:59 PM.</p><p>Please ensure you submit your work through the academic portal before the deadline.</p><p>Good luck!<br>Prof. John Doe</p>',
        category: 'assignment',
        priority: 'normal',
        status: 'sent',
        recipients: {
            students: ['cs-2a'],
            parents: [],
            teachers: [],
            custom: []
        },
        recipientCount: 45,
        channels: ['email', 'inapp'],
        createdAt: '2025-08-19T16:45:00Z',
        sentAt: '2025-08-19T16:50:00Z',
        scheduledAt: null,
        expiryDate: '2025-08-22T00:00:00Z',
        analytics: {
            sent: 45,
            delivered: 45,
            opened: 42,
            clicked: 38,
            replied: 5,
            openRate: 93.3,
            clickRate: 84.4,
            responseRate: 11.1
        },
        attachments: [],
        author: 'Dr. John Doe'
    },
    {
        id: 'notif-003',
        title: 'Welcome to New Academic Year 2025-26',
        content: '<p>Dear Students and Parents,</p><p>Welcome to the new academic year! We are excited to begin this journey with you.</p><p>Important reminders:</p><ul><li>Classes begin on August 25, 2025</li><li>Fee payment deadline: August 30, 2025</li><li>Orientation program: August 23, 2025</li></ul><p>We wish you a successful academic year!</p><p>Best regards,<br>SCMS Administration</p>',
        category: 'general',
        priority: 'normal',
        status: 'scheduled',
        recipients: {
            students: ['cs-2a', 'cs-2b', 'it-3a', 'mca-1'],
            parents: ['fathers', 'mothers'],
            teachers: [],
            custom: []
        },
        recipientCount: 320,
        channels: ['email', 'inapp', 'sms', 'push'],
        createdAt: '2025-08-18T14:20:00Z',
        sentAt: null,
        scheduledAt: '2025-08-22T08:00:00Z',
        expiryDate: '2025-09-30T23:59:00Z',
        analytics: {
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            replied: 0,
            openRate: 0,
            clickRate: 0,
            responseRate: 0
        },
        attachments: [
            { name: 'academic_calendar.pdf', size: 892416, type: 'application/pdf' },
            { name: 'fee_structure.pdf', size: 156672, type: 'application/pdf' }
        ],
        author: 'Dr. John Doe'
    },
    {
        id: 'notif-004',
        title: 'Class Cancelled - Software Engineering Lab',
        content: '<p>Dear IT 3A Students,</p><p>Due to unforeseen circumstances, today\'s Software Engineering Lab (2:00 PM - 5:00 PM) has been cancelled.</p><p>The makeup class will be scheduled for next week. Further details will be shared soon.</p><p>Apologies for the inconvenience.</p><p>Prof. Sarah Johnson</p>',
        category: 'general',
        priority: 'urgent',
        status: 'sent',
        recipients: {
            students: ['it-3a'],
            parents: [],
            teachers: [],
            custom: []
        },
        recipientCount: 38,
        channels: ['email', 'inapp', 'sms', 'push'],
        createdAt: '2025-08-20T13:45:00Z',
        sentAt: '2025-08-20T13:47:00Z',
        scheduledAt: null,
        expiryDate: '2025-08-20T23:59:00Z',
        analytics: {
            sent: 38,
            delivered: 38,
            opened: 36,
            clicked: 2,
            replied: 8,
            openRate: 94.7,
            clickRate: 5.3,
            responseRate: 21.1
        },
        attachments: [],
        author: 'Prof. Sarah Johnson'
    },
    {
        id: 'notif-005',
        title: 'Parent-Teacher Meeting Invitation',
        content: '<p>Dear Parents,</p><p>You are cordially invited to attend the Parent-Teacher Meeting scheduled for this Saturday.</p><p><strong>Details:</strong></p><ul><li>Date: August 24, 2025</li><li>Time: 10:00 AM - 4:00 PM</li><li>Venue: Main Auditorium, SCMS Campus</li></ul><p>This is an excellent opportunity to discuss your child\'s academic progress and future goals.</p><p>Please confirm your attendance by replying to this message.</p><p>Best regards,<br>Academic Coordinator</p>',
        category: 'event',
        priority: 'high',
        status: 'draft',
        recipients: {
            students: [],
            parents: ['fathers', 'mothers'],
            teachers: [],
            custom: []
        },
        recipientCount: 160,
        channels: ['email', 'sms'],
        createdAt: '2025-08-20T11:15:00Z',
        sentAt: null,
        scheduledAt: null,
        expiryDate: '2025-08-25T23:59:00Z',
        analytics: {
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            replied: 0,
            openRate: 0,
            clickRate: 0,
            responseRate: 0
        },
        attachments: [],
        author: 'Dr. John Doe'
    }
];

// Message Templates Database
const MOCK_TEMPLATES = [
    {
        id: 'template-001',
        name: 'Welcome Message',
        category: 'general',
        subject: 'Welcome to {course_name}',
        content: '<p>Dear {student_name},</p><p>Welcome to {course_name}! We are excited to have you join our academic community.</p><p>Course details:</p><ul><li>Course Code: {course_code}</li><li>Instructor: {instructor_name}</li><li>Class Schedule: {schedule}</li></ul><p>We wish you success in your academic journey!</p><p>Best regards,<br>{instructor_name}</p>',
        description: 'Use this template to welcome new students to your course',
        usageCount: 15,
        lastUsed: '2025-08-18T09:30:00Z',
        createdAt: '2025-07-15T10:00:00Z'
    },
    {
        id: 'template-002',
        name: 'Assignment Reminder',
        category: 'assignment',
        subject: 'Reminder: {assignment_name} Due Soon',
        content: '<p>Hello {student_name},</p><p>This is a friendly reminder that your assignment "{assignment_name}" is due on {due_date}.</p><p>Assignment details:</p><ul><li>Subject: {subject_name}</li><li>Due Date: {due_date}</li><li>Submission Method: {submission_method}</li></ul><p>Please ensure timely submission to avoid late penalties.</p><p>Good luck!<br>{instructor_name}</p>',
        description: 'Remind students about upcoming assignment deadlines',
        usageCount: 42,
        lastUsed: '2025-08-19T16:45:00Z',
        createdAt: '2025-07-10T14:20:00Z'
    },
    {
        id: 'template-003',
        name: 'Exam Notification',
        category: 'exam',
        subject: 'Important: {exam_name} Schedule',
        content: '<p>Dear Students,</p><p>This is to inform you about the upcoming {exam_name}.</p><p>Exam Details:</p><ul><li>Date: {exam_date}</li><li>Time: {exam_time}</li><li>Duration: {exam_duration}</li><li>Venue: {exam_venue}</li></ul><p>Preparation Guidelines:</p><ul><li>Review all course materials</li><li>Arrive 15 minutes before exam time</li><li>Bring valid ID and required stationery</li></ul><p>Best of luck!<br>{instructor_name}</p>',
        description: 'Notify students about exam schedules and guidelines',
        usageCount: 28,
        lastUsed: '2025-08-20T10:30:00Z',
        createdAt: '2025-07-05T11:45:00Z'
    },
    {
        id: 'template-004',
        name: 'Urgent Alert',
        category: 'urgent',
        subject: 'URGENT: {alert_title}',
        content: '<p><strong>URGENT NOTIFICATION</strong></p><p>Dear {recipient_name},</p><p>{urgent_message}</p><p>Immediate Action Required:</p><ul><li>{action_1}</li><li>{action_2}</li></ul><p>For questions or concerns, please contact:</p><ul><li>Email: {contact_email}</li><li>Phone: {contact_phone}</li></ul><p>Thank you for your immediate attention.</p><p>{sender_name}<br>{sender_title}</p>',
        description: 'Use for urgent notifications requiring immediate attention',
        usageCount: 8,
        lastUsed: '2025-08-20T13:45:00Z',
        createdAt: '2025-07-20T16:00:00Z'
    },
    {
        id: 'template-005',
        name: 'Class Cancellation',
        category: 'general',
        subject: 'Class Cancelled: {subject_name}',
        content: '<p>Dear Students,</p><p>Due to {reason}, today\'s {subject_name} class scheduled at {class_time} has been cancelled.</p><p>Makeup Class Details:</p><ul><li>Date: {makeup_date}</li><li>Time: {makeup_time}</li><li>Venue: {makeup_venue}</li></ul><p>Please make note of the rescheduled session.</p><p>Apologies for any inconvenience.</p><p>{instructor_name}</p>',
        description: 'Inform students about class cancellations and rescheduling',
        usageCount: 12,
        lastUsed: '2025-08-19T14:20:00Z',
        createdAt: '2025-07-25T09:15:00Z'
    }
];

// Quick Message Types Configuration
const QUICK_MESSAGE_TYPES = {
    'class-reminder': {
        title: 'Class Reminder',
        icon: 'fas fa-calendar-check',
        template: 'Dear Students,\n\nThis is a reminder about your upcoming class:\n\n• Subject: {subject}\n• Date & Time: {datetime}\n• Venue: {venue}\n\nPlease be on time.\n\nBest regards,\n{instructor}'
    },
    'assignment-due': {
        title: 'Assignment Due',
        icon: 'fas fa-tasks',
        template: 'Hello Students,\n\nReminder: Your assignment "{assignment}" is due on {date}.\n\nSubmission Guidelines:\n• Format: {format}\n• Deadline: {deadline}\n• Platform: {platform}\n\nEnsure timely submission.\n\n{instructor}'
    },
    'exam-notice': {
        title: 'Exam Notice',
        icon: 'fas fa-graduation-cap',
        template: 'Dear Students,\n\nExam Notification:\n\n• Subject: {subject}\n• Date: {date}\n• Time: {time}\n• Duration: {duration}\n• Venue: {venue}\n\nGood luck with your preparation!\n\n{instructor}'
    },
    'general-info': {
        title: 'General Information',
        icon: 'fas fa-info-circle',
        template: 'Dear Recipients,\n\n{message}\n\nFor any queries, please contact:\n• Email: {email}\n• Phone: {phone}\n\nBest regards,\n{sender}'
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('📢 Notifications Center Loading...');
    
    // Load initial data
    notifications = [...MOCK_NOTIFICATIONS];
    messageTemplates = [...MOCK_TEMPLATES];
    filteredNotifications = [...notifications];
    
    // Initialize components
    initializeUserInfo();
    initializeTheme();
    initializeMobileControls();
    loadNotificationStats();
    renderNotifications();
    renderTemplates();
    initializeEventListeners();
    
    // Show success notification
    setTimeout(() => {
        showNotification('Notifications Center loaded successfully!', 'success');
        console.log('✅ Notifications Center Ready!');
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

// Statistics Management
function loadNotificationStats() {
    try {
        const stats = calculateNotificationStats();
        
        updateStatElement('totalNotifications', stats.total);
        updateStatElement('todayNotifications', stats.today);
        updateStatElement('openRate', stats.openRate + '%');
        updateStatElement('responseRate', stats.responseRate + '%');
        updateStatElement('activeRecipients', stats.recipients);
        
        console.log('📊 Notification stats loaded:', stats);
    } catch (error) {
        console.error('❌ Error loading notification stats:', error);
    }
}

function calculateNotificationStats() {
    try {
        const total = notifications.length;
        const today = new Date().toDateString();
        const todayNotifications = notifications.filter(n => 
            new Date(n.createdAt).toDateString() === today
        ).length;
        
        let totalSent = 0;
        let totalOpened = 0;
        let totalReplies = 0;
        let totalRecipients = 0;
        
        notifications.forEach(notification => {
            totalSent += notification.analytics.sent;
            totalOpened += notification.analytics.opened;
            totalReplies += notification.analytics.replied;
            totalRecipients += notification.recipientCount;
        });
        
        const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100 * 10) / 10 : 0;
        const responseRate = totalSent > 0 ? Math.round((totalReplies / totalSent) * 100 * 10) / 10 : 0;
        
        return {
            total,
            today: todayNotifications,
            openRate,
            responseRate,
            recipients: totalRecipients
        };
    } catch (error) {
        console.error('❌ Error calculating notification stats:', error);
        return { total: 0, today: 0, openRate: 0, responseRate: 0, recipients: 0 };
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

// Quick Actions
function sendUrgentAlert() {
    try {
        // Pre-fill urgent alert form
        createAnnouncement();
        
        setTimeout(() => {
            document.getElementById('announcementTitle').value = 'URGENT ALERT: ';
            document.getElementById('priorityLevel').value = 'urgent';
            document.getElementById('announcementCategory').value = 'emergency';
            
            // Auto-select all students
            document.getElementById('selectAllClasses').checked = true;
            toggleAllClasses();
            
            showNotification('Urgent alert form prepared. Add your message and send.', 'warning');
        }, 500);
        
        console.log('🚨 Urgent alert form opened');
    } catch (error) {
        console.error('❌ Error opening urgent alert:', error);
    }
}

function sendClassReminder() {
    try {
        bulkMessage();
        
        setTimeout(() => {
            selectMessageType('class-reminder');
        }, 500);
        
        console.log('📅 Class reminder form opened');
    } catch (error) {
        console.error('❌ Error opening class reminder:', error);
    }
}

function sendAssignmentDue() {
    try {
        bulkMessage();
        
        setTimeout(() => {
            selectMessageType('assignment-due');
        }, 500);
        
        console.log('📝 Assignment due form opened');
    } catch (error) {
        console.error('❌ Error opening assignment due:', error);
    }
}

function sendExamNotice() {
    try {
        bulkMessage();
        
        setTimeout(() => {
            selectMessageType('exam-notice');
        }, 500);
        
        console.log('🎓 Exam notice form opened');
    } catch (error) {
        console.error('❌ Error opening exam notice:', error);
    }
}

// Notification Management
function filterNotifications() {
    try {
        const statusFilter = document.getElementById('statusFilter').value;
        const typeFilter = document.getElementById('typeFilter').value;
        const searchTerm = document.getElementById('notificationSearch').value.toLowerCase().trim();
        
        filteredNotifications = notifications.filter(notification => {
            // Status filter
            if (statusFilter !== 'all' && notification.status !== statusFilter) {
                return false;
            }
            
            // Type filter
            if (typeFilter !== 'all' && notification.category !== typeFilter) {
                return false;
            }
            
            // Search filter
            if (searchTerm && !notification.title.toLowerCase().includes(searchTerm) &&
                !notification.content.toLowerCase().includes(searchTerm)) {
                return false;
            }
            
            return true;
        });
        
        renderNotifications();
        console.log('🔍 Notifications filtered:', filteredNotifications.length);
    } catch (error) {
        console.error('❌ Error filtering notifications:', error);
    }
}

function renderNotifications() {
    try {
        const container = document.getElementById('notificationsList');
        if (!container) return;
        
        if (filteredNotifications.length === 0) {
            container.innerHTML = createEmptyState();
            return;
        }
        
        const notificationsHTML = filteredNotifications.map(notification => 
            createNotificationItem(notification)
        ).join('');
        
        container.innerHTML = notificationsHTML;
        
        console.log('📢 Notifications rendered:', filteredNotifications.length);
    } catch (error) {
        console.error('❌ Error rendering notifications:', error);
        showNotification('Failed to load notifications', 'error');
    }
}

function createEmptyState() {
    return `
        <div class="empty-state">
            <i class="fas fa-bell-slash"></i>
            <h3>No notifications found</h3>
            <p>No notifications match your current filters, or you haven't created any yet.</p>
            <button class="btn btn-primary" onclick="createAnnouncement()" style="margin-top: 15px;">
                <i class="fas fa-plus"></i> Create First Notification
            </button>
        </div>
    `;
}

function createNotificationItem(notification) {
    try {
        const createdDate = formatDate(new Date(notification.createdAt));
        const sentDate = notification.sentAt ? formatDate(new Date(notification.sentAt)) : 'Not sent';
        const scheduledDate = notification.scheduledAt ? formatDate(new Date(notification.scheduledAt)) : null;
        
        const priorityClass = `priority-${notification.priority}`;
        const statusClass = `status-${notification.status}`;
        
        const channelIcons = notification.channels.map(channel => {
            const icons = {
                email: 'fas fa-envelope',
                sms: 'fas fa-sms',
                inapp: 'fas fa-bell',
                push: 'fas fa-mobile-alt'
            };
            return `<i class="${icons[channel] || 'fas fa-paper-plane'}" title="${channel}"></i>`;
        }).join(' ');
        
        return `
            <div class="notification-item" data-notification-id="${notification.id}">
                <div class="notification-header">
                    <div class="notification-title">
                        <h4>
                            ${notification.title}
                            <span class="priority-badge ${priorityClass}">${notification.priority}</span>
                        </h4>
                        <div class="notification-meta">
                            <span><i class="fas fa-calendar"></i> ${createdDate}</span>
                            <span><i class="fas fa-user"></i> ${notification.author}</span>
                            <span><i class="fas fa-users"></i> ${notification.recipientCount} recipients</span>
                            <span class="channels">${channelIcons}</span>
                        </div>
                    </div>
                    <div class="notification-status">
                        <span class="status-badge ${statusClass}">${notification.status}</span>
                    </div>
                </div>
                
                <div class="notification-content">
                    ${truncateHTML(notification.content, 150)}
                    ${notification.attachments.length > 0 ? 
                        `<div class="attachments-info">
                            <i class="fas fa-paperclip"></i> ${notification.attachments.length} attachment(s)
                        </div>` : ''
                    }
                </div>
                
                <div class="notification-stats">
                    <div class="notification-stat">
                        <i class="fas fa-paper-plane"></i>
                        <span>Sent: ${notification.analytics.sent}</span>
                    </div>
                    <div class="notification-stat">
                        <i class="fas fa-eye"></i>
                        <span>Opened: ${notification.analytics.opened} (${notification.analytics.openRate}%)</span>
                    </div>
                    <div class="notification-stat">
                        <i class="fas fa-mouse-pointer"></i>
                        <span>Clicked: ${notification.analytics.clicked}</span>
                    </div>
                    <div class="notification-stat">
                        <i class="fas fa-reply"></i>
                        <span>Replied: ${notification.analytics.replied}</span>
                    </div>
                    ${scheduledDate ? 
                        `<div class="notification-stat">
                            <i class="fas fa-clock"></i>
                            <span>Scheduled: ${formatDate(new Date(notification.scheduledAt))}</span>
                        </div>` : ''
                    }
                </div>
                
                <div class="notification-actions">
                    ${notification.status === 'draft' ? 
                        `<button class="btn btn-primary" onclick="editNotification('${notification.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-success" onclick="sendNotificationNow('${notification.id}')">
                            <i class="fas fa-paper-plane"></i> Send Now
                        </button>` :
                        notification.status === 'scheduled' ?
                        `<button class="btn btn-warning" onclick="editNotification('${notification.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-secondary" onclick="cancelScheduled('${notification.id}')">
                            <i class="fas fa-times"></i> Cancel
                        </button>` :
                        `<button class="btn btn-info" onclick="viewAnalytics('${notification.id}')">
                            <i class="fas fa-chart-bar"></i> Analytics
                        </button>
                        <button class="btn btn-secondary" onclick="duplicateNotification('${notification.id}')">
                            <i class="fas fa-copy"></i> Duplicate
                        </button>`
                    }
                    <button class="btn btn-secondary" onclick="previewNotification('${notification.id}')">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                    <button class="btn btn-danger" onclick="deleteNotification('${notification.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('❌ Error creating notification item:', error);
        return '<div class="notification-item"><p>Error loading notification</p></div>';
    }
}

// Template Management
function renderTemplates() {
    try {
        const container = document.getElementById('templatesGrid');
        if (!container) return;
        
        if (messageTemplates.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary); grid-column: 1 / -1;">
                    <i class="fas fa-file-alt" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3>No templates found</h3>
                    <p>Create your first message template to get started!</p>
                </div>
            `;
            return;
        }
        
        const templatesHTML = messageTemplates.map(template => 
            createTemplateCard(template)
        ).join('');
        
        container.innerHTML = templatesHTML;
        
        console.log('📋 Templates rendered:', messageTemplates.length);
    } catch (error) {
        console.error('❌ Error rendering templates:', error);
    }
}

function createTemplateCard(template) {
    try {
        const lastUsed = formatRelativeTime(new Date(template.lastUsed));
        const preview = stripHTML(template.content).substring(0, 100) + '...';
        
        return `
            <div class="template-card" data-template-id="${template.id}">
                <div class="template-header">
                    <div class="template-title">${template.name}</div>
                    <div class="template-category">${template.category}</div>
                </div>
                <div class="template-description">${template.description}</div>
                <div class="template-preview">${preview}</div>
                <div class="template-meta" style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 10px;">
                    <span>Used ${template.usageCount} times</span> • 
                    <span>Last used ${lastUsed}</span>
                </div>
                <div class="template-actions">
                    <button class="btn btn-primary" onclick="useTemplate('${template.id}')">
                        <i class="fas fa-paper-plane"></i> Use
                    </button>
                    <button class="btn btn-secondary" onclick="editTemplate('${template.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteTemplate('${template.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('❌ Error creating template card:', error);
        return '<div class="template-card"><p>Error loading template</p></div>';
    }
}

// Announcement Creation
function createAnnouncement() {
    try {
        const modal = document.getElementById('announcementModal');
        document.getElementById('announcementModalTitle').textContent = 'Create New Announcement';
        
        // Reset form
        resetAnnouncementForm();
        
        // Initialize Quill editor
        setTimeout(() => {
            initializeQuillEditor();
        }, 100);
        
        modal.style.display = 'flex';
        console.log('📝 Announcement creation modal opened');
    } catch (error) {
        console.error('❌ Error opening announcement modal:', error);
        showNotification('Failed to open announcement creator', 'error');
    }
}

function closeAnnouncementModal() {
    try {
        const modal = document.getElementById('announcementModal');
        modal.style.display = 'none';
        
        // Destroy Quill editor
        if (quillEditor) {
            quillEditor = null;
        }
        
        // Reset form and attachments
        resetAnnouncementForm();
        attachments = [];
        
        console.log('📝 Announcement modal closed');
    } catch (error) {
        console.error('❌ Error closing announcement modal:', error);
    }
}

function resetAnnouncementForm() {
    try {
        const form = document.getElementById('announcementForm');
        if (form) {
            form.reset();
        }
        
        // Reset recipients
        currentRecipients = [];
        updateRecipientCount();
        
        // Reset editor stats
        updateEditorStats('', '');
        
        // Hide scheduled controls
        document.getElementById('scheduleControls').style.display = 'none';
        
        // Clear attachments
        const attachmentsList = document.getElementById('attachmentsList');
        if (attachmentsList) {
            attachmentsList.innerHTML = '';
        }
        
        console.log('📝 Announcement form reset');
    } catch (error) {
        console.error('❌ Error resetting announcement form:', error);
    }
}

function initializeQuillEditor() {
    try {
        const editorContainer = document.getElementById('messageEditor');
        if (!editorContainer || quillEditor) return;
        
        quillEditor = new Quill('#messageEditor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'header': 1 }, { 'header': 2 }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'script': 'sub'}, { 'script': 'super' }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],
                    [{ 'direction': 'rtl' }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'font': [] }],
                    [{ 'align': [] }],
                    ['link', 'image'],
                    ['clean']
                ]
            },
            placeholder: 'Compose your announcement...'
        });
        
        // Update stats on text change
        quillEditor.on('text-change', function() {
            const text = quillEditor.getText();
            const html = quillEditor.root.innerHTML;
            updateEditorStats(text, html);
        });
        
        console.log('✏️ Quill editor initialized');
    } catch (error) {
        console.error('❌ Error initializing Quill editor:', error);
    }
}

function updateEditorStats(text, html) {
    try {
        const characterCount = text.length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const readingTime = Math.ceil(wordCount / 200); // Average reading speed
        
        const characterCountEl = document.getElementById('characterCount');
        const wordCountEl = document.getElementById('wordCount');
        const readingTimeEl = document.getElementById('readingTime');
        
        if (characterCountEl) characterCountEl.textContent = `${characterCount} characters`;
        if (wordCountEl) wordCountEl.textContent = `${wordCount} words`;
        if (readingTimeEl) readingTimeEl.textContent = `~${readingTime} min read`;
    } catch (error) {
        console.error('❌ Error updating editor stats:', error);
    }
}

function loadTemplate(templateType) {
    try {
        const templates = {
            welcome: `<p>Dear Students,</p><p>Welcome to our course! We're excited to have you join us this semester.</p><p>Best regards,<br>${currentUser.name}</p>`,
            reminder: `<p>Hello Students,</p><p>This is a friendly reminder about [TOPIC]. Please ensure you [ACTION] by [DATE].</p><p>Thank you,<br>${currentUser.name}</p>`,
            urgent: `<p><strong>URGENT NOTICE</strong></p><p>Dear Recipients,</p><p>[URGENT MESSAGE]</p><p>Immediate action required. Please [ACTION].</p><p>${currentUser.name}</p>`,
            exam: `<p>Dear Students,</p><p>This is to inform you about the upcoming examination:</p><ul><li>Subject: [SUBJECT]</li><li>Date: [DATE]</li><li>Time: [TIME]</li><li>Venue: [VENUE]</li></ul><p>Best of luck!<br>${currentUser.name}</p>`
        };
        
        if (quillEditor && templates[templateType]) {
            quillEditor.root.innerHTML = templates[templateType];
            updateEditorStats(quillEditor.getText(), templates[templateType]);
            showNotification(`${templateType.charAt(0).toUpperCase() + templateType.slice(1)} template loaded`, 'success');
        }
        
        console.log('📋 Template loaded:', templateType);
    } catch (error) {
        console.error('❌ Error loading template:', error);
    }
}

// Recipient Management
function switchRecipientTab(tabName) {
    try {
        // Update tab buttons
        document.querySelectorAll('.recipient-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick="switchRecipientTab('${tabName}')"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.recipient-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        console.log('👥 Recipient tab switched to:', tabName);
    } catch (error) {
        console.error('❌ Error switching recipient tab:', error);
    }
}

function toggleAllClasses() {
    try {
        const selectAllCheckbox = document.getElementById('selectAllClasses');
        const classCheckboxes = document.querySelectorAll('.class-checkbox');
        
        classCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        
        updateRecipientCount();
        console.log('👥 All classes toggled:', selectAllCheckbox.checked);
    } catch (error) {
        console.error('❌ Error toggling all classes:', error);
    }
}

function toggleAllParents() {
    try {
        const selectAllCheckbox = document.getElementById('selectAllParents');
        const parentCheckboxes = document.querySelectorAll('.parent-checkbox');
        
        parentCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        
        updateRecipientCount();
        console.log('👥 All parents toggled:', selectAllCheckbox.checked);
    } catch (error) {
        console.error('❌ Error toggling all parents:', error);
    }
}

function toggleAllTeachers() {
    try {
        const selectAllCheckbox = document.getElementById('selectAllTeachers');
        const teacherCheckboxes = document.querySelectorAll('.teacher-checkbox');
        
        teacherCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        
        updateRecipientCount();
        console.log('👥 All teachers toggled:', selectAllCheckbox.checked);
    } catch (error) {
        console.error('❌ Error toggling all teachers:', error);
    }
}

function updateRecipientCount() {
    try {
        let count = 0;
        
        // Count selected classes (students)
        document.querySelectorAll('.class-checkbox:checked').forEach(checkbox => {
            const studentCounts = {
                'cs-2a': 45,
                'cs-2b': 42,
                'it-3a': 38,
                'mca-1': 35
            };
            count += studentCounts[checkbox.value] || 0;
        });
        
        // Count selected parents
        document.querySelectorAll('.parent-checkbox:checked').forEach(checkbox => {
            const parentCounts = {
                'fathers': 160,
                'mothers': 160,
                'guardians': 45
            };
            count += parentCounts[checkbox.value] || 0;
        });
        
        // Count selected teachers
        document.querySelectorAll('.teacher-checkbox:checked').forEach(checkbox => {
            const teacherCounts = {
                'computer-science': 25,
                'information-technology': 20,
                'management': 15
            };
            count += teacherCounts[checkbox.value] || 0;
        });
        
        // Count custom recipients
        const customRecipients = document.getElementById('customRecipients');
        if (customRecipients && customRecipients.value.trim()) {
            const emails = customRecipients.value.split(',').filter(email => email.trim());
            count += emails.length;
        }
        
        const recipientCountEl = document.getElementById('recipientCount');
        if (recipientCountEl) {
            recipientCountEl.textContent = `${count} recipients selected`;
        }
        
        currentRecipients = count;
        console.log('👥 Recipient count updated:', count);
    } catch (error) {
        console.error('❌ Error updating recipient count:', error);
    }
}

function handleRecipientFile(input) {
    try {
        const file = input.files[0];
        if (!file) return;
        
        if (file.type !== 'text/csv') {
            showNotification('Please select a CSV file', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const csv = e.target.result;
            const lines = csv.split('\n');
            const emails = [];
            
            lines.forEach((line, index) => {
                if (index === 0) return; // Skip header
                const columns = line.split(',');
                if (columns[0] && columns[0].trim()) {
                    emails.push(columns.trim());
                }
            });
            
            document.getElementById('customRecipients').value = emails.join(', ');
            updateRecipientCount();
            showNotification(`Loaded ${emails.length} recipients from CSV`, 'success');
        };
        
        reader.readAsText(file);
        console.log('📤 CSV file processed');
    } catch (error) {
        console.error('❌ Error handling recipient file:', error);
        showNotification('Failed to process CSV file', 'error');
    }
}

// Scheduling
function toggleSchedule() {
    try {
        const scheduleCheckbox = document.getElementById('scheduleDelivery');
        const scheduleControls = document.getElementById('scheduleControls');
        
        if (scheduleCheckbox && scheduleControls) {
            scheduleControls.style.display = scheduleCheckbox.checked ? 'block' : 'none';
            
            if (scheduleCheckbox.checked) {
                // Set default schedule time to 1 hour from now
                const now = new Date();
                now.setHours(now.getHours() + 1);
                const scheduleDateTime = document.getElementById('scheduleDateTime');
                if (scheduleDateTime) {
                    scheduleDateTime.value = now.toISOString().slice(0, 16);
                }
            }
        }
        
        console.log('⏰ Schedule toggle:', scheduleCheckbox.checked);
    } catch (error) {
        console.error('❌ Error toggling schedule:', error);
    }
}

// Attachments Management
function handleAttachments(files) {
    try {
        const fileArray = Array.from(files);
        
        fileArray.forEach(file => {
            if (validateAttachment(file)) {
                addAttachment(file);
            }
        });
        
        renderAttachments();
        console.log('📎 Attachments processed:', fileArray.length);
    } catch (error) {
        console.error('❌ Error handling attachments:', error);
        showNotification('Error processing attachments', 'error');
    }
}

function validateAttachment(file) {
    try {
        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            showNotification(`File ${file.name} is too large (max 10MB)`, 'error');
            return false;
        }
        
        // Check for duplicate names
        if (attachments.some(att => att.name === file.name)) {
            showNotification(`File ${file.name} is already attached`, 'warning');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error validating attachment:', error);
        return false;
    }
}

function addAttachment(file) {
    try {
        const attachment = {
            id: 'att-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            file: file
        };
        
        attachments.push(attachment);
        console.log('📎 Attachment added:', file.name);
    } catch (error) {
        console.error('❌ Error adding attachment:', error);
    }
}

function renderAttachments() {
    try {
        const container = document.getElementById('attachmentsList');
        if (!container) return;
        
        if (attachments.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        const attachmentsHTML = attachments.map(attachment => `
            <div class="attachment-item">
                <div class="attachment-icon">
                    <i class="fas fa-file"></i>
                </div>
                <div class="attachment-info">
                    <div class="attachment-name">${attachment.name}</div>
                    <div class="attachment-size">${formatFileSize(attachment.size)}</div>
                </div>
                <button class="attachment-remove" onclick="removeAttachment('${attachment.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        
        container.innerHTML = attachmentsHTML;
        console.log('📎 Attachments rendered:', attachments.length);
    } catch (error) {
        console.error('❌ Error rendering attachments:', error);
    }
}

function removeAttachment(attachmentId) {
    try {
        attachments = attachments.filter(att => att.id !== attachmentId);
        renderAttachments();
        console.log('📎 Attachment removed:', attachmentId);
    } catch (error) {
        console.error('❌ Error removing attachment:', error);
    }
}

// Announcement Actions
function saveDraft() {
    try {
        if (!validateAnnouncementForm(false)) return;
        
        const announcementData = getAnnouncementFormData();
        announcementData.status = 'draft';
        
        // Save as draft
        const newNotification = {
            id: 'notif-' + Date.now(),
            ...announcementData,
            createdAt: new Date().toISOString(),
            sentAt: null,
            analytics: {
                sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0,
                openRate: 0, clickRate: 0, responseRate: 0
            },
            author: currentUser.name
        };
        
        notifications.unshift(newNotification);
        filteredNotifications = [...notifications];
        
        renderNotifications();
        loadNotificationStats();
        closeAnnouncementModal();
        
        showNotification('Announcement saved as draft!', 'success');
        console.log('💾 Announcement saved as draft');
    } catch (error) {
        console.error('❌ Error saving draft:', error);
        showNotification('Failed to save draft', 'error');
    }
}

function previewAnnouncement() {
    try {
        if (!validateAnnouncementForm(false)) return;
        
        const announcementData = getAnnouncementFormData();
        openPreviewModal(announcementData);
        
        console.log('👁️ Announcement preview opened');
    } catch (error) {
        console.error('❌ Error previewing announcement:', error);
        showNotification('Failed to open preview', 'error');
    }
}

function sendAnnouncement() {
    try {
        if (!validateAnnouncementForm(true)) return;
        
        const announcementData = getAnnouncementFormData();
        
        if (announcementData.scheduledAt) {
            // Schedule announcement
            announcementData.status = 'scheduled';
            
            const newNotification = {
                id: 'notif-' + Date.now(),
                ...announcementData,
                createdAt: new Date().toISOString(),
                sentAt: null,
                analytics: {
                    sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0,
                    openRate: 0, clickRate: 0, responseRate: 0
                },
                author: currentUser.name
            };
            
            notifications.unshift(newNotification);
            filteredNotifications = [...notifications];
            
            renderNotifications();
            loadNotificationStats();
            closeAnnouncementModal();
            
            showNotification(`Announcement scheduled for ${formatDate(new Date(announcementData.scheduledAt))}`, 'success');
        } else {
            // Send immediately
            sendAnnouncementNow(announcementData);
        }
        
        console.log('📤 Send announcement initiated');
    } catch (error) {
        console.error('❌ Error sending announcement:', error);
        showNotification('Failed to send announcement', 'error');
    }
}

function sendAnnouncementNow(announcementData) {
    try {
        announcementData.status = 'sent';
        announcementData.sentAt = new Date().toISOString();
        
        const newNotification = {
            id: 'notif-' + Date.now(),
            ...announcementData,
            createdAt: new Date().toISOString(),
            analytics: {
                sent: announcementData.recipientCount,
                delivered: Math.floor(announcementData.recipientCount * 0.98),
                opened: Math.floor(announcementData.recipientCount * 0.75),
                clicked: Math.floor(announcementData.recipientCount * 0.35),
                replied: Math.floor(announcementData.recipientCount * 0.08),
                openRate: 75, clickRate: 35, responseRate: 8
            },
            author: currentUser.name
        };
        
        notifications.unshift(newNotification);
        filteredNotifications = [...notifications];
        
        // Show sending progress
        showSendingProgress(announcementData.recipientCount);
        
        setTimeout(() => {
            renderNotifications();
            loadNotificationStats();
            closeAnnouncementModal();
            
            showNotification(`Announcement sent to ${announcementData.recipientCount} recipients!`, 'success');
        }, 3000);
        
        console.log('📤 Announcement sent immediately');
    } catch (error) {
        console.error('❌ Error sending announcement now:', error);
    }
}

function getAnnouncementFormData() {
    try {
        const scheduleDelivery = document.getElementById('scheduleDelivery').checked;
        const scheduledAt = scheduleDelivery ? document.getElementById('scheduleDateTime').value : null;
        
        const selectedChannels = [];
        if (document.getElementById('sendEmail').checked) selectedChannels.push('email');
        if (document.getElementById('sendSMS').checked) selectedChannels.push('sms');
        if (document.getElementById('sendInApp').checked) selectedChannels.push('inapp');
        if (document.getElementById('sendPush').checked) selectedChannels.push('push');
        
        return {
            title: document.getElementById('announcementTitle').value.trim(),
            content: quillEditor ? quillEditor.root.innerHTML : '',
            category: document.getElementById('announcementCategory').value,
            priority: document.getElementById('priorityLevel').value,
            channels: selectedChannels,
            recipientCount: currentRecipients,
            recipients: gatherSelectedRecipients(),
            scheduledAt: scheduledAt,
            expiryDate: document.getElementById('expiryDate').value || null,
            attachments: attachments.map(att => ({
                name: att.name,
                size: att.size,
                type: att.type
            }))
        };
    } catch (error) {
        console.error('❌ Error getting announcement form data:', error);
        return {};
    }
}

function gatherSelectedRecipients() {
    try {
        const recipients = {
            students: [],
            parents: [],
            teachers: [],
            custom: []
        };
        
        // Gather selected students
        document.querySelectorAll('.class-checkbox:checked').forEach(checkbox => {
            recipients.students.push(checkbox.value);
        });
        
        // Gather selected parents
        document.querySelectorAll('.parent-checkbox:checked').forEach(checkbox => {
            recipients.parents.push(checkbox.value);
        });
        
        // Gather selected teachers
        document.querySelectorAll('.teacher-checkbox:checked').forEach(checkbox => {
            recipients.teachers.push(checkbox.value);
        });
        
        // Gather custom recipients
        const customRecipients = document.getElementById('customRecipients');
        if (customRecipients && customRecipients.value.trim()) {
            recipients.custom = customRecipients.value.split(',').map(email => email.trim()).filter(email => email);
        }
        
        return recipients;
    } catch (error) {
        console.error('❌ Error gathering recipients:', error);
        return { students: [], parents: [], teachers: [], custom: [] };
    }
}

function validateAnnouncementForm(requireRecipients = true) {
    try {
        const errors = [];
        
        // Validate title
        const title = document.getElementById('announcementTitle').value.trim();
        if (!title) errors.push('Announcement title is required');
        
        // Validate content
        if (!quillEditor || quillEditor.getText().trim().length < 10) {
            errors.push('Message content must be at least 10 characters');
        }
        
        // Validate recipients
        if (requireRecipients && currentRecipients === 0) {
            errors.push('Please select at least one recipient');
        }
        
        // Validate channels
        const hasChannel = document.getElementById('sendEmail').checked ||
                          document.getElementById('sendSMS').checked ||
                          document.getElementById('sendInApp').checked ||
                          document.getElementById('sendPush').checked;
        if (!hasChannel) {
            errors.push('Please select at least one delivery channel');
        }
        
        // Validate schedule date
        const scheduleDelivery = document.getElementById('scheduleDelivery').checked;
        if (scheduleDelivery) {
            const scheduleDateTime = document.getElementById('scheduleDateTime').value;
            if (!scheduleDateTime) {
                errors.push('Please select a schedule date and time');
            } else if (new Date(scheduleDateTime) <= new Date()) {
                errors.push('Schedule date must be in the future');
            }
        }
        
        if (errors.length > 0) {
            showNotification(errors[0], 'error');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error validating announcement form:', error);
        return false;
    }
}

// Bulk Messaging
function bulkMessage() {
    try {
        const modal = document.getElementById('bulkMessageModal');
        modal.style.display = 'flex';
        
        // Reset quick message form
        const quickForm = document.getElementById('quickMessageForm');
        if (quickForm) quickForm.style.display = 'none';
        
        console.log('📡 Bulk message modal opened');
    } catch (error) {
        console.error('❌ Error opening bulk message modal:', error);
        showNotification('Failed to open bulk messaging', 'error');
    }
}

function closeBulkMessageModal() {
    try {
        const modal = document.getElementById('bulkMessageModal');
        modal.style.display = 'none';
        
        // Reset forms
        const quickForm = document.getElementById('quickMessageForm');
        if (quickForm) quickForm.style.display = 'none';
        
        console.log('📡 Bulk message modal closed');
    } catch (error) {
        console.error('❌ Error closing bulk message modal:', error);
    }
}

function switchBulkTab(tabName) {
    try {
        // Update tab buttons
        document.querySelectorAll('.bulk-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick="switchBulkTab('${tabName}')"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.bulk-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        console.log('📡 Bulk tab switched to:', tabName);
    } catch (error) {
        console.error('❌ Error switching bulk tab:', error);
    }
}

function selectMessageType(messageType) {
    try {
        const quickForm = document.getElementById('quickMessageForm');
        const selectedTypeElement = document.getElementById('selectedMessageType');
        const titleInput = document.getElementById('quickMessageTitle');
        const contentInput = document.getElementById('quickMessageContent');
        
        if (QUICK_MESSAGE_TYPES[messageType]) {
            const typeConfig = QUICK_MESSAGE_TYPES[messageType];
            
            selectedTypeElement.textContent = typeConfig.title;
            titleInput.value = typeConfig.title + ': ';
            contentInput.value = typeConfig.template;
            
            quickForm.style.display = 'block';
        }
        
        console.log('📡 Message type selected:', messageType);
    } catch (error) {
        console.error('❌ Error selecting message type:', error);
    }
}

function loadBulkTemplate() {
    try {
        const templateSelect = document.getElementById('bulkTemplate');
        const selectedTemplate = templateSelect.value;
        
        if (selectedTemplate && MOCK_TEMPLATES.length > 0) {
            const template = MOCK_TEMPLATES.find(t => t.name.toLowerCase().includes(selectedTemplate));
            if (template) {
                showNotification(`Template "${template.name}" loaded`, 'success');
            }
        }
        
        console.log('📋 Bulk template loaded:', selectedTemplate);
    } catch (error) {
        console.error('❌ Error loading bulk template:', error);
    }
}

function insertTag(tag) {
    try {
        showNotification(`Tag ${tag} would be inserted at cursor position`, 'info');
        console.log('🏷️ Tag inserted:', tag);
    } catch (error) {
        console.error('❌ Error inserting tag:', error);
    }
}

function sendBulkMessage() {
    try {
        const quickForm = document.getElementById('quickMessageForm');
        
        if (quickForm.style.display === 'block') {
            // Send quick message
            const title = document.getElementById('quickMessageTitle').value.trim();
            const content = document.getElementById('quickMessageContent').value.trim();
            const recipients = Array.from(document.getElementById('quickRecipients').selectedOptions).map(option => option.text);
            
            if (!title || !content || recipients.length === 0) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Simulate sending
            showNotification('Sending bulk message...', 'info');
            
            setTimeout(() => {
                closeBulkMessageModal();
                showNotification(`Bulk message sent to ${recipients.length} class(es)!`, 'success');
                
                // Add to notifications list
                const newNotification = {
                    id: 'notif-' + Date.now(),
                    title: title,
                    content: `<p>${content.replace(/\n/g, '</p><p>')}</p>`,
                    category: 'general',
                    priority: 'normal',
                    status: 'sent',
                    recipients: { students: recipients, parents: [], teachers: [], custom: [] },
                    recipientCount: recipients.length * 40, // Approximate
                    channels: ['email', 'inapp'],
                    createdAt: new Date().toISOString(),
                    sentAt: new Date().toISOString(),
                    scheduledAt: null,
                    expiryDate: null,
                    analytics: {
                        sent: recipients.length * 40,
                        delivered: recipients.length * 39,
                        opened: recipients.length * 30,
                        clicked: recipients.length * 12,
                        replied: recipients.length * 3,
                        openRate: 75, clickRate: 30, responseRate: 7.5
                    },
                    attachments: [],
                    author: currentUser.name
                };
                
                notifications.unshift(newNotification);
                filteredNotifications = [...notifications];
                renderNotifications();
                loadNotificationStats();
            }, 2000);
        }
        
        console.log('📡 Bulk message sent');
    } catch (error) {
        console.error('❌ Error sending bulk message:', error);
        showNotification('Failed to send bulk message', 'error');
    }
}

// Analytics
function viewAnalytics(notificationId = null) {
    try {
        const modal = document.getElementById('analyticsModal');
        
        if (notificationId) {
            const notification = notifications.find(n => n.id === notificationId);
            if (notification) {
                loadSpecificAnalytics(notification);
            }
        } else {
            loadOverallAnalytics();
        }
        
        modal.style.display = 'flex';
        console.log('📊 Analytics modal opened');
    } catch (error) {
        console.error('❌ Error opening analytics:', error);
        showNotification('Failed to open analytics', 'error');
    }
}

function closeAnalyticsModal() {
    try {
        const modal = document.getElementById('analyticsModal');
        modal.style.display = 'none';
        console.log('📊 Analytics modal closed');
    } catch (error) {
        console.error('❌ Error closing analytics modal:', error);
    }
}

function switchAnalyticsTab(tabName) {
    try {
        // Update tab buttons
        document.querySelectorAll('.analytics-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick="switchAnalyticsTab('${tabName}')"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.analytics-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-analytics`).classList.add('active');
        
        console.log('📊 Analytics tab switched to:', tabName);
    } catch (error) {
        console.error('❌ Error switching analytics tab:', error);
    }
}

function loadOverallAnalytics() {
    try {
        // This would load comprehensive analytics
        console.log('📊 Overall analytics loaded');
    } catch (error) {
        console.error('❌ Error loading overall analytics:', error);
    }
}

function loadSpecificAnalytics(notification) {
    try {
        // Update analytics cards with specific notification data
        const overviewTab = document.getElementById('overview-analytics');
        if (overviewTab) {
            const cards = overviewTab.querySelectorAll('.analytics-card');
            if (cards.length >= 4) {
                cards[0].querySelector('.analytics-number').textContent = notification.analytics.sent;
                cards[1].querySelector('.analytics-number').textContent = notification.analytics.openRate + '%';
                cards.querySelector('.analytics-number').textContent = notification.analytics.responseRate + '%';
                cards.querySelector('.analytics-number').textContent = notification.recipientCount;
            }
        }
        
        console.log('📊 Specific analytics loaded for:', notification.title);
    } catch (error) {
        console.error('❌ Error loading specific analytics:', error);
    }
}

// Preview System
function openPreviewModal(announcementData) {
    try {
        const modal = document.getElementById('previewModal');
        const container = document.getElementById('previewContainer');
        
        // Generate preview content
        const previewHTML = generatePreviewHTML(announcementData);
        container.innerHTML = previewHTML;
        
        modal.style.display = 'flex';
        console.log('👁️ Preview modal opened');
    } catch (error) {
        console.error('❌ Error opening preview modal:', error);
    }
}

function closePreviewModal() {
    try {
        const modal = document.getElementById('previewModal');
        modal.style.display = 'none';
        console.log('👁️ Preview modal closed');
    } catch (error) {
        console.error('❌ Error closing preview modal:', error);
    }
}

function generatePreviewHTML(announcementData) {
    try {
        const previewDevice = document.getElementById('previewDevice')?.value || 'email';
        
        const baseContent = `
            <div class="preview-${previewDevice}">
                <div class="preview-header">
                    <h3>${announcementData.title}</h3>
                    <div class="preview-meta">
                        <span class="priority-badge priority-${announcementData.priority}">${announcementData.priority}</span>
                        <span>From: ${currentUser.name}</span>
                        <span>To: ${announcementData.recipientCount} recipients</span>
                    </div>
                </div>
                <div class="preview-content">
                    ${announcementData.content}
                    ${announcementData.attachments.length > 0 ? 
                        `<div class="preview-attachments">
                            <h4>Attachments:</h4>
                            ${announcementData.attachments.map(att => 
                                `<div class="preview-attachment">
                                    <i class="fas fa-paperclip"></i> ${att.name} (${formatFileSize(att.size)})
                                </div>`
                            ).join('')}
                        </div>` : ''
                    }
                </div>
                <div class="preview-footer">
                    <small>This is a preview of how your announcement will appear to recipients.</small>
                </div>
            </div>
        `;
        
        return baseContent;
    } catch (error) {
        console.error('❌ Error generating preview HTML:', error);
        return '<p>Error generating preview</p>';
    }
}

function approveAndSend() {
    try {
        closePreviewModal();
        sendAnnouncement();
        console.log('✅ Announcement approved and sent');
    } catch (error) {
        console.error('❌ Error approving and sending:', error);
    }
}

// Template Management
function createTemplate() {
    try {
        const modal = document.getElementById('templateModal');
        
        // Reset form
        const form = document.getElementById('templateForm');
        if (form) form.reset();
        
        // Initialize template editor
        setTimeout(() => {
            initializeTemplateEditor();
        }, 100);
        
        modal.style.display = 'flex';
        console.log('📋 Template creation modal opened');
    } catch (error) {
        console.error('❌ Error opening template modal:', error);
    }
}

function closeTemplateModal() {
    try {
        const modal = document.getElementById('templateModal');
        modal.style.display = 'none';
        
        // Destroy template editor
        if (templateEditor) {
            templateEditor = null;
        }
        
        console.log('📋 Template modal closed');
    } catch (error) {
        console.error('❌ Error closing template modal:', error);
    }
}

function initializeTemplateEditor() {
    try {
        if (templateEditor) return;
        
        templateEditor = new Quill('#templateEditor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link'],
                    ['clean']
                ]
            },
            placeholder: 'Enter your template content...'
        });
        
        console.log('✏️ Template editor initialized');
    } catch (error) {
        console.error('❌ Error initializing template editor:', error);
    }
}

function saveTemplate() {
    try {
        const name = document.getElementById('templateName').value.trim();
        const category = document.getElementById('templateCategory').value;
        const subject = document.getElementById('templateSubject').value.trim();
        const description = document.getElementById('templateDescription').value.trim();
        const content = templateEditor ? templateEditor.root.innerHTML : '';
        
        if (!name || !content.trim()) {
            showNotification('Template name and content are required', 'error');
            return;
        }
        
        const newTemplate = {
            id: 'template-' + Date.now(),
            name: name,
            category: category,
            subject: subject,
            content: content,
            description: description,
            usageCount: 0,
            lastUsed: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        
        messageTemplates.unshift(newTemplate);
        renderTemplates();
        closeTemplateModal();
        
        showNotification('Template saved successfully!', 'success');
        console.log('💾 Template saved:', name);
    } catch (error) {
        console.error('❌ Error saving template:', error);
        showNotification('Failed to save template', 'error');
    }
}

function useTemplate(templateId) {
    try {
        const template = messageTemplates.find(t => t.id === templateId);
        if (!template) return;
        
        // Open announcement modal with template content
        createAnnouncement();
        
        setTimeout(() => {
            if (quillEditor) {
                quillEditor.root.innerHTML = template.content;
                updateEditorStats(quillEditor.getText(), template.content);
            }
            
            document.getElementById('announcementTitle').value = template.subject || template.name;
            document.getElementById('announcementCategory').value = template.category;
            
            // Update usage count
            template.usageCount++;
            template.lastUsed = new Date().toISOString();
            renderTemplates();
            
            showNotification(`Template "${template.name}" loaded`, 'success');
        }, 500);
        
        console.log('📋 Template used:', template.name);
    } catch (error) {
        console.error('❌ Error using template:', error);
    }
}

function editTemplate(templateId) {
    try {
        const template = messageTemplates.find(t => t.id === templateId);
        if (!template) return;
        
        const modal = document.getElementById('templateModal');
        
        // Populate form with template data
        document.getElementById('templateName').value = template.name;
        document.getElementById('templateCategory').value = template.category;
        document.getElementById('templateSubject').value = template.subject;
        document.getElementById('templateDescription').value = template.description;
        
        setTimeout(() => {
            initializeTemplateEditor();
            if (templateEditor) {
                templateEditor.root.innerHTML = template.content;
            }
        }, 100);
        
        modal.style.display = 'flex';
        
        // Store template ID for updating
        modal.setAttribute('data-template-id', templateId);
        
        console.log('✏️ Template editing:', template.name);
    } catch (error) {
        console.error('❌ Error editing template:', error);
    }
}

function deleteTemplate(templateId) {
    try {
        const template = messageTemplates.find(t => t.id === templateId);
        if (!template) return;
        
        if (confirm(`Are you sure you want to delete template "${template.name}"?`)) {
            messageTemplates = messageTemplates.filter(t => t.id !== templateId);
            renderTemplates();
            showNotification('Template deleted successfully', 'success');
            console.log('🗑️ Template deleted:', template.name);
        }
    } catch (error) {
        console.error('❌ Error deleting template:', error);
    }
}

// Notification Actions
function editNotification(notificationId) {
    try {
        const notification = notifications.find(n => n.id === notificationId);
        if (!notification) return;
        
        // Open announcement modal with notification data
        createAnnouncement();
        
        setTimeout(() => {
            // Populate form with notification data
            document.getElementById('announcementTitle').value = notification.title;
            document.getElementById('priorityLevel').value = notification.priority;
            document.getElementById('announcementCategory').value = notification.category;
            
            if (quillEditor) {
                quillEditor.root.innerHTML = notification.content;
                updateEditorStats(quillEditor.getText(), notification.content);
            }
            
            // Set recipients, channels, etc.
            // This would be a more complex implementation
            
            showNotification(`Editing: ${notification.title}`, 'info');
        }, 500);
        
        console.log('✏️ Editing notification:', notification.title);
    } catch (error) {
        console.error('❌ Error editing notification:', error);
    }
}

function sendNotificationNow(notificationId) {
    try {
        const notification = notifications.find(n => n.id === notificationId);
        if (!notification) return;
        
        if (confirm(`Send "${notification.title}" immediately?`)) {
            notification.status = 'sent';
            notification.sentAt = new Date().toISOString();
            notification.analytics = {
                sent: notification.recipientCount,
                delivered: Math.floor(notification.recipientCount * 0.98),
                opened: Math.floor(notification.recipientCount * 0.75),
                clicked: Math.floor(notification.recipientCount * 0.35),
                replied: Math.floor(notification.recipientCount * 0.08),
                openRate: 75, clickRate: 35, responseRate: 8
            };
            
            renderNotifications();
            loadNotificationStats();
            
            showNotification(`"${notification.title}" sent successfully!`, 'success');
        }
        
        console.log('📤 Notification sent now:', notification.title);
    } catch (error) {
        console.error('❌ Error sending notification now:', error);
    }
}

function cancelScheduled(notificationId) {
    try {
        const notification = notifications.find(n => n.id === notificationId);
        if (!notification) return;
        
        if (confirm(`Cancel scheduled notification "${notification.title}"?`)) {
            notification.status = 'draft';
            notification.scheduledAt = null;
            
            renderNotifications();
            showNotification('Scheduled notification cancelled', 'info');
        }
        
        console.log('❌ Scheduled notification cancelled:', notification.title);
    } catch (error) {
        console.error('❌ Error cancelling scheduled notification:', error);
    }
}

function duplicateNotification(notificationId) {
    try {
        const notification = notifications.find(n => n.id === notificationId);
        if (!notification) return;
        
        const duplicateNotification = {
            ...notification,
            id: 'notif-' + Date.now(),
            title: notification.title + ' (Copy)',
            status: 'draft',
            createdAt: new Date().toISOString(),
            sentAt: null,
            scheduledAt: null,
            analytics: {
                sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0,
                openRate: 0, clickRate: 0, responseRate: 0
            }
        };
        
        notifications.unshift(duplicateNotification);
        filteredNotifications = [...notifications];
        
        renderNotifications();
        showNotification('Notification duplicated successfully', 'success');
        
        console.log('📋 Notification duplicated:', notification.title);
    } catch (error) {
        console.error('❌ Error duplicating notification:', error);
    }
}

function previewNotification(notificationId) {
    try {
        const notification = notifications.find(n => n.id === notificationId);
        if (!notification) return;
        
        openPreviewModal(notification);
        console.log('👁️ Previewing notification:', notification.title);
    } catch (error) {
        console.error('❌ Error previewing notification:', error);
    }
}

function deleteNotification(notificationId) {
    try {
        const notification = notifications.find(n => n.id === notificationId);
        if (!notification) return;
        
        if (confirm(`Are you sure you want to delete "${notification.title}"?`)) {
            notifications = notifications.filter(n => n.id !== notificationId);
            filteredNotifications = filteredNotifications.filter(n => n.id !== notificationId);
            
            renderNotifications();
            loadNotificationStats();
            
            showNotification('Notification deleted successfully', 'success');
        }
        
        console.log('🗑️ Notification deleted:', notification.title);
    } catch (error) {
        console.error('❌ Error deleting notification:', error);
    }
}

// Progress Tracking
function showSendingProgress(totalCount) {
    try {
        const modal = document.getElementById('sendProgressModal');
        
        // Initialize progress
        sendingProgress = {
            total: totalCount,
            sent: 0,
            failed: 0,
            percentage: 0
        };
        
        updateProgressDisplay();
        modal.style.display = 'flex';
        
        // Simulate sending progress
        const interval = setInterval(() => {
            sendingProgress.sent += Math.floor(Math.random() * 10) + 5;
            
            if (Math.random() < 0.05) {
                sendingProgress.failed += 1;
            }
            
            if (sendingProgress.sent >= sendingProgress.total) {
                sendingProgress.sent = sendingProgress.total;
                clearInterval(interval);
                
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 1000);
            }
            
            sendingProgress.percentage = Math.round((sendingProgress.sent / sendingProgress.total) * 100);
            updateProgressDisplay();
        }, 200);
        
        console.log('📊 Sending progress started');
    } catch (error) {
        console.error('❌ Error showing sending progress:', error);
    }
}

function updateProgressDisplay() {
    try {
        document.getElementById('sentCount').textContent = sendingProgress.sent;
        document.getElementById('failedCount').textContent = sendingProgress.failed;
        document.getElementById('totalCount').textContent = sendingProgress.total;
        document.getElementById('sendProgress').style.width = sendingProgress.percentage + '%';
        document.getElementById('progressPercentage').textContent = sendingProgress.percentage + '%';
        
        const statusMessages = [
            'Preparing recipients...',
            'Validating addresses...',
            'Sending notifications...',
            'Processing delivery...',
            'Finalizing...',
            'Complete!'
        ];
        
        const statusIndex = Math.floor((sendingProgress.percentage / 100) * (statusMessages.length - 1));
        document.getElementById('progressStatus').textContent = statusMessages[statusIndex];
    } catch (error) {
        console.error('❌ Error updating progress display:', error);
    }
}

// Utility Functions
function formatFileSize(bytes) {
    if (!bytes) return '0 B';
    
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(date) {
    try {
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

function truncateHTML(html, maxLength) {
    try {
        const text = html.replace(/<[^>]*>/g, '');
        if (text.length <= maxLength) return html;
        
        const truncated = text.substring(0, maxLength - 3) + '...';
        return `<p>${truncated}</p>`;
    } catch (error) {
        return html;
    }
}

function stripHTML(html) {
    try {
        return html.replace(/<[^>]*>/g, '');
    } catch (error) {
        return html;
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
        const searchInput = document.getElementById('notificationSearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(filterNotifications, 300);
            });
        }
        
        // Auto-update recipient count when checkboxes change
        document.addEventListener('change', function(e) {
            if (e.target.type === 'checkbox' && 
                (e.target.classList.contains('class-checkbox') || 
                 e.target.classList.contains('parent-checkbox') || 
                 e.target.classList.contains('teacher-checkbox'))) {
                updateRecipientCount();
            }
        });
        
        // Custom recipients input
        const customRecipients = document.getElementById('customRecipients');
        if (customRecipients) {
            customRecipients.addEventListener('input', updateRecipientCount);
        }
        
        // Drag and drop for attachments
        const dropZone = document.getElementById('attachmentDropZone');
        if (dropZone) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, preventDefaults, false);
            });
            
            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
            });
            
            dropZone.addEventListener('drop', function(e) {
                const files = e.dataTransfer.files;
                handleAttachments(files);
            }, false);
        }
        
        console.log('🎛️ Event listeners initialized');
    } catch (error) {
        console.error('❌ Error initializing event listeners:', error);
    }
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
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
        notifications,
        messageTemplates,
        showNotification,
        formatDate
    };
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('💥 Global error caught:', e.error);
    showNotification('An unexpected error occurred', 'error');
});

// Print debug info
console.log(`
📢 Notifications Center v3.0
✏️ Features: Rich Text Editor, Templates, Bulk Messaging
📊 Analytics: Engagement tracking, Delivery metrics
📧 Multi-channel: Email, SMS, In-app, Push notifications
⏰ Scheduling: Send now or schedule for later
📎 Attachments: File upload with drag & drop
👥 Recipients: Students, Parents, Teachers, Custom lists
📱 Mobile: Touch-friendly with responsive design
🌙 Theme: Dark/Light mode with editor integration
⚡ Performance: Optimized rendering, Real-time updates
🛡️ Validation: Form validation, File type checking
`);

console.log('🚀 Notifications Center JS loaded successfully! All systems operational!');
