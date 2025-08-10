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

// Load current user
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadCurrentUser();
    loadSettingsData();
    startRealTimeMonitoring();
    
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

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.settings-section');
    sections.forEach(section => section.classList.remove('active'));

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update navigation
    const navLinks = document.querySelectorAll('.settings-nav a');
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');

    // Close mobile sidebar after selection
    if (window.innerWidth <= 768) {
        closeMobileSidebar();
    }
}

function loadSettingsData() {
    // Load settings from localStorage or set defaults
    const savedSettings = localStorage.getItem('scms_settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        // Apply saved settings to form elements
        Object.keys(settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = settings[key];
                } else {
                    element.value = settings[key];
                }
            }
        });
    }
}

function saveAllSettings() {
    const settings = {};
    
    // Collect all form inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.id) {
            if (input.type === 'checkbox') {
                settings[input.id] = input.checked;
            } else {
                settings[input.id] = input.value;
            }
        }
    });

    // Save to localStorage
    localStorage.setItem('scms_settings', JSON.stringify(settings));
    
    showNotification('All settings saved successfully!', 'success');
}

function backupSystem() {
    showNotification('Creating system backup...', 'info');
    
    // Simulate backup process
    setTimeout(() => {
        const backupItem = document.createElement('div');
        backupItem.className = 'backup-item';
        backupItem.innerHTML = `
            <div class="backup-info">
                <div class="backup-icon">
                    <i class="fas fa-database"></i>
                </div>
                <div>
                    <h4>Manual System Backup</h4>
                    <p>${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}</p>
                </div>
            </div>
            <div>
                <span style="color: var(--accent-green); font-weight: 600;">${(Math.random() * 1 + 2).toFixed(1)} GB</span>
                <button class="btn btn-primary" style="margin-left: 10px; padding: 5px 10px; font-size: 0.8rem;">
                    <i class="fas fa-download"></i>
                    Download
                </button>
            </div>
        `;
        
        const backupList = document.getElementById('backupList');
        backupList.insertBefore(backupItem, backupList.firstChild);
        
        showNotification('System backup completed successfully!', 'success');
    }, 3000);
}

function createBackup() {
    backupSystem();
}

function restoreBackup() {
    if (confirm('Are you sure you want to restore from backup? This will overwrite current data.')) {
        showNotification('Restoring from backup...', 'info');
        
        setTimeout(() => {
            showNotification('System restored successfully!', 'success');
        }, 4000);
    }
}

function runDiagnostics() {
    showNotification('Running system diagnostics...', 'info');
    
    setTimeout(() => {
        showNotification('System diagnostics completed - All systems healthy', 'success');
        
        // Add a new log entry
        addLogEntry('success', 'System diagnostics completed - All components functioning normally');
    }, 3000);
}

function optimizeSystem() {
    showNotification('Optimizing system performance...', 'info');
    
    setTimeout(() => {
        // Update progress bars with better values
        const cpuProgress = document.getElementById('cpuProgress');
        const cpuUsage = document.getElementById('cpuUsage');
        
        if (cpuProgress && cpuUsage) {
            cpuProgress.style.width = '25%';
            cpuUsage.textContent = '25%';
        }
        
        showNotification('System optimization completed!', 'success');
        addLogEntry('success', 'System optimization completed - Performance improved');
    }, 4000);
}

function filterLogs() {
    const level = document.getElementById('logLevel').value;
    const logEntries = document.querySelectorAll('.log-entry');
    
    logEntries.forEach(entry => {
        if (level === 'all' || entry.classList.contains(level)) {
            entry.style.display = 'block';
        } else {
            entry.style.display = 'none';
        }
    });
    
    showNotification(`Logs filtered by: ${level}`, 'info');
}

function exportLogs() {
    showNotification('Exporting system logs...', 'info');
    
    setTimeout(() => {
        showNotification('Logs exported successfully!', 'success');
    }, 2000);
}

function addLogEntry(level, message) {
    const logsList = document.getElementById('logsList');
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${level}`;
    
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    
    logEntry.innerHTML = `
        <div class="log-header">
            <span class="log-level ${level}">${level.charAt(0).toUpperCase() + level.slice(1)}</span>
            <span class="log-time">${timestamp}</span>
        </div>
        <p>${message}</p>
    `;
    
    logsList.insertBefore(logEntry, logsList.firstChild);
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

// Auto-save settings when changed
document.addEventListener('change', function(e) {
    if (e.target.closest('.settings-section')) {
        // Auto-save individual settings
        setTimeout(() => {
            const setting = e.target.id;
            const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            
            let savedSettings = JSON.parse(localStorage.getItem('scms_settings') || '{}');
            savedSettings[setting] = value;
            localStorage.setItem('scms_settings', JSON.stringify(savedSettings));
            
            // Show subtle save indication
            e.target.style.borderColor = 'var(--accent-green)';
            setTimeout(() => {
                e.target.style.borderColor = '';
            }, 1000);
        }, 500);
    }
});

// Real-time system monitoring
function startRealTimeMonitoring() {
    setInterval(() => {
        // Random CPU usage updates
        const cpuProgress = document.getElementById('cpuProgress');
        const cpuUsage = document.getElementById('cpuUsage');
        
        if (cpuProgress && cpuUsage) {
            const randomCPU = Math.floor(Math.random() * 20) + 35; // 35-55%
            cpuProgress.style.width = randomCPU + '%';
            cpuUsage.textContent = randomCPU + '%';
        }
        
        // Occasionally add new log entries
        if (Math.random() > 0.9) {
            const logTypes = ['info', 'success', 'warning'];
            const messages = [
                'Scheduled task completed successfully',
                'User authentication successful',
                'Database connection established',
                'Cache cleared automatically',
                'Resource status updated'
            ];
            
            const randomType = logTypes[Math.floor(Math.random() * logTypes.length)];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            
            addLogEntry(randomType, randomMessage);
        }
    }, 15000);
}

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
