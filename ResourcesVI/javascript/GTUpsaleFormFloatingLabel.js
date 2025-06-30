/**
 * GT Upsale Form Handler
 * Applies styling and functionality to upsale forms
 * Version: 2.0
 */

// Constants
const SELECTORS = {
    FORM: '#up-form',
    INPUTS: '#up-form input[type="text"], #up-form input[type="email"]',
    TEXTAREA: '#up-form textarea',
    FOCUS_ELEMENTS: '#up-form input[type="text"]:focus, #up-form input[type="email"]:focus, #up-form textarea:focus'
};

const STYLES = {
    BORDER_COLOR: '#ccc4bd',
    FOCUS_BORDER_COLOR: '#4F2D7F',
    PADDING: '1.6rem 2rem',
    BORDER_RADIUS: '0.4rem',
    WIDTH: '100%'
};

/**
 * Applies V2 styling to upsale form elements
 * @returns {boolean} Success status
 */
function applyUpsaleFormStyles() {
    try {
        const form = document.querySelector(SELECTORS.FORM);
        
        if (!form) {
            console.warn('Upsale form not found in DOM');
            return false;
        }

        const inputs = form.querySelectorAll('input[type="text"], input[type="email"]');
        const textareas = form.querySelectorAll('textarea');

        // Apply styles to inputs
        inputs.forEach(input => {
            if (input) {
                input.style.border = `1px solid ${STYLES.BORDER_COLOR}`;
                input.style.padding = STYLES.PADDING;
                input.style.borderRadius = STYLES.BORDER_RADIUS;
                input.style.width = STYLES.WIDTH;
                input.style.boxSizing = 'border-box';
                
                // Add focus event listener
                input.addEventListener('focus', handleFocus);
                input.addEventListener('blur', handleBlur);
            }
        });

        // Apply styles to textareas
        textareas.forEach(textarea => {
            if (textarea) {
                textarea.style.border = `1px solid ${STYLES.BORDER_COLOR}`;
                textarea.style.padding = STYLES.PADDING;
                textarea.style.borderRadius = STYLES.BORDER_RADIUS;
                textarea.style.width = STYLES.WIDTH;
                textarea.style.boxSizing = 'border-box';
                
                // Add focus event listener
                textarea.addEventListener('focus', handleFocus);
                textarea.addEventListener('blur', handleBlur);
            }
        });

        return true;
    } catch (error) {
        console.error('Error applying upsale form styles:', error);
        return false;
    }
}

/**
 * Handles focus events for form elements
 * @param {Event} event - Focus event
 */
function handleFocus(event) {
    if (event.target) {
        event.target.style.borderColor = STYLES.FOCUS_BORDER_COLOR;
    }
}

/**
 * Handles blur events for form elements
 * @param {Event} event - Blur event
 */
function handleBlur(event) {
    if (event.target) {
        event.target.style.borderColor = STYLES.BORDER_COLOR;
    }
}

/**
 * Initializes the upsale form functionality
 */
function initializeUpsaleForm() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applyUpsaleFormStyles();
        });
    } else {
        // DOM is already ready
        applyUpsaleFormStyles();
    }
}

// Initialize when script loads
initializeUpsaleForm();

