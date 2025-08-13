// Global Variables and State Management
let departments = [];
let labs = [];
let filteredDepartments = [];
let currentView = 'card';
let selectedDepartments = new Set();
let editingDepartmentId = null;
let editingLabId = null;

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize App
function initializeApp() {
    setTheme(currentTheme);
    loadSampleData();
    renderDepartments();
    updateStatistics();
    initializeEventListeners();
    setActiveNavigation();
    populateDepartmentSelects();
    
    // Load user info
    loadUserInfo();
    
    // Initialize responsive handlers
    handleResponsiveChanges();
}

// Event Listeners
function initializeEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchDepartments, 300));
    }
    
    // Filter change handlers
    const filters = ['statusFilter', 'typeFilter', 'labFilter'];
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', filterDepartments);
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Responsive breakpoint handling
    window.addEventListener('resize', debounce(handleResponsiveChanges, 250));
    
    // Handle modal escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Handle clicks outside modals
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
}

// Theme Management
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update theme icons and labels
    const themeIcons = document.querySelectorAll('#themeIcon, #mobileThemeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const themeSwitch = document.getElementById('themeSwitch');
    
    themeIcons.forEach(icon => {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
    
    if (themeLabel) {
        themeLabel.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
    
    if (themeSwitch) {
        themeSwitch.classList.toggle('active', theme === 'dark');
    }
}

// Mobile Navigation
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent body scroll when sidebar is open
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Responsive Handling
function handleResponsiveChanges() {
    const isMobile = window.innerWidth <= 768;
    
    // Auto-close mobile sidebar on resize to desktop
    if (!isMobile) {
        closeMobileSidebar();
    }
    
    // Adjust view based on screen size
    if (isMobile && currentView === 'table') {
        switchView('card');
    }
    
    // Update button text visibility
    updateButtonTextVisibility();
}

function updateButtonTextVisibility() {
    const isMobile = window.innerWidth <= 480;
    const btnTexts = document.querySelectorAll('.btn-text');
    
    btnTexts.forEach(text => {
        text.style.display = isMobile ? 'none' : 'inline';
    });
}

// Sample Data
function loadSampleData() {
    departments = [
        {
            id: 1,
            name: 'Computer Science Engineering',
            code: 'CSE',
            type: 'Engineering',
            hodName: 'Dr. Rajesh Kumar',
            hodEmail: 'rajesh.kumar@college.edu',
            phone: '+91-98765-43210',
            email: 'cse@college.edu',
            location: 'Block A, Floor 3',
            facultyCount: 25,
            studentCapacity: 240,
            currentStudents: 220,
            establishedYear: 2010,
            status: 'active',
            description: 'Leading department in computer science and technology education.',
            labs: ['Programming Lab', 'Data Structures Lab', 'Network Lab']
        },
        {
            id: 2,
            name: 'Electronics & Communication',
            code: 'ECE',
            type: 'Engineering',
            hodName: 'Dr. Priya Sharma',
            hodEmail: 'priya.sharma@college.edu',
            phone: '+91-98765-43211',
            email: 'ece@college.edu',
            location: 'Block B, Floor 2',
            facultyCount: 20,
            studentCapacity: 180,
            currentStudents: 165,
            establishedYear: 2008,
            status: 'active',
            description: 'Excellence in electronics and communication technology.',
            labs: ['Electronics Lab', 'Communication Lab', 'Microprocessor Lab']
        },
        {
            id: 3,
            name: 'Mechanical Engineering',
            code: 'MECH',
            type: 'Engineering',
            hodName: 'Dr. Suresh Gupta',
            hodEmail: 'suresh.gupta@college.edu',
            phone: '+91-98765-43212',
            email: 'mech@college.edu',
            location: 'Block C, Floor 1',
            facultyCount: 18,
            studentCapacity: 160,
            currentStudents: 145,
            establishedYear: 2005,
            status: 'active',
            description: 'Strong foundation in mechanical engineering principles.',
            labs: ['Workshop Lab', 'CAD Lab', 'Thermal Lab']
        },
        {
            id: 4,
            name: 'Business Administration',
            code: 'MBA',
            type: 'Management',
            hodName: 'Dr. Anita Verma',
            hodEmail: 'anita.verma@college.edu',
            phone: '+91-98765-43213',
            email: 'mba@college.edu',
            location: 'Block D, Floor 2',
            facultyCount: 15,
            studentCapacity: 120,
            currentStudents: 110,
            establishedYear: 2012,
            status: 'active',
            description: 'Comprehensive business and management education.',
            labs: ['Computer Lab', 'Finance Lab']
        },
        {
            id: 5,
            name: 'Physics',
            code: 'PHY',
            type: 'Science',
            hodName: 'Dr. Amit Singh',
            hodEmail: 'amit.singh@college.edu',
            phone: '+91-98765-43214',
            email: 'physics@college.edu',
            location: 'Block E, Floor 1',
            facultyCount: 12,
            studentCapacity: 80,
            currentStudents: 75,
            establishedYear: 2000,
            status: 'inactive',
            description: 'Fundamental physics education and research.',
            labs: ['Physics Lab', 'Optics Lab']
        }
    ];

    labs = [
        {
            id: 1,
            name: 'Programming Lab',
            type: 'Computer Lab',
            department: 'Computer Science Engineering',
            capacity: 30,
            incharge: 'Prof. Rahul Mehta',
            location: 'Block A, Room 301',
            equipment: ['Desktop PCs', 'Projector', 'Whiteboard', 'Air Conditioning'],
            software: ['Visual Studio', 'Eclipse', 'MySQL', 'Git'],
            utilization: 85,
            status: 'active'
        },
        {
            id: 2,
            name: 'Electronics Lab',
            type: 'Electronics Lab',
            department: 'Electronics & Communication',
            capacity: 25,
            incharge: 'Prof. Neha Joshi',
            location: 'Block B, Room 201',
            equipment: ['Oscilloscopes', 'Function Generators', 'Multimeters', 'Breadboards'],
            software: ['LabVIEW', 'MATLAB', 'Proteus'],
            utilization: 78,
            status: 'active'
        }
    ];

    filteredDepartments = [...departments];
}

// Statistics Management
function updateStatistics() {
    const totalDepts = departments.length;
    const activeDepts = departments.filter(d => d.status === 'active').length;
    const totalFaculty = departments.reduce((sum, d) => sum + (d.facultyCount || 0), 0);
    const totalStudents = departments.reduce((sum, d) => sum + (d.currentStudents || 0), 0);
    
    // Update main stats
    updateElementText('totalDepartments', totalDepts);
    updateElementText('activeDepartments', activeDepts);
    updateElementText('totalFaculty', totalFaculty);
    updateElementText('totalStudents', totalStudents.toLocaleString());
    updateElementText('departmentCount', totalDepts);
    
    // Update lab stats
    const totalLabs = labs.length;
    const activeLabs = labs.filter(l => l.status === 'active').length;
    const maintenanceLabs = labs.filter(l => l.status === 'maintenance').length;
    const avgUtilization = labs.length > 0 ? 
        Math.round(labs.reduce((sum, l) => sum + (l.utilization || 0), 0) / labs.length) : 0;
    
    updateElementText('totalLabs', totalLabs);
    updateElementText('activeLabs', activeLabs);
    updateElementText('maintenanceLabs', maintenanceLabs);
    updateElementText('labUtilization', avgUtilization + '%');
}

// Department Rendering
function renderDepartments() {
    if (currentView === 'card') {
        renderDepartmentCards();
    } else {
        renderDepartmentTable();
    }
    
    updateEmptyState();
    updateBulkActions();
}

function renderDepartmentCards() {
    const container = document.getElementById('departmentsContainer');
    if (!container) return;
    
    container.style.display = 'grid';
    document.getElementById('tableContainer').style.display = 'none';
    
    if (filteredDepartments.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = filteredDepartments.map(dept => `
        <div class="department-card ${dept.type.toLowerCase()}" data-id="${dept.id}">
            <input type="checkbox" class="dept-checkbox" data-id="${dept.id}" 
                   onchange="toggleDepartmentSelection(${dept.id})" 
                   ${selectedDepartments.has(dept.id) ? 'checked' : ''}
                   style="position: absolute; top: 15px; right: 15px; z-index: 10;">
            
            <div class="department-card-header">
                <div class="department-title">${dept.name}</div>
                <div class="department-code">${dept.code}</div>
            </div>
            
            <div class="department-card-body">
                <div class="department-stats">
                    <div class="stat-item">
                        <div class="number">${dept.facultyCount || 0}</div>
                        <div class="label">Faculty</div>
                    </div>
                    <div class="stat-item">
                        <div class="number">${dept.currentStudents || 0}</div>
                        <div class="label">Students</div>
                    </div>
                    <div class="stat-item">
                        <div class="number">${dept.labs ? dept.labs.length : 0}</div>
                        <div class="label">Labs</div>
                    </div>
                </div>
                
                <div class="department-info">
                    <div class="info-row">
                        <span class="info-label">Type:</span>
                        <span class="info-value">${dept.type}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">HOD:</span>
                        <span class="info-value">${dept.hodName || 'Not Assigned'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Location:</span>
                        <span class="info-value">${dept.location || 'Not Specified'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Status:</span>
                        <span class="info-value">
                            <span class="status-badge status-${dept.status}">${capitalizeFirst(dept.status)}</span>
                        </span>
                    </div>
                </div>
                
                ${dept.labs && dept.labs.length > 0 ? `
                <div class="lab-info">
                    <strong>Lab Facilities:</strong><br>
                    ${dept.labs.map(lab => `<div class="info-row">${lab}</div>`).join('')}
                </div>
                ` : ''}
                
                <div class="department-actions">
                    <button class="action-btn action-view" onclick="viewDepartmentDetails(${dept.id})" 
                            title="View Details">
                        <i class="fas fa-eye"></i>
                        <span>View</span>
                    </button>
                    <button class="action-btn action-edit" onclick="editDepartment(${dept.id})" 
                            title="Edit Department">
                        <i class="fas fa-edit"></i>
                        <span>Edit</span>
                    </button>
                    <button class="action-btn action-delete" onclick="deleteDepartment(${dept.id})" 
                            title="Delete Department">
                        <i class="fas fa-trash"></i>
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderDepartmentTable() {
    const container = document.getElementById('departmentsContainer');
    const tableContainer = document.getElementById('tableContainer');
    const tbody = document.getElementById('departmentsTableBody');
    
    if (!container || !tableContainer || !tbody) return;
    
    container.style.display = 'none';
    tableContainer.style.display = 'block';
    
    if (filteredDepartments.length === 0) {
        tbody.innerHTML = '';
        return;
    }
    
    tbody.innerHTML = filteredDepartments.map(dept => `
        <tr data-id="${dept.id}">
            <td>
                <input type="checkbox" class="dept-checkbox" data-id="${dept.id}" 
                       onchange="toggleDepartmentSelection(${dept.id})"
                       ${selectedDepartments.has(dept.id) ? 'checked' : ''}>
            </td>
            <td>
                <div class="department-profile">
                    <div class="dept-icon ${dept.type.toLowerCase()}">
                        ${dept.code}
                    </div>
                    <div class="department-info-text">
                        <h4>${dept.name}</h4>
                        <p>${dept.type} • Est. ${dept.establishedYear || 'N/A'}</p>
                    </div>
                </div>
            </td>
            <td>
                <div>${dept.hodName || 'Not Assigned'}</div>
                <small>${dept.hodEmail || ''}</small>
            </td>
            <td>
                <span class="count-badge">${dept.facultyCount || 0}</span>
            </td>
            <td>
                <span class="count-badge">${dept.currentStudents || 0}/${dept.studentCapacity || 0}</span>
            </td>
            <td>
                <span class="count-badge">${dept.labs ? dept.labs.length : 0}</span>
            </td>
            <td>
                <span class="status-badge status-${dept.status}">${capitalizeFirst(dept.status)}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn action-view" onclick="viewDepartmentDetails(${dept.id})" 
                            title="View Details" aria-label="View department details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn action-edit" onclick="editDepartment(${dept.id})" 
                            title="Edit Department" aria-label="Edit department">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn action-delete" onclick="deleteDepartment(${dept.id})" 
                            title="Delete Department" aria-label="Delete department">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// View Management
function switchView(view) {
    currentView = view;
    
    // Update button states
    document.getElementById('cardViewBtn').classList.toggle('active', view === 'card');
    document.getElementById('tableViewBtn').classList.toggle('active', view === 'table');
    
    renderDepartments();
    
    // Store preference
    localStorage.setItem('departmentView', view);
}

// Search and Filter Functions
function searchDepartments() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!query) {
        filteredDepartments = [...departments];
    } else {
        filteredDepartments = departments.filter(dept => 
            dept.name.toLowerCase().includes(query) ||
            dept.code.toLowerCase().includes(query) ||
            dept.type.toLowerCase().includes(query) ||
            (dept.hodName && dept.hodName.toLowerCase().includes(query)) ||
            (dept.location && dept.location.toLowerCase().includes(query)) ||
            (dept.labs && dept.labs.some(lab => lab.toLowerCase().includes(query)))
        );
    }
    
    applyFilters();
    renderDepartments();
}

function filterDepartments() {
    applyFilters();
    renderDepartments();
}

function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const labFilter = document.getElementById('labFilter').value;
    
    let filtered = [...filteredDepartments];
    
    if (statusFilter) {
        filtered = filtered.filter(dept => dept.status === statusFilter);
    }
    
    if (typeFilter) {
        filtered = filtered.filter(dept => dept.type === typeFilter);
    }
    
    if (labFilter) {
        switch(labFilter) {
            case 'has-labs':
                filtered = filtered.filter(dept => dept.labs && dept.labs.length > 0);
                break;
            case 'no-labs':
                filtered = filtered.filter(dept => !dept.labs || dept.labs.length === 0);
                break;
            case 'high-utilization':
                // This would need lab utilization data
                break;
            case 'low-utilization':
                // This would need lab utilization data
                break;
        }
    }
    
    filteredDepartments = filtered;
}

// Selection Management
function toggleDepartmentSelection(id) {
    if (selectedDepartments.has(id)) {
        selectedDepartments.delete(id);
    } else {
        selectedDepartments.add(id);
    }
    
    updateBulkActions();
    updateMasterCheckbox();
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    
    if (selectAll.checked) {
        filteredDepartments.forEach(dept => selectedDepartments.add(dept.id));
    } else {
        selectedDepartments.clear();
    }
    
    updateCheckboxes();
    updateBulkActions();
}

function toggleMasterCheckbox() {
    const masterCheckbox = document.getElementById('masterCheckbox');
    
    if (masterCheckbox.checked) {
        filteredDepartments.forEach(dept => selectedDepartments.add(dept.id));
    } else {
        selectedDepartments.clear();
    }
    
    updateCheckboxes();
    updateBulkActions();
}

function updateCheckboxes() {
    const checkboxes = document.querySelectorAll('.dept-checkbox');
    checkboxes.forEach(checkbox => {
        const id = parseInt(checkbox.dataset.id);
        checkbox.checked = selectedDepartments.has(id);
    });
}

function updateMasterCheckbox() {
    const masterCheckbox = document.getElementById('masterCheckbox');
    const selectAll = document.getElementById('selectAll');
    
    const visibleIds = filteredDepartments.map(d => d.id);
    const selectedVisible = visibleIds.filter(id => selectedDepartments.has(id));
    
    if (masterCheckbox) {
        masterCheckbox.checked = visibleIds.length > 0 && selectedVisible.length === visibleIds.length;
        masterCheckbox.indeterminate = selectedVisible.length > 0 && selectedVisible.length < visibleIds.length;
    }
    
    if (selectAll) {
        selectAll.checked = visibleIds.length > 0 && selectedVisible.length === visibleIds.length;
        selectAll.indeterminate = selectedVisible.length > 0 && selectedVisible.length < visibleIds.length;
    }
}

function updateBulkActions() {
    const bulkActions = document.getElementById('bulkActions');
    const selectedCount = document.getElementById('selectedCount');
    
    if (bulkActions && selectedCount) {
        const count = selectedDepartments.size;
        bulkActions.style.display = count > 0 ? 'flex' : 'none';
        selectedCount.textContent = `${count} department${count !== 1 ? 's' : ''} selected`;
    }
}

// Department CRUD Operations
function openAddDepartmentModal() {
    editingDepartmentId = null;
    document.getElementById('modalTitle').textContent = 'Add New Department';
    clearDepartmentForm();
    openModal('departmentModal');
}

function editDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    
    editingDepartmentId = id;
    document.getElementById('modalTitle').textContent = 'Edit Department';
    populateDepartmentForm(dept);
    openModal('departmentModal');
}

function saveDepartment(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const deptData = {
        name: formData.get('name'),
        code: formData.get('code'),
        type: formData.get('type'),
        hodName: formData.get('hodName'),
        hodEmail: formData.get('hodEmail'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        location: formData.get('location'),
        facultyCount: parseInt(formData.get('facultyCount')) || 0,
        studentCapacity: parseInt(formData.get('capacity')) || 0,
        currentStudents: parseInt(formData.get('currentStudents')) || 0,
        establishedYear: parseInt(formData.get('establishedYear')) || null,
        status: formData.get('status'),
        description: formData.get('description')
    };
    
    // Validation
    if (!deptData.name || !deptData.code || !deptData.type) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Check for duplicate code
    const existingDept = departments.find(d => 
        d.code.toLowerCase() === deptData.code.toLowerCase() && d.id !== editingDepartmentId
    );
    
    if (existingDept) {
        showNotification('Department code already exists', 'error');
        return;
    }
    
    if (editingDepartmentId) {
        // Update existing department
        const index = departments.findIndex(d => d.id === editingDepartmentId);
        departments[index] = { ...departments[index], ...deptData };
        showNotification('Department updated successfully', 'success');
    } else {
        // Add new department
        const newId = Math.max(...departments.map(d => d.id), 0) + 1;
        departments.push({ id: newId, ...deptData, labs: [] });
        showNotification('Department added successfully', 'success');
    }
    
    closeModal('departmentModal');
    renderDepartments();
    updateStatistics();
    populateDepartmentSelects();
}

function deleteDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    
    if (confirm(`Are you sure you want to delete ${dept.name}? This action cannot be undone.`)) {
        departments = departments.filter(d => d.id !== id);
        filteredDepartments = filteredDepartments.filter(d => d.id !== id);
        selectedDepartments.delete(id);
        
        // Remove associated labs
        labs = labs.filter(lab => lab.department !== dept.name);
        
        renderDepartments();
        updateStatistics();
        showNotification('Department deleted successfully', 'success');
    }
}

function viewDepartmentDetails(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    
    const deptLabs = labs.filter(lab => lab.department === dept.name);
    
    const detailsHTML = `
        <div class="department-details-view">
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> Basic Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Department Name</label>
                        <span>${dept.name}</span>
                    </div>
                    <div class="detail-item">
                        <label>Department Code</label>
                        <span>${dept.code}</span>
                    </div>
                    <div class="detail-item">
                        <label>Type</label>
                        <span>${dept.type}</span>
                    </div>
                    <div class="detail-item">
                        <label>Established Year</label>
                        <span>${dept.establishedYear || 'Not specified'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Status</label>
                        <span class="status-badge status-${dept.status}">${capitalizeFirst(dept.status)}</span>
                    </div>
                </div>
                ${dept.description ? `
                    <div class="detail-item" style="margin-top: 15px;">
                        <label>Description</label>
                        <span>${dept.description}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-user-tie"></i> Leadership & Contact</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Head of Department</label>
                        <span>${dept.hodName || 'Not assigned'}</span>
                    </div>
                    <div class="detail-item">
                        <label>HOD Email</label>
                        <span>${dept.hodEmail || 'Not provided'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Department Phone</label>
                        <span>${dept.phone || 'Not provided'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Department Email</label>
                        <span>${dept.email || 'Not provided'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Office Location</label>
                        <span>${dept.location || 'Not specified'}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-chart-bar"></i> Statistics</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Faculty Count</label>
                        <span>${dept.facultyCount || 0}</span>
                    </div>
                    <div class="detail-item">
                        <label>Student Capacity</label>
                        <span>${dept.studentCapacity || 0}</span>
                    </div>
                    <div class="detail-item">
                        <label>Current Students</label>
                        <span>${dept.currentStudents || 0}</span>
                    </div>
                    <div class="detail-item">
                        <label>Occupancy Rate</label>
                        <span>${dept.studentCapacity ? Math.round((dept.currentStudents || 0) / dept.studentCapacity * 100) : 0}%</span>
                    </div>
                </div>
            </div>
            
            ${deptLabs.length > 0 ? `
            <div class="detail-section">
                <h4><i class="fas fa-flask"></i> Laboratory Facilities</h4>
                <div class="labs-grid">
                    ${deptLabs.map(lab => `
                        <div class="lab-card">
                            <div class="lab-header">
                                <h5>${lab.name}</h5>
                                <span class="lab-type-badge">${lab.type}</span>
                            </div>
                            <div class="lab-details">
                                <div class="lab-detail-item">
                                    <label>Capacity</label>
                                    <span>${lab.capacity}</span>
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
                                    <label>Utilization</label>
                                    <span class="utilization-badge">${lab.utilization || 0}%</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('departmentDetailsTitle').textContent = `${dept.name} - Details`;
    document.getElementById('departmentDetailsContent').innerHTML = detailsHTML;
    openModal('departmentDetailsModal');
}

// Lab Management
function openLabManagementModal() {
    populateLabDepartmentFilter();
    renderLabs();
    openModal('labManagementModal');
}

function openAddLabModal() {
    editingLabId = null;
    document.getElementById('labModalTitle').textContent = 'Add New Laboratory';
    clearLabForm();
    populateLabDepartmentSelect();
    openModal('addLabModal');
}

function renderLabs() {
    const container = document.getElementById('labsGrid');
    const emptyState = document.getElementById('emptyLabState');
    
    if (!container) return;
    
    if (labs.length === 0) {
        container.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    
    container.innerHTML = labs.map(lab => `
        <div class="lab-card">
            <div class="lab-header">
                <h5>${lab.name}</h5>
                <span class="lab-type-badge">${lab.type}</span>
            </div>
            <div class="lab-details">
                <div class="lab-detail-item">
                    <label>Department</label>
                    <span>${lab.department}</span>
                </div>
                <div class="lab-detail-item">
                    <label>Capacity</label>
                    <span>${lab.capacity}</span>
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
                    <label>Utilization</label>
                    <span class="utilization-badge">${lab.utilization || 0}%</span>
                </div>
                <div class="lab-detail-item">
                    <label>Status</label>
                    <span class="status-badge status-${lab.status}">${capitalizeFirst(lab.status)}</span>
                </div>
            </div>
            <div class="lab-actions">
                <button class="action-btn action-edit" onclick="editLab(${lab.id})">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="action-btn action-delete" onclick="deleteLab(${lab.id})">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function saveLab(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const labData = {
        name: formData.get('name'),
        type: formData.get('type'),
        department: formData.get('department'),
        capacity: parseInt(formData.get('capacity')) || 0,
        incharge: formData.get('incharge'),
        location: formData.get('location'),
        equipment: formData.get('equipment').split('\n').filter(item => item.trim()),
        software: formData.get('software').split('\n').filter(item => item.trim()),
        utilization: parseInt(formData.get('utilization')) || 0,
        status: formData.get('status')
    };
    
    // Validation
    if (!labData.name || !labData.type || !labData.department || !labData.capacity) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (editingLabId) {
        // Update existing lab
        const index = labs.findIndex(l => l.id === editingLabId);
        labs[index] = { ...labs[index], ...labData };
        showNotification('Laboratory updated successfully', 'success');
    } else {
        // Add new lab
        const newId = Math.max(...labs.map(l => l.id), 0) + 1;
        labs.push({ id: newId, ...labData });
        
        // Add to department's labs array
        const dept = departments.find(d => d.name === labData.department);
        if (dept) {
            if (!dept.labs) dept.labs = [];
            dept.labs.push(labData.name);
        }
        
        showNotification('Laboratory added successfully', 'success');
    }
    
    closeModal('addLabModal');
    renderLabs();
    renderDepartments();
    updateStatistics();
}

function editLab(id) {
    const lab = labs.find(l => l.id === id);
    if (!lab) return;
    
    editingLabId = id;
    document.getElementById('labModalTitle').textContent = 'Edit Laboratory';
    populateLabForm(lab);
    populateLabDepartmentSelect();
    openModal('addLabModal');
}

function deleteLab(id) {
    const lab = labs.find(l => l.id === id);
    if (!lab) return;
    
    if (confirm(`Are you sure you want to delete ${lab.name}? This action cannot be undone.`)) {
        labs = labs.filter(l => l.id !== id);
        
        // Remove from department's labs array
        const dept = departments.find(d => d.name === lab.department);
        if (dept && dept.labs) {
            dept.labs = dept.labs.filter(labName => labName !== lab.name);
        }
        
        renderLabs();
        renderDepartments();
        updateStatistics();
        showNotification('Laboratory deleted successfully', 'success');
    }
}

// Form Management
function clearDepartmentForm() {
    document.getElementById('departmentForm').reset();
}

function populateDepartmentForm(dept) {
    const fields = {
        'departmentName': dept.name,
        'departmentCode': dept.code,
        'departmentType': dept.type,
        'establishedYear': dept.establishedYear,
        'departmentDescription': dept.description,
        'hodName': dept.hodName,
        'hodEmail': dept.hodEmail,
        'departmentPhone': dept.phone,
        'departmentEmail': dept.email,
        'officeLocation': dept.location,
        'facultyCount': dept.facultyCount,
        'studentCapacity': dept.studentCapacity,
        'currentStudents': dept.currentStudents,
        'departmentStatus': dept.status
    };
    
    Object.entries(fields).forEach(([fieldId, value]) => {
        const field = document.getElementById(fieldId);
        if (field && value !== undefined && value !== null) {
            field.value = value;
        }
    });
}

function clearLabForm() {
    document.getElementById('labForm').reset();
}

function populateLabForm(lab) {
    const fields = {
        'labName': lab.name,
        'labType': lab.type,
        'labDepartment': lab.department,
        'labCapacity': lab.capacity,
        'labIncharge': lab.incharge,
        'labLocation': lab.location,
        'labEquipment': lab.equipment ? lab.equipment.join('\n') : '',
        'labSoftware': lab.software ? lab.software.join('\n') : '',
        'utilizationRate': lab.utilization,
        'labStatus': lab.status
    };
    
    Object.entries(fields).forEach(([fieldId, value]) => {
        const field = document.getElementById(fieldId);
        if (field && value !== undefined && value !== null) {
            field.value = value;
        }
    });
}

function populateDepartmentSelects() {
    const selects = [
        document.getElementById('labDepartment'),
        document.getElementById('labDepartmentFilter')
    ];
    
    selects.forEach(select => {
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Select Department</option>' +
                departments.map(dept => 
                    `<option value="${dept.name}">${dept.name}</option>`
                ).join('');
            select.value = currentValue;
        }
    });
}

function populateLabDepartmentSelect() {
    const select = document.getElementById('labDepartment');
    if (select) {
        select.innerHTML = '<option value="">Select Department</option>' +
            departments.map(dept => 
                `<option value="${dept.name}">${dept.name}</option>`
            ).join('');
    }
}

function populateLabDepartmentFilter() {
    const select = document.getElementById('labDepartmentFilter');
    if (select) {
        select.innerHTML = '<option value="">All Departments</option>' +
            departments.map(dept => 
                `<option value="${dept.name}">${dept.name}</option>`
            ).join('');
    }
}

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(modal => {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
}

// Bulk Operations
function bulkAction(action) {
    if (selectedDepartments.size === 0) {
        showNotification('No departments selected', 'warning');
        return;
    }
    
    const selectedDepts = departments.filter(d => selectedDepartments.has(d.id));
    const deptNames = selectedDepts.map(d => d.name).join(', ');
    
    let confirmMessage;
    let successMessage;
    
    switch(action) {
        case 'activate':
            confirmMessage = `Activate ${selectedDepartments.size} department(s)?`;
            successMessage = 'Departments activated successfully';
            break;
        case 'deactivate':
            confirmMessage = `Deactivate ${selectedDepartments.size} department(s)?`;
            successMessage = 'Departments deactivated successfully';
            break;
        default:
            return;
    }
    
    if (confirm(confirmMessage)) {
        selectedDepts.forEach(dept => {
            const index = departments.findIndex(d => d.id === dept.id);
            departments[index].status = action === 'activate' ? 'active' : 'inactive';
        });
        
        selectedDepartments.clear();
        renderDepartments();
        updateStatistics();
        showNotification(successMessage, 'success');
    }
}

function exportSelected() {
    if (selectedDepartments.size === 0) {
        showNotification('No departments selected for export', 'warning');
        return;
    }
    
    const selectedDepts = departments.filter(d => selectedDepartments.has(d.id));
    exportDepartmentsData(selectedDepts);
}

// Import/Export Functions
function exportDepartments() {
    exportDepartmentsData(departments);
}

function exportDepartmentsData(data) {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `departments_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Departments exported successfully', 'success');
    }
}

function convertToCSV(data) {
    const headers = [
        'Name', 'Code', 'Type', 'HOD Name', 'HOD Email', 'Phone', 'Email', 
        'Location', 'Faculty Count', 'Student Capacity', 'Current Students', 
        'Established Year', 'Status', 'Description'
    ];
    
    const csvRows = [headers.join(',')];
    
    data.forEach(dept => {
        const row = [
            dept.name || '',
            dept.code || '',
            dept.type || '',
            dept.hodName || '',
            dept.hodEmail || '',
            dept.phone || '',
            dept.email || '',
            dept.location || '',
            dept.facultyCount || 0,
            dept.studentCapacity || 0,
            dept.currentStudents || 0,
            dept.establishedYear || '',
            dept.status || '',
            (dept.description || '').replace(/,/g, ';')
        ];
        csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
}

function importDepartments() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = handleFileImport;
    input.click();
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const importedDepts = parseCSV(csv);
            
            if (importedDepts.length > 0) {
                departments.push(...importedDepts);
                filteredDepartments = [...departments];
                renderDepartments();
                updateStatistics();
                showNotification(`${importedDepts.length} departments imported successfully`, 'success');
            }
        } catch (error) {
            showNotification('Error importing file. Please check the format.', 'error');
        }
    };
    reader.readAsText(file);
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',');
            const dept = {
                id: Math.max(...departments.map(d => d.id), 0) + i,
                name: values[0],
                code: values[1],
                type: values[2],
                hodName: values[3],
                hodEmail: values[4],
                phone: values[5],
                email: values[6],
                location: values[7],
                facultyCount: parseInt(values[8]) || 0,
                studentCapacity: parseInt(values[9]) || 0,
                currentStudents: parseInt(values[10]) || 0,
                establishedYear: parseInt(values[11]) || null,
                status: values[12] || 'active',
                description: values[13] || '',
                labs: []
            };
            result.push(dept);
        }
    }
    
    return result;
}

// Utility Functions
function updateEmptyState() {
    const emptyState = document.getElementById('emptyState');
    if (emptyState) {
        emptyState.style.display = filteredDepartments.length === 0 ? 'block' : 'none';
    }
}

function refreshDepartments() {
    // Simulate data refresh
    showNotification('Departments refreshed successfully', 'success');
    renderDepartments();
    updateStatistics();
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    const icon = document.getElementById('notificationIcon');
    
    if (!notification || !text || !icon) return;
    
    // Set icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    icon.className = icons[type] || icons.info;
    text.textContent = message;
    notification.className = `notification ${type} show`;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
}

function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// User Management
function loadUserInfo() {
    // Simulate loading user info
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = 'Dr. Admin Kumar';
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear local storage
        localStorage.removeItem('theme');
        localStorage.removeItem('departmentView');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

// Navigation
function setActiveNavigation() {
    // Set current page as active in navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.parentElement.classList.add('active');
        }
    });
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(event) {
    // Ctrl + N: Add new department
    if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        openAddDepartmentModal();
    }
    
    // Ctrl + F: Focus search
    if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
    }
    
    // Ctrl + L: Open lab management
    if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        openLabManagementModal();
    }
    
    // Ctrl + R: Refresh
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        refreshDepartments();
    }
}

// Search Labs
function searchLabs() {
    const query = document.getElementById('labSearchInput').value.toLowerCase().trim();
    
    if (!query) {
        renderLabs();
        return;
    }
    
    const filteredLabs = labs.filter(lab => 
        lab.name.toLowerCase().includes(query) ||
        lab.type.toLowerCase().includes(query) ||
        lab.department.toLowerCase().includes(query) ||
        (lab.incharge && lab.incharge.toLowerCase().includes(query))
    );
    
    renderFilteredLabs(filteredLabs);
}

function renderFilteredLabs(filteredLabs) {
    const container = document.getElementById('labsGrid');
    const emptyState = document.getElementById('emptyLabState');
    
    if (!container) return;
    
    if (filteredLabs.length === 0) {
        container.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    
    container.innerHTML = filteredLabs.map(lab => `
        <div class="lab-card">
            <div class="lab-header">
                <h5>${lab.name}</h5>
                <span class="lab-type-badge">${lab.type}</span>
            </div>
            <div class="lab-details">
                <div class="lab-detail-item">
                    <label>Department</label>
                    <span>${lab.department}</span>
                </div>
                <div class="lab-detail-item">
                    <label>Capacity</label>
                    <span>${lab.capacity}</span>
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
                    <label>Utilization</label>
                    <span class="utilization-badge">${lab.utilization || 0}%</span>
                </div>
                <div class="lab-detail-item">
                    <label>Status</label>
                    <span class="status-badge status-${lab.status}">${capitalizeFirst(lab.status)}</span>
                </div>
            </div>
            <div class="lab-actions">
                <button class="action-btn action-edit" onclick="editLab(${lab.id})">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="action-btn action-delete" onclick="deleteLab(${lab.id})">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Filter Labs
function filterLabsByDepartment() {
    const departmentFilter = document.getElementById('labDepartmentFilter').value;
    const typeFilter = document.getElementById('labTypeFilter').value;
    
    let filteredLabs = [...labs];
    
    if (departmentFilter) {
        filteredLabs = filteredLabs.filter(lab => lab.department === departmentFilter);
    }
    
    if (typeFilter) {
        filteredLabs = filteredLabs.filter(lab => lab.type === typeFilter);
    }
    
    renderFilteredLabs(filteredLabs);
}

function filterLabsByType() {
    filterLabsByDepartment(); // Reuse the same logic
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
