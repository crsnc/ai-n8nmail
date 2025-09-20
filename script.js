// Configuration
const CONFIG = {
    // Replace this URL with your actual n8n webhook URL
    N8N_WEBHOOK_URL: 'https://your-n8n-instance.com/webhook/contact-form',
    
    // Optional: Add authentication if needed
    // API_KEY: 'your-api-key-here'
};

// DOM elements
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const messageAlert = document.getElementById('messageAlert');

// Form submission handler
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Collect form data
    const formData = collectFormData();
    
    // Validate form data
    if (!validateFormData(formData)) {
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    try {
        // Send data to n8n
        const response = await sendToN8N(formData);
        
        if (response.success) {
            showAlert('success', 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
            contactForm.reset();
        } else {
            throw new Error(response.message || 'Failed to send message');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showAlert('error', `Sorry, there was an error sending your message: ${error.message}`);
    } finally {
        setLoadingState(false);
    }
});

// Collect form data
function collectFormData() {
    const formData = new FormData(contactForm);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value.trim();
    }
    
    // Add metadata
    data.timestamp = new Date().toISOString();
    data.userAgent = navigator.userAgent;
    data.url = window.location.href;
    
    return data;
}

// Validate form data
function validateFormData(data) {
    const required = ['name', 'email', 'subject', 'message'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
        showAlert('error', `Please fill in all required fields: ${missing.join(', ')}`);
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showAlert('error', 'Please enter a valid email address.');
        return false;
    }
    
    // Validate message length
    if (data.message.length < 10) {
        showAlert('error', 'Please enter a message with at least 10 characters.');
        return false;
    }
    
    return true;
}

// Send data to n8n webhook
async function sendToN8N(data) {
    // Check if webhook URL is configured
    if (!CONFIG.N8N_WEBHOOK_URL || CONFIG.N8N_WEBHOOK_URL.includes('your-n8n-instance.com')) {
        throw new Error('N8N webhook URL not configured. Please update the CONFIG object in script.js');
    }
    
    const headers = {
        'Content-Type': 'application/json',
    };
    
    // Add API key if configured
    if (CONFIG.API_KEY) {
        headers['Authorization'] = `Bearer ${CONFIG.API_KEY}`;
    }
    
    const response = await fetch(CONFIG.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            formType: 'contact',
            data: data,
            source: 'ai-n8nmail-form'
        })
    });
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let result;
    
    if (contentType && contentType.includes('application/json')) {
        result = await response.json();
    } else {
        result = { success: true, message: await response.text() };
    }
    
    return result;
}

// Set loading state
function setLoadingState(loading) {
    submitBtn.disabled = loading;
    
    if (loading) {
        submitBtn.classList.add('loading');
    } else {
        submitBtn.classList.remove('loading');
    }
    
    // Disable form inputs during submission
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.disabled = loading;
    });
}

// Show alert message
function showAlert(type, message) {
    const alertText = messageAlert.querySelector('.alert-text');
    alertText.textContent = message;
    
    messageAlert.className = `alert ${type}`;
    messageAlert.style.display = 'block';
    
    // Auto-hide after 10 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            hideAlert();
        }, 10000);
    }
}

// Hide alert message
function hideAlert() {
    messageAlert.style.display = 'none';
}

// Enhanced form validation with real-time feedback
document.addEventListener('DOMContentLoaded', () => {
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
});

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const isValid = field.checkValidity() && value.length > 0;
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValid = emailRegex.test(value);
        field.classList.toggle('error', !emailValid);
        return emailValid;
    }
    
    if (field.tagName === 'TEXTAREA' && field.name === 'message' && value.length > 0 && value.length < 10) {
        field.classList.add('error');
        return false;
    }
    
    field.classList.toggle('error', !isValid);
    return isValid;
}

// Demo mode for testing without n8n
function enableDemoMode() {
    console.log('Demo mode enabled - form submissions will be simulated');
    
    // Override sendToN8N function for demo
    window.sendToN8N = async function(data) {
        console.log('Demo submission:', data);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate success response
        return {
            success: true,
            message: 'Demo submission successful',
            data: data
        };
    };
}

// Check if we're in demo mode (no configured webhook URL)
if (!CONFIG.N8N_WEBHOOK_URL || CONFIG.N8N_WEBHOOK_URL.includes('your-n8n-instance.com')) {
    enableDemoMode();
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        collectFormData,
        validateFormData,
        showAlert,
        hideAlert,
        CONFIG
    };
}