// login.js
// Submits a JSON POST to the Flask login endpoint ("/"), then redirects on success.

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent full page reload

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(async response => {
            const data = await response.json();
            if (response.ok) {
                // Login successful
                alert(data.message);
                // Redirect to a protected route or wherever
                window.location.href = '/site/songs';
            } else {
                // Display error message from server
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
