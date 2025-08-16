// Advanced Proctoring Features
class TestProctor {
    constructor() {
        this.faceDetectionActive = false;
        this.suspiciousActivity = 0;
        this.lastFaceDetection = Date.now();
    }

    init() {
        this.setupFaceDetection();
        this.monitorMouseMovement();
        this.trackUserActivity();
    }

    setupFaceDetection() {
        // Basic face detection using video stream
        const video = document.getElementById('cameraStream');

        setInterval(() => {
            this.checkFacePresence(video);
        }, 5000); // Check every 5 seconds
    }

    checkFacePresence(video) {
        // Simple implementation - in production, use face-api.js or similar
        if (video && video.videoWidth > 0) {
            this.lastFaceDetection = Date.now();
        } else {
            const timeSinceLastDetection = Date.now() - this.lastFaceDetection;
            if (timeSinceLastDetection > 30000) { // 30 seconds
                this.flagSuspiciousActivity('No face detected for 30 seconds');
            }
        }
    }

    monitorMouseMovement() {
        let inactivityTimer;
        let lastActivity = Date.now();

        document.addEventListener('mousemove', () => {
            lastActivity = Date.now();
            clearTimeout(inactivityTimer);

            inactivityTimer = setTimeout(() => {
                if (Date.now() - lastActivity > 300000) { // 5 minutes
                    this.flagSuspiciousActivity('No mouse activity for 5 minutes');
                }
            }, 300000);
        });
    }

    trackUserActivity() {
        // Track various user activities
        let clickCount = 0;
        let keyCount = 0;

        document.addEventListener('click', () => {
            clickCount++;
        });

        document.addEventListener('keydown', () => {
            keyCount++;
        });

        // Check activity levels every minute
        setInterval(() => {
            if (clickCount === 0 && keyCount === 0) {
                this.flagSuspiciousActivity('No user activity detected');
            }
            clickCount = 0;
            keyCount = 0;
        }, 60000);
    }

    flagSuspiciousActivity(reason) {
        this.suspiciousActivity++;
        testState.violations.push({
            time: new Date().toLocaleTimeString(),
            message: reason,
            severity: 'medium'
        });

        showWarning(reason);

        // Auto-submit if too many violations
        if (this.suspiciousActivity >= 5) {
            showWarning('Too many security violations. Test will be submitted automatically.');
            setTimeout(() => {
                autoSubmitTest();
            }, 3000);
        }
    }
}

// Initialize proctor when test starts
let proctor = new TestProctor();

// Enhanced security measures
function enableAdvancedSecurity() {
    proctor.init();

    // Disable text selection
    document.onselectstart = () => false;
    document.ondragstart = () => false;

    // Monitor for developer tools
    let devtools = { open: false };
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 ||
            window.outerWidth - window.innerWidth > 200) {
            if (!devtools.open) {
                devtools.open = true;
                showWarning('Developer tools detected');
            }
        } else {
            devtools.open = false;
        }
    }, 500);

    // Disable common keyboard combinations
    document.addEventListener('keydown', function (e) {
        // Additional key combinations
        if (e.altKey && e.keyCode === 115 || // Alt+F4
            e.ctrlKey && e.keyCode === 87 ||  // Ctrl+W
            e.ctrlKey && e.keyCode === 82 ||  // Ctrl+R
            e.keyCode === 116) {              // F5
            e.preventDefault();
            showWarning('Key combination blocked');
            return false;
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enableAdvancedSecurity);
} else {
    enableAdvancedSecurity();
}
