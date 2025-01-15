  const form = document.getElementById('login-form');
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent traditional form submission

            // Grab credentials from the form
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Send them as JSON to the Flask login endpoint ("/")
            fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(async response => {
                const data = await response.json();
                if (response.ok) {
                    // Login successful
                    alert(data.message);
                    // Redirect to protected route
                    window.location.href = '/site/songs';
                } else {
                    // Display error message
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });