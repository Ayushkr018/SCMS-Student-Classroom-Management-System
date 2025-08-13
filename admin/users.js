// Theme and Mobile Navigation Functions
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
    const menuBtn = document.getElementById('mobileMenuBtn');

    if (sidebar && overlay && menuBtn) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        menuBtn.classList.add('active');

        // Force full height and prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        document.documentElement.style.height = '100vh';

        // Change hamburger to X icon
        const icon = menuBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-times';
        }
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtn = document.getElementById('mobileMenuBtn');

    if (sidebar && overlay && menuBtn) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        menuBtn.classList.remove('active');

        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.height = '';
        document.documentElement.style.height = '';

        // Change X back to hamburger icon
        const icon = menuBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
    }
}

// Enhanced mobile responsiveness
function handleResize() {
    if (window.innerWidth > 768) {
        closeMobileSidebar();
    }
}

// Data Arrays
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
    },
    {
        id: 'F006',
        name: 'Dr. Sanjay Verma',
        email: 'sanjay.verma@college.edu',
        department: 'IT',
        designation: 'Associate Professor',
        subjects: ['Software Engineering', 'Web Development', 'Database Systems'],
        phone: '+91-98765-43215',
        experience: '10 years',
        status: 'active'
    },
    {
        id: 'F007',
        name: 'Prof. Neha Agarwal',
        email: 'neha.agarwal@college.edu',
        department: 'CSE',
        designation: 'Assistant Professor',
        subjects: ['Machine Learning', 'Artificial Intelligence', 'Python Programming'],
        phone: '+91-98765-43216',
        experience: '7 years',
        status: 'active'
    },
    {
        id: 'F008',
        name: 'Dr. Ramesh Gupta',
        email: 'ramesh.gupta@college.edu',
        department: 'ECE',
        designation: 'Professor',
        subjects: ['Signal Processing', 'VLSI Design', 'Embedded Systems'],
        phone: '+91-98765-43217',
        experience: '16 years',
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
    },
    {
        id: 'S007',
        name: 'Karan Patel',
        email: 'karan.patel@student.college.edu',
        rollNo: '21ECE002',
        department: 'ECE',
        year: '2',
        semester: '4',
        phone: '+91-98765-54327',
        address: 'Ahmedabad, Gujarat',
        cgpa: '8.3',
        status: 'active'
    },
    {
        id: 'S008',
        name: 'Pooja Sharma',
        email: 'pooja.sharma@student.college.edu',
        rollNo: '20EEE002',
        department: 'EEE',
        year: '3',
        semester: '5',
        phone: '+91-98765-54328',
        address: 'Jaipur, Rajasthan',
        cgpa: '8.8',
        status: 'active'
    },
    {
        id: 'S009',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@student.college.edu',
        rollNo: '19MECH002',
        department: 'MECH',
        year: '4',
        semester: '7',
        phone: '+91-98765-54329',
        address: 'Kanpur, UP',
        cgpa: '7.9',
        status: 'active'
    },
    {
        id: 'S010',
        name: 'Anita Desai',
        email: 'anita.desai@student.college.edu',
        rollNo: '20CSE004',
        department: 'CSE',
        year: '3',
        semester: '6',
        phone: '+91-98765-54330',
        address: 'Mumbai, Maharashtra',
        cgpa: '9.2',
        status: 'active'
    },
    {
        id: 'S011',
        name: 'Vikram Singh',
        email: 'vikram.singh@student.college.edu',
        rollNo: '21IT001',
        department: 'IT',
        year: '2',
        semester: '4',
        phone: '+91-98765-54331',
        address: 'Chandigarh, Punjab',
        cgpa: '8.6',
        status: 'active'
    },
    {
        id: 'S012',
        name: 'Priya Patel',
        email: 'priya.patel@student.college.edu',
        rollNo: '20CIVIL001',
        department: 'CIVIL',
        year: '3',
        semester: '5',
        phone: '+91-98765-54332',
        address: 'Surat, Gujarat',
        cgpa: '8.4',
        status: 'active'
    }
];

let CLASSES_DATA = [
    {
        id: 'CL001',
        name: 'CSE-3A',
        department: 'CSE',
        section: 'A',
        year: '3',
        semester: '6',
        classTeacherId: 'F001',
        classTeacherName: 'Dr. Rajesh Kumar',
        maxStudents: 60,
        studentIds: ['S001', 'S002', 'S006', 'S010'],
        facultyIds: ['F001', 'F007'],
        classroom: 'CSE-301',
        status: 'active',
        createdDate: '2023-01-15'
    },
    {
        id: 'CL002',
        name: 'CSE-3B',
        department: 'CSE',
        section: 'B',
        year: '3',
        semester: '6',
        classTeacherId: 'F007',
        classTeacherName: 'Prof. Neha Agarwal',
        maxStudents: 60,
        studentIds: [],
        facultyIds: ['F007'],
        classroom: 'CSE-302',
        status: 'active',
        createdDate: '2023-01-15'
    },
    {
        id: 'CL003',
        name: 'ECE-2A',
        department: 'ECE',
        section: 'A',
        year: '2',
        semester: '4',
        classTeacherId: 'F002',
        classTeacherName: 'Prof. Priya Sharma',
        maxStudents: 60,
        studentIds: ['S003', 'S007'],
        facultyIds: ['F002', 'F008'],
        classroom: 'ECE-201',
        status: 'active',
        createdDate: '2023-01-15'
    },
    {
        id: 'CL004',
        name: 'EEE-3A',
        department: 'EEE',
        section: 'A',
        year: '3',
        semester: '5',
        classTeacherId: 'F003',
        classTeacherName: 'Dr. Anand Gupta',
        maxStudents: 60,
        studentIds: ['S004', 'S008'],
        facultyIds: ['F003'],
        classroom: 'EEE-301',
        status: 'active',
        createdDate: '2023-01-15'
    },
    {
        id: 'CL005',
        name: 'MECH-4A',
        department: 'MECH',
        section: 'A',
        year: '4',
        semester: '7',
        classTeacherId: 'F004',
        classTeacherName: 'Ms. Meera Patel',
        maxStudents: 60,
        studentIds: ['S005', 'S009'],
        facultyIds: ['F004'],
        classroom: 'MECH-401',
        status: 'active',
        createdDate: '2023-01-15'
    },
    {
        id: 'CL006',
        name: 'IT-2A',
        department: 'IT',
        section: 'A',
        year: '2',
        semester: '4',
        classTeacherId: 'F006',
        classTeacherName: 'Dr. Sanjay Verma',
        maxStudents: 60,
        studentIds: ['S011'],
        facultyIds: ['F006'],
        classroom: 'IT-201',
        status: 'active',
        createdDate: '2023-01-15'
    },
    {
        id: 'CL007',
        name: 'CIVIL-3A',
        department: 'CIVIL',
        section: 'A',
        year: '3',
        semester: '5',
        classTeacherId: 'F005',
        classTeacherName: 'Prof. Vikram Singh',
        maxStudents: 60,
        studentIds: ['S012'],
        facultyIds: ['F005'],
        classroom: 'CIVIL-301',
        status: 'active',
        createdDate: '2023-01-15'
    }
];

// Global Variables
let filteredClasses = [...CLASSES_DATA];
let editingClassId = null;
let currentView = 'table';
let currentClassForStudents = null;
let currentClassForFaculty = null;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    loadCurrentUser();
    loadClasses();
    loadFacultyInDropdown();
    updateStats();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Add touch events for better mobile interaction
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }

    // Close sidebar when clicking on nav links on mobile
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });

    // Prevent body scroll when modal is open
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Add keyboard event listeners for better accessibility
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            // Close any open modals
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                closeModal(modal.id);
            });

            // Close mobile sidebar if open
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        }
    });
});

// User Management Functions
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

    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = user.name;
    }
}

function logout() {
    localStorage.removeItem('scms_current_user');
    showNotification('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
}

// Statistics Functions
function updateStats() {
    const totalClasses = CLASSES_DATA.length;
    const totalFaculty = FACULTY_DATA.length;
    const totalStudents = STUDENTS_DATA.length;
    const totalDepartments = 6;

    const classCountElement = document.getElementById('classCount');
    const facultyCountElement = document.getElementById('facultyCount');
    const studentCountElement = document.getElementById('studentCount');
    const departmentCountElement = document.getElementById('departmentCount');

    if (classCountElement) classCountElement.textContent = totalClasses;
    if (facultyCountElement) facultyCountElement.textContent = totalFaculty;
    if (studentCountElement) studentCountElement.textContent = totalStudents.toLocaleString();
    if (departmentCountElement) departmentCountElement.textContent = totalDepartments;
}

// View Management Functions
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

// Card View Functions
function loadClassCards() {
    const container = document.getElementById('classesContainer');
    if (!container) return;

    container.innerHTML = '';

    if (filteredClasses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users fa-4x"></i>
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

function createClassCard(classData) {
    const card = document.createElement('div');
    card.className = 'class-card';

    const classTeacher = FACULTY_DATA.find(f => f.id === classData.classTeacherId);
    const students = STUDENTS_DATA.filter(s => classData.studentIds.includes(s.id));
    const faculty = FACULTY_DATA.filter(f => classData.facultyIds.includes(f.id));

    card.innerHTML = `
        <div class="class-header">
            <div class="class-info">
                <h3>${classData.name}</h3>
                <div class="class-details">
                    ${classData.department} Department | Year ${classData.year} | Semester ${classData.semester}
                </div>
            </div>
            <div class="class-actions">
                <button class="btn btn-sm btn-success" onclick="viewClass('${classData.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editClass('${classData.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteClass('${classData.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="class-body">
            <div class="class-section">
                <h4><i class="fas fa-chalkboard-teacher"></i> Class Teacher</h4>
                <div class="class-teacher-info">
                    <div class="user-avatar-sm teacher">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div>
                        <div class="user-name">${classTeacher ? classTeacher.name : 'Not Assigned'}</div>
                        <div class="user-role">${classTeacher ? classTeacher.designation : ''}</div>
                    </div>
                </div>
            </div>
            <div class="class-section">
                <h4><i class="fas fa-info-circle"></i> Class Details</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="department-badge">${classData.department}</span>
                    </div>
                    <div class="detail-item">
                        <span>Year ${classData.year}</span>
                    </div>
                    <div class="detail-item">
                        <span>Room: ${classData.classroom}</span>
                    </div>
                    <div class="detail-item">
                        <span class="semester-badge">Semester ${classData.semester}</span>
                    </div>
                </div>
            </div>
            <div class="class-section">
                <h4><i class="fas fa-users"></i> Faculty (${faculty.length})</h4>
                ${faculty.length > 0 ? `
                    <div class="students-grid">
                        ${faculty.slice(0, 4).map(f => `
                            <div class="faculty-item">
                                <div class="user-avatar-sm teacher">
                                    <i class="fas fa-user-tie"></i>
                                </div>
                                <div>
                                    <div>${f.name}</div>
                                    <small>${f.designation}</small>
                                </div>
                            </div>
                        `).join('')}
                        ${faculty.length > 4 ? `<div class="more-count">+${faculty.length - 4} more</div>` : ''}
                    </div>
                ` : '<p class="text-secondary">No faculty assigned to this class</p>'}
                <button class="btn btn-sm btn-primary mt-2" onclick="manageFaculty('${classData.id}')">
                    <i class="fas fa-users-cog"></i> Manage Faculty
                </button>
            </div>
            <div class="class-section">
                <h4><i class="fas fa-user-graduate"></i> Students (${students.length}/${classData.maxStudents})</h4>
                ${students.length > 0 ? `
                    <div class="students-grid">
                        ${students.slice(0, 6).map(student => `
                            <div class="student-item">
                                <div class="user-avatar-sm student">
                                    <i class="fas fa-user-graduate"></i>
                                </div>
                                <div>
                                    <div>${student.name}</div>
                                    <small>${student.rollNo}</small>
                                </div>
                            </div>
                        `).join('')}
                        ${students.length > 6 ? `<div class="more-count">+${students.length - 6} more</div>` : ''}
                    </div>
                ` : '<p class="text-secondary">No students enrolled in this class</p>'}
                <button class="btn btn-sm btn-primary mt-2" onclick="manageStudents('${classData.id}')">
                    <i class="fas fa-user-plus"></i> Manage Students
                </button>
            </div>
        </div>
    `;

    return card;
}

// Table View Functions
function loadClassTable() {
    const tbody = document.getElementById('classTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (filteredClasses.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-users fa-3x"></i>
                        <h4>No Classes Found</h4>
                        <p>No classes match your current filters.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    filteredClasses.forEach(classData => {
        const row = createClassTableRow(classData);
        tbody.appendChild(row);
    });
}

function createClassTableRow(classData) {
    const row = document.createElement('tr');

    const classTeacher = FACULTY_DATA.find(f => f.id === classData.classTeacherId);
    const studentCount = classData.studentIds.length;
    const facultyCount = classData.facultyIds.length;

    row.innerHTML = `
        <td>
            <div class="class-profile">
                <div class="class-avatar">
                    ${classData.department}
                </div>
                <div class="class-info-text">
                    <h4>${classData.name}</h4>
                    <p>Section ${classData.section} | Room ${classData.classroom}</p>
                </div>
            </div>
        </td>
        <td>
            <div class="class-profile">
                <div class="user-avatar-sm teacher">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div class="class-info-text">
                    <h4>${classTeacher ? classTeacher.name : 'Not Assigned'}</h4>
                    <p>${classTeacher ? classTeacher.designation : 'No teacher assigned'}</p>
                </div>
            </div>
        </td>
        <td>
            <div class="class-info-text">
                <h4>${studentCount}/${classData.maxStudents}</h4>
                <p>Students Enrolled</p>
            </div>
        </td>
        <td>
            <div class="class-info-text">
                <h4>${facultyCount}</h4>
                <p>Faculty Members</p>
            </div>
        </td>
        <td>
            <span class="semester-badge">Semester ${classData.semester}</span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="action-btn action-view" onclick="viewClass('${classData.id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn action-edit" onclick="editClass('${classData.id}')" title="Edit Class">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn action-students" onclick="manageStudents('${classData.id}')" title="Manage Students">
                    <i class="fas fa-user-graduate"></i>
                </button>
                <button class="action-btn action-faculty" onclick="manageFaculty('${classData.id}')" title="Manage Faculty">
                    <i class="fas fa-chalkboard-teacher"></i>
                </button>
                <button class="action-btn action-delete" onclick="deleteClass('${classData.id}')" title="Delete Class">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;

    return row;
}

// Filter Functions
function filterClasses() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const departmentFilter = document.getElementById('departmentFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    filteredClasses = CLASSES_DATA.filter(classItem => {
        const matchesSearch =
            classItem.name.toLowerCase().includes(searchTerm) ||
            classItem.department.toLowerCase().includes(searchTerm) ||
            classItem.classroom.toLowerCase().includes(searchTerm) ||
            classItem.classTeacherName.toLowerCase().includes(searchTerm);

        const matchesDepartment = !departmentFilter || classItem.department === departmentFilter;
        const matchesYear = !yearFilter || classItem.year === yearFilter;
        const matchesStatus = !statusFilter || classItem.status === statusFilter;

        return matchesSearch && matchesDepartment && matchesYear && matchesStatus;
    });

    loadClasses();
}

// Modal Functions
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Class Management Functions
function openAddClassModal() {
    editingClassId = null;
    document.getElementById('modalTitle').textContent = 'Add New Class';
    document.getElementById('classForm').reset();
    showModal('classModal');
}

function editClass(classId) {
    editingClassId = classId;
    const classData = CLASSES_DATA.find(c => c.id === classId);

    if (classData) {
        document.getElementById('modalTitle').textContent = 'Edit Class';
        document.getElementById('className').value = classData.name;
        document.getElementById('department').value = classData.department;
        document.getElementById('section').value = classData.section;
        document.getElementById('year').value = classData.year;
        document.getElementById('semester').value = classData.semester;
        document.getElementById('classTeacher').value = classData.classTeacherId || '';
        document.getElementById('classroom').value = classData.classroom;
        document.getElementById('maxStudents').value = classData.maxStudents;

        showModal('classModal');
    }
}

function saveClass(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('className').value,
        department: document.getElementById('department').value,
        section: document.getElementById('section').value,
        year: document.getElementById('year').value,
        semester: document.getElementById('semester').value,
        classTeacherId: document.getElementById('classTeacher').value || null,
        classroom: document.getElementById('classroom').value,
        maxStudents: parseInt(document.getElementById('maxStudents').value)
    };

    // Get class teacher name
    const classTeacher = FACULTY_DATA.find(f => f.id === formData.classTeacherId);
    formData.classTeacherName = classTeacher ? classTeacher.name : 'Not Assigned';

    if (editingClassId) {
        // Update existing class
        const classIndex = CLASSES_DATA.findIndex(c => c.id === editingClassId);
        if (classIndex !== -1) {
            CLASSES_DATA[classIndex] = {
                ...CLASSES_DATA[classIndex],
                ...formData
            };
            showNotification('Class updated successfully!', 'success');
        }
    } else {
        // Add new class
        const newClass = {
            id: 'CL' + String(CLASSES_DATA.length + 1).padStart(3, '0'),
            ...formData,
            studentIds: [],
            facultyIds: formData.classTeacherId ? [formData.classTeacherId] : [],
            status: 'active',
            createdDate: new Date().toISOString().split('T')[0]
        };
        CLASSES_DATA.push(newClass);
        showNotification('Class added successfully!', 'success');
    }

    closeModal('classModal');
    filteredClasses = [...CLASSES_DATA];
    loadClasses();
    updateStats();
}

function deleteClass(classId) {
    if (confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
        const classIndex = CLASSES_DATA.findIndex(c => c.id === classId);
        if (classIndex !== -1) {
            CLASSES_DATA.splice(classIndex, 1);
            filteredClasses = [...CLASSES_DATA];
            loadClasses();
            updateStats();
            showNotification('Class deleted successfully!', 'success');
        }
    }
}

function viewClass(classId) {
    const classData = CLASSES_DATA.find(c => c.id === classId);
    if (!classData) return;

    const classTeacher = FACULTY_DATA.find(f => f.id === classData.classTeacherId);
    const students = STUDENTS_DATA.filter(s => classData.studentIds.includes(s.id));
    const faculty = FACULTY_DATA.filter(f => classData.facultyIds.includes(f.id));

    const content = document.getElementById('classDetailsContent');
    content.innerHTML = `
        <div class="detail-section">
            <h4><i class="fas fa-info-circle"></i> Basic Information</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Class Name</label>
                    <span>${classData.name}</span>
                </div>
                <div class="detail-item">
                    <label>Department</label>
                    <span>${classData.department}</span>
                </div>
                <div class="detail-item">
                    <label>Section</label>
                    <span>${classData.section}</span>
                </div>
                <div class="detail-item">
                    <label>Year</label>
                    <span>${classData.year}</span>
                </div>
                <div class="detail-item">
                    <label>Semester</label>
                    <span>${classData.semester}</span>
                </div>
                <div class="detail-item">
                    <label>Classroom</label>
                    <span>${classData.classroom}</span>
                </div>
                <div class="detail-item">
                    <label>Max Students</label>
                    <span>${classData.maxStudents}</span>
                </div>
                <div class="detail-item">
                    <label>Status</label>
                    <span class="semester-badge">${classData.status}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4><i class="fas fa-chalkboard-teacher"></i> Class Teacher</h4>
            ${classTeacher ? `
                <div class="class-teacher-info">
                    <div class="user-avatar-sm teacher">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div>
                        <div class="user-name">${classTeacher.name}</div>
                        <div class="user-role">${classTeacher.designation}</div>
                        <div class="user-email">${classTeacher.email}</div>
                        <div class="user-phone">${classTeacher.phone}</div>
                    </div>
                </div>
            ` : '<p class="text-secondary">No class teacher assigned</p>'}
        </div>
        
        <div class="detail-section">
            <h4><i class="fas fa-users"></i> Faculty Members (${faculty.length})</h4>
            ${faculty.length > 0 ? `
                <div class="current-faculty-list">
                    ${faculty.map(f => `
                        <div class="faculty-card">
                            <div class="user-avatar-sm teacher">
                                <i class="fas fa-user-tie"></i>
                            </div>
                            <div class="card-info">
                                <h5>${f.name}</h5>
                                <p>${f.designation} | ${f.department}</p>
                                <p>Subjects: ${f.subjects.join(', ')}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="text-secondary">No faculty assigned to this class</p>'}
        </div>
        
        <div class="detail-section">
            <h4><i class="fas fa-user-graduate"></i> Students (${students.length}/${classData.maxStudents})</h4>
            ${students.length > 0 ? `
                <div class="current-students-list">
                    ${students.map(student => `
                        <div class="student-card">
                            <div class="user-avatar-sm student">
                                <i class="fas fa-user-graduate"></i>
                            </div>
                            <div class="card-info">
                                <h5>${student.name}</h5>
                                <p>${student.rollNo} | Year ${student.year}</p>
                                <p>CGPA: ${student.cgpa} | ${student.address}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="text-secondary">No students enrolled in this class</p>'}
        </div>
    `;

    showModal('viewClassModal');
}

// Student Management Functions
function manageStudents(classId) {
    currentClassForStudents = classId;
    const classData = CLASSES_DATA.find(c => c.id === classId);

    if (classData) {
        document.querySelector('#manageStudentsModal .modal-header h3').textContent = `Manage Students - ${classData.name}`;
        loadCurrentStudents();
        loadAvailableStudents();
        showModal('manageStudentsModal');
    }
}

function loadCurrentStudents() {
    const classData = CLASSES_DATA.find(c => c.id === currentClassForStudents);
    const container = document.getElementById('currentStudentsList');

    if (!classData || classData.studentIds.length === 0) {
        container.innerHTML = '<p class="text-center text-secondary">No students enrolled in this class</p>';
        return;
    }

    const students = STUDENTS_DATA.filter(s => classData.studentIds.includes(s.id));

    container.innerHTML = students.map(student => `
        <div class="student-card">
            <div class="user-avatar-sm student">
                <i class="fas fa-user-graduate"></i>
            </div>
            <div class="card-info">
                <h5>${student.name}</h5>
                <p>${student.rollNo} | Year ${student.year}</p>
                <p>CGPA: ${student.cgpa}</p>
            </div>
            <button class="remove-btn" onclick="removeStudentFromClass('${student.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function loadAvailableStudents() {
    const classData = CLASSES_DATA.find(c => c.id === currentClassForStudents);
    const container = document.getElementById('availableStudentsList');

    if (!classData) return;

    const availableStudents = STUDENTS_DATA.filter(student =>
        student.department === classData.department &&
        student.year === classData.year &&
        !classData.studentIds.includes(student.id) &&
        student.status === 'active'
    );

    if (availableStudents.length === 0) {
        container.innerHTML = '<p class="text-center text-secondary">No available students from the same department and year</p>';
        return;
    }

    container.innerHTML = availableStudents.map(student => `
        <div class="student-card selectable" onclick="toggleStudentSelection('${student.id}')">
            <input type="checkbox" class="card-checkbox" id="student-${student.id}">
            <div class="user-avatar-sm student">
                <i class="fas fa-user-graduate"></i>
            </div>
            <div class="card-info">
                <h5>${student.name}</h5>
                <p>${student.rollNo} | Year ${student.year}</p>
                <p>CGPA: ${student.cgpa}</p>
            </div>
        </div>
    `).join('');
}

function toggleStudentSelection(studentId) {
    const checkbox = document.getElementById(`student-${studentId}`);
    const card = checkbox.closest('.student-card');

    checkbox.checked = !checkbox.checked;

    if (checkbox.checked) {
        card.classList.add('selected');
    } else {
        card.classList.remove('selected');
    }
}

function addSelectedStudents() {
    const selectedCheckboxes = document.querySelectorAll('#availableStudentsList input[type="checkbox"]:checked');
    const selectedStudentIds = Array.from(selectedCheckboxes).map(cb => cb.id.replace('student-', ''));

    if (selectedStudentIds.length === 0) {
        showNotification('Please select at least one student', 'error');
        return;
    }

    const classData = CLASSES_DATA.find(c => c.id === currentClassForStudents);
    if (classData) {
        // Check if adding these students would exceed max capacity
        if (classData.studentIds.length + selectedStudentIds.length > classData.maxStudents) {
            showNotification(`Cannot add students. This would exceed the maximum capacity of ${classData.maxStudents}`, 'error');
            return;
        }

        classData.studentIds.push(...selectedStudentIds);

        loadCurrentStudents();
        loadAvailableStudents();
        loadClasses();
        updateStats();

        showNotification(`${selectedStudentIds.length} student(s) added successfully!`, 'success');
    }
}

function removeStudentFromClass(studentId) {
    if (confirm('Are you sure you want to remove this student from the class?')) {
        const classData = CLASSES_DATA.find(c => c.id === currentClassForStudents);
        if (classData) {
            classData.studentIds = classData.studentIds.filter(id => id !== studentId);

            loadCurrentStudents();
            loadAvailableStudents();
            loadClasses();

            showNotification('Student removed successfully!', 'success');
        }
    }
}

// Faculty Management Functions
function manageFaculty(classId) {
    currentClassForFaculty = classId;
    const classData = CLASSES_DATA.find(c => c.id === classId);

    if (classData) {
        document.querySelector('#manageFacultyModal .modal-header h3').textContent = `Manage Faculty - ${classData.name}`;
        loadCurrentFaculty();
        loadAvailableFaculty();
        showModal('manageFacultyModal');
    }
}

function loadCurrentFaculty() {
    const classData = CLASSES_DATA.find(c => c.id === currentClassForFaculty);
    const container = document.getElementById('currentFacultyList');

    if (!classData || classData.facultyIds.length === 0) {
        container.innerHTML = '<p class="text-center text-secondary">No faculty assigned to this class</p>';
        return;
    }

    const faculty = FACULTY_DATA.filter(f => classData.facultyIds.includes(f.id));

    container.innerHTML = faculty.map(f => `
        <div class="faculty-card">
            <div class="user-avatar-sm teacher">
                <i class="fas fa-user-tie"></i>
            </div>
            <div class="card-info">
                <h5>${f.name}</h5>
                <p>${f.designation} | ${f.department}</p>
                <p>Subjects: ${f.subjects.slice(0, 2).join(', ')}</p>
            </div>
            <button class="remove-btn" onclick="removeFacultyFromClass('${f.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function loadAvailableFaculty() {
    const classData = CLASSES_DATA.find(c => c.id === currentClassForFaculty);
    const container = document.getElementById('availableFacultyList');

    if (!classData) return;

    const availableFaculty = FACULTY_DATA.filter(faculty =>
        faculty.department === classData.department &&
        !classData.facultyIds.includes(faculty.id) &&
        faculty.status === 'active'
    );

    if (availableFaculty.length === 0) {
        container.innerHTML = '<p class="text-center text-secondary">No available faculty from the same department</p>';
        return;
    }

    container.innerHTML = availableFaculty.map(f => `
        <div class="faculty-card selectable" onclick="toggleFacultySelection('${f.id}')">
            <input type="checkbox" class="card-checkbox" id="faculty-${f.id}">
            <div class="user-avatar-sm teacher">
                <i class="fas fa-user-tie"></i>
            </div>
            <div class="card-info">
                <h5>${f.name}</h5>
                <p>${f.designation} | ${f.department}</p>
                <p>Subjects: ${f.subjects.slice(0, 2).join(', ')}</p>
            </div>
        </div>
    `).join('');
}

function toggleFacultySelection(facultyId) {
    const checkbox = document.getElementById(`faculty-${facultyId}`);
    const card = checkbox.closest('.faculty-card');

    checkbox.checked = !checkbox.checked;

    if (checkbox.checked) {
        card.classList.add('selected');
    } else {
        card.classList.remove('selected');
    }
}

function addSelectedFaculty() {
    const selectedCheckboxes = document.querySelectorAll('#availableFacultyList input[type="checkbox"]:checked');
    const selectedFacultyIds = Array.from(selectedCheckboxes).map(cb => cb.id.replace('faculty-', ''));

    if (selectedFacultyIds.length === 0) {
        showNotification('Please select at least one faculty member', 'error');
        return;
    }

    const classData = CLASSES_DATA.find(c => c.id === currentClassForFaculty);
    if (classData) {
        classData.facultyIds.push(...selectedFacultyIds);

        loadCurrentFaculty();
        loadAvailableFaculty();
        loadClasses();

        showNotification(`${selectedFacultyIds.length} faculty member(s) added successfully!`, 'success');
    }
}

function removeFacultyFromClass(facultyId) {
    if (confirm('Are you sure you want to remove this faculty member from the class?')) {
        const classData = CLASSES_DATA.find(c => c.id === currentClassForFaculty);
        if (classData) {
            classData.facultyIds = classData.facultyIds.filter(id => id !== facultyId);

            loadCurrentFaculty();
            loadAvailableFaculty();
            loadClasses();

            showNotification('Faculty member removed successfully!', 'success');
        }
    }
}

// Tab Management Functions
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
}

// Utility Functions
function loadFacultyInDropdown() {
    const dropdown = document.getElementById('classTeacher');
    if (!dropdown) return;

    dropdown.innerHTML = '<option value="">Select Class Teacher</option>';

    FACULTY_DATA.forEach(faculty => {
        const option = document.createElement('option');
        option.value = faculty.id;
        option.textContent = `${faculty.name} (${faculty.department} - ${faculty.designation})`;
        dropdown.appendChild(option);
    });
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icon = type === 'success' ? 'fas fa-check-circle' :
        type === 'error' ? 'fas fa-exclamation-circle' :
            'fas fa-info-circle';

    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide notification after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 4000);
}

// Export functions for global access
window.initializeTheme = initializeTheme;
window.toggleTheme = toggleTheme;
window.toggleMobileSidebar = toggleMobileSidebar;
window.closeMobileSidebar = closeMobileSidebar;
window.switchView = switchView;
window.filterClasses = filterClasses;
window.openAddClassModal = openAddClassModal;
window.editClass = editClass;
window.saveClass = saveClass;
window.deleteClass = deleteClass;
window.viewClass = viewClass;
window.manageStudents = manageStudents;
window.manageFaculty = manageFaculty;
window.toggleStudentSelection = toggleStudentSelection;
window.toggleFacultySelection = toggleFacultySelection;
window.addSelectedStudents = addSelectedStudents;
window.addSelectedFaculty = addSelectedFaculty;
window.removeStudentFromClass = removeStudentFromClass;
window.removeFacultyFromClass = removeFacultyFromClass;
window.switchTab = switchTab;
window.closeModal = closeModal;
window.logout = logout;
