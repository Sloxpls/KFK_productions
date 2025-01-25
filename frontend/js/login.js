
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent full page reload

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })
            .then(async response => {
                const data = await response.json();
                console.log('Response status:', response.status);
                console.log('Response data:', data);

                if (response.ok) {
                    alert(data.message);
                    window.location.href = '/site/songs';
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));

    });
});
