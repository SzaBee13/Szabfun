const platforms = ['TikTok', 'YouTube', 'Instagram', 'X (Twitter)'];
const textInput = document.getElementById('username')

function mockApiResponse(username, platform) {
    // Mockolt logika: minden harmadik hosszra foglaltnak jelöli
    return username.length % (platform.length) === 0 ? 'taken' : 'available';
}

function checkUsername() {
    const username = document.getElementById('username').value.trim();
    const resultDiv = document.getElementById('result');
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
    }
}

textInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkUsername()
    }
});
