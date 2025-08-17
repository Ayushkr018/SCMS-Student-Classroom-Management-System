console.log('🎨 Whiteboard JS loading...');

// Whiteboard State
let whiteboardState = {
    canvas: null,
    ctx: null,
    isDrawing: false,
    currentTool: 'pen',
    currentColor: '#2563eb',
    lineWidth: 3,
    lastX: 0,
    lastY: 0,
    textMode: false,
    textInput: null,
    virtualKeyboard: null,
    keyboardOpen: false,
    drawingHistory: [],
    historyStep: -1,
    currentTextPosition: { x: 0, y: 0 },
    currentTextContent: '',
    keyboardShortcutsEnabled: true
};

// Initialize Whiteboard
function initializeWhiteboard() {
    whiteboardState.canvas = document.getElementById('whiteboard');
    if (!whiteboardState.canvas) return;
    
    whiteboardState.ctx = whiteboardState.canvas.getContext('2d');
    
    setupCanvasSize();
    setupCanvasEvents();
    setupWhiteboardStyles();
    setupToolEvents();
    
    // Set initial tool
    selectTool('pen');
    
    // Save initial blank state
    saveDrawingState();
    
    console.log('🎨 Whiteboard initialized');
}

// Setup Canvas Size
function setupCanvasSize() {
    function resizeCanvas() {
        const container = whiteboardState.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        const header = container.querySelector('.whiteboard-header');
        const headerHeight = header ? header.offsetHeight : 60;
        
        // Save current drawing
        let imageData = null;
        if (whiteboardState.canvas.width > 0 && whiteboardState.canvas.height > 0) {
            try {
                imageData = whiteboardState.ctx.getImageData(0, 0, whiteboardState.canvas.width, whiteboardState.canvas.height);
            } catch (e) {
                console.log('Could not save canvas data during resize');
            }
        }
        
        // Set new dimensions
        whiteboardState.canvas.width = Math.max(800, rect.width - 2);
        whiteboardState.canvas.height = Math.max(400, rect.height - headerHeight - 2);
        
        // Restore drawing if it existed
        if (imageData) {
            try {
                whiteboardState.ctx.putImageData(imageData, 0, 0);
            } catch (e) {
                console.log('Could not restore canvas data during resize');
            }
        }
        
        // Reset context properties
        whiteboardState.ctx.lineCap = 'round';
        whiteboardState.ctx.lineJoin = 'round';
        whiteboardState.ctx.imageSmoothingEnabled = true;
    }
    
    // Initial resize
    setTimeout(resizeCanvas, 100);
    
    // Resize on window change
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 250);
    });
}

// Setup Canvas Events
function setupCanvasEvents() {
    const canvas = whiteboardState.canvas;
    
    // Mouse events
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseout', handleEnd);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);
    
    // Click event for text tool
    canvas.addEventListener('click', handleCanvasClick);
    
    // Context menu disable
    canvas.addEventListener('contextmenu', e => e.preventDefault());
}

// Setup Tool Events
function setupToolEvents() {
    // Color picker change
    const colorPicker = document.getElementById('colorPicker');
    if (colorPicker) {
        colorPicker.addEventListener('change', changeColor);
        colorPicker.addEventListener('input', changeColor); // Real-time color change
    }
    
    // Tool button events (setup in room.js, but we ensure they work)
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-tool]')) {
            const tool = e.target.dataset.tool;
            selectTool(tool);
        }
    });
}

// Handle Start Drawing
function handleStart(e) {
    if (whiteboardState.textMode || whiteboardState.keyboardOpen) return;
    
    whiteboardState.isDrawing = true;
    const coords = getCoordinates(e);
    whiteboardState.lastX = coords.x;
    whiteboardState.lastY = coords.y;
    
    // Start new path for smoother drawing
    whiteboardState.ctx.beginPath();
    whiteboardState.ctx.moveTo(coords.x, coords.y);
}

// Handle Drawing Movement
function handleMove(e) {
    if (!whiteboardState.isDrawing || whiteboardState.textMode || whiteboardState.keyboardOpen) return;
    
    const coords = getCoordinates(e);
    draw(whiteboardState.lastX, whiteboardState.lastY, coords.x, coords.y);
    
    whiteboardState.lastX = coords.x;
    whiteboardState.lastY = coords.y;
}

// Handle End Drawing
function handleEnd(e) {
    if (whiteboardState.isDrawing) {
        whiteboardState.isDrawing = false;
        saveDrawingState(); // Save after drawing is complete
    }
}

// Get Coordinates (works for both mouse and touch)
function getCoordinates(e) {
    const rect = whiteboardState.canvas.getBoundingClientRect();
    const scaleX = whiteboardState.canvas.width / rect.width;
    const scaleY = whiteboardState.canvas.height / rect.height;
    
    let clientX, clientY;
    
    if (e.touches && e.touches[0]) {
        clientX = e.touches.clientX;
        clientY = e.touches.clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

// Handle Touch Events
function handleTouchStart(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        whiteboardState.canvas.dispatchEvent(mouseEvent);
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        whiteboardState.canvas.dispatchEvent(mouseEvent);
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    whiteboardState.canvas.dispatchEvent(mouseEvent);
}

// Handle Canvas Click for Text Tool
function handleCanvasClick(e) {
    if (whiteboardState.currentTool !== 'text') return;
    if (whiteboardState.keyboardOpen) return; // Don't open multiple keyboards
    
    const coords = getCoordinates(e);
    openVirtualKeyboard(coords.x, coords.y);
}

// Draw Function
function draw(x1, y1, x2, y2) {
    const ctx = whiteboardState.ctx;
    
    ctx.globalCompositeOperation = whiteboardState.currentTool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = whiteboardState.currentTool === 'eraser' ? 'rgba(0,0,0,1)' : whiteboardState.currentColor;
    ctx.lineWidth = whiteboardState.currentTool === 'eraser' ? 20 : whiteboardState.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
}

// Enhanced Select Tool Function
function selectTool(toolName) {
    whiteboardState.currentTool = toolName;
    
    // Close virtual keyboard if switching tools
    if (whiteboardState.keyboardOpen && toolName !== 'text') {
        closeVirtualKeyboard();
    }
    
    // Remove active class from all tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to selected tool
    const selectedTool = document.getElementById(`${toolName}Tool`);
    if (selectedTool) selectedTool.classList.add('active');
    
    // Update cursor and mode
    const canvas = whiteboardState.canvas;
    if (canvas) {
        if (toolName === 'eraser') {
            canvas.style.cursor = 'crosshair';
            whiteboardState.textMode = false;
        } else if (toolName === 'text') {
            canvas.style.cursor = 'text';
            whiteboardState.textMode = true;
        } else {
            canvas.style.cursor = 'crosshair';
            whiteboardState.textMode = false;
        }
    }
    
    showNotification(`🎨 Selected ${toolName} tool${toolName === 'text' ? ' - Click on canvas to add text' : ''}`, 'info');
}

// Enhanced Change Color Function
function changeColor() {
    const colorPicker = document.getElementById('colorPicker');
    if (colorPicker) {
        whiteboardState.currentColor = colorPicker.value;
        showNotification(`🎨 Color changed to ${whiteboardState.currentColor}`, 'info');
    }
}

// Virtual Keyboard Functions
function openVirtualKeyboard(x, y) {
    // Store text position
    whiteboardState.currentTextPosition = { x, y };
    whiteboardState.currentTextContent = '';
    
    // Disable keyboard shortcuts
    disableKeyboardShortcuts();
    
    // Close any existing keyboard
    closeVirtualKeyboard();
    
    // Create virtual keyboard
    whiteboardState.virtualKeyboard = createVirtualKeyboard(x, y);
    document.body.appendChild(whiteboardState.virtualKeyboard);
    whiteboardState.keyboardOpen = true;
    
    // Show notification
    showNotification('⌨️ Virtual keyboard opened. Type your text and press Enter to add it to the whiteboard.', 'info');
    
    console.log('⌨️ Virtual keyboard opened at:', x, y);
}

function closeVirtualKeyboard() {
    if (whiteboardState.virtualKeyboard) {
        whiteboardState.virtualKeyboard.remove();
        whiteboardState.virtualKeyboard = null;
        whiteboardState.keyboardOpen = false;
        whiteboardState.currentTextContent = '';
        
        // Re-enable keyboard shortcuts
        enableKeyboardShortcuts();
        
        showNotification('⌨️ Virtual keyboard closed', 'info');
        console.log('⌨️ Virtual keyboard closed');
    }
}

// Create Virtual Keyboard
function createVirtualKeyboard(x, y) {
    const keyboardDiv = document.createElement('div');
    keyboardDiv.className = 'virtual-keyboard';
    
    // Position keyboard
    const rect = whiteboardState.canvas.getBoundingClientRect();
    const keyboardX = Math.min(rect.left + x, window.innerWidth - 620);
    const keyboardY = Math.min(rect.top + y, window.innerHeight - 320);
    
    keyboardDiv.style.position = 'fixed';
    keyboardDiv.style.left = Math.max(10, keyboardX) + 'px';
    keyboardDiv.style.top = Math.max(10, keyboardY) + 'px';
    keyboardDiv.style.zIndex = '10000';
    
    const keys = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', 'Clear'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', '?', '!'],
        ['Space', '+', '*', '(', ')', '@', '#', '$', '%', 'Close']
    ];
    
    keyboardDiv.innerHTML = `
        <div class="keyboard-header">
            <div class="keyboard-title">
                <i class="fas fa-keyboard"></i>
                Virtual Keyboard
            </div>
            <div class="keyboard-controls">
                <button class="keyboard-btn small" onclick="moveKeyboard('up')" title="Move Up">↑</button>
                <button class="keyboard-btn small" onclick="moveKeyboard('down')" title="Move Down">↓</button>
                <button class="keyboard-btn small" onclick="moveKeyboard('left')" title="Move Left">←</button>
                <button class="keyboard-btn small" onclick="moveKeyboard('right')" title="Move Right">→</button>
                <button class="keyboard-btn small danger" onclick="closeVirtualKeyboard()" title="Close">✕</button>
            </div>
        </div>
        <div class="keyboard-text-display">
            <span id="currentTextDisplay">${whiteboardState.currentTextContent}</span>
            <span class="text-cursor">|</span>
        </div>
        <div class="keyboard-keys">
            ${keys.map(row => 
                `<div class="keyboard-row">
                    ${row.map(key => 
                        `<button class="keyboard-key ${key.length > 1 ? 'special' : ''}" data-key="${key}" title="${key}">
                            ${key === 'Space' ? '⎵ Space' : 
                              key === 'Backspace' ? '⌫' : 
                              key === 'Enter' ? '↵ Add' : 
                              key === 'Clear' ? '🗑️' :
                              key === 'Close' ? '✕' : key}
                        </button>`
                    ).join('')}
                </div>`
            ).join('')}
        </div>
        <div class="keyboard-footer">
            <div class="text-style-controls">
                <label>Size: 
                    <input type="range" id="textSize" min="10" max="72" value="20" step="2">
                    <span id="textSizeValue">20px</span>
                </label>
                <label>Style: 
                    <select id="textStyle">
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="italic">Italic</option>
                        <option value="bold italic">Bold Italic</option>
                    </select>
                </label>
                <label>Font: 
                    <select id="textFont">
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times</option>
                        <option value="Courier New">Courier</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                    </select>
                </label>
            </div>
        </div>
    `;
    
    // Add keyboard event listeners
    keyboardDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        if (e.target.classList.contains('keyboard-key')) {
            const keyValue = e.target.dataset.key;
            handleVirtualKeyPress(keyValue);
        }
    });
    
    // Text size slider update
    const textSize = keyboardDiv.querySelector('#textSize');
    const textSizeValue = keyboardDiv.querySelector('#textSizeValue');
    if (textSize && textSizeValue) {
        textSize.addEventListener('input', () => {
            textSizeValue.textContent = textSize.value + 'px';
        });
    }
    
    return keyboardDiv;
}

// Handle Virtual Key Press
function handleVirtualKeyPress(key) {
    const textDisplay = document.getElementById('currentTextDisplay');
    let currentText = whiteboardState.currentTextContent;
    
    switch (key) {
        case 'Backspace':
            currentText = currentText.slice(0, -1);
            break;
        case 'Space':
            currentText += ' ';
            break;
        case 'Enter':
            // Add text to canvas
            if (currentText.trim()) {
                addTextToCanvas(
                    currentText, 
                    whiteboardState.currentTextPosition.x, 
                    whiteboardState.currentTextPosition.y
                );
                currentText = '';
                // Move down for next line
                whiteboardState.currentTextPosition.y += parseInt(document.getElementById('textSize')?.value || 20) + 5;
            }
            break;
        case 'Clear':
            currentText = '';
            break;
        case 'Close':
            closeVirtualKeyboard();
            return;
        default:
            if (key.length === 1 || ['[', ']', ';', "'", '/', '?', '!', '-', '=', '+', '*', '(', ')', '@', '#', '$', '%'].includes(key)) {
                currentText += key;
            }
            break;
    }
    
    // Update state and display
    whiteboardState.currentTextContent = currentText;
    if (textDisplay) {
        textDisplay.textContent = currentText;
    }
    
    console.log('⌨️ Key pressed:', key, 'Current text:', currentText);
}

// Add Text to Canvas
function addTextToCanvas(text, x, y) {
    const ctx = whiteboardState.ctx;
    const fontSize = document.getElementById('textSize')?.value || 20;
    const textStyle = document.getElementById('textStyle')?.value || 'normal';
    const textFont = document.getElementById('textFont')?.value || 'Arial';
    
    // Save current state
    ctx.save();
    
    // Set text properties
    let fontString = `${textStyle} ${fontSize}px ${textFont}`;
    
    ctx.font = fontString;
    ctx.fillStyle = whiteboardState.currentColor;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    
    // Handle multi-line text
    const lines = text.split('\n');
    const lineHeight = parseInt(fontSize) + 5;
    
    lines.forEach((line, index) => {
        if (line.trim()) {
            ctx.fillText(line, x, y + (index * lineHeight));
        }
    });
    
    // Restore context
    ctx.restore();
    
    // Save state for undo
    saveDrawingState();
    
    showNotification(`✏️ Text "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}" added to whiteboard`, 'success');
    console.log('✏️ Text added to canvas:', text);
}

// Keyboard Movement Functions
window.moveKeyboard = function(direction) {
    if (!whiteboardState.virtualKeyboard) return;
    
    const keyboard = whiteboardState.virtualKeyboard;
    const currentLeft = parseInt(keyboard.style.left) || 0;
    const currentTop = parseInt(keyboard.style.top) || 0;
    const step = 30;
    
    switch (direction) {
        case 'up':
            keyboard.style.top = Math.max(10, currentTop - step) + 'px';
            break;
        case 'down':
            keyboard.style.top = Math.min(window.innerHeight - 320, currentTop + step) + 'px';
            break;
        case 'left':
            keyboard.style.left = Math.max(10, currentLeft - step) + 'px';
            break;
        case 'right':
            keyboard.style.left = Math.min(window.innerWidth - 620, currentLeft + step) + 'px';
            break;
    }
};

// Keyboard Shortcuts Management
function disableKeyboardShortcuts() {
    if (whiteboardState.keyboardShortcutsEnabled) {
        whiteboardState.keyboardShortcutsEnabled = false;
        document.removeEventListener('keydown', handleKeyboardShortcuts);
        console.log('⌨️ Keyboard shortcuts disabled for text input');
    }
}

function enableKeyboardShortcuts() {
    if (!whiteboardState.keyboardShortcutsEnabled) {
        whiteboardState.keyboardShortcutsEnabled = true;
        document.addEventListener('keydown', handleKeyboardShortcuts);
        console.log('⌨️ Keyboard shortcuts re-enabled');
    }
}

// Drawing History Management
function saveDrawingState() {
    try {
        whiteboardState.historyStep++;
        if (whiteboardState.historyStep < whiteboardState.drawingHistory.length) {
            whiteboardState.drawingHistory.length = whiteboardState.historyStep;
        }
        whiteboardState.drawingHistory.push(whiteboardState.canvas.toDataURL());
        
        // Limit history to 15 steps to save memory
        if (whiteboardState.drawingHistory.length > 15) {
            whiteboardState.drawingHistory.shift();
            whiteboardState.historyStep--;
        }
    } catch (e) {
        console.log('Could not save drawing state:', e);
    }
}

function undo() {
    if (whiteboardState.historyStep > 0) {
        whiteboardState.historyStep--;
        restoreFromHistory();
        showNotification('↶ Undid last action', 'info');
    } else {
        showNotification('↶ Nothing to undo', 'warning');
    }
}

function redo() {
    if (whiteboardState.historyStep < whiteboardState.drawingHistory.length - 1) {
        whiteboardState.historyStep++;
        restoreFromHistory();
        showNotification('↷ Redid last action', 'info');
    } else {
        showNotification('↷ Nothing to redo', 'warning');
    }
}

function restoreFromHistory() {
    try {
        const img = new Image();
        img.onload = function() {
            whiteboardState.ctx.clearRect(0, 0, whiteboardState.canvas.width, whiteboardState.canvas.height);
            whiteboardState.ctx.drawImage(img, 0, 0);
        };
        img.src = whiteboardState.drawingHistory[whiteboardState.historyStep];
    } catch (e) {
        console.log('Could not restore from history:', e);
    }
}

// Enhanced Clear Whiteboard
function clearWhiteboard() {
    if (confirm('Are you sure you want to clear the whiteboard? This action cannot be undone.')) {
        whiteboardState.ctx.clearRect(0, 0, whiteboardState.canvas.width, whiteboardState.canvas.height);
        
        // Clear history
        whiteboardState.drawingHistory = [];
        whiteboardState.historyStep = -1;
        saveDrawingState();
        
        closeVirtualKeyboard();
        showNotification('🗑️ Whiteboard cleared completely', 'success');
    }
}

// Enhanced Save Whiteboard
function saveWhiteboard() {
    try {
        const canvas = whiteboardState.canvas;
        if (!canvas) return;
        
        // Create a white background version
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Fill with white background
        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw the original canvas on top
        tempCtx.drawImage(canvas, 0, 0);
        
        // Create download link
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
        link.download = `whiteboard-${roomState?.roomId || 'room'}-${timestamp}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('💾 Whiteboard saved successfully!', 'success');
    } catch (error) {
        console.error('Save error:', error);
        showNotification('❌ Failed to save whiteboard', 'error');
    }
}

// Toggle Fullscreen Whiteboard
function toggleFullscreenWhiteboard() {
    const whiteboardSection = document.querySelector('.whiteboard-section');
    if (!whiteboardSection) return;
    
    if (document.fullscreenElement) {
        document.exitFullscreen().then(() => {
            showNotification('🖥️ Exited whiteboard fullscreen', 'info');
            setTimeout(() => setupCanvasSize(), 100);
        });
    } else {
        whiteboardSection.requestFullscreen().then(() => {
            showNotification('🖥️ Whiteboard in fullscreen mode', 'info');
            setTimeout(() => setupCanvasSize(), 100);
        }).catch(() => {
            showNotification('❌ Fullscreen not supported', 'warning');
        });
    }
}

// Setup Whiteboard Styles
function setupWhiteboardStyles() {
    if (document.querySelector('.whiteboard-styles')) return;
    
    const style = document.createElement('style');
    style.className = 'whiteboard-styles';
    style.textContent = `
        .virtual-keyboard {
            background: var(--bg-primary);
            border: 3px solid var(--accent-blue);
            border-radius: 20px;
            box-shadow: 0 15px 40px var(--shadow-heavy);
            padding: 20px;
            font-family: inherit;
            max-width: 600px;
            backdrop-filter: blur(15px);
            animation: keyboardSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .keyboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 12px;
            border-bottom: 2px solid var(--border-color);
        }
        
        .keyboard-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 700;
            color: var(--accent-blue);
            font-size: 1.1rem;
        }
        
        .keyboard-controls {
            display: flex;
            gap: 6px;
            align-items: center;
        }
        
        .keyboard-btn {
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            border-radius: 8px;
            padding: 6px 10px;
            cursor: pointer;
            font-size: 0.9rem;
            color: var(--text-secondary);
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .keyboard-btn:hover {
            background: var(--accent-blue);
            color: white;
            border-color: var(--accent-blue);
            transform: translateY(-2px);
        }
        
        .keyboard-btn.small {
            padding: 4px 8px;
            font-size: 0.8rem;
        }
        
        .keyboard-btn.danger {
            background: var(--accent-red);
            color: white;
            border-color: var(--accent-red);
        }
        
        .keyboard-btn.danger:hover {
            background: #dc2626;
            border-color: #dc2626;
        }
        
        .keyboard-text-display {
            background: var(--bg-secondary);
            border: 3px solid var(--border-color);
            border-radius: 12px;
            padding: 12px 16px;
            margin-bottom: 15px;
            min-height: 40px;
            display: flex;
            align-items: center;
            font-family: 'Courier New', monospace;
            color: var(--text-primary);
            font-size: 1rem;
            position: relative;
        }
        
        .text-cursor {
            color: var(--accent-blue);
            animation: cursorBlink 1.2s infinite;
            margin-left: 2px;
            font-weight: bold;
        }
        
        @keyframes cursorBlink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        .keyboard-keys {
            margin-bottom: 15px;
        }
        
        .keyboard-row {
            display: flex;
            gap: 4px;
            margin-bottom: 6px;
            justify-content: center;
        }
        
        .keyboard-key {
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            border-radius: 8px;
            padding: 10px;
            cursor: pointer;
            font-weight: 600;
            color: var(--text-primary);
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            min-width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: inherit;
            font-size: 0.9rem;
            position: relative;
            overflow: hidden;
        }
        
        .keyboard-key::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        
        .keyboard-key:hover {
            background: var(--accent-blue);
            color: white;
            border-color: var(--accent-blue);
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
        }
        
        .keyboard-key:hover::before {
            left: 100%;
        }
        
        .keyboard-key:active {
            transform: translateY(-1px) scale(1.02);
            box-shadow: 0 3px 10px rgba(37, 99, 235, 0.4);
        }
        
        .keyboard-key.special {
            background: linear-gradient(135deg, var(--accent-purple), #7c3aed);
            color: white;
            border-color: var(--accent-purple);
            min-width: 65px;
            font-size: 0.8rem;
        }
        
        .keyboard-key.special:hover {
            background: linear-gradient(135deg, #7c3aed, #6d28d9);
            border-color: #7c3aed;
            transform: translateY(-3px) scale(1.05);
        }
        
        .keyboard-footer {
            border-top: 2px solid var(--border-color);
            padding-top: 15px;
        }
        
        .text-style-controls {
            display: flex;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .text-style-controls label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
            color: var(--text-secondary);
            font-weight: 500;
        }
        
        .text-style-controls input[type="range"] {
            width: 80px;
            height: 6px;
            background: var(--bg-secondary);
            border-radius: 3px;
            outline: none;
            cursor: pointer;
        }
        
        .text-style-controls input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 18px;
            height: 18px;
            background: var(--accent-blue);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
        }
        
        .text-style-controls select {
            border: 2px solid var(--border-color);
            border-radius: 6px;
            padding: 6px 10px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            font-size: 0.9rem;
            cursor: pointer;
            min-width: 100px;
        }
        
        .text-style-controls select:focus,
        .text-style-controls input:focus {
            outline: none;
            border-color: var(--accent-blue);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        #textSizeValue {
            min-width: 35px;
            font-weight: 600;
            color: var(--accent-blue);
        }
        
        @keyframes keyboardSlideIn {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
            .virtual-keyboard {
                max-width: 95vw;
                padding: 15px;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .keyboard-key {
                min-width: 40px;
                height: 40px;
                padding: 8px;
                font-size: 0.8rem;
            }
            
            .keyboard-key.special {
                min-width: 55px;
                font-size: 0.7rem;
            }
            
            .text-style-controls {
                font-size: 0.8rem;
                gap: 15px;
            }
            
            .text-style-controls input[type="range"] {
                width: 60px;
            }
            
            .text-style-controls select {
                font-size: 0.8rem;
                min-width: 80px;
            }
        }
        
        @media (max-width: 480px) {
            .virtual-keyboard {
                padding: 10px;
                border-radius: 15px;
            }
            
            .keyboard-key {
                min-width: 35px;
                height: 35px;
                font-size: 0.75rem;
            }
            
            .keyboard-key.special {
                min-width: 50px;
            }
            
            .keyboard-row {
                gap: 3px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Export whiteboard functions to global scope
window.selectTool = selectTool;
window.changeColor = changeColor;
window.clearWhiteboard = clearWhiteboard;
window.saveWhiteboard = saveWhiteboard;
window.toggleFullscreenWhiteboard = toggleFullscreenWhiteboard;
window.closeVirtualKeyboard = closeVirtualKeyboard;
window.undo = undo;
window.redo = redo;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeWhiteboard();
    }, 500);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden && whiteboardState.keyboardOpen) {
        // Keep keyboard open but maybe save state
        console.log('Page hidden with keyboard open');
    }
});

// Cleanup keyboard on page unload
window.addEventListener('beforeunload', function() {
    if (whiteboardState.keyboardOpen) {
        closeVirtualKeyboard();
    }
});

// Handle escape key to close keyboard
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && whiteboardState.keyboardOpen) {
        closeVirtualKeyboard();
    }
});

console.log('🎨 Complete Whiteboard JS with Virtual Keyboard loaded!');
