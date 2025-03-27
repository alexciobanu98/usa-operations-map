document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (ApiService.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-button');
    const loginLoading = document.getElementById('login-loading');
    const loginAlert = document.getElementById('login-alert');
    const alertMessage = document.getElementById('alert-message');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.querySelector('input[name="remember"]').checked;
        
        // Validate inputs
        if (!username || !password) {
            showLoginAlert('Please enter both username and password');
            return;
        }
        
        // Show loading state
        loginButton.style.display = 'none';
        loginLoading.style.display = 'flex';
        hideLoginAlert();
        
        try {
            // Call API to login
            const user = await ApiService.login(username, password);
            
            // Store remember preference
            if (remember) {
                localStorage.setItem('remember_login', 'true');
            }
            
            // Redirect to main page
            window.location.href = 'index.html';
        } catch (error) {
            // Show error message
            showLoginAlert(error.message || 'Invalid username or password');
            
            // Reset loading state
            loginButton.style.display = 'flex';
            loginLoading.style.display = 'none';
        }
    });
    
    // Registration form submission
    const registerForm = document.getElementById('register-form');
    const registerButton = document.getElementById('register-button');
    const registerLoading = document.getElementById('register-loading');
    const registerAlert = document.getElementById('register-alert');
    const registerAlertMessage = document.getElementById('register-alert-message');
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validate inputs
        if (!firstName || !lastName || !username || !email || !password) {
            showRegisterAlert('Please fill in all required fields');
            return;
        }
        
        if (password !== confirmPassword) {
            showRegisterAlert('Passwords do not match');
            return;
        }
        
        // Show loading state
        registerButton.style.display = 'none';
        registerLoading.style.display = 'flex';
        hideRegisterAlert();
        
        try {
            // Call API to register
            const userData = {
                username,
                email,
                password,
                first_name: firstName,
                last_name: lastName
            };
            
            await ApiService.register(userData);
            
            // Show success message
            showRegisterAlert('Registration successful! You can now login.', 'success');
            
            // Reset form
            registerForm.reset();
            
            // Reset loading state
            registerButton.style.display = 'flex';
            registerLoading.style.display = 'none';
            
            // Switch to login form after a delay
            setTimeout(() => {
                showLoginForm();
            }, 2000);
        } catch (error) {
            // Show error message
            showRegisterAlert(error.message || 'Registration failed. Please try again.');
            
            // Reset loading state
            registerButton.style.display = 'flex';
            registerLoading.style.display = 'none';
        }
    });
    
    // Toggle between login and register forms
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginCard = document.querySelector('.login-card');
    const registerCard = document.getElementById('register-card');
    
    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        showRegisterForm();
    });
    
    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });
    
    function showRegisterForm() {
        loginCard.style.display = 'none';
        registerCard.style.display = 'block';
        hideLoginAlert();
    }
    
    function showLoginForm() {
        registerCard.style.display = 'none';
        loginCard.style.display = 'block';
        hideRegisterAlert();
    }
    
    // Alert functions
    function showLoginAlert(message, type = 'error') {
        alertMessage.textContent = message;
        loginAlert.className = `login-alert ${type}`;
        loginAlert.style.display = 'flex';
    }
    
    function hideLoginAlert() {
        loginAlert.style.display = 'none';
    }
    
    function showRegisterAlert(message, type = 'error') {
        registerAlertMessage.textContent = message;
        registerAlert.className = `login-alert ${type}`;
        registerAlert.style.display = 'flex';
    }
    
    function hideRegisterAlert() {
        registerAlert.style.display = 'none';
    }
});
