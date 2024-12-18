// Register a new user
function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    if (username.trim() === '' || password.trim() === '') {
        alert('Please fill out both fields.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some(user => user.username === username)) {
        alert('Username already exists!');
        return;
    }

    const newUser = {
        username: username,
        password: password, // In a real app, passwords should be hashed
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful! You can now log in.');
    showLoginForm();
}

// Log in an existing user
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (username.trim() === '' || password.trim() === '') {
        alert('Please fill out both fields.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        alert('Login successful!');
        localStorage.setItem('loggedInUser', username);
        window.location.href = 'index.html'; // Redirect to the phonebook app
    } else {
        alert('Invalid username or password!');
    }
}

// Show the Register form
function showRegisterForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

// Show the Login form
function showLoginForm() {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}
