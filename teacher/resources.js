// Theme Management - Consistent with Landing Page
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

// Mobile Sidebar Management
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

// Mock resources data
const RESOURCES_DATA = [
    {
        id: 'proj_001',
        name: 'HD Projector - Room 201',
        type: 'projector',
        location: 'cs_block',
        room: 'Room 201',
        status: 'available',
        features: ['HD 1080p', 'HDMI', 'USB', 'Wireless'],
        condition: 'excellent',
        lastMaintenance: '2024-01-10',
        nextMaintenance: '2024-02-10'
    },
    {
        id: 'proj_002',
        name: 'Smart Projector - Room 203',
        type: 'projector',
        location: 'cs_block',
        room: 'Room 203',
        status: 'booked',
        features: ['4K UHD', 'Smart OS', 'WiFi', 'Bluetooth'],
        condition: 'good',
        bookedBy: 'Dr. Smith',
        bookedUntil: '3:30 PM'
    },
    {
        id: 'comp_001',
        name: 'Computer Lab A - 30 Units',
        type: 'computer',
        location: 'cs_block',
        room: 'Lab A',
        status: 'available',
        features: ['Core i7', '16GB RAM', 'SSD', '24" Monitor'],
        condition: 'excellent',
        capacity: '30 students'
    },
    {
        id: 'board_001',
        name: 'Interactive Smart Board',
        type: 'smartboard',
        location: 'math_block',
        room: 'Room 105',
        status: 'available',
        features: ['Touch Screen', '75" Display', 'Multi-User', 'Cloud Sync'],
        condition: 'excellent'
    },
    {
        id: 'board_002',
        name: 'Smart Board - Physics Lab',
        type: 'smartboard',
        location: 'physics_block',
        room: 'Physics Lab',
        status: 'maintenance',
        features: ['Interactive', '65" Display', 'Stylus Support'],
        condition: 'needs_repair',
        issue: 'Touch calibration required'
    },
    {
        id: 'audio_001',
        name: 'PA System - Auditorium',
        type: 'audio',
        location: 'auditorium',
        room: 'Main Hall',
        status: 'available',
        features: ['Wireless Mics', '500W', 'Bluetooth', 'Mixer'],
        condition: 'good'
    },
    {
        id: 'cam_001',
        name: 'Recording Camera Setup',
        type: 'camera',
        location: 'library',
        room: 'Recording Studio',
        status: 'booked',
        features: ['4K Recording', 'Auto Focus', 'Remote Control', 'Live Stream'],
        condition: 'excellent',
        bookedBy: 'Prof. Johnson',
        bookedUntil: '5:00 PM'
    },
    {
        id: 'proj_003',
        name: 'Portable Projector',
        type: 'projector',
        location: 'cs_block',
        room: 'Mobile Unit',
        status: 'available',
        features: ['Portable', 'Battery Powered', 'WiFi', 'USB-C'],
        condition: 'good'
    }
];

let myBookings = [];
let filteredResources = [...RESOURCES_DATA];
let selectedTimeSlot = null;

// Load current user and initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    loadResources();
    loadMyBookings();
    updateStats();
    
    // Set today's date
    document.getElementById('dateFilter').value = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').value = new Date().toISOString().split('T')[0];
    
    // Close mobile sidebar when resizing to desktop
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
    if (user.role !== 'teacher') {
        alert('Access denied. Teacher privileges required.');
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('userName').textContent = user.name;
    
    if (user.department) {
        document.getElementById('userDept').textContent = 
            user.department.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
}

function logout() {
    localStorage.removeItem('scms_current_user');
    showNotification('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
}

function loadResources() {
    const resourcesGrid = document.getElementById('resourcesGrid');
    resourcesGrid.innerHTML = '';

    filteredResources.forEach(resource => {
        const resourceCard = createResourceCard(resource);
        resourcesGrid.appendChild(resourceCard);
    });
}

function createResourceCard(resource) {
    const card = document.createElement('div');
    card.className = `resource-card ${resource.status}`;
    
    const statusText = resource.status.charAt(0).toUpperCase() + resource.status.slice(1);
    const bookingInfo = resource.bookedBy ? `Booked by ${resource.bookedBy} until ${resource.bookedUntil}` : '';
    const issueInfo = resource.issue ? `Issue: ${resource.issue}` : '';
    
    card.innerHTML = `
        <div class="resource-header">
            <div style="display: flex; align-items: center;">
                <div class="resource-icon ${resource.type}">
                    ${getResourceIcon(resource.type)}
                </div>
                <div class="resource-info">
                    <div class="resource-name">${resource.name}</div>
                    <div class="resource-details">${resource.room} • ${getLocationName(resource.location)}</div>
                </div>
            </div>
            <div class="resource-status status-${resource.status}">
                ${statusText}
            </div>
        </div>
        <div class="resource-body">
            <div class="resource-features">
                ${resource.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            
            ${resource.status === 'booked' ? `
                <div class="resource-schedule">
                    <div class="schedule-item">
                        <span class="schedule-time">Current</span>
                        <span class="schedule-class">${bookingInfo}</span>
                    </div>
                </div>
            ` : ''}
            
            ${resource.status === 'maintenance' ? `
                <div class="resource-schedule">
                    <div class="schedule-item">
                        <span class="schedule-time">⚠️</span>
                        <span class="schedule-class">${issueInfo}</span>
                    </div>
                </div>
            ` : ''}
            
            <div class="resource-actions">
                ${resource.status === 'available' ? `
                    <button class="btn btn-primary" onclick="bookResource('${resource.id}')">
                        <i class="fas fa-calendar-plus"></i>
                        Book Now
                    </button>
                ` : ''}
                
                <button class="btn btn-info" onclick="viewResourceDetails('${resource.id}')">
                    <i class="fas fa-info-circle"></i>
                    Details
                </button>
                
                ${resource.status === 'booked' ? `
                    <button class="btn btn-warning" onclick="requestEarlyAccess('${resource.id}')">
                        <i class="fas fa-clock"></i>
                        Request
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    return card;
}

function getResourceIcon(type) {
    const icons = {
        projector: '<i class="fas fa-video"></i>',
        computer: '<i class="fas fa-desktop"></i>',
        smartboard: '<i class="fas fa-chalkboard"></i>',
        audio: '<i class="fas fa-volume-up"></i>',
        camera: '<i class="fas fa-camera"></i>'
    };
    return icons[type] || '<i class="fas fa-tools"></i>';
}

function getLocationName(location) {
    const names = {
        cs_block: 'CS Block',
        math_block: 'Math Block',
        physics_block: 'Physics Block',
        library: 'Library',
        auditorium: 'Auditorium'
    };
    return names[location] || location;
}

function loadMyBookings() {
    // Load from localStorage or set default bookings
    const savedBookings = localStorage.getItem('scms_teacher_bookings');
    if (savedBookings) {
        myBookings = JSON.parse(savedBookings);
    } else {
        // Default bookings for demo
        myBookings = [
            {
                id: 'booking_001',
                resourceId: 'proj_001',
                resourceName: 'HD Projector - Room 201',
                date: '2024-01-15',
                time: '10:00 AM - 11:30 AM',
                purpose: 'CS101 - Data Structures',
                status: 'confirmed'
            },
            {
                id: 'booking_002',
                resourceId: 'comp_001',
                resourceName: 'Computer Lab A',
                date: '2024-01-16',
                time: '2:00 PM - 4:00 PM',
                purpose: 'CS102 - Algorithms',
                status: 'pending'
            }
        ];
    }
    
    displayMyBookings();
}

function displayMyBookings() {
    const bookingsList = document.getElementById('myBookingsList');
    
    if (myBookings.length === 0) {
        bookingsList.innerHTML = `
            <div style="padding: 40px; text-align: center; color: var(--text-secondary);">
                <i class="fas fa-calendar" style="font-size: 3em; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>No current bookings</p>
                <small>Book resources to see them here</small>
            </div>
        `;
        return;
    }
    
    bookingsList.innerHTML = '';
    myBookings.forEach(booking => {
        const bookingItem = document.createElement('div');
        bookingItem.className = 'booking-item';
        
        bookingItem.innerHTML = `
            <div class="booking-info">
                <div class="booking-resource">${booking.resourceName}</div>
                <div class="booking-details">
                    <span><i class="fas fa-calendar"></i> ${new Date(booking.date).toLocaleDateString()}</span>
                    <span><i class="fas fa-clock"></i> ${booking.time}</span>
                    <span><i class="fas fa-tag"></i> ${booking.purpose}</span>
                </div>
            </div>
            <div class="booking-actions">
                <span class="resource-status status-${booking.status === 'confirmed' ? 'available' : 'booked'}">
                    ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
                <button class="btn btn-warning" onclick="modifyBooking('${booking.id}')">
                    <i class="fas fa-edit"></i>
                    Modify
                </button>
                <button class="btn btn-danger" onclick="cancelBooking('${booking.id}')">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
            </div>
        `;
        
        bookingsList.appendChild(bookingItem);
    });
}

function filterResources() {
    const typeFilter = document.getElementById('typeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    
    filteredResources = RESOURCES_DATA.filter(resource => {
        return (!typeFilter || resource.type === typeFilter) &&
               (!statusFilter || resource.status === statusFilter) &&
               (!locationFilter || resource.location === locationFilter);
    });
    
    loadResources();
    updateStats();
    
    showNotification(`Found ${filteredResources.length} resources matching your criteria`, 'info');
}

function updateStats() {
    const total = filteredResources.length;
    const available = filteredResources.filter(r => r.status === 'available').length;
    const booked = filteredResources.filter(r => r.status === 'booked').length;
    const maintenance = filteredResources.filter(r => r.status === 'maintenance').length;
    
    document.getElementById('totalResources').textContent = total;
    document.getElementById('availableResources').textContent = available;
    document.getElementById('bookedResources').textContent = booked;
    document.getElementById('maintenanceResources').textContent = maintenance;
}

function openQuickBooking() {
    // Populate resource select with available resources
    const resourceSelect = document.getElementById('resourceSelect');
    resourceSelect.innerHTML = '<option value="">Select Resource</option>';
    
    RESOURCES_DATA.filter(r => r.status === 'available').forEach(resource => {
        const option = document.createElement('option');
        option.value = resource.id;
        option.textContent = resource.name;
        resourceSelect.appendChild(option);
    });
    
    document.getElementById('bookingModal').classList.add('show');
    generateTimeSlots();
}

function bookResource(resourceId) {
    const resource = RESOURCES_DATA.find(r => r.id === resourceId);
    if (!resource) return;
    
    document.getElementById('modalTitle').textContent = `Book ${resource.name}`;
    
    // Pre-select the resource
    const resourceSelect = document.getElementById('resourceSelect');
    resourceSelect.innerHTML = `<option value="${resource.id}" selected>${resource.name}</option>`;
    
    document.getElementById('bookingModal').classList.add('show');
    generateTimeSlots();
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('show');
    document.getElementById('bookingForm').reset();
    selectedTimeSlot = null;
}

function generateTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    const timeSlots = [
        '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
        '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
    ];
    
    timeSlotsContainer.innerHTML = '';
    
    timeSlots.forEach(time => {
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.textContent = time;
        
        // Randomly mark some slots as booked for demo
        if (Math.random() > 0.7) {
            slot.classList.add('booked');
            slot.textContent += ' (Booked)';
        } else {
            slot.onclick = () => selectTimeSlot(slot, time);
        }
        
        timeSlotsContainer.appendChild(slot);
    });
}

function selectTimeSlot(slotElement, time) {
    // Clear previous selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Select new slot
    slotElement.classList.add('selected');
    selectedTimeSlot = time;
}

function updateTimeSlots() {
    // Update time slots when resource or date changes
    generateTimeSlots();
}

function submitBooking(event) {
    event.preventDefault();
    
    if (!selectedTimeSlot) {
        showNotification('Please select a time slot', 'warning');
        return;
    }
    
    const resourceId = document.getElementById('resourceSelect').value;
    const resource = RESOURCES_DATA.find(r => r.id === resourceId);
    const date = document.getElementById('bookingDate').value;
    const duration = document.getElementById('bookingDuration').value;
    const purpose = document.getElementById('bookingPurpose').value;
    const requirements = document.getElementById('specialRequirements').value;
    const contact = document.getElementById('contactNumber').value;
    
    // Calculate end time
    const startTime = new Date(`2000-01-01 ${selectedTimeSlot}`);
    const endTime = new Date(startTime.getTime() + (parseInt(duration) * 60000));
    const endTimeStr = endTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    
    const newBooking = {
        id: `booking_${Date.now()}`,
        resourceId: resourceId,
        resourceName: resource.name,
        date: date,
        time: `${selectedTimeSlot} - ${endTimeStr}`,
        purpose: purpose,
        requirements: requirements,
        contact: contact,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    myBookings.push(newBooking);
    
    // Save to localStorage
    localStorage.setItem('scms_teacher_bookings', JSON.stringify(myBookings));
    
    displayMyBookings();
    closeBookingModal();
    
    showNotification(`✅ Resource booked successfully! ${resource.name} reserved for ${selectedTimeSlot}`, 'success');
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        myBookings = myBookings.filter(booking => booking.id !== bookingId);
        localStorage.setItem('scms_teacher_bookings', JSON.stringify(myBookings));
        
        displayMyBookings();
        showNotification('Booking cancelled successfully', 'warning');
    }
}

function modifyBooking(bookingId) {
    const booking = myBookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    // Pre-fill form with existing booking data
    document.getElementById('resourceSelect').innerHTML = 
        `<option value="${booking.resourceId}" selected>${booking.resourceName}</option>`;
    document.getElementById('bookingDate').value = booking.date;
    document.getElementById('bookingPurpose').value = booking.purpose;
    
    // Remove the old booking temporarily
    myBookings = myBookings.filter(b => b.id !== bookingId);
    
    document.getElementById('modalTitle').textContent = 'Modify Booking';
    document.getElementById('bookingModal').classList.add('show');
    generateTimeSlots();
    
    showNotification('Modify your booking and click Confirm', 'info');
}

function viewResourceDetails(resourceId) {
    const resource = RESOURCES_DATA.find(r => r.id === resourceId);
    if (!resource) return;
    
    const details = `
📋 Resource Details:
━━━━━━━━━━━━━━━━━
🏷️ Name: ${resource.name}
📍 Location: ${resource.room}, ${getLocationName(resource.location)}
🏆 Condition: ${resource.condition.replace('_', ' ').toUpperCase()}
🔧 Features: ${resource.features.join(', ')}
${resource.lastMaintenance ? `🔨 Last Maintenance: ${resource.lastMaintenance}` : ''}
${resource.capacity ? `👥 Capacity: ${resource.capacity}` : ''}
${resource.bookedBy ? `📅 Current User: ${resource.bookedBy}` : ''}
${resource.issue ? `⚠️ Issue: ${resource.issue}` : ''}
    `;
    
    alert(details);
}

function requestEarlyAccess(resourceId) {
    const resource = RESOURCES_DATA.find(r => r.id === resourceId);
    if (!resource) return;
    
    if (confirm(`Request early access to ${resource.name}?\nCurrent user: ${resource.bookedBy}\nBooked until: ${resource.bookedUntil}`)) {
        showNotification('🔔 Early access request sent to current user and admin', 'info');
    }
}

function refreshResources() {
    showNotification('🔄 Refreshing resource availability...', 'info');
    
    setTimeout(() => {
        // Simulate some status changes
        if (Math.random() > 0.7) {
            const availableResources = RESOURCES_DATA.filter(r => r.status === 'available');
            if (availableResources.length > 0) {
                const randomResource = availableResources[Math.floor(Math.random() * availableResources.length)];
                randomResource.status = 'booked';
                randomResource.bookedBy = 'Auto-booking';
                randomResource.bookedUntil = '4:00 PM';
            }
        }
        
        loadResources();
        updateStats();
        showNotification('✅ Resource status updated', 'success');
    }, 1500);
}

function viewAllBookings() {
    showNotification('📋 Opening detailed bookings view...', 'info');
    setTimeout(() => {
        showNotification('Detailed booking history would open in real app', 'info');
    }, 1500);
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
        <i class="${icons[type]}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// Auto-update resource status periodically
setInterval(() => {
    if (Math.random() > 0.9) {
        const bookedResources = RESOURCES_DATA.filter(r => r.status === 'booked');
        if (bookedResources.length > 0) {
            const randomResource = bookedResources[Math.floor(Math.random() * bookedResources.length)];
            randomResource.status = 'available';
            delete randomResource.bookedBy;
            delete randomResource.bookedUntil;
            
            loadResources();
            updateStats();
            
            showNotification(`📢 ${randomResource.name} is now available!`, 'success');
        }
    }
}, 15000);

// Handle click outside sidebar on mobile
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

// Close modal when clicking outside
document.getElementById('bookingModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeBookingModal();
    }
});
