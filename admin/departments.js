// Dashboard Style Simple JavaScript
let currentDepartment = null;
let currentLab = null;
let departments = [];
let labs = [];
let currentView = 'table';
let selectedDepartments = [];
let filteredDepartments = [];

// Theme Management - Dashboard Exact
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('scms-theme', newTheme);
    updateThemeIcons(newTheme);
}

function updateThemeIcons(theme) {
    const themeIcon = document.getElementById('themeIcon');
    const mobileThemeIcon = document.getElementById('mobileThemeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const themeSwitch = document.getElementById('themeSwitch');
    
    if (theme === 'dark') {
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-sun';
        if (themeLabel) themeLabel.textContent = 'Light Mode';
        if (themeSwitch) themeSwitch.classList.add('active');
    } else {
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-moon';
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
        if (themeSwitch) themeSwitch.classList.remove('active');
    }
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
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.remove('show'));
    document.body.style.overflow = 'auto';
    currentDepartment = null;
    currentLab = null;
}

// Sample Data - Simple
const sampleDepartments = [
    {
        id: 1,
        name: "Computer Science Engineering",
        code: "CSE",
        type: "Engineering",
        hod: "Dr. Rajesh Kumar",
        hodEmail: "rajesh.kumar@scms.edu",
        email: "cse@scms.edu",
        phone: "+91-98765-43210",
        location: "Block A, Floor 3",
        facultyCount: 28,
        studentCapacity: 600,
        currentStudents: 545,
        establishedYear: 2010,
        status: "active",
        description: "Leading department in computer science and technology education.",
        labs: [
            {
                id: 1,
                name: "Programming Lab",
                type: "Computer Lab",
                capacity: 60,
                utilization: 85,
                incharge: "Prof. Smith",
                location: "Block A, Room 301",
                equipment: ["Desktop PCs - 60", "Projector - 2"],
                software: ["Visual Studio", "MySQL"],
                status: "active"
            }
        ]
    },
    {
        id: 2,
        name: "Electronics & Communication",
        code: "ECE",
        type: "Engineering",
        hod: "Dr. Priya Sharma",
        hodEmail: "priya.sharma@scms.edu",
        email: "ece@scms.edu",
        phone: "+91-98765-43211",
        location: "Block B, Floor 2",
        facultyCount: 22,
        studentCapacity: 480,
        currentStudents: 456,
        establishedYear: 2012,
        status: "active",
        description: "Excellence in electronics and communication engineering.",
        labs: []
    },
    {
        id: 3,
        name: "Mechanical Engineering",
        code: "MECH",
        type: "Engineering",
        hod: "Dr. Amit Patel",
        hodEmail: "amit.patel@scms.edu",
        email: "mech@scms.edu",
        phone: "+91-98765-43212",
        location: "Block C, Floor 1",
        facultyCount: 20,
        studentCapacity: 400,
        currentStudents: 385,
        establishedYear: 2008,
        status: "active",
        description: "Traditional engineering discipline.",
        labs: []
    },
    {
        id: 4,
        name: "Business Administration",
        code: "MBA",
        type: "Management",
        hod: "Dr. Sarah Williams",
        hodEmail: "sarah.williams@scms.edu",
        email: "mba@scms.edu",
        phone: "+91-98765-43213",
        location: "Block D, Floor 2",
        facultyCount: 18,
        studentCapacity: 240,
        currentStudents: 228,
        establishedYear: 2015,
        status: "active",
        description: "Comprehensive business education.",
        labs: []
    },
    {
        id: 5,
        name: "English Literature",
        code: "ENG",
        type: "Arts",
        hod: "Dr. Michael Brown",
        hodEmail: "michael.brown@scms.edu",
        email: "english@scms.edu",
        phone: "+91-98765-43214",
        location: "Block E, Floor 1",
        facultyCount: 15,
        studentCapacity: 360,
        currentStudents: 342,
        establishedYear: 2005,
        status: "under-review",
        description: "Rich tradition in literary studies.",
        labs: []
    }
];

// Initialize App
function initializeApp() {
    initializeTheme();
    initializeDepartments();
    setupEventListeners();
    loadUserInfo();
}

function loadUserInfo() {
    const userName = document.getElementById('userName');
    if (userName) userName.textContent = 'Admin User';
}

function initializeDepartments() {
    departments = [...sampleDepartments];
    labs = [];
    departments.forEach(dept => {
        if (dept.labs && dept.labs.length > 0) {
            dept.labs.forEach(lab => {
                lab.departmentId = dept.id;
                lab.departmentName = dept.name;
                labs.push({...lab});
            });
        }
    });
    
    filteredDepartments = [...departments];
    loadDepartments();
    updateStatistics();
}

function updateStatistics() {
    const totalDepts = departments.length;
    const activeDepts = departments.filter(d => d.status === 'active').length;
    const totalFaculty = departments.reduce((sum, d) => sum + (d.facultyCount || 0), 0);
    const totalStudents = departments.reduce((sum, d) => sum + (d.currentStudents || 0), 0);
    
    document.getElementById('totalDepartments').textContent = totalDepts;
    document.getElementById('activeDepartments').textContent = activeDepts;
    document.getElementById('totalFaculty').textContent = totalFaculty;
    document.getElementById('totalStudents').textContent = totalStudents.toLocaleString();
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
            <tr>
                <td colspan="8" class="empty-state">
                    <div>
                        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px;"></i>
                        <h3>No departments found</h3>
                        <p>Try adjusting your search criteria</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    filteredDepartments.forEach(dept => {
        const row = document.createElement('tr');
        const labCount = dept.labs ? dept.labs.length : 0;
        
        row.innerHTML = `
            <td>
                <input type="checkbox" value="${dept.id}" onchange="toggleDepartmentSelection(${dept.id})" 
                       ${selectedDepartments.includes(dept.id) ? 'checked' : ''}>
            </td>
            <td>
                <div class="department-profile">
                    <div class="dept-icon ${dept.type.toLowerCase()}">
                        ${dept.code}
                    </div>
                    <div class="department-info-text">
                        <h4>${dept.name}</h4>
                        <p>${dept.code} • Est. ${dept.establishedYear}</p>
                    </div>
                </div>
            </td>
            <td>
                <div>
                    <strong>${dept.hod}</strong><br>
                    <small>${dept.hodEmail}</small>
                </div>
            </td>
            <td>
                <span class="count-badge">${dept.facultyCount}</span>
            </td>
            <td>
                <span class="count-badge">${dept.currentStudents}/${dept.studentCapacity}</span>
            </td>
            <td>
                <span class="count-badge">${labCount} Labs</span>
            </td>
            <td>
                <span class="status-badge status-${dept.status}">${formatStatus(dept.status)}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn action-view" onclick="viewDepartment(${dept.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn action-edit" onclick="editDepartment(${dept.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn action-delete" onclick="deleteDepartment(${dept.id})">
                        <i class="fas fa-trash"></i>
                    </button>
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
    
    if (filteredDepartments.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-search" style="font-size: 3rem;"></i>
                <h3>No departments found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    filteredDepartments.forEach(dept => {
        const labCount = dept.labs ? dept.labs.length : 0;
        const occupancyRate = dept.studentCapacity > 0 ? 
            Math.round((dept.currentStudents / dept.studentCapacity) * 100) : 0;
        
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
                        <div class="number">${labCount}</div>
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
                        <span class="info-value">${occupancyRate}%</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Status</span>
                        <span class="status-badge status-${dept.status}">${formatStatus(dept.status)}</span>
                    </div>
                </div>
                <div class="department-actions">
                    <button class="action-btn action-view" onclick="viewDepartment(${dept.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn action-edit" onclick="editDepartment(${dept.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn action-delete" onclick="deleteDepartment(${dept.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
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
        cardBtn?.classList.add('active');
        tableBtn?.classList.remove('active');
        if (cardContainer) cardContainer.style.display = 'grid';
        if (tableContainer) tableContainer.style.display = 'none';
        loadDepartmentsCards();
    } else {
        tableBtn?.classList.add('active');
        cardBtn?.classList.remove('active');
        if (tableContainer) tableContainer.style.display = 'block';
        if (cardContainer) cardContainer.style.display = 'none';
        loadDepartmentsTable();
    }
}

// CRUD Operations - Simple
function openAddDepartmentModal() {
    document.getElementById('modalTitle').textContent = 'Add New Department';
    currentDepartment = null;
    const form = document.getElementById('departmentForm');
    if (form) form.reset();
    openModal('departmentModal');
}

function editDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    
    currentDepartment = dept;
    document.getElementById('modalTitle').textContent = 'Edit Department';
    
    // Simple form population
    document.getElementById('departmentName').value = dept.name || '';
    document.getElementById('departmentCode').value = dept.code || '';
    document.getElementById('departmentType').value = dept.type || '';
    document.getElementById('establishedYear').value = dept.establishedYear || '';
    document.getElementById('departmentDescription').value = dept.description || '';
    document.getElementById('hodName').value = dept.hod || '';
    document.getElementById('hodEmail').value = dept.hodEmail || '';
    document.getElementById('departmentPhone').value = dept.phone || '';
    document.getElementById('departmentEmail').value = dept.email || '';
    document.getElementById('officeLocation').value = dept.location || '';
    document.getElementById('facultyCount').value = dept.facultyCount || '';
    document.getElementById('studentCapacity').value = dept.studentCapacity || '';
    document.getElementById('currentStudents').value = dept.currentStudents || '';
    document.getElementById('departmentStatus').value = dept.status || 'active';
    
    openModal('departmentModal');
}

function viewDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    
    document.getElementById('departmentDetailsTitle').textContent = `${dept.name} - Details`;
    
    const occupancyRate = dept.studentCapacity > 0 ? 
        Math.round((dept.currentStudents / dept.studentCapacity) * 100) : 0;
    
    const content = `
        <div style="max-height: 70vh; overflow-y: auto;">
            <div class="form-section">
                <h4><i class="fas fa-info-circle"></i> Basic Information</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div><strong>Department Name:</strong> ${dept.name}</div>
                    <div><strong>Code:</strong> ${dept.code}</div>
                    <div><strong>Type:</strong> ${dept.type}</div>
                    <div><strong>Established:</strong> ${dept.establishedYear}</div>
                    <div><strong>Status:</strong> <span class="status-badge status-${dept.status}">${formatStatus(dept.status)}</span></div>
                    <div><strong>Location:</strong> ${dept.location}</div>
                </div>
                <div style="margin-top: 15px;"><strong>Description:</strong> ${dept.description}</div>
            </div>
            
            <div class="form-section">
                <h4><i class="fas fa-user-tie"></i> Leadership & Contact</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div><strong>Head of Department:</strong> ${dept.hod}</div>
                    <div><strong>HOD Email:</strong> ${dept.hodEmail}</div>
                    <div><strong>Department Phone:</strong> ${dept.phone}</div>
                    <div><strong>Department Email:</strong> ${dept.email}</div>
                </div>
            </div>
            
            <div class="form-section">
                <h4><i class="fas fa-chart-bar"></i> Statistics</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div><strong>Faculty Count:</strong> ${dept.facultyCount}</div>
                    <div><strong>Student Capacity:</strong> ${dept.studentCapacity}</div>
                    <div><strong>Current Students:</strong> ${dept.currentStudents}</div>
                    <div><strong>Occupancy Rate:</strong> ${occupancyRate}%</div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('departmentDetailsContent').innerHTML = content;
    openModal('departmentDetailsModal');
}

function deleteDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    
    if (confirm(`Delete "${dept.name}"? This cannot be undone.`)) {
        departments = departments.filter(d => d.id !== id);
        filteredDepartments = filteredDepartments.filter(d => d.id !== id);
        labs = labs.filter(lab => lab.departmentId !== id);
        selectedDepartments = selectedDepartments.filter(sid => sid !== id);
        
        loadDepartments();
        updateStatistics();
        showNotification('Department deleted successfully!', 'success');
    }
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
        showNotification('Please fill required fields', 'error');
        return;
    }
    
    if (currentDepartment) {
        Object.assign(currentDepartment, formData);
        const index = departments.findIndex(d => d.id === currentDepartment.id);
        if (index !== -1) departments[index] = currentDepartment;
        showNotification('Department updated!', 'success');
    } else {
        formData.id = Math.max(...departments.map(d => d.id), 0) + 1;
        formData.labs = [];
        departments.push(formData);
        showNotification('Department added!', 'success');
    }
    
    applyFilters();
    loadDepartments();
    updateStatistics();
    closeModal();
}

// Search and Filter - Simple
function searchDepartments() {
    applyFilters();
}

function filterDepartments() {
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    const labFilter = document.getElementById('labFilter')?.value || '';
    
    filteredDepartments = departments.filter(dept => {
        const matchesSearch = !searchTerm || 
            dept.name.toLowerCase().includes(searchTerm) ||
            dept.code.toLowerCase().includes(searchTerm) ||
            dept.hod.toLowerCase().includes(searchTerm);
        
        const matchesStatus = !statusFilter || dept.status === statusFilter;
        const matchesType = !typeFilter || dept.type === typeFilter;
        
        let matchesLab = true;
        if (labFilter) {
            const labCount = dept.labs ? dept.labs.length : 0;
            switch (labFilter) {
                case 'has-labs': matchesLab = labCount > 0; break;
                case 'no-labs': matchesLab = labCount === 0; break;
            }
        }
        
        return matchesSearch && matchesStatus && matchesType && matchesLab;
    });
    
    loadDepartments();
}

// Selection Management - Simple
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
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox?.checked) {
        selectedDepartments = [...filteredDepartments.map(d => d.id)];
    } else {
        selectedDepartments = [];
    }
    
    document.querySelectorAll('input[type="checkbox"][value]').forEach(checkbox => {
        checkbox.checked = selectedDepartments.includes(parseInt(checkbox.value));
    });
    
    updateSelectedCount();
}

function toggleMasterCheckbox() {
    const masterCheckbox = document.getElementById('masterCheckbox');
    if (masterCheckbox?.checked) {
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
    
    document.querySelectorAll('input[type="checkbox"][value]').forEach(checkbox => {
        checkbox.checked = selectedDepartments.includes(parseInt(checkbox.value));
    });
    
    updateSelectedCount();
}

function updateSelectedCount() {
    const countElement = document.getElementById('selectedCount');
    if (countElement) {
        countElement.textContent = `${selectedDepartments.length} departments selected`;
    }
    
    const bulkActions = document.getElementById('bulkActions');
    if (bulkActions) {
        bulkActions.style.display = selectedDepartments.length > 0 ? 'flex' : 'none';
    }
}

function bulkAction(action) {
    if (selectedDepartments.length === 0) {
        showNotification('Select departments first', 'error');
        return;
    }
    
    const selectedDepts = departments.filter(d => selectedDepartments.includes(d.id));
    
    switch (action) {
        case 'activate':
            selectedDepts.forEach(dept => dept.status = 'active');
            showNotification(`${selectedDepts.length} departments activated`, 'success');
            break;
        case 'deactivate':
            selectedDepts.forEach(dept => dept.status = 'inactive');
            showNotification(`${selectedDepts.length} departments deactivated`, 'success');
            break;
    }
    
    selectedDepartments = [];
    applyFilters();
    loadDepartments();
    updateStatistics();
}

// Lab Management - Simple
function openLabManagementModal() {
    populateLabDepartmentFilter();
    loadLabManagement();
    openModal('labManagementModal');
}

function openAddLabModal() {
    document.getElementById('labModalTitle').textContent = 'Add New Laboratory';
    const form = document.getElementById('labForm');
    if (form) form.reset();
    currentLab = null;
    populateDepartmentOptions();
    openModal('addLabModal');
}

function populateDepartmentOptions() {
    const select = document.getElementById('labDepartment');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Department</option>';
    departments.forEach(dept => {
        select.innerHTML += `<option value="${dept.id}">${dept.name} (${dept.code})</option>`;
    });
}

function populateLabDepartmentFilter() {
    const select = document.getElementById('labDepartmentFilter');
    if (!select) return;
    
    select.innerHTML = '<option value="">All Departments</option>';
    departments.forEach(dept => {
        select.innerHTML += `<option value="${dept.id}">${dept.name}</option>`;
    });
}

function loadLabManagement() {
    const container = document.getElementById('labsGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (labs.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-flask" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <h3>No laboratories found</h3>
                <p>Add laboratories to get started</p>
            </div>
        `;
        return;
    }
    
    labs.forEach(lab => {
        const card = document.createElement('div');
        card.className = 'lab-card';
        card.innerHTML = `
            <div class="lab-header">
                <h5>${lab.name}</h5>
                <span class="lab-type-badge">${lab.type}</span>
            </div>
            <div class="lab-details">
                <div class="lab-detail-item">
                    <label>Department</label>
                    <span>${lab.departmentName}</span>
                </div>
                <div class="lab-detail-item">
                    <label>Capacity</label>
                    <span>${lab.capacity} students</span>
                </div>
                <div class="lab-detail-item">
                    <label>Utilization</label>
                    <span class="utilization-badge">${lab.utilization}%</span>
                </div>
                <div class="lab-detail-item">
                    <label>In-charge</label>
                    <span>${lab.incharge || 'Not assigned'}</span>
                </div>
                <div class="lab-detail-item">
                    <label>Location</label>
                    <span>${lab.location || 'Not specified'}</span>
                </div>
                <div class="lab-detail-item">
                    <label>Status</label>
                    <span class="status-badge status-${lab.status}">${formatStatus(lab.status)}</span>
                </div>
            </div>
            <div style="margin-top: 15px; display: flex; gap: 8px; justify-content: center;">
                <button class="action-btn action-edit" onclick="editLab(${lab.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn action-delete" onclick="deleteLab(${lab.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function editLab(id) {
    const lab = labs.find(l => l.id === id);
    if (!lab) return;
    
    currentLab = lab;
    document.getElementById('labModalTitle').textContent = 'Edit Laboratory';
    
    document.getElementById('labName').value = lab.name || '';
    document.getElementById('labType').value = lab.type || '';
    document.getElementById('labDepartment').value = lab.departmentId || '';
    document.getElementById('labCapacity').value = lab.capacity || '';
    document.getElementById('labIncharge').value = lab.incharge || '';
    document.getElementById('labLocation').value = lab.location || '';
    document.getElementById('labEquipment').value = lab.equipment ? lab.equipment.join('\n') : '';
    document.getElementById('labSoftware').value = lab.software ? lab.software.join('\n') : '';
    document.getElementById('utilizationRate').value = lab.utilization || '';
    document.getElementById('labStatus').value = lab.status || 'active';
    
    populateDepartmentOptions();
    openModal('addLabModal');
}

function deleteLab(id) {
    const lab = labs.find(l => l.id === id);
    if (!lab) return;
    
    if (confirm(`Delete "${lab.name}"?`)) {
        labs = labs.filter(l => l.id !== id);
        
        const dept = departments.find(d => d.id === lab.departmentId);
        if (dept && dept.labs) {
            dept.labs = dept.labs.filter(l => l.id !== id);
        }
        
        loadLabManagement();
        showNotification('Laboratory deleted!', 'success');
    }
}

function saveLab(event) {
    event.preventDefault();
    
    const departmentId = parseInt(document.getElementById('labDepartment').value);
    const department = departments.find(d => d.id === departmentId);
    
    if (!department) {
        showNotification('Select a valid department', 'error');
        return;
    }
    
    const formData = {
        name: document.getElementById('labName').value.trim(),
        type: document.getElementById('labType').value,
        departmentId: departmentId,
        departmentName: department.name,
        capacity: parseInt(document.getElementById('labCapacity').value) || 0,
        incharge: document.getElementById('labIncharge').value.trim(),
        location: document.getElementById('labLocation').value.trim(),
        equipment: document.getElementById('labEquipment').value.split('\n').filter(item => item.trim()),
        software: document.getElementById('labSoftware').value.split('\n').filter(item => item.trim()),
        utilization: parseInt(document.getElementById('utilizationRate').value) || 0,
        status: document.getElementById('labStatus').value
    };
    
    if (!formData.name || !formData.type || !formData.capacity) {
        showNotification('Fill required fields', 'error');
        return;
    }
    
    if (currentLab) {
        Object.assign(currentLab, formData);
        if (department.labs) {
            const labIndex = department.labs.findIndex(l => l.id === currentLab.id);
            if (labIndex !== -1) department.labs[labIndex] = {...currentLab};
        }
        showNotification('Laboratory updated!', 'success');
    } else {
        formData.id = Math.max(...labs.map(l => l.id), 0) + 1;
        labs.push(formData);
        
        if (!department.labs) department.labs = [];
        department.labs.push({...formData});
        
        showNotification('Laboratory added!', 'success');
    }
    
    loadLabManagement();
    loadDepartments();
    closeModal();
}

// Utility Functions
function refreshDepartments() {
    applyFilters();
    loadDepartments();
    updateStatistics();
    showNotification('Data refreshed!', 'info');
}

function exportDepartments() {
    showNotification('Export functionality coming soon!', 'info');
}

function exportSelected() {
    if (selectedDepartments.length === 0) {
        showNotification('Select departments to export', 'error');
        return;
    }
    showNotification(`Exporting ${selectedDepartments.length} departments...`, 'info');
}

function importDepartments() {
    showNotification('Import functionality coming soon!', 'info');
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) return;
    
    const iconElement = notification.querySelector('i');
    if (iconElement) {
        const icons = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'info': 'fas fa-info-circle'
        };
        iconElement.className = icons[type] || icons['success'];
    }
    
    notificationText.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
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

// Placeholder Lab Functions
function searchLabs() { loadLabManagement(); }
function filterLabsByDepartment() { loadLabManagement(); }
function filterLabsByType() { loadLabManagement(); }

// Event Listeners - Simple
function setupEventListeners() {
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) closeMobileSidebar();
    });
    
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) closeMobileSidebar();
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', initializeApp);
