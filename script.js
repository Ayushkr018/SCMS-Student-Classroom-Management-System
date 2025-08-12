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

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    animateNumbers();
    animateAboutStats();
    initializeInteractiveElements();
    initializeChatBubble();
});

function fillCredentials(email, password, role) {
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = password;
    document.getElementById('loginRole').value = role;
    showNotification('Credentials filled! Click Sign In to continue.', 'info');
}

function toggleMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.toggle('show');
}

function closeMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.remove('show');
}

function selectRole(role) {
    document.getElementById('loginRole').value = role;
    openLoginModal();
}

function openLoginModal() {
    closeSignupModal();
    closeContactModal();
    document.getElementById('loginModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function openSignupModal() {
    closeLoginModal();
    closeContactModal();
    document.getElementById('signupModal').classList.add('show');
    document.body.style.overflow = 'hidden';
    showNotification('Signup is currently disabled. Use demo credentials to login.', 'warning');
}

function closeSignupModal() {
    document.getElementById('signupModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function openContactModal(type = 'general') {
    closeLoginModal();
    closeSignupModal();
    document.getElementById('contactModal').classList.add('show');
    document.body.style.overflow = 'hidden';
    
    if (type === 'support') {
        document.getElementById('contactSubject').value = 'technical';
    }
}

function closeContactModal() {
    document.getElementById('contactModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function switchToSignup() {
    closeLoginModal();
    setTimeout(() => openSignupModal(), 300);
}

function switchToLogin() {
    closeSignupModal();
    setTimeout(() => openLoginModal(), 300);
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    const demoCredential = DEMO_CREDENTIALS[role];
    
    if (demoCredential && 
        email === demoCredential.email && 
        password === demoCredential.password) {
        
        showNotification('Login successful! Redirecting...', 'success');
        
        localStorage.setItem('scms_current_user', JSON.stringify(demoCredential.user));
        
        setTimeout(() => {
            redirectToDashboard(role);
        }, 2000);
    } else {
        showNotification('Invalid credentials. Please use the demo credentials provided above.', 'error');
    }
}

function quickDemo(role) {
    const demoCredential = DEMO_CREDENTIALS[role];
    
    showNotification(`Accessing ${role} demo...`, 'info');
    
    localStorage.setItem('scms_current_user', JSON.stringify(demoCredential.user));
    
    setTimeout(() => {
        redirectToDashboard(role);
    }, 1500);
}

function redirectToDashboard(role) {
    const dashboards = {
        admin: 'admin/dashboard.html',
        teacher: 'teacher/dashboard.html',
        student: 'student/dashboard.html'
    };
    window.location.href = dashboards[role] || '#';
}

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

function animateAboutStats() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.about-stat-number');
                statNumbers.forEach(num => {
                    const text = num.textContent;
                    let target = 0;
                    let suffix = '';
                    
                    if (text.includes('+')) {
                        target = parseInt(text.replace(/\D/g, ''));
                        suffix = '+';
                    } else if (text.includes('%')) {
                        target = parseFloat(text.replace('%', ''));
                        suffix = '%';
                    } else if (text.includes('K+')) {
                        target = parseInt(text.replace(/\D/g, ''));
                        suffix = 'K+';
                    }
                    
                    let current = 0;
                    const increment = target / 30;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        
                        if (suffix === 'K+') {
                            num.textContent = Math.floor(current) + 'K+';
                        } else if (suffix === '%') {
                            num.textContent = current.toFixed(1) + '%';
                        } else {
                            num.textContent = Math.floor(current) + suffix;
                        }
                    }, 60);
                });
                observer.unobserve(entry.target);
            }
        });
    });

    const aboutStats = document.querySelector('.about-stats');
    if (aboutStats) {
        observer.observe(aboutStats);
    }
}

function searchHelp() {
    const searchInput = document.getElementById('helpSearchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        showNotification('Please enter a search term', 'warning');
        return;
    }
    
    showNotification(`Searching for "${searchTerm}"... This feature will be implemented with backend integration.`, 'info');
    
    setTimeout(() => {
        showNotification(`Found 5 articles related to "${searchTerm}"`, 'success');
    }, 1500);
}

function handleContactForm(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
    };
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    const submitBtn = event.target.querySelector('.modal-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        event.target.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        closeContactModal();
        showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
    }, 2000);
}

function openSocialLink(platform) {
    const socialLinks = {
        twitter: 'https://twitter.com/scmseducation',
        linkedin: 'https://linkedin.com/company/scms-education',
        facebook: 'https://facebook.com/scmsplatform',
        youtube: 'https://youtube.com/c/scmstutorials'
    };
    
    if (socialLinks[platform]) {
        window.open(socialLinks[platform], '_blank');
    }
}

function initializeChatBubble() {
    const chatBadge = document.getElementById('chatBadge');
    if (chatBadge) {
        setTimeout(() => {
            chatBadge.style.display = 'flex';
        }, 3000);
    }
}

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    const chatBadge = document.getElementById('chatBadge');
    
    if (chatWindow.classList.contains('show')) {
        closeChat();
    } else {
        openChat();
    }
    
    if (chatBadge) {
        chatBadge.style.display = 'none';
    }
}

function openChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.add('show');
}

function closeChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.remove('show');
}

function openLiveChat() {
    openChat();
    const chatBadge = document.getElementById('chatBadge');
    if (chatBadge) {
        chatBadge.style.display = 'none';
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    const messagesContainer = document.getElementById('chatMessages');
    
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user';
    userMessage.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
            <span class="message-time">Just now</span>
        </div>
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
    `;
    
    messagesContainer.appendChild(userMessage);
    input.value = '';
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    setTimeout(() => {
        const botResponse = document.createElement('div');
        botResponse.className = 'chat-message bot';
        
        const responses = [
            "Thank you for your message! A support agent will be with you shortly.",
            "I understand your concern. Let me connect you with our technical team.",
            "That's a great question! Our support team will provide detailed assistance.",
            "I'm here to help! Can you provide more details about the issue?"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        botResponse.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${randomResponse}</p>
                <span class="message-time">Just now</span>
            </div>
        `;
        
        messagesContainer.appendChild(botResponse);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId.replace('#', ''));
    if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        smoothScrollTo(targetId);
    });
});

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

const contactModal = document.getElementById('contactModal');
if (contactModal) {
    contactModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeContactModal();
        }
    });
}

document.addEventListener('click', function(e) {
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    
    if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileNav.classList.remove('show');
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLoginModal();
        closeSignupModal();
        closeContactModal();
        closeMobileNav();
        closeChat();
    }
    
    if (e.key === 'Enter' && e.target.classList.contains('contact-submit-btn')) {
        e.target.click();
    }
});

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showLoading(element, text = 'Loading...') {
    const originalContent = element.innerHTML;
    element.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    element.disabled = true;
    return originalContent;
}

function hideLoading(element, originalContent) {
    element.innerHTML = originalContent;
    element.disabled = false;
}

function safeElementOperation(elementId, operation) {
    const element = document.getElementById(elementId);
    if (element) {
        operation(element);
    } else {
        console.warn(`Element with ID '${elementId}' not found`);
    }
}

function initializeInteractiveElements() {
    const cards = document.querySelectorAll('.feature-card, .role-card, .about-card, .help-category, .contact-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    const focusableElements = document.querySelectorAll('button, input, select, textarea, a[href]');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--accent-blue)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}
