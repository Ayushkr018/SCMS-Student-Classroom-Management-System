// Settings & Preferences JavaScript - Complete System Configuration Manager

// Global Variables
let currentSettings = {};
let originalSettings = {};
let hasUnsavedChanges = false;
let profilePhoto = null;
let currentUser = {
    id: 'user-001',
    name: 'Dr. John Doe',
    email: 'john.doe@scms.edu',
    employeeId: 'SCMS2023001',
    department: 'Computer Science',
    designation: 'Associate Professor',
    avatar: 'JD',
    joinDate: '2020-08-15',
    lastLogin: new Date().toISOString()
};

// Default Settings Configuration
const DEFAULT_SETTINGS = {
    // Profile Settings
    profile: {
        fullName: 'Dr. John Doe',
        employeeId: 'SCMS2023001',
        email: 'john.doe@scms.edu',
        phone: '+91 98765 43210',
        department: 'computer-science',
        designation: 'associate-professor',
        officeLocation: 'Block A, Room 301',
        officeHours: 'Mon-Fri 10:00 AM - 4:00 PM',
        bio: 'Associate Professor with 15+ years of experience in Computer Science education and research.',
        profilePhoto: null
    },
    
    // Appearance Settings
    appearance: {
        theme: 'light',
        accentColor: 'green',
        fontSize: 'medium',
        sidebarPosition: 'left',
        compactMode: false,
        enableAnimations: true,
        dashboardLayout: 'grid',
        showBreadcrumbs: true
    },
    
    // Notification Settings
    notifications: {
        academic: {
            enabled: true,
            assignments: { email: true, inapp: true, push: false },
            tests: { email: true, inapp: true, push: false },
            attendance: { email: false, inapp: true, push: false }
        },
        student: {
            enabled: true,
            enrollments: { email: true, inapp: false, push: false },
            performance: { email: true, inapp: true, push: false }
        },
        system: {
            enabled: true,
            updates: { email: true, inapp: true, push: false },
            security: { email: true, inapp: true, push: true }
        },
        schedule: {
            quietHours: false,
            quietStart: '22:00',
            quietEnd: '08:00'
        }
    },
    
    // Privacy Settings
    privacy: {
        profileVisibility: {
            toStudents: true,
            toColleagues: true,
            contactInfo: 'all'
        },
        dataSettings: {
            usageAnalytics: true,
            performanceTracking: true,
            activityHistory: '30'
        },
        communication: {
            studentMessages: true,
            parentCommunication: true
        }
    },
    
    // System Settings
    system: {
        performance: {
            autoSaveFrequency: '60',
            cacheSize: '100',
            imageQuality: 'medium'
        },
        regional: {
            language: 'en',
            timeZone: 'IST',
            dateFormat: 'dd/mm/yyyy',
            timeFormat: '12'
        },
        accessibility: {
            highContrast: false,
            reduceMotion: false,
            screenReader: false
        }
    },
    
    // Integration Settings
    integrations: {
        google: { connected: true, lastSync: '2025-08-16T10:30:00Z' },
        microsoft: { connected: false, lastSync: null },
        zoom: { connected: true, lastSync: '2025-08-15T14:20:00Z' },
        dropbox: { connected: false, lastSync: null },
        slack: { connected: false, lastSync: null },
        github: { connected: true, lastSync: '2025-08-14T16:45:00Z' },
        apiAccess: false,
        apiKey: 'scms_api_key_123456789'
    },
    
    // Backup Settings
    backup: {
        autoBackup: true,
        frequency: 'daily',
        retention: '30',
        items: {
            profile: true,
            courses: true,
            grades: true,
            attendance: true,
            messages: true
        }
    }
};

// Backup History Mock Data
const BACKUP_HISTORY = [
    {
        id: 'backup-001',
        name: 'Daily Backup - August 16, 2025',
        date: '2025-08-16T03:00:00Z',
        size: 156789000,
        status: 'completed',
        type: 'automatic'
    },
    {
        id: 'backup-002',
        name: 'Manual Backup - August 15, 2025',
        date: '2025-08-15T18:45:00Z',
        size: 142356000,
        status: 'completed',
        type: 'manual'
    },
    {
        id: 'backup-003',
        name: 'Daily Backup - August 15, 2025',
        date: '2025-08-15T03:00:00Z',
        size: 145678000,
        status: 'completed',
        type: 'automatic'
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('⚙️ Settings & Preferences Loading...');
    
    // Load settings
    loadSettings();
    
    // Initialize components
    initializeUserInfo();
    initializeTheme();
    initializeMobileControls();
    populateSettingsForms();
    initializeEventListeners();
    loadBackupHistory();
    setupAutoSave();
    
    // Show success notification
    setTimeout(() => {
        showNotification('Settings loaded successfully!', 'success');
        console.log('✅ Settings System Ready!');
    }, 800);
});

// Settings Management
function loadSettings() {
    try {
        // Load from localStorage or use defaults
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            currentSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
        } else {
            currentSettings = { ...DEFAULT_SETTINGS };
        }
        
        // Sync theme with localStorage theme (from other pages)
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            currentSettings.appearance.theme = savedTheme;
        }
        
        // Create backup for change detection
        originalSettings = JSON.parse(JSON.stringify(currentSettings));
        
        console.log('📂 Settings loaded:', currentSettings);
    } catch (error) {
        console.error('❌ Error loading settings:', error);
        currentSettings = { ...DEFAULT_SETTINGS };
        originalSettings = { ...DEFAULT_SETTINGS };
    }
}

function saveSettings() {
    try {
        localStorage.setItem('userSettings', JSON.stringify(currentSettings));
        
        // Also save theme separately for other pages
        localStorage.setItem('theme', currentSettings.appearance.theme);
        
        originalSettings = JSON.parse(JSON.stringify(currentSettings));
        hasUnsavedChanges = false;
        
        // Apply settings immediately
        applySettings();
        
        console.log('💾 Settings saved:', currentSettings);
        return true;
    } catch (error) {
        console.error('❌ Error saving settings:', error);
        showNotification('Failed to save settings', 'error');
        return false;
    }
}

function applySettings() {
    try {
        // Apply theme
        applyThemeSettings();
        
        // Apply appearance settings
        applyAppearanceSettings();
        
        // Apply system settings
        applySystemSettings();
        
        console.log('✅ Settings applied successfully');
    } catch (error) {
        console.error('❌ Error applying settings:', error);
    }
}

function applyThemeSettings() {
    try {
        const theme = currentSettings.appearance.theme;
        const accentColor = currentSettings.appearance.accentColor;
        
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const actualTheme = prefersDark ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', actualTheme);
            localStorage.setItem('theme', actualTheme); // Sync with localStorage
            updateThemeIcons(actualTheme);
        } else {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme); // Sync with localStorage
            updateThemeIcons(theme);
        }
        
        // Apply accent color
        document.documentElement.setAttribute('data-accent-color', accentColor);
        
        console.log('🎨 Theme applied:', theme, accentColor);
    } catch (error) {
        console.error('❌ Error applying theme:', error);
    }
}

function applyAppearanceSettings() {
    try {
        const appearance = currentSettings.appearance;
        
        // Apply font size
        document.documentElement.className = document.documentElement.className
            .replace(/font-size-\w+/g, '') + ` font-size-${appearance.fontSize}`;
        
        // Apply compact mode
        if (appearance.compactMode) {
            document.body.classList.add('compact-mode');
        } else {
            document.body.classList.remove('compact-mode');
        }
        
        // Apply animations setting
        if (!appearance.enableAnimations) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }
        
        console.log('🎨 Appearance settings applied');
    } catch (error) {
        console.error('❌ Error applying appearance settings:', error);
    }
}

function applySystemSettings() {
    try {
        const system = currentSettings.system;
        
        // Apply high contrast
        if (system.accessibility.highContrast) {
            document.documentElement.setAttribute('data-high-contrast', 'true');
        } else {
            document.documentElement.removeAttribute('data-high-contrast');
        }
        
        // Apply reduced motion
        if (system.accessibility.reduceMotion) {
            document.documentElement.setAttribute('data-reduce-motion', 'true');
        } else {
            document.documentElement.removeAttribute('data-reduce-motion');
        }
        
        console.log('🛠️ System settings applied');
    } catch (error) {
        console.error('❌ Error applying system settings:', error);
    }
}

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

// Theme Functions - UPDATED WITH PROPER SYNC
function initializeTheme() {
    try {
        applyThemeSettings();
        
        // Sync sidebar toggle with current theme
        const currentTheme = document.documentElement.getAttribute('data-theme');
        updateThemeIcons(currentTheme);
        
        console.log('🎨 Theme initialized:', currentTheme);
    } catch (error) {
        console.error('❌ Error initializing theme:', error);
    }
}

function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update settings
        currentSettings.appearance.theme = newTheme;
        hasUnsavedChanges = true;
        
        // Apply immediately
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme); // Save to localStorage for other pages
        updateThemeIcons(newTheme);
        
        // Update form radio button in settings
        const themeRadio = document.querySelector(`input[name="theme"][value="${newTheme}"]`);
        if (themeRadio) themeRadio.checked = true;
        
        // Update theme option visual state
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        const activeThemeOption = document.querySelector(`[onclick="setTheme('${newTheme}')"]`);
        if (activeThemeOption) {
            activeThemeOption.closest('.theme-option').classList.add('active');
        }
        
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

// Settings Navigation
function switchSettingsTab(tabName) {
    try {
        // Update tab buttons
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update content panels
        document.querySelectorAll('.settings-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-settings`).classList.add('active');
        
        // Save scroll position for current panel
        saveScrollPosition();
        
        // Restore scroll position for new panel
        setTimeout(() => restoreScrollPosition(tabName), 50);
        
        console.log('🔄 Settings tab switched to:', tabName);
    } catch (error) {
        console.error('❌ Error switching settings tab:', error);
    }
}

function saveScrollPosition() {
    try {
        const activePanel = document.querySelector('.settings-panel.active');
        if (activePanel) {
            const scrollPos = window.scrollY;
            activePanel.setAttribute('data-scroll-pos', scrollPos);
        }
    } catch (error) {
        console.error('❌ Error saving scroll position:', error);
    }
}

function restoreScrollPosition(tabName) {
    try {
        const panel = document.getElementById(`${tabName}-settings`);
        if (panel) {
            const scrollPos = panel.getAttribute('data-scroll-pos') || 0;
            window.scrollTo(0, parseInt(scrollPos));
        }
    } catch (error) {
        console.error('❌ Error restoring scroll position:', error);
    }
}

// Form Population
function populateSettingsForms() {
    try {
        populateProfileForm();
        populateAppearanceForm();
        populateNotificationForm();
        populatePrivacyForm();
        populateSystemForm();
        populateIntegrationForm();
        populateBackupForm();
        
        console.log('📝 Settings forms populated');
    } catch (error) {
        console.error('❌ Error populating settings forms:', error);
    }
}

function populateProfileForm() {
    try {
        const profile = currentSettings.profile;
        
        setFormValue('fullName', profile.fullName);
        setFormValue('employeeId', profile.employeeId);
        setFormValue('emailAddress', profile.email);
        setFormValue('phoneNumber', profile.phone);
        setFormValue('department', profile.department);
        setFormValue('designation', profile.designation);
        setFormValue('officeLocation', profile.officeLocation);
        setFormValue('officeHours', profile.officeHours);
        setFormValue('userBio', profile.bio);
        
        // Update last login time
        const lastLoginEl = document.getElementById('lastLoginTime');
        if (lastLoginEl) {
            lastLoginEl.textContent = formatRelativeTime(new Date(currentUser.lastLogin));
        }
        
        console.log('👤 Profile form populated');
    } catch (error) {
        console.error('❌ Error populating profile form:', error);
    }
}

function populateAppearanceForm() {
    try {
        const appearance = currentSettings.appearance;
        
        // Set theme selection
        const themeRadio = document.querySelector(`input[name="theme"][value="${appearance.theme}"]`);
        if (themeRadio) themeRadio.checked = true;
        
        // Update theme option visual state
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        const activeThemeOption = document.querySelector(`[onclick="setTheme('${appearance.theme}')"]`);
        if (activeThemeOption) {
            activeThemeOption.closest('.theme-option').classList.add('active');
        }
        
        // Set other appearance options
        setFormValue('fontSize', appearance.fontSize);
        setFormValue('sidebarPosition', appearance.sidebarPosition);
        setFormValue('compactMode', appearance.compactMode);
        setFormValue('enableAnimations', appearance.enableAnimations);
        setFormValue('dashboardLayout', appearance.dashboardLayout);
        setFormValue('showBreadcrumbs', appearance.showBreadcrumbs);
        
        // Set accent color
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('active');
        });
        const colorOption = document.querySelector(`[data-color="${appearance.accentColor}"]`);
        if (colorOption) colorOption.classList.add('active');
        
        console.log('🎨 Appearance form populated');
    } catch (error) {
        console.error('❌ Error populating appearance form:', error);
    }
}

function populateNotificationForm() {
    try {
        const notifications = currentSettings.notifications;
        
        // Set main category toggles
        setFormValue('academicNotifications', notifications.academic.enabled);
        setFormValue('studentUpdates', notifications.student.enabled);
        setFormValue('systemNotifications', notifications.system.enabled);
        
        // Set quiet hours
        setFormValue('quietHours', notifications.schedule.quietHours);
        setFormValue('quietStart', notifications.schedule.quietStart);
        setFormValue('quietEnd', notifications.schedule.quietEnd);
        
        // Toggle quiet hours visibility
        const quietHoursRange = document.getElementById('quietHoursRange');
        if (quietHoursRange) {
            quietHoursRange.style.display = notifications.schedule.quietHours ? 'flex' : 'none';
        }
        
        console.log('🔔 Notification form populated');
    } catch (error) {
        console.error('❌ Error populating notification form:', error);
    }
}

function populatePrivacyForm() {
    try {
        const privacy = currentSettings.privacy;
        
        setFormValue('profileToStudents', privacy.profileVisibility.toStudents);
        setFormValue('profileToColleagues', privacy.profileVisibility.toColleagues);
        setFormValue('contactVisibility', privacy.profileVisibility.contactInfo);
        
        setFormValue('usageAnalytics', privacy.dataSettings.usageAnalytics);
        setFormValue('performanceTracking', privacy.dataSettings.performanceTracking);
        setFormValue('activityHistory', privacy.dataSettings.activityHistory);
        
        setFormValue('studentMessages', privacy.communication.studentMessages);
        setFormValue('parentCommunication', privacy.communication.parentCommunication);
        
        console.log('🛡️ Privacy form populated');
    } catch (error) {
        console.error('❌ Error populating privacy form:', error);
    }
}

function populateSystemForm() {
    try {
        const system = currentSettings.system;
        
        setFormValue('autoSaveFrequency', system.performance.autoSaveFrequency);
        setFormValue('cacheSize', system.performance.cacheSize);
        setFormValue('imageQuality', system.performance.imageQuality);
        
        setFormValue('language', system.regional.language);
        setFormValue('timeZone', system.regional.timeZone);
        setFormValue('dateFormat', system.regional.dateFormat);
        setFormValue('timeFormat', system.regional.timeFormat);
        
        setFormValue('highContrast', system.accessibility.highContrast);
        setFormValue('reduceMotion', system.accessibility.reduceMotion);
        setFormValue('screenReader', system.accessibility.screenReader);
        
        console.log('🛠️ System form populated');
    } catch (error) {
        console.error('❌ Error populating system form:', error);
    }
}

function populateIntegrationForm() {
    try {
        const integrations = currentSettings.integrations;
        
        setFormValue('apiAccess', integrations.apiAccess);
        
        // Toggle API key visibility
        const apiKeysSection = document.getElementById('apiKeysSection');
        if (apiKeysSection) {
            apiKeysSection.style.display = integrations.apiAccess ? 'block' : 'none';
        }
        
        // Set API key
        setFormValue('apiKey', integrations.apiKey);
        
        console.log('🔗 Integration form populated');
    } catch (error) {
        console.error('❌ Error populating integration form:', error);
    }
}

function populateBackupForm() {
    try {
        const backup = currentSettings.backup;
        
        setFormValue('autoBackup', backup.autoBackup);
        setFormValue('backupFrequency', backup.frequency);
        setFormValue('retentionPeriod', backup.retention);
        
        setFormValue('backupProfile', backup.items.profile);
        setFormValue('backupCourses', backup.items.courses);
        setFormValue('backupGrades', backup.items.grades);
        setFormValue('backupAttendance', backup.items.attendance);
        setFormValue('backupMessages', backup.items.messages);
        
        console.log('💾 Backup form populated');
    } catch (error) {
        console.error('❌ Error populating backup form:', error);
    }
}

function setFormValue(elementId, value) {
    try {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        if (element.type === 'checkbox') {
            element.checked = value;
        } else if (element.type === 'radio') {
            element.checked = element.value === value;
        } else {
            element.value = value;
        }
    } catch (error) {
        console.error('❌ Error setting form value for:', elementId, error);
    }
}

// Profile Management
function handleProfilePhoto(input) {
    try {
        const file = input.files[0];
        if (!file) return;
        
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Profile photo must be less than 5MB', 'error');
            return;
        }
        
        if (!file.type.startsWith('image/')) {
            showNotification('Please select an image file', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePhoto = e.target.result;
            
            const photoDisplay = document.getElementById('profilePhotoDisplay');
            if (photoDisplay) {
                photoDisplay.innerHTML = `<img src="${profilePhoto}" alt="Profile Photo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            }
            
            hasUnsavedChanges = true;
            showNotification('Profile photo updated. Don\'t forget to save!', 'info');
        };
        
        reader.readAsDataURL(file);
        console.log('📷 Profile photo selected');
    } catch (error) {
        console.error('❌ Error handling profile photo:', error);
        showNotification('Failed to process profile photo', 'error');
    }
}

function removeProfilePhoto() {
    try {
        profilePhoto = null;
        
        const photoDisplay = document.getElementById('profilePhotoDisplay');
        if (photoDisplay) {
            photoDisplay.innerHTML = '<i class="fas fa-user"></i>';
        }
        
        hasUnsavedChanges = true;
        showNotification('Profile photo removed. Don\'t forget to save!', 'info');
        console.log('📷 Profile photo removed');
    } catch (error) {
        console.error('❌ Error removing profile photo:', error);
    }
}

function resetProfileForm() {
    try {
        populateProfileForm();
        removeProfilePhoto();
        showNotification('Profile form reset to saved values', 'info');
        console.log('🔄 Profile form reset');
    } catch (error) {
        console.error('❌ Error resetting profile form:', error);
    }
}

function saveProfile() {
    try {
        // Validate form
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('emailAddress').value.trim();
        
        if (!fullName || !email) {
            showNotification('Full name and email are required', 'error');
            return;
        }
        
        // Update settings
        currentSettings.profile = {
            ...currentSettings.profile,
            fullName: fullName,
            email: email,
            phone: document.getElementById('phoneNumber').value.trim(),
            department: document.getElementById('department').value,
            designation: document.getElementById('designation').value,
            officeLocation: document.getElementById('officeLocation').value.trim(),
            officeHours: document.getElementById('officeHours').value.trim(),
            bio: document.getElementById('userBio').value.trim(),
            profilePhoto: profilePhoto
        };
        
        if (saveSettings()) {
            showNotification('Profile saved successfully!', 'success');
            
            // Update user info in sidebar
            currentUser.name = fullName;
            initializeUserInfo();
        }
        
        console.log('👤 Profile saved');
    } catch (error) {
        console.error('❌ Error saving profile:', error);
        showNotification('Failed to save profile', 'error');
    }
}

// Theme Management - UPDATED
function setTheme(theme) {
    try {
        currentSettings.appearance.theme = theme;
        hasUnsavedChanges = true;
        
        // Apply theme immediately
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme); // Sync with localStorage
        updateThemeIcons(theme);
        
        // Update radio button
        const themeRadio = document.querySelector(`input[name="theme"][value="${theme}"]`);
        if (themeRadio) themeRadio.checked = true;
        
        // Update theme option visual state
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        if (event && event.target) {
            event.target.closest('.theme-option').classList.add('active');
        }
        
        showNotification(`Theme changed to ${theme} mode`, 'success');
        console.log('🎨 Theme set to:', theme);
    } catch (error) {
        console.error('❌ Error setting theme:', error);
    }
}

function setAccentColor(color) {
    try {
        currentSettings.appearance.accentColor = color;
        hasUnsavedChanges = true;
        
        applyThemeSettings();
        
        // Update color option visual state
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('active');
        });
        event.target.closest('.color-option').classList.add('active');
        
        showNotification(`Accent color changed to ${color}`, 'success');
        console.log('🎨 Accent color set to:', color);
    } catch (error) {
        console.error('❌ Error setting accent color:', error);
    }
}

// Security Management
function changePassword() {
    try {
        const modal = document.getElementById('changePasswordModal');
        
        // Reset form
        document.getElementById('changePasswordForm').reset();
        updatePasswordStrength('');
        
        modal.style.display = 'flex';
        console.log('🔐 Change password modal opened');
    } catch (error) {
        console.error('❌ Error opening change password modal:', error);
    }
}

function closePasswordModal() {
    try {
        const modal = document.getElementById('changePasswordModal');
        modal.style.display = 'none';
        console.log('🔐 Change password modal closed');
    } catch (error) {
        console.error('❌ Error closing password modal:', error);
    }
}

function togglePassword(inputId) {
    try {
        const input = document.getElementById(inputId);
        const button = input.parentNode.querySelector('.password-toggle i');
        
        if (input.type === 'password') {
            input.type = 'text';
            button.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            button.className = 'fas fa-eye';
        }
        
        console.log('👁️ Password visibility toggled for:', inputId);
    } catch (error) {
        console.error('❌ Error toggling password visibility:', error);
    }
}

function updatePasswordStrength(password) {
    try {
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        const requirements = document.querySelectorAll('.password-requirements li');
        
        if (!password) {
            strengthBar.className = 'strength-fill';
            strengthText.textContent = 'Enter password';
            requirements.forEach(req => req.classList.remove('valid'));
            return;
        }
        
        let score = 0;
        const checks = {
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        Object.values(checks).forEach(check => {
            if (check) score++;
        });
        
        // Update visual indicators
        requirements[0].classList.toggle('valid', checks.length);
        requirements[1].classList.toggle('valid', checks.upper);
        requirements.classList.toggle('valid', checks.lower);
        requirements.classList.toggle('valid', checks.number);
        requirements.classList.toggle('valid', checks.special);
        
        // Update strength bar
        if (score < 2) {
            strengthBar.className = 'strength-fill weak';
            strengthText.textContent = 'Weak';
        } else if (score < 3) {
            strengthBar.className = 'strength-fill fair';
            strengthText.textContent = 'Fair';
        } else if (score < 5) {
            strengthBar.className = 'strength-fill good';
            strengthText.textContent = 'Good';
        } else {
            strengthBar.className = 'strength-fill strong';
            strengthText.textContent = 'Strong';
        }
        
        console.log('🔐 Password strength updated, score:', score);
    } catch (error) {
        console.error('❌ Error updating password strength:', error);
    }
}

function updatePassword() {
    try {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate inputs
        if (!currentPassword || !newPassword || !confirmPassword) {
            showNotification('All password fields are required', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showNotification('New passwords do not match', 'error');
            return;
        }
        
        if (newPassword.length < 8) {
            showNotification('Password must be at least 8 characters', 'error');
            return;
        }
        
        // Simulate password change
        showNotification('Updating password...', 'info');
        
        setTimeout(() => {
            closePasswordModal();
            showNotification('Password updated successfully!', 'success');
            console.log('🔐 Password updated');
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error updating password:', error);
        showNotification('Failed to update password', 'error');
    }
}

// 2FA Management
function enable2FA() {
    try {
        const modal = document.getElementById('twoFactorModal');
        
        // Reset to first step
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
        document.getElementById('step1').classList.add('active');
        
        modal.style.display = 'flex';
        console.log('🔐 2FA setup modal opened');
    } catch (error) {
        console.error('❌ Error opening 2FA modal:', error);
    }
}

function close2FAModal() {
    try {
        const modal = document.getElementById('twoFactorModal');
        modal.style.display = 'none';
        console.log('🔐 2FA setup modal closed');
    } catch (error) {
        console.error('❌ Error closing 2FA modal:', error);
    }
}

function nextStep(stepNumber) {
    try {
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
        document.getElementById(`step${stepNumber}`).classList.add('active');
        console.log('🔐 2FA step:', stepNumber);
    } catch (error) {
        console.error('❌ Error navigating 2FA steps:', error);
    }
}

function verify2FA() {
    try {
        const verificationCode = document.getElementById('verificationCode').value;
        
        if (!verificationCode || verificationCode.length !== 6) {
            showNotification('Please enter a valid 6-digit code', 'error');
            return;
        }
        
        // Simulate verification
        showNotification('Verifying code...', 'info');
        
        setTimeout(() => {
            // Show backup codes
            document.getElementById('backupCodes').style.display = 'block';
            showNotification('2FA enabled successfully!', 'success');
            
            setTimeout(() => {
                close2FAModal();
            }, 3000);
        }, 1500);
        
        console.log('🔐 2FA verification attempted');
    } catch (error) {
        console.error('❌ Error verifying 2FA:', error);
        showNotification('2FA verification failed', 'error');
    }
}

function viewLoginHistory() {
    try {
        showNotification('Login history would be displayed in a detailed modal', 'info');
        console.log('📊 Login history requested');
    } catch (error) {
        console.error('❌ Error viewing login history:', error);
    }
}

// Integration Management
function connectIntegration(service) {
    try {
        showNotification(`Connecting to ${service.charAt(0).toUpperCase() + service.slice(1)}...`, 'info');
        
        // Simulate connection process
        setTimeout(() => {
            currentSettings.integrations[service] = {
                connected: true,
                lastSync: new Date().toISOString()
            };
            
            updateIntegrationStatus(service, true);
            hasUnsavedChanges = true;
            
            showNotification(`${service.charAt(0).toUpperCase() + service.slice(1)} connected successfully!`, 'success');
        }, 2000);
        
        console.log('🔗 Connecting integration:', service);
    } catch (error) {
        console.error('❌ Error connecting integration:', error);
        showNotification('Failed to connect integration', 'error');
    }
}

function disconnectIntegration(service) {
    try {
        if (confirm(`Are you sure you want to disconnect ${service.charAt(0).toUpperCase() + service.slice(1)}?`)) {
            currentSettings.integrations[service] = {
                connected: false,
                lastSync: null
            };
            
            updateIntegrationStatus(service, false);
            hasUnsavedChanges = true;
            
            showNotification(`${service.charAt(0).toUpperCase() + service.slice(1)} disconnected`, 'info');
        }
        
        console.log('🔗 Disconnecting integration:', service);
    } catch (error) {
        console.error('❌ Error disconnecting integration:', error);
    }
}

function configureIntegration(service) {
    try {
        showNotification(`${service.charAt(0).toUpperCase() + service.slice(1)} configuration panel would open here`, 'info');
        console.log('⚙️ Configuring integration:', service);
    } catch (error) {
        console.error('❌ Error configuring integration:', error);
    }
}

function updateIntegrationStatus(service, connected) {
    try {
        const serviceCard = document.querySelector(`[data-service="${service}"]`) || 
                           document.querySelector('.integration-card').parentNode.querySelector(`[onclick*="${service}"]`).closest('.integration-card');
        
        if (serviceCard) {
            const statusElement = serviceCard.querySelector('.integration-status');
            const actionsElement = serviceCard.querySelector('.integration-actions');
            
            if (connected) {
                statusElement.className = 'integration-status connected';
                statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Connected';
                actionsElement.innerHTML = `
                    <button class="btn btn-secondary" onclick="configureIntegration('${service}')">
                        <i class="fas fa-cog"></i> Configure
                    </button>
                    <button class="btn btn-danger" onclick="disconnectIntegration('${service}')">
                        Disconnect
                    </button>
                `;
            } else {
                statusElement.className = 'integration-status disconnected';
                statusElement.innerHTML = '<i class="fas fa-times-circle"></i> Not Connected';
                actionsElement.innerHTML = `
                    <button class="btn btn-primary" onclick="connectIntegration('${service}')">
                        <i class="fas fa-plug"></i> Connect
                    </button>
                `;
            }
        }
        
        console.log('🔗 Integration status updated:', service, connected);
    } catch (error) {
        console.error('❌ Error updating integration status:', error);
    }
}

function toggleApiKeyVisibility() {
    try {
        const apiKeyInput = document.getElementById('apiKey');
        const toggleButton = document.getElementById('apiKeyToggle');
        
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
            toggleButton.className = 'fas fa-eye-slash';
        } else {
            apiKeyInput.type = 'password';
            toggleButton.className = 'fas fa-eye';
        }
        
        console.log('👁️ API key visibility toggled');
    } catch (error) {
        console.error('❌ Error toggling API key visibility:', error);
    }
}

function regenerateApiKey() {
    try {
        if (confirm('Are you sure you want to regenerate your API key? This will invalidate the current key.')) {
            showNotification('Regenerating API key...', 'info');
            
            setTimeout(() => {
                const newKey = 'scms_api_key_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                document.getElementById('apiKey').value = newKey;
                currentSettings.integrations.apiKey = newKey;
                hasUnsavedChanges = true;
                
                showNotification('API key regenerated successfully!', 'success');
            }, 1500);
        }
        
        console.log('🔑 API key regeneration requested');
    } catch (error) {
        console.error('❌ Error regenerating API key:', error);
    }
}

// Backup Management
function loadBackupHistory() {
    try {
        const container = document.getElementById('backupHistory');
        if (!container) return;
        
        const historyHTML = BACKUP_HISTORY.map(backup => `
            <div class="backup-item-history">
                <div class="backup-item-info">
                    <div class="backup-item-name">${backup.name}</div>
                    <div class="backup-item-date">${formatDate(new Date(backup.date))}</div>
                </div>
                <div class="backup-item-size">${formatFileSize(backup.size)}</div>
                <div class="backup-item-actions">
                    <button class="btn btn-info" onclick="downloadBackup('${backup.id}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="btn btn-danger" onclick="deleteBackup('${backup.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = historyHTML;
        console.log('💾 Backup history loaded');
    } catch (error) {
        console.error('❌ Error loading backup history:', error);
    }
}

function createBackup() {
    try {
        showNotification('Creating backup...', 'info');
        
        // Simulate backup creation
        setTimeout(() => {
            const newBackup = {
                id: 'backup-' + Date.now(),
                name: `Manual Backup - ${new Date().toLocaleDateString()}`,
                date: new Date().toISOString(),
                size: Math.floor(Math.random() * 200000000) + 100000000,
                status: 'completed',
                type: 'manual'
            };
            
            BACKUP_HISTORY.unshift(newBackup);
            loadBackupHistory();
            
            showNotification('Backup created successfully!', 'success');
        }, 3000);
        
        console.log('💾 Backup creation started');
    } catch (error) {
        console.error('❌ Error creating backup:', error);
        showNotification('Failed to create backup', 'error');
    }
}

function downloadBackup(backupId) {
    try {
        const backup = BACKUP_HISTORY.find(b => b.id === backupId);
        if (!backup) {
            showNotification('Backup not found', 'error');
            return;
        }
        
        showNotification(`Downloading ${backup.name}...`, 'info');
        
        // Simulate download
        setTimeout(() => {
            showNotification('Download started!', 'success');
        }, 1000);
        
        console.log('💾 Backup download:', backupId);
    } catch (error) {
        console.error('❌ Error downloading backup:', error);
        showNotification('Failed to download backup', 'error');
    }
}

function deleteBackup(backupId) {
    try {
        const backup = BACKUP_HISTORY.find(b => b.id === backupId);
        if (!backup) return;
        
        if (confirm(`Are you sure you want to delete "${backup.name}"?`)) {
            const index = BACKUP_HISTORY.findIndex(b => b.id === backupId);
            if (index > -1) {
                BACKUP_HISTORY.splice(index, 1);
                loadBackupHistory();
                showNotification('Backup deleted successfully', 'success');
            }
        }
        
        console.log('💾 Backup deletion:', backupId);
    } catch (error) {
        console.error('❌ Error deleting backup:', error);
    }
}

function exportData(format) {
    try {
        showNotification(`Preparing ${format.toUpperCase()} export...`, 'info');
        
        setTimeout(() => {
            showNotification(`${format.toUpperCase()} export download started!`, 'success');
        }, 2000);
        
        console.log('📤 Data export:', format);
    } catch (error) {
        console.error('❌ Error exporting data:', error);
        showNotification('Failed to export data', 'error');
    }
}

// Privacy & Data Management
function downloadData() {
    try {
        showNotification('Preparing your data download...', 'info');
        
        setTimeout(() => {
            showNotification('Data download started! Check your downloads folder.', 'success');
        }, 2000);
        
        console.log('📤 User data download requested');
    } catch (error) {
        console.error('❌ Error downloading user data:', error);
    }
}

function clearActivityHistory() {
    try {
        if (confirm('Are you sure you want to clear your activity history? This action cannot be undone.')) {
            showNotification('Clearing activity history...', 'info');
            
            setTimeout(() => {
                showNotification('Activity history cleared successfully', 'success');
            }, 1500);
        }
        
        console.log('🧹 Activity history clear requested');
    } catch (error) {
        console.error('❌ Error clearing activity history:', error);
    }
}

function deleteAccount() {
    try {
        const confirmText = 'DELETE';
        const userInput = prompt(`Are you absolutely sure you want to delete your account? This action is irreversible.\n\nType "${confirmText}" to confirm:`);
        
        if (userInput === confirmText) {
            showNotification('Account deletion process would be initiated', 'warning');
            console.log('🗑️ Account deletion requested');
        } else if (userInput !== null) {
            showNotification('Account deletion cancelled - incorrect confirmation', 'info');
        }
    } catch (error) {
        console.error('❌ Error processing account deletion:', error);
    }
}

// Settings Actions
function resetSettings() {
    try {
        if (confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
            currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
            populateSettingsForms();
            applySettings();
            
            showNotification('Settings reset to default values', 'success');
            hasUnsavedChanges = true;
        }
        
        console.log('🔄 Settings reset requested');
    } catch (error) {
        console.error('❌ Error resetting settings:', error);
        showNotification('Failed to reset settings', 'error');
    }
}

function exportSettings() {
    try {
        const settingsBlob = new Blob([JSON.stringify(currentSettings, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(settingsBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scms-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Settings exported successfully!', 'success');
        console.log('📤 Settings exported');
    } catch (error) {
        console.error('❌ Error exporting settings:', error);
        showNotification('Failed to export settings', 'error');
    }
}

function saveAllSettings() {
    try {
        // Collect all form data
        collectAllFormData();
        
        if (saveSettings()) {
            showNotification('All settings saved successfully!', 'success');
        }
        
        console.log('💾 All settings saved');
    } catch (error) {
        console.error('❌ Error saving all settings:', error);
        showNotification('Failed to save settings', 'error');
    }
}

function collectAllFormData() {
    try {
        // Collect appearance settings
        const themeRadio = document.querySelector('input[name="theme"]:checked');
        if (themeRadio) currentSettings.appearance.theme = themeRadio.value;
        
        const activeColor = document.querySelector('.color-option.active');
        if (activeColor) currentSettings.appearance.accentColor = activeColor.dataset.color;
        
        collectFormValues('appearance', ['fontSize', 'sidebarPosition', 'compactMode', 'enableAnimations', 'dashboardLayout', 'showBreadcrumbs']);
        
        // Collect notification settings
        collectFormValues('notifications.academic', ['enabled:academicNotifications']);
        collectFormValues('notifications.student', ['enabled:studentUpdates']);
        collectFormValues('notifications.system', ['enabled:systemNotifications']);
        collectFormValues('notifications.schedule', ['quietHours', 'quietStart', 'quietEnd']);
        
        // Collect privacy settings
        collectFormValues('privacy.profileVisibility', ['toStudents:profileToStudents', 'toColleagues:profileToColleagues', 'contactInfo:contactVisibility']);
        collectFormValues('privacy.dataSettings', ['usageAnalytics', 'performanceTracking', 'activityHistory']);
        collectFormValues('privacy.communication', ['studentMessages', 'parentCommunication']);
        
        // Collect system settings
        collectFormValues('system.performance', ['autoSaveFrequency', 'cacheSize', 'imageQuality']);
        collectFormValues('system.regional', ['language', 'timeZone', 'dateFormat', 'timeFormat']);
        collectFormValues('system.accessibility', ['highContrast', 'reduceMotion', 'screenReader']);
        
        // Collect integration settings
        collectFormValues('integrations', ['apiAccess']);
        
        // Collect backup settings
        collectFormValues('backup', ['autoBackup', 'frequency:backupFrequency', 'retention:retentionPeriod']);
        collectFormValues('backup.items', ['profile:backupProfile', 'courses:backupCourses', 'grades:backupGrades', 'attendance:backupAttendance', 'messages:backupMessages']);
        
        console.log('📝 All form data collected');
    } catch (error) {
        console.error('❌ Error collecting form data:', error);
    }
}

function collectFormValues(settingsPath, fields) {
    try {
        const pathParts = settingsPath.split('.');
        let target = currentSettings;
        
        // Navigate to the correct nested object
        for (const part of pathParts) {
            if (!target[part]) target[part] = {};
            target = target[part];
        }
        
        // Collect field values
        fields.forEach(field => {
            const [targetField, elementId] = field.includes(':') ? field.split(':') : [field, field];
            const element = document.getElementById(elementId);
            
            if (element) {
                if (element.type === 'checkbox') {
                    target[targetField] = element.checked;
                } else {
                    target[targetField] = element.value;
                }
            }
        });
    } catch (error) {
        console.error('❌ Error collecting form values for:', settingsPath, error);
    }
}

// Auto-save functionality
function setupAutoSave() {
    try {
        // Monitor form changes
        document.addEventListener('change', function(e) {
            if (e.target.matches('input, select, textarea')) {
                hasUnsavedChanges = true;
                debouncedAutoSave();
            }
        });
        
        // Monitor before page unload
        window.addEventListener('beforeunload', function(e) {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                return e.returnValue;
            }
        });
        
        console.log('💾 Auto-save setup completed');
    } catch (error) {
        console.error('❌ Error setting up auto-save:', error);
    }
}

// Debounced auto-save function
const debouncedAutoSave = debounce(function() {
    try {
        if (hasUnsavedChanges && currentSettings.system.performance.autoSaveFrequency !== '0') {
            collectAllFormData();
            if (saveSettings()) {
                console.log('💾 Auto-saved settings');
            }
        }
    } catch (error) {
        console.error('❌ Error in auto-save:', error);
    }
}, parseInt(currentSettings.system?.performance?.autoSaveFrequency || '60') * 1000);

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
        
        // Password strength monitoring
        const newPasswordInput = document.getElementById('newPassword');
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', function() {
                updatePasswordStrength(this.value);
            });
        }
        
        // Quiet hours toggle
        const quietHoursCheckbox = document.getElementById('quietHours');
        if (quietHoursCheckbox) {
            quietHoursCheckbox.addEventListener('change', function() {
                const quietHoursRange = document.getElementById('quietHoursRange');
                if (quietHoursRange) {
                    quietHoursRange.style.display = this.checked ? 'flex' : 'none';
                }
            });
        }
        
        // API access toggle
        const apiAccessCheckbox = document.getElementById('apiAccess');
        if (apiAccessCheckbox) {
            apiAccessCheckbox.addEventListener('change', function() {
                const apiKeysSection = document.getElementById('apiKeysSection');
                if (apiKeysSection) {
                    apiKeysSection.style.display = this.checked ? 'block' : 'none';
                }
            });
        }
        
        // Auto-detect system theme preference
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', function(e) {
                if (currentSettings.appearance.theme === 'auto') {
                    applyThemeSettings();
                }
            });
        }
        
        console.log('🎛️ Event listeners initialized');
    } catch (error) {
        console.error('❌ Error initializing event listeners:', error);
    }
}

// Utility Functions
function formatFileSize(bytes) {
    if (!bytes) return '0 B';
    
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
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

// Global Functions (called from HTML)
function logout() {
    try {
        if (hasUnsavedChanges) {
            if (!confirm('You have unsaved changes. Are you sure you want to logout?')) {
                return;
            }
        }
        
        if (confirm('Are you sure you want to logout?')) {
            showNotification('Logging out...', 'info');
            
            // Clear any stored data except settings
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
        currentSettings,
        saveSettings,
        showNotification,
        formatDate,
        formatFileSize
    };
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('💥 Global error caught:', e.error);
    showNotification('An unexpected error occurred', 'error');
});

// Performance monitoring
if (typeof PerformanceObserver !== 'undefined') {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.duration > 100) {
                console.warn('⚠️ Slow operation detected:', entry.name, entry.duration + 'ms');
            }
        }
    });
    perfObserver.observe({ entryTypes: ['measure'] });
}

// Settings validation
function validateSettings(settings) {
    try {
        // Validate required fields
        if (!settings.profile.fullName || !settings.profile.email) {
            return { valid: false, error: 'Profile name and email are required' };
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(settings.profile.email)) {
            return { valid: false, error: 'Invalid email format' };
        }
        
        // Validate backup retention period
        const retention = parseInt(settings.backup.retention);
        if (retention < 7 || retention > 365) {
            return { valid: false, error: 'Backup retention must be between 7 and 365 days' };
        }
        
        return { valid: true };
    } catch (error) {
        console.error('❌ Error validating settings:', error);
        return { valid: false, error: 'Settings validation failed' };
    }
}

// Print debug info
console.log(`
⚙️ Settings & Preferences System v3.0 - UPDATED WITH THEME SYNC
👤 Profile: Photo upload, Contact info, Security settings
🎨 Appearance: Theme system, Color customization, Layout options
🔔 Notifications: Granular controls, Quiet hours, Multi-channel
🛡️ Privacy: Visibility controls, Data preferences, Communication settings
🛠️ System: Performance settings, Regional options, Accessibility
🔗 Integrations: Service connections, API management
💾 Backup: Auto backup, Export options, History management
🔐 Security: Password change, 2FA setup, Login monitoring
📱 Mobile: Touch-friendly, Responsive interface
🌙 Theme: Complete dark/light mode integration with proper sync
💾 Auto-save: Real-time saving, Change detection
⚡ Performance: Optimized operations, Memory management
`);

console.log('🚀 Settings & Preferences JS loaded successfully! Theme sync fixed! All systems operational!');
