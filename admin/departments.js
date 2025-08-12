function initializeTheme() {
    const savedTheme = localStorage.getItem('scms-theme') || 'light';
    const themeIcon = document.getElementById('themeIcon');
    const mobileThemeIcon = document.getElementById('mobileThemeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const themeSwitch = document.getElementById('themeSwitch');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-sun';
        if (themeLabel) themeLabel.textContent = 'Light Mode';
        if (themeSwitch) themeSwitch.classList.add('active');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-moon';
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
        if (themeSwitch) themeSwitch.classList.remove('active');
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
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-moon';
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
        if (themeSwitch) themeSwitch.classList.remove('active');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('scms-theme', 'dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-sun';
        if (themeLabel) themeLabel.textContent = 'Light Mode';
        if (themeSwitch) themeSwitch.classList.add('active');
    }
}

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
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

let DEPARTMENTS_DATA = JSON.parse(localStorage.getItem('scms_departments_data')) || [
    {
        id: 'DEPT001',
        name: 'Computer Science & Engineering',
        code: 'CSE',
        type: 'Engineering',
        description: 'Department of Computer Science and Engineering focuses on cutting-edge technology, programming, and software development with state-of-the-art laboratory facilities.',
        establishedYear: 2005,
        hodName: 'Dr. Rajesh Kumar',
        hodEmail: 'rajesh.kumar@college.edu',
        departmentPhone: '+91-98765-43210',
        departmentEmail: 'cse@college.edu',
        officeLocation: 'Academic Block A, 3rd Floor',
        facultyCount: 25,
        studentCapacity: 240,
        currentStudents: 220,
        status: 'active',
        labs: [
            {
                labId: 'LAB001',
                labName: 'Programming Lab',
                labType: 'Computer Lab',
                capacity: 30,
                equipment: ['30 Desktop PCs', 'Projector', 'Whiteboard', 'Air Conditioning'],
                software: ['Visual Studio', 'Eclipse', 'IntelliJ IDEA', 'MySQL'],
                labIncharge: 'Prof. Kumar Sharma',
                location: 'CSE Block, Ground Floor',
                status: 'active',
                utilizationRate: 85
            },
            {
                labId: 'LAB002',
                labName: 'Database Lab',
                labType: 'Computer Lab',
                capacity: 25,
                equipment: ['25 Laptops', 'Server Rack', 'Network Switch', 'UPS System'],
                software: ['Oracle 19c', 'MySQL', 'MongoDB', 'PostgreSQL'],
                labIncharge: 'Dr. Priya Singh',
                location: 'CSE Block, 1st Floor',
                status: 'active',
                utilizationRate: 78
            },
            {
                labId: 'LAB003',
                labName: 'Network Lab',
                labType: 'Networking Lab',
                capacity: 20,
                equipment: ['Cisco Routers', 'Switches', 'Cable Testers', 'Workstations'],
                software: ['Cisco Packet Tracer', 'Wireshark', 'GNS3'],
                labIncharge: 'Mr. Amit Gupta',
                location: 'CSE Block, 2nd Floor',
                status: 'active',
                utilizationRate: 72
            }
        ],
        totalLabCapacity: 75,
        activeLabsCount: 3,
        avgLabUtilization: 78
    },
    {
        id: 'DEPT002',
        name: 'Electronics & Communication',
        code: 'ECE',
        type: 'Engineering',
        description: 'Electronics and Communication Engineering department specializes in electronic devices, communication systems, and signal processing with advanced laboratory infrastructure.',
        establishedYear: 2003,
        hodName: 'Dr. Priya Sharma',
        hodEmail: 'priya.sharma@college.edu',
        departmentPhone: '+91-98765-43211',
        departmentEmail: 'ece@college.edu',
        officeLocation: 'Academic Block B, 2nd Floor',
        facultyCount: 20,
        studentCapacity: 180,
        currentStudents: 165,
        status: 'active',
        labs: [
            {
                labId: 'LAB004',
                labName: 'Electronics Lab',
                labType: 'Electronics Lab',
                capacity: 30,
                equipment: ['Oscilloscopes', 'Function Generators', 'Multimeters', 'Power Supplies'],
                software: ['MATLAB', 'Proteus', 'Multisim'],
                labIncharge: 'Prof. Ravi Kumar',
                location: 'ECE Block, Ground Floor',
                status: 'active',
                utilizationRate: 82
            },
            {
                labId: 'LAB005',
                labName: 'Communication Lab',
                labType: 'Communication Lab',
                capacity: 25,
                equipment: ['Signal Generators', 'Spectrum Analyzers', 'Antennas', 'RF Equipment'],
                software: ['LabVIEW', 'GNU Radio', 'ADS'],
                labIncharge: 'Dr. Sunita Mehta',
                location: 'ECE Block, 1st Floor',
                status: 'active',
                utilizationRate: 75
            }
        ],
        totalLabCapacity: 55,
        activeLabsCount: 2,
        avgLabUtilization: 79
    },
    {
        id: 'DEPT003',
        name: 'Mechanical Engineering',
        code: 'MECH',
        type: 'Engineering',
        description: 'Mechanical Engineering department covers design, manufacturing, thermal systems, and mechanical systems with comprehensive workshop and laboratory facilities.',
        establishedYear: 2001,
        hodName: 'Prof. Anand Gupta',
        hodEmail: 'anand.gupta@college.edu',
        departmentPhone: '+91-98765-43212',
        departmentEmail: 'mech@college.edu',
        officeLocation: 'Engineering Block, Ground Floor',
        facultyCount: 22,
        studentCapacity: 200,
        currentStudents: 185,
        status: 'active',
        labs: [
            {
                labId: 'LAB006',
                labName: 'Manufacturing Lab',
                labType: 'Workshop Lab',
                capacity: 20,
                equipment: ['CNC Machines', 'Lathes', 'Milling Machines', 'Drilling Machines'],
                software: ['AutoCAD', 'SolidWorks', 'CATIA'],
                labIncharge: 'Prof. Vikram Singh',
                location: 'Mech Workshop, Ground Floor',
                status: 'active',
                utilizationRate: 88
            },
            {
                labId: 'LAB007',
                labName: 'Thermal Lab',
                labType: 'Thermal Lab',
                capacity: 15,
                equipment: ['Heat Exchangers', 'IC Engine Setup', 'Boiler Models', 'Refrigeration Units'],
                software: ['ANSYS Fluent', 'MATLAB', 'AutoCAD'],
                labIncharge: 'Dr. Meera Patel',
                location: 'Mech Block, 1st Floor',
                status: 'active',
                utilizationRate: 70
            }
        ],
        totalLabCapacity: 35,
        activeLabsCount: 2,
        avgLabUtilization: 79
    },
    {
        id: 'DEPT004',
        name: 'Civil Engineering',
        code: 'CIVIL',
        type: 'Engineering',
        description: 'Civil Engineering department focuses on infrastructure, construction, environmental engineering, and structural design with specialized testing laboratories.',
        establishedYear: 2000,
        hodName: 'Dr. Vikram Singh',
        hodEmail: 'vikram.singh@college.edu',
        departmentPhone: '+91-98765-43213',
        departmentEmail: 'civil@college.edu',
        officeLocation: 'Engineering Block, 1st Floor',
        facultyCount: 18,
        studentCapacity: 160,
        currentStudents: 155,
        status: 'active',
        labs: [
            {
                labId: 'LAB008',
                labName: 'Concrete Testing Lab',
                labType: 'Material Testing Lab',
                capacity: 15,
                equipment: ['Compression Testing Machine', 'Concrete Mixer', 'Slump Cone', 'Vibrating Table'],
                software: ['AutoCAD', 'STAAD Pro', 'ETABS'],
                labIncharge: 'Prof. Rajesh Patel',
                location: 'Civil Block, Ground Floor',
                status: 'active',
                utilizationRate: 65
            },
            {
                labId: 'LAB009',
                labName: 'Surveying Lab',
                labType: 'Surveying Lab',
                capacity: 20,
                equipment: ['Total Stations', 'Theodolites', 'Levels', 'GPS Units'],
                software: ['AutoCAD Civil 3D', 'ArcGIS', 'Total Station Software'],
                labIncharge: 'Dr. Kavita Singh',
                location: 'Civil Block, Outdoor Area',
                status: 'active',
                utilizationRate: 72
            }
        ],
        totalLabCapacity: 35,
        activeLabsCount: 2,
        avgLabUtilization: 69
    },
    {
        id: 'DEPT005',
        name: 'Information Technology',
        code: 'IT',
        type: 'Engineering',
        description: 'Information Technology department specializes in software development, database systems, and IT infrastructure with modern computing laboratories.',
        establishedYear: 2008,
        hodName: 'Dr. Kavitha Reddy',
        hodEmail: 'kavitha.reddy@college.edu',
        departmentPhone: '+91-98765-43214',
        departmentEmail: 'it@college.edu',
        officeLocation: 'IT Block, 2nd Floor',
        facultyCount: 15,
        studentCapacity: 120,
        currentStudents: 110,
        status: 'active',
        labs: [
            {
                labId: 'LAB010',
                labName: 'Software Development Lab',
                labType: 'Computer Lab',
                capacity: 30,
                equipment: ['High-end PCs', 'Multiple Monitors', 'Development Servers', 'Testing Devices'],
                software: ['Visual Studio', 'Android Studio', 'Xcode', 'Docker'],
                labIncharge: 'Mr. Amit Joshi',
                location: 'IT Block, 1st Floor',
                status: 'active',
                utilizationRate: 90
            },
            {
                labId: 'LAB011',
                labName: 'Cloud Computing Lab',
                labType: 'Cloud Lab',
                capacity: 25,
                equipment: ['Cloud Servers', 'Workstations', 'Network Infrastructure', 'Storage Systems'],
                software: ['AWS Console', 'Azure Portal', 'Google Cloud', 'Kubernetes'],
                labIncharge: 'Dr. Ravi Sharma',
                location: 'IT Block, 2nd Floor',
                status: 'active',
                utilizationRate: 85
            }
        ],
        totalLabCapacity: 55,
        activeLabsCount: 2,
        avgLabUtilization: 88
    },
    {
        id: 'DEPT006',
        name: 'Business Administration',
        code: 'MBA',
        type: 'Management',
        description: 'Master of Business Administration program focusing on management, leadership, and business strategy with computer and simulation laboratories.',
        establishedYear: 2010,
        hodName: 'Dr. Arjun Patel',
        hodEmail: 'arjun.patel@college.edu',
        departmentPhone: '+91-98765-43215',
        departmentEmail: 'mba@college.edu',
        officeLocation: 'Management Block, 3rd Floor',
        facultyCount: 12,
        studentCapacity: 80,
        currentStudents: 75,
        status: 'active',
        labs: [
            {
                labId: 'LAB012',
                labName: 'Business Analytics Lab',
                labType: 'Computer Lab',
                capacity: 25,
                equipment: ['Workstations', 'Presentation Equipment', 'Collaborative Displays'],
                software: ['SPSS', 'R Studio', 'Tableau', 'Power BI'],
                labIncharge: 'Prof. Neha Gupta',
                location: 'MBA Block, 2nd Floor',
                status: 'active',
                utilizationRate: 75
            }
        ],
        totalLabCapacity: 25,
        activeLabsCount: 1,
        avgLabUtilization: 75
    },
    {
        id: 'DEPT007',
        name: 'Physics',
        code: 'PHY',
        type: 'Science',
        description: 'Physics department covers theoretical and applied physics, quantum mechanics, and experimental physics with advanced research laboratories.',
        establishedYear: 2002,
        hodName: 'Dr. Sunita Mehta',
        hodEmail: 'sunita.mehta@college.edu',
        departmentPhone: '+91-98765-43216',
        departmentEmail: 'physics@college.edu',
        officeLocation: 'Science Block, 1st Floor',
        facultyCount: 10,
        studentCapacity: 60,
        currentStudents: 55,
        status: 'active',
        labs: [
            {
                labId: 'LAB013',
                labName: 'Optics Lab',
                labType: 'Physics Lab',
                capacity: 15,
                equipment: ['Lasers', 'Optical Benches', 'Spectrometers', 'Interferometers'],
                software: ['LabVIEW', 'Origin', 'MATLAB'],
                labIncharge: 'Dr. Ravi Kumar',
                location: 'Physics Block, Ground Floor',
                status: 'active',
                utilizationRate: 68
            },
            {
                labId: 'LAB014',
                labName: 'Electronics Lab',
                labType: 'Physics Lab',
                capacity: 20,
                equipment: ['Oscilloscopes', 'Function Generators', 'Digital Multimeters', 'Breadboards'],
                software: ['Multisim', 'MATLAB', 'LabVIEW'],
                labIncharge: 'Prof. Anita Sharma',
                location: 'Physics Block, 1st Floor',
                status: 'active',
                utilizationRate: 72
            }
        ],
        totalLabCapacity: 35,
        activeLabsCount: 2,
        avgLabUtilization: 70
    },
    {
        id: 'DEPT008',
        name: 'Chemistry',
        code: 'CHEM',
        type: 'Science',
        description: 'Chemistry department focuses on organic, inorganic, physical chemistry, and chemical research with well-equipped analytical laboratories.',
        establishedYear: 2002,
        hodName: 'Dr. Ravi Kumar',
        hodEmail: 'ravi.kumar@college.edu',
        departmentPhone: '+91-98765-43217',
        departmentEmail: 'chemistry@college.edu',
        officeLocation: 'Science Block, 2nd Floor',
        facultyCount: 8,
        studentCapacity: 50,
        currentStudents: 45,
        status: 'active',
        labs: [
            {
                labId: 'LAB015',
                labName: 'Analytical Chemistry Lab',
                labType: 'Chemistry Lab',
                capacity: 20,
                equipment: ['HPLC', 'GC-MS', 'UV-Vis Spectrophotometer', 'Fume Hoods'],
                software: ['ChemDraw', 'Gaussian', 'ChemSketch'],
                labIncharge: 'Dr. Pooja Patel',
                location: 'Chemistry Block, Ground Floor',
                status: 'active',
                utilizationRate: 80
            },
            {
                labId: 'LAB016',
                labName: 'Organic Chemistry Lab',
                labType: 'Chemistry Lab',
                capacity: 15,
                equipment: ['Distillation Setup', 'Rotary Evaporator', 'Hot Plates', 'Glassware'],
                software: ['ChemDraw', 'MarvinSketch', 'Reaxys'],
                labIncharge: 'Prof. Suresh Modi',
                location: 'Chemistry Block, 1st Floor',
                status: 'active',
                utilizationRate: 75
            }
        ],
        totalLabCapacity: 35,
        activeLabsCount: 2,
        avgLabUtilization: 78
    }
];

let filteredDepartments = [...DEPARTMENTS_DATA];
let selectedDepartments = new Set();
let editingDepartmentId = null;
let currentView = 'table';

function saveDataToStorage() {
    localStorage.setItem('scms_departments_data', JSON.stringify(DEPARTMENTS_DATA));
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    loadDepartments();
    updateStats();
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    });
});

function loadCurrentUser() {
    const currentUser = localStorage.getItem('scms_current_user');
    const userNameElement = document.getElementById('userName');
    
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

    if (userNameElement) {
        userNameElement.textContent = user.name;
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('scms_current_user');
        showNotification('Logged out successfully', 'info');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    }
}

function updateStats() {
    const totalDepartments = DEPARTMENTS_DATA.length;
    const activeDepartments = DEPARTMENTS_DATA.filter(d => d.status === 'active').length;
    const totalFaculty = DEPARTMENTS_DATA.reduce((sum, d) => sum + (parseInt(d.facultyCount) || 0), 0);
    const totalStudents = DEPARTMENTS_DATA.reduce((sum, d) => sum + (parseInt(d.currentStudents) || 0), 0);
    const totalLabs = DEPARTMENTS_DATA.reduce((sum, d) => sum + (d.activeLabsCount || 0), 0);
    const totalLabCapacity = DEPARTMENTS_DATA.reduce((sum, d) => sum + (d.totalLabCapacity || 0), 0);
    
    const totalElement = document.getElementById('totalDepartments');
    const activeElement = document.getElementById('activeDepartments');  
    const facultyElement = document.getElementById('totalFaculty');
    const studentsElement = document.getElementById('totalStudents');
    
    if (totalElement) totalElement.textContent = totalDepartments.toLocaleString();
    if (activeElement) activeElement.textContent = activeDepartments.toLocaleString();
    if (facultyElement) facultyElement.textContent = totalFaculty.toLocaleString();
    if (studentsElement) studentsElement.textContent = totalStudents.toLocaleString();
    
    // Update lab statistics if elements exist
    const totalLabsElement = document.getElementById('totalLabs');
    const labCapacityElement = document.getElementById('totalLabCapacity');
    if (totalLabsElement) totalLabsElement.textContent = totalLabs.toLocaleString();
    if (labCapacityElement) labCapacityElement.textContent = totalLabCapacity.toLocaleString();
}

function switchView(view) {
    currentView = view;
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');
    const departmentsContainer = document.getElementById('departmentsContainer');
    const tableContainer = document.getElementById('tableContainer');
    
    if (!cardViewBtn || !tableViewBtn || !departmentsContainer || !tableContainer) return;
    
    if (view === 'card') {
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        departmentsContainer.style.display = 'grid';
        tableContainer.style.display = 'none';
        loadDepartmentCards();
    } else {
        tableViewBtn.classList.add('active');
        cardViewBtn.classList.remove('active');
        departmentsContainer.style.display = 'none';
        tableContainer.style.display = 'block';
        loadDepartmentTable();
    }
}

function loadDepartments() {
    if (currentView === 'card') {
        loadDepartmentCards();
    } else {
        loadDepartmentTable();
    }
    updateSelectedCount();
}

function loadDepartmentCards() {
    const container = document.getElementById('departmentsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (filteredDepartments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-building fa-3x"></i>
                <h3>No Departments Found</h3>
                <p>No departments match your current filters.</p>
            </div>
        `;
        return;
    }
    
    filteredDepartments.forEach(department => {
        const departmentCard = createDepartmentCard(department);
        container.appendChild(departmentCard);
    });
}

function loadDepartmentTable() {
    const tbody = document.getElementById('departmentsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    filteredDepartments.forEach(department => {
        const row = createDepartmentTableRow(department);
        tbody.appendChild(row);
    });
}

function createDepartmentCard(department) {
    const card = document.createElement('div');
    card.className = `department-card ${department.type.toLowerCase()}`;
    
    const statusClass = `status-${department.status.replace('-', '-')}`;
    const labsCount = department.labs ? department.labs.length : 0;
    const avgUtilization = department.avgLabUtilization || 0;
    
    card.innerHTML = `
        <div class="department-card-header">
            <div class="department-title">${department.name}</div>
            <div class="department-code">${department.code} • ${department.type}</div>
        </div>
        
        <div class="department-card-body">
            <div class="department-stats">
                <div class="stat-item">
                    <div class="number">${department.facultyCount || 0}</div>
                    <div class="label">Faculty</div>
                </div>
                <div class="stat-item">
                    <div class="number">${department.currentStudents || 0}</div>
                    <div class="label">Students</div>
                </div>
                <div class="stat-item">
                    <div class="number">${labsCount}</div>
                    <div class="label">Labs</div>
                </div>
            </div>
            
            <div class="lab-info">
                <div class="info-row">
                    <span class="info-label">Lab Capacity:</span>
                    <span class="info-value">${department.totalLabCapacity || 0} seats</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Lab Utilization:</span>
                    <span class="info-value">${avgUtilization}%</span>
                </div>
            </div>
            
            <div class="department-info">
                <div class="info-row">
                    <span class="info-label">Head of Department:</span>
                    <span class="info-value">${department.hodName || 'Not assigned'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Student Capacity:</span>
                    <span class="info-value">${department.studentCapacity || 0}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value status-badge ${statusClass}">
                        ${department.status.replace('-', ' ').toUpperCase()}
                    </span>
                </div>
            </div>
            
            <div class="department-actions">
                <button class="action-btn action-view" onclick="showDepartmentDetails('${department.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn action-edit" onclick="editDepartment('${department.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn action-delete" onclick="deleteDepartment('${department.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function createDepartmentTableRow(department) {
    const row = document.createElement('tr');
    const statusClass = `status-${department.status.replace('-', '-')}`;
    const typeClass = department.type.toLowerCase();
    const labsCount = department.labs ? department.labs.length : 0;
    
    row.innerHTML = `
        <td>
            <input type="checkbox" class="department-checkbox" value="${department.id}" onchange="toggleDepartmentSelection('${department.id}')">
        </td>
        <td>
            <div class="department-profile">
                <div class="dept-icon ${typeClass}">
                    ${department.code}
                </div>
                <div class="department-info-text">
                    <h4>${department.name}</h4>
                    <p>${department.type} • Est. ${department.establishedYear || 'N/A'}</p>
                    <p style="font-size: 0.8em; opacity: 0.8;">${labsCount} Labs • ${department.totalLabCapacity || 0} Capacity</p>
                </div>
            </div>
        </td>
        <td>
            <div>${department.hodName || 'Not assigned'}</div>
            <div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 2px;">
                ${department.hodEmail || 'No email'}
            </div>
        </td>
        <td>
            <span class="count-badge">${department.facultyCount || 0} Faculty</span>
        </td>
        <td>
            <div>${department.currentStudents || 0} / ${department.studentCapacity || 0}</div>
            <div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 2px;">
                ${department.currentStudents && department.studentCapacity ? 
                    Math.round((department.currentStudents / department.studentCapacity) * 100) : 0}% occupied
            </div>
        </td>
        <td>
            <div>${labsCount} Labs</div>
            <div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 2px;">
                ${department.avgLabUtilization || 0}% avg utilization
            </div>
        </td>
        <td>
            <span class="status-badge ${statusClass}">
                ${department.status.replace('-', ' ').charAt(0).toUpperCase() + department.status.replace('-', ' ').slice(1)}
            </span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="action-btn action-view" onclick="showDepartmentDetails('${department.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn action-edit" onclick="editDepartment('${department.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn action-delete" onclick="deleteDepartment('${department.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

function searchDepartments() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    applyFilters(searchTerm);
}

function filterDepartments() {
    applyFilters();
}

function applyFilters(searchTerm = '') {
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const searchInput = document.getElementById('searchInput');
    
    const statusValue = statusFilter ? statusFilter.value : '';
    const typeValue = typeFilter ? typeFilter.value : '';
    
    if (!searchTerm && searchInput) {
        searchTerm = searchInput.value.toLowerCase();
    }
    
    filteredDepartments = DEPARTMENTS_DATA.filter(department => {
        const matchesSearch = !searchTerm || 
            department.name.toLowerCase().includes(searchTerm) ||
            department.code.toLowerCase().includes(searchTerm) ||
            department.type.toLowerCase().includes(searchTerm) ||
            (department.hodName && department.hodName.toLowerCase().includes(searchTerm)) ||
            (department.labs && department.labs.some(lab => 
                lab.labName.toLowerCase().includes(searchTerm) ||
                lab.labType.toLowerCase().includes(searchTerm) ||
                lab.labIncharge.toLowerCase().includes(searchTerm)
            ));
        
        const matchesStatus = !statusValue || department.status === statusValue;
        const matchesType = !typeValue || department.type === typeValue;
        
        return matchesSearch && matchesStatus && matchesType;
    });
    
    loadDepartments();
    
    if (searchTerm || statusValue || typeValue) {
        showNotification(`Found ${filteredDepartments.length} departments matching your criteria`, 'info');
    }
}

function toggleDepartmentSelection(departmentId) {
    if (selectedDepartments.has(departmentId)) {
        selectedDepartments.delete(departmentId);
    } else {
        selectedDepartments.add(departmentId);
    }
    updateSelectedCount();
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const isChecked = selectAll ? selectAll.checked : false;
    const checkboxes = document.querySelectorAll('.department-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        if (isChecked) {
            selectedDepartments.add(checkbox.value);
        } else {
            selectedDepartments.delete(checkbox.value);
        }
    });
    
    updateSelectedCount();
}

function toggleMasterCheckbox() {
    const masterCheckbox = document.getElementById('masterCheckbox');
    const isChecked = masterCheckbox ? masterCheckbox.checked : false;
    const checkboxes = document.querySelectorAll('.department-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        if (isChecked) {
            selectedDepartments.add(checkbox.value);
        } else {
            selectedDepartments.delete(checkbox.value);
        }
    });
    
    updateSelectedCount();
}

function updateSelectedCount() {
    const selectedCountElement = document.getElementById('selectedCount');
    if (selectedCountElement) {
        selectedCountElement.textContent = 
            `${selectedDepartments.size} departments selected`;
    }
    
    const totalCheckboxes = document.querySelectorAll('.department-checkbox').length;
    const masterCheckbox = document.getElementById('masterCheckbox');
    
    if (masterCheckbox) {
        if (selectedDepartments.size === 0) {
            masterCheckbox.indeterminate = false;
            masterCheckbox.checked = false;
        } else if (selectedDepartments.size === totalCheckboxes) {
            masterCheckbox.indeterminate = false;
            masterCheckbox.checked = true;
        } else {
            masterCheckbox.indeterminate = true;
            masterCheckbox.checked = false;
        }
    }
}

function openAddDepartmentModal() {
    editingDepartmentId = null;
    const modalTitle = document.getElementById('modalTitle');
    const departmentForm = document.getElementById('departmentForm');
    const departmentModal = document.getElementById('departmentModal');
    
    if (modalTitle) modalTitle.textContent = 'Add New Department';
    if (departmentForm) departmentForm.reset();
    if (departmentModal) departmentModal.classList.add('show');
}

function editDepartment(departmentId) {
    const department = DEPARTMENTS_DATA.find(d => d.id === departmentId);
    if (!department) return;
    
    editingDepartmentId = departmentId;
    const modalTitle = document.getElementById('modalTitle');
    const departmentModal = document.getElementById('departmentModal');
    
    if (modalTitle) modalTitle.textContent = 'Edit Department';
    
    const fields = [
        'departmentName', 'departmentCode', 'departmentType', 'establishedYear', 'departmentDescription',
        'hodName', 'hodEmail', 'departmentPhone', 'departmentEmail', 'officeLocation',
        'facultyCount', 'studentCapacity', 'currentStudents', 'departmentStatus'
    ];
    
    const fieldMapping = {
        'departmentName': 'name',
        'departmentCode': 'code',
        'departmentType': 'type',
        'establishedYear': 'establishedYear',
        'departmentDescription': 'description',
        'hodName': 'hodName',
        'hodEmail': 'hodEmail',
        'departmentPhone': 'departmentPhone',
        'departmentEmail': 'departmentEmail',
        'officeLocation': 'officeLocation',
        'facultyCount': 'facultyCount',
        'studentCapacity': 'studentCapacity',
        'currentStudents': 'currentStudents',
        'departmentStatus': 'status'
    };
    
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        const dataKey = fieldMapping[fieldId];
        if (element && department[dataKey] !== undefined) {
            element.value = department[dataKey] || '';
        }
    });
    
    if (departmentModal) departmentModal.classList.add('show');
}

function deleteDepartment(departmentId) {
    const department = DEPARTMENTS_DATA.find(d => d.id === departmentId);
    if (!department) return;
    
    if (confirm(`Are you sure you want to delete ${department.name}? This action cannot be undone.`)) {
        const index = DEPARTMENTS_DATA.findIndex(d => d.id === departmentId);
        if (index !== -1) {
            DEPARTMENTS_DATA.splice(index, 1);
            filteredDepartments = filteredDepartments.filter(d => d.id !== departmentId);
            selectedDepartments.delete(departmentId);
            
            saveDataToStorage();
            loadDepartments();
            updateStats();
            showNotification(`${department.name} has been deleted successfully`, 'success');
        }
    }
}

function saveDepartment(event) {
    event.preventDefault();
    
    const getElementValue = (id) => {
        const element = document.getElementById(id);
        return element ? element.value.trim() : '';
    };
    
    const formData = {
        name: getElementValue('departmentName'),
        code: getElementValue('departmentCode'),
        type: getElementValue('departmentType'),
        description: getElementValue('departmentDescription'),
        establishedYear: getElementValue('establishedYear'),
        hodName: getElementValue('hodName'),
        hodEmail: getElementValue('hodEmail'),
        departmentPhone: getElementValue('departmentPhone'),
        departmentEmail: getElementValue('departmentEmail'),
        officeLocation: getElementValue('officeLocation'),
        facultyCount: getElementValue('facultyCount'),
        studentCapacity: getElementValue('studentCapacity'),
        currentStudents: getElementValue('currentStudents'),
        status: getElementValue('departmentStatus')
    };
    
    if (!formData.name || !formData.code || !formData.type) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    if (editingDepartmentId) {
        const departmentIndex = DEPARTMENTS_DATA.findIndex(d => d.id === editingDepartmentId);
        if (departmentIndex !== -1) {
            // Preserve existing lab data when editing
            const existingLabs = DEPARTMENTS_DATA[departmentIndex].labs || [];
            DEPARTMENTS_DATA[departmentIndex] = { 
                ...DEPARTMENTS_DATA[departmentIndex], 
                ...formData,
                labs: existingLabs,
                activeLabsCount: existingLabs.length,
                totalLabCapacity: existingLabs.reduce((sum, lab) => sum + (lab.capacity || 0), 0),
                avgLabUtilization: existingLabs.length > 0 ? 
                    Math.round(existingLabs.reduce((sum, lab) => sum + (lab.utilizationRate || 0), 0) / existingLabs.length) : 0
            };
            showNotification(`${formData.name} updated successfully`, 'success');
        }
    } else {
        const existingCode = DEPARTMENTS_DATA.find(d => d.code === formData.code);
        if (existingCode) {
            showNotification('Department code already exists', 'error');
            return;
        }
        
        const newDepartment = {
            id: 'DEPT' + String(Date.now()).slice(-6),
            ...formData,
            labs: [],
            totalLabCapacity: 0,
            activeLabsCount: 0,
            avgLabUtilization: 0
        };
        
        DEPARTMENTS_DATA.push(newDepartment);
        showNotification(`${formData.name} added successfully`, 'success');
    }
    
    saveDataToStorage();
    closeModal();
    applyFilters();
    updateStats();
}

function showDepartmentDetails(departmentId) {
    const department = DEPARTMENTS_DATA.find(d => d.id === departmentId);
    if (!department) return;
    
    const detailsTitle = document.getElementById('departmentDetailsTitle');
    const detailsContent = document.getElementById('departmentDetailsContent');
    const detailsModal = document.getElementById('departmentDetailsModal');
    
    if (detailsTitle) detailsTitle.textContent = `${department.name} - Department Details`;
    
    if (detailsContent) {
        const labs = department.labs || [];
        
        detailsContent.innerHTML = `
            <div class="department-details-view">
                <div class="detail-section">
                    <h4><i class="fas fa-building"></i> Department Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Department Name:</label>
                            <span>${department.name}</span>
                        </div>
                        <div class="detail-item">
                            <label>Department Code:</label>
                            <span>${department.code}</span>
                        </div>
                        <div class="detail-item">
                            <label>Department Type:</label>
                            <span class="type-badge">${department.type}</span>
                        </div>
                        <div class="detail-item">
                            <label>Established Year:</label>
                            <span>${department.establishedYear || 'Not specified'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Status:</label>
                            <span class="status-badge status-${department.status.replace('-', '-')}">
                                ${department.status.replace('-', ' ').charAt(0).toUpperCase() + department.status.replace('-', ' ').slice(1)}
                            </span>
                        </div>
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <label>Description:</label>
                            <span>${department.description || 'No description available'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-user-tie"></i> Leadership & Contact</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Head of Department:</label>
                            <span>${department.hodName || 'Not assigned'}</span>
                        </div>
                        <div class="detail-item">
                            <label>HOD Email:</label>
                            <span>${department.hodEmail || 'Not provided'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Department Phone:</label>
                            <span>${department.departmentPhone || 'Not provided'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Department Email:</label>
                            <span>${department.departmentEmail || 'Not provided'}</span>
                        </div>
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <label>Office Location:</label>
                            <span>${department.officeLocation || 'Not specified'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-chart-bar"></i> Department Statistics</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Faculty Count:</label>
                            <span class="count-badge">${department.facultyCount || 0} Faculty</span>
                        </div>
                        <div class="detail-item">
                            <label>Student Capacity:</label>
                            <span>${department.studentCapacity || 0} students</span>
                        </div>
                        <div class="detail-item">
                            <label>Current Students:</label>
                            <span>${department.currentStudents || 0} students</span>
                        </div>
                        <div class="detail-item">
                            <label>Occupancy Rate:</label>
                            <span>${department.currentStudents && department.studentCapacity ? 
                                Math.round((department.currentStudents / department.studentCapacity) * 100) : 0}%</span>
                        </div>
                        <div class="detail-item">
                            <label>Total Labs:</label>
                            <span class="count-badge">${labs.length} Labs</span>
                        </div>
                        <div class="detail-item">
                            <label>Lab Capacity:</label>
                            <span>${department.totalLabCapacity || 0} seats</span>
                        </div>
                        <div class="detail-item">
                            <label>Avg Lab Utilization:</label>
                            <span>${department.avgLabUtilization || 0}%</span>
                        </div>
                    </div>
                </div>
                
                ${labs.length > 0 ? `
                <div class="detail-section">
                    <h4><i class="fas fa-flask"></i> Laboratory Information</h4>
                    <div class="labs-grid">
                        ${labs.map(lab => `
                            <div class="lab-card">
                                <div class="lab-header">
                                    <h5>${lab.labName}</h5>
                                    <span class="lab-type-badge">${lab.labType}</span>
                                </div>
                                <div class="lab-details">
                                    <div class="lab-detail-item">
                                        <label>Capacity:</label>
                                        <span>${lab.capacity} seats</span>
                                    </div>
                                    <div class="lab-detail-item">
                                        <label>In-charge:</label>
                                        <span>${lab.labIncharge}</span>
                                    </div>
                                    <div class="lab-detail-item">
                                        <label>Location:</label>
                                        <span>${lab.location}</span>
                                    </div>
                                    <div class="lab-detail-item">
                                        <label>Utilization:</label>
                                        <span class="utilization-badge">${lab.utilizationRate}%</span>
                                    </div>
                                    ${lab.equipment && lab.equipment.length > 0 ? `
                                    <div class="lab-detail-item" style="grid-column: 1 / -1;">
                                        <label>Equipment:</label>
                                        <span>${lab.equipment.slice(0, 3).join(', ')}${lab.equipment.length > 3 ? ` +${lab.equipment.length - 3} more` : ''}</span>
                                    </div>
                                    ` : ''}
                                    ${lab.software && lab.software.length > 0 ? `
                                    <div class="lab-detail-item" style="grid-column: 1 / -1;">
                                        <label>Software:</label>
                                        <span>${lab.software.slice(0, 3).join(', ')}${lab.software.length > 3 ? ` +${lab.software.length - 3} more` : ''}</span>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : `
                <div class="detail-section">
                    <h4><i class="fas fa-flask"></i> Laboratory Information</h4>
                    <div class="empty-lab-state">
                        <i class="fas fa-flask fa-2x"></i>
                        <p>No laboratories assigned to this department</p>
                    </div>
                </div>
                `}
            </div>
        `;
    }
    
    if (detailsModal) detailsModal.classList.add('show');
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
    editingDepartmentId = null;
}

function bulkAction(action) {
    if (selectedDepartments.size === 0) {
        showNotification('No departments selected', 'error');
        return;
    }
    
    const actionText = action === 'activate' ? 'activate' : 'deactivate';
    const newStatus = action === 'activate' ? 'active' : 'inactive';
    
    if (confirm(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} ${selectedDepartments.size} selected departments?`)) {
        let updatedCount = 0;
        DEPARTMENTS_DATA.forEach(department => {
            if (selectedDepartments.has(department.id)) {
                department.status = newStatus;
                updatedCount++;
            }
        });
        
        selectedDepartments.clear();
        const checkboxes = document.querySelectorAll('.department-checkbox, #selectAll, #masterCheckbox');
        checkboxes.forEach(cb => cb.checked = false);
        
        saveDataToStorage();
        loadDepartments(); 
        updateStats();
        showNotification(`${updatedCount} departments ${actionText}d successfully`, 'success');
    }
}

function exportSelected() {
    if (selectedDepartments.size === 0) {
        showNotification('No departments selected for export', 'error');
        return;
    }
    
    const selectedData = DEPARTMENTS_DATA.filter(dept => selectedDepartments.has(dept.id));
    const csvContent = convertToCSV(selectedData);
    downloadCSV(csvContent, 'selected_departments.csv');
    
    showNotification(`${selectedDepartments.size} departments exported successfully!`, 'success');
}

function importDepartments() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                let importedData;
                if (file.name.endsWith('.json')) {
                    importedData = JSON.parse(e.target.result);
                } else {
                    importedData = parseCSV(e.target.result);
                }
                
                if (Array.isArray(importedData) && importedData.length > 0) {
                    let addedCount = 0;
                    importedData.forEach(deptData => {
                        const existingCode = DEPARTMENTS_DATA.find(d => d.code === deptData.code);
                        
                        if (!existingCode && deptData.name && deptData.code) {
                            const newDepartment = {
                                id: 'DEPT' + String(Date.now() + addedCount).slice(-6),
                                ...deptData,
                                status: deptData.status || 'active',
                                labs: deptData.labs || [],
                                totalLabCapacity: 0,
                                activeLabsCount: 0,
                                avgLabUtilization: 0
                            };
                            
                            // Calculate lab statistics
                            if (newDepartment.labs && newDepartment.labs.length > 0) {
                                newDepartment.activeLabsCount = newDepartment.labs.length;
                                newDepartment.totalLabCapacity = newDepartment.labs.reduce((sum, lab) => sum + (lab.capacity || 0), 0);
                                newDepartment.avgLabUtilization = Math.round(
                                    newDepartment.labs.reduce((sum, lab) => sum + (lab.utilizationRate || 0), 0) / newDepartment.labs.length
                                );
                            }
                            
                            DEPARTMENTS_DATA.push(newDepartment);
                            addedCount++;
                        }
                    });
                    
                    if (addedCount > 0) {
                        saveDataToStorage();
                        applyFilters();
                        updateStats();
                        showNotification(`${addedCount} departments imported successfully!`, 'success');
                    } else {
                        showNotification('No new departments to import (duplicates found)', 'error');
                    }
                } else {
                    showNotification('Invalid file format', 'error');
                }
            } catch (error) {
                showNotification('Error reading file', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportDepartments() {
    if (DEPARTMENTS_DATA.length === 0) {
        showNotification('No departments to export', 'error');
        return;
    }
    
    const csvContent = convertToCSV(DEPARTMENTS_DATA);
    downloadCSV(csvContent, 'all_departments.csv');
    
    showNotification('All department data exported successfully!', 'success');
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    // Flatten lab data for CSV export
    const flattenedData = data.map(dept => {
        const { labs, ...deptData } = dept;
        return {
            ...deptData,
            labsCount: labs ? labs.length : 0,
            labNames: labs ? labs.map(lab => lab.labName).join('; ') : '',
            labCapacities: labs ? labs.map(lab => lab.capacity).join('; ') : '',
            labUtilization: labs ? labs.map(lab => lab.utilizationRate).join('; ') : ''
        };
    });
    
    const headers = Object.keys(flattenedData[0]).join(',');
    const rows = flattenedData.map(row => 
        Object.values(row).map(value => 
            typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(',')
    );
    
    return [headers, ...rows].join('\n');
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index] || '';
        });
        
        // Reconstruct lab data if present
        if (obj.labNames && obj.labCapacities) {
            const labNames = obj.labNames.split(';');
            const labCapacities = obj.labCapacities.split(';');
            const labUtilization = obj.labUtilization ? obj.labUtilization.split(';') : [];
            
            obj.labs = labNames.map((name, index) => ({
                labId: 'LAB' + String(Date.now() + index).slice(-6),
                labName: name.trim(),
                labType: 'Computer Lab',
                capacity: parseInt(labCapacities[index]) || 0,
                utilizationRate: parseInt(labUtilization[index]) || 0,
                equipment: [],
                software: [],
                labIncharge: 'TBD',
                location: 'TBD',
                status: 'active'
            }));
            
            obj.totalLabCapacity = obj.labs.reduce((sum, lab) => sum + lab.capacity, 0);
            obj.activeLabsCount = obj.labs.length;
            obj.avgLabUtilization = obj.labs.length > 0 ? 
                Math.round(obj.labs.reduce((sum, lab) => sum + lab.utilizationRate, 0) / obj.labs.length) : 0;
        } else {
            obj.labs = [];
            obj.totalLabCapacity = 0;
            obj.activeLabsCount = 0;
            obj.avgLabUtilization = 0;
        }
        
        // Clean up CSV-specific fields
        delete obj.labsCount;
        delete obj.labNames;
        delete obj.labCapacities;
        delete obj.labUtilization;
        
        data.push(obj);
    }
    
    return data;
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function refreshDepartments() {
    showNotification('Refreshing department data...', 'info');
    
    setTimeout(() => {
        loadDepartments();
        updateStats();
        showNotification('Department data refreshed successfully!', 'success');
    }, 1000);
}

// Lab Management Functions
function addLabToDepartment(departmentId, labData) {
    const departmentIndex = DEPARTMENTS_DATA.findIndex(d => d.id === departmentId);
    if (departmentIndex !== -1) {
        if (!DEPARTMENTS_DATA[departmentIndex].labs) {
            DEPARTMENTS_DATA[departmentIndex].labs = [];
        }
        
        const newLab = {
            labId: 'LAB' + String(Date.now()).slice(-6),
            ...labData,
            status: labData.status || 'active'
        };
        
        DEPARTMENTS_DATA[departmentIndex].labs.push(newLab);
        
        // Update lab statistics
        updateDepartmentLabStats(departmentIndex);
        
        saveDataToStorage();
        return newLab;
    }
    return null;
}

function updateDepartmentLabStats(departmentIndex) {
    const department = DEPARTMENTS_DATA[departmentIndex];
    if (department.labs && department.labs.length > 0) {
        department.activeLabsCount = department.labs.filter(lab => lab.status === 'active').length;
        department.totalLabCapacity = department.labs.reduce((sum, lab) => sum + (lab.capacity || 0), 0);
        department.avgLabUtilization = Math.round(
            department.labs.reduce((sum, lab) => sum + (lab.utilizationRate || 0), 0) / department.labs.length
        );
    } else {
        department.activeLabsCount = 0;
        department.totalLabCapacity = 0;
        department.avgLabUtilization = 0;
    }
}

function removeLabFromDepartment(departmentId, labId) {
    const departmentIndex = DEPARTMENTS_DATA.findIndex(d => d.id === departmentId);
    if (departmentIndex !== -1 && DEPARTMENTS_DATA[departmentIndex].labs) {
        DEPARTMENTS_DATA[departmentIndex].labs = DEPARTMENTS_DATA[departmentIndex].labs.filter(lab => lab.labId !== labId);
        updateDepartmentLabStats(departmentIndex);
        saveDataToStorage();
        return true;
    }
    return false;
}

function getLabsByDepartment(departmentId) {
    const department = DEPARTMENTS_DATA.find(d => d.id === departmentId);
    return department ? (department.labs || []) : [];
}

function showNotification(message, type) {
    const existingNotification = document.querySelector('.notification.show');
    if (existingNotification) {
        existingNotification.remove();
    }
    
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
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, 4000);
}

document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (window.innerWidth <= 768 && 
        sidebar && sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
        closeMobileSidebar();
    }
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeMobileSidebar();
    }
});

window.addEventListener('beforeunload', function() {
    saveDataToStorage();
});

setTimeout(() => {
    if (document.getElementById('tableViewBtn')) {
        switchView('table');
    }
}, 100);
