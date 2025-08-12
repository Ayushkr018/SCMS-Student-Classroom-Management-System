function initializeTheme() {
    const savedTheme = localStorage.getItem('scms-theme') || 'light';
    const themeIcon = document.getElementById('themeIcon');
    const mobileThemeIcon = document.getElementById('mobileThemeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const themeSwitch = document.getElementById('themeSwitch');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        mobileThemeIcon.className = 'fas fa-sun';
        themeLabel.textContent = 'Light Mode';
        themeSwitch.classList.add('active');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon';
        mobileThemeIcon.className = 'fas fa-moon';
        themeLabel.textContent = 'Dark Mode';
        themeSwitch.classList.remove('active');
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
        themeIcon.className = 'fas fa-moon';
        mobileThemeIcon.className = 'fas fa-moon';
        themeLabel.textContent = 'Dark Mode';
        themeSwitch.classList.remove('active');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('scms-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        mobileThemeIcon.className = 'fas fa-sun';
        themeLabel.textContent = 'Light Mode';
        themeSwitch.classList.add('active');
    }
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

let FACULTY_DATA = [
    {
        id: 'F001',
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@college.edu',
        department: 'CSE',
        designation: 'Professor',
        subjects: ['Data Structures', 'Algorithms', 'DBMS'],
        phone: '+91-98765-43210',
        experience: '12 years',
        status: 'active'
    },
    {
        id: 'F002',
        name: 'Prof. Priya Sharma',
        email: 'priya.sharma@college.edu',
        department: 'ECE',
        designation: 'Associate Professor',
        subjects: ['Digital Electronics', 'Microprocessors', 'Communication Systems'],
        phone: '+91-98765-43211',
        experience: '8 years',
        status: 'active'
    },
    {
        id: 'F003',
        name: 'Dr. Anand Gupta',
        email: 'anand.gupta@college.edu',
        department: 'EEE',
        designation: 'Professor',
        subjects: ['Power Systems', 'Electrical Machines', 'Control Systems'],
        phone: '+91-98765-43212',
        experience: '15 years',
        status: 'active'
    },
    {
        id: 'F004',
        name: 'Ms. Meera Patel',
        email: 'meera.patel@college.edu',
        department: 'MECH',
        designation: 'Assistant Professor',
        subjects: ['Thermodynamics', 'Fluid Mechanics', 'Heat Transfer'],
        phone: '+91-98765-43213',
        experience: '6 years',
        status: 'active'
    },
    {
        id: 'F005',
        name: 'Prof. Vikram Singh',
        email: 'vikram.singh@college.edu',
        department: 'CIVIL',
        designation: 'Professor',
        subjects: ['Structural Engineering', 'Concrete Technology', 'Surveying'],
        phone: '+91-98765-43214',
        experience: '18 years',
        status: 'active'
    }
];

let STUDENTS_DATA = [
    {
        id: 'S001',
        name: 'Arjun Reddy',
        email: 'arjun.reddy@student.college.edu',
        rollNo: '20CSE001',
        department: 'CSE',
        year: '3',
        semester: '6',
        phone: '+91-98765-54321',
        address: 'Hyderabad, Telangana',
        cgpa: '8.5',
        status: 'active'
    },
    {
        id: 'S002',
        name: 'Sneha Kumari',
        email: 'sneha.kumari@student.college.edu',
        rollNo: '20CSE002',
        department: 'CSE',
        year: '3',
        semester: '6',
        phone: '+91-98765-54322',
        address: 'Pune, Maharashtra',
        cgpa: '9.1',
        status: 'active'
    },
    {
        id: 'S003',
        name: 'Rohit Sharma',
        email: 'rohit.sharma@student.college.edu',
        rollNo: '21ECE001',
        department: 'ECE',
        year: '2',
        semester: '4',
        phone: '+91-98765-54323',
        address: 'Delhi, Delhi',
        cgpa: '7.8',
        status: 'active'
    },
    {
        id: 'S004',
        name: 'Kavya Nair',
        email: 'kavya.nair@student.college.edu',
        rollNo: '20EEE001',
        department: 'EEE',
        year: '3',
        semester: '5',
        phone: '+91-98765-54324',
        address: 'Kochi, Kerala',
        cgpa: '8.9',
        status: 'active'
    },
    {
        id: 'S005',
        name: 'Amit Kumar',
        email: 'amit.kumar@student.college.edu',
        rollNo: '19MECH001',
        department: 'MECH',
        year: '4',
        semester: '7',
        phone: '+91-98765-54325',
        address: 'Patna, Bihar',
        cgpa: '8.2',
        status: 'active'
    },
    {
        id: 'S006',
        name: 'Divya Singh',
        email: 'divya.singh@student.college.edu',
        rollNo: '20CSE003',
        department: 'CSE',
        year: '3',
        semester: '6',
        phone: '+91-98765-54326',
        address: 'Lucknow, UP',
        cgpa: '8.7',
        status: 'active'
    }
];

let CLASSES_DATA = [
    {
        id: 'CL001',
        name: 'CSE-A',
        department: 'CSE',
        section: 'A',
        year: '3',
        semester: '6',
        classTeacherId: 'F001',
        classTeacherName: 'Dr. Rajesh Kumar',
        maxStudents: 60,
        studentIds: ['S001', 'S002', 'S006'],
        facultyIds: ['F001'],
        classroom: 'CSE-301',
        status: 'active',
        createdDate: '2023-01-15'
    },
    {
        id: 'CL002',
        name: 'CSE-B',
        department: 'CSE',
        section: 'B',
        year: '3',
        semester: '6',
        classTeacherId: null,
        classTeacherName: 'Not Assigned',
        maxStudents: 60,
        studentIds: [],
        facultyIds: [],
        classroom: 'CSE-302',
        status: 'active',
        createdDate: '2023-01-15'
    },
    {
        id: 'CL003',
        name: 'ECE-A',
        department: 'ECE',
        section: 'A',
        year: '2',
        semester: '4',
        classTeacherId: 'F002',
        classTeacherName: 'Prof. Priya Sharma',
        maxStudents: 60,
        studentIds: ['S003'],
        facultyIds: ['F002'],
        classroom: 'ECE-201',
        status: 'active',
        createdDate: '2023-01-15'
    },
    {
        id: 'CL004',
        name: 'EEE-A',
        department: 'EEE',
        section: 'A',
        year: '3',
        semester: '5',
        classTeacherId: 'F003',
        classTeacherName: 'Dr. Anand Gupta',
        maxStudents: 60,
        studentIds: ['S004'],
        facultyIds: ['F003'],
        classroom: 'EEE-301',
        status: 'active',
        createdDate: '2023-01-15'
    },
    {
        id: 'CL005',
        name: 'MECH-A',
        department: 'MECH',
        section: 'A',
        year: '4',
        semester: '7',
        classTeacherId: 'F004',
        classTeacherName: 'Ms. Meera Patel',
        maxStudents: 60,
        studentIds: ['S005'],
        facultyIds: ['F004'],
        classroom: 'MECH-401',
        status: 'active',
        createdDate: '2023-01-15'
    }
];

let filteredClasses = [...CLASSES_DATA];
let editingClassId = null;
let currentView = 'table';
let currentClassForStudents = null;
let currentClassForFaculty = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    loadClasses();
    loadFacultyInDropdown();
    updateStats();
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    });
});

function loadCurrentUser() {
    const currentUser = localStorage.getItem('scms_current_user');
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

    document.getElementById('userName').textContent = user.name;
}

function logout() {
    localStorage.removeItem('scms_current_user');
    showNotification('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
}

function updateStats() {
    const totalClasses = CLASSES_DATA.length;
    const totalFaculty = FACULTY_DATA.length;
    const totalStudents = STUDENTS_DATA.length;
    const totalDepartments = 6;
    
    document.getElementById('classCount').textContent = totalClasses;
    document.getElementById('facultyCount').textContent = totalFaculty;
    document.getElementById('studentCount').textContent = totalStudents.toLocaleString();
    document.getElementById('departmentCount').textContent = totalDepartments;
}

function switchView(view) {
    currentView = view;
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');
    const classesContainer = document.getElementById('classesContainer');
    const tableContainer = document.getElementById('tableContainer');
    
    if (view === 'card') {
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        classesContainer.style.display = 'grid';
        tableContainer.style.display = 'none';
        loadClassCards();
    } else {
        tableViewBtn.classList.add('active');
        cardViewBtn.classList.remove('active');
        classesContainer.style.display = 'none';
        tableContainer.style.display = 'block';
        loadClassTable();
    }
}

function loadClasses() {
    if (currentView === 'card') {
        loadClassCards();
    } else {
        loadClassTable();
    }
}

function loadClassCards() {
    const container = document.getElementById('classesContainer');
    container.innerHTML = '';
    
    if (filteredClasses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chalkboard fa-3x"></i>
                <h3>No Classes Found</h3>
                <p>No classes match your current filters.</p>
            </div>
        `;
        return;
    }
    
    filteredClasses.forEach(classData => {
        const classCard = createClassCard(classData);
        container.appendChild(classCard);
    });
}

function loadClassTable() {
    const tbody = document.getElementById('classesTableBody');
    tbody.innerHTML = '';

    filteredClasses.forEach(classData => {
        const row = createClassTableRow(classData);
        tbody.appendChild(row);
    });
}

function createClassCard(classData) {
    const card = document.createElement('div');
    card.className = 'class-card';
    
    const students = STUDENTS_DATA.filter(student => classData.studentIds.includes(student.id));
    const faculty = FACULTY_DATA.filter(f => classData.facultyIds.includes(f.id));
    const classTeacher = FACULTY_DATA.find(f => f.id === classData.classTeacherId);
    
    card.innerHTML = `
        <div class="class-header">
            <div class="class-info">
                <h3>${classData.name}</h3>
                <p class="class-details">
                    ${classData.department} Department | Year ${classData.year} | Semester ${classData.semester}
                </p>
            </div>
            <div class="class-actions">
                <button class="btn btn-sm btn-primary" onclick="showClassDetails('${classData.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editClass('${classData.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="showManageStudentsModal('${classData.id}')">
                    <i class="fas fa-user-graduate"></i>
                </button>
                <button class="btn btn-sm btn-purple" onclick="showManageFacultyModal('${classData.id}')">
                    <i class="fas fa-user-tie"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteClass('${classData.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        
        <div class="class-body">
            <div class="class-section">
                <h4><i class="fas fa-user-tie"></i> Class Teacher</h4>
                <div class="class-teacher-info">
                    <div class="user-avatar-sm teacher">${classTeacher ? classTeacher.name.split(' ').map(n => n[0]).join('') : 'N/A'}</div>
                    <div>
                        <strong>${classTeacher ? classTeacher.name : 'Not Assigned'}</strong>
                        <p>${classTeacher ? classTeacher.designation : ''}</p>
                    </div>
                </div>
            </div>
            
            <div class="class-section">
                <h4><i class="fas fa-user-graduate"></i> Students (${students.length}/${classData.maxStudents})</h4>
                <div class="students-grid">
                    ${students.slice(0, 6).map(student => `
                        <div class="student-item">
                            <div class="user-avatar-sm student">${student.name.split(' ').map(n => n[0]).join('')}</div>
                            <span>${student.name}</span>
                        </div>
                    `).join('')}
                    ${students.length > 6 ? `<div class="more-count">+${students.length - 6} more</div>` : ''}
                </div>
            </div>
            
            <div class="class-section">
                <h4><i class="fas fa-users"></i> Faculty (${faculty.length})</h4>
                <div class="students-grid">
                    ${faculty.slice(0, 4).map(f => `
                        <div class="faculty-item">
                            <div class="user-avatar-sm teacher">${f.name.split(' ').map(n => n[0]).join('')}</div>
                            <span>${f.name}</span>
                        </div>
                    `).join('')}
                    ${faculty.length > 4 ? `<div class="more-count">+${faculty.length - 4} more</div>` : ''}
                </div>
            </div>
        </div>
    `;
    
    return card;
}

function createClassTableRow(classData) {
    const row = document.createElement('tr');
    const classTeacher = FACULTY_DATA.find(f => f.id === classData.classTeacherId);
    const students = STUDENTS_DATA.filter(s => classData.studentIds.includes(s.id));
    const faculty = FACULTY_DATA.filter(f => classData.facultyIds.includes(f.id));
    
    row.innerHTML = `
        <td>
            <div class="class-profile">
                <div class="class-avatar">${classData.department}</div>
                <div class="class-info-text">
                    <h4>${classData.name}</h4>
                    <p>${classData.department} Department | Year ${classData.year}</p>
                    <p style="font-size: 0.8em; opacity: 0.8;">Room: ${classData.classroom}</p>
                </div>
            </div>
        </td>
        <td>
            <div class="user-profile">
                <div class="user-avatar-sm teacher">${classTeacher ? classTeacher.name.split(' ').map(n => n[0]).join('') : 'N/A'}</div>
                <div class="user-info-text">
                    <h4>${classTeacher ? classTeacher.name : 'Not Assigned'}</h4>
                    <p>${classTeacher ? classTeacher.designation : ''}</p>
                </div>
            </div>
        </td>
        <td>
            <span class="student-count">${students.length}/${classData.maxStudents}</span>
            <div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 2px;">
                ${students.length > 0 ? students.slice(0, 3).map(s => s.name.split(' ')[0]).join(', ') : 'No students'}
                ${students.length > 3 ? ` +${students.length - 3} more` : ''}
            </div>
        </td>
        <td>
            <span class="faculty-count">${faculty.length} Faculty</span>
            <div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 2px;">
                ${faculty.length > 0 ? faculty.slice(0, 2).map(f => f.name.split(' ')[0]).join(', ') : 'No faculty'}
                ${faculty.length > 2 ? ` +${faculty.length - 2} more` : ''}
            </div>
        </td>
        <td>
            <span class="semester-badge">Semester ${classData.semester}</span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="action-btn action-view" onclick="showClassDetails('${classData.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn action-edit" onclick="editClass('${classData.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn action-students" onclick="showManageStudentsModal('${classData.id}')">
                    <i class="fas fa-user-graduate"></i>
                </button>
                <button class="action-btn action-faculty" onclick="showManageFacultyModal('${classData.id}')">
                    <i class="fas fa-user-tie"></i>
                </button>
                <button class="action-btn action-delete" onclick="deleteClass('${classData.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

function searchClasses() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    applyFilters(searchTerm);
}

function filterClasses() {
    applyFilters();
}

function applyFilters(searchTerm = '') {
    const departmentFilter = document.getElementById('departmentFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;
    const semesterFilter = document.getElementById('semesterFilter').value;
    
    if (!searchTerm) {
        searchTerm = document.getElementById('searchInput').value.toLowerCase();
    }
    
    filteredClasses = CLASSES_DATA.filter(classData => {
        const matchesSearch = !searchTerm || 
            classData.name.toLowerCase().includes(searchTerm) ||
            classData.department.toLowerCase().includes(searchTerm) ||
            classData.classTeacherName.toLowerCase().includes(searchTerm);
        
        const matchesDepartment = !departmentFilter || classData.department === departmentFilter;
        const matchesYear = !yearFilter || classData.year === yearFilter;
        const matchesSemester = !semesterFilter || classData.semester === semesterFilter;
        
        return matchesSearch && matchesDepartment && matchesYear && matchesSemester;
    });
    
    loadClasses();
    
    if (searchTerm || departmentFilter || yearFilter || semesterFilter) {
        showNotification(`Found ${filteredClasses.length} classes matching your criteria`, 'info');
    }
}

function openAddClassModal() {
    editingClassId = null;
    document.getElementById('modalTitle').textContent = 'Add New Class';
    document.getElementById('classForm').reset();
    document.getElementById('classModal').classList.add('show');
}

function editClass(classId) {
    const classData = CLASSES_DATA.find(c => c.id === classId);
    if (!classData) return;
    
    editingClassId = classId;
    document.getElementById('modalTitle').textContent = 'Edit Class';
    
    document.getElementById('classDepartment').value = classData.department;
    document.getElementById('classSection').value = classData.section;
    document.getElementById('academicYear').value = classData.year;
    document.getElementById('currentSemester').value = classData.semester;
    document.getElementById('classTeacher').value = classData.classTeacherId || '';
    document.getElementById('maxStudents').value = classData.maxStudents;
    document.getElementById('classroom').value = classData.classroom;
    
    document.getElementById('classModal').classList.add('show');
}

function deleteClass(classId) {
    const classData = CLASSES_DATA.find(c => c.id === classId);
    if (!classData) return;
    
    if (confirm(`Are you sure you want to delete ${classData.name}? This action cannot be undone.`)) {
        CLASSES_DATA = CLASSES_DATA.filter(c => c.id !== classId);
        filteredClasses = filteredClasses.filter(c => c.id !== classId);
        
        loadClasses();
        updateStats();
        showNotification(`${classData.name} has been deleted successfully`, 'success');
    }
}

function saveClass(event) {
    event.preventDefault();
    
    const formData = {
        department: document.getElementById('classDepartment').value,
        section: document.getElementById('classSection').value,
        year: document.getElementById('academicYear').value,
        semester: document.getElementById('currentSemester').value,
        classTeacherId: document.getElementById('classTeacher').value || null,
        maxStudents: parseInt(document.getElementById('maxStudents').value),
        classroom: document.getElementById('classroom').value
    };
    
    const classTeacher = FACULTY_DATA.find(f => f.id === formData.classTeacherId);
    formData.name = `${formData.department}-${formData.section}`;
    formData.classTeacherName = classTeacher ? classTeacher.name : 'Not Assigned';
    
    if (editingClassId) {
        const classIndex = CLASSES_DATA.findIndex(c => c.id === editingClassId);
        if (classIndex !== -1) {
            CLASSES_DATA[classIndex] = {
                ...CLASSES_DATA[classIndex],
                ...formData
            };
            showNotification(`${formData.name} updated successfully`, 'success');
        }
    } else {
        const newClass = {
            id: 'CL' + String(CLASSES_DATA.length + 1).padStart(3, '0'),
            ...formData,
            studentIds: [],
            facultyIds: formData.classTeacherId ? [formData.classTeacherId] : [],
            status: 'active',
            createdDate: new Date().toISOString().split('T')[0]
        };
        
        CLASSES_DATA.push(newClass);
        showNotification(`${formData.name} added successfully`, 'success');
    }
    
    closeModal();
    applyFilters();
    updateStats();
}

function showClassDetails(classId) {
    const classData = CLASSES_DATA.find(c => c.id === classId);
    if (!classData) return;
    
    const students = STUDENTS_DATA.filter(student => classData.studentIds.includes(student.id));
    const faculty = FACULTY_DATA.filter(f => classData.facultyIds.includes(f.id));
    const classTeacher = FACULTY_DATA.find(f => f.id === classData.classTeacherId);
    
    document.getElementById('classDetailsTitle').textContent = `${classData.name} Details`;
    document.getElementById('classDetailsContent').innerHTML = `
        <div class="class-details-view">
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> Class Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Class Name:</label>
                        <span>${classData.name}</span>
                    </div>
                    <div class="detail-item">
                        <label>Department:</label>
                        <span>${classData.department}</span>
                    </div>
                    <div class="detail-item">
                        <label>Section:</label>
                        <span>${classData.section}</span>
                    </div>
                    <div class="detail-item">
                        <label>Academic Year:</label>
                        <span>Year ${classData.year}</span>
                    </div>
                    <div class="detail-item">
                        <label>Current Semester:</label>
                        <span>Semester ${classData.semester}</span>
                    </div>
                    <div class="detail-item">
                        <label>Classroom:</label>
                        <span>${classData.classroom}</span>
                    </div>
                    <div class="detail-item">
                        <label>Capacity:</label>
                        <span>${students.length}/${classData.maxStudents} students</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-user-tie"></i> Class Teacher</h4>
                ${classTeacher ? `
                    <div class="user-profile">
                        <div class="user-avatar-sm teacher">${classTeacher.name.split(' ').map(n => n[0]).join('')}</div>
                        <div>
                            <strong>${classTeacher.name}</strong>
                            <p>${classTeacher.designation}</p>
                            <p>${classTeacher.email}</p>
                        </div>
                    </div>
                ` : '<p>No class teacher assigned</p>'}
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-users"></i> Faculty Members (${faculty.length})</h4>
                ${faculty.length > 0 ? `
                    <div class="faculty-grid">
                        ${faculty.map(f => `
                            <div class="faculty-card">
                                <div class="user-avatar-sm teacher">${f.name.split(' ').map(n => n[0]).join('')}</div>
                                <div class="card-info">
                                    <h5>${f.name}</h5>
                                    <p>${f.designation}</p>
                                    <p>${f.subjects.slice(0, 2).join(', ')}</p>
                                </div>
                                <button class="remove-btn" onclick="removeFacultyFromClass('${classData.id}', '${f.id}')">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p>No faculty assigned to this class</p>'}
                <div style="margin-top: 15px;">
                    <button class="btn btn-success" onclick="showManageFacultyModal('${classData.id}')">
                        <i class="fas fa-plus"></i> Add Faculty
                    </button>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-user-graduate"></i> Students List (${students.length})</h4>
                ${students.length > 0 ? `
                    <div class="students-grid">
                        ${students.map(student => `
                            <div class="student-card">
                                <div class="user-avatar-sm student">${student.name.split(' ').map(n => n[0]).join('')}</div>
                                <div class="card-info">
                                    <h5>${student.name}</h5>
                                    <p>${student.rollNo}</p>
                                    <p>CGPA: ${student.cgpa}</p>
                                </div>
                                <button class="remove-btn" onclick="removeStudentFromClass('${classData.id}', '${student.id}')">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p>No students enrolled in this class</p>'}
                <div style="margin-top: 15px;">
                    <button class="btn btn-success" onclick="showManageStudentsModal('${classData.id}')">
                        <i class="fas fa-plus"></i> Add Students
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('classDetailsModal').classList.add('show');
}

function showManageStudentsModal(classId) {
    currentClassForStudents = classId;
    const classData = CLASSES_DATA.find(c => c.id === classId);
    
    document.getElementById('studentsModalTitle').textContent = `Manage Students - ${classData.name}`;
    document.getElementById('manageStudentsModal').classList.add('show');
    
    switchTab('current-students');
    loadCurrentStudents(classId);
    loadAvailableStudents(classId);
}

function showManageFacultyModal(classId) {
    currentClassForFaculty = classId;
    const classData = CLASSES_DATA.find(c => c.id === classId);
    
    document.getElementById('facultyModalTitle').textContent = `Manage Faculty - ${classData.name}`;
    document.getElementById('manageFacultyModal').classList.add('show');
    
    switchTab('current-faculty');
    loadCurrentFaculty(classId);
    loadAvailableFaculty(classId);
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    const activeTab = tabName.includes('students') ? 
        (tabName === 'current-students' ? 0 : 1) : 
        (tabName === 'current-faculty' ? 0 : 1);
    
    const modalId = tabName.includes('students') ? 'manageStudentsModal' : 'manageFacultyModal';
    const modal = document.getElementById(modalId);
    
    modal.querySelectorAll('.tab-btn')[activeTab].classList.add('active');
    modal.querySelectorAll('.tab-content')[activeTab].classList.add('active');
}

function loadCurrentStudents(classId) {
    const classData = CLASSES_DATA.find(c => c.id === classId);
    const students = STUDENTS_DATA.filter(student => classData.studentIds.includes(student.id));
    
    const container = document.getElementById('currentStudentsList');
    container.innerHTML = '';
    
    if (students.length === 0) {
        container.innerHTML = '<p>No students enrolled in this class</p>';
        return;
    }
    
    students.forEach(student => {
        const studentCard = document.createElement('div');
        studentCard.className = 'student-card';
        studentCard.innerHTML = `
            <div class="user-avatar-sm student">${student.name.split(' ').map(n => n[0]).join('')}</div>
            <div class="card-info">
                <h5>${student.name}</h5>
                <p>${student.rollNo}</p>
                <p>CGPA: ${student.cgpa}</p>
            </div>
            <button class="remove-btn" onclick="removeStudentFromClass('${classId}', '${student.id}')">
                <i class="fas fa-times"></i> Remove
            </button>
        `;
        container.appendChild(studentCard);
    });
}

function loadAvailableStudents(classId) {
    const classData = CLASSES_DATA.find(c => c.id === classId);
    const availableStudents = STUDENTS_DATA.filter(student => 
        !classData.studentIds.includes(student.id) && 
        student.department === classData.department &&
        student.year === classData.year
    );
    
    const container = document.getElementById('availableStudentsList');
    container.innerHTML = '';
    
    if (availableStudents.length === 0) {
        container.innerHTML = '<p>No available students from the same department and year</p>';
        return;
    }
    
    availableStudents.forEach(student => {
        const studentCard = document.createElement('div');
        studentCard.className = 'student-card selectable';
        studentCard.innerHTML = `
            <input type="checkbox" class="card-checkbox" value="${student.id}">
            <div class="user-avatar-sm student">${student.name.split(' ').map(n => n[0]).join('')}</div>
            <div class="card-info">
                <h5>${student.name}</h5>
                <p>${student.rollNo}</p>
                <p>CGPA: ${student.cgpa}</p>
            </div>
        `;
        
        studentCard.onclick = function(e) {
            if (e.target.type !== 'checkbox') {
                const checkbox = studentCard.querySelector('.card-checkbox');
                checkbox.checked = !checkbox.checked;
            }
            studentCard.classList.toggle('selected', studentCard.querySelector('.card-checkbox').checked);
        };
        
        container.appendChild(studentCard);
    });
}

function loadCurrentFaculty(classId) {
    const classData = CLASSES_DATA.find(c => c.id === classId);
    const faculty = FACULTY_DATA.filter(f => classData.facultyIds.includes(f.id));
    
    const container = document.getElementById('currentFacultyList');
    container.innerHTML = '';
    
    if (faculty.length === 0) {
        container.innerHTML = '<p>No faculty assigned to this class</p>';
        return;
    }
    
    faculty.forEach(f => {
        const facultyCard = document.createElement('div');
        facultyCard.className = 'faculty-card';
        facultyCard.innerHTML = `
            <div class="user-avatar-sm teacher">${f.name.split(' ').map(n => n[0]).join('')}</div>
            <div class="card-info">
                <h5>${f.name}</h5>
                <p>${f.designation}</p>
                <p>${f.subjects.slice(0, 2).join(', ')}</p>
            </div>
            <button class="remove-btn" onclick="removeFacultyFromClass('${classId}', '${f.id}')">
                <i class="fas fa-times"></i> Remove
            </button>
        `;
        container.appendChild(facultyCard);
    });
}

function loadAvailableFaculty(classId) {
    const classData = CLASSES_DATA.find(c => c.id === classId);
    const availableFaculty = FACULTY_DATA.filter(f => 
        !classData.facultyIds.includes(f.id) &&
        f.department === classData.department
    );
    
    const container = document.getElementById('availableFacultyList');
    container.innerHTML = '';
    
    if (availableFaculty.length === 0) {
        container.innerHTML = '<p>No available faculty from the same department</p>';
        return;
    }
    
    availableFaculty.forEach(f => {
        const facultyCard = document.createElement('div');
        facultyCard.className = 'faculty-card selectable';
        facultyCard.innerHTML = `
            <input type="checkbox" class="card-checkbox" value="${f.id}">
            <div class="user-avatar-sm teacher">${f.name.split(' ').map(n => n[0]).join('')}</div>
            <div class="card-info">
                <h5>${f.name}</h5>
                <p>${f.designation}</p>
                <p>${f.subjects.slice(0, 2).join(', ')}</p>
            </div>
        `;
        
        facultyCard.onclick = function(e) {
            if (e.target.type !== 'checkbox') {
                const checkbox = facultyCard.querySelector('.card-checkbox');
                checkbox.checked = !checkbox.checked;
            }
            facultyCard.classList.toggle('selected', facultyCard.querySelector('.card-checkbox').checked);
        };
        
        container.appendChild(facultyCard);
    });
}

function searchCurrentStudents() {
    const searchTerm = document.getElementById('currentStudentSearch').value.toLowerCase();
    const cards = document.querySelectorAll('#currentStudentsList .student-card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? 'flex' : 'none';
    });
}

function searchAvailableStudents() {
    const searchTerm = document.getElementById('availableStudentSearch').value.toLowerCase();
    const cards = document.querySelectorAll('#availableStudentsList .student-card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? 'flex' : 'none';
    });
}

function searchCurrentFaculty() {
    const searchTerm = document.getElementById('currentFacultySearch').value.toLowerCase();
    const cards = document.querySelectorAll('#currentFacultyList .faculty-card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? 'flex' : 'none';
    });
}

function searchAvailableFaculty() {
    const searchTerm = document.getElementById('availableFacultySearch').value.toLowerCase();
    const cards = document.querySelectorAll('#availableFacultyList .faculty-card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? 'flex' : 'none';
    });
}

function addSelectedStudents() {
    const selectedCheckboxes = document.querySelectorAll('#availableStudentsList .card-checkbox:checked');
    
    if (selectedCheckboxes.length === 0) {
        showNotification('No students selected', 'error');
        return;
    }
    
    const classData = CLASSES_DATA.find(c => c.id === currentClassForStudents);
    const studentIds = Array.from(selectedCheckboxes).map(cb => cb.value);
    
    if (classData.studentIds.length + studentIds.length > classData.maxStudents) {
        showNotification('Cannot add students. Class capacity exceeded.', 'error');
        return;
    }
    
    classData.studentIds.push(...studentIds);
    
    closeModal();
    loadClasses();
    showNotification(`${studentIds.length} students added successfully`, 'success');
}

function addSelectedFaculty() {
    const selectedCheckboxes = document.querySelectorAll('#availableFacultyList .card-checkbox:checked');
    
    if (selectedCheckboxes.length === 0) {
        showNotification('No faculty selected', 'error');
        return;
    }
    
    const classData = CLASSES_DATA.find(c => c.id === currentClassForFaculty);
    const facultyIds = Array.from(selectedCheckboxes).map(cb => cb.value);
    
    classData.facultyIds.push(...facultyIds);
    
    closeModal();
    loadClasses();
    showNotification(`${facultyIds.length} faculty added successfully`, 'success');
}

function removeStudentFromClass(classId, studentId) {
    const classData = CLASSES_DATA.find(c => c.id === classId);
    const student = STUDENTS_DATA.find(s => s.id === studentId);
    
    if (confirm(`Remove ${student.name} from ${classData.name}?`)) {
        classData.studentIds = classData.studentIds.filter(id => id !== studentId);
        
        if (currentClassForStudents === classId) {
            loadCurrentStudents(classId);
            loadAvailableStudents(classId);
        }
        
        loadClasses();
        showNotification(`${student.name} removed from class successfully`, 'success');
    }
}

function removeFacultyFromClass(classId, facultyId) {
    const classData = CLASSES_DATA.find(c => c.id === classId);
    const faculty = FACULTY_DATA.find(f => f.id === facultyId);
    
    if (confirm(`Remove ${faculty.name} from ${classData.name}?`)) {
        classData.facultyIds = classData.facultyIds.filter(id => id !== facultyId);
        
        if (currentClassForFaculty === classId) {
            loadCurrentFaculty(classId);
            loadAvailableFaculty(classId);
        }
        
        loadClasses();
        showNotification(`${faculty.name} removed from class successfully`, 'success');
    }
}

function loadFacultyInDropdown() {
    const select = document.getElementById('classTeacher');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Class Teacher</option>';
    
    FACULTY_DATA.forEach(faculty => {
        const option = document.createElement('option');
        option.value = faculty.id;
        option.textContent = `${faculty.name} (${faculty.designation})`;
        select.appendChild(option);
    });
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
    editingClassId = null;
    currentClassForStudents = null;
    currentClassForFaculty = null;
}

function exportClasses() {
    showNotification('Exporting classes data...', 'info');
    
    setTimeout(() => {
        showNotification('Classes exported successfully!', 'success');
    }, 2000);
}

function refreshClasses() {
    showNotification('Refreshing class data...', 'info');
    
    setTimeout(() => {
        loadClasses();
        updateStats();
        showNotification('Class data refreshed successfully!', 'success');
    }, 1500);
}

function showNotification(message, type) {
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
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (window.innerWidth <= 768 && 
        sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
        closeMobileSidebar();
    }
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        switchView('table');
    }, 100);
});
