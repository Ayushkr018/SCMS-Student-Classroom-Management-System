// Global variables
let currentDepartment = null;
let currentLab = null;
let departments = [];
let labs = [];
let currentView = 'table';
let selectedDepartments = [];
let filteredDepartments = [];
let currentUser = null;

// Theme Management
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('scms-theme', newTheme);
    
    updateThemeIcons(newTheme);
    
    // Add smooth transition effect
    document.body.style.transition = 'background-color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

function updateThemeIcons(theme) {
    const elements = [
        { id: 'themeIcon', darkClass: 'fas fa-sun', lightClass: 'fas fa-moon' },
        { id: 'mobileThemeIcon', darkClass: 'fas fa-sun', lightClass: 'fas fa-moon' }
    ];
    
    elements.forEach(({ id, darkClass, lightClass }) => {
        const element = document.getElementById(id);
        if (element) {
            element.className = theme === 'dark' ? darkClass : lightClass;
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

// Mobile Navigation
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const body = document.body;
    
    if (!sidebar || !overlay) return;
    
    const isActive = sidebar.classList.contains('active');
    
    if (isActive) {
        closeMobileSidebar();
    } else {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        body.style.overflow = 'hidden';
        
        // Add slide animation
        sidebar.style.transform = 'translateX(0)';
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const body = document.body;
    
    if (sidebar) {
        sidebar.classList.remove('active');
        sidebar.style.transform = 'translateX(-100%)';
    }
    if (overlay) overlay.classList.remove('active');
    body.style.overflow = 'auto';
}

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus trap for accessibility
    const focusableElements = modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
    
    // Add escape key listener
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
        
        // Reset forms
        const forms = modal.querySelectorAll('form');
        forms.forEach(form => {
            if (form.reset) form.reset();
        });
    });
    
    document.body.style.overflow = 'auto';
    
    // Reset current objects
    currentDepartment = null;
    currentLab = null;
}

// Sample Data with Enhanced Structure
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
        description: "Leading department in computer science and technology education with state-of-the-art facilities and experienced faculty members.",
        labs: [
            {
                id: 1,
                name: "Programming Laboratory",
                type: "Computer Lab",
                capacity: 60,
                utilization: 85,
                incharge: "Prof. Smith Anderson",
                location: "Block A, Room 301",
                equipment: ["High-end Desktop PCs - 60", "Interactive Projector - 2", "Smart Whiteboard - 1", "Central AC - 2", "Network Infrastructure"],
                software: ["Visual Studio 2022", "IntelliJ IDEA", "MySQL Workbench", "Git", "Docker", "VS Code"],
                status: "active"
            },
            {
                id: 2,
                name: "Data Structures Laboratory",
                type: "Computer Lab",
                capacity: 40,
                utilization: 78,
                incharge: "Prof. Johnson Lee",
                location: "Block A, Room 302",
                equipment: ["Desktop PCs - 40", "Projector - 1", "Interactive Board - 1", "Sound System"],
                software: ["Dev C++", "Code Blocks", "Visual Studio", "Eclipse", "NetBeans"],
                status: "active"
            },
            {
                id: 3,
                name: "AI & ML Laboratory",
                type: "Research Lab",
                capacity: 30,
                utilization: 92,
                incharge: "Dr. Sarah Williams",
                location: "Block A, Room 305",
                equipment: ["High-Performance Workstations - 30", "GPU Servers - 4", "Large Display - 2"],
                software: ["Python", "TensorFlow", "PyTorch", "Jupyter Notebooks", "CUDA Toolkit"],
                status: "active"
            }
        ]
    },
    {
        id: 2,
        name: "Electronics & Communication Engineering",
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
        description: "Excellence in electronics and communication engineering with focus on innovation, research, and industry collaboration.",
        labs: [
            {
                id: 4,
                name: "Electronics Laboratory",
                type: "Electronics Lab",
                capacity: 50,
                utilization: 82,
                incharge: "Prof. Wilson Carter",
                location: "Block B, Room 201",
                equipment: ["Digital Oscilloscopes - 25", "Function Generators - 25", "Digital Multimeters - 50", "Power Supplies - 25"],
                software: ["MATLAB", "Proteus Professional", "Multisim", "LabVIEW"],
                status: "active"
            },
            {
                id: 5,
                name: "Communication Systems Lab",
                type: "Electronics Lab",
                capacity: 35,
                utilization: 76,
                incharge: "Dr. Michael Brown",
                location: "Block B, Room 205",
                equipment: ["Signal Generators - 18", "Spectrum Analyzers - 12", "Communication Trainers - 35"],
                software: ["GNU Radio", "MATLAB Simulink", "LabVIEW Communications"],
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
        description: "Traditional engineering discipline focusing on design, manufacturing, and maintenance of mechanical systems with modern approach.",
        labs: [
            {
                id: 6,
                name: "Manufacturing Workshop",
                type: "Workshop Lab",
                capacity: 30,
                utilization: 88,
                incharge: "Prof. Davis Miller",
                location: "Block C, Ground Floor",
                equipment: ["CNC Lathe - 5", "Milling Machines - 8", "Drilling Machines - 10", "Welding Equipment - 12"],
                software: ["AutoCAD", "SolidWorks", "ANSYS", "CATIA", "Fusion 360"],
                status: "active"
            },
            {
                id: 7,
                name: "Thermal Engineering Lab",
                type: "Research Lab",
                capacity: 25,
                utilization: 74,
                incharge: "Dr. Jennifer White",
                location: "Block C, Room 105",
                equipment: ["Heat Exchangers - 6", "Steam Boiler Setup - 1", "IC Engine Setup - 2", "Refrigeration Unit - 3"],
                software: ["ANSYS Fluent", "MATLAB", "EES Software"],
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
        description: "Comprehensive business education preparing future leaders and entrepreneurs with practical knowledge and skills.",
        labs: [
            {
                id: 8,
                name: "Business Analytics Lab",
                type: "Computer Lab",
                capacity: 40,
                utilization: 68,
                incharge: "Prof. Robert Taylor",
                location: "Block D, Room 210",
                equipment: ["Business Computers - 40", "Financial Terminals - 4", "Presentation System - 1"],
                software: ["R Studio", "SPSS", "Tableau", "Power BI", "Excel Advanced"],
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
        description: "Rich tradition in literary studies and language education with emphasis on critical thinking and communication skills.",
        labs: [
            {
                id: 9,
                name: "Language Laboratory",
                type: "Language Lab",
                capacity: 45,
                utilization: 65,
                incharge: "Prof. Anderson Clark",
                location: "Block E, Room 101",
                equipment: ["Audio Systems - 45", "Headphones with Mic - 45", "Recording Equipment - 2", "Interactive Board - 1"],
                software: ["Rosetta Stone", "Language Learning Pro", "Pronunciation Power"],
                status: "active"
            }
        ]
    },
    {
        id: 6,
        name: "Physics",
        code: "PHY",
        type: "Science",
        hod: "Dr. Kumar Vishwanath",
        hodEmail: "kumar.vishwanath@scms.edu",
        email: "physics@scms.edu",
        phone: "+91-98765-43215",
        location: "Block F, Floor 2",
        facultyCount: 16,
        studentCapacity: 300,
        currentStudents: 285,
        establishedYear: 2006,
        status: "active",
        description: "Advanced physics education with modern laboratory facilities and research opportunities.",
        labs: [
            {
                id: 10,
                name: "Quantum Physics Lab",
                type: "Physics Lab",
                capacity: 25,
                utilization: 89,
                incharge: "Dr. Lisa Johnson",
                location: "Block F, Room 205",
                equipment: ["Laser Systems - 8", "Interferometers - 6", "Spectrometers - 10", "Oscilloscopes - 15"],
                software: ["MATLAB", "LabVIEW", "Mathematica", "Origin Pro"],
                status: "active"
            }
        ]
    }
];

// Initialize Application
function initializeApp() {
    initializeTheme();
    initializeDepartments();
    setupEventListeners();
    loadUserInfo();
    setActiveNavigation();
    
    // Show loading animation briefly
    showLoadingAnimation();
}

function showLoadingAnimation() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        setTimeout(() => {
            mainContent.style.transition = 'opacity 0.5s ease';
            mainContent.style.opacity = '1';
        }, 100);
    }
}

function loadUserInfo() {
    // Simulate loading user info
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = localStorage.getItem('userName') || 'Admin User';
    }
    
    currentUser = {
        name: localStorage.getItem('userName') || 'Admin User',
        role: 'Administrator',
        email: 'admin@scms.edu'
    };
}

function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-nav li').forEach(li => {
        li.classList.remove('active');
        const link = li.querySelector('a');
        if (link && (link.getAttribute('href') === currentPage || 
                     (currentPage === 'departments.html' && link.getAttribute('href') === 'departments.html'))) {
            li.classList.add('active');
        }
    });
}

// Data Management
function initializeDepartments() {
    departments = [...sampleDepartments];
    
    // Extract all labs into separate array
    labs = [];
    departments.forEach(dept => {
        if (dept.labs && dept.labs.length > 0) {
            dept.labs.forEach(lab => {
                lab.departmentId = dept.id;
                lab.departmentName = dept.name;
                lab.departmentCode = dept.code;
                labs.push({...lab});
            });
        }
    });
    
    filteredDepartments = [...departments];
    loadDepartments();
    updateStatistics();
}

// Statistics Management
function updateStatistics() {
    const totalDepts = departments.length;
    const activeDepts = departments.filter(d => d.status === 'active').length;
    const totalFaculty = departments.reduce((sum, d) => sum + (d.facultyCount || 0), 0);
    const totalStudents = departments.reduce((sum, d) => sum + (d.currentStudents || 0), 0);
    
    // Animate number updates
    animateCounter('totalDepartments', totalDepts);
    animateCounter('activeDepartments', activeDepts);
    animateCounter('totalFaculty', totalFaculty);
    animateCounter('totalStudents', totalStudents);
}

function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    const increment = targetValue > currentValue ? 1 : -1;
    const step = Math.abs(targetValue - currentValue) / 20;
    
    let current = currentValue;
    const timer = setInterval(() => {
        current += increment * step;
        if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
            current = targetValue;
            clearInterval(timer);
        }
        
        if (elementId === 'totalStudents') {
            element.textContent = Math.floor(current).toLocaleString();
        } else {
            element.textContent = Math.floor(current);
        }
    }, 50);
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
        tbody.innerHTML = createEmptyState('table');
        return;
    }
    
    filteredDepartments.forEach(dept => {
        const row = createDepartmentTableRow(dept);
        tbody.appendChild(row);
    });
}

function createDepartmentTableRow(dept) {
    const row = document.createElement('tr');
    const labCount = dept.labs ? dept.labs.length : 0;
    const avgUtilization = labCount > 0 ? 
        Math.round(dept.labs.reduce((sum, lab) => sum + (lab.utilization || 0), 0) / labCount) : 0;
    const utilizationText = labCount > 0 ? `${avgUtilization}% avg` : 'No labs';
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
                    <p>${dept.code} • Est. ${dept.establishedYear} • ${occupancyRate}% occupied</p>
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
            <div>
                <span class="count-badge">${labCount} Labs</span>
                ${labCount > 0 ? `<br><small style="color: var(--text-secondary);">${utilizationText}</small>` : ''}
            </div>
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
    
    // Add hover effect
    row.addEventListener('mouseenter', () => {
        row.style.transform = 'translateX(5px)';
    });
    
    row.addEventListener('mouseleave', () => {
        row.style.transform = 'translateX(0)';
    });
    
    return row;
}

function loadDepartmentsCards() {
    const container = document.getElementById('departmentsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (filteredDepartments.length === 0) {
        container.innerHTML = createEmptyState('card');
        return;
    }
    
    filteredDepartments.forEach(dept => {
        const card = createDepartmentCard(dept);
        container.appendChild(card);
    });
}

function createDepartmentCard(dept) {
    const labCount = dept.labs ? dept.labs.length : 0;
    const avgUtilization = labCount > 0 ? 
        Math.round(dept.labs.reduce((sum, lab) => sum + (lab.utilization || 0), 0) / labCount) : 0;
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
                    <span class="info-value">${occupancyRate}% (${dept.currentStudents}/${dept.studentCapacity})</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Lab Utilization</span>
                    <span class="info-value">${labCount > 0 ? avgUtilization + '%' : 'N/A'}</span>
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
    
    // Add animation delay for staggered effect
    const index = filteredDepartments.indexOf(dept);
    card.style.animationDelay = `${index * 0.1}s`;
    card.style.opacity = '0';
    card.style.animation = 'slideInUp 0.5s ease forwards';
    
    return card;
}

function createEmptyState(type) {
    const colSpan = type === 'table' ? 8 : '';
    const gridColumn = type === 'card' ? 'style="grid-column: 1 / -1;"' : '';
    
    return `
        <tr ${type === 'table' ? '' : 'style="display: none;"'}>
            <td colspan="${colSpan}" class="empty-state" ${gridColumn}>
                <div>
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px;"></i>
                    <h3>No departments found</h3>
                    <p>Try adjusting your search or filter criteria, or add a new department</p>
                    <button class="btn btn-primary" onclick="openAddDepartmentModal()" style="margin-top: 15px;">
                        <i class="fas fa-plus"></i> Add Department
                    </button>
                </div>
            </td>
        </tr>
    `;
}

// View Management
function switchView(view) {
    currentView = view;
    
    const cardBtn = document.getElementById('cardViewBtn');
    const tableBtn = document.getElementById('tableViewBtn');
    const cardContainer = document.getElementById('departmentsContainer');
    const tableContainer = document.getElementById('tableContainer');
    
    // Update button states
    cardBtn?.classList.toggle('active', view === 'card');
    tableBtn?.classList.toggle('active', view === 'table');
    
    // Update container visibility
    if (cardContainer && tableContainer) {
        if (view === 'card') {
            cardContainer.style.display = 'grid';
            tableContainer.style.display = 'none';
            loadDepartmentsCards();
        } else {
            tableContainer.style.display = 'block';
            cardContainer.style.display = 'none';
            loadDepartmentsTable();
        }
    }
    
    // Save view preference
    localStorage.setItem('preferred-view', view);
}

// CRUD Operations
function openAddDepartmentModal() {
    document.getElementById('modalTitle').textContent = 'Add New Department';
    currentDepartment = null;
    
    // Reset form
    const form = document.getElementById('departmentForm');
    if (form) form.reset();
    
    // Set default values
    const statusSelect = document.getElementById('departmentStatus');
    if (statusSelect) statusSelect.value = 'active';
    
    openModal('departmentModal');
}

function editDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    
    currentDepartment = dept;
    document.getElementById('modalTitle').textContent = 'Edit Department';
    
    // Populate form fields
    const fields = [
        'departmentName', 'departmentCode', 'departmentType', 'establishedYear',
        'departmentDescription', 'hodName', 'hodEmail', 'departmentPhone',
        'departmentEmail', 'officeLocation', 'facultyCount', 'studentCapacity',
        'currentStudents', 'departmentStatus'
    ];
    
    const mappings = {
        'departmentName': 'name',
        'departmentCode': 'code',
        'departmentType': 'type',
        'departmentDescription': 'description',
        'hodName': 'hod',
        'departmentPhone': 'phone',
        'departmentEmail': 'email',
        'officeLocation': 'location'
    };
    
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        const dataKey = mappings[fieldId] || fieldId.replace('department', '').toLowerCase();
        if (element && dept[dataKey] !== undefined) {
            element.value = dept[dataKey];
        }
    });
    
    openModal('departmentModal');
}

function viewDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    
    document.getElementById('departmentDetailsTitle').textContent = `${dept.name} - Department Details`;
    
    const content = createDepartmentDetailsView(dept);
    document.getElementById('departmentDetailsContent').innerHTML = content;
    
    openModal('departmentDetailsModal');
}

function createDepartmentDetailsView(dept) {
    const labsHTML = dept.labs && dept.labs.length > 0 ? 
        dept.labs.map(lab => createLabCard(lab)).join('') : 
        '<div class="empty-lab-state"><i class="fas fa-flask" style="font-size: 2rem; margin-bottom: 15px;"></i><p>No laboratories assigned to this department</p></div>';
    
    const occupancyRate = dept.studentCapacity > 0 ? 
        Math.round((dept.currentStudents / dept.studentCapacity) * 100) : 0;
    
    return `
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
                        <label>Established</label>
                        <span>${dept.establishedYear}</span>
                    </div>
                    <div class="detail-item">
                        <label>Status</label>
                        <span class="status-badge status-${dept.status}">${formatStatus(dept.status)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Location</label>
                        <span>${dept.location}</span>
                    </div>
                </div>
                <div class="detail-item" style="margin-top: 20px;">
                    <label>Description</label>
                    <span>${dept.description || 'No description provided'}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-user-tie"></i> Leadership & Contact</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Head of Department</label>
                        <span>${dept.hod}</span>
                    </div>
                    <div class="detail-item">
                        <label>HOD Email</label>
                        <span><a href="mailto:${dept.hodEmail}">${dept.hodEmail}</a></span>
                    </div>
                    <div class="detail-item">
                        <label>Department Phone</label>
                        <span><a href="tel:${dept.phone}">${dept.phone}</a></span>
                    </div>
                    <div class="detail-item">
                        <label>Department Email</label>
                        <span><a href="mailto:${dept.email}">${dept.email}</a></span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-chart-bar"></i> Statistics & Performance</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Faculty Count</label>
                        <span>${dept.facultyCount}</span>
                    </div>
                    <div class="detail-item">
                        <label>Student Capacity</label>
                        <span>${dept.studentCapacity}</span>
                    </div>
                    <div class="detail-item">
                        <label>Current Students</label>
                        <span>${dept.currentStudents}</span>
                    </div>
                    <div class="detail-item">
                        <label>Occupancy Rate</label>
                        <span>${occupancyRate}%</span>
                    </div>
                    <div class="detail-item">
                        <label>Faculty-Student Ratio</label>
                        <span>1:${Math.round(dept.currentStudents / dept.facultyCount)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Laboratory Count</label>
                        <span>${dept.labs ? dept.labs.length : 0}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-flask"></i> Laboratory Facilities</h4>
                <div class="labs-grid">
                    ${labsHTML}
                </div>
            </div>
        </div>
    `;
}

function createLabCard(lab) {
    return `
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
                <div class="lab-detail-item">
                    <label>Status</label>
                    <span class="status-badge status-${lab.status}">${formatStatus(lab.status)}</span>
                </div>
                <div class="lab-detail-item">
                    <label>Equipment</label>
                    <span>${lab.equipment ? lab.equipment.length : 0} items</span>
                </div>
            </div>
            <div style="margin-top: 10px;">
                <button class="action-btn action-edit" onclick="editLab(${lab.id})" title="Edit Lab">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
        </div>
    `;
}

function deleteDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    
    // Enhanced confirmation dialog
    const labCount = dept.labs ? dept.labs.length : 0;
    const confirmMessage = `Are you sure you want to delete "${dept.name}"?\n\n` +
        `This will also remove:\n` +
        `• ${labCount} associated laboratories\n` +
        `• All department records\n\n` +
        `This action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
        // Remove department
        departments = departments.filter(d => d.id !== id);
        filteredDepartments = filteredDepartments.filter(d => d.id !== id);
        
        // Remove associated labs
        labs = labs.filter(lab => lab.departmentId !== id);
        
        // Remove from selected if present
        selectedDepartments = selectedDepartments.filter(sid => sid !== id);
        
        loadDepartments();
        updateStatistics();
        showNotification(`${dept.name} deleted successfully!`, 'success');
        
        // Add deletion animation
        setTimeout(() => {
            loadDepartments();
        }, 300);
    }
}

function saveDepartment(event) {
    event.preventDefault();
    
    // Get form data with validation
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
    
    // Validation
    if (!formData.name || !formData.code || !formData.type) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Check for duplicate codes (except when editing)
    const existingDept = departments.find(d => d.code === formData.code && (!currentDepartment || d.id !== currentDepartment.id));
    if (existingDept) {
        showNotification('Department code already exists', 'error');
        return;
    }
    
    if (currentDepartment) {
        // Update existing department
        Object.assign(currentDepartment, formData);
        
        // Update in main array
        const index = departments.findIndex(d => d.id === currentDepartment.id);
        if (index !== -1) {
            departments[index] = currentDepartment;
        }
        
        showNotification(`${formData.name} updated successfully!`, 'success');
    } else {
        // Add new department
        formData.id = Math.max(...departments.map(d => d.id), 0) + 1;
        formData.labs = [];
        departments.push(formData);
        showNotification(`${formData.name} added successfully!`, 'success');
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
        // Search filter
        const matchesSearch = !searchTerm || 
            dept.name.toLowerCase().includes(searchTerm) ||
            dept.code.toLowerCase().includes(searchTerm) ||
            dept.hod.toLowerCase().includes(searchTerm) ||
            dept.type.toLowerCase().includes(searchTerm) ||
            dept.location.toLowerCase().includes(searchTerm);
        
        // Status filter
        const matchesStatus = !statusFilter || dept.status === statusFilter;
        
        // Type filter
        const matchesType = !typeFilter || dept.type === typeFilter;
        
        // Lab filter
        let matchesLab = true;
        if (labFilter) {
            const labCount = dept.labs ? dept.labs.length : 0;
            const avgUtilization = labCount > 0 ? 
                dept.labs.reduce((sum, lab) => sum + (lab.utilization || 0), 0) / labCount : 0;
            
            switch (labFilter) {
                case 'has-labs':
                    matchesLab = labCount > 0;
                    break;
                case 'no-labs':
                    matchesLab = labCount === 0;
                    break;
                case 'high-utilization':
                    matchesLab = avgUtilization > 80;
                    break;
                case 'low-utilization':
                    matchesLab = avgUtilization < 60 && labCount > 0;
                    break;
            }
        }
        
        return matchesSearch && matchesStatus && matchesType && matchesLab;
    });
    
    loadDepartments();
    
    // Show filter results count
    const totalCount = departments.length;
    const filteredCount = filteredDepartments.length;
    
    if (filteredCount !== totalCount) {
        showNotification(`Showing ${filteredCount} of ${totalCount} departments`, 'info');
    }
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
    updateMasterCheckbox();
}

function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox?.checked) {
        selectedDepartments = [...filteredDepartments.map(d => d.id)];
    } else {
        selectedDepartments = [];
    }
    
    // Update individual checkboxes
    document.querySelectorAll('input[type="checkbox"][value]').forEach(checkbox => {
        checkbox.checked = selectedDepartments.includes(parseInt(checkbox.value));
    });
    
    updateSelectedCount();
}

function toggleMasterCheckbox() {
    const masterCheckbox = document.getElementById('masterCheckbox');
    if (!masterCheckbox) return;
    
    const visibleDeptIds = filteredDepartments.map(d => d.id);
    const selectedVisibleDepts = selectedDepartments.filter(id => visibleDeptIds.includes(id));
    
    if (selectedVisibleDepts.length === 0) {
        masterCheckbox.checked = false;
        masterCheckbox.indeterminate = false;
    } else if (selectedVisibleDepts.length === visibleDeptIds.length) {
        masterCheckbox.checked = true;
        masterCheckbox.indeterminate = false;
    } else {
        masterCheckbox.checked = false;
        masterCheckbox.indeterminate = true;
    }
    
    // Select all visible departments
    if (masterCheckbox.checked) {
        visibleDeptIds.forEach(id => {
            if (!selectedDepartments.includes(id)) {
                selectedDepartments.push(id);
            }
        });
    } else if (!masterCheckbox.indeterminate) {
        // Deselect all visible departments
        visibleDeptIds.forEach(id => {
            const index = selectedDepartments.indexOf(id);
            if (index > -1) {
                selectedDepartments.splice(index, 1);
            }
        });
    }
    
    // Update individual checkboxes
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
    
    // Update bulk actions visibility
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
        default:
            showNotification('Unknown action', 'error');
            return;
    }
    
    selectedDepartments = [];
    applyFilters();
    loadDepartments();
    updateStatistics();
}

// Lab Management
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
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-flask" style="font-size: 3rem; color: var(--text-tertiary); margin-bottom: 20px;"></i>
                <h3>No laboratories found</h3>
                <p>Add some laboratories to get started</p>
                <button class="btn btn-success" onclick="openAddLabModal()" style="margin-top: 15px;">
                    <i class="fas fa-plus"></i> Add Laboratory
                </button>
            </div>
        `;
        return;
    }
    
    labs.forEach((lab, index) => {
        const card = document.createElement('div');
        card.className = 'lab-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="lab-header">
                <h5>${lab.name}</h5>
                <span class="lab-type-badge">${lab.type}</span>
            </div>
            <div class="lab-details">
                <div class="lab-detail-item">
                    <label>Department</label>
                    <span>${lab.departmentName} (${lab.departmentCode})</span>
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
                <button class="action-btn action-edit" onclick="editLab(${lab.id})" title="Edit Lab">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn action-delete" onclick="deleteLab(${lab.id})" title="Delete Lab">
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
    
    // Populate form
    const fields = {
        'labName': lab.name,
        'labType': lab.type,
        'labDepartment': lab.departmentId,
        'labCapacity': lab.capacity,
        'labIncharge': lab.incharge,
        'labLocation': lab.location,
        'labEquipment': lab.equipment ? lab.equipment.join('\n') : '',
        'labSoftware': lab.software ? lab.software.join('\n') : '',
        'utilizationRate': lab.utilization,
        'labStatus': lab.status
    };
    
    Object.entries(fields).forEach(([fieldId, value]) => {
        const element = document.getElementById(fieldId);
        if (element && value !== undefined) {
            element.value = value;
        }
    });
    
    populateDepartmentOptions();
    openModal('addLabModal');
}

function deleteLab(id) {
    const lab = labs.find(l => l.id === id);
    if (!lab) return;
    
    if (confirm(`Are you sure you want to delete "${lab.name}"? This action cannot be undone.`)) {
        // Remove from labs array
        labs = labs.filter(l => l.id !== id);
        
        // Remove from department's labs array
        const dept = departments.find(d => d.id === lab.departmentId);
        if (dept && dept.labs) {
            dept.labs = dept.labs.filter(l => l.id !== id);
        }
        
        loadLabManagement();
        updateStatistics();
        showNotification(`${lab.name} deleted successfully!`, 'success');
    }
}

function saveLab(event) {
    event.preventDefault();
    
    const departmentId = parseInt(document.getElementById('labDepartment').value);
    const department = departments.find(d => d.id === departmentId);
    
    if (!department) {
        showNotification('Please select a valid department', 'error');
        return;
    }
    
    const formData = {
        name: document.getElementById('labName').value.trim(),
        type: document.getElementById('labType').value,
        departmentId: departmentId,
        departmentName: department.name,
        departmentCode: department.code,
        capacity: parseInt(document.getElementById('labCapacity').value) || 0,
        incharge: document.getElementById('labIncharge').value.trim(),
        location: document.getElementById('labLocation').value.trim(),
        equipment: document.getElementById('labEquipment').value.split('\n').filter(item => item.trim()),
        software: document.getElementById('labSoftware').value.split('\n').filter(item => item.trim()),
        utilization: parseInt(document.getElementById('utilizationRate').value) || 0,
        status: document.getElementById('labStatus').value
    };
    
    if (!formData.name || !formData.type || !formData.capacity) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (currentLab) {
        // Update existing lab
        Object.assign(currentLab, formData);
        
        // Update in department's labs array
        if (department.labs) {
            const labIndex = department.labs.findIndex(l => l.id === currentLab.id);
            if (labIndex !== -1) {
                department.labs[labIndex] = {...currentLab};
            }
        }
        
        showNotification(`${formData.name} updated successfully!`, 'success');
    } else {
        // Add new lab
        formData.id = Math.max(...labs.map(l => l.id), 0) + 1;
        
        // Add to labs array
        labs.push(formData);
        
        // Add to department's labs array
        if (!department.labs) {
            department.labs = [];
        }
        department.labs.push({...formData});
        
        showNotification(`${formData.name} added successfully!`, 'success');
    }
    
    loadLabManagement();
    loadDepartments(); // Refresh department view to show updated lab count
    updateStatistics();
    closeModal();
}

// Lab Search and Filter Functions
function searchLabs() {
    const searchTerm = document.getElementById('labSearchInput')?.value?.toLowerCase() || '';
    // Implement lab search logic here
    loadLabManagement();
}

function filterLabsByDepartment() {
    const departmentId = document.getElementById('labDepartmentFilter')?.value;
    // Implement department filter for labs
    loadLabManagement();
}

function filterLabsByType() {
    const labType = document.getElementById('labTypeFilter')?.value;
    // Implement lab type filter
    loadLabManagement();
}

// Utility Functions
function refreshDepartments() {
    // Add refresh animation
    const refreshBtn = document.querySelector('[onclick="refreshDepartments()"]');
    if (refreshBtn) {
        const icon = refreshBtn.querySelector('i');
        icon.style.animation = 'spin 1s linear';
        setTimeout(() => {
            icon.style.animation = '';
        }, 1000);
    }
    
    applyFilters();
    loadDepartments();
    updateStatistics();
    showNotification('Data refreshed successfully!', 'info');
}

function exportDepartments() {
    const data = departments.map(dept => ({
        'Department Name': dept.name,
        'Code': dept.code,
        'Type': dept.type,
        'Head of Department': dept.hod,
        'Faculty Count': dept.facultyCount,
        'Current Students': dept.currentStudents,
        'Student Capacity': dept.studentCapacity,
        'Occupancy Rate': dept.studentCapacity > 0 ? Math.round((dept.currentStudents / dept.studentCapacity) * 100) + '%' : 'N/A',
        'Laboratory Count': dept.labs ? dept.labs.length : 0,
        'Status': formatStatus(dept.status),
        'Location': dept.location,
        'Established Year': dept.establishedYear,
        'Contact Phone': dept.phone,
        'Email': dept.email
    }));
    
    exportToCSV(data, `departments_export_${new Date().getTime()}.csv`);
    showNotification('Departments exported successfully!', 'success');
}

function exportSelected() {
    if (selectedDepartments.length === 0) {
        showNotification('Please select departments to export', 'error');
        return;
    }
    
    const selectedDepts = departments.filter(d => selectedDepartments.includes(d.id));
    const data = selectedDepts.map(dept => ({
        'Department Name': dept.name,
        'Code': dept.code,
        'Type': dept.type,
        'Head of Department': dept.hod,
        'Faculty Count': dept.facultyCount,
        'Current Students': dept.currentStudents,
        'Status': formatStatus(dept.status)
    }));
    
    exportToCSV(data, `selected_departments_${new Date().getTime()}.csv`);
    showNotification(`${selectedDepts.length} departments exported successfully!`, 'success');
}

function exportToCSV(data, filename) {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const value = row[header] || '';
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function importDepartments() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    // Basic CSV parsing (implement proper CSV parser for production)
                    const lines = e.target.result.split('\n');
                    const headers = lines[0].split(',');
                    
                    showNotification('Import functionality is under development', 'info');
                    console.log('CSV Headers:', headers);
                    console.log('CSV Lines:', lines.length);
                } catch (error) {
                    showNotification('Error importing file', 'error');
                    console.error('Import error:', error);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) return;
    
    // Set icon based on type
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
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
    
    // Add click to dismiss
    notification.onclick = () => {
        notification.classList.remove('show');
    };
}

// Helper Functions
function formatStatus(status) {
    return status.replace('-', ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear stored data
        localStorage.removeItem('user-session');
        localStorage.removeItem('userName');
        localStorage.removeItem('scms-theme');
        
        // Show logout animation
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            // Redirect to login page
            window.location.href = 'login.html';
        }, 300);
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Window resize handler
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                closeMobileSidebar();
            }
        }, 250);
    });
    
    // Close sidebar when clicking on links (mobile)
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
    
    // Search input debouncing
    let searchTimer;
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                searchDepartments();
            }, 300);
        });
    }
    
    // Load saved view preference
    const savedView = localStorage.getItem('preferred-view') || 'table';
    switchView(savedView);
}

// CSS Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    .loading {
        animation: pulse 1.5s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Refresh data when page becomes visible
        updateStatistics();
    }
});

// Handle online/offline status
window.addEventListener('online', function() {
    showNotification('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showNotification('No internet connection', 'warning');
});

// Export functions for global access (if needed)
window.departmentManager = {
    departments,
    labs,
    exportDepartments,
    importDepartments,
    refreshDepartments
};

// Performance monitoring (optional)
if (window.performance) {
    window.addEventListener('load', function() {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    });
}
