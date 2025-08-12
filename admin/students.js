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

let STUDENTS_DATA = JSON.parse(localStorage.getItem('scms_students_data')) || [
    {
        id: 'ST001',
        name: 'Arjun Reddy',
        email: 'arjun.reddy@student.college.edu',
        phone: '+91-98765-54321',
        dob: '2002-05-15',
        address: 'Plot No. 123, Banjara Hills, Hyderabad, Telangana - 500034',
        rollNumber: '20CSE001',
        department: 'CSE',
        year: '3',
        semester: '6',
        cgpa: '8.5',
        status: 'active',
        guardianName: 'Ramesh Reddy',
        guardianPhone: '+91-98765-12345',
        joinDate: '2020-08-01',
        lastLogin: '2024-01-15 10:30:00'
    },
    {
        id: 'ST002',
        name: 'Sneha Kumari',
        email: 'sneha.kumari@student.college.edu',
        phone: '+91-98765-54322',
        dob: '2002-08-22',
        address: 'Flat 2B, Koregaon Park, Pune, Maharashtra - 411001',
        rollNumber: '20CSE002',
        department: 'CSE',
        year: '3',
        semester: '6',
        cgpa: '9.1',
        status: 'active',
        guardianName: 'Suresh Kumar',
        guardianPhone: '+91-98765-12346',
        joinDate: '2020-08-01',
        lastLogin: '2024-01-15 11:15:00'
    },
    {
        id: 'ST003',
        name: 'Rohit Sharma',
        email: 'rohit.sharma@student.college.edu',
        phone: '+91-98765-54323',
        dob: '2003-02-10',
        address: 'House No. 45, Lajpat Nagar, New Delhi - 110024',
        rollNumber: '21ECE001',
        department: 'ECE',
        year: '2',
        semester: '4',
        cgpa: '7.8',
        status: 'active',
        guardianName: 'Vijay Sharma',
        guardianPhone: '+91-98765-12347',
        joinDate: '2021-08-01',
        lastLogin: '2024-01-14 16:45:00'
    },
    {
        id: 'ST004',
        name: 'Kavya Nair',
        email: 'kavya.nair@student.college.edu',
        phone: '+91-98765-54324',
        dob: '2002-11-05',
        address: 'Kakkanad, Kochi, Kerala - 682030',
        rollNumber: '20EEE001',
        department: 'EEE',
        year: '3',
        semester: '5',
        cgpa: '8.9',
        status: 'active',
        guardianName: 'Rajesh Nair',
        guardianPhone: '+91-98765-12348',
        joinDate: '2020-08-01',
        lastLogin: '2024-01-15 09:20:00'
    },
    {
        id: 'ST005',
        name: 'Amit Kumar',
        email: 'amit.kumar@student.college.edu',
        phone: '+91-98765-54325',
        dob: '2001-07-18',
        address: 'Boring Road, Patna, Bihar - 800001',
        rollNumber: '19MECH001',
        department: 'MECH',
        year: '4',
        semester: '7',
        cgpa: '8.2',
        status: 'active',
        guardianName: 'Santosh Kumar',
        guardianPhone: '+91-98765-12349',
        joinDate: '2019-08-01',
        lastLogin: '2024-01-15 12:30:00'
    },
    {
        id: 'ST006',
        name: 'Priya Patel',
        email: 'priya.patel@student.college.edu',
        phone: '+91-98765-54326',
        dob: '2002-12-03',
        address: 'Satellite, Ahmedabad, Gujarat - 380015',
        rollNumber: '20CIVIL001',
        department: 'CIVIL',
        year: '3',
        semester: '6',
        cgpa: '8.7',
        status: 'active',
        guardianName: 'Mahesh Patel',
        guardianPhone: '+91-98765-12350',
        joinDate: '2020-08-01',
        lastLogin: '2024-01-14 14:15:00'
    },
    {
        id: 'ST007',
        name: 'Rahul Singh',
        email: 'rahul.singh@student.college.edu',
        phone: '+91-98765-54327',
        dob: '2001-03-12',
        address: 'Gomti Nagar, Lucknow, UP - 226010',
        rollNumber: '19CSE003',
        department: 'CSE',
        year: '4',
        semester: '8',
        cgpa: '9.3',
        status: 'graduated',
        guardianName: 'Deepak Singh',
        guardianPhone: '+91-98765-12351',
        joinDate: '2019-08-01',
        lastLogin: '2024-01-10 10:00:00'
    },
    {
        id: 'ST008',
        name: 'Ananya Gupta',
        email: 'ananya.gupta@student.college.edu',
        phone: '+91-98765-54328',
        dob: '2003-06-25',
        address: 'Sector 15, Noida, UP - 201301',
        rollNumber: '21IT001',
        department: 'IT',
        year: '2',
        semester: '3',
        cgpa: '8.0',
        status: 'active',
        guardianName: 'Ashok Gupta',
        guardianPhone: '+91-98765-12352',
        joinDate: '2021-08-01',
        lastLogin: '2024-01-15 15:30:00'
    }
];

let filteredStudents = [...STUDENTS_DATA];
let selectedStudents = new Set();
let editingStudentId = null;
let currentView = 'table';

function saveDataToStorage() {
    localStorage.setItem('scms_students_data', JSON.stringify(STUDENTS_DATA));
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    loadStudents();
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
    const totalStudents = STUDENTS_DATA.length;
    const activeStudents = STUDENTS_DATA.filter(s => s.status === 'active').length;
    const graduatedStudents = STUDENTS_DATA.filter(s => s.status === 'graduated').length;
    const cgpaSum = STUDENTS_DATA.reduce((sum, s) => sum + parseFloat(s.cgpa || 0), 0);
    const avgCgpa = totalStudents > 0 ? cgpaSum / totalStudents : 0;
    
    const totalElement = document.getElementById('totalStudents');
    const activeElement = document.getElementById('activeStudents');
    const graduatedElement = document.getElementById('graduatedStudents');
    const avgCgpaElement = document.getElementById('avgCgpa');
    
    if (totalElement) totalElement.textContent = totalStudents.toLocaleString();
    if (activeElement) activeElement.textContent = activeStudents.toLocaleString();
    if (graduatedElement) graduatedElement.textContent = graduatedStudents.toLocaleString();
    if (avgCgpaElement) avgCgpaElement.textContent = avgCgpa.toFixed(1);
}

function switchView(view) {
    currentView = view;
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');
    const studentsContainer = document.getElementById('studentsContainer');
    const tableContainer = document.getElementById('tableContainer');
    
    if (!cardViewBtn || !tableViewBtn || !studentsContainer || !tableContainer) return;
    
    if (view === 'card') {
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        studentsContainer.style.display = 'grid';
        tableContainer.style.display = 'none';
        loadStudentCards();
    } else {
        tableViewBtn.classList.add('active');
        cardViewBtn.classList.remove('active');
        studentsContainer.style.display = 'none';
        tableContainer.style.display = 'block';
        loadStudentTable();
    }
}

function loadStudents() {
    if (currentView === 'card') {
        loadStudentCards();
    } else {
        loadStudentTable();
    }
    updateSelectedCount();
}

function loadStudentCards() {
    const container = document.getElementById('studentsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (filteredStudents.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-graduate fa-3x"></i>
                <h3>No Students Found</h3>
                <p>No students match your current filters.</p>
            </div>
        `;
        return;
    }
    
    filteredStudents.forEach(student => {
        const studentCard = createStudentCard(student);
        container.appendChild(studentCard);
    });
}

function loadStudentTable() {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    filteredStudents.forEach(student => {
        const row = createStudentTableRow(student);
        tbody.appendChild(row);
    });
}

function createStudentCard(student) {
    const card = document.createElement('div');
    card.className = 'student-card';
    
    const initials = student.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const cgpaClass = getCgpaClass(parseFloat(student.cgpa || 0));
    const statusClass = `status-${student.status}`;
    
    card.innerHTML = `
        <div class="student-card-header">
            <div class="student-avatar">${initials}</div>
            <div class="student-info">
                <h3>${student.name}</h3>
                <p>${student.rollNumber} • ${student.department}</p>
            </div>
        </div>
        
        <div class="student-card-body">
            <div class="info-grid">
                <div class="info-item">
                    <div class="label">Year</div>
                    <div class="value">${student.year}</div>
                </div>
                <div class="info-item">
                    <div class="label">Semester</div>
                    <div class="value">${student.semester}</div>
                </div>
                <div class="info-item">
                    <div class="label">CGPA</div>
                    <div class="value cgpa-badge ${cgpaClass}">${student.cgpa || 'N/A'}</div>
                </div>
                <div class="info-item">
                    <div class="label">Status</div>
                    <div class="value status-badge ${statusClass}">${student.status.charAt(0).toUpperCase() + student.status.slice(1)}</div>
                </div>
            </div>
            
            <div class="student-actions">
                <button class="action-btn action-view" onclick="showStudentDetails('${student.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn action-edit" onclick="editStudent('${student.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn action-delete" onclick="deleteStudent('${student.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function createStudentTableRow(student) {
    const row = document.createElement('tr');
    const initials = student.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const cgpaClass = getCgpaClass(parseFloat(student.cgpa || 0));
    const statusClass = `status-${student.status}`;
    
    row.innerHTML = `
        <td>
            <input type="checkbox" class="student-checkbox" value="${student.id}" onchange="toggleStudentSelection('${student.id}')">
        </td>
        <td>
            <div class="student-profile">
                <div class="user-avatar-sm">${initials}</div>
                <div class="student-info-text">
                    <h4>${student.name}</h4>
                    <p>${student.rollNumber}</p>
                    <p style="font-size: 0.8em; opacity: 0.8;">${student.email}</p>
                </div>
            </div>
        </td>
        <td>
            <span class="department-badge">${student.department}</span>
        </td>
        <td>
            <div>Year ${student.year} • Semester ${student.semester}</div>
            <div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 2px;">
                Joined: ${new Date(student.joinDate).getFullYear()}
            </div>
        </td>
        <td>
            <span class="cgpa-badge ${cgpaClass}">${student.cgpa || 'N/A'}</span>
        </td>
        <td>
            <span class="status-badge ${statusClass}">
                ${student.status.charAt(0).toUpperCase() + student.status.slice(1)}
            </span>
        </td>
        <td>
            <div>${student.phone}</div>
            <div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 2px;">
                ${student.guardianName || 'No guardian info'}
            </div>
        </td>
        <td>
            <div class="action-buttons">
                <button class="action-btn action-view" onclick="showStudentDetails('${student.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn action-edit" onclick="editStudent('${student.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn action-delete" onclick="deleteStudent('${student.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

function getCgpaClass(cgpa) {
    if (cgpa >= 8.5) return 'cgpa-excellent';
    if (cgpa >= 7.0) return 'cgpa-good';
    return 'cgpa-average';
}

function searchStudents() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    applyFilters(searchTerm);
}

function filterStudents() {
    applyFilters();
}

function applyFilters(searchTerm = '') {
    const departmentFilter = document.getElementById('departmentFilter');
    const yearFilter = document.getElementById('yearFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    
    const departmentValue = departmentFilter ? departmentFilter.value : '';
    const yearValue = yearFilter ? yearFilter.value : '';
    const statusValue = statusFilter ? statusFilter.value : '';
    
    if (!searchTerm && searchInput) {
        searchTerm = searchInput.value.toLowerCase();
    }
    
    filteredStudents = STUDENTS_DATA.filter(student => {
        const matchesSearch = !searchTerm || 
            student.name.toLowerCase().includes(searchTerm) ||
            student.rollNumber.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm) ||
            student.phone.includes(searchTerm);
        
        const matchesDepartment = !departmentValue || student.department === departmentValue;
        const matchesYear = !yearValue || student.year === yearValue;
        const matchesStatus = !statusValue || student.status === statusValue;
        
        return matchesSearch && matchesDepartment && matchesYear && matchesStatus;
    });
    
    loadStudents();
    
    if (searchTerm || departmentValue || yearValue || statusValue) {
        showNotification(`Found ${filteredStudents.length} students matching your criteria`, 'info');
    }
}

function toggleStudentSelection(studentId) {
    if (selectedStudents.has(studentId)) {
        selectedStudents.delete(studentId);
    } else {
        selectedStudents.add(studentId);
    }
    updateSelectedCount();
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const isChecked = selectAll ? selectAll.checked : false;
    const checkboxes = document.querySelectorAll('.student-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        if (isChecked) {
            selectedStudents.add(checkbox.value);
        } else {
            selectedStudents.delete(checkbox.value);
        }
    });
    
    updateSelectedCount();
}

function toggleMasterCheckbox() {
    const masterCheckbox = document.getElementById('masterCheckbox');
    const isChecked = masterCheckbox ? masterCheckbox.checked : false;
    const checkboxes = document.querySelectorAll('.student-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        if (isChecked) {
            selectedStudents.add(checkbox.value);
        } else {
            selectedStudents.delete(checkbox.value);
        }
    });
    
    updateSelectedCount();
}

function updateSelectedCount() {
    const selectedCountElement = document.getElementById('selectedCount');
    if (selectedCountElement) {
        selectedCountElement.textContent = 
            `${selectedStudents.size} student${selectedStudents.size !== 1 ? 's' : ''} selected`;
    }
    
    const totalCheckboxes = document.querySelectorAll('.student-checkbox').length;
    const masterCheckbox = document.getElementById('masterCheckbox');
    
    if (masterCheckbox) {
        if (selectedStudents.size === 0) {
            masterCheckbox.indeterminate = false;
            masterCheckbox.checked = false;
        } else if (selectedStudents.size === totalCheckboxes) {
            masterCheckbox.indeterminate = false;
            masterCheckbox.checked = true;
        } else {
            masterCheckbox.indeterminate = true;
            masterCheckbox.checked = false;
        }
    }
}

function openAddStudentModal() {
    editingStudentId = null;
    const modalTitle = document.getElementById('modalTitle');
    const studentForm = document.getElementById('studentForm');
    const studentModal = document.getElementById('studentModal');
    
    if (modalTitle) modalTitle.textContent = 'Add New Student';
    if (studentForm) studentForm.reset();
    if (studentModal) studentModal.classList.add('show');
}

function editStudent(studentId) {
    const student = STUDENTS_DATA.find(s => s.id === studentId);
    if (!student) return;
    
    editingStudentId = studentId;
    const modalTitle = document.getElementById('modalTitle');
    const studentModal = document.getElementById('studentModal');
    
    if (modalTitle) modalTitle.textContent = 'Edit Student';
    
    const fields = [
        'studentName', 'studentEmail', 'studentPhone', 'studentDob', 'studentAddress',
        'rollNumber', 'department', 'academicYear', 'currentSemester', 'cgpa', 
        'status', 'guardianName', 'guardianPhone'
    ];
    
    const fieldMapping = {
        'studentName': 'name',
        'studentEmail': 'email',
        'studentPhone': 'phone',
        'studentDob': 'dob',
        'studentAddress': 'address',
        'rollNumber': 'rollNumber',
        'department': 'department',
        'academicYear': 'year',
        'currentSemester': 'semester',
        'cgpa': 'cgpa',
        'status': 'status',
        'guardianName': 'guardianName',
        'guardianPhone': 'guardianPhone'
    };
    
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        const dataKey = fieldMapping[fieldId];
        if (element && student[dataKey] !== undefined) {
            element.value = student[dataKey] || '';
        }
    });
    
    if (studentModal) studentModal.classList.add('show');
}

function deleteStudent(studentId) {
    const student = STUDENTS_DATA.find(s => s.id === studentId);
    if (!student) return;
    
    if (confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
        const index = STUDENTS_DATA.findIndex(s => s.id === studentId);
        if (index !== -1) {
            STUDENTS_DATA.splice(index, 1);
            filteredStudents = filteredStudents.filter(s => s.id !== studentId);
            selectedStudents.delete(studentId);
            
            saveDataToStorage();
            loadStudents();
            updateStats();
            showNotification(`${student.name} has been deleted successfully`, 'success');
        }
    }
}

function saveStudent(event) {
    event.preventDefault();
    
    const getElementValue = (id) => {
        const element = document.getElementById(id);
        return element ? element.value.trim() : '';
    };
    
    const formData = {
        name: getElementValue('studentName'),
        email: getElementValue('studentEmail'),
        phone: getElementValue('studentPhone'),
        dob: getElementValue('studentDob'),
        address: getElementValue('studentAddress'),
        rollNumber: getElementValue('rollNumber'),
        department: getElementValue('department'),
        year: getElementValue('academicYear'),
        semester: getElementValue('currentSemester'),
        cgpa: getElementValue('cgpa'),
        status: getElementValue('status'),
        guardianName: getElementValue('guardianName'),
        guardianPhone: getElementValue('guardianPhone')
    };
    
    if (!formData.name || !formData.email || !formData.rollNumber || !formData.department || !formData.year) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (editingStudentId) {
        const studentIndex = STUDENTS_DATA.findIndex(s => s.id === editingStudentId);
        if (studentIndex !== -1) {
            STUDENTS_DATA[studentIndex] = { ...STUDENTS_DATA[studentIndex], ...formData };
            showNotification(`${formData.name} updated successfully`, 'success');
        }
    } else {
        const existingRollNumber = STUDENTS_DATA.find(s => s.rollNumber === formData.rollNumber);
        if (existingRollNumber) {
            showNotification('Roll number already exists', 'error');
            return;
        }
        
        const existingEmail = STUDENTS_DATA.find(s => s.email === formData.email);
        if (existingEmail) {
            showNotification('Email already exists', 'error');
            return;
        }
        
        const newStudent = {
            id: 'ST' + String(Date.now()).slice(-6),
            ...formData,
            joinDate: new Date().toISOString().split('T')[0],
            lastLogin: null
        };
        
        STUDENTS_DATA.push(newStudent);
        showNotification(`${formData.name} added successfully`, 'success');
    }
    
    saveDataToStorage();
    closeModal();
    applyFilters();
    updateStats();
}

function showStudentDetails(studentId) {
    const student = STUDENTS_DATA.find(s => s.id === studentId);
    if (!student) return;
    
    const detailsTitle = document.getElementById('studentDetailsTitle');
    const detailsContent = document.getElementById('studentDetailsContent');
    const detailsModal = document.getElementById('studentDetailsModal');
    
    if (detailsTitle) detailsTitle.textContent = `${student.name} - Student Details`;
    
    if (detailsContent) {
        detailsContent.innerHTML = `
            <div class="student-details-view">
                <div class="detail-section">
                    <h4><i class="fas fa-user"></i> Personal Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Full Name:</label>
                            <span>${student.name}</span>
                        </div>
                        <div class="detail-item">
                            <label>Email:</label>
                            <span>${student.email}</span>
                        </div>
                        <div class="detail-item">
                            <label>Phone:</label>
                            <span>${student.phone}</span>
                        </div>
                        <div class="detail-item">
                            <label>Date of Birth:</label>
                            <span>${student.dob ? new Date(student.dob).toLocaleDateString() : 'Not provided'}</span>
                        </div>
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <label>Address:</label>
                            <span>${student.address || 'Not provided'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-graduation-cap"></i> Academic Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Roll Number:</label>
                            <span>${student.rollNumber}</span>
                        </div>
                        <div class="detail-item">
                            <label>Department:</label>
                            <span class="department-badge">${student.department}</span>
                        </div>
                        <div class="detail-item">
                            <label>Academic Year:</label>
                            <span>Year ${student.year}</span>
                        </div>
                        <div class="detail-item">
                            <label>Current Semester:</label>
                            <span>Semester ${student.semester}</span>
                        </div>
                        <div class="detail-item">
                            <label>CGPA:</label>
                            <span class="cgpa-badge ${getCgpaClass(parseFloat(student.cgpa || 0))}">${student.cgpa || 'Not available'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Status:</label>
                            <span class="status-badge status-${student.status}">
                                ${student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                            </span>
                        </div>
                        <div class="detail-item">
                            <label>Join Date:</label>
                            <span>${new Date(student.joinDate).toLocaleDateString()}</span>
                        </div>
                        <div class="detail-item">
                            <label>Last Login:</label>
                            <span>${student.lastLogin ? new Date(student.lastLogin).toLocaleString() : 'Never'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-users"></i> Guardian Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Guardian Name:</label>
                            <span>${student.guardianName || 'Not provided'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Guardian Phone:</label>
                            <span>${student.guardianPhone || 'Not provided'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    if (detailsModal) detailsModal.classList.add('show');
}

function updateRollNumberPrefix() {
    const departmentSelect = document.getElementById('department');
    const rollNumberField = document.getElementById('rollNumber');
    
    if (departmentSelect && rollNumberField) {
        const department = departmentSelect.value;
        if (department) {
            const currentYear = new Date().getFullYear().toString().slice(-2);
            const prefix = `${currentYear}${department}`;
            if (!rollNumberField.value.startsWith(prefix)) {
                rollNumberField.placeholder = `${prefix}001`;
            }
        }
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
    editingStudentId = null;
}

function bulkAction(action) {
    if (selectedStudents.size === 0) {
        showNotification('No students selected', 'error');
        return;
    }
    
    const actionText = action === 'activate' ? 'activate' : 'deactivate';
    const newStatus = action === 'activate' ? 'active' : 'inactive';
    
    if (confirm(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} ${selectedStudents.size} selected students?`)) {
        let updatedCount = 0;
        STUDENTS_DATA.forEach(student => {
            if (selectedStudents.has(student.id)) {
                student.status = newStatus;
                updatedCount++;
            }
        });
        
        selectedStudents.clear();
        const checkboxes = document.querySelectorAll('.student-checkbox, #selectAll, #masterCheckbox');
        checkboxes.forEach(cb => cb.checked = false);
        
        saveDataToStorage();
        loadStudents();
        updateStats();
        showNotification(`${updatedCount} students ${actionText}d successfully`, 'success');
    }
}

function exportSelected() {
    if (selectedStudents.size === 0) {
        showNotification('No students selected for export', 'error');
        return;
    }
    
    const selectedData = STUDENTS_DATA.filter(student => selectedStudents.has(student.id));
    const csvContent = convertToCSV(selectedData);
    downloadCSV(csvContent, 'selected_students.csv');
    
    showNotification(`${selectedStudents.size} students exported successfully!`, 'success');
}

function importStudents() {
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
                    importedData.forEach(studentData => {
                        const existingRoll = STUDENTS_DATA.find(s => s.rollNumber === studentData.rollNumber);
                        const existingEmail = STUDENTS_DATA.find(s => s.email === studentData.email);
                        
                        if (!existingRoll && !existingEmail && studentData.name && studentData.email) {
                            const newStudent = {
                                id: 'ST' + String(Date.now() + addedCount).slice(-6),
                                ...studentData,
                                joinDate: studentData.joinDate || new Date().toISOString().split('T')[0],
                                lastLogin: null,
                                status: studentData.status || 'active'
                            };
                            STUDENTS_DATA.push(newStudent);
                            addedCount++;
                        }
                    });
                    
                    if (addedCount > 0) {
                        saveDataToStorage();
                        applyFilters();
                        updateStats();
                        showNotification(`${addedCount} students imported successfully!`, 'success');
                    } else {
                        showNotification('No new students to import (duplicates found)', 'error');
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

function exportStudents() {
    if (STUDENTS_DATA.length === 0) {
        showNotification('No students to export', 'error');
        return;
    }
    
    const csvContent = convertToCSV(STUDENTS_DATA);
    downloadCSV(csvContent, 'all_students.csv');
    
    showNotification('All student data exported successfully!', 'success');
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

function refreshStudents() {
    showNotification('Refreshing student data...', 'info');
    
    setTimeout(() => {
        loadStudents();
        updateStats();
        showNotification('Student data refreshed successfully!', 'success');
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
