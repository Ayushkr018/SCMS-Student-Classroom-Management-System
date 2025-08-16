// Assignment Management JavaScript - Full Functionality

// Global Variables
let assignments = [];
let filteredAssignments = [];
let submissions = [];
let currentEditingAssignment = null;
let currentUser = {
    name: 'Dr. John Doe',
    department: 'Computer Science',
    avatar: 'JD'
};

// Mock Database
const MOCK_ASSIGNMENTS = [
    {
        id: 'assign-1',
        title: 'Data Structures Lab Assignment',
        class: 'cs-2a',
        subject: 'data-structures',
        description: 'Implement various data structures including linked lists, stacks, and queues.',
        dueDate: '2025-08-25T23:59',
        totalMarks: 20,
        type: 'lab',
        format: 'code',
        status: 'active',
        createdAt: '2025-08-15T10:00:00',
        settings: {
            allowLateSubmission: true,
            showGradesToStudents: true,
            enablePeerReview: false,
            latePenalty: 10
        },
        stats: {
            totalStudents: 45,
            submitted: 32,
            graded: 28,
            pending: 13
        }
    },
    {
        id: 'assign-2',
        title: 'Algorithm Analysis Report',
        class: 'cs-2b',
        subject: 'algorithms',
        description: 'Analyze time and space complexity of sorting algorithms.',
        dueDate: '2025-08-30T23:59',
        totalMarks: 15,
        type: 'research',
        format: 'pdf',
        status: 'active',
        createdAt: '2025-08-14T14:30:00',
        settings: {
            allowLateSubmission: false,
            showGradesToStudents: true,
            enablePeerReview: true,
            latePenalty: 0
        },
        stats: {
            totalStudents: 42,
            submitted: 25,
            graded: 20,
            pending: 17
        }
    },
    {
        id: 'assign-3',
        title: 'Database Design Project',
        class: 'it-3a',
        subject: 'database',
        description: 'Design and implement a complete database system for a library management system.',
        dueDate: '2025-09-10T23:59',
        totalMarks: 30,
        type: 'group',
        format: 'any',
        status: 'draft',
        createdAt: '2025-08-16T09:15:00',
        settings: {
            allowLateSubmission: true,
            showGradesToStudents: false,
            enablePeerReview: false,
            latePenalty: 15
        },
        stats: {
            totalStudents: 36,
            submitted: 0,
            graded: 0,
            pending: 36
        }
    }
];

const MOCK_SUBMISSIONS = [
    {
        id: 'sub-1',
        assignmentId: 'assign-1',
        studentName: 'Rahul Sharma',
        rollNo: 'CS2021A001',
        submissionDate: '2025-08-20T15:30:00',
        fileName: 'data_structures_lab.zip',
        fileSize: '2.5 MB',
        grade: 18,
        maxGrade: 20,
        feedback: 'Excellent implementation of all data structures. Good code quality and documentation.',
        status: 'graded'
    },
    {
        id: 'sub-2',
        assignmentId: 'assign-1',
        studentName: 'Priya Patel',
        rollNo: 'CS2021A002',
        submissionDate: '2025-08-19T10:45:00',
        fileName: 'assignment_1.cpp',
        fileSize: '1.8 MB',
        grade: 16,
        maxGrade: 20,
        feedback: 'Good work overall, but missing some edge case handling in stack implementation.',
        status: 'graded'
    },
    {
        id: 'sub-3',
        assignmentId: 'assign-1',
        studentName: 'Amit Kumar',
        rollNo: 'CS2021A003',
        submissionDate: '2025-08-21T20:15:00',
        fileName: 'lab_assignment.tar.gz',
        fileSize: '3.2 MB',
        grade: null,
        maxGrade: 20,
        feedback: '',
        status: 'pending'
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('Assignment Management System Loading...');
    
    // Load initial data
    assignments = [...MOCK_ASSIGNMENTS];
    submissions = [...MOCK_SUBMISSIONS];
    filteredAssignments = [...assignments];
    
    // Initialize components
    initializeUserInfo();
    initializeTheme();
    initializeMobileControls();
    loadAssignmentStats();
    renderAssignments();
    initializeEventListeners();
    initializeFormValidation();
    
    // Show success notification
    setTimeout(() => {
        showNotification('Assignment Management System loaded successfully!', 'success');
    }, 500);
    
    console.log('Assignment Management System Ready! ✅');
});

// User Info Functions
function initializeUserInfo() {
    try {
        const userName = document.getElementById('userName');
        const userDept = document.getElementById('userDept');
        
        if (userName) userName.textContent = currentUser.name;
        if (userDept) userDept.textContent = currentUser.department;
        
        console.log('User info initialized');
    } catch (error) {
        console.error('Error initializing user info:', error);
    }
}

// Theme Functions
function initializeTheme() {
    try {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcons(savedTheme);
        console.log('Theme initialized:', savedTheme);
    } catch (error) {
        console.error('Error initializing theme:', error);
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
        console.log('Theme toggled to:', newTheme);
    } catch (error) {
        console.error('Error toggling theme:', error);
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
        
        console.log('Theme icons updated for:', theme);
    } catch (error) {
        console.error('Error updating theme icons:', error);
    }
}

// Mobile Controls
function initializeMobileControls() {
    try {
        console.log('Mobile controls initialized');
    } catch (error) {
        console.error('Error initializing mobile controls:', error);
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
            
            console.log('Mobile sidebar toggled');
        }
    } catch (error) {
        console.error('Error toggling mobile sidebar:', error);
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
            
            console.log('Mobile sidebar closed');
        }
    } catch (error) {
        console.error('Error closing mobile sidebar:', error);
    }
}

// Assignment Statistics
function loadAssignmentStats() {
    try {
        const stats = calculateAssignmentStats();
        
        updateStatElement('totalAssignments', stats.total);
        updateStatElement('activeAssignments', stats.active);
        updateStatElement('pendingSubmissions', stats.pendingSubmissions);
        updateStatElement('gradedSubmissions', stats.gradedSubmissions);
        updateStatElement('avgGrade', stats.avgGrade + '%');
        
        console.log('Assignment stats loaded:', stats);
    } catch (error) {
        console.error('Error loading assignment stats:', error);
    }
}

function calculateAssignmentStats() {
    try {
        const total = assignments.length;
        const active = assignments.filter(a => a.status === 'active').length;
        
        let totalPending = 0;
        let totalGraded = 0;
        let totalGrades = 0;
        let gradeCount = 0;
        
        assignments.forEach(assignment => {
            totalPending += assignment.stats.pending;
            totalGraded += assignment.stats.graded;
        });
        
        submissions.forEach(submission => {
            if (submission.grade !== null) {
                totalGrades += (submission.grade / submission.maxGrade) * 100;
                gradeCount++;
            }
        });
        
        const avgGrade = gradeCount > 0 ? Math.round(totalGrades / gradeCount * 10) / 10 : 0;
        
        return {
            total,
            active,
            pendingSubmissions: totalPending,
            gradedSubmissions: totalGraded,
            avgGrade
        };
    } catch (error) {
        console.error('Error calculating assignment stats:', error);
        return { total: 0, active: 0, pendingSubmissions: 0, gradedSubmissions: 0, avgGrade: 0 };
    }
}

function updateStatElement(id, value) {
    try {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    } catch (error) {
        console.error('Error updating stat element:', id, error);
    }
}

// Assignment Rendering
function renderAssignments() {
    try {
        const container = document.getElementById('assignmentsList');
        if (!container) return;
        
        if (filteredAssignments.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                    <h3>No assignments found</h3>
                    <p>Create your first assignment to get started!</p>
                    <button class="btn btn-primary" onclick="openAssignmentForm()" style="margin-top: 15px;">
                        <i class="fas fa-plus"></i> Create Assignment
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = filteredAssignments.map(assignment => createAssignmentCard(assignment)).join('');
        console.log('Assignments rendered:', filteredAssignments.length);
    } catch (error) {
        console.error('Error rendering assignments:', error);
        showNotification('Failed to load assignments', 'error');
    }
}

function createAssignmentCard(assignment) {
    try {
        const dueDate = new Date(assignment.dueDate);
        const isOverdue = dueDate < new Date();
        const dueDateText = formatDate(dueDate);
        
        const statusClass = getStatusClass(assignment.status);
        const statusText = getStatusText(assignment.status);
        
        return `
            <div class="assignment-card" data-assignment-id="${assignment.id}">
                <div class="assignment-header">
                    <h4 class="assignment-title">${assignment.title}</h4>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                
                <div class="assignment-info">
                    <div><i class="fas fa-graduation-cap"></i> ${getClassName(assignment.class)}</div>
                    <div><i class="fas fa-book"></i> ${getSubjectName(assignment.subject)}</div>
                    <div><i class="fas fa-calendar-alt"></i> Due: ${dueDateText}</div>
                    <div><i class="fas fa-star"></i> ${assignment.totalMarks} marks</div>
                </div>
                
                <div class="assignment-desc">
                    ${assignment.description}
                </div>
                
                <div class="assignment-status">
                    <div class="submission-stats">
                        <span><i class="fas fa-users"></i> ${assignment.stats.submitted}/${assignment.stats.totalStudents} submitted</span>
                        <span><i class="fas fa-check"></i> ${assignment.stats.graded} graded</span>
                    </div>
                    
                    <div class="assignment-actions">
                        <button class="btn btn-info" onclick="viewSubmissions('${assignment.id}')">
                            <i class="fas fa-folder-open"></i> Submissions
                        </button>
                        <button class="btn btn-secondary" onclick="editAssignment('${assignment.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger" onclick="deleteAssignment('${assignment.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error creating assignment card:', error);
        return '<div class="assignment-card"><p>Error loading assignment</p></div>';
    }
}

function getStatusClass(status) {
    const statusMap = {
        'active': 'status-active',
        'completed': 'status-completed',
        'draft': 'status-draft'
    };
    return statusMap[status] || 'status-draft';
}

function getStatusText(status) {
    const statusMap = {
        'active': 'Active',
        'completed': 'Completed',
        'draft': 'Draft'
    };
    return statusMap[status] || 'Draft';
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

function getSubjectName(subjectCode) {
    const subjectMap = {
        'data-structures': 'Data Structures',
        'algorithms': 'Algorithms',
        'database': 'Database Management',
        'web-tech': 'Web Technology',
        'software-eng': 'Software Engineering'
    };
    return subjectMap[subjectCode] || subjectCode;
}

// Assignment Actions
function openAssignmentForm(assignmentId = null) {
    try {
        const modal = document.getElementById('assignmentModal');
        const modalTitle = document.getElementById('modalTitle');
        const saveBtn = document.getElementById('saveAssignmentBtn');
        
        if (assignmentId) {
            // Edit mode
            const assignment = assignments.find(a => a.id === assignmentId);
            if (assignment) {
                modalTitle.textContent = 'Edit Assignment';
                saveBtn.innerHTML = '<i class="fas fa-save"></i> Update Assignment';
                populateAssignmentForm(assignment);
                currentEditingAssignment = assignment;
            }
        } else {
            // Create mode
            modalTitle.textContent = 'Create New Assignment';
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Create Assignment';
            resetAssignmentForm();
            currentEditingAssignment = null;
        }
        
        modal.style.display = 'flex';
        console.log('Assignment form opened');
    } catch (error) {
        console.error('Error opening assignment form:', error);
        showNotification('Failed to open assignment form', 'error');
    }
}

function closeAssignmentForm() {
    try {
        const modal = document.getElementById('assignmentModal');
        modal.style.display = 'none';
        resetAssignmentForm();
        currentEditingAssignment = null;
        console.log('Assignment form closed');
    } catch (error) {
        console.error('Error closing assignment form:', error);
    }
}

function populateAssignmentForm(assignment) {
    try {
        document.getElementById('assignmentTitle').value = assignment.title;
        document.getElementById('assignmentClass').value = assignment.class;
        document.getElementById('assignmentSubject').value = assignment.subject;
        document.getElementById('assignmentDescription').value = assignment.description;
        document.getElementById('assignmentDue').value = assignment.dueDate.slice(0, 16);
        document.getElementById('assignmentMarks').value = assignment.totalMarks;
        document.getElementById('assignmentType').value = assignment.type;
        document.getElementById('submissionFormat').value = assignment.format;
        
        // Settings
        document.getElementById('allowLateSubmission').checked = assignment.settings.allowLateSubmission;
        document.getElementById('showGradesToStudents').checked = assignment.settings.showGradesToStudents;
        document.getElementById('enablePeerReview').checked = assignment.settings.enablePeerReview;
        document.getElementById('latePenalty').value = assignment.settings.latePenalty;
        
        // Show/hide late penalty settings
        toggleLatePenaltySettings();
        
        console.log('Assignment form populated');
    } catch (error) {
        console.error('Error populating assignment form:', error);
    }
}

function resetAssignmentForm() {
    try {
        const form = document.getElementById('assignmentForm');
        if (form) {
            form.reset();
            
            // Reset default values
            document.getElementById('assignmentMarks').value = 10;
            document.getElementById('latePenalty').value = 10;
            
            // Hide late penalty settings
            const latePenaltySettings = document.getElementById('latePenaltySettings');
            if (latePenaltySettings) {
                latePenaltySettings.style.display = 'none';
            }
        }
        console.log('Assignment form reset');
    } catch (error) {
        console.error('Error resetting assignment form:', error);
    }
}

function saveAssignment() {
    try {
        const formData = getAssignmentFormData();
        
        if (!validateAssignmentForm(formData)) {
            return;
        }
        
        if (currentEditingAssignment) {
            // Update existing assignment
            const index = assignments.findIndex(a => a.id === currentEditingAssignment.id);
            if (index !== -1) {
                assignments[index] = { ...assignments[index], ...formData };
                showNotification('Assignment updated successfully!', 'success');
            }
        } else {
            // Create new assignment
            const newAssignment = {
                id: 'assign-' + Date.now(),
                ...formData,
                createdAt: new Date().toISOString(),
                stats: {
                    totalStudents: 45, // Mock data
                    submitted: 0,
                    graded: 0,
                    pending: 45
                }
            };
            assignments.unshift(newAssignment);
            showNotification('Assignment created successfully!', 'success');
        }
        
        // Refresh UI
        filteredAssignments = [...assignments];
        renderAssignments();
        loadAssignmentStats();
        closeAssignmentForm();
        
        console.log('Assignment saved successfully');
    } catch (error) {
        console.error('Error saving assignment:', error);
        showNotification('Failed to save assignment', 'error');
    }
}

function getAssignmentFormData() {
    return {
        title: document.getElementById('assignmentTitle').value.trim(),
        class: document.getElementById('assignmentClass').value,
        subject: document.getElementById('assignmentSubject').value,
        description: document.getElementById('assignmentDescription').value.trim(),
        dueDate: document.getElementById('assignmentDue').value,
        totalMarks: parseInt(document.getElementById('assignmentMarks').value),
        type: document.getElementById('assignmentType').value,
        format: document.getElementById('submissionFormat').value,
        status: 'active',
        settings: {
            allowLateSubmission: document.getElementById('allowLateSubmission').checked,
            showGradesToStudents: document.getElementById('showGradesToStudents').checked,
            enablePeerReview: document.getElementById('enablePeerReview').checked,
            latePenalty: parseInt(document.getElementById('latePenalty').value)
        }
    };
}

function validateAssignmentForm(formData) {
    const errors = [];
    
    if (!formData.title) errors.push('Assignment title is required');
    if (!formData.class) errors.push('Class selection is required');
    if (!formData.subject) errors.push('Subject selection is required');
    if (!formData.dueDate) errors.push('Due date is required');
    if (!formData.totalMarks || formData.totalMarks < 1) errors.push('Valid total marks required');
    
    // Check if due date is in the future
    const dueDate = new Date(formData.dueDate);
    if (dueDate <= new Date()) {
        errors.push('Due date must be in the future');
    }
    
    if (errors.length > 0) {
        showNotification(errors[0], 'error');
        return false;
    }
    
    return true;
}

function editAssignment(assignmentId) {
    openAssignmentForm(assignmentId);
}

function deleteAssignment(assignmentId) {
    try {
        const assignment = assignments.find(a => a.id === assignmentId);
        if (!assignment) return;
        
        if (confirm(`Are you sure you want to delete "${assignment.title}"? This action cannot be undone.`)) {
            assignments = assignments.filter(a => a.id !== assignmentId);
            filteredAssignments = filteredAssignments.filter(a => a.id !== assignmentId);
            
            renderAssignments();
            loadAssignmentStats();
            
            showNotification('Assignment deleted successfully', 'success');
            console.log('Assignment deleted:', assignmentId);
        }
    } catch (error) {
        console.error('Error deleting assignment:', error);
        showNotification('Failed to delete assignment', 'error');
    }
}

// Filtering
function filterAssignments() {
    try {
        const statusFilter = document.getElementById('statusFilter').value;
        const classFilter = document.getElementById('classFilter').value;
        const dueDateFilter = document.getElementById('dueDateFilter').value;
        const searchTerm = document.getElementById('assignmentSearch').value.toLowerCase().trim();
        
        filteredAssignments = assignments.filter(assignment => {
            // Status filter
            if (statusFilter !== 'all' && assignment.status !== statusFilter) {
                return false;
            }
            
            // Class filter
            if (classFilter !== 'all' && assignment.class !== classFilter) {
                return false;
            }
            
            // Due date filter
            if (dueDateFilter !== 'all') {
                const dueDate = new Date(assignment.dueDate);
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const assignmentDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
                
                if (dueDateFilter === 'overdue' && assignmentDate >= today) {
                    return false;
                }
                if (dueDateFilter === 'due-today' && assignmentDate.getTime() !== today.getTime()) {
                    return false;
                }
                if (dueDateFilter === 'due-week') {
                    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                    if (assignmentDate < today || assignmentDate > weekFromNow) {
                        return false;
                    }
                }
            }
            
            // Search filter
            if (searchTerm && !assignment.title.toLowerCase().includes(searchTerm) && 
                !assignment.description.toLowerCase().includes(searchTerm)) {
                return false;
            }
            
            return true;
        });
        
        renderAssignments();
        console.log('Assignments filtered:', filteredAssignments.length);
    } catch (error) {
        console.error('Error filtering assignments:', error);
        showNotification('Error filtering assignments', 'error');
    }
}

function refreshAssignments() {
    try {
        // Reset filters
        document.getElementById('statusFilter').value = 'all';
        document.getElementById('classFilter').value = 'all';
        document.getElementById('dueDateFilter').value = 'all';
        document.getElementById('assignmentSearch').value = '';
        
        // Refresh data
        filteredAssignments = [...assignments];
        renderAssignments();
        loadAssignmentStats();
        
        showNotification('Assignments refreshed!', 'info');
        console.log('Assignments refreshed');
    } catch (error) {
        console.error('Error refreshing assignments:', error);
        showNotification('Failed to refresh assignments', 'error');
    }
}

// Submissions Management
function viewSubmissions(assignmentId) {
    try {
        const assignment = assignments.find(a => a.id === assignmentId);
        if (!assignment) return;
        
        const modal = document.getElementById('submissionsModal');
        const title = document.getElementById('submissionsTitle');
        
        title.textContent = `Submissions - ${assignment.title}`;
        
        // Update submission stats
        updateSubmissionStats(assignment);
        
        // Load submissions table
        loadSubmissionsTable(assignmentId);
        
        modal.style.display = 'flex';
        console.log('Submissions modal opened for:', assignmentId);
    } catch (error) {
        console.error('Error viewing submissions:', error);
        showNotification('Failed to load submissions', 'error');
    }
}

function closeSubmissionsModal() {
    try {
        const modal = document.getElementById('submissionsModal');
        modal.style.display = 'none';
        console.log('Submissions modal closed');
    } catch (error) {
        console.error('Error closing submissions modal:', error);
    }
}

function updateSubmissionStats(assignment) {
    try {
        document.getElementById('totalStudents').textContent = assignment.stats.totalStudents;
        document.getElementById('submittedCount').textContent = assignment.stats.submitted;
        document.getElementById('gradedCount').textContent = assignment.stats.graded;
        document.getElementById('pendingCount').textContent = assignment.stats.pending;
        
        console.log('Submission stats updated');
    } catch (error) {
        console.error('Error updating submission stats:', error);
    }
}

function loadSubmissionsTable(assignmentId) {
    try {
        const tableBody = document.getElementById('submissionsTableBody');
        const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignmentId);
        
        if (assignmentSubmissions.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i><br>
                        No submissions found for this assignment.
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = assignmentSubmissions.map(submission => createSubmissionRow(submission)).join('');
        console.log('Submissions table loaded:', assignmentSubmissions.length);
    } catch (error) {
        console.error('Error loading submissions table:', error);
    }
}

function createSubmissionRow(submission) {
    try {
        const submissionDate = formatDate(new Date(submission.submissionDate));
        const gradeDisplay = submission.grade !== null ? 
            `${submission.grade}/${submission.maxGrade}` : 
            '<span style="color: var(--accent-yellow);">Pending</span>';
        
        const gradeClass = getGradeClass(submission.grade, submission.maxGrade);
        
        return `
            <tr>
                <td>
                    <div class="student-profile">
                        <div class="student-avatar">${getInitials(submission.studentName)}</div>
                        <span>${submission.studentName}</span>
                    </div>
                </td>
                <td>${submission.rollNo}</td>
                <td>${submissionDate}</td>
                <td>
                    <a href="#" onclick="downloadSubmission('${submission.id}')" style="color: var(--accent-blue);">
                        <i class="fas fa-download"></i> ${submission.fileName}
                    </a>
                    <small style="display: block; color: var(--text-secondary);">${submission.fileSize}</small>
                </td>
                <td>
                    <span class="grade-badge ${gradeClass}">${gradeDisplay}</span>
                </td>
                <td>
                    <div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">
                        ${submission.feedback || '<em>No feedback</em>'}
                    </div>
                </td>
                <td>
                    <div style="display: flex; gap: 5px;">
                        <button class="btn btn-primary" onclick="gradeSubmission('${submission.id}')" 
                                style="padding: 4px 8px; font-size: 0.7rem;">
                            <i class="fas fa-star"></i> Grade
                        </button>
                        <button class="btn btn-secondary" onclick="downloadSubmission('${submission.id}')" 
                                style="padding: 4px 8px; font-size: 0.7rem;">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    } catch (error) {
        console.error('Error creating submission row:', error);
        return '<tr><td colspan="7">Error loading submission</td></tr>';
    }
}

function getInitials(name) {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
}

function getGradeClass(grade, maxGrade) {
    if (grade === null) return 'grade-pending';
    
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return 'grade-excellent';
    if (percentage >= 75) return 'grade-good';
    if (percentage >= 60) return 'grade-average';
    return 'grade-poor';
}

function gradeSubmission(submissionId) {
    try {
        const submission = submissions.find(s => s.id === submissionId);
        if (!submission) return;
        
        const modal = document.getElementById('gradeModal');
        const studentInfo = document.getElementById('studentInfo');
        const totalMarks = document.getElementById('totalMarks');
        const gradeInput = document.getElementById('gradeInput');
        const feedbackInput = document.getElementById('feedbackInput');
        
        // Populate student info
        studentInfo.innerHTML = `
            <h4>${submission.studentName}</h4>
            <p><strong>Roll No:</strong> ${submission.rollNo}</p>
            <p><strong>Submission:</strong> ${submission.fileName}</p>
            <p><strong>Submitted:</strong> ${formatDate(new Date(submission.submissionDate))}</p>
        `;
        
        // Set total marks
        totalMarks.textContent = submission.maxGrade;
        
        // Pre-fill existing grade and feedback
        gradeInput.value = submission.grade || '';
        feedbackInput.value = submission.feedback || '';
        gradeInput.max = submission.maxGrade;
        
        // Store current submission ID
        modal.setAttribute('data-submission-id', submissionId);
        
        modal.style.display = 'flex';
        console.log('Grade modal opened for:', submissionId);
    } catch (error) {
        console.error('Error opening grade modal:', error);
        showNotification('Failed to open grading interface', 'error');
    }
}

function closeGradeModal() {
    try {
        const modal = document.getElementById('gradeModal');
        modal.style.display = 'none';
        modal.removeAttribute('data-submission-id');
        console.log('Grade modal closed');
    } catch (error) {
        console.error('Error closing grade modal:', error);
    }
}

function saveGrade() {
    try {
        const modal = document.getElementById('gradeModal');
        const submissionId = modal.getAttribute('data-submission-id');
        const gradeInput = document.getElementById('gradeInput');
        const feedbackInput = document.getElementById('feedbackInput');
        
        const grade = parseFloat(gradeInput.value);
        const feedback = feedbackInput.value.trim();
        const maxGrade = parseInt(document.getElementById('totalMarks').textContent);
        
        // Validate grade
        if (isNaN(grade) || grade < 0 || grade > maxGrade) {
            showNotification(`Grade must be between 0 and ${maxGrade}`, 'error');
            return;
        }
        
        // Update submission
        const submissionIndex = submissions.findIndex(s => s.id === submissionId);
        if (submissionIndex !== -1) {
            submissions[submissionIndex].grade = grade;
            submissions[submissionIndex].feedback = feedback;
            submissions[submissionIndex].status = 'graded';
            
            // Update assignment stats
            const assignment = assignments.find(a => a.id === submissions[submissionIndex].assignmentId);
            if (assignment) {
                assignment.stats.graded++;
                assignment.stats.pending = Math.max(0, assignment.stats.pending - 1);
            }
            
            // Refresh UI
            loadSubmissionsTable(submissions[submissionIndex].assignmentId);
            updateSubmissionStats(assignment);
            loadAssignmentStats();
            renderAssignments();
            
            closeGradeModal();
            showNotification('Grade saved successfully!', 'success');
            console.log('Grade saved for:', submissionId);
        }
    } catch (error) {
        console.error('Error saving grade:', error);
        showNotification('Failed to save grade', 'error');
    }
}

function insertFeedback(text) {
    try {
        const feedbackInput = document.getElementById('feedbackInput');
        feedbackInput.value = text;
        feedbackInput.focus();
        console.log('Feedback template inserted');
    } catch (error) {
        console.error('Error inserting feedback:', error);
    }
}

// Bulk Actions
function downloadAllSubmissions() {
    try {
        showNotification('Downloading all submissions...', 'info');
        
        // Simulate download process
        setTimeout(() => {
            showNotification('All submissions downloaded successfully!', 'success');
        }, 2000);
        
        console.log('Downloading all submissions');
    } catch (error) {
        console.error('Error downloading submissions:', error);
        showNotification('Failed to download submissions', 'error');
    }
}

function sendReminder() {
    try {
        showNotification('Sending reminder to students...', 'info');
        
        // Simulate sending reminders
        setTimeout(() => {
            showNotification('Reminder sent to all pending students!', 'success');
        }, 1500);
        
        console.log('Sending reminder to students');
    } catch (error) {
        console.error('Error sending reminder:', error);
        showNotification('Failed to send reminder', 'error');
    }
}

function exportGrades() {
    try {
        showNotification('Exporting grades...', 'info');
        
        // Simulate export process
        setTimeout(() => {
            // Create mock CSV data
            const csvData = createGradesCSV();
            downloadCSV(csvData, 'assignment_grades.csv');
            showNotification('Grades exported successfully!', 'success');
        }, 1500);
        
        console.log('Exporting grades');
    } catch (error) {
        console.error('Error exporting grades:', error);
        showNotification('Failed to export grades', 'error');
    }
}

function createGradesCSV() {
    const headers = ['Student Name', 'Roll No', 'Assignment', 'Grade', 'Max Grade', 'Percentage', 'Feedback'];
    const rows = [headers.join(',')];
    
    submissions.forEach(submission => {
        const assignment = assignments.find(a => a.id === submission.assignmentId);
        const percentage = submission.grade ? Math.round((submission.grade / submission.maxGrade) * 100) : 'N/A';
        const row = [
            `"${submission.studentName}"`,
            submission.rollNo,
            `"${assignment ? assignment.title : 'Unknown'}"`,
            submission.grade || 'N/A',
            submission.maxGrade,
            percentage + '%',
            `"${submission.feedback || ''}"`
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

function downloadSubmission(submissionId) {
    try {
        const submission = submissions.find(s => s.id === submissionId);
        if (!submission) return;
        
        showNotification(`Downloading ${submission.fileName}...`, 'info');
        
        // Simulate download
        setTimeout(() => {
            showNotification('File downloaded successfully!', 'success');
        }, 1000);
        
        console.log('Downloading submission:', submissionId);
    } catch (error) {
        console.error('Error downloading submission:', error);
        showNotification('Failed to download submission', 'error');
    }
}

// Header Actions
function viewAllSubmissions() {
    try {
        showNotification('Loading all submissions...', 'info');
        
        // For now, just show first assignment's submissions
        if (assignments.length > 0) {
            viewSubmissions(assignments[0].id);
        } else {
            showNotification('No assignments found', 'warning');
        }
        
        console.log('Viewing all submissions');
    } catch (error) {
        console.error('Error viewing all submissions:', error);
        showNotification('Failed to load submissions', 'error');
    }
}

// Event Listeners
function initializeEventListeners() {
    try {
        // Form submission
        const assignmentForm = document.getElementById('assignmentForm');
        if (assignmentForm) {
            assignmentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveAssignment();
            });
        }
        
        // Late submission toggle
        const allowLateSubmission = document.getElementById('allowLateSubmission');
        if (allowLateSubmission) {
            allowLateSubmission.addEventListener('change', toggleLatePenaltySettings);
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
        
        console.log('Event listeners initialized');
    } catch (error) {
        console.error('Error initializing event listeners:', error);
    }
}

function initializeFormValidation() {
    try {
        // Add real-time validation
        const titleInput = document.getElementById('assignmentTitle');
        const dueDateInput = document.getElementById('assignmentDue');
        const marksInput = document.getElementById('assignmentMarks');
        
        if (titleInput) {
            titleInput.addEventListener('input', validateTitle);
        }
        
        if (dueDateInput) {
            dueDateInput.addEventListener('change', validateDueDate);
        }
        
        if (marksInput) {
            marksInput.addEventListener('input', validateMarks);
        }
        
        console.log('Form validation initialized');
    } catch (error) {
        console.error('Error initializing form validation:', error);
    }
}

function validateTitle() {
    const titleInput = document.getElementById('assignmentTitle');
    const title = titleInput.value.trim();
    
    if (title.length < 5) {
        titleInput.setCustomValidity('Title must be at least 5 characters long');
    } else if (title.length > 100) {
        titleInput.setCustomValidity('Title must not exceed 100 characters');
    } else {
        titleInput.setCustomValidity('');
    }
}

function validateDueDate() {
    const dueDateInput = document.getElementById('assignmentDue');
    const dueDate = new Date(dueDateInput.value);
    const now = new Date();
    
    if (dueDate <= now) {
        dueDateInput.setCustomValidity('Due date must be in the future');
    } else {
        dueDateInput.setCustomValidity('');
    }
}

function validateMarks() {
    const marksInput = document.getElementById('assignmentMarks');
    const marks = parseInt(marksInput.value);
    
    if (isNaN(marks) || marks < 1) {
        marksInput.setCustomValidity('Marks must be at least 1');
    } else if (marks > 100) {
        marksInput.setCustomValidity('Marks cannot exceed 100');
    } else {
        marksInput.setCustomValidity('');
    }
}

function toggleLatePenaltySettings() {
    try {
        const allowLateSubmission = document.getElementById('allowLateSubmission');
        const latePenaltySettings = document.getElementById('latePenaltySettings');
        
        if (allowLateSubmission && latePenaltySettings) {
            latePenaltySettings.style.display = allowLateSubmission.checked ? 'flex' : 'none';
        }
    } catch (error) {
        console.error('Error toggling late penalty settings:', error);
    }
}

// Utility Functions
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
        console.error('Error formatting date:', error);
        return 'Invalid Date';
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
        
        console.log('Notification:', type, message);
    } catch (error) {
        console.error('Error showing notification:', error);
        // Fallback to alert
        alert(message);
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
            
            console.log('User logged out');
        }
    } catch (error) {
        console.error('Error during logout:', error);
        showNotification('Logout failed', 'error');
    }
}

// Export for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        assignments,
        submissions,
        showNotification,
        formatDate
    };
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
    showNotification('An unexpected error occurred', 'error');
});

// Print debug info
console.log('Assignment Management JS loaded successfully! 🎓');
