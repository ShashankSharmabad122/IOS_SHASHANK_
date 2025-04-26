document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    
    // Show signup form
    showSignupLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.remove('active-form');
        signupForm.classList.add('active-form');
    });
    
    // Show login form
    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        signupForm.classList.remove('active-form');
        loginForm.classList.add('active-form');
    });
    
    // Validate signup form
    signupForm.addEventListener('submit', function(e) {
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Check if passwords match
        if (password !== confirmPassword) {
            e.preventDefault();
            
            // Remove any existing error messages
            const existingError = signupForm.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Create and show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.innerHTML = '<span class="material-icons">error</span> Passwords do not match';
            
            // Insert at the beginning of the form
            signupForm.insertBefore(errorMessage, signupForm.firstChild);
        }
    });
});