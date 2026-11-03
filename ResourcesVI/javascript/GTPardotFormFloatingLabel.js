/**
 * GT Upsale Form Floating Label Module
 * Include this script in the Pardot form layout. CMS deploy alone does not update iframe behavior
 * until the Pardot layout script URL is repointed (hosted CSS: pardot-form-hosted-iframe.css).
 */

(function() {
    'use strict';

    let PardotFormFloatingLabel = function () {
        let _this = this;
        let formTheme = 'white';
        var indiaThankYouSnippet = 'Thank you for your interest. Our team will get in touch with you soon.';

        function isSuccessfulPardotSubmission() {
            const bodyText = document.body?.innerText || '';
            if (bodyText.indexOf(indiaThankYouSnippet) !== -1) {
                return true;
            }

            const pardotForm = document.querySelector('#pardot-form');
            if (pardotForm) {
                if (pardotForm.querySelector('.thank-you, .thankyou, [class*="thank-you"]')) {
                    return true;
                }
                const submitButton = pardotForm.querySelector('.submit-button, [type="submit"]');
                return !submitButton;
            }

            return !!document.querySelector('.thank-you, .thankyou') ||
                /thank/i.test(window.location.pathname || '');
        }

        function scheduleSuccessNotifyAfterSubmit() {
            var attempts = 0;
            var maxAttempts = 30;
            var timer = window.setInterval(function () {
                attempts += 1;
                _this.notifyParentOfSuccessfulSubmit();
                if (window.__gtPardotFormSuccessPosted || attempts >= maxAttempts) {
                    window.clearInterval(timer);
                }
            }, 500);
        }
        
        _this.init = function() {
            _this.handlePardotIframeMessage();
            
            let pardotForm = document.querySelector('#pardot-form');
            if (!pardotForm) {
                if (isSuccessfulPardotSubmission()) {
                    _this.notifyParentOfSuccessfulSubmit();
                }
                return;
            }

            let submitButton = pardotForm.querySelector('.submit-button');

            setTimeout(function() {
                pardotForm.classList.add(`form-theme--${formTheme}`);
            }, 500);
            let inputFields = pardotForm.querySelectorAll('input[type="text"], input[type="email"], textarea, select');

            let radioFields = pardotForm.querySelectorAll('.pd-radio');
            let checkboxFields = pardotForm.querySelectorAll('.pd-checkbox');
            let copyright = pardotForm.querySelector('.copyright');

            
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

            pardotForm.addEventListener('submit', function () {
                scheduleSuccessNotifyAfterSubmit();
            });

            if (isSuccessfulPardotSubmission()) {
                _this.notifyParentOfSuccessfulSubmit();
            }
        };

        _this.optInCheckboxClickHandler = function(element) {
            const checkbox = element.querySelector('input[type="checkbox"]');
            const optInLabel = element.querySelector('.opt-in-label');

            if (checkbox && optInLabel) {
                optInLabel.addEventListener('click', function(e) {
                    e.preventDefault();
                    checkbox.checked = !checkbox.checked;
                    
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

            if (!isSuccessfulPardotSubmission()) {
                return;
            }

            window.__gtPardotFormSuccessPosted = true;
            // Parent validates event.origin; use '*' so delivery is not dropped when referrer/target mismatch.
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
            fieldWrap.classList.add('floating-label');
            
            _this.addLabelTitle(element, fieldWrap);
            
            setTimeout(function() {
                _this.filledClassHandle(element, fieldWrap);
            }, 1000);
            
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
            if (!fieldWrap.classList.contains('form-field')) {
                return;
            }

            const handleInputType = (inputs) => {
                if (inputs.length === 0) return;

                inputs.forEach(input => {
                    const labelWrapper = input.closest('span');
                    if (labelWrapper) {
                        labelWrapper.classList.add('choice-wrapper');
                        const choiceIcon = document.createElement('span');
                        choiceIcon.classList.add('choice-icon');
                        labelWrapper.appendChild(choiceIcon);
                    }
                });
            };

            const radioInputs = fieldWrap.querySelectorAll('input[type="radio"]');
            const checkboxInputs = fieldWrap.querySelectorAll('input[type="checkbox"]');

            handleInputType(radioInputs, 'radio');
            handleInputType(checkboxInputs, 'checkbox');
            
        };
        
        return _this;
    };

    function initPardotFormFloatingLabel() {
        let floatingLabel = new PardotFormFloatingLabel();
        floatingLabel.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPardotFormFloatingLabel);
    } else {
        initPardotFormFloatingLabel();
    }

    window.PardotFormFloatingLabel = PardotFormFloatingLabel;

})();
