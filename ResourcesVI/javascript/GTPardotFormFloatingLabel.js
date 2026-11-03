/**
 * GT Pardot Form Floating Label Module
 * Include this module in the iframe to handle the floating label functionality for form inputs.
 * Pardot thank-you content must include: <div data-gt-pardot-success></div>
 */

(function() {
    'use strict';

    let PardotFormFloatingLabel = function () {
        let _this = this;
        let formTheme = 'white';
        
        // Initialize floating label functionality
        _this.init = function() {
            _this.handlePardotIframeMessage();

            // Pardot posts the form as a full page load; the response page reports success here.
            _this.notifyParentOfSuccessfulSubmit();
            
            let pardotForm = document.querySelector('#pardot-form');
            if (!pardotForm) return;

            pardotForm.closest('.template-scoped-style')?.removeAttribute('style');

            let submitButton = pardotForm.querySelector('.submit-button');

            setTimeout(function() {
                pardotForm.classList.add(`form-theme--${formTheme}`);
            }, 500);
            // Find form control inputs within Pardot form
            let inputFields = pardotForm.querySelectorAll('input[type="text"], input[type="email"], textarea, select');

            let radioFields = pardotForm.querySelectorAll('.pd-radio');
            let checkboxFields = pardotForm.querySelectorAll('.pd-checkbox');
            let copyright = pardotForm.querySelector('.copyright');

            pardotForm.querySelectorAll('h2, h3, h4').forEach(function (heading) {
                heading.removeAttribute('style');
                heading.querySelectorAll('span').forEach(function (span) {
                    span.removeAttribute('style');
                });
            });

            pardotForm.querySelectorAll('p:not(.submit)').forEach(function (paragraph) {
                paragraph.removeAttribute('style');
            });

            if (inputFields) {
                inputFields.forEach(element => {
                    const fieldWrap = element.closest('.form-field');
                    if (fieldWrap) {
                        _this.addFloatingLabelBehavior(element, fieldWrap);
                    }
                });
            }

            if (radioFields) {
                radioFields.forEach(function(element) {
                    element.querySelector('.value')?.classList.add('pd-radio__list');
                    _this.addChoiceClass(element);
                });
            }
            
            if (checkboxFields) {
                checkboxFields.forEach(function(element) {
                    _this.addChoiceClass(element);
                });
            }

            if (submitButton) {
                submitButton.querySelector('button')?.removeAttribute('style');
            }

            if (copyright) {
                copyright.removeAttribute('style');
                copyright.removeAttribute('align');
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

        _this.notifyParentOfSuccessfulSubmit = function() {
            if (window.__gtPardotFormSuccessPosted) {
                return;
            }

            if (!document.querySelector('[data-gt-pardot-success]')) {
                return;
            }

            window.__gtPardotFormSuccessPosted = true;
            window.parent.postMessage({ isPardotFormSuccess: true }, '*');
        };

        _this.handlePardotIframeMessage = function() {
            window.addEventListener('message', (event) => {
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
            const handleInputType = (inputs) => {
                if (inputs.length === 0) return;

                // Add wrapper class to each input's label
                inputs.forEach(input => {
                    const labelWrapper = input.closest('span');
                    if (labelWrapper) {
                        labelWrapper.classList.add('choice-wrapper');
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

            // Apply styling for each input type
            handleInputType(radioInputs, 'radio');
            handleInputType(checkboxInputs, 'checkbox');
            
        };
        
        return _this;
    };

    // Initialize when DOM is ready
    function initPardotFormFloatingLabel() {
        let floatingLabel = new PardotFormFloatingLabel();
        floatingLabel.init();
    }

    // Wait for DOM is fully loaded before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPardotFormFloatingLabel);
    } else {
        // DOM is already loaded
        initPardotFormFloatingLabel();
    }

    // Expose for manual initialization if needed
    window.PardotFormFloatingLabel = PardotFormFloatingLabel;

})();
