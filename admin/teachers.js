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

let FACULTY_DATA = JSON.parse(localStorage.getItem('scms_faculty_data')) || [
    {
        id: 'FAC001',
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@college.edu',
        phone: '+91-98765-43210',
        dob: '1975-03-15',
        address: 'Sector 15, Noida, UP - 201301',
        employeeId: 'CSE001',
        department: 'CSE',
        designation: 'Professor',
        experience: '15',
        qualification: 'Ph.D',
        salary: '85000',
        joinDate: '2010-07-15',
        status: 'active',
        subjects: 'Data Structures, Algorithms, Database Systems',
        specialization: 'Machine Learning',
        researchInterest: 'Artificial Intelligence, Data Science',
        publications: '45'
    },
    {
        id: 'FAC002',
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@college.edu',
        phone: '+91-98765-43211',
        dob: '1980-08-22',
        address: 'Model Town, Delhi - 110009',
        employeeId: 'ECE001',
        department: 'ECE',
        designation: 'Associate Professor',
        experience: '12',
        qualification: 'Ph.D',
        salary: '75000',
        joinDate: '2012-08-20',
        status: 'active',
        subjects: 'Digital Electronics, Microprocessors, Communication Systems',
        specialization: 'VLSI Design',
        researchInterest: 'Embedded Systems, IoT',
        publications: '32'
    },
    {
        id: 'FAC003',
        name: 'Prof. Anand Gupta',
        email: 'anand.gupta@college.edu',
        phone: '+91-98765-43212',
        dob: '1970-12-10',
        address: 'Jubilee Hills, Hyderabad - 500033',
        employeeId: 'EEE001',
        department: 'EEE',
        designation: 'Professor',
        experience: '20',
        qualification: 'Ph.D',
        salary: '90000',
        joinDate: '2005-01-10',
        status: 'active',
        subjects: 'Power Systems, Electrical Machines, Control Systems',
        specialization: 'Power Electronics',
        researchInterest: 'Renewable Energy, Smart Grid',
        publications: '67'
    },
    {
        id: 'FAC004',
        name: 'Ms. Meera Patel',
        email: 'meera.patel@college.edu',
        phone: '+91-98765-43213',
        dob: '1985-06-05',
        address: 'Satellite, Ahmedabad - 380015',
        employeeId: 'MECH001',
        department: 'MECH',
        designation: 'Assistant Professor',
        experience: '8',
        qualification: 'M.Tech',
        salary: '55000',
        joinDate: '2018-06-01',
        status: 'active',
        subjects: 'Thermodynamics, Fluid Mechanics, Heat Transfer',
        specialization: 'Thermal Engineering',
        researchInterest: 'Heat Exchangers, CFD',
        publications: '18'
    },
    {
        id: 'FAC005',
        name: 'Prof. Vikram Singh',
        email: 'vikram.singh@college.edu',
        phone: '+91-98765-43214',
        dob: '1968-09-15',
        address: 'Civil Lines, Lucknow - 226001',
        employeeId: 'CIVIL001',
        department: 'CIVIL',
        designation: 'Professor',
        experience: '25',
        qualification: 'Ph.D',
        salary: '95000',
        joinDate: '2000-09-15',
        status: 'active',
        subjects: 'Structural Engineering, Concrete Technology, Surveying',
        specialization: 'Earthquake Engineering',
        researchInterest: 'Seismic Analysis, Structural Design',
        publications: '78'
    },
    {
        id: 'FAC006',
        name: 'Dr. Kavitha Reddy',
        email: 'kavitha.reddy@college.edu',
        phone: '+91-98765-43215',
        dob: '1982-11-20',
        address: 'Banjara Hills, Hyderabad - 500034',
        employeeId: 'IT001',
        department: 'IT',
        designation: 'Associate Professor',
        experience: '10',
        qualification: 'Ph.D',
        salary: '70000',
        joinDate: '2015-03-01',
        status: 'active',
        subjects: 'Software Engineering, Web Technologies, Mobile App Development',
        specialization: 'Cloud Computing',
        researchInterest: 'DevOps, Microservices',
        publications: '28'
    },
    {
        id: 'FAC007',
        name: 'Mr. Amit Joshi',
        email: 'amit.joshi@college.edu',
        phone: '+91-98765-43216',
        dob: '1987-04-12',
        address: 'Koregaon Park, Pune - 411001',
        employeeId: 'CSE002',
        department: 'CSE',
        designation: 'Assistant Professor',
        experience: '6',
        qualification: 'M.Tech',
        salary: '50000',
        joinDate: '2019-07-01',
        status: 'active',
        subjects: 'Programming Languages, Computer Networks, Cyber Security',
        specialization: 'Information Security',
        researchInterest: 'Cryptography, Network Security',
        publications: '12'
    },
    {
        id: 'FAC008',
        name: 'Dr. Sunita Mehta',
        email: 'sunita.mehta@college.edu',
        phone: '+91-98765-43217',
        dob: '1973-07-30',
        address: 'Sector 22, Chandigarh - 160022',
        employeeId: 'ECE002',
        department: 'ECE',
        designation: 'Professor',
        experience: '18',
        qualification: 'Ph.D',
        salary: '88000',
        joinDate: '2008-08-15',
        status: 'on-leave',
        subjects: 'Analog Electronics, Signal Processing, Antenna Theory',
        specialization: 'RF Engineering',
        researchInterest: 'Wireless Communication, 5G Technology',
        publications: '52'
    }
];

let filteredFaculty = [...FACULTY_DATA];
let selectedFaculty = new Set();
let editingFacultyId = null;
let currentView = 'table';

function saveDataToStorage() {
    localStorage.setItem('scms_faculty_data', JSON.stringify(FACULTY_DATA));
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    loadFaculty();
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
    const totalFaculty = FACULTY_DATA.length;
    const activeFaculty = FACULTY_DATA.filter(f => f.status === 'active').length;
    const professors = FACULTY_DATA.filter(f => f.designation === 'Professor').length;
    const expSum = FACULTY_DATA.reduce((sum, f) => sum + parseFloat(f.experience || 0), 0);
    const avgExperience = totalFaculty > 0 ? expSum / totalFaculty : 0;
    
    const totalElement = document.getElementById('totalFaculty');
    const activeElement = document.getElementById('activeFaculty');
    const professorsElement = document.getElementById('professors');
    const avgExpElement = document.getElementById('avgExperience');
    
    if (totalElement) totalElement.textContent = totalFaculty.toLocaleString();
    if (activeElement) activeElement.textContent = activeFaculty.toLocaleString();
    if (professorsElement) professorsElement.textContent = professors.toLocaleString();
    if (avgExpElement) avgExpElement.textContent = avgExperience.toFixed(1);
}

function switchView(view) {
    currentView = view;
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');
    const facultyContainer = document.getElementById('facultyContainer');
    const tableContainer = document.getElementById('tableContainer');
    
    if (!cardViewBtn || !tableViewBtn || !facultyContainer || !tableContainer) return;
    
    if (view === 'card') {
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        facultyContainer.style.display = 'grid';
        tableContainer.style.display = 'none';
        loadFacultyCards();
    } else {
        tableViewBtn.classList.add('active');
        cardViewBtn.classList.remove('active');
        facultyContainer.style.display = 'none';
        tableContainer.style.display = 'block';
        loadFacultyTable();
    }
}

function loadFaculty() {
    if (currentView === 'card') {
        loadFacultyCards();
    } else {
        loadFacultyTable();
    }
    updateSelectedCount();
}

function loadFacultyCards() {
    const container = document.getElementById('facultyContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (filteredFaculty.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-tie fa-3x"></i>
                <h3>No Faculty Found</h3>
                <p>No faculty match your current filters.</p>
            </div>
        `;
        return;
    }
    
    filteredFaculty.forEach(faculty => {
        const facultyCard = createFacultyCard(faculty);
        container.appendChild(facultyCard);
    });
}

function loadFacultyTable() {
    const tbody = document.getElementById('facultyTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    filteredFaculty.forEach(faculty => {
        const row = createFacultyTableRow(faculty);
        tbody.appendChild(row);
    });
}

function createFacultyCard(faculty) {
    const card = document.createElement('div');
    card.className = 'faculty-card';
    
    const initials = faculty.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const expClass = getExperienceClass(parseFloat(faculty.experience || 0));
    const designationClass = getDesignationClass(faculty.designation);
    const statusClass = `status-${faculty.status.replace('-', '-')}`;
    const subjects = faculty.subjects ? faculty.subjects.split(',').slice(0, 3) : [];
    
    card.innerHTML = `
        <div class="faculty-card-header">
            <div class="faculty-avatar">${initials}</div>
            <div class="faculty-info">
                <h3>${faculty.name}</h3>
                <p>${faculty.employeeId} • ${faculty.department}</p>
            </div>
        </div>
        
        <div class="faculty-card-body">
            <div class="info-grid">
                <div class="info-item">
                    <div class="label">Designation</div>
                    <div class="value designation-badge ${designationClass}">${faculty.designation}</div>
                </div>
                <div class="info-item">
                    <div class="label">Experience</div>
                    <div class="value experience-badge ${expClass}">${faculty.experience}Y</div>
                </div>
                <div class="info-item">
                    <div class="label">Qualification</div>
                    <div class="value">${faculty.qualification}</div>
                </div>
                <div class="info-item">
                    <div class="label">Status</div>
                    <div class="value status-badge ${statusClass}">${faculty.status.replace('-', ' ').toUpperCase()}</div>
                </div>
            </div>
            
            ${subjects.length > 0 ? `
            <div class="subjects-list">
                <div class="label">Subjects Teaching</div>
                <div class="subject-tags">
                    ${subjects.map(subject => `<span class="subject-tag">${subject.trim()}</span>`).join('')}
                    ${faculty.subjects.split(',').length > 3 ? `<span class="subject-tag">+${faculty.subjects.split(',').length - 3} more</span>` : ''}
                </div>
            </div>
            ` : ''}
            
            <div class="faculty-actions">
                <button class="action-btn action-view" onclick="showFacultyDetails('${faculty.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn action-edit" onclick="editFaculty('${faculty.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn action-delete" onclick="deleteFaculty('${faculty.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function createFacultyTableRow(faculty) {
    const row = document.createElement('tr');
    const initials = faculty.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const expClass = getExperienceClass(parseFloat(faculty.experience || 0));
    const designationClass = getDesignationClass(faculty.designation);
    const statusClass = `status-${faculty.status.replace('-', '-')}`;
    const subjects = faculty.subjects ? faculty.subjects.split(',').slice(0, 2) : [];
    
    row.innerHTML = `
        <td>
            <input type="checkbox" class="faculty-checkbox" value="${faculty.id}" onchange="toggleFacultySelection('${faculty.id}')">
        </td>
        <td>
            <div class="faculty-profile">
                <div class="user-avatar-sm">${initials}</div>
                <div class="faculty-info-text">
                    <h4>${faculty.name}</h4>
                    <p>${faculty.employeeId}</p>
                    <p style="font-size: 0.8em; opacity: 0.8;">${faculty.email}</p>
                </div>
            </div>
        </td>
        <td>
            <span class="department-badge">${faculty.department}</span>
        </td>
        <td>
            <span class="designation-badge ${designationClass}">${faculty.designation}</span>
        </td>
        <td>
            <span class="experience-badge ${expClass}">${faculty.experience} Years</span>
        </td>
        <td>
            <div>${subjects.map(s => s.trim()).join(', ')}</div>
            ${faculty.subjects && faculty.subjects.split(',').length > 2 ? 
                `<div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 2px;">
                    +${faculty.subjects.split(',').length - 2} more subjects
                </div>` : ''}
        </td>
        <td>
            <span class="status-badge ${statusClass}">
                ${faculty.status.replace('-', ' ').charAt(0).toUpperCase() + faculty.status.replace('-', ' ').slice(1)}
            </span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="action-btn action-view" onclick="showFacultyDetails('${faculty.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn action-edit" onclick="editFaculty('${faculty.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn action-delete" onclick="deleteFaculty('${faculty.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

function getDesignationClass(designation) {
    switch(designation) {
        case 'Professor': return 'designation-professor';
        case 'Associate Professor': return 'designation-associate';
        case 'Assistant Professor': return 'designation-assistant';
        case 'Lecturer': return 'designation-lecturer';
        default: return 'designation-lecturer';
    }
}

function getExperienceClass(exp) {
    if (exp >= 15) return 'exp-senior';
    if (exp >= 5) return 'exp-mid';
    return 'exp-junior';
}

function searchFaculty() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    applyFilters(searchTerm);
}

function filterFaculty() {
    applyFilters();
}

function applyFilters(searchTerm = '') {
    const departmentFilter = document.getElementById('departmentFilter');
    const designationFilter = document.getElementById('designationFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    
    const departmentValue = departmentFilter ? departmentFilter.value : '';
    const designationValue = designationFilter ? designationFilter.value : '';
    const statusValue = statusFilter ? statusFilter.value : '';
    
    if (!searchTerm && searchInput) {
        searchTerm = searchInput.value.toLowerCase();
    }
    
    filteredFaculty = FACULTY_DATA.filter(faculty => {
        const matchesSearch = !searchTerm || 
            faculty.name.toLowerCase().includes(searchTerm) ||
            faculty.employeeId.toLowerCase().includes(searchTerm) ||
            faculty.email.toLowerCase().includes(searchTerm) ||
            faculty.phone.includes(searchTerm) ||
            (faculty.subjects && faculty.subjects.toLowerCase().includes(searchTerm));
        
        const matchesDepartment = !departmentValue || faculty.department === departmentValue;
        const matchesDesignation = !designationValue || faculty.designation === designationValue;
        const matchesStatus = !statusValue || faculty.status === statusValue;
        
        return matchesSearch && matchesDepartment && matchesDesignation && matchesStatus;
    });
    
    loadFaculty();
    
    if (searchTerm || departmentValue || designationValue || statusValue) {
        showNotification(`Found ${filteredFaculty.length} faculty matching your criteria`, 'info');
    }
}

function toggleFacultySelection(facultyId) {
    if (selectedFaculty.has(facultyId)) {
        selectedFaculty.delete(facultyId);
    } else {
        selectedFaculty.add(facultyId);
    }
    updateSelectedCount();
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const isChecked = selectAll ? selectAll.checked : false;
    const checkboxes = document.querySelectorAll('.faculty-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        if (isChecked) {
            selectedFaculty.add(checkbox.value);
        } else {
            selectedFaculty.delete(checkbox.value);
        }
    });
    
    updateSelectedCount();
}

function toggleMasterCheckbox() {
    const masterCheckbox = document.getElementById('masterCheckbox');
    const isChecked = masterCheckbox ? masterCheckbox.checked : false;
    const checkboxes = document.querySelectorAll('.faculty-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        if (isChecked) {
            selectedFaculty.add(checkbox.value);
        } else {
            selectedFaculty.delete(checkbox.value);
        }
    });
    
    updateSelectedCount();
}

function updateSelectedCount() {
    const selectedCountElement = document.getElementById('selectedCount');
    if (selectedCountElement) {
        selectedCountElement.textContent = 
            `${selectedFaculty.size} faculty selected`;
    }
    
    const totalCheckboxes = document.querySelectorAll('.faculty-checkbox').length;
    const masterCheckbox = document.getElementById('masterCheckbox');
    
    if (masterCheckbox) {
        if (selectedFaculty.size === 0) {
            masterCheckbox.indeterminate = false;
            masterCheckbox.checked = false;
        } else if (selectedFaculty.size === totalCheckboxes) {
            masterCheckbox.indeterminate = false;
            masterCheckbox.checked = true;
        } else {
            masterCheckbox.indeterminate = true;
            masterCheckbox.checked = false;
        }
    }
}

function openAddFacultyModal() {
    editingFacultyId = null;
    const modalTitle = document.getElementById('modalTitle');
    const facultyForm = document.getElementById('facultyForm');
    const facultyModal = document.getElementById('facultyModal');
    
    if (modalTitle) modalTitle.textContent = 'Add New Faculty';
    if (facultyForm) facultyForm.reset();
    if (facultyModal) facultyModal.classList.add('show');
}

function editFaculty(facultyId) {
    const faculty = FACULTY_DATA.find(f => f.id === facultyId);
    if (!faculty) return;
    
    editingFacultyId = facultyId;
    const modalTitle = document.getElementById('modalTitle');
    const facultyModal = document.getElementById('facultyModal');
    
    if (modalTitle) modalTitle.textContent = 'Edit Faculty';
    
    const fields = [
        'facultyName', 'facultyEmail', 'facultyPhone', 'facultyDob', 'facultyAddress',
        'employeeId', 'department', 'designation', 'experience', 'qualification', 
        'salary', 'joinDate', 'status', 'subjects', 'specialization', 'researchInterest', 'publications'
    ];
    
    const fieldMapping = {
        'facultyName': 'name',
        'facultyEmail': 'email',
        'facultyPhone': 'phone',
        'facultyDob': 'dob',
        'facultyAddress': 'address',
        'employeeId': 'employeeId',
        'department': 'department',
        'designation': 'designation',
        'experience': 'experience',
        'qualification': 'qualification',
        'salary': 'salary',
        'joinDate': 'joinDate',
        'status': 'status',
        'subjects': 'subjects',
        'specialization': 'specialization',
        'researchInterest': 'researchInterest',
        'publications': 'publications'
    };
    
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        const dataKey = fieldMapping[fieldId];
        if (element && faculty[dataKey] !== undefined) {
            element.value = faculty[dataKey] || '';
        }
    });
    
    if (facultyModal) facultyModal.classList.add('show');
}

function deleteFaculty(facultyId) {
    const faculty = FACULTY_DATA.find(f => f.id === facultyId);
    if (!faculty) return;
    
    if (confirm(`Are you sure you want to delete ${faculty.name}? This action cannot be undone.`)) {
        const index = FACULTY_DATA.findIndex(f => f.id === facultyId);
        if (index !== -1) {
            FACULTY_DATA.splice(index, 1);
            filteredFaculty = filteredFaculty.filter(f => f.id !== facultyId);
            selectedFaculty.delete(facultyId);
            
            saveDataToStorage();
            loadFaculty();
            updateStats();
            showNotification(`${faculty.name} has been deleted successfully`, 'success');
        }
    }
}

function saveFaculty(event) {
    event.preventDefault();
    
    const getElementValue = (id) => {
        const element = document.getElementById(id);
        return element ? element.value.trim() : '';
    };
    
    const formData = {
        name: getElementValue('facultyName'),
        email: getElementValue('facultyEmail'),
        phone: getElementValue('facultyPhone'),
        dob: getElementValue('facultyDob'),
        address: getElementValue('facultyAddress'),
        employeeId: getElementValue('employeeId'),
        department: getElementValue('department'),
        designation: getElementValue('designation'),
        experience: getElementValue('experience'),
        qualification: getElementValue('qualification'),
        salary: getElementValue('salary'),
        joinDate: getElementValue('joinDate'),
        status: getElementValue('status'),
        subjects: getElementValue('subjects'),
        specialization: getElementValue('specialization'),
        researchInterest: getElementValue('researchInterest'),
        publications: getElementValue('publications')
    };
    
    if (!formData.name || !formData.email || !formData.employeeId || !formData.department || !formData.designation) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (editingFacultyId) {
        const facultyIndex = FACULTY_DATA.findIndex(f => f.id === editingFacultyId);
        if (facultyIndex !== -1) {
            FACULTY_DATA[facultyIndex] = { ...FACULTY_DATA[facultyIndex], ...formData };
            showNotification(`${formData.name} updated successfully`, 'success');
        }
    } else {
        const existingEmployeeId = FACULTY_DATA.find(f => f.employeeId === formData.employeeId);
        if (existingEmployeeId) {
            showNotification('Employee ID already exists', 'error');
            return;
        }
        
        const existingEmail = FACULTY_DATA.find(f => f.email === formData.email);
        if (existingEmail) {
            showNotification('Email already exists', 'error');
            return;
        }
        
        const newFaculty = {
            id: 'FAC' + String(Date.now()).slice(-6),
            ...formData
        };
        
        FACULTY_DATA.push(newFaculty);
        showNotification(`${formData.name} added successfully`, 'success');
    }
    
    saveDataToStorage();
    closeModal();
    applyFilters();
    updateStats();
}

function showFacultyDetails(facultyId) {
    const faculty = FACULTY_DATA.find(f => f.id === facultyId);
    if (!faculty) return;
    
    const detailsTitle = document.getElementById('facultyDetailsTitle');
    const detailsContent = document.getElementById('facultyDetailsContent');
    const detailsModal = document.getElementById('facultyDetailsModal');
    
    if (detailsTitle) detailsTitle.textContent = `${faculty.name} - Faculty Details`;
    
    if (detailsContent) {
        const subjects = faculty.subjects ? faculty.subjects.split(',').map(s => s.trim()) : [];
        
        detailsContent.innerHTML = `
            <div class="faculty-details-view">
                <div class="detail-section">
                    <h4><i class="fas fa-user"></i> Personal Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Full Name:</label>
                            <span>${faculty.name}</span>
                        </div>
                        <div class="detail-item">
                            <label>Email:</label>
                            <span>${faculty.email}</span>
                        </div>
                        <div class="detail-item">
                            <label>Phone:</label>
                            <span>${faculty.phone}</span>
                        </div>
                        <div class="detail-item">
                            <label>Date of Birth:</label>
                            <span>${faculty.dob ? new Date(faculty.dob).toLocaleDateString() : 'Not provided'}</span>
                        </div>
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <label>Address:</label>
                            <span>${faculty.address || 'Not provided'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-graduation-cap"></i> Professional Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Employee ID:</label>
                            <span>${faculty.employeeId}</span>
                        </div>
                        <div class="detail-item">
                            <label>Department:</label>
                            <span class="department-badge">${faculty.department}</span>
                        </div>
                        <div class="detail-item">
                            <label>Designation:</label>
                            <span class="designation-badge ${getDesignationClass(faculty.designation)}">${faculty.designation}</span>
                        </div>
                        <div class="detail-item">
                            <label>Experience:</label>
                            <span class="experience-badge ${getExperienceClass(parseFloat(faculty.experience || 0))}">${faculty.experience} Years</span>
                        </div>
                        <div class="detail-item">
                            <label>Qualification:</label>
                            <span>${faculty.qualification}</span>
                        </div>
                        <div class="detail-item">
                            <label>Salary:</label>
                            <span>₹${faculty.salary ? parseFloat(faculty.salary).toLocaleString() : 'Not disclosed'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Join Date:</label>
                            <span>${faculty.joinDate ? new Date(faculty.joinDate).toLocaleDateString() : 'Not provided'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Status:</label>
                            <span class="status-badge status-${faculty.status.replace('-', '-')}">
                                ${faculty.status.replace('-', ' ').charAt(0).toUpperCase() + faculty.status.replace('-', ' ').slice(1)}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-book"></i> Academic Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Specialization:</label>
                            <span>${faculty.specialization || 'Not specified'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Research Interest:</label>
                            <span>${faculty.researchInterest || 'Not specified'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Publications:</label>
                            <span>${faculty.publications || '0'} papers</span>
                        </div>
                    </div>
                    
                    ${subjects.length > 0 ? `
                    <div style="margin-top: 20px;">
                        <label style="font-weight: 600; color: var(--text-secondary); margin-bottom: 10px; display: block;">Subjects Teaching:</label>
                        <div class="subject-tags">
                            ${subjects.map(subject => `<span class="subject-tag">${subject}</span>`).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    if (detailsModal) detailsModal.classList.add('show');
}

function updateEmployeeIdPrefix() {
    const departmentSelect = document.getElementById('department');
    const employeeIdField = document.getElementById('employeeId');
    
    if (departmentSelect && employeeIdField) {
        const department = departmentSelect.value;
        if (department) {
            const prefix = `${department}`;
            if (!employeeIdField.value.startsWith(prefix)) {
                employeeIdField.placeholder = `${prefix}001`;
            }
        }
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
    editingFacultyId = null;
}

function bulkAction(action) {
    if (selectedFaculty.size === 0) {
        showNotification('No faculty selected', 'error');
        return;
    }
    
    const actionText = action === 'activate' ? 'activate' : 'deactivate';
    const newStatus = action === 'activate' ? 'active' : 'inactive';
    
    if (confirm(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} ${selectedFaculty.size} selected faculty?`)) {
        let updatedCount = 0;
        FACULTY_DATA.forEach(faculty => {
            if (selectedFaculty.has(faculty.id)) {
                faculty.status = newStatus;
                updatedCount++;
            }
        });
        
        selectedFaculty.clear();
        const checkboxes = document.querySelectorAll('.faculty-checkbox, #selectAll, #masterCheckbox');
        checkboxes.forEach(cb => cb.checked = false);
        
        saveDataToStorage();
        loadFaculty();
        updateStats();
        showNotification(`${updatedCount} faculty ${actionText}d successfully`, 'success');
    }
}

function exportSelected() {
    if (selectedFaculty.size === 0) {
        showNotification('No faculty selected for export', 'error');
        return;
    }
    
    const selectedData = FACULTY_DATA.filter(faculty => selectedFaculty.has(faculty.id));
    const csvContent = convertToCSV(selectedData);
    downloadCSV(csvContent, 'selected_faculty.csv');
    
    showNotification(`${selectedFaculty.size} faculty exported successfully!`, 'success');
}

function importFaculty() {
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
                    importedData.forEach(facultyData => {
                        const existingEmpId = FACULTY_DATA.find(f => f.employeeId === facultyData.employeeId);
                        const existingEmail = FACULTY_DATA.find(f => f.email === facultyData.email);
                        
                        if (!existingEmpId && !existingEmail && facultyData.name && facultyData.email) {
                            const newFaculty = {
                                id: 'FAC' + String(Date.now() + addedCount).slice(-6),
                                ...facultyData,
                                status: facultyData.status || 'active'
                            };
                            FACULTY_DATA.push(newFaculty);
                            addedCount++;
                        }
                    });
                    
                    if (addedCount > 0) {
                        saveDataToStorage();
                        applyFilters();
                        updateStats();
                        showNotification(`${addedCount} faculty imported successfully!`, 'success');
                    } else {
                        showNotification('No new faculty to import (duplicates found)', 'error');
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

function exportFaculty() {
    if (FACULTY_DATA.length === 0) {
        showNotification('No faculty to export', 'error');
        return;
    }
    
    const csvContent = convertToCSV(FACULTY_DATA);
    downloadCSV(csvContent, 'all_faculty.csv');
    
    showNotification('All faculty data exported successfully!', 'success');
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
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

function refreshFaculty() {
    showNotification('Refreshing faculty data...', 'info');
    
    setTimeout(() => {
        loadFaculty();
        updateStats();
        showNotification('Faculty data refreshed successfully!', 'success');
    }, 1000);
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
