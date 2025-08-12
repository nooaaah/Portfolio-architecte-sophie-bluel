document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            // Send request to API
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            
            // Handle response
            if (response.ok) {
                const data = await response.json();
                
                // Store the token (assuming your API returns one)
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    
                    // Redirect to another page after successful login
                    window.location.href = 'index.html'; // Change to your desired page
                }
            } else {
                // Handle login error
                const errorData = await response.json();
                errorMessage.textContent = errorData.message || 'Le mot de passe est incorrect';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = 'Une erreur est survenue lors de la connexion';
            errorMessage.style.display = 'block';
        }
    });
});