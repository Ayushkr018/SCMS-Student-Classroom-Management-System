// Global Variables
let currentDepartment = null;
let currentLab = null;
let departments = [];
let labs = [];
let currentView = 'table';
let selectedDepartments = [];
let filteredDepartments = [];
let isLoading = false;

// Theme Management - Enhanced for Mobile
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('scms-theme', newTheme);
    
    updateThemeIcons(newTheme);
    showNotification(`Switched to ${newTheme} mode`, 'info');
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

// Mobile Sidebar Management - Enhanced
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (sidebar && overlay) {
        const isActive = sidebar.classList.contains('active');
        
        if (isActive) {
            closeMobileSidebar();
        } else {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Animate menu button
            if (menuBtn) {
                menuBtn.innerHTML = '<i class="fas fa-times"></i>';
            }
        }
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset menu button
    if (menuBtn) {
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

// Loading States
function showLoading() {
    isLoading = true;
    const loadingElements = document.querySelectorAll('[data-loading]');
    loadingElements.forEach(el => {
        el.classList.add('loading');
        el.innerHTML = '<div class="spinner"></div> Loading...';
    });
}

function hideLoading() {
    isLoading = false;
    const loadingElements = document.querySelectorAll('[data-loading]');
    loadingElements.forEach(el => {
        el.classList.remove('loading');
    });
}

// Modal Management - Mobile Optimized
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const firstInput = modal.querySelector('input, textarea, select, button');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
        
        // Add animation class
        setTimeout(() => {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'scale(1)';
                modalContent.style.opacity = '1';
            }
        }, 10);
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'scale(0.95)';
            modalContent.style.opacity = '0';
        }
        
        setTimeout(() => {
            modal.classList.remove('show');
        }, 200);
    });
    
    document.body.style.overflow = 'auto';
    
    // Reset current objects
    currentDepartment = null;
    currentLab = null;
}

// Enhanced Sample Data
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

// Initialize Application - Enhanced
function initializeApp() {
    showLoading();
    
    try {
        initializeTheme();
        initializeDepartments();
        setupEventListeners();
        loadUserInfo();
        setupPullToRefresh();
        
        // Simulate loading time
        setTimeout(() => {
            hideLoading();
            showNotification('Dashboard loaded successfully!', 'success');
        }, 1000);
        
    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('Failed to load dashboard', 'error');
        hideLoading();
    }
}

function loadUserInfo() {
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    
    if (userName) {
        userName.textContent = localStorage.getItem('userName') || 'Admin User';
    }
    
    if (userRole) {
        userRole.textContent = localStorage.getItem('userRole') || 'System Administrator';
    }
}

// Department Initialization - Enhanced
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
    updateFilters();
}

// Statistics Update - Enhanced
function updateStatistics() {
    const totalDepts = departments.length;
    const activeDepts = departments.filter(d => d.status === 'active').length;
    const totalFaculty = departments.reduce((sum, d) => sum + (d.facultyCount || 0), 0);
    const totalStudents = departments.reduce((sum, d) => sum + (d.currentStudents || 0), 0);
    const totalLabs = labs.length;
    const avgUtilization = labs.length > 0 ? 
        Math.round(labs.reduce((sum, lab) => sum + lab.utilization, 0) / labs.length) : 0;
    
    // Animate number updates
    animateNumber('totalDepartments', totalDepts);
    animateNumber('activeDepartments', activeDepts);
    animateNumber('totalFaculty', totalFaculty);
    animateNumber('totalStudents', totalStudents);
    animateNumber('totalLabs', totalLabs);
    animateNumber('avgUtilization', avgUtilization);
}

function animateNumber(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = parseInt(element.textContent) || 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.round(startValue + (targetValue - startValue) * progress);
        element.textContent = elementId === 'totalStudents' ? 
            currentValue.toLocaleString() : currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Department Display Management - Mobile Optimized
function loadDepartments() {
    if (currentView === 'table') {
        loadDepartmentsTable();
    } else {
        loadDepartmentsCards();
    }
    updateSelectedCount();
    updatePagination();
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
                        <button class="btn btn-primary" onclick="clearFilters()" style="margin-top: 15px;">
                            <i class="fas fa-refresh"></i> Clear Filters
                        </button>
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
            <div class="student-info">
                <span class="count-badge">${dept.currentStudents}/${dept.studentCapacity}</span>
                <div class="occupancy-bar">
                    <div class="occupancy-fill" style="width: ${occupancyRate}%"></div>
                </div>
                <small>${occupancyRate}% occupied</small>
            </div>
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
    
    // Add hover effects
    row.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'var(--bg-tertiary)';
    });
    
    row.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '';
    });
    
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
                <button class="btn btn-primary" onclick="clearFilters()" style="margin-top: 15px;">
                    <i class="fas fa-refresh"></i> Clear Filters
                </button>
            </div>
        `;
        return;
    }
    
    // Add stagger animation
    filteredDepartments.forEach((dept, index) => {
        setTimeout(() => {
            const card = createDepartmentCard(dept);
            container.appendChild(card);
            
            // Animate card entrance
            requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, index * 100);
    });
}

function createDepartmentCard(dept) {
    const labCount = dept.labs ? dept.labs.length : 0;
    const occupancyRate = dept.studentCapacity > 0 ? 
        Math.round((dept.currentStudents / dept.studentCapacity) * 100) : 0;
    
    const card = document.createElement('div');
    card.className = `department-card ${dept.type.toLowerCase()}`;
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.3s ease';
    
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
                    <div class="occupancy-info">
                        <span class="info-value">${occupancyRate}%</span>
                        <div class="mini-progress-bar">
                            <div class="mini-progress-fill" style="width: ${occupancyRate}%"></div>
                        </div>
                    </div>
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
    
    // Add touch events for mobile
    card.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    card.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    });
    
    return card;
}

// View Management - Enhanced
function switchView(view) {
    currentView = view;
    
    const cardBtn = document.getElementById('cardViewBtn');
    const tableBtn = document.getElementById('tableViewBtn');
    const cardContainer = document.getElementById('departmentsContainer');
    const tableContainer = document.getElementById('tableContainer');
    
    // Save view preference
    localStorage.setItem('preferredView', view);
    
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
    
    showNotification(`Switched to ${view} view`, 'info');
}

// CRUD Operations - Enhanced
function openAddDepartmentModal() {
    document.getElementById('modalTitle').textContent = 'Add New Department';
    currentDepartment = null;
    
    // Reset form with validation
    const form = document.getElementById('departmentForm');
    if (form) {
        form.reset();
        clearFormErrors();
    }
    
    openModal('departmentModal');
}

function editDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) {
        showNotification('Department not found', 'error');
        return;
    }
    
    currentDepartment = dept;
    document.getElementById('modalTitle').textContent = 'Edit Department';
    
    // Populate form with validation
    try {
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
        
        clearFormErrors();
        openModal('departmentModal');
        
    } catch (error) {
        console.error('Error populating form:', error);
        showNotification('Error loading department data', 'error');
    }
}

function viewDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) {
        showNotification('Department not found', 'error');
        return;
    }
    
    document.getElementById('departmentDetailsTitle').textContent = `${dept.name} - Details`;
    
    const content = createDepartmentDetailsView(dept);
    document.getElementById('departmentDetailsContent').innerHTML = content;
    
    openModal('departmentDetailsModal');
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
                        <div class="utilization-display">
                            <span class="utilization-badge">${lab.utilization}%</span>
                            <div class="utilization-bar">
                                <div class="utilization-fill" style="width: ${lab.utilization}%"></div>
                            </div>
                        </div>
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
                    ${lab.equipment && lab.equipment.length > 0 ? `
                        <div class="lab-detail-item">
                            <label>Equipment</label>
                            <div class="equipment-list">
                                ${lab.equipment.map(eq => `<span class="equipment-tag">${eq}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${lab.software && lab.software.length > 0 ? `
                        <div class="lab-detail-item">
                            <label>Software</label>
                            <div class="software-list">
                                ${lab.software.map(sw => `<span class="software-tag">${sw}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
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
                    <div><label>HOD Email</label><span><a href="mailto:${dept.hodEmail}">${dept.hodEmail}</a></span></div>
                    <div><label>Department Phone</label><span><a href="tel:${dept.phone}">${dept.phone}</a></span></div>
                    <div><label>Department Email</label><span><a href="mailto:${dept.email}">${dept.email}</a></span></div>
                </div>
            </div>
            
            <div class="form-section">
                <h4><i class="fas fa-chart-bar"></i> Statistics</h4>
                <div class="stats-grid-modal">
                    <div class="stat-card-modal">
                        <div class="stat-icon"><i class="fas fa-users"></i></div>
                        <div class="stat-info">
                            <div class="stat-number">${dept.facultyCount}</div>
                            <div class="stat-label">Faculty Members</div>
                        </div>
                    </div>
                    <div class="stat-card-modal">
                        <div class="stat-icon"><i class="fas fa-user-graduate"></i></div>
                        <div class="stat-info">
                            <div class="stat-number">${dept.studentCapacity}</div>
                            <div class="stat-label">Student Capacity</div>
                        </div>
                    </div>
                    <div class="stat-card-modal">
                        <div class="stat-icon"><i class="fas fa-graduation-cap"></i></div>
                        <div class="stat-info">
                            <div class="stat-number">${dept.currentStudents}</div>
                            <div class="stat-label">Current Students</div>
                        </div>
                    </div>
                    <div class="stat-card-modal">
                        <div class="stat-icon"><i class="fas fa-percentage"></i></div>
                        <div class="stat-info">
                            <div class="stat-number">${occupancyRate}%</div>
                            <div class="stat-label">Occupancy Rate</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="form-section">
                <h4><i class="fas fa-flask"></i> Laboratory Facilities (${dept.labs ? dept.labs.length : 0})</h4>
                <div class="labs-grid">${labsHTML}</div>
            </div>
        </div>
    `;
}

function deleteDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) {
        showNotification('Department not found', 'error');
        return;
    }
    
    // Enhanced confirmation with details
    const labCount = dept.labs ? dept.labs.length : 0;
    const confirmMessage = `Are you sure you want to delete "${dept.name}"?\n\n` +
                          `This will also delete:\n` +
                          `• ${labCount} associated laboratories\n` +
                          `• All department records\n\n` +
                          `This action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
        try {
            departments = departments.filter(d => d.id !== id);
            filteredDepartments = filteredDepartments.filter(d => d.id !== id);
            
            // Remove associated labs
            labs = labs.filter(lab => lab.departmentId !== id);
            
            // Remove from selected
            selectedDepartments = selectedDepartments.filter(sid => sid !== id);
            
            loadDepartments();
            updateStatistics();
            showNotification(`Department "${dept.name}" deleted successfully!`, 'success');
            
        } catch (error) {
            console.error('Error deleting department:', error);
            showNotification('Error deleting department', 'error');
        }
    }
}

function saveDepartment(event) {
    event.preventDefault();
    
    if (isLoading) return;
    
    showLoading();
    
    try {
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
        
        // Enhanced validation
        const validation = validateDepartmentForm(formData);
        if (!validation.isValid) {
            showFormErrors(validation.errors);
            hideLoading();
            return;
        }
        
        setTimeout(() => {
            if (currentDepartment) {
                // Update existing
                Object.assign(currentDepartment, formData);
                const index = departments.findIndex(d => d.id === currentDepartment.id);
                if (index !== -1) {
                    departments[index] = currentDepartment;
                }
                showNotification('Department updated successfully!', 'success');
            } else {
                // Add new
                formData.id = Math.max(...departments.map(d => d.id), 0) + 1;
                formData.labs = [];
                departments.push(formData);
                showNotification('Department added successfully!', 'success');
            }
            
            applyFilters();
            loadDepartments();
            updateStatistics();
            closeModal();
            hideLoading();
            
        }, 500); // Simulate processing time
        
    } catch (error) {
        console.error('Error saving department:', error);
        showNotification('Error saving department', 'error');
        hideLoading();
    }
}

// Form Validation
function validateDepartmentForm(data) {
    const errors = [];
    
    if (!data.name || data.name.length < 3) {
        errors.push({ field: 'departmentName', message: 'Department name must be at least 3 characters' });
    }
    
    if (!data.code || data.code.length < 2) {
        errors.push({ field: 'departmentCode', message: 'Department code is required' });
    }
    
    if (!data.type) {
        errors.push({ field: 'departmentType', message: 'Department type is required' });
    }
    
    if (data.hodEmail && !isValidEmail(data.hodEmail)) {
        errors.push({ field: 'hodEmail', message: 'Invalid email format' });
    }
    
    if (data.email && !isValidEmail(data.email)) {
        errors.push({ field: 'departmentEmail', message: 'Invalid email format' });
    }
    
    if (data.currentStudents > data.studentCapacity) {
        errors.push({ field: 'currentStudents', message: 'Current students cannot exceed capacity' });
    }
    
    // Check for duplicate codes (excluding current department)
    const existingDept = departments.find(d => 
        d.code === data.code && (!currentDepartment || d.id !== currentDepartment.id)
    );
    if (existingDept) {
        errors.push({ field: 'departmentCode', message: 'Department code already exists' });
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function showFormErrors(errors) {
    clearFormErrors();
    
    errors.forEach(error => {
        const field = document.getElementById(error.field);
        if (field) {
            field.classList.add('error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = error.message;
            field.parentNode.appendChild(errorDiv);
        }
    });
    
    showNotification('Please fix the form errors', 'error');
}

function clearFormErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Search and Filter Functions - Enhanced
function searchDepartments() {
    const searchTerm = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    
    // Debounced search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
        applyFilters(searchTerm);
    }, 300);
}

function filterDepartments() {
    applyFilters();
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
            dept.type.toLowerCase().includes(searchTerm) ||
            dept.location.toLowerCase().includes(searchTerm);
        
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
    updateFilterInfo();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('labFilter').value = '';
    
    filteredDepartments = [...departments];
    loadDepartments();
    showNotification('Filters cleared', 'info');
}

function updateFilterInfo() {
    const filterInfo = document.getElementById('filterInfo');
    if (filterInfo) {
        const total = departments.length;
        const filtered = filteredDepartments.length;
        
        if (filtered < total) {
            filterInfo.textContent = `Showing ${filtered} of ${total} departments`;
            filterInfo.style.display = 'block';
        } else {
            filterInfo.style.display = 'none';
        }
    }
}

function updateFilters() {
    // Update filter options based on current data
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    
    if (statusFilter) {
        const statuses = [...new Set(departments.map(d => d.status))];
        const currentValue = statusFilter.value;
        statusFilter.innerHTML = '<option value="">All Statuses</option>';
        statuses.forEach(status => {
            statusFilter.innerHTML += `<option value="${status}" ${status === currentValue ? 'selected' : ''}>${formatStatus(status)}</option>`;
        });
    }
    
    if (typeFilter) {
        const types = [...new Set(departments.map(d => d.type))];
        const currentValue = typeFilter.value;
        typeFilter.innerHTML = '<option value="">All Types</option>';
        types.forEach(type => {
            typeFilter.innerHTML += `<option value="${type}" ${type === currentValue ? 'selected' : ''}>${type}</option>`;
        });
    }
}

// Selection Management - Enhanced
function toggleDepartmentSelection(id) {
    const index = selectedDepartments.indexOf(id);
    if (index > -1) {
        selectedDepartments.splice(index, 1);
    } else {
        selectedDepartments.push(id);
    }
    updateSelectedCount();
    updateMasterCheckbox();
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

function updateMasterCheckbox() {
    const masterCheckbox = document.getElementById('selectAll');
    if (masterCheckbox && filteredDepartments.length > 0) {
        const selectedInFiltered = filteredDepartments.filter(d => selectedDepartments.includes(d.id)).length;
        
        if (selectedInFiltered === 0) {
            masterCheckbox.checked = false;
            masterCheckbox.indeterminate = false;
        } else if (selectedInFiltered === filteredDepartments.length) {
            masterCheckbox.checked = true;
            masterCheckbox.indeterminate = false;
        } else {
            masterCheckbox.checked = false;
            masterCheckbox.indeterminate = true;
        }
    }
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
    
    updateMasterCheckbox();
}

// Bulk Operations - Enhanced
function bulkAction(action) {
    if (selectedDepartments.length === 0) {
        showNotification('Please select departments first', 'error');
        return;
    }
    
    const selectedDepts = departments.filter(d => selectedDepartments.includes(d.id));
    
    let confirmMessage = '';
    switch (action) {
        case 'activate':
            confirmMessage = `Activate ${selectedDepts.length} selected departments?`;
            break;
        case 'deactivate':
            confirmMessage = `Deactivate ${selectedDepts.length} selected departments?`;
            break;
        case 'delete':
            confirmMessage = `Delete ${selectedDepts.length} selected departments?\n\nThis action cannot be undone.`;
            break;
    }
    
    if (confirm(confirmMessage)) {
        showLoading();
        
        setTimeout(() => {
            try {
                switch (action) {
                    case 'activate':
                        selectedDepts.forEach(dept => dept.status = 'active');
                        showNotification(`${selectedDepts.length} departments activated`, 'success');
                        break;
                    case 'deactivate':
                        selectedDepts.forEach(dept => dept.status = 'inactive');
                        showNotification(`${selectedDepts.length} departments deactivated`, 'success');
                        break;
                    case 'delete':
                        departments = departments.filter(d => !selectedDepartments.includes(d.id));
                        labs = labs.filter(lab => !selectedDepartments.includes(lab.departmentId));
                        showNotification(`${selectedDepts.length} departments deleted`, 'success');
                        break;
                }
                
                selectedDepartments = [];
                applyFilters();
                loadDepartments();
                updateStatistics();
                hideLoading();
                
            } catch (error) {
                console.error('Bulk operation error:', error);
                showNotification('Error performing bulk operation', 'error');
                hideLoading();
            }
        }, 500);
    }
}

// Pagination (placeholder for future implementation)
function updatePagination() {
    // Placeholder for pagination logic
    const paginationElement = document.getElementById('pagination');
    if (paginationElement && filteredDepartments.length > 10) {
        // Implementation for pagination
    }
}

// Pull to Refresh
function setupPullToRefresh() {
    let startY = 0;
    let currentY = 0;
    let pullDistance = 0;
    const threshold = 80;
    
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    mainContent.addEventListener('touchstart', (e) => {
        if (mainContent.scrollTop === 0) {
            startY = e.touches[0].clientY;
        }
    });
    
    mainContent.addEventListener('touchmove', (e) => {
        if (startY === 0) return;
        
        currentY = e.touches[0].clientY;
        pullDistance = currentY - startY;
        
        if (pullDistance > 0 && mainContent.scrollTop === 0) {
            e.preventDefault();
            
            const pullIndicator = document.getElementById('pullIndicator');
            if (pullIndicator) {
                pullIndicator.style.transform = `translateY(${Math.min(pullDistance, threshold)}px)`;
                pullIndicator.style.opacity = Math.min(pullDistance / threshold, 1);
                
                if (pullDistance >= threshold) {
                    pullIndicator.innerHTML = '<i class="fas fa-arrow-up"></i> Release to refresh';
                } else {
                    pullIndicator.innerHTML = '<i class="fas fa-arrow-down"></i> Pull to refresh';
                }
            }
        }
    });
    
    mainContent.addEventListener('touchend', () => {
        if (pullDistance >= threshold) {
            refreshDepartments();
        }
        
        const pullIndicator = document.getElementById('pullIndicator');
        if (pullIndicator) {
            pullIndicator.style.transform = 'translateY(-100%)';
            pullIndicator.style.opacity = '0';
        }
        
        startY = 0;
        currentY = 0;
        pullDistance = 0;
    });
}

// Lab Management - Enhanced (keeping existing functions but improving them)
function openLabManagementModal() {
    populateLabDepartmentFilter();
    loadLabManagement();
    openModal('labManagementModal');
}

function openAddLabModal() {
    document.getElementById('labModalTitle').textContent = 'Add New Laboratory';
    const form = document.getElementById('labForm');
    if (form) {
        form.reset();
        clearFormErrors();
    }
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
    
    // Apply lab filters
    let filteredLabs = [...labs];
    const deptFilter = document.getElementById('labDepartmentFilter')?.value;
    const typeFilter = document.getElementById('labTypeFilter')?.value;
    const searchTerm = document.getElementById('labSearchInput')?.value?.toLowerCase();
    
    if (deptFilter) {
        filteredLabs = filteredLabs.filter(lab => lab.departmentId == deptFilter);
    }
    
    if (typeFilter) {
        filteredLabs = filteredLabs.filter(lab => lab.type === typeFilter);
    }
    
    if (searchTerm) {
        filteredLabs = filteredLabs.filter(lab => 
            lab.name.toLowerCase().includes(searchTerm) ||
            lab.incharge.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filteredLabs.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-flask" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <h3>No laboratories found</h3>
                <p>Add some laboratories to get started</p>
                <button class="btn btn-primary" onclick="openAddLabModal()" style="margin-top: 15px;">
                    <i class="fas fa-plus"></i> Add Laboratory
                </button>
            </div>
        `;
        return;
    }
    
    filteredLabs.forEach((lab, index) => {
        setTimeout(() => {
            const card = createLabCard(lab);
            container.appendChild(card);
        }, index * 50);
    });
}

function createLabCard(lab) {
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
                <div class="utilization-display">
                    <span class="utilization-badge ${lab.utilization > 80 ? 'high' : lab.utilization < 60 ? 'low' : 'medium'}">${lab.utilization}%</span>
                    <div class="utilization-bar">
                        <div class="utilization-fill" style="width: ${lab.utilization}%"></div>
                    </div>
                </div>
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
            <button class="action-btn action-view" onclick="viewLab(${lab.id})" title="View Details">
                <i class="fas fa-eye"></i> View
            </button>
            <button class="action-btn action-edit" onclick="editLab(${lab.id})" title="Edit">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="action-btn action-delete" onclick="deleteLab(${lab.id})" title="Delete">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    return card;
}

function viewLab(id) {
    const lab = labs.find(l => l.id === id);
    if (!lab) {
        showNotification('Laboratory not found', 'error');
        return;
    }
    
    document.getElementById('labDetailsTitle').textContent = `${lab.name} - Details`;
    
    const content = `
        <div style="max-height: 70vh; overflow-y: auto;">
            <div class="form-section">
                <h4><i class="fas fa-info-circle"></i> Basic Information</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div><label>Name</label><span>${lab.name}</span></div>
                    <div><label>Type</label><span>${lab.type}</span></div>
                    <div><label>Department</label><span>${lab.departmentName}</span></div>
                    <div><label>Capacity</label><span>${lab.capacity} students</span></div>
                    <div><label>Location</label><span>${lab.location || 'Not specified'}</span></div>
                    <div><label>Status</label><span class="status-badge status-${lab.status}">${formatStatus(lab.status)}</span></div>
                </div>
            </div>
            
            <div class="form-section">
                <h4><i class="fas fa-user"></i> Management</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div><label>In-charge</label><span>${lab.incharge || 'Not assigned'}</span></div>
                    <div><label>Utilization</label>
                        <div class="utilization-display">
                            <span class="utilization-badge ${lab.utilization > 80 ? 'high' : lab.utilization < 60 ? 'low' : 'medium'}">${lab.utilization}%</span>
                            <div class="utilization-bar">
                                <div class="utilization-fill" style="width: ${lab.utilization}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            ${lab.equipment && lab.equipment.length > 0 ? `
                <div class="form-section">
                    <h4><i class="fas fa-tools"></i> Equipment</h4>
                    <div class="equipment-list">
                        ${lab.equipment.map(eq => `<span class="equipment-tag">${eq}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${lab.software && lab.software.length > 0 ? `
                <div class="form-section">
                    <h4><i class="fas fa-laptop-code"></i> Software</h4>
                    <div class="software-list">
                        ${lab.software.map(sw => `<span class="software-tag">${sw}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('labDetailsContent').innerHTML = content;
    openModal('labDetailsModal');
}

function editLab(id) {
    const lab = labs.find(l => l.id === id);
    if (!lab) {
        showNotification('Laboratory not found', 'error');
        return;
    }
    
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
    clearFormErrors();
    openModal('addLabModal');
}

function deleteLab(id) {
    const lab = labs.find(l => l.id === id);
    if (!lab) {
        showNotification('Laboratory not found', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete "${lab.name}"?\n\nThis action cannot be undone.`)) {
        try {
            labs = labs.filter(l => l.id !== id);
            
            const dept = departments.find(d => d.id === lab.departmentId);
            if (dept && dept.labs) {
                dept.labs = dept.labs.filter(l => l.id !== id);
            }
            
            loadLabManagement();
            updateStatistics();
            showNotification('Laboratory deleted successfully!', 'success');
            
        } catch (error) {
            console.error('Error deleting lab:', error);
            showNotification('Error deleting laboratory', 'error');
        }
    }
}

function saveLab(event) {
    event.preventDefault();
    
    if (isLoading) return;
    
    showLoading();
    
    setTimeout(() => {
        try {
            const departmentId = parseInt(document.getElementById('labDepartment').value);
            const department = departments.find(d => d.id === departmentId);
            
            if (!department) {
                showNotification('Please select a valid department', 'error');
                hideLoading();
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
                utilization: Math.min(100, Math.max(0, parseInt(document.getElementById('utilizationRate').value) || 0)),
                status: document.getElementById('labStatus').value
            };
            
            // Enhanced validation
            const validation = validateLabForm(formData);
            if (!validation.isValid) {
                showFormErrors(validation.errors);
                hideLoading();
                return;
            }
            
            if (currentLab) {
                // Update existing
                Object.assign(currentLab, formData);
                const labIndex = labs.findIndex(l => l.id === currentLab.id);
                if (labIndex !== -1) {
                    labs[labIndex] = currentLab;
                }
                
                if (department.labs) {
                    const deptLabIndex = department.labs.findIndex(l => l.id === currentLab.id);
                    if (deptLabIndex !== -1) {
                        department.labs[deptLabIndex] = {...currentLab};
                    }
                }
                showNotification('Laboratory updated successfully!', 'success');
            } else {
                // Add new
                formData.id = Math.max(...labs.map(l => l.id), 0) + 1;
                labs.push(formData);
                
                if (!department.labs) department.labs = [];
                department.labs.push({...formData});
                
                showNotification('Laboratory added successfully!', 'success');
            }
            
            loadLabManagement();
            loadDepartments();
            updateStatistics();
            closeModal();
            hideLoading();
            
        } catch (error) {
            console.error('Error saving lab:', error);
            showNotification('Error saving laboratory', 'error');
            hideLoading();
        }
    }, 500);
}

function validateLabForm(data) {
    const errors = [];
    
    if (!data.name || data.name.length < 3) {
        errors.push({ field: 'labName', message: 'Laboratory name must be at least 3 characters' });
    }
    
    if (!data.type) {
        errors.push({ field: 'labType', message: 'Laboratory type is required' });
    }
    
    if (!data.departmentId) {
        errors.push({ field: 'labDepartment', message: 'Department selection is required' });
    }
    
    if (!data.capacity || data.capacity < 1) {
        errors.push({ field: 'labCapacity', message: 'Capacity must be at least 1' });
    }
    
    if (data.utilization < 0 || data.utilization > 100) {
        errors.push({ field: 'utilizationRate', message: 'Utilization must be between 0 and 100' });
    }
    
    // Check for duplicate names within the same department
    const existingLab = labs.find(l => 
        l.name === data.name && 
        l.departmentId === data.departmentId && 
        (!currentLab || l.id !== currentLab.id)
    );
    if (existingLab) {
        errors.push({ field: 'labName', message: 'Laboratory name already exists in this department' });
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Lab Search Functions - Enhanced
function searchLabs() {
    const searchTerm = document.getElementById('labSearchInput')?.value?.toLowerCase() || '';
    
    clearTimeout(window.labSearchTimeout);
    window.labSearchTimeout = setTimeout(() => {
        loadLabManagement();
    }, 300);
}

function filterLabsByDepartment() {
    loadLabManagement();
}

function filterLabsByType() {
    loadLabManagement();
}

// Utility Functions - Enhanced
function refreshDepartments() {
    showLoading();
    
    setTimeout(() => {
        applyFilters();
        loadDepartments();
        updateStatistics();
        updateFilters();
        hideLoading();
        showNotification('Data refreshed successfully!', 'info');
    }, 1000);
}

function exportDepartments() {
    try {
        const data = departments.map(dept => ({
            'Name': dept.name,
            'Code': dept.code,
            'Type': dept.type,
            'HOD': dept.hod,
            'HOD Email': dept.hodEmail,
            'Phone': dept.phone,
            'Email': dept.email,
            'Location': dept.location,
            'Faculty': dept.facultyCount,
            'Student Capacity': dept.studentCapacity,
            'Current Students': dept.currentStudents,
            'Labs': dept.labs ? dept.labs.length : 0,
            'Status': formatStatus(dept.status),
            'Established': dept.establishedYear,
            'Occupancy Rate': dept.studentCapacity > 0 ? 
                Math.round((dept.currentStudents / dept.studentCapacity) * 100) + '%' : '0%'
        }));
        
        exportToCSV(data, `departments_${new Date().toISOString().split('T')[0]}.csv`);
        showNotification('Departments exported successfully!', 'success');
        
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Error exporting departments', 'error');
    }
}

function exportSelected() {
    if (selectedDepartments.length === 0) {
        showNotification('Please select departments to export', 'error');
        return;
    }
    
    try {
        const selectedDepts = departments.filter(d => selectedDepartments.includes(d.id));
        const data = selectedDepts.map(dept => ({
            'Name': dept.name,
            'Code': dept.code,
            'Type': dept.type,
            'HOD': dept.hod,
            'Status': formatStatus(dept.status),
            'Faculty': dept.facultyCount,
            'Students': dept.currentStudents,
            'Labs': dept.labs ? dept.labs.length : 0
        }));
        
        exportToCSV(data, `selected_departments_${new Date().toISOString().split('T')[0]}.csv`);
        showNotification(`${selectedDepts.length} departments exported!`, 'success');
        
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Error exporting selected departments', 'error');
    }
}

function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        showNotification('No data to export', 'error');
        return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                const value = row[header];
                // Escape commas and quotes in CSV
                return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
                    ? `"${value.replace(/"/g, '""')}"` 
                    : value;
            }).join(',')
        )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importDepartments() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        showLoading();
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                let importedData = [];
                
                if (file.name.endsWith('.json')) {
                    importedData = JSON.parse(e.target.result);
                } else if (file.name.endsWith('.csv')) {
                    const csv = e.target.result;
                    const lines = csv.split('\n');
                    const headers = lines[0].split(',');
                    
                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(',');
                        if (values.length === headers.length) {
                            const obj = {};
                            headers.forEach((header, index) => {
                                obj[header.trim()] = values[index].trim();
                            });
                            importedData.push(obj);
                        }
                    }
                }
                
                // Process imported data (this is a simplified version)
                if (importedData.length > 0) {
                    showNotification(`Successfully imported ${importedData.length} records!`, 'success');
                    // Here you would process and validate the imported data
                } else {
                    showNotification('No valid data found in file', 'error');
                }
                
            } catch (error) {
                console.error('Import error:', error);
                showNotification('Error importing file. Please check the format.', 'error');
            } finally {
                hideLoading();
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Notification System - Enhanced
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) {
        // Fallback to browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('SCMS Department Management', {
                body: message,
                icon: '/favicon.ico'
            });
        }
        return;
    }
    
    const iconElement = notification.querySelector('i');
    if (iconElement) {
        const icons = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'info': 'fas fa-info-circle',
            'warning': 'fas fa-exclamation-triangle'
        };
        iconElement.className = icons[type] || icons['success'];
    }
    
    notificationText.textContent = message;
    notification.className = `notification ${type} show`;
    
    // Add click to dismiss
    notification.onclick = () => {
        notification.classList.remove('show');
    };
    
    // Auto-dismiss
    const duration = type === 'error' ? 5000 : 3000;
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
    
    // Vibration for mobile
    if ('vibrate' in navigator && (type === 'error' || type === 'warning')) {
        navigator.vibrate([100, 50, 100]);
    }
}

// Helper Functions - Enhanced
function formatStatus(status) {
    const statusMap = {
        'active': 'Active',
        'inactive': 'Inactive',
        'under-review': 'Under Review',
        'maintenance': 'Maintenance',
        'suspended': 'Suspended'
    };
    
    return statusMap[status] || status.replace('-', ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear all data
        localStorage.clear();
        sessionStorage.clear();
        
        // Show loading
        showLoading();
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

// PWA Support
function setupPWA() {
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered successfully');
            })
            .catch(error => {
                console.log('SW registration failed');
            });
    }
    
    // Install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        const installBtn = document.getElementById('installApp');
        if (installBtn) {
            installBtn.style.display = 'block';
            installBtn.onclick = () => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        showNotification('App installed successfully!', 'success');
                    }
                    deferredPrompt = null;
                    installBtn.style.display = 'none';
                });
            };
        }
    });
}

// Event Listeners Setup - Enhanced
function setupEventListeners() {
    // Window resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768) {
                closeMobileSidebar();
            }
        }, 250);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // ESC to close modals
        if (e.key === 'Escape') {
            closeModal();
            closeMobileSidebar();
        }
        
        // Ctrl+/ for search focus
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Ctrl+N for new department
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            openAddDepartmentModal();
        }
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
    
    // Form validation on input
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
    });
    
    // Online/Offline status
    window.addEventListener('online', () => {
        showNotification('Connection restored', 'success');
    });
    
    window.addEventListener('offline', () => {
        showNotification('You are offline', 'warning');
    });
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // Setup PWA
    setupPWA();
}

// Initialize when DOM loads - Enhanced
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn && window.location.pathname !== '/login.html') {
        window.location.href = 'login.html';
        return;
    }
    
    // Load preferred view
    const preferredView = localStorage.getItem('preferredView') || 'table';
    currentView = preferredView;
    
    // Initialize app
    initializeApp();
    
    // Add loading screen removal
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
    }, 1500);
});

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An unexpected error occurred', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('An unexpected error occurred', 'error');
});
