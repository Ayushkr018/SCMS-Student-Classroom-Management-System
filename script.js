// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('scms-theme') || 'light';
    const themeIcon = document.getElementById('themeIcon');
    const mobileThemeIcon = document.getElementById('mobileThemeIcon');
    const toggleSwitch = document.getElementById('toggleSwitch');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        mobileThemeIcon.className = 'fas fa-sun';
        toggleSwitch.className = 'fas fa-toggle-on';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon';
        mobileThemeIcon.className = 'fas fa-moon';
        toggleSwitch.className = 'fas fa-toggle-off';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeIcon = document.getElementById('themeIcon');
    const mobileThemeIcon = document.getElementById('mobileThemeIcon');
    const toggleSwitch = document.getElementById('toggleSwitch');
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('scms-theme', 'light');
        themeIcon.className = 'fas fa-moon';
        mobileThemeIcon.className = 'fas fa-moon';
        toggleSwitch.className = 'fas fa-toggle-off';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('scms-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        mobileThemeIcon.className = 'fas fa-sun';
        toggleSwitch.className = 'fas fa-toggle-on';
    }
}

// Demo users with specific credentials
const DEMO_CREDENTIALS = {
    admin: {
        email: 'admin@scms.edu',
        password: 'admin123',
        user: {
            id: 'admin_001',
            name: 'Dr. Sarah Johnson',
            email: 'admin@scms.edu',
            role: 'admin'
        }
    },
    teacher: {
        email: 'teacher@scms.edu',
        password: 'teacher123',
        user: {
            id: 'teacher_001',
            name: 'Prof. Michael Chen',
            email: 'teacher@scms.edu',
            role: 'teacher',
            department: 'Computer Science'
        }
    },
    student: {
        email: 'student@scms.edu',
        password: 'student123',
        user: {
            id: 'student_001',
            name: 'Raj Kumar',
            email: 'student@scms.edu',
            role: 'student',
            rollNumber: 'CS2023001'
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    animateNumbers();
});

// Fill credentials function
function fillCredentials(email, password, role) {
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = password;
    document.getElementById('loginRole').value = role;
    showNotification('Credentials filled! Click Sign In to continue.', 'info');
}

// Mobile navigation functions
function toggleMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.toggle('show');
}

function closeMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.remove('show');
}

// Select role function
function selectRole(role) {
    document.getElementById('loginRole').value = role;
    openLoginModal();
}

// Modal functions
function openLoginModal() {
    closeSignupModal();
    document.getElementById('loginModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function openSignupModal() {
    closeLoginModal();
    document.getElementById('signupModal').classList.add('show');
    document.body.style.overflow = 'hidden';
    showNotification('Signup is currently disabled. Use demo credentials to login.', 'warning');
}

function closeSignupModal() {
    document.getElementById('signupModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Switch between modals
function switchToSignup() {
    closeLoginModal();
    setTimeout(() => openSignupModal(), 300);
}

function switchToLogin() {
    closeSignupModal();
    setTimeout(() => openLoginModal(), 300);
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    // Check against demo credentials
    const demoCredential = DEMO_CREDENTIALS[role];
    
    if (demoCredential && 
        email === demoCredential.email && 
        password === demoCredential.password) {
        
        showNotification('Login successful! Redirecting...', 'success');
        
        // Store user session
        localStorage.setItem('scms_current_user', JSON.stringify(demoCredential.user));
        
        setTimeout(() => {
            redirectToDashboard(role);
        }, 2000);
    } else {
        showNotification('Invalid credentials. Please use the demo credentials provided above.', 'error');
    }
}

// Quick demo access
function quickDemo(role) {
    const demoCredential = DEMO_CREDENTIALS[role];
    
    showNotification(`Accessing ${role} demo...`, 'info');
    
    localStorage.setItem('scms_current_user', JSON.stringify(demoCredential.user));
    
    setTimeout(() => {
        redirectToDashboard(role);
    }, 1500);
}

// Redirect to dashboard
function redirectToDashboard(role) {
    const dashboards = {
        admin: 'admin/dashboard.html',
        teacher: 'teacher/dashboard.html',
        student: 'student/dashboard.html'
    };
    window.location.href = dashboards[role] || '#';
}

// Show notification
function showNotification(message, type) {
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };

    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        ${message}
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Animate numbers
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');
    numbers.forEach(num => {
        const text = num.textContent;
        let target = 0;
        let suffix = '';
        
        if (text.includes('+')) {
            target = parseInt(text.replace(/\D/g, ''));
            suffix = text.includes(',') ? ',000+' : '+';
        } else if (text.includes('%')) {
            target = parseFloat(text.replace('%', ''));
            suffix = '%';
        } else if (text.includes('/')) {
            num.textContent = text;
            return;
        }
        
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (suffix.includes(',')) {
                num.textContent = Math.floor(current).toLocaleString() + '+';
            } else {
                num.textContent = (suffix === '%' ? current.toFixed(1) : Math.floor(current)) + suffix;
            }
        }, 40);
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Close modals when clicking outside
document.getElementById('loginModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeLoginModal();
    }
});

document.getElementById('signupModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeSignupModal();
    }
});

// Close mobile nav when clicking outside
document.addEventListener('click', function(e) {
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    
    if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileNav.classList.remove('show');
    }
});
