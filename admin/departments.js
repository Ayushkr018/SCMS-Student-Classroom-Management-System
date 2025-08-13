// Simple Dashboard Style JavaScript
let departments = [];
let filteredDepartments = [];
let selectedDepartments = [];
let currentView = 'table';
let currentDepartment = null;

// Theme Management - Dashboard Exact
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('scms-theme', newTheme);
    updateThemeIcons(newTheme);
}

function updateThemeIcons(theme) {
    const elements = ['themeIcon', 'mobileThemeIcon'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    });
    
    const themeLabel = document.getElementById('themeLabel');
    const themeSwitch = document.getElementById('themeSwitch');
    
    if (themeLabel) themeLabel.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    if (themeSwitch) themeSwitch.classList.toggle('active', theme === 'dark');
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('scms-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
}

// Mobile Sidebar - Dashboard Exact
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
    
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Modal Management - Simple
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
    document.body.style.overflow = 'auto';
    currentDepartment = null;
}

// Sample Data
const sampleDepartments = [
    {
        id: 1,
        name: "Computer Science Engineering",
        code: "CSE",
        type: "Engineering",
        hod: "Dr. Rajesh Kumar",
        hodEmail: "rajesh@scms.edu",
        email: "cse@scms.edu",
        phone: "+91-98765-43210",
        location: "Block A, Floor 3",
        facultyCount: 28,
        studentCapacity: 600,
        currentStudents: 545,
        establishedYear: 2010,
        status: "active",
        description: "Leading department in computer science."
    },
    {
        id: 2,
        name: "Electronics & Communication",
        code: "ECE",
        type: "Engineering",
        hod: "Dr. Priya Sharma",
        hodEmail: "priya@scms.edu",
        email: "ece@scms.edu",
        phone: "+91-98765-43211",
        location: "Block B, Floor 2",
        facultyCount: 22,
        studentCapacity: 480,
        currentStudents: 456,
        establishedYear: 2012,
        status: "active",
        description: "Excellence in electronics engineering."
    },
    {
        id: 3,
        name: "Mechanical Engineering",
        code: "MECH",
        type: "Engineering",
        hod: "Dr. Amit Patel",
        hodEmail: "amit@scms.edu",
        email: "mech@scms.edu",
        phone: "+91-98765-43212",
        location: "Block C, Floor 1",
        facultyCount: 20,
        studentCapacity: 400,
        currentStudents: 385,
        establishedYear: 2008,
        status: "active",
        description: "Traditional engineering discipline."
    },
    {
        id: 4,
        name: "Business Administration",
        code: "MBA",
        type: "Management",
        hod: "Dr. Sarah Williams",
        hodEmail: "sarah@scms.edu",
        email: "mba@scms.edu",
        phone: "+91-98765-43213",
        location: "Block D, Floor 2",
        facultyCount: 18,
        studentCapacity: 240,
        currentStudents: 228,
        establishedYear: 2015,
        status: "active",
        description: "Business education excellence."
    },
    {
        id: 5,
        name: "English Literature",
        code: "ENG",
        type: "Arts",
        hod: "Dr. Michael Brown",
        hodEmail: "michael@scms.edu",
        email: "english@scms.edu",
        phone: "+91-98765-43214",
        location: "Block E, Floor 1",
        facultyCount: 15,
        studentCapacity: 360,
        currentStudents: 342,
        establishedYear: 2005,
        status: "under-review",
        description: "Literary studies tradition."
    }
];

// Initialize App
function initializeApp() {
    initializeTheme();
    loadUserInfo();
    initializeDepartments();
    setupEventListeners();
}

function loadUserInfo() {
    const userName = document.getElementById('userName');
    if (userName) userName.textContent = 'Admin User';
}

function initializeDepartments() {
    departments = [...sampleDepartments];
    filteredDepartments = [...departments];
    loadDepartments();
    updateStatistics();
}

function updateStatistics() {
    const total = departments.length;
    const active = departments.filter(d => d.status === 'active').length;
    const faculty = departments.reduce((sum, d) => sum + d.facultyCount, 0);
    const students = departments.reduce((sum, d) => sum + d.currentStudents, 0);
    
    document.getElementById('totalDepartments').textContent = total;
    document.getElementById('activeDepartments').textContent = active;
    document.getElementById('totalFaculty').textContent = faculty;
    document.getElementById('totalStudents').textContent = students.toLocaleString();
}

function loadDepartments() {
    if (currentView === 'table') {
        loadDepartmentsTable();
    } else {
        loadDepartmentsCards();
    }
    updateSelectedCount();
}

function loadDepartmentsTable() {
    const tbody = document.getElementById('departmentsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (filteredDepartments.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="8" style="text-align: center; padding: 40px;">
                <h3>No departments found</h3>
                <p>Try adjusting your search criteria</p>
            </td></tr>
        `;
        return;
    }
    
    filteredDepartments.forEach(dept => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" value="${dept.id}" onchange="toggleDepartmentSelection(${dept.id})"></td>
            <td>
                <div class="department-profile">
                    <div class="dept-icon ${dept.type.toLowerCase()}">${dept.code}</div>
                    <div class="department-info-text">
                        <h4>${dept.name}</h4>
                        <p>${dept.code} • Est. ${dept.establishedYear}</p>
                    </div>
                </div>
            </td>
            <td><strong>${dept.hod}</strong><br><small>${dept.hodEmail}</small></td>
            <td><span class="count-badge">${dept.facultyCount}</span></td>
            <td><span class="count-badge">${dept.currentStudents}/${dept.studentCapacity}</span></td>
            <td><span class="count-badge">0 Labs</span></td>
            <td><span class="status-badge status-${dept.status}">${formatStatus(dept.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn action-view" onclick="viewDepartment(${dept.id})"><i class="fas fa-eye"></i></button>
                    <button class="action-btn action-edit" onclick="editDepartment(${dept.id})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn action-delete" onclick="deleteDepartment(${dept.id})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadDepartmentsCards() {
    const container = document.getElementById('departmentsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    filteredDepartments.forEach(dept => {
        const occupancy = Math.round((dept.currentStudents / dept.studentCapacity) * 100);
        
        const card = document.createElement('div');
        card.className = `department-card ${dept.type.toLowerCase()}`;
        card.innerHTML = `
            <div class="department-card-header">
                <div class="department-title">${dept.name}</div>
                <div class="department-code">${dept.code} • Est. ${dept.establishedYear}</div>
            </div>
            <div class="department-card-body">
                <div class="department-stats">
                    <div class="stat-item">
                        <div class="number">${dept.facultyCount}</div>
                        <div class="label">Faculty</div>
                    </div>
                    <div class="stat-item">
                        <div class="number">${dept.currentStudents}</div>
                        <div class="label">Students</div>
                    </div>
                    <div class="stat-item">
                        <div class="number">0</div>
                        <div class="label">Labs</div>
                    </div>
                </div>
                <div class="department-info">
                    <div class="info-row">
                        <span class="info-label">Head of Department</span>
                        <span class="info-value">${dept.hod}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Location</span>
                        <span class="info-value">${dept.location}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Occupancy</span>
                        <span class="info-value">${occupancy}%</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Status</span>
                        <span class="status-badge status-${dept.status}">${formatStatus(dept.status)}</span>
                    </div>
                </div>
                <div class="department-actions">
                    <button class="action-btn action-view" onclick="viewDepartment(${dept.id})"><i class="fas fa-eye"></i> View</button>
                    <button class="action-btn action-edit" onclick="editDepartment(${dept.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="action-btn action-delete" onclick="deleteDepartment(${dept.id})"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function switchView(view) {
    currentView = view;
    
    const cardBtn = document.getElementById('cardViewBtn');
    const tableBtn = document.getElementById('tableViewBtn');
    const cardContainer = document.getElementById('departmentsContainer');
    const tableContainer = document.getElementById('tableContainer');
    
    if (view === 'card') {
        cardBtn.classList.add('active');
        tableBtn.classList.remove('active');
        cardContainer.style.display = 'grid';
        tableContainer.style.display = 'none';
    } else {
        tableBtn.classList.add('active');
        cardBtn.classList.remove('active');
        tableContainer.style.display = 'block';
        cardContainer.style.display = 'none';
    }
    
    loadDepartments();
}

// CRUD Operations
function openAddDepartmentModal() {
    document.getElementById('modalTitle').textContent = 'Add New Department';
    document.getElementById('departmentForm').reset();
    currentDepartment = null;
    openModal('departmentModal');
}

function editDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    
    currentDepartment = dept;
    document.getElementById('modalTitle').textContent = 'Edit Department';
    
    // Populate form
    document.getElementById('departmentName').value = dept.name;
    document.getElementById('departmentCode').value = dept.code;
    document.getElementById('departmentType').value = dept.type;
    document.getElementById('establishedYear').value = dept.establishedYear;
    document.getElementById('departmentDescription').value = dept.description;
    document.getElementById('hodName').value = dept.hod;
    document.getElementById('hodEmail').value = dept.hodEmail;
    document.getElementById('departmentPhone').value = dept.phone;
    document.getElementById('departmentEmail').value = dept.email;
    document.getElementById('officeLocation').value = dept.location;
    document.getElementById('facultyCount').value = dept.facultyCount;
    document.getElementById('studentCapacity').value = dept.studentCapacity;
    document.getElementById('currentStudents').value = dept.currentStudents;
    document.getElementById('departmentStatus').value = dept.status;
    
    openModal('departmentModal');
}

function viewDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    
    document.getElementById('departmentDetailsTitle').textContent = `${dept.name} - Details`;
    
    const content = `
        <div class="form-section">
            <h4><i class="fas fa-info-circle"></i> Basic Information</h4>
            <p><strong>Name:</strong> ${dept.name}</p>
            <p><strong>Code:</strong> ${dept.code}</p>
            <p><strong>Type:</strong> ${dept.type}</p>
            <p><strong>Established:</strong> ${dept.establishedYear}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${dept.status}">${formatStatus(dept.status)}</span></p>
            <p><strong>Description:</strong> ${dept.description}</p>
        </div>
        <div class="form-section">
            <h4><i class="fas fa-user-tie"></i> Leadership & Contact</h4>
            <p><strong>HOD:</strong> ${dept.hod}</p>
            <p><strong>HOD Email:</strong> ${dept.hodEmail}</p>
            <p><strong>Phone:</strong> ${dept.phone}</p>
            <p><strong>Email:</strong> ${dept.email}</p>
            <p><strong>Location:</strong> ${dept.location}</p>
        </div>
        <div class="form-section">
            <h4><i class="fas fa-chart-bar"></i> Statistics</h4>
            <p><strong>Faculty:</strong> ${dept.facultyCount}</p>
            <p><strong>Students:</strong> ${dept.currentStudents}/${dept.studentCapacity}</p>
            <p><strong>Occupancy:</strong> ${Math.round((dept.currentStudents / dept.studentCapacity) * 100)}%</p>
        </div>
    `;
    
    document.getElementById('departmentDetailsContent').innerHTML = content;
    openModal('departmentDetailsModal');
}

function deleteDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept || !confirm(`Delete "${dept.name}"?`)) return;
    
    departments = departments.filter(d => d.id !== id);
    filteredDepartments = filteredDepartments.filter(d => d.id !== id);
    selectedDepartments = selectedDepartments.filter(sid => sid !== id);
    
    loadDepartments();
    updateStatistics();
    showNotification('Department deleted!', 'success');
}

function saveDepartment(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('departmentName').value.trim(),
        code: document.getElementById('departmentCode').value.trim().toUpperCase(),
        type: document.getElementById('departmentType').value,
        establishedYear: parseInt(document.getElementById('establishedYear').value) || new Date().getFullYear(),
        description: document.getElementById('departmentDescription').value.trim(),
        hod: document.getElementById('hodName').value.trim(),
        hodEmail: document.getElementById('hodEmail').value.trim(),
        phone: document.getElementById('departmentPhone').value.trim(),
        email: document.getElementById('departmentEmail').value.trim(),
        location: document.getElementById('officeLocation').value.trim(),
        facultyCount: parseInt(document.getElementById('facultyCount').value) || 0,
        studentCapacity: parseInt(document.getElementById('studentCapacity').value) || 0,
        currentStudents: parseInt(document.getElementById('currentStudents').value) || 0,
        status: document.getElementById('departmentStatus').value
    };
    
    if (!formData.name || !formData.code || !formData.type) {
        showNotification('Fill required fields!', 'error');
        return;
    }
    
    if (currentDepartment) {
        Object.assign(currentDepartment, formData);
        const index = departments.findIndex(d => d.id === currentDepartment.id);
        if (index !== -1) departments[index] = currentDepartment;
        showNotification('Department updated!', 'success');
    } else {
        formData.id = Math.max(...departments.map(d => d.id), 0) + 1;
        departments.push(formData);
        showNotification('Department added!', 'success');
    }
    
    applyFilters();
    loadDepartments();
    updateStatistics();
    closeModal();
}

// Search & Filters
function searchDepartments() { applyFilters(); }
function filterDepartments() { applyFilters(); }

function applyFilters() {
    const search = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    const status = document.getElementById('statusFilter')?.value || '';
    const type = document.getElementById('typeFilter')?.value || '';
    
    filteredDepartments = departments.filter(dept => {
        const matchesSearch = !search || dept.name.toLowerCase().includes(search) || dept.code.toLowerCase().includes(search);
        const matchesStatus = !status || dept.status === status;
        const matchesType = !type || dept.type === type;
        
        return matchesSearch && matchesStatus && matchesType;
    });
    
    loadDepartments();
}

// Selection Management
function toggleDepartmentSelection(id) {
    const index = selectedDepartments.indexOf(id);
    if (index > -1) {
        selectedDepartments.splice(index, 1);
    } else {
        selectedDepartments.push(id);
    }
    updateSelectedCount();
}

function toggleSelectAll() {
    const checkbox = document.getElementById('selectAll');
    if (checkbox?.checked) {
        selectedDepartments = [...filteredDepartments.map(d => d.id)];
    } else {
        selectedDepartments = [];
    }
    
    document.querySelectorAll('input[type="checkbox"][value]').forEach(cb => {
        cb.checked = selectedDepartments.includes(parseInt(cb.value));
    });
    
    updateSelectedCount();
}

function toggleMasterCheckbox() {
    const checkbox = document.getElementById('masterCheckbox');
    if (checkbox?.checked) {
        filteredDepartments.forEach(dept => {
            if (!selectedDepartments.includes(dept.id)) {
                selectedDepartments.push(dept.id);
            }
        });
    } else {
        filteredDepartments.forEach(dept => {
            const index = selectedDepartments.indexOf(dept.id);
            if (index > -1) selectedDepartments.splice(index, 1);
        });
    }
    
    document.querySelectorAll('input[type="checkbox"][value]').forEach(cb => {
        cb.checked = selectedDepartments.includes(parseInt(cb.value));
    });
    
    updateSelectedCount();
}

function updateSelectedCount() {
    const element = document.getElementById('selectedCount');
    if (element) element.textContent = `${selectedDepartments.length} departments selected`;
    
    const bulkActions = document.getElementById('bulkActions');
    if (bulkActions) bulkActions.style.display = selectedDepartments.length > 0 ? 'flex' : 'none';
}

function bulkAction(action) {
    if (selectedDepartments.length === 0) {
        showNotification('Select departments first!', 'error');
        return;
    }
    
    const selectedDepts = departments.filter(d => selectedDepartments.includes(d.id));
    
    if (action === 'activate') {
        selectedDepts.forEach(dept => dept.status = 'active');
        showNotification(`${selectedDepts.length} departments activated!`, 'success');
    } else if (action === 'deactivate') {
        selectedDepts.forEach(dept => dept.status = 'inactive');
        showNotification(`${selectedDepts.length} departments deactivated!`, 'success');
    }
    
    selectedDepartments = [];
    applyFilters();
    loadDepartments();
    updateStatistics();
}

// Lab Management Placeholders
function openLabManagementModal() { showNotification('Lab management coming soon!', 'info'); }
function openAddLabModal() { showNotification('Add lab coming soon!', 'info'); }
function searchLabs() {}
function filterLabsByDepartment() {}
function filterLabsByType() {}

// Utility Functions
function refreshDepartments() {
    applyFilters();
    loadDepartments();
    updateStatistics();
    showNotification('Data refreshed!', 'info');
}

function exportDepartments() { showNotification('Export coming soon!', 'info'); }
function exportSelected() { showNotification('Export selected coming soon!', 'info'); }
function importDepartments() { showNotification('Import coming soon!', 'info'); }

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    
    if (!notification || !text) return;
    
    const icon = notification.querySelector('i');
    if (icon) {
        const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', info: 'fas fa-info-circle' };
        icon.className = icons[type] || icons.success;
    }
    
    text.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => notification.classList.remove('show'), 3000);
}

function formatStatus(status) {
    return status.replace('-', ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function logout() {
    if (confirm('Logout?')) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}

// Event Listeners
function setupEventListeners() {
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMobileSidebar();
    });
    
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) closeMobileSidebar();
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', initializeApp);
