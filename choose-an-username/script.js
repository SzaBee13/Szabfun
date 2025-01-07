<<<<<<< HEAD
const platforms = ['TikTok', 'YouTube', 'Instagram', 'X (Twitter)', 'Discord'];
const textInput = document.getElementById('username')
const resultDiv = document.getElementById('result');

let globalUsername = '';

function updateURL() {
    const params = new URLSearchParams();
    params.set('username', globalUsername);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

function mockApiResponse(username, platform) {
    // Mockolt logika: minden harmadik hosszra foglaltnak jelöli
    return username.length % (platform.length) === 0 ? 'taken' : 'available';
}

function checkUsername() {
    const username = textInput.value.trim();
    globalUsername = username;
    resultDiv.innerHTML = '';

    if (!username) {
        resultDiv.innerHTML = "Please, type an username!";
    } else {
        resultDiv.innerHTML = ""
        platforms.forEach(platform => {
            console.log(`Ellenőrzés: ${platform}`); // Konzolban ellenőrzés
            const status = mockApiResponse(username, platform);
            console.log(`${platform} státusz: ${status}`); // Konzolra kiírja az állapotot
            const statusText = status === 'available' ? 'Available' : 'Taken';
            const statusClass = status === 'available' ? 'available' : 'taken';
    
            const platformDiv = document.createElement('div');
            platformDiv.classList.add('platform');
            platformDiv.innerHTML = `<strong>${platform}:</strong> <span class="${statusClass}">${statusText}</span>`;
            resultDiv.appendChild(platformDiv);
        });
        updateURL();
    }
}

function applyURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('username')) {
        globalUsername = params.get('username');
        textInput.value = globalUsername;
        checkUsername();
    }
}

textInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkUsername()
    }
});

function init() {
    applyURLParams();
    updateURL();
}

=======
const platforms = ['TikTok', 'YouTube', 'Instagram', 'X (Twitter)', 'Discord'];
const textInput = document.getElementById('username')
const resultDiv = document.getElementById('result');

let globalUsername = '';

function updateURL() {
    const params = new URLSearchParams();
    params.set('username', globalUsername);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

function mockApiResponse(username, platform) {
    // Mockolt logika: minden harmadik hosszra foglaltnak jelöli
    return username.length % (platform.length) === 0 ? 'taken' : 'available';
}

function checkUsername() {
    const username = textInput.value.trim();
    globalUsername = username;
    resultDiv.innerHTML = '';

    if (!username) {
        resultDiv.innerHTML = "Please, type an username!";
    } else {
        resultDiv.innerHTML = ""
        platforms.forEach(platform => {
            console.log(`Ellenőrzés: ${platform}`); // Konzolban ellenőrzés
            const status = mockApiResponse(username, platform);
            console.log(`${platform} státusz: ${status}`); // Konzolra kiírja az állapotot
            const statusText = status === 'available' ? 'Available' : 'Taken';
            const statusClass = status === 'available' ? 'available' : 'taken';
    
            const platformDiv = document.createElement('div');
            platformDiv.classList.add('platform');
            platformDiv.innerHTML = `<strong>${platform}:</strong> <span class="${statusClass}">${statusText}</span>`;
            resultDiv.appendChild(platformDiv);
        });
        updateURL();
    }
}

function applyURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('username')) {
        globalUsername = params.get('username');
        textInput.value = globalUsername;
        checkUsername();
    }
}

textInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkUsername()
    }
});

function init() {
    applyURLParams();
    updateURL();
}

>>>>>>> 587b721ec588131d50c5a3750d3ffb446e468044
window.onload = init();