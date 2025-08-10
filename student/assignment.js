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

// Current assignment being worked on
let currentAssignmentId = null;
let uploadedFiles = [];
let currentFilter = 'all';

// Mock assignments data
const ASSIGNMENTS_DATA = [
    {
        id: 'cs101_binary_trees',
        course: 'CS101 - Data Structures',
        title: 'Binary Trees Implementation',
        teacher: 'Prof. Michael Chen',
        type: 'Programming',
        description: 'Implement a binary search tree with insert, delete, and search operations. Include proper error handling and documentation.',
        status: 'overdue',
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        assignedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        progress: 0,
        weight: 15,
        estimatedHours: '4-6',
        teamWork: false
    },
    {
        id: 'cs102_complexity',
        course: 'CS102 - Algorithms',
        title: 'Time Complexity Analysis Report',
        teacher: 'Dr. Sarah Johnson',
        type: 'Report',
        description: 'Analyze the time complexity of various sorting algorithms and provide detailed explanations with examples.',
        status: 'pending',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        assignedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        progress: 65,
        weight: 12,
        estimatedHours: '3-4',
        teamWork: false
    },
    {
        id: 'cs103_er_diagram',
        course: 'CS103 - Database Systems',
        title: 'ER Diagram Design',
        teacher: 'Prof. David Wilson',
        type: 'Design',
        description: 'Create an Entity-Relationship diagram for a library management system with proper normalization.',
        status: 'submitted',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        assignedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        progress: 100,
        weight: 10,
        estimatedHours: '2-3',
        teamWork: false,
        fileName: 'library_er.pdf'
    },
    {
        id: 'math201_probability',
        course: 'MATH201 - Statistics',
        title: 'Probability Distribution Analysis',
        teacher: 'Dr. Lisa Park',
        type: 'Problem Set',
        description: 'Solve problems related to normal distribution, confidence intervals, and hypothesis testing.',
        status: 'graded',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        assignedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        submittedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        gradedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        progress: 100,
        weight: 20,
        estimatedHours: '4-5',
        teamWork: false,
        grade: 9.2,
        maxGrade: 10,
        feedback: 'Excellent work on the statistical analysis. Your methodology is sound and conclusions are well-supported.'
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    initializeFileUpload();
    updateStats();
    
    // Close mobile sidebar when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    });
    
    // Set default date filter to today
    document.getElementById('dateFilter').value = new Date().toISOString().split('T')[0];
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
        alert('Access denied. Student account required.');
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

function updateStats() {
    const pending = ASSIGNMENTS_DATA.filter(a => a.status === 'pending').length;
    const submitted = ASSIGNMENTS_DATA.filter(a => a.status === 'submitted').length;
    const graded = ASSIGNMENTS_DATA.filter(a => a.status === 'graded').length;
    const overdue = ASSIGNMENTS_DATA.filter(a => a.status === 'overdue').length;
    
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('submittedCount').textContent = submitted;
    document.getElementById('gradedCount').textContent = graded;
    document.getElementById('overdueCount').textContent = overdue;
    
    // Animate numbers
    animateNumber(document.getElementById('pendingCount'), pending);
    animateNumber(document.getElementById('submittedCount'), submitted);
    animateNumber(document.getElementById('gradedCount'), graded);
    animateNumber(document.getElementById('overdueCount'), overdue);
}

function animateNumber(element, target) {
    const start = 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function filterAssignments() {
    const subjectFilter = document.getElementById('subjectFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    showNotification(`Filters applied: Subject: ${subjectFilter || 'All'}, Status: ${statusFilter || 'All'}`, 'info');
}

function toggleFilter(filter) {
    // Remove active class from all filter tags
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.classList.remove('active');
    });
    
    // Add active class to clicked filter
    event.target.classList.add('active');
    currentFilter = filter;
    
    showNotification(`Showing ${filter} assignments`, 'info');
}

function refreshAssignments() {
    showNotification('Refreshing assignments...', 'info');
    
    setTimeout(() => {
        updateStats();
        showNotification('Assignments refreshed successfully!', 'success');
    }, 1500);
}

function startAssignment(assignmentId) {
    const assignment = ASSIGNMENTS_DATA.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    showNotification(`Starting "${assignment.title}"`, 'info');
    
    // Simulate starting work
    setTimeout(() => {
        assignment.progress = 10;
        showNotification('Assignment started! Progress saved.', 'success');
    }, 1000);
}

function continueAssignment(assignmentId) {
    const assignment = ASSIGNMENTS_DATA.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    showNotification(`Continuing work on "${assignment.title}"`, 'info');
}

function submitAssignment(assignmentId) {
    const assignment = ASSIGNMENTS_DATA.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    currentAssignmentId = assignmentId;
    document.getElementById('assignmentTitle').value = assignment.title;
    document.getElementById('submissionModal').classList.add('show');
}

function viewDetails(assignmentId) {
    const assignment = ASSIGNMENTS_DATA.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    showNotification(`Viewing details for "${assignment.title}"`, 'info');
}

function requestExtension(assignmentId) {
    const assignment = ASSIGNMENTS_DATA.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    if (confirm(`Request extension for "${assignment.title}"?\n\nThis will send a notification to your teacher.`)) {
        showNotification('Extension request sent to teacher', 'success');
    }
}

function viewSubmission(assignmentId) {
    const assignment = ASSIGNMENTS_DATA.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    showNotification(`Viewing submission for "${assignment.title}"`, 'info');
}

function editSubmission(assignmentId) {
    const assignment = ASSIGNMENTS_DATA.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    showNotification('Opening edit mode (if allowed by teacher)', 'info');
}

function downloadSubmission(assignmentId) {
    const assignment = ASSIGNMENTS_DATA.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    showNotification(`Downloading ${assignment.fileName || 'submission'}...`, 'info');
    
    setTimeout(() => {
        showNotification('Download completed!', 'success');
    }, 2000);
}

function viewFeedback(assignmentId) {
    const assignment = ASSIGNMENTS_DATA.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    if (assignment.feedback) {
        alert(`Teacher Feedback:\n\n${assignment.feedback}`);
    } else {
        showNotification('No feedback available yet', 'info');
    }
}

function viewSolution(assignmentId) {
    showNotification('Opening model solution...', 'info');
}

function downloadGraded(assignmentId) {
    showNotification('Downloading graded assignment...', 'info');
    
    setTimeout(() => {
        showNotification('Download completed!', 'success');
    }, 2000);
}

function openQuickSubmit() {
    document.getElementById('submissionModal').classList.add('show');
}

function closeSubmissionModal() {
    document.getElementById('submissionModal').classList.remove('show');
    document.getElementById('submissionForm').reset();
    uploadedFiles = [];
    updateFilesList();
    currentAssignmentId = null;
}

// File Upload Functionality
function initializeFileUpload() {
    const fileUpload = document.getElementById('fileUpload');
    const fileInput = document.getElementById('fileInput');
    
    // Drag and drop events
    fileUpload.addEventListener('dragover', function(e) {
        e.preventDefault();
        fileUpload.classList.add('dragover');
    });
    
    fileUpload.addEventListener('dragleave', function(e) {
        e.preventDefault();
        fileUpload.classList.remove('dragover');
    });
    
    fileUpload.addEventListener('drop', function(e) {
        e.preventDefault();
        fileUpload.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });
    
    // File input change
    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        handleFiles(files);
    });
    
    // Submission type change
    document.getElementById('submissionType').addEventListener('change', function(e) {
        toggleSubmissionSections(e.target.value);
    });
}

function triggerFileInput() {
    document.getElementById('fileInput').click();
}

function handleFiles(files) {
    files.forEach(file => {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            showNotification(`File ${file.name} is too large (max 10MB)`, 'error');
            return;
        }
        
        const fileObj = {
            id: Date.now() + Math.random(),
            file: file,
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type
        };
        
        uploadedFiles.push(fileObj);
    });
    
    updateFilesList();
    showNotification(`${files.length} file(s) added successfully`, 'success');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateFilesList() {
    const container = document.getElementById('uploadedFiles');
    container.innerHTML = '';
    
    uploadedFiles.forEach(fileObj => {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'uploaded-file';
        
        fileDiv.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file file-icon"></i>
                <div>
                    <div class="file-name">${fileObj.name}</div>
                    <div class="file-size">${fileObj.size}</div>
                </div>
            </div>
            <button class="remove-file" onclick="removeFile('${fileObj.id}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(fileDiv);
    });
}

function removeFile(fileId) {
    uploadedFiles = uploadedFiles.filter(f => f.id != fileId);
    updateFilesList();
    showNotification('File removed', 'info');
}

function toggleSubmissionSections(type) {
    const fileSection = document.getElementById('fileUploadSection');
    const textSection = document.getElementById('textSubmissionSection');
    const linkSection = document.getElementById('linkSubmissionSection');
    
    // Hide all sections first
    fileSection.style.display = 'none';
    textSection.style.display = 'none';
    linkSection.style.display = 'none';
    
    // Show relevant sections based on type
    if (type === 'file' || type === 'both') {
        fileSection.style.display = 'block';
    }
    if (type === 'text' || type === 'both') {
        textSection.style.display = 'block';
    }
    if (type === 'link') {
        linkSection.style.display = 'block';
    }
}

function handleSubmission(event) {
    event.preventDefault();
    
    const submissionType = document.getElementById('submissionType').value;
    const textSubmission = document.getElementById('textSubmission').value;
    const externalLink = document.getElementById('externalLink').value;
    const comments = document.getElementById('comments').value;
    const confirmed = document.getElementById('confirmSubmission').checked;
    
    if (!confirmed) {
        showNotification('Please confirm academic integrity', 'error');
        return;
    }
    
    // Validate based on submission type
    if (submissionType === 'file' && uploadedFiles.length === 0) {
        showNotification('Please upload at least one file', 'error');
        return;
    }
    
    if (submissionType === 'text' && !textSubmission.trim()) {
        showNotification('Please enter your text submission', 'error');
        return;
    }
    
    if (submissionType === 'link' && !externalLink.trim()) {
        showNotification('Please enter the external link', 'error');
        return;
    }
    
    if (submissionType === 'both' && uploadedFiles.length === 0 && !textSubmission.trim()) {
        showNotification('Please provide either files or text submission', 'error');
        return;
    }
    
    // Show submission progress
    showNotification('Submitting assignment...', 'info');
    
    // Simulate submission process
    setTimeout(() => {
        if (currentAssignmentId) {
            const assignment = ASSIGNMENTS_DATA.find(a => a.id === currentAssignmentId);
            if (assignment) {
                assignment.status = 'submitted';
                assignment.submittedDate = new Date();
                assignment.progress = 100;
            }
        }
        
        closeSubmissionModal();
        updateStats();
        showNotification('Assignment submitted successfully!', 'success');
    }, 3000);
}

function saveDraft() {
    showNotification('Draft saved successfully!', 'success');
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
document.getElementById('submissionModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeSubmissionModal();
    }
});

// Auto-save progress simulation
setInterval(() => {
    if (Math.random() > 0.7) {
        // Randomly update progress for pending assignments
        const pendingAssignments = ASSIGNMENTS_DATA.filter(a => a.status === 'pending');
        if (pendingAssignments.length > 0) {
            const randomAssignment = pendingAssignments[Math.floor(Math.random() * pendingAssignments.length)];
            if (randomAssignment.progress < 100) {
                randomAssignment.progress = Math.min(randomAssignment.progress + Math.floor(Math.random() * 10), 100);
            }
        }
    }
}, 30000); // Every 30 seconds

// Simulate new assignment notifications
setTimeout(() => {
    showNotification('📚 New assignment posted: "Algorithm Optimization Project"', 'info');
}, 45000); // After 45 seconds

setTimeout(() => {
    showNotification('⏰ Reminder: "Binary Trees Implementation" is overdue!', 'warning');
}, 60000); // After 1 minute
