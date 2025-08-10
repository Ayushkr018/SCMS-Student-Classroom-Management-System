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

// Mock users data
let USERS_DATA = [
    {
        id: 'admin_001',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@scms.edu',
        role: 'admin',
        department: 'administration',
        status: 'active',
        phone: '+1-555-0101',
        joinDate: '2020-01-15',
        lastLogin: '2024-01-15 09:30:00',
        employeeId: 'ADM001'
    },
    {
        id: 'teacher_001',
        name: 'Prof. Michael Chen',
        email: 'michael.chen@scms.edu',
        role: 'teacher',
        department: 'computer_science',
        status: 'active',
        phone: '+1-555-0102',
        joinDate: '2021-03-10',
        lastLogin: '2024-01-15 10:15:00',
        employeeId: 'TCH001'
    },
    {
        id: 'teacher_002',
        name: 'Dr. Emily Davis',
        email: 'emily.davis@scms.edu',
        role: 'teacher',
        department: 'mathematics',
        status: 'active',
        phone: '+1-555-0103',
        joinDate: '2020-08-22',
        lastLogin: '2024-01-15 08:45:00',
        employeeId: 'TCH002'
    },
    {
        id: 'student_001',
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@student.scms.edu',
        role: 'student',
        department: 'computer_science',
        status: 'active',
        phone: '+1-555-0201',
        joinDate: '2023-09-01',
        lastLogin: '2024-01-15 11:20:00',
        rollNumber: 'CS2023001',
        academicYear: '1st_year'
    },
    {
        id: 'student_002',
        name: 'Maya Patel',
        email: 'maya.patel@student.scms.edu',
        role: 'student',
        department: 'physics',
        status: 'active',
        phone: '+1-555-0202',
        joinDate: '2022-09-01',
        lastLogin: '2024-01-14 16:30:00',
        rollNumber: 'PHY2022015',
        academicYear: '2nd_year'
    },
    {
        id: 'student_003',
        name: 'James Wilson',
        email: 'james.wilson@student.scms.edu',
        role: 'student',
        department: 'chemistry',
        status: 'inactive',
        phone: '+1-555-0203',
        joinDate: '2021-09-01',
        lastLogin: '2024-01-10 14:20:00',
        rollNumber: 'CHM2021032',
        academicYear: '3rd_year'
    }
];

let filteredUsers = [...USERS_DATA];
let selectedUsers = new Set();
let editingUserId = null;

// Load current user and initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    loadUsers();
    updateStats();
    
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

function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    filteredUsers.forEach(user => {
        const row = createUserRow(user);
        tbody.appendChild(row);
    });

    updateSelectedCount();
}

function createUserRow(user) {
    const row = document.createElement('tr');
    
    const statusClass = `status-${user.status}`;
    const roleClass = `role-${user.role}`;
    
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const departmentName = user.department ? user.department.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A';
    
    const lastLogin = user.lastLogin ? 
        new Date(user.lastLogin).toLocaleDateString() + ' ' + 
        new Date(user.lastLogin).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 
        'Never';
    
    const joinDate = new Date(user.joinDate).toLocaleDateString();
    
    row.innerHTML = `
        <td>
            <input type="checkbox" class="user-checkbox" value="${user.id}" onchange="toggleUserSelection('${user.id}')">
        </td>
        <td>
            <div class="user-profile">
                <div class="user-avatar-sm ${user.role}">
                    ${initials}
                </div>
                <div class="user-info-text">
                    <h4>${user.name}</h4>
                    <p>${user.email}</p>
                    ${user.rollNumber ? `<p style="font-size: 0.8em; opacity: 0.8;">${user.rollNumber}</p>` : ''}
                    ${user.employeeId ? `<p style="font-size: 0.8em; opacity: 0.8;">${user.employeeId}</p>` : ''}
                </div>
            </div>
        </td>
        <td>
            <span class="role-badge ${roleClass}">
                ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
        </td>
        <td>${departmentName}</td>
        <td>
            <span class="status-badge ${statusClass}">
                ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </span>
        </td>
        <td style="font-size: 0.9em;">${lastLogin}</td>
        <td style="font-size: 0.9em;">${joinDate}</td>
        <td>
            <div class="action-buttons">
                <button class="action-btn action-edit" onclick="editUser('${user.id}')">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="action-btn action-reset" onclick="resetPassword('${user.id}')">
                    <i class="fas fa-key"></i>
                    Reset
                </button>
                <button class="action-btn action-delete" onclick="deleteUser('${user.id}')">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        </td>
    `;
    
    return row;
}

function updateStats() {
    const adminCount = USERS_DATA.filter(u => u.role === 'admin').length;
    const teacherCount = USERS_DATA.filter(u => u.role === 'teacher').length;
    const studentCount = USERS_DATA.filter(u => u.role === 'student').length;
    const totalCount = USERS_DATA.length;
    
    document.getElementById('adminCount').textContent = adminCount;
    document.getElementById('teacherCount').textContent = teacherCount;
    document.getElementById('studentCount').textContent = studentCount.toLocaleString();
    document.getElementById('totalCount').textContent = totalCount.toLocaleString();
}

function searchUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    applyFilters(searchTerm);
}

function filterUsers() {
    applyFilters();
}

function applyFilters(searchTerm = '') {
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const departmentFilter = document.getElementById('departmentFilter').value;
    
    if (!searchTerm) {
        searchTerm = document.getElementById('searchInput').value.toLowerCase();
    }
    
    filteredUsers = USERS_DATA.filter(user => {
        const matchesSearch = !searchTerm || 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            (user.rollNumber && user.rollNumber.toLowerCase().includes(searchTerm)) ||
            (user.employeeId && user.employeeId.toLowerCase().includes(searchTerm));
        
        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesStatus = !statusFilter || user.status === statusFilter;
        const matchesDepartment = !departmentFilter || user.department === departmentFilter;
        
        return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
    });
    
    loadUsers();
    
    if (searchTerm || roleFilter || statusFilter || departmentFilter) {
        showNotification(`Found ${filteredUsers.length} users matching your criteria`, 'info');
    }
}

function toggleUserSelection(userId) {
    if (selectedUsers.has(userId)) {
        selectedUsers.delete(userId);
    } else {
        selectedUsers.add(userId);
    }
    updateSelectedCount();
}

function toggleSelectAll() {
    const isChecked = document.getElementById('selectAll').checked;
    const checkboxes = document.querySelectorAll('.user-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        if (isChecked) {
            selectedUsers.add(checkbox.value);
        } else {
            selectedUsers.delete(checkbox.value);
        }
    });
    
    updateSelectedCount();
}

function toggleMasterCheckbox() {
    const isChecked = document.getElementById('masterCheckbox').checked;
    const checkboxes = document.querySelectorAll('.user-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        if (isChecked) {
            selectedUsers.add(checkbox.value);
        } else {
            selectedUsers.delete(checkbox.value);
        }
    });
    
    updateSelectedCount();
}

function updateSelectedCount() {
    document.getElementById('selectedCount').textContent = 
        `${selectedUsers.size} user${selectedUsers.size !== 1 ? 's' : ''} selected`;
    
    // Update master checkbox state
    const totalCheckboxes = document.querySelectorAll('.user-checkbox').length;
    const masterCheckbox = document.getElementById('masterCheckbox');
    
    if (selectedUsers.size === 0) {
        masterCheckbox.indeterminate = false;
        masterCheckbox.checked = false;
    } else if (selectedUsers.size === totalCheckboxes) {
        masterCheckbox.indeterminate = false;
        masterCheckbox.checked = true;
    } else {
        masterCheckbox.indeterminate = true;
        masterCheckbox.checked = false;
    }
}

function openAddUserModal() {
    editingUserId = null;
    document.getElementById('modalTitle').textContent = 'Add New User';
    document.getElementById('userForm').reset();
    document.getElementById('userModal').classList.add('show');
    
    // Hide role-specific fields initially
    document.getElementById('employeeIdGroup').style.display = 'none';
    document.getElementById('rollNumberGroup').style.display = 'none';
    document.getElementById('yearGroup').style.display = 'none';
}

function editUser(userId) {
    const user = USERS_DATA.find(u => u.id === userId);
    if (!user) return;
    
    editingUserId = userId;
    document.getElementById('modalTitle').textContent = 'Edit User';
    
    // Populate form
    document.getElementById('userFullName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userDepartment').value = user.department || '';
    document.getElementById('userPhone').value = user.phone || '';
    document.getElementById('userStatus').value = user.status;
    
    if (user.employeeId) {
        document.getElementById('employeeId').value = user.employeeId;
    }
    if (user.rollNumber) {
        document.getElementById('rollNumber').value = user.rollNumber;
    }
    if (user.academicYear) {
        document.getElementById('academicYear').value = user.academicYear;
    }
    
    toggleRoleFields();
    document.getElementById('userModal').classList.add('show');
}

function deleteUser(userId) {
    const user = USERS_DATA.find(u => u.id === userId);
    if (!user) return;
    
    if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
        USERS_DATA = USERS_DATA.filter(u => u.id !== userId);
        filteredUsers = filteredUsers.filter(u => u.id !== userId);
        selectedUsers.delete(userId);
        
        loadUsers();
        updateStats();
        showNotification(`${user.name} has been deleted successfully`, 'success');
    }
}

function resetPassword(userId) {
    const user = USERS_DATA.find(u => u.id === userId);
    if (!user) return;
    
    if (confirm(`Send password reset email to ${user.name} (${user.email})?`)) {
        showNotification(`Password reset email sent to ${user.email}`, 'success');
    }
}

function toggleRoleFields() {
    const role = document.getElementById('userRole').value;
    const employeeGroup = document.getElementById('employeeIdGroup');
    const rollGroup = document.getElementById('rollNumberGroup');
    const yearGroup = document.getElementById('yearGroup');
    
    if (role === 'student') {
        employeeGroup.style.display = 'none';
        rollGroup.style.display = 'block';
        yearGroup.style.display = 'block';
    } else if (role === 'teacher' || role === 'admin') {
        employeeGroup.style.display = 'block';
        rollGroup.style.display = 'none';
        yearGroup.style.display = 'none';
    } else {
        employeeGroup.style.display = 'none';
        rollGroup.style.display = 'none';
        yearGroup.style.display = 'none';
    }
}

function saveUser(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('userFullName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value,
        department: document.getElementById('userDepartment').value,
        phone: document.getElementById('userPhone').value,
        status: document.getElementById('userStatus').value
    };
    
    // Add role-specific fields
    if (formData.role === 'student') {
        formData.rollNumber = document.getElementById('rollNumber').value;
        formData.academicYear = document.getElementById('academicYear').value;
    } else if (formData.role === 'teacher' || formData.role === 'admin') {
        formData.employeeId = document.getElementById('employeeId').value;
    }
    
    if (editingUserId) {
        // Update existing user
        const userIndex = USERS_DATA.findIndex(u => u.id === editingUserId);
        if (userIndex !== -1) {
            USERS_DATA[userIndex] = { ...USERS_DATA[userIndex], ...formData };
            showNotification(`${formData.name} updated successfully`, 'success');
        }
    } else {
        // Add new user
        const newUser = {
            id: `${formData.role}_${Date.now()}`,
            ...formData,
            joinDate: new Date().toISOString().split('T')[0],
            lastLogin: null
        };
        
        USERS_DATA.push(newUser);
        showNotification(`${formData.name} added successfully`, 'success');
    }
    
    closeModal();
    applyFilters();
    updateStats();
}

function closeModal() {
    document.getElementById('userModal').classList.remove('show');
    document.getElementById('userForm').reset();
    editingUserId = null;
}

function bulkAction(action) {
    if (selectedUsers.size === 0) {
        showNotification('No users selected', 'error');
        return;
    }
    
    const actionText = action === 'activate' ? 'activate' : 'deactivate';
    const newStatus = action === 'activate' ? 'active' : 'inactive';
    
    if (confirm(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} ${selectedUsers.size} selected users?`)) {
        USERS_DATA.forEach(user => {
            if (selectedUsers.has(user.id)) {
                user.status = newStatus;
            }
        });
        
        // Clear selections
        selectedUsers.clear();
        document.getElementById('selectAll').checked = false;
        document.getElementById('masterCheckbox').checked = false;
        
        loadUsers();
        showNotification(`${selectedUsers.size} users ${actionText}d successfully`, 'success');
    }
}

function exportSelected() {
    if (selectedUsers.size === 0) {
        showNotification('No users selected for export', 'error');
        return;
    }
    
    showNotification(`Exporting ${selectedUsers.size} selected users...`, 'info');
    
    setTimeout(() => {
        showNotification(`${selectedUsers.size} users exported successfully!`, 'success');
    }, 2000);
}

function importUsers() {
    showNotification('Opening import dialog...', 'info');
    
    // Simulate import
    setTimeout(() => {
        const newUsers = [
            {
                id: `student_${Date.now()}_1`,
                name: 'David Kumar',
                email: 'david.kumar@student.scms.edu',
                role: 'student',
                department: 'computer_science',
                status: 'active',
                phone: '+1-555-0301',
                joinDate: new Date().toISOString().split('T')[0],
                lastLogin: null,
                rollNumber: 'CS2024001',
                academicYear: '1st_year'
            },
            {
                id: `student_${Date.now()}_2`,
                name: 'Lisa Zhang',
                email: 'lisa.zhang@student.scms.edu',
                role: 'student',
                department: 'mathematics',
                status: 'active',
                phone: '+1-555-0302',
                joinDate: new Date().toISOString().split('T')[0],
                lastLogin: null,
                rollNumber: 'MATH2024001',
                academicYear: '1st_year'
            }
        ];
        
        USERS_DATA.push(...newUsers);
        applyFilters();
        updateStats();
        
        showNotification(`${newUsers.length} users imported successfully!`, 'success');
    }, 3000);
}

function refreshUsers() {
    showNotification('Refreshing user data...', 'info');
    
    setTimeout(() => {
        // Simulate data refresh
        loadUsers();
        updateStats();
        showNotification('User data refreshed successfully!', 'success');
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
document.getElementById('userModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Simulate real-time user activity updates
setInterval(() => {
    if (Math.random() > 0.8) {
        // Randomly update last login for active users
        const activeUsers = USERS_DATA.filter(u => u.status === 'active');
        if (activeUsers.length > 0) {
            const randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];
            randomUser.lastLogin = new Date().toISOString().replace('T', ' ').substring(0, 19);
            
            // Only reload if this user is currently visible
            if (filteredUsers.includes(randomUser)) {
                loadUsers();
            }
        }
    }
}, 30000); // Update every 30 seconds
