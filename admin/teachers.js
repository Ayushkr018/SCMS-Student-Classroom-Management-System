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

// Faculty Data - All your existing data preserved
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

// Teacher Attendance Data
let TEACHER_ATTENDANCE_DATA = JSON.parse(localStorage.getItem('scms_teacher_attendance')) || [];

let filteredFaculty = [...FACULTY_DATA];
let selectedFaculty = new Set();
let editingFacultyId = null;
let currentView = 'table';

function saveDataToStorage() {
    localStorage.setItem('scms_faculty_data', JSON.stringify(FACULTY_DATA));
}

// Load Teacher Attendance Data
function loadTeacherAttendance() {
    TEACHER_ATTENDANCE_DATA = JSON.parse(localStorage.getItem('scms_teacher_attendance')) || [];
    return TEACHER_ATTENDANCE_DATA;
}

// Initialize Demo Teacher Attendance Data
function initializeDemoTeacherAttendanceData() {
    const existingData = localStorage.getItem('scms_teacher_attendance');
    if (!existingData || TEACHER_ATTENDANCE_DATA.length === 0) {
        const demoAttendanceData = [];
        const today = new Date();

        // Create attendance records for last 30 days
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];

            FACULTY_DATA.forEach((faculty) => {
                // Skip weekends
                if (date.getDay() === 0 || date.getDay() === 6) return;

                const statuses = ['present', 'present', 'present', 'present', 'late', 'leave', 'absent'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

                let reason = null;
                if (randomStatus === 'leave') {
                    const leaveReasons = [
                        'Medical appointment',
                        'Family emergency',
                        'Personal work',
                        'Sick leave',
                        'Conference attendance',
                        'Training program',
                        'Research work',
                        'Academic meeting'
                    ];
                    reason = leaveReasons[Math.floor(Math.random() * leaveReasons.length)];
                } else if (randomStatus === 'absent') {
                    const absentReasons = [
                        'Unplanned absence',
                        'Health issues',
                        'Transport problem',
                        'Emergency'
                    ];
                    reason = absentReasons[Math.floor(Math.random() * absentReasons.length)];
                }

                demoAttendanceData.push({
                    id: `ATT_${faculty.id}_${dateString}`,
                    teacherId: faculty.id,
                    teacherName: faculty.name,
                    department: faculty.department,
                    date: dateString,
                    status: randomStatus,
                    reason: reason,
                    timestamp: date.toISOString(),
                    checkInTime: randomStatus === 'present' || randomStatus === 'late' ?
                        `${7 + Math.floor(Math.random() * 4)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM` : null
                });
            });
        }

        localStorage.setItem('scms_teacher_attendance', JSON.stringify(demoAttendanceData));
        TEACHER_ATTENDANCE_DATA = demoAttendanceData;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    loadCurrentUser();
    initializeDemoTeacherAttendanceData();
    loadTeacherAttendance();
    loadFaculty();
    updateStats();

    window.addEventListener('resize', function () {
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
                <i class="fas fa-users"></i>
                <h3>No Faculty Found</h3>
                <p>No faculty match your current filters.</p>
            </div>`;
        return;
    }

    filteredFaculty.forEach(faculty => {
        const card = createFacultyCard(faculty);
        container.appendChild(card);
    });
}

function loadFacultyTable() {
    const container = document.getElementById('tableContainer');
    if (!container) return;

    const teacherAttendance = loadTeacherAttendance();
    const today = new Date().toISOString().split('T')[0];

    container.innerHTML = '';

    if (filteredFaculty.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>No Faculty Found</h3>
                <p>No faculty match your current filters.</p>
            </div>`;
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th><input type="checkbox" id="masterCheckbox" onchange="toggleMasterCheckbox()"></th>
                <th>Faculty Info</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Experience</th>
                <th>Subjects</th>
                <th>Today's Attendance</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
    `;

    filteredFaculty.forEach(faculty => {
        const todayAttendance = teacherAttendance.find(att =>
            att.teacherId === faculty.id && att.date === today
        );

        const attendanceStatus = todayAttendance ? todayAttendance.status : 'not-marked';
        const attendanceColor = {
            'present': 'var(--accent-green)',
            'late': 'var(--accent-yellow)',
            'leave': 'var(--accent-blue)',
            'absent': 'var(--accent-red)',
            'not-marked': 'var(--text-tertiary)'
        };

        const attendanceBadge = `
            <div style="display: flex; flex-direction: column; gap: 4px; align-items: center;">
                <span class="status-badge" style="background: rgba(${attendanceStatus === 'present' ? '16, 185, 129' :
                attendanceStatus === 'late' ? '245, 158, 11' :
                    attendanceStatus === 'leave' ? '37, 99, 235' :
                        attendanceStatus === 'absent' ? '239, 68, 68' : '148, 163, 184'
            }, 0.2); color: ${attendanceColor[attendanceStatus]}; cursor: pointer;" 
                onclick="viewTeacherAttendanceHistory('${faculty.id}')">
                    ${attendanceStatus === 'not-marked' ? 'Not Marked' : attendanceStatus.toUpperCase()}
                </span>
                ${todayAttendance && todayAttendance.checkInTime ?
                `<small style="color: var(--text-secondary); font-size: 0.75rem;">${todayAttendance.checkInTime}</small>` : ''}
                ${todayAttendance && todayAttendance.reason ?
                `<small style="color: var(--text-secondary); font-style: italic; font-size: 0.75rem; max-width: 100px; overflow: hidden; text-overflow: ellipsis;" title="${todayAttendance.reason}">${todayAttendance.reason}</small>` : ''}
            </div>
        `;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" value="${faculty.id}" onchange="toggleSelection('${faculty.id}')"></td>
            <td>
                <div class="faculty-profile">
                    <div class="user-avatar-sm">${faculty.name.split(' ').map(n => n[0]).join('')}</div>
                    <div class="faculty-info-text">
                        <h4>${faculty.name}</h4>
                        <p>${faculty.email}</p>
                    </div>
                </div>
            </td>
            <td><span class="department-badge">${faculty.department}</span></td>
            <td><span class="designation-badge designation-${faculty.designation.toLowerCase().replace(' ', '-')}">${faculty.designation}</span></td>
            <td><span class="experience-badge exp-${getExperienceLevel(faculty.experience)}">${faculty.experience} years</span></td>
            <td>
                <div class="subject-tags">
                    ${faculty.subjects.split(',').slice(0, 2).map(subject =>
            `<span class="subject-tag">${subject.trim()}</span>`
        ).join('')}
                    ${faculty.subjects.split(',').length > 2 ? '<span class="subject-tag">+' + (faculty.subjects.split(',').length - 2) + '</span>' : ''}
                </div>
            </td>
            <td>${attendanceBadge}</td>
            <td><span class="status-badge status-${faculty.status}">${faculty.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn action-view" onclick="viewFaculty('${faculty.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn action-edit" onclick="openEditModal('${faculty.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn action-delete" onclick="deleteFaculty('${faculty.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        table.querySelector('tbody').appendChild(row);
    });

    table.innerHTML += '</tbody>';
    container.appendChild(table);
}

// FIXED: Properly link HTML button functions
function openAddFacultyModal() {
    openAddModal();
}

function importFaculty() {
    importFacultyData();
}

function exportFaculty() {
    exportData();
}

function refreshFaculty() {
    refreshData();
}

function searchFaculty() {
    const searchTerm = document.getElementById('searchInput');
    if (!searchTerm) return;

    const term = searchTerm.value.toLowerCase();

    filteredFaculty = FACULTY_DATA.filter(faculty =>
        faculty.name.toLowerCase().includes(term) ||
        faculty.employeeId.toLowerCase().includes(term) ||
        faculty.email.toLowerCase().includes(term) ||
        faculty.department.toLowerCase().includes(term) ||
        faculty.designation.toLowerCase().includes(term) ||
        faculty.subjects.toLowerCase().includes(term)
    );

    loadFaculty();
}

function filterFaculty() {
    const deptFilter = document.getElementById('departmentFilter');
    const designationFilter = document.getElementById('designationFilter');
    const statusFilter = document.getElementById('statusFilter');

    let filtered = [...FACULTY_DATA];

    if (deptFilter && deptFilter.value) {
        filtered = filtered.filter(faculty => faculty.department === deptFilter.value);
    }

    if (designationFilter && designationFilter.value) {
        filtered = filtered.filter(faculty => faculty.designation === designationFilter.value);
    }

    if (statusFilter && statusFilter.value) {
        filtered = filtered.filter(faculty => faculty.status === statusFilter.value);
    }

    filteredFaculty = filtered;
    loadFaculty();
}

function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('input[type="checkbox"][value]');

    if (selectAllCheckbox && selectAllCheckbox.checked) {
        checkboxes.forEach(cb => {
            cb.checked = true;
            selectedFaculty.add(cb.value);
        });
    } else {
        checkboxes.forEach(cb => {
            cb.checked = false;
            selectedFaculty.delete(cb.value);
        });
    }
    updateSelectedCount();
}

function toggleMasterCheckbox() {
    toggleSelectAll();
}

function bulkAction(action) {
    if (selectedFaculty.size === 0) {
        showNotification('Please select faculty members first', 'warning');
        return;
    }

    if (action === 'activate') {
        FACULTY_DATA.forEach(faculty => {
            if (selectedFaculty.has(faculty.id)) {
                faculty.status = 'active';
            }
        });
        showNotification(`${selectedFaculty.size} faculty activated successfully`, 'success');
    } else if (action === 'deactivate') {
        FACULTY_DATA.forEach(faculty => {
            if (selectedFaculty.has(faculty.id)) {
                faculty.status = 'inactive';
            }
        });
        showNotification(`${selectedFaculty.size} faculty deactivated successfully`, 'success');
    }

    saveDataToStorage();
    selectedFaculty.clear();
    loadFaculty();
    updateStats();
}

function exportSelected() {
    if (selectedFaculty.size === 0) {
        showNotification('Please select faculty members to export', 'warning');
        return;
    }

    const selectedData = FACULTY_DATA.filter(faculty => selectedFaculty.has(faculty.id));
    
    const csvContent = [
        ['Name', 'Employee ID', 'Email', 'Phone', 'Department', 'Designation', 'Experience', 'Qualification', 'Salary', 'Join Date', 'Status', 'Subjects', 'Specialization', 'Research Interest', 'Publications'],
        ...selectedData.map(f => [
            f.name,
            f.employeeId,
            f.email,
            f.phone || '',
            f.department,
            f.designation,
            f.experience,
            f.qualification || '',
            f.salary || '',
            f.joinDate || '',
            f.status,
            f.subjects || '',
            f.specialization || '',
            f.researchInterest || '',
            f.publications || ''
        ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected_faculty_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification(`${selectedData.length} faculty records exported successfully`, 'success');
}

// View Teacher Attendance History
function viewTeacherAttendanceHistory(teacherId) {
    const teacherAttendance = loadTeacherAttendance();
    const teacher = FACULTY_DATA.find(f => f.id === teacherId);
    const teacherRecords = teacherAttendance.filter(att => att.teacherId === teacherId).sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate attendance statistics
    const totalDays = teacherRecords.length;
    const presentDays = teacherRecords.filter(r => r.status === 'present').length;
    const lateDays = teacherRecords.filter(r => r.status === 'late').length;
    const leaveDays = teacherRecords.filter(r => r.status === 'leave').length;
    const absentDays = teacherRecords.filter(r => r.status === 'absent').length;
    const attendancePercentage = totalDays > 0 ? ((presentDays + lateDays) / totalDays * 100).toFixed(1) : 0;

    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h3><i class="fas fa-calendar-check"></i> ${teacher.name} - Attendance History</h3>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <!-- Attendance Statistics -->
                <div class="attendance-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-bottom: 25px;">
                    <div class="stat-item" style="background: var(--bg-secondary); padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 600; color: var(--accent-green);">${presentDays}</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">Present</div>
                    </div>
                    <div class="stat-item" style="background: var(--bg-secondary); padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 600; color: var(--accent-yellow);">${lateDays}</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">Late</div>
                    </div>
                    <div class="stat-item" style="background: var(--bg-secondary); padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 600; color: var(--accent-blue);">${leaveDays}</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">Leave</div>
                    </div>
                    <div class="stat-item" style="background: var(--bg-secondary); padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 600; color: var(--accent-red);">${absentDays}</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">Absent</div>
                    </div>
                    <div class="stat-item" style="background: var(--bg-secondary); padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 600; color: var(--accent-blue);">${attendancePercentage}%</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">Attendance</div>
                    </div>
                </div>
                
                <!-- Attendance History Table -->
                <div class="attendance-history-table" style="max-height: 400px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 10px;">
                    <table style="width: 100%;">
                        <thead>
                            <tr style="background: var(--bg-secondary);">
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid var(--border-color); position: sticky; top: 0; background: var(--bg-secondary);">Date</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid var(--border-color); position: sticky; top: 0; background: var(--bg-secondary);">Day</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid var(--border-color); position: sticky; top: 0; background: var(--bg-secondary);">Status</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid var(--border-color); position: sticky; top: 0; background: var(--bg-secondary);">Check-in Time</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid var(--border-color); position: sticky; top: 0; background: var(--bg-secondary);">Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${teacherRecords.map(record => {
        const date = new Date(record.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        return `
                                <tr style="border-bottom: 1px solid var(--border-light);">
                                    <td style="padding: 12px;">${formattedDate}</td>
                                    <td style="padding: 12px; color: var(--text-secondary);">${dayName}</td>
                                    <td style="padding: 12px;">
                                        <span class="status-badge status-${record.status}" style="background: rgba(${record.status === 'present' ? '16, 185, 129' :
                record.status === 'late' ? '245, 158, 11' :
                    record.status === 'leave' ? '37, 99, 235' :
                        '239, 68, 68'
            }, 0.2); color: ${record.status === 'present' ? 'var(--accent-green)' :
                record.status === 'late' ? 'var(--accent-yellow)' :
                    record.status === 'leave' ? 'var(--accent-blue)' :
                        'var(--accent-red)'
            };">
                                            ${record.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style="padding: 12px;">${record.checkInTime || '-'}</td>
                                    <td style="padding: 12px; max-width: 200px; overflow: hidden; text-overflow: ellipsis;" title="${record.reason || ''}">${record.reason || '-'}</td>
                                </tr>
                            `}).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function createFacultyCard(faculty) {
    const card = document.createElement('div');
    card.className = 'faculty-card';

    card.innerHTML = `
        <div class="faculty-card-header">
            <div class="faculty-avatar">${faculty.name.split(' ').map(n => n[0]).join('')}</div>
            <div class="faculty-info">
                <h3>${faculty.name}</h3>
                <p>${faculty.employeeId} • ${faculty.department}</p>
            </div>
        </div>
        <div class="faculty-card-body">
            <div class="info-grid">
                <div class="info-item">
                    <div class="label">Designation</div>
                    <div class="value">${faculty.designation}</div>
                </div>
                <div class="info-item">
                    <div class="label">Experience</div>
                    <div class="value">${faculty.experience} years</div>
                </div>
                <div class="info-item">
                    <div class="label">Qualification</div>
                    <div class="value">${faculty.qualification}</div>
                </div>
                <div class="info-item">
                    <div class="label">Status</div>
                    <div class="value">
                        <span class="status-badge status-${faculty.status}">${faculty.status}</span>
                    </div>
                </div>
            </div>
            <div class="subjects-list">
                <div class="label">Teaching Subjects</div>
                <div class="subject-tags">
                    ${faculty.subjects.split(',').slice(0, 3).map(subject =>
        `<span class="subject-tag">${subject.trim()}</span>`
    ).join('')}
                    ${faculty.subjects.split(',').length > 3 ? '<span class="subject-tag">+' + (faculty.subjects.split(',').length - 3) + '</span>' : ''}
                </div>
            </div>
            <div class="faculty-actions">
                <button class="btn btn-primary btn-sm" onclick="viewFaculty('${faculty.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-secondary btn-sm" onclick="openEditModal('${faculty.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteFaculty('${faculty.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;

    return card;
}

function getExperienceLevel(experience) {
    const exp = parseInt(experience);
    if (exp >= 15) return 'senior';
    if (exp >= 8) return 'mid';
    return 'junior';
}

function toggleSelection(facultyId) {
    if (selectedFaculty.has(facultyId)) {
        selectedFaculty.delete(facultyId);
    } else {
        selectedFaculty.add(facultyId);
    }
    updateSelectedCount();
}

function updateSelectedCount() {
    const countElement = document.getElementById('selectedCount');
    if (countElement) {
        countElement.textContent = `${selectedFaculty.size} faculty selected`;
    }
}

function openAddModal() {
    editingFacultyId = null;
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = createFacultyModalHTML();
    document.body.appendChild(modal);
}

function openEditModal(facultyId) {
    editingFacultyId = facultyId;
    const faculty = FACULTY_DATA.find(f => f.id === facultyId);
    if (!faculty) return;

    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = createFacultyModalHTML(faculty);
    document.body.appendChild(modal);
}

function createFacultyModalHTML(faculty = null) {
    const isEdit = faculty !== null;

    return `
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h3><i class="fas fa-user-${isEdit ? 'edit' : 'plus'}"></i> ${isEdit ? 'Edit' : 'Add'} Faculty</h3>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <form onsubmit="saveFaculty(event)">
                    <div class="form-section">
                        <h4><i class="fas fa-user"></i> Personal Information</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Full Name *</label>
                                <input type="text" id="facultyName" value="${faculty?.name || ''}" required>
                            </div>
                            <div class="form-group">
                                <label>Email *</label>
                                <input type="email" id="facultyEmail" value="${faculty?.email || ''}" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Phone</label>
                                <input type="tel" id="facultyPhone" value="${faculty?.phone || ''}">
                            </div>
                            <div class="form-group">
                                <label>Date of Birth</label>
                                <input type="date" id="facultyDob" value="${faculty?.dob || ''}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Address</label>
                            <textarea id="facultyAddress" rows="3">${faculty?.address || ''}</textarea>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4><i class="fas fa-briefcase"></i> Professional Information</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Employee ID *</label>
                                <input type="text" id="facultyEmployeeId" value="${faculty?.employeeId || ''}" required>
                            </div>
                            <div class="form-group">
                                <label>Department *</label>
                                <select id="facultyDepartment" required>
                                    <option value="">Select Department</option>
                                    <option value="CSE" ${faculty?.department === 'CSE' ? 'selected' : ''}>Computer Science</option>
                                    <option value="ECE" ${faculty?.department === 'ECE' ? 'selected' : ''}>Electronics & Communication</option>
                                    <option value="EEE" ${faculty?.department === 'EEE' ? 'selected' : ''}>Electrical Engineering</option>
                                    <option value="MECH" ${faculty?.department === 'MECH' ? 'selected' : ''}>Mechanical Engineering</option>
                                    <option value="CIVIL" ${faculty?.department === 'CIVIL' ? 'selected' : ''}>Civil Engineering</option>
                                    <option value="IT" ${faculty?.department === 'IT' ? 'selected' : ''}>Information Technology</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Designation *</label>
                                <select id="facultyDesignation" required>
                                    <option value="">Select Designation</option>
                                    <option value="Professor" ${faculty?.designation === 'Professor' ? 'selected' : ''}>Professor</option>
                                    <option value="Associate Professor" ${faculty?.designation === 'Associate Professor' ? 'selected' : ''}>Associate Professor</option>
                                    <option value="Assistant Professor" ${faculty?.designation === 'Assistant Professor' ? 'selected' : ''}>Assistant Professor</option>
                                    <option value="Lecturer" ${faculty?.designation === 'Lecturer' ? 'selected' : ''}>Lecturer</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Experience (Years)</label>
                                <input type="number" id="facultyExperience" value="${faculty?.experience || ''}" min="0">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Qualification</label>
                                <select id="facultyQualification">
                                    <option value="">Select Qualification</option>
                                    <option value="Ph.D" ${faculty?.qualification === 'Ph.D' ? 'selected' : ''}>Ph.D</option>
                                    <option value="M.Tech" ${faculty?.qualification === 'M.Tech' ? 'selected' : ''}>M.Tech</option>
                                    <option value="M.E" ${faculty?.qualification === 'M.E' ? 'selected' : ''}>M.E</option>
                                    <option value="M.Sc" ${faculty?.qualification === 'M.Sc' ? 'selected' : ''}>M.Sc</option>
                                    <option value="B.Tech" ${faculty?.qualification === 'B.Tech' ? 'selected' : ''}>B.Tech</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Salary</label>
                                <input type="number" id="facultySalary" value="${faculty?.salary || ''}" min="0">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Join Date</label>
                                <input type="date" id="facultyJoinDate" value="${faculty?.joinDate || ''}">
                            </div>
                            <div class="form-group">
                                <label>Status *</label>
                                <select id="facultyStatus" required>
                                    <option value="active" ${faculty?.status === 'active' ? 'selected' : ''}>Active</option>
                                    <option value="inactive" ${faculty?.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                                    <option value="on-leave" ${faculty?.status === 'on-leave' ? 'selected' : ''}>On Leave</option>
                                    <option value="retired" ${faculty?.status === 'retired' ? 'selected' : ''}>Retired</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4><i class="fas fa-book"></i> Academic Information</h4>
                        <div class="form-group">
                            <label>Teaching Subjects</label>
                            <textarea id="facultySubjects" rows="3" placeholder="Enter subjects separated by commas">${faculty?.subjects || ''}</textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Specialization</label>
                                <input type="text" id="facultySpecialization" value="${faculty?.specialization || ''}">
                            </div>
                            <div class="form-group">
                                <label>Publications</label>
                                <input type="number" id="facultyPublications" value="${faculty?.publications || ''}" min="0">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Research Interests</label>
                            <textarea id="facultyResearchInterest" rows="3">${faculty?.researchInterest || ''}</textarea>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'} Faculty
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function saveFaculty(event) {
    event.preventDefault();

    const facultyData = {
        name: document.getElementById('facultyName').value,
        email: document.getElementById('facultyEmail').value,
        phone: document.getElementById('facultyPhone').value,
        dob: document.getElementById('facultyDob').value,
        address: document.getElementById('facultyAddress').value,
        employeeId: document.getElementById('facultyEmployeeId').value,
        department: document.getElementById('facultyDepartment').value,
        designation: document.getElementById('facultyDesignation').value,
        experience: document.getElementById('facultyExperience').value,
        qualification: document.getElementById('facultyQualification').value,
        salary: document.getElementById('facultySalary').value,
        joinDate: document.getElementById('facultyJoinDate').value,
        status: document.getElementById('facultyStatus').value,
        subjects: document.getElementById('facultySubjects').value,
        specialization: document.getElementById('facultySpecialization').value,
        publications: document.getElementById('facultyPublications').value,
        researchInterest: document.getElementById('facultyResearchInterest').value
    };

    if (editingFacultyId) {
        // Update existing faculty
        const index = FACULTY_DATA.findIndex(f => f.id === editingFacultyId);
        if (index !== -1) {
            FACULTY_DATA[index] = { ...FACULTY_DATA[index], ...facultyData };
            showNotification('Faculty updated successfully', 'success');
        }
    } else {
        // Add new faculty
        const newFaculty = {
            id: 'FAC' + (Date.now().toString().slice(-6)),
            ...facultyData
        };
        FACULTY_DATA.push(newFaculty);
        showNotification('Faculty added successfully', 'success');
    }

    saveDataToStorage();
    filteredFaculty = [...FACULTY_DATA];
    loadFaculty();
    updateStats();

    document.querySelector('.modal').remove();
}

function viewFaculty(facultyId) {
    const faculty = FACULTY_DATA.find(f => f.id === facultyId);
    if (!faculty) return;

    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h3><i class="fas fa-user"></i> Faculty Details</h3>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="faculty-details-view">
                <div class="detail-section">
                    <h4><i class="fas fa-user"></i> Personal Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Full Name</label>
                            <span>${faculty.name}</span>
                        </div>
                        <div class="detail-item">
                            <label>Email</label>
                            <span>${faculty.email}</span>
                        </div>
                        <div class="detail-item">
                            <label>Phone</label>
                            <span>${faculty.phone || 'Not provided'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Date of Birth</label>
                            <span>${faculty.dob ? new Date(faculty.dob).toLocaleDateString() : 'Not provided'}</span>
                        </div>
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <label>Address</label>
                            <span>${faculty.address || 'Not provided'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-briefcase"></i> Professional Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Employee ID</label>
                            <span>${faculty.employeeId}</span>
                        </div>
                        <div class="detail-item">
                            <label>Department</label>
                            <span>${faculty.department}</span>
                        </div>
                        <div class="detail-item">
                            <label>Designation</label>
                            <span>${faculty.designation}</span>
                        </div>
                        <div class="detail-item">
                            <label>Experience</label>
                            <span>${faculty.experience} years</span>
                        </div>
                        <div class="detail-item">
                            <label>Qualification</label>
                            <span>${faculty.qualification || 'Not specified'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Salary</label>
                            <span>₹${faculty.salary ? parseInt(faculty.salary).toLocaleString() : 'Not specified'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Join Date</label>
                            <span>${faculty.joinDate ? new Date(faculty.joinDate).toLocaleDateString() : 'Not provided'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Status</label>
                            <span class="status-badge status-${faculty.status}">${faculty.status}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-book"></i> Academic Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Specialization</label>
                            <span>${faculty.specialization || 'Not specified'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Publications</label>
                            <span>${faculty.publications || '0'}</span>
                        </div>
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <label>Teaching Subjects</label>
                            <span>${faculty.subjects || 'Not specified'}</span>
                        </div>
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <label>Research Interests</label>
                            <span>${faculty.researchInterest || 'Not specified'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-calendar-check"></i> Attendance Management</h4>
                    <div class="form-actions" style="margin-top: 15px;">
                        <button class="btn btn-primary" onclick="this.closest('.modal').remove(); viewTeacherAttendanceHistory('${faculty.id}')">
                            <i class="fas fa-history"></i> View Attendance History
                        </button>
                        <button class="btn btn-secondary" onclick="exportTeacherAttendance('${faculty.id}')">
                            <i class="fas fa-download"></i> Export Attendance
                        </button>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove(); openEditModal('${faculty.id}')">
                        <i class="fas fa-edit"></i> Edit Faculty
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function exportTeacherAttendance(teacherId) {
    const teacherAttendance = loadTeacherAttendance();
    const teacher = FACULTY_DATA.find(f => f.id === teacherId);
    const teacherRecords = teacherAttendance.filter(att => att.teacherId === teacherId).sort((a, b) => new Date(b.date) - new Date(a.date));

    const csvContent = [
        ['Date', 'Day', 'Status', 'Check-in Time', 'Reason'],
        ...teacherRecords.map(record => [
            record.date,
            new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' }),
            record.status,
            record.checkInTime || '-',
            record.reason || '-'
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${teacher.name}_attendance_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Attendance data exported successfully', 'success');
}

function deleteFaculty(facultyId) {
    const faculty = FACULTY_DATA.find(f => f.id === facultyId);
    if (!faculty) return;

    if (confirm(`Are you sure you want to delete ${faculty.name}? This action cannot be undone.`)) {
        FACULTY_DATA = FACULTY_DATA.filter(f => f.id !== facultyId);
        filteredFaculty = filteredFaculty.filter(f => f.id !== facultyId);
        selectedFaculty.delete(facultyId);

        saveDataToStorage();
        loadFaculty();
        updateStats();

        showNotification('Faculty deleted successfully', 'success');
    }
}

function exportData() {
    showNotification('Preparing export data...', 'info');

    setTimeout(() => {
        const csvContent = [
            ['Name', 'Employee ID', 'Email', 'Phone', 'Department', 'Designation', 'Experience', 'Qualification', 'Salary', 'Join Date', 'Status', 'Subjects', 'Specialization', 'Research Interest', 'Publications'],
            ...filteredFaculty.map(f => [
                f.name,
                f.employeeId,
                f.email,
                f.phone || '',
                f.department,
                f.designation,
                f.experience,
                f.qualification || '',
                f.salary || '',
                f.joinDate || '',
                f.status,
                f.subjects || '',
                f.specialization || '',
                f.researchInterest || '',
                f.publications || ''
            ])
        ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `faculty_data_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        showNotification('Faculty data exported successfully', 'success');
    }, 1000);
}

function importFacultyData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.onchange = handleFileImport;
    input.click();
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const content = e.target.result;
            let importedData = [];

            if (file.name.endsWith('.json')) {
                importedData = JSON.parse(content);
            } else if (file.name.endsWith('.csv')) {
                importedData = parseCSV(content);
            }

            if (importedData.length === 0) {
                showNotification('No valid data found in the file', 'error');
                return;
            }

            const processedData = processImportedData(importedData);

            if (processedData.length > 0) {
                showImportPreview(processedData);
            } else {
                showNotification('No valid faculty records found in the file', 'error');
            }

        } catch (error) {
            showNotification('Error reading file: ' + error.message, 'error');
        }
    };

    reader.readAsText(file);
}

function parseCSV(content) {
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            data.push(row);
        }
    }

    return data;
}

function processImportedData(rawData) {
    const processedData = [];

    rawData.forEach((item, index) => {
        const mappedItem = {
            name: item.Name || item.name || item.faculty_name || '',
            email: item.Email || item.email || item.faculty_email || '',
            phone: item.Phone || item.phone || item.contact || '',
            employeeId: item['Employee ID'] || item.employeeId || item.employee_id || item.id || '',
            department: item.Department || item.department || item.dept || '',
            designation: item.Designation || item.designation || item.position || '',
            experience: item.Experience || item.experience || item.exp || '0',
            qualification: item.Qualification || item.qualification || item.degree || '',
            salary: item.Salary || item.salary || item.pay || '',
            joinDate: item['Join Date'] || item.joinDate || item.join_date || '',
            status: item.Status || item.status || 'active',
            subjects: item.Subjects || item.subjects || item.teaching_subjects || '',
            specialization: item.Specialization || item.specialization || '',
            researchInterest: item['Research Interest'] || item.researchInterest || item.research_interest || '',
            publications: item.Publications || item.publications || '0'
        };

        if (mappedItem.name && mappedItem.email && mappedItem.employeeId) {
            mappedItem.id = 'FAC' + (Date.now() + index).toString().slice(-6);
            processedData.push(mappedItem);
        }
    });

    return processedData;
}

function showImportPreview(importedData) {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h3><i class="fas fa-upload"></i> Import Faculty Preview</h3>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <p style="color: var(--text-primary); font-size: 1rem;">
                        <strong>${importedData.length}</strong> faculty records found. Review and confirm import:
                    </p>
                </div>
                
                <div style="max-height: 400px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 20px;">
                    <table style="width: 100%;">
                        <thead>
                            <tr style="background: var(--bg-secondary);">
                                <th style="padding: 10px; text-align: left; border-bottom: 1px solid var(--border-color);">Name</th>
                                <th style="padding: 10px; text-align: left; border-bottom: 1px solid var(--border-color);">Employee ID</th>
                                <th style="padding: 10px; text-align: left; border-bottom: 1px solid var(--border-color);">Email</th>
                                <th style="padding: 10px; text-align: left; border-bottom: 1px solid var(--border-color);">Department</th>
                                <th style="padding: 10px; text-align: left; border-bottom: 1px solid var(--border-color);">Designation</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${importedData.map(faculty => `
                                <tr style="border-bottom: 1px solid var(--border-light);">
                                    <td style="padding: 10px;">${faculty.name}</td>
                                    <td style="padding: 10px;">${faculty.employeeId}</td>
                                    <td style="padding: 10px;">${faculty.email}</td>
                                    <td style="padding: 10px;">${faculty.department}</td>
                                    <td style="padding: 10px;">${faculty.designation}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-primary" onclick="confirmImport(${JSON.stringify(importedData).replace(/"/g, '&quot;')})">
                        <i class="fas fa-check"></i> Confirm Import
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function confirmImport(importedData) {
    try {
        FACULTY_DATA.push(...importedData);
        filteredFaculty = [...FACULTY_DATA];

        saveDataToStorage();
        loadFaculty();
        updateStats();

        document.querySelector('.modal').remove();
        showNotification(`Successfully imported ${importedData.length} faculty records`, 'success');

    } catch (error) {
        showNotification('Error importing data: ' + error.message, 'error');
    }
}

function refreshData() {
    showNotification('Refreshing data...', 'info');

    filteredFaculty = [...FACULTY_DATA];
    selectedFaculty.clear();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    const deptFilter = document.getElementById('departmentFilter');
    const statusFilter = document.getElementById('statusFilter');
    if (deptFilter) deptFilter.value = '';
    if (statusFilter) statusFilter.value = '';

    setTimeout(() => {
        loadFaculty();
        updateStats();
        showNotification('Data refreshed successfully', 'success');
    }, 500);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type} show`;

    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };

    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${icons[type]}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
        <div class="notification-progress"></div>
    `;

    const existingNotifications = document.querySelectorAll('.notification');
    const topOffset = 20 + (existingNotifications.length * 80);
    notification.style.top = `${topOffset}px`;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                    repositionNotifications();
                }
            }, 400);
        }
    }, 5000);
}

function repositionNotifications() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach((notification, index) => {
        const topOffset = 20 + (index * 80);
        notification.style.top = `${topOffset}px`;
    });
}

// Handle click outside sidebar on mobile
document.addEventListener('click', function (e) {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    if (window.innerWidth <= 768 &&
        sidebar && sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) &&
        mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
        closeMobileSidebar();
    }
});

// Properly close modals when clicking outside
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.remove();
    });
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.remove();
    }
});
