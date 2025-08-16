// Course Content Management JavaScript - Full Advanced Features

// Global Variables
let contentItems = [];
let filteredContentItems = [];
let currentFolder = 'root';
let currentView = 'grid';
let currentFilter = 'all';
let folderStructure = {};
let uploadQueue = [];
let currentlyPlayingVideo = null;
let videoNotes = [];
let currentUser = {
    name: 'Dr. John Doe',
    department: 'Computer Science',
    avatar: 'JD'
};

// Mock Database with Realistic Content
const MOCK_CONTENT = [
    {
        id: 'content-001',
        name: 'Data Structures - Introduction',
        type: 'video',
        format: 'mp4',
        folder: 'root',
        path: 'Data Structures - Introduction.mp4',
        size: 156789000, // bytes
        duration: 1847, // seconds
        uploadDate: '2025-08-15T10:30:00Z',
        lastModified: '2025-08-15T10:30:00Z',
        views: 245,
        downloads: 78,
        visibility: 'students',
        description: 'Comprehensive introduction to data structures concepts including arrays, linked lists, and basic operations.',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PC9zdmc+',
        comments: [
            { author: 'Dr. John Doe', text: 'Great introduction video with clear explanations.', date: '2025-08-16T09:15:00Z' },
            { author: 'Student Comments', text: 'Very helpful! Please add more examples.', date: '2025-08-16T14:22:00Z' }
        ],
        tags: ['data-structures', 'introduction', 'programming'],
        analytics: {
            watchTime: 1245,
            completionRate: 67,
            engagement: 8.5
        }
    },
    {
        id: 'content-002',
        name: 'Algorithm Complexity Analysis.pdf',
        type: 'document',
        format: 'pdf',
        folder: 'root',
        path: 'Algorithm Complexity Analysis.pdf',
        size: 2456789,
        uploadDate: '2025-08-14T15:45:00Z',
        lastModified: '2025-08-14T15:45:00Z',
        views: 187,
        downloads: 142,
        visibility: 'students',
        description: 'Detailed analysis of time and space complexity with practical examples and mathematical proofs.',
        pages: 24,
        comments: [
            { author: 'Dr. John Doe', text: 'Essential reading for understanding algorithmic efficiency.', date: '2025-08-15T08:30:00Z' }
        ],
        tags: ['algorithms', 'complexity', 'analysis'],
        analytics: {
            readTime: 18,
            bookmarks: 34,
            prints: 12
        }
    },
    {
        id: 'content-003',
        name: 'Lectures',
        type: 'folder',
        format: null,
        folder: 'root',
        path: 'Lectures/',
        size: null,
        uploadDate: '2025-08-10T09:00:00Z',
        lastModified: '2025-08-16T16:20:00Z',
        views: 0,
        downloads: 0,
        visibility: 'students',
        description: 'Collection of all lecture materials and recordings',
        itemCount: 15,
        tags: ['lectures', 'videos', 'materials'],
        analytics: null
    },
    {
        id: 'content-004',
        name: 'Binary Trees Implementation.cpp',
        type: 'code',
        format: 'cpp',
        folder: 'root',
        path: 'Binary Trees Implementation.cpp',
        size: 15678,
        uploadDate: '2025-08-13T11:20:00Z',
        lastModified: '2025-08-13T11:20:00Z',
        views: 98,
        downloads: 67,
        visibility: 'students',
        description: 'Complete C++ implementation of binary tree data structure with all basic operations.',
        lines: 234,
        language: 'cpp',
        comments: [
            { author: 'Dr. John Doe', text: 'Well-commented code with good structure.', date: '2025-08-14T10:15:00Z' }
        ],
        tags: ['code', 'binary-trees', 'cpp', 'implementation'],
        analytics: {
            compilations: 45,
            forks: 12,
            issues: 2
        }
    },
    {
        id: 'content-005',
        name: 'Database Design Presentation.pptx',
        type: 'presentation',
        format: 'pptx',
        folder: 'root',
        path: 'Database Design Presentation.pptx',
        size: 8765432,
        uploadDate: '2025-08-12T14:30:00Z',
        lastModified: '2025-08-12T14:30:00Z',
        views: 156,
        downloads: 89,
        visibility: 'students',
        description: 'Comprehensive presentation covering database design principles, normalization, and ER diagrams.',
        slides: 42,
        comments: [
            { author: 'Dr. John Doe', text: 'Updated with latest examples and case studies.', date: '2025-08-13T09:45:00Z' }
        ],
        tags: ['database', 'design', 'presentation', 'normalization'],
        analytics: {
            slideViews: 1560,
            avgTimePerSlide: 45,
            downloads: 89
        }
    },
    {
        id: 'content-006',
        name: 'Sorting Algorithms Audio Explanation.mp3',
        type: 'audio',
        format: 'mp3',
        folder: 'root',
        path: 'Sorting Algorithms Audio Explanation.mp3',
        size: 12456789,
        duration: 2340,
        uploadDate: '2025-08-11T16:15:00Z',
        lastModified: '2025-08-11T16:15:00Z',
        views: 76,
        downloads: 54,
        visibility: 'students',
        description: 'Audio explanation of various sorting algorithms including bubble sort, merge sort, and quick sort.',
        comments: [],
        tags: ['audio', 'sorting', 'algorithms', 'explanation'],
        analytics: {
            listenTime: 1567,
            completionRate: 72,
            replays: 23
        }
    },
    {
        id: 'content-007',
        name: 'Class Diagram Example.png',
        type: 'image',
        format: 'png',
        folder: 'root',
        path: 'Class Diagram Example.png',
        size: 567890,
        uploadDate: '2025-08-10T13:45:00Z',
        lastModified: '2025-08-10T13:45:00Z',
        views: 123,
        downloads: 98,
        visibility: 'students',
        description: 'UML class diagram example showing relationships between different classes in a library management system.',
        dimensions: { width: 1920, height: 1080 },
        comments: [
            { author: 'Dr. John Doe', text: 'Clear example of proper UML notation.', date: '2025-08-11T08:20:00Z' }
        ],
        tags: ['uml', 'class-diagram', 'design', 'example'],
        analytics: {
            zoomLevel: 1.5,
            annotationViews: 34,
            shares: 12
        }
    },
    {
        id: 'content-008',
        name: 'Programming Exercises.zip',
        type: 'archive',
        format: 'zip',
        folder: 'root',
        path: 'Programming Exercises.zip',
        size: 3456789,
        uploadDate: '2025-08-09T10:00:00Z',
        lastModified: '2025-08-09T10:00:00Z',
        views: 203,
        downloads: 178,
        visibility: 'students',
        description: 'Collection of programming exercises covering loops, conditionals, functions, and object-oriented programming.',
        extractedFiles: 25,
        comments: [
            { author: 'Dr. John Doe', text: 'Practice these exercises before the next lab session.', date: '2025-08-10T07:30:00Z' }
        ],
        tags: ['exercises', 'programming', 'practice', 'zip'],
        analytics: {
            extractions: 156,
            avgCompletionTime: 45,
            submissions: 89
        }
    }
];

// Syllabus Data
const MOCK_SYLLABUS = {
    courseInfo: {
        title: 'Data Structures and Algorithms',
        code: 'CSE201',
        credits: 4,
        duration: '16 weeks',
        instructor: 'Dr. John Doe',
        description: 'Comprehensive study of fundamental data structures and algorithms with practical implementations.'
    },
    chapters: [
        {
            id: 'ch-1',
            title: 'Introduction to Data Structures',
            status: 'completed',
            progress: 100,
            weeks: [1, 2],
            topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues'],
            materials: ['content-001', 'content-002'],
            assignments: ['Basic DS Implementation'],
            completed: true
        },
        {
            id: 'ch-2',
            title: 'Trees and Tree Algorithms',
            status: 'in-progress',
            progress: 60,
            weeks: [3, 4, 5],
            topics: ['Binary Trees', 'BST', 'AVL Trees', 'Heap'],
            materials: ['content-004'],
            assignments: ['Binary Tree Operations'],
            completed: false
        },
        {
            id: 'ch-3',
            title: 'Graph Algorithms',
            status: 'upcoming',
            progress: 0,
            weeks: [6, 7, 8],
            topics: ['Graph Representation', 'BFS', 'DFS', 'Shortest Path'],
            materials: [],
            assignments: ['Graph Traversal Implementation'],
            completed: false
        },
        {
            id: 'ch-4',
            title: 'Sorting and Searching',
            status: 'upcoming',
            progress: 0,
            weeks: [9, 10, 11],
            topics: ['Bubble Sort', 'Merge Sort', 'Quick Sort', 'Binary Search'],
            materials: ['content-006'],
            assignments: ['Sorting Algorithm Analysis'],
            completed: false
        }
    ]
};

// File Type Icons and Colors
const FILE_TYPES = {
    folder: { icon: 'fas fa-folder', color: '#2563eb' },
    video: { icon: 'fas fa-play', color: '#ef4444' },
    document: { icon: 'fas fa-file-alt', color: '#f97316' },
    pdf: { icon: 'fas fa-file-pdf', color: '#dc2626' },
    image: { icon: 'fas fa-image', color: '#8b5cf6' },
    audio: { icon: 'fas fa-music', color: '#14b8a6' },
    code: { icon: 'fas fa-code', color: '#059669' },
    presentation: { icon: 'fas fa-file-powerpoint', color: '#ea580c' },
    archive: { icon: 'fas fa-file-archive', color: '#f59e0b' },
    spreadsheet: { icon: 'fas fa-file-excel', color: '#059669' },
    text: { icon: 'fas fa-file-alt', color: '#64748b' }
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('📚 Course Content Management System Loading...');
    
    // Load initial data
    contentItems = [...MOCK_CONTENT];
    filteredContentItems = [...contentItems];
    initializeFolderStructure();
    
    // Initialize components
    initializeUserInfo();
    initializeTheme();
    initializeMobileControls();
    loadContentStats();
    renderContent();
    initializeEventListeners();
    initializeDragAndDrop();
    
    // Show success notification
    setTimeout(() => {
        showNotification('Course Content System loaded successfully!', 'success');
        console.log('✅ Course Content System Ready!');
    }, 800);
});

// User Info Functions
function initializeUserInfo() {
    try {
        const userName = document.getElementById('userName');
        const userDept = document.getElementById('userDept');
        
        if (userName) userName.textContent = currentUser.name;
        if (userDept) userDept.textContent = currentUser.department;
        
        console.log('👤 User info initialized');
    } catch (error) {
        console.error('❌ Error initializing user info:', error);
    }
}

// Theme Functions
function initializeTheme() {
    try {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcons(savedTheme);
        console.log('🎨 Theme initialized:', savedTheme);
    } catch (error) {
        console.error('❌ Error initializing theme:', error);
    }
}

function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
        
        showNotification(`Switched to ${newTheme} mode`, 'info');
        console.log('🎨 Theme toggled to:', newTheme);
    } catch (error) {
        console.error('❌ Error toggling theme:', error);
        showNotification('Failed to toggle theme', 'error');
    }
}

function updateThemeIcons(theme) {
    try {
        const themeIcon = document.getElementById('themeIcon');
        const mobileThemeIcon = document.getElementById('mobileThemeIcon');
        const themeLabel = document.getElementById('themeLabel');
        const themeSwitch = document.getElementById('themeSwitch');
        
        const isDark = theme === 'dark';
        const icon = isDark ? 'fas fa-sun' : 'fas fa-moon';
        const label = isDark ? 'Light Mode' : 'Dark Mode';
        
        if (themeIcon) themeIcon.className = icon;
        if (mobileThemeIcon) mobileThemeIcon.className = icon;
        if (themeLabel) themeLabel.textContent = label;
        if (themeSwitch) themeSwitch.classList.toggle('active', isDark);
        
        console.log('🎨 Theme icons updated for:', theme);
    } catch (error) {
        console.error('❌ Error updating theme icons:', error);
    }
}

// Mobile Controls
function initializeMobileControls() {
    try {
        console.log('📱 Mobile controls initialized');
    } catch (error) {
        console.error('❌ Error initializing mobile controls:', error);
    }
}

function toggleMobileSidebar() {
    try {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // Prevent body scroll when sidebar is open
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
            
            console.log('📱 Mobile sidebar toggled');
        }
    } catch (error) {
        console.error('❌ Error toggling mobile sidebar:', error);
    }
}

function closeMobileSidebar() {
    try {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            console.log('📱 Mobile sidebar closed');
        }
    } catch (error) {
        console.error('❌ Error closing mobile sidebar:', error);
    }
}

// Content Statistics
function loadContentStats() {
    try {
        const stats = calculateContentStats();
        
        updateStatElement('totalFiles', stats.totalFiles);
        updateStatElement('totalSize', formatFileSize(stats.totalSize));
        updateStatElement('videosCount', stats.videos);
        updateStatElement('documentsCount', stats.documents);
        updateStatElement('totalViews', stats.totalViews);
        
        console.log('📊 Content stats loaded:', stats);
    } catch (error) {
        console.error('❌ Error loading content stats:', error);
    }
}

function calculateContentStats() {
    try {
        const totalFiles = contentItems.filter(item => item.type !== 'folder').length;
        const totalSize = contentItems.reduce((sum, item) => sum + (item.size || 0), 0);
        const videos = contentItems.filter(item => item.type === 'video').length;
        const documents = contentItems.filter(item => ['document', 'pdf', 'presentation'].includes(item.type)).length;
        const totalViews = contentItems.reduce((sum, item) => sum + (item.views || 0), 0);
        
        return {
            totalFiles,
            totalSize,
            videos,
            documents,
            totalViews
        };
    } catch (error) {
        console.error('❌ Error calculating content stats:', error);
        return { totalFiles: 0, totalSize: 0, videos: 0, documents: 0, totalViews: 0 };
    }
}

function updateStatElement(id, value) {
    try {
        const element = document.getElementById(id);
        if (element) {
            // Add animation effect
            element.style.opacity = '0.5';
            setTimeout(() => {
                element.textContent = value;
                element.style.opacity = '1';
            }, 200);
        }
    } catch (error) {
        console.error('❌ Error updating stat element:', id, error);
    }
}

// Folder Structure Management
function initializeFolderStructure() {
    try {
        folderStructure = {
            'root': {
                name: 'Home',
                path: '/',
                parent: null,
                children: []
            }
        };
        
        // Build folder hierarchy
        contentItems.forEach(item => {
            const parts = item.path.split('/');
            let currentPath = 'root';
            
            for (let i = 0; i < parts.length - 1; i++) {
                const folderName = parts[i];
                if (folderName && !folderStructure[currentPath + '/' + folderName]) {
                    folderStructure[currentPath + '/' + folderName] = {
                        name: folderName,
                        path: currentPath + '/' + folderName,
                        parent: currentPath,
                        children: []
                    };
                }
                currentPath += '/' + folderName;
            }
        });
        
        console.log('📂 Folder structure initialized');
    } catch (error) {
        console.error('❌ Error initializing folder structure:', error);
    }
}

function updateBreadcrumb() {
    try {
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) return;
        
        const parts = currentFolder === 'root' ? ['root'] : currentFolder.split('/');
        let breadcrumbHTML = '';
        let path = '';
        
        parts.forEach((part, index) => {
            path += (index === 0 ? '' : '/') + part;
            const isLast = index === parts.length - 1;
            const displayName = part === 'root' ? 'Home' : part;
            const icon = index === 0 ? '<i class="fas fa-home"></i>' : '';
            
            breadcrumbHTML += `
                <span class="breadcrumb-item ${isLast ? 'active' : ''}" onclick="navigateToFolder('${path}')">
                    ${icon} ${displayName}
                </span>
            `;
        });
        
        breadcrumb.innerHTML = breadcrumbHTML;
        console.log('🧭 Breadcrumb updated for:', currentFolder);
    } catch (error) {
        console.error('❌ Error updating breadcrumb:', error);
    }
}

function navigateToFolder(folderPath) {
    try {
        currentFolder = folderPath;
        updateBreadcrumb();
        filterByFolder();
        console.log('📂 Navigated to folder:', folderPath);
    } catch (error) {
        console.error('❌ Error navigating to folder:', error);
    }
}

// Content Display Management
function switchContentView(view) {
    try {
        currentView = view;
        
        // Update view toggle buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        renderContent();
        console.log('👁️ Content view switched to:', view);
    } catch (error) {
        console.error('❌ Error switching content view:', error);
    }
}

function filterByType(type) {
    try {
        currentFilter = type;
        
        // Update filter tab buttons
        document.querySelectorAll('.filter-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        applyFilters();
        console.log('🔍 Filtered by type:', type);
    } catch (error) {
        console.error('❌ Error filtering by type:', error);
    }
}

function searchContent() {
    try {
        const searchTerm = document.getElementById('contentSearch').value.toLowerCase().trim();
        applyFilters(searchTerm);
        console.log('🔍 Search applied:', searchTerm);
    } catch (error) {
        console.error('❌ Error searching content:', error);
    }
}

function sortContent() {
    try {
        const sortBy = document.getElementById('sortBy').value;
        
        filteredContentItems.sort((a, b) => {
            switch(sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'date':
                    return new Date(b.lastModified) - new Date(a.lastModified);
                case 'size':
                    return (b.size || 0) - (a.size || 0);
                case 'type':
                    return a.type.localeCompare(b.type);
                default:
                    return 0;
            }
        });
        
        renderContent();
        console.log('🔄 Content sorted by:', sortBy);
    } catch (error) {
        console.error('❌ Error sorting content:', error);
    }
}

function applyFilters(searchTerm = '') {
    try {
        if (!searchTerm) {
            searchTerm = document.getElementById('contentSearch')?.value.toLowerCase().trim() || '';
        }
        
        filteredContentItems = contentItems.filter(item => {
            // Folder filter
            if (item.folder !== currentFolder) {
                return false;
            }
            
            // Type filter
            if (currentFilter !== 'all') {
                if (currentFilter === 'document' && !['document', 'pdf', 'presentation', 'code'].includes(item.type)) {
                    return false;
                }
                if (currentFilter !== 'document' && item.type !== currentFilter) {
                    return false;
                }
            }
            
            // Search filter
            if (searchTerm && !item.name.toLowerCase().includes(searchTerm) && 
                !item.description.toLowerCase().includes(searchTerm) &&
                !item.tags?.some(tag => tag.toLowerCase().includes(searchTerm))) {
                return false;
            }
            
            return true;
        });
        
        sortContent();
        console.log('🔍 Filters applied, results:', filteredContentItems.length);
    } catch (error) {
        console.error('❌ Error applying filters:', error);
        filteredContentItems = [...contentItems];
        renderContent();
    }
}

function filterByFolder() {
    applyFilters();
}

function refreshContent() {
    try {
        // Reset filters
        document.getElementById('contentSearch').value = '';
        document.getElementById('sortBy').value = 'name';
        currentFilter = 'all';
        
        // Update filter tabs
        document.querySelectorAll('.filter-tab').forEach(btn => {
            btn.classList.toggle('active', btn.textContent.trim().includes('All Files'));
        });
        
        // Refresh data
        applyFilters();
        loadContentStats();
        
        showNotification('Content refreshed!', 'info');
        console.log('🔄 Content refreshed');
    } catch (error) {
        console.error('❌ Error refreshing content:', error);
        showNotification('Failed to refresh content', 'error');
    }
}

// Content Rendering
function renderContent() {
    try {
        const container = document.getElementById('contentDisplay');
        if (!container) return;
        
        container.className = `content-display`;
        
        if (filteredContentItems.length === 0) {
            container.innerHTML = createEmptyState();
            return;
        }
        
        const contentHTML = currentView === 'grid' ? 
            createGridView(filteredContentItems) : 
            createListView(filteredContentItems);
        
        container.innerHTML = `<div class="content-${currentView}">${contentHTML}</div>`;
        
        // Add entrance animation
        setTimeout(() => {
            const contentElements = container.querySelectorAll(`.content-item`);
            contentElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(20px)';
                    element.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 50);
            });
        }, 50);
        
        console.log('📂 Content rendered:', filteredContentItems.length, 'items in', currentView, 'view');
    } catch (error) {
        console.error('❌ Error rendering content:', error);
        showNotification('Failed to load content', 'error');
    }
}

function createEmptyState() {
    return `
        <div class="empty-state">
            <i class="fas fa-folder-open"></i>
            <h3>No content found</h3>
            <p>No files or folders match your current filters, or this folder is empty.</p>
            <button class="btn btn-primary" onclick="openUploadModal()" style="margin-top: 15px;">
                <i class="fas fa-upload"></i> Upload Content
            </button>
        </div>
    `;
}

function createGridView(items) {
    return items.map(item => createContentCard(item)).join('');
}

function createListView(items) {
    return items.map(item => createContentListItem(item)).join('');
}

function createContentCard(item) {
    try {
        const fileType = FILE_TYPES[item.type] || FILE_TYPES['text'];
        const formattedSize = item.size ? formatFileSize(item.size) : '';
        const formattedDate = formatDate(new Date(item.lastModified));
        const thumbnail = item.thumbnail || null;
        
        return `
            <div class="content-item content-item-grid ${item.type}" 
                 data-item-id="${item.id}" 
                 onclick="openContentItem('${item.id}')"
                 oncontextmenu="showContextMenu(event, '${item.id}')">
                
                <div class="content-icon-large ${item.type}">
                    ${thumbnail ? 
                        `<img src="${thumbnail}" alt="${item.name}" class="content-preview">` : 
                        `<i class="${fileType.icon}"></i>`
                    }
                    ${item.type === 'video' ? '<div class="play-overlay"><i class="fas fa-play"></i></div>' : ''}
                </div>
                
                <div class="content-item-info">
                    <div class="content-item-title">${truncateText(item.name, 30)}</div>
                    <div class="content-item-meta">
                        ${formattedSize ? `<div><i class="fas fa-weight-hanging"></i> ${formattedSize}</div>` : ''}
                        <div><i class="fas fa-calendar"></i> ${formattedDate}</div>
                        ${item.views ? `<div><i class="fas fa-eye"></i> ${item.views} views</div>` : ''}
                        ${item.duration ? `<div><i class="fas fa-clock"></i> ${formatDuration(item.duration)}</div>` : ''}
                    </div>
                    <div class="content-item-stats">
                        <span class="visibility-badge visibility-${item.visibility}">
                            <i class="fas ${getVisibilityIcon(item.visibility)}"></i>
                            ${item.visibility}
                        </span>
                        <div class="content-actions">
                            <button class="content-action-btn" onclick="event.stopPropagation(); downloadFile('${item.id}')" title="Download">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="content-action-btn" onclick="event.stopPropagation(); shareFile('${item.id}')" title="Share">
                                <i class="fas fa-share"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('❌ Error creating content card:', error);
        return '<div class="content-item"><p>Error loading content</p></div>';
    }
}

function createContentListItem(item) {
    try {
        const fileType = FILE_TYPES[item.type] || FILE_TYPES['text'];
        const formattedSize = item.size ? formatFileSize(item.size) : '-';
        const formattedDate = formatDate(new Date(item.lastModified));
        
        return `
            <div class="content-item content-item-list ${item.type}" 
                 data-item-id="${item.id}" 
                 onclick="openContentItem('${item.id}')"
                 oncontextmenu="showContextMenu(event, '${item.id}')">
                
                <div class="content-icon-small ${item.type}">
                    <i class="${fileType.icon}"></i>
                </div>
                
                <div class="content-item-details">
                    <div class="content-name">${item.name}</div>
                    <div class="content-size">${formattedSize}</div>
                    <div class="content-modified">${formattedDate}</div>
                    <div class="content-views">${item.views || 0} views</div>
                    <div class="content-actions">
                        <button class="content-action-btn" onclick="event.stopPropagation(); openContentItem('${item.id}')" title="Open">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="content-action-btn" onclick="event.stopPropagation(); downloadFile('${item.id}')" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="content-action-btn" onclick="event.stopPropagation(); shareFile('${item.id}')" title="Share">
                            <i class="fas fa-share"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('❌ Error creating content list item:', error);
        return '<div class="content-item"><p>Error loading content</p></div>';
    }
}

// File Operations
function openContentItem(itemId) {
    try {
        const item = contentItems.find(i => i.id === itemId);
        if (!item) {
            showNotification('Content not found', 'error');
            return;
        }
        
        // Increment view count
        item.views = (item.views || 0) + 1;
        
        if (item.type === 'folder') {
            navigateToFolder(item.path);
        } else if (item.type === 'video') {
            openVideoPlayer(item);
        } else {
            openFileViewer(item);
        }
        
        console.log('📁 Opened content item:', item.name);
    } catch (error) {
        console.error('❌ Error opening content item:', error);
        showNotification('Failed to open content', 'error');
    }
}

function openFileViewer(item) {
    try {
        const modal = document.getElementById('fileViewerModal');
        const title = document.getElementById('viewerTitle');
        const container = document.getElementById('fileViewerContainer');
        
        title.textContent = item.name;
        
        // Create viewer content based on file type
        let viewerHTML = '';
        
        switch(item.type) {
            case 'image':
                viewerHTML = `
                    <div class="file-preview-area">
                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmMWY1ZjkiLz48dGV4dCB4PSIyMDAiIHk9IjE1MCIgZmlsbD0iIzY0NzQ4YiIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgUHJldmlldyAtICR7aXRlbS5uYW1lfTwvdGV4dD48L3N2Zz4=" alt="${item.name}">
                    </div>
                `;
                break;
            case 'document':
            case 'pdf':
                viewerHTML = `
                    <div class="file-preview-area">
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary);">
                            <i class="fas fa-file-pdf" style="font-size: 4rem; margin-bottom: 20px; color: var(--accent-red);"></i>
                            <h3>${item.name}</h3>
                            <p>Click download to view this PDF document</p>
                            <button class="btn btn-primary" onclick="downloadFile('${item.id}')" style="margin-top: 15px;">
                                <i class="fas fa-download"></i> Download PDF
                            </button>
                        </div>
                    </div>
                `;
                break;
            case 'code':
                viewerHTML = `
                    <div class="file-preview-area">
                        <div class="code-viewer">
                            <div class="code-header">
                                <span class="code-language">${item.language || item.format}</span>
                                <span class="code-lines">${item.lines || 0} lines</span>
                            </div>
                            <pre class="code-content"><code>// Code preview for ${item.name}
// This is a sample preview
#include &lt;iostream&gt;
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}</code></pre>
                        </div>
                    </div>
                `;
                break;
            case 'audio':
                viewerHTML = `
                    <div class="file-preview-area">
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                            <i class="fas fa-music" style="font-size: 4rem; margin-bottom: 20px; color: var(--accent-teal);"></i>
                            <h3>${item.name}</h3>
                            <audio controls style="margin-top: 20px; width: 100%; max-width: 400px;">
                                <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N+QQAoUXrTp66hVFApGn+DyvmMaAzOH0O+YQg0PjN3+i0f9GjNbhL/hX1kKxb+8AAAA" type="audio/wav">
                                Your browser does not support the audio element.
                            </audio>
                            <p style="margin-top: 15px; color: var(--text-secondary);">Duration: ${formatDuration(item.duration || 0)}</p>
                        </div>
                    </div>
                `;
                break;
            default:
                viewerHTML = `
                    <div class="file-preview-area">
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary);">
                            <i class="fas fa-file" style="font-size: 4rem; margin-bottom: 20px; color: var(--accent-blue);"></i>
                            <h3>${item.name}</h3>
                            <p>This file type cannot be previewed</p>
                            <button class="btn btn-primary" onclick="downloadFile('${item.id}')" style="margin-top: 15px;">
                                <i class="fas fa-download"></i> Download File
                            </button>
                        </div>
                    </div>
                `;
        }
        
        // Add info panel
        viewerHTML += createFileInfoPanel(item);
        
        container.innerHTML = viewerHTML;
        
        // Store current item for other operations
        modal.setAttribute('data-item-id', item.id);
        
        modal.style.display = 'flex';
        console.log('👁️ File viewer opened for:', item.name);
    } catch (error) {
        console.error('❌ Error opening file viewer:', error);
        showNotification('Failed to open file viewer', 'error');
    }
}

function createFileInfoPanel(item) {
    const formattedSize = item.size ? formatFileSize(item.size) : 'Unknown';
    const uploadDate = formatDate(new Date(item.uploadDate));
    const modifiedDate = formatDate(new Date(item.lastModified));
    
    return `
        <div class="file-info-panel">
            <h4><i class="fas fa-info-circle"></i> File Information</h4>
            <div class="file-info-grid">
                <div class="file-info-item">
                    <span class="file-info-label">Name:</span>
                    <span class="file-info-value">${item.name}</span>
                </div>
                <div class="file-info-item">
                    <span class="file-info-label">Type:</span>
                    <span class="file-info-value">${item.type.toUpperCase()}</span>
                </div>
                <div class="file-info-item">
                    <span class="file-info-label">Size:</span>
                    <span class="file-info-value">${formattedSize}</span>
                </div>
                <div class="file-info-item">
                    <span class="file-info-label">Uploaded:</span>
                    <span class="file-info-value">${uploadDate}</span>
                </div>
                <div class="file-info-item">
                    <span class="file-info-label">Modified:</span>
                    <span class="file-info-value">${modifiedDate}</span>
                </div>
                <div class="file-info-item">
                    <span class="file-info-label">Visibility:</span>
                    <span class="file-info-value">${item.visibility}</span>
                </div>
            </div>
            
            <div class="file-analytics">
                <h5><i class="fas fa-chart-bar"></i> Analytics</h5>
                <div class="analytics-stats">
                    <div class="analytics-stat">
                        <span class="stat-value">${item.views || 0}</span>
                        <span class="stat-label">Views</span>
                    </div>
                    <div class="analytics-stat">
                        <span class="stat-value">${item.downloads || 0}</span>
                        <span class="stat-label">Downloads</span>
                    </div>
                    <div class="analytics-stat">
                        <span class="stat-value">${formatRelativeTime(new Date(item.lastModified))}</span>
                        <span class="stat-label">Last Viewed</span>
                    </div>
                </div>
            </div>
            
            <div class="file-comments">
                <h5><i class="fas fa-comments"></i> Comments & Feedback</h5>
                <div class="comment-form">
                    <textarea id="newComment" placeholder="Add a comment..." rows="2"></textarea>
                    <button class="btn btn-primary" onclick="addComment('${item.id}')">
                        <i class="fas fa-comment"></i> Add Comment
                    </button>
                </div>
                <div class="comments-list">
                    ${(item.comments || []).map(comment => `
                        <div class="comment-item">
                            <div class="comment-header">
                                <span class="comment-author">${comment.author}</span>
                                <span class="comment-date">${formatDate(new Date(comment.date))}</span>
                            </div>
                            <div class="comment-text">${comment.text}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function closeFileViewer() {
    try {
        const modal = document.getElementById('fileViewerModal');
        modal.style.display = 'none';
        modal.removeAttribute('data-item-id');
        console.log('👁️ File viewer closed');
    } catch (error) {
        console.error('❌ Error closing file viewer:', error);
    }
}

// Video Player
function openVideoPlayer(item) {
    try {
        const modal = document.getElementById('videoPlayerModal');
        const title = document.getElementById('videoTitle');
        const video = document.getElementById('videoPlayer');
        
        title.textContent = item.name;
        video.src = `data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAs1tZGF0`; // Sample video data
        video.poster = item.thumbnail || '';
        
        // Load video notes
        videoNotes = item.notes || [];
        updateVideoNotes();
        
        // Initialize video controls
        initializeVideoPlayer(video);
        
        modal.style.display = 'flex';
        currentlyPlayingVideo = item;
        
        console.log('🎥 Video player opened for:', item.name);
    } catch (error) {
        console.error('❌ Error opening video player:', error);
        showNotification('Failed to open video player', 'error');
    }
}

function initializeVideoPlayer(video) {
    try {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const currentTimeSpan = document.getElementById('currentTime');
        const durationSpan = document.getElementById('duration');
        const progressTrack = document.querySelector('.progress-track');
        const progressPlayed = document.querySelector('.progress-played');
        
        // Update time display
        video.addEventListener('timeupdate', function() {
            const currentTime = video.currentTime;
            const duration = video.duration || 0;
            const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
            
            currentTimeSpan.textContent = formatTime(currentTime);
            durationSpan.textContent = formatTime(duration);
            progressPlayed.style.width = progress + '%';
        });
        
        // Handle play/pause
        video.addEventListener('play', function() {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        });
        
        video.addEventListener('pause', function() {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });
        
        // Progress bar click
        progressTrack.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            video.currentTime = video.duration * percentage;
        });
        
        console.log('🎥 Video player initialized');
    } catch (error) {
        console.error('❌ Error initializing video player:', error);
    }
}

function togglePlayPause() {
    try {
        const video = document.getElementById('videoPlayer');
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    } catch (error) {
        console.error('❌ Error toggling play/pause:', error);
    }
}

function seekBackward() {
    try {
        const video = document.getElementById('videoPlayer');
        video.currentTime = Math.max(0, video.currentTime - 10);
    } catch (error) {
        console.error('❌ Error seeking backward:', error);
    }
}

function seekForward() {
    try {
        const video = document.getElementById('videoPlayer');
        video.currentTime = Math.min(video.duration, video.currentTime + 10);
    } catch (error) {
        console.error('❌ Error seeking forward:', error);
    }
}

function toggleMute() {
    try {
        const video = document.getElementById('videoPlayer');
        const volumeIcon = document.getElementById('volumeIcon');
        
        video.muted = !video.muted;
        volumeIcon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    } catch (error) {
        console.error('❌ Error toggling mute:', error);
    }
}

function changeVolume(value) {
    try {
        const video = document.getElementById('videoPlayer');
        video.volume = value / 100;
        if (video.volume === 0) {
            video.muted = true;
            document.getElementById('volumeIcon').className = 'fas fa-volume-mute';
        } else {
            video.muted = false;
            document.getElementById('volumeIcon').className = 'fas fa-volume-up';
        }
    } catch (error) {
        console.error('❌ Error changing volume:', error);
    }
}

let playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
let currentSpeedIndex = 2;

function changePlaybackSpeed() {
    try {
        const video = document.getElementById('videoPlayer');
        const speedLabel = document.getElementById('speedLabel');
        
        currentSpeedIndex = (currentSpeedIndex + 1) % playbackSpeeds.length;
        const newSpeed = playbackSpeeds[currentSpeedIndex];
        
        video.playbackRate = newSpeed;
        speedLabel.textContent = newSpeed + 'x';
    } catch (error) {
        console.error('❌ Error changing playback speed:', error);
    }
}

function toggleVideoFullscreen() {
    try {
        const container = document.querySelector('.video-player-container');
        
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    } catch (error) {
        console.error('❌ Error toggling fullscreen:', error);
    }
}

function addVideoNote() {
    try {
        const video = document.getElementById('videoPlayer');
        const noteText = document.getElementById('noteText').value.trim();
        
        if (!noteText || !currentlyPlayingVideo) return;
        
        const timestamp = Math.floor(video.currentTime);
        const note = {
            id: 'note-' + Date.now(),
            timestamp: timestamp,
            text: noteText,
            time: formatTime(timestamp)
        };
        
        videoNotes.push(note);
        updateVideoNotes();
        
        // Clear input
        document.getElementById('noteText').value = '';
        
        showNotification('Note added successfully!', 'success');
        console.log('📝 Video note added at:', note.time);
    } catch (error) {
        console.error('❌ Error adding video note:', error);
        showNotification('Failed to add note', 'error');
    }
}

function updateVideoNotes() {
    try {
        const notesList = document.getElementById('videoNotes');
        if (!notesList) return;
        
        const notesHTML = videoNotes.map(note => `
            <div class="note-item">
                <span class="note-timestamp" onclick="seekToTime(${note.timestamp})">${note.time}</span>
                <span class="note-text">${note.text}</span>
                <button class="btn btn-secondary btn-sm" onclick="deleteVideoNote('${note.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        notesList.innerHTML = notesHTML || '<p style="color: var(--text-secondary); text-align: center;">No notes yet</p>';
    } catch (error) {
        console.error('❌ Error updating video notes:', error);
    }
}

function seekToTime(timestamp) {
    try {
        const video = document.getElementById('videoPlayer');
        video.currentTime = timestamp;
        if (video.paused) {
            video.play();
        }
    } catch (error) {
        console.error('❌ Error seeking to time:', error);
    }
}

function deleteVideoNote(noteId) {
    try {
        videoNotes = videoNotes.filter(note => note.id !== noteId);
        updateVideoNotes();
        showNotification('Note deleted', 'info');
    } catch (error) {
        console.error('❌ Error deleting video note:', error);
    }
}

function showVideoInfo() {
    try {
        const panel = document.getElementById('videoInfoPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    } catch (error) {
        console.error('❌ Error showing video info:', error);
    }
}

function closeVideoPlayer() {
    try {
        const modal = document.getElementById('videoPlayerModal');
        const video = document.getElementById('videoPlayer');
        
        video.pause();
        video.src = '';
        modal.style.display = 'none';
        currentlyPlayingVideo = null;
        videoNotes = [];
        
        console.log('🎥 Video player closed');
    } catch (error) {
        console.error('❌ Error closing video player:', error);
    }
}

// Upload System
function openUploadModal() {
    try {
        const modal = document.getElementById('uploadModal');
        const targetFolder = document.getElementById('targetFolder');
        
        // Update target folder options
        updateFolderOptions(targetFolder);
        
        // Reset upload area
        resetUploadArea();
        
        modal.style.display = 'flex';
        console.log('⬆️ Upload modal opened');
    } catch (error) {
        console.error('❌ Error opening upload modal:', error);
        showNotification('Failed to open upload dialog', 'error');
    }
}

function closeUploadModal() {
    try {
        const modal = document.getElementById('uploadModal');
        modal.style.display = 'none';
        
        // Clear upload queue
        uploadQueue = [];
        resetUploadArea();
        
        console.log('⬆️ Upload modal closed');
    } catch (error) {
        console.error('❌ Error closing upload modal:', error);
    }
}

function resetUploadArea() {
    try {
        const uploadQueue = document.getElementById('uploadQueue');
        const queueList = document.getElementById('queueList');
        const startUploadBtn = document.getElementById('startUploadBtn');
        
        uploadQueue.style.display = 'none';
        queueList.innerHTML = '';
        startUploadBtn.disabled = true;
        
        // Reset form
        document.getElementById('fileDescription').value = '';
        
        console.log('⬆️ Upload area reset');
    } catch (error) {
        console.error('❌ Error resetting upload area:', error);
    }
}

function updateFolderOptions(select) {
    try {
        // This would normally populate with actual folder structure
        const folders = ['root', 'lectures', 'assignments', 'resources', 'videos'];
        
        select.innerHTML = folders.map(folder => 
            `<option value="${folder}" ${folder === currentFolder ? 'selected' : ''}>
                ${folder === 'root' ? 'Root Directory' : folder.charAt(0).toUpperCase() + folder.slice(1)}
            </option>`
        ).join('');
    } catch (error) {
        console.error('❌ Error updating folder options:', error);
    }
}

// Drag and Drop
function initializeDragAndDrop() {
    try {
        const uploadZone = document.querySelector('.upload-zone');
        if (!uploadZone) return;
        
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadZone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, unhighlight, false);
        });
        
        // Handle dropped files
        uploadZone.addEventListener('drop', handleDrop, false);
        
        console.log('📁 Drag and drop initialized');
    } catch (error) {
        console.error('❌ Error initializing drag and drop:', error);
    }
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    const uploadZone = document.querySelector('.upload-zone');
    uploadZone.classList.add('drag-over');
}

function unhighlight(e) {
    const uploadZone = document.querySelector('.upload-zone');
    uploadZone.classList.remove('drag-over');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    handleFiles(files);
}

function handleFileSelect(event) {
    const files = event.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    try {
        const fileArray = Array.from(files);
        
        fileArray.forEach(file => {
            if (validateFile(file)) {
                addToUploadQueue(file);
            }
        });
        
        updateUploadQueue();
        console.log('📁 Files processed:', fileArray.length);
    } catch (error) {
        console.error('❌ Error handling files:', error);
        showNotification('Error processing files', 'error');
    }
}

function validateFile(file) {
    try {
        // Check file size (max 100MB)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            showNotification(`File ${file.name} is too large (max 100MB)`, 'error');
            return false;
        }
        
        // Check for duplicate names
        if (uploadQueue.some(item => item.name === file.name)) {
            showNotification(`File ${file.name} is already in queue`, 'warning');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error validating file:', error);
        return false;
    }
}

function addToUploadQueue(file) {
    try {
        const queueItem = {
            id: 'queue-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            file: file,
            name: file.name,
            size: file.size,
            type: getFileType(file),
            progress: 0,
            status: 'pending'
        };
        
        uploadQueue.push(queueItem);
        console.log('➕ Added to upload queue:', file.name);
    } catch (error) {
        console.error('❌ Error adding to upload queue:', error);
    }
}

function updateUploadQueue() {
    try {
        const queueContainer = document.getElementById('uploadQueue');
        const queueList = document.getElementById('queueList');
        const startUploadBtn = document.getElementById('startUploadBtn');
        
        if (uploadQueue.length === 0) {
            queueContainer.style.display = 'none';
            startUploadBtn.disabled = true;
            return;
        }
        
        queueContainer.style.display = 'block';
        startUploadBtn.disabled = false;
        
        const queueHTML = uploadQueue.map(item => createQueueItem(item)).join('');
        queueList.innerHTML = queueHTML;
        
        console.log('📋 Upload queue updated:', uploadQueue.length, 'items');
    } catch (error) {
        console.error('❌ Error updating upload queue:', error);
    }
}

function createQueueItem(item) {
    const fileType = FILE_TYPES[item.type] || FILE_TYPES['text'];
    const formattedSize = formatFileSize(item.size);
    
    return `
        <div class="queue-item" data-queue-id="${item.id}">
            <div class="queue-item-icon" style="background: ${fileType.color};">
                <i class="${fileType.icon}"></i>
            </div>
            <div class="queue-item-info">
                <div class="queue-item-name">${item.name}</div>
                <div class="queue-item-size">${formattedSize}</div>
            </div>
            <div class="queue-item-progress">
                <div class="queue-progress-fill" style="width: ${item.progress}%;"></div>
            </div>
            <button class="queue-item-remove" onclick="removeFromQueue('${item.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

function removeFromQueue(itemId) {
    try {
        uploadQueue = uploadQueue.filter(item => item.id !== itemId);
        updateUploadQueue();
        console.log('➖ Removed from upload queue:', itemId);
    } catch (error) {
        console.error('❌ Error removing from queue:', error);
    }
}

function startUpload() {
    try {
        if (uploadQueue.length === 0) return;
        
        const targetFolder = document.getElementById('targetFolder').value;
        const visibility = document.getElementById('fileVisibility').value;
        const description = document.getElementById('fileDescription').value.trim();
        
        showNotification('Starting upload...', 'info');
        
        // Simulate upload process
        uploadQueue.forEach((item, index) => {
            setTimeout(() => {
                simulateFileUpload(item, targetFolder, visibility, description);
            }, index * 500);
        });
        
        console.log('⬆️ Upload started for', uploadQueue.length, 'files');
    } catch (error) {
        console.error('❌ Error starting upload:', error);
        showNotification('Failed to start upload', 'error');
    }
}

function simulateFileUpload(item, targetFolder, visibility, description) {
    try {
        const progressElement = document.querySelector(`[data-queue-id="${item.id}"] .queue-progress-fill`);
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Create new content item
                const newItem = {
                    id: 'content-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                    name: item.name,
                    type: item.type,
                    format: item.name.split('.').pop().toLowerCase(),
                    folder: targetFolder,
                    path: targetFolder === 'root' ? item.name : `${targetFolder}/${item.name}`,
                    size: item.size,
                    uploadDate: new Date().toISOString(),
                    lastModified: new Date().toISOString(),
                    views: 0,
                    downloads: 0,
                    visibility: visibility,
                    description: description || `Uploaded file: ${item.name}`,
                    comments: [],
                    tags: [],
                    analytics: {}
                };
                
                // Add to content items
                contentItems.unshift(newItem);
                
                // Remove from upload queue
                uploadQueue = uploadQueue.filter(qItem => qItem.id !== item.id);
                
                // Update UI
                updateUploadQueue();
                loadContentStats();
                
                if (uploadQueue.length === 0) {
                    setTimeout(() => {
                        closeUploadModal();
                        applyFilters();
                        showNotification('All files uploaded successfully!', 'success');
                    }, 1000);
                }
            }
            
            if (progressElement) {
                progressElement.style.width = progress + '%';
            }
        }, 100);
        
    } catch (error) {
        console.error('❌ Error simulating upload:', error);
    }
}

// Syllabus Management
function manageSyllabus() {
    try {
        const modal = document.getElementById('syllabusModal');
        loadSyllabusOverview();
        modal.style.display = 'flex';
        console.log('📚 Syllabus modal opened');
    } catch (error) {
        console.error('❌ Error opening syllabus modal:', error);
        showNotification('Failed to open syllabus manager', 'error');
    }
}

function closeSyllabusModal() {
    try {
        const modal = document.getElementById('syllabusModal');
        modal.style.display = 'none';
        console.log('📚 Syllabus modal closed');
    } catch (error) {
        console.error('❌ Error closing syllabus modal:', error);
    }
}

function switchSyllabusTab(tabName) {
    try {
        // Update tab buttons
        document.querySelectorAll('.syllabus-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick="switchSyllabusTab('${tabName}')"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.syllabus-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`syllabus-${tabName}`).classList.add('active');
        
        // Load tab-specific content
        switch(tabName) {
            case 'overview':
                loadSyllabusOverview();
                break;
            case 'chapters':
                loadSyllabusChapters();
                break;
            case 'schedule':
                loadSyllabusSchedule();
                break;
            case 'progress':
                loadSyllabusProgress();
                break;
        }
        
        console.log('📑 Syllabus tab switched to:', tabName);
    } catch (error) {
        console.error('❌ Error switching syllabus tab:', error);
    }
}

function loadSyllabusOverview() {
    try {
        const courseInfo = document.getElementById('courseInfo');
        const progressSummary = document.getElementById('progressSummary');
        
        if (courseInfo) {
            courseInfo.innerHTML = `
                <div class="course-info-grid">
                    <div class="info-item">
                        <strong>Course Title:</strong> ${MOCK_SYLLABUS.courseInfo.title}
                    </div>
                    <div class="info-item">
                        <strong>Course Code:</strong> ${MOCK_SYLLABUS.courseInfo.code}
                    </div>
                    <div class="info-item">
                        <strong>Credits:</strong> ${MOCK_SYLLABUS.courseInfo.credits}
                    </div>
                    <div class="info-item">
                        <strong>Duration:</strong> ${MOCK_SYLLABUS.courseInfo.duration}
                    </div>
                    <div class="info-item">
                        <strong>Instructor:</strong> ${MOCK_SYLLABUS.courseInfo.instructor}
                    </div>
                    <div class="info-item full-width">
                        <strong>Description:</strong> ${MOCK_SYLLABUS.courseInfo.description}
                    </div>
                </div>
            `;
        }
        
        if (progressSummary) {
            const totalChapters = MOCK_SYLLABUS.chapters.length;
            const completedChapters = MOCK_SYLLABUS.chapters.filter(ch => ch.completed).length;
            const overallProgress = Math.round((completedChapters / totalChapters) * 100);
            
            progressSummary.innerHTML = `
                <div class="progress-overview">
                    <div class="progress-stat">
                        <span class="progress-number">${completedChapters}/${totalChapters}</span>
                        <span class="progress-label">Chapters Completed</span>
                    </div>
                    <div class="progress-stat">
                        <span class="progress-number">${overallProgress}%</span>
                        <span class="progress-label">Overall Progress</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${overallProgress}%;"></div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        console.log('📚 Syllabus overview loaded');
    } catch (error) {
        console.error('❌ Error loading syllabus overview:', error);
    }
}

function loadSyllabusChapters() {
    try {
        const chaptersList = document.getElementById('chaptersList');
        if (!chaptersList) return;
        
        const chaptersHTML = MOCK_SYLLABUS.chapters.map(chapter => `
            <div class="chapter-item ${chapter.status}" data-chapter-id="${chapter.id}">
                <div class="chapter-header">
                    <div class="chapter-info">
                        <h4>${chapter.title}</h4>
                        <div class="chapter-meta">
                            <span class="chapter-weeks">Weeks ${chapter.weeks.join(', ')}</span>
                            <span class="chapter-status status-${chapter.status}">${chapter.status.replace('-', ' ')}</span>
                        </div>
                    </div>
                    <div class="chapter-progress">
                        <div class="progress-circle" data-progress="${chapter.progress}">
                            <span>${chapter.progress}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="chapter-details">
                    <div class="chapter-topics">
                        <h5>Topics:</h5>
                        <div class="topics-list">
                            ${chapter.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="chapter-materials">
                        <h5>Materials:</h5>
                        <div class="materials-list">
                            ${chapter.materials.map(materialId => {
                                const material = contentItems.find(item => item.id === materialId);
                                return material ? `<span class="material-link" onclick="openContentItem('${materialId}')">${material.name}</span>` : '';
                            }).join('')}
                        </div>
                    </div>
                    
                    <div class="chapter-assignments">
                        <h5>Assignments:</h5>
                        <div class="assignments-list">
                            ${chapter.assignments.map(assignment => `<span class="assignment-tag">${assignment}</span>`).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="chapter-actions">
                    <button class="btn btn-secondary" onclick="editChapter('${chapter.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-info" onclick="viewChapterMaterials('${chapter.id}')">
                        <i class="fas fa-folder"></i> Materials
                    </button>
                </div>
            </div>
        `).join('');
        
        chaptersList.innerHTML = chaptersHTML;
        console.log('📖 Syllabus chapters loaded');
    } catch (error) {
        console.error('❌ Error loading syllabus chapters:', error);
    }
}

function loadSyllabusSchedule() {
    try {
        const scheduleCalendar = document.getElementById('scheduleCalendar');
        if (!scheduleCalendar) return;
        
        scheduleCalendar.innerHTML = `
            <div class="schedule-placeholder">
                <i class="fas fa-calendar-alt" style="font-size: 3rem; color: var(--accent-blue); margin-bottom: 20px;"></i>
                <h3>Course Schedule</h3>
                <p>Interactive course schedule would be displayed here with:</p>
                <ul style="text-align: left; margin-top: 20px;">
                    <li>Weekly lesson plans</li>
                    <li>Assignment due dates</li>
                    <li>Exam schedules</li>
                    <li>Holiday calendar</li>
                </ul>
            </div>
        `;
        
        console.log('📅 Syllabus schedule loaded');
    } catch (error) {
        console.error('❌ Error loading syllabus schedule:', error);
    }
}

function loadSyllabusProgress() {
    try {
        const progressCharts = document.getElementById('progressCharts');
        if (!progressCharts) return;
        
        progressCharts.innerHTML = `
            <div class="progress-charts-placeholder">
                <i class="fas fa-chart-line" style="font-size: 3rem; color: var(--accent-green); margin-bottom: 20px;"></i>
                <h3>Progress Analytics</h3>
                <p>Detailed progress charts would be displayed here including:</p>
                <ul style="text-align: left; margin-top: 20px;">
                    <li>Chapter completion trends</li>
                    <li>Student engagement metrics</li>
                    <li>Content consumption patterns</li>
                    <li>Assignment submission rates</li>
                </ul>
            </div>
        `;
        
        console.log('📊 Syllabus progress loaded');
    } catch (error) {
        console.error('❌ Error loading syllabus progress:', error);
    }
}

// Quick Access Functions
function showRecentFiles() {
    try {
        const recentFiles = contentItems
            .filter(item => item.type !== 'folder')
            .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
            .slice(0, 10);
        
        currentFilter = 'all';
        filteredContentItems = recentFiles;
        renderContent();
        
        showNotification('Showing recent files', 'info');
        console.log('🕒 Recent files displayed');
    } catch (error) {
        console.error('❌ Error showing recent files:', error);
    }
}

function showPopularContent() {
    try {
        const popularContent = contentItems
            .filter(item => item.type !== 'folder')
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 10);
        
        currentFilter = 'all';
        filteredContentItems = popularContent;
        renderContent();
        
        showNotification('Showing popular content', 'info');
        console.log('🔥 Popular content displayed');
    } catch (error) {
        console.error('❌ Error showing popular content:', error);
    }
}

function showSharedContent() {
    try {
        const sharedContent = contentItems.filter(item => 
            item.visibility === 'teachers' || 
            item.description.toLowerCase().includes('shared')
        );
        
        currentFilter = 'all';
        filteredContentItems = sharedContent;
        renderContent();
        
        showNotification('Showing shared content', 'info');
        console.log('🤝 Shared content displayed');
    } catch (error) {
        console.error('❌ Error showing shared content:', error);
    }
}

function showFavorites() {
    try {
        // This would normally show bookmarked/favorited content
        // For demo, show high-rated content
        const favorites = contentItems.filter(item => 
            (item.views || 0) > 100 || 
            (item.downloads || 0) > 50
        );
        
        currentFilter = 'all';
        filteredContentItems = favorites;
        renderContent();
        
        showNotification('Showing favorites', 'info');
        console.log('❤️ Favorites displayed');
    } catch (error) {
        console.error('❌ Error showing favorites:', error);
    }
}

// File Actions
function downloadFile(itemId) {
    try {
        const item = contentItems.find(i => i.id === itemId);
        if (!item) {
            showNotification('File not found', 'error');
            return;
        }
        
        // Simulate download
        showNotification(`Downloading ${item.name}...`, 'info');
        
        // Increment download count
        item.downloads = (item.downloads || 0) + 1;
        
        // Update stats
        loadContentStats();
        
        setTimeout(() => {
            showNotification('Download completed!', 'success');
        }, 2000);
        
        console.log('⬇️ File download started:', item.name);
    } catch (error) {
        console.error('❌ Error downloading file:', error);
        showNotification('Download failed', 'error');
    }
}

function shareFile(itemId) {
    try {
        const item = contentItems.find(i => i.id === itemId);
        if (!item) {
            showNotification('File not found', 'error');
            return;
        }
        
        const modal = document.getElementById('shareModal');
        
        // Update public link
        const publicLink = document.getElementById('publicLink');
        if (publicLink) {
            publicLink.value = `https://scms.edu/content/shared/${itemId}`;
        }
        
        modal.setAttribute('data-item-id', itemId);
        modal.style.display = 'flex';
        
        console.log('🔗 Share modal opened for:', item.name);
    } catch (error) {
        console.error('❌ Error opening share modal:', error);
        showNotification('Failed to open share dialog', 'error');
    }
}

function closeShareModal() {
    try {
        const modal = document.getElementById('shareModal');
        modal.style.display = 'none';
        modal.removeAttribute('data-item-id');
        console.log('🔗 Share modal closed');
    } catch (error) {
        console.error('❌ Error closing share modal:', error);
    }
}

function copyLink() {
    try {
        const publicLink = document.getElementById('publicLink');
        publicLink.select();
        document.execCommand('copy');
        
        showNotification('Link copied to clipboard!', 'success');
        console.log('📋 Link copied');
    } catch (error) {
        console.error('❌ Error copying link:', error);
        showNotification('Failed to copy link', 'error');
    }
}

function shareContent() {
    try {
        const modal = document.getElementById('shareModal');
        const itemId = modal.getAttribute('data-item-id');
        const item = contentItems.find(i => i.id === itemId);
        
        if (!item) {
            showNotification('File not found', 'error');
            return;
        }
        
        // Get selected classes
        const selectedClasses = [];
        ['share-cs2a', 'share-cs2b', 'share-it3a'].forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox && checkbox.checked) {
                selectedClasses.push(checkbox.nextElementSibling.textContent);
            }
        });
        
        if (selectedClasses.length === 0) {
            showNotification('Please select at least one class', 'warning');
            return;
        }
        
        // Simulate sharing process
        showNotification('Sharing content...', 'info');
        
        setTimeout(() => {
            closeShareModal();
            showNotification(`Content shared with ${selectedClasses.length} class(es)!`, 'success');
            console.log('🔗 Content shared with:', selectedClasses);
        }, 1500);
        
    } catch (error) {
        console.error('❌ Error sharing content:', error);
        showNotification('Failed to share content', 'error');
    }
}

// Comments System
function addComment(itemId) {
    try {
        const commentText = document.getElementById('newComment').value.trim();
        if (!commentText) {
            showNotification('Please enter a comment', 'warning');
            return;
        }
        
        const item = contentItems.find(i => i.id === itemId);
        if (!item) {
            showNotification('File not found', 'error');
            return;
        }
        
        const newComment = {
            author: currentUser.name,
            text: commentText,
            date: new Date().toISOString()
        };
        
        if (!item.comments) {
            item.comments = [];
        }
        
        item.comments.push(newComment);
        
        // Clear input and refresh comments display
        document.getElementById('newComment').value = '';
        
        // If in file viewer, refresh the info panel
        const modal = document.getElementById('fileViewerModal');
        if (modal.style.display === 'flex' && modal.getAttribute('data-item-id') === itemId) {
            const container = document.getElementById('fileViewerContainer');
            const currentContent = container.querySelector('.file-preview-area').outerHTML;
            container.innerHTML = currentContent + createFileInfoPanel(item);
        }
        
        showNotification('Comment added successfully!', 'success');
        console.log('💬 Comment added to:', item.name);
    } catch (error) {
        console.error('❌ Error adding comment:', error);
        showNotification('Failed to add comment', 'error');
    }
}

// Context Menu
function showContextMenu(event, itemId) {
    try {
        event.preventDefault();
        
        const contextMenu = document.getElementById('contextMenu');
        contextMenu.setAttribute('data-item-id', itemId);
        
        // Position the menu
        const x = event.clientX;
        const y = event.clientY;
        
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.style.display = 'block';
        
        // Close menu when clicking elsewhere
        setTimeout(() => {
            document.addEventListener('click', closeContextMenu);
        }, 10);
        
        console.log('📋 Context menu shown for item:', itemId);
    } catch (error) {
        console.error('❌ Error showing context menu:', error);
    }
}

function closeContextMenu() {
    try {
        const contextMenu = document.getElementById('contextMenu');
        contextMenu.style.display = 'none';
        contextMenu.removeAttribute('data-item-id');
        document.removeEventListener('click', closeContextMenu);
    } catch (error) {
        console.error('❌ Error closing context menu:', error);
    }
}

function openFile() {
    try {
        const contextMenu = document.getElementById('contextMenu');
        const itemId = contextMenu.getAttribute('data-item-id');
        if (itemId) {
            openContentItem(itemId);
            closeContextMenu();
        }
    } catch (error) {
        console.error('❌ Error opening file from context menu:', error);
    }
}

function renameFile() {
    try {
        const contextMenu = document.getElementById('contextMenu');
        const itemId = contextMenu.getAttribute('data-item-id');
        const item = contentItems.find(i => i.id === itemId);
        
        if (!item) return;
        
        const newName = prompt('Enter new name:', item.name);
        if (newName && newName.trim() !== item.name) {
            item.name = newName.trim();
            renderContent();
            showNotification('File renamed successfully!', 'success');
            console.log('✏️ File renamed to:', newName);
        }
        
        closeContextMenu();
    } catch (error) {
        console.error('❌ Error renaming file:', error);
        showNotification('Failed to rename file', 'error');
        closeContextMenu();
    }
}

function moveFile() {
    try {
        const contextMenu = document.getElementById('contextMenu');
        const itemId = contextMenu.getAttribute('data-item-id');
        
        showNotification('Move functionality would be implemented here', 'info');
        closeContextMenu();
        console.log('📁 Move file:', itemId);
    } catch (error) {
        console.error('❌ Error moving file:', error);
        closeContextMenu();
    }
}

function copyFile() {
    try {
        const contextMenu = document.getElementById('contextMenu');
        const itemId = contextMenu.getAttribute('data-item-id');
        
        showNotification('Copy functionality would be implemented here', 'info');
        closeContextMenu();
        console.log('📋 Copy file:', itemId);
    } catch (error) {
        console.error('❌ Error copying file:', error);
        closeContextMenu();
    }
}

function deleteFile() {
    try {
        const contextMenu = document.getElementById('contextMenu');
        const itemId = contextMenu.getAttribute('data-item-id');
        const item = contentItems.find(i => i.id === itemId);
        
        if (!item) return;
        
        if (confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
            contentItems = contentItems.filter(i => i.id !== itemId);
            applyFilters();
            loadContentStats();
            
            showNotification('File deleted successfully', 'success');
            console.log('🗑️ File deleted:', item.name);
        }
        
        closeContextMenu();
    } catch (error) {
        console.error('❌ Error deleting file:', error);
        showNotification('Failed to delete file', 'error');
        closeContextMenu();
    }
}

// Folder Management
function createNewFolder() {
    try {
        const folderName = prompt('Enter folder name:');
        if (!folderName || !folderName.trim()) return;
        
        const newFolder = {
            id: 'folder-' + Date.now(),
            name: folderName.trim(),
            type: 'folder',
            format: null,
            folder: currentFolder,
            path: currentFolder === 'root' ? `${folderName}/` : `${currentFolder}/${folderName}/`,
            size: null,
            uploadDate: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            views: 0,
            downloads: 0,
            visibility: 'students',
            description: `Folder: ${folderName}`,
            itemCount: 0,
            tags: ['folder'],
            analytics: null
        };
        
        contentItems.unshift(newFolder);
        applyFilters();
        loadContentStats();
        
        showNotification(`Folder "${folderName}" created successfully!`, 'success');
        console.log('📁 New folder created:', folderName);
    } catch (error) {
        console.error('❌ Error creating folder:', error);
        showNotification('Failed to create folder', 'error');
    }
}

// Utility Functions
function getFileType(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    const typeMap = {
        // Images
        jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', bmp: 'image', svg: 'image',
        // Videos
        mp4: 'video', avi: 'video', mov: 'video', wmv: 'video', flv: 'video', webm: 'video',
        // Audio
        mp3: 'audio', wav: 'audio', flac: 'audio', aac: 'audio', ogg: 'audio',
        // Documents
        pdf: 'pdf', doc: 'document', docx: 'document', txt: 'document',
        // Presentations
        ppt: 'presentation', pptx: 'presentation',
        // Spreadsheets
        xls: 'spreadsheet', xlsx: 'spreadsheet',
        // Code
        js: 'code', html: 'code', css: 'code', cpp: 'code', java: 'code', py: 'code',
        // Archives
        zip: 'archive', rar: 'archive', tar: 'archive', gz: 'archive'
    };
    
    return typeMap[extension] || 'document';
}

function formatFileSize(bytes) {
    if (!bytes) return '0 B';
    
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDuration(seconds) {
    if (!seconds) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatDate(date) {
    try {
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('❌ Error formatting date:', error);
        return 'Invalid Date';
    }
}

function formatRelativeTime(date) {
    try {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return formatDate(date);
    } catch (error) {
        return 'recently';
    }
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

function getVisibilityIcon(visibility) {
    const iconMap = {
        students: 'fa-users',
        private: 'fa-lock',
        teachers: 'fa-chalkboard-teacher'
    };
    return iconMap[visibility] || 'fa-users';
}

function showNotification(message, type = 'info') {
    try {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        // Remove existing classes
        notification.className = 'notification';
        
        // Add type class
        notification.classList.add(type);
        
        // Set icon based on type
        const icon = notification.querySelector('.notification-icon');
        const text = notification.querySelector('.notification-text');
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        if (icon) icon.className = `notification-icon ${icons[type] || icons.info}`;
        if (text) text.textContent = message;
        
        // Show notification
        notification.classList.add('show');
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
        
        console.log(`🔔 ${type.toUpperCase()}:`, message);
    } catch (error) {
        console.error('❌ Error showing notification:', error);
        // Fallback to alert
        alert(message);
    }
}

// Event Listeners
function initializeEventListeners() {
    try {
        // Close modals when clicking outside
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
        
        // Close sidebar when clicking on links (mobile)
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.addEventListener('click', closeMobileSidebar);
        });
        
        // Real-time search
        const searchInput = document.getElementById('contentSearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(searchContent, 300);
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Escape key closes modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    if (modal.style.display === 'flex') {
                        modal.style.display = 'none';
                    }
                });
                closeContextMenu();
            }
            
            // Ctrl+U for upload
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                openUploadModal();
            }
            
            // Ctrl+F for search focus
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                const searchInput = document.getElementById('contentSearch');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        });
        
        console.log('🎛️ Event listeners initialized');
    } catch (error) {
        console.error('❌ Error initializing event listeners:', error);
    }
}

// Global Functions (called from HTML)
function logout() {
    try {
        if (confirm('Are you sure you want to logout?')) {
            showNotification('Logging out...', 'info');
            
            // Clear any stored data
            localStorage.removeItem('currentUser');
            
            // Simulate logout delay
            setTimeout(() => {
                // In a real app, redirect to login page
                window.location.href = 'login.html';
            }, 1500);
            
            console.log('👋 User logged out');
        }
    } catch (error) {
        console.error('❌ Error during logout:', error);
        showNotification('Logout failed', 'error');
    }
}

// Export for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        contentItems,
        showNotification,
        formatFileSize,
        formatDate
    };
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('💥 Global error caught:', e.error);
    showNotification('An unexpected error occurred', 'error');
});

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.duration > 100) {
            console.warn('⚠️ Slow operation detected:', entry.name, entry.duration + 'ms');
        }
    }
});

if (typeof PerformanceObserver !== 'undefined') {
    performanceObserver.observe({ entryTypes: ['measure'] });
}

// Print debug info
console.log(`
📚 Course Content Management System v3.0
🎥 Features: Video Player, File Viewer, Upload System
📁 File Management: Drag & Drop, Context Menus, Search
📊 Analytics: View Tracking, Usage Statistics
🔗 Sharing: Multi-class sharing, Link generation
💬 Collaboration: Comments, Feedback System
📚 Syllabus: Chapter Management, Progress Tracking
📱 Mobile: Touch-friendly, Responsive Design
🌙 Theme: Dark/Light mode with full integration
⚡ Performance: Optimized rendering, Memory management
🛡️ Security: File validation, Access control
`);

console.log('🚀 Course Content Management JS loaded successfully! All systems operational!');
