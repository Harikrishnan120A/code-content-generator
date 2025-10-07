// Utility functions

/**
 * Format code with proper indentation
 */
function formatCode(code) {
    if (!code) return '';
    // Replace \\n with actual newlines
    return code.replace(/\\n/g, '\n').trim();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Truncate text to specified length
 */
function truncate(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Create a collapsible section header
 */
function createCollapsibleHeader(title, icon = '📦') {
    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `
        <div class="section-title">
            <span class="section-icon">${icon}</span>
            <h2>${title}</h2>
        </div>
        <span class="collapse-icon">▼</span>
    `;
    return header;
}

/**
 * Toggle section collapse
 */
function toggleSection(headerElement) {
    headerElement.classList.toggle('collapsed');
    const content = headerElement.nextElementSibling;
    if (content && content.classList.contains('section-content')) {
        content.classList.toggle('collapsed');
    }
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

/**
 * Show error message
 */
function showError(message) {
    alert('Error: ' + message);
    // Could be enhanced with a custom modal
}

/**
 * Format difficulty badge
 */
function getDifficultyBadge(difficulty) {
    const colorMap = {
        'Easy': '#00cc66',
        'Medium': '#ff9933',
        'Hard': '#ff3333'
    };
    const color = colorMap[difficulty] || '#ff0033';
    return `<span class="badge" style="background: ${color}; box-shadow: 0 0 20px ${color}88;">${difficulty}</span>`;
}

/**
 * Format complexity text
 */
function formatComplexity(time, space) {
    return `<strong>Time:</strong> ${time} | <strong>Space:</strong> ${space}`;
}

/**
 * Create a content block
 */
function createContentBlock(label, value, isCode = false) {
    const block = document.createElement('div');
    block.className = 'content-block';
    
    if (isCode) {
        block.innerHTML = `
            <span class="content-label">${label}</span>
            <pre><code>${escapeHtml(formatCode(value))}</code></pre>
        `;
    } else {
        block.innerHTML = `
            <span class="content-label">${label}</span>
            <div class="content-value">${value}</div>
        `;
    }
    
    return block;
}

/**
 * Create a list element
 */
function createList(items, ordered = false) {
    const list = document.createElement(ordered ? 'ol' : 'ul');
    list.className = 'list';
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = typeof item === 'string' ? item : JSON.stringify(item);
        list.appendChild(li);
    });
    
    return list;
}

/**
 * Debounce function
 */
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

/**
 * Check if object is empty
 */
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * Deep clone object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard! ✓');
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('Copied to clipboard! ✓');
        } else {
            showToast('Failed to copy', 'error');
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showToast('Failed to copy', 'error');
    }
    
    document.body.removeChild(textArea);
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    // Remove any existing toasts
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    const bgColor = type === 'success' ? 'rgba(0, 204, 102, 0.95)' : 'rgba(255, 0, 51, 0.95)';
    const shadowColor = type === 'success' ? 'rgba(0, 204, 102, 0.8)' : 'rgba(255, 0, 51, 0.8)';
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 0 20px ${shadowColor};
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
        cursor: pointer;
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
    
    // Click to dismiss
    toast.addEventListener('click', () => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    });
}
