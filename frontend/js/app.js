// Main application logic

const API_URL = '/api';

// State management
let isGenerating = false;
let currentStage = 0;

/**
 * Initialize application
 */
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkBackendHealth();
});

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Generate button
    const generateBtn = document.getElementById('generate-btn');
    generateBtn.addEventListener('click', handleGenerate);
    
    // Toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', handleToggle);
    });
    
    // Enter key in URL input
    document.getElementById('problem-url').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isGenerating) {
            handleGenerate();
        }
    });
}

/**
 * Handle input type toggle (URL vs Text)
 */
function handleToggle(event) {
    const btn = event.currentTarget;
    const type = btn.dataset.type;
    
    // Update active state
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Toggle input containers
    document.getElementById('url-input').classList.toggle('hidden', type !== 'url');
    document.getElementById('text-input').classList.toggle('hidden', type !== 'text');
}

/**
 * Handle generate button click
 */
async function handleGenerate() {
    if (isGenerating) return;
    
    // Get input
    const activeType = document.querySelector('.toggle-btn.active').dataset.type;
    const content = activeType === 'url' 
        ? document.getElementById('problem-url').value.trim()
        : document.getElementById('problem-text').value.trim();
    
    // Validate input
    if (!content) {
        showError('Please provide a problem URL or text');
        return;
    }
    
    if (content.length < 10) {
        showError('Problem description is too short. Please provide more details.');
        return;
    }
    
    // Start generation
    isGenerating = true;
    currentStage = 0;
    showLoading();
    hideOutput();
    disableGenerateButton();
    
    try {
        const response = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                input_type: activeType,
                content: content
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            let errorMsg = errorData.detail || `Server error: ${response.status}`;
            
            // Add helpful guidance for common errors
            if (errorMsg.includes('403') || errorMsg.includes('blocking') || errorMsg.includes('Forbidden')) {
                errorMsg = '🚫 LeetCode is blocking URL access.\n\n✅ SOLUTION: Click "Paste Text" button above and copy-paste the problem description directly from LeetCode!';
            } else if (errorMsg.includes('HTTP error')) {
                errorMsg = '⚠️ ' + errorMsg + '\n\n💡 TIP: Try using "Paste Text" mode instead!';
            }
            
            throw new Error(errorMsg);
        }
        
        const data = await response.json();
        
        // Hide loading and show output
        hideLoading();
        renderOutput(data);
        showOutput();
        
        // Scroll to output
        setTimeout(() => {
            smoothScrollTo(document.getElementById('output'));
        }, 100);
        
    } catch (error) {
        console.error('Generation error:', error);
        hideLoading();
        showError(error.message || 'Failed to generate explanation. Please try again.');
    } finally {
        isGenerating = false;
        enableGenerateButton();
    }
}

/**
 * Check backend health
 */
async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_URL}/health`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Backend health:', data);
        }
    } catch (error) {
        console.warn('Backend health check failed:', error);
    }
}

/**
 * Show loading state
 */
function showLoading() {
    const loading = document.getElementById('loading');
    loading.style.display = 'flex';
    
    // Animate progress steps
    const steps = ['step-concepts', 'step-solutions', 'step-pitfalls'];
    
    steps.forEach((stepId, index) => {
        setTimeout(() => {
            document.getElementById(stepId).classList.add('active');
            
            // Remove active from previous step
            if (index > 0) {
                document.getElementById(steps[index - 1]).classList.remove('active');
            }
        }, index * 15000); // Rough estimate: 15s per stage
    });
}

/**
 * Hide loading state
 */
function hideLoading() {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
    
    // Reset step states
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
}

/**
 * Show output container
 */
function showOutput() {
    const output = document.getElementById('output');
    output.style.display = 'block';
}

/**
 * Hide output container
 */
function hideOutput() {
    const output = document.getElementById('output');
    output.style.display = 'none';
}

/**
 * Disable generate button
 */
function disableGenerateButton() {
    const btn = document.getElementById('generate-btn');
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'not-allowed';
    
    const btnText = btn.querySelector('.btn-text');
    btnText.textContent = 'Generating...';
}

/**
 * Enable generate button
 */
function enableGenerateButton() {
    const btn = document.getElementById('generate-btn');
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
    
    const btnText = btn.querySelector('.btn-text');
    btnText.textContent = 'Generate Explanation';
}

/**
 * Show error message
 */
function showError(message) {
    // Create custom error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 0, 51, 0.95);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 0 30px rgba(255, 0, 51, 0.8);
        z-index: 9999;
        max-width: 400px;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
    `;
    // Format message with line breaks
    const formattedMsg = message.replace(/\n/g, '<br>');
    
    notification.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <span style="font-size: 24px; flex-shrink: 0;">⚠️</span>
            <div style="line-height: 1.5;">${formattedMsg}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(50px); }
    }
`;
document.head.appendChild(style);
