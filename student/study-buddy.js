console.log('📚 Study Buddy JS loading...');

// Study Buddy State Management
let studyBuddyState = {
    currentUser: {
        id: 'user_001',
        name: 'Alex Rodriguez',
        roll: 'CS2023001',
        avatar: 'A'
    },
    rooms: [],
    myRooms: [],
    friends: [],
    stats: {
        totalRooms: 12,
        totalStudents: 47,
        myBadges: 8,
        avgDuration: '2.5h'
    },
    filters: {
        subject: '',
        capacity: '',
        search: ''
    },
    theme: 'light',
    sidebarOpen: false,
    chatOpen: false
};

// Initialize Study Buddy
function initializeStudyBuddy() {
    console.log('🎯 Initializing Study Buddy...');
    
    loadTheme();
    loadUserData();
    loadRoomsData();
    loadFriendsData();
    setupEventListeners();
    updateStats();
    updateCurrentTime();
    
    // Start real-time updates
    setInterval(updateCurrentTime, 60000); // Update every minute
    setInterval(updateRoomStats, 30000); // Update room stats every 30s
    
    console.log('✅ Study Buddy initialized successfully');
}

// Load Theme - Sync with Dashboard
function loadTheme() {
    // Get theme from localStorage (shared with dashboard)
    const savedTheme = localStorage.getItem('theme') || 'light';
    studyBuddyState.theme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
    
    updateThemeUI(savedTheme);
    
    console.log(`🎨 Theme loaded: ${savedTheme}`);
}

// Update Theme UI Elements
function updateThemeUI(theme) {
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

// Toggle Theme - Global Theme Sync
function toggleTheme() {
    const currentTheme = studyBuddyState.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Update state
    studyBuddyState.theme = newTheme;
    
    // Apply theme to all elements
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
    
    // Save to localStorage (shared with all pages)
    localStorage.setItem('theme', newTheme);
    
    // Update UI
    updateThemeUI(newTheme);
    
    // Show notification
    showNotification(`🎨 ${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated!`, 'success');
    
    console.log(`🌙 Theme switched to: ${newTheme}`);
}

// Load User Data
function loadUserData() {
    const savedUser = localStorage.getItem('studyBuddyUser');
    if (savedUser) {
        studyBuddyState.currentUser = { ...studyBuddyState.currentUser, ...JSON.parse(savedUser) };
    }
    
    // Update UI
    const userNameElements = document.querySelectorAll('#userName');
    const userRollElements = document.querySelectorAll('#userRoll');
    const userAvatarElements = document.querySelectorAll('#userAvatar');
    
    userNameElements.forEach(el => el.textContent = studyBuddyState.currentUser.name);
    userRollElements.forEach(el => el.textContent = studyBuddyState.currentUser.roll);
    userAvatarElements.forEach(el => el.textContent = studyBuddyState.currentUser.avatar);
}

// Load Rooms Data
function loadRoomsData() {
    // Sample rooms data
    studyBuddyState.rooms = [
        {
            id: 'featured-math',
            title: 'Advanced Calculus Study Group',
            description: 'Complete study environment with AI tutor, whiteboard, and collaborative tools',
            subject: 'mathematics',
            level: 'advanced',
            capacity: { current: 4, max: 8 },
            duration: '2h 15m active',
            rating: 4.8,
            status: 'active',
            privacy: 'public',
            features: ['AI Tutor', 'Whiteboard', 'Video Chat', 'Live Chat'],
            members: ['A', 'S', 'M', 'R'],
            isFeatured: true
        },
        {
            id: 'room-1',
            title: 'Quantum Mechanics Discussion',
            description: 'Deep dive into quantum theory and wave functions',
            subject: 'physics',
            level: 'advanced',
            capacity: { current: 3, max: 6 },
            duration: '1h 30m left',
            rating: 4.6,
            status: 'active',
            privacy: 'public',
            members: ['J', 'K', 'L']
        },
        {
            id: 'room-2',
            title: 'Data Structures & Algorithms',
            description: 'Practicing coding problems and algorithm analysis',
            subject: 'computer-science',
            level: 'expert',
            capacity: { current: 5, max: 8 },
            duration: '3h 45m active',
            rating: 4.9,
            status: 'active',
            privacy: 'private',
            members: ['C', 'D', 'E', 'F', 'G']
        },
        {
            id: 'room-3',
            title: 'Organic Chemistry Lab',
            description: 'Reaction mechanisms and synthesis pathways',
            subject: 'chemistry',
            level: 'intermediate',
            capacity: { current: 10, max: 10 },
            duration: '45m left',
            rating: 4.5,
            status: 'full',
            privacy: 'public',
            members: ['H', 'I', 'J', 'K', '+6']
        }
    ];
    
    // My Rooms
    studyBuddyState.myRooms = [
        {
            id: 'my-room-1',
            title: 'Organic Chemistry Lab',
            description: 'Reaction mechanisms and synthesis pathways',
            subject: 'chemistry',
            capacity: { current: 3, max: 5 },
            duration: '3h 12m left',
            rating: 4.5,
            status: 'active',
            members: ['A', 'P', 'Q', '+2'],
            isOwner: true
        }
    ];
    
    renderRooms();
    renderMyRooms();
}

// Load Friends Data
function loadFriendsData() {
    studyBuddyState.friends = [
        {
            id: 'friend-1',
            name: 'Sarah Mitchell',
            avatar: 'S',
            status: 'online',
            activity: 'In Mathematics room'
        },
        {
            id: 'friend-2',
            name: 'Mike Chen',
            avatar: 'M',
            status: 'online',
            activity: 'Available'
        },
        {
            id: 'friend-3',
            name: 'Rita Sharma',
            avatar: 'R',
            status: 'away',
            activity: 'Away - 5m ago'
        }
    ];
    
    renderFriends();
}

// Setup Event Listeners
function setupEventListeners() {
    // Theme toggle listeners (multiple elements)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.theme-toggle-sidebar') || 
            e.target.closest('.mobile-theme-toggle')) {
            toggleTheme();
        }
    });
    
    // Mobile sidebar
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileSidebar);
    }
    
    // Filter inputs
    const subjectFilter = document.getElementById('subjectFilter');
    const capacityFilter = document.getElementById('capacityFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (subjectFilter) subjectFilter.addEventListener('change', filterRooms);
    if (capacityFilter) capacityFilter.addEventListener('change', filterRooms);
    if (searchInput) searchInput.addEventListener('input', debounce(filterRooms, 300));
    
    // Create room form
    const createRoomForm = document.getElementById('createRoomForm');
    if (createRoomForm) {
        createRoomForm.addEventListener('submit', createRoom);
    }
    
    // Chat input
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', handleChatKeyPress);
    }
    
    console.log('🔗 Event listeners setup complete');
}

// Mobile Sidebar Functions
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        studyBuddyState.sidebarOpen = !studyBuddyState.sidebarOpen;
        
        // Prevent body scroll when sidebar is open
        document.body.style.overflow = studyBuddyState.sidebarOpen ? 'hidden' : '';
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        studyBuddyState.sidebarOpen = false;
        document.body.style.overflow = '';
    }
}

// Update Current Time
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    });
    
    const currentTimeEl = document.getElementById('currentTime');
    if (currentTimeEl) {
        currentTimeEl.textContent = timeString;
    }
}

// Update Stats
function updateStats() {
    const totalRoomsEl = document.getElementById('totalRooms');
    const totalStudentsEl = document.getElementById('totalStudents');
    const myBadgesEl = document.getElementById('myBadges');
    const avgDurationEl = document.getElementById('avgDuration');
    
    if (totalRoomsEl) totalRoomsEl.textContent = studyBuddyState.stats.totalRooms;
    if (totalStudentsEl) totalStudentsEl.textContent = studyBuddyState.stats.totalStudents;
    if (myBadgesEl) myBadgesEl.textContent = studyBuddyState.stats.myBadges;
    if (avgDurationEl) avgDurationEl.textContent = studyBuddyState.stats.avgDuration;
}

// Update Room Stats (Real-time simulation)
function updateRoomStats() {
    // Simulate real-time changes
    const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    studyBuddyState.stats.totalStudents += variation;
    studyBuddyState.stats.totalStudents = Math.max(40, Math.min(60, studyBuddyState.stats.totalStudents));
    
    updateStats();
}

// Helper Functions for Room Rendering
function getSubjectIcon(subject) {
    const icons = {
        'mathematics': 'fa-calculator',
        'physics': 'fa-atom',
        'chemistry': 'fa-flask',
        'computer-science': 'fa-laptop-code',
        'biology': 'fa-dna',
        'english': 'fa-book',
        'history': 'fa-landmark',
        'economics': 'fa-chart-line'
    };
    return icons[subject] || 'fa-book';
}

function getSubjectName(subject) {
    const names = {
        'mathematics': 'Mathematics',
        'physics': 'Physics',
        'chemistry': 'Chemistry',
        'computer-science': 'Computer Science',
        'biology': 'Biology',
        'english': 'English',
        'history': 'History',
        'economics': 'Economics'
    };
    return names[subject] || 'General';
}

function getFeatureIcon(feature) {
    const icons = {
        'AI Tutor': 'fa-robot',
        'Whiteboard': 'fa-chalkboard',
        'Video Chat': 'fa-video',
        'Live Chat': 'fa-comments',
        'Screen Share': 'fa-desktop'
    };
    return icons[feature] || 'fa-star';
}

function getStatusText(status) {
    const statusTexts = {
        'active': 'Active Now',
        'available': 'Available',
        'full': 'Full',
        'waiting': 'Waiting List'
    };
    return statusTexts[status] || 'Unknown';
}

function getRoomButtonClass(room) {
    if (room.status === 'full') return 'btn-disabled';
    if (room.privacy === 'private') return 'btn-warning';
    return 'btn-primary';
}

function getRoomButtonText(room) {
    if (room.status === 'full') return '<i class="fas fa-ban"></i> Room Full';
    if (room.privacy === 'private') return '<i class="fas fa-key"></i> Request Join';
    if (room.isFeatured) return '<i class="fas fa-rocket"></i> Join Study Room';
    return '<i class="fas fa-sign-in-alt"></i> Join Room';
}

// Render Rooms
function renderRooms() {
    const roomsContainer = document.getElementById('roomsContainer');
    if (!roomsContainer) return;
    
    const filteredRooms = getFilteredRooms();
    
    roomsContainer.innerHTML = filteredRooms.map(room => `
        <div class="room-card ${room.isFeatured ? 'featured-room' : ''}" data-room-id="${room.id}">
            ${room.isFeatured ? `
                <div class="featured-badge">
                    <i class="fas fa-star"></i>
                    <span>FEATURED</span>
                </div>
            ` : ''}
            
            <div class="room-status ${room.status}">
                <span class="status-dot"></span>
                ${getStatusText(room.status)}
            </div>
            
            <div class="room-header">
                <div class="room-subject ${room.subject}">
                    <i class="fas ${getSubjectIcon(room.subject)}"></i>
                    <span>${getSubjectName(room.subject)}</span>
                </div>
                <div class="room-privacy ${room.privacy}">
                    <i class="fas ${room.privacy === 'public' ? 'fa-globe' : 'fa-lock'}"></i>
                </div>
            </div>
            
            <div class="room-content">
                <h4 class="room-title">${room.title}</h4>
                <p class="room-description">${room.description}</p>
                
                ${room.features ? `
                    <div class="room-features">
                        ${room.features.map(feature => `
                            <div class="feature-tag">
                                <i class="fas ${getFeatureIcon(feature)}"></i>
                                ${feature}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="room-meta">
                    <div class="room-capacity">
                        <i class="fas fa-users"></i>
                        <span>${room.capacity.current}/${room.capacity.max}</span>
                    </div>
                    <div class="room-duration">
                        <i class="fas fa-clock"></i>
                        <span>${room.duration}</span>
                    </div>
                    <div class="room-level">
                        <i class="fas fa-star"></i>
                        <span>${room.rating ? room.rating + ' rating' : room.level}</span>
                    </div>
                </div>
                
                <div class="room-members">
                    ${room.members.map(member => `
                        <div class="member-avatar">${member}</div>
                    `).join('')}
                    ${room.isFeatured ? '<div class="join-indicator"><i class="fas fa-plus"></i></div>' : ''}
                </div>
            </div>
            
            <div class="room-actions">
                <button class="btn ${getRoomButtonClass(room)} ${room.isFeatured ? 'featured-btn' : ''}" 
                        onclick="${room.isFeatured ? 'joinStudyRoom()' : `handleRoomAction('${room.id}')`}"
                        ${room.status === 'full' ? 'disabled' : ''}>
                    ${getRoomButtonText(room)}
                </button>
            </div>
        </div>
    `).join('');
}

// Render My Rooms
function renderMyRooms() {
    const myRoomsContainer = document.getElementById('myRoomsContainer');
    if (!myRoomsContainer) return;
    
    myRoomsContainer.innerHTML = studyBuddyState.myRooms.map(room => `
        <div class="room-card my-room" data-room-id="${room.id}">
            <div class="room-badge">
                <i class="fas fa-crown"></i>
                Created by me
            </div>
            <div class="room-header">
                <div class="room-subject ${room.subject}">
                    <i class="fas ${getSubjectIcon(room.subject)}"></i>
                    <span>${getSubjectName(room.subject)}</span>
                </div>
                <div class="room-controls">
                    <button class="control-btn" onclick="manageRoom('${room.id}')" title="Manage Room">
                        <i class="fas fa-cog"></i>
                    </button>
                    <button class="control-btn danger" onclick="deleteRoom('${room.id}')" title="Delete Room">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="room-content">
                <h4 class="room-title">${room.title}</h4>
                <p class="room-description">${room.description}</p>
                <div class="room-meta">
                    <div class="room-capacity">
                        <i class="fas fa-users"></i>
                        <span>${room.capacity.current}/${room.capacity.max}</span>
                    </div>
                    <div class="room-duration">
                        <i class="fas fa-clock"></i>
                        <span>${room.duration}</span>
                    </div>
                    <div class="room-rating">
                        <i class="fas fa-star"></i>
                        <span>${room.rating} rating</span>
                    </div>
                </div>
                <div class="room-members">
                    ${room.members.map((member, index) => `
                        <div class="member-avatar ${index === 0 ? 'owner' : ''}">${member}</div>
                    `).join('')}
                </div>
            </div>
            <div class="room-actions">
                <button class="btn btn-success" onclick="enterRoom('${room.id}')">
                    <i class="fas fa-door-open"></i>
                    Enter Room
                </button>
            </div>
        </div>
    `).join('');
}

// Render Friends
function renderFriends() {
    const friendsContainer = document.querySelector('.friends-list');
    if (!friendsContainer) return;
    
    friendsContainer.innerHTML = studyBuddyState.friends.map(friend => `
        <div class="friend-item" data-friend-id="${friend.id}">
            <div class="friend-avatar ${friend.status}">${friend.avatar}</div>
            <div class="friend-info">
                <div class="friend-name">${friend.name}</div>
                <div class="friend-status">${friend.activity}</div>
            </div>
            <button class="invite-btn" onclick="inviteFriend('${friend.id}')" 
                    ${friend.status === 'away' ? 'disabled' : ''}>
                <i class="fas ${friend.status === 'away' ? 'fa-clock' : 'fa-paper-plane'}"></i>
            </button>
        </div>
    `).join('');
}

// Filter Rooms
function getFilteredRooms() {
    return studyBuddyState.rooms.filter(room => {
        const matchesSubject = !studyBuddyState.filters.subject || room.subject === studyBuddyState.filters.subject;
        const matchesCapacity = !studyBuddyState.filters.capacity || checkCapacityMatch(room, studyBuddyState.filters.capacity);
        const matchesSearch = !studyBuddyState.filters.search || 
            room.title.toLowerCase().includes(studyBuddyState.filters.search.toLowerCase()) ||
            room.description.toLowerCase().includes(studyBuddyState.filters.search.toLowerCase());
        
        return matchesSubject && matchesCapacity && matchesSearch;
    });
}

function checkCapacityMatch(room, capacityFilter) {
    const capacity = room.capacity.max;
    switch (capacityFilter) {
        case '2-5': return capacity >= 2 && capacity <= 5;
        case '6-10': return capacity >= 6 && capacity <= 10;
        case '11-20': return capacity >= 11 && capacity <= 20;
        default: return true;
    }
}

function filterRooms() {
    const subjectFilter = document.getElementById('subjectFilter');
    const capacityFilter = document.getElementById('capacityFilter');
    const searchInput = document.getElementById('searchInput');
    
    studyBuddyState.filters.subject = subjectFilter?.value || '';
    studyBuddyState.filters.capacity = capacityFilter?.value || '';
    studyBuddyState.filters.search = searchInput?.value || '';
    
    renderRooms();
    
    // Show filter results count
    const filteredCount = getFilteredRooms().length;
    showNotification(`📊 Found ${filteredCount} matching rooms`, 'info', 2000);
}

// Room Action Handlers
function joinStudyRoom() {
    showLoading('Connecting to Mathematics Study Room...');
    
    // Save current state
    localStorage.setItem('studyBuddyJoinedRoom', JSON.stringify({
        id: 'featured-math',
        title: 'Advanced Calculus Study Group',
        timestamp: Date.now()
    }));
    
    // Simulate loading
    setTimeout(() => {
        hideLoading();
        showNotification('🚀 Joining study room...', 'success');
        
        // Redirect to study room
        setTimeout(() => {
            window.location.href = 'study-room/index.html';
        }, 1000);
    }, 2000);
}

function handleRoomAction(roomId) {
    const room = studyBuddyState.rooms.find(r => r.id === roomId);
    if (!room) return;
    
    if (room.privacy === 'private') {
        requestJoin(roomId);
    } else {
        joinRoom(roomId);
    }
}

function joinRoom(roomId) {
    const room = studyBuddyState.rooms.find(r => r.id === roomId);
    if (!room) return;
    
    showLoading(`Joining ${room.title}...`);
    
    setTimeout(() => {
        hideLoading();
        room.capacity.current++;
        renderRooms();
        showNotification(`✅ Successfully joined "${room.title}"!`, 'success');
    }, 1500);
}

function requestJoin(roomId) {
    const room = studyBuddyState.rooms.find(r => r.id === roomId);
    if (!room) return;
    
    showLoading('Sending join request...');
    
    setTimeout(() => {
        hideLoading();
        showNotification(`📨 Join request sent for "${room.title}"!`, 'info');
    }, 1000);
}

function enterRoom(roomId) {
    const room = studyBuddyState.myRooms.find(r => r.id === roomId);
    if (!room) return;
    
    showLoading(`Entering ${room.title}...`);
    
    setTimeout(() => {
        hideLoading();
        showNotification(`🚪 Entered "${room.title}" as owner!`, 'success');
    }, 1000);
}

function manageRoom(roomId) {
    showNotification('🔧 Room management panel opening...', 'info');
}

function deleteRoom(roomId) {
    if (confirm('❌ Are you sure you want to delete this room? This action cannot be undone.')) {
        studyBuddyState.myRooms = studyBuddyState.myRooms.filter(r => r.id !== roomId);
        renderMyRooms();
        showNotification('🗑️ Room deleted successfully', 'success');
    }
}

// Modal Functions
function openCreateRoomModal() {
    const modal = document.getElementById('createRoomModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input, textarea, select');
            if (firstInput) firstInput.focus();
        }, 300);
    }
}

function closeCreateRoomModal() {
    const modal = document.getElementById('createRoomModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Reset form
        const form = document.getElementById('createRoomForm');
        if (form) form.reset();
    }
}

function createRoom(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const roomData = {
        id: `room_${Date.now()}`,
        title: formData.get('roomTitle') || document.getElementById('roomTitle').value,
        description: formData.get('roomDescription') || document.getElementById('roomDescription').value,
        subject: formData.get('roomSubject') || document.getElementById('roomSubject').value,
        level: formData.get('roomLevel') || document.getElementById('roomLevel').value,
        capacity: {
            current: 1,
            max: parseInt(formData.get('roomCapacity') || document.getElementById('roomCapacity').value)
        },
        duration: formData.get('roomDuration') || document.getElementById('roomDuration').value,
        privacy: formData.get('privacy') || 'public',
        features: [],
        members: [studyBuddyState.currentUser.avatar],
        status: 'active',
        isOwner: true,
        rating: 0
    };
    
    // Add features
    if (document.getElementById('allowChat')?.checked) roomData.features.push('Live Chat');
    if (document.getElementById('allowAI')?.checked) roomData.features.push('AI Tutor');
    if (document.getElementById('allowWhiteboard')?.checked) roomData.features.push('Whiteboard');
    
    showLoading('Creating study room...');
    
    setTimeout(() => {
        // Add to my rooms
        studyBuddyState.myRooms.unshift(roomData);
        studyBuddyState.rooms.unshift(roomData);
        
        // Update UI
        renderRooms();
        renderMyRooms();
        hideLoading();
        closeCreateRoomModal();
        
        showNotification(`🎉 "${roomData.title}" created successfully!`, 'success');
        
        // Auto-enter the room
        setTimeout(() => {
            enterRoom(roomData.id);
        }, 1000);
    }, 2000);
}

// Quick Actions
function refreshRooms() {
    showLoading('Refreshing rooms...');
    
    setTimeout(() => {
        // Simulate new data
        studyBuddyState.stats.totalRooms += Math.floor(Math.random() * 3) - 1;
        studyBuddyState.stats.totalStudents += Math.floor(Math.random() * 5) - 2;
        
        updateStats();
        renderRooms();
        hideLoading();
        showNotification('🔄 Rooms refreshed!', 'success');
    }, 1000);
}

function findRandomRoom() {
    const availableRooms = studyBuddyState.rooms.filter(r => r.status === 'active' && r.capacity.current < r.capacity.max);
    
    if (availableRooms.length === 0) {
        showNotification('❌ No available rooms found', 'warning');
        return;
    }
    
    const randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];
    joinRoom(randomRoom.id);
}

function viewMyHistory() {
    showNotification('📊 Study history feature coming soon!', 'info');
}

function viewAchievements() {
    showNotification('🏆 Achievements panel coming soon!', 'info');
}

// Friend Actions
function inviteFriend(friendId) {
    const friend = studyBuddyState.friends.find(f => f.id === friendId);
    if (!friend) return;
    
    showNotification(`📨 Invitation sent to ${friend.name}!`, 'success');
}

// View Toggle
function setView(viewType) {
    const roomsContainer = document.getElementById('roomsContainer');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    if (roomsContainer) {
        roomsContainer.className = `rooms-container ${viewType}-view`;
    }
    
    toggleBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-view') === viewType) {
            btn.classList.add('active');
        }
    });
    
    showNotification(`📱 Switched to ${viewType} view`, 'info', 1500);
}

// Chat Functions
function openChatBot() {
    const chatWindow = document.getElementById('chatBotWindow');
    if (chatWindow) {
        chatWindow.classList.add('show');
        chatWindow.style.display = 'block';
        studyBuddyState.chatOpen = true;
        
        // Focus on chat input
        setTimeout(() => {
            const chatInput = document.getElementById('chatInput');
            if (chatInput) chatInput.focus();
        }, 300);
    }
}

function closeChatBot() {
    const chatWindow = document.getElementById('chatBotWindow');
    if (chatWindow) {
        chatWindow.classList.remove('show');
        chatWindow.style.display = 'none';
        studyBuddyState.chatOpen = false;
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');
    
    if (!chatInput || !chatBody) return;
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    chatBody.innerHTML += `
        <div style="margin: 10px 0; text-align: right;">
            <div style="display: inline-block; background: var(--accent-blue); color: white; padding: 8px 12px; border-radius: 12px; max-width: 80%;">
                ${message}
            </div>
        </div>
    `;
    
    chatInput.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Simulate AI response
    setTimeout(() => {
        const responses = [
            "I'd be happy to help you with study rooms! What specific subject are you interested in?",
            "The featured Mathematics room looks great for calculus practice! Would you like to join?",
            "I can help you create a personalized study plan. What's your current focus area?",
            "Study groups are most effective with 4-6 members. Would you like me to find suitable partners?",
            "Based on your preferences, I recommend the Physics or Computer Science rooms!"
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        chatBody.innerHTML += `
            <div style="margin: 10px 0;">
                <div style="display: inline-block; background: var(--bg-tertiary); color: var(--text-primary); padding: 8px 12px; border-radius: 12px; max-width: 80%;">
                    🤖 ${response}
                </div>
            </div>
        `;
        
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000 + Math.random() * 2000);
}

// Utility Functions
function showLoading(message = 'Loading...') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    
    if (loadingOverlay) {
        loadingOverlay.classList.add('show');
        if (loadingText) loadingText.textContent = message;
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('show');
    }
}

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Logout Function
function logout() {
    if (confirm('🚪 Are you sure you want to logout?')) {
        showLoading('Logging out...');
        
        setTimeout(() => {
            // Clear some data but keep theme
            localStorage.removeItem('studyBuddyUser');
            localStorage.removeItem('studyBuddyJoinedRoom');
            
            hideLoading();
            showNotification('👋 Logged out successfully!', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }, 1500);
    }
}

// Notification Styles
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 12px;
    color: white;
    font-weight: 500;
    z-index: 25000;
    transform: translateX(400px);
    transition: all 0.4s ease;
    max-width: 350px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    background: linear-gradient(135deg, var(--accent-green), var(--accent-green-dark));
}

.notification.error {
    background: linear-gradient(135deg, var(--accent-red), #dc2626);
}

.notification.warning {
    background: linear-gradient(135deg, var(--accent-yellow), #d97706);
    color: var(--text-primary);
}

.notification.info {
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-blue-dark));
}

@media (max-width: 768px) {
    .notification {
        left: 20px;
        right: 20px;
        max-width: none;
        transform: translateY(-100px);
    }
    
    .notification.show {
        transform: translateY(0);
    }
}
`;

// Add notification styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for all elements to be ready
    setTimeout(initializeStudyBuddy, 500);
});

// Export functions to global scope
window.toggleTheme = toggleTheme;
window.toggleMobileSidebar = toggleMobileSidebar;
window.closeMobileSidebar = closeMobileSidebar;
window.joinStudyRoom = joinStudyRoom;
window.handleRoomAction = handleRoomAction;
window.joinRoom = joinRoom;
window.requestJoin = requestJoin;
window.enterRoom = enterRoom;
window.manageRoom = manageRoom;
window.deleteRoom = deleteRoom;
window.openCreateRoomModal = openCreateRoomModal;
window.closeCreateRoomModal = closeCreateRoomModal;
window.createRoom = createRoom;
window.refreshRooms = refreshRooms;
window.findRandomRoom = findRandomRoom;
window.viewMyHistory = viewMyHistory;
window.viewAchievements = viewAchievements;
window.inviteFriend = inviteFriend;
window.setView = setView;
window.filterRooms = filterRooms;
window.openChatBot = openChatBot;
window.closeChatBot = closeChatBot;
window.handleChatKeyPress = handleChatKeyPress;
window.sendChatMessage = sendChatMessage;
window.logout = logout;

console.log('🚀 Study Buddy JS loaded successfully with theme sync!');
