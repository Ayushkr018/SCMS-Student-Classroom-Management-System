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

// Lab Data Management
let LABS_DATA = JSON.parse(localStorage.getItem('scms_labs_data')) || [
    {
        id: 'LAB001',
        name: 'Advanced Programming Lab',
        code: 'CSE-LAB-001',
        type: 'Computer Lab',
        department: 'CSE',
        capacity: 30,
        location: 'CSE Block, Ground Floor',
        description: 'State-of-the-art programming laboratory with latest software and hardware for computer science students.',
        incharge: 'Prof. Rajesh Kumar',
        contact: '+91-98765-43210',
        assistant: 'Mr. Tech Support',
        operatingHours: '9:00 AM - 5:00 PM',
        equipment: ['30 Desktop PCs', 'Projector', 'Whiteboard', 'Air Conditioning', 'UPS Backup', 'Network Switch'],
        software: ['Visual Studio 2022', 'MySQL Workbench', 'Eclipse IDE', 'IntelliJ IDEA', 'Git', 'VS Code'],
        safetyEquipment: ['Fire Extinguisher', 'First Aid Kit', 'Emergency Exit'],
        specialFeatures: ['Smart Board', 'Document Camera', 'Audio System'],
        utilizationRate: 85,
        status: 'active',
        lastMaintenance: '2024-01-10',
        nextMaintenance: '2024-03-10',
        currentBookings: [
            {
                date: '2024-01-15',
                startTime: '10:00',
                endTime: '12:00',
                purpose: 'Data Structures Lab',
                faculty: 'Dr. Smith',
                students: 28
            }
        ]
    },
    {
        id: 'LAB002',
        name: 'Database Systems Lab',
        code: 'CSE-LAB-002',
        type: 'Computer Lab',
        department: 'CSE',
        capacity: 25,
        location: 'CSE Block, 1st Floor',
        description: 'Dedicated laboratory for database management systems with enterprise-grade database servers.',
        incharge: 'Dr. Priya Singh',
        contact: '+91-98765-43211',
        assistant: 'Ms. Database Admin',
        operatingHours: '9:00 AM - 5:00 PM',
        equipment: ['25 Laptops', 'Database Server', 'Network Equipment', 'Backup Systems'],
        software: ['Oracle 19c', 'MySQL', 'MongoDB', 'PostgreSQL', 'SQL Server'],
        safetyEquipment: ['Fire Extinguisher', 'First Aid Kit'],
        specialFeatures: ['Server Rack', 'Backup Systems'],
        utilizationRate: 78,
        status: 'active',
        lastMaintenance: '2024-01-05',
        nextMaintenance: '2024-03-05',
        currentBookings: []
    },
    {
        id: 'LAB003',
        name: 'Electronics Simulation Lab',
        code: 'ECE-LAB-001',
        type: 'Electronics Lab',
        department: 'ECE',
        capacity: 30,
        location: 'ECE Block, Ground Floor',
        description: 'Modern electronics laboratory with simulation software and measurement instruments.',
        incharge: 'Prof. Ravi Kumar',
        contact: '+91-98765-43212',
        assistant: 'Mr. Electronics Tech',
        operatingHours: '9:00 AM - 5:00 PM',
        equipment: ['Oscilloscopes', 'Function Generators', 'Multimeters', 'Power Supplies', 'Breadboards'],
        software: ['MATLAB', 'Proteus', 'Multisim', 'SPICE'],
        safetyEquipment: ['Fire Extinguisher', 'First Aid Kit', 'Safety Glasses'],
        specialFeatures: ['Component Storage', 'Soldering Station'],
        utilizationRate: 82,
        status: 'active',
        lastMaintenance: '2023-12-20',
        nextMaintenance: '2024-02-20',
        currentBookings: []
    },
    {
        id: 'LAB004',
        name: 'Digital Signal Processing Lab',
        code: 'ECE-LAB-002',
        type: 'Electronics Lab',
        department: 'ECE',
        capacity: 25,
        location: 'ECE Block, 1st Floor',
        description: 'Specialized laboratory for digital signal processing with advanced DSP processors.',
        incharge: 'Dr. Sunita Mehta',
        contact: '+91-98765-43213',
        assistant: 'Mr. DSP Specialist',
        operatingHours: '9:00 AM - 5:00 PM',
        equipment: ['DSP Processors', 'Signal Generators', 'Spectrum Analyzers', 'Computer Workstations'],
        software: ['LabVIEW', 'GNU Radio', 'ADS', 'MATLAB DSP Toolbox'],
        safetyEquipment: ['Fire Extinguisher', 'First Aid Kit'],
        specialFeatures: ['Signal Processing Hardware', 'RF Equipment'],
        utilizationRate: 75,
        status: 'maintenance',
        lastMaintenance: '2024-01-12',
        nextMaintenance: '2024-01-15',
        currentBookings: []
    },
    {
        id: 'LAB005',
        name: 'Manufacturing Workshop',
        code: 'MECH-LAB-001',
        type: 'Workshop Lab',
        department: 'MECH',
        capacity: 20,
        location: 'Mech Workshop, Ground Floor',
        description: 'Complete manufacturing workshop with CNC machines and traditional machining tools.',
        incharge: 'Prof. Vikram Singh',
        contact: '+91-98765-43214',
        assistant: 'Mr. Workshop Supervisor',
        operatingHours: '9:00 AM - 4:00 PM',
        equipment: ['CNC Machines', 'Lathes', 'Milling Machines', 'Drilling Machines', 'Grinding Machines'],
        software: ['AutoCAD', 'SolidWorks', 'CATIA', 'Mastercam'],
        safetyEquipment: ['Safety Helmets', 'Safety Glasses', 'First Aid Kit', 'Fire Extinguisher', 'Emergency Shower'],
        specialFeatures: ['Tool Storage', 'Material Storage', 'Crane System'],
        utilizationRate: 88,
        status: 'active',
        lastMaintenance: '2024-01-08',
        nextMaintenance: '2024-02-08',
        currentBookings: []
    },
    {
        id: 'LAB006',
        name: 'Thermal Engineering Lab',
        code: 'MECH-LAB-002',
        type: 'Research Lab',
        department: 'MECH',
        capacity: 15,
        location: 'Mech Block, 1st Floor',
        description: 'Research laboratory for thermal systems with heat transfer and thermodynamics equipment.',
        incharge: 'Dr. Meera Patel',
        contact: '+91-98765-43215',
        assistant: 'Mr. Thermal Specialist',
        operatingHours: '9:00 AM - 5:00 PM',
        equipment: ['Heat Exchangers', 'IC Engine Setup', 'Boiler Models', 'Refrigeration Units', 'Temperature Sensors'],
        software: ['ANSYS Fluent', 'MATLAB', 'AutoCAD', 'Thermal Analysis Software'],
        safetyEquipment: ['Fire Extinguisher', 'First Aid Kit', 'Safety Valve', 'Temperature Monitors'],
        specialFeatures: ['Thermal Chamber', 'Data Acquisition System'],
        utilizationRate: 70,
        status: 'active',
        lastMaintenance: '2024-01-01',
        nextMaintenance: '2024-03-01',
        currentBookings: []
    },
    {
        id: 'LAB007',
        name: 'Analytical Chemistry Lab',
        code: 'CHEM-LAB-001',
        type: 'Chemistry Lab',
        department: 'CHEM',
        capacity: 20,
        location: 'Chemistry Block, Ground Floor',
        description: 'Advanced analytical chemistry laboratory with modern instrumentation and fume hoods.',
        incharge: 'Dr. Pooja Patel',
        contact: '+91-98765-43216',
        assistant: 'Ms. Lab Technician',
        operatingHours: '9:00 AM - 4:00 PM',
        equipment: ['HPLC', 'GC-MS', 'UV-Vis Spectrophotometer', 'Fume Hoods', 'Balance', 'pH Meters'],
        software: ['ChemDraw', 'Gaussian', 'ChemSketch', 'Lab Data Software'],
        safetyEquipment: ['Fume Hoods', 'Emergency Shower', 'Eye Wash Station', 'Fire Extinguisher', 'Spill Kits'],
        specialFeatures: ['Chemical Storage', 'Waste Disposal System', 'Ventilation System'],
        utilizationRate: 80,
        status: 'active',
        lastMaintenance: '2024-01-03',
        nextMaintenance: '2024-02-03',
        currentBookings: []
    },
    {
        id: 'LAB008',
        name: 'Physics Research Lab',
        code: 'PHY-LAB-001',
        type: 'Physics Lab',
        department: 'PHY',
        capacity: 15,
        location: 'Physics Block, Ground Floor',
        description: 'Research laboratory for experimental physics with optical and electronic equipment.',
        incharge: 'Dr. Ravi Kumar',
        contact: '+91-98765-43217',
        assistant: 'Mr. Physics Tech',
        operatingHours: '9:00 AM - 5:00 PM',
        equipment: ['Lasers', 'Optical Benches', 'Spectrometers', 'Interferometers', 'Oscilloscopes'],
        software: ['LabVIEW', 'Origin', 'MATLAB', 'Physics Simulation Software'],
        safetyEquipment: ['Laser Safety Glasses', 'First Aid Kit', 'Fire Extinguisher'],
        specialFeatures: ['Dark Room', 'Vibration Isolation Table', 'Optical Equipment'],
        utilizationRate: 68,
        status: 'active',
        lastMaintenance: '2023-12-15',
        nextMaintenance: '2024-02-15',
        currentBookings: []
    }
];

let filteredLabs = [...LABS_DATA];
let selectedLabs = new Set();
let editingLabId = null;
let currentLabView = 'card';

function saveLabsToStorage() {
    localStorage.setItem('scms_labs_data', JSON.stringify(LABS_DATA));
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    loadLabs();
    updateLabStats();
    loadTodayActivities();
    populateLabSelects();
    
    // Auto-calculate end time when start time and duration change
    const startTimeInput = document.getElementById('bookingStartTime');
    const durationSelect = document.getElementById('bookingDuration');
    const endTimeInput = document.getElementById('bookingEndTime');
    
    if (startTimeInput && durationSelect && endTimeInput) {
        [startTimeInput, durationSelect].forEach(element => {
            element.addEventListener('change', function() {
                calculateEndTime();
            });
        });
    }
    
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
    if (user.role !== 'admin' && user.role !== 'faculty') {
        alert('Access denied. Admin or Faculty privileges required.');
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

function updateLabStats() {
    const totalLabs = LABS_DATA.length;
    const activeLabs = LABS_DATA.filter(lab => lab.status === 'active').length;
    const totalCapacity = LABS_DATA.reduce((sum, lab) => sum + (parseInt(lab.capacity) || 0), 0);
    const avgUtilization = LABS_DATA.length > 0 ? 
        LABS_DATA.reduce((sum, lab) => sum + (parseInt(lab.utilizationRate) || 0), 0) / LABS_DATA.length : 0;
    
    const totalElement = document.getElementById('totalLabs');
    const activeElement = document.getElementById('activeLabs');
    const capacityElement = document.getElementById('totalCapacity');
    const utilizationElement = document.getElementById('avgUtilization');
    
    if (totalElement) totalElement.textContent = totalLabs.toLocaleString();
    if (activeElement) activeElement.textContent = activeLabs.toLocaleString();
    if (capacityElement) capacityElement.textContent = totalCapacity.toLocaleString();
    if (utilizationElement) utilizationElement.textContent = Math.round(avgUtilization) + '%';
}

function loadTodayActivities() {
    // This would typically fetch real-time data from a server
    // For demo purposes, showing static data
    console.log('Loading today\'s lab activities...');
}

function populateLabSelects() {
    const bookingLabSelect = document.getElementById('bookingLab');
    const maintenanceLabSelect = document.getElementById('maintenanceLab');
    
    [bookingLabSelect, maintenanceLabSelect].forEach(select => {
        if (select) {
            select.innerHTML = '<option value="">Choose a lab</option>';
            LABS_DATA.forEach(lab => {
                const option = document.createElement('option');
                option.value = lab.id;
                option.textContent = `${lab.name} (${lab.department})`;
                select.appendChild(option);
            });
        }
    });
}

function switchLabView(view) {
    currentLabView = view;
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');
    const labsContainer = document.getElementById('labsContainer');
    const tableContainer = document.getElementById('labTableContainer');
    
    if (!cardViewBtn || !tableViewBtn || !labsContainer || !tableContainer) return;
    
    if (view === 'card') {
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        labsContainer.style.display = 'grid';
        tableContainer.style.display = 'none';
        loadLabCards();
    } else {
        tableViewBtn.classList.add('active');
        cardViewBtn.classList.remove('active');
        labsContainer.style.display = 'none';
        tableContainer.style.display = 'block';
        loadLabTable();
    }
}

function loadLabs() {
    if (currentLabView === 'card') {
        loadLabCards();
    } else {
        loadLabTable();
    }
    updateSelectedLabCount();
}

function loadLabCards() {
    const container = document.getElementById('labsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (filteredLabs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-flask fa-3x"></i>
                <h3>No Labs Found</h3>
                <p>No laboratories match your current filters.</p>
            </div>
        `;
        return;
    }
    
    filteredLabs.forEach(lab => {
        const labCard = createLabCard(lab);
        container.appendChild(labCard);
    });
}

function loadLabTable() {
    const tbody = document.getElementById('labsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    filteredLabs.forEach(lab => {
        const row = createLabTableRow(lab);
        tbody.appendChild(row);
    });
}

function createLabCard(lab) {
    const card = document.createElement('div');
    const typeClass = lab.type.toLowerCase().replace(/\s+/g, '-');
    card.className = `lab-card ${typeClass}`;
    
    const statusClass = `status-${lab.status}`;
    const utilizationClass = getUtilizationClass(lab.utilizationRate);
    
    card.innerHTML = `
        <div class="lab-card-header">
            <div class="lab-status-indicator ${lab.status}"></div>
            <div class="lab-title">${lab.name}</div>
            <div class="lab-subtitle">${lab.code} • ${lab.department}</div>
            <div class="lab-type-badge">${lab.type}</div>
        </div>
        
        <div class="lab-card-body">
            <div class="lab-stats-row">
                <div class="lab-stat-item">
                    <div class="lab-stat-number">${lab.capacity}</div>
                    <div class="lab-stat-label">Capacity</div>
                </div>
                <div class="lab-stat-item">
                    <div class="lab-stat-number">${lab.utilizationRate}%</div>
                    <div class="lab-stat-label">Utilization</div>
                </div>
                <div class="lab-stat-item">
                    <div class="lab-stat-number">${lab.equipment ? lab.equipment.length : 0}</div>
                    <div class="lab-stat-label">Equipment</div>
                </div>
            </div>
            
            <div class="utilization-bar">
                <div class="utilization-fill" style="width: ${lab.utilizationRate}%"></div>
            </div>
            
            <div class="lab-details-grid">
                <div class="lab-detail-item">
                    <span class="lab-detail-label">In-charge:</span>
                    <span class="lab-detail-value">${lab.incharge || 'Not assigned'}</span>
                </div>
                <div class="lab-detail-item">
                    <span class="lab-detail-label">Location:</span>
                    <span class="lab-detail-value">${lab.location}</span>
                </div>
                <div class="lab-detail-item">
                    <span class="lab-detail-label">Hours:</span>
                    <span class="lab-detail-value">${lab.operatingHours}</span>
                </div>
                <div class="lab-detail-item">
                    <span class="lab-detail-label">Status:</span>
                    <span class="lab-detail-value status-badge ${statusClass}">
                        ${lab.status.toUpperCase()}
                    </span>
                </div>
            </div>
            
            <div class="lab-actions">
                <button class="action-btn action-view" onclick="showLabDetails('${lab.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn action-book" onclick="bookLab('${lab.id}')">
                    <i class="fas fa-calendar-plus"></i> Book
                </button>
                <button class="action-btn action-edit" onclick="editLab('${lab.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn action-maintenance" onclick="scheduleMaintenance('${lab.id}')">
                    <i class="fas fa-tools"></i> Maintain
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function createLabTableRow(lab) {
    const row = document.createElement('tr');
    const typeClass = lab.type.toLowerCase().replace(/\s+/g, '-');
    const statusClass = `status-${lab.status}`;
    const utilizationClass = getUtilizationClass(lab.utilizationRate);
    
    row.innerHTML = `
        <td>
            <input type="checkbox" class="lab-checkbox" value="${lab.id}" onchange="toggleLabSelection('${lab.id}')">
        </td>
        <td>
            <div class="lab-profile">
                <div class="lab-icon ${typeClass}">
                    <i class="fas fa-flask"></i>
                </div>
                <div class="lab-info-text">
                    <h4>${lab.name}</h4>
                    <p>${lab.code} • ${lab.type}</p>
                    <p style="font-size: 0.8em; opacity: 0.8;">${lab.location}</p>
                </div>
            </div>
        </td>
        <td>
            <span class="department-badge">${lab.department}</span>
        </td>
        <td>
            <div class="capacity-info">
                <div class="capacity-number">${lab.capacity} seats</div>
                <div class="utilization-percent ${utilizationClass}">${lab.utilizationRate}%</div>
            </div>
        </td>
        <td>
            <div class="equipment-status">
                <div class="equipment-item">${lab.equipment ? lab.equipment.length : 0} items</div>
                <div class="equipment-item">${lab.software ? lab.software.length : 0} software</div>
            </div>
        </td>
        <td>
            <div>${lab.incharge || 'Not assigned'}</div>
            <div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 2px;">
                ${lab.contact || 'No contact'}
            </div>
        </td>
        <td>
            <span class="status-badge ${statusClass}">
                ${lab.status.toUpperCase()}
            </span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="action-btn action-view" onclick="showLabDetails('${lab.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn action-book" onclick="bookLab('${lab.id}')">
                    <i class="fas fa-calendar-plus"></i>
                </button>
                <button class="action-btn action-edit" onclick="editLab('${lab.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn action-delete" onclick="deleteLab('${lab.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

function getUtilizationClass(rate) {
    const utilization = parseInt(rate) || 0;
    if (utilization >= 80) return 'utilization-high';
    if (utilization >= 50) return 'utilization-medium';
    return 'utilization-low';
}

function searchLabs() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    applyLabFilters(searchTerm);
}

function filterLabs() {
    applyLabFilters();
}

function applyLabFilters(searchTerm = '') {
    const departmentFilter = document.getElementById('departmentFilter');
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const utilizationFilter = document.getElementById('utilizationFilter');
    const searchInput = document.getElementById('searchInput');
    
    const departmentValue = departmentFilter ? departmentFilter.value : '';
    const typeValue = typeFilter ? typeFilter.value : '';
    const statusValue = statusFilter ? statusFilter.value : '';
    const utilizationValue = utilizationFilter ? utilizationFilter.value : '';
    
    if (!searchTerm && searchInput) {
        searchTerm = searchInput.value.toLowerCase();
    }
    
    filteredLabs = LABS_DATA.filter(lab => {
        const matchesSearch = !searchTerm || 
            lab.name.toLowerCase().includes(searchTerm) ||
            lab.code.toLowerCase().includes(searchTerm) ||
            lab.type.toLowerCase().includes(searchTerm) ||
            lab.location.toLowerCase().includes(searchTerm) ||
            (lab.incharge && lab.incharge.toLowerCase().includes(searchTerm)) ||
            (lab.equipment && lab.equipment.some(eq => eq.toLowerCase().includes(searchTerm)));
        
        const matchesDepartment = !departmentValue || lab.department === departmentValue;
        const matchesType = !typeValue || lab.type === typeValue;
        const matchesStatus = !statusValue || lab.status === statusValue;
        
        let matchesUtilization = true;
        if (utilizationValue) {
            const rate = parseInt(lab.utilizationRate) || 0;
            switch(utilizationValue) {
                case 'high': matchesUtilization = rate > 80; break;
                case 'medium': matchesUtilization = rate >= 50 && rate <= 80; break;
                case 'low': matchesUtilization = rate < 50; break;
            }
        }
        
        return matchesSearch && matchesDepartment && matchesType && matchesStatus && matchesUtilization;
    });
    
    loadLabs();
    
    if (searchTerm || departmentValue || typeValue || statusValue || utilizationValue) {
        showNotification(`Found ${filteredLabs.length} labs matching your criteria`, 'info');
    }
}

function toggleLabSelection(labId) {
    if (selectedLabs.has(labId)) {
        selectedLabs.delete(labId);
    } else {
        selectedLabs.add(labId);
    }
    updateSelectedLabCount();
}

function toggleSelectAllLabs() {
    const selectAll = document.getElementById('selectAllLabs');
    const isChecked = selectAll ? selectAll.checked : false;
    const checkboxes = document.querySelectorAll('.lab-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        if (isChecked) {
            selectedLabs.add(checkbox.value);
        } else {
            selectedLabs.delete(checkbox.value);
        }
    });
    
    updateSelectedLabCount();
}

function toggleMasterLabCheckbox() {
    const masterCheckbox = document.getElementById('masterLabCheckbox');
    const isChecked = masterCheckbox ? masterCheckbox.checked : false;
    const checkboxes = document.querySelectorAll('.lab-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        if (isChecked) {
            selectedLabs.add(checkbox.value);
        } else {
            selectedLabs.delete(checkbox.value);
        }
    });
    
    updateSelectedLabCount();
}

function updateSelectedLabCount() {
    const selectedCountElement = document.getElementById('selectedLabCount');
    if (selectedCountElement) {
        selectedCountElement.textContent = `${selectedLabs.size} labs selected`;
    }
    
    const totalCheckboxes = document.querySelectorAll('.lab-checkbox').length;
    const masterCheckbox = document.getElementById('masterLabCheckbox');
    
    if (masterCheckbox) {
        if (selectedLabs.size === 0) {
            masterCheckbox.indeterminate = false;
            masterCheckbox.checked = false;
        } else if (selectedLabs.size === totalCheckboxes) {
            masterCheckbox.indeterminate = false;
            masterCheckbox.checked = true;
        } else {
            masterCheckbox.indeterminate = true;
            masterCheckbox.checked = false;
        }
    }
}

function openAddLabModal() {
    editingLabId = null;
    const modalTitle = document.getElementById('labModalTitle');
    const labForm = document.getElementById('labForm');
    const labModal = document.getElementById('addLabModal');
    
    if (modalTitle) modalTitle.textContent = 'Add New Laboratory';
    if (labForm) labForm.reset();
    if (labModal) labModal.classList.add('show');
}

function editLab(labId) {
    const lab = LABS_DATA.find(l => l.id === labId);
    if (!lab) return;
    
    editingLabId = labId;
    const modalTitle = document.getElementById('labModalTitle');
    const labModal = document.getElementById('addLabModal');
    
    if (modalTitle) modalTitle.textContent = 'Edit Laboratory';
    
    // Populate form fields
    const fields = [
        'labName', 'labCode', 'labType', 'labDepartment', 'labCapacity', 'labLocation',
        'labDescription', 'labIncharge', 'labContact', 'labAssistant', 'operatingHours',
        'utilizationRate', 'labStatus', 'lastMaintenance', 'nextMaintenance'
    ];
    
    const fieldMapping = {
        'labName': 'name',
        'labCode': 'code',
        'labType': 'type',
        'labDepartment': 'department',
        'labCapacity': 'capacity',
        'labLocation': 'location',
        'labDescription': 'description',
        'labIncharge': 'incharge',
        'labContact': 'contact',
        'labAssistant': 'assistant',
        'operatingHours': 'operatingHours',
        'utilizationRate': 'utilizationRate',
        'labStatus': 'status',
        'lastMaintenance': 'lastMaintenance',
        'nextMaintenance': 'nextMaintenance'
    };
    
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        const dataKey = fieldMapping[fieldId];
        if (element && lab[dataKey] !== undefined) {
            element.value = lab[dataKey] || '';
        }
    });
    
    // Populate array fields
    const labEquipmentEl = document.getElementById('labEquipment');
    const labSoftwareEl = document.getElementById('labSoftware');
    const safetyEquipmentEl = document.getElementById('safetyEquipment');
    const specialFeaturesEl = document.getElementById('specialFeatures');
    
    if (labEquipmentEl && lab.equipment) {
        labEquipmentEl.value = lab.equipment.join('\n');
    }
    if (labSoftwareEl && lab.software) {
        labSoftwareEl.value = lab.software.join('\n');
    }
    if (safetyEquipmentEl && lab.safetyEquipment) {
        safetyEquipmentEl.value = lab.safetyEquipment.join('\n');
    }
    if (specialFeaturesEl && lab.specialFeatures) {
        specialFeaturesEl.value = lab.specialFeatures.join('\n');
    }
    
    if (labModal) labModal.classList.add('show');
}

function deleteLab(labId) {
    const lab = LABS_DATA.find(l => l.id === labId);
    if (!lab) return;
    
    if (confirm(`Are you sure you want to delete ${lab.name}? This action cannot be undone.`)) {
        const index = LABS_DATA.findIndex(l => l.id === labId);
        if (index !== -1) {
            LABS_DATA.splice(index, 1);
            filteredLabs = filteredLabs.filter(l => l.id !== labId);
            selectedLabs.delete(labId);
            
            saveLabsToStorage();
            loadLabs();
            updateLabStats();
            showNotification(`${lab.name} has been deleted successfully`, 'success');
        }
    }
}

function saveLab(event) {
    event.preventDefault();
    
    const getElementValue = (id) => {
        const element = document.getElementById(id);
        return element ? element.value.trim() : '';
    };
    
    const getArrayValue = (id) => {
        const element = document.getElementById(id);
        if (!element || !element.value.trim()) return [];
        return element.value.trim().split('\n').map(item => item.trim()).filter(item => item);
    };
    
    const formData = {
        name: getElementValue('labName'),
        code: getElementValue('labCode'),
        type: getElementValue('labType'),
        department: getElementValue('labDepartment'),
        capacity: parseInt(getElementValue('labCapacity')) || 0,
        location: getElementValue('labLocation'),
        description: getElementValue('labDescription'),
        incharge: getElementValue('labIncharge'),
        contact: getElementValue('labContact'),
        assistant: getElementValue('labAssistant'),
        operatingHours: getElementValue('operatingHours'),
        equipment: getArrayValue('labEquipment'),
        software: getArrayValue('labSoftware'),
        safetyEquipment: getArrayValue('safetyEquipment'),
        specialFeatures: getArrayValue('specialFeatures'),
        utilizationRate: parseInt(getElementValue('utilizationRate')) || 0,
        status: getElementValue('labStatus'),
        lastMaintenance: getElementValue('lastMaintenance'),
        nextMaintenance: getElementValue('nextMaintenance'),
        currentBookings: []
    };
    
    if (!formData.name || !formData.code || !formData.type || !formData.department || !formData.capacity) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    if (editingLabId) {
        const labIndex = LABS_DATA.findIndex(l => l.id === editingLabId);
        if (labIndex !== -1) {
            LABS_DATA[labIndex] = { 
                ...LABS_DATA[labIndex], 
                ...formData 
            };
            showNotification(`${formData.name} updated successfully`, 'success');
        }
    } else {
        const existingCode = LABS_DATA.find(l => l.code === formData.code);
        if (existingCode) {
            showNotification('Lab code already exists', 'error');
            return;
        }
        
        const newLab = {
            id: 'LAB' + String(Date.now()).slice(-6),
            ...formData
        };
        
        LABS_DATA.push(newLab);
        showNotification(`${formData.name} added successfully`, 'success');
    }
    
    saveLabsToStorage();
    closeModal();
    applyLabFilters();
    updateLabStats();
    populateLabSelects();
}

function showLabDetails(labId) {
    const lab = LABS_DATA.find(l => l.id === labId);
    if (!lab) return;
    
    const detailsTitle = document.getElementById('labDetailsTitle');
    const detailsContent = document.getElementById('labDetailsContent');
    const detailsModal = document.getElementById('labDetailsModal');
    
    if (detailsTitle) detailsTitle.textContent = `${lab.name} - Laboratory Details`;
    
    if (detailsContent) {
        detailsContent.innerHTML = `
            <div class="department-details-view">
                <div class="detail-section">
                    <h4><i class="fas fa-flask"></i> Laboratory Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Lab Name:</label>
                            <span>${lab.name}</span>
                        </div>
                        <div class="detail-item">
                            <label>Lab Code:</label>
                            <span>${lab.code}</span>
                        </div>
                        <div class="detail-item">
                            <label>Lab Type:</label>
                            <span class="type-badge">${lab.type}</span>
                        </div>
                        <div class="detail-item">
                            <label>Department:</label>
                            <span>${lab.department}</span>
                        </div>
                        <div class="detail-item">
                            <label>Capacity:</label>
                            <span>${lab.capacity} students</span>
                        </div>
                        <div class="detail-item">
                            <label>Location:</label>
                            <span>${lab.location}</span>
                        </div>
                        <div class="detail-item">
                            <label>Operating Hours:</label>
                            <span>${lab.operatingHours}</span>
                        </div>
                        <div class="detail-item">
                            <label>Status:</label>
                            <span class="status-badge status-${lab.status}">
                                ${lab.status.toUpperCase()}
                            </span>
                        </div>
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <label>Description:</label>
                            <span>${lab.description || 'No description available'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-user-tie"></i> Lab Management</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Lab In-charge:</label>
                            <span>${lab.incharge || 'Not assigned'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Contact:</label>
                            <span>${lab.contact || 'Not provided'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Lab Assistant:</label>
                            <span>${lab.assistant || 'Not assigned'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Utilization Rate:</label>
                            <span class="count-badge">${lab.utilizationRate}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-tools"></i> Equipment & Software</h4>
                    <div class="detail-grid">
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <label>Equipment (${lab.equipment ? lab.equipment.length : 0} items):</label>
                            <span>${lab.equipment && lab.equipment.length > 0 ? lab.equipment.join(', ') : 'No equipment listed'}</span>
                        </div>
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <label>Software (${lab.software ? lab.software.length : 0} packages):</label>
                            <span>${lab.software && lab.software.length > 0 ? lab.software.join(', ') : 'No software listed'}</span>
                        </div>
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <label>Safety Equipment:</label>
                            <span>${lab.safetyEquipment && lab.safetyEquipment.length > 0 ? lab.safetyEquipment.join(', ') : 'No safety equipment listed'}</span>
                        </div>
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <label>Special Features:</label>
                            <span>${lab.specialFeatures && lab.specialFeatures.length > 0 ? lab.specialFeatures.join(', ') : 'No special features'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-calendar-alt"></i> Maintenance Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Last Maintenance:</label>
                            <span>${lab.lastMaintenance ? new Date(lab.lastMaintenance).toLocaleDateString() : 'Not recorded'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Next Maintenance:</label>
                            <span>${lab.nextMaintenance ? new Date(lab.nextMaintenance).toLocaleDateString() : 'Not scheduled'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    if (detailsModal) detailsModal.classList.add('show');
}

function bookLab(labId) {
    const lab = LABS_DATA.find(l => l.id === labId);
    if (!lab) return;
    
    const bookingModal = document.getElementById('labBookingModal');
    const bookingLabSelect = document.getElementById('bookingLab');
    
    if (bookingLabSelect) {
        bookingLabSelect.value = labId;
    }
    
    if (bookingModal) bookingModal.classList.add('show');
}

function openLabBookingModal() {
    const bookingModal = document.getElementById('labBookingModal');
    if (bookingModal) bookingModal.classList.add('show');
}

function saveBooking(event) {
    event.preventDefault();
    
    const getElementValue = (id) => {
        const element = document.getElementById(id);
        return element ? element.value.trim() : '';
    };
    
    const formData = {
        labId: getElementValue('bookingLab'),
        date: getElementValue('bookingDate'),
        duration: parseInt(getElementValue('bookingDuration')) || 1,
        startTime: getElementValue('bookingStartTime'),
        endTime: getElementValue('bookingEndTime'),
        purpose: getElementValue('bookingPurpose'),
        faculty: getElementValue('bookingFaculty'),
        expectedStudents: parseInt(getElementValue('expectedStudents')) || 0,
        specialRequirements: getElementValue('specialRequirements')
    };
    
    if (!formData.labId || !formData.date || !formData.startTime || !formData.purpose || !formData.faculty) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    // Find the lab and add booking
    const labIndex = LABS_DATA.findIndex(l => l.id === formData.labId);
    if (labIndex !== -1) {
        if (!LABS_DATA[labIndex].currentBookings) {
            LABS_DATA[labIndex].currentBookings = [];
        }
        
        const newBooking = {
            id: 'BOOK' + String(Date.now()).slice(-6),
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            purpose: formData.purpose,
            faculty: formData.faculty,
            students: formData.expectedStudents,
            specialRequirements: formData.specialRequirements,
            status: 'confirmed'
        };
        
        LABS_DATA[labIndex].currentBookings.push(newBooking);
        saveLabsToStorage();
        
        showNotification('Laboratory booked successfully!', 'success');
        closeModal();
        loadLabs();
    }
}

function calculateEndTime() {
    const startTimeInput = document.getElementById('bookingStartTime');
    const durationSelect = document.getElementById('bookingDuration');
    const endTimeInput = document.getElementById('bookingEndTime');
    
    if (!startTimeInput || !durationSelect || !endTimeInput) return;
    
    const startTime = startTimeInput.value;
    const duration = parseInt(durationSelect.value) || 0;
    
    if (startTime && duration) {
        const [hours, minutes] = startTime.split(':').map(Number);
        const endHours = hours + duration;
        const endTime = `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        endTimeInput.value = endTime;
    }
}

function scheduleMaintenance(labId) {
    const lab = LABS_DATA.find(l => l.id === labId);
    if (!lab) return;
    
    const maintenanceModal = document.getElementById('maintenanceModal');
    const maintenanceLabSelect = document.getElementById('maintenanceLab');
    
    if (maintenanceLabSelect) {
        maintenanceLabSelect.value = labId;
    }
    
    if (maintenanceModal) maintenanceModal.classList.add('show');
}

function openMaintenanceModal() {
    const maintenanceModal = document.getElementById('maintenanceModal');
    if (maintenanceModal) maintenanceModal.classList.add('show');
}

function scheduleMaintenance(event) {
    if (typeof event === 'object' && event.preventDefault) {
        event.preventDefault();
    }
    
    const getElementValue = (id) => {
        const element = document.getElementById(id);
        return element ? element.value.trim() : '';
    };
    
    const formData = {
        labId: getElementValue('maintenanceLab'),
        type: getElementValue('maintenanceType'),
        priority: getElementValue('maintenancePriority'),
        date: getElementValue('maintenanceDate'),
        duration: parseInt(getElementValue('maintenanceDuration')) || 1,
        technician: getElementValue('assignedTech'),
        description: getElementValue('maintenanceDescription'),
        equipment: getElementValue('equipmentList')
    };
    
    if (!formData.labId || !formData.type || !formData.priority || !formData.date || !formData.description) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    // Update lab status if high priority maintenance
    const labIndex = LABS_DATA.findIndex(l => l.id === formData.labId);
    if (labIndex !== -1 && (formData.priority === 'high' || formData.priority === 'critical')) {
        LABS_DATA[labIndex].status = 'maintenance';
        LABS_DATA[labIndex].nextMaintenance = formData.date;
    }
    
    saveLabsToStorage();
    showNotification('Maintenance scheduled successfully!', 'success');
    closeModal();
    loadLabs();
    updateLabStats();
}

function bulkLabAction(action) {
    if (selectedLabs.size === 0) {
        showNotification('No labs selected', 'error');
        return;
    }
    
    let actionText = '';
    let newStatus = '';
    
    switch(action) {
        case 'activate':
            actionText = 'activate';
            newStatus = 'active';
            break;
        case 'maintenance':
            actionText = 'schedule maintenance for';
            newStatus = 'maintenance';
            break;
        default:
            return;
    }
    
    if (confirm(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} ${selectedLabs.size} selected labs?`)) {
        let updatedCount = 0;
        LABS_DATA.forEach(lab => {
            if (selectedLabs.has(lab.id)) {
                lab.status = newStatus;
                updatedCount++;
            }
        });
        
        selectedLabs.clear();
        const checkboxes = document.querySelectorAll('.lab-checkbox, #selectAllLabs, #masterLabCheckbox');
        checkboxes.forEach(cb => cb.checked = false);
        
        saveLabsToStorage();
        loadLabs();
        updateLabStats();
        showNotification(`${updatedCount} labs ${actionText}d successfully`, 'success');
    }
}

function exportSelectedLabs() {
    if (selectedLabs.size === 0) {
        showNotification('No labs selected for export', 'error');
        return;
    }
    
    const selectedData = LABS_DATA.filter(lab => selectedLabs.has(lab.id));
    const csvContent = convertToCSV(selectedData);
    downloadCSV(csvContent, 'selected_labs.csv');
    
    showNotification(`${selectedLabs.size} labs exported successfully!`, 'success');
}

function exportLabData() {
    if (LABS_DATA.length === 0) {
        showNotification('No lab data to export', 'error');
        return;
    }
    
    const csvContent = convertToCSV(LABS_DATA);
    downloadCSV(csvContent, 'all_labs.csv');
    
    showNotification('All lab data exported successfully!', 'success');
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    // Flatten complex fields for CSV
    const flattenedData = data.map(lab => {
        const { equipment, software, safetyEquipment, specialFeatures, currentBookings, ...basicData } = lab;
        return {
            ...basicData,
            equipment: equipment ? equipment.join('; ') : '',
            software: software ? software.join('; ') : '',
            safetyEquipment: safetyEquipment ? safetyEquipment.join('; ') : '',
            specialFeatures: specialFeatures ? specialFeatures.join('; ') : '',
            currentBookingsCount: currentBookings ? currentBookings.length : 0
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

function refreshLabs() {
    showNotification('Refreshing lab data...', 'info');
    
    setTimeout(() => {
        loadLabs();
        updateLabStats();
        showNotification('Lab data refreshed successfully!', 'success');
    }, 1000);
}

function refreshActivities() {
    showNotification('Refreshing activities...', 'info');
    
    setTimeout(() => {
        loadTodayActivities();
        showNotification('Activities refreshed!', 'success');
    }, 800);
}

function viewAllActivities() {
    showNotification('Opening activities dashboard...', 'info');
    // This would redirect to a detailed activities page
}

function viewAllLabs() {
    // Reset all filters to show all labs
    const searchInput = document.getElementById('searchInput');
    const departmentFilter = document.getElementById('departmentFilter');
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const utilizationFilter = document.getElementById('utilizationFilter');
    
    if (searchInput) searchInput.value = '';
    if (departmentFilter) departmentFilter.value = '';
    if (typeFilter) typeFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    if (utilizationFilter) utilizationFilter.value = '';
    
    applyLabFilters();
    showNotification('Showing all laboratories', 'info');
}

// Calendar functions for booking
function previousWeek() {
    // Implementation for calendar navigation
    showNotification('Previous week', 'info');
}

function nextWeek() {
    // Implementation for calendar navigation  
    showNotification('Next week', 'info');
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
    editingLabId = null;
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
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, 4000);
}

// Event Listeners
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
    saveLabsToStorage();
});

// Initialize with card view
setTimeout(() => {
    if (document.getElementById('cardViewBtn')) {
        switchLabView('card');
    }
}, 100);
