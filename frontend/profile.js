// Profile Page JavaScript
document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is authenticated
    if (!ApiService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize tabs
    initializeTabs();
    
    // Initialize profile picture upload
    initializeProfilePicture();
    
    // Initialize password strength meter
    initializePasswordStrength();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Load user data
    await loadUserProfile();
    
    // Handle back button
    document.getElementById('back-button').addEventListener('click', function() {
        window.history.back();
    });
});

// Initialize tabs functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show the corresponding tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Initialize profile picture upload
function initializeProfilePicture() {
    const profilePicture = document.getElementById('profile-picture');
    const profileUpload = document.getElementById('profile-upload');
    const removePhotoBtn = document.getElementById('remove-photo');
    
    profilePicture.addEventListener('click', function() {
        profileUpload.click();
    });
    
    profileUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                profilePicture.style.backgroundImage = `url(${e.target.result})`;
                profilePicture.classList.add('has-image');
                removePhotoBtn.style.display = 'block';
            }
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    
    removePhotoBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        profilePicture.style.backgroundImage = 'none';
        profilePicture.classList.remove('has-image');
        profileUpload.value = '';
        this.style.display = 'none';
    });
}

// Initialize password strength meter
function initializePasswordStrength() {
    const passwordInput = document.getElementById('new-password');
    const passwordConfirm = document.getElementById('confirm-password');
    const strengthMeter = document.getElementById('password-strength-meter');
    const strengthText = document.getElementById('password-strength-text');
    const togglePassword = document.getElementById('toggle-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    
    // Password strength checker
    passwordInput.addEventListener('input', function() {
        const value = this.value;
        const strength = calculatePasswordStrength(value);
        
        // Update strength meter
        strengthMeter.value = strength.score;
        strengthText.textContent = strength.label;
        strengthText.className = `password-strength-text ${strength.class}`;
        
        // Check if passwords match
        if (passwordConfirm.value && passwordConfirm.value !== value) {
            passwordConfirm.classList.add('is-invalid');
        } else if (passwordConfirm.value) {
            passwordConfirm.classList.remove('is-invalid');
        }
    });
    
    // Confirm password validation
    passwordConfirm.addEventListener('input', function() {
        if (this.value && this.value !== passwordInput.value) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });
    
    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        togglePasswordVisibility(passwordInput, this);
    });
    
    toggleConfirmPassword.addEventListener('click', function() {
        togglePasswordVisibility(passwordConfirm, this);
    });
}

// Calculate password strength
function calculatePasswordStrength(password) {
    // Default values
    let score = 0;
    let label = 'None';
    let className = 'none';
    
    if (!password) {
        return { score, label, class: className };
    }
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Determine strength label and class
    if (score <= 2) {
        label = 'Weak';
        className = 'weak';
    } else if (score <= 4) {
        label = 'Medium';
        className = 'medium';
    } else {
        label = 'Strong';
        className = 'strong';
    }
    
    return { score, label, class: className };
}

// Toggle password visibility
function togglePasswordVisibility(input, button) {
    if (input.type === 'password') {
        input.type = 'text';
        button.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        input.type = 'password';
        button.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Initialize form validation
function initializeFormValidation() {
    const personalInfoForm = document.getElementById('personal-info-form');
    const securityForm = document.getElementById('security-form');
    const preferencesForm = document.getElementById('preferences-form');
    
    // Personal info form submission
    personalInfoForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm(this)) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div> Saving...';
        submitBtn.disabled = true;
        
        try {
            // Gather form data
            const formData = {
                first_name: document.getElementById('first-name').value,
                last_name: document.getElementById('last-name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                job_title: document.getElementById('job-title').value,
                department: document.getElementById('department').value
            };
            
            // Call API to update profile
            await ApiService.updateUserProfile(formData);
            
            // Show success message
            showToast('Personal information updated successfully', 'success');
        } catch (error) {
            // Show error message
            showToast(error.message || 'Failed to update profile', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Security form submission
    securityForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm(this)) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Check if passwords match
        if (newPassword !== confirmPassword) {
            showToast('New passwords do not match', 'error');
            return;
        }
        
        // Check password strength
        const strength = calculatePasswordStrength(newPassword);
        if (strength.score < 3) {
            showToast('Please choose a stronger password', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div> Updating...';
        submitBtn.disabled = true;
        
        try {
            // Call API to change password
            await ApiService.changePassword(currentPassword, newPassword);
            
            // Reset form
            this.reset();
            
            // Show success message
            showToast('Password updated successfully', 'success');
        } catch (error) {
            // Show error message
            showToast(error.message || 'Failed to update password', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Preferences form submission
    preferencesForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div> Saving...';
        submitBtn.disabled = true;
        
        try {
            // Gather form data
            const formData = {
                email_notifications: document.getElementById('email-notifications').checked,
                sms_notifications: document.getElementById('sms-notifications').checked,
                dark_mode: document.getElementById('dark-mode').checked,
                language: document.getElementById('language').value,
                timezone: document.getElementById('timezone').value
            };
            
            // Call API to update preferences
            await ApiService.updateUserProfile({ preferences: formData });
            
            // Show success message
            showToast('Preferences updated successfully', 'success');
        } catch (error) {
            // Show error message
            showToast(error.message || 'Failed to update preferences', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Add validation to required fields
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });
        
        field.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
            }
        });
    });
}

// Validate form
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="${type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 5000);
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    });
}

// Load user profile data
async function loadUserProfile() {
    try {
        // Show loading state
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.classList.add('loading');
        });
        
        // Get user profile from API
        const profile = await ApiService.getUserProfile();
        
        // Fill personal info form
        if (profile) {
            document.getElementById('first-name').value = profile.first_name || '';
            document.getElementById('last-name').value = profile.last_name || '';
            document.getElementById('email').value = profile.email || '';
            document.getElementById('phone').value = profile.phone || '';
            document.getElementById('job-title').value = profile.job_title || '';
            document.getElementById('department').value = profile.department || '';
            
            // Set profile picture if available
            if (profile.profile_picture) {
                const profilePicture = document.getElementById('profile-picture');
                profilePicture.style.backgroundImage = `url(${profile.profile_picture})`;
                profilePicture.classList.add('has-image');
                document.getElementById('remove-photo').style.display = 'block';
            }
            
            // Set preferences if available
            if (profile.preferences) {
                document.getElementById('email-notifications').checked = profile.preferences.email_notifications || false;
                document.getElementById('sms-notifications').checked = profile.preferences.sms_notifications || false;
                document.getElementById('dark-mode').checked = profile.preferences.dark_mode || false;
                
                if (profile.preferences.language) {
                    document.getElementById('language').value = profile.preferences.language;
                }
                
                if (profile.preferences.timezone) {
                    document.getElementById('timezone').value = profile.preferences.timezone;
                }
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        showToast('Failed to load profile data', 'error');
    } finally {
        // Remove loading state
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.classList.remove('loading');
        });
    }
}
