document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.querySelector('input[name="remember"]').checked;

    // For demo purposes, we'll just do a simple check
    // In production, this should be replaced with proper authentication
    if (username && password) {
        // Store login state if remember is checked
        if (remember) {
            localStorage.setItem('isLoggedIn', 'true');
        } else {
            sessionStorage.setItem('isLoggedIn', 'true');
        }
        
        // Redirect to main page
        window.location.href = 'index.html';
    } else {
        alert('Please enter both username and password');
    }
});
