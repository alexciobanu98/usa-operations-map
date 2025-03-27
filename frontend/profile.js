// Profile Dropdown Toggle
const profileButton = document.getElementById('profileButton');
const profileDropdown = document.getElementById('profileDropdown');

profileButton.addEventListener('click', () => {
    profileDropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!profileButton.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove('show');
    }
});

// Handle form submission
document.querySelectorAll('.profile-form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // In production, this would send the data to the server
        console.log('Form submitted:', Object.fromEntries(new FormData(form)));
    });
});

// Save changes button
document.querySelector('.primary-button').addEventListener('click', () => {
    const forms = document.querySelectorAll('.profile-form');
    const formData = {};
    
    forms.forEach(form => {
        const data = Object.fromEntries(new FormData(form));
        Object.assign(formData, data);
    });

    // In production, this would be an API call
    console.log('Saving changes:', formData);
    alert('Changes saved successfully!');
});

// Cancel button
document.querySelector('.secondary-button').addEventListener('click', () => {
    if (confirm('Are you sure you want to discard your changes?')) {
        window.location.reload();
    }
});
