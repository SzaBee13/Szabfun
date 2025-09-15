const apiUrl = 'https://adventures-ellis-redeem-nominations.trycloudflare.com';
// const apiUrl = 'http://localhost:3000';

window.onGoogleSignIn = function(response) {
    const id_token = response.credential;
    const payload = JSON.parse(atob(id_token.split('.')[1]));
    document.getElementById('google-user-info').style.display = 'flex';
    document.getElementById('google-user-name').textContent = `Signed in as ${payload.name}`;
    document.getElementById('google-email-info').textContent = payload.email || '';
    document.getElementById('login').style.display = "none";
    // Save Google ID, name, and email for use in other parts of the app
    localStorage.setItem('google_id', payload.sub);
    localStorage.setItem('google_name', payload.name);
    localStorage.setItem('google_email', payload.email || '');
    // Register user in backend and send registration email
    fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: payload.sub,
            name: payload.name,
            email: payload.email
        })
    });
};

window.googleSignOut = function() {
    document.getElementById('google-user-info').style.display = 'none';
    localStorage.removeItem('google_id');
    localStorage.removeItem('google_name');
    localStorage.removeItem('google_email');
    document.getElementById('login').style.display = "flex";
    // Optionally: google.accounts.id.disableAutoSelect();
    location.reload();
};

// On page load, show user info if already signed in
window.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('google_name');
    const email = localStorage.getItem('google_email');
    if (name) {
        document.getElementById('google-user-info').style.display = 'flex';
        document.getElementById('google-user-name').textContent = `Signed in as ${name}`;
        document.getElementById('google-email-info').textContent = email || '';
    }
    // Check if the user is signed in by cookie if not then remove
    if (!name && document.cookie.includes('G_AUTHUSER_H')) {
        localStorage.removeItem('google_id');
        localStorage.removeItem('google_name');
        localStorage.removeItem('google_email');
        document.cookie.split(';').forEach(cookie => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + window.location.hostname + ';';
        });
    } else if (!name) {
        document.getElementById('google-user-info').style.display = 'none';
    }
});

if (localStorage.getItem("google_id")) {
    document.getElementById('login').style.display = "none";
}