// Global Variables
let currentDepartment = null;
let currentLab = null;
let departments = [];
let labs = [];
let currentView = 'table';
let selectedDepartments = [];
let filteredDepartments = [];

// Enhanced Media Query Detection
function handleResponsiveLayout() {
    const isMobile = window.matchMedia('(max-width: 768px)');
    const isTablet = window.matchMedia('(max-width: 1024px)');
    
    function handleMobileChange(e) {
        if (e.matches) {
            console.log('📱 Mobile layout activated');
            document.body.classList.add('mobile-active');
        } else {
            console.log('💻 Desktop layout activated');
            document.body.classList.remove('mobile-active');
            closeMobileSidebar(); // Auto-close sidebar
        }
    }
    
    function handleTabletChange(e) {
        if (e.matches) {
            console.log('📱 Tablet layout activated');
            document.body.classList.add('tablet-active');
        } else {
            document.body.classList.remove('tablet-active');
        }
    }
    
    // Initial checks
    handleMobileChange(isMobile);
    handleTabletChange(isTablet);
    
    // Add listeners
    isMobile.addListener(handleMobileChange);
    isTablet.addListener(handleTabletChange);
}

// Theme Management - Dashboard Style
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

// Enhanced Mobile Sidebar - Dashboard Style
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    console.log('🔧 Sidebar toggle called'); // Debug log
    
    if (sidebar && overlay) {
        if (sidebar.classList.contains('active')) {
            // Close sidebar
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            console.log('📱 Sidebar closed');
        } else {
            // Open sidebar
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('📱 Sidebar opened');
        }
    } else {
        console.error('❌ Sidebar elements not found!');
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    console.log('🔧 Close mobile sidebar called');
    
    if (sidebar) {
        sidebar.classList.remove('active');
    }
    if (overlay) {
        overlay.classList.remove('active');
    }
    document.body.style.overflow = 'auto';
}

// Modal Management - Simple Dashboard Style
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log(`📋 Modal opened: ${modalId}`);
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
    document.body.style.overflow = 'auto';
    
    // Reset current objects
    currentDepartment = null;
    currentLab = null;
    console.log('📋 All modals closed');
}

// Debug function to check if elements exist
function checkElementsExist() {
    const elements = [
        'sidebar',
        'sidebarOverlay',
        'departmentsTableBody',
        'totalDepartments',
        'activeDepartments',
        'totalFaculty',
        'totalStudents'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`❌ Missing element: ${id}`);
        } else {
            console.log(`✅ Found element: ${id}`);
        }
    });
}

// Sample Data - Enhanced for Department Management
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
        description: "Leading department in computer science and technology education with state-of-the-art facilities.",
        labs: [
            {
                id: 1,
                name: "Programming Laboratory",
                type: "Computer Lab",
                capacity: 60,
                utilization: 85,
                incharge: "Prof. Smith Anderson",
                location: "Block A, Room 301",
                equipment: ["Desktop PCs - 60", "Projector - 2", "Whiteboard - 1"],
                software: ["Visual Studio", "IntelliJ IDEA", "MySQL"],
                status: "active"
            },
            {
                id: 2,
                name: "Data Structures Lab",
                type: "Computer Lab",
                capacity: 40,
                utilization: 78,
                incharge: "Prof. Johnson Lee",
                location: "Block A, Room 302",
                equipment: ["Desktop PCs - 40", "Projector - 1"],
                software: ["Dev C++", "Eclipse"],
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
        description: "Excellence in electronics and communication engineering with focus on innovation.",
        labs: [
            {
                id: 3,
                name: "Electronics Laboratory",
                type: "Electronics Lab",
                capacity: 50,
                utilization: 82,
                incharge: "Prof. Wilson Carter",
                location: "Block B, Room 201",
                equipment: ["Oscilloscopes - 25", "Function Generators - 25"],
                software: ["MATLAB", "Proteus"],
                status: "active"
            }
        ]
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
        description: "Traditional engineering discipline focusing on design and manufacturing.",
        labs: [
            {
                id: 4,
                name: "Manufacturing Workshop",
                type: "Workshop Lab",
                capacity: 30,
                utilization: 88,
                incharge: "Prof. Davis Miller",
                location: "Block C, Ground Floor",
                equipment: ["CNC Machines - 5", "Lathes - 8"],
                software: ["AutoCAD", "SolidWorks"],
                status: "active"
            }
        ]
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
        description: "Comprehensive business education preparing future leaders.",
        labs: [
            {
                id: 5,
                name: "Business Analytics Lab",
                type: "Computer Lab",
                capacity: 40,
                utilization: 68,
                incharge: "Prof. Robert Taylor",
                location: "Block D, Room 210",
                equipment: ["Business Computers - 40"],
                software: ["R Studio", "SPSS", "Tableau"],
                status: "active"
            }
        ]
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
        description: "Rich tradition in literary studies and language education.",
        labs: [
            {
                id: 6,
                name: "Language Laboratory",
                type: "Language Lab",
                capacity: 45,
                utilization: 65,
                incharge: "Prof. Anderson Clark",
                location: "Block E, Room 101",
                equipment: ["Audio Systems - 45", "Headphones - 45"],
                software: ["Rosetta Stone", "Language Pro"],
                status: "active"
            }
        ]
    }
];

// Initialize Application
function initializeApp() {
    console.log('🚀 Initializing Department Management App...');
    
    // Debug check
    checkElementsExist();
    
    initializeTheme();
    handleResponsiveLayout();
    initializeDepartments();
    setupEventListeners();
    loadUserInfo();
    
    console.log('✅ App initialized successfully!');
}

function loadUserInfo() {
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = 'Admin User';
    }
}

function initializeDepartments() {
    departments = [...sampleDepartments];
    
    // Extract labs into separate array
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
    
    console.log(`📊 Loaded ${departments.length} departments with ${labs.length} labs`);
}

// Statistics Update
function updateStatistics() {
    const totalDepts = departments.length;
    const activeDepts = departments.filter(d => d.status === 'active').length;
    const totalFaculty = departments.reduce((sum, d) => sum + (d.facultyCount || 0), 0);
    const totalStudents = departments.reduce((sum, d) => sum + (d.currentStudents || 0), 0);
    
    // Safely update DOM elements
    const elements = {
        totalDepartments: totalDepts,
        activeDepartments: activeDepts,
        totalFaculty: totalFaculty,
        totalStudents: totalStudents.toLocaleString()
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// Department Display Management
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
                    <div style="text-align: center; padding: 40px;">
                        <i class="fas fa-search" style="font-size: 3rem; color: var(--text-tertiary); margin-bottom: 20px;"></i>
                        <h3>No departments found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    filteredDepartments.forEach(dept => {
        const row = createDepartmentRow(dept);
        tbody.appendChild(row);
    });
    
    console.log(`📋 Table loaded with ${filteredDepartments.length} departments`);
}

function createDepartmentRow(dept) {
    const row = document.createElement('tr');
    const labCount = dept.labs ? dept.labs.length : 0;
    const occupancyRate = dept.studentCapacity > 0 ? 
        Math.round((dept.currentStudents / dept.studentCapacity) * 100) : 0;
    
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
                <small style="color: var(--text-secondary);">${dept.hodEmail}</small>
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
                <button class="action-btn action-view" onclick="viewDepartment(${dept.id})" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn action-edit" onclick="editDepartment(${dept.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn action-delete" onclick="deleteDepartment(${dept.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
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
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    filteredDepartments.forEach(dept => {
        const card = createDepartmentCard(dept);
        container.appendChild(card);
    });
    
    console.log(`🎯 Card view loaded with ${filteredDepartments.length} departments`);
}

function createDepartmentCard(dept) {
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
                <button class="action-btn action-view" onclick="viewDepartment(${dept.id})" title="View Details">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn action-edit" onclick="editDepartment(${dept.id})" title="Edit">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn action-delete" onclick="deleteDepartment(${dept.id})" title="Delete">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// View Management
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
    
    console.log(`👁️ View switched to: ${view}`);
}

// CRUD Operations
function openAddDepartmentModal() {
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        modalTitle.textContent = 'Add New Department';
    }
    
    currentDepartment = null;
    
    // Reset form
    const form = document.getElementById('departmentForm');
    if (form) form.reset();
    
    openModal('departmentModal');
}

function editDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    
    currentDepartment = dept;
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        modalTitle.textContent = 'Edit Department';
    }
    
    // Safely populate form fields
    const fields = {
        departmentName: dept.name || '',
        departmentCode: dept.code || '',
        departmentType: dept.type || '',
        establishedYear: dept.establishedYear || '',
        departmentDescription: dept.description || '',
        hodName: dept.hod || '',
        hodEmail: dept.hodEmail || '',
        departmentPhone: dept.phone || '',
        departmentEmail: dept.email || '',
        officeLocation: dept.location || '',
        facultyCount: dept.facultyCount || '',
        studentCapacity: dept.studentCapacity || '',
        currentStudents: dept.currentStudents || '',
        departmentStatus: dept.status || 'active'
    };
    
    Object.entries(fields).forEach(([fieldId, value]) => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = value;
        }
    });
    
    openModal('departmentModal');
    console.log(`✏️ Editing department: ${dept.name}`);
}

function viewDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    
    const detailsTitle = document.getElementById('departmentDetailsTitle');
    if (detailsTitle) {
        detailsTitle.textContent = `${dept.name} - Details`;
    }
    
    const content = createDepartmentDetailsView(dept);
    const detailsContent = document.getElementById('departmentDetailsContent');
    if (detailsContent) {
        detailsContent.innerHTML = content;
    }
    
    openModal('departmentDetailsModal');
    console.log(`👁️ Viewing department: ${dept.name}`);
}

function createDepartmentDetailsView(dept) {
    const labsHTML = dept.labs && dept.labs.length > 0 ? 
        dept.labs.map(lab => `
            <div class="lab-card">
                <div class="lab-header">
                    <h5>${lab.name}</h5>
                    <span class="lab-type-badge">${lab.type}</span>
                </div>
                <div class="lab-details">
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
                </div>
            </div>
        `).join('') : 
        '<div class="empty-state"><i class="fas fa-flask" style="font-size: 2rem;"></i><p>No laboratories assigned</p></div>';
    
    const occupancyRate = dept.studentCapacity > 0 ? 
        Math.round((dept.currentStudents / dept.studentCapacity) * 100) : 0;
    
    return `
        <div style="max-height: 70vh; overflow-y: auto;">
            <div class="form-section">
                <h4><i class="fas fa-info-circle"></i> Basic Information</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div><label>Department Name</label><span>${dept.name}</span></div>
                    <div><label>Code</label><span>${dept.code}</span></div>
                    <div><label>Type</label><span>${dept.type}</span></div>
                    <div><label>Established</label><span>${dept.establishedYear}</span></div>
                    <div><label>Status</label><span class="status-badge status-${dept.status}">${formatStatus(dept.status)}</span></div>
                    <div><label>Location</label><span>${dept.location}</span></div>
                </div>
                <div style="margin-top: 15px;"><label>Description</label><span>${dept.description || 'No description'}</span></div>
            </div>
            
            <div class="form-section">
                <h4><i class="fas fa-user-tie"></i> Leadership & Contact</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div><label>Head of Department</label><span>${dept.hod}</span></div>
                    <div><label>HOD Email</label><span>${dept.hodEmail}</span></div>
                    <div><label>Department Phone</label><span>${dept.phone}</span></div>
                    <div><label>Department Email</label><span>${dept.email}</span></div>
                </div>
            </div>
            
            <div class="form-section">
                <h4><i class="fas fa-chart-bar"></i> Statistics</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div><label>Faculty Count</label><span>${dept.facultyCount}</span></div>
                    <div><label>Student Capacity</label><span>${dept.studentCapacity}</span></div>
                    <div><label>Current Students</label><span>${dept.currentStudents}</span></div>
                    <div><label>Occupancy Rate</label><span>${occupancyRate}%</span></div>
                </div>
            </div>
            
            <div class="form-section">
                <h4><i class="fas fa-flask"></i> Laboratory Facilities</h4>
                <div class="labs-grid">${labsHTML}</div>
            </div>
        </div>
    `;
}

function deleteDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    
    if (confirm(`Are you sure you want to delete "${dept.name}"? This action cannot be undone.`)) {
        departments = departments.filter(d => d.id !== id);
        filteredDepartments = filteredDepartments.filter(d => d.id !== id);
        
        // Remove associated labs
        labs = labs.filter(lab => lab.departmentId !== id);
        
        // Remove from selected
        selectedDepartments = selectedDepartments.filter(sid => sid !== id);
        
        loadDepartments();
        updateStatistics();
        showNotification('Department deleted successfully!', 'success');
        console.log(`🗑️ Department deleted: ${dept.name}`);
    }
}

function saveDepartment(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('departmentName')?.value?.trim() || '',
        code: document.getElementById('departmentCode')?.value?.trim()?.toUpperCase() || '',
        type: document.getElementById('departmentType')?.value || '',
        establishedYear: parseInt(document.getElementById('establishedYear')?.value) || new Date().getFullYear(),
        description: document.getElementById('departmentDescription')?.value?.trim() || '',
        hod: document.getElementById('hodName')?.value?.trim() || '',
        hodEmail: document.getElementById('hodEmail')?.value?.trim() || '',
        phone: document.getElementById('departmentPhone')?.value?.trim() || '',
        email: document.getElementById('departmentEmail')?.value?.trim() || '',
        location: document.getElementById('officeLocation')?.value?.trim() || '',
        facultyCount: parseInt(document.getElementById('facultyCount')?.value) || 0,
        studentCapacity: parseInt(document.getElementById('studentCapacity')?.value) || 0,
        currentStudents: parseInt(document.getElementById('currentStudents')?.value) || 0,
        status: document.getElementById('departmentStatus')?.value || 'active'
    };
    
    if (!formData.name || !formData.code || !formData.type) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (currentDepartment) {
        // Update existing
        Object.assign(currentDepartment, formData);
        const index = departments.findIndex(d => d.id === currentDepartment.id);
        if (index !== -1) {
            departments[index] = currentDepartment;
        }
        showNotification('Department updated successfully!', 'success');
        console.log(`✅ Department updated: ${formData.name}`);
    } else {
        // Add new
        formData.id = Math.max(...departments.map(d => d.id), 0) + 1;
        formData.labs = [];
        departments.push(formData);
        showNotification('Department added successfully!', 'success');
        console.log(`✅ Department added: ${formData.name}`);
    }
    
    applyFilters();
    loadDepartments();
    updateStatistics();
    closeModal();
}

// Search and Filter Functions
function searchDepartments() {
    const searchTerm = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    applyFilters(searchTerm);
    console.log(`🔍 Searching departments: "${searchTerm}"`);
}

function filterDepartments() {
    applyFilters();
    console.log('🔍 Applying department filters');
}

function applyFilters(searchTerm = null) {
    if (searchTerm === null) {
        searchTerm = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    }
    
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    const labFilter = document.getElementById('labFilter')?.value || '';
    
    filteredDepartments = departments.filter(dept => {
        const matchesSearch = !searchTerm || 
            dept.name.toLowerCase().includes(searchTerm) ||
            dept.code.toLowerCase().includes(searchTerm) ||
            dept.hod.toLowerCase().includes(searchTerm) ||
            dept.type.toLowerCase().includes(searchTerm);
        
        const matchesStatus = !statusFilter || dept.status === statusFilter;
        const matchesType = !typeFilter || dept.type === typeFilter;
        
        let matchesLab = true;
        if (labFilter) {
            const labCount = dept.labs ? dept.labs.length : 0;
            switch (labFilter) {
                case 'has-labs': matchesLab = labCount > 0; break;
                case 'no-labs': matchesLab = labCount === 0; break;
                case 'high-utilization': 
                    matchesLab = labCount > 0 && dept.labs.some(lab => lab.utilization > 80);
                    break;
                case 'low-utilization':
                    matchesLab = labCount > 0 && dept.labs.some(lab => lab.utilization < 60);
                    break;
            }
        }
        
        return matchesSearch && matchesStatus && matchesType && matchesLab;
    });
    
    loadDepartments();
    console.log(`📊 Filtered results: ${filteredDepartments.length} departments`);
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
            if (index > -1) {
                selectedDepartments.splice(index, 1);
            }
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

// Bulk Operations
function bulkAction(action) {
    if (selectedDepartments.length === 0) {
        showNotification('Please select departments first', 'error');
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
    console.log(`🔄 Bulk action performed: ${action}`);
}

// Lab Management
function openLabManagementModal() {
    populateLabDepartmentFilter();
    loadLabManagement();
    openModal('labManagementModal');
}

function openAddLabModal() {
    const labModalTitle = document.getElementById('labModalTitle');
    if (labModalTitle) {
        labModalTitle.textContent = 'Add New Laboratory';
    }
    
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
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-flask" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <h3>No laboratories found</h3>
                <p>Add some laboratories to get started</p>
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
    const labModalTitle = document.getElementById('labModalTitle');
    if (labModalTitle) {
        labModalTitle.textContent = 'Edit Laboratory';
    }
    
    const fields = {
        labName: lab.name || '',
        labType: lab.type || '',
        labDepartment: lab.departmentId || '',
        labCapacity: lab.capacity || '',
        labIncharge: lab.incharge || '',
        labLocation: lab.location || '',
        labEquipment: lab.equipment ? lab.equipment.join('\n') : '',
        labSoftware: lab.software ? lab.software.join('\n') : '',
        utilizationRate: lab.utilization || '',
        labStatus: lab.status || 'active'
    };
    
    Object.entries(fields).forEach(([fieldId, value]) => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = value;
        }
    });
    
    populateDepartmentOptions();
    openModal('addLabModal');
    console.log(`✏️ Editing lab: ${lab.name}`);
}

function deleteLab(id) {
    const lab = labs.find(l => l.id === id);
    if (!lab) return;
    
    if (confirm(`Are you sure you want to delete "${lab.name}"?`)) {
        labs = labs.filter(l => l.id !== id);
        
        const dept = departments.find(d => d.id === lab.departmentId);
        if (dept && dept.labs) {
            dept.labs = dept.labs.filter(l => l.id !== id);
        }
        
        loadLabManagement();
        showNotification('Laboratory deleted successfully!', 'success');
        console.log(`🗑️ Lab deleted: ${lab.name}`);
    }
}

function saveLab(event) {
    event.preventDefault();
    
    const departmentId = parseInt(document.getElementById('labDepartment')?.value);
    const department = departments.find(d => d.id === departmentId);
    
    if (!department) {
        showNotification('Please select a valid department', 'error');
        return;
    }
    
    const formData = {
        name: document.getElementById('labName')?.value?.trim() || '',
        type: document.getElementById('labType')?.value || '',
        departmentId: departmentId,
        departmentName: department.name,
        capacity: parseInt(document.getElementById('labCapacity')?.value) || 0,
        incharge: document.getElementById('labIncharge')?.value?.trim() || '',
        location: document.getElementById('labLocation')?.value?.trim() || '',
        equipment: document.getElementById('labEquipment')?.value?.split('\n')?.filter(item => item.trim()) || [],
        software: document.getElementById('labSoftware')?.value?.split('\n')?.filter(item => item.trim()) || [],
        utilization: parseInt(document.getElementById('utilizationRate')?.value) || 0,
        status: document.getElementById('labStatus')?.value || 'active'
    };
    
    if (!formData.name || !formData.type || !formData.capacity) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (currentLab) {
        Object.assign(currentLab, formData);
        if (department.labs) {
            const labIndex = department.labs.findIndex(l => l.id === currentLab.id);
            if (labIndex !== -1) {
                department.labs[labIndex] = {...currentLab};
            }
        }
        showNotification('Laboratory updated successfully!', 'success');
        console.log(`✅ Lab updated: ${formData.name}`);
    } else {
        formData.id = Math.max(...labs.map(l => l.id), 0) + 1;
        labs.push(formData);
        
        if (!department.labs) department.labs = [];
        department.labs.push({...formData});
        
        showNotification('Laboratory added successfully!', 'success');
        console.log(`✅ Lab added: ${formData.name}`);
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
    showNotification('Data refreshed successfully!', 'info');
    console.log('🔄 Data refreshed');
}

function exportDepartments() {
    const data = departments.map(dept => ({
        'Name': dept.name,
        'Code': dept.code,
        'Type': dept.type,
        'HOD': dept.hod,
        'Faculty': dept.facultyCount,
        'Students': dept.currentStudents,
        'Labs': dept.labs ? dept.labs.length : 0,
        'Status': formatStatus(dept.status)
    }));
    
    exportToCSV(data, 'departments.csv');
    showNotification('Departments exported successfully!', 'success');
    console.log('📤 Departments exported');
}

function exportSelected() {
    if (selectedDepartments.length === 0) {
        showNotification('Please select departments to export', 'error');
        return;
    }
    
    const selectedDepts = departments.filter(d => selectedDepartments.includes(d.id));
    const data = selectedDepts.map(dept => ({
        'Name': dept.name,
        'Code': dept.code,
        'Type': dept.type,
        'Status': formatStatus(dept.status)
    }));
    
    exportToCSV(data, 'selected_departments.csv');
    showNotification(`${selectedDepts.length} departments exported!`, 'success');
    console.log(`📤 Selected departments exported: ${selectedDepts.length}`);
}

function exportToCSV(data, filename) {
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function importDepartments() {
    showNotification('Import functionality coming soon!', 'info');
    console.log('📥 Import requested (not implemented)');
}

// Enhanced Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) {
        console.warn('Notification elements not found');
        return;
    }
    
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
    
    console.log(`🔔 Notification: ${type} - ${message}`);
}

// Helper Functions
function formatStatus(status) {
    return status.replace('-', ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = 'login.html';
        console.log('👋 User logged out');
    }
}

// Lab Search Functions (placeholders)
function searchLabs() {
    loadLabManagement();
    console.log('🔍 Lab search triggered');
}

function filterLabsByDepartment() {
    loadLabManagement();
    console.log('🔍 Lab department filter applied');
}

function filterLabsByType() {
    loadLabManagement();
    console.log('🔍 Lab type filter applied');
}

// Enhanced Event Listeners Setup
function setupEventListeners() {
    console.log('🎧 Setting up event listeners...');
    
    // Window resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768) {
                closeMobileSidebar();
            }
            console.log(`📱 Window resized: ${window.innerWidth}px`);
        }, 250);
    });
    
    // Orientation change handler
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            if (window.innerWidth > 768) {
                closeMobileSidebar();
            }
            console.log('🔄 Orientation changed');
        }, 100);
    });
    
    // Close sidebar when clicking links (mobile)
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
    
    // Escape key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const hasActiveModal = document.querySelector('.modal.show');
            const hasActiveSidebar = document.querySelector('.sidebar.active');
            
            if (hasActiveModal) {
                closeModal();
                console.log('⌨️ Modal closed via ESC key');
            } else if (hasActiveSidebar) {
                closeMobileSidebar();
                console.log('⌨️ Sidebar closed via ESC key');
            }
        }
    });
    
    console.log('✅ Event listeners setup complete');
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM Content Loaded - Starting app...');
    initializeApp();
});

// Additional error handling
window.addEventListener('error', function(e) {
    console.error('❌ JavaScript error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// Performance monitoring (optional)
window.addEventListener('load', function() {
    console.log('⚡ Page fully loaded');
});
