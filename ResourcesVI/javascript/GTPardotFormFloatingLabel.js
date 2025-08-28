/**
 * GT Upsale Form Floating Label Module
 * Include this module in the iframe to handle the floating label functionality for form inputs
 */

(function() {
    'use strict';

    let PardotFormFloatingLabel = function () {
        let _this = this;
        let formTheme = 'grey';
        
        // Initialize floating label functionality
        _this.init = function() {
            _this.handleUpsalesIframeMessage();
            
            let pardotForm = document.querySelector('#pardot-form');
            let submitButton = pardotForm?.querySelector('.submit-button');

            // pardotForm.closest('.template-scoped-style')?.removeAttribute('style');

            setTimeout(function() {
                pardotForm.classList.add(`form-theme--${formTheme}`);
            }, 500);
            // Find form control inputs within Pardot form
            let inputFields = pardotForm.querySelectorAll('input[type="text"], input[type="email"]');
            let formFields = pardotForm.querySelectorAll('.form-field');

            
            if (inputFields) {
                inputFields.forEach(function(element) {
                    let fieldWrap = element.closest('.form-field');
                    
                    if (fieldWrap) {
                        _this.addFloatingLabelBehavior(element, fieldWrap);
                    }
                });
            }

            if (formFields) {
                formFields.forEach(function(element) {
                    _this.addChoiceClass(element);
                    _this.optInCheckboxClickHandler(element);
                });
            }

            if (submitButton) {
                submitButton.querySelector('button')?.removeAttribute('style');
            }
        };

        _this.optInCheckboxClickHandler = function(element) {
            const checkbox = element.querySelector('input[type="checkbox"]');
            const optInLabel = element.querySelector('.opt-in-label');

            if (checkbox && optInLabel) {
                // Add click handler to label
                optInLabel.addEventListener('click', function(e) {
                    e.preventDefault(); // Prevent default label behavior
                    checkbox.checked = !checkbox.checked; // Toggle checkbox
                    
                    // Trigger change event to ensure any other handlers are notified
                    checkbox.dispatchEvent(new Event('change', {
                        bubbles: true
                    }));
                });
            }
        };

        _this.handleUpsalesIframeMessage = function() {
            window.addEventListener('message', (event) => {
                
                // Comment out origin check temporarily for testing
                // if (event.origin !== 'https://YOUR_MAIN_SITE_ORIGIN') {
                //   return;
                // }
              
                if (event.data && typeof event.data.formTheme !== 'undefined') {
                    formTheme = event.data.formTheme;
                }
              });
        }
        
        _this.addFloatingLabelBehavior = function(element, fieldWrap) {
            // Add floating label class
            fieldWrap.classList.add('floating-label');
            
            // Add label title for accessibility
            _this.addLabelTitle(element, fieldWrap);
            
            // Check initial state
            setTimeout(function() {
                _this.filledClassHandle(element, fieldWrap);
            }, 1000);
            
            // Add event listeners
            element.addEventListener('focusin', function(e) {
                fieldWrap.classList.add('focus');
            });
            
            element.addEventListener('focusout', function(e) {
                fieldWrap.classList.remove('focus');
            });
            
            element.addEventListener('change', function(e) {
                _this.filledClassHandle(e.target, fieldWrap);
            });
        };
        
        _this.filledClassHandle = function(item, fieldWrap) {
            if (item.value && item.value.length > 0) {
                fieldWrap.classList.add('filled');
            } else {
                fieldWrap.classList.remove('filled');
            }
        };
        
        _this.addLabelTitle = function(field, fieldWrap) {
            let label = fieldWrap.querySelector('label');
            const labelContent = label?.textContent.trim();
            if (labelContent && labelContent.length > 0) {
                label.setAttribute("title", labelContent);
                field.setAttribute("title", labelContent);
            }
        };

        _this.addChoiceClass = function(fieldWrap) {
            // Only process if element is a form group
            if (!fieldWrap.classList.contains('form-field')) {
                return;
            }

            // Helper function to handle input type (radio/checkbox) styling
            const handleInputType = (inputs, inputType) => {
                if (inputs.length === 0) return;
                
                // Add base classes
                fieldWrap.classList.add('form-group--choice');
                fieldWrap.classList.add(inputType);

                // Add opt-in class for checkbox inputs with opt-in label
                if (inputType === 'checkbox') {
                    inputs.forEach(input => {
                        const optInLabel = fieldWrap?.querySelector('.opt-in-label');
                        if (optInLabel) {
                            input.removeAttribute('style');
                            fieldWrap.classList.add('checkbox--opt-in');
                        }
                    });
                }

                // Add multiple class if more than one input
                if (inputs.length > 1) {
                    fieldWrap.classList.add('multiple');
                }

                // Add wrapper class to each input's label
                inputs.forEach(input => {
                    const labelWrapper = input.closest('span');
                    if (labelWrapper) {
                        labelWrapper.classList.add('choice-wrapper');
                        // Remove any inline styles from the label wrapper
                        labelWrapper.removeAttribute('style');
                        // Create and append choice icon element
                        const choiceIcon = document.createElement('span');
                        choiceIcon.classList.add('choice-icon');
                        labelWrapper.appendChild(choiceIcon);
                    }
                });
            };

            // Get all radio and checkbox inputs
            const radioInputs = fieldWrap.querySelectorAll('input[type="radio"]');
            const checkboxInputs = fieldWrap.querySelectorAll('input[type="checkbox"]');
            const selectInputs = fieldWrap.querySelectorAll('select');

            // Apply styling for each input type
            handleInputType(radioInputs, 'radio');
            handleInputType(checkboxInputs, 'checkbox');
            
            selectInputs.forEach(select => {
                select.closest('.form-field')?.classList.add('form-group--select');
            });
        };
        
        return _this;
    };

    // Initialize when DOM is ready
    function initPardotFormFloatingLabel() {
        let floatingLabel = new PardotFormFloatingLabel();
        floatingLabel.init();
    }

    // Wait for DOM to be fully loaded before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPardotFormFloatingLabel);
    } else {
        // DOM is already loaded
        initPardotFormFloatingLabel();
    }

    // Expose for manual initialization if needed
    window.PardotFormFloatingLabel = PardotFormFloatingLabel;

})();
